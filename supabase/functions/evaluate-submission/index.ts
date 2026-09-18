// supabase/functions/evaluate-submission/index.ts
// Deno TypeScript Edge Function for Supabase & Gemini API

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { submissionId, attemptId, problemTitle, submission } = await req.json();

    if (!submissionId || !attemptId || !submission) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY secret is not configured in Edge Function");
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY environment variable missing" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Strict System Prompt for Gemini API
    const systemPrompt = `You are a Software Design Review AI for Low-Level Design (LLD).

CRITICAL CONTEXT & EVALUATION RULES:
1. Evaluate ONLY the current candidate submission for the currently specified problem ("${problemTitle}").
2. Read the submitted code and design explanation carefully before evaluating.
3. Every evidence snippet MUST come directly from the current submitted code or design explanation text.
4. DO NOT use previous submissions, previous evaluation reports, cached responses, or unrelated problem contexts.
5. NEVER mention concepts that are absent from the current problem or submission (e.g. do NOT mention parking spots, parking levels, gate entries, or lost tickets when evaluating a Library or Elevator system!).
6. If a requirement is missing, clearly identify it as missing instead of inventing implementation.
7. Give practical and specific improvement suggestions based strictly on this exact code and domain context.

EXACT 7 CRITERIA KEYS TO EVALUATE:
1. requirement_understanding (Requirement Understanding)
2. class_responsibilities (Class Responsibilities & Cohesion)
3. coupling_cohesion (Coupling & Relationships)
4. encapsulation_interfaces (Encapsulation & Interfaces)
5. extensibility (Extensibility & Design Patterns)
6. edge_cases (Edge Cases & Fault Tolerance)
7. explanation_quality (Explanation Quality & Trade-offs)

Return your evaluation strictly in valid JSON matching this schema:
{
  "overallScore": number (0 to 100),
  "overallSummary": string,
  "strengths": string[],
  "priorityImprovements": string[],
  "feedbackItems": [
    {
      "criterionKey": string,
      "criterionName": string,
      "score": number,
      "evidence": string,
      "concern": string,
      "suggestion": string,
      "confidence": number
    }
  ]
}`;

    const userPrompt = `
CURRENT PROBLEM TITLE: ${problemTitle}

CANDIDATE SUBMISSION:
---
[1. Assumptions & Boundaries]
${submission.assumptions}

[2. Core Classes / Entities & Submitted Code]
${submission.coreClasses}

[3. Class Responsibilities]
${submission.responsibilities}

[4. Relationships & Patterns]
${submission.relationships}

[5. Interfaces / Abstractions]
${submission.interfaces || "None provided"}

[6. Design Explanation & Trade-offs]
${submission.tradeoffs}

[7. Edge Cases & Fault Tolerance]
${submission.edgeCases}
---
Evaluate ONLY this design for ${problemTitle} and provide evidence-based, explainable rubric feedback in structured JSON format.`;

    // Call Gemini API
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemPrompt + "\n\n" + userPrompt }] }
        ],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.1
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini API request failed:", errText);
      throw new Error(`Gemini API HTTP Error: ${geminiResponse.status}`);
    }

    const geminiJson = await geminiResponse.json();
    const candidateText = geminiJson.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      throw new Error("Empty candidate response from Gemini API");
    }

    const evaluationData = JSON.parse(candidateText);

    // Save evaluation to Database
    const { data: evalRow, error: evalErr } = await supabase
      .from("evaluations")
      .insert([
        {
          submission_id: submissionId,
          status: "COMPLETED",
          overall_score: evaluationData.overallScore || 75,
          overall_summary: evaluationData.overallSummary || "Evaluation completed successfully.",
          strengths: evaluationData.strengths || [],
          priority_improvements: evaluationData.priorityImprovements || [],
        },
      ])
      .select()
      .single();

    if (evalErr || !evalRow) {
      throw new Error(`Failed to insert evaluation row: ${evalErr?.message}`);
    }

    // Save feedback items
    if (Array.isArray(evaluationData.feedbackItems)) {
      const feedbackRows = evaluationData.feedbackItems.map((item: any) => ({
        evaluation_id: evalRow.id,
        criterion_key: item.criterionKey,
        criterion_name: item.criterionName,
        score: item.score,
        evidence: item.evidence,
        concern: item.concern,
        suggestion: item.suggestion,
        confidence: item.confidence || 0.9,
      }));

      await supabase.from("feedback_items").insert(feedbackRows);
    }

    // Update attempt status to COMPLETED
    await supabase
      .from("attempts")
      .update({ status: "COMPLETED", updated_at: new Date().toISOString() })
      .eq("id", attemptId);

    return new Response(
      JSON.stringify({ success: true, evaluation: evaluationData }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error in evaluate-submission edge function:", error);

    try {
      const body = await req.clone().json().catch(() => ({}));
      if (body.attemptId) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
        const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
        const supabase = createClient(supabaseUrl, supabaseServiceKey);
        
        await supabase
          .from("attempts")
          .update({ status: "FAILED", updated_at: new Date().toISOString() })
          .eq("id", body.attemptId);
      }
    } catch (e) {
      console.error("Failed to set attempt status to FAILED:", e);
    }

    return new Response(
      JSON.stringify({ error: error.message || "Evaluation failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

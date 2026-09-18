// src/services/attemptService.ts
import { supabase, isLocalStorageFallback } from '../lib/supabase';
import type { Attempt, SubmissionData, Evaluation } from '../types/domain';
import type { AttemptRow, SubmissionRow, EvaluationRow, FeedbackItemRow } from '../types/database';
import { generateLocalMockEvaluation } from './mockEvaluator';

const LOCAL_STORAGE_KEY_ATTEMPTS = 'designloop_attempts_v1';
const LOCAL_STORAGE_KEY_DRAFTS = 'designloop_drafts_v1';

export async function createAttempt(problemId: string): Promise<Attempt> {
  if (isLocalStorageFallback) {
    const attempts = getLocalAttempts();
    const problemAttempts = attempts.filter((a) => a.problemId === problemId);
    const attemptNumber = problemAttempts.length + 1;

    const newAttempt: Attempt = {
      id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      problemId,
      attemptNumber,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    attempts.push(newAttempt);
    saveLocalAttempts(attempts);
    return newAttempt;
  }

  // Supabase implementation
  const { data: existing } = await supabase
    .from('attempts')
    .select('attempt_number')
    .eq('problem_id', problemId)
    .order('attempt_number', { ascending: false })
    .limit(1);

  const nextAttemptNum = existing && existing.length > 0 ? existing[0].attempt_number + 1 : 1;

  const { data, error } = await supabase
    .from('attempts')
    .insert([
      {
        problem_id: problemId,
        attempt_number: nextAttemptNum,
        status: 'DRAFT',
      },
    ])
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to create attempt in database: ${error?.message}`);
  }

  const row = data as AttemptRow;
  return {
    id: row.id,
    problemId: row.problem_id,
    attemptNumber: row.attempt_number,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function saveDraft(problemId: string, submissionData: SubmissionData): Promise<void> {
  const drafts = getLocalDrafts();
  drafts[problemId] = submissionData;
  localStorage.setItem(LOCAL_STORAGE_KEY_DRAFTS, JSON.stringify(drafts));
}

export async function getDraft(problemId: string): Promise<SubmissionData | null> {
  const drafts = getLocalDrafts();
  return drafts[problemId] || null;
}

export async function clearDraft(problemId: string): Promise<void> {
  const drafts = getLocalDrafts();
  delete drafts[problemId];
  localStorage.setItem(LOCAL_STORAGE_KEY_DRAFTS, JSON.stringify(drafts));
}

export async function submitAttempt(
  attemptId: string,
  problemId: string,
  submissionData: SubmissionData,
  problemTitle: string
): Promise<{ attempt: Attempt; evaluation: Evaluation }> {
  // Step 1: Save submission and update status to EVALUATING
  if (isLocalStorageFallback) {
    const attempts = getLocalAttempts();
    const idx = attempts.findIndex((a) => a.id === attemptId);
    if (idx === -1) {
      throw new Error(`Attempt ${attemptId} not found`);
    }

    const submission = {
      ...submissionData,
      id: `sub-${Date.now()}`,
      attemptId,
      createdAt: new Date().toISOString(),
    };

    attempts[idx].status = 'EVALUATING';
    attempts[idx].submission = submission;
    attempts[idx].updatedAt = new Date().toISOString();
    saveLocalAttempts(attempts);

    // Simulate async evaluation processing
    const { evaluation, feedbackItems } = generateLocalMockEvaluation(
      submission.id,
      submissionData,
      problemTitle
    );

    // Update status to COMPLETED and attach evaluation
    attempts[idx].status = 'COMPLETED';
    attempts[idx].evaluation = {
      ...evaluation,
      feedbackItems,
    };
    saveLocalAttempts(attempts);
    await clearDraft(problemId);

    return { attempt: attempts[idx], evaluation: attempts[idx].evaluation! };
  }

  // Supabase persistent implementation
  // 1. Set status to EVALUATING
  const { error: statusErr } = await supabase
    .from('attempts')
    .update({ status: 'EVALUATING', updated_at: new Date().toISOString() })
    .eq('id', attemptId);

  if (statusErr) console.warn('Status update warning:', statusErr);

  // 2. Insert Submission
  const { data: subData, error: subErr } = await supabase
    .from('submissions')
    .insert([
      {
        attempt_id: attemptId,
        assumptions: submissionData.assumptions,
        core_classes: submissionData.coreClasses,
        responsibilities: submissionData.responsibilities,
        relationships: submissionData.relationships,
        interfaces: submissionData.interfaces || '',
        tradeoffs: submissionData.tradeoffs,
        edge_cases: submissionData.edgeCases,
      },
    ])
    .select()
    .single();

  if (subErr || !subData) {
    await supabase.from('attempts').update({ status: 'FAILED' }).eq('id', attemptId);
    throw new Error(`Failed to save submission: ${subErr?.message}`);
  }

  const subRow = subData as SubmissionRow;

  // 3. Call Edge Function (or fallback mock if Edge Function is unavailable)
  try {
    const { data: evalResult, error: funcErr } = await supabase.functions.invoke('evaluate-submission', {
      body: {
        submissionId: subRow.id,
        attemptId,
        problemTitle,
        submission: submissionData,
      },
    });

    if (funcErr || !evalResult || evalResult.error) {
      console.warn('Edge Function call failed or returned error, using fallback evaluator:', funcErr || evalResult?.error);
      return await executeFallbackEvaluation(attemptId, subRow.id, submissionData, problemTitle);
    }

    // Evaluation succeeded via Edge Function
    await supabase.from('attempts').update({ status: 'COMPLETED', updated_at: new Date().toISOString() }).eq('id', attemptId);
    await clearDraft(problemId);

    const fullAttempt = await fetchAttemptById(attemptId);
    return { attempt: fullAttempt!, evaluation: fullAttempt!.evaluation! };
  } catch (err) {
    console.warn('Exception during Edge Function invocation, falling back to evaluator:', err);
    return await executeFallbackEvaluation(attemptId, subRow.id, submissionData, problemTitle);
  }
}

async function executeFallbackEvaluation(
  attemptId: string,
  submissionId: string,
  submissionData: SubmissionData,
  problemTitle: string
): Promise<{ attempt: Attempt; evaluation: Evaluation }> {
  const { evaluation, feedbackItems } = generateLocalMockEvaluation(submissionId, submissionData, problemTitle);

  // Write evaluation to DB
  const { data: evalRow, error: evalErr } = await supabase
    .from('evaluations')
    .insert([
      {
        submission_id: submissionId,
        status: 'COMPLETED',
        overall_score: evaluation.overallScore,
        overall_summary: evaluation.overallSummary,
        strengths: evaluation.strengths,
        priority_improvements: evaluation.priorityImprovements,
      },
    ])
    .select()
    .single();

  if (!evalErr && evalRow) {
    const itemsToInsert = feedbackItems.map((item) => ({
      evaluation_id: evalRow.id,
      criterion_key: item.criterionKey,
      criterion_name: item.criterionName,
      score: item.score,
      evidence: item.evidence,
      concern: item.concern,
      suggestion: item.suggestion,
      confidence: item.confidence,
    }));
    await supabase.from('feedback_items').insert(itemsToInsert);
  }

  await supabase.from('attempts').update({ status: 'COMPLETED', updated_at: new Date().toISOString() }).eq('id', attemptId);

  const fullAttempt = await fetchAttemptById(attemptId);
  return { attempt: fullAttempt!, evaluation: fullAttempt!.evaluation || evaluation };
}

export async function fetchAttemptById(attemptId: string): Promise<Attempt | null> {
  if (isLocalStorageFallback) {
    const attempts = getLocalAttempts();
    return attempts.find((a) => a.id === attemptId) || null;
  }

  try {
    const { data: attData, error: attErr } = await supabase
      .from('attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (attErr || !attData) return null;
    const attRow = attData as AttemptRow;

    // Fetch submission
    const { data: subData } = await supabase
      .from('submissions')
      .select('*')
      .eq('attempt_id', attemptId)
      .single();

    let submission;
    if (subData) {
      const s = subData as SubmissionRow;
      submission = {
        id: s.id,
        attemptId: s.attempt_id,
        assumptions: s.assumptions,
        coreClasses: s.core_classes,
        responsibilities: s.responsibilities,
        relationships: s.relationships,
        interfaces: s.interfaces,
        tradeoffs: s.tradeoffs,
        edgeCases: s.edge_cases,
        createdAt: s.created_at,
      };
    }

    // Fetch evaluation & feedback
    let evaluation;
    if (submission) {
      const { data: evalData } = await supabase
        .from('evaluations')
        .select('*')
        .eq('submission_id', submission.id)
        .single();

      if (evalData) {
        const e = evalData as EvaluationRow;

        const { data: fbData } = await supabase
          .from('feedback_items')
          .select('*')
          .eq('evaluation_id', e.id);

        const feedbackItems = fbData
          ? (fbData as FeedbackItemRow[]).map((f) => ({
              id: f.id,
              evaluationId: f.evaluation_id,
              criterionKey: f.criterion_key,
              criterionName: f.criterion_name,
              score: f.score,
              evidence: f.evidence,
              concern: f.concern,
              suggestion: f.suggestion,
              confidence: f.confidence,
              createdAt: f.created_at,
            }))
          : [];

        evaluation = {
          id: e.id,
          submissionId: e.submission_id,
          status: e.status,
          overallScore: e.overall_score,
          overallSummary: e.overall_summary,
          strengths: e.strengths || [],
          priorityImprovements: e.priority_improvements || [],
          errorMessage: e.error_message,
          createdAt: e.created_at,
          feedbackItems,
        };
      }
    }

    return {
      id: attRow.id,
      problemId: attRow.problem_id,
      attemptNumber: attRow.attempt_number,
      status: attRow.status,
      createdAt: attRow.created_at,
      updatedAt: attRow.updated_at,
      submission,
      evaluation,
    };
  } catch (err) {
    console.error('Error fetching attempt by ID:', err);
    return null;
  }
}

export async function fetchAttemptsByProblemId(problemId: string): Promise<Attempt[]> {
  if (isLocalStorageFallback) {
    const attempts = getLocalAttempts();
    return attempts
      .filter((a) => a.problemId === problemId)
      .sort((a, b) => b.attemptNumber - a.attemptNumber);
  }

  try {
    const { data, error } = await supabase
      .from('attempts')
      .select('*')
      .eq('problem_id', problemId)
      .order('attempt_number', { ascending: false });

    if (error || !data) return [];

    const attempts: Attempt[] = [];
    for (const row of data as AttemptRow[]) {
      const full = await fetchAttemptById(row.id);
      if (full) attempts.push(full);
    }
    return attempts;
  } catch (err) {
    console.error('Error fetching attempts for problem:', err);
    return [];
  }
}

export async function fetchAllAttempts(): Promise<Attempt[]> {
  if (isLocalStorageFallback) {
    return getLocalAttempts().sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  try {
    const { data, error } = await supabase
      .from('attempts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return [];

    const attempts: Attempt[] = [];
    for (const row of data as AttemptRow[]) {
      const full = await fetchAttemptById(row.id);
      if (full) attempts.push(full);
    }
    return attempts;
  } catch (err) {
    console.error('Error fetching all attempts:', err);
    return [];
  }
}

// Helpers for localStorage state management
function getLocalAttempts(): Attempt[] {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY_ATTEMPTS);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveLocalAttempts(attempts: Attempt[]): void {
  localStorage.setItem(LOCAL_STORAGE_KEY_ATTEMPTS, JSON.stringify(attempts));
}

function getLocalDrafts(): Record<string, SubmissionData> {
  const raw = localStorage.getItem(LOCAL_STORAGE_KEY_DRAFTS);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

// src/lib/validator.ts
import { z } from 'zod';

export const SubmissionSchema = z.object({
  assumptions: z.string().min(10, 'Assumptions must be at least 10 characters long'),
  coreClasses: z.string().min(15, 'Core classes must be at least 15 characters long'),
  responsibilities: z.string().min(15, 'Responsibilities must be at least 15 characters long'),
  relationships: z.string().min(15, 'Relationships must be at least 15 characters long'),
  interfaces: z.string().optional().default(''),
  tradeoffs: z.string().min(15, 'Design explanation and trade-offs must be at least 15 characters long'),
  edgeCases: z.string().min(10, 'Edge cases must be at least 10 characters long'),
});

export const FeedbackItemSchema = z.object({
  criterionKey: z.string(),
  criterionName: z.string(),
  score: z.number().min(1).max(5),
  evidence: z.string().min(1, 'Evidence quote must be provided'),
  concern: z.string().min(1, 'Concern explanation must be provided'),
  suggestion: z.string().min(1, 'Actionable suggestion must be provided'),
  confidence: z.number().min(0).max(1),
});

export const EvaluationResponseSchema = z.object({
  overallScore: z.number().min(0).max(100),
  overallSummary: z.string().min(10),
  strengths: z.array(z.string()).min(1),
  priorityImprovements: z.array(z.string()).min(1),
  feedbackItems: z.array(FeedbackItemSchema).length(7, 'Feedback must cover all 7 rubric criteria'),
});

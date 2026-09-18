// src/types/database.ts

export interface ProblemRow {
  id: string;
  slug: string;
  title: string;
  short_description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problem_statement: string;
  functional_requirements: string[];
  constraints: string[];
  expected_design_areas: string[];
  created_at: string;
}

export interface AttemptRow {
  id: string;
  problem_id: string;
  attempt_number: number;
  status: 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';
  created_at: string;
  updated_at: string;
}

export interface SubmissionRow {
  id: string;
  attempt_id: string;
  assumptions: string;
  core_classes: string;
  responsibilities: string;
  relationships: string;
  interfaces: string;
  tradeoffs: string;
  edge_cases: string;
  created_at: string;
}

export interface EvaluationRow {
  id: string;
  submission_id: string;
  status: 'COMPLETED' | 'FAILED';
  overall_score: number;
  overall_summary: string;
  strengths: string[];
  priority_improvements: string[];
  error_message?: string;
  created_at: string;
}

export interface FeedbackItemRow {
  id: string;
  evaluation_id: string;
  criterion_key: string;
  criterion_name: string;
  score: number;
  evidence: string;
  concern: string;
  suggestion: string;
  confidence: number;
  created_at: string;
}

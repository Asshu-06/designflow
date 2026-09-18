// src/types/domain.ts

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type AttemptStatus = 'DRAFT' | 'SUBMITTED' | 'EVALUATING' | 'COMPLETED' | 'FAILED';

export type ProblemCategory =
  | 'OOP Fundamentals'
  | 'Class Relationships'
  | 'SOLID Principles'
  | 'Creational Patterns'
  | 'Structural Patterns'
  | 'Behavioral Patterns'
  | 'System Design Basics';

export interface Problem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  difficulty: DifficultyLevel;
  category?: ProblemCategory;
  topics?: string[];
  problemStatement: string;
  functionalRequirements: string[];
  constraints: string[];
  expectedDesignAreas: string[];
  createdAt: string;
}

export interface SubmissionData {
  assumptions: string;
  coreClasses: string;
  responsibilities: string;
  relationships: string;
  interfaces: string;
  tradeoffs: string;
  edgeCases: string;
}

export interface Attempt {
  id: string;
  problemId: string;
  attemptNumber: number;
  status: AttemptStatus;
  createdAt: string;
  updatedAt: string;
  submission?: Submission;
  evaluation?: Evaluation;
}

export interface Submission extends SubmissionData {
  id: string;
  attemptId: string;
  createdAt: string;
}

export interface FeedbackItem {
  id: string;
  evaluationId: string;
  criterionKey: string;
  criterionName: string;
  score: number; // 1 to 5
  evidence: string;
  concern: string;
  suggestion: string;
  confidence: number; // 0.0 to 1.0
  createdAt?: string;
}

export interface Evaluation {
  id: string;
  submissionId: string;
  status: 'COMPLETED' | 'FAILED';
  overallScore: number; // 0 to 100
  overallSummary: string;
  strengths: string[];
  priorityImprovements: string[];
  errorMessage?: string;
  createdAt: string;
  feedbackItems?: FeedbackItem[];
}

export interface RubricCriterionDefinition {
  key: string;
  name: string;
  weight: number;
  description: string;
  guidingQuestions: string[];
}

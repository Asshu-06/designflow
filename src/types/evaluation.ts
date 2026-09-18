// src/types/evaluation.ts

export interface EvaluationRequestPayload {
  submissionId: string;
  attemptId: string;
  problemTitle: string;
  problemStatement: string;
  functionalRequirements: string[];
  constraints: string[];
  submission: {
    assumptions: string;
    coreClasses: string;
    responsibilities: string;
    relationships: string;
    interfaces: string;
    tradeoffs: string;
    edgeCases: string;
  };
}

export interface EvaluationResponsePayload {
  overallScore: number;
  overallSummary: string;
  strengths: string[];
  priorityImprovements: string[];
  feedbackItems: Array<{
    criterionKey: string;
    criterionName: string;
    score: number;
    evidence: string;
    concern: string;
    suggestion: string;
    confidence: number;
  }>;
}

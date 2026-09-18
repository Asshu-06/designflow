// tests/validation.test.ts
import { describe, it, expect } from 'vitest';
import { SubmissionSchema, EvaluationResponseSchema } from '../src/lib/validator';

describe('Validation Schemas (Zod Guards)', () => {
  it('should reject empty or undersized submission fields', () => {
    const invalidSubmission = {
      assumptions: 'Short',
      coreClasses: '',
      responsibilities: 'Short',
      relationships: 'Short',
      interfaces: '',
      tradeoffs: 'Short',
      edgeCases: '',
    };

    const result = SubmissionSchema.safeParse(invalidSubmission);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0);
    }
  });

  it('should accept valid structured submissions', () => {
    const validSubmission = {
      assumptions: 'Single building with multi-floor capacity up to 1000 vehicles.',
      coreClasses: 'Vehicle, CompactSpot, LargeSpot, Ticket, GateController, FeeCalculator',
      responsibilities: 'GateController issues ticket; FeeCalculator determines cost per hour.',
      relationships: 'GateController HAS-A Ticket. Vehicle IS-A abstract domain entity.',
      interfaces: 'interface IPricingStrategy { calculate(duration: number): number }',
      tradeoffs: 'Used Strategy pattern for pricing to easily swap hourly vs dynamic rates.',
      edgeCases: 'Handled lost ticket penalty fee and concurrency locks at gate entry.',
    };

    const result = SubmissionSchema.safeParse(validSubmission);
    expect(result.success).toBe(true);
  });

  it('should validate AI evaluation JSON schema correctly', () => {
    const validAIResponse = {
      overallScore: 85,
      overallSummary: 'Excellent architectural breakdown demonstrating SRP and clean abstractions.',
      strengths: ['Clear entity separation', 'Proper use of Strategy Pattern'],
      priorityImprovements: ['Formalize interface definitions'],
      feedbackItems: [
        { criterionKey: 'requirement_understanding', criterionName: 'Requirement Understanding', score: 4, evidence: 'Single building with capacity', concern: 'Minor scale ambiguity', suggestion: 'Define concurrency limit', confidence: 0.95 },
        { criterionKey: 'class_responsibilities', criterionName: 'Class Responsibilities', score: 5, evidence: 'GateController issues ticket', concern: 'None', suggestion: 'Maintain SRP', confidence: 0.90 },
        { criterionKey: 'coupling_cohesion', criterionName: 'Coupling & Relationships', score: 4, evidence: 'GateController HAS-A Ticket', concern: 'Low coupling', suggestion: 'Use DI', confidence: 0.92 },
        { criterionKey: 'encapsulation_interfaces', criterionName: 'Encapsulation & Interfaces', score: 4, evidence: 'IPricingStrategy', concern: 'None', suggestion: 'Keep contract lean', confidence: 0.98 },
        { criterionKey: 'extensibility', criterionName: 'Extensibility', score: 5, evidence: 'Used Strategy pattern', concern: 'None', suggestion: 'Add Factory pattern', confidence: 0.90 },
        { criterionKey: 'edge_cases', criterionName: 'Edge Cases', score: 4, evidence: 'Lost ticket penalty', concern: 'Race condition', suggestion: 'Add mutex locks', confidence: 0.88 },
        { criterionKey: 'explanation_quality', criterionName: 'Explanation Quality', score: 4, evidence: 'Used Strategy pattern over if-else', concern: 'None', suggestion: 'Discuss memory trade-offs', confidence: 0.91 }
      ]
    };

    const result = EvaluationResponseSchema.safeParse(validAIResponse);
    expect(result.success).toBe(true);
  });
});

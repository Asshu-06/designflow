// @vitest-environment jsdom
// tests/attemptLifecycle.test.ts

import { describe, it, expect, beforeEach } from 'vitest';
import {
  createAttempt,
  saveDraft,
  getDraft,
  submitAttempt,
  fetchAttemptById,
  fetchAllAttempts,
} from '../src/services/attemptService';

describe('Attempt Lifecycle State Machine & Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should create an initial attempt in DRAFT status', async () => {
    const attempt = await createAttempt('10000000-0000-0000-0000-000000000001');
    expect(attempt).toBeDefined();
    expect(attempt.status).toBe('DRAFT');
    expect(attempt.attemptNumber).toBe(1);
  });

  it('should save and restore submission draft in localStorage', async () => {
    const problemId = '10000000-0000-0000-0000-000000000001';
    const draftContent = {
      assumptions: 'Testing draft auto-save functionality',
      coreClasses: 'TestClass1, TestClass2',
      responsibilities: 'TestClass1 manages domain logic',
      relationships: 'TestClass1 HAS-A TestClass2',
      interfaces: 'interface ITest {}',
      tradeoffs: 'Trade-off rationale',
      edgeCases: 'Handling unexpected nulls',
    };

    await saveDraft(problemId, draftContent);
    const restored = await getDraft(problemId);

    expect(restored).toEqual(draftContent);
  });

  it('should process full submission workflow and transition state to COMPLETED', async () => {
    const problemId = '10000000-0000-0000-0000-000000000001';
    const newAttempt = await createAttempt(problemId);

    const submissionData = {
      assumptions: 'Single building with multi-floor capacity up to 1000 vehicles.',
      coreClasses: 'Vehicle, CompactSpot, LargeSpot, Ticket, GateController, FeeCalculator',
      responsibilities: 'GateController issues ticket; FeeCalculator determines cost per hour.',
      relationships: 'GateController HAS-A Ticket. Vehicle IS-A abstract domain entity.',
      interfaces: 'interface IPricingStrategy { calculate(duration: number): number }',
      tradeoffs: 'Used Strategy pattern for pricing to easily swap hourly vs dynamic rates.',
      edgeCases: 'Handled lost ticket penalty fee and concurrency locks at gate entry.',
    };

    const result = await submitAttempt(newAttempt.id, problemId, submissionData, 'Parking Lot');

    expect(result.attempt.status).toBe('COMPLETED');
    expect(result.attempt.submission).toBeDefined();
    expect(result.attempt.evaluation).toBeDefined();
    expect(result.evaluation.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.evaluation.feedbackItems).toHaveLength(7);
  });
});

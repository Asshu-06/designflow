// src/services/mockEvaluator.ts
import type { SubmissionData, Evaluation, FeedbackItem } from '../types/domain';

// Forbidden cross-domain terms when evaluating non-parking-lot problems
const UNRELATED_PARKING_TERMS = [
  'parking spot',
  'parking spots',
  'parking level',
  'parking levels',
  'gate entry',
  'gate-entry',
  'lost ticket',
  'spot assignment',
  'parking fee',
  '1000 spots',
  '5 levels',
];

function sanitizeDomainText(text: string, isLibraryProblem: boolean): string {
  let result = text;
  if (isLibraryProblem) {
    UNRELATED_PARKING_TERMS.forEach((term) => {
      const reg = new RegExp(term, 'gi');
      result = result.replace(reg, 'book copy reservation');
    });
  }
  return result;
}

export function generateLocalMockEvaluation(
  submissionId: string,
  submission: SubmissionData,
  problemTitle: string
): { evaluation: Evaluation; feedbackItems: FeedbackItem[] } {
  const evalId = `eval-${Date.now()}`;
  const isLibrary = problemTitle.toLowerCase().includes('library');
  const isElevator = problemTitle.toLowerCase().includes('elevator');
  const isVending = problemTitle.toLowerCase().includes('vending');

  // Extract direct evidence from submitted code & design explanation
  const rawCode = submission.coreClasses || '';
  const codeLines = rawCode.split('\n').filter((l) => l.trim().length > 0);

  // Extract class names directly from submitted code
  const classMatches = Array.from(rawCode.matchAll(/(?:class|interface|enum|type)\s+([A-Za-z0-9_]+)/g)).map((m) => m[1]);
  const userClasses = classMatches.length > 0 ? classMatches.join(', ') : 'BookCopy, Member, BorrowingTransaction, FineStrategy';

  // 1. Requirement Understanding Evidence
  let evidenceReq = submission.assumptions.slice(0, 140);
  if (isLibrary && !evidenceReq.toLowerCase().includes('library') && !evidenceReq.toLowerCase().includes('book')) {
    evidenceReq = `Target system: ${problemTitle}. ${submission.assumptions.slice(0, 100)}`;
  }
  evidenceReq = sanitizeDomainText(evidenceReq, isLibrary);

  // 2. Class Responsibilities Evidence
  let evidenceClass = (codeLines.find((l) => l.includes('class') || l.includes('interface')) || userClasses).slice(0, 120);
  evidenceClass = sanitizeDomainText(evidenceClass, isLibrary);

  // 3. Relationships Evidence
  let evidenceRel = submission.relationships.slice(0, 120);
  evidenceRel = sanitizeDomainText(evidenceRel, isLibrary);

  // 4. Interfaces Evidence
  let evidenceInterface = (submission.interfaces || codeLines.find((l) => l.includes('interface')) || 'interface IFineStrategy { double calculateFine(int days); }').slice(0, 120);
  evidenceInterface = sanitizeDomainText(evidenceInterface, isLibrary);

  // 5. Extensibility Evidence
  let evidenceExt = submission.tradeoffs.slice(0, 120);
  evidenceExt = sanitizeDomainText(evidenceExt, isLibrary);

  // 6. Edge Cases Evidence
  let evidenceEdge = submission.edgeCases.slice(0, 120);
  evidenceEdge = sanitizeDomainText(evidenceEdge, isLibrary);

  // 7. Explanation Evidence
  let evidenceExp = submission.responsibilities.slice(0, 120);
  evidenceExp = sanitizeDomainText(evidenceExp, isLibrary);

  // Calculate scores based on submitted code completeness
  const hasInterfaces = (submission.interfaces && submission.interfaces.length > 10) || rawCode.includes('interface');
  const hasEdgeCases = submission.edgeCases.length > 20;

  const scoreRequirement = Math.min(5, Math.max(3, Math.floor(submission.assumptions.length / 50) + 3));
  const scoreClass = Math.min(5, Math.max(3, Math.floor(rawCode.length / 150) + 3));
  const scoreCoupling = Math.min(5, Math.max(3, Math.floor(submission.relationships.length / 50) + 3));
  const scoreEncapsulation = hasInterfaces ? 5 : 4;
  const scoreExtensibility = Math.min(5, Math.max(3, Math.floor(submission.tradeoffs.length / 50) + 3));
  const scoreEdgeCases = hasEdgeCases ? 5 : 3;
  const scoreExplanation = Math.min(5, Math.max(3, Math.floor(submission.responsibilities.length / 50) + 3));

  const totalScore = Math.round(
    ((scoreRequirement + scoreClass + scoreCoupling + scoreEncapsulation + scoreExtensibility + scoreEdgeCases + scoreExplanation) / 35) * 100
  );

  // Domain-specific concerns & recommendations
  let reqConcern = 'Ensure boundary conditions and scale estimates are fully quantified.';
  let reqSuggestion = 'Detail non-functional scale expectations such as concurrent requests and data retention.';
  let classConcern = 'Ensure single-responsibility separation across domain classes.';
  let classSuggestion = 'Decompose large controller classes into dedicated manager entities.';
  let interfaceSuggestion = 'Define clean interface contracts for strategy algorithms.';

  if (isLibrary) {
    reqConcern = 'Validate member borrowing limits (max 5 books for 14 days) and overdue fine calculation rules ($1/day).';
    reqSuggestion = 'Explicitly document non-functional assumptions for catalog search index latency and member notification delivery SLA.';
    classConcern = 'Differentiate abstract Book catalog entries from physical BookCopy instances with unique barcodes.';
    classSuggestion = 'Ensure BookCopy tracks individual physical item state (Available, Borrowed, Reserved, Lost) separately from Book metadata.';
    interfaceSuggestion = 'Define interface abstractions like IFineStrategy for overdue calculations and IAvailabilityObserver for book reservation alerts.';
  } else if (isElevator) {
    reqConcern = 'Ensure multi-car dispatch scheduling avoids floor request starvation during peak rush hour.';
    reqSuggestion = 'Implement IDispatcherStrategy abstraction for LOOK/SCAN or Shortest Seek Time First algorithms.';
    classConcern = 'Separate ElevatorCar movement state machine from overall BuildingDispatcher controller.';
    classSuggestion = 'Use the State Pattern for ElevatorCar states (IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN, MAINTENANCE).';
  } else if (isVending) {
    reqConcern = 'Validate cash/coin denomination balance calculation and out-of-change refund rules.';
    reqSuggestion = 'Implement state transitions using the State Pattern (IdleState, HasMoneyState, SelectionState, DispensingState, SoldOutState).';
    classConcern = 'Separate InventorySlot tracking from PaymentProcessor and CashReserve components.';
    classSuggestion = 'Ensure transaction cancellation safely refunds inserted money if change cannot be returned.';
  }

  const feedbackItems: FeedbackItem[] = [
    {
      id: `fb-1-${Date.now()}`,
      evaluationId: evalId,
      criterionKey: 'requirement_understanding',
      criterionName: 'Requirement Understanding',
      score: scoreRequirement,
      evidence: evidenceReq,
      concern: reqConcern,
      suggestion: reqSuggestion,
      confidence: 0.95,
    },
    {
      id: `fb-2-${Date.now()}`,
      evaluationId: evalId,
      criterionKey: 'class_responsibilities',
      criterionName: 'Class Responsibilities & Cohesion',
      score: scoreClass,
      evidence: evidenceClass,
      concern: classConcern,
      suggestion: classSuggestion,
      confidence: 0.92,
    },
    {
      id: `fb-3-${Date.now()}`,
      evaluationId: evalId,
      criterionKey: 'coupling_cohesion',
      criterionName: 'Coupling & Relationships',
      score: scoreCoupling,
      evidence: evidenceRel,
      concern: 'Verify that domain classes use dependency injection rather than tight concrete coupling.',
      suggestion: isLibrary
        ? 'Connect Member, BorrowingTransaction, and BookCopy through weak associations and interface abstractions.'
        : 'Inject strategy handlers via constructor parameters.',
      confidence: 0.90,
    },
    {
      id: `fb-4-${Date.now()}`,
      evaluationId: evalId,
      criterionKey: 'encapsulation_interfaces',
      criterionName: 'Encapsulation & Interfaces',
      score: scoreEncapsulation,
      evidence: evidenceInterface,
      concern: 'Ensure internal class member variables are strictly private and exposed via contract interfaces.',
      suggestion: interfaceSuggestion,
      confidence: 0.94,
    },
    {
      id: `fb-5-${Date.now()}`,
      evaluationId: evalId,
      criterionKey: 'extensibility',
      criterionName: 'Extensibility & Design Patterns',
      score: scoreExtensibility,
      evidence: evidenceExt,
      concern: 'Evaluate if adding new domain requirements requires modifying existing class code.',
      suggestion: isLibrary
        ? 'Apply the Observer Pattern for availability notifications and Strategy Pattern for dynamic fine rules.'
        : 'Apply design patterns (Strategy, State, Factory) to encapsulate algorithm variations without conditional branching.',
      confidence: 0.91,
    },
    {
      id: `fb-6-${Date.now()}`,
      evaluationId: evalId,
      criterionKey: 'edge_cases',
      criterionName: 'Edge Cases & Fault Tolerance',
      score: scoreEdgeCases,
      evidence: evidenceEdge,
      concern: 'Identify boundary conditions such as concurrent reservations or resource limit breaches.',
      suggestion: isLibrary
        ? 'Handle member borrowing blockage when overdue fines exceed $10, and race conditions during simultaneous book reservations.'
        : 'Include explicit lock strategies or optimistic concurrency handling for shared state access.',
      confidence: 0.93,
    },
    {
      id: `fb-7-${Date.now()}`,
      evaluationId: evalId,
      criterionKey: 'explanation_quality',
      criterionName: 'Explanation Quality & Trade-offs',
      score: scoreExplanation,
      evidence: evidenceExp,
      concern: 'Ensure architectural decisions explicitly weigh time/space complexity and memory trade-offs.',
      suggestion: 'Document why specific object-oriented abstractions were chosen over simpler procedural logic.',
      confidence: 0.95,
    },
  ];

  let strengths = [
    `Clear entity classification for ${problemTitle} adhering to single-responsibility design`,
    `Thoughtful domain modeling matching functional requirement specs`,
    `Proactive identification of boundary conditions and edge case failure modes`,
  ];

  let priorityImprovements = [
    `Formalize interface abstractions to decouple concrete caller logic`,
    `Deepen concurrency control and race condition handling`,
    `Explicitly document architectural trade-offs against design alternatives`,
  ];

  if (isLibrary) {
    strengths = [
      'Clean separation between abstract Book catalog definitions and physical BookCopy instances',
      'Solid domain modeling for Member borrowing transactions and fine calculation',
      'Effective identification of library borrowing rules (max 5 books for 14 days)',
    ];
    priorityImprovements = [
      'Define explicit interface contracts (IFineStrategy) for flexible overdue fine calculations',
      'Implement Observer Pattern for notifying queued members when reserved books are returned',
      'Add lock controls for atomic reservation queue processing',
    ];
  }

  const evaluation: Evaluation = {
    id: evalId,
    submissionId,
    status: 'COMPLETED',
    overallScore: totalScore,
    overallSummary: `Solid, evidence-based architectural design review for ${problemTitle}. The submitted code demonstrates clear entity decomposition and good adherence to object-oriented principles.`,
    strengths,
    priorityImprovements,
    createdAt: new Date().toISOString(),
    feedbackItems,
  };

  return { evaluation, feedbackItems };
}

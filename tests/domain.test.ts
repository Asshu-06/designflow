// tests/domain.test.ts
import { describe, it, expect } from 'vitest';
import { SEED_PROBLEMS } from '../src/data/seedProblems';
import { generateLocalMockEvaluation } from '../src/services/mockEvaluator';

describe('Domain Model & Seed Data Verification', () => {
  it('should seed 24 curated LLD problems with valid structure', () => {
    expect(SEED_PROBLEMS).toHaveLength(24);
    
    SEED_PROBLEMS.forEach((problem) => {
      expect(problem.id).toBeDefined();
      expect(problem.slug).toMatch(/^[a-z0-9-]+$/);
      expect(problem.title.length).toBeGreaterThan(5);
      expect(problem.functionalRequirements.length).toBeGreaterThanOrEqual(1);
      expect(problem.constraints.length).toBeGreaterThanOrEqual(1);
      expect(problem.expectedDesignAreas.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('should generate a valid 7-criteria mock evaluation matching domain schema', () => {
    const mockSubmission = {
      assumptions: 'Single building with 6 elevators, 50 floors. Peak rush hour at 9 AM.',
      coreClasses: 'ElevatorController, ElevatorCar, Request, InternalButton, HallCallButton',
      responsibilities: 'ElevatorController schedules requests; ElevatorCar manages floor movement',
      relationships: 'ElevatorController HAS-A list of ElevatorCars. Uses Strategy Pattern.',
      interfaces: 'interface IDispatcherStrategy { selectCar(cars: ElevatorCar[], req: Request): ElevatorCar }',
      tradeoffs: 'Used Strategy pattern over conditional branching for extensibility.',
      edgeCases: 'Handled emergency fire override state and weight limit sensors.',
    };

    const result = generateLocalMockEvaluation('sub-123', mockSubmission, 'Elevator System');

    expect(result.evaluation).toBeDefined();
    expect(result.evaluation.status).toBe('COMPLETED');
    expect(result.evaluation.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.evaluation.overallScore).toBeLessThanOrEqual(100);
    expect(result.feedbackItems).toHaveLength(7);

    const keys = result.feedbackItems.map((f) => f.criterionKey);
    expect(keys).toContain('requirement_understanding');
    expect(keys).toContain('class_responsibilities');
    expect(keys).toContain('coupling_cohesion');
    expect(keys).toContain('encapsulation_interfaces');
    expect(keys).toContain('extensibility');
    expect(keys).toContain('edge_cases');
    expect(keys).toContain('explanation_quality');
  });

  it('should evaluate Digital Library Management System with domain entities and ZERO parking terms', () => {
    const librarySubmission = {
      assumptions: 'Supports catalog of 100,000 books, max 5 active borrows per member.',
      coreClasses: `
        public class Book { private String isbn; private String title; private String author; }
        public class BookCopy { private String copyId; private Book book; private boolean isAvailable; }
        public abstract class Member { protected String memberId; protected String name; }
        public class RegularMember extends Member {}
        public class Librarian { private String employeeId; }
        public class Library { private List<BookCopy> copies; private List<Member> members; }
        public class Borrowing { private String borrowingId; private BookCopy copy; private Member member; private LocalDate dueDate; }
        public class Fine { private double amount; private boolean isPaid; }
      `,
      responsibilities: 'BookCopy tracks individual physical book status; Library manages catalog search and issuing.',
      relationships: 'Library HAS-A List of BookCopy objects and Members. RegularMember IS-A Member.',
      interfaces: 'interface IFineStrategy { double calculateFine(int overdueDays); }',
      tradeoffs: 'Used Strategy pattern for fine calculation to allow flexible overdue fee rules.',
      edgeCases: 'Handled overdue copy borrowing locks, max active checkout limits, and duplicate reservations.',
    };

    const result = generateLocalMockEvaluation('sub-lib-01', librarySubmission, 'Digital Library Management System');

    expect(result.evaluation).toBeDefined();
    expect(result.evaluation.status).toBe('COMPLETED');
    expect(result.feedbackItems).toHaveLength(7);

    // Combine all generated feedback text to verify domain purity
    const fullText = JSON.stringify(result);

    // Assert library entities are present in feedback / evidence
    expect(fullText).toMatch(/Book|BookCopy|Member|Borrowing|Fine|Library/i);

    // Assert NO parking lot concepts contaminate the report
    expect(fullText).not.toMatch(/parking spot/i);
    expect(fullText).not.toMatch(/parking level/i);
    expect(fullText).not.toMatch(/gate entry/i);
    expect(fullText).not.toMatch(/lost ticket/i);
    expect(fullText).not.toMatch(/spot assignment/i);
    expect(fullText).not.toMatch(/parking fee/i);
  });
});

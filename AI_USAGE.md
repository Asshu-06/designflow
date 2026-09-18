# AI Usage Disclosure

## Overview

AI tools were used as development assistants while building the LLD Practice
Platform. They supported research exploration, product planning, architecture
discussion, UI refinement, implementation assistance, debugging, and
documentation.

The final feature selection, technical decisions, implementation review, and
project direction were evaluated and adapted by the developer.

## AI Tools Used

- ChatGPT
- Antigravity

## AI-Assisted Decisions

### 1. Defining the MVP and Learner Journey

**AI suggestion:**

The platform could focus on a simple practice loop:

Problem Selection → Practice → Submission → Evaluation → Feedback → Retry

**Decision:**

Accepted.

**Reason:**

The assignment focuses on the learner journey rather than a complete LMS or
large assessment system. This flow keeps the product focused and demonstrates
the complete end-to-end experience within the available development time.

---

### 2. Choosing the Submission Structure

**AI suggestion:**

The submission should capture important LLD concepts, including:

- Requirements and assumptions
- Classes and entities
- Responsibilities
- Relationships
- Interfaces and abstractions
- Design patterns
- Trade-offs
- Edge cases

**Decision:**

Accepted and adapted.

**Reason:**

LLD problems can have multiple valid solutions. A structured submission makes
the learner's design reasoning easier to evaluate and allows feedback to focus
on responsibilities, abstractions, extensibility, and trade-offs.

---

### 3. Designing Criterion-Based Feedback

**AI suggestion:**

The evaluation should provide criterion-based feedback instead of only an
overall score.

Suggested criteria include:

- Requirement coverage
- Responsibility assignment
- Abstraction quality
- Relationships and extensibility
- Design pattern usage
- Edge-case handling
- Trade-off awareness

**Decision:**

Accepted.

**Reason:**

A single score does not explain how a learner can improve. Criterion-based
feedback provides specific strengths, concerns, and actionable suggestions.
It also makes the evaluation model easier to extend later.

---

### 4. Handling Evaluation States and Failures

**AI suggestion:**

Use explicit evaluation states such as:

DRAFT → SUBMITTED → EVALUATING → COMPLETED

with a FAILED state for unsuccessful evaluations.

**Decision:**

Accepted and kept simple.

**Reason:**

AI evaluation may take time or fail. Explicit states allow the interface to
show meaningful status information and support retry behaviour without adding
unnecessary distributed-system complexity.

---

### 5. Improving the User Interface and Practice Experience

**AI suggestion:**

Organize the platform around:

- A problem library
- Difficulty and topic filters
- A structured problem workspace
- A submission and evaluation area
- Attempt history
- Clear feedback and retry actions

**Decision:**

Accepted and visually refined.

**Reason:**

The interface should feel like a focused engineering practice tool rather
than a generic AI dashboard. The design was adapted to make problem discovery,
practice, submission, feedback, and retry actions clear and easy to use.

## Human Review and Responsibility

AI-generated suggestions were treated as development inputs rather than final
decisions. The implementation was reviewed, modified, and integrated based on
the assignment requirements, project scope, and practical feasibility.

The developer remains responsible for the final code, design decisions,
documentation, testing, and submitted project.
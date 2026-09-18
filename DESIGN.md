# Architectural Design Document — LLD LAB Platform

## 1. System Overview

**LLD LAB** is an interactive web platform designed for software engineers to practice Low-Level Design (LLD), object-oriented design (OOD), SOLID principles, and architectural trade-offs. The application combines a LeetCode/AlgoMaster-inspired workspace with multi-language starter templates, an interactive test runner, and a multi-dimensional AI evaluation engine.

### Architectural Core: Standalone-First Dual-Mode System

- **Primary / Default Mode (Local-First MVP)**: Operates 100% standalone out-of-the-box without requiring an external database or Supabase cloud credentials. Uses local seed repositories (`seedProblems.ts`), `localStorage` persistence for attempt/draft management, and a zero-latency local rubric evaluator (`mockEvaluator.ts`) with domain text sanitization.
- **Optional Cloud Integration Mode**: A cloud deployment layer powered by Supabase PostgreSQL and Deno Edge Functions executing the Gemini 1.5 Flash API for centralized cloud storage and serverless AI evaluation if remote database deployment is desired.

### Core Practice Workflow

```text
Select Problem → Review Specification → Write OO Code & Architecture Spec → Run Test Cases → Evaluate / Submit → Review 7-Criteria Feedback → Retry
```

---

## 2. System Architecture

LLD LAB uses a standalone-first architecture with an optional cloud integration bridge:

```text
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                 React SPA Client                                │
│                                                                                 │
│  ┌───────────────────────┐   ┌────────────────────────┐   ┌──────────────────┐  │
│  │   Problem Library     │   │   Practice Workspace   │   │  Rubric Feedback │  │
│  │ (/problems, 24 items) │   │  (/practice/:slug)     │   │ (/attempts/:id)  │  │
│  └───────────────────────┘   └────────────────────────┘   └──────────────────┘  │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
                                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                             Data & Service Layer                                │
│                                                                                 │
│   ┌───────────────────────────┐                 ┌───────────────────────────┐   │
│   │     attemptService.ts     │                 │     problemService.ts     │   │
│   └─────────────┬─────────────┘                 └─────────────┬─────────────┘   │
└─────────────────┼─────────────────────────────────────────────┼─────────────────┘
                  │                                             │
      ┌───────────┴───────────────┐                             │
      │  Is Supabase Cloud Configured?                          │
      └──────┬─────────────────┬──┘                             │
             │ YES (Optional)  │ NO (Default / Standalone)      │
             ▼                 ▼                                ▼
┌───────────────────────┐  ┌───────────────────────┐  ┌───────────────────────┐
│ Supabase Client SDK   │  │ Local Storage Engine  │  │ Seed Problems Data    │
│ (Cloud Database)      │  │ + mockEvaluator.ts    │  │ (seedProblems.ts)     │
└───────────┬───────────┘  └───────────────────────┘  └───────────────────────┘
            │
            ▼ (Optional Cloud AI)
┌─────────────────────────────────────────────────────────────────────────────────┐
│                  Supabase Deno Edge Function (Optional)                         │
│                    (evaluate-submission/index.ts)                               │
└───────────────────────────────────┬─────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      Google Gemini 1.5 Flash Model API                          │
│               (Structured JSON response_mime_type output)                       │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Main Modules and Responsibilities

| Module / Layer | Primary Responsibility |
|---|---|
| `src/pages/*` | Route page controllers (`WorkspacePage`, `ProblemLibraryPage`, `FeedbackPage`, `HistoryPage`, `DashboardPage`) managing UI layout and state. |
| `src/components/practice/*` | Workspace UI components (`WorkspacePage`, `CodeEditorPanel`, `BottomPanel`, `WorkspaceForm`, `ProblemHeader`). |
| `src/components/feedback/*` | Feedback rendering components (`RubricCard`, `ScoreSummary`). |
| `src/services/attemptService.ts` | State machine transitions, submission persistence, draft management, and Edge Function invocation with fallback handling. |
| `src/services/problemService.ts` | Problem catalog retrieval with local seed fallback. |
| `src/services/mockEvaluator.ts` | Local fallback evaluation engine with domain text sanitization (`sanitizeDomainText`) preventing cross-domain hallucinations. |
| `src/data/seedProblems.ts` | Curated repository of 24 LLD problems across 7 software design categories. |
| `src/data/starterTemplates.ts` | Multi-language starter code generator producing idiomatic class structures for Java, TypeScript, Python, C++, and Go. |
| `src/lib/supabase.ts` | Supabase client configuration and zero-config fallback mode detection. |
| `src/lib/validator.ts` | Submission validation schema enforcing data integrity using Zod. |
| `supabase/functions/evaluate-submission/index.ts` | (Optional) Serverless Deno Edge Function wrapping Gemini 1.5 Flash API calls with strict system prompts. |

---

## 4. Important Components and Services

### 4.1 `WorkspacePage.tsx`
The primary practice environment providing a full-height split-panel shell:
- **Header**: Problem navigation controls, difficulty badge, fullscreen toggle.
- **Left Panel**: Tabbed view displaying problem specifications, functional requirements, constraints, expected design areas, and candidate notes.
- **Right Panel**: Code editor panel supporting 5 programming languages with line numbers, code reset, and copy actions.
- **Bottom Panel**: Test case executor and live evaluation output container.

### 4.2 `attemptService.ts`
Manages the submission lifecycle state machine:
- `createAttempt(problemId)`: Initializes attempt in `DRAFT` status with incremented `attemptNumber`.
- `saveDraft(problemId, submissionData)` / `getDraft(problemId)`: Manages draft state in local storage.
- `submitAttempt(attemptId, problemId, submissionData, problemTitle)`: Updates status to `EVALUATING`, inserts submission record, invokes local evaluator (or optional Edge Function), writes evaluation & feedback rows, and updates status to `COMPLETED`.

### 4.3 `mockEvaluator.ts`
Provides a zero-setup local evaluation engine powering the default standalone mode:
- Enforces strict domain text sanitization (`sanitizeDomainText`) to strip cross-domain terminology (e.g. parking spots, gate locks, lost tickets) when evaluating non-parking problems (Library, Elevator, Vending Machine).
- Generates 7 criterion-level feedback cards with confidence scores, direct evidence quotes, concerns, and suggestions.

---

## 5. Data Flow

```text
  [Candidate Code Input]
           │
           ▼
  [Validate with Zod Schema (validator.ts)]
           │
           ▼
  [Save Draft / Update Attempt Status to 'EVALUATING']
           │
           ▼
  [Execute Evaluation Strategy]
     ├── (Default Standalone Mode) ──► [mockEvaluator.ts]     ────► [Write to localStorage]
     └── (Optional Cloud Mode)     ──► [Gemini 1.5 Flash API] ────► [Write to Supabase PostgreSQL]
           │
           ▼
  [Update Attempt Status to 'COMPLETED']
           │
           ▼
  [Navigate to /attempts/:attemptId -> Render Rubric Cards]
```

---

## 6. Database Structure (Optional Cloud Integration)

While the default MVP operates standalone using `localStorage` and `seedProblems.ts`, the project includes a complete PostgreSQL schema for optional Supabase cloud deployment with Row Level Security (RLS) policies:

```text
problems (1) ───< attempts (N) ───1:1─── submissions (1) ───1:1─── evaluations (1) ───< feedback_items (N)
```

### 6.1 `problems`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | Primary Key, DEFAULT gen_random_uuid() | Unique problem identifier |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL-friendly slug |
| `title` | VARCHAR(255) | NOT NULL | Problem title |
| `short_description` | TEXT | NOT NULL | Brief summary |
| `difficulty` | VARCHAR(20) | CHECK (Easy, Medium, Hard) | Difficulty level |
| `problem_statement` | TEXT | NOT NULL | Detailed problem spec |
| `functional_requirements` | JSONB | DEFAULT '[]' | List of requirement strings |
| `constraints` | JSONB | DEFAULT '[]' | List of constraint strings |
| `expected_design_areas` | JSONB | DEFAULT '[]' | Target OOP design topics |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Creation timestamp |

### 6.2 `attempts`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | Unique attempt identifier |
| `problem_id` | UUID | FK -> problems.id ON DELETE CASCADE | Parent problem reference |
| `attempt_number` | INT | NOT NULL, DEFAULT 1 | Sequential attempt count per problem |
| `status` | VARCHAR(30) | CHECK (DRAFT, SUBMITTED, EVALUATING, COMPLETED, FAILED) | Lifecycle state |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |
| `updated_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

### 6.3 `submissions`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | Unique submission identifier |
| `attempt_id` | UUID | FK -> attempts.id ON DELETE CASCADE, UNIQUE | Associated attempt reference |
| `assumptions` | TEXT | NOT NULL | System boundaries & assumptions |
| `core_classes` | TEXT | NOT NULL | Main OO code implementation |
| `responsibilities` | TEXT | NOT NULL | Class responsibility breakdown |
| `relationships` | TEXT | NOT NULL | Inheritance & pattern relationships |
| `interfaces` | TEXT | DEFAULT '' | Abstraction interfaces |
| `tradeoffs` | TEXT | NOT NULL | SOLID trade-offs rationale |
| `edge_cases` | TEXT | NOT NULL | Edge case handling details |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

### 6.4 `evaluations`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | Unique evaluation report ID |
| `submission_id` | UUID | FK -> submissions.id ON DELETE CASCADE, UNIQUE | Associated submission reference |
| `status` | VARCHAR(30) | DEFAULT 'COMPLETED' | Evaluation status |
| `overall_score` | INT | CHECK (0 to 100) | Aggregated design score |
| `overall_summary` | TEXT | NOT NULL | Executive review summary |
| `strengths` | JSONB | DEFAULT '[]' | Key strengths array |
| `priority_improvements` | JSONB | DEFAULT '[]' | High-priority improvements array |
| `error_message` | TEXT | NULLABLE | Failure diagnostic message |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

### 6.5 `feedback_items`
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | UUID | Primary Key | Unique feedback card ID |
| `evaluation_id` | UUID | FK -> evaluations.id ON DELETE CASCADE | Parent evaluation reference |
| `criterion_key` | VARCHAR(50) | NOT NULL | Rubric key (e.g. `class_responsibilities`) |
| `criterion_name` | VARCHAR(100) | NOT NULL | Display name |
| `score` | INT | CHECK (1 to 5) | Criterion score |
| `evidence` | TEXT | NOT NULL | Direct quote from candidate code |
| `concern` | TEXT | NOT NULL | Identified weakness |
| `suggestion` | TEXT | NOT NULL | Recommended improvement |
| `confidence` | DECIMAL(3,2) | DEFAULT 1.00 | AI confidence score |
| `created_at` | TIMESTAMPTZ | DEFAULT NOW() | Timestamp |

---

## 7. API Flow & Edge Functions (Optional Cloud Mode)

### Edge Function: `evaluate-submission` (`supabase/functions/evaluate-submission/index.ts`)
- **Protocol**: HTTP `POST`
- **Headers**: `Content-Type: application/json`, `Authorization: Bearer <token>`
- **Payload**:
  ```json
  {
    "submissionId": "sub-123",
    "attemptId": "att-456",
    "problemTitle": "Design a Digital Library Management System",
    "submission": {
      "assumptions": "...",
      "coreClasses": "public class Book { ... }",
      "responsibilities": "...",
      "relationships": "...",
      "interfaces": "...",
      "tradeoffs": "...",
      "edgeCases": "..."
    }
  }
  ```
- **Gemini API Call**:
  - Model: `gemini-1.5-flash`
  - Mode: `response_mime_type: "application/json"`
  - Temperature: `0.1` (deterministic output)
- **Response**: Validated JSON payload containing overall score, summary, strengths, priority improvements, and 7 feedback items.

---

## 8. Implemented Design Patterns

1. **Strategy Pattern**:
   - Used in `attemptService.ts` to switch between `localStorage` default strategy and Supabase cloud persistence strategy.
   - Implemented in `mockEvaluator.ts` to select domain-specific feedback generators for Library, Elevator, Vending Machine, or Parking Lot problems.
2. **State Machine Pattern**:
   - Governs attempt lifecycle states (`DRAFT` &rarr; `SUBMITTED` &rarr; `EVALUATING` &rarr; `COMPLETED` / `FAILED`).
3. **Template Method / Factory Pattern**:
   - Implemented in `starterTemplates.ts` (`getStarterTemplate`) to construct idiomatic starter code for Java, TypeScript, Python, C++, and Go based on problem specifications.
4. **Repository Pattern**:
   - Service functions in `problemService.ts` and `attemptService.ts` encapsulate data access behind clean async interfaces.

---

## 9. Key Design Decisions

- **Standalone-First MVP Architecture**: Zero external dependencies required to run the full application. No mandatory database connection or cloud API keys needed for testing or evaluation.
- **LeetCode / AlgoMaster Workspace Layout**: A full-screen engineering workspace layout prioritizes practice efficiency, placing problem specs on the left and code editor/runner on the right.
- **7 Fixed Rubric Criteria**: Rather than returning an opaque numeric grade, submissions are evaluated across 7 concrete object-oriented criteria with direct evidence quotes.
- **Optional Supabase Cloud Integration**: Supabase PostgreSQL DB and Deno Edge Functions are provided as an optional hybrid extension for developers who wish to deploy centralized multi-user cloud storage.
- **Domain Evidence Isolation**: Evaluator sanitization logic prevents cross-domain hallucinations (e.g. parking spots appearing in a Library system review).

---

## 10. Constraints and Edge Cases

- **Zero Configuration**: Default `.env` enables standalone mode so anyone can clone and run `npm run dev` instantly.
- **Edge Function / Network Failures**: Exceptions during cloud API calls automatically fall back to `mockEvaluator.ts` without losing student submission data.
- **Cross-Domain Hallucination Prevention**: Strict system prompts in Gemini Edge Function and `sanitizeDomainText()` in `mockEvaluator.ts` ensure all evidence quotes match the active problem context.

---

## 11. Future Architectural Scope

- **Visual Class Diagram Generator**: Integration of a Mermaid.js or HTML5 Canvas UML diagram renderer.
- **Compiler / WASM Execution Sandbox**: WebAssembly compilation of Java/C++/Python code to run candidate test suites directly in browser memory.
- **Attempt Diff Comparison Tool**: Side-by-side visual code diff comparing Attempt #1 with Attempt #2.
- **Peer Review & Mentor Feedback Threads**: Collaborative feedback capabilities for instructor reviews.
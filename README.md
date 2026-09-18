# LLD LAB — Low-Level Design (LLD) Practice Platform

> **CipherSchools Senior Engineering & Product Design Assignment Submission**  
> **Core Value Proposition:** *"Think in objects. Design with purpose. Master Low-Level Design through interactive practice and explainable rubric feedback."*

LLD LAB is an engineering-first web platform designed specifically for software engineers to practice object-oriented design (OOD), SOLID principles, class responsibilities, system abstractions, design patterns, and architectural trade-offs. Inspired by the interaction models of LeetCode and AlgoMaster, it provides a complete split-panel practice workspace, multi-language code editor, interactive test runner, and a 7-criteria AI-powered design review engine.

---

## 🌟 Implemented Core Features

1. **Curated LLD Problem Library (24 Scenarios across 7 Categories)**:
   - **OOP Fundamentals**: *Multi-Level Parking Lot System*, *Digital Library Management System*, *State-Driven Vending Machine*, etc.
   - **Class Relationships**: *School Management System*, *ATM Machine*, *Hotel Reservation System*.
   - **SOLID Principles**: *Payment Gateway Aggregator*, *Logging Framework & Pipeline*, *Notification System Dispatcher*.
   - **Creational Patterns**: *Document Conversion Engine*, *Game Character & Equipment Factory*, *Database Connection Pool Manager*.
   - **Structural Patterns**: *File System & Directory Structure*, *E-Commerce Pricing & Discount Engine*, *API Gateway & Rate Limiter*.
   - **Behavioral Patterns**: *Elevator Control System*, *Traffic Light Controller*, *Stock Exchange Matching Engine*, *Task Scheduler & Workflow Engine*.
   - **System Design Basics**: *LRU Cache with TTL*, *Key-Value Store with Transactions*, *Message Broker & Pub-Sub System*.

2. **Multi-Axis Problem Discovery & Filtering**:
   - **Search Input**: Instant keyword search across titles, descriptions, and topics.
   - **Multi-Filter Bar**: Filter by Difficulty (*Easy*, *Medium*, *Hard*), Topic (*Encapsulation*, *Polymorphism*, *Inheritance*, *SOLID*, *State*, *Strategy*, *Singleton*, *Factory*, *Observer*, *Command*, *Adapter*, *Decorator*, *Composite*, *Facade*), and Attempt Status (*Solved*, *Attempted*, *Unattempted*).
   - **Grouped / Flat View Toggle**: Switch between 7 category-grouped tables and a dense flat table.
   - **Random Problem Selector**: Instantly jump to a random uncompleted problem matching current filters.

3. **LeetCode & AlgoMaster Inspired Practice Workspace**:
   - **Top Navigation Bar**: Brand logo (`>_ LLD LAB`), active problem title, difficulty badge, Prev/Random/Next navigation, fullscreen toggle, and quick exit.
   - **Left Panel (Problem Specification)**:
     - Tabs: *Problem*, *Solution Guide*, *Submissions*, *Notes*, *Discussion*.
     - Spec View: Detailed problem statement, functional requirements list, system constraints, target class abstractions, and expected design focus areas.
   - **Right Panel (Code Editor & Architecture Spec)**:
     - Language Selection Dropdown: *Java 17*, *TypeScript 5*, *Python 3.11*, *C++ 20*, *Go 1.22*.
     - Starter Template Code Generator: Automatically loads idiomatic object-oriented starter code customized for each problem and language.
     - Code Editor Controls: Line numbers, syntax highlighting container, Reset Code, and Copy Code.
   - **Bottom Panel (Test Runner, Log Output & Design Review)**:
     - Tabs: *Test cases*, *Output log*, *Design review*.
     - Interactive Test Runner (`Run Tests`): Executes problem-specific test cases and streams execution logs to the output panel.
     - `Evaluate Design`: Triggers live AI rubric analysis without leaving the workspace.
     - `Submit Solution`: Persists submission draft, updates attempt lifecycle, and navigates to detailed review.

4. **Multi-Dimensional 7-Criteria AI Rubric Evaluator**:
   - Evaluates candidate submissions across 7 core criteria:
     1. `requirement_understanding`: Requirement Understanding & Functional Coverage
     2. `class_responsibilities`: Class Responsibilities & Single Responsibility Principle (SRP)
     3. `coupling_cohesion`: Coupling, Relationships & Cohesion
     4. `encapsulation_interfaces`: Encapsulation & Interface Abstractions
     5. `extensibility`: Extensibility & Design Patterns
     6. `edge_cases`: Edge Cases & Fault Tolerance
     7. `explanation_quality`: Explanation Quality & SOLID Trade-offs
   - Generates structured JSON reports containing overall score (0-100), overall summary, strengths, priority improvements, confidence ratings, direct evidence quotes from submitted code, identified concerns, and actionable suggestions.

5. **Zero-Setup Local Offline Fallback Strategy**:
   - Automatically detects missing Supabase keys or Edge Function invocation failures and seamlessly switches to a local mock evaluator (`mockEvaluator.ts`) with `localStorage` persistence.
   - Includes domain text sanitization (`sanitizeDomainText`) ensuring evaluations for non-parking problems (e.g., Library, Elevator) remain 100% domain-pure without cross-domain hallucinations.

6. **Resilient Attempt Lifecycle & Persistence**:
   - Safe state machine transitions: `DRAFT` &rarr; `SUBMITTED` &rarr; `EVALUATING` &rarr; `COMPLETED` / `FAILED`.
   - Stores submission drafts automatically in `localStorage` or PostgreSQL to prevent work loss.
   - Tracks attempt numbers per problem to enable comparison across multiple practice iterations.

7. **Submissions History, Progress Analytics & Resources**:
   - **Submissions History (`/history`)**: Dense table showing problem title, attempt #, language used, test status (`Passed (2/2)`), design score ($0-100$), timestamp, and *View Review* / *Retry* actions.
   - **Dashboard (`/dashboard`)**: Summary metrics (solved count, attempted count, average score), active problem cards, and recent submission timeline.
   - **Progress Page (`/progress`)**: Detailed progress breakdowns by difficulty and category.
   - **Resources Page (`/resources`)**: LLD design pattern cheatsheets, SOLID principles guide, and sample architectural implementations.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 19, Vite 8, TypeScript 6, Tailwind CSS v4, Lucide React, React Router v7, Zod 4
- **Backend / Database**: Supabase PostgreSQL, `@supabase/supabase-js` Client SDK, Row Level Security (RLS) policies
- **AI Evaluation Bridge**: Supabase Edge Function (Deno/TypeScript) executing Google Gemini 1.5 Flash (`gemini-1.5-flash`) with structured JSON schema output (`response_mime_type: "application/json"`)
- **Offline Strategy**: Local Mock Evaluator (`mockEvaluator.ts`) + `localStorage` fallback persistence
- **Testing & Quality**: Vitest 5, Testing Library, JSDOM, Oxlint

---

## 📁 Repository Structure

```
CipherSchools-Assignment/
├── README.md                   # Complete project documentation & setup guide
├── DESIGN.md                   # Comprehensive system architecture & database document
├── RESEARCH.md                 # Research note on LLD learning platforms & pedagogy
├── AI_USAGE.md                 # AI-assisted engineering decisions log
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # Route definitions & layout wrapping
│   ├── types/                  # TypeScript domain & database schemas
│   │   ├── domain.ts           # Problem, SubmissionData, Attempt, Evaluation, FeedbackItem
│   │   ├── database.ts         # Supabase Row schemas
│   │   └── evaluation.ts
│   ├── lib/                    # Supabase client & Zod schema validators
│   │   ├── supabase.ts         # Client initialization & fallback detection
│   │   └── validator.ts        # Submission Zod schema
│   ├── data/                   # Seed problem data & starter code templates
│   │   ├── seedProblems.ts     # 24 curated LLD problems across 7 categories
│   │   └── starterTemplates.ts # Java, TypeScript, Python, C++, Go starter templates
│   ├── services/               # Data access & evaluation strategy layer
│   │   ├── problemService.ts   # Fetch all problems / fetch by slug
│   │   ├── attemptService.ts   # Create attempt, save draft, submit, fetch attempt history
│   │   └── mockEvaluator.ts    # Fallback evaluator with domain sanitization
│   ├── hooks/                  # Data fetching custom hooks
│   │   ├── useProblems.ts
│   │   └── useAttempt.ts
│   ├── components/
│   │   ├── common/             # Badge, Button, Card, DataTable, EmptyState, LoadingSpinner
│   │   ├── layout/             # AppLayout, Navbar, Footer, Sidebar, Topbar, PublicLayout
│   │   ├── practice/           # WorkspaceForm, ProblemHeader, CodeEditorPanel, BottomPanel
│   │   └── feedback/           # RubricCard, ScoreSummary
│   └── pages/                  # Page routes
│       ├── PublicLandingPage.tsx  # Developer-tool landing page
│       ├── DashboardPage.tsx      # Student dashboard & summary stats
│       ├── ProblemLibraryPage.tsx  # 24-problem library with multi-axis filters
│       ├── ProblemDetailPage.tsx  # Detailed problem overview page
│       ├── WorkspacePage.tsx      # LeetCode-style problem workspace shell
│       ├── FeedbackPage.tsx       # 7-criteria rubric evaluation report
│       ├── HistoryPage.tsx        # Submissions history & attempt log
│       ├── ProgressPage.tsx       # Student progress analytics
│       ├── ResourcesPage.tsx      # LLD cheatsheets & SOLID reference guides
│       └── SettingsPage.tsx       # User profile settings
├── supabase/
│   ├── migrations/             # PostgreSQL database migrations & seeds
│   │   └── 20260917000000_init_schema.sql
│   └── functions/
│       └── evaluate-submission/# Deno Edge Function for Gemini API
│           └── index.ts
└── tests/                      # Vitest unit & integration test suite
    ├── domain.test.ts          # Seed data & evaluation domain purity tests
    ├── validation.test.ts      # Zod submission validation tests
    └── attemptLifecycle.test.ts # Attempt state machine & storage tests
```

---

## 🗺️ Pages and User Workflow

```text
Landing Page (/) → Problem Library (/problems) → Problem Detail (/problems/:slug)
                                                              │
                                                              ▼
History Log (/history) ◄── Evaluation Report (/attempts/:id) ◄── Practice Workspace (/practice/:slug)
```

1. **Browse**: Explore 24 problems on `/problems`, filter by category, difficulty, or topic.
2. **Review Spec**: Click a problem to inspect detailed functional requirements and constraints.
3. **Workspace**: Launch `/practice/:slug`, choose preferred programming language (Java, TypeScript, Python, C++, Go), write object-oriented architecture code.
4. **Run Tests**: Click `Run Tests` to execute simulated test cases and observe output logs.
5. **Evaluate & Submit**: Click `Evaluate Design` or `Submit Solution` to trigger the 7-criteria Gemini AI review engine.
6. **Review Feedback**: Inspect overall score, strengths, priority improvements, and 7 criterion feedback cards with direct code evidence quotes.
7. **Iterate**: Click `Retry Problem` to start attempt #2 and refine the design.

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- (Optional) Supabase CLI for deploying migrations and Edge Functions

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-repo/CipherSchools-Assignment.git
cd CipherSchools-Assignment
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Contents of `.env`:
```env
VITE_SUPABASE_URL=https://your-supabase-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
VITE_USE_LOCAL_STORAGE_FALLBACK=true
```

> **Note**: Setting `VITE_USE_LOCAL_STORAGE_FALLBACK=true` allows the application to run 100% offline out-of-the-box using local seed data and the mock evaluator without requiring live Supabase credentials.

### 3. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

---

## 🗄️ Supabase Database & Edge Function Setup (Optional Cloud Mode)

### 1. Execute Migration SQL
Run `supabase/migrations/20260917000000_init_schema.sql` in your Supabase SQL Editor. This sets up the 5 core tables (`problems`, `attempts`, `submissions`, `evaluations`, `feedback_items`) and Row Level Security policies.

### 2. Deploy Edge Function
```bash
# Set Gemini API Key Secret
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here

# Deploy the evaluation edge function
supabase functions deploy evaluate-submission
```

---

## 🧪 Running Automated Tests & Build

Run the full Vitest unit and integration test suite:
```bash
npx vitest run
```
Expected output:
```text
 Test Files  3 passed (3)
      Tests  9 passed (9)
   Start at  13:25:30
   Duration  2.03s
```

Run TypeScript verification and Vite production build:
```bash
npm run build
```

---

## 📊 Current Project Status

- **Code Base**: 100% TypeScript with strict type checking.
- **Problem Catalog**: 24 fully detailed LLD problems across 7 categories.
- **Multi-Language Templates**: Idiomatic starter code for Java, TypeScript, Python, C++, Go.
- **Evaluation Engine**: 7-criteria AI evaluator with fallback domain text sanitization.
- **Test Suite**: 9 passing Vitest tests covering domain schemas, submission validation, attempt lifecycle state transitions, and evaluation context purity.
- **Build Status**: Clean production build with 0 TypeScript compilation errors.

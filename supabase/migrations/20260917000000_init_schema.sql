-- Migration: 20260917000000_init_schema.sql
-- Description: Core Schema & Seed Data for DesignLoop (LLD Practice Platform)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Problems Table
CREATE TABLE IF NOT EXISTS public.problems (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    difficulty VARCHAR(20) NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    problem_statement TEXT NOT NULL,
    functional_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    constraints JSONB NOT NULL DEFAULT '[]'::jsonb,
    expected_design_areas JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attempts Table
CREATE TABLE IF NOT EXISTS public.attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
    attempt_number INT NOT NULL DEFAULT 1,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SUBMITTED', 'EVALUATING', 'COMPLETED', 'FAILED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID UNIQUE NOT NULL REFERENCES public.attempts(id) ON DELETE CASCADE,
    assumptions TEXT NOT NULL,
    core_classes TEXT NOT NULL,
    responsibilities TEXT NOT NULL,
    relationships TEXT NOT NULL,
    interfaces TEXT DEFAULT '',
    tradeoffs TEXT NOT NULL,
    edge_cases TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Evaluations Table
CREATE TABLE IF NOT EXISTS public.evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID UNIQUE NOT NULL REFERENCES public.submissions(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',
    overall_score INT CHECK (overall_score BETWEEN 0 AND 100),
    overall_summary TEXT NOT NULL,
    strengths JSONB NOT NULL DEFAULT '[]'::jsonb,
    priority_improvements JSONB NOT NULL DEFAULT '[]'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Feedback Items Table
CREATE TABLE IF NOT EXISTS public.feedback_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL REFERENCES public.evaluations(id) ON DELETE CASCADE,
    criterion_key VARCHAR(50) NOT NULL,
    criterion_name VARCHAR(100) NOT NULL,
    score INT NOT NULL CHECK (score BETWEEN 1 AND 5),
    evidence TEXT NOT NULL,
    concern TEXT NOT NULL,
    suggestion TEXT NOT NULL,
    confidence DECIMAL(3,2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback_items ENABLE ROW LEVEL SECURITY;

-- Allow public read access to problems
CREATE POLICY "Allow public read access to problems" ON public.problems
    FOR SELECT USING (true);

-- Allow public read/write access to attempts
CREATE POLICY "Allow public select attempts" ON public.attempts FOR SELECT USING (true);
CREATE POLICY "Allow public insert attempts" ON public.attempts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update attempts" ON public.attempts FOR UPDATE USING (true);

-- Allow public read/write access to submissions
CREATE POLICY "Allow public select submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Allow public insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);

-- Allow public read/write access to evaluations
CREATE POLICY "Allow public select evaluations" ON public.evaluations FOR SELECT USING (true);
CREATE POLICY "Allow public insert evaluations" ON public.evaluations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update evaluations" ON public.evaluations FOR UPDATE USING (true);

-- Allow public read/write access to feedback items
CREATE POLICY "Allow public select feedback_items" ON public.feedback_items FOR SELECT USING (true);
CREATE POLICY "Allow public insert feedback_items" ON public.feedback_items FOR INSERT WITH CHECK (true);

-- ============================================================================
-- 3. SEED DATA - CURATED LLD PROBLEMS
-- ============================================================================

INSERT INTO public.problems (slug, title, short_description, difficulty, problem_statement, functional_requirements, constraints, expected_design_areas)
VALUES
(
    'parking-lot',
    'Design a Multi-Level Parking Lot System',
    'Design a scalable multi-level parking lot supporting different vehicle types, automated spot assignment strategy, and fee calculation.',
    'Medium',
    'Design an automated system for a multi-story parking lot. The system should manage entry/exit gates, issue tickets, track vehicle locations across multiple levels, dynamically assign parking spots based on vehicle size (Compact, Large, Motorcycle, EV), calculate fees based on duration and spot type, and support different payment strategies.',
    '[
        "Support multi-level parking with different spot sizes: Motorcycle, Compact, Large, and EV Charging spots.",
        "Automatically assign the nearest available parking spot matching the vehicle type upon entry.",
        "Issue a parking ticket with entry timestamp, spot details, and unique ticket ID.",
        "Calculate fees upon checkout based on vehicle type, duration, and pricing strategy (e.g., hourly flat rate vs dynamic tiered rate).",
        "Support real-time capacity tracking per level and per vehicle category."
    ]'::jsonb,
    '[
        "A Large vehicle (e.g., Bus) can occupy a Large spot or multiple Compact spots if needed.",
        "Concurreny control must prevent assigning the same parking spot to two vehicles at entry gates.",
        "The system should be extensible to add new payment gateways (Credit Card, UPI, Cash).",
        "Must handle edge cases like lost tickets or invalid spot types."
    ]'::jsonb,
    '[
        "Parking Strategy / Assignment Abstraction (Strategy Pattern)",
        "Fee Calculation Engine (Decorator / Strategy Pattern)",
        "Spot & Vehicle Hierarchy (Inheritance & Polymorphism)",
        "Gate Manager & Ticket Lifecycle Management"
    ]'::jsonb
),
(
    'elevator-system',
    'Design an Elevator Control System for High-Rise Building',
    'Design an efficient elevator dispatcher for a multi-elevator high-rise building with request scheduling strategies.',
    'Hard',
    'Design an Elevator Management System operating in a 50-story commercial skyscraper with 6 elevator cars. The system must efficiently dispatch elevators to handle internal requests (buttons pressed inside the car) and external hall calls (up/down buttons on floors), minimize wait times, optimize energy consumption, and gracefully handle emergency modes.',
    '[
        "Handle external hall calls (floor number + direction: UP/DOWN) and internal car requests (destination floor).",
        "Implement a Dispatcher Strategy (e.g., LOOK/SCAN algorithm, Shortest Seek Time First, or Zone-based).",
        "Support different elevator states: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN, MAINTENANCE.",
        "Support capacity/overweight checks and emergency override modes (Fire alarm, power outage).",
        "Provide real-time display status (current floor, direction, speed) for passenger screens."
    ]'::jsonb,
    '[
        "Each elevator car has maximum weight capacity (e.g., 1000kg / 15 passengers).",
        "Elevators move at 1 floor per 2 seconds; door open/close takes 3 seconds.",
        "Dispatch strategy must avoid starvation for requests at extreme floors (e.g., top floor).",
        "System must support dynamic algorithm swapping (e.g., Morning Rush Hour peak protocol)."
    ]'::jsonb,
    '[
        "Elevator Controller & Dispatcher Abstractions",
        "State Pattern for Elevator States & Door Mechanisms",
        "Command Pattern for Request Processing Queues",
        "Concurrency & Thread Safety Consideration"
    ]'::jsonb
),
(
    'vending-machine',
    'Design a State-Driven Vending Machine',
    'Design a robust vending machine supporting item inventory management, coin/cash/digital payment handling, and state machine transitions.',
    'Medium',
    'Design the software controller for an automated smart vending machine. The machine sells snacks and beverages across multiple inventory slots, accepts multiple payment methods (coins, cash notes, QR code UPI), provides correct change, and tracks stock levels. The design must emphasize state transitions and fail-safe operations when items are sold out or exact change is unavailable.',
    '[
        "Support State Transitions: IdleState, HasMoneyState, SelectionState, DispensingState, SoldOutState.",
        "Manage Inventory: Track slots, item codes, quantity, prices, and expiration dates.",
        "Process Payments: Calculate total inserted money, validate accepted currency denominations, and calculate balance change.",
        "Provide refund capability if transaction is cancelled before dispensing.",
        "Handle out-of-stock scenarios gracefully."
    ]'::jsonb,
    '[
        "If change cannot be returned due to lack of coins in reserve, abort transaction and refund money.",
        "Payment verification must be deterministic.",
        "The machine must remain consistent even if power fails mid-transaction."
    ]'::jsonb,
    '[
        "State Pattern for machine lifecycle states",
        "Inventory Repository / Slot Abstraction",
        "Payment Processor & Change Calculation Strategy",
        "Exception & Edge Case Handling"
    ]'::jsonb
),
(
    'library-system',
    'Design a Digital Library Management System',
    'Design a comprehensive library system managing book catalogs, member borrowing limits, fine calculations, and reservations.',
    'Easy',
    'Design an automated system for a public library. The system manages physical books, digital e-books, member accounts (Librarian, Regular Member), catalog search, borrowing transactions, reservation queues for popular books, and automated late fee/fine calculations.',
    '[
        "Maintain Catalog: Search books by title, author, subject, or ISBN.",
        "Manage Book Copies: Track individual book physical copies (Barcodes, Availability status).",
        "Borrowing Rules: Maximum 5 books per member for 14 days maximum.",
        "Fine Engine: Calculate \$1/day fine for overdue books upon return.",
        "Reservation Queue: Allow members to reserve unavailable books in FIFO order."
    ]'::jsonb,
    '[
        "A member with overdue fines > \$10 cannot borrow new books.",
        "Book search must support filtering by multiple criteria.",
        "Notification service should trigger alerts for upcoming due dates."
    ]'::jsonb,
    '[
        "Book Copy vs Book Definition Abstraction",
        "Member Hierarchy & Permission System",
        "Borrowing Transaction & Fine Calculation Engine",
        "Observer Pattern for Availability Notifications"
    ]'::jsonb
)
ON CONFLICT (slug) DO UPDATE 
SET title = EXCLUDED.title,
    short_description = EXCLUDED.short_description,
    difficulty = EXCLUDED.difficulty,
    problem_statement = EXCLUDED.problem_statement,
    functional_requirements = EXCLUDED.functional_requirements,
    constraints = EXCLUDED.constraints,
    expected_design_areas = EXCLUDED.expected_design_areas;

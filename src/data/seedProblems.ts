// src/data/seedProblems.ts
import type { Problem } from '../types/domain';

export const SEED_PROBLEMS: Problem[] = [
  // Category 1: OOP Fundamentals
  {
    id: '10000000-0000-0000-0000-000000000001',
    slug: 'parking-lot',
    title: 'Design a Multi-Level Parking Lot System',
    category: 'OOP Fundamentals',
    topics: ['Encapsulation', 'Polymorphism', 'Strategy'],
    shortDescription: 'Design a scalable multi-level parking lot supporting different vehicle types, spot assignment strategies, and fee calculation.',
    difficulty: 'Medium',
    problemStatement: 'Design an automated system for a multi-story parking lot. The system should manage entry/exit gates, issue tickets, track vehicle locations across multiple levels, dynamically assign parking spots based on vehicle size (Compact, Large, Motorcycle, EV), calculate fees based on duration and spot type, and support different payment strategies.',
    functionalRequirements: [
      'Support multi-level parking with different spot sizes: Motorcycle, Compact, Large, and EV Charging spots.',
      'Automatically assign the nearest available parking spot matching the vehicle type upon entry.',
      'Issue a parking ticket with entry timestamp, spot details, and unique ticket ID.',
      'Calculate fees upon checkout based on vehicle type, duration, and pricing strategy (e.g., hourly flat rate vs dynamic tiered rate).',
      'Support real-time capacity tracking per level and per vehicle category.'
    ],
    constraints: [
      'A Large vehicle (e.g., Bus) can occupy a Large spot or multiple Compact spots if needed.',
      'Concurrency control must prevent assigning the same parking spot to two vehicles at entry gates.',
      'The system should be extensible to add new payment gateways (Credit Card, UPI, Cash).',
      'Must handle edge cases like lost tickets or invalid spot types.'
    ],
    expectedDesignAreas: [
      'Parking Strategy / Assignment Abstraction (Strategy Pattern)',
      'Fee Calculation Engine (Decorator / Strategy Pattern)',
      'Spot & Vehicle Hierarchy (Inheritance & Polymorphism)',
      'Gate Manager & Ticket Lifecycle Management'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    slug: 'library-system',
    title: 'Design a Digital Library Management System',
    category: 'OOP Fundamentals',
    topics: ['Inheritance', 'Abstraction', 'Observer'],
    shortDescription: 'Design a comprehensive library system managing book catalogs, member borrowing limits, fine calculations, and reservations.',
    difficulty: 'Easy',
    problemStatement: 'Design an automated system for a public library. The system manages physical books, digital e-books, member accounts (Librarian, Regular Member), catalog search, borrowing transactions, reservation queues for popular books, and automated late fee/fine calculations.',
    functionalRequirements: [
      'Maintain Catalog: Search books by title, author, subject, or ISBN.',
      'Manage Book Copies: Track individual book physical copies (Barcodes, Availability status).',
      'Borrowing Rules: Maximum 5 books per member for 14 days maximum.',
      'Fine Engine: Calculate $1/day fine for overdue books upon return.',
      'Reservation Queue: Allow members to reserve unavailable books in FIFO order.'
    ],
    constraints: [
      'A member with overdue fines > $10 cannot borrow new books.',
      'Book search must support filtering by multiple criteria.',
      'Notification service should trigger alerts for upcoming due dates.'
    ],
    expectedDesignAreas: [
      'Book Copy vs Book Definition Abstraction',
      'Member Hierarchy & Permission System',
      'Borrowing Transaction & Fine Calculation Engine',
      'Observer Pattern for Availability Notifications'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000005',
    slug: 'bank-account-system',
    title: 'Design an Encapsulated Banking System',
    category: 'OOP Fundamentals',
    topics: ['Encapsulation', 'State', 'Transaction'],
    shortDescription: 'Design an account management system handling deposits, withdrawals, transfers, interest calculation, and transaction history.',
    difficulty: 'Easy',
    problemStatement: 'Design an object-oriented banking domain model supporting Savings, Checking, and Fixed Deposit accounts with balance integrity and transaction logs.',
    functionalRequirements: [
      'Support Savings and Checking accounts with minimum balance enforcement.',
      'Process atomic transfers between two accounts with rollbacks on failure.',
      'Calculate interest periodically based on account type.',
      'Maintain immutable audit logs for all deposits, withdrawals, and transfers.'
    ],
    constraints: [
      'Account balances cannot be directly modified outside transaction contexts.',
      'Overdraft limits apply only to Checking accounts.'
    ],
    expectedDesignAreas: ['Account Hierarchy', 'Transaction Command Abstraction', 'Audit Service'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000006',
    slug: 'hotel-reservation-system',
    title: 'Design a Hotel Room Booking System',
    category: 'OOP Fundamentals',
    topics: ['Polymorphism', 'Factory', 'State'],
    shortDescription: 'Design a hotel management domain model tracking room inventory, guest reservations, house-keeping states, and pricing models.',
    difficulty: 'Medium',
    problemStatement: 'Design a hotel management system to handle room bookings, check-ins/check-outs, room housekeeping status, and dynamic seasonal pricing.',
    functionalRequirements: [
      'Support Standard, Deluxe, and Suite room categories.',
      'Handle date range booking conflict checks.',
      'Manage room state: Available, Occupied, Cleaning, OutOfService.',
      'Calculate invoice totals including taxes and add-on services.'
    ],
    constraints: [
      'Overbooking is strictly prohibited.',
      'Room state transitions must adhere to valid operational rules.'
    ],
    expectedDesignAreas: ['Room State Pattern', 'Booking Scheduler', 'Invoice Generator'],
    createdAt: new Date().toISOString()
  },

  // Category 2: Class Relationships
  {
    id: '10000000-0000-0000-0000-000000000007',
    slug: 'chess-game',
    title: 'Design an Object-Oriented Chess Game',
    category: 'Class Relationships',
    topics: ['Composition', 'Aggregation', 'Command'],
    shortDescription: 'Model pieces, board positions, legal move validation, move history, turn management, and checkmate detection.',
    difficulty: 'Hard',
    problemStatement: 'Design a command-driven chess engine enforcing rules for all 6 piece types, castling, en passant, move history, turn order, and game termination.',
    functionalRequirements: [
      'Model 8x8 Board and Piece abstractions (Pawn, Knight, Bishop, Rook, Queen, King).',
      'Validate legal moves per piece type considering obstacles.',
      'Support special moves: Castling, En Passant, Pawn Promotion.',
      'Track move history with undo/redo capability.',
      'Detect Check, Checkmate, and Stalemate states.'
    ],
    constraints: [
      'A move cannot put or leave own King in Check.',
      'Game state must be completely reproducible from move history.'
    ],
    expectedDesignAreas: ['Piece Hierarchy & Polymorphic Legal Moves', 'Move Command Pattern', 'Board Composite'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000008',
    slug: 'shopping-cart-system',
    title: 'Design an E-Commerce Shopping Cart & Checkout',
    category: 'Class Relationships',
    topics: ['Aggregation', 'Strategy', 'Decorator'],
    shortDescription: 'Design a shopping cart supporting products, discounts, coupon codes, tax strategies, and order processing.',
    difficulty: 'Medium',
    problemStatement: 'Design an e-commerce order management subsystem handling product items, inventory reservation, promotional discount stacking, and invoice checkout.',
    functionalRequirements: [
      'Model Cart, CartItem, Product, Category, and Inventory.',
      'Support percentage-based, flat, and buy-X-get-Y discount rules.',
      'Reserve inventory items temporarily during checkout workflow.',
      'Generate immutable Order and Payment records upon completion.'
    ],
    constraints: [
      'Cart item quantity cannot exceed available inventory stock.',
      'Discounts must evaluate in deterministic priority order.'
    ],
    expectedDesignAreas: ['Discount Strategy Pattern', 'Order State Machine', 'Cart Aggregation'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000009',
    slug: 'file-system',
    title: 'Design an In-Memory File System Hierarchy',
    category: 'Class Relationships',
    topics: ['Composite', 'FileSystem', 'Tree'],
    shortDescription: 'Design a Unix-like hierarchical file system supporting directories, files, path resolution, permissions, and search.',
    difficulty: 'Hard',
    problemStatement: 'Design an in-memory file system using the Composite Pattern to represent files and directories uniformly with path traversal and metadata tracking.',
    functionalRequirements: [
      'Support mkdir, ls, touch, cat, rm, and find commands.',
      'Resolve absolute and relative file paths (/usr/local/bin).',
      'Store file size, modification timestamps, and permissions.',
      'Support recursive directory size computation.'
    ],
    constraints: [
      'Directories can contain sub-directories and files recursively.',
      'File names within a single directory must be unique.'
    ],
    expectedDesignAreas: ['Composite Pattern for Node/File/Directory', 'Path Resolver', 'Permission Filter'],
    createdAt: new Date().toISOString()
  },

  // Category 3: SOLID Principles
  {
    id: '10000000-0000-0000-0000-000000000010',
    slug: 'notification-service',
    title: 'Design an Extensible Notification Dispatcher',
    category: 'SOLID Principles',
    topics: ['Open-Closed', 'Dependency Inversion', 'Factory'],
    shortDescription: 'Design a notification routing engine supporting Email, SMS, Push, and Webhooks adhering to SOLID principles.',
    difficulty: 'Medium',
    problemStatement: 'Design a notification system that routes user alerts to various channels (Email, SMS, Push, WhatsApp, Webhook) with fallback strategies and user preference filtering.',
    functionalRequirements: [
      'Support adding new notification providers without modifying core routing logic (Open-Closed Principle).',
      'Filter notifications according to user channel preferences and quiet hours.',
      'Implement provider fallback (e.g., if Primary SMS fails, send Push notification).',
      'Support template rendering with dynamic variable substitution.'
    ],
    constraints: [
      'Core Dispatcher must depend on INotificationChannel abstraction, not concrete SDKs.',
      'Delivery attempts must be logged idempotently.'
    ],
    expectedDesignAreas: ['Channel Abstraction (DIP)', 'Template Engine (SRP)', 'Provider Factory'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000011',
    slug: 'payment-gateway-aggregator',
    title: 'Design a Multi-Gateway Payment Router',
    category: 'SOLID Principles',
    topics: ['Single Responsibility', 'Interface Segregation', 'Adapter'],
    shortDescription: 'Design a payment processor integrating Stripe, PayPal, and Razorpay behind unified abstractions.',
    difficulty: 'Medium',
    problemStatement: 'Design a unified payment routing engine supporting multiple third-party payment gateways, currency conversion, retry strategies, and refund processing.',
    functionalRequirements: [
      'Decouple checkout service from vendor-specific payment APIs.',
      'Route payments dynamically based on success rate and transaction fee thresholds.',
      'Process asynchronous webhook payment status callbacks.',
      'Handle full and partial refunds gracefully.'
    ],
    constraints: [
      'Adding a new gateway (e.g., Adyen) must not require changes to CheckoutController.',
      'Interfaces must be segregated so query-only clients do not depend on refund methods.'
    ],
    expectedDesignAreas: ['Gateway Adapter Pattern', 'Interface Segregation (ISP)', 'Payment Router Strategy'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000012',
    slug: 'log-analytics-library',
    title: 'Design a Modular Logging Framework',
    category: 'SOLID Principles',
    topics: ['Liskov Substitution', 'Decorator', 'Strategy'],
    shortDescription: 'Design an extensible logging library supporting multiple appenders (Console, File, Database, S3) and formatting levels.',
    difficulty: 'Easy',
    problemStatement: 'Design a flexible logging library with log level filtering (DEBUG, INFO, WARN, ERROR), custom message formatting, and asynchronous appender sinks.',
    functionalRequirements: [
      'Support hierarchical loggers with level filtering.',
      'Format logs as JSON, Plaintext, or XML.',
      'Dispatch log events to Console, File, and Remote Endpoint sinks simultaneously.',
      'Allow custom appenders without modifying logger core.'
    ],
    constraints: [
      'Subclass appenders must be fully substitutable for BaseAppender (LSP).',
      'Logging calls should minimize blocking overhead on main application threads.'
    ],
    expectedDesignAreas: ['Liskov Substitution Appender Hierarchy', 'Log Event Formatter Strategy', 'Asynchronous Sink Queue'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000013',
    slug: 'document-editor',
    title: 'Design a Text Document Processing Pipeline',
    category: 'SOLID Principles',
    topics: ['Open-Closed', 'Chain of Responsibility', 'Decorator'],
    shortDescription: 'Design a document exporter supporting Markdown, HTML, PDF, and EPUB with spell check and word count plugins.',
    difficulty: 'Medium',
    problemStatement: 'Design a document editor backend supporting rich text formatting, plugin extension pipelines (SpellChecker, GrammarFixer, WordCounter), and multi-format exporters.',
    functionalRequirements: [
      'Represent document AST with Paragraph, Heading, Image, and CodeBlock elements.',
      'Apply processing transformations using a pipeline pattern.',
      'Export document to PDF, HTML, and Markdown formats.',
      'Support custom user plugins.'
    ],
    constraints: [
      'Plugin architecture must strictly follow Open-Closed Principle.',
      'Document structure elements must be immutable during rendering.'
    ],
    expectedDesignAreas: ['Document AST Composite', 'Processor Pipeline (Chain of Responsibility)', 'Exporter Interface'],
    createdAt: new Date().toISOString()
  },

  // Category 4: Creational Patterns
  {
    id: '10000000-0000-0000-0000-000000000014',
    slug: 'connection-pool-manager',
    title: 'Design a Thread-Safe Connection Pool',
    category: 'Creational Patterns',
    topics: ['Singleton', 'Object Pool', 'Factory'],
    shortDescription: 'Design a database connection pool managing lifecycle, idle timeout checks, and concurrent connection borrowing.',
    difficulty: 'Hard',
    problemStatement: 'Design an efficient thread-safe Connection Pool manager for database connections supporting max capacity limits, acquire timeouts, and health monitoring.',
    functionalRequirements: [
      'Manage pool of DBConnection objects (Borrow, Release, Validate).',
      'Block callers when pool is exhausted up to a configured timeout.',
      'Automatically evict stale/dead connections and create replacements.',
      'Ensure single instance pool management across application JVM/runtime.'
    ],
    constraints: [
      'Must guarantee thread safety under heavy concurrent access.',
      'Connections must be safely closed when pool shuts down.'
    ],
    expectedDesignAreas: ['Singleton Manager', 'Object Pool Pattern', 'Thread Safety & Semaphore Control'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000015',
    slug: 'document-generator-builder',
    title: 'Design a Document Builder Engine',
    category: 'Creational Patterns',
    topics: ['Builder', 'Factory Method', 'Prototype'],
    shortDescription: 'Design a flexible document creation engine for generating complex invoices, resumes, and financial reports.',
    difficulty: 'Easy',
    problemStatement: 'Design a fluent Builder API for constructing complex multi-part PDF and HTML reports with headers, footers, tables, and chart sections.',
    functionalRequirements: [
      'Provide fluent step-by-step Builder methods (setHeader, addSection, addTable, setFooter).',
      'Validate document completeness before calling build().',
      'Support document templates via Prototype cloning.'
    ],
    constraints: [
      'Incomplete documents lacking required title/body sections must fail validation.'
    ],
    expectedDesignAreas: ['Builder Pattern', 'Prototype Template Factory', 'Validation Decorator'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000016',
    slug: 'ui-widget-factory',
    title: 'Design a Cross-Platform UI Widget Factory',
    category: 'Creational Patterns',
    topics: ['Abstract Factory', 'Factory Method', 'Bridge'],
    shortDescription: 'Design an Abstract Factory rendering native buttons, dialogs, and text inputs across Windows, macOS, and Linux.',
    difficulty: 'Medium',
    problemStatement: 'Design a cross-platform UI framework using Abstract Factory to produce consistent operating-system native widgets (Button, Scrollbar, Checkbox) without coupling client code to OS-specific implementations.',
    functionalRequirements: [
      'Define Abstract Factory for createButton(), createCheckbox(), createDialog().',
      'Implement concrete factories: WindowsFactory, MacFactory, LinuxFactory.',
      'Render theme-consistent UI components at runtime.'
    ],
    constraints: [
      'Client code must interact solely with abstract widget interfaces.'
    ],
    expectedDesignAreas: ['Abstract Factory Pattern', 'Widget Interface Hierarchy', 'Theme Configurator'],
    createdAt: new Date().toISOString()
  },

  // Category 5: Structural Patterns
  {
    id: '10000000-0000-0000-0000-000000000017',
    slug: 'cache-decorator-system',
    title: 'Design a Multi-Tiered Cache Wrapper',
    category: 'Structural Patterns',
    topics: ['Decorator', 'Proxy', 'Adapter'],
    shortDescription: 'Design a transparent caching layer wrapping database repositories with L1 in-memory and L2 Redis caching decorators.',
    difficulty: 'Medium',
    problemStatement: 'Design a caching mechanism wrapping data repositories using the Decorator and Proxy patterns to provide transparent read-through, write-through, and cache eviction strategies.',
    functionalRequirements: [
      'Wrap IRepository interface with CachingDecorator without altering data contract.',
      'Implement L1 (In-Memory LRU) and L2 (Distributed Redis) cache lookup hierarchy.',
      'Support TTL-based and LRU eviction policies.',
      'Log cache hits, misses, and latency metrics.'
    ],
    constraints: [
      'Cache layer must be completely invisible to calling service classes.'
    ],
    expectedDesignAreas: ['Decorator Pattern for Caching', 'Proxy Pattern for Remote Access', 'Eviction Strategy'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000018',
    slug: 'media-player-adapter',
    title: 'Design a Universal Media Player Adapter',
    category: 'Structural Patterns',
    topics: ['Adapter', 'Facade', 'Bridge'],
    shortDescription: 'Design a media player facade wrapping legacy audio/video codec libraries into a unified player interface.',
    difficulty: 'Easy',
    problemStatement: 'Design a media playing framework that adapts incompatible legacy libraries (VLC, FFmpeg, QuickTime) into a clean unified IMediaPlayer interface.',
    functionalRequirements: [
      'Support MP3, WAV, MP4, MKV, and FLAC format playback.',
      'Adapt legacy library methods (e.g. legacyVlcPlayFile()) to target play() contract.',
      'Provide SimpleMediaPlayer facade for basic play, pause, stop, seek controls.'
    ],
    constraints: [
      'Legacy codec classes cannot be refactored or modified directly.'
    ],
    expectedDesignAreas: ['Adapter Pattern for Codecs', 'Facade Pattern for Control Bar', 'Media Stream Bridge'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000019',
    slug: 'smart-home-facade',
    title: 'Design a Smart Home Controller Facade',
    category: 'Structural Patterns',
    topics: ['Facade', 'Composite', 'Command'],
    shortDescription: 'Design a unified controller facade managing lighting, HVAC, security alarms, and entertainment subsystems.',
    difficulty: 'Easy',
    problemStatement: 'Design a simplified SmartHomeFacade interface providing high-level commands (e.g., leaveHome(), nightMode()) that orchestrate dozens of underlying IoT hardware devices.',
    functionalRequirements: [
      'Unify Light, Thermostat, Alarm, Lock, and Speaker subsystems.',
      'Execute macro scenes (e.g. MovieMode: dims lights, turns on TV, sets temperature to 70F).',
      'Provide status summary for all connected devices.'
    ],
    constraints: [
      'Individual devices should still remain accessible for fine-grained control if needed.'
    ],
    expectedDesignAreas: ['Facade Pattern for IoT', 'Command Pattern for Scenes', 'Device Composite'],
    createdAt: new Date().toISOString()
  },

  // Category 6: Behavioral Patterns
  {
    id: '10000000-0000-0000-0000-000000000002',
    slug: 'elevator-system',
    title: 'Design an Elevator Control System for High-Rise Building',
    category: 'Behavioral Patterns',
    topics: ['State', 'Strategy', 'Command'],
    shortDescription: 'Design an efficient elevator dispatcher for a multi-elevator high-rise building with request scheduling strategies.',
    difficulty: 'Hard',
    problemStatement: 'Design an Elevator Management System operating in a 50-story commercial skyscraper with 6 elevator cars. The system must efficiently dispatch elevators to handle internal requests (buttons pressed inside the car) and external hall calls (up/down buttons on floors), minimize wait times, optimize energy consumption, and gracefully handle emergency modes.',
    functionalRequirements: [
      'Handle external hall calls (floor number + direction: UP/DOWN) and internal car requests (destination floor).',
      'Implement a Dispatcher Strategy (e.g., LOOK/SCAN algorithm, Shortest Seek Time First, or Zone-based).',
      'Support different elevator states: IDLE, MOVING_UP, MOVING_DOWN, DOOR_OPEN, MAINTENANCE.',
      'Support capacity/overweight checks and emergency override modes (Fire alarm, power outage).',
      'Provide real-time display status (current floor, direction, speed) for passenger screens.'
    ],
    constraints: [
      'Each elevator car has maximum weight capacity (e.g., 1000kg / 15 passengers).',
      'Elevators move at 1 floor per 2 seconds; door open/close takes 3 seconds.',
      'Dispatch strategy must avoid starvation for requests at extreme floors (e.g., top floor).',
      'System must support dynamic algorithm swapping (e.g., Morning Rush Hour peak protocol).'
    ],
    expectedDesignAreas: [
      'Elevator Controller & Dispatcher Abstractions',
      'State Pattern for Elevator States & Door Mechanisms',
      'Command Pattern for Request Processing Queues',
      'Concurrency & Thread Safety Consideration'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    slug: 'vending-machine',
    title: 'Design a State-Driven Vending Machine',
    category: 'Behavioral Patterns',
    topics: ['State', 'Command', 'Inventory'],
    shortDescription: 'Design a robust vending machine supporting item inventory management, coin/cash/digital payment handling, and state machine transitions.',
    difficulty: 'Medium',
    problemStatement: 'Design the software controller for an automated smart vending machine. The machine sells snacks and beverages across multiple inventory slots, accepts multiple payment methods (coins, cash notes, QR code UPI), provides correct change, and tracks stock levels. The design must emphasize state transitions and fail-safe operations when items are sold out or exact change is unavailable.',
    functionalRequirements: [
      'Support State Transitions: IdleState, HasMoneyState, SelectionState, DispensingState, SoldOutState.',
      'Manage Inventory: Track slots, item codes, quantity, prices, and expiration dates.',
      'Process Payments: Calculate total inserted money, validate accepted currency denominations, and calculate balance change.',
      'Provide refund capability if transaction is cancelled before dispensing.',
      'Handle out-of-stock scenarios gracefully.'
    ],
    constraints: [
      'If change cannot be returned due to lack of coins in reserve, abort transaction and refund money.',
      'Payment verification must be deterministic.',
      'The machine must remain consistent even if power fails mid-transaction.'
    ],
    expectedDesignAreas: [
      'State Pattern for machine lifecycle states',
      'Inventory Repository / Slot Abstraction',
      'Payment Processor & Change Calculation Strategy',
      'Exception & Edge Case Handling'
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000020',
    slug: 'pub-sub-message-bus',
    title: 'Design an In-Memory Publish-Subscribe Event Bus',
    category: 'Behavioral Patterns',
    topics: ['Observer', 'Mediator', 'Queue'],
    shortDescription: 'Design an event broker supporting topic subscriptions, wildcard pattern matching, and async consumer handlers.',
    difficulty: 'Medium',
    problemStatement: 'Design an in-memory event bus allowing publishers to send messages to named topics, and subscribers to register asynchronous callbacks with filter criteria.',
    functionalRequirements: [
      'Support subscribe(topic, handler), unsubscribe(topic, handler), and publish(topic, message).',
      'Support topic wildcard matching (e.g. orders.* receives orders.created and orders.cancelled).',
      'Handle consumer exception isolation so one failing subscriber does not affect others.',
      'Support synchronous and thread-pool asynchronous dispatching.'
    ],
    constraints: [
      'Publisher threads must not be blocked indefinitely by slow subscribers.'
    ],
    expectedDesignAreas: ['Observer Pattern', 'Mediator Pattern for Event Routing', 'Wildcard Topic Matcher'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000021',
    slug: 'task-scheduler-cron',
    title: 'Design a Job Scheduler & Task Runner',
    category: 'Behavioral Patterns',
    topics: ['Command', 'Priority Queue', 'State'],
    shortDescription: 'Design a background job scheduler handling recurring tasks, priority queues, and worker execution threads.',
    difficulty: 'Hard',
    problemStatement: 'Design an in-memory job scheduling library that accepts one-time and cron-recurring tasks, manages priority execution queues, and tracks execution history.',
    functionalRequirements: [
      'Schedule tasks by exact time, delay interval, or cron expression.',
      'Execute tasks using a fixed pool of worker threads.',
      'Support task cancellation, pause, and manual retry.',
      'Track task status: Scheduled, Running, Completed, Failed, Retrying.'
    ],
    constraints: [
      'High-priority tasks must take precedence when thread pool capacity is limited.'
    ],
    expectedDesignAreas: ['Command Pattern for Tasks', 'Priority Queue Scheduler', 'State Pattern for Task Lifecycle'],
    createdAt: new Date().toISOString()
  },

  // Category 7: System Design Basics
  {
    id: '10000000-0000-0000-0000-000000000022',
    slug: 'rate-limiter',
    title: 'Design an API Rate Limiter Component',
    category: 'System Design Basics',
    topics: ['RateLimiter', 'Token Bucket', 'Strategy'],
    shortDescription: 'Design an in-memory rate limiter supporting Token Bucket, Leaky Bucket, and Sliding Window algorithms.',
    difficulty: 'Medium',
    problemStatement: 'Design a flexible rate limiting library used to protect API endpoints against denial-of-service and throttle per-client request volumes.',
    functionalRequirements: [
      'Support Token Bucket, Leaky Bucket, and Sliding Window Counter algorithms.',
      'Enforce limits by Client ID, IP Address, or API Route.',
      'Return HTTP 429 Too Many Requests status with Retry-After headers.',
      'Provide thread-safe atomic counter updates.'
    ],
    constraints: [
      'Rate check evaluation must complete in sub-millisecond latency (<1ms).'
    ],
    expectedDesignAreas: ['Rate Limiting Strategy Pattern', 'Token Bucket State Machine', 'Atomic Sliding Window'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000023',
    slug: 'url-shortener-domain',
    title: 'Design a URL Shortener Subsystem',
    category: 'System Design Basics',
    topics: ['Hash Engine', 'Base62', 'Repository'],
    shortDescription: 'Design an object model for short link generation, custom alias reservation, expiration, and click analytics.',
    difficulty: 'Easy',
    problemStatement: 'Design the core object model and service layer for a URL shortener service like bit.ly, including Base62 encoding, custom aliases, and analytics logging.',
    functionalRequirements: [
      'Encode auto-incrementing integer IDs into 7-character Base62 strings (e.g. 125134 -> aB3xK9).',
      'Support custom user-defined alias reservation.',
      'Enforce expiration dates on temporary links.',
      'Record referrer, timestamp, and country location for each redirect access.'
    ],
    constraints: [
      'Short URL strings must be globally unique.',
      'Redirection lookup must be O(1) time complexity.'
    ],
    expectedDesignAreas: ['Base62 Encoder Engine', 'URL Mapping Repository', 'Click Analytics Collector'],
    createdAt: new Date().toISOString()
  },
  {
    id: '10000000-0000-0000-0000-000000000024',
    slug: 'distributed-kv-store',
    title: 'Design an In-Memory Key-Value Storage Engine',
    category: 'System Design Basics',
    topics: ['LRU Cache', 'Hash Table', 'Transaction'],
    shortDescription: 'Design an in-memory Key-Value store supporting String, List, and Hash data types with transaction commits and snapshots.',
    difficulty: 'Hard',
    problemStatement: 'Design the core engine for an in-memory data store (similar to Redis) supporting key-value GET/SET, expiration TTL, data type structures, and ACID transaction blocks.',
    functionalRequirements: [
      'Support SET, GET, DEL, EXPIRE, and TTL operations.',
      'Support data structures: Strings, Lists (LPUSH/RPOP), and Hashes (HSET/HGET).',
      'Support transaction blocks: MULTI, EXEC, DISCARD.',
      'Implement passive and active TTL expiration routines.'
    ],
    constraints: [
      'Key operations must achieve average O(1) time complexity.',
      'Transaction commands must execute atomically without interleaved operations.'
    ],
    expectedDesignAreas: ['Key-Value Store Core', 'LRU Memory Manager', 'Transaction Block Coordinator'],
    createdAt: new Date().toISOString()
  }
];

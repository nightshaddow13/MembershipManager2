---
description: Technical code review for quality and bugs that runs pre-commit
---

Perform technical code review on recently changed files.

## Core Principles

Review Philosophy:

- Simplicity is the ultimate sophistication - every line should justify its existence
- Code is read far more often than it's written - optimize for readability
- The best code is often the code you don't write
- Elegance emerges from clarity of intent and economy of expression

## Lubesoft Context

This is a .NET 8 event sourcing application with:

- **Backend**: C# 12, PostgreSQL, Beckett (Event Store)
- **Frontend**: Razor Pages, HTMX, Bootstrap, SASS, Alpine.js
- **Testing**: xUnit (12,756+ tests), Playwright (34+ E2E tests)
- **Architecture**: Event Sourcing, CQRS, Domain-Driven Design, Modular Monolith

## What to Review

### Step 1: Gather Codebase Context (Smart Reading)

**ALWAYS START HERE**:

```bash
# Read AGENTS.md first - it's the hub for testing conventions
cat AGENTS.md
# Read the AI docs index to know what's available
cat .ai/docs/README.md
```

**THEN READ SELECTIVELY** based on what changed:

**If Backend/Event Sourcing Changes**:

```bash
cat .ai/docs/ARCHITECTURE_OVERVIEW.md
cat .ai/docs/complete-system-architecture-guide.md
cat .ai/docs/csharp-dotnet-best-practices.md
cat .ai/docs/TESTING_STANDARDS.md
cat docs/subscriptions/batch.md  # Batch subscription patterns
```

**If Frontend/UI Changes**:

```bash
cat .ai/docs/frontend-best-practices.md
cat .ai/docs/csharp-dotnet-best-practices.md  # For page models
cat .ai/docs/TESTING_STANDARDS.md
```

**If Database Changes**:

```bash
cat .ai/docs/database-best-practices.md
cat .ai/docs/ARCHITECTURE_OVERVIEW.md
```

Also check the SQL Migrations section of `AGENTS.md` for naming conventions.

**If Test Changes**:

```bash
cat .ai/docs/TESTING_STANDARDS.md
cat .ai/docs/testing-best-practices.md
```

### Step 2: Examine Changed Files

Run these commands:

```bash
git status
git diff HEAD
git diff --stat HEAD
```

Then check the list of new files:

```bash
git ls-files --others --exclude-standard
```

Read each new file in its entirety. Read each changed file in its entirety (not just the diff) to understand full context.

For each changed file or new file, analyze for:

### 1. **Lubesoft-Specific Pattern Violations**

**Event Sourcing Patterns** (if backend changes):

- ❌ Events defined as classes (MUST be records)
- ❌ Traditional constructors (MUST use primary constructors)
- ❌ Command names not imperative (e.g., `VehicleNoteAdded` instead of `AddVehicleNote`)
- ❌ Stream naming not `{Category}-{EntityId}` pattern
- ❌ Projections not using `CreatedBy<>()` / `UpdatedBy<>()` patterns
- ❌ Side effects in queries (queries must be read-only)
- ❌ Business rules not implementing `IBusinessRule`
- ❌ New projections using legacy `Projection<T, TKey>` base class (MUST use `BatchProjection<T, TKey>`)
- ❌ New subscriptions not using batch subscriptions (all new subscriptions MUST be batch — see `docs/subscriptions/batch.md`)
- ❌ New entity projections missing `IBatchSubscription` marker interface

**SQL Migration Patterns** (if `migrations/` files added or changed):

- ❌ Migration file not following naming convention `YYYYMMDD.ISSUE[.SEQUENCE].sql` (e.g., `20260310.1234.sql`)
- ❌ Migration using legacy sequential naming (`0032.sql`, etc.)
- ❌ Migration not idempotent (missing `IF NOT EXISTS`, `IF EXISTS`, `CREATE OR REPLACE`, etc.)
- ❌ Existing deployed migration modified instead of creating a new one
- ❌ Migration date in filename doesn't match today's date (should be the date the migration is created)

**Frontend Patterns** (if UI changes):

- ❌ Not using HTMX for dynamic interactions
- ❌ Not using Bootstrap 5.3.2 components (Bootstrap is the UI framework — not Tailwind)
- ❌ Writing custom CSS that duplicates Bootstrap utility classes
- ❌ Full page reloads instead of HTMX partial updates
- ❌ Not waiting for HTMX swaps to complete before interacting with the DOM
- ❌ Not using Alpine.js for client-side interactivity (when appropriate)

**Testing Patterns** (if test changes):

- ❌ Not using Pascal case for test method names
- ❌ Comments in test code (//Arrange, //Assert, etc.)
- ❌ Using FluentAssertions (use `Assert.Equivalent` instead)
- ❌ Using BaseTestFixture (each test stands on its own)
- ❌ Testing SQL query classes (DON'T test these)
- ❌ Testing exception classes (DON'T test these)
- ❌ Using mocks for our interfaces (use fakes instead)
- ❌ Coverage < 80% (goal is 100%)
- ❌ Directly accessing `result.Streams`, `result.Entities`, `result.Notifications` etc. — MUST use `ResultExtensions` methods (`result.AppendedEventToStream(...)`, `result.NoEventsAppendedToStreams()`, `result.NoOpResult()`, etc.)
- ❌ Testing a fake implementation instead of the real class — fakes are for DEPENDENCIES, not the class under test
- ❌ Manually constructing full objects when `TestObjectBuilder.Build<T>() with { Property = value }` should be used — only override properties that matter for the test

**C# 12 Conventions** (if C# changes):

- ❌ Not using primary constructors for new classes
- ❌ Not using records for events and DTOs
- ❌ Not using `record` types for immutable data

### 2. **Logic Errors**

- Off-by-one errors
- Incorrect conditionals
- Missing error handling
- Race conditions
- Event ordering issues (event sourcing)
- Eventual consistency not handled

### 3. **Security Issues**

- SQL injection vulnerabilities
- XSS vulnerabilities (Razor Pages)
- Insecure data handling
- Exposed secrets or API keys
- Missing authentication checks
- Missing authorization checks

### 4. **Performance Problems**

- N+1 queries (especially in projections)
- Inefficient algorithms
- Memory leaks
- Unnecessary computations
- Not using async/await properly
- Blocking calls in async methods

### 5. **Code Quality**

- Violations of DRY principle
- Overly complex functions
- Poor naming (not following C# conventions)
- Missing XML documentation comments (public APIs)
- Not following existing patterns in codebase

### 6. **Event Sourcing Specific Issues**

- Events not immutable
- Commands with side effects
- Projections not idempotent
- Event handlers not handling failures
- Missing checkpoint management
- Stream naming inconsistencies
- New projections inheriting from `Projection<T, TKey>` instead of `BatchProjection<T, TKey>`
- New subscriptions not configured as batch subscriptions

### 7. **SQL Migration Issues**

- Migration filenames not following `YYYYMMDD.ISSUE[.SEQUENCE].sql` convention
- Non-idempotent SQL statements (e.g., `CREATE TABLE` without `IF NOT EXISTS`)
- Modifying an existing migration file that has already been deployed
- Missing migration file when database schema changes are required (e.g., new tables, columns, indexes, subscription deletions)

## Verify Issues Are Real

- Run specific tests for issues found: `npm test` (xUnit) or `npx playwright test` (E2E)
- Confirm compilation errors: `dotnet build`
- Validate security concerns with context
- Check if pattern violations are intentional (look for comments explaining why)

## Lubesoft-Specific Checks

Run these commands to verify common issues:

```bash
# Check for events as classes (should be records)
grep -r "public class.*Event" src/

# Check for traditional constructors (should use primary constructors)
grep -r "public.*\(.*\)\s*{" src/ | grep -v "record"

# Check for FluentAssertions in tests (should use Assert.Equivalent)
grep -r "Should\(\)" src/*.Tests/

# Check for test comments (should not have //Arrange, //Assert, etc.)
grep -r "//Arrange\|//Act\|//Assert" src/*.Tests/

# Check for new projections using legacy Projection<T, TKey> base class
git diff HEAD -- '*.cs' | grep -n '+.*: Projection<'
# Should use BatchProjection<T, TKey> instead

# Check for new event handlers missing batch configuration
git diff HEAD -- '*.cs' | grep -n '+.*IEventHandler<'
# Verify those files implement IConfigureSubscription with ProcessInBatches()

# Check new migration file naming convention
git ls-files --others --exclude-standard migrations/ | grep -v -E '^migrations/[0-9]{8}\.[0-9]+'
# Any output here means a migration doesn't follow YYYYMMDD.ISSUE[.SEQUENCE].sql

# Check new migrations for idempotency
git diff HEAD -- 'migrations/*.sql' | grep -n '+' | grep -i 'CREATE TABLE [^I]\|ADD COLUMN [^I]\|CREATE INDEX [^I]'
# Any output here means a migration may not be idempotent

# Check test coverage
npm test
# Look for coverage < 80%
```

## Output Format

Save a new file to `.agents/code-reviews/[appropriate-name].md`

**Stats:**

- Files Modified: 0
- Files Added: 0
- Files Deleted: 0
- New lines: 0
- Deleted lines: 0

**For each issue found:**

```yaml
severity: critical|high|medium|low
category: pattern_violation|logic_error|security|performance|code_quality|event_sourcing
file: path/to/file.cs
line: 42
issue: [one-line description]
detail: [explanation of why this is a problem]
lubesoft_pattern: [reference to specific pattern in .ai/docs/ if applicable]
suggestion: [how to fix it with code example]
```

**Example Issue**:

```yaml
severity: high
category: pattern_violation
file: src/Lubesoft/Events/VehicleNoteAdded.cs
line: 5
issue: Event defined as class instead of record
detail: Events must be immutable records in Lubesoft event sourcing architecture
lubesoft_pattern: .ai/docs/csharp-dotnet-best-practices.md - "Events are always records"
suggestion: |
  Change from:
    public class VehicleNoteAdded { ... }
  To:
    public record VehicleNoteAdded(Guid VehicleId, string Note, DateTimeOffset Timestamp);
```

If no issues found: "Code review passed. No technical issues detected."

## Important

- Be specific (line numbers, not vague complaints)
- Focus on real bugs and pattern violations, not style preferences
- Suggest fixes with code examples
- Flag security issues as CRITICAL
- Reference specific Lubesoft documentation when citing pattern violations
- Distinguish between "must fix" (pattern violations) and "consider" (improvements)
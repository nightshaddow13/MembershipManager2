---
description: Pre-PR self-review of all commits on current branch compared to main
---

Perform a technical code review of all changes committed on the current branch that are not yet in `main`. This is a self-review to catch issues before opening a pull request.

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

### Step 1: Identify Branch Changes

**IMPORTANT — Always compare against the remote `origin/main`, not local `main`.** Local `main` may be stale, causing the diff to include changes from other PRs already merged upstream. Fetch first, then use `origin/main` for all comparisons.

**IMPORTANT — Only review committed changes.** Ignore any uncommitted or untracked files in the working tree (documentation drafts, local config, etc.). All git commands below operate on committed history only, which is the correct behavior. Do NOT include working tree status in the report.

Run these commands to understand what this branch introduces relative to `origin/main`:

```bash
# Fetch latest main from remote
git fetch origin main

# Show all commits on this branch not yet in origin/main
git log origin/main..HEAD --oneline

# Show a stat summary of all changes
git diff origin/main...HEAD --stat

# Show the full diff of all branch changes
git diff origin/main...HEAD
```

Then get the list of files added on this branch that do not exist in `origin/main`:

```bash
git diff origin/main...HEAD --name-only --diff-filter=A
```

Read each changed or added file in its entirety (not just the diff) to understand full context.

### Step 2: Gather Codebase Context (Smart Reading)

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

For each changed or added file, analyze for:

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

Run these commands **only against files changed on this branch** to verify common issues:

```bash
# Get the list of changed files on this branch
CHANGED_FILES=$(git diff origin/main...HEAD --name-only)

# Check for events as classes (should be records) — only in changed files
echo "$CHANGED_FILES" | xargs grep -l "public class.*Event" 2>/dev/null

# Check for FluentAssertions in new/modified test files (should use Assert.Equivalent)
echo "$CHANGED_FILES" | grep "Tests" | xargs grep -l "Should()" 2>/dev/null

# Check for test comments (should not have //Arrange, //Assert, etc.)
echo "$CHANGED_FILES" | grep "Tests" | xargs grep -l "//Arrange\|//Act\|//Assert" 2>/dev/null

# Check for new projections using legacy Projection<T, TKey> base class (should use BatchProjection<T, TKey>)
echo "$CHANGED_FILES" | grep -v "Tests" | xargs grep -n ": Projection<" 2>/dev/null

# Check for new subscriptions missing batch configuration
echo "$CHANGED_FILES" | grep -v "Tests" | xargs grep -l "IEventHandler<" 2>/dev/null
# Then verify those files implement IConfigureSubscription with ProcessInBatches()

# Check migration file naming convention (should be YYYYMMDD.ISSUE[.SEQUENCE].sql)
echo "$CHANGED_FILES" | grep "^migrations/" | grep -v -E '^migrations/[0-9]{8}\.[0-9]+' | grep -v -E '^migrations/00[0-9]{2}\.sql'
# Any output here means a migration file doesn't follow the naming convention

# Check new migrations for idempotency (look for non-idempotent patterns)
NEW_MIGRATIONS=$(git diff origin/main...HEAD --name-only --diff-filter=A | grep "^migrations/")
if [ -n "$NEW_MIGRATIONS" ]; then
  echo "$NEW_MIGRATIONS" | xargs grep -n "CREATE TABLE [^I]\|ALTER TABLE.*ADD COLUMN [^I]\|CREATE INDEX [^I]" 2>/dev/null
  # Any output here means a migration may not be idempotent
fi

# Check for modified (not just added) migration files — existing migrations should never be modified
git diff origin/main...HEAD --name-only --diff-filter=M | grep "^migrations/"
# Any output here is a red flag — existing migrations should not be changed
```

## Output Format

Save a new file to `.agents/code-reviews/[branch-name]-pr-review.md`

**Start with a "What This PR Does" section** at the very top of the report (before the branch summary). This should be a brief, plain-language summary of the purpose of the branch — what it accomplishes, introduces, improves, or fixes. Derive this from the commit messages, file changes, and code context. Keep it to 3-6 bullet points. Example:

```markdown
## What This PR Does

- Adds HRF7 employee commission export for finalized and voided invoices
- Introduces "copy within invoice group" feature for employee position assignments
- Fixes inverted Message of the Day read-only logic
- Adds fleet requirements modal menu item to work order service page
- Enables Revenue Reconciliation Report to display when starting till amount is zero
- Extends Inf1a reporting with employee tracking position nicknames
```

Then continue with:

**Branch Summary:**

- Branch: `[current branch name]`
- Base: `main`
- Commits: 0
- Files Modified: 0
- Files Added: 0
- Files Deleted: 0
- New lines: 0
- Deleted lines: 0

**Commit Log** (one line per commit from `git log origin/main..HEAD --oneline`):

```
[list commits here]
```

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

If no issues found: "Pre-PR review passed. No technical issues detected. Branch is ready for pull request."

## Important

- Be specific (line numbers, not vague complaints)
- Focus on real bugs and pattern violations, not style preferences
- Suggest fixes with code examples
- Flag security issues as CRITICAL
- Reference specific Lubesoft documentation when citing pattern violations
- Distinguish between "must fix" (pattern violations) and "consider" (improvements)
- Review ALL commits on the branch, not just the most recent one
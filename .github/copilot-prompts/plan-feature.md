---
agent: agent
description: "Create comprehensive feature plan with deep codebase analysis and research"
---

# Plan a new task

## Feature: $ARGUMENTS

## Mission

Transform a feature request into a **comprehensive implementation plan** through systematic codebase analysis, external research, and strategic planning.

**Core Principle**: We do NOT write code in this phase. Our goal is to create a context-rich implementation plan that enables one-pass implementation success for the Cursor agent (or other AI agents) that will execute it.

**Key Philosophy**: Context is King. The plan must contain ALL information needed for implementation - patterns, mandatory reading, documentation, validation commands - so the execution agent succeeds on the first attempt.

## Planning Process

### Phase 1: Feature Understanding

**Deep Feature Analysis:**

- Extract the core problem being solved
- Identify user value and business impact
- Determine feature type: New Capability/Enhancement/Refactor/Bug Fix
- Assess complexity: Low/Medium/High
- Map affected systems and components
- **Check for design links** - If any design URLs are provided, note them for Phase 2

**Create User Story Format Or Refine If Story Was Provided By The User:**

```
As a <type of user>
I want to <action/goal>
So that <benefit/value>
```

### Phase 2: Codebase Intelligence Gathering

**Use specialized agents and parallel analysis:**

**0. Design Extraction** (UI features only - if design links provided)

If design links were provided, extract design context:
- Identify the source or tool behind the design URL and note it for review.
- Save screenshots to `.ai/design-references/{feature-name}/`
- Extract design specs: colors, typography, spacing, states
- Include reference code or implementation notes if available
- Document all in the plan's "Design References" section

**1. Project Structure Analysis**

- Detect primary language(s), frameworks, and runtime versions
- Map directory structure and architectural patterns
- Identify service/component boundaries and integration points
- Locate configuration files (package.json, Lubesoft.sln, *.csproj, docker-compose.yml, etc.; see **AGENTS.md** → Key Files)
- Find environment setup and build processes
- Locate this repo’s GitHub Projects board or issue cards when a ticket/story is referenced. Use GitHub Projects as the ticket source for story context, acceptance criteria, and dependencies instead of Jira.

**2. Pattern Recognition** (Use specialized subagents when beneficial)

- Search for similar implementations in codebase
- Identify coding conventions:
  - Naming patterns (CamelCase, snake_case, kebab-case)
  - File organization and module structure
  - Error handling approaches
  - Logging patterns and standards
- Extract common patterns for the feature's domain
- Document anti-patterns to avoid
- Check **AGENTS.md** for project-specific rules, conventions, tech stack, and reference docs

**3. Dependency Analysis**

- Catalog external libraries relevant to feature
- Understand how libraries are integrated (check imports, configs)
- Find relevant documentation in .ai/docs/, or other project docs (see **AGENTS.md** → Reference Documentation)
- Note library versions and compatibility requirements

**4. Testing Patterns**

- Identify test framework and structure (for this repo: xUnit, Playwright, FakeItEasy; see **AGENTS.md**, **TESTING_STANDARDS.md**)
- Find similar test examples for reference
- Understand test organization (unit vs integration; src/Tests/, src/{Domain}.Tests/, tests/ for E2E)
- Note coverage requirements (100% goal, 80% minimum; do not test SQL query classes or exception classes)

**5. Integration Points**

- Identify existing files that need updates
- Determine new files that need creation and their locations
- Map router/API registration patterns
- Understand database/model patterns if applicable
- Identify authentication/authorization patterns if relevant

**Clarify Ambiguities:**

- If requirements are unclear at this point, ask the user to clarify before you continue
- Get specific implementation preferences (libraries, approaches, patterns)
- Resolve architectural decisions before proceeding

### Phase 3: External Research & Documentation

**Use specialized subagents when beneficial for external research:**

**Documentation Gathering:**

- Research latest library versions and best practices
- Find official documentation with specific section anchors
- Locate implementation examples and tutorials
- Identify common gotchas and known issues
- Check for breaking changes and migration guides

**Technology Trends:**

- Research current best practices for the technology stack
- Find relevant blog posts, guides, or case studies
- Identify performance optimization patterns
- Document security considerations

**Compile Research References:**

```markdown
## Relevant Documentation

- [Library Official Docs](https://example.com/docs#section)
  - Specific feature implementation guide
  - Why: Needed for X functionality
- [Framework Guide](https://example.com/guide#integration)
  - Integration patterns section
  - Why: Shows how to connect components
```

### Phase 4: Deep Strategic Thinking

**Think Harder About:**

- How does this feature fit into the existing architecture?
- What are the critical dependencies and order of operations?
- What could go wrong? (Edge cases, race conditions, errors)
- How will this be tested comprehensively?
- What performance implications exist?
- Are there security considerations?
- How maintainable is this approach?

**Design Decisions:**

- Choose between alternative approaches with clear rationale
- Design for extensibility and future modifications
- Plan for backward compatibility if needed
- Consider scalability implications

### Phase 5: Plan Structure Generation

**Create comprehensive plan with the following structure:**

Whats below here is a template for you to fill for th4e implementation agent:

```markdown
# Feature: <feature-name>

The following plan should be complete, but its important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils types and models. Import from the right files etc.

## Feature Description

<Detailed description of the feature, its purpose, and value to users>

## User Story

As a <type of user>
I want to <action/goal>
So that <benefit/value>

## Problem Statement

<Clearly define the specific problem or opportunity this feature addresses>

## Solution Statement

<Describe the proposed solution approach and how it solves the problem>

## Feature Metadata

**Feature Type**: [New Capability/Enhancement/Refactor/Bug Fix]
**Estimated Complexity**: [Low/Medium/High]
**Primary Systems Affected**: [List of main components/services]
**Dependencies**: [External libraries or services required]

---

## CONTEXT REFERENCES

### Design References (if applicable - UI features only)

**CRITICAL**: If this is a UI feature with design references:

- **Design URLs**: [List all design links with full URLs]
  - Example: `https://example.com/design/abc123/FeatureName?node-id=1-2`
- **Design Screenshots**: [Paths to saved screenshots]
  - `.ai/design-references/{feature-name}/design-node-1-2.png`
- **Design Specifications**:
  - Colors: [extracted from design]
  - Typography: [fonts, sizes, weights]
  - Spacing: [margins, padding values]
  - Component states: [hover, active, disabled, etc.]
- **Reference Code**: [Adapted code from design asset source if available]

### Relevant Codebase Files IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

<List files with line numbers and relevance>

- `path/to/file.py` (lines 15-45) - Why: Contains pattern for X that we'll mirror
- `path/to/model.py` (lines 100-120) - Why: Database model structure to follow
- `path/to/test.py` - Why: Test pattern example

### New Files to Create

- `path/to/new_service.py` - Service implementation for X functionality
- `path/to/new_model.py` - Data model for Y resource
- `tests/path/to/test_new_service.py` - Unit tests for new service

### Relevant Documentation YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Documentation Link 1](https://example.com/doc1#section)
  - Specific section: Authentication setup
  - Why: Required for implementing secure endpoints
- [Documentation Link 2](https://example.com/doc2#integration)
  - Specific section: Database integration
  - Why: Shows proper async database patterns

### Patterns to Follow

<Specific patterns extracted from codebase - include actual code examples from the project>

**Naming Conventions:** (for example)

**Error Handling:** (for example)

**Logging Pattern:** (for example)

**Other Relevant Patterns:** (for example)

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation

<Describe foundational work needed before main implementation>

**Tasks:**

- Set up base structures (schemas, types, interfaces)
- Configure necessary dependencies
- Create foundational utilities or helpers

### Phase 2: Core Implementation

<Describe the main implementation work>

**Tasks:**

- Implement core business logic
- Create service layer components
- Add API endpoints or interfaces
- Implement data models

### Phase 3: Integration

<Describe how feature integrates with existing functionality>

**Tasks:**

- Connect to existing routers/handlers
- Register new components
- Update configuration files
- Add middleware or interceptors if needed

### Phase 4: Testing & Validation

<Describe testing approach>

**Tasks:**

- Implement unit tests for each component
- Create integration tests for feature workflow
- Add edge case tests
- Validate against acceptance criteria

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task Format Guidelines

Use information-dense keywords for clarity:

- **CREATE**: New files or components
- **UPDATE**: Modify existing files
- **ADD**: Insert new functionality into existing code
- **REMOVE**: Delete deprecated code
- **REFACTOR**: Restructure without changing behavior
- **MIRROR**: Copy pattern from elsewhere in codebase

### {ACTION} {target_file}

- **IMPLEMENT**: {Specific implementation detail}
- **PATTERN**: {Reference to existing pattern - file:line}
- **IMPORTS**: {Required imports and dependencies}
- **GOTCHA**: {Known issues or constraints to avoid}
- **VALIDATE**: `{executable validation command}`

<Continue with all tasks in dependency order...>

---

## TESTING STRATEGY

<Define testing approach based on project's test framework and patterns discovered in during research>

### Unit Tests

<Scope and requirements based on project standards>

Design unit tests with fixtures and assertions following existing testing approaches

### Integration Tests

<Scope and requirements based on project standards>

### Edge Cases

<List specific edge cases that must be tested for this feature>

---

## VALIDATION COMMANDS

**CRITICAL FOR EXECUTION AGENT**: The execution agent MUST complete ALL validation levels below in order before declaring the feature complete. Build success alone is NOT sufficient. Each level must PASS before the feature is considered done.

<Define validation commands based on project's tools discovered in Phase 2>

Execute every level in order to ensure zero regressions and 100% feature correctness.

### Level 1: Build Validation

**IMPORTANT**: Do NOT run formatting commands (e.g., `dotnet format`, `prettier`, etc.) - formatting is optional and can cause unintended changes or build failures.

<Project-specific build commands - e.g., `dotnet build`, `npm run build`, etc.>

**Verify Application Starts Successfully:**

```bash
# Verify npm start works (do NOT use background mode - let it run until services are up)
npm start 2>&1 | head -150

# Look for:
# - "Build succeeded" message
# - "Database migrated successfully" message  
# - Services starting (webapp, worker, etc.)
# - No error messages

# Then kill the process (Ctrl+C) to continue with other validations
```

**Gate**: Build succeeds with 0 errors. Application starts successfully without errors.

---

### Level 2: Unit Tests

<Project-specific unit test commands>

### Level 3: Integration Tests

<Project-specific integration test commands>

### Level 4: Browser-Based Automated Validation

**MANDATORY FOR UI FEATURES** - The execution agent MUST use agent-browser to test this feature end-to-end like a real user. DO NOT skip this level.

**IMPORTANT**: Use agent-browser (via `run_in_terminal` in headed mode) to validate the feature like a real user would.

This validation ensures the feature works end-to-end in the actual application:

**Setup:**
- Ensure application is running (e.g., `npm start` or equivalent)
- Note the application URL (e.g., `http://localhost:5000`)
- **Local Testing Accounts**: When testing with local dev accounts (`lubesoftmanager`, `lubesoftuser`), the 2FA code is pre-populated automatically. Simply click "Continue" on the 2FA method selection and again on the code entry page (code is auto-filled). This auto-population only works in local development environments.

**Validation Steps Using agent-browser:**

```bash
# Navigate to the feature
agent-browser open <application-url>

# Take snapshot to see available interactions
agent-browser snapshot -i

# Interact with the feature (click, fill forms, etc.)
agent-browser click @e1
agent-browser fill @e2 "test data"

# Validate expected behavior (check text, elements, navigation)
agent-browser snapshot -i  # Verify expected changes

# Take screenshot for documentation
agent-browser snapshot --output .ai/validation-screenshots/{feature-name}.png

# Clean up
agent-browser close
```

**What to Validate:**
- Feature is accessible at expected URL/route
- UI elements render correctly and are interactive
- Form submissions work and show appropriate feedback
- Navigation flows work as expected
- Error states display correctly
- Success states display correctly
- Data persists correctly (verify through UI, not database)

**CRITICAL - Dynamic Content Validation:**

**Verify elements are VISIBLE, not just present in HTML:**
- Use `agent-browser snapshot -i` to get interactive elements snapshot
- COUNT expected elements (e.g., for 5 stars: `snapshot -i | grep -i "star\|button" | wc -l` should show at least 5)
- Verify elements appear in the interactive snapshot (not just raw HTML)

**Verify initial/default values are DISPLAYED:**
- Character counters should show numbers (e.g., "150 characters left")
- Dropdowns should show default option
- Form fields should show placeholder text
- Use `agent-browser get html '#elementId'` to verify content
- Example: `get html '#charCount'` should return "150", not empty

**Verify JavaScript Dependency Requirements:**
- If using framework-dependent templates (Alpine.js `<template x-for>`, Vue `v-for`, etc.):
  1. Check if the framework is loaded in `_Layout.cshtml` or equivalent
  2. Search for framework CDN/script tags: `grep -r "alpine\|vue\|react" src/WebApp/Pages/_Layout.cshtml`
  3. **If NOT found**: Framework is not loaded → Templates won't expand → Elements won't render
  4. **Solution**: Use vanilla JavaScript or Hyperscript (already in layout) instead

**Example Framework Check:**
```bash
# Check if Alpine.js is loaded
grep -i "alpine" src/WebApp/Pages/_Layout.cshtml

# If not found, Alpine templates won't work
# Must use: @for loop (Razor), vanilla JS, or Hyperscript
```

**Reference**: See `.ai/skills/agent-browser/SKILL.md` for full command reference

**CRITICAL - Functional End-to-End Validation:**

**Visual validation alone is INSUFFICIENT** - execution agent MUST test the complete functional workflow:

1. **Complete the full user action sequence**:
   - Fill ALL form fields with valid test data
   - Click submit/save/action buttons
   - Verify the intended outcome occurs (data saved, page navigates, confirmation shown, etc.)
   - **DO NOT** stop at verifying elements exist - actually USE them

2. **Error Detection (MANDATORY)**:
   - Check response for error messages: `agent-browser get html body | grep -i "error\|failed\|invalid"`
   - Verify success indicators appear: `grep -i "success\|saved\|created\|updated"`
   - Look for HTTP error codes (4xx, 5xx)
   - Check for validation failures or form errors

3. **FIX-RETRY LOOP (MANDATORY if errors found)**:
   - **If ANY error occurs**: Feature validation FAILS
   - Execution agent MUST:
     1. Investigate the error (read error messages, check logs, review code)
     2. Fix the underlying issue in code
     3. Re-test the complete workflow with agent-browser from the beginning
     4. Repeat until the feature works WITHOUT ERRORS
   - **NO SKIPPING**: Do NOT mark validation complete while errors exist
   - **NO MOVING ON**: Do NOT proceed to next validation level with unresolved errors

4. **Example complete functional test**:
   ```bash
   # BAD (incomplete validation):
   agent-browser snapshot -i | grep "submit"  # Found submit button
   # ✗ Did not actually test submission functionality!
   
   # GOOD (complete validation):
   agent-browser open http://localhost:5000/feedback
   agent-browser snapshot -i  # Get element refs
   agent-browser click @e1  # Click star rating
   agent-browser fill @e2 "This is my feedback"  # Fill textarea
   agent-browser click @e3  # Click Submit button
   # Wait for response
   sleep 2
   # Verify success (no errors)
   agent-browser get html body | grep -i "error"
   # Should return empty (no errors found)
   agent-browser get html body | grep -i "success\|thank\|submitted"
   # Should find success confirmation
   # ✓ Complete functional test - form actually works!
   ```

5. **Success Criteria**:
   - ✅ Feature completes the intended user action without errors
   - ✅ Success confirmation/feedback is displayed to user
   - ✅ Data persists correctly (verify through UI, not database queries)
   - ✅ Error states handled gracefully (if testing error scenarios)
   - ✅ No console errors, no HTTP errors, no validation failures

**Gate**: Feature works end-to-end in browser with ZERO errors. All dynamic elements are visible, display correct initial values, AND all functional workflows complete successfully.

### Level 5: Manual Validation

<Feature-specific manual testing steps - API calls, UI testing, etc.>

### Level 6: Visual Validation (UI features with design references only)

If design references were provided:
- Start application and open in browser
- Take screenshots of implementation
- Compare with reference screenshots from `.ai/design-references/`
- Validate: colors, typography, spacing, layout, component states
- Fix any mismatches before completion

### Level 7: Additional Validation (Optional)

<MCP servers or additional CLI tools if available>

---

## ACCEPTANCE CRITERIA

<List specific, measurable criteria that must be met for completion>

- [ ] Feature implements all specified functionality
- [ ] All validation commands pass with zero errors
- [ ] Unit test coverage meets requirements (100% goal, 80% minimum per AGENTS.md / TESTING_STANDARDS.md)
- [ ] Integration tests verify end-to-end workflows
- [ ] Code follows project conventions and patterns
- [ ] No regressions in existing functionality
- [ ] Documentation is updated (if applicable)
- [ ] Performance meets requirements (if applicable)
- [ ] Security considerations addressed (if applicable)

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Full test suite passes (unit + integration)
- [ ] No linting or type checking errors
- [ ] Manual testing confirms feature works
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability

---

## NOTES

<Additional context, design decisions, trade-offs>
```

## Output Format

**Filename**: `.ai/plans/{kebab-case-descriptive-name}.md`

- Replace `{kebab-case-descriptive-name}` with short, descriptive feature name
- Examples: `add-user-authentication.md`, `implement-search-api.md`, `refactor-database-layer.md`

**Directory**: Create the `.ai/plans/` directory if it doesn't exist

## Quality Criteria

### Context Completeness ✓

- [ ] All necessary patterns identified and documented
- [ ] External library usage documented with links
- [ ] Integration points clearly mapped
- [ ] Gotchas and anti-patterns captured
- [ ] Every task has executable validation command

### Implementation Ready ✓

- [ ] Another developer could execute without additional context
- [ ] Tasks ordered by dependency (can execute top-to-bottom)
- [ ] Each task is atomic and independently testable
- [ ] Pattern references include specific file:line numbers

### Pattern Consistency ✓

- [ ] Tasks follow existing codebase conventions
- [ ] New patterns justified with clear rationale
- [ ] No reinvention of existing patterns or utils
- [ ] Testing approach matches project standards

### Information Density ✓

- [ ] No generic references (all specific and actionable)
- [ ] URLs include section anchors when applicable
- [ ] Task descriptions use codebase keywords
- [ ] Validation commands are non interactive executable

## Success Metrics

**One-Pass Implementation**: Execution agent can complete feature without additional research or clarification

**Validation Complete**: Every task has at least one working validation command

**Context Rich**: The Plan passes "No Prior Knowledge Test" - someone unfamiliar with codebase can implement using only Plan content

**Confidence Score**: #/10 that execution will succeed on first attempt

## Report

After creating the Plan, provide:

- Summary of feature and approach
- Full path to created Plan file
- Complexity assessment
- Key implementation risks or considerations
- Estimated confidence score for one-pass success

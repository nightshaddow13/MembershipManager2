---
agent: agent
description: Execute an implementation plan
---
argument-hint: [path-to-plan]

# Execute: Implement from Plan

## Plan to Execute

Read plan file: `$ARGUMENTS`

## Execution Instructions

**CRITICAL REQUIREMENT**: You MUST complete ALL validation levels defined in the plan's "VALIDATION COMMANDS" section before declaring the feature complete. Build success alone is NOT completion - you must execute every validation level in order and report results for each.

---

### 1. Read and Understand

- Read the ENTIRE plan carefully
- Read **AGENTS.md** for project conventions, tech stack, and validation commands
- Understand all tasks and their dependencies
- Note the validation commands to run (plan and/or AGENTS.md: e.g. `npm test`, `dotnet build`)
- Review the testing strategy (see **AGENTS.md** and **TESTING_STANDARDS.md** for this repo)
- **Check for design references** - If present, note them for visual validation later

### 2. Execute Tasks in Order

For EACH task in "Step by Step Tasks":

#### a. Navigate to the task
- Identify the file and action required
- Read existing related files if modifying

#### b. Implement the task
- Follow the detailed specifications exactly
- Follow project conventions in **AGENTS.md** (e.g. primary constructors, records for events, ResultExtensions for handler assertions)
- **If UI feature with design references**: Use design specifications from plan (colors, typography, spacing)
- Maintain consistency with existing code patterns
- Include proper types and documentation as appropriate for the stack
- Add structured logging where appropriate

#### c. Verify as you go
- After each file change, check syntax
- Ensure imports are correct
- Verify types are properly defined

### 3. Implement Testing Strategy

After completing implementation tasks:

- Create all test files specified in the plan
- Implement all test cases mentioned
- Follow the testing approach outlined
- Ensure tests cover edge cases

### 4. Run ALL Validation Levels (MANDATORY - DO NOT SKIP)

**CRITICAL**: You MUST complete EVERY validation level defined in the plan's "VALIDATION COMMANDS" section before declaring the feature complete. Build success alone is NOT sufficient.

**Execute each validation level from the plan in order:**

1. Read the "VALIDATION COMMANDS" section of the plan
2. Execute each level (Level 1, Level 2, Level 3, etc.) in sequence
3. For each level:
   - Run all commands specified
   - Follow all instructions given
   - Verify the gate/success criteria is met
   - ✅ Mark the level as complete in your notes
   - If it fails: fix the issue, re-run, continue only when it passes
4. Continue until ALL levels are complete

**Special attention for UI features:**
- Browser-based validation (typically Level 4) is MANDATORY
- You MUST use agent-browser to test the feature end-to-end
- You MUST verify the feature actually works in the browser
- Take screenshots as specified in the plan
- **CRITICAL - Dynamic Content Validation**:
  - **Verify elements are VISIBLE, not just present in HTML**: Use `agent-browser snapshot -i` to list interactive elements, then COUNT them
  - **Verify initial/default values are displayed**: Check counters show numbers (e.g., "150 characters left"), dropdowns show options, etc.
  - **Verify JavaScript dependencies**: If using Alpine.js, Vue, React, etc., verify the framework is loaded (check `_Layout.cshtml` or main layout)
  - **Example checks**:
    - Star rating: `snapshot -i | grep -i "star\|button" | wc -l` → Should show 5+ elements
    - Character counter: `get html '#charCount'` → Should show "150" not empty
    - Dropdown options: `snapshot -i | grep -i option` → Should list actual options
  - **If framework-dependent elements don't render** (e.g., Alpine.js `<template>` not expanding), the framework is likely NOT loaded → reimplement with vanilla JS or Hyperscript

**CRITICAL - Functional End-to-End Validation**:
  - **Visual validation alone is INSUFFICIENT** - you MUST test the complete user workflow
  - **Complete the full user action**: Fill forms completely, click submit buttons, verify success responses
  - **Detect and report errors**: If ANY error occurs (validation error, 500 error, console error), the feature is NOT complete
  - **FIX-RETRY LOOP (MANDATORY)**:
    1. Test the feature end-to-end in agent-browser
    2. **If any error/failure occurs**: STOP, investigate the error in code, fix the issue
    3. Re-test from the beginning with agent-browser
    4. Repeat steps 1-3 until the feature works WITHOUT ANY ERRORS
  - **NO SKIPPING**: Do NOT mark validation as complete if errors exist. Do NOT move to next phase while errors remain.
  - **Example complete test**:
    ```bash
    # BAD (incomplete): Only verified form elements exist
    agent-browser snapshot -i | grep "submit button"
    # ✗ Did not actually submit the form!
    
    # GOOD (complete): Tested full workflow
    agent-browser snapshot -i
    agent-browser fill @e1 "test data"
    agent-browser click @e2  # Submit button
    agent-browser get html body | grep -i "success\|error"
    # ✓ Verified form submits successfully without errors
    ```
  - **Error detection**: Check for error messages in response, HTTP error codes, console errors, validation failures
  - **Success criteria**: Feature completes the intended action successfully (data saved, page navigates, confirmation shown, etc.)

**DO NOT STOP after build succeeds** - continue through all levels defined in the plan.

### 5. Final Verification

Before completing, verify ALL items are checked:

- ✅ All tasks from plan completed
- ✅ All tests created and passing
- ✅ Level 1: Build validation PASSED
- ✅ Level 2: Unit tests PASSED
- ✅ Level 3: Integration tests PASSED
- ✅ Level 4: Browser validation PASSED (for UI features)
- ✅ Level 5: Manual validation PASSED
- ✅ Level 6: Visual validation PASSED (if designs provided)
- ✅ Level 7: Additional validation PASSED (if applicable)
- ✅ Code follows project conventions (AGENTS.md)
- ✅ Documentation added/updated as needed

### 6. Cleanup

**CRITICAL**: Stop all services you started during execution to avoid port conflicts in future runs.

- **If you started the application** (e.g., `npm start`, `dotnet run`, background services):
  - Stop all running processes via Ctrl+C or terminal kill commands
  - Verify ports are released (check for "port already in use" errors are prevented)
  - Close any agent-browser instances (`agent-browser close`)

## Output Report

Provide summary:

### Completed Tasks
- List of all tasks completed
- Files created (with paths)
- Files modified (with paths)

### Tests Added
- Test files created
- Test cases implemented
- Test results

### Validation Results

**YOU MUST COMPLETE AND REPORT ALL VALIDATION LEVELS FROM THE PLAN:**

For each validation level in the plan's "VALIDATION COMMANDS" section, report:

**Level [N]: [Level Name from Plan]**
- Status: [PASS/FAIL/N/A]
- Commands executed: [list]
- Output/Evidence: [snippet or description]
- Issues found: [None / List issues]
- Screenshot (if applicable): [Path]

Example:

**Level 1: Build Validation**
- Status: PASS
- Commands executed: `dotnet build --no-restore`, `npm start`
- Output: Build succeeded with 0 errors, services started successfully
- Issues found: None

**Level 4: Browser-Based Validation**  
- Status: PASS
- Tested: Login flow, modal appearance, star rating interaction, form submission
- Screenshot: .ai/validation-screenshots/feedback-modal.png
- Issues found: None

### Ready for Commit
- ✅ ALL validation levels completed and PASSED
- ✅ All changes are complete
- ✅ All services stopped and ports released
- ✅ Ready for commit (run validation from AGENTS.md before committing)

## Notes

- If you encounter issues not addressed in the plan, document them
- If you need to deviate from the plan, explain why
- If tests fail, fix implementation until they pass
- **NEVER skip validation steps** - ALL levels must be completed
- **NEVER declare completion without providing validation results for ALL levels**
- If a validation level doesn't apply (e.g., no design references), explicitly mark it as N/A in your report

## Completion Checklist

Before sending your final message, verify you have:

1. ✅ Completed ALL implementation tasks from the plan
2. ✅ Completed ALL test creation tasks from the plan
3. ✅ Executed EVERY validation level from the plan's "VALIDATION COMMANDS" section
4. ✅ All validation levels show PASS status (or N/A if not applicable)
5. ✅ Provided complete "Validation Results" report with status for EACH level from the plan
6. ✅ Taken and referenced screenshots (for UI features with browser validation)
7. ✅ Fixed any issues found during validation
8. ✅ **STOPPED all services started during execution** (application, Docker, browser, etc.)
9. ✅ **VERIFIED ports are released** and workspace is in clean state

**If ANY item above is not checked, the work is NOT complete.**

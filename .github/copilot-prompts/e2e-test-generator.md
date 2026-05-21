---
name: E2E Test Generator
description: Systematic end-to-end test generation using agent-browser for complete flow discovery
version: 1.0.0
authors: [Lubesoft QE Team]
tags: [playwright, testing, e2e, agent-browser]
---

# E2E Test Generator Prompt

**CRITICAL RULES**:
1. This prompt uses agent-browser for 100% of test discovery. Getting 70% or 99% through a flow is considered a FAILURE.
2. **EVERY test MUST start with login** - tests are completely independent and self-contained.
3. **NEVER use page.waitForTimeout()** - Always wait for specific elements, HTMX completion, or network idle instead.
4. If you get stuck or confused, STOP and ask the user for guidance before proceeding.
5. Reference the agent-browser SKILL.md for detailed instructions on how to use agent-browser effectively.

## Usage

```
@e2e-test-generator --feature="<feature-name>" --feature-url="<url-after-login>" --role="manager|cashier" [--description="<what the test should do>"]
```

**Note**: `--feature-url` is where the feature begins AFTER login (e.g., `/customers/manage`). The test will ALWAYS start by logging in first.

**Examples:**
```
@e2e-test-generator --feature="customer-search" --feature-url="/customers/manage" --role="manager"
@e2e-test-generator --feature="create-work-order" --feature-url="/" --role="manager" --description="Create work order with new vehicle and existing customer"
```

---

## Phase 1: User Input & Validation

**STOP and gather all required information:**

1. **Feature name**: What feature are we testing?
2. **Feature URL**: Where does the feature begin AFTER login? (e.g., `/`, `/customers/manage`, `/vehicles/manage`)
3. **Role**: Which user role? (manager or cashier)
4. **Description**: What should the test accomplish? (be specific)
5. **Store state**: Does the store need to be open first? (yes/no - default: ask user)

**Important**: Every test will start with login. The feature URL is where we navigate AFTER successful authentication.

**Validate with user:**
- "I'll create a test for **[feature]** as **[role]**"
- "The test will:
  1. Log in as [role]
  2. Navigate to **[feature-url]**
  3. **[description]**"
- "Does this sound correct? (yes/no)"

**If user says NO**: Ask what needs to change and restart Phase 1.

---

## Phase 2: Environment Check

**Before starting discovery, verify:**

1. Check if app is running:
   ```bash
   curl -s -o /dev/null -w "%{http_code}" http://localhost:5000
   ```
   - If NOT 200: Tell user "App is not running. Please run `npm start` first."
   - STOP until user confirms app is running

2. Check if store needs to be opened (if applicable):
   - If feature requires store to be open, ask user: "Should I open the store first?"
   - Record this for test setup

---

## Phase 3: Flow Discovery with agent-browser (CRITICAL)

**This phase MUST complete 100% of the flow. No exceptions.**

### Step 3.1: Login (MANDATORY FOR EVERY TEST)

**CRITICAL**: Every test MUST start with a complete login flow. No exceptions.

```bash
agent-browser open http://localhost:5000 --headed
agent-browser snapshot -i
```

Record ALL interactive elements. Then complete FULL login:
- For manager: username=`lubesoftmanager`, password=`$oftware2tesT`
- For cashier: username=`lubesoftuser`, password=`$oftware2tesT`

**🚨 CRITICAL - MFA Code Handling (DO NOT SKIP THIS):**
- **ALWAYS fill the MFA code field with "123456"**
- **Example workflow:**
  ```bash
  agent-browser snapshot -i  # Get element refs
  agent-browser fill @e4 "123456" && agent-browser click @e6
  ```

**🚨 CRITICAL - Wait Strategy (DO NOT USE TIMEOUTS):**
- **NEVER write**: `await page.waitForTimeout(1000);`
- **ALWAYS wait for specific elements instead**: `await page.waitForSelector('text=Mike Themanager');`
- **Example - BAD**:
  ```typescript
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(2000); // ❌ Brittle and arbitrary!
  ```
- **Example - GOOD**:
  ```typescript
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForSelector('text=Mike Themanager'); // ✅ Waits for specific element
  ```
- **For HTMX partial updates**: Use `await htmx.waitForHtmx();` instead of timeouts
- **For page navigation**: Wait for specific text/elements that only appear when page is ready
- **For modal open**: `await page.waitForSelector('[role="dialog"]');`
- **For loading complete**: `await page.waitForSelector('.loading-spinner', { state: 'hidden' });`

**Why?** Arbitrary timeouts are brittle - they work on fast machines but fail in CI or slower environments. Element-based waits are reliable and self-documenting

Complete MFA and workstation selection.

**Validation checkpoint:**
- Take screenshot: `agent-browser snapshot -s -o test-results/01-logged-in.png`
- Verify you see the home page with user menu
- **If login fails**: STOP and ask user "Login failed. Should I retry or is there an issue?"
- Verify you see the home page with user menu
- **If login fails**: STOP and ask user "Login failed. Should I retry or is there an issue?"

### Step 3.2: Open Store (if required)

**If user said store needs to be open:**

```bash
# Navigate to store open/setup and complete required steps
agent-browser snapshot -i
# Click appropriate buttons to open store
agent-browser snapshot -s -o test-results/02-store-opened.png
```

**Validation checkpoint:**
- Verify store is open
- **If fails**: STOP and ask user for guidance

### Step 3.3: Navigate to Feature URL

```bash
agent-browser open http://localhost:5000[FEATURE_URL]
agent-browser snapshot -i
agent-browser snapshot -s -o test-results/03-feature-page.png
```

**Validation checkpoint:**
- Verify you're on the correct page for the feature
- Record all interactive elements (buttons, links, inputs)
- **If page doesn't load**: STOP and ask user "Could not navigate to [URL]. Is this the correct feature starting point?"

### Step 3.3: Complete the ENTIRE Flow

**CRITICAL RULES:**
1. **Take a snapshot after EVERY action** - use `agent-browser snapshot -i` after every click/fill
2. **Record EVERY selector** - document every click, fill, keystroke
3. **Take screenshots at key points** - number them sequentially (03-xxx.png, 04-xxx.png, etc.)
4. **Verify each step succeeds** - check that the expected result occurred
5. **If ANY step fails**: STOP immediately and ask user for guidance

**For each action in the flow:**

```bash
# Example pattern:
agent-browser snapshot -i                     # See what's available
agent-browser click @e5                       # Click the element
agent-browser snapshot -s -o test-results/03-after-click.png
agent-browser snapshot -i                     # See the new state
```

**Record in a table:**

| Step | Action | Element Ref | Selector | Expected Result | Screenshot | Success? |
|------|--------|-------------|----------|-----------------|------------|----------|
| 1 | Click "Add New" | @e5 | button[name="Add New"] | Modal opens | 03-modal-open.png | ✅ |
| 2 | Fill "First Name" | @e7 | input[label="First Name"] | Value entered | 04-name-filled.png | ✅ |
| ... | ... | ... | ... | ... | ... | ... |

**IMPORTANT**: If you reach a step that doesn't work:
1. **STOP immediately**
2. Take a screenshot
3. Ask user: "Step [X] failed: [describe issue]. The element [selector] was not found/clickable. Should I:
   - Try a different selector?
   - Skip this step?
   - Use a different approach?
   Please advise."

### Step 3.4: Verify Flow Completion

**At the end of the flow:**

```bash
agent-browser snapshot -s -o test-results/99-final-state.png
```

**Ask yourself:**
- Did I complete ALL steps the user described?
- Did I reach the expected end state?
- Are there any error messages visible?

**If NO to any**: STOP and tell user "Flow incomplete. I reached [current state] but expected [end state]. What should I do?"

### Step 3.5: Cleanup

```bash
agent-browser close
```

### Step 3.6: Document the Complete Flow

**Create a markdown document** with:

```markdown
## Flow Discovery Results

### Feature: [feature name]
### Role: [role]
### Feature URL: [url after login]

### Complete Flow Steps:

**MANDATORY STEPS (every test):**

1. **Login as [role]**
   - Navigate to login page
   - Enter credentials
   - Complete MFA (code auto-filled for test users - don't replace it!)
   - Select workstation
   - Verify home page loads
   - Screenshot: 01-logged-in.png

2. **[Open store - if required]**
   - Navigate to store setup
   - Click open store button
   - Verify store is open
   - Screenshot: 02-store-opened.png

**FEATURE-SPECIFIC STEPS:**

3. **Navigate to feature starting point**
   - URL: [feature-url]
   - Verify correct page loaded
   - Screenshot: 03-feature-page.png

4. **[Action description]**
   - Selector: `[playwright selector]`
   - Element type: [button/input/link/etc]
   - Wait for: [what to wait for after action]
   - Screenshot: [filename]

5. **[Next action]**
   ...

### Data Requirements:
- [e.g., Unique customer name with timestamp]
- [e.g., Valid postal code for Oregon: 97219]

### Expected Final State:
- [e.g., Customer visible in search results]
- [e.g., Success message displayed]

### Validation Points:
- [e.g., Check database for customer record]
- [e.g., Verify page URL changed to /customers/[id]]

### Test Independence:
✅ Test starts with login - can run standalone
✅ Uses unique test data - can run multiple times
✅ No dependencies on other tests
```

**Show this to user and ask:** "I've discovered the complete flow with [X] steps. Does this match your expectations? (yes/no)"

**If user says NO**: Ask what's wrong and return to Step 3.3.

---

## Phase 4: Generate Page Objects (if needed)

**Only create Page Objects for complex, reusable components.**

**Ask user:** "Should I create Page Objects for this test, or use inline selectors? (Page Objects are better for reusable flows)"

**If YES:**

1. Create `tests/pages/[feature]-page.ts` with:
   - All selectors as methods
   - Reusable action methods
   - Validation methods

2. Follow the pattern in existing Page Objects in `tests/pages/`

---

## Phase 5: Generate Test File

**Create test file at:** `tests/[feature]/[feature].spec.ts`

**CRITICAL**: Every test MUST include login. Tests are fully independent and self-contained.

**Structure:**

```typescript
import { test, expect } from '../fixtures/htmx';
import { testConfig } from '../playwright.config';

test.describe('[Feature Name]', () => {
    test('[test description]', async ({ page, htmx }, testInfo) => {
        // Skip for wrong role
        test.skip(testInfo.project.name === '[opposite-role]', 'Requires [role] permissions');
        
        // Clear browser session to ensure clean state (prevent cached logins)
        await page.context().clearCookies();
        await page.context().clearPermissions();
        
        // Generate unique test data
        const timestamp = Date.now();
        const testData = {
            // ... unique data
        };

        // Step 1: Login as [role] (MANDATORY - EVERY TEST STARTS HERE)
        await page.goto(testConfig.baseURL);
        // ... complete login flow with credentials, MFA, workstation selection
        
        // Step 2: Open store (if required)
        // ... open store steps if needed
        
        // Step 3: Navigate to feature
        await page.goto(testConfig.baseURL + '[feature-url]');
        
        // Step 4+: Execute feature-specific actions
        await page.[selector].[action]
        
        // For HTMX interactions:
        await htmx.waitForHtmx();
        await page.waitForTimeout(1000);
        
        // ... continue with ALL steps from discovery
        
        // Final assertion
        await expect(page.[final-state-selector]).toBeVisible();
        
        console.log('✓ [Feature] test completed successfully');
    });
});
```

**CRITICAL**:
- **ALWAYS include login at the start** - no test should assume already logged in
- Include store opening if required
- Include EVERY step from the flow discovery
- Use the EXACT selectors discovered with agent-browser
- Add HTMX waits where needed (after clicks that trigger HTMX requests)
- Include proper wait times
- Add descriptive console.log statements
- Tests should be runnable in ANY order

---

## Phase 6: Validate Test

### Step 6.1: Run the Test

```bash
npx playwright test [feature] --project=[role] --reporter=line --headed
```

**Watch the test run in headed mode.**

### Step 6.2: Check Results

**If test PASSES**: ✅ Proceed to Phase 7

**If test FAILS**:

1. **Capture the error:**
   - Read the error message carefully
   - Note which line/step failed
   - Check the test-results/ folder for screenshots

2. **Diagnose the issue:**
   - Is it a timing issue? (add waits)
   - Is it a selector issue? (verify selector is correct)
   - Is it an HTMX issue? (add htmx.waitForHtmx())
   - Is it a modal/dialog issue? (check if modal is visible first)

3. **Ask user for guidance:**
   "Test failed at step [X]: [error message]
   
   I think the issue is: [your diagnosis]
   
   Should I:
   - Add a wait/timeout?
   - Change the selector?
   - Re-run agent-browser discovery for this step?
   - Something else?
   
   Please advise."

4. **DO NOT guess** - wait for user input before making changes

### Step 6.3: Fix and Retry

Based on user guidance:
- Make the specific fix
- Explain what you changed
- Re-run the test
- Repeat Steps 6.1-6.3 until test passes

**Maximum 3 retry attempts.**

**If still failing after 3 attempts**: 
"Test is still failing after 3 attempts. This needs hands-on debugging. Should we:
- Schedule a pairing session?
- Re-do the flow discovery?
- Simplify the test scope?"

---

## Phase 7: Final Validation

### Step 7.1: Run Test 3 Times

```bash
npx playwright test [feature] --project=[role] --reporter=line --repeat-each=3
```

**All 3 runs must pass.**

**If any run fails**: Return to Phase 6 - there's a flaky test issue.

### Step 7.2: Check Test Appears in UI

```bash
npx playwright test [feature] --list
```

**Verify:**
- Test appears in the list
- Test name is descriptive
- Test is assigned to correct project (manager/cashier)

### Step 7.3: Final Checklist

- [ ] Test passes consistently (3/3 runs)
- [ ] Test appears in Playwright UI
- [ ] Test uses unique test data (timestamps, etc.)
- [ ] Test has proper cleanup (if needed)
- [ ] Test has descriptive console.log statements
- [ ] Test has final assertion for success state
- [ ] Screenshots are saved in test-results/
- [ ] Code has no syntax errors
- [ ] Test follows project conventions (see tests/README.md)

**Show checklist to user:** "All items checked. Test is ready! Should I commit this?"

---

## Phase 8: Documentation

Create a summary for the user:

```markdown
## Test Creation Summary

**Feature**: [name]
**Test File**: tests/[feature]/[feature].spec.ts
**Role**: [manager/cashier]
**Status**: ✅ PASSED

### Test Flow ([X] steps):
1. [Step 1 description]
2. [Step 2 description]
...

### Test Data:
- [what data is created/used]

### Validation:
- [what is verified]

### Next Steps:
- Review the test file
- Run `npx playwright test [feature]` to verify
- Commit with message: `test: add E2E test for [feature]`
```

---

## Error Recovery Patterns

### Pattern 1: Element Not Found

**What happened**: Selector from agent-browser doesn't work in Playwright

**Fix**:
1. Re-run agent-browser for that specific step
2. Try alternative selectors (getByRole, getByLabel, getByText)
3. Check if element is in a modal/iframe
4. Ask user: "The element [X] wasn't found. Agent-browser found it, but Playwright can't. Should I try a different selector approach?"

### Pattern 2: Timing Issues

**What happened**: Element exists but isn't clickable yet

**Fix**:
1. Add `await element.waitFor({ state: 'visible', timeout: 5000 })`
2. For HTMX: Add `await htmx.waitForHtmx()`
3. Add `await page.waitForTimeout(1000)` as last resort

### Pattern 3: HTMX Modal Not Loading

**What happened**: Modal content is empty or wrong

**Fix**:
1. Check if modal ID is correct (#page-modal vs #AddCustomerModal)
2. Add `await htmx.waitForHtmx()` after the action that triggers modal
3. Add longer wait: `await page.waitForTimeout(2000)`
4. Check screenshot to see what actually loaded

### Pattern 4: Store Not Open

**What happened**: Test fails because store is closed

**Fix**:
1. Add store opening step at beginning of test
2. Or ask user: "Test requires store to be open. Should I add that to the test setup?"

---

## Success Criteria

**A test is considered COMPLETE when:**

1. ✅ Flow discovered 100% with agent-browser (no gaps)
2. ✅ Test file created with ALL steps
3. ✅ Test passes 3 consecutive times
4. ✅ Test appears in Playwright UI/reports
5. ✅ User confirms test meets requirements
6. ✅ Documentation created

**If ANY criterion is not met**: Test is INCOMPLETE - continue working or ask for guidance.

---

## Notes for QE Team

- **Always use headed mode** during discovery: `--headed`
- **Always ask when unsure** - don't guess
- **Screenshots are your friend** - take many
- **Validation at each step** - don't skip forward
- **3 retry limit** - if stuck, escalate
- **100% completion is mandatory** - partial tests are not acceptable

---

## Troubleshooting

**"Agent-browser daemon won't start"**
```bash
killall agent-browser
agent-browser open http://localhost:5000 --headed
```

**"Test is flaky"**
- Add more waits
- Use `waitFor()` instead of `waitForTimeout()`
- Check for HTMX requests

**"Modal won't close"**
- Check for validation errors
- Try clicking Cancel instead of OK
- Take screenshot to see actual state

**"Work Order flow isn't available"**
- Store must be open first
- User must have correct role/permissions
- Check if store setup is complete

---
agent: agent
description: Create a Product Requirements Document for the MembershipManager repository
---

argument-hint: [output-filename]

# Create PRD: Generate Product Requirements Document

## Overview

Generate a comprehensive Product Requirements Document (PRD) from the current conversation context and requirements. Use the repository root documentation files for project-specific context. In this repo, there is no `AGENTS.md`; instead consult `README.md`, `.github/copilot-instructions.md`, and the `MembershipManager.Client/package.json` and `MembershipManager/MembershipManager.csproj` files for tech stack and build conventions.

## Output File

Write the PRD to: `$ARGUMENTS` (default: `PRD.md`)

## PRD Structure

Create a well-structured PRD with the following sections. Adjust detail based on available information:

### Required Sections

1. Executive Summary
2. Mission
3. Target Users
4. MVP Scope
5. User Stories
6. Core Architecture & Patterns
7. Design References
8. Tools/Features
9. Technology Stack
10. Security & Configuration
11. API Specification
12. Success Criteria
13. Validation Plan
14. Implementation Phases
15. Future Considerations
16. Risks & Mitigations
17. Appendix

## Instructions

### 1. Context Sources
- Use `README.md` and `.github/copilot-instructions.md` in repository root
- Inspect `MembershipManager/Program.cs`, `MembershipManager/Configure.Db.cs`, `MembershipManager.csproj`
- Inspect `MembershipManager.Client/package.json`, `vite.config.ts`, `tsconfig.json`
- Inspect `.github/workflows/*.yml` for CI/CD validation flow
- Look up any referenced ticket or story in this repo's GitHub Projects board or linked GitHub issue cards. Use GitHub Projects as the source for acceptance criteria, story details, and task context instead of Jira.
- Note that `MembershipManager.Tests/IntegrationTest.cs` is currently commented out

### 2. Extract Requirements
- Review the conversation history
- Capture explicit requirements and implied needs
- Note technical constraints, build commands, and validation expectations
- Use assumptions only when necessary and state them clearly

### 3. Synthesize & Write
- Organize requirements into the section structure
- Use clear markdown formatting
- Keep language professional and action-oriented
- Include examples and concrete technical details where helpful

### 4. Quality Checks
- Confirm every required section appears
- Verify user stories include benefit statements
- Ensure the MVP scope is realistic for this repo’s tech stack
- Keep terminology consistent
- Include validation commands documented from repo build flow

## Technology & Validation Notes

- Backend: .NET 8.0, ASP.NET Core, ServiceStack 8.x, EF Core, OrmLite
- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4
- Testing: NUnit
- Deployment: Docker, GitHub Actions, Kamal
- Database: SQL Server by default; configurable via `AZURE_SQL_CONNECTIONSTRING`

## Validation Commands

Include repo-specific validation guidance:

- Frontend build:
  - `cd MembershipManager.Client`
  - `npm install`
  - `npm run build`
  - `npm run lint`
- Backend build:
  - `dotnet build`
- Tests:
  - `cd MembershipManager.Tests`
  - `dotnet test`
- Development:
  - `cd MembershipManager.Client && npm run dev`
  - `cd MembershipManager && npm run dev`
- Migrations:
  - `cd MembershipManager`
  - `npm run migrate`

## Output Requirements

After generating the PRD:
1. Confirm the output file path
2. Summarize PRD contents
3. Highlight any assumptions made
4. Suggest next steps

## Additional Guidance

- Trust the repo-specific instructions rather than global defaults
- Only search for more repo context if the available files are insufficient
- Emphasize `.github/copilot-instructions.md` and `README.md` for build and validation details
- If designs are referenced in conversation, include full design URLs if available

---

This prompt is now aligned with your project’s actual structure and build conventions, not the generic `.NET / HTMX` stack from the original example.

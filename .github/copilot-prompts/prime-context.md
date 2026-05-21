---
agent: agent
description: Prime agent with codebase understanding
---

# Prime: Load Project Context

## Objective

Build comprehensive understanding of the codebase by analyzing structure, documentation, and key files. In Cursor, **AGENTS.md** is the primary source for project context; use it first.

## Process

### 1. Analyze Project Structure

List all tracked files:
!`git ls-files`

Show directory structure:
On Linux/macOS, run: `tree -L 3 -I 'node_modules|__pycache__|.git|dist|build|bin|obj'`

### 2. Read Core Documentation

- Read **AGENTS.md** (project rules, tech stack, commands, reference docs)
- Read PRD.md or similar spec file if present
- Read README files at project root and major directories
- Read any architecture documentation (e.g. .ai/docs/, docs/architecture-decision-log/)
- For this repo: read .ai/docs/ and migrations/ as needed for database/event store understanding

### 3. Identify Key Files

Based on the structure and **AGENTS.md** → Key Files, identify and read:
- Main entry points (e.g. Program.cs, main.py, index.ts, app.py)
- Core configuration files (package.json, Lubesoft.sln, *.csproj, docker-compose.yml; see AGENTS.md)
- Key model/schema definitions
- Important service or controller files

### 4. Understand Current State

Check recent activity:
!`git log -10 --oneline`

Check current branch and status:
!`git status`

## Output Report

Provide a concise summary covering:

### Project Overview
- Purpose and type of application
- Primary technologies and frameworks
- Current version/state

### Architecture
- Overall structure and organization
- Key architectural patterns identified
- Important directories and their purposes

### Tech Stack
- Languages and versions
- Frameworks and major libraries
- Build tools and package managers
- Testing frameworks

### Core Principles
- Code style and conventions (from AGENTS.md: primary constructors, records for events, CQRS/event sourcing patterns)
- Documentation standards (.ai/docs/, TESTING_STANDARDS.md)
- Testing approach (xUnit, Playwright, coverage goals, what not to test)

### Current State
- Active branch
- Recent changes or development focus
- Any immediate observations or concerns

**Make this summary easy to scan - use bullet points and clear headers.**

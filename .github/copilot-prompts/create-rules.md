---
agent: agent
description: Create or update global rules (AGENTS.md) from codebase analysis
---

# Create Global Rules

Generate or update an AGENTS.md file by analyzing the codebase and extracting patterns. In Cursor, this file provides guidance to AI agents when working in this repository.

## Objective

Create project-specific global rules that give AI agents context about:
- What this project is
- Technologies used
- How the code is organized
- Patterns and conventions to follow
- How to build, test, and validate

## Phase 1: DISCOVER

### Identify Project Type

First, determine what kind of project this is:

| Type | Indicators |
|------|------------|
| Web App (Full-stack) | Separate client/server dirs, API routes |
| Full-stack (.NET) | src/WebApp, Worker, *.sln, Razor Pages, domain projects |
| Web App (Frontend) | React/Vue/Svelte, no server code |
| API/Backend | Express/Fastify/etc, or ASP.NET Core, no frontend |
| Library/Package | `main`/`exports` in package.json, or .NET class libraries, publishable |
| CLI Tool | `bin` in package.json, or dotnet tool, command-line interface |
| Monorepo | Multiple packages, workspaces config, or multiple .NET projects |
| Script/Automation | Standalone scripts, task-focused |

### Analyze Configuration

Look at root configuration files (adapt to project type):

```
package.json       → dependencies, scripts
*.sln / *.csproj   → .NET solution and projects (if applicable)
tsconfig.json      → TypeScript settings (if applicable)
vite.config.*      → Build tool (if applicable)
docker-compose.yml → Local services (if applicable)
```

### Map Directory Structure

Explore the codebase to understand organization:
- Where does source code live?
- Where are tests?
- Any shared code?
- Configuration locations?

## Phase 2: ANALYZE

### Extract Tech Stack

From package.json and config files, identify:
- Runtime/Language (Node, Bun, Deno, browser)
- Framework(s)
- Database (if any)
- Testing tools
- Build tools
- Linting/formatting

### Identify Patterns

Study existing code for:
- **Naming**: How are files, functions, classes named?
- **Structure**: How is code organized within files?
- **Errors**: How are errors created and handled?
- **Types**: How are types/interfaces defined?
- **Tests**: How are tests structured?

### Find Key Files

Identify files that are important to understand:
- Entry points
- Configuration
- Core business logic
- Shared utilities
- Type definitions

## Phase 3: GENERATE

### Create or Update AGENTS.md

Use the template at `AGENTS-template.md` (project root) as a starting point, if present.

**Output path**: `AGENTS.md` (project root)

**Adapt to the project:**
- Remove sections that don't apply
- Add sections specific to this project type
- Keep it concise - focus on what's useful

**Key sections to include:**

1. **Project Overview** - What is this and what does it do?
2. **Tech Stack** - What technologies are used?
3. **Commands** - How to dev, build, test, lint?
4. **Structure** - How is the code organized?
5. **Patterns** - What conventions should be followed?
6. **Key Files** - What files are important to know?

**Optional sections (add if relevant):**
- Architecture (for complex apps)
- API endpoints (for backends)
- Component patterns (for frontends)
- Database patterns (if using a DB)
- Reference documentation / on-demand context

## Phase 4: OUTPUT

```markdown
## Global Rules Created

**File**: `AGENTS.md`

### Project Type

{Detected project type}

### Tech Stack Summary

{Key technologies detected}

### Structure

{Brief structure overview}

### Next Steps

1. Review the generated `AGENTS.md`
2. Add any project-specific notes
3. Remove any sections that don't apply
4. Optionally add reference docs (e.g. `.ai/docs/` for this project)
```

## Tips

- Keep AGENTS.md focused and scannable
- Don't duplicate information that's in other docs (link instead)
- Focus on patterns and conventions, not exhaustive documentation
- Update it as the project evolves

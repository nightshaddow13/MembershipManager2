# AGENTS.md

## Project Overview

This repository is a full-stack .NET 8 and React SPA application for membership management. It combines a ServiceStack-based ASP.NET Core backend with a React 19 frontend built with Vite and Tailwind CSS.

The backend is implemented in `MembershipManager/` and includes authentication, EF Core/OrmLite database configuration, and ServiceStack APIs. The frontend lives in `MembershipManager.Client/` and contains a modern React + TypeScript application with file-based routing and markdown-powered content.

## Tech Stack

- .NET 8.0
- ASP.NET Core
- ServiceStack 8.x
- Entity Framework Core
- ServiceStack.OrmLite
- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Radix UI
- NUnit
- Docker
- GitHub Actions
- Kamal deployment

## Commands

### Backend

- `dotnet build` — build the entire solution from repository root
- `cd MembershipManager && npm run dev` — run backend development server with dotnet watch
- `cd MembershipManager && npm run migrate` — run migrations via ServiceStack AppTasks

### Frontend

- `cd MembershipManager.Client && npm install` — install dependencies
- `cd MembershipManager.Client && npm run build` — build the frontend
- `cd MembershipManager.Client && npm run lint` — run ESLint checks
- `cd MembershipManager.Client && npm run dev` — start Vite development server

### Tests

- `cd MembershipManager.Tests && dotnet test` — run unit tests

## Project Structure

- `MembershipManager/` — ASP.NET Core backend project
  - `Program.cs` — main app startup
  - `MembershipManager.csproj` — backend project definition
  - `Configure.*.cs` — modular startup configuration files
  - `Configure.Db.cs` — database connection and OrmLite setup
  - `Configure.Db.Migrations.cs` — migrations and AppTask registration
  - `appsettings.json` — runtime configuration
  - `Dockerfile` — multi-stage production container build

- `MembershipManager.Client/` — React frontend
  - `package.json` — frontend scripts and dependencies
  - `vite.config.ts` — Vite configuration with MDX and Tailwind support
  - `tsconfig.json` — TypeScript config
  - `src/` — application source files

- `MembershipManager.ServiceInterface/` — service implementations
- `MembershipManager.ServiceModel/` — shared request/response DTOs and types
- `MembershipManager.Tests/` — NUnit test project
- `.github/workflows/` — CI/CD pipeline definitions
- `config/deploy.yml` — Kamal deployment config

## Patterns & Conventions

- Use modular startup classes in the backend via `IHostingStartup` and `Configure.*.cs`
- Keep API contracts in `MembershipManager.ServiceModel/`
- Keep service logic in `MembershipManager.ServiceInterface/`
- Frontend pages and route definitions are managed using `vite-plugin-pages`
- Use `@/` path aliases in the frontend for imports from `src/`
- Maintain frontend typing with strict TS settings and `noUnusedLocals`/`noUnusedParameters`
- Prefer ServiceStack AppTasks for migrations and maintenance commands

## Validation and CI

### CI Workflows

- `.github/workflows/build.yml` — runs on push and PRs, executes `dotnet build` and `dotnet test`
- `.github/workflows/build-container.yml` — runs after successful build and builds Docker images; installs Node 22 for frontend packages
- `.github/workflows/release.yml` — deploys via Kamal after container pipeline success

### Validation Notes

- Node.js 22+ is required for frontend build and for `dotnet build` because the backend project references the SPA client
- SQL Server connection string defaults to `XAVIER-ASUS;Initial Catalog=MMData;Integrated Security=True;Trust Server Certificate=True`
- The backend also supports `AZURE_SQL_CONNECTIONSTRING` for Azure SQL or alternative connection settings
- Integration tests are currently commented out in `MembershipManager.Tests/IntegrationTest.cs`

## Known Issues and Observations

- ServiceStack license key configuration is referenced in `MembershipManager/Configure.AppHost.cs`
- Email confirmation is effectively bypassed in `MembershipManager.ServiceInterface/RegisterService.cs`
- Frontend dev HTTPS certificates are managed in `MembershipManager.Client/vite.config.ts` and may require `dotnet dev-certs` if not present

## Agent Guidance

- Trust the repository build instructions in `.github/copilot-instructions.md`
- Prefer changes in the existing modular backend structure rather than introducing new startup paradigms
- Keep frontend additions consistent with the Vite/React/Tailwind architecture
- Validate changes with both backend `dotnet build` and frontend `npm run build`
- Use the existing GitHub Actions workflows as the expected validation standard

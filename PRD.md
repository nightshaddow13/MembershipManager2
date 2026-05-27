# Product Requirements Document — Issue-driven: Update to .NET 10

This PRD is centered on GitHub Issue #73: "Update Project to .NET 10". The intent is to treat the migration to .NET 10 as the primary product goal for the next development cycle.

**Executive Summary**
- **Goal:** Migrate the MembershipManager repository to .NET 10 and update all dependent packages and CI so the application builds, tests, and publishes under the .NET 10 SDK.
- **Why:** Keep the codebase current with latest platform features, performance improvements, and security fixes; reduce technical debt.

**Scope (MVP for this initiative)**
- Update all backend projects to target `net10.0`.
- Update NuGet `PackageReference` items to .NET 10-compatible versions.
- Update GitHub Actions workflows to use .NET 10 SDK (`dotnet-version: '10.*'`).
- Validate that `dotnet build`, `dotnet test`, and Docker container build succeed.
- Ensure frontend build and SPA publish step continue to function (`npm run build` artifacts copied into `wwwroot`).

**Stakeholders & Target Users**
- **Engineers / Maintainers:** perform migration and verify compatibility.
- **CI/CD Operators:** ensure pipelines and container builds succeed.
- **Product Owners / Release Managers:** verify releases and approvals for production rollouts.

**User Story (from Issue #73)**
- As an engineer I want to update the application to .NET 10 so I have the most up to date coding practices.

**Acceptance Criteria (concrete)**
1. All `.csproj` files target `net10.0` and compile successfully using .NET 10 SDK.
2. CI workflows use `actions/setup-dotnet@v3` with `dotnet-version: '10.*'` and pass on GitHub Actions for the repository.
3. All updated NuGet packages are compatible and tests pass (unit tests and any enabled integration tests).
4. The frontend build pipeline (`MembershipManager.Client`) still produces valid `dist` artifacts and the backend publish copies them into `wwwroot`.
5. Docker image builds succeed and the container runs without startup exceptions.

**Migration Tasks (technical checklist)**
- Update project targets
  - Replace `<TargetFramework>net8.0</TargetFramework>` with `<TargetFramework>net10.0</TargetFramework>` in each `.csproj` under the solution.
- Update package versions
  - Bump EF Core, ASP.NET, ServiceStack, and Azure package references to versions compatible with .NET 10.
  - Check transitive dependencies and resolve any breaking changes.
- Update CI workflows
  - Update `.github/workflows/build.yml` and `build-container.yml` to use `dotnet-version: '10.*'`.
  - Run the workflows on a temporary branch to capture failures.
- Validate publishing and SPA integration
  - Confirm `MembershipManager.csproj` `CreateAppDataFolder`/publish steps still run `npm run build` and copy `MembershipManager.Client/dist` into publish `wwwroot`.
  - If `SpaProxy` or `SpaRoot` settings need adjustments for .NET 10, update them accordingly.
- Tests and fixes
  - Run `dotnet build` and `dotnet test` locally and in CI; address compile/test failures.
  - Re-enable integration tests in `MembershipManager.Tests/IntegrationTest.cs` once the migration is stable.
- Container build
  - Update Docker base images to .NET 10 runtime/sdk images if necessary and validate multi-stage build.

**Validation Commands**
Run locally before opening PR:

```powershell
dotnet --version
dotnet build
cd MembershipManager.Tests
dotnet test
cd ..\MembershipManager.Client
npm install
npm run build
```

CI checks (after PR): ensure `.github/workflows/build.yml` and `build-container.yml` pass.

**Risks & Mitigations**
- Risk: Breaking API changes in third-party packages.
  - Mitigation: Update packages incrementally, run tests after each set of changes, and pin working versions.
- Risk: CI failures due to different SDK behavior or build images.
  - Mitigation: Run actions on a branch, capture logs, and iterate until stable.
- Risk: ServiceStack or other commercial library licensing or compatibility issues.
  - Mitigation: Verify supported versions, consult vendor docs, test in staging.

**Rollback Plan**
- If migration causes regressions blocking progress, revert the PR and open smaller follow-up PRs targeting specific package upgrades and code fixes.

**Timeline & Phases**
- Phase 0 — Prep (1 day): update workflows, create migration branch, take backups of CI config.
- Phase 1 — Compile & fix (1–3 days): change TargetFrameworks, update packages, fix compile errors.
- Phase 2 — Tests & container (1–2 days): pass unit/integration tests and container build.
- Phase 3 — Merge & monitor (1 day): merge to main, monitor CI and staging runtime.

**Deliverables**
- PR(s) that update project targets and packages with clear commit messages.
- Updated GitHub Actions workflows using .NET 10.
- Passing CI and container builds.
- Updated `PRD.md` (this document) and a migration checklist issue/PR template.

**Appendix (affected files / places to inspect)**
- All `*.csproj` files in repository root projects and subprojects.
- `MembershipManager/MembershipManager.csproj` (SPA publish step and PackageReferences)
- `.github/workflows/build.yml` and `.github/workflows/build-container.yml`
- `Dockerfile` at `MembershipManager/Dockerfile` and any container build scripts
- `MembershipManager.Client/package.json` (frontend build integration)
- `MembershipManager.Tests/IntegrationTest.cs` (re-enable and validate integration tests)

# MembershipManager Product Requirements Document

## 1. Executive Summary

MembershipManager is a full-stack membership management application built as a .NET 8.0 backend with a React 19 SPA frontend. It is designed to manage organizational membership data, including users, units, schools, events, and related notes, while delivering secure authentication, modern UI, and automated deployment.

The project is structured to support rapid development, automated validation, and production deployment via GitHub Actions, Docker, and Kamal.

## 2. Mission

Enable administrators and membership coordinators to manage membership records, events, schools, units, and communications from a single web application with an intuitive React interface backed by a ServiceStack-powered API.

## 3. Target Users

- Membership coordinators
- Program administrators
- Event planners
- School and unit managers
- Support staff maintaining member data and event checklists

## 4. MVP Scope

Deliver a working membership administration platform with:
- secure user login and identity management
- backend data storage for people, schools, units, events, and notes
- frontend management UI for membership entities and navigation
- API contract support via ServiceStack DTOs
- build and deployment automation via GitHub Actions and Docker
- local development support for frontend and backend with hot reload

## 5. User Stories

1. As an administrator, I want to log in securely so I can manage membership data.
2. As a coordinator, I want to view and edit member units and schools so I can keep records current.
3. As an event planner, I want to create and manage events so I can organize membership activities.
4. As a user, I want the frontend to load quickly and provide responsive navigation.
5. As a developer, I want the project to build via standard commands so I can verify changes locally and in CI.
6. As an operator, I want automated container builds and deployment so production releases are repeatable.

## 6. Core Architecture & Patterns

- Backend: ASP.NET Core 8 hosted in `MembershipManager/`
- ServiceStack: APIs are exposed via ServiceStack services and DTOs in `MembershipManager.ServiceModel/`
- Data access: Entity Framework Core + OrmLite for migrations and database interaction
- Frontend: React 19 SPA in `MembershipManager.Client/` using Vite and Tailwind CSS 4
- SPA integration: `MembershipManager.csproj` builds frontend assets and publishes them into backend `wwwroot`
- Modular startup: `Configure.*.cs` files define database, auth, OpenAPI, background jobs, and request logging
- Routing: Vite plugin pages and React Router for frontend navigation
- HTTPS dev proxy: ASP.NET Core SpaProxy configured to proxy `/api` calls to the React dev server

## 7. Design References

- Repository README describes the overall project and servicestack React SPA origins.
- `.github/copilot-instructions.md` defines build, test, and deployment workflows for the repo.
- Frontend uses `vite-plugin-press`, MDX, Tailwind forms, typography, and animation plugins.
- No explicit external design URLs are provided in the repository.

## 8. Tools/Features

- React 19, Vite, TypeScript, Tailwind CSS 4
- ServiceStack client and server packages
- Radix UI components and Lucide icons
- `vite-plugin-pages` for file-based routing
- `vite-plugin-press` for markdown content support
- NUnit test project in `MembershipManager.Tests/`
- Docker multi-stage build and GitHub Actions CI/CD
- Kamal deployment orchestration for production

## 9. Technology Stack

- Backend: .NET 8.0, ASP.NET Core, ServiceStack 8.x, EF Core, OrmLite
- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4
- Database: SQL Server by default, with Azure SQL support via `AZURE_SQL_CONNECTIONSTRING`
- Testing: NUnit
- Deployment: Docker, GitHub Actions, Kamal

## 10. Security & Configuration

- Authentication: ASP.NET Identity configured in `Configure.Auth.cs`
- Local config: `MembershipManager/appsettings.json`, `appsettings.Development.json`
- Secrets: `UserSecretsId` used for local secrets management
- HTTPS dev setup: `MembershipManager.Client/vite.config.ts` generates dev certs automatically if needed
- Production deployment expects secrets and container registry credentials in GitHub Actions
- Azure configuration: optional `AZURE_SQL_CONNECTIONSTRING`, `APPSETTINGS_PATCH`, and deployment secrets

## 11. API Specification

The application exposes a ServiceStack API surface with request/response DTOs defined in `MembershipManager.ServiceModel/` and service implementations in `MembershipManager.ServiceInterface/`.

Key domain objects include:
- `Bookings`
- `ConfirmEmail`
- `Council`
- `District`
- `Event`, `EventNote`, `EventSchool`, `EventUnit`
- `School`, `SchoolNote`
- `Unit`, `UnitNote`, `UnitSchool`
- `Todos`
- `Hello` health/test endpoint

The frontend communicates with the backend through `/api` proxying during development and by serving static assets from backend `wwwroot` in production.

## 12. Success Criteria

- `dotnet build` passes successfully at repository root
- `cd MembershipManager.Client && npm install && npm run build && npm run lint` passes with no warnings
- `cd MembershipManager.Tests && dotnet test` passes or reports valid test results
- Backend and frontend can run locally with `npm run dev`
- Docker publish produces a working container image using `dotnet publish --os linux --arch x64 -c Release`
- CI workflow completes on push and PRs
- Deployment workflow can bootstrap and deploy via Kamal if configured

## 13. Validation Plan

Local validation commands:
- `cd MembershipManager.Client && npm install`
- `cd MembershipManager.Client && npm run build`
- `cd MembershipManager.Client && npm run lint`
- `dotnet build`
- `cd MembershipManager.Tests && dotnet test`
- `cd MembershipManager && npm run dev`
- `cd MembershipManager.Client && npm run dev`
- `cd MembershipManager && npm run migrate`

CI validation:
- `.github/workflows/build.yml` runs `dotnet build` and `dotnet test`
- `.github/workflows/build-container.yml` runs frontend install/build and `dotnet publish` to Docker
- `.github/workflows/release.yml` runs Kamal bootstrap, permissions, migration, and deploy

## 14. Implementation Phases

Phase 1: Establish core platform
- Implement login/auth
- Build backend API contracts and services
- Create frontend entity pages
- Wire Vite SPA into ASP.NET Core publish flow

Phase 2: Data management and workflows
- Add unit, school, event, and note management
- Add migrations and seed data
- Harden API responses and validation

Phase 3: CI/CD and deployment
- Validate build pipeline
- Add container build and registry publishing
- Configure Kamal deployment
- Add environment patching and config management

Phase 4: polish and operational maturity
- Add documentation, monitoring, and health checks
- Enable integration tests
- Add production-ready security and license config

## 15. Future Considerations

- Extend membership features with user roles, reporting, and analytics
- Add rich event scheduling and calendar views
- Add support for multi-tenant membership organizations
- Harden production security with explicit ServiceStack license setup
- Add more end-to-end or integration tests beyond current NUnit coverage
- Support alternative databases beyond SQL Server/SQLite

## 16. Risks & Mitigations

- Risk: Integration tests currently commented out in `MembershipManager.Tests/IntegrationTest.cs`
  - Mitigation: enable and validate tests, then add CI coverage
- Risk: Email confirmation behavior is bypassed in `MembershipManager.ServiceInterface/RegisterService.cs`
  - Mitigation: implement full confirmation flow before production use
- Risk: ServiceStack license requirement for production deployment
  - Mitigation: ensure license key configuration is added in `Configure.AppHost.cs`
- Risk: Local SQL Server dependency on `XAVIER-ASUS` connection string
  - Mitigation: document and support `AZURE_SQL_CONNECTIONSTRING` or local SQLite dev path
- Risk: dev HTTPS certificate generation may fail on non-Windows environments
  - Mitigation: validate `vite.config.ts` cert logic and document requirements

## 17. Appendix

- Repository root documentation: `README.md`, `.github/copilot-instructions.md`
- Backend solution: `MembershipManager.sln`
- Backend project: `MembershipManager/MembershipManager.csproj`
- Frontend package: `MembershipManager.Client/package.json`
- Frontend config: `MembershipManager.Client/vite.config.ts`, `MembershipManager.Client/tsconfig.json`
- CI workflows: `.github/workflows/build.yml`, `.github/workflows/build-container.yml`, `.github/workflows/release.yml`
- Deployment config: `config/deploy.yml`
- Local database config: `MembershipManager/appsettings.json`, `Configure.Db.cs`

> Assumptions: The product is scoped as an internal membership management platform rather than a public-facing consumer app. No external design URLs were available in the repository, so the PRD is based on code structure and build documentation.

# Feature: Fix .NET 10 Migration Gaps

This plan covers the final validation and gap analysis for the .NET 10 migration on the `uow/73` branch, without making any code changes during this planning phase.

## Feature Description

Verify and document the remaining migration gaps for the MembershipManager repository after its move to .NET 10. This includes validating project targets, CI workflow settings, Docker build configuration, frontend publish semantics, and documentation consistency.

## User Story

As an engineer,
I want the .NET 10 migration to be fully validated and gap-free,
So that the migration branch can be merged confidently and the repository remains stable.

## Problem Statement

The repository has already been migrated to .NET 10 in source files, but there are remaining gaps in build path consistency, container build output assumptions, Node version alignment, and documentation. These gaps must be identified and resolved before the migration is considered complete.

## Solution Statement

Perform a structured review of the current repository state, validate the key build/test commands, inspect CI and Docker workflows for .NET 10 correctness, and document any remaining gaps or risks for the migration.

## Feature Metadata

**Feature Type**: Refactor / Migration
**Estimated Complexity**: Medium
**Primary Systems Affected**: Backend build, frontend build, CI workflows, Docker container pipeline
**Dependencies**: .NET 10 SDK, GitHub Actions, Node.js 22+ for CI, Node.js 18 for Dockerfile client stage

---

## CONTEXT REFERENCES

### Relevant Codebase Files

- `MembershipManager/MembershipManager.csproj` - .NET 10 target, SPA publish step, package references, and client build copy semantics.
- `MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj` - .NET 10 target and ServiceStack package versions.
- `MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj` - .NET 10 target and shared DTO package references.
- `MembershipManager.Tests/MembershipManager.Tests.csproj` - .NET 10 target, NUnit packages, and test project validation.
- `MembershipManager.Client/package.json` - frontend build scripts and dependency matrix.
- `.github/workflows/build.yml` - root build/test workflow with .NET 10 settings.
- `.github/workflows/build-container.yml` - container workflow with Docker publish and .NET 10 SDK setup.
- `MembershipManager/Dockerfile` - multi-stage Docker build with ASP.NET runtime, .NET SDK, and Node client build.
- `.github/copilot-instructions.md` / `AGENTS.md` - repository docs still referencing .NET 8.

### Patterns to Follow

- Preserve existing modular backend startup conventions and SPA publish mechanics.
- Keep GitHub Actions using `actions/setup-dotnet@v3` with .NET 10.
- Maintain Docker multi-stage build style with separate Node client build and .NET backend publish stages.
- Respect frontend package compatibility with Node 22 in CI and Node 18 in Dockerfile, while documenting any mismatch.

---

## IMPLEMENTATION PLAN

### Phase 1: Review Current Migration State

Tasks:
- Review all project files for `net10.0` targets and aligned package versions.
- Review GitHub Actions workflows for .NET 10 SDK configuration.
- Review Dockerfile for runtime/sdk stages and client build output path.
- Review documentation references for stale .NET 8 terminology.

### Phase 2: Local Validation

Tasks:
- Run `dotnet --version` and `dotnet build` from repository root.
- Run `cd MembershipManager.Tests && dotnet test`.
- Run `cd MembershipManager.Client && npm install && npm run build`.
- Confirm the frontend output folder matches publish expectations.

### Phase 3: CI & Docker Validation

Tasks:
- Confirm `.github/workflows/build.yml` uses `dotnet-version: '10.*'`.
- Confirm `.github/workflows/build-container.yml` uses `dotnet-version: '10.0'` and Node 22.
- Confirm `MembershipManager/Dockerfile` uses `mcr.microsoft.com/dotnet/aspnet:10.0` and `mcr.microsoft.com/dotnet/sdk:10.0`.
- Review Dockerfile client build path mismatch between `build` and `dist` output directories.
- Estimate whether Node 18 in Docker is acceptable or should be aligned with CI Node 22.

### Phase 4: Migration Readiness Checklist

Tasks:
- Document all remaining gaps and technical risks.
- Confirm the build/test steps required for merge readiness.
- Confirm any stale documentation references that must be updated after validation.
- Capture any zero-test/no-coverage risks in the current branch.

---

## STEP-BY-STEP TASKS

### Task 1: REVIEW `MembershipManager/MembershipManager.csproj`
- IMPLEMENT: Verify `<TargetFramework>net10.0</TargetFramework>` and package versions.
- PATTERN: preserve `CreateAppDataFolder` publish target and SPA copy semantics.
- GOTCHA: publish logic copies from `../MembershipManager.Client/dist/**/*.*`, while Dockerfile copies from `/app/MembershipManager.Client/build`.
- VALIDATE: `dotnet build MembershipManager/MembershipManager.csproj`

### Task 2: REVIEW `MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj`
- IMPLEMENT: Verify .NET 10 target and ServiceStack package alignment.
- GOTCHA: ServiceStack package versions must be consistent across all projects.
- VALIDATE: `dotnet build MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj`

### Task 3: REVIEW `MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj`
- IMPLEMENT: Verify .NET 10 target and ProjectReference/package references.
- VALIDATE: `dotnet build MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj`

### Task 4: REVIEW `MembershipManager.Tests/MembershipManager.Tests.csproj`
- IMPLEMENT: Verify .NET 10 target and NUnit/MS Test SDK dependencies.
- GOTCHA: test discovery may report zero tests if existing test files are commented out.
- VALIDATE: `cd MembershipManager.Tests && dotnet test`

### Task 5: REVIEW `.github/workflows/build.yml`
- IMPLEMENT: Confirm workflow uses `actions/setup-dotnet@v3` with `dotnet-version: '10.*'`.
- VALIDATE: review file; no runtime command required.

### Task 6: REVIEW `.github/workflows/build-container.yml`
- IMPLEMENT: Confirm workflow uses `actions/setup-dotnet@v3` with `dotnet-version: '10.0'` and Node 22.
- GOTCHA: this workflow publishes a container and updates Azure App Service; validate only the .NET 10 configuration.
- VALIDATE: review file; no runtime command required.

### Task 7: REVIEW `MembershipManager/Dockerfile`
- IMPLEMENT: Confirm `FROM mcr.microsoft.com/dotnet/aspnet:10.0`, `sdk:10.0`, and `node:18-alpine`.
- GOTCHA: the Docker client build outputs `MembershipManager.Client/build`, while project publish targets `MembershipManager.Client/dist`.
- VALIDATE: optional `docker build -f MembershipManager/Dockerfile -t mm-test .`

### Task 8: RUN FRONTEND BUILD VALIDATION
- IMPLEMENT: Execute frontend install/build and verify success.
- GOTCHA: package-lock supports Node 18+ and Node 22, but CI and Docker currently use different Node versions.
- VALIDATE: `cd MembershipManager.Client && npm install && npm run build`

### Task 9: RUN BACKEND BUILD VALIDATION
- IMPLEMENT: Execute `dotnet build` on the entire repository.
- GOTCHA: build warnings are acceptable for current migration validation but should be captured.
- VALIDATE: `dotnet build`

### Task 10: RUN TEST VALIDATION
- IMPLEMENT: Execute the test project and document results.
- GOTCHA: existing NUnit tests may not run if the test class is commented out.
- VALIDATE: `cd MembershipManager.Tests && dotnet test`

### Task 11: DOCUMENT MIGRATION GAPS
- IMPLEMENT: Capture any remaining inconsistencies, warnings, or missing validation coverage.
- VALIDATE: ensure the plan lists the gap(s) clearly.

---

## TESTING STRATEGY

### Unit Tests
- Run `dotnet test` in `MembershipManager.Tests`.
- Document whether test discovery finds zero tests and note the existing commented-out coverage gap.

### Integration Tests
- No integration tests are currently enabled; confirm the branch is not dependent on them for migration validation.

### Frontend Build Validation
- Run `npm install` and `npm run build` in `MembershipManager.Client`.
- Confirm build output matches the published asset expectations.

### CI Workflow Validation
- Review the workflow YAML files for `.NET 10` correctness.
- Confirm the build container workflow uses .NET 10 and Node 22.

---

## VALIDATION COMMANDS

### Level 1: Build Validation
```bash
cd c:\Users\xgoss\source\repos\nightshaddow13\MembershipManager2
dotnet --version
dotnet build
```

### Level 2: Unit Tests
```bash
cd c:\Users\xgoss\source\repos\nightshaddow13\MembershipManager2\MembershipManager.Tests
dotnet test
```

### Level 3: Frontend Build
```bash
cd c:\Users\xgoss\source\repos\nightshaddow13\MembershipManager2\MembershipManager.Client
npm install
npm run build
```

### Level 4: Docker Build Review
```bash
cd c:\Users\xgoss\source\repos\nightshaddow13\MembershipManager2
docker build -f MembershipManager/Dockerfile -t membershipmanager-net10-test .
```

---

## ACCEPTANCE CRITERIA

- [ ] All projects target `net10.0` and compile successfully.
- [ ] `dotnet build` passes from repository root.
- [ ] `cd MembershipManager.Tests && dotnet test` passes and test discovery behavior is documented.
- [ ] `cd MembershipManager.Client && npm install && npm run build` passes.
- [ ] CI workflow files use .NET 10 correctly.
- [ ] Dockerfile uses .NET 10 runtime and SDK stages.
- [ ] Remaining migration gaps are documented.
- [ ] No code changes are made during this planning phase.

---

## COMPLETION CHECKLIST

- [ ] Reviewed `MembershipManager.csproj`, dependent csproj files, and package versions.
- [ ] Validated local backend build with .NET 10.
- [ ] Validated local test execution.
- [ ] Validated local frontend build.
- [ ] Reviewed CI workflows for .NET 10 compatibility.
- [ ] Reviewed Dockerfile for .NET 10 and SPA publish alignment.
- [ ] Documented any issues, warnings, or mismatches.

---

## NOTES

- The current branch has already moved target frameworks to `.NET 10` in all primary projects.
- The main remaining gap is the Dockerfile/SPA build output path mismatch between `build` and `dist`.
- The current test project may report zero tests if the only test class remains commented out.
- Documentation files still referencing `.NET 8` should be updated after this validation phase.

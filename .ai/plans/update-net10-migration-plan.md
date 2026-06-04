# Feature: Update Project to .NET 10

This plan covers review, validation, and readiness checks for the current .NET 10 migration branch in `MembershipManager2`.

## Feature Description

Migrate the existing repository from .NET 8 to .NET 10 while verifying the backend build, test suite, frontend build, CI workflows, and Docker container pipeline.

## User Story

As an engineer,
I want the MembershipManager project to be fully validated on .NET 10,
So that the migration branch can be merged with confidence and CI passes.

## Problem Statement

The repository has been updated to target .NET 10, but the migration must be validated end-to-end before phase 3 merge actions are taken. This includes ensuring all projects compile, tests execute, frontend build succeeds, CI workflows use the correct SDK, and the Docker build/publish flow still works.

## Solution Statement

Perform a structured review of the current repo state, validate critical build and test commands, and inspect CI workflow definitions and container build setup for .NET 10 compatibility. Capture any issues or gaps found during validation.

## Feature Metadata

**Feature Type**: Refactor / Migration
**Estimated Complexity**: Medium
**Primary Systems Affected**: Backend build, frontend build, CI workflows, Docker container pipeline
**Dependencies**: .NET 10 SDK, GitHub Actions, Node.js 22+ for CI, Node.js 18 in Dockerfile client build

---

## CONTEXT REFERENCES

### Relevant Codebase Files

- `MembershipManager/MembershipManager.csproj` - current .NET 10 target, SPA publish step, package references, container labels, SPA proxy settings.
- `MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj` - .NET 10 target and ServiceStack package references.
- `MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj` - .NET 10 target and ServiceStack Interfaces dependency.
- `MembershipManager.Tests/MembershipManager.Tests.csproj` - .NET 10 target, NUnit 4, test adapter, ServiceStack dependencies.
- `MembershipManager.Client/package.json` - React frontend build scripts and dependencies.
- `.github/workflows/build.yml` - build/test CI workflow using .NET 10.
- `.github/workflows/build-container.yml` - container workflow using .NET 10 and GitHub Container Registry.
- `MembershipManager/Dockerfile` - multi-stage Docker pipeline with .NET 10 runtime/sdk.

### Existing Validation Results

- Local `dotnet build` succeeded on .NET 10.0.300.
- Local `dotnet test` succeeded but discovered 0 NUnit tests due to commented-out test code.
- Frontend validation command (`npm install && npm run build`) was attempted but canceled before completion; the plan will include a retry.
- Backend build produced warnings from non-nullable reference types and unused parameters that should be noted, though not blocking.

### Patterns to Follow

- Keep the existing modular backend startup pattern in `Configure.*.cs`.
- Preserve SPA publish semantics in `MembershipManager.csproj`: build frontend, copy `MembershipManager.Client/dist/**/*` into publish `wwwroot`.
- Maintain GitHub Actions pattern: `actions/setup-dotnet@v3` with .NET 10, `actions/setup-node@v3` for frontend.
- Keep Docker multi-stage build approach with `node:18-alpine` for client build and `mcr.microsoft.com/dotnet/sdk:10.0` for backend.

---

## IMPLEMENTATION PLAN

### Phase 1: Review Current Migration State

Tasks:
- Review `MembershipManager.csproj` for correct target framework, SPA publish settings, and package versions.
- Review `.github/workflows/build.yml` and `.github/workflows/build-container.yml` for .NET 10 SDK configuration.
- Review `MembershipManager/Dockerfile` for .NET 10 runtime/sdk stages and frontend build stage.
- Review package versions in `MembershipManager.ServiceInterface`, `MembershipManager.ServiceModel`, and `MembershipManager.Tests`.

### Phase 2: Local Validation

Tasks:
- Run `dotnet --version` and `dotnet build` from repo root.
- Run `cd MembershipManager.Tests && dotnet test` and confirm test discovery.
- Run `cd MembershipManager.Client && npm install && npm run build` to verify frontend pipeline.
- Inspect warnings in the backend build output and note whether they are migration-related.

### Phase 3: CI & Docker Validation

Tasks:
- Confirm `build.yml` uses `dotnet-version: '10.*'`.
- Confirm `build-container.yml` uses `dotnet-version: '10.0'` and Node 22 for frontend CI.
- Confirm Dockerfile uses `mcr.microsoft.com/dotnet/aspnet:10.0` and `mcr.microsoft.com/dotnet/sdk:10.0`.
- Compare Dockerfile Node version (`node:18-alpine`) with CI Node version (22) and document the version mismatch.
- Validate that `dotnet publish` in the Docker build is compatible with the current project and that SPA build outputs are copied into `wwwroot`.

### Phase 4: Phase-3 Readiness Checklist

Tasks:
- Confirm there are no merge-conflict or incomplete migration items in the modified csproj files.
- Confirm there are no missing `dotnet` or `npm` validation steps in the PRD.
- Confirm the branch can be merged after the frontend build passes and CI workflows are verified.
- Document any remaining warnings or test coverage gaps for phase 3.

---

## STEP-BY-STEP TASKS

1. REVIEW `MembershipManager/MembershipManager.csproj`
   - IMPLEMENT: Confirm `<TargetFramework>net10.0</TargetFramework>` and package versions are consistent.
   - IMPORTS: `Microsoft.AspNetCore.SpaProxy`, `Microsoft.EntityFrameworkCore.*`, `ServiceStack` 10.0.6.
   - GOTCHA: The publish target runs `npm run build` in `../MembershipManager.Client` and copies from `dist`, while the Dockerfile copies from `/app/MembershipManager.Client/build`.
   - VALIDATE: `dotnet build MembershipManager/MembershipManager.csproj`

2. REVIEW `MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj`
   - IMPLEMENT: Confirm .NET 10 target and ServiceStack packages.
   - GOTCHA: ServiceStack package versions must align across projects.
   - VALIDATE: `dotnet build MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj`

3. REVIEW `MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj`
   - IMPLEMENT: Confirm .NET 10 target and `ServiceStack.Interfaces` dependency.
   - VALIDATE: `dotnet build MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj`

4. REVIEW `MembershipManager.Tests/MembershipManager.Tests.csproj`
   - IMPLEMENT: Confirm .NET 10 target and NUnit integration packages.
   - GOTCHA: Existing test file is commented out; test discovery returns 0 tests.
   - VALIDATE: `cd MembershipManager.Tests && dotnet test`

5. REVIEW `.github/workflows/build.yml`
   - IMPLEMENT: Confirm build job uses `actions/setup-dotnet@v3` and `dotnet-version: '10.*'`.
   - GOTCHA: The workflow runs `dotnet test` from the `MembershipManager.Tests` folder after the root build.
   - VALIDATE: no command required beyond CI review.

6. REVIEW `.github/workflows/build-container.yml`
   - IMPLEMENT: Confirm workflow triggers on successful Build and uses `dotnet-version: '10.0'`.
   - GOTCHA: The workflow installs `x` tool globally and pushes to GHCR; the project may require valid secrets in CI.
   - VALIDATE: no command required beyond CI review.

7. REVIEW `MembershipManager/Dockerfile`
   - IMPLEMENT: Confirm `FROM mcr.microsoft.com/dotnet/aspnet:10.0`, `sdk:10.0`, and `node:18-alpine` usage.
   - GOTCHA: Client build output directory differs from `MembershipManager.csproj` publish logic (`build` vs `dist`).
   - VALIDATE: `docker build -f MembershipManager/Dockerfile -t mm-test .` (optional if env available)

8. RUN FRONTEND VALIDATION
   - IMPLEMENT: Execute `cd MembershipManager.Client && npm install && npm run build`.
   - GOTCHA: This must complete successfully before phase 3 merge.
   - VALIDATE: `cd MembershipManager.Client && npm install && npm run build`

9. RUN BACKEND VALIDATION
   - IMPLEMENT: Execute `dotnet --version && dotnet build` from repo root.
   - GOTCHA: Accept warnings for now, but note them for follow-up.
   - VALIDATE: `dotnet --version && dotnet build`

10. RUN TEST VALIDATION
    - IMPLEMENT: Execute `cd MembershipManager.Tests && dotnet test`.
    - GOTCHA: The result may show 0 discovered tests because the test file is commented out.
    - VALIDATE: `cd MembershipManager.Tests && dotnet test`

11. DOCUMENT RISKS
    - IMPLEMENT: Note the warning list and the commented-out test coverage gap.
    - VALIDATE: Confirm the plan includes these items.

---

## TESTING STRATEGY

### Unit Tests

- Use `dotnet test` in `MembershipManager.Tests`.
- Confirm NUnit discovers tests or document that no tests are currently present.
- If relevant, enable at least one test in `MembershipManager.Tests/UnitTest.cs` before merge.

### Integration Tests

- No integration tests are currently enabled per PRD and local branch state.
- Confirm the branch does not depend on integration test execution.

### Frontend Build Validation

- Confirm `npm install` and `npm run build` complete without errors.
- Confirm the output folder exists and matches expectations for production publish.

### CI Workflow Validation

- Review GitHub Actions definitions for .NET 10 settings.
- Confirm `build-container.yml` is correctly configured to publish a .NET 10 container image and update App Service.

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

### CI Review

- Inspect `.github/workflows/build.yml` and `.github/workflows/build-container.yml` for .NET 10 references.
- Verify `build-container.yml` node version mismatch is acceptable or adjust if needed.

---

## ACCEPTANCE CRITERIA

- [ ] All projects target `net10.0` and compile successfully.
- [ ] `dotnet build` passes from repository root.
- [ ] `cd MembershipManager.Tests && dotnet test` passes and test discovery behavior is documented.
- [ ] `cd MembershipManager.Client && npm install && npm run build` passes.
- [ ] CI workflow files use .NET 10 correctly.
- [ ] Dockerfile uses .NET 10 runtime and SDK stages.
- [ ] Any build warnings or test coverage gaps are documented for phase 3.
- [ ] No code changes are required in this validation-only plan phase.

---

## COMPLETION CHECKLIST

- [ ] Review `MembershipManager.csproj`, dependent csproj files, and package versions.
- [ ] Validate local backend build with .NET 10.
- [ ] Validate local test execution.
- [ ] Validate local frontend build.
- [ ] Review CI workflows for .NET 10 compatibility.
- [ ] Review Dockerfile for .NET 10 and SPA publish alignment.
- [ ] Document any issues, warnings, or mismatches.

---

## NOTES

- The local backend build is already successful on .NET 10.0.300.
- The frontend build command was attempted but canceled; it must be rerun.
- The current test project has zero discovered NUnit tests because its only test file is commented out.
- The Dockerfile uses Node 18 for client build while CI uses Node 22; this should be reviewed for compatibility.

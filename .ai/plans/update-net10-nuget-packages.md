# Feature: Update NuGet packages to .NET 10

The following plan is for phase 2 of the .NET 10 migration: update all NuGet package references in backend projects to the latest .NET 10-compatible versions.

## Feature Description

Upgrade the repository's NuGet dependencies so every backend project uses the most recent stable .NET 10-compatible package versions. This helps eliminate dependency drift, reduces future migration friction, and ensures the current .NET 10 target is supported by all key runtime packages.

## User Story

As a maintainer,
I want all backend NuGet dependencies updated to the latest .NET 10-compatible versions,
So that the project dependencies remain current and the .NET 10 migration remains stable.

## Problem Statement

The solution currently references packages with mixed version patterns: explicit older versions for some Azure packages, `8.*` wildcards for ServiceStack packages, and `10.*` wildcards for ASP.NET packages. The repository must be aligned with stable .NET 10-compatible package versions to complete the migration and avoid hidden runtime or compatibility issues.

## Solution Statement

Perform a targeted NuGet dependency audit across backend project files, identify the latest stable .NET 10-compatible package versions, and update the package references in `MembershipManager`, `MembershipManager.ServiceInterface`, `MembershipManager.ServiceModel`, and `MembershipManager.Tests`. After updating, restore packages, build the solution, run tests, and fix any compatibility issues introduced by package changes.

## Feature Metadata

- Feature Type: Refactor / Maintenance
- Estimated Complexity: Medium
- Primary Systems Affected: Backend build, tests, dependency management
- Dependencies: .NET 10 SDK, NuGet package registry, ServiceStack package compatibility

---

## CONTEXT REFERENCES

### Relevant Codebase Files

- `MembershipManager/MembershipManager.csproj` - main backend host package references and runtime dependencies
- `MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj` - service implementation package references
- `MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj` - DTO/package references for shared contract assembly
- `MembershipManager.Tests/MembershipManager.Tests.csproj` - test dependencies and ServiceStack test host packages
- `.ai/plans/migrate-dotnet-10-phase-1.md` - phase 1 plan; phase 2 must stay within NuGet update scope

### Current Package Patterns

- ASP.NET focused packages use `10.*` wildcard ranges
- ServiceStack packages use `8.*` wildcard ranges
- Some Azure packages are pinned to explicit older versions
- Test packages use major wildcard ranges such as `3.*`, `4.*`, and `17.*`

### Patterns to Follow

- Keep project-specific `PackageReference` entries consistent with existing style
- Prefer stable exact versions after verification if package restore is deterministic
- Use `dotnet list package --outdated` or NuGet.org to confirm the latest .NET 10-compatible versions
- Do not modify CI workflows or Docker images in this phase
- Do not update frontend npm dependencies in this phase

---

## IMPLEMENTATION PLAN

### Phase 1: Inventory

- READ the current package references in the four backend `.csproj` files
- USE `dotnet list package --outdated` or NuGet package metadata to identify the newest stable versions compatible with .NET 10
- DOCUMENT the current and target versions before changing files

### Phase 2: Update Package References

- UPDATE `MembershipManager/MembershipManager.csproj` package references
- UPDATE `MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj` package references
- UPDATE `MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj` package references
- UPDATE `MembershipManager.Tests/MembershipManager.Tests.csproj` package references

Packages to verify and update include, but are not limited to:

- `Microsoft.AspNetCore.SpaProxy`
- `Microsoft.AspNetCore.Diagnostics.EntityFrameworkCore`
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore`
- `Microsoft.EntityFrameworkCore.Sqlite`
- `Microsoft.EntityFrameworkCore.SqlServer`
- `Microsoft.EntityFrameworkCore.Tools`
- `Microsoft.AspNetCore.OpenApi`
- `Swashbuckle.AspNetCore`
- `Azure.Extensions.AspNetCore.DataProtection.Keys`
- `Azure.Security.KeyVault.Keys`
- `Azure.Storage.Blobs`
- `Microsoft.VisualStudio.Azure.Containers.Tools.Targets`
- `ServiceStack`, `ServiceStack.Extensions`, `ServiceStack.Ormlite`, `ServiceStack.Interfaces`
- `ServiceStack.OrmLite.SqlServer.Data`, `ServiceStack.OrmLite.Sqlite.Data`
- `ServiceStack.Server`, `ServiceStack.Jobs`, `ServiceStack.AspNetCore.OpenApi`, `ServiceStack.Kestrel`
- `NUnit`, `NUnit3TestAdapter`, `Microsoft.NET.Test.Sdk`

### Phase 3: Restore and Validate

- RUN `dotnet restore` at repository root
- RUN `dotnet build` at repository root
- RUN `cd MembershipManager.Tests && dotnet test`
- IF compile or test failures occur, identify package-specific API changes and fix code

### Phase 4: Confirm and Document

- CONFIRM all updated package versions are .NET 10-compatible
- CONFIRM `dotnet build` succeeds cleanly
- CONFIRM `dotnet test` passes for the tests project
- UPDATE the phase 2 plan or migration notes with the finalized package versions

---

## STEP-BY-STEP TASKS

### Task 1: Inventory current NuGet packages

- **READ** `MembershipManager/MembershipManager.csproj`
- **READ** `MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj`
- **READ** `MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj`
- **READ** `MembershipManager.Tests/MembershipManager.Tests.csproj`
- **VALIDATE**: `dotnet list package --outdated`

### Task 2: Resolve latest .NET 10-compatible versions

- **RESEARCH**: Query NuGet for the latest stable package versions compatible with .NET 10
- **VERIFY**: Ensure ServiceStack packages support .NET 10 and match the latest stable `8.x` release series
- **NOTE**: Keep wildcard version ranges only if they are intentionally maintained; prefer exact stable versions when available

### Task 3: Update package references

- **UPDATE** each backend `.csproj` with the new version numbers
- **PRESERVE** any package references that are already using correct .NET 10 wildcard ranges, unless a newer explicit stable version is preferred
- **SAVE** changes to versioned package references only in backend projects

### Task 4: Restore and build

- **RUN** `dotnet restore`
- **RUN** `dotnet build`
- **FIX** any errors from incompatible package updates

### Task 5: Test

- **RUN** `cd MembershipManager.Tests && dotnet test`
- **FIX** any package-related test issues

### Task 6: Final validation

- **RUN** `dotnet list package --outdated` again to ensure no outdated NuGet packages remain in the backend projects
- **CONFIRM** that all package updates are stable and not causing compilation regressions

---

## TESTING STRATEGY

### Unit Tests

- Use the existing NUnit test project in `MembershipManager.Tests`
- Execute the full suite after package updates
- Confirm that test failures are due to code/package incompatibilities, not package restore issues

### Integration / Build Validation

- Build the solution end-to-end after package updates
- Do not enable full environment/integration tests in this phase unless they are already part of the existing test project

### Edge Cases

- Package upgrades that introduce minor API changes in ServiceStack or EF Core
- New version requirements for ASP.NET component registration
- Test adapter or SDK version mismatches during `dotnet test`

---

## VALIDATION COMMANDS

```powershell
cd c:\Users\xgoss\source\repos\nightshaddow13\MembershipManager2

dotnet restore

dotnet build

cd MembershipManager.Tests

dotnet test

dotnet list package --outdated
```

---

## ACCEPTANCE CRITERIA

- [ ] All backend `.csproj` package references are updated to the latest .NET 10-compatible versions
- [ ] Solution restore and build succeed after updates
- [ ] `MembershipManager.Tests` passes successfully
- [ ] No package-related compile errors remain
- [ ] Phase 2 remains limited to NuGet package updates only

---

## COMPLETION CHECKLIST

- [ ] Inventory completed
- [ ] Latest package versions identified
- [ ] Package references updated
- [ ] Solution restored and built successfully
- [ ] Tests passed
- [ ] No out-of-date NuGet packages remain on the backend projects

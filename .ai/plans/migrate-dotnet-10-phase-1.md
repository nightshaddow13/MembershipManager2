# .NET 10 Migration — Phase 1: Compile & Fix

**Objective:** Update all project files to target .NET 10, upgrade NuGet packages to compatible versions, and fix compilation errors.

**Phase Duration:** 1–3 days

## Tasks

### 1. Update Target Frameworks
Update all `.csproj` files to target `net10.0`:
- `MembershipManager/MembershipManager.csproj`
- `MembershipManager.ServiceInterface/MembershipManager.ServiceInterface.csproj`
- `MembershipManager.ServiceModel/MembershipManager.ServiceModel.csproj`
- `MembershipManager.Tests/MembershipManager.Tests.csproj`
- `MembershipManager.Client/MembershipManager.Client.esproj` (check if needed)

**Change:** Replace `<TargetFramework>net8.0</TargetFramework>` with `<TargetFramework>net10.0</TargetFramework>`

### 2. Update NuGet Package References
Review and update the following key packages to .NET 10-compatible versions:
- `Microsoft.AspNetCore.App` (framework reference)
- `EntityFramework` / `Microsoft.EntityFrameworkCore` → latest .NET 10 compatible
- `ServiceStack` → latest .NET 10 compatible
- `NUnit` → latest compatible
- `Microsoft.AspNetCore.Identity.EntityFrameworkCore` → latest
- `Microsoft.Azure.Cosmos.Table` (if used) → latest compatible
- Any other transitive dependencies that need updating

**Action:** Check `packages.config` or `PackageReference` entries in each `.csproj` file.

### 3. Update GitHub Actions Workflows
Update CI/CD workflows to use .NET 10 SDK:
- `.github/workflows/build.yml`: Change `dotnet-version: '8.*'` to `dotnet-version: '10.*'`
- `.github/workflows/build-container.yml`: Change `dotnet-version: '8.*'` to `dotnet-version: '10.*'`

### 4. Update Dockerfile (if needed)
Check `MembershipManager/Dockerfile` for base image references:
- Update `FROM mcr.microsoft.com/dotnet/sdk:8.0` → `mcr.microsoft.com/dotnet/sdk:10.0`
- Update `FROM mcr.microsoft.com/dotnet/aspnet:8.0` → `mcr.microsoft.com/dotnet/aspnet:10.0`

### 5. Local Validation
Run these commands locally to verify compilation and tests:

```powershell
cd c:\Users\xgoss\source\repos\nightshaddow13\MembershipManager2
dotnet --version
dotnet clean
dotnet build
cd MembershipManager.Tests
dotnet test
cd ..\MembershipManager.Client
npm install
npm run build
```

### 6. Fix Compilation Errors
Address any compiler errors or breaking changes:
- Review error logs from `dotnet build`
- Check for API changes in updated NuGet packages
- Update code if necessary (e.g., deprecated methods, removed overloads)
- Run tests to ensure no regressions

### 7. Commit & Document
Create clear commit messages documenting:
- Target framework changes
- Package version updates
- Any code fixes required for .NET 10 compatibility

## Success Criteria
✓ All `.csproj` files target `net10.0`
✓ `dotnet build` completes without errors
✓ `dotnet test` passes all unit tests
✓ Frontend build (`npm run build`) produces valid `dist` artifacts
✓ No compiler warnings (clean build log)

## Rollback
If critical issues arise, revert all changes and return to .NET 8.0.

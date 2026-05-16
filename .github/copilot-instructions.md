# MembershipManager Repository Guide for Cloud Agents

## Project Overview

**MembershipManager** is a .NET 8.0 + React SPA (Single Page Application) for managing organizational memberships. It combines a robust backend API built with ASP.NET Core 8 and ServiceStack framework with a modern React 19 frontend using Vite and Tailwind CSS.

**Technology Stack:**
- **Backend:** .NET 8.0, ASP.NET Core, ServiceStack 8.x, Entity Framework Core, OrmLite
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS 4, Radix UI
- **Database:** SQL Server (default) or SQLite with support for Azure SQL
- **Authentication:** ASP.NET Identity
- **Testing:** NUnit (integration tests currently disabled)
- **CI/CD:** GitHub Actions with Docker containerization
- **Deployment:** Kamal-based container deployment

## Prerequisites & Environment Setup

**REQUIRED BEFORE BUILD:**
- **.NET 8.0 SDK** - Download from https://dotnet.microsoft.com/download
- **Node.js 22+** - Required for React frontend. Download from https://nodejs.org/ 
- **SQL Server** - Local development uses `XAVIER-ASUS;Initial Catalog=MMData` (change in `Configure.Db.cs` or set `AZURE_SQL_CONNECTIONSTRING` environment variable for Azure SQL)

**Verification Commands:**
```bash
dotnet --version  # Should show 8.x
node --version    # Should show 22+
npm --version     # Should show 10+
```

## Build Instructions

### Initial Setup (One-time Bootstrap)
```bash
# Backend - restores NuGet packages automatically during build
# Frontend - install dependencies
cd MembershipManager.Client
npm install
```

### Build Sequence (Always run in this order)

**1. Frontend Build (from repo root):**
```bash
cd MembershipManager.Client
npm install       # Always run before building (installs/updates dependencies)
npm run build     # Compiles TypeScript, builds React with Vite to dist/
npm run lint      # ESLint validation - reports unused vars/imports with max-warnings=0
```
*Expected output:* `dist/` folder with optimized production assets, ESLint reports NO warnings

**2. Backend Build (from repo root):**
```bash
dotnet build      # Restores NuGet, compiles C# projects (Release by default in CI)
# Takes ~60 seconds on first run due to NuGet restore
```
*Expected output:* `/bin/Release/` directories in each project, SUCCESS message

**3. Run Tests (from repo root):**
```bash
cd MembershipManager.Tests
dotnet test       # Runs NUnit tests (integration tests are currently commented out in IntegrationTest.cs)
```
*Expected output:* Test results, TESTS PASSED or TESTS FAILED

### Development Workflow

**Backend Development:**
```bash
cd MembershipManager
npm run dev       # Starts: dotnet watch (auto-rebuilds on changes)
# Frontend proxy runs on https://localhost:5173
# Backend API runs on https://localhost:5001 or http://localhost:5283
```

**Frontend Development:**
```bash
cd MembershipManager.Client
npm run dev       # Starts Vite dev server with HMR on https://localhost:5173
# Proxies API calls to backend at https://localhost:5001
```

**Database Migrations:**
```bash
cd MembershipManager
npm run migrate         # Runs Entity Framework + OrmLite migrations via AppTasks
npm run revert:last     # Reverts last migration
npm run revert:all      # Reverts all migrations
npm run rerun:last      # Reverts and re-runs last migration (useful for development)
```

## Project Architecture & Layout

### Directory Structure
```
MembershipManager/              # ASP.NET Core 8 backend
├── Program.cs                  # App entry point (sets up ServiceStack)
├── MembershipManager.csproj    # Backend project (PublishProfile: DefaultContainer)
├── Configure.*.cs              # Modular startup configuration files:
│   ├── Configure.Db.cs         # Database connection setup (SQL Server)
│   ├── Configure.Db.Migrations.cs # Entity Framework + OrmLite migrations
│   ├── Configure.Auth.cs       # ASP.NET Identity authentication
│   ├── Configure.AutoQuery.cs  # AutoQuery data-driven APIs
│   ├── Configure.OpenApi.cs    # Swagger UI / OpenAPI v3
│   └── Configure.*.cs          # Other feature configs
├── Migrations/                 # EF Core database migrations
├── appsettings.json            # Configuration (defaults to local SQL Server)
└── Dockerfile                  # Multi-stage Docker build

MembershipManager.Client/       # React 19 + Vite frontend
├── src/
│   ├── main.tsx               # App entry point (React Router setup)
│   ├── gateway.ts             # API client (JsonServiceClient from @servicestack/client)
│   ├── components/            # React components (Radix UI + Tailwind)
│   ├── pages/                 # File-based routing (vite-plugin-pages)
│   ├── _posts/, _videos/      # Markdown content (vite-plugin-press)
│   └── contexts.ts            # Press context provider
├── package.json               # Frontend dependencies
├── vite.config.ts             # Vite configuration (React, Tailwind, MDX support)
├── tsconfig.json              # TypeScript config (strict mode enabled)
└── tailwind.config.ts         # Tailwind CSS theming

MembershipManager.ServiceModel/# Request/Response DTOs (shared contracts)
MembershipManager.ServiceInterface/# Service implementations

.github/workflows/
├── build.yml                  # Build pipeline (dotnet build → dotnet test)
├── build-container.yml        # Docker image build pipeline
└── release.yml                # Deployment pipeline (Kamal SSH deploy)
```

### CI/CD Pipelines

**Build Pipeline (`.github/workflows/build.yml`)**
- Triggers on: every push and pull request to any branch
- Steps: Setup .NET 8 → `dotnet build` → `dotnet test`
- Timeout: ~5 minutes
- Success: Required for container build to proceed

**Container Build Pipeline (`.github/workflows/build-container.yml`)**
- Triggers on: successful build.yml on main/master branches
- Steps: Setup Node 22 → `npm install` & `npm run build` (frontend) → Docker publish to GHCR
- Dockerfile uses multi-stage build: node:18 (client build) → dotnet:8.0-sdk (backend build) → dotnet:8.0 runtime
- Timeout: ~10 minutes

**Release/Deploy Pipeline (`.github/workflows/release.yml`)**
- Triggers on: successful container build on main/master
- Steps: Kamal bootstrap → SSH deploy to production server → DB migrations → App restart
- Uses secrets: `SSH_PRIVATE_KEY`, `KAMAL_DEPLOY_IP`, `KAMAL_DEPLOY_HOST`
- Timeout: ~10 minutes

### Key Configuration Files

| File | Purpose | Notes |
|------|---------|-------|
| `MembershipManager/appsettings.json` | Runtime config | ConnectionString: local SQL Server; Use `AZURE_SQL_CONNECTIONSTRING` env var for Azure |
| `MembershipManager.Client/tsconfig.json` | TypeScript strict mode | Paths: `@/*` → `./src/*`, noUnusedLocals=true |
| `MembershipManager.Client/vite.config.ts` | Frontend build config | MDX support, Tailwind, Press plugin for markdown, HTTPS dev certs from dotnet |
| `MembershipManager/MembershipManager.csproj` | Build definition | `<PublishProfile>DefaultContainer</PublishProfile>` enables `dotnet publish` → Docker |
| `config/deploy.yml` | Kamal deployment manifest | Service name, image repo, host configuration |

## Important Notes & Known Issues

**Database Notes:**
- Development defaults to local SQL Server instance at `XAVIER-ASUS;Initial Catalog=MMData`
- Change in `Configure.Db.cs` line 13 or set `AZURE_SQL_CONNECTIONSTRING` environment variable
- Migrations are managed by Entity Framework Core (EF) with OrmLite migrations coexisting for custom data migrations
- Seed users are created automatically on first migration if users table is empty

**Known Limitations:**
- Integration tests in `MembershipManager.Tests/IntegrationTest.cs` are commented out (can be enabled)
- Email confirmation disabled by default (RegisterService.cs line 66 TODO comment)
- ServiceStack license key required in production (Configure.AppHost.cs line 32 TODO comment)

**Build Errors & Workarounds:**
- If Node.js is missing: `dotnet build` fails with "9009 error: node --version". Install Node.js 22+ from https://nodejs.org/
- If ESLint fails: Run `cd MembershipManager.Client && npm run lint` to see specific violations; fix and rebuild
- If migrations fail: Check SQL Server connection string; ensure database exists or Azure SQL credentials are valid
- If Docker publish fails: Verify GitHub Container Registry (GHCR) credentials; ensure Docker is installed on build agent

**Trust Instructions:** 
This guide contains validated build commands and dependency requirements. **Follow these instructions exactly as written.** Cloud agents should trust the build sequence and configuration details provided above. Only search the codebase if: (1) instructions require updates for new dependencies, (2) build commands fail with errors not mentioned here, or (3) new major framework versions are introduced. For any discrepancies between these instructions and actual build failures, check the error messages in GitHub Actions logs first before deviating from the documented sequence.

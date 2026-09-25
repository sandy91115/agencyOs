# AgencyOS implementation status

Updated: 2026-09-03

This file records repository evidence, not product aspirations. A ticket is
marked complete only after its acceptance criteria and required verification
have passed.

## Phase 0 - Foundation

| Ticket  | Status           | Current evidence                                                                                                                                     | Remaining work                                                                                   |
| ------- | ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| FND-001 | Complete locally | Laravel/Inertia/React application exists; dependencies are locked; Git is initialized; setup and structure are documented; `composer setup` passes.  | Commit/push the baseline and repeat setup in CI or a clean checkout.                             |
| FND-002 | Complete locally | GitHub Actions runs frontend formatting/lint, strict TypeScript, PHP formatting, PHPStan, and Pest; `composer ci:check` passes locally.              | Confirm the workflow on the hosted repository. Dependency and secret scanning belong to FND-007. |
| FND-003 | Complete locally | `/api/v1/status`, success/error envelopes, stable framework error codes, and validated UUID correlation IDs are implemented with focused tests.      | Confirm headers and envelopes in staging after deployment.                                       |
| FND-004 | Complete locally | Default stack writes JSON, request completion events carry safe correlation/runtime context, and nested sensitive keys are redacted.                 | Verify ingestion and search fields in the selected staging observability platform.               |
| FND-005 | Complete locally | PostgreSQL and Redis are configured as runtime defaults with reproducible Compose services; liveness and dependency-aware readiness are implemented. | Repeat migration/readiness verification in staging and configure managed service credentials.    |
| FND-006 | Complete locally | A tenant-prefixed private-storage contract supports local and S3-compatible disks; fake-disk security and isolation tests pass.                      | Configure a staging object-store bucket and verify provider permissions/round trips.             |
| FND-007 | Complete locally | CI defines locked PHP/Node audits and digest-pinned Gitleaks; Dependabot covers all ecosystems; protected-main policy is documented.                 | Run hosted checks and enable/verify the GitHub ruleset after adding a remote.                    |

## Existing work outside the active ticket

The repository already contains authentication, verified email, password reset,
two-factor authentication, passkeys, team membership, invitations, policies,
tenant-prefixed dashboard routing, and related tests. These are not treated as
completed IAM tickets until they have been reconciled with the approved
organization tenant model and reviewed against each ticket's security matrix.

## Baseline verification

On 2026-09-03:

- `php artisan about` booted Laravel 13.30.1 on PHP 8.5.8.
- `php artisan route:list --except-vendor` listed 21 application routes.
- Initial `composer ci:check` stopped because Vite+ formatted repository-local
  agent instructions. The formatter/linter now excludes `.agents/**`, and a
  complete rerun passed: 87 frontend files formatted, 76 files linted without
  warnings, TypeScript passed, Pint passed, PHPStan reported zero errors, and
  Pest passed 91 tests with 327 assertions.
- `composer setup` completed application discovery, migrations, npm audit (zero
  vulnerabilities), and a production frontend build.
- FND-003 focused API tests passed: 7 tests and 35 assertions covering success,
  supplied/invalid request IDs, validation, authentication, not-found, and safe
  unexpected failures.
- FND-004 focused tests passed for safe request context and recursive redaction.
  A real logger smoke emitted parseable JSON and replaced authorization and
  nested access-token markers with `[REDACTED]` while preserving safe fields.
- FND-005 migrated all current schema into a disposable PostgreSQL 17 service,
  received Redis `PONG`, completed a Redis cache round trip, and returned HTTP
  200 from `/health/ready` with both dependencies available. Focused health
  endpoint tests cover liveness, readiness, and safe HTTP 503 degradation.
- FND-006 passed 10 focused tests covering contract resolution, put/read/delete,
  tenant prefix isolation, invalid tenant IDs, and unsafe path rejection. A
  real local-private adapter smoke completed a write/read/delete round trip.
- FND-007 local Composer and npm audits reported no known vulnerabilities. The
  digest-pinned Gitleaks 8.29.0 container scanned intended source/configuration
  paths before the first commit and reported no leaks. Hosted workflow and
  branch-ruleset verification remain external follow-up work.
- The runtime reported SQLite, database cache, database queue, database
  sessions, local storage, and an unlinked `public/storage` path.
- Git was initialized locally; no commit or remote was created.

## Prototype Priorities - UI/UX Baseline

| Ticket                                                    | Status           | Current evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Remaining work                                                                      |
| --------------------------------------------------------- | ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| UI-001 (Shell & Nav)                                      | Complete locally | 8 main navigation routes (`dashboard`, `work.index`, `clients.index`, `projects.index`, `calendar.index`, `capacity.index`, `departments.index`, `reports.index`) are implemented and scoped by `EnsureOrganizationMembership`. Desktop sidebar with bottom utility dock (Search, AI Command Center, Alerts, Help, Settings), top bar with Organization Switcher & quick actions, Command Palette (`⌘K`), "Ask Agency AI" slide-over drawer with proposal cards, notifications sheet, mobile bottom navigation, Owner Dashboard, and dedicated workspace views pass CI (`composer ci:check`: 105 files formatted, 0 lint warnings in 88 files, TypeScript clean, Pint clean, PHPStan 0 errors, and 130 Pest tests with 486 assertions). | Build out domain module entities and persistence layers for each workspace view.    |
| UI-002 (Task Detail Surface & My Work Interactive Engine) | Complete locally | Priority #3 implemented: domain module `app/Modules/Task` with `Task`, `TaskChecklist`, `TaskComment`, `TaskTimeLog`, and `TaskPolicy`; 2-column Task Detail layout with Brief, production checklist, internal vs client comments, hours tracking vs estimate, and quick time logging; drawer slide-over (`TaskDetailDrawer`) + standalone route (`/tasks/{task}`); `MyWork` interactive engine with priority sorting, tab filtering, and time logs. 137 Pest tests (525 assertions), PHPStan clean, Pint clean, TypeScript clean, 0 lint errors.                                                                                                                                                                                       | Deliver Project Overview workspace (Priority #2) and Capacity Engine (Priority #4). |
| UI-003 (Client & Project Workspace)                       | Complete locally | Priority #2 implemented: domain modules `app/Modules/Client` and `app/Modules/Project` with models, policies, and factories; migration creating `clients`, `projects`, and linking `tasks.client_id` and `tasks.project_id`; 5-view Project Workspace (`projects/show` with Overview, List, Board, Timeline, Files) synchronized via URL query params; Client Workspace (`clients/show` with Overview, Projects, Work); seamless in-place `TaskDetailDrawer` integration; quick creation modals for clients, projects, and tasks; 145 Pest tests (589 assertions), 0 PHPStan errors, Pint formatted, TypeScript clean, 0 lint warnings.                                                                                                 | Deliver Capacity & Resource Management Engine (Priority #5).                        |

## Baseline verification

On 2026-09-08:

- DR-001 (Option A) was finalized: `SetTeamUrlDefaults` was cleaned up in `bootstrap/app.php` and replaced by `SetOrganizationUrlDefaults`.
- Prototype Priority #1 (App Shell & Navigation Layout) completed:
    - 8 core routes added under `{current_organization}` prefix group with `auth`, `verified`, and `EnsureOrganizationMembership` middleware.
    - Desktop left navigation updated with 8 primary operational surfaces and 5-item bottom utility dock.
    - Top bar with Organization Switcher, breadcrumbs, search shortcut trigger, Ask AI trigger, and notifications trigger.
    - Persistent mobile bottom navigation (`< md`) with Home, My Work, Calendar, Alerts, and More slide-over sheet.
    - Global Command Palette (`⌘K`), Agency AI Command Center drawer, Notifications Sheet, and Help modal.
    - Redesigned Owner Dashboard matching UI/UX brief Section 5 with top KPI hierarchy, Actionable Risk Queue, and Department Utilization.
    - Dedicated initial views created for My Work (with timer and tabs), Clients, Projects, Calendar, Capacity, Departments, and Reports.
    - 17 new feature tests in `tests/Feature/NavigationTest.php` verified guest redirects, authenticated access, and cross-tenant isolation.
- Prototype Priority #3 (Task Detail Surface & My Work Interactive Engine) completed:
    - Domain module created under `app/Modules/Task/` with `Task`, `TaskChecklist`, `TaskComment`, `TaskTimeLog`, `TaskPolicy`, and `TaskFactory`.
    - Database migration `2026_09_08_000001_create_tasks_table.php` establishes tenant-isolated tables with indexes and cascades.
    - Task Detail component (`TaskDetailContent`) features 2-column desktop layout, full client brief, checklist with toggle & addition, internal vs. client visible discussion with user badges, remaining effort calculation, quick time logging, and dependencies card.
    - Contextual drawer (`TaskDetailDrawer`) enables deep-link inspection directly from My Work without losing context, in addition to standalone page (`/tasks/{task}`).
    - My Work interactive engine (`/my-work`) wired up to live organization tasks with cross-database ANSI priority ordering (`urgent` -> `high` -> `normal` -> `low`), tab filtering, and drawer triggers.
    - 7 comprehensive feature tests in `tests/Feature/TaskTest.php` verify tenant boundaries, checklist toggling, time tracking arithmetic, and comment visibility filtering.
- Prototype Priority #2 (Client & Project Workspace) completed:
    - Domain modules created under `app/Modules/Client/` and `app/Modules/Project/` with `Client`, `Project`, policies, and factories.
    - Migration `2026_09_08_000002_create_clients_and_projects_tables.php` establishes `clients` and `projects` tables with foreign keys on `tasks`.
    - Dedicated 5-view Project Workspace (`projects/show.tsx`) supporting Overview (budget burn meter, deliverable velocity, team members), List (deliverables table), Board (5-column Kanban), Timeline (visual schedule), and Files (production packages and approval states).
    - Dedicated Client Workspace (`clients/show.tsx`) with health diagnostic banner, service lines, retainer and margin tracking, active projects roster, and deliverables table.
    - Seamless in-place `TaskDetailDrawer` integration in both workspaces.
    - Quick-create modals for Clients (`POST /{org}/clients`), Projects (`POST /{org}/projects`), and Tasks (`POST /{org}/tasks`).
    - 8 comprehensive feature tests in `tests/Feature/ClientTest.php` and `tests/Feature/ProjectTest.php`.
    - Full test suite passes: 145 tests (589 assertions), 0 PHPStan errors, Pint formatted, TypeScript clean, 0 lint warnings.

## Architecture decision requests

- DR-001: Accepted (Option A) - Top-level tenant implementation migrated to Organization.

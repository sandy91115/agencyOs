# DR-001: Team and organization boundary

Status: Accepted - Option A  
Opened: 2026-09-03
Accepted: 2026-09-03

## Context

The accepted AgencyOS architecture defines `Organization` as the tenant. Every
tenant-owned row carries `organization_id`; an authenticated user operates
through an active organization membership. Teams and departments are concepts
inside that organization.

The current repository instead uses `Team` as the top-level tenant context. It
has `teams`, `memberships`, `team_invitations`, `users.current_team_id`, a
`{current_team}` route prefix, and team-oriented policies and UI.

Continuing Phase 1 without a decision would either preserve terminology that
conflicts with the approved model or require a later high-risk tenant migration.

## Options

### Option A - Migrate the tenant concept to Organization

Rename and migrate the existing top-level team implementation to
organizations, organization memberships, organization invitations, and
`current_organization_id`. Add subordinate teams/departments later.

Consequences: strongest alignment with the approved architecture and schema;
requires a coordinated database, backend, route, TypeScript, UI, and test
migration before additional tenant-owned modules are built.

### Option B - Treat Team as the Organization implementation name

Keep current tables and code while documenting `Team` as the physical name for
the organization tenant.

Consequences: less immediate migration work, but creates persistent vocabulary,
schema, API, and integration drift from the product documentation. A separate
subordinate-team concept would also need a different name.

## Recommendation

Choose Option A before IAM-002 proceeds. This avoids making client, project,
task, audit, cache, queue, and storage contracts depend on a tenant name that
the accepted documentation reserves for a subordinate structure.

## Approval

The user approved Option A on 2026-09-03. The top-level tenant implementation
will migrate to Organization before additional tenant-owned modules are built.

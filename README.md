# AgencyOS

AgencyOS is a multi-tenant operating system for digital agencies. The approved
product and engineering baseline lives in the AgencyOS documentation package;
this repository contains the Laravel, Inertia, React, and TypeScript
implementation.

## Current implementation status

Development is proceeding ticket-by-ticket, beginning with Phase 0
(Foundation). The detailed, evidence-based status is maintained in
[`docs/implementation-status.md`](docs/implementation-status.md).
The versioned response and correlation contract is documented in
[`docs/api-contract.md`](docs/api-contract.md).
Structured event fields and redaction boundaries are documented in
[`docs/logging.md`](docs/logging.md).
The private object-storage boundary is documented in
[`docs/private-object-storage.md`](docs/private-object-storage.md).
Repository scanning and required branch protection are documented in
[`docs/repository-security.md`](docs/repository-security.md).

The existing application includes authentication, email verification,
password reset, passkeys, two-factor authentication, and an initial
team/membership implementation. The documentation specifies organizations as
the tenant boundary, so the team/organization naming and migration strategy
must be approved before tenant-domain work continues. See
[`docs/decisions/DR-001-team-organization-boundary.md`](docs/decisions/DR-001-team-organization-boundary.md).

## Technology baseline

- PHP 8.3 or newer and Laravel 13
- Node.js 22 and React 19 with strict TypeScript
- Inertia.js 3 and Tailwind CSS 4
- PostgreSQL as the target system of record
- Redis for queues, cache, throttling, and locks
- S3-compatible private object storage in deployed environments

SQLite, database-backed queues, and local storage are temporary local defaults
in existing checkouts. New environments use PostgreSQL and Redis as documented
in [`docs/local-services.md`](docs/local-services.md). Private storage uses the
local adapter during development and the S3-compatible adapter when configured.

## Local setup

### Prerequisites

- PHP 8.3+ with Composer 2
- Node.js 22+ with npm
- PHP extensions required by Laravel and the selected database driver

### Install

Start the local PostgreSQL and Redis dependencies:

```bash
docker compose up -d --wait
```

```bash
composer setup
```

The setup command installs PHP and JavaScript dependencies, creates `.env` from
`.env.example` when absent, generates an application key, runs migrations, and
builds the frontend.

For an existing checkout where dependencies are already installed:

```bash
php artisan migrate
npm run build
```

Start the local application and supporting development processes with:

```bash
composer dev
```

The default local URL is `http://localhost:8000`.

### Windows/XAMPP notes

Run commands from the repository root. Ensure the CLI `php` executable is the
intended PHP 8.3+ installation (`php --version`) and that Composer uses the same
runtime. The current checkout has also been exercised with PowerShell.

## Quality checks

```bash
composer ci:check
```

This runs frontend formatting/lint checks, TypeScript checks, PHP formatting,
PHPStan, and the Pest test suite. A ticket is not complete unless its focused
checks pass and its manual verification is recorded.

Useful focused commands:

```bash
npm run check
npm run types:check
composer lint:check
composer types:check
php artisan test
```

## Repository structure

```text
app/                 Laravel application and domain code
app/Modules/         Module boundary guidance; modules are added per ticket
bootstrap/           Laravel bootstrap and middleware registration
config/              Runtime configuration; environment reads belong here
database/            Migrations, factories, and seeders
docs/                Repository-local decisions and implementation evidence
resources/js/        Inertia React application
resources/css/       Tailwind CSS entry point and design tokens
routes/               Web, settings, API, and console routes
tests/                Pest feature and unit tests
.github/              CI and dependency automation
```

## Delivery rules

- Work in small backlog tickets with explicit acceptance criteria.
- Preserve server-resolved tenant context; route or browser tenant IDs are not
  authorization evidence.
- Add migrations rather than editing deployed schema history.
- Keep secrets out of source control and logs.
- Update implementation status with exact automated and manual evidence.
- Record architecture conflicts as decision requests before implementation.

## Environment safety

Never commit `.env`, credentials, production exports, or private client data.
Use `.env.example` only for safe placeholders. Production secrets must be
provided by the deployment platform or secret manager.

# Local PostgreSQL and Redis

FND-005 makes PostgreSQL the system-of-record default and Redis the cache and
queue default. Automated tests remain isolated with in-memory SQLite, array
cache/session, and the synchronous queue as configured in `phpunit.xml`.

## Start dependencies

```bash
docker compose up -d --wait
```

The local-only ports intentionally avoid common Windows/XAMPP services:

- PostgreSQL: `127.0.0.1:55432`
- Redis: `127.0.0.1:56379`

Copy `.env.example` to `.env`, preserve the generated `APP_KEY`, then run:

```bash
php artisan migrate
composer dev
```

Stop the containers without deleting their named volumes:

```bash
docker compose stop
```

The Compose password is a local development credential only. Staging and
production must inject unique managed secrets and must not expose database or
Redis ports publicly.

## Redis client decision

The application uses `predis/predis` 3.x so the locked local setup works on
Windows PHP installations without the optional native Redis extension. This is
a maintained pure-PHP client supported by Laravel and avoids an undocumented
machine-level prerequisite. Deployment performance must be measured; switching
to `phpredis` later is configuration-only and requires the extension in the
runtime image.

## Health endpoints

- `GET /up` is liveness. It only proves the PHP application can respond and is
  suitable for process/container restart decisions.
- `GET /health/ready` checks the configured database and Redis connections. It
  returns HTTP 200 with `ready`, or HTTP 503 with `unavailable`.

Readiness exposes only dependency names and availability states. Connection
strings, hosts, credentials, exception messages, and stack traces are omitted.
Do not use readiness as a deep diagnostic endpoint.

`HEALTH_READINESS_DEPENDENCIES` controls the required checks. Production should
retain `database,redis`; narrowing this list requires an operational decision.

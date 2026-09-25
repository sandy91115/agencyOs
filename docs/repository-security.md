# Repository security controls

FND-007 establishes automated dependency and secret-scanning gates. These
controls supplement review; they do not prove that an application is secure.

## Automated gates

`.github/workflows/security.yml` runs on pull requests, pushes to `main`, a
weekly schedule, and manual dispatch.

- `composer audit --locked` checks locked PHP packages.
- `npm audit --audit-level=high` fails on high or critical Node advisories.
- Gitleaks scans Git history and the working tree with redacted output. Its
  official container is pinned to an immutable digest.

Dependabot opens grouped weekly updates for Composer, npm, and GitHub Actions.
Action dependencies are pinned to full commit SHAs and checkout does not retain
credentials.

## Required `main` branch protection

After pushing to GitHub, an administrator must configure a `main` ruleset with:

1. Pull requests and at least one approval required.
2. Stale approvals dismissed after new commits.
3. Conversation resolution required.
4. Required checks: `ci`, `dependency-audit`, and `secret-scan`.
5. Branches required to be current before merging.
6. Force pushes and branch deletion blocked.
7. Administrators/bypass actors included unless a documented emergency process
   grants a narrow bypass.

Enable GitHub secret scanning and push protection when available. Require least
privilege and MFA for maintainers. Branch protection is an external setting; it
must be verified after a remote exists.

## Secret response

For a real credential, revoke or rotate it immediately, assess access/logs,
remove it from history when appropriate, and record the incident and regression
control. Deleting it only in a later commit is insufficient. Allowlist a finding
only after confirming it is a non-secret fixture and documenting why.

## Local checks

```bash
composer audit --locked
npm audit --audit-level=high
docker run --rm -v "$PWD:/repo" ghcr.io/gitleaks/gitleaks:v8.29.0@sha256:507de9682470025fb3e7f57fe4c4ca8263d81369e027b6538b8a252a9c0371d4 detect --source=/repo --redact --no-banner --exit-code=1
```

PowerShell users can use `${PWD}` if Docker requires explicit interpolation.
Run the history scan after the initial commit exists. Before that commit, use
`--no-git` only on intended source directories; the entire checkout also
contains ignored dependencies and the local `.env`.

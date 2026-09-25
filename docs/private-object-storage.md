# Private object storage

FND-006 establishes the private storage boundary used by later asset, upload,
report, and integration tickets.

## Application contract

Application code depends on `App\Contracts\Storage\PrivateObjectStorage`, not
directly on an S3 SDK. `LaravelPrivateObjectStorage` implements the contract
through Laravel's filesystem manager and the configured
`PRIVATE_FILESYSTEM_DISK`.

Every operation requires an organization UUID. Physical keys are prefixed as:

```text
organizations/{organization_uuid}/{object_key}
```

Object keys reject absolute paths, empty segments, `.`/`..` traversal,
backslashes, and null bytes. Callers still own filename generation, MIME and
magic-byte validation, quotas, checksums, malware scanning, authorization, and
audit requirements in AST-001 and AST-002.

## Adapters

- `private`: non-public local development storage under `storage/app/private`.
  URL serving is disabled and write failures throw.
- `s3_private`: S3-compatible private storage for deployed environments. Set
  credentials, region, bucket, optional endpoint, and
  `PRIVATE_FILESYSTEM_DISK=s3_private` at runtime.
- Tests use Laravel's filesystem fake for the `private` disk, exercising the
  real AgencyOS adapter without network or persistent filesystem state.

`league/flysystem-aws-s3-v3` 3.x is locked because Laravel requires this adapter
to operate an S3-compatible disk. Provider credentials remain outside source
control.

## Security boundary

No public URL or unauthenticated controller is exposed by FND-006. Signed
direct-upload requests and authorized short-lived downloads are deferred to
AST-001, after upload intent, quota, policy, and validation models exist.

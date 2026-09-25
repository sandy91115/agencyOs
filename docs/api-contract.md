# API contract

AgencyOS HTTP APIs are versioned under `/api/v1` and return JSON. The initial
contract was introduced by FND-003.

## Correlation

Every API response includes an `X-Request-ID` header and repeats the same UUID
as `meta.request_id`. A valid UUID supplied in `X-Request-ID` is normalized and
preserved; missing or invalid values are replaced with a server-generated UUID.
This applies to successful, validation, authentication, not-found, and
unexpected-error responses, including unmatched `/api/*` routes.

Do not put secrets, credentials, or personal data in request IDs.

## Success envelope

```json
{
    "success": true,
    "data": {},
    "meta": {
        "request_id": "019d787d-4f72-72ce-8f51-c42b04dbad85"
    }
}
```

## Error envelope

```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_FAILED",
        "message": "The submitted data is invalid.",
        "fields": {
            "name": ["The name field is required."]
        }
    },
    "meta": {
        "request_id": "019d787d-4f72-72ce-8f51-c42b04dbad85"
    }
}
```

Clients branch on the stable `error.code`, never on message text. Empty fields
are encoded as a JSON object. Unexpected failures return `INTERNAL_ERROR` and a
safe support message without exception, SQL, stack-trace, or configuration
details.

## Foundation endpoint

`GET /api/v1/status` verifies the versioned API and response contract. It is a
process-level status response, not dependency readiness; database, Redis, and
storage readiness checks belong to FND-005 and FND-006.

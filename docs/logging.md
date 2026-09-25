# Structured logging

FND-004 configures the default log stack as newline-delimited JSON and adds
safe request context for completed HTTP requests.

## Request completion event

`http.request.completed` includes:

- `request_id`
- HTTP method and path (without query string)
- named route when available
- response status and duration in milliseconds
- authenticated user and current team IDs when available

Request bodies, query values, headers, cookies, email addresses, IP addresses,
and user-agent strings are not included in this event. The existing `team_id`
field remains temporary pending DR-001.

## Redaction

The structured logger recursively replaces sensitive context and extra values
with `[REDACTED]`. Protected key families include authorization, cookie,
password, secret, private key, API key, token, and recovery code fields,
including prefixed forms such as `access_token`.

Redaction is defense in depth. Application code must still avoid logging
credentials, personal data, full request payloads, client documents, and raw AI
prompts. Secret values embedded inside an otherwise safe free-text string cannot
be reliably detected and must never be passed to the logger.

## Correlation

The request ID established by `AssignRequestId` is attached to Laravel's
request-scoped context. Framework exception logs and application events can
therefore correlate with the API `X-Request-ID` response header. Queue jobs will
inherit Laravel context when dispatched during the request; explicit tenant and
resource context remains required for consequential queued work.

# Module boundaries

AgencyOS is an approved modular monolith. Add a module directory only when an
implementation ticket introduces owned behavior; do not create empty layers or
premature abstractions.

A module may own domain entities, policies, application operations, events,
jobs, infrastructure adapters, and colocated tests. Cross-module behavior uses
a public contract, query service, or domain event. A module must not directly
update another module's tables.

HTTP controllers and request/response concerns may remain in Laravel's
conventional application locations when that keeps framework integration clear.
Business invariants and reusable operations belong to their owning module.

The planned module map is defined by the approved technical architecture. The
organization/organization tenant decision in
`docs/decisions/DR-001-organization-organization-boundary.md` must be resolved before
moving the existing organization domain into this structure.

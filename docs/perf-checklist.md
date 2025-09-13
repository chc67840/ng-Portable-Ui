# Performance Checklist

- API: pagination, projection to DTOs, avoid chatty endpoints, caching (ETag/Memory/Distributed).
- DB: indexes for filter columns, parameterized queries, analyze plans.
- UI: lazy routes, code-splitting, trackBy, avoid giant lists without virtualization.
- Build: source maps only for dev, tree-shakeable imports.

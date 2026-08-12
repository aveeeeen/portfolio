# Architecture Guidelines

## Onion Architecture / Clean Layering Principles

- **Separation of Concerns**: Keep Data Access (Repository), Application/Business Logic (Service), and External Infrastructure / Side-effects (Storage, Media Processors) strictly separated.
- **Batch Processing & Pure Filtering Pipeline**:
  1. **Data Retrieval (Repository)**: Fetch Notion / DB metadata in bulk.
  2. **Bulk Query**: Execute single bulk queries (e.g. `WHERE id IN (...)`) instead of N+1 individual queries.
  3. **Domain/Application Logic (Service)**: Evaluate comparison logic (e.g. timestamp/version checks) in pure business logic, producing a clear list of items requiring updates vs items already cached.
  4. **Targeted Side-Effects**: Execute heavy side-effects (image buffer downloading, WebP conversion, storage uploads) only on the items identified as needing update.

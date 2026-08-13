# Onion Architecture & Batch Processing Guidelines

## Core Principles

1. **Strict Layer Separation (Separation of Concerns)**:
   - **Repository Layer**: Pure data access only (Notion API, Supabase DB queries). No business logic, image processing, or storage side-effects.
   - **Service / Application Layer**: Pure business logic (timestamp/version comparisons, cache invalidation rules) and batch pipeline orchestration.
   - **Infrastructure / Utility Layer**: Isolated side-effect operations (fetching image buffers, Sharp WebP conversions, Supabase Storage uploads).

2. **Batch Processing Pipeline (Eliminating N+1 Queries)**:
   - **Bulk Read**: Always fetch metadata for list items in a single bulk query (`WHERE id IN (...)`) instead of N individual queries.
   - **Pure Filtering**: Compare timestamps in memory to produce a clear list of valid cached items vs items requiring update.
   - **Targeted Side-Effects**: Execute heavy side-effects (image processing & storage uploads) ONLY on the filtered subset requiring update.
   - **Bulk Write**: Upsert updated metadata records in a single bulk operation.

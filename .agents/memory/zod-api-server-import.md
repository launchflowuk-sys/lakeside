---
name: Zod import in api-server
description: How to import zod in @workspace/api-server (not a default dep, and the /v4 subpath fails)
---

## Rule
In `@workspace/api-server` routes, import zod as `from "zod"` — **not** `from "zod/v4"`.

**Why:** The api-server package does not include `zod` as a direct dependency by default (it only has `@workspace/api-zod`). The `zod/v4` subpath resolves fine inside `@workspace/db` (which has its own zod dep), but the api-server's TS resolver can't find it without an explicit dep entry.

**How to apply:** When adding inline Zod validation to any `artifacts/api-server/src/routes/*.ts` file:
1. Add `"zod": "catalog:"` to `artifacts/api-server/package.json` → `dependencies`
2. Run `pnpm install`
3. Use `import { z } from "zod"` in the route file

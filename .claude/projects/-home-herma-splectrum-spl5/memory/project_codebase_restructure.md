---
name: Codebase restructured as spl runtime
description: spl5 restructured from prototyping layout to spl codebase — subtrees, mycelium namespace, Bare-only
type: project
---

spl5 restructured as the spl runtime codebase (2026-04-15).

**Why:** Prototyping proved the message shape and RPC chain. Code outgrew the project-based layout. Needed one agent, one repo, constitutive deps vendored.

**How to apply:**
- Runtime code is in `mycelium/` (schema, execute, protocol, server, client)
- Constitutive deps in `lib/avsc` and `lib/avsc-rpc` (git subtrees from bare-for-pear)
- Platform deps in `lib/bare-*` (populated by `bin/setup`, gitignored)
- `node_modules` is a symlink to `lib/` for cross-module resolution
- `#avsc` and `#avsc-rpc` mapped in root package.json imports
- All code uses Bare module names directly (bare-fs, bare-net, etc.)
- Bare only — no Node dual-runtime
- In-memory pipeline works fully on Bare
- TCP RPC works fully on Bare (stream compat fixed 2026-04-15)
- Top level: bin/, docs/, lib/, mycelium/. Prototyping artifacts in docs/archive/

---
name: Bare import resolution lessons
description: Hard-won lessons about Bare module resolution — imports field, package.json scoping, symlinks
type: feedback
---

Bare's imports field in package.json does NOT map bare specifiers without `#` prefix (despite reference docs suggesting otherwise). The `#` prefix works but is scoped to the nearest package.json — sub-packages can't see parent's `#` mappings, and `#` targets can't escape package boundary with `..`.

**Why:** Bare's module resolution (bare-module) follows Node ESM conventions more strictly than expected. Each package.json is an isolation boundary.

**How to apply:**
- Use `#` imports only for constitutive deps in root package.json
- Use direct bare-* module names everywhere (bare-fs, bare-net, not fs, net)
- Symlink `node_modules → lib/` for cross-module resolution between platform deps
- Sub-packages (like avsc-rpc) use relative paths to reach siblings in lib/
- Don't rely on import mapping for platform built-in name aliasing

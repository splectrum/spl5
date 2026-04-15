---
name: Current priorities
description: Priority list for spl5 development as of 2026-04-15
type: project
---

Priority list updated end of session 2026-04-15:

1. **Bash entry points** — bin/spl and bin/spl-server as proper CLI entry points. Define invocation pattern.
2. **Stream compatibility fix** — adapt avsc-rpc transport classes to bare-stream/streamx. Gate for TCP RPC on Bare.
3. **Simplify package.json setup** — restore minimal package.json in avsc/avsc-rpc with main field, drop #imports, let node_modules→lib symlink handle all resolution.
4. **Native addon builds** — learn bare-make, build prebuilds from source. Eliminates npm entirely. Multi-language path (Rust, Zig, C++).
5. **Push subtree changes** — avsc and avsc-rpc back to bare-for-pear repos as PRs.
6. **Step 3: rawuri implementation** — get/put/remove on filesystem through RPC chain.
7. **avsc reference** — for the ref library.
8. **Update CLAUDE.md** — reflect new codebase structure.
9. **Update WoW doc** — code-development-wow.md in Downloads is stale. Needs: Bare-only, bin/setup, symlink resolution, no #imports, native addon builds. Then submit to ref library.

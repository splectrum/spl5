---
name: Current priorities
description: Priority list for spl5 development as of 2026-04-15
type: project
---

Priority list updated 2026-04-15:

1. **Simplify package.json setup** — restore minimal package.json in avsc/avsc-rpc with main field, drop #imports, let node_modules→lib symlink handle all resolution.
2. **Bash entry points** — bin/spl and bin/spl-server as proper CLI entry points. Define invocation pattern.
3. **Native addon builds** — learn bare-make, build prebuilds from source. Eliminates npm entirely. Multi-language path (Rust, Zig, C++).
4. **Push subtree changes** — avsc and avsc-rpc back to bare-for-pear repos as PRs.
5. **Step 3: rawuri implementation** — get/put/remove on filesystem through RPC chain.
6. **avsc reference** — for the ref library.
7. **Update CLAUDE.md** — reflect new codebase structure.

Completed this session:
- **Stream compatibility fix** — transport classes use streamx.Transform directly. TCP RPC fully works on Bare.
- **WoW doc update** — code-development-wow.md in Downloads reflects Bare-only, bin/setup, symlink resolution.

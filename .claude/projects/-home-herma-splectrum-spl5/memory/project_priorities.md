---
name: Current priorities
description: Priority list for spl5 development as of 2026-04-15
type: project
---

Priority list from session 2026-04-15:

1. **Stream compatibility fix** — adapt avsc-rpc transport classes to bare-stream/streamx. Gate for TCP RPC on Bare.
2. **Simplify package.json setup** — restore minimal package.json in avsc/avsc-rpc with main field, drop #imports, let node_modules→lib symlink handle all resolution.
3. **Native addon builds** — learn bare-make, build prebuilds from source. Eliminates npm entirely. Also useful for future multi-language work (Rust, Zig, C++ behind RPC boundary).
4. **Push subtree changes** — avsc and avsc-rpc changes back to bare-for-pear repos as PRs.
5. **Step 3: rawuri implementation** — get/put/remove on filesystem through RPC chain.
6. **avsc reference** — for the ref library.
7. **Update CLAUDE.md** — reflect new codebase structure.
8. **WoW + dependency docs to ref library** — currently in Windows Downloads.

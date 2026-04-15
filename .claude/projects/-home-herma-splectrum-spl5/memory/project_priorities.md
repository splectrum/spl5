---
name: Current priorities
description: Priority list for spl5 development as of 2026-04-15
type: project
---

Priority list updated 2026-04-15:

1. **avsc + avsc-rpc reference docs** — write pages for in-wonder ref lib (~/jules-tenbos/in-wonder), push READMEs to bare-for-pear forks, push subtree changes. Bundles three items.
2. **Native addon builds** — learn bare-make, build prebuilds from source. Eliminates npm entirely. Multi-language path (Rust, Zig, C++).
3. **Step 3: rawuri implementation** — get/put/remove on filesystem through RPC chain.
4. **Update CLAUDE.md** — reflect new codebase structure.

Completed this session:
- **Stream compatibility fix** — transport classes use streamx.Transform directly. TCP RPC fully works on Bare.
- **WoW doc update** — code-development-wow.md in Downloads reflects Bare-only, bin/setup, symlink resolution.
- **Bash entry points** — bin/spl global CLI, bin/spl-server, repo root resolution from ancestor axis.
- **Package.json simplification** — dropped #imports, minimal package.json in constitutive deps, symlink handles all resolution.

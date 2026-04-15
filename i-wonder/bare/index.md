# Bare Runtime Reference

Reference for the Holepunch Bare runtime — the
JavaScript runtime used by Splectrum for prototyping
and targeted for production deployment.

---

## What Bare Is

Bare is a small, modular JavaScript runtime for
desktop and mobile. Like Node.js, it provides an
asynchronous, event-driven architecture built on
libuv. Unlike Node.js, it ships with no standard
library — everything is a userland module installed
via npm. This makes it minimal by design: what you
compose in is what exists.

This aligns directly with the architecture of
absence: capabilities are present because they were
composed in, not because they came bundled.

**Source:** https://github.com/holepunchto/bare

## Installation

```
npm i -g bare
```

Prebuilt binaries included for Tier 1 platforms.

## Architecture

Bare is built on two dependencies:
- **libjs** — low-level V8 bindings
  (https://github.com/holepunchto/libjs)
- **libuv** — asynchronous I/O event loop
  (https://github.com/libuv/libuv)

The runtime itself provides only three things:
1. A module system (CJS and ESM with bidirectional
   interop)
2. A native addon system (static and dynamic)
3. Lightweight threads with synchronous joins

Everything else — filesystem, networking, crypto,
streams — is a separately installed npm module.

## Key Differences from Node.js

| Aspect | Node.js | Bare |
|--------|---------|------|
| Standard library | Built-in | None. All userland. |
| `process` global | Always available | Not present. Require explicitly. |
| `Buffer` global | Always available | Not present. Require explicitly. |
| Module system | CJS or ESM (one-way) | CJS and ESM (bidirectional) |
| Mobile support | Not a goal | Core goal. Android/iOS Tier 1. |
| Embedding | Difficult | Core goal. Clean C API. |
| Streams | Node.js streams | streamx-based |

## CLI

```
bare [flags] [filename] [...args]
```

| Flag | Description |
|------|-------------|
| `--version`, `-v` | Print version |
| `--eval`, `-e <script>` | Evaluate inline |
| `--print`, `-p <script>` | Eval and print |
| `--inspect` | V8 inspector |
| `--expose-gc` | GC APIs |

No script — starts REPL.

## Reference Pages

- [Dual-Runtime Code](dual-runtime.md) — writing
  code that runs on both Bare and Node.js
- [Global API](global-api.md) — the Bare global
  namespace
- [Module Catalog](modules.md) — all modules with
  sources and version numbers
- [Module System](module-system.md) — resolution,
  conditions, protocols
- [Platforms](platforms.md) — supported platforms
- [Sources](sources.md) — all documentation links

---

Module npm versions verified April 2026.

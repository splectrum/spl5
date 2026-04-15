---
title: "Bare Runtime Reference"
type: reference
status: draft
destinations: engineering
---

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

### Key Differences from Node.js

| Aspect | Node.js | Bare |
|--------|---------|------|
| Standard library | Built-in | None. All userland. |
| `process` global | Always available | Not present. Require explicitly. |
| `Buffer` global | Always available | Not present. Require explicitly. |
| Module system | CJS or ESM (one-way) | CJS and ESM (bidirectional) |
| Mobile support | Not a goal | Core goal. Android/iOS Tier 1. |
| Embedding | Difficult | Core goal. Clean C API. |
| Streams | Node.js streams | streamx-based |

**Source:** https://github.com/holepunchto/bare

---

## Dual-Runtime Code

The primary mechanism for writing code that runs on
both Bare and Node.js.

### Package.json Imports Field

```json
{
  "imports": {
    "fs": { "bare": "bare-fs", "default": "fs" },
    "net": { "bare": "bare-net", "default": "net" },
    "path": { "bare": "bare-path", "default": "path" }
  },
  "dependencies": {
    "bare-fs": "^4.7.0",
    "bare-net": "^2.3.1",
    "bare-path": "^3.0.0"
  }
}
```

Code writes `require('fs')` — the runtime resolves
to the correct module. No conditional requires, no
runtime detection needed in application code.

The `"bare"` condition matches when running in Bare.
The `"default"` condition is the fallback (Node.js).

**Source:**
https://github.com/holepunchto/bare-module

### Third-Party Node.js Packages

Node.js packages that use built-in modules
internally need their dependency tree remapped. The
`bare-node-runtime` package provides this:

```js
// Set up Node.js globals (Buffer, process, etc.)
require('bare-node-runtime/global')

// Load Node.js package with full import remapping
const pkg = require('some-node-package', {
  with: { imports: 'bare-node-runtime/imports' }
})
```

The `with: { imports }` mechanism applies the
complete Node.js-to-Bare module map to the entire
dependency tree of the required package.

**Source:**
https://github.com/holepunchto/bare-node-runtime

---

## The Bare Global

Available without import. No `process` or `Buffer`
— those require explicit modules.

### Properties

- `Bare.platform` — `"linux"`, `"darwin"`,
  `"win32"`, `"android"`, `"ios"`
- `Bare.arch` — `"x64"`, `"arm64"`, `"arm"`, etc.
- `Bare.argv` — command line arguments
- `Bare.pid` — process ID
- `Bare.version` — version string
- `Bare.suspended` — boolean
- `Bare.exiting` — boolean

### Methods

- `Bare.exit([code])` — terminate
- `Bare.suspend([linger])` — suspend (mobile)
- `Bare.resume()` — resume after suspension

### Events

- `uncaughtException`, `unhandledRejection`
- `beforeExit`, `exit`
- `suspend`, `wakeup`, `idle`, `resume`

### Sub-namespaces

- `Bare.Thread` — lightweight threads
- `Bare.Addon` — native addon loading
- `Bare.IPC` — communication with embedder

**Source:** https://github.com/holepunchto/bare
and https://docs.pears.com/reference/api.html

---

## Module Catalog

Core modules with their Node.js equivalents. All
available via npm. Streams throughout are
streamx-based, not Node.js streams — this is the
most significant API difference across the
ecosystem.

### Filesystem and Paths

| Module | Node.js equiv | npm | Source |
|--------|--------------|-----|--------|
| bare-fs | fs | 4.7.0 | [repo](https://github.com/holepunchto/bare-fs) |
| bare-path | path | 3.0.0 | [repo](https://github.com/holepunchto/bare-path) |

`bare-fs` closely follows Node.js `fs`. Supports
async, callback, and sync variants. Streams are
streamx-based.

### Networking

| Module | Node.js equiv | npm | Source |
|--------|--------------|-----|--------|
| bare-net | net | 2.3.1 | [repo](https://github.com/holepunchto/bare-net) |
| bare-http1 | http | 4.5.6 | [repo](https://github.com/holepunchto/bare-http1) |
| bare-https | https | — | [repo](https://github.com/holepunchto/bare-https) |
| bare-dns | dns | 2.1.4 | [repo](https://github.com/holepunchto/bare-dns) |
| bare-dgram | dgram | 1.0.1 | [repo](https://github.com/holepunchto/bare-dgram) |
| bare-tls | tls | 2.2.3 | [repo](https://github.com/holepunchto/bare-tls) |

`bare-net` mirrors Node.js `net` pattern. `bare-tls`
wraps existing streams rather than using
`tls.connect()`. `bare-dgram` built on UDX rather
than raw libuv UDP.

### Core

| Module | Node.js equiv | npm | Source |
|--------|--------------|-----|--------|
| bare-buffer | buffer | 3.6.0 | [repo](https://github.com/holepunchto/bare-buffer) |
| bare-events | events | 2.8.2 | [repo](https://github.com/holepunchto/bare-events) |
| bare-stream | stream | 2.13.0 | [repo](https://github.com/holepunchto/bare-stream) |
| bare-crypto | crypto | 1.13.4 | [repo](https://github.com/holepunchto/bare-crypto) |
| bare-zlib | zlib | 1.3.3 | [repo](https://github.com/holepunchto/bare-zlib) |

`bare-buffer` has the same API surface as Node.js
Buffer. `bare-events` is standard EventEmitter.
`bare-stream` is based on streamx — different from
Node.js streams. `bare-crypto` is a subset: hashing,
HMAC, ciphers, random bytes — no sign/verify, no
key generation, no X509.

### Process and System

| Module | Node.js equiv | npm | Source |
|--------|--------------|-----|--------|
| bare-process | process | 4.4.1 | [repo](https://github.com/holepunchto/bare-process) |
| bare-env | (process.env) | 3.0.0 | [repo](https://github.com/holepunchto/bare-env) |
| bare-os | os | 3.8.7 | [repo](https://github.com/holepunchto/bare-os) |
| bare-tty | tty | 5.1.0 | [repo](https://github.com/holepunchto/bare-tty) |
| bare-readline | readline | 1.3.1 | [repo](https://github.com/holepunchto/bare-readline) |

`bare-os` is comprehensive, closely follows Node.js.
Note: `pid()` and `cwd()` are methods (called with
parentheses) not properties. `bare-readline` emits
`data` events rather than `line` events.

### Module System

| Module | Purpose | npm | Source |
|--------|---------|-----|--------|
| bare-module | Module resolution | 6.1.3 | [repo](https://github.com/holepunchto/bare-module) |
| bare-node-runtime | Node.js compat layer | 1.2.0 | [repo](https://github.com/holepunchto/bare-node-runtime) |

### Additional Notable Modules

| Module | Description | Source |
|--------|-------------|--------|
| bare-subprocess | Process spawning (child_process) | [repo](https://github.com/holepunchto/bare-subprocess) |
| bare-timers | setTimeout, setInterval | [repo](https://github.com/holepunchto/bare-timers) |
| bare-url | WHATWG URL | [repo](https://github.com/holepunchto/bare-url) |
| bare-fetch | WHATWG Fetch | [repo](https://github.com/holepunchto/bare-fetch) |
| bare-ws | WebSocket | [repo](https://github.com/holepunchto/bare-ws) |
| bare-worker | Worker threads | [repo](https://github.com/holepunchto/bare-worker) |
| bare-rpc | librpc-compatible RPC | [repo](https://github.com/holepunchto/bare-rpc) |
| bare-bundle | Application bundles | [repo](https://github.com/holepunchto/bare-bundle) |

---

## Node.js Compatibility Map

Complete mapping from Node.js built-ins to Bare
equivalents, as defined by bare-node-runtime.

### Supported

assert, async_hooks, buffer, child_process,
console, crypto, dgram, diagnostics_channel, dns,
events, fs, http, https, inspector, module, net,
os, path, perf_hooks, process, punycode,
querystring, readline, repl, stream,
string_decoder, timers, tls, tty, url, util, v8,
vm, worker_threads, zlib.

### Unsupported

cluster, constants, domain, http2, sea, sqlite,
sys, test, trace_events, wasi.

**Source:**
https://github.com/holepunchto/bare-node-runtime
(imports.json)

---

## Platform Support

### Tier 1 (prebuilds, CI-tested)

| Platform | Architectures | Version |
|----------|--------------|---------|
| Linux | arm64, x64 | >= 5.15 (glibc 2.35) |
| Android | arm, arm64, ia32, x64 | >= 10 |
| macOS | arm64, x64 | >= 12.0 |
| iOS | arm64, x64 (sim) | >= 14.0 |
| Windows | arm64, x64 | >= 10 |

### Tier 2 (known to work, no CI)

Linux riscv64, musl variants, mips/mipsel.

**Source:** https://github.com/holepunchto/bare

---

## Module Resolution

The bare-module system supports:

- CommonJS and ESM with bidirectional interop
- `"exports"` field with conditional exports
- `"imports"` field for private mappings (no `#`
  prefix required, unlike Node.js)
- Custom protocols for extending resolution

### Conditional Export Conditions

In order of specificity:
`"import"`, `"require"`, `"asset"`, `"addon"`,
`"bare"`, `"node"`, `"<platform>"`, `"<arch>"`,
`"simulator"`, `"default"`.

Order matters — more specific conditions must come
before less specific ones.

**Source:**
https://github.com/holepunchto/bare-module

---

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

---

## Documentation Sources

| Resource | URL |
|----------|-----|
| Bare runtime | https://github.com/holepunchto/bare |
| Module system | https://github.com/holepunchto/bare-module |
| Node.js compat | https://github.com/holepunchto/bare-node-runtime |
| Pears overview | https://docs.pears.com/reference/bare-overview.html |
| Pears node compat | https://docs.pears.com/reference/node-compat.html |
| Pears API reference | https://docs.pears.com/reference/api.html |

Module npm versions verified April 2026. Check npm
for latest: `npm view <module> version`.

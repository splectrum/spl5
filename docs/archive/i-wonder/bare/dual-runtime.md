# Dual-Runtime Code

Writing code that runs on both Bare and Node.js
without conditional requires or runtime detection.

[Back to index](index.md)

---

## Package.json Imports Field

The `"imports"` field in package.json maps module
specifiers conditionally by runtime:

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
to the correct module. The `"bare"` condition matches
when running in Bare. The `"default"` condition is
the fallback (Node.js).

Unlike Node.js, the `#` prefix on import keys is
not required in Bare — it is supported for
disambiguation but optional.

**Source:**
https://github.com/holepunchto/bare-module

---

## Third-Party Node.js Packages

Node.js packages use built-in modules internally.
On Bare, their dependency tree needs remapping. The
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
dependency tree of the required package. The
package and all its dependencies transparently get
Bare equivalents instead of Node.js built-ins.

**Source:**
https://github.com/holepunchto/bare-node-runtime

---

## How It Works Together

For your own code: use `"imports"` in package.json.
Map only the modules you actually use.

For third-party packages: use `bare-node-runtime`
with the `with: { imports }` mechanism. This
handles the full Node.js built-in set.

Example combining both:

```json
{
  "imports": {
    "fs": { "bare": "bare-fs", "default": "fs" },
    "net": { "bare": "bare-net", "default": "net" },
    "path": { "bare": "bare-path", "default": "path" }
  },
  "dependencies": {
    "some-node-package": "^1.0.0",
    "bare-fs": "^4.7.0",
    "bare-net": "^2.3.1",
    "bare-path": "^3.0.0",
    "bare-node-runtime": "^1.2.0"
  }
}
```

```js
// In your code
if (typeof Bare !== 'undefined') {
  require('bare-node-runtime/global')
}
const avro = require('avsc', typeof Bare !== 'undefined'
  ? { with: { imports: 'bare-node-runtime/imports' } }
  : undefined
)
const fs = require('fs')   // resolved by imports field
const net = require('net')  // resolved by imports field
```

The runtime detection (`typeof Bare !== 'undefined'`)
is only needed at the boundary where third-party
packages are loaded. Your own application code stays
clean.

---

## Node.js Compatibility Map

Complete mapping maintained by bare-node-runtime.

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

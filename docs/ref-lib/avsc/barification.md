[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc](./) > Barification

# avsc Barification

What was changed from the upstream mtth/avsc to run on
Bare, and why.

---

## Approach

Bare ships with no standard library. Node.js built-ins
like `fs`, `crypto`, `stream`, and `path` do not exist.
Their Bare equivalents — `bare-fs`, `bare-crypto`,
`bare-stream`, `bare-path` — provide the same
functionality through separately installed modules.

The fork replaces all Node.js requires with their Bare
equivalents directly. No conditional imports, no
runtime detection, no compatibility layers. The code
targets one runtime.

## Module Replacements

### platform.js

```javascript
// upstream
let crypto = require('crypto')

// fork
let crypto = require('bare-crypto')
```

Provides `getHash(str, algorithm)` — used for schema
fingerprints (MD5) and protocol handshake hashes.

### files.js

```javascript
// upstream
let fs = require('fs')
let path = require('path')

// fork
let fs = require('bare-fs')
let path = require('bare-path')
```

Provides import hooks for IDL file resolution —
reading `.avdl`, `.avsc`, and `.avpr` files from the
filesystem.

### index.js

```javascript
// upstream
let fs = require('fs')

// fork
let fs = require('bare-fs')
```

The main entry point uses filesystem access for
container file convenience functions
(`createFileDecoder`, `createFileEncoder`,
`extractFileHeader`).

### containers.js

```javascript
// upstream
let stream = require('stream')

// fork
let stream = require('bare-stream')
```

Block and raw encoder/decoder streams for Avro
container file I/O.

## TextEncoder/TextDecoder Polyfill

**File:** `lib/encoding.js`

Bare's `text-decoder` module provides a streaming API
(`push`/`write`/`end`). avsc expects the WHATWG
standard API — `TextDecoder.decode(buf)` and
`TextEncoder.encodeInto(str, buf)`.

The polyfill provides WHATWG-compliant implementations
with full UTF-8 support (1–4 byte sequences, surrogate
pair handling). It installs on `globalThis` only if the
standard API is absent.

Auto-loaded via `require('./encoding')` in `utils.js`.

## Buffer Handling

`utils.js` contains conditional logic that checks for
`Buffer` availability:

```javascript
if (typeof Buffer === 'function') {
  // Use Buffer methods
} else {
  // Fall back to Uint8Array operations
}
```

On Bare, `Buffer` is available when `bare-buffer` is
required but is not a global. The conditional handling
ensures avsc works whether Buffer is present or not.

## Package.json

Upstream avsc v6 had a conditional imports field:

```json
{
  "imports": {
    "fs": { "bare": "bare-fs", "default": "fs" },
    "crypto": { "bare": "bare-crypto", "default": "crypto" }
  }
}
```

The fork strips this to:

```json
{
  "name": "avsc",
  "main": "lib/index.js"
}
```

No conditional resolution. Direct requires to bare-*
modules throughout. One runtime, one code path.

## Platform Dependencies

Required at runtime, installed by `bin/setup`:

| Module | Version | Purpose |
|--------|---------|---------|
| bare-crypto | 4.7.0 | Schema fingerprints, protocol hashes |
| bare-fs | 4.7.0 | Container file I/O, IDL imports |
| bare-path | 3.0.0 | IDL import path resolution |
| bare-stream | 2.13.0 | Container encoding/decoding streams |

These are platform dependencies — not committed to the
repository, populated by the setup script into `lib/`.
The `node_modules → lib/` symlink makes them
resolvable by name.

See [Code Implementation](../implementation/code-development)
for the full dependency management model.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*

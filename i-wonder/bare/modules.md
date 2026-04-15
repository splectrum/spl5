# Bare Module Catalog

All modules available via npm. Streams throughout
the ecosystem are streamx-based
(https://github.com/mafintosh/streamx), not Node.js
streams — this is the most significant API
difference.

[Back to index](index.md)

---

## Filesystem and Paths

| Module | Node.js equiv | npm | Source |
|--------|--------------|-----|--------|
| bare-fs | fs | 4.7.0 | [repo](https://github.com/holepunchto/bare-fs) |
| bare-path | path | 3.0.0 | [repo](https://github.com/holepunchto/bare-path) |

**bare-fs** closely follows Node.js `fs`. Supports
async, callback, and sync variants. Core operations:
open, close, read, write, stat, lstat, fstat,
access, exists, mkdir, rmdir, unlink, rename,
readdir, readFile, writeFile, appendFile, copyFile,
chmod, fchmod, symlink, readlink, realpath, watch,
createReadStream, createWriteStream. Streams are
streamx-based.

**bare-path** mirrors Node.js `path`: join, resolve,
basename, dirname, extname, etc. Includes
`path/posix` and `path/win32` subpaths.

---

## Networking

| Module | Node.js equiv | npm | Source |
|--------|--------------|-----|--------|
| bare-net | net | 2.3.1 | [repo](https://github.com/holepunchto/bare-net) |
| bare-http1 | http | 4.5.6 | [repo](https://github.com/holepunchto/bare-http1) |
| bare-https | https | — | [repo](https://github.com/holepunchto/bare-https) |
| bare-dns | dns | 2.1.4 | [repo](https://github.com/holepunchto/bare-dns) |
| bare-dgram | dgram | 1.0.1 | [repo](https://github.com/holepunchto/bare-dgram) |
| bare-tls | tls | 2.2.3 | [repo](https://github.com/holepunchto/bare-tls) |

**bare-net** mirrors Node.js `net` pattern:
`net.createServer()`, `net.createConnection()`.
Streams are streamx-based.

**bare-http1** maps to Node.js `http` (not `http1`).
`http.createServer()`, `http.request()` pattern.
Only HTTP/1.x — no HTTP/2.

**bare-tls** wraps existing streams rather than
using `tls.connect()` / `tls.createServer()`. Uses
`new tls.Socket(stream, options)` pattern.

**bare-dgram** built on UDX
(https://github.com/holepunchto/udx-native) rather
than raw libuv UDP.

**bare-dns** provides `dns.lookup(hostname, cb)` and
`dns/promises` subpath.

---

## Core

| Module | Node.js equiv | npm | Source |
|--------|--------------|-----|--------|
| bare-buffer | buffer | 3.6.0 | [repo](https://github.com/holepunchto/bare-buffer) |
| bare-events | events | 2.8.2 | [repo](https://github.com/holepunchto/bare-events) |
| bare-stream | stream | 2.13.0 | [repo](https://github.com/holepunchto/bare-stream) |
| bare-crypto | crypto | 1.13.4 | [repo](https://github.com/holepunchto/bare-crypto) |
| bare-zlib | zlib | 1.3.3 | [repo](https://github.com/holepunchto/bare-zlib) |

**bare-buffer** same API surface as Node.js Buffer:
`Buffer.from()`, `Buffer.alloc()`,
`Buffer.allocUnsafe()`, `Buffer.concat()`. Not
globally available — must be required.

**bare-events** standard EventEmitter: `on`, `emit`,
`once`, `off`, `removeListener`, `removeAllListeners`.

**bare-stream** based on streamx. Readable, Writable,
Duplex, Transform exist but with streamx semantics.
Also provides `stream/consumers`,
`stream/promises`, `stream/web`.

**bare-crypto** is a subset of Node.js crypto:
- Hash: MD5, SHA1, SHA256, SHA512, BLAKE2B256
- Cipher: AES-128/256 (ECB/CBC/CTR/OFB/GCM),
  ChaCha20-Poly1305, XChaCha20-Poly1305
- `createHash`, `createHmac`, `createCipheriv`,
  `createDecipheriv`, `randomBytes`, `randomFill`,
  `pbkdf2`
- Not available: sign/verify, generateKeyPair,
  scrypt, DiffieHellman, X509

**bare-zlib** stream-based compression/decompression.
Streamx-based.

---

## Process and System

| Module | Node.js equiv | npm | Source |
|--------|--------------|-----|--------|
| bare-process | process | 4.4.1 | [repo](https://github.com/holepunchto/bare-process) |
| bare-env | (process.env) | 3.0.0 | [repo](https://github.com/holepunchto/bare-env) |
| bare-os | os | 3.8.7 | [repo](https://github.com/holepunchto/bare-os) |
| bare-tty | tty | 5.1.0 | [repo](https://github.com/holepunchto/bare-tty) |
| bare-readline | readline | 1.3.1 | [repo](https://github.com/holepunchto/bare-readline) |

**bare-process** provides familiar `process` object.
Not globally available. Use
`require('bare-process/global')` to install globally.

**bare-env** returns environment variables object.
Standalone module, not on `process`.

**bare-os** comprehensive, closely follows Node.js.
Note: `pid()` and `cwd()` are methods (called with
parentheses) not properties as in Node.js.

**bare-tty** provides WriteStream and ReadStream.
Constructor takes fd directly:
`new tty.WriteStream(1)` for stdout. Streamx-based.

**bare-readline** uses
`readline.createInterface({ input, output })`.
Emits `data` events (not `line` events as Node.js).

---

## Module System

| Module | Purpose | npm | Source |
|--------|---------|-----|--------|
| bare-module | Module resolution | 6.1.3 | [repo](https://github.com/holepunchto/bare-module) |
| bare-node-runtime | Node.js compat layer | 1.2.0 | [repo](https://github.com/holepunchto/bare-node-runtime) |

See [Module System](module-system.md) and
[Dual-Runtime Code](dual-runtime.md) for details.

---

## Additional Notable Modules

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
| bare-console | WHATWG console | [repo](https://github.com/holepunchto/bare-console) |
| bare-channel | Inter-thread messaging | [repo](https://github.com/holepunchto/bare-channel) |
| bare-atomics | Synchronization primitives | [repo](https://github.com/holepunchto/bare-atomics) |
| bare-daemon | Daemon process management | [repo](https://github.com/holepunchto/bare-daemon) |
| bare-inspector | V8 inspector | [repo](https://github.com/holepunchto/bare-inspector) |
| bare-repl | REPL environment | [repo](https://github.com/holepunchto/bare-repl) |
| bare-signals | Signal handling | [repo](https://github.com/holepunchto/bare-signals) |
| bare-encoding | TextEncoder/TextDecoder | [repo](https://github.com/holepunchto/bare-encoding) |
| bare-structured-clone | Structured cloning | [repo](https://github.com/holepunchto/bare-structured-clone) |
| bare-zmq | ZeroMQ bindings | [repo](https://github.com/holepunchto/bare-zmq) |

---

Module npm versions verified April 2026. Check
latest: `npm view <module> version`.

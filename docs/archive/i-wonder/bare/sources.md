# Documentation Sources

All external references for the Bare runtime
ecosystem. Use these to verify information and
check for updates.

[Back to index](index.md)

---

## Primary Sources

| Resource | URL |
|----------|-----|
| Bare runtime | https://github.com/holepunchto/bare |
| Module system | https://github.com/holepunchto/bare-module |
| Node.js compat | https://github.com/holepunchto/bare-node-runtime |

## Pears Documentation

| Resource | URL |
|----------|-----|
| Bare overview | https://docs.pears.com/reference/bare-overview.html |
| Node.js compat | https://docs.pears.com/reference/node-compat.html |
| API reference | https://docs.pears.com/reference/api.html |

## Key Dependencies

| Resource | URL |
|----------|-----|
| libjs (V8 bindings) | https://github.com/holepunchto/libjs |
| libuv (event loop) | https://github.com/libuv/libuv |
| streamx (streams) | https://github.com/mafintosh/streamx |
| UDX (UDP) | https://github.com/holepunchto/udx-native |

## Module Repositories

### Filesystem and Paths
- bare-fs: https://github.com/holepunchto/bare-fs
- bare-path: https://github.com/holepunchto/bare-path

### Networking
- bare-net: https://github.com/holepunchto/bare-net
- bare-http1: https://github.com/holepunchto/bare-http1
- bare-https: https://github.com/holepunchto/bare-https
- bare-dns: https://github.com/holepunchto/bare-dns
- bare-dgram: https://github.com/holepunchto/bare-dgram
- bare-tls: https://github.com/holepunchto/bare-tls

### Core
- bare-buffer: https://github.com/holepunchto/bare-buffer
- bare-events: https://github.com/holepunchto/bare-events
- bare-stream: https://github.com/holepunchto/bare-stream
- bare-crypto: https://github.com/holepunchto/bare-crypto
- bare-zlib: https://github.com/holepunchto/bare-zlib

### Process and System
- bare-process: https://github.com/holepunchto/bare-process
- bare-env: https://github.com/holepunchto/bare-env
- bare-os: https://github.com/holepunchto/bare-os
- bare-tty: https://github.com/holepunchto/bare-tty
- bare-readline: https://github.com/holepunchto/bare-readline

### Additional
- bare-subprocess: https://github.com/holepunchto/bare-subprocess
- bare-timers: https://github.com/holepunchto/bare-timers
- bare-url: https://github.com/holepunchto/bare-url
- bare-fetch: https://github.com/holepunchto/bare-fetch
- bare-ws: https://github.com/holepunchto/bare-ws
- bare-worker: https://github.com/holepunchto/bare-worker
- bare-rpc: https://github.com/holepunchto/bare-rpc
- bare-bundle: https://github.com/holepunchto/bare-bundle
- bare-console: https://github.com/holepunchto/bare-console
- bare-channel: https://github.com/holepunchto/bare-channel
- bare-atomics: https://github.com/holepunchto/bare-atomics
- bare-daemon: https://github.com/holepunchto/bare-daemon
- bare-inspector: https://github.com/holepunchto/bare-inspector
- bare-repl: https://github.com/holepunchto/bare-repl
- bare-signals: https://github.com/holepunchto/bare-signals
- bare-encoding: https://github.com/holepunchto/bare-encoding
- bare-structured-clone: https://github.com/holepunchto/bare-structured-clone
- bare-zmq: https://github.com/holepunchto/bare-zmq

## Splectrum Context
- Holepunch proposal: projects/01-engineering-foundation/splectrum-holepunch-proposal.md
- spl2 Bare exploration: spl2/projects/04-bare-runtime-hello-world/

---

## Checking for Updates

```
npm view bare version
npm view bare-fs version
npm view bare-net version
```

Or check all at once:
```
for mod in bare bare-fs bare-net bare-path \
  bare-buffer bare-events bare-stream bare-crypto \
  bare-process bare-os bare-module \
  bare-node-runtime; do
  echo "$mod: $(npm view $mod version)"
done
```

Module npm versions in this reference verified
April 2026.

# Bare Global API

The `Bare` global is available without import. There
is no `process` or `Buffer` global — those require
explicit modules.

[Back to index](index.md)

---

## Properties

- `Bare.platform` — `"linux"`, `"darwin"`,
  `"win32"`, `"android"`, `"ios"`
- `Bare.arch` — `"x64"`, `"arm64"`, `"arm"`,
  `"ia32"`, `"mips"`, `"mipsel"`, `"riscv64"`
- `Bare.simulator` — boolean, true if compiled for
  simulator
- `Bare.argv` — command line arguments
- `Bare.pid` — process ID
- `Bare.exitCode` — exit code (used if `exit()`
  called without argument)
- `Bare.version` — version string
- `Bare.versions` — object with dependency versions
- `Bare.suspended` — boolean, current suspension
  state
- `Bare.exiting` — boolean, whether process is
  exiting

## Methods

- `Bare.exit([code])` — immediately terminate
- `Bare.suspend([linger])` — suspend process and
  all threads (mobile lifecycle)
- `Bare.wakeup([deadline])` — wake during
  suspension for limited work
- `Bare.idle()` — immediately suspend event loop
- `Bare.resume()` — resume after suspension

## Events

- `uncaughtException` — unhandled JS exception
- `unhandledRejection` — unhandled promise rejection
- `beforeExit` — loop out of work, chance to
  schedule more
- `exit` — process exiting (must not schedule work)
- `suspend` — process suspending (defer/cancel work)
- `wakeup` — waking during suspension
- `idle` — idle after suspension (loop will block)
- `resume` — resuming (restart deferred work)

## Sub-namespaces

### Bare.Thread

Lightweight threads with synchronous joins and
SharedArrayBuffer support.

- `Bare.Thread.isMainThread` — boolean
- `Bare.Thread.self` — current thread reference
- `new Bare.Thread(filename[, options])` — spawn
- `thread.join()` — synchronous wait
- `thread.suspend()` / `thread.resume()` /
  `thread.terminate()`

### Bare.Addon

Native addon loading.

- `Bare.Addon.resolve(specifier)` — resolve path
- `Bare.Addon.load(specifier)` — load addon
- `Bare.Addon.host` — platform-arch string
- `Bare.Addon.cache` — loaded addon cache

### Bare.IPC

Optional streaming communication with embedder.
Returns a Duplex stream or null if not embedded.

---

**Source:** https://github.com/holepunchto/bare
and https://docs.pears.com/reference/api.html

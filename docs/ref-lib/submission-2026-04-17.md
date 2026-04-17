# Ref Lib Submission — 2026-04-17

Three new reference pages (git, rpc-server, testing approach),
one update to code-development.md, one update to the
engineering index.

---

## 1. UPDATE: engineering/index.md — Technology References

Replace the existing Technology References section with:

### Technology References

- [Bare Runtime](bare/) — the Holepunch JavaScript runtime, implementation platform
- [avsc](avsc/) — Avro type system, serialization, schema evolution (bare-for-pear fork)
- [avsc-rpc](avsc-rpc/) — Avro RPC protocol, service definition, transports (bare-for-pear fork)
- [git](git/) — git operations, subtree management, two-reality model (bare-for-pear module)
- [rpc-server](rpc-server/) — server lifecycle, PID management, file-based command IPC (bare-for-pear module)

---

## 2. UPDATE: engineering/implementation/code-development.md

### bare-for-pear table update

Replace the bare-for-pear table with:

| Repo | Purpose | Upstream |
|------|---------|----------|
| avsc | AVRO type system, serialization | mtth/avsc |
| avsc-rpc | AVRO RPC protocol layer | extracted from mtth/avsc v5 |
| git | Git operations, subtree management | original |
| rpc-server | Server lifecycle, command IPC | original |

### spl repo structure update

Replace the spl repo structure with:

```
spl/
  bin/                  — entry point scripts
  docs/                 — policy, schema, reference
  lib/                  — all dependencies
    avsc/               — AVRO type system (subtree)
    avsc-rpc/           — AVRO RPC layer (subtree)
    git/                — git operations (subtree)
    rpc-server/         — server lifecycle (subtree)
    bare-*/             — platform deps (gitignored)
  _test/                — test framework (subtree)
  _schema/              — local schema registry
  _client/              — default client identity
  mycelium/             — data fabric, xpath, protocols
  splectrum/            — language layer (when ready)
  haicc/                — cognition layer (when ready)
  package.json          — minimal: name, version, description
```

### Three Repositories section update

Add after the in-wonder entry:

### spl5.test — The Test Framework

Test framework as a separate repo, attached to spl via subtree at `_test/`. Full-chain tests — every test spawns the CLI, sends a real RPC request, and verifies the response. No mocking.

The test framework has its own client identity that travels with it. Suites are organized by module so they can travel with their module on extraction.

### Platform dependencies table update

Add to the platform dependencies table:

| bare-subprocess | Process spawning |

### Entry points update

Replace the entry points section with:

```bash
bin/spl-server    # start the RPC server
bin/spl           # CLI client
bin/spl-test      # run test suites
bin/setup         # populate platform deps after clone
```

---

## 3. NEW PAGE: engineering/git/index.md

Target location: `docs/engineering/git/index.md`
(or within the bare/ section if preferred — editorial choice)

---

[In Wonder - The World of Splectrum](../../) > [Engineering](../) > Git

# Git — Operations Module

Git operations for the Bare runtime. Synchronous command execution, structured output parsing, subtree lifecycle management, and configurable hosted repo operations. One of the constitutive bare-for-pear modules.

Source: [bare-for-pear/git](https://github.com/bare-for-pear/git)

---

## Why a Git Module

Git is constitutive to mycelium — the temporal axis, the hard boundary, the decentralised exchange. The mycelium fabric needs to operate git programmatically, through protocol handlers that are thin wrappers around infrastructure.

The alternative was shelling out to git from every handler, parsing output ad hoc, hoping the subtree flags were right. A module makes the operations testable, the output structured, and the subtree workflow safe.

The module wraps the git CLI rather than reimplementing git internals. Git is the authority on git. The module adds structure on top: parsed status, typed log entries, validated subtree operations, reality detection.

---

## The Two-Reality Model

Position determines scope. When you invoke from the repo root, you get full repo scope. When you invoke from inside a registered subtree, operations scope to that subtree — its remote, its branch, its prefix.

The same command, different behaviour based on where you stand. The fabric resolves it, not the operator.

`detectReality()` compares the caller's local root against `.gittrees` entries. If the local root falls inside a registered subtree prefix, the operation enters subtree reality. Push becomes subtree push. Pull becomes subtree pull. Status scopes to the prefix.

This is the physical expression of subject reality at the git level. A subtree is a referenced repo with its own identity. When you're inside it, you're inside its reality.

---

## Subtree Management

Git subtree doesn't persist prefix-to-remote mappings anywhere. The operator must remember which prefix goes with which remote and branch. This is error-prone — one wrong flag and you're pushing to the wrong place.

`.gittrees` solves this. A committed flat file at repo root. Three columns: prefix, remote name, branch. Read by the module, validated before every subtree operation.

```
lib/avsc          bare-for-pear-avsc          main
lib/avsc-rpc      bare-for-pear-avsc-rpc      main
lib/git           bare-for-pear-git           main
lib/rpc-server    bare-for-pear-rpc-server    main
_test             spl5-test                   main
```

The `subtrees.add()` function does the full workflow: add remote, fetch, add subtree, register in `.gittrees`. One call instead of four commands.

---

## Remote and Hosted Repo Operations

Remote management (add, list, remove, rename) is standard git. Hosted repo creation (creating the repo on GitHub or another platform) is adjacent — you almost always need both.

The module keeps them together with a configurable platform. GitHub is the default (uses the `gh` CLI). The platform is pluggable — add a `createRepo` and `repoUrl` function and switch.

The hosting platform is an implementation detail. The interface is: give me a name, I'll create the repo and give you the URL.

---

## Design Decisions

**Synchronous execution.** All operations use `spawnSync`. Git commands are fast and the protocol handlers are synchronous. The sync/async problem is solved once in the infrastructure layer, not in every handler.

**Structured output.** Status returns `{ branch, files }`, not a porcelain string. Log returns `[{ hash, author, timestamp, message }]`, not formatted text. The handler gets data, not text to parse.

**Thin handlers on top.** The mycelium protocol handlers (spl.mycelium.git.*) are ~20 lines each: read execution context, call the module, set response type header, return. All the git logic lives here. All the protocol logic lives there.

**Cache in subtrees.** The `.gittrees` file is loaded once and cached. This is correct for a request-handling process where `.gittrees` doesn't change during a request. The cache is invalidated on `register()`.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*

---

## 4. NEW PAGE: engineering/rpc-server/index.md

Target location: `docs/engineering/rpc-server/index.md`
(or within the bare/ section if preferred)

---

[In Wonder - The World of Splectrum](../../) > [Engineering](../) > RPC Server

# RPC Server — Lifecycle Module

Server lifecycle management for the Bare runtime. TCP listener management, PID tracking, file-based command IPC, and request logging. One of the constitutive bare-for-pear modules.

Source: [bare-for-pear/rpc-server](https://github.com/bare-for-pear/rpc-server)

---

## Why a Server Module

The server started as a 57-line file that mixed TCP setup, RPC wiring, logging, and dispatch. No way to stop it cleanly. No way to tell if it was running. No way to restart without killing the process. Every session began with `pkill bare` and ended with the same.

The extraction follows the same pattern as the git module: infrastructure in lib/, thin protocol layer in spl/. After extraction, the protocol layer is ~20 lines that wire the avsc-rpc service to the infrastructure. The server module knows nothing about AVRO, RPC protocols, or dispatch.

The boundary is `onConnection(socket)`. The module manages TCP. The caller creates whatever protocol channels it needs on the socket. This separation means the module is useful for any TCP server on Bare, not just the spl RPC server.

---

## File-Based Command IPC

The standard ways to talk to a running server — signals, IPC sockets, HTTP endpoints — all require either platform-specific APIs or additional dependencies. Bare has limited signal support. Unix domain sockets need bare-pipe configuration. An HTTP endpoint is a whole additional server.

Files are simpler. The server watches `_server/cmd/` for file creation. Drop a file named `shutdown`, the server shuts down. Drop `restart`, it restarts. The file is consumed (deleted) after processing.

This is debuggable in a way that signals never are. `ls _server/cmd/` shows pending commands. `touch _server/cmd/shutdown` works from any shell, any script, any process. The mechanism is visible, stateless, and self-documenting.

The watcher scans for existing files on startup. If a command was written before the watcher started, it still gets processed. No race condition between writing and watching.

---

## PID as Process Identity

The server writes `Bare.pid` to `_server/pid` on start, removes it on clean shutdown. This gives any other process — the test runner, a monitoring script, the CLI — a way to know if the server is alive without making a TCP connection.

`pid.alive()` reads the PID file and tests the process with `os.kill(pid, 0)` — signal 0 doesn't kill, just checks existence. If the process is gone (crashed without cleanup), the PID file is stale. The next `start()` detects this, cleans the stale file, and proceeds.

The PID check is instant. The TCP fallback (connect and disconnect) takes network round-trip time and can hang on half-open connections. For the test runner, which checks server availability before every run, the difference matters.

---

## Design Decisions

**Singleton per process.** One server instance, module-level state. There's no use case for multiple TCP servers in the same Bare process. The simplicity of `rpcServer.start()` / `rpcServer.stop()` follows from this.

**Protocol-agnostic.** The `onConnection` callback is the only protocol surface. The module creates and manages TCP connections. What runs on them is the caller's concern. Today it's avsc-rpc channels. Tomorrow it could be anything.

**Render parameter on logging.** The log function takes an optional render function that transforms the message before writing to disk. This keeps the display module (which knows about AVRO schemas and human-readable formatting) in the spl layer. The infrastructure module writes whatever JSON it's given.

**Graceful shutdown.** `tcpServer.close()` waits for active connections to drain before closing. If a request is in flight, it completes. The PID file is removed in the close callback, not before — the server is only declared stopped when it actually is.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*

---

## 5. NEW PAGE: engineering/implementation/testing.md

Target location: `docs/engineering/implementation/testing.md`
Add to implementation/index.md:
`- [Testing](testing) — full-chain testing, no mocking, module-organized suites`

---

[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [Implementation](./) > Testing

# Testing — Full Chain, No Mocking

How spl5 tests itself. The test framework exercises the same path as the user. If a test passes, the feature works. If it fails, it fails the way a user would experience it.

Source: [splectrum/spl5.test](https://github.com/splectrum/spl5.test)

---

## The Principle

A mock test can pass while the real system fails. The mock captured your assumptions about the interface at the time you wrote the mock. If the interface changed, the mock didn't. Your test is green, your system is broken, and you don't know.

The spl5 test framework doesn't mock. Every protocol test spawns the spl CLI as a subprocess, sends a real RPC request to a running server, goes through real dispatch to a real handler, gets a real response, and verifies it. The full chain: CLI → RPC → server → dispatch → handler → response → extraction.

This is slower than mocking. A test suite that spawns 60+ subprocesses takes seconds, not milliseconds. The trade-off is worth it. You know the system works because you watched it work.

Infrastructure tests (lib/git, lib/rpc-server) test the module API directly via `require()`. These modules have no protocol layer above them that could mask failures. Direct testing is the authentic path.

---

## Test as Entity

The test framework is a separate repo (spl5.test) attached to spl5 via subtree at `_test/`. It has its own identity — `_test/_client/context.txt` defines the test client vocabulary. The test client speaks test language, not xpath language, not git language.

This is the same multi-client identity system that serves all entities in the fabric. The test framework is an entity like any other. It has its own reality (the subtree), its own language (the client context), its own concerns. It happens to be an entity whose concern is verification.

The identity travels with the test repo. Attach spl5.test to any spl5 instance and the test vocabulary comes with it. No configuration in the host repo. The entity is self-contained.

---

## Organization for Extraction

Test suites are organized by module, not by test type or by whatever was convenient at the time of writing.

```
suites/
  lib/
    git.js            — travels with lib/git
    rpc-server.js     — travels with lib/rpc-server
  xpath/
    raw.uri.js        — travels with xpath protocols
    data.uri.js
    metadata.uri.js
    raw.js
  git/
    status.js         — travels with spl.mycelium.git
    subtree.js
```

When a module is extracted to its own repo, the tests in its directory go with it. No test archaeology required. No untangling test files that test three modules at once.

The runner supports prefix filtering. `spl-test lib` runs all infrastructure tests. `spl-test xpath` runs all protocol tests. `spl-test lib/rpc-server` runs one suite. The hierarchy serves both day-to-day development and module-scoped verification.

---

## The Harness

The test harness provides two things: CLI execution and fluent assertions.

`spl(streamType, key, value)` spawns the spl CLI with the `raw` modifier (full JSON response), parses the result, and returns it. `splFrom(cwd, ...)` does the same from a specific working directory — essential for testing the two-reality model.

`expect(response)` provides fluent assertions: `.hasValue()`, `.typeIs('leaf')`, `.hasError('not found')`, `.valueContains('text')`. Chain them. The first failure short-circuits and the message tells you what went wrong.

The harness is deliberately simple. No setup/teardown lifecycle. No before/after hooks. No parallel execution. No test isolation beyond what the filesystem provides. Each test is a function that returns `{ pass, message }`. The simplest mechanism that tells you if the system works.

---

## The Runner

The runner walks the suites directory recursively, loads each `.js` file as a suite, runs the tests, and reports. It checks for a running server before starting (PID file first, TCP fallback).

Report format is human-readable on stdout:

```
lib/git (19 tests)
  + exec runs git command
  + status returns branch and files
  - log with count
    expected <= 3 commits, got 10

66 tests, 65 passed, 1 failed
```

The `+` and `-` are enough. You don't need colours and progress bars to know what's broken.

---

## What's Tested

As of the current implementation:

- **lib/git** (19 tests) — exec, status, log, diff, subtrees, detectReality, remote
- **lib/rpc-server** (18 tests) — pid lifecycle, logging, command IPC, running server verification
- **xpath protocols** (18 tests) — raw/data/metadata URI visibility, schema-aware type resolution, into-file navigation
- **git protocols** (11 tests) — status, log, diff through the protocol chain, two-reality model, subtree operations

66 tests total. All passing.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*

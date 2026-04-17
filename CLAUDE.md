# CLAUDE.md — Splectrum (spl5)

## What This Is

Splectrum is a framework at the intersection of
philosophy of language, systems theory, and software
engineering. Three fabrics: Mycelium (data fabric),
Splectrum (language fabric), HAICC (cognition fabric).

Philosophy drives engineering. The seed principles
(P0-P5) ground all design decisions.

## Reference Library

The public reference library at
jules-tenbos.github.io/in-wonder/ is the living
engineering documentation. Source: ~/jules-tenbos/in-wonder.
One source of truth — don't keep copies elsewhere.

## Mission

spl5 is the prototyping iteration. Its mission is to
prove the mycelium fabric architecture end-to-end:
AVRO RPC server, Kafka-native stream record shape,
fabric APIs, CLI as subject, and the namespace/node
structure.

## How We Work

- **Entity:** Any participant. Human, AI, process.
- **Maximum beneficial autonomy:** If the system can
  do it, it should.
- **Technology decisions are AI's domain.** Decide.
- **Build, don't plan endlessly.** If wrong, fix it.
- **Philosophy first.** Engineering follows from the
  seed principles.
- **KISS.** Simplest mechanism that serves the purpose.
- **Engineering as conversation.** Natural language at
  the interaction level, rigid implementation beneath.

## Autonomy Target

Physical fully AI autonomous — structure, code,
environments, testing, deployment. Logical interactive
collaborative — scope, meaning, design, direction.

## Codebase Structure

Namespace-mapped layout. Directory = namespace node.
`index.js` = code for that name. Other files =
auxiliary. Schema directories use `schema.avsc`.

```
spl/                  — spl namespace root
  avsc-rpc/           — spl.avsc.rpc (RPC layer)
    protocol.js       — RPC protocol definition
    display.js        — human-readable rendering
    server/index.js   — RPC server, TCP transport
    cli/index.js      — CLI client
  mycelium/           — spl.mycelium (fabric)
    runtime.js        — Bare runtime essentials
    resolve.js        — repo root resolution
    schema.js         — schema loader + helpers
    test-client.js    — in-memory test script
    process/          — spl.mycelium.process
      dispatch/index.js — namespace-path handler resolution
      execute/index.js  — execution context (peel onion)
    xpath/            — spl.mycelium.xpath
      raw/uri/
        get/index.js    — rawuri get
        put/index.js    — rawuri put
        remove/index.js — rawuri remove
        helpers.js      — shared: path resolution, args decoding

_schema/              — local schema registry (metadata)
  alias-mapping.txt   — stream type → data schema
  spl/data/           — AVRO data schemas
    stream/
      record/schema.avsc    — common stream record
      descriptor/schema.avsc — { type } dispatch info
      operator/schema.avsc  — base: { args, value }
    mycelium/
      process/
        execute/schema.avsc — { args, value, mode, root }
      xpath/
        node/schema.avsc    — { type, created, modified, value: { type, length, contents } }

_server/              — server instance (logs, state)
bin/                  — entry points (spl, spl-server, setup)
lib/                  — all dependencies
  avsc/              — AVRO types/serialization (subtree)
  avsc-rpc/          — AVRO RPC protocol (subtree)
  bare-*/            — platform deps (gitignored)
docs/                — DECISIONS.md, MESSAGE.md, design submissions
```

- **Bare only** — no Node.js, no dual-runtime
- **node_modules → lib/** symlink for all module resolution
- **bin/spl** — global CLI, symlinked to ~/.local/bin
- **bin/spl-server** — RPC server, system service
- **bin/setup** — populates platform deps from npm

## What Works

- Stream record schema (spl.data.stream.record)
  with resolved descriptor union in headers
- Dispatch resolves handlers from namespace path:
  spl.mycelium.process.execute → spl/mycelium/process/execute/index.js
- process.execute peels onion, unpacks execution context,
  propagates to inner record, packs at boundary
- rawuri get: returns node record { type, created,
  modified, value: { type, length, contents } }
- rawuri put: writes value to path
- rawuri remove: removes node
- Execution context: root = { repo (absolute), local
  (relative from repo root, starting with /) }
- Path resolution: / = local root, always forward
- Schema registry: _schema with schema.avsc convention,
  alias-mapping.txt
- AVRO RPC protocol over TCP on Bare
- Global CLI: `spl <schema> [key] [args...]`
- Schema-aware display: decodes known types in headers

## Current Work

Implementing rawuri with proper node record responses.
Key principles being applied:

- Node response is structured (type, timestamps, value).
  Only value.contents is opaque bytes.
- Pack at boundary only — handlers return plain objects,
  serialization happens when crossing RPC/onion boundary.
  AVRO (NodeRecord.toBuffer), not JSON.
- Read with fallback — try schema decode, fall back to
  plain object if already unpacked.
- / means local root. Paths resolve forward only.
  URIs returned are relative to local root.
- Functional resolution walks UP from local root to
  repo root (ancestor axis). Data scope walks DOWN
  from local root (descendants only).

## POC Sequence

1. ~~AVRO RPC server~~ ✓
2. ~~CLI submitting to server~~ ✓
3. ~~Stream record redesign~~ ✓
4. ~~rawuri get/put/remove~~ ✓
5. ~~datauri, metadatauri~~ ✓
6. ~~Schema-aware protocols (raw/data/metadata)~~ ✓
7. ~~Protocol resolution in cli.execute~~ ✓ (stream types are the protocol)
8. Context stream types with colocated mappings (roadmap)

## Key Design Decisions

See docs/DECISIONS.md for full log. Key points:

- Stream descriptor: { type } only — zero-cost dispatch
- Dual header entry: descriptor (base) + type-specific
  entry (mode, root, etc.)
- Handler contract: handler(record) → record. No
  dispatch arg. Orchestration in orchestrator types.
- Dispatch from namespace path: no registration.
  require(spl/path/to/handler)
- One function per module export
- spl/ root directory for all spl namespace code
- Execution context: root.repo = absolute filesystem
  path, root.local = /segment/path from repo root
- Node record: { type, created, modified, value:
  { type, length, contents } }. Metadata structured,
  content opaque bytes.
- Pack at boundary: plain objects in memory, AVRO
  serialization at RPC/onion boundaries only
- Schema directory convention: name/schema.avsc
  (matches code: name/index.js)
- No JSON serialization — AVRO is the wire format

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
auxiliary.

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
        get/index.js  — rawuri get (stub)
        put/index.js  — rawuri put (stub)
        remove/index.js — rawuri remove (stub)
        helpers.js    — shared auxiliary

_schema/              — local schema registry (metadata)
  alias-mapping.txt   — stream type → data schema
  spl/data/           — AVRO data schemas (.avsc)

_server/              — server instance (logs, state)
bin/                  — entry points (spl, spl-server, setup)
lib/                  — all dependencies
  avsc/              — AVRO types/serialization (subtree)
  avsc-rpc/          — AVRO RPC protocol (subtree)
  bare-*/            — platform deps (gitignored)
docs/                — schema reference, design submissions
```

- **Bare only** — no Node.js, no dual-runtime
- **node_modules → lib/** symlink for all module resolution
- **bin/spl** — global CLI, symlinked to ~/.local/bin
- **bin/spl-server** — RPC server, system service
- **bin/setup** — populates platform deps from npm

## What Works

- Stream record schema (spl.data.stream.record)
  with resolved descriptor union in headers
- Stream type dispatch: process.execute peels onion,
  xpath.raw.uri.get/put/remove stubs
- AVRO RPC protocol over TCP on Bare
- Global CLI: `spl <schema> [key] [args...]`
- Local schema registry: _schema with .avsc files
  and alias-mapping.txt
- In-memory pipeline (test-client.js)

## POC Sequence

1. ~~AVRO RPC server with spl.cli.execute message~~ ✓
2. ~~CLI submitting to server~~ ✓
3. ~~Stream record redesign: headers, stream types,
   dispatch, schema registry~~ ✓
4. rawuri (get/put/remove) implementation
5. Register rawuri on repo root node
6. Protocol resolution in cli.execute
7. Expand: datauri, metadatauri, learn from prototype

## Key Design Decisions

- Kafka record stream shape: offset, timestamp, key,
  value, headers (open key-value list)
- Stream descriptor resolved in header union — zero
  decode dispatch on happy path
- Stream types: functional identity in motion. Dispatch
  on headers.stream.type
- Dual header entry: base descriptor for generic code,
  type-specific entry for handlers (future)
- One base property bag schema (args + value), specific
  types extend it. AVRO "readable as" handles many reads
- Schema aliasing: stream type names alias to spl.data
  schemas via alias-mapping.txt
- _schema on repo root = local schema registry.
  Reality is local
- spl.data namespace for AVRO data schemas (carrier).
  Other namespaces for meaning (stream types)
- Namespace-mapped code layout: directory = node,
  index.js = code, other files = auxiliary
- Six fabric APIs (datauri/metadatauri/rawuri +
  data/metadata/raw)
- Underscore prefix as metadata dimension boundary
- Node self-containment for lift-and-shift portability
- Constitutive deps as git subtrees in lib/
- Platform deps gitignored, populated by bin/setup

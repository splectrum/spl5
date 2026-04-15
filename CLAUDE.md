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
AVRO RPC server, Kafka-native message shape, fabric
APIs, CLI as subject, and the namespace/node structure.

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

```
bin/          — entry point scripts (spl, spl-server, setup)
docs/         — policy (DEPENDENCIES.md), schema (MESSAGE.md)
lib/          — all dependencies
  avsc/       — AVRO types/serialization (constitutive, subtree)
  avsc-rpc/   — AVRO RPC protocol (constitutive, subtree)
  bare-*/     — platform deps (gitignored, populated by bin/setup)
mycelium/     — runtime code (fabric namespace)
```

- **Bare only** — no Node.js, no dual-runtime
- **node_modules → lib/** symlink for all module resolution
- **bin/spl** — global CLI, symlinked to ~/.local/bin
- **bin/spl-server** — RPC server, system service
- **bin/setup** — populates platform deps from npm (prebuilds only)

## What Works

- AVRO message schema (Kafka record shape, the onion)
- AVRO RPC protocol over TCP on Bare
- Global CLI: `spl <schema> [key] [args...]` from anywhere
- Server resolves repo root from caller's cwd (ancestor axis)
- In-memory pipeline (test-client.js)

## POC Sequence

1. ~~AVRO RPC server with spl.cli.execute message~~ ✓
2. ~~CLI submitting to server~~ ✓
3. rawuri (get/put/remove) through the RPC chain
   — needs headers/dispatch design discussion first
4. Register rawuri on repo root node
5. Protocol resolution in cli.execute
6. Expand: datauri, metadatauri, learn from prototype

## Key Design Decisions

- Kafka record message shape (timestamp, key, value,
  headers) for everything
- Six fabric APIs (datauri/metadatauri/rawuri +
  data/metadata/raw)
- Underscore prefix as metadata dimension boundary
- AVRO "readable as" — no strict signatures
- Single identifier system across all dimensions
- Node self-containment for lift-and-shift portability
- Transport classes use streamx.Transform directly
  (not bare-stream wrapper — object-mode compat)
- Constitutive deps as git subtrees in lib/
- Platform deps gitignored, populated by bin/setup

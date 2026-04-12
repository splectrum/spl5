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
engineering documentation. It covers seed principles,
language, reality, positioning, vocabulary, and
detailed engineering specs. All repos contribute to
it through submissions to the i-wonder repo.

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

## Current Work

Project 01 (engineering-foundation) contains:
- Seed spec notes (P1-P5 engineering analysis)
- Mycelium design docs (fabric, process/CLI, namespace)
- Implementation notes and POC sequence
- State of art positioning research
- Working procedure for persona-driven documentation

## POC Sequence

1. AVRO RPC server with spl.cli.execute message
2. CLI submitting to server
3. rawuri (get/put/remove) through the RPC chain
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

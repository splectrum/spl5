# Iteration 001 — Foundation

## Agreements

### Working Modes

Three working modes aligned to lifecycle stages:

- **Project cycle** — POC. Standalone, self-contained.
  Prove a concept. Clear start, clear end, independent.
- **Iteration cycle** — pilot. Interconnected, progressive.
  Plan, execute, review, feed next. Concerns develop in
  parallel, not strict sequence.
- **Sprint cycle** — production (future). Versioned
  delivery. Earns its way in when versioning does.

spl5 works in iteration cycles. Projects are available
when something needs proving in isolation.

### Candidate Mechanism

A candidate is a creation space — a subfolder within a
repo that is itself a functioning repo:

- From inside: self-sufficient. Own boot, proto map,
  runs its own protocols.
- From outside: a subject the parent can act on —
  examine, evaluate, spawn.

The candidate creates something new. When ready, spawn
releases it as an autonomous repo.

### Dev Env Repos

Built using the candidate mechanism. The first candidate
is the spawn POC — build it, validate it works, use
that experience to formalize spawn.

### Context Management

Worked on as needed, not upfront. Becomes concrete when
real context problems arise during work.

## Tasks

1. Git checkpoint resets auto-memory — prevent context
   bleeding across checkpoints.
2. spl script resolves local version — the right `spl`
   runs depending on where you're standing (parent vs
   candidate).

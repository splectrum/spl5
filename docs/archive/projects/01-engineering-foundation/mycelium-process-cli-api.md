# Mycelium Process CLI API

Design for the `spl` command — the substrate mouth.

---

## The CLI as Subject

The CLI is a subject. It has its own node — its own context, metadata, and protocol definitions. This is its body. The CLI's capabilities — envelope construction, traversal logic, resolution, introspection — are protocols in the CLI's own context, same pattern as everything else in the fabric.

The current working directory is a separate node — the target. The CLI operates *on* the cwd, not *as* the cwd. Every invocation is two contexts meeting: the CLI brings what it can do, the cwd brings what's there to do it on.

The CLI node's physical location is a deployment detail, not an architectural concern.

## The Command

```
spl <logical-type> [data]
```

One command. No flags. No options. No mode switches. All behaviour is context-driven — determined by the meeting of two contexts: the CLI's own and the cwd's accumulated reality.

The CLI does three things:

1. **Read** — the cwd node's accumulated context. Protocols, schemas, watcher expressions, execution mode, debug settings — already determined by the node's position in the fabric.
2. **Resolve** — match the logical type against the cwd's accumulated protocol definitions. Nearest ancestor wins.
3. **Execute** — wrap the logical type and data in a resolution envelope, dispatch to the resolved protocol handler using the execution mode found in the cwd's context metadata.

## The Resolution Envelope

Every invocation produces one message:

```
envelope {
  headers {
    namespace     — resolved protocol namespace
    logical-type  — as provided
    execution     — from context metadata (sync | queue | dry-run)
    debug         — from context metadata (present or absent)
    pov           — current working directory path
    trace         — traversal accumulation record
  }
  key   — current node path (XPath expression)
  value — data payload (opaque)
}
```

The envelope is an AVRO record. The handler receives it through a single RPC message: `resolve(envelope) → envelope`. The return envelope carries the result in the same shape.

## Protocol Resolution

The logical type in the command resolves against the cwd's ancestor axis:

```
spl housekeeping
```

With cwd at `/blog/submissions`:

1. Check `/blog/submissions/_meta` for protocol matching `housekeeping`
2. Check `/blog/_meta` for protocol matching `housekeeping`
3. Check `/_meta` for protocol matching `housekeeping`

First match wins. If `/blog/_meta` defines `blog.housekeeping` which conforms to base `housekeeping`, it resolves there. The CLI never needs to know the specific namespace — it sends the base type, the fabric resolves it.

No match on the full ancestor axis → nothing happens. No error, no fallback. Architecture of absence — no protocol in scope, no capability.

## Execution Modes

Execution mode is metadata in the cwd's context, not a CLI argument:

- **sync** — resolve, execute, return result. Default when no execution mode metadata is present.
- **queue** — resolve, place envelope in the node's process queue, return acknowledgment. The neurological mode.
- **dry-run** — resolve, report what would execute and against what data scope, return report. No state change.

A context can declare its default execution mode. A child context can override. The cwd's accumulated metadata determines which mode applies. The human doesn't choose — the node does.

## Debug Wrapping

Debug is a context metadata fact. When present on the cwd's ancestor axis, the execution wraps in the debug operation found nearest on the path.

```
/blog/_meta/debug → present
```

Every `spl` invocation within `/blog` and below now wraps in debug. The debug protocol itself is resolved on the ancestor axis — it can be a simple trace logger at one level, a full step-through inspector at another.

Remove the debug metadata, normal execution resumes. No code change, no restart.

## Data Scope

The command operates on two axes from the cwd node:

- **Ancestor axis (up)** — protocol resolution, metadata accumulation. What can I do here?
- **Self and descendant axis (down)** — data scope. What data does the resolved protocol operate on?

`spl housekeeping` in `/blog` — housekeeping protocol found on ancestor axis, operates on all data in `/blog` and below.

`spl housekeeping` in `/blog/submissions` — possibly different protocol resolved, operates only on submissions data and below.

Same command. Different position. Different protocol. Different data scope. Different result.

## Introspection

Introspection operations are protocols in the CLI's own context — not in the cwd's fabric. These are the CLI's native capabilities as a subject:

```
spl introspect
```

This resolves in the CLI's own context, not the cwd's ancestor axis. The CLI reads the cwd's accumulated metadata and reports it using its own introspection protocol. What it shows — available protocols, active watchers, execution mode, debug state, resolution chain — depends on how the CLI's own node is configured.

Different CLI configurations mean different introspection protocols in the CLI's own context. A development CLI might offer rich introspection. A minimal production CLI might offer none. Same pattern as everything else — the context determines the capability.

## Input Data

Data arrives as the second argument. The CLI does not interpret it:

```
spl blog.submission '{"title": "Mycelium and Memory", "author": "Jules"}'
```

```
spl blog.submission < submission.json
```

```
echo "some content" | spl blog.submission
```

Argument, stdin, pipe. The CLI passes opaque bytes into the envelope value. The resolved protocol's schema determines whether the data conforms. If it doesn't — the protocol decides what that means, not the CLI.

No data provided → empty value. The protocol may accept that (a trigger with no payload) or reject it (conformance failure). The CLI doesn't validate.

## Installation

The CLI is a subject with its own node. The executable provides the traversal and envelope logic. The CLI's own context provides its native protocols — introspection, resolution reporting, and other capabilities the CLI brings to the interaction.

The CLI node's physical location is not architecturally significant. What matters is that it is a separate context from the cwd. The CLI's capabilities and the cwd's reality combine at invocation. Different CLI node configurations produce different CLI behaviour — not through flags, but through what protocols are present in the CLI's own context.

## Physical Types and Logical Types

Physical types carry data structure. Logical types declare functional capability. The data schema says what's there. The logical type says what can be done with it. The physical carries. The logical activates.

This is the carrier/meaning split expressed as a type system. The resolution envelope already embodies it — opaque value (physical), logical type in headers (function). The handler is selected by logical type, not by inspecting the data.

This is a starting position. The distinction is clean and useful. Where it bends under pressure will be discovered during implementation.

## Logical Type Repos

Every logical type is a git repo. The repo name is the fully qualified logical type namespace. The repo *is* the logical type — not a description of it, but its living reality:

- Implementation
- Examples
- Quality gates and test suites
- Process reports from testing
- Design history

Clone a logical type repo into your fabric's references — you have the capability. Remove the reference — you don't. No package manager. No dependency resolution. Presence or absence in the fabric. Architecture of absence at the capability level.

This pattern is uniform. A meaning language like `splectrum.heidegger` — its concept list, explanations, cross-language mappings, quality gates. A persona definition — its footprint-operation mappings, coherence tests. A protocol library — its operations, schemas, test suites. A CLI configuration — its native protocols.

One shape. One mechanism for distribution, versioning, quality, and presence. All artefacts have equal standing (P4). All repos. All namespaced.

## Namespace Repo Tree

The namespace tree is a repo tree. Parent repos are wrapping contexts:

- `spl` — the framework. Seed, carrier language, naming grammar.
- `spl.mycelium` — wraps fabric, process, data, metadata.
- `spl.splectrum` — wraps meaning languages.
- `spl.haicc` — wraps cognitive artefacts.

A parent repo does not implement anything. It carries: what child repos constitute this context, how they integrate, what schemas are shared across them, what's the configuration for bringing this family into a subject reality. The parent is the curator, not the implementer.

The ancestor axis works across repos. A protocol defined in `spl.mycelium` is available to everything within `spl.mycelium.fabric` and `spl.mycelium.process`. Nearest wins still holds — a child repo can override.

Parent nodes can contain integration information: what's in scope, what configurations are available, how children compose. A configuration profile in the parent is a set of child repo references defining what's included. `core` — just fabric and substrate operations. `full` — everything. `dev` — full plus testing and debug tooling. Each profile is a scoping decision expressed as references.

Child repos grow as needed. A parent namespace need not exist as a repo for its children to exist. The tree grows from the leaves. A parent repo is born when unique content arises that belongs to the family but not to any child.

## Testing Layers

Testing follows the repo structure naturally:

- **Logical type repo** — carries its own quality gates. Self-sufficient.
- **Parent repo** — carries integration tests. Do these children work together in this configuration?
- **Target subject reality** — carries acceptance tests. Does this install do what the subject needs?

Quality gates in each repo are themselves protocol operations — testable through the same mechanism they test.

## CLI Node Variants

The CLI node is a repo. Namespaced. Cloneable. Forkable.

- `spl.cli` — base CLI. Minimal envelope and traversal.
- `spl.cli.herman` — personal CLI. Your protocols, your introspection style, your preferences.
- `spl.cli.debug` — specialised. Rich tracing, step-through, resolution reporting.
- `spl.cli.dev` — development. Full introspection, dry-run defaults, verbose resolution.

Clone a team CLI, fork it, make it yours. Share CLI configurations through git. No dotfiles. No config management. No export/import settings. Just repos.

Different CLI node, different experience, same fabric underneath. P2 — the CLI is the medium through which this subject accesses the fabric.

## Bootstrap — Bootloader and Boot

Life can only spawn from life. A subject reality cannot install itself from nothing (P0).

**Bootloader** — the act that creates a new subject reality. A seed repo, already a functioning subject reality, that can be cloned to produce new life. The bootloader carries the minimum: substrate operations, the resolution envelope schema, basic traversal metadata. A living cell. The bootloader is a one-time act — clone, scaffold, done. It doesn't persist, doesn't run, doesn't have opinions about what the subject becomes. It creates the boundary.

**Boot** — the process that runs when the subject reality activates. Traversal initialises, context accumulates, protocols discover themselves, watchers come alive. Boot runs every time the subject wakes up. It is the first breath, repeated.

Boot is itself a protocol in the seed's metadata. The one protocol that can't be discovered through traversal — because traversal doesn't exist yet. Pre-conditional, like the substrate operations. After boot, equal standing.

### Thawing

Git repos are static. Files on disk, history in the object store, everything frozen. Activating a subject reality is like thawing — the dynamics layer starts on top of the static structure. Watchers start observing, protocols become callable, the subject has a present, not just a past.

Freezing is the natural state when nobody's there. The repo doesn't degrade while frozen. Git holds it. Thaw when needed, freeze when done.

A subject reality can be frozen mid-process — dirty records, open transactions, incomplete readiness states — and thawing picks up where it left off. The state is in the fabric, not in memory. Boot reads it. Nothing is lost.

Note: thawing is analogical, not identity. The dynamics of a living subject reality are *like* thawing — the structural metaphor is useful but not a claim about mechanism.

### Packages

Packages are a convenience, not a fundamental. A parent repo with configuration profiles can serve as an install package — pick a profile, the references tell you what to clone. But the fundamental act is: clone from something alive, grow from there. Everything else is growth — referencing in additional logical type repos as the subject's reality expands.

An install protocol could exist in the CLI's own node — `spl install spl.mycelium.core` — as a convenience. Not required. Not architectural. Just a protocol like any other, present if someone built it.

## What the CLI Does Not Do

- Does not carry cwd protocol implementations
- Does not validate data against schemas
- Does not manage process queues
- Does not interpret results
- Does not maintain state between invocations
- Does not have flags, options, or configuration

It reads the cwd's context, resolves, wraps, dispatches. Its own protocols — introspection, resolution reporting — live in its own node context. Everything else belongs to the fabric.

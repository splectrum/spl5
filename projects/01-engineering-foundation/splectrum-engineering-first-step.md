# Splectrum Engineering — First Step Logical Plan

Logical design for the implementer. All physical decisions — language, framework, file layout, RPC implementation — are freedom of the implementer.

---

## Scope

Proof of concept implementing the mycelium fabric API and CLI client end-to-end. Once proven, factor into separate repos.

## Repos

- **spl.mycelium.fabric** — fabric APIs, RPC server, internal resolution
- **spl.process.cli** — CLI client, execute operation, command wrapping

## Message Shape

Kafka-inspired. Three fields:

- **Headers** — namespaced metadata. Operation identity, scope, process report, trace. Extensible.
- **Key(s)** — XPath path expressions. Addressing.
- **Value(s)** — opaque bytes. Content.

Request and response use the same shape. Bulk is the only mode. Single is bulk with count one.

| Operation | Input | Output |
|-----------|-------|--------|
| get | keys | key-values |
| put | key-values | key-values |
| remove | keys | key-values |

## Fabric API

Three API contexts under `mycelium/fabric`. Same operations, different visibility:

- **mycelium/fabric/datauri** — get, put, remove. Sees data node URIs only.
- **mycelium/fabric/metadatauri** — get, put, remove. Sees metadata node URIs only.
- **mycelium/fabric/rawuri** — get, put, remove. Sees all URIs.

All three return opaque bytes. No interpretation at this level. Schema discovery, resolution, and filtering are concerns of layers above.

The API is the fabric — protocol definitions as schema facts in contexts, discoverable during traversal. Adding an API is adding a context with schema facts. Removing one is removing the context.

The resolution envelope — which determines the visibility filtering — is a schema fact in the fabric. Inspectable, not hidden.

## CLI Protocol

The RPC server exposes one operation: **execute**.

- The CLI (`spl`) wraps the user's command into an execute message
- `spl <logical-type> [data]` becomes execute payload
- The logical type and data are content, not routing
- Resolution from command to fabric operations (get/put/remove) happens inside execute
- The fabric API is internal — not exposed on the RPC server

The CLI is a subject with its own context meeting the fabric. Two contexts, one invocation.

## Operation Schemas

Operations are defined as AVRO RPC schemas. One schema definition per operation, shared across all three fabric API contexts. The API context determines visibility behaviour, not the operation.

## Design Principles

- **API group as context** — `mycelium/fabric/datauri` is not "datauri's version of get." It is "get, in the context of datauri." The context shapes the behaviour.
- **Raw is full visibility** — rawuri is the unfiltered physical reality. Data and metadata are lenses that narrow visibility. Raw is essential for queries and diagnostics.
- **Opaque at this level** — the fabric API is purely structural. Navigate, retrieve, place, remove. No interpretation.
- **Structure is behaviour** — the resolution envelope as a schema fact means a context can declare its own visibility properties. No configuration, no flags.
- **Bulk only** — no singular case. Only bulk with count of one.

## Sequence

1. Proof of concept — everything in one implementation, full chain: CLI issues command → execute wraps → RPC server receives → fabric API resolves → result returns
2. Factor into repos per namespace map above

---

## Appendix — Emergent Properties

Properties that fall out of the design rather than being engineered in:

- **Stateless server** — the RPC server holds nothing. The fabric holds state, the message carries intent. The server is the meeting point — present but empty. No server configuration, no mode switches, no routing logic.
- **Caller control** — the API method (which fabric context) determines visibility. Header metadata carries execution concerns. The caller composes full intent in the message. Each layer reads its own concerns from the metadata and passes through what isn't theirs.
- **Floating execution** — the meeting point has no fixed address. Local, remote, embedded — the message shape and schema contract don't change. The CLI binds to a schema, not a location. Deployment is a physical concern the logical design is indifferent to.
- **Git as distribution** — execution goes wherever the repo goes. The repo is git, so it goes anywhere git goes. Remote execution is another clone with a running execute. No infrastructure for distribution. No service mesh. No orchestration.
- **Ownership as write boundary** — read anywhere, write at origin. Want a change to read-only data? Send the execute message to the owner. Same message shape, same schema contract, routed to the owner's endpoint. No distributed write coordination, no conflict resolution, no consensus protocol at the fabric level. You don't have write access — you have a conversation with someone who does.
- **One server per subject reality** — every execute resolves against a specific subject's fabric. The subject is sovereign over its own resources — throttle, queue, refuse. No external orchestrator. The subject experiences load and responds. Maps directly to the neurological model: the attention mechanism is the load manager.
- **Local CLI as entry point** — the CLI is a local entry into the same execute. Working inside the repo means you're inside the subject's boundary. Network or terminal — the subject doesn't distinguish. Just another context arriving.
- **Server context in the fabric** — the subject's operational concerns (queue, load, active connections, request history) live where all state lives: in the fabric, as a context. Inspectable, traversable, same pattern. The neurological model's ready pool is literally a context in the repo.

None of these are features. Each is a consequence of what the design doesn't include. Architecture of absence at the infrastructure level.

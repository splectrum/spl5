---
title: "Mycelium Fabric"
type: substantial
status: in-progress
destinations: engineering
---

# Mycelium Fabric

Substantial submission. The structural design of the mycelium data fabric — what it is, what it is made of, and how it behaves. This document describes the static architecture. Mycelium Process describes the dynamic layers and the operational interface.

---

## What Mycelium Is

Mycelium is a data fabric. It weaves data and process together into process-colocated data structures — structures where the process that operates on data lives alongside the data itself. These structures exist as git-constituted distributed version control repositories — where git provides the boundary, the memory, and the exchange. Within Splectrum, these repositories are called subject realities, conforming to P2: a subject accesses reality only through the relational. Each subject reality defines its own layer stack as part of its own identity.

Each subject reality has a partial view of available data. The totality of data is never a physical repository — it is only a logical totality, the sum of everything across the fabric. What actually exists is always mycelium fabric expressed as subject realities within git repos. Mycelium repositories are dynamic and self-contained at the base level with local embedding of processes.

Proven sufficient across 18 projects. No extensions required.

## The Primitive

The fabric is built from one primitive:

**Record** — a key mapped to content. Content is opaque bytes. The fabric does not interpret it.

**Context** — a bounded area that contains records. Records can themselves be contexts.

This is the entire structural vocabulary. Everything else — behaviour, visibility, process, schema awareness — emerges from how these two elements are arranged and what metadata accompanies them. The fabric is concerned with how data and process are colocated, how data is navigated, how references cascade, and how context layers override each other. It is not concerned with what is inside a record.

## The Boundary

The repository — a git repository — is a hard boundary. It constitutes the subject reality as a distinct entity with its own identity, history, and integrity.

There is no hidden data. Data is part of the subject reality if it exists in the mycelium data fabric within the git repo. Data referenced in from outside is localised — it receives a local identity within the subject's own fabric. There is no notion of accessing remote data. From the subject's perspective, everything is local. Mycelium does data WYSIWYG — what you see is what you get, nothing behind it.

Git provides the boundary, the memory, and the exchange. It is constitutive to the architecture — mycelium does not implement version control, it uses git.

## Subject Realities

There is no data world sitting somewhere as a single system. The data world is a logical totality — the sum of everything across the fabric. What actually exists is always subject realities.

Each subject reality is a scoped, working implementation. The whole emerges from partial couplings between realities — shared reality is produced by interaction, not discovered behind it. This is P3: through language interaction, subjects create units of sameness across their separate realities.

## Records

### Immutable and Dirty

Base-layer mycelium has two types of records:

**Immutable** — settled, permanent, referenceable. A complete fact that arrives whole and stays whole. Immutable records are the source of truth. Everything that matters is built from them.

**Dirty** — in-flight, part of an open transaction, can change. Dirty records serve as working space during a transaction and become immutable when the transaction closes. The consensus mechanism is pluggable — a simple local commit or a full blockchain protocol. Open state before consensus, settled state after.

### Mutable Structures as Projections

Mutable structures — tables, indexes, document libraries — are created by mycelium-native process that reads immutable data change records and maintains projections. This is process layer embedded in mycelium, not an external concern. Projections exist for practical work but are never the source of truth. They can be discarded and rebuilt from the immutable records.

### Fabric Schemas

Mycelium defines a small set of native record schemas — fabric schemas — for its own operations: data change records, reference records, transaction records. These are mycelium's own language, needed for fabric-level functionality. Application schemas are a concern of the embedded process layer — the fabric stays opaque at the content level except for its own native types.

Higher-level mycelium contexts define further structure — tables, indexes, data access interfaces — built on top of the base layer. These are not base-layer concerns.

## Layers

### The Layering Mechanism

The fabric is layered. At the bottom is the physical layer — raw records and contexts, opaque bytes, no interpretation. Above it, data layers stack with defined read modes and synchronisation modes. Each layer is declared in context metadata and discovered during traversal.

The layering mechanism is a fabric concern. Specific layer types — projections, indexes, process state, data access interfaces — are instances of the mechanism, defined by the protocol libraries that create them. The fabric provides the stacking, the read mode resolution, and the synchronisation infrastructure. It does not prescribe what layers exist.

### Data Access Kinds

The fabric provides distinct kinds of data access: raw (opaque bytes, no interpretation), metadata (traversal and accumulation of context metadata), and data (schema-interpreted access where content is resolved through discovered schemas). These are the fabric's own access vocabulary — different ways of reading the same underlying structure.

Each access kind is a logical type. The logical design assigns behaviour to the logical type. Implementation makes it happen. The same data, read through a different logical type, yields a different access experience. This is the same pattern that operates at every level of the architecture — reading natural language as natural, as Heidegger, as Rorty. The fabric's access modes are the first instance.

How these logical types are addressed — as protocol sub-paths, as configuration, as routing — is an implementation concern. The architectural fact is: distinct access kinds exist, identified by logical type, each with defined behaviour.

### Safe Mode

Safe mode is physical-layer-only access — raw bytes, no schema discovery, no interpretation, no process activation, no layering. Records as opaque bytes, contexts as structure, nothing more.

Safe mode is the recovery guarantee. Whatever the layers above do, however they are configured, the raw physical layer is reachable. If a layer is corrupted, misconfigured, or simply not needed, safe mode bypasses it entirely. The floor is always solid.

### Read Modes

Each layer declares its own read mode — how data in that layer is accessed. The read mode is a per-layer property, not a per-access choice. The subject reality defines its layers and their read modes as part of what it is. The subject accesses its own reality, not individual layers. What is seen is determined by the layer stack the subject has constituted as part of its own identity.

Read modes include direct read of settled state, changelog-aware read that includes change history, and schema-interpreted read where content is resolved through discovered schemas. The mechanism is uniform — the specific modes are defined by the layer type.

### Synchronisation

When layers derive from the same underlying data — a projection layer reading immutable records, an index tracking a mutable structure — the synchronisation mode defines how the derived layer stays current. Synchronisation modes are per-layer metadata: immediate (process on every change), batched (periodic reconciliation), or on-demand (rebuild when accessed).

The mechanism is the same as the trigger model in the process layer — data footprint observation. A derived layer is a process that watches its source and maintains its output. The fabric provides the infrastructure for declaring and discovering these relationships. The process layer provides the execution.

### Data Conformance

Data within the fabric does not need to be in the paradigm format. It needs to be conformant with it — transformable into it when the moment requires. The discipline is in the transformability, not in the storage format.

This is "is like" rather than "is." Working data — queues, drafts, transient structures — can follow whatever local practice fits the purpose. When data needs to enter the disciplined zone — for sharing, for projection, for immutable settlement — a process transforms it into the required representation. That transformation is the boundary crossing. From there, the full paradigm follows naturally.

The conformance principle applies uniformly. AVRO's reader schema mechanism — "can this be read as" — is the operational test. Data does not need to become the target format. It needs to be readable through it.

## Mycelium Context

A fabric node with embedded metadata is a mycelium context. It is the reference point for embedded metadata artefacts — processes, schema definitions, behavioural rules. Contexts cascade: inner context overrides outer. Definitions reside closest to their realisation.

### Structure Is Behaviour

There are no flags. There is no configuration. A context with a bin has soft delete. A flat context skips interior traversal. What you build is how it behaves. What you don't build doesn't exist as a possibility.

This is the architecture of absence. Desirable properties emerge from what is not present rather than from what is policed. You don't prevent unwanted behaviour by adding rules against it — you prevent it by having no structure in which it can occur.

### Traversal

Navigation walks the path from root to target. At each segment, the traversal checks for context definitions — metadata. These are merged into an accumulator as the path is walked. Nearest distance wins: metadata defined closer to the target overrides metadata from further up the path.

Mutability, changelog mode, enforcement, and all other behavioural properties are driven by metadata accumulated during traversal. The path determines the rules. Different paths to different targets accumulate different metadata, producing different behaviour. The fabric is not uniformly configured — it is locally shaped.

### Flat Contexts

A context marked flat treats its interior as content, not sub-contexts. Traversal hops over physical structure to the resource directly. This allows a context to contain complex internal structure — a zip file, an AVRO container, a nested folder hierarchy — without that structure being interpreted as fabric sub-contexts.

### Point of View

The working directory sets the point of view. POV determines what you can see and how you identify it. Resources are relative to POV — paths go forward, never backward above POV. The subject sees the fabric from where it stands.

Protocol operations are root-relative — all available operations are accessible regardless of where the point of view is set. What changes with POV is visibility and identity, not capability.

### References

References bring remote resources into view by creating a local identity. They are read-only — modification uses copy-on-write to the local context. Read wide, write local.

The graph of references defines the reachable set from any point of view. No reference, no access. Structure determines visibility, not permissions. What you can see is what the fabric's reference graph makes available to you. There is no hidden data accessible through special privilege — only data that is or is not in your reachable set.

## Interaction Modes

**Data state propagation** is the default mode. Subjects react to state changes in the fabric. Decoupled, reactive, no direct communication needed. A process produces output. That output is visible as a data state change. Another process observes the change and acts. No messages pass between them.

**Conversational mode** is direct protocols between subjects. This is a CDM-level process concern, not a fabric concern. When subjects need to interact directly — request-response, negotiation, coordination — they use conversational protocols. The fabric is a propagation medium; conversation is a higher-level pattern.

Boundary gating — trust decisions about what crosses between contexts — is handled by higher-level process. The fabric propagates. The process layer decides what to propagate.

## Addressing

Addressing is solved by ownership. The subject reality that creates data owns it, identified by the repo's unique endpoint. Cross-references from other realities trace back to the originating identifier. Fully decentralised, no central registry.

Within a subject, XPath-style addressing navigates contexts, accesses records, and reaches metadata through one uniform scheme. The path expression serves as both flat addressing and query — a direct path to a known location and a pattern that resolves against the fabric structure. The addressing language is the same regardless of what is being addressed.

## Security Model

Mycelium runs by design in a trusted environment. The hard security boundary sits around the trusted environment and is responsible for security. Standard subject realities within the trusted environment do not have their own hard security boundary. Trust is environmental, not per-entity.

Deployment in a public environment — outside the trusted boundary — uses subject realities with hard security boundaries. These are reinforced bubbles: the underlying data remains in the trusted fabric, the bubble is a disposable projection. If the bubble is compromised, it is discarded and rebuilt. Blockchain is an optional consensus mechanism at the hard boundary, not a structural dependency.

## What the Fabric Does Not Do

The fabric does not interpret record content. It does not enforce schemas. It does not manage process execution. It does not schedule, prioritise, or orchestrate. It does not implement security within the trusted environment. It does not route messages between processes.

These are all concerns of the layers above — the process layer, the protocol libraries, the security boundary. The fabric provides the substrate: the tree structure, the records and contexts, the metadata, the traversal, the cascading behaviour. Everything else is built on top, using the fabric's own primitives.

This separation is deliberate. The fabric's power is in what it does not do. By staying minimal, it stays universal. Any process, any schema, any language can operate on it. The fabric does not need to change when the layers above evolve. It is the stable ground.

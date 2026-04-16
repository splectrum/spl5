# Design Decisions

Running log of design decisions made during
implementation. Captures what was decided, why,
and what it replaced.

---

## 2026-04-16

### Stream record headers: open key-value list

Headers is a flat list of `{ key: string, value }`.
The key is a namespace path. No fixed fields. The
`spl.data.stream` descriptor is a resolved union
branch for zero-cost dispatch.

**Why:** Fixed header structures constrain what can
be carried. Open list with self-describing keys
supports discovery and direct access.

### Stream descriptor: type only

The `spl.data.stream` descriptor carries `{ type }`
only. Args and value do not belong in the descriptor
— they overcomplicate it. Type-specific data lives
in the type's own header entry.

**Why:** The descriptor's job is dispatch. One field,
one read, one route.

### Dual header entry pattern

The stream descriptor carries the base (type name).
The stream type's own header entry carries
type-specific properties (mode, root, etc.). Same
data, two lenses — generic code reads the descriptor,
handlers read their type entry.

**Why:** Separation of dispatch concern from handler
concern. Base is always resolved. Specific is decoded
on demand.

### One base property bag: args + value

All stream type property bags share one base:
`{ args, value }`. Operators have args. Contexts
have args null. No separate schema hierarchy.

**Why:** The distinction is usage, not structure.
Same schema, different patterns.

### Execution context propagation

The execute handler copies its type-specific header
entry into the inner record's headers before dispatch.
Operators read `spl.mycelium.process.execute` from
their headers for root, mode.

**Why:** Operators need execution context for path
resolution. The context travels with the request.

### Execution context: root = { repo, local }

Two roots. Repo root is the subject reality boundary.
Local root is the caller's position. Client resolves
both, sends in the execute context.

**Why:** Absolute addressing resolves from repo root.
Relative addressing resolves from local root. Both
needed for xpath.

### Handler contract: handler(record) → record

Handlers receive a record and return a record. No
dispatch parameter. Orchestration (sequencing,
pipelines) lives in orchestrator types. Handlers do
their job and return.

**Why:** Orchestration leaking into handlers couples
them to the dispatch mechanism. Handlers should be
independent.

### Dispatch resolves handlers from namespace path

`spl.mycelium.process.execute` → `spl/mycelium/process/execute/index.js`.
Strip dots, join as path, require. No registration,
no handler registry. The namespace IS the path.

**Why:** One convention does all the work. Adding a
handler means creating a directory with index.js.

### Schema registry: _schema on repo root

Schemas live in `_schema/` as `.avsc` files mapped
by namespace path. `alias-mapping.txt` maps stream
type names to data schemas. Reality is local — each
repo carries its own type vocabulary.

**Why:** Node self-containment. No external registry.
Discovery by filesystem traversal.

### Schema aliasing via flat mapping file

All data schemas under `spl.data.*`. Everything else
aliases via `_schema/alias-mapping.txt`. One file,
two columns, loaded once.

**Why:** The `spl.data` namespace is the carrier.
Other namespaces are meaning. Directory trees for
aliases are pointless overhead.

### spl.data namespace for AVRO data schemas

Carrier schemas in `spl.data`. Meaning (stream types)
in `spl.mycelium`, `spl.splectrum`, `spl.haicc`. The
data namespace mirrors the structure it serves:
`spl.data.mycelium.process` for `spl.mycelium.process`
types.

**Why:** Carrier/meaning separation at the namespace
level.

### Pack at boundary, not in memory

Inside the process, records carry plain objects. AVRO
packing happens only when crossing a boundary — RPC,
serialisation to value (the onion), storage. Read with
fallback: try fromBuffer, fall back to plain object.

**Why:** Serialise when you must, not when you can.
Flexibility inside, schema adherence at the perimeter.

### Namespace-mapped code layout

Directory = namespace node. `index.js` = code for that
name. Other files = auxiliary. One function per module
export.

**Why:** The namespace is the filesystem. Finding
code means following the namespace path. No mapping
tables.

### Code under spl/ root

All Splectrum code under `spl/` in the repo. Namespace
maps directly to filesystem from repo root. No spl.
stripping in the resolver. Non-spl namespaces can
coexist at the same level.

**Why:** Uniform namespace resolution. Other libraries
start at the same level.

### Node response is structured, content is opaque

The rawuri "opaque bytes" characterisation applies to
the **content** of a leaf node (the file bytes), not
to the node response. A node is always a structured
record:

```
{
  type:     "leaf" | "branch"
  created:  long
  modified: long
  value: {
    type:     string    — content type
    length:   long
    contents: bytes     — THIS is opaque
  }
}
```

The node envelope is fabric knowledge — always
structured. The content payload (`value.contents`)
is where "opaque" lives. The uri level knows about
nodes. It doesn't interpret what's inside them.

The stream record's `key → value` maps to
`address → node`. The entire node (metadata + content)
is the value.

**Replaces:** treating the entire stream record value
as raw bytes. The rawness is at the content level,
not the node level.

### No JSON — AVRO is the wire format

Node records are serialized with `NodeRecord.toBuffer()`
at the boundary, not `JSON.stringify()`. AVRO is the
serialization format. JSON has no role in the wire
protocol.

**Why:** The schema exists. Use it. One serialization
format, not two.

### Remove just removes

`rawuri.remove` deletes the node and returns an empty
value. It does not read the content before removing.
If the caller wants the content, they get first.

**Why:** Unnecessary I/O. The ref lib says "value
empty → removed data" — the result confirms removal,
not the removed content.

### Schema directory convention: name/schema.avsc

Schema directories use `schema.avsc` inside, matching
the code convention of `index.js` inside handler
directories. `spl.data.stream.record` lives at
`_schema/spl/data/stream/record/schema.avsc`.

**Why:** The directory IS the name. Auxiliary files
can sit alongside. Consistent with code layout.

### Local root is relative with leading /

`root.repo` is absolute filesystem path.
`root.local` is `/segment/path` from repo root.
`/` = repo root. `/spl/mycelium` = invocation from
that subfolder.

**Why:** The repo root is the anchor. The local root
is a position within it. Absolute path would be
redundant.

### Addressing: / means local root, forward only

Key `/package.json` from local root `/spl/mycelium`
resolves to `spl/mycelium/package.json` in the repo.
The caller sees `/package.json` — the internal
resolution is hidden. URIs returned are relative to
local root.

Functional resolution walks UP from local root to
repo root (ancestor axis). Data scope walks DOWN
from local root into descendants only.

**Why:** From the ref lib — POV determines reality.
Paths go forward, never backward above POV. The
path segments are implementation context, out of
scope for the caller.

### Raw means full visibility, not "no structure"

rawuri returns everything — data and metadata nodes.
The node response is structured (type, timestamps,
value). Only `value.contents` is opaque bytes. "Raw"
means no filtering between data and metadata, not
no structure.

**Why:** From the ref lib — raw is the unfiltered
physical reality. Data and metadata are lenses on
it. The node envelope is fabric knowledge.

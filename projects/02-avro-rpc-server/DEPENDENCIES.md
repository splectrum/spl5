# Dependency Policy — Proposal

How Splectrum manages code dependencies. This is a
proposal for spl5 prototyping and forward.

---

## Principle

A subject reality is self-contained. The code that
runs is code you control. No external authority in
the supply chain. No runtime dependency resolution.
No registry as intermediary.

This follows from node self-containment (lift and
shift), the architecture of absence (what you don't
compose in doesn't exist), and P2P distribution via
Pear (the bundle IS the application).

---

## Dependency Categories

### Constitutive

Dependencies that are part of the architecture.
Splectrum forks, maintains, and evolves them. They
are as much Splectrum code as any other module.

These live under the `bare-for-pear` organisation
on GitHub. Cloned locally. Referenced as local file
dependencies.

| Dependency | Purpose | Source |
|-----------|---------|--------|
| avsc | AVRO type system, serialization | bare-for-pear/avsc |
| avsc-rpc | AVRO RPC protocol layer | bare-for-pear/avsc-rpc |

**Reference format:**
```json
{ "avsc": "file:../../bare-for-pear/avsc" }
```

**Policy:**
- Forked from upstream, barified, maintained locally
- Changes committed to bare-for-pear org repos
- Upstream changes pulled deliberately, reviewed
- Full ownership — free to diverge when the
  architecture requires it

### Platform

Dependencies that ARE the platform. Maintained by
Holepunch. Same relationship as a program to its
runtime — you build on them, you don't own them.

These are referenced directly from Holepunch's
GitHub repos, pinned to specific release tags.

| Dependency | Purpose | Source |
|-----------|---------|--------|
| bare-fs | Filesystem | holepunchto/bare-fs |
| bare-path | Path operations | holepunchto/bare-path |
| bare-net | TCP networking | holepunchto/bare-net |
| bare-node-runtime | Node.js compat layer | holepunchto/bare-node-runtime |
| bare-process | Process API | holepunchto/bare-process |
| bare-buffer | Buffer API | holepunchto/bare-buffer |
| bare-crypto | Crypto primitives | holepunchto/bare-crypto |

**Reference format:**
```json
{ "bare-fs": "github:holepunchto/bare-fs#v4.7.0" }
```

**Policy:**
- Source from GitHub, not the npm registry
- Pinned to release tags — updates are deliberate
- Not forked unless a specific issue requires it
- If a platform module needs modification, fork to
  bare-for-pear, it becomes constitutive
- Trust the platform vendor at the source level

---

## What We Don't Do

**No npm registry as distribution source.** The npm
registry is a publication intermediary that adds a
step where things can go wrong — compromised
credentials, build-time injection, typosquatting,
supply chain attacks. We skip it entirely.

**No runtime dependency resolution.** All code is
resolved at development time and bundled for
distribution. Pear distributes the complete bundle
P2P. The receiving peer runs exactly what was built.

**No transitive trust.** A dependency's dependencies
are also our concern. Constitutive dependencies are
barified — their own dependency trees are audited
and controlled. Platform dependencies are trusted
at the source level (Holepunch's GitHub).

**No lock files as security.** Lock files pin
versions but still fetch from the registry. We pin
at the source (git tags) and fetch from the source
(GitHub repos). The source IS the lock.

---

## Local Development Structure

```
~/bare-for-pear/
  avsc/              — constitutive, forked
  avsc-rpc/          — constitutive, owned

~/splectrum/spl5/
  projects/02-avro-rpc-server/
    package.json     — file: and github: refs
```

All constitutive repos cloned locally under
`bare-for-pear/`. The spl5 project references them
via `file:` paths. Platform dependencies referenced
via `github:` with tag pins.

`npm install` is a development convenience for
resolving the dependency graph locally. It fetches
from GitHub, not npm. The resulting `node_modules`
is a local cache, not a distribution artifact.

---

## Bundle and Distribution

`bare-bundle` resolves all dependencies from the
local source tree and produces a single artifact.
Pear distributes this artifact P2P. The chain:

```
source tree → bare-bundle → pear distribute → peer
```

No registry, no intermediary, no external authority
at any point. The code that runs on the peer is the
code in your source tree.

---

## Version Management

**Constitutive:** versioned by commit in the
bare-for-pear repos. The file: reference always
points to the local clone. Version is whatever
commit is checked out.

**Platform:** versioned by git tag. The github:
reference pins to a specific release. Update by
changing the tag in package.json and testing.

**Updating platform dependencies:**
1. Check Holepunch's repo for new releases
2. Update the tag in package.json
3. Run `npm install` (fetches from GitHub)
4. Test on Bare and Node
5. Commit the package.json change

---

## When a Platform Dependency Needs a Fix

If a bare-* module has a bug or incompatibility:

1. Fork to bare-for-pear organisation
2. Fix the issue
3. PR upstream if appropriate
4. Reference changes from file: (now constitutive)
5. If upstream merges the fix, revert to github:
   reference at the new tag

The boundary between platform and constitutive is
permeable. A dependency moves from platform to
constitutive when you need to change it. It can
move back when upstream catches up.

---

## Rationale

This policy is not paranoia. It is architectural
consistency.

Splectrum's self-containment principle says: what
you compose in is what exists. The dependency
policy is the same principle applied to the supply
chain. The code you run is the code you chose. No
surprises from intermediaries, no implicit trust in
registries, no runtime resolution from external
sources.

The Pear distribution model already requires this
for the final artifact. This policy extends the
same discipline to the development process.

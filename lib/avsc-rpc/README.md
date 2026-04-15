# avsc-rpc

AVRO RPC protocol layer extracted from [avsc](https://github.com/mtth/avsc) v5 (pre-v6 services removal). Maintained as a separate module for use with the Bare runtime.

Provides `Service.forProtocol()`, server/client creation, and transport channels (in-memory, TCP, HTTP).

## Origin

The RPC layer was removed from avsc in v6 ([PR #428](https://github.com/mtth/avsc/pull/428)) as part of a modernisation effort. This module preserves and maintains it as a standalone concern.

Extracted from commit `dd82783` of mtth/avsc (the ES6-converted codebase, last version with services).

## Dependencies

- **avsc** (peer) — type system and serialization
- **buffer**, **events**, **stream** — with Bare runtime mappings via package.json imports

## License

MIT — same as avsc upstream.

---
name: bare-stream vs streamx transport classes
description: Transport/codec classes must extend streamx.Transform directly, not bare-stream's wrapper — byteLengthWritable breaks on object-mode writes
type: feedback
---

avsc-rpc transport classes (NettyEncoder/Decoder, FrameEncoder/Decoder) must extend `streamx.Transform` directly, not `bare-stream`'s Transform wrapper.

**Why:** bare-stream's Transform always sets a `byteLengthWritable` function that expects `data.chunk.byteLength` (assumes all writes are wrapped in `{chunk, encoding}`). When avsc-rpc writes raw objects `{id, payload}` to encoders (object-mode writes), `{id, payload}.byteLength` is undefined → NaN in buffer tracking → crash. Also: streamx and bare-stream have no `unpipe` — use error suppression instead.

**How to apply:** Any stream class that receives non-Buffer writes should extend `streamx.Transform` (2-arg `_transform(data, cb)`) rather than `bare-stream`'s wrapper. Only use bare-stream when the write side always receives Buffers or strings.

[In Wonder - The World of Splectrum](../../) > [Engineering](../) > [avsc](./) > Schema Parsing

# avsc Schema Parsing

Schema definition formats — JSON schemas and Avro IDL
— and how avsc parses them into Type instances.

---

## JSON Schemas

The primary schema format. A JSON object that
describes an Avro type.

```javascript
const avro = require('avsc')

// Parse from JSON text
const type = avro.readSchema(`{
  "type": "record",
  "name": "spl.mycelium.Message",
  "fields": [
    { "name": "key", "type": "string" },
    { "name": "value", "type": "bytes" }
  ]
}`)
```

`readSchema` parses JSON text into schema attributes.
`Type.forSchema` takes schema attributes (a JavaScript
object) and returns a Type instance.

## Avro IDL

Avro's Interface Definition Language — a more readable
format for defining protocols with multiple types and
messages.

```
@namespace("spl.mycelium")
protocol Mycelium {

  record Message {
    long offset = 0;
    long timestamp;
    string key;
    bytes value;
    Headers headers;
  }

  record Headers {
    Record record;
    array<ContextEntry> context;
  }
}
```

### Parsing IDL

```javascript
// Async — resolves imports from filesystem
avro.assembleProtocol('./protocol.avdl', (err, attrs) => {
  // attrs is the protocol definition
  // attrs.types contains all defined types
  // attrs.messages contains all defined messages
})
```

```javascript
// Parse protocol from schema object (not IDL)
const attrs = avro.readProtocol(protocolObj)
```

### IDL Import Resolution

IDL files can import other IDL files. avsc resolves
imports from the filesystem using `bare-fs` and
`bare-path` in the fork.

```
// In an .avdl file:
import idl "common-types.avdl";
import schema "external-type.avsc";
import protocol "other-protocol.avpr";
```

The `files.js` module provides synchronous and
asynchronous import hooks that resolve paths relative
to the importing file.

## Protocols

A protocol defines a named scope containing types and
messages. In Avro's model, a protocol is what avsc-rpc
uses to create services.

```javascript
const protocol = {
  protocol: 'ExecutionService',
  namespace: 'spl.mycelium.process.execute',
  types: [
    // Record, enum, fixed type definitions
  ],
  messages: {
    exec: {
      request: [{ name: 'message', type: 'Message' }],
      response: 'Message'
    }
  }
}
```

The protocol is the bridge between avsc (types) and
avsc-rpc (services). avsc parses and resolves the
types. avsc-rpc takes the protocol and creates a
service with client/server channels.

## Namespaces

Avro namespaces are dot-separated paths that qualify
type names. In mycelium, the namespace is not just
organisational — it is architecturally constitutive.
The namespace identifies the meaning language.

```javascript
// Fully qualified
'spl.mycelium.Message'

// Namespace inherited from enclosing record
{
  namespace: 'spl.mycelium',
  name: 'Message'    // resolves to spl.mycelium.Message
}
```

avsc resolves namespaces following Avro specification
rules — inner types inherit the namespace of their
enclosing type unless explicitly overridden.

See [AVRO Design Scope](../mycelium/avro-design-scope)
— section 8, Namespacing — for how this serves the
architecture.

---

*© 2026 In Wonder - The World of Splectrum, Jules ten Bos. The conversation lives at [In Wonder - The Conversation](https://julestenbos.blogspot.com).*

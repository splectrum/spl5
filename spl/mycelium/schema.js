const avro = require('avsc')
const fs = require('bare-fs')
const path = require('bare-path')
const { repoRoot } = require('./resolve.js')

// --- Schema Loader ---
//
// Loads schemas from the _schema tree by namespace path.
// The _schema directory on the repo root is the local
// schema registry. Reality is local.
//
// Namespace path → filesystem path:
//   spl.data.stream.record → _schema/spl/data/stream/record.avsc
//
// Aliases: alias-mapping.txt at _schema root.
// Two columns: alias name → schema name. Loaded once.

const cache = {}
let aliasMap = null
let schemaRoot = null

function getSchemaRoot () {
  if (schemaRoot) return schemaRoot
  let root = repoRoot(typeof Bare !== 'undefined'
    ? require('bare-os').cwd()
    : process.cwd())
  schemaRoot = root ? path.join(root, '_schema') : null
  return schemaRoot
}

// Load alias-mapping.txt into a map (once)
function getAliasMap () {
  if (aliasMap) return aliasMap
  aliasMap = {}
  let root = getSchemaRoot()
  if (!root) return aliasMap
  let file = path.join(root, 'alias-mapping.txt')
  if (!fs.existsSync(file)) return aliasMap
  let text = fs.readFileSync(file, 'utf-8')
  for (let line of text.split('\n')) {
    line = line.trim()
    if (!line || line.startsWith('#')) continue
    let parts = line.split(/\s+/)
    if (parts.length >= 2) aliasMap[parts[0]] = parts[1]
  }
  return aliasMap
}

// Load a schema by fully qualified name
function loadSchema (name) {
  if (cache[name]) return cache[name]

  // Check alias mapping
  let aliases = getAliasMap()
  if (aliases[name]) {
    let resolved = loadSchema(aliases[name])
    cache[name] = resolved
    return resolved
  }

  let root = getSchemaRoot()
  if (!root) throw new Error('no _schema directory found')

  let parts = name.split('.')
  let file = path.join(root, ...parts) + '.avsc'

  if (!fs.existsSync(file)) {
    throw new Error('schema not found: ' + name)
  }

  let def = JSON.parse(fs.readFileSync(file, 'utf-8'))
  let type = avro.Type.forSchema(def)
  cache[name] = type
  return type
}

// List all schema names under a namespace prefix
function listSchemas (prefix) {
  let root = getSchemaRoot()
  if (!root) return []

  let names = []

  // Filesystem schemas
  let parts = prefix.split('.')
  let dir = path.join(root, ...parts)
  if (fs.existsSync(dir)) {
    let entries = fs.readdirSync(dir)
    for (let entry of entries) {
      if (entry.startsWith('_') || entry.startsWith('.')) continue
      let full = path.join(dir, entry)
      let stat = fs.statSync(full)
      if (stat.isFile() && entry.endsWith('.avsc')) {
        names.push(prefix + '.' + entry.slice(0, -5))
      } else if (stat.isDirectory()) {
        names.push(...listSchemas(prefix + '.' + entry))
      }
    }
  }

  // Aliases matching prefix
  let aliases = getAliasMap()
  for (let alias of Object.keys(aliases)) {
    if (alias.startsWith(prefix + '.')) {
      names.push(alias)
    }
  }

  return names
}

// --- Convenience: load the core schemas ---

const StreamRecord = loadSchema('spl.data.stream.record')
const OperatorBag = loadSchema('spl.data.stream.operator')
const ExecuteContext = loadSchema('spl.data.mycelium.process.execute')

// --- Header Helpers ---

// Stream descriptor — resolved in the union, not encoded
function streamHeader (type, args, value) {
  return {
    key: 'spl.data.stream',
    value: { type, args: args || null, value: value || null }
  }
}

// Typed reference for args/value in the descriptor
function typedRef (schemaName, type, data) {
  return { type: schemaName, value: type.toBuffer(data) }
}

// Type-specific header — encoded with its schema
function encodedHeader (key, type, data) {
  return { key, value: type.toBuffer(data) }
}

// Context header — raw bytes
function contextHeader (key, value) {
  return { key, value: Buffer.from(value) }
}

// Read the stream descriptor from headers (already resolved)
function getStreamDescriptor (headers) {
  let entry = headers.find(h => h.key === 'spl.data.stream')
  return entry ? entry.value : null
}

// Find a header entry by key
function findHeader (headers, key) {
  return headers.find(h => h.key === key)
}

// List all header keys
function headerKeys (headers) {
  return headers.map(h => h.key)
}

module.exports = {
  loadSchema,
  listSchemas,
  StreamRecord,
  OperatorBag,
  ExecuteContext,
  streamHeader,
  typedRef,
  encodedHeader,
  contextHeader,
  getStreamDescriptor,
  findHeader,
  headerKeys
}

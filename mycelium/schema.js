const avro = require('avsc')
const fs = require('bare-fs')
const path = require('bare-path')
const { repoRoot } = require('./resolve.js')

// --- Schema Loader ---
//
// Loads .avsc files from the _schema tree by namespace
// path. The _schema directory on the repo root is the
// local schema registry. Reality is local.
//
// Namespace path → filesystem path:
//   spl.data.stream.record → _schema/spl/data/stream/record.avsc
//
// Aliases: an .avsc file with { "alias": "spl.data.stream.operator" }
// resolves to the aliased schema. The alias is a fact in the filesystem.

const cache = {}
let schemaRoot = null

function getSchemaRoot () {
  if (schemaRoot) return schemaRoot
  let root = repoRoot(typeof Bare !== 'undefined'
    ? require('bare-os').cwd()
    : process.cwd())
  schemaRoot = root ? path.join(root, '_schema') : null
  return schemaRoot
}

// Load a schema by fully qualified name
function loadSchema (name) {
  if (cache[name]) return cache[name]

  let root = getSchemaRoot()
  if (!root) throw new Error('no _schema directory found')

  let parts = name.split('.')
  let file = path.join(root, ...parts) + '.avsc'

  if (!fs.existsSync(file)) {
    throw new Error('schema not found: ' + name + ' (' + file + ')')
  }

  let text = fs.readFileSync(file, 'utf-8')
  let def = JSON.parse(text)

  // Resolve alias
  if (def.alias) {
    let resolved = loadSchema(def.alias)
    cache[name] = resolved
    return resolved
  }

  let type = avro.Type.forSchema(def)
  cache[name] = type
  return type
}

// List all schema names under a namespace prefix
function listSchemas (prefix) {
  let root = getSchemaRoot()
  if (!root) return []

  let parts = prefix.split('.')
  let dir = path.join(root, ...parts)

  if (!fs.existsSync(dir)) return []

  let names = []
  let entries = fs.readdirSync(dir)
  for (let entry of entries) {
    let full = path.join(dir, entry)
    let stat = fs.statSync(full)
    if (stat.isFile() && entry.endsWith('.avsc')) {
      names.push(prefix + '.' + entry.slice(0, -5))
    } else if (stat.isDirectory()) {
      // Recurse into subdirectories
      names.push(...listSchemas(prefix + '.' + entry))
    }
  }
  return names
}

// --- Convenience: load the core schemas ---

const StreamRecord = loadSchema('spl.data.stream.record')
const StreamDescriptor = loadSchema('spl.data.stream.descriptor')
const ExecuteContext = loadSchema('spl.mycelium.process.execute')
const OperatorBag = loadSchema('spl.data.stream.operator')

// --- Header Helpers ---

function encodeHeader (key, type, value) {
  return { key, value: type.toBuffer(value) }
}

function decodeHeader (entry, type) {
  return type.fromBuffer(entry.value)
}

function findHeader (headers, key) {
  return headers.find(h => h.key === key)
}

function headerKeys (headers) {
  return headers.map(h => h.key)
}

module.exports = {
  loadSchema,
  listSchemas,
  StreamRecord,
  StreamDescriptor,
  ExecuteContext,
  OperatorBag,
  encodeHeader,
  decodeHeader,
  findHeader,
  headerKeys
}

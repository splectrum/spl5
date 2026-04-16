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
// Aliases: _alias file in a directory maps local names
// to schema names. One file per directory, loaded once.
//   _schema/spl/mycelium/xpath/raw/uri/_alias
//   { "get": "spl.data.stream.operator", ... }

const cache = {}
const aliasCache = {}
let schemaRoot = null

function getSchemaRoot () {
  if (schemaRoot) return schemaRoot
  let root = repoRoot(typeof Bare !== 'undefined'
    ? require('bare-os').cwd()
    : process.cwd())
  schemaRoot = root ? path.join(root, '_schema') : null
  return schemaRoot
}

// Load the _alias map for a directory (cached)
function loadAliasMap (dir) {
  if (aliasCache[dir] !== undefined) return aliasCache[dir]
  let file = path.join(dir, '_alias')
  if (fs.existsSync(file)) {
    aliasCache[dir] = JSON.parse(fs.readFileSync(file, 'utf-8'))
  } else {
    aliasCache[dir] = null
  }
  return aliasCache[dir]
}

// Load a schema by fully qualified name
function loadSchema (name) {
  if (cache[name]) return cache[name]

  let root = getSchemaRoot()
  if (!root) throw new Error('no _schema directory found')

  let parts = name.split('.')
  let file = path.join(root, ...parts) + '.avsc'

  // Direct .avsc file
  if (fs.existsSync(file)) {
    let def = JSON.parse(fs.readFileSync(file, 'utf-8'))
    let type = avro.Type.forSchema(def)
    cache[name] = type
    return type
  }

  // Check _alias in parent directory
  let localName = parts[parts.length - 1]
  let dir = path.join(root, ...parts.slice(0, -1))
  let aliases = loadAliasMap(dir)

  if (aliases && aliases[localName]) {
    let resolved = loadSchema(aliases[localName])
    cache[name] = resolved
    return resolved
  }

  throw new Error('schema not found: ' + name)
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
    if (entry.startsWith('_')) continue
    let full = path.join(dir, entry)
    let stat = fs.statSync(full)
    if (stat.isFile() && entry.endsWith('.avsc')) {
      names.push(prefix + '.' + entry.slice(0, -5))
    } else if (stat.isDirectory()) {
      names.push(...listSchemas(prefix + '.' + entry))
    }
  }

  // Include aliases from _alias map
  let aliases = loadAliasMap(dir)
  if (aliases) {
    for (let key of Object.keys(aliases)) {
      names.push(prefix + '.' + key)
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

# Bare Module System

Module resolution and loading in Bare, powered by
bare-module.

[Back to index](index.md)

---

## Supported Module Types

- CommonJS (`.cjs`, or `.js` when `"type"` is not
  `"module"`)
- ECMAScript Modules (`.mjs`, or `.js` when
  `"type": "module"`)
- JSON (`.json`)
- Bundles (`.bundle` — bare-bundle format)
- Addons (native, `.node`)
- Binary and text files

CJS and ESM have bidirectional interoperability —
unlike Node.js where the relationship is one-way.

---

## Package.json Fields

### "exports" — entry points

Supports subpath exports, conditional exports,
self-referencing, and sugar syntax.

```json
{
  "exports": {
    ".": {
      "bare": "./lib/bare.js",
      "default": "./lib/node.js"
    },
    "./promises": "./lib/promises.js"
  }
}
```

### "imports" — private import mapping

Maps import specifiers within the package. Supports
conditional syntax. Permits mapping to external
packages. The `#` prefix is supported but not
required (unlike Node.js).

```json
{
  "imports": {
    "fs": {
      "bare": "bare-fs",
      "default": "fs"
    }
  }
}
```

### "engines" — version requirements

```json
{
  "engines": {
    "bare": ">=1.0.5"
  }
}
```

---

## Conditional Export Conditions

In order of specificity (most specific first):

| Condition | Matches when |
|-----------|-------------|
| `"import"` | loaded via `import` or `import()` |
| `"require"` | loaded via `require()` |
| `"asset"` | loaded via `require.asset()` |
| `"addon"` | loaded via `require.addon()` |
| `"bare"` | running in Bare |
| `"node"` | running in Node.js |
| `"<platform>"` | equals `Bare.platform` |
| `"<arch>"` | equals `Bare.arch` |
| `"simulator"` | compiled for simulator |
| `"default"` | fallback, always matches |

Order matters: more specific conditions must come
before less specific ones in the definition.

---

## CJS API

- `require(specifier[, options])` — load module.
  Options include `{ with: { type: 'json' } }` and
  `{ with: { imports: '...' } }`
- `require.main` — entry module
- `require.cache` — module cache
- `require.resolve(specifier[, parentURL])` —
  resolve to path
- `require.addon([specifier][, parentURL])` — load
  native addon
- `require.addon.host` — platform-arch string
- `require.addon.resolve()` — resolve addon path
- `require.asset(specifier[, parentURL])` — resolve
  asset path

## ESM API

- `import.meta.url` — module URL string
- `import.meta.main` — boolean, is entry script?
- `import.meta.cache` — module cache
- `import.meta.resolve(specifier[, parentURL])` —
  resolve to URL string
- `import.meta.addon()` — load native addon
- `import.meta.asset(specifier[, parentURL])` —
  resolve asset URL

## Custom require

```js
Module.createRequire(parentURL[, options])
```

Create a preconfigured require function. Useful for
REPL, tooling, or custom loaders.

---

## Custom Protocols

Module resolution can be extended with custom
protocols — for example, loading modules from a
Hyperdrive:

```js
new Module.Protocol(methods, context)
```

Methods: `preresolve`, `postresolve`, `resolve`,
`exists`, `read`, `addon`, `asset`.

---

**Source:**
https://github.com/holepunchto/bare-module

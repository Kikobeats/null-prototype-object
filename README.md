# null-prototype-object

> A minimal utility for creating **objects with a `null` prototype** using a **reusable constructor**.

![Last version](https://img.shields.io/github/tag/Kikobeats/null-prototype-object.svg?style=flat-square)
[![Coverage Status](https://img.shields.io/coveralls/Kikobeats/null-prototype-object.svg?style=flat-square)](https://coveralls.io/github/Kikobeats/null-prototype-object)
[![NPM Status](https://img.shields.io/npm/dm/null-prototype-object.svg?style=flat-square)](https://www.npmjs.org/package/null-prototype-object)

## Why not just `Object.create(null)`

`Object.create(null)` gives you a clean object with no prototype — useful for:

- Safe key-value maps
- Avoiding inherited methods (`toString`, `hasOwnProperty`, etc.)
- Preventing prototype pollution

But there's a performance cost in high-frequency scenarios.

### The problem

Each call to `Object.create(null)` creates a **new object shape** (hidden class).

JavaScript engines like V8 can't optimize repeated use because:

- The prototype isn't shared
- Shapes can't be reused
- Inline caching and JIT optimizations break down
- It leads to **megamorphic** call sites (a de-optimization trigger)

### The solution: `null-prototype-object`

This package provides a constructor with a **frozen, shared null-prototype**, enabling V8 to:

- Reuse a stable hidden class
- Inline property access
- Optimize memory layout
- Avoid dynamic shape transitions

### Why it’s faster

| Feature                   | `Object.create(null)` | `new NullProtoObj()` |
|---------------------------|------------------------|------------------------|
| Shared prototype          | ❌                     | ✅                     |
| Hidden class reuse        | ❌                     | ✅                     |
| Inline caching            | ❌                     | ✅                     |
| JIT-friendly              | ❌                     | ✅                     |
| Memory efficient          | ❌                     | ✅                     |

### When to use it

Use `null-prototype-object` if:

- You're allocating many null-prototype objects (e.g. parsers, serializers, caches).
- You want predictable performance in tight loops.
- You're optimizing object creation in hot code paths.

## Install

```bash
$ npm install null-prototype-object --save
```

## Usage

```js
const NullProtoObj = require('null-prototype-object')

const obj = new NullProtoObj()

// No inherited methods
console.log(obj.toString) // undefined

// Safe for dictionary-style use
obj.__proto__ = 'polluted? nope'
console.log(obj.__proto__) // => "polluted? nope"

console.log(obj.foo)
obj.foo = 'bar'
console.log(Object.getPrototypeOf(obj)) // ==> null (via prototype chain)
```

## Benchmark

```
NullProtoObj via constructor x 296,220,603 ops/sec ±5.23% (74 runs sampled)
Object.create(null) x 78,571,005 ops/sec ±1.32% (93 runs sampled)
{} (normal object) x 292,647,799 ops/sec ±4.96% (76 runs sampled)
Fastest is NullProtoObj via constructor,{} (normal object)
```

## License

**null-prototype-object** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/kikobeats/null-prototype-object/blob/master/LICENSE.md) License.

Credits to [pi0](https://github.com/h3js/rou3/blame/main/src/_utils.ts) and [anonrig](https://github.com/anonrig/fast-querystring/blame/main/lib/parse.js#L6). Maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/kikobeats/null-prototype-object/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/kikobeats) · Twitter [@kikobeats](https://twitter.com/kikobeats)

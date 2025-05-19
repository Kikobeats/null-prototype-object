# null-prototype-object

> A minimal utility for creating **objects with a `null` prototype** using a **reusable constructor**.

# 🧠 Why?

In JavaScript, `Object.create(null)` creates a "clean" object with no prototype chain — useful for:

- Dictionary-style key-value stores
- Avoiding inherited methods like `toString`, `hasOwnProperty`, etc.
- Safer serialization
- Avoiding prototype pollution attacks

But `Object.create(null)` creates **a new shape every time**, which can be slower in high-performance environments like V8 (used in Node.js).

Instead of repeatedly calling `Object.create(null)`, we use a **constructor function with a frozen null-prototype**:

- ✅ Prototype is shared and immutable
- ✅ Instance prototype is still null-based
- ✅ Fast object allocation via constructor
- ✅ No inherited methods

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

**null-prototype-object** © [Kiko Beats](https://kikobeats.com), released under the [MIT](https://github.com/kikobeats/null-prototype-object/blob/master/LICENSE.md) License.<br>
Authored and maintained by [Kiko Beats](https://kikobeats.com) with help from [contributors](https://github.com/kikobeats/null-prototype-object/contributors).

> [kikobeats.com](https://kikobeats.com) · GitHub [Kiko Beats](https://github.com/kikobeats) · Twitter [@kikobeats](https://twitter.com/kikobeats)

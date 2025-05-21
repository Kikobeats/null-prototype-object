# Benchmark

```
NullProtoObj via constructor x 207,586,282 ops/sec ±4.80% (81 runs sampled)
Object.create(null) x 54,415,324 ops/sec ±2.01% (89 runs sampled)
{} (normal object) x 194,340,713 ops/sec ±5.15% (77 runs sampled)
{__proto__:null} x 39,313,923 ops/sec ±2.37% (92 runs sampled)

Fastest is NullProtoObj via constructor
```

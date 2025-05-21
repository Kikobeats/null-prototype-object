'use strict'

const Benchmark = require('benchmark')

const NullProtoObj = require('..')

// Benchmark suite
const suite = new Benchmark.Suite()

suite
  .add('NullProtoObj via constructor', function () {
    const obj = new NullProtoObj()
    obj.foo = 123
  })
  .add('Object.create(null)', function () {
    const obj = Object.create(null)
    obj.foo = 123
  })
  .add('{} (normal object)', function () {
    const obj = {}
    obj.foo = 123
  })
  .add('{__proto__:null}', function () {
    const obj = { __proto__: null }
    obj.foo = 123
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log('Fastest is ' + this.filter('fastest').map('name'))
  })
  .run({ async: false })

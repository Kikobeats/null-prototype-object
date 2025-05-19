const test = require('ava')

const NullProtoObj = require('..')

test('prototype of instance is NullProtoObj.prototype', t => {
  const obj = new NullProtoObj()
  t.is(Object.getPrototypeOf(obj), NullProtoObj.prototype)
})

test('NullProtoObj.prototype has null prototype', t => {
  t.is(Object.getPrototypeOf(NullProtoObj.prototype), null)
})

test('object does not inherit Object.prototype methods', t => {
  const obj = new NullProtoObj()
  t.is(typeof obj.toString, 'undefined')
  t.is(typeof obj.hasOwnProperty, 'undefined')
})

test('can assign and retrieve properties', t => {
  const obj = new NullProtoObj()
  obj.foo = 'bar'
  t.is(obj.foo, 'bar')
})

test('instances do not share state', t => {
  const a = new NullProtoObj()
  const b = new NullProtoObj()
  a.key = 'value'
  t.is(b.key, undefined)
})

test('prototype is frozen', t => {
  const proto = Object.getPrototypeOf(new NullProtoObj())
  const isFrozen = Object.isFrozen(proto)
  t.true(isFrozen)
})

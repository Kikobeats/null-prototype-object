'use strict'

const { writeFileSync } = require('fs')
const { join } = require('path')
const { setFlagsFromString } = require('v8')
const { runInNewContext } = require('vm')

const NullProtoObj = require('..')

const RUNS = 7
const CONSTRUCTIONS = 20_000_000
const DICTIONARIES = 200_000
const DICTIONARY_KEYS = Array.from({ length: 16 }, (_, key) => `key-${key}`)
const INHERITED_KEYS = ['toString', 'constructor', 'hasOwnProperty']
const RETAINED = 1024

setFlagsFromString('--expose-gc')
const collectGarbage = runInNewContext('gc')

const now = () => process.hrtime.bigint()

const elapsed = started => Number(now() - started) / 1e6

const median = values => {
  const sorted = values.slice().sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)]
}

const inheritsNothing = obj => INHERITED_KEYS.every(key => !(key in obj))

const constructCase = {
  name: 'new NullProtoObj with 3 writes',
  extra: `${CONSTRUCTIONS} constructions`,
  timed: () => {
    const retained = new Array(RETAINED)
    for (let index = 0; index < CONSTRUCTIONS; index++) {
      const obj = new NullProtoObj()
      obj.id = index
      obj.name = 'value'
      obj.enabled = true
      retained[index % RETAINED] = obj
    }
    return retained
  },
  verify: retained =>
    retained.every(inheritsNothing) &&
    retained[(CONSTRUCTIONS - 1) % RETAINED].id === CONSTRUCTIONS - 1
}

const dictionaryCase = {
  name: 'NullProtoObj as dictionary',
  extra: `${DICTIONARIES} dictionaries, ${DICTIONARY_KEYS.length} dynamic keys written and read, ${INHERITED_KEYS.length} inherited keys probed`,
  timed: () => {
    let hits = 0
    let misses = 0
    for (let index = 0; index < DICTIONARIES; index++) {
      const dictionary = new NullProtoObj()
      for (const key of DICTIONARY_KEYS) dictionary[key] = index
      for (const key of DICTIONARY_KEYS) {
        if (dictionary[key] === index) hits++
      }
      for (const key of INHERITED_KEYS) {
        if (!(key in dictionary)) misses++
      }
    }
    return { hits, misses }
  },
  verify: ({ hits, misses }) =>
    hits === DICTIONARIES * DICTIONARY_KEYS.length &&
    misses === DICTIONARIES * INHERITED_KEYS.length
}

const CASES = [constructCase, dictionaryCase]

const fmt = value => value.toFixed(1)

const report = slot => {
  const med = slot.walls.length ? median(slot.walls) : Number.NaN
  const min = slot.walls.length ? Math.min(...slot.walls) : Number.NaN
  const max = slot.walls.length ? Math.max(...slot.walls) : Number.NaN
  const extra = `${slot.entry.extra}, errors ${slot.errors}, runs ${RUNS}`
  console.log(
    `${slot.entry.name}  median ${fmt(med)}ms  range ${fmt(min)}-${fmt(
      max
    )}  ${extra}`
  )
  return {
    name: slot.entry.name,
    unit: 'ms',
    value: Number(med.toFixed(1)),
    range: `${fmt(min)}-${fmt(max)}`,
    extra
  }
}

const takeSample = (slot, run) => {
  try {
    collectGarbage()
    const started = now()
    const outcome = slot.entry.timed()
    const wall = elapsed(started)
    if (!slot.entry.verify(outcome)) {
      console.error(`${slot.entry.name} run ${run} produced unexpected output`)
      slot.errors++
      return
    }
    slot.walls.push(wall)
  } catch (error) {
    console.error(error)
    slot.errors++
  }
}

const main = () => {
  const slots = CASES.map(entry => {
    entry.timed()
    return { entry, walls: [], errors: 0 }
  })
  for (let run = 0; run < RUNS; run++) {
    for (const slot of slots) takeSample(slot, run)
  }
  const results = slots.map(report)
  writeFileSync(
    join(__dirname, '..', 'benchmark-output.json'),
    JSON.stringify(results, null, 2) + '\n'
  )
  const errors = slots.reduce((total, slot) => total + slot.errors, 0)
  if (errors > 0 || results.some(result => !Number.isFinite(result.value))) {
    process.exitCode = 1
  }
}

main()

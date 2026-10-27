#!/usr/bin/env node
// 版本同步校验：package.json / VERSION / prototypes/v0.1/manifest.json 三处必须一致。
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
const root = resolve(process.argv[2] || '.')
const errors = []
const p = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
const v = readFileSync(resolve(root, 'VERSION'), 'utf8').trim()
const m = JSON.parse(readFileSync(resolve(root, 'prototypes/v0.1/manifest.json'), 'utf8'))
if (p.version !== v) errors.push(`package.json ${p.version} != VERSION ${v}`)
if (m.version !== v) errors.push(`manifest.json ${m.version} != VERSION ${v}`)
if (errors.length) {
  console.error('版本不同步：\n' + errors.join('\n'))
  process.exit(1)
}
console.log('版本同步 OK: ' + v)

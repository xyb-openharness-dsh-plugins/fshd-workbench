#!/usr/bin/env node
// 文案红线扫描：业务原型/客户端不得出现「自行给出诊疗结论」类表述。
// 仅扫生成物（prototypes/lib/assets），不扫 docs（文档允许讨论规范与边界）。
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs'
import { resolve, join } from 'node:path'
const RED = [
  '建议治疗', '可以停药', '治愈率', '推荐用药', '建议用药',
  '包治', '根治', '一定有效', '保证有效', '可以治愈的',
]
const root = resolve(process.argv[2] || '.')
const hits = []
function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f)
    const s = statSync(p)
    if (s.isDirectory()) { if (f === 'node_modules' || f === '.git') continue; walk(p) }
    else if (/\.(js|css|html|json)$/.test(f)) {
      const t = readFileSync(p, 'utf8')
      for (const w of RED) if (t.includes(w)) hits.push(`${p}: 命中红线「${w}」`)
    }
  }
}
for (const t of ['prototypes', 'lib', 'assets']) {
  const p = join(root, t)
  if (existsSync(p)) walk(p)
}
if (hits.length) { console.error('文案红线：\n' + hits.join('\n')); process.exit(1) }
console.log('文案红线 OK（扫描 prototypes/lib/assets）')

import Schema from '@deepseek-ai/schemastery'
import { readFileSync, statSync, readdirSync, existsSync } from 'node:fs'
import { dirname, join, extname, sep, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

export const name = 'fshd-main'
export const inject = ['webServer', 'connection']
export const Config = Schema.object({})
const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

// 业务目录：供 ensureSession({ folder }) 使用（customFrame 硬要求②）。
// 当前原型为内存模拟，尚未接入本机目录；接入数据层后由该环境变量/配置注入真实路径。
const DATA_DIR = process.env.FSHD_DATA_DIR || null

const UI_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'ui')
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}
const UI_PREFIX = '/api/fshd/ui'

function walk(dir, base = '') {
  const out = []
  for (const f of readdirSync(dir)) {
    const p = join(dir, f)
    const rel = base ? base + '/' + f : f
    if (statSync(p).isDirectory()) out.push(...walk(p, rel))
    else out.push(rel)
  }
  return out
}

function send(res, status, body, headers = {}) {
  res.writeHead(status, { 'cache-control': 'no-store', ...headers })
  res.end(body)
}

function serveUi(rel, req, res) {
  // 防目录穿越：规范化后必须仍落在 UI_DIR 内
  const safe = normalize(rel).replace(/^(\.\.[/\\])+/, '')
  const full = join(UI_DIR, safe)
  if (!full.startsWith(UI_DIR) || !existsSync(full) || !statSync(full).isFile()) {
    return send(res, 404, JSON.stringify({ error: 'Not found' }), { 'content-type': 'application/json; charset=utf-8' })
  }
  const data = readFileSync(full)
  send(res, 200, data, { 'content-type': MIME[extname(full)] || 'application/octet-stream' })
}

export function apply(ctx) {
  if (!ctx.webServer?.register) throw new Error('Desktop webServer.register is unavailable')

  // 健康检查（保留）
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact', path: '/api/fshd/health',
    handler(req, res) {
      const send = (status, body) => {
        res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
        res.end(JSON.stringify(body))
      }
      if (typeof ctx.connection?.requestRejection !== 'function') return send(503, { error: 'connection authentication capability unavailable' })
      const rejection = ctx.connection.requestRejection(req)
      if (rejection !== undefined) return send(rejection, { error: 'Authentication required' })
      if (req.method !== 'GET') return send(405, { error: 'Method not allowed' })
      send(200, { ok: true, version: manifest.version, apiVersion: 'v1', capabilities: ['health', 'ui'], dir: DATA_DIR })
    },
  }), 'fshd health')

  // 富原型静态资源（让装机工作台直接呈现 prototypes/v0.1）
  ctx.effect(() => {
    const guard = (handler) => (req, res) => {
      if (typeof ctx.connection?.requestRejection === 'function') {
        const rejection = ctx.connection.requestRejection(req)
        if (rejection !== undefined) return send(res, rejection, JSON.stringify({ error: 'Authentication required' }), { 'content-type': 'application/json; charset=utf-8' })
      }
      return handler(req, res)
    }
    if (!existsSync(UI_DIR)) {
      ctx.logger?.warn?.('fshd UI 目录缺失：' + UI_DIR)
      return
    }
    const files = walk(UI_DIR)
    for (const rel of files) {
      ctx.webServer.register({ kind: 'exact', path: UI_PREFIX + '/' + rel, handler: guard((req, res) => serveUi(rel, req, res)) }, 'fshd ui ' + rel)
    }
    // 根路径（带斜杠）映射到 index.html，确保相对路径正确解析
    ctx.webServer.register({ kind: 'exact', path: UI_PREFIX + '/', handler: guard((req, res) => serveUi('index.html', req, res)) }, 'fshd ui root')
    ctx.webServer.register({ kind: 'exact', path: UI_PREFIX, handler: guard((req, res) => serveUi('index.html', req, res)) }, 'fshd ui root-no-slash')
  }, 'fshd ui')
}

// Production server: serves the built site (dist/) and the /api/contact endpoint.
//   npm run build && npm start
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleContact } from './contact.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
try {
  process.loadEnvFile(path.join(root, '.env'))
} catch {
  // no .env file — rely on real environment variables
}

const dist = path.join(root, 'dist')
const PORT = Number(process.env.PORT) || 8787

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
}

const sendFile = (req, res, file) => {
  const ext = path.extname(file).toLowerCase()
  const stat = fs.statSync(file)
  const headers = {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    'Cache-Control': file.includes(`${path.sep}assets${path.sep}`) ? 'public, max-age=31536000, immutable' : 'no-cache',
    'X-Content-Type-Options': 'nosniff',
  }
  // video needs range requests so browsers can seek
  const range = req.headers.range
  if (range && ext === '.mp4') {
    const [s, e] = range.replace(/bytes=/, '').split('-')
    const start = Number(s) || 0
    const end = e ? Math.min(Number(e), stat.size - 1) : stat.size - 1
    res.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${stat.size}`, 'Accept-Ranges': 'bytes', 'Content-Length': end - start + 1 })
    return fs.createReadStream(file, { start, end }).pipe(res)
  }
  res.writeHead(200, { ...headers, 'Content-Length': stat.size, 'Accept-Ranges': 'bytes' })
  fs.createReadStream(file).pipe(res)
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')

  if (url.pathname === '/api/contact') return handleContact(req, res)
  if (url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    return res.end('{"ok":true}')
  }

  if (!fs.existsSync(dist)) {
    res.writeHead(503, { 'Content-Type': 'text/plain' })
    return res.end('dist/ not found — run "npm run build" first')
  }

  let rel
  try {
    rel = decodeURIComponent(url.pathname)
  } catch {
    res.writeHead(400)
    return res.end()
  }
  const file = path.join(dist, path.normalize(rel))
  if (!file.startsWith(dist)) {
    res.writeHead(403)
    return res.end()
  }
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return sendFile(req, res, file)
  if (path.extname(rel)) {
    res.writeHead(404)
    return res.end('Not found')
  }
  sendFile(req, res, path.join(dist, 'index.html'))
})

server.listen(PORT, () => console.log(`ATIM server listening on http://localhost:${PORT}`))

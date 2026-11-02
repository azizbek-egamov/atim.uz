// POST /api/contact — forwards the contact form to a Telegram chat/channel.
// The bot token lives only in server environment variables, never in the browser bundle.

const LIMITS = { name: 100, contact: 120, message: 2000 }
const MAX_BODY = 16 * 1024
const WINDOW_MS = 10 * 60 * 1000
const MAX_PER_WINDOW = 5

const hits = new Map() // ip -> timestamps
const LANGS = { uz: 'UZ', ru: 'RU', en: 'EN' }

const json = (res, status, body) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const clientIp = (req) => {
  if (process.env.TRUST_PROXY) {
    const fwd = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()
    if (fwd) return fwd
  }
  return req.socket.remoteAddress || 'unknown'
}

const rateLimited = (ip) => {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS)
  if (recent.length >= MAX_PER_WINDOW) {
    hits.set(ip, recent)
    return true
  }
  recent.push(now)
  hits.set(ip, recent)
  return false
}

// keep the map from growing forever
setInterval(() => {
  const now = Date.now()
  for (const [ip, list] of hits) {
    const recent = list.filter((t) => now - t < WINDOW_MS)
    if (recent.length) hits.set(ip, recent)
    else hits.delete(ip)
  }
}, WINDOW_MS).unref()

const readBody = (req) =>
  new Promise((resolve, reject) => {
    let size = 0
    let tooLarge = false
    const chunks = []
    req.on('data', (c) => {
      if (tooLarge) return // drop the rest; the connection is closed after we answer
      size += c.length
      if (size > MAX_BODY) {
        tooLarge = true
        chunks.length = 0
        reject(Object.assign(new Error('too large'), { status: 413 }))
        return
      }
      chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })

const clean = (v, max) => (typeof v === 'string' ? v.replace(/\r/g, '').trim().slice(0, max) : '')

export async function handleContact(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return json(res, 405, { ok: false, error: 'method_not_allowed' })
  }

  const allowed = process.env.ALLOWED_ORIGIN
  if (allowed && req.headers.origin && req.headers.origin !== allowed) {
    return json(res, 403, { ok: false, error: 'forbidden' })
  }

  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) {
    console.error('[contact] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID are not set')
    return json(res, 500, { ok: false, error: 'not_configured' })
  }

  const ip = clientIp(req)
  if (rateLimited(ip)) return json(res, 429, { ok: false, error: 'rate_limited' })

  let data
  try {
    data = JSON.parse(await readBody(req))
  } catch (err) {
    res.once('finish', () => req.destroy())
    return json(res, err.status || 400, { ok: false, error: err.status === 413 ? 'too_large' : 'bad_request' })
  }

  // honeypot: real users never fill this hidden field, bots do — pretend success
  if (clean(data.website, 50)) return json(res, 200, { ok: true })

  const name = clean(data.name, LIMITS.name)
  const contact = clean(data.contact, LIMITS.contact)
  const message = clean(data.message, LIMITS.message)
  if (!name || !contact || !message) return json(res, 422, { ok: false, error: 'validation' })

  const lang = LANGS[data.lang] || '—'
  const time = new Date().toLocaleString('uz-UZ', { timeZone: 'Asia/Tashkent', hour12: false })
  const text = [
    '📩 <b>Yangi murojaat — atim.uz</b>',
    '',
    `👤 <b>Ism:</b> ${escapeHtml(name)}`,
    `📞 <b>Aloqa:</b> ${escapeHtml(contact)}`,
    `🌐 <b>Sayt tili:</b> ${lang}`,
    `🕒 ${escapeHtml(time)}`,
    '',
    `💬 ${escapeHtml(message)}`,
  ].join('\n')

  try {
    const tg = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!tg.ok) {
      const body = await tg.json().catch(() => ({}))
      console.error('[contact] telegram error', tg.status, body.description || '')
      return json(res, 502, { ok: false, error: 'delivery_failed' })
    }
    return json(res, 200, { ok: true })
  } catch (err) {
    console.error('[contact] telegram request failed:', err.name)
    return json(res, 502, { ok: false, error: 'delivery_failed' })
  }
}

# ATIM website (React + Vite, JavaScript)

```bash
npm install
npm run dev      # http://localhost:5173  (also serves /api/contact)
npm run build    # output in dist/
npm start        # production: serves dist/ + /api/contact on PORT (default 8787)
npm run lint
```

- Languages: UZ / RU / EN — texts in `src/i18n/locales/*.json` (`react-i18next`). Add a key to all three files.
- Content lists (nav, projects, roadmap, certificates, gallery, emails): `src/data.js`.
- Images: `src/assets/img/`. Video: `public/media/nukus-atim.mp4` (loaded on demand).

## Contact form → Telegram

The form posts to `/api/contact` (`server/contact.mjs`), which sends the message to a Telegram channel.
The bot token never reaches the browser — it is read from server environment variables:

1. Copy `.env.example` to `.env` and fill in `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` (`.env` is git-ignored).
2. The bot must be an administrator of the channel with permission to post messages.
3. Deploy with Node (`npm run build && npm start`), or proxy `/api/` to this server from nginx.
   A static-only host cannot run the form — it needs this small Node process.

Protections: input limits, 16 KB body cap, hidden honeypot field, 5 submissions / 10 min per IP
(set `TRUST_PROXY=1` behind nginx/Cloudflare), optional `ALLOWED_ORIGIN`.

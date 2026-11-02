// Vercel serverless function: POST /api/contact
// Same handler as the local dev/production server; secrets come from Vercel
// Project Settings → Environment Variables (TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID).
import { handleContact } from '../server/contact.mjs'

export default function handler(req, res) {
  return handleContact(req, res)
}

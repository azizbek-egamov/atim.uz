import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { handleContact } from './server/contact.mjs'

// In dev, mount the same /api/contact handler the production server uses,
// so `npm run dev` is all that's needed (secrets come from .env, server-side only).
const contactApi = (env) => ({
  name: 'contact-api',
  configureServer(server) {
    Object.assign(process.env, env)
    server.middlewares.use('/api/contact', (req, res) => handleContact(req, res))
  },
})

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react(), contactApi(loadEnv(mode, process.cwd(), ''))],
}))

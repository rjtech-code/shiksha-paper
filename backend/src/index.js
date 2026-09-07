import './env.js' // must run first: creates/loads backend/.env (PORT, JWT_SECRET)
import express from 'express'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { users, history } from './db.js'
import authRoutes from './routes/auth.js'
import historyRoutes from './routes/history.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = process.env.PORT || 8787

// Only requests whose browser-sent Origin header matches one of these are allowed to read
// the response — everything else (curl, server-to-server, no Origin header at all) still
// goes through untouched, since Origin is a browser-only concept.
const allowedOrigins = (process.env.FRONTEND_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean)

const app = express()
app.use((req, res, next) => {
  const origin = req.headers.origin
  if (origin) {
    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Origin not allowed' })
    }
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.sendStatus(204)
  next()
})
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes(users))
app.use('/api/history', historyRoutes(users, history))
app.use('/api/admin', adminRoutes(users, history))

// In production, also serve the built frontend so the whole app can run from one process.
const distDir = path.join(__dirname, '..', '..', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(distDir, 'index.html')))
}

// Centralized error handler (e.g. Multer file-size errors) so failures return JSON, not HTML.
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || 'Server error' })
})

// On Vercel, this file is imported as a serverless function handler (see the root
// vercel.json) — Vercel calls the exported app directly per-request, it never runs
// app.listen() itself. Locally (and on any other host), listen normally.
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`SikshaPaper backend listening on http://localhost:${PORT}`)
  })
}

export default app

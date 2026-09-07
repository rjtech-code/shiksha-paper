import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

// On Vercel there's no writable/persistent place for a .env file, and none is needed —
// Vercel injects Project Settings → Environment Variables straight into process.env.
if (!process.env.VERCEL) {
  const __dirname = path.dirname(fileURLToPath(import.meta.url))
  const envPath = path.join(__dirname, '..', '.env')

  // Zero-config by default: if there's no .env yet, create one with a random JWT secret
  // so login sessions survive server restarts (see backend/.env.example for what this holds).
  if (!fs.existsSync(envPath)) {
    const secret = crypto.randomBytes(48).toString('hex')
    fs.writeFileSync(
      envPath,
      `PORT=8787\nJWT_SECRET=${secret}\nMONGODB_URI=mongodb://127.0.0.1:27017/sikshapaper\nFRONTEND_ORIGIN=http://localhost:5173\n`,
    )
    console.log('Created backend/.env with a generated JWT_SECRET and a default local MONGODB_URI (edit it any time).')
  }

  process.loadEnvFile(envPath)
}

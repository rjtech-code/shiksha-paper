# SikshaPaper

Every PDF tool you need, in one place — merge, split, compress, convert, sign and
protect your documents. 100% free. Every conversion happens **inside your browser**
— nothing is ever uploaded to a server unless you're signed in and choose to save it.

Built as a from-scratch clone of ilovepdf.com's tool set, restyled with a pink + blue
theme, with accounts, per-tool history, and an admin panel layered on top.

## Tools (27)

**Organize** — Merge PDF · Split PDF · Compress PDF · Rotate PDF · Organize PDF ·
Repair PDF · Crop PDF

**Convert** — PDF ↔ Word · PDF ↔ PowerPoint · PDF ↔ Excel · PDF ↔ JPG ·
HTML to PDF · Scan to PDF · PDF to PDF/A

**Edit & Sign** — Edit PDF · Sign PDF · Watermark · Page Numbers · OCR PDF ·
Compare PDF

**Security** — Protect PDF · Unlock PDF · Redact PDF

## Accounts, history & admin

- **Guests** can use every tool exactly as before — nothing leaves the browser, nothing is saved.
- **Signed-in users** get their output file automatically saved after each successful run.
  Every tool page shows a "Your recent files with this tool" panel (re-download or delete),
  and there's a **Dashboard** (stats + recent activity) and a full **History** page
  (search, filter by tool, delete) under the account menu.
- **Admins** get an **Admin Panel** (`/admin`) with site-wide stats, a user list (promote /
  demote / delete users), and every file saved across all users (download or delete any of them).

This is powered by a small backend in [backend/](backend) — Express + **MongoDB**
+ JWT auth (bcrypt-hashed passwords). Everything lives in MongoDB: the `users` and
`history` collections, *and* the saved files' actual bytes (via GridFS, in the
`files` bucket) — no disk storage, no separate SQL database.

You need a MongoDB server reachable at `MONGODB_URI` (default:
`mongodb://127.0.0.1:27017/sikshapaper` — a local install works, so does MongoDB
Atlas or any hosted Mongo). See `backend/.env.example`.

The API only answers browser requests whose `Origin` matches `FRONTEND_ORIGIN`
(default `http://localhost:5173`, comma-separate for more than one — e.g. add your
deployed frontend's URL) — everything else gets a 403. Non-browser calls (curl,
server-to-server) are unaffected, since only browsers send an `Origin` header.

**Default admin account** (seeded automatically on first run): 

```
email:    admin@sikshapaper.local
password: admin123
```

⚠️ Change this password (or promote your own account and delete the seed admin) before
deploying this anywhere reachable by others — `backend/src/db.js` is where it's seeded.

## Tech stack

- **Frontend**: React 19 + TypeScript + Vite, Tailwind CSS v4, React Router
- **Backend**: Express + **MongoDB** (official `mongodb` driver + GridFS) + JWT
  (`jsonwebtoken`) + `bcryptjs` + `multer`
- `pdf-lib` for PDF creation/editing, `pdfjs-dist` for rendering & text extraction
- `docx`, `mammoth`, `xlsx`, `pptxgenjs`, `jszip`, `jspdf` + `jspdf-autotable` for
  office-format conversions
- `tesseract.js` for in-browser OCR
- A hand-written PDF standard-security-handler (RC4 40/128-bit; MD5 + RC4 implemented
  from scratch and unit-tested against known vectors) powers **Protect PDF** /
  **Unlock PDF** — see `src/lib/pdfEncrypt.ts`

## Getting started

**Prerequisite:** a MongoDB server running and reachable (locally: install MongoDB
Community Server and make sure its service is running — Windows installs it as a
service named "MongoDB" by default. No database or collections need to be created
by hand; the app creates them the first time it connects).

```bash
npm run install:all   # installs both the frontend and backend/ dependencies
npm run dev:all       # runs the frontend (5173) and backend (8787) together
```

Or run them separately:

```bash
npm install && npm run dev        # frontend only, http://localhost:5173
npm --prefix backend install && npm run dev:backend   # backend only, http://localhost:8787
```

The Vite dev server proxies `/api/*` to the backend automatically (see `vite.config.ts`).

### Production build

```bash
npm run build     # type-check + build the frontend into dist/
npm start         # serves dist/ AND the API from one process (backend/src/index.js)
```

## Notes & limitations

- Office-format conversions (Word/Excel/PowerPoint ↔ PDF) run entirely
  client-side; complex layouts are simplified. For scanned/image-only PDFs,
  run **OCR PDF** first.
- **Protect/Unlock PDF** implement classic RC4 encryption (V1/V2, R2/R3) per
  ISO 32000-1 — broadly compatible, but PDFs protected elsewhere with AES
  (V4/V5) can't be unlocked yet.
- **Compress PDF**'s "Recommended"/"Extreme" levels rasterize pages, which is
  very effective for scans but will enlarge already-vector/text-heavy PDFs at
  low settings — use "Low compression" for those.
- Files are stored in MongoDB via GridFS in ~16MB chunks — fine well beyond typical
  PDF sizes; the 100MB per-file cap (`backend/src/routes/history.js`) is the only limit.

## Automated tests

`scratch-tests/` has Playwright scripts exercising every tool (guest mode) and the
full auth/history/admin flow. With both dev servers running:

```bash
node scratch-tests/make-fixtures.mjs   # generates sample PDF/DOCX/XLSX/PPTX/PNG fixtures once
node scratch-tests/smoke.mjs           # all 27 tools, guest mode
node scratch-tests/auth-smoke.mjs      # signup/login, per-tool history, dashboard, admin panel
node scratch-tests/history-coverage.mjs # history-saving for every branch of the trickier tools
```

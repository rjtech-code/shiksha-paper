import { Link } from 'react-router-dom'
import { History as HistoryIcon, Download, Trash2, LogIn } from 'lucide-react'
import type { useToolHistory } from '../hooks/useToolHistory'
import { formatBytes } from '../lib/pdfCore'

/** Drop into any tool page (usually just before </ToolShell>) to show that tool's saved history. */
export default function ToolHistoryPanel({ history }: { history: ReturnType<typeof useToolHistory> }) {
  const { items, loading, signedIn, download, remove } = history

  if (!signedIn) {
    return (
      <div className="mt-6 flex items-center gap-3 bg-brand-blue-50/60 border border-brand-blue-100 rounded-2xl px-5 py-3.5">
        <LogIn size={18} className="text-brand-blue-500 shrink-0" />
        <p className="text-sm text-slate-500">
          <Link to="/login" className="font-semibold text-brand-blue-600 hover:underline">
            Sign in
          </Link>{' '}
          to save the files you create here and find them again anytime.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <HistoryIcon size={16} className="text-brand-pink-500" />
        <h3 className="text-sm font-bold text-slate-600">Your recent files with this tool</h3>
      </div>

      {loading && items.length === 0 && <p className="text-sm text-slate-400">Loading…</p>}
      {!loading && items.length === 0 && <p className="text-sm text-slate-400">Nothing here yet — files you create will show up for quick re-download.</p>}

      {items.length > 0 && (
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{item.outputName}</p>
                <p className="text-xs text-slate-400">
                  {formatBytes(item.size)} · {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => download(item)}
                className="shrink-0 p-2 rounded-lg text-brand-blue-600 hover:bg-brand-blue-50 transition-colors"
                aria-label="Download"
                title="Download again"
              >
                <Download size={16} />
              </button>
              <button
                onClick={() => remove(item.id)}
                className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                aria-label="Delete"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

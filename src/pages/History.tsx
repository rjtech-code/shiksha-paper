import { useEffect, useMemo, useState } from 'react'
import { History as HistoryIcon, Download, Trash2, Search } from 'lucide-react'
import { api, type HistoryItem } from '../lib/api'
import { downloadBlob, formatBytes } from '../lib/pdfCore'
import { tools } from '../data/tools'

export default function History() {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [toolFilter, setToolFilter] = useState('all')
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = () => {
    setLoading(true)
    api
      .listHistory()
      .then(({ items }) => setItems(items))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const usedTools = useMemo(() => {
    const ids = new Set(items.map((i) => i.toolId))
    return tools.filter((t) => ids.has(t.id))
  }, [items])

  const filtered = useMemo(
    () =>
      items.filter((i) => {
        const matchesTool = toolFilter === 'all' || i.toolId === toolFilter
        const matchesQuery = i.outputName.toLowerCase().includes(query.toLowerCase())
        return matchesTool && matchesQuery
      }),
    [items, toolFilter, query],
  )

  const remove = async (id: string) => {
    setBusyId(id)
    setItems((prev) => prev.filter((i) => i.id !== id))
    try {
      await api.deleteHistory(id)
    } catch {
      load()
    } finally {
      setBusyId(null)
    }
  }

  const download = async (item: HistoryItem) => {
    setBusyId(item.id)
    try {
      const blob = await api.downloadHistoryBlob(item)
      downloadBlob(blob, item.outputName)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-11 h-11 rounded-2xl brand-gradient flex items-center justify-center shadow-md shadow-pink-200">
          <HistoryIcon className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">History</h1>
          <p className="text-sm text-slate-500">Every file you've created with SikshaPaper while signed in.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search files…"
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink-300 bg-white"
          />
        </div>
        <select
          value={toolFilter}
          onChange={(e) => setToolFilter(e.target.value)}
          className="px-4 py-2.5 rounded-full border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300"
        >
          <option value="all">All tools</option>
          {usedTools.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-center text-slate-400 py-16">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-16">No files found.</p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((item) => (
            <li key={item.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{item.outputName}</p>
                <p className="text-xs text-slate-400">
                  {item.toolName} · {formatBytes(item.size)} · {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => download(item)}
                disabled={busyId === item.id}
                className="shrink-0 p-2 rounded-lg text-brand-blue-600 hover:bg-brand-blue-50 transition-colors disabled:opacity-40"
                title="Download again"
              >
                <Download size={18} />
              </button>
              <button
                onClick={() => remove(item.id)}
                disabled={busyId === item.id}
                className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-40"
                title="Delete"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

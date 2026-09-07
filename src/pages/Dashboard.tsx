import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileStack, HardDrive, Clock, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api, type HistoryItem } from '../lib/api'
import { formatBytes } from '../lib/pdfCore'
import { getToolById } from '../data/tools'

export default function Dashboard() {
  const { user } = useAuth()
  const [items, setItems] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .listHistory()
      .then(({ items }) => setItems(items))
      .finally(() => setLoading(false))
  }, [])

  const totalSize = useMemo(() => items.reduce((sum, i) => sum + i.size, 0), [items])
  const byTool = useMemo(() => {
    const map = new Map<string, { toolName: string; count: number }>()
    items.forEach((i) => {
      const entry = map.get(i.toolId) ?? { toolName: i.toolName, count: 0 }
      entry.count++
      map.set(i.toolId, entry)
    })
    return Array.from(map.entries())
      .map(([toolId, v]) => ({ toolId, ...v }))
      .sort((a, b) => b.count - a.count)
  }, [items])

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-slate-800">Hi, {user?.name?.split(' ')[0]} 👋</h1>
      <p className="text-slate-500 mt-1">Here's what you've been working on with SikshaPaper.</p>

      <div className="grid sm:grid-cols-3 gap-5 mt-8">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center mb-3">
            <FileStack className="text-white" size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{items.length}</p>
          <p className="text-sm text-slate-500">Files saved</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center mb-3">
            <HardDrive className="text-white" size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{formatBytes(totalSize)}</p>
          <p className="text-sm text-slate-500">Total storage used</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center mb-3">
            <Clock className="text-white" size={20} />
          </div>
          <p className="text-2xl font-extrabold text-slate-800">{items[0] ? new Date(items[0].createdAt).toLocaleDateString() : '—'}</p>
          <p className="text-sm text-slate-500">Last activity</p>
        </div>
      </div>

      <div className="mt-10 grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-slate-800">Recent files</h2>
            <Link to="/history" className="text-sm font-semibold text-brand-pink-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-slate-400">No files yet — use any tool and it'll show up here.</p>
          ) : (
            <ul className="space-y-2">
              {items.slice(0, 6).map((item) => (
                <li key={item.id} className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">{item.outputName}</p>
                    <p className="text-xs text-slate-400">{item.toolName}</p>
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 ml-3">{formatBytes(item.size)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-800 mb-3">Most used tools</h2>
          {byTool.length === 0 ? (
            <p className="text-sm text-slate-400">Nothing yet.</p>
          ) : (
            <ul className="space-y-2">
              {byTool.slice(0, 6).map((t) => {
                const tool = getToolById(t.toolId)
                return (
                  <li key={t.toolId}>
                    <Link
                      to={tool?.path ?? '/all-tools'}
                      className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm hover:border-brand-pink-200 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700">{t.toolName}</span>
                      <span className="text-xs font-semibold text-brand-pink-600">{t.count}x</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

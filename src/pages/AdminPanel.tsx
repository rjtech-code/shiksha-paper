import { useEffect, useState } from 'react'
import { ShieldCheck, Users, FileStack, HardDrive, Trash2, Download, ShieldOff, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { api, type AdminHistoryItem, type AuthUser } from '../lib/api'
import { downloadBlob, formatBytes } from '../lib/pdfCore'

type Tab = 'overview' | 'users' | 'files'

export default function AdminPanel() {
  const { user: me } = useAuth()
  const [tab, setTab] = useState<Tab>('overview')
  const [stats, setStats] = useState<{ userCount: number; fileCount: number; totalBytes: number; byTool: { toolId: string; toolName: string; count: number }[] } | null>(null)
  const [users, setUsers] = useState<(AuthUser & { fileCount: number })[]>([])
  const [files, setFiles] = useState<AdminHistoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const loadAll = () => {
    setLoading(true)
    Promise.all([api.adminStats(), api.adminUsers(), api.adminHistory()])
      .then(([s, u, f]) => {
        setStats(s)
        setUsers(u.users)
        setFiles(f.items)
      })
      .finally(() => setLoading(false))
  }

  useEffect(loadAll, [])

  const toggleRole = async (u: AuthUser) => {
    setBusyId(u.id)
    try {
      const nextRole = u.role === 'admin' ? 'user' : 'admin'
      await api.adminSetRole(u.id, nextRole)
      setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: nextRole } : x)))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not update role')
    } finally {
      setBusyId(null)
    }
  }

  const deleteUser = async (u: AuthUser) => {
    if (!confirm(`Delete ${u.name} (${u.email}) and all their saved files? This can't be undone.`)) return
    setBusyId(u.id)
    try {
      await api.adminDeleteUser(u.id)
      setUsers((prev) => prev.filter((x) => x.id !== u.id))
      setFiles((prev) => prev.filter((f) => f.user?.id !== u.id))
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Could not delete user')
    } finally {
      setBusyId(null)
    }
  }

  const deleteFile = async (item: AdminHistoryItem) => {
    setBusyId(item.id)
    setFiles((prev) => prev.filter((f) => f.id !== item.id))
    try {
      await api.adminDeleteHistory(item.id)
    } catch {
      loadAll()
    } finally {
      setBusyId(null)
    }
  }

  const downloadFile = async (item: AdminHistoryItem) => {
    setBusyId(item.id)
    try {
      const blob = await api.downloadHistoryBlob(item)
      downloadBlob(blob, item.outputName)
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-11 h-11 rounded-2xl brand-gradient flex items-center justify-center shadow-md shadow-pink-200">
          <ShieldCheck className="text-white" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">Admin Panel</h1>
          <p className="text-sm text-slate-500">Manage users and every file saved across SikshaPaper.</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {([
          ['overview', 'Overview'],
          ['users', 'Users'],
          ['files', 'All Files'],
        ] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${tab === t ? 'brand-gradient text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-center text-slate-400 py-16">Loading…</p>
      ) : (
        <>
          {tab === 'overview' && stats && (
            <div>
              <div className="grid sm:grid-cols-3 gap-5 mb-8">
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center mb-3">
                    <Users className="text-white" size={20} />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-800">{stats.userCount}</p>
                  <p className="text-sm text-slate-500">Total users</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center mb-3">
                    <FileStack className="text-white" size={20} />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-800">{stats.fileCount}</p>
                  <p className="text-sm text-slate-500">Files saved</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center mb-3">
                    <HardDrive className="text-white" size={20} />
                  </div>
                  <p className="text-2xl font-extrabold text-slate-800">{formatBytes(stats.totalBytes)}</p>
                  <p className="text-sm text-slate-500">Storage used</p>
                </div>
              </div>

              <h2 className="text-lg font-bold text-slate-800 mb-3">Usage by tool</h2>
              {stats.byTool.length === 0 ? (
                <p className="text-sm text-slate-400">No activity yet.</p>
              ) : (
                <ul className="space-y-2">
                  {stats.byTool.map((t) => (
                    <li key={t.toolId} className="flex items-center justify-between bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
                      <span className="text-sm font-medium text-slate-700">{t.toolName}</span>
                      <span className="text-xs font-semibold text-brand-pink-600">{t.count} files</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'users' && (
            <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs uppercase text-slate-400 border-b border-slate-100">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Files</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b border-slate-50 last:border-0">
                      <td className="px-4 py-3 font-medium text-slate-700">{u.name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-brand-pink-100 text-brand-pink-700' : 'bg-brand-blue-50 text-brand-blue-700'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-500">{u.fileCount}</td>
                      <td className="px-4 py-3 text-slate-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => toggleRole(u)}
                            disabled={busyId === u.id || u.id === me?.id}
                            title={u.role === 'admin' ? 'Remove admin' : 'Make admin'}
                            className="p-2 rounded-lg text-brand-blue-600 hover:bg-brand-blue-50 disabled:opacity-30 transition-colors"
                          >
                            {u.role === 'admin' ? <ShieldOff size={16} /> : <Shield size={16} />}
                          </button>
                          <button
                            onClick={() => deleteUser(u)}
                            disabled={busyId === u.id || u.id === me?.id}
                            title="Delete user"
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'files' && (
            <ul className="space-y-2">
              {files.length === 0 && <p className="text-center text-slate-400 py-16">No files yet.</p>}
              {files.map((item) => (
                <li key={item.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 shadow-sm">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-700">{item.outputName}</p>
                    <p className="text-xs text-slate-400">
                      {item.toolName} · {item.user ? `${item.user.name} (${item.user.email})` : 'Unknown user'} · {formatBytes(item.size)} · {new Date(item.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => downloadFile(item)}
                    disabled={busyId === item.id}
                    className="shrink-0 p-2 rounded-lg text-brand-blue-600 hover:bg-brand-blue-50 disabled:opacity-40 transition-colors"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => deleteFile(item)}
                    disabled={busyId === item.id}
                    className="shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-40 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}

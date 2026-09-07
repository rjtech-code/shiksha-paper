import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, FileStack, LayoutDashboard, History, ShieldCheck, LogOut, ChevronDown } from 'lucide-react'
import { tools, categoryLabels, type ToolCategory } from '../data/tools'
import { useAuth } from '../context/AuthContext'

const categories: ToolCategory[] = ['organize', 'convert', 'edit', 'security']

function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  if (!user) return null

  const initial = user.name.trim().charAt(0).toUpperCase() || '?'

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-slate-200 hover:border-brand-pink-300 transition-colors">
        <span className="w-8 h-8 rounded-full brand-gradient text-white text-sm font-bold flex items-center justify-center">{initial}</span>
        <span className="text-sm font-semibold text-slate-700 max-w-[8rem] truncate">{user.name}</span>
        <ChevronDown size={14} className="text-slate-400" />
      </button>
      {open && (
        <div className="absolute top-full right-0 pt-2 w-56 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-brand-pink-100 p-2">
            <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-pink-50 transition-colors">
              <LayoutDashboard size={17} className="text-brand-pink-500" />
              <span className="text-sm font-medium text-slate-700">Dashboard</span>
            </Link>
            <Link to="/history" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-pink-50 transition-colors">
              <History size={17} className="text-brand-pink-500" />
              <span className="text-sm font-medium text-slate-700">History</span>
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-pink-50 transition-colors">
                <ShieldCheck size={17} className="text-brand-pink-500" />
                <span className="text-sm font-medium text-slate-700">Admin Panel</span>
              </Link>
            )}
            <div className="my-1 h-px bg-slate-100" />
            <button
              onClick={() => {
                setOpen(false)
                logout()
                navigate('/')
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-left"
            >
              <LogOut size={17} className="text-red-500" />
              <span className="text-sm font-medium text-red-600">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Header() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [menu, setMenu] = useState<ToolCategory | null>(null)

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur border-b border-brand-pink-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={() => setOpen(false)}>
          <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center shadow-md shadow-pink-200">
            <FileStack className="text-white" size={20} />
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            <span className="brand-gradient-text">Siksha</span>
            <span className="text-slate-700">Paper</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {categories.map((cat) => (
            <div
              key={cat}
              className="relative"
              onMouseEnter={() => setMenu(cat)}
              onMouseLeave={() => setMenu((m) => (m === cat ? null : m))}
            >
              <button className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-pink-600 rounded-lg transition-colors">
                {categoryLabels[cat]}
              </button>
              {menu === cat && (
                <div className="absolute top-full left-0 pt-2 w-72 animate-fade-in">
                  <div className="bg-white rounded-2xl shadow-2xl border border-brand-pink-100 p-3 grid grid-cols-1 gap-1 max-h-96 overflow-y-auto">
                    {tools
                      .filter((t) => t.category === cat)
                      .map((t) => (
                        <Link
                          key={t.id}
                          to={t.path}
                          className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-brand-pink-50 transition-colors"
                          onClick={() => setMenu(null)}
                        >
                          <t.icon size={18} className="text-brand-pink-500 shrink-0" />
                          <span className="text-sm font-medium text-slate-700">{t.name}</span>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
          <NavLink
            to="/all-tools"
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-brand-pink-600 rounded-lg transition-colors"
          >
            All Tools
          </NavLink>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <UserMenu />
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-brand-pink-600 px-3 py-2 transition-colors">
                Log in
              </Link>
              <Link
                to="/signup"
                className="brand-gradient text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-md shadow-pink-200 hover:brightness-105 transition"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <button className="lg:hidden text-slate-600" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-brand-pink-100 max-h-[75vh] overflow-y-auto animate-fade-in">
          <div className="px-4 py-4 space-y-5">
            {categories.map((cat) => (
              <div key={cat}>
                <p className="text-xs font-bold uppercase tracking-wide text-brand-blue-500 mb-2">
                  {categoryLabels[cat]}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {tools
                    .filter((t) => t.category === cat)
                    .map((t) => (
                      <Link
                        key={t.id}
                        to={t.path}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-pink-50/60 hover:bg-brand-pink-100 transition-colors"
                      >
                        <t.icon size={16} className="text-brand-pink-500 shrink-0" />
                        <span className="text-xs font-medium text-slate-700 truncate">{t.name}</span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}

            <div className="pt-1 border-t border-brand-pink-100">
              {user ? (
                <div className="grid grid-cols-2 gap-2 pt-4">
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-pink-50/60 hover:bg-brand-pink-100 transition-colors">
                    <LayoutDashboard size={16} className="text-brand-pink-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-700">Dashboard</span>
                  </Link>
                  <Link to="/history" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-pink-50/60 hover:bg-brand-pink-100 transition-colors">
                    <History size={16} className="text-brand-pink-500 shrink-0" />
                    <span className="text-xs font-medium text-slate-700">History</span>
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-pink-50/60 hover:bg-brand-pink-100 transition-colors">
                      <ShieldCheck size={16} className="text-brand-pink-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-700">Admin Panel</span>
                    </Link>
                  )}
                  <MobileLogoutButton onDone={() => setOpen(false)} />
                </div>
              ) : (
                <div className="flex gap-2 pt-4">
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center border-2 border-brand-blue-200 text-brand-blue-700 font-semibold px-4 py-2.5 rounded-full"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setOpen(false)}
                    className="flex-1 text-center brand-gradient text-white font-semibold px-4 py-2.5 rounded-full"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function MobileLogoutButton({ onDone }: { onDone: () => void }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  return (
    <button
      onClick={() => {
        onDone()
        logout()
        navigate('/')
      }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
    >
      <LogOut size={16} className="text-red-500 shrink-0" />
      <span className="text-xs font-medium text-red-600">Log out</span>
    </button>
  )
}

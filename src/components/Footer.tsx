import { Link } from 'react-router-dom'
import { FileStack, Heart } from 'lucide-react'
import { tools, categoryLabels, type ToolCategory } from '../data/tools'

const categories: ToolCategory[] = ['organize', 'convert', 'edit', 'security']

export default function Footer() {
  return (
    <footer className="mt-24 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center">
              <FileStack className="text-white" size={20} />
            </div>
            <span className="text-xl font-extrabold tracking-tight text-white">
              <span className="text-brand-pink-400">Siksha</span>Paper
            </span>
          </div>
          <p className="text-sm text-slate-400 max-w-sm">
            Every tool you need to work with PDFs in one place — merge, split, compress, convert,
            sign and secure your documents, 100% free and processed right in your browser.
          </p>
        </div>
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-white font-semibold mb-3 text-sm">{categoryLabels[cat]}</p>
            <ul className="space-y-2">
              {tools
                .filter((t) => t.category === cat)
                .slice(0, 6)
                .map((t) => (
                  <li key={t.id}>
                    <Link to={t.path} className="text-sm text-slate-400 hover:text-brand-pink-300 transition-colors">
                      {t.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SikshaPaper. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-brand-pink-400 fill-brand-pink-400" /> for students & educators
          </p>
        </div>
      </div>
    </footer>
  )
}

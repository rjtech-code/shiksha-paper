import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { tools, categoryLabels, type ToolCategory } from '../data/tools'
import ToolCard from '../components/ToolCard'

const categories: (ToolCategory | 'all')[] = ['all', 'organize', 'convert', 'edit', 'security']

export default function AllTools() {
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState<ToolCategory | 'all'>('all')

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchesCat = cat === 'all' || t.category === cat
      const matchesQuery = t.name.toLowerCase().includes(query.toLowerCase())
      return matchesCat && matchesQuery
    })
  }, [query, cat])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800">
          All <span className="brand-gradient-text">PDF Tools</span>
        </h1>
        <p className="text-slate-500 mt-2">Everything you need to work with PDF documents, free & private.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools…"
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink-300 bg-white"
          />
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                cat === c
                  ? 'brand-gradient text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-brand-pink-300'
              }`}
            >
              {c === 'all' ? 'All' : categoryLabels[c]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-slate-400 py-16">No tools match your search.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      )}
    </div>
  )
}

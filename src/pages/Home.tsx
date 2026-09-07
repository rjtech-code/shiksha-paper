import { Link } from 'react-router-dom'
import { ShieldCheck, Zap, Globe, Sparkles } from 'lucide-react'
import { tools, categoryLabels, type ToolCategory } from '../data/tools'
import ToolCard from '../components/ToolCard'

const categories: ToolCategory[] = ['organize', 'convert', 'edit', 'security']

const perks = [
  { icon: Zap, title: 'Fast & Free', desc: 'Every tool works instantly, right in your browser — no waiting on uploads.' },
  { icon: ShieldCheck, title: 'Private by Design', desc: 'Files are processed on your device and never uploaded to a server.' },
  { icon: Globe, title: 'Works Everywhere', desc: 'Windows, Mac, Linux, mobile — SikshaPaper runs in any modern browser.' },
  { icon: Sparkles, title: 'All-in-One', desc: '27 PDF tools — merge, convert, sign, protect and more, one home.' },
]

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-pink-200 rounded-full blur-3xl opacity-40" />
        <div className="absolute -top-10 right-0 w-96 h-96 bg-brand-blue-200 rounded-full blur-3xl opacity-40" />
        <div className="relative max-w-5xl mx-auto px-4 pt-16 pb-14 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-brand-pink-200 text-brand-pink-600 text-xs font-bold tracking-wide uppercase shadow-sm mb-6">
            27 Free PDF Tools · No Sign-up
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-800 leading-tight">
            Every PDF tool you need,
            <br />
            <span className="brand-gradient-text">in one place.</span>
          </h1>
          <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
            Merge, split, compress, convert, sign and protect your PDF files with SikshaPaper.
            100% free, fast, and it all happens right inside your browser.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/merge-pdf"
              className="brand-gradient text-white font-semibold px-8 py-3.5 rounded-full shadow-lg shadow-pink-200 hover:brightness-105 active:scale-[0.98] transition"
            >
              Merge PDF
            </Link>
            <Link
              to="/all-tools"
              className="border-2 border-brand-blue-200 text-brand-blue-700 font-semibold px-8 py-3.5 rounded-full hover:bg-brand-blue-50 transition"
            >
              Explore all tools
            </Link>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {perks.map((p) => (
            <div key={p.title} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center mb-3">
                <p.icon className="text-white" size={20} />
              </div>
              <h3 className="font-bold text-slate-800">{p.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tool grid by category */}
      <section className="max-w-6xl mx-auto px-4 py-10">
        {categories.map((cat) => (
          <div key={cat} className="mb-14">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-2xl font-extrabold text-slate-800">{categoryLabels[cat]}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-brand-pink-200 to-transparent" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {tools.filter((t) => t.category === cat).map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="brand-gradient rounded-3xl px-8 py-14 text-center shadow-xl shadow-pink-200">
          <h2 className="text-3xl font-extrabold text-white">Ready to get things done?</h2>
          <p className="text-white/90 mt-2">Pick a tool and start editing your PDF in seconds — completely free.</p>
          <Link
            to="/all-tools"
            className="inline-block mt-6 bg-white text-brand-pink-600 font-bold px-8 py-3.5 rounded-full shadow-lg hover:scale-[1.03] active:scale-[0.98] transition"
          >
            Browse all 27 tools
          </Link>
        </div>
      </section>
    </div>
  )
}

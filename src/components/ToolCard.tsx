import { Link } from 'react-router-dom'
import type { ToolDef } from '../data/tools'

export default function ToolCard({ tool }: { tool: ToolDef }) {
  const Icon = tool.icon
  const iconBg = tool.color === 'pink' ? 'bg-brand-pink-500' : 'bg-brand-blue-500'
  return (
    <Link
      to={tool.path}
      className="card-hover group flex flex-col gap-3 bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:border-brand-pink-200"
    >
      <div className={`w-11 h-11 rounded-xl ${iconBg} flex items-center justify-center shadow-md`}>
        <Icon className="text-white" size={22} />
      </div>
      <div>
        <h3 className="font-bold text-slate-800 group-hover:text-brand-pink-600 transition-colors">{tool.name}</h3>
        <p className="text-sm text-slate-500 mt-1 leading-snug">{tool.description}</p>
      </div>
    </Link>
  )
}

import type { LucideIcon } from 'lucide-react'
import { CheckCircle2, Loader2, AlertTriangle, Download } from 'lucide-react'
import type { ReactNode } from 'react'

interface ToolShellProps {
  icon: LucideIcon
  title: string
  description: string
  children: ReactNode
}

export function ToolShell({ icon: Icon, title, description, children }: ToolShellProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-14 h-14 rounded-2xl brand-gradient flex items-center justify-center shadow-lg shadow-pink-200 shrink-0">
          <Icon className="text-white" size={28} />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800">{title}</h1>
          <p className="text-slate-500 text-sm sm:text-base">{description}</p>
        </div>
      </div>
      <div className="mt-8 bg-white/80 backdrop-blur border border-brand-pink-100 rounded-3xl shadow-xl shadow-pink-100/50 p-6 sm:p-8">
        {children}
      </div>
    </div>
  )
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  type = 'button',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="brand-gradient text-white font-semibold px-8 py-3 rounded-full shadow-lg shadow-pink-200 hover:brightness-105 active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:brightness-100"
    >
      {children}
    </button>
  )
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="border-2 border-brand-blue-200 text-brand-blue-700 font-semibold px-6 py-2.5 rounded-full hover:bg-brand-blue-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  return (
    <div className="w-full">
      {label && <p className="text-sm text-slate-500 mb-1">{label}</p>}
      <div className="h-2.5 w-full bg-brand-blue-100 rounded-full overflow-hidden">
        <div
          className="h-full brand-gradient rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  )
}

export function StatusBanner({
  status,
  processingText = 'Processing…',
  errorText,
}: {
  status: 'idle' | 'processing' | 'done' | 'error'
  processingText?: string
  errorText?: string
}) {
  if (status === 'processing') {
    return (
      <div className="flex items-center gap-2 text-brand-blue-600 bg-brand-blue-50 border border-brand-blue-200 rounded-xl px-4 py-3 animate-fade-in">
        <Loader2 className="animate-spin" size={18} />
        <span className="text-sm font-medium">{processingText}</span>
      </div>
    )
  }
  if (status === 'done') {
    return (
      <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 animate-fade-in">
        <CheckCircle2 size={18} />
        <span className="text-sm font-medium">Done! Your file is ready to download.</span>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 animate-fade-in">
        <AlertTriangle size={18} />
        <span className="text-sm font-medium">{errorText ?? 'Something went wrong. Please try again.'}</span>
      </div>
    )
  }
  return null
}

export function DownloadCard({ onDownload, filename }: { onDownload: () => void; filename: string }) {
  return (
    <div className="flex items-center justify-between gap-4 bg-gradient-to-r from-brand-pink-50 to-brand-blue-50 border border-brand-pink-200 rounded-2xl px-5 py-4 animate-fade-in">
      <div className="min-w-0">
        <p className="text-sm text-slate-500">Ready</p>
        <p className="font-semibold text-slate-700 truncate">{filename}</p>
      </div>
      <button
        onClick={onDownload}
        className="shrink-0 flex items-center gap-2 brand-gradient text-white font-semibold px-5 py-2.5 rounded-full shadow-md hover:brightness-105 active:scale-[0.98] transition"
      >
        <Download size={18} /> Download
      </button>
    </div>
  )
}

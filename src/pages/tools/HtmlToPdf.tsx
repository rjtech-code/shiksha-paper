import { useState } from 'react'
import { Code2 } from 'lucide-react'
import { ToolShell, PrimaryButton, SecondaryButton, StatusBanner, DownloadCard } from '../../components/ToolShell'
import { downloadBlob } from '../../lib/pdfCore'
import { renderHtmlToPdfBlob } from '../../lib/htmlToPdf'
import { useToolHistory } from '../../hooks/useToolHistory'
import ToolHistoryPanel from '../../components/ToolHistoryPanel'

type Status = 'idle' | 'processing' | 'done' | 'error'
type Mode = 'url' | 'html'

const sample = `<h1 style="color:#e0116d">Hello from SikshaPaper</h1>
<p>Paste any HTML markup here and convert it straight to a PDF document — right in your browser.</p>
<ul><li>Fast</li><li>Free</li><li>Private</li></ul>`

export default function HtmlToPdf() {
  const [mode, setMode] = useState<Mode>('html')
  const [html, setHtml] = useState(sample)
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null)
  const history = useToolHistory('html-to-pdf', 'HTML to PDF')

  const convert = async () => {
    setStatus('processing')
    setError('')
    setResult(null)
    try {
      const content =
        mode === 'html'
          ? html
          : `<p>Link: <a href="${url}">${url}</a></p><p style="color:#888">Live URL rendering requires server-side fetching; paste the page's HTML instead for full fidelity.</p>`
      const blob = renderHtmlToPdfBlob(content)
      setResult({ blob, name: 'sikshapaper-html.pdf' })
      history.saveResult(blob, 'sikshapaper-html.pdf')
      setStatus('done')
    } catch (e) {
      console.error(e)
      setError('Could not render this content to PDF.')
      setStatus('error')
    }
  }

  return (
    <ToolShell icon={Code2} title="HTML to PDF" description="Convert HTML markup or plain text into a PDF document.">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode('html')} className={`px-4 py-2 rounded-full text-sm font-semibold ${mode === 'html' ? 'brand-gradient text-white' : 'bg-brand-blue-50 text-slate-600'}`}>
          Paste HTML
        </button>
        <button onClick={() => setMode('url')} className={`px-4 py-2 rounded-full text-sm font-semibold ${mode === 'url' ? 'brand-gradient text-white' : 'bg-brand-blue-50 text-slate-600'}`}>
          From URL
        </button>
      </div>

      {mode === 'html' ? (
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={12}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-pink-300"
        />
      ) : (
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-pink-300"
        />
      )}

      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex gap-3">
          <SecondaryButton onClick={() => setHtml(sample)}>Reset sample</SecondaryButton>
          <PrimaryButton onClick={convert} disabled={status === 'processing' || (mode === 'html' ? !html.trim() : !url.trim())}>
            {status === 'processing' ? 'Converting…' : 'Convert to PDF'}
          </PrimaryButton>
        </div>
        <StatusBanner status={status} processingText="Rendering…" errorText={error} />
        {result && <DownloadCard filename={result.name} onDownload={() => downloadBlob(result.blob, result.name)} />}
      </div>
      <ToolHistoryPanel history={history} />
    </ToolShell>
  )
}

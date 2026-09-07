import { useCallback, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'
import { formatBytes } from '../lib/pdfCore'

interface FileDropProps {
  accept?: string
  multiple?: boolean
  files: File[]
  onFiles: (files: File[]) => void
  label?: string
  hint?: string
}

export default function FileDrop({ accept, multiple = false, files, onFiles, label, hint }: FileDropProps) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const addFiles = useCallback(
    (incoming: FileList | File[]) => {
      const list = Array.from(incoming)
      onFiles(multiple ? [...files, ...list] : list.slice(0, 1))
    },
    [files, multiple, onFiles],
  )

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files)
  }

  const removeFile = (idx: number) => {
    onFiles(files.filter((_, i) => i !== idx))
  }

  return (
    <div className="w-full">
      <div
        className={`dropzone ${dragging ? 'dragging' : ''} flex flex-col items-center justify-center gap-3 px-6 py-12 text-center cursor-pointer`}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-16 h-16 rounded-2xl brand-gradient flex items-center justify-center shadow-lg shadow-pink-200 animate-float">
          <UploadCloud className="text-white" size={30} />
        </div>
        <p className="text-lg font-semibold text-slate-700">
          {label ?? 'Select files or drag & drop here'}
        </p>
        <p className="text-sm text-slate-400">{hint ?? 'Your files never leave your browser'}</p>
        <span className="mt-2 inline-block rounded-full brand-gradient text-white text-sm font-semibold px-6 py-2 shadow-md">
          Choose file{multiple ? 's' : ''}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((f, i) => (
            <li
              key={`${f.name}-${i}`}
              className="flex items-center gap-3 bg-white border border-brand-blue-100 rounded-xl px-4 py-2.5 shadow-sm animate-fade-in"
            >
              <FileText className="text-brand-pink-500 shrink-0" size={20} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-700">{f.name}</p>
                <p className="text-xs text-slate-400">{formatBytes(f.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(i)
                }}
                className="text-slate-400 hover:text-brand-pink-600 transition-colors shrink-0"
                aria-label="Remove file"
              >
                <X size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

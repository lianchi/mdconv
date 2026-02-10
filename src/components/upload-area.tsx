'use client'

import { FileText, UploadCloud, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface UploadAreaProps {
  onFileLoaded: (content: string, filename: string, file: File) => void
  defaultFile?: File | null
}

export function UploadArea({ onFileLoaded, defaultFile }: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(defaultFile || null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const validateAndSetFile = (file: File) => {
    setError(null)
    const validExtensions = ['.md', '.txt', '.markdown']
    const isMarkdownOrTxt = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!isMarkdownOrTxt) {
      setError('文件类型无效')
      return
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB
      setError('文件大小超过限制：10MB')
      return
    }
    setSelectedFile(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      validateAndSetFile(file)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      validateAndSetFile(file)
    }
    // Reset input value to allow selecting the same file again if needed
    e.target.value = ''
  }

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    setError(null)
  }

  const handleConfirm = () => {
    if (!selectedFile)
      return

    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string

      // Basic content validation: check for null bytes to avoid binary files
      // Check first 1000 characters to detect binary content quickly
      const checkLength = Math.min(content.length, 1000)
      let isBinary = false
      for (let i = 0; i < checkLength; i++) {
        if (content.charCodeAt(i) === 0) {
          isBinary = true
          break
        }
      }

      if (isBinary) {
        setError('文件内容校验失败：仅支持文本文件')
        return
      }

      onFileLoaded(content, selectedFile.name, selectedFile)
    }
    reader.onerror = () => {
      setError('读取文件失败')
    }
    reader.readAsText(selectedFile)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-[480px] rounded-xl border border-gray-300 bg-white">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none text-lg">上传文件</h3>
        <p className="text-sm text-muted-foreground text-gray-500">支持格式：.md, .txt。文件大小不超过 10MB。</p>
      </div>
      <div className="p-6 pt-0">
        <div
          className={cn(
            'relative flex flex-col items-center justify-center w-full h-48 border border-dashed rounded-lg cursor-pointer bg-gray-50',
            isDragging ? 'border-primary bg-primary/10' : 'border-gray-300 hover:bg-gray-100 hover:border-gray-400',
            error ? 'border-red-500/50' : '',
            selectedFile ? 'border-primary/50! bg-primary/10!' : '',
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={triggerFileInput}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".md,.markdown,.txt"
            onChange={handleInputChange}
          />

          {selectedFile
            ? (
                <div className="flex flex-col items-center gap-2 p-4 text-center">
                  <div className="p-3 rounded-full bg-white">
                    <FileText className="w-7 h-7 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {(selectedFile.size / 1024).toFixed(1)}
                      {' '}
                      KB
                    </p>
                  </div>
                  <button
                    className="absolute top-2 right-2 h-8 w-8 p-0 flex items-center justify-center rounded-full bg-white cursor-pointer"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )
            : (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className="p-2 rounded-full bg-white">
                    <UploadCloud className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-600">点击上传</p>
                </div>
              )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
      <div className="flex items-center p-6 pt-0">
        <button
          className={cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
            'bg-primary text-primary-foreground hover:bg-primary-hover h-10 px-4 py-2 w-full cursor-pointer disabled:cursor-not-allowed text-base',
          )}
          onClick={handleConfirm}
          disabled={!selectedFile}
        >
          预览
        </button>
      </div>
    </div>
  )
}

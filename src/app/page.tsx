'use client'

import { ArrowLeft, Download, Printer } from 'lucide-react'
import { useState } from 'react'
import { PreviewArea } from '@/components/preview-area'
import { UploadArea } from '@/components/upload-area'
import { cn } from '@/lib/utils'

export default function Home() {
  const [content, setContent] = useState<string | null>(null)
  const [filename, setFilename] = useState<string>('document.md')

  const handleFileLoaded = (newContent: string, name: string) => {
    setContent(newContent)
    setFilename(name)
  }

  const handleBack = () => {
    setContent(null)
  }

  const handleExportHTML = async () => {
    if (!content)
      return

    // Fetch local CSS content for inlining
    let githubMarkdownCss = ''
    let highlightCss = ''
    try {
      const [res1, res2] = await Promise.all([
        fetch('/github-markdown-light.min.css'),
        fetch('/github.min.css'),
      ])
      githubMarkdownCss = await res1.text()
      highlightCss = await res2.text()
    }
    catch (e) {
      console.error('Failed to fetch local CSS for export', e)
    }

    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${filename.replace(/\.md$/i, '')}</title>
<style>
${githubMarkdownCss}
${highlightCss}
  body { box-sizing: border-box; min-width: 200px; max-width: 980px; margin: 0 auto; padding: 45px; }
  @media (max-width: 767px) { body { padding: 15px; } }
  @media print {
    body { background: white; }
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  }
</style>
</head>
<body>
<div class="markdown-body">
${document.getElementById('markdown-preview')?.innerHTML || ''}
</div>
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename.replace(/\.(md|txt|markdown)$/i, '.html')
    // Ensure extension is html if regex didn't match (e.g. file has no extension)
    if (!a.download.toLowerCase().endsWith('.html')) {
      a.download += '.html'
    }
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <main className="min-h-screen bg-[#f1f2f4] text-gray-900 print:bg-white">
      {!content
        ? (
            <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
              <img src="/favicon.svg" alt="Logo" className="h-12 w-12" />
              <h1 className="mb-8 text-2xl font-semibold text-gray-800">
                Markdown 预览导出
              </h1>
              <UploadArea onFileLoaded={handleFileLoaded} />
            </div>
          )
        : (
            <div className="mx-auto max-w-4xl print:p-0 print:max-w-none">
              <header className="sticky top-0 z-50 mb-4 flex items-center justify-between border-b border-gray-300 bg-[#f1f2f477] px-6 py-4 backdrop-blur-md print:hidden">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBack}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full hover:bg-gray-200"
                    title="返回"
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                  <div className="flex items-center gap-2">
                    <img src="/favicon.svg" alt="Logo" className="h-6 w-6" />
                    <h1 className="text-lg font-semibold tracking-tight">MDConv</h1>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleExportHTML}
                    className={cn(
                      'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                      'hover:bg-gray-200 h-9 px-3',
                    )}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    导出 HTML
                  </button>
                  <button
                    onClick={handlePrint}
                    className={cn(
                      'inline-flex cursor-pointer items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                      'hover:bg-gray-200 h-9 px-3',
                    )}
                  >
                    <Printer className="mr-2 h-4 w-4" />
                    打印 PDF
                  </button>
                </div>
              </header>

              <div className="flex flex-col gap-2 px-6 pb-8 sm:px-8">
                <div className="flex items-center print:hidden">
                  <h2 className="text-sm font-semibold text-gray-500">预览</h2>
                  <span className="text-xs ml-2 text-gray-500">{filename}</span>
                </div>
                <div className="min-h-[600px] rounded-xl border border-gray-300 bg-white p-8 print:border-0 print:p-0">
                  <PreviewArea content={content} />
                </div>
              </div>
            </div>
          )}
    </main>
  )
}

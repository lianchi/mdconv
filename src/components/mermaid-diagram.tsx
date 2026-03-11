'use client'

import { useEffect, useId, useState } from 'react'

interface MermaidDiagramProps {
  chart: string
}

/**
 * Renders a Mermaid diagram from its textual definition.
 * Uses the mermaid library to convert the text into an inline SVG,
 * which is captured by innerHTML for HTML export.
 */
export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const uniqueId = useId().replace(/:/g, '-')
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function renderChart() {
      try {
        // Dynamic import to avoid SSR issues
        const mermaid = (await import('mermaid')).default

        mermaid.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif',
        })

        const { svg: renderedSvg } = await mermaid.render(`mermaid-${uniqueId}`, chart.trim())

        if (!cancelled) {
          setSvg(renderedSvg)
          setError(null)
        }
      }
      catch (err) {
        if (!cancelled) {
          console.error('Mermaid rendering failed:', err)
          setError(err instanceof Error ? err.message : 'Failed to render diagram')
          setSvg('')
        }
      }
    }

    renderChart()
    return () => {
      cancelled = true
    }
  }, [chart, uniqueId])

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 p-4">
        <p className="mb-2 text-sm font-medium text-red-700">Mermaid 图表渲染失败</p>
        <pre className="text-xs text-red-600 whitespace-pre-wrap">{error}</pre>
        <details className="mt-2">
          <summary className="cursor-pointer text-xs text-red-500">查看源码</summary>
          <pre className="mt-1 text-xs text-gray-600 whitespace-pre-wrap">{chart}</pre>
        </details>
      </div>
    )
  }

  if (!svg) {
    return (
      <div className="flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 p-8">
        <p className="text-sm text-gray-400">渲染图表中…</p>
      </div>
    )
  }

  return (
    <div
      className="mermaid-diagram flex justify-center overflow-x-auto py-2"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

'use client'

import type { ComponentPropsWithoutRef } from 'react'
import { Check, Copy } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

/**
 * Custom <pre> wrapper that adds a "copy to clipboard" button
 * in the top-right corner of every code block.
 * The button is hidden in print mode and excluded from HTML export
 * via the `data-no-export` attribute.
 */
export function CodeBlock({ children, ...props }: ComponentPropsWithoutRef<'pre'>) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleCopy = useCallback(async () => {
    const code = preRef.current?.querySelector('code')?.textContent || ''
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => setCopied(false), 2000)
    }
    catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [])

  return (
    <div className="code-block-wrapper relative">
      <pre ref={preRef} {...props}>
        {children}
      </pre>
      <button
        type="button"
        data-no-export
        onClick={handleCopy}
        className="copy-btn absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white/80 backdrop-blur-sm hover:bg-gray-100 print:hidden"
        title={copied ? '已复制' : '复制代码'}
      >
        {copied
          ? <Check className="h-4 w-4 text-green-500" />
          : <Copy className="h-4 w-4 text-gray-500" />}
      </button>
    </div>
  )
}

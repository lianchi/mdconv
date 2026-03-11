'use client'

import GithubSlugger from 'github-slugger'
import { ChevronDown, List } from 'lucide-react'
import { useMemo, useState } from 'react'

interface TocItem {
  level: number
  text: string
  id: string
}

interface TableOfContentsProps {
  content: string
}

/**
 * Extracts headings (h1–h6) from raw Markdown content.
 * Handles ATX-style headings (# Heading) only.
 * Uses github-slugger (same as rehype-slug) for consistent ID generation.
 */
function extractHeadings(markdown: string): TocItem[] {
  const lines = markdown.split('\n')
  const headings: TocItem[] = []
  const slugger = new GithubSlugger()
  let inCodeBlock = false

  for (const line of lines) {
    // Track fenced code blocks to avoid matching headings inside them
    if (line.trimStart().startsWith('```')) {
      inCodeBlock = !inCodeBlock
      continue
    }
    if (inCodeBlock)
      continue

    const match = /^(#{1,6}) (.+)$/.exec(line)
    if (match) {
      const level = match[1].length
      // Strip inline markdown (bold, italic, code, links)
      const text = match[2]
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/\[(.+?)\]\(.+?\)/g, '$1')
        .trim()
      headings.push({ level, text, id: slugger.slug(text) })
    }
  }

  return headings
}

/**
 * A collapsible Table of Contents component.
 * Renders at the top of the document, extracting headings from the raw Markdown.
 * Clicking a heading item scrolls to the corresponding section.
 */
export function TableOfContents({ content }: TableOfContentsProps) {
  const [expanded, setExpanded] = useState(false)
  const headings = useMemo(() => extractHeadings(content), [content])

  if (headings.length < 2) {
    return null
  }

  // Determine the minimum heading level to use as base for indentation
  const minLevel = Math.min(...headings.map(h => h.level))

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="toc-container mb-6 rounded-lg border border-gray-200 bg-gray-50/50 print:border-gray-300" data-no-export-interactive>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100/50 rounded-lg"
        onClick={() => setExpanded(!expanded)}
      >
        <List className="h-4 w-4 text-gray-500 shrink-0" />
        <span>目录</span>
        <span className="text-xs text-gray-400">
          (
          {headings.length}
          )
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-gray-400 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <nav className="border-t border-gray-200 px-4 py-3">
          <ul className="space-y-1">
            {headings.map(heading => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - minLevel) * 16}px` }}
              >
                <button
                  type="button"
                  className="w-full cursor-pointer rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-200/60 hover:text-gray-900 truncate"
                  onClick={() => handleClick(heading.id)}
                  title={heading.text}
                >
                  {heading.text}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

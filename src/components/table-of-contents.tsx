'use client'

import GithubSlugger from 'github-slugger'
import { ChevronDown, List } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TocItem {
  level: number
  text: string
  id: string
}

interface TableOfContentsProps {
  content: string
}

const HEADING_SELECTOR = 'h1, h2, h3, h4, h5, h6'

function extractHeadingsFromDom(root: ParentNode): TocItem[] {
  const nodes = root.querySelectorAll<HTMLHeadingElement>(HEADING_SELECTOR)
  const headings: TocItem[] = []
  const slugger = new GithubSlugger()

  nodes.forEach((node) => {
    const level = Number.parseInt(node.tagName[1] || '', 10)
    const text = (node.textContent || '').trim()
    if (!text || Number.isNaN(level))
      return

    let id = node.id.trim()

    if (!id) {
      id = slugger.slug(text)
      node.id = id
    }

    if (!id)
      return

    headings.push({ level, text, id })
  })

  return headings
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [expanded, setExpanded] = useState(false)
  const [headings, setHeadings] = useState<TocItem[]>([])

  useEffect(() => {
    const collect = () => {
      const root = document.getElementById('markdown-preview')
      if (!root) {
        setHeadings([])
        return 0
      }

      const next = extractHeadingsFromDom(root)
      setHeadings(next)
      return next.length
    }

    const count = collect()
    if (count === 0) {
      const frame = requestAnimationFrame(() => {
        collect()
      })
      return () => cancelAnimationFrame(frame)
    }
  }, [content])

  if (headings.length === 0) {
    return null
  }

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
        className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-100/50"
        onClick={() => setExpanded(!expanded)}
      >
        <List className="h-4 w-4 shrink-0 text-gray-500" />
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
                  className="w-full cursor-pointer truncate rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-200/60 hover:text-gray-900"
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

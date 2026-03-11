'use client'
import type { ComponentPropsWithoutRef } from 'react'
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import remarkGfm from 'remark-gfm'
import { CodeBlock } from './code-block'
import { ImageZoom } from './image-zoom'
import { MermaidDiagram } from './mermaid-diagram'
import { TableOfContents } from './table-of-contents'

interface PreviewAreaProps {
  content: string
}

/**
 * Custom URL transform that allows data: URIs (base64-encoded images) to pass through.
 * The default urlTransform in react-markdown v9+ strips data: URIs for security,
 * which prevents inline base64 images from rendering.
 */
function urlTransform(url: string) {
  if (url.startsWith('data:')) {
    return url
  }
  return defaultUrlTransform(url)
}

/**
 * Custom code component that intercepts mermaid code blocks and renders them as diagrams.
 * Other code blocks are rendered as normal <code> elements with syntax highlighting.
 */
function Code({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) {
  const match = /language-mermaid/.exec(className || '')
  const codeText = String(children).replace(/\n$/, '')

  if (match) {
    return <MermaidDiagram chart={codeText} />
  }

  return (
    <code className={className} {...props}>
      {children}
    </code>
  )
}

export function PreviewArea({ content }: PreviewAreaProps) {
  // Detect [[TOC]] marker at the beginning of the document
  const tocPattern = /^\s*\[\[TOC\]\]\s*/i
  const showToc = tocPattern.test(content)
  // Strip the [[TOC]] marker so it doesn't render as literal text
  const markdownContent = showToc ? content.replace(tocPattern, '') : content

  return (
    <div id="markdown-preview" className="markdown-body w-full">
      {showToc && <TableOfContents content={markdownContent} />}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug, rehypeHighlight]}
        urlTransform={urlTransform}
        components={{
          code: Code,
          pre: CodeBlock,
          img: ImageZoom,
        }}
      >
        {markdownContent}
      </ReactMarkdown>
    </div>
  )
}

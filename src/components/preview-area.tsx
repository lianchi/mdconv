'use client'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

// CSS is now loaded via <link> in layout.tsx from local files in public/
// import 'highlight.js/styles/github.css'
// import 'github-markdown-css/github-markdown-light.css'

interface PreviewAreaProps {
  content: string
}

export function PreviewArea({ content }: PreviewAreaProps) {
  return (
    <div id="markdown-preview" className="markdown-body w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeHighlight]}
        components={{
          // We can remove most custom overrides because github-markdown-css handles them well.
          // But we can keep them if we want specific overrides.
          // For now, let's remove the overrides to let github-markdown-css do its job,
          // which solves the "blurriness" or "bad style" issue by using the standard.
          // However, if we need to support specific things, we can add them back.
          // Since user asked for "GitHub theme", using the CSS class and removing manual overrides is the best way.
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

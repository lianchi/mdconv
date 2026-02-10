import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MDConv - Markdown 预览与导出',
  description: '轻量级 Markdown 预览与导出工具。',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {/* Local CSS files for offline support */}
        <link rel="stylesheet" href="/github-markdown-light.min.css" />
        <link rel="stylesheet" href="/github.min.css" />
        {children}
      </body>
    </html>
  )
}

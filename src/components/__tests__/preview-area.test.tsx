import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PreviewArea } from '../preview-area'

describe('previewArea', () => {
  it('renders markdown content', () => {
    const content = '# Hello World\nThis is a test.'
    render(<PreviewArea content={content} />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Hello World')
    expect(screen.getByText('This is a test.')).toBeInTheDocument()
  })

  it('renders HTML content via rehype-raw', () => {
    const content = '<div data-testid="raw-html">Raw HTML</div>'
    render(<PreviewArea content={content} />)
    expect(screen.getByTestId('raw-html')).toBeInTheDocument()
  })

  it('renders toc when [[TOC]] exists and markdown has headings', async () => {
    const content = '[[TOC]]\n# Heading One\n\nContent'
    const { container } = render(<PreviewArea content={content} />)
    await waitFor(() => {
      expect(container.querySelector('.toc-container')).toBeInTheDocument()
    })
  })
})

import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { UploadArea } from '../upload-area'

describe('uploadArea', () => {
  it('renders upload prompt', () => {
    render(<UploadArea onFileLoaded={() => {}} />)
    expect(screen.getByText(/上传文件/)).toBeInTheDocument()
  })

  it('validates file extension', async () => {
    const onFileLoaded = vi.fn()
    render(<UploadArea onFileLoaded={onFileLoaded} />)

    const file = new File(['dummy content'], 'test.pdf', { type: 'application/pdf' })
    const dropZone = screen.getByText(/点击上传/).closest('div')?.parentElement

    if (!dropZone)
      throw new Error('Drop zone not found')

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    })

    expect(await screen.findByText(/文件类型无效。支持的格式：.md, .txt/)).toBeInTheDocument()
    expect(onFileLoaded).not.toHaveBeenCalled()
  })

  it('accepts valid markdown file', async () => {
    const onFileLoaded = vi.fn()
    render(<UploadArea onFileLoaded={onFileLoaded} />)

    const file = new File(['# Markdown'], 'test.md', { type: 'text/markdown' })
    const dropZone = screen.getByText(/点击上传/).closest('div')?.parentElement

    if (!dropZone)
      throw new Error('Drop zone not found')

    fireEvent.drop(dropZone, {
      dataTransfer: {
        files: [file],
      },
    })

    const confirmButton = screen.getByText('确认上传')
    fireEvent.click(confirmButton)

    await waitFor(() => {
      expect(onFileLoaded).toHaveBeenCalledWith('# Markdown', 'test.md')
    })
  })
})

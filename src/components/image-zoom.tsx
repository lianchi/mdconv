'use client'

import type { ComponentPropsWithoutRef } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Image component with click-to-zoom lightbox overlay.
 * Clicking the image opens a fullscreen overlay with the image centered.
 * Press Escape or click the backdrop to close.
 * The overlay is rendered via Portal to avoid DOM nesting issues
 * (e.g. <div> inside <p> when markdown wraps images in paragraphs).
 */
export function ImageZoom(props: ComponentPropsWithoutRef<'img'>) {
  const [open, setOpen] = useState(false)

  const handleOpen = useCallback(() => {
    if (props.src) {
      setOpen(true)
    }
  }, [props.src])

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  useEffect(() => {
    if (!open)
      return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <>
      <img
        {...props}
        alt={props.alt || ''}
        onClick={handleOpen}
        className="cursor-zoom-in"
        style={{ maxWidth: '100%', ...((props.style as object) || {}) }}
      />
      {open && createPortal(
        <div
          className="image-zoom-overlay fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm print:hidden"
          onClick={handleClose}
          data-no-export
        >
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <img
              src={props.src}
              alt={props.alt || ''}
              className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain shadow-2xl"
            />
            {props.alt && (
              <p className="mt-2 text-center text-sm text-white/80">{props.alt}</p>
            )}
          </div>
        </div>,
        document.body,
      )}
    </>
  )
}

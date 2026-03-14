import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist'
import { CacheFirst, NetworkFirst, Serwist, StaleWhileRevalidate } from 'serwist'

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined
  }
}

declare const self: WorkerGlobalScope & { origin: string }

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: new CacheFirst({
        cacheName: 'google-fonts',
        plugins: [],
      }),
    },
    {
      matcher: /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'static-font-assets',
        plugins: [],
      }),
    },
    {
      matcher: /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'static-image-assets',
        plugins: [],
      }),
    },
    {
      matcher: /\.js$/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'static-js-assets',
        plugins: [],
      }),
    },
    {
      matcher: /\.(?:css|less)$/i,
      handler: new StaleWhileRevalidate({
        cacheName: 'static-style-assets',
        plugins: [],
      }),
    },
    {
      matcher: /\.(?:json|xml|csv)$/i,
      handler: new NetworkFirst({
        cacheName: 'static-data-assets',
        plugins: [],
      }),
    },
    {
      matcher: ({ url }: { url: URL }) => {
        const isSameOrigin = self.origin === url.origin
        if (!isSameOrigin)
          return false
        const pathname = url.pathname
        if (pathname.startsWith('/api/'))
          return false
        return true
      },
      handler: new NetworkFirst({
        cacheName: 'others',
        plugins: [],
      }),
    },
  ],
})

serwist.addEventListeners()

import type { NextConfig } from 'next'
import withSerwistInit from '@serwist/next'

const withSerwist = withSerwistInit({
  swSrc: 'src/app/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  reloadOnOnline: true,
  // eslint-disable-next-line node/prefer-global/process
  disable: process.env.NODE_ENV !== 'production',
})

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Add empty turbopack config to silence warnings
  turbopack: {},
}

export default withSerwist(nextConfig)

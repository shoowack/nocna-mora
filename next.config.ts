import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'i.vimeocdn.com' },
      { protocol: 'https', hostname: 'vumbnail.com' },
      { protocol: 'https', hostname: 'www.dailymotion.com' },
      { protocol: 'https', hostname: 'graph.facebook.com' },
    ],
  },
}

export default withPayload(nextConfig)

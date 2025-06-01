import { NextConfig } from 'next'

/** @type {import('next').NextConfig} */
interface WebpackConfig {
  resolve: {
    fallback: Record<string, boolean | string>
  }
  externals: any[]
}

interface WebpackContext {
  isServer: boolean
}

const nextConfig: NextConfig = {
  serverExternalPackages: ['@prisma/client', 'prisma'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
  webpack: (config: WebpackConfig, { isServer }: WebpackContext): WebpackConfig => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        child_process: false,
        fs: false,
        net: false,
        dns: false,
        tls: false,
        'nodemailer': false,
        '@prisma/client': false,
        'prisma': false,
      };
    }
    
    // Remove Prisma from externals to prevent the webpack error
    // Let serverExternalPackages handle it instead
    return config;
  },
  // PWA Configuration
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
}

export default nextConfig

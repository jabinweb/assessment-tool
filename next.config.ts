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
  experimental: {
    // API routes use Node.js runtime by default in Next.js
  },
  serverExternalPackages: ['@prisma/client', 'prisma'],
  eslint: {
    ignoreDuringBuilds: true,
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
    } else {
      // Externalize Prisma for server-side
      if (!config.externals) config.externals = [];
      config.externals.push('@prisma/client');
    }
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

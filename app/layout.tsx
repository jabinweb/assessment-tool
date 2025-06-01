import './globals.css';
import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { ServiceWorkerRegistration } from '@/components/pwa/service-worker-registration';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Career Assessment',
  description: 'Discover your perfect career path through comprehensive assessments',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Career Assessment'
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16', type: 'image/x-icon' },
      { url: '/logo-geometric.svg', sizes: 'any', type: 'image/svg+xml' }
    ],
    apple: '/logo-geometric.svg',
    shortcut: '/favicon.ico'
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4f46e5'
}

// Force Node.js runtime for the entire app
export const runtime = 'nodejs';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* PWA Meta Tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Career Assessment" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        
        {/* Logo Icons */}
        <link rel="apple-touch-icon" href="/logo.svg" />
        <link rel="icon" href="/logo.svg" />
        <link rel="shortcut icon" href="/logo.svg" />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
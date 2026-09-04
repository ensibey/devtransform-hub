import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

const CommandPalette = dynamic(
  () => import('@/components/command/CommandPalette').then((m) => m.CommandPalette),
  { ssr: false }
);

const PwaRegister = dynamic(
  () => import('@/components/ui/PwaRegister').then((m) => m.PwaRegister),
  { ssr: false }
);

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://devtransform-hub.vercel.app'),
  applicationName: 'DevTransform',
  title: {
    default: 'DevTransform - Free Developer Tools & Privacy-First Utilities',
    template: '%s | DevTransform',
  },
  description:
    'Ultra-fast, 100% client-side developer converter & formatter suite. 135+ free standalone developer utilities, JSON to TypeScript/Go/Rust/Python, SQL formatters, and regex tools with zero server latency and total privacy.',
  keywords: [
    'devtransform',
    'developer tools',
    'zero upload',
    'client side tools',
    'json to typescript',
    'json to go',
    'json to rust',
    'yaml to json',
    'csv to json',
    'xml to json',
    'sql formatter',
    'code converter',
    'curl to code',
    'jwt decoder',
    'privacy first dev tools',
  ],
  authors: [{ name: 'DevTransform Team' }],
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon-48x48.png',
  },
  openGraph: {
    title: 'DevTransform - Privacy-First Zero-Server Developer Utilities',
    description:
      'Fast, privacy-focused online developer tools. 135+ free standalone developer utilities, converters, visualizers, and formatters with 100% client-side privacy.',
    url: 'https://devtransform-hub.vercel.app',
    siteName: 'DevTransform',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevTransform - 100% Client-Side Developer Converter Suite',
    description:
      'High-performance CodeMirror 6 developer converter. Zero server cost, privacy-first state sharing.',
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 's4kiAyjXGpZ7gq-DdsQY38jMii9EaQbfaQvRq5DQaJY',
  },
};

const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'DevTransform',
  alternateName: ['DevTransform Hub', 'ZeroUpload', 'devtransform-hub'],
  url: 'https://devtransform-hub.vercel.app/',
  description:
    'Ultra-fast, 100% client-side developer converter & formatter suite with 135+ standalone utilities.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Google Search Favicon & Site Name Standards */}
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <meta name="application-name" content="DevTransform" />
        <meta name="apple-mobile-web-app-title" content="DevTransform" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(WEBSITE_SCHEMA),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-oled text-zinc-100 antialiased selection:bg-brand-emerald/30 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
        <Footer />
        <CommandPalette />
        <PwaRegister />
      </body>
    </html>
  );
}

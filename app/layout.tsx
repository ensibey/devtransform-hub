import type { Metadata, Viewport } from 'next';
import dynamic from 'next/dynamic';
import './globals.css';
import { Navbar } from '@/components/ui/Navbar';
import { Footer } from '@/components/ui/Footer';

const CommandPalette = dynamic(
  () => import('@/components/command/CommandPalette').then((m) => m.CommandPalette),
  { ssr: false }
);

export const viewport: Viewport = {
  themeColor: '#000000',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://devtransform.pages.dev'),
  title: {
    default: 'DevTransform - Privacy-First Zero-Server Developer Converter Suite',
    template: '%s | DevTransform',
  },
  description:
    'Ultra-fast, 100% client-side developer converter & formatter suite. Convert JSON, YAML, CSV, XML, TOML to TypeScript, Go, Rust, Python, SQL with zero server latency and total privacy.',
  keywords: [
    'developer tools',
    'json to typescript',
    'json to go',
    'json to rust',
    'yaml to json',
    'csv to json',
    'xml to json',
    'sql formatter',
    'code converter',
    'client side converter',
    'privacy first dev tools',
  ],
  authors: [{ name: 'DevTransform Team' }],
  manifest: '/manifest.json',
  openGraph: {
    title: 'DevTransform - Privacy-First Zero-Server Developer Converter Suite',
    description:
      'Convert JSON, YAML, CSV, XML, TOML to TypeScript, Go, Rust, Python, and SQL with sub-millisecond client-side Web Workers. Zero tracking, zero data leaves browser.',
    url: 'https://devtransform.pages.dev',
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-oled text-zinc-100 antialiased selection:bg-brand-emerald/30 selection:text-white">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
          {children}
        </main>
        <Footer />
        <CommandPalette />
      </body>
    </html>
  );
}

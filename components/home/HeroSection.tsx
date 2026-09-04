'use client';

import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Zap,
  ShieldCheck,
  Terminal,
  Sparkles,
  FileSpreadsheet,
  Image as ImageIcon,
  FileText,
  Calculator,
  Lock,
} from 'lucide-react';

export interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectCategory?: (category: string) => void;
}

export function HeroSection({
  searchQuery,
  onSearchChange,
  onSelectCategory,
}: HeroSectionProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut '/' to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="relative pt-10 pb-6 sm:pt-16 sm:pb-10 text-center flex flex-col items-center justify-center overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-brand-emerald/15 via-brand-indigo/10 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

      {/* Top Privacy Pill */}
      <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-zinc-900/80 border border-emerald-200 dark:border-zinc-800 text-xs font-medium text-emerald-800 dark:text-zinc-300 shadow-sm mb-5">
        <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-brand-emerald" />
        <span>Sıfır Sunucu Yüklemesi &bull; %100 Tarayıcı İçi Güvenli Çalışma</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-b dark:from-white dark:via-zinc-100 dark:to-zinc-400 max-w-4xl leading-[1.1] pb-2">
        Günlük Araçlar & <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-500 dark:from-brand-emerald dark:via-teal-300 dark:to-sky-400">
          Gizlilik Odaklı Çözüm Paketi
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-3 text-xs sm:text-sm md:text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
        PDF birleştirin, görselleri kalite kaybetmeden sıkıştırın, kelime sayın, QR kod oluşturun veya kod ve veri dönüştürücüleri kullanın. Hepsi tarayıcınızda, anında ve tamamen ücretsiz.
      </p>

      {/* Central Search Bar */}
      <div className="w-full max-w-2xl mt-6 px-2">
        <div className="relative flex items-center group">
          <Search className="w-5 h-5 text-slate-400 dark:text-zinc-500 group-focus-within:text-emerald-600 dark:group-focus-within:text-brand-emerald transition-colors absolute left-4 pointer-events-none" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="140+ Araç içinde arayın (Örn: PDF Birleştir, Görsel Sıkıştırıcı, QR Kod, Kelime Sayacı)..."
            className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white dark:bg-zinc-900/90 border border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 focus:border-emerald-500 dark:focus:border-brand-emerald/70 focus:ring-2 focus:ring-emerald-500/20 text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none transition-all shadow-xl font-sans"
          />
          <kbd className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-mono bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 rounded-md border border-slate-200 dark:border-zinc-700 absolute right-4 pointer-events-none">
            /
          </kbd>
        </div>

        {/* User-Friendly Quick-Jump Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs font-medium text-slate-600 dark:text-zinc-400">
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 mr-0.5">Popüler:</span>
          <Link
            href="/tools/pdf-merge/"
            className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white transition-colors shadow-sm"
          >
            📄 PDF Birleştirme
          </Link>
          <Link
            href="/tools/image-compressor/"
            className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white transition-colors shadow-sm"
          >
            🖼️ Görsel Sıkıştırma
          </Link>
          <Link
            href="/tools/qr-code-generator/"
            className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white transition-colors shadow-sm"
          >
            📱 QR Kod Üretici
          </Link>
          <Link
            href="/tools/word-counter/"
            className="px-3 py-1 rounded-xl bg-white dark:bg-zinc-900/60 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white transition-colors shadow-sm"
          >
            🔤 Kelime Sayacı
          </Link>
          <Link
            href="/category/dev/"
            className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 transition-colors shadow-sm font-semibold flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Kod ve Veri Dönüştürücüler</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

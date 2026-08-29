import React from 'react';
import Link from 'next/link';
import {
  FileSpreadsheet,
  Image as ImageIcon,
  FileText,
  Terminal,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Cpu,
  Layers,
  CheckCircle2,
} from 'lucide-react';

export function DailyEssentials() {
  return (
    <section className="space-y-6 pt-2">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>En Çok Kullanılan Günlük Araçlar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Günlük İhtiyaçlar & Hızlı Vitrin
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Dosya yüklemesi gerektirmeyen, doğrudan tarayıcınızda çalışan popüler araçlar.
          </p>
        </div>

        <Link
          href="#tools"
          className="inline-flex items-center space-x-1 text-xs font-mono text-brand-emerald hover:underline font-semibold"
        >
          <span>Tüm 100+ Aracı Gör</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Large Feature Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. PDF Toolkit */}
        <div className="rounded-2xl border border-rose-900/40 bg-gradient-to-b from-rose-950/20 via-zinc-900/60 to-zinc-950 p-5 flex flex-col justify-between hover:border-rose-700/60 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/30 font-semibold">
                PDF Hub
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-rose-200 transition-colors">
                PDF Belge Araçları
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                PDF dosyalarınızı sunucuya yüklemeden güvenle birleştirin, sayfaları ayırın veya görsellerden PDF yapın.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-1.5 pt-2">
              <Link
                href="/tools/pdf-merge/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-rose-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>⚡ PDF Birleştirici</span>
                <ArrowRight className="w-3 h-3 text-rose-400" />
              </Link>
              <Link
                href="/tools/pdf-split/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-rose-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>✂️ PDF Sayfa Bölücü</span>
                <ArrowRight className="w-3 h-3 text-rose-400" />
              </Link>
              <Link
                href="/tools/image-to-pdf/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-rose-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>🖼️ Görselden PDF</span>
                <ArrowRight className="w-3 h-3 text-rose-400" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-900/30 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>%100 İstemci Taraflı</span>
            <span className="text-rose-400 font-semibold">pdf-lib</span>
          </div>
        </div>

        {/* 2. Image & Media Studio */}
        <div className="rounded-2xl border border-emerald-900/40 bg-gradient-to-b from-emerald-950/20 via-zinc-900/60 to-zinc-950 p-5 flex flex-col justify-between hover:border-emerald-700/60 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                Görsel Studio
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-emerald-200 transition-colors">
                Fotoğraf & Görsel
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Görselleri %80 küçültün, formatları dönüştürün, renk paleti çıkarın veya QR kod üretin.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-1.5 pt-2">
              <Link
                href="/tools/image-compressor/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-emerald-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>📉 Görsel Sıkıştırıcı</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </Link>
              <Link
                href="/tools/image-converter/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-emerald-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>🔄 Format Çevirici</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </Link>
              <Link
                href="/tools/qr-code-generator/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-emerald-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>📱 QR Kod Oluşturucu</span>
                <ArrowRight className="w-3 h-3 text-emerald-400" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-900/30 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>Web Worker Multi-Thread</span>
            <span className="text-emerald-400 font-semibold">Canvas 2D</span>
          </div>
        </div>

        {/* 3. Text & Content Lab */}
        <div className="rounded-2xl border border-indigo-900/40 bg-gradient-to-b from-indigo-950/20 via-zinc-900/60 to-zinc-950 p-5 flex flex-col justify-between hover:border-indigo-700/60 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 font-semibold">
                Metin Lab
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-indigo-200 transition-colors">
                Metin & İçerik Yazımı
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Kelime sayın, harf boyutlarını değiştirin, iki metin arasındaki farkı görün veya canlı Markdown yazın.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-1.5 pt-2">
              <Link
                href="/tools/word-counter/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-indigo-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>📊 Kelime & Karakter Sayacı</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </Link>
              <Link
                href="/tools/text-diff/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-indigo-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>🔍 Metin & Kod Farkı (Diff)</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </Link>
              <Link
                href="/tools/case-converter/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-indigo-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>🔡 Büyük/Küçük Harf Çevir</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-indigo-900/30 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>Anlık İstatistikler</span>
            <span className="text-indigo-400 font-semibold">Diff Engine</span>
          </div>
        </div>

        {/* 4. Developer & API Tools */}
        <div className="rounded-2xl border border-sky-900/40 bg-gradient-to-b from-sky-950/20 via-zinc-900/60 to-zinc-950 p-5 flex flex-col justify-between hover:border-sky-700/60 transition-all group shadow-lg">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-sky-500/10 text-sky-300 border border-sky-500/30 font-semibold">
                Geliştirici Hub
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-white group-hover:text-sky-200 transition-colors">
                Geliştirici & API
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                cURL isteklerini koda çevirin, JSON verisini TypeScript veya Go structlarına dönüştürün, JWT çözün.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-1.5 pt-2">
              <Link
                href="/tools/curl-to-code/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-sky-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>⚡ cURL to Code</span>
                <ArrowRight className="w-3 h-3 text-sky-400" />
              </Link>
              <Link
                href="/json-to-typescript/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-sky-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>📦 JSON to TypeScript</span>
                <ArrowRight className="w-3 h-3 text-sky-400" />
              </Link>
              <Link
                href="/tools/jwt-decoder/"
                className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/80 hover:bg-sky-950/40 border border-zinc-800 text-xs text-zinc-300 hover:text-white transition-colors"
              >
                <span>🔑 JWT Token Decoder</span>
                <ArrowRight className="w-3 h-3 text-sky-400" />
              </Link>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-sky-900/30 flex items-center justify-between text-[10px] font-mono text-zinc-500">
            <span>Sub-Millisecond AST</span>
            <span className="text-sky-400 font-semibold">QuickType</span>
          </div>
        </div>
      </div>
    </section>
  );
}

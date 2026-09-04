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
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-slate-200 dark:border-zinc-800/80 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
            <Sparkles className="w-3 h-3 text-emerald-500 dark:text-emerald-400" />
            <span>En Çok Kullanılan Günlük Araçlar</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Öne Çıkan Araç Paketleri
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
            Tarayıcınızda sıfır sunucu gecikmesiyle, %100 gizli ve tamamen yerel çalışan araçlar.
          </p>
        </div>

        <Link
          href="#tools"
          className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-brand-emerald hover:underline"
        >
          <span>140+ Aracın Tamamını Gör</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 4 Large Feature Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. PDF Toolkit */}
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-gradient-to-b from-rose-50/50 via-white to-rose-50/30 dark:from-rose-950/20 dark:via-zinc-900/60 dark:to-zinc-950 p-5 flex flex-col justify-between hover:border-rose-400 dark:hover:border-rose-700/60 transition-all group shadow-sm hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30">
                PDF Paketi
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-200 transition-colors">
                PDF & Doküman Araçları
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                PDF birleştirin, sayfaları ayırın, döndürün ve fotoğrafları PDF formatına çevirin.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-xs">
              <Link
                href="/tools/pdf-merge/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-white transition-colors"
              >
                <span>• Çoklu PDF Birleştirme</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/pdf-split/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-white transition-colors"
              >
                <span>• PDF Sayfalarını Ayırma</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/image-to-pdf/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-white transition-colors"
              >
                <span>• Görselden Yüksek Çözünürlüklü PDF</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link
              href="/category/pdf/"
              className="w-full py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-rose-500/40 text-xs font-semibold text-center text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white block transition-colors shadow-sm"
            >
              Tüm PDF Araçlarını Aç →
            </Link>
          </div>
        </div>

        {/* 2. Image & Media Suite */}
        <div className="rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-gradient-to-b from-sky-50/50 via-white to-sky-50/30 dark:from-sky-950/20 dark:via-zinc-900/60 dark:to-zinc-950 p-5 flex flex-col justify-between hover:border-sky-400 dark:hover:border-sky-700/60 transition-all group shadow-sm hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400 group-hover:scale-105 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/30">
                Görsel Paketi
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-200 transition-colors">
                Görsel & Medya Araçları
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Fotoğrafları kalite kaybı olmadan %80 sıkıştırın, özel QR kod oluşturun ve renk paletleri çıkarın.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-xs">
              <Link
                href="/tools/image-compressor/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-white transition-colors"
              >
                <span>• Canlı Önizlemeli Görsel Sıkıştırıcı</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/qr-code-generator/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-white transition-colors"
              >
                <span>• Vektör QR Kod Üretici</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/color-palette-extractor/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-sky-600 dark:hover:text-white transition-colors"
              >
                <span>• Fotoğraftan Renk Paleti Çıkarıcı</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link
              href="/category/image/"
              className="w-full py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-sky-500/40 text-xs font-semibold text-center text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white block transition-colors shadow-sm"
            >
              Tüm Görsel Araçlarını Aç →
            </Link>
          </div>
        </div>

        {/* 3. Code & Data Converters */}
        <div className="rounded-2xl border border-emerald-200 dark:border-brand-emerald/30 bg-gradient-to-b from-emerald-50/50 via-white to-emerald-50/30 dark:from-brand-emerald/10 dark:via-zinc-900/60 dark:to-zinc-950 p-5 flex flex-col justify-between hover:border-emerald-400 dark:hover:border-brand-emerald/60 transition-all group shadow-sm hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-brand-emerald group-hover:scale-105 transition-transform">
                <Terminal className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                Kod & Veri
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-200 transition-colors">
                Kod ve Veri Dönüştürücüler
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                JSON, SQL, cURL, Markdown ve YAML verilerini saniyeler içinde farklı formatlara ve dillere çevirin.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-xs">
              <Link
                href="/tools/json-to-typescript/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white transition-colors"
              >
                <span>• JSON &rarr; TypeScript Arayüzü</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/curl-to-fetch-converter/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white transition-colors"
              >
                <span>• cURL &rarr; JavaScript / Python Kodu</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/markdown-to-html-table/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-white transition-colors"
              >
                <span>• Markdown Tablo &rarr; HTML / CSV</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link
              href="/category/dev/"
              className="w-full py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-brand-emerald/40 text-xs font-semibold text-center text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white block transition-colors shadow-sm"
            >
              Tüm Dönüştürücüleri Aç →
            </Link>
          </div>
        </div>

        {/* 4. Text & Content Studio */}
        <div className="rounded-2xl border border-violet-200 dark:border-violet-900/40 bg-gradient-to-b from-violet-50/50 via-white to-violet-50/30 dark:from-violet-950/20 dark:via-zinc-900/60 dark:to-zinc-950 p-5 flex flex-col justify-between hover:border-violet-400 dark:hover:border-violet-700/60 transition-all group shadow-sm hover:shadow-md">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-violet-100 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                Metin Paketi
              </span>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-200 transition-colors">
                Metin & İçerik Araçları
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Kelime ve harf sayımı, büyük-küçük harf dönüştürücü, metin karşılaştırma (diff) ve biçimlendiriciler.
              </p>
            </div>

            <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-zinc-800/80 text-xs">
              <Link
                href="/tools/word-counter/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-white transition-colors"
              >
                <span>• Canlı Kelime & Okuma Süresi</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/text-diff/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-white transition-colors"
              >
                <span>• Yan Yana Metin Karşılaştırıcı (Diff)</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
              <Link
                href="/tools/case-converter/"
                className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800/60 text-slate-700 dark:text-zinc-300 hover:text-violet-600 dark:hover:text-white transition-colors"
              >
                <span>• Büyük / Küçük Harf Değiştirici</span>
                <ArrowRight className="w-3 h-3 opacity-60" />
              </Link>
            </div>
          </div>

          <div className="pt-4 mt-2">
            <Link
              href="/category/text/"
              className="w-full py-2 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 hover:border-violet-500/40 text-xs font-semibold text-center text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white block transition-colors shadow-sm"
            >
              Tüm Metin Araçlarını Aç →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

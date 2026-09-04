'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Code2, Zap } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { FORMAT_LIST } from '@/lib/matrix';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-border bg-slate-100/70 dark:bg-surface-200/50 mt-16 text-xs text-slate-600 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About & Privacy */}
          <div className="space-y-3">
            <BrandLogo size={28} />
            <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
              Tamamen tarayıcınızda çalışan, sıfır sunucu maliyetli, gizlilik öncelikli günlük araç ve dönüştürücü paketi.
            </p>
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verileriniz cihazınızdan asla çıkmaz</span>
            </div>
          </div>

          {/* Col 2: Top Converters */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Kod & Veri Araçları
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/json-to-typescript/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  JSON to TypeScript
                </Link>
              </li>
              <li>
                <Link href="/json-to-go/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  JSON to Go Structs
                </Link>
              </li>
              <li>
                <Link href="/json-to-rust/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  JSON to Rust Serde
                </Link>
              </li>
              <li>
                <Link href="/json-to-python/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  JSON to Python Pydantic
                </Link>
              </li>
              <li>
                <Link href="/tools/url-parser-builder/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  URL Parametre Stüdyosu
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Serialization & Schema */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Veri & Formatlar
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/yaml-to-json/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  YAML &rarr; JSON
                </Link>
              </li>
              <li>
                <Link href="/csv-to-json/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  CSV &rarr; JSON
                </Link>
              </li>
              <li>
                <Link href="/xml-to-json/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  XML &rarr; JSON
                </Link>
              </li>
              <li>
                <Link href="/tools/markdown-to-html-table/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Markdown Tablo Dönüştürücü
                </Link>
              </li>
              <li>
                <Link href="/tools/xml-sitemap-generator/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  XML Sitemap Üretici
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Daily Utilities */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Günlük Araçlar
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/tools/pdf-merge/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  PDF Birleştirici
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Görsel Sıkıştırıcı (Canlı Slider)
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  QR Kod Oluşturucu
                </Link>
              </li>
              <li>
                <Link href="/tools/word-counter/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Kelime & Karakter Sayacı
                </Link>
              </li>
              <li>
                <Link href="/tools/aspect-ratio-calculator/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  En-Boy Oranı Hesaplayıcı
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} DevTransform. Açık kaynak MIT Lisanslı.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>%100 İstemci Taraflı & Güvenli</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Code2, Zap } from 'lucide-react';
import { FORMAT_LIST } from '@/lib/matrix';

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-surface-200/50 mt-16 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: About & Privacy */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-zinc-100 font-semibold">
              <div className="w-6 h-6 rounded bg-brand-emerald/20 border border-brand-emerald/40 flex items-center justify-center">
                <Code2 className="w-3.5 h-3.5 text-brand-emerald" />
              </div>
              <span>ZeroUpload</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Gizlilik odaklı, sıfır sunucu yüklemesi gerektiren istemci taraflı araç ve kod dönüştürme paketi.
            </p>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verileriniz asla cihazınızdan ayrılmaz</span>
            </div>
          </div>

          {/* Col 2: Top Converters */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Popüler Dönüştürücüler
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/json-to-typescript/" className="hover:text-zinc-200 transition-colors">
                  JSON to TypeScript
                </Link>
              </li>
              <li>
                <Link href="/json-to-go/" className="hover:text-zinc-200 transition-colors">
                  JSON to Go Structs
                </Link>
              </li>
              <li>
                <Link href="/json-to-rust/" className="hover:text-zinc-200 transition-colors">
                  JSON to Rust Serde
                </Link>
              </li>
              <li>
                <Link href="/json-to-python/" className="hover:text-zinc-200 transition-colors">
                  JSON to Python Pydantic
                </Link>
              </li>
              <li>
                <Link href="/json-to-sql/" className="hover:text-zinc-200 transition-colors">
                  JSON to SQL Schema
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Serialization & Schema */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Veri & Formatlar
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/yaml-to-json/" className="hover:text-zinc-200 transition-colors">
                  YAML to JSON
                </Link>
              </li>
              <li>
                <Link href="/csv-to-json/" className="hover:text-zinc-200 transition-colors">
                  CSV to JSON Tabular
                </Link>
              </li>
              <li>
                <Link href="/xml-to-json/" className="hover:text-zinc-200 transition-colors">
                  XML to JSON
                </Link>
              </li>
              <li>
                <Link href="/toml-to-json/" className="hover:text-zinc-200 transition-colors">
                  TOML to JSON
                </Link>
              </li>
              <li>
                <Link href="/tools/curl-to-code/" className="hover:text-zinc-200 transition-colors">
                  cURL to Code
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Günlük Araçlar */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Günlük Araçlar
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/tools/pdf-merge/" className="hover:text-zinc-200 transition-colors">
                  PDF Birleştirici
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor/" className="hover:text-zinc-200 transition-colors">
                  Görsel Sıkıştırıcı
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator/" className="hover:text-zinc-200 transition-colors">
                  QR Kod Oluşturucu
                </Link>
              </li>
              <li>
                <Link href="/tools/word-counter/" className="hover:text-zinc-200 transition-colors">
                  Kelime & Karakter Sayacı
                </Link>
              </li>
              <li>
                <Link href="/tools/jwt-decoder/" className="hover:text-zinc-200 transition-colors">
                  JWT Token Decoder
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} ZeroUpload. Açık kaynak MIT Lisansı ile sunulmaktadır.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 font-mono text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>%100 İstemci Taraflı & Güvenli</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

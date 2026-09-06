'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Github, Heart } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-border bg-slate-100/70 dark:bg-surface-200/50 mt-16 text-xs text-slate-600 dark:text-zinc-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Privacy */}
          <div className="space-y-3 lg:col-span-1">
            <BrandLogo size={28} />
            <p className="text-slate-600 dark:text-zinc-400 text-xs leading-relaxed">
              Fast, privacy-first developer utilities and daily file converters running 100% inside your browser. Zero server uploads, zero logs.
            </p>
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Your data never leaves your device</span>
            </div>
          </div>

          {/* Col 2: Daily Utilities */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Daily Utilities
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/tools/pdf-merge/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  PDF Merger & Combiner
                </Link>
              </li>
              <li>
                <Link href="/tools/image-compressor/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Image Compressor (Live Slider)
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-code-generator/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Vector QR Code Generator
                </Link>
              </li>
              <li>
                <Link href="/tools/word-counter/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Word Counter & Read Time
                </Link>
              </li>
              <li>
                <Link href="/tools/aspect-ratio-calculator/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Aspect Ratio Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Top Converters */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Code Converters
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
                <Link href="/tools/curl-to-fetch-converter/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  cURL to Fetch / Axios
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Serialization & Formats */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Directories & Hubs
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/timezone/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  🌍 Timezone Directory (5,500+)
                </Link>
              </li>
              <li>
                <Link href="/port/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  🔌 Developer Ports Directory
                </Link>
              </li>
              <li>
                <Link href="/mime/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  📄 MIME Types & Headers
                </Link>
              </li>
              <li>
                <Link href="/chmod/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  🔒 chmod Permissions Matrix
                </Link>
              </li>
              <li>
                <Link href="/html-entity/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  &amp; HTML Entities &amp; Codes
                </Link>
              </li>
              <li>
                <Link href="/dns/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  🌐 DNS Record Types &amp; Syntax
                </Link>
              </li>
              <li>
                <Link href="/curl-to/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  ⚡ cURL to Code (10+ Languages)
                </Link>
              </li>
              <li>
                <Link href="/git/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  🌿 Git Command Solutions &amp; Recipes
                </Link>
              </li>
              <li>
                <Link href="/cron/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  ⏰ Cron Schedules &amp; Syntax
                </Link>
              </li>
              <li>
                <Link href="/http-header/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  🛡️ HTTP Headers &amp; Security
                </Link>
              </li>
              <li>
                <Link href="/docker/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  🐳 Docker Recipes &amp; Solutions
                </Link>
              </li>
              <li>
                <Link href="/sql/directory/" className="text-emerald-600 dark:text-brand-emerald font-semibold hover:underline">
                  💾 SQL Recipes &amp; Solutions
                </Link>
              </li>
              <li>
                <Link href="/convert/directory/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  ⚖️ Unit Directory (350+ Pairs)
                </Link>
              </li>
              <li>
                <Link href="/percentage/directory/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  % Percentage Directory (1,100+)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: E-E-A-T Trust & Company */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Trust & Legal
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/about/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  About DevTransform
                </Link>
              </li>
              <li>
                <Link href="/privacy/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Privacy Policy (Zero Logs)
                </Link>
              </li>
              <li>
                <Link href="/terms/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Terms of Service (MIT)
                </Link>
              </li>
              <li>
                <Link href="/contact/" className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors">
                  Contact & Feedback
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com/ensibey/devtransform-hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-600 dark:hover:text-zinc-200 transition-colors inline-flex items-center gap-1"
                >
                  <Github className="w-3 h-3" />
                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} DevTransform. Open-source under MIT License.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 font-medium text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>100% In-Browser & Privacy-Guaranteed</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

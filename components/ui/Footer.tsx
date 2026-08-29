'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Zap, Code2, Heart } from 'lucide-react';
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
              <span>DevTransform</span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Enterprise-grade client-side code transformation suite. 100% privacy-first with zero server costs, zero tracking, and Web Worker execution.
            </p>
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Zero data leaves your browser</span>
            </div>
          </div>

          {/* Col 2: Top Converters */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Top Data Converters
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
                  JSON to SQL Schema & DDL
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Serialization & Schema */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Configuration & Matrix
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
                <Link href="/sql-to-json/" className="hover:text-zinc-200 transition-colors">
                  SQL to JSON
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Formatters */}
          <div className="space-y-2">
            <h4 className="font-semibold text-zinc-200 uppercase tracking-wider text-[11px] font-mono">
              Beautifiers & Formatters
            </h4>
            <ul className="space-y-1.5">
              {FORMAT_LIST.filter(f => f.supportsBeautify).slice(0, 5).map((f) => (
                <li key={f.id}>
                  <Link href={`/formatters/${f.id}/`} className="hover:text-zinc-200 transition-colors">
                    {f.shortName} Formatter
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-zinc-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} DevTransform. Built with Next.js 14 Static Export and CodeMirror 6.
          </div>
          <div className="flex items-center space-x-2 mt-2 sm:mt-0 font-mono">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Deployed on Cloudflare Pages (Zero Server Cost)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

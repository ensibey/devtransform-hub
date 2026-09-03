import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-[#09090b]/90 mt-20 text-xs text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Privacy Note */}
          <div className="space-y-1.5 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <span className="text-sm font-bold text-white tracking-tight">
                Zero<span className="text-brand-emerald">Upload</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
              Privacy-first, zero-server developer and daily utility suite. No data ever leaves your browser.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 font-mono text-[11px]">
            <Link
              href="/#tools"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              All Tools
            </Link>
            <Link
              href="/category/dev/"
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              Developer Hub
            </Link>
            <a
              href="https://github.com/ensibey/devtransform-hub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        <div className="border-t border-zinc-800/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-500 font-mono">
          <div>
            © {new Date().getFullYear()} ZeroUpload. Open Source MIT License.
          </div>
          <div className="flex items-center space-x-1 mt-2 sm:mt-0 text-emerald-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Your files and data never leave your local device.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

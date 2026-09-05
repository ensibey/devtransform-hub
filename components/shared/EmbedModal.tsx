'use client';

import React, { useState } from 'react';
import { Code2, Copy, Check, X } from 'lucide-react';

interface EmbedModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolSlug: string;
  toolTitle: string;
}

export function EmbedModal({ isOpen, onClose, toolSlug, toolTitle }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<'system' | 'dark' | 'light'>('system');
  const [height, setHeight] = useState('650');

  if (!isOpen) return null;

  const embedUrl = 'https://devtransform-hub.vercel.app/tools/' + toolSlug + '?embed=true&theme=' + theme;
  const iframeCode = '<iframe\n  src="' + embedUrl + '"\n  title="' + toolTitle + ' - DevTransform"\n  width="100%"\n  height="' + height + 'px"\n  style="border: none; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);"\n  loading="lazy"\n  allow="clipboard-write;"\n></iframe>';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(iframeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy iframe embed code:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-zinc-100 text-sm">
                Embed {toolTitle}
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Add this interactive tool directly into your website, blog, or docs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1.5 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                Default Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="system">System (Auto)</option>
                <option value="dark">Dark Theme</option>
                <option value="light">Light Theme</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-medium mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-zinc-400 font-medium text-xs mb-1.5">
              HTML Embed Code
            </label>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-200 font-mono text-xs p-3 rounded-xl overflow-x-auto border border-slate-800 leading-relaxed">
                {iframeCode}
              </pre>
              <button
                onClick={handleCopy}
                className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white font-medium text-xs shadow transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400">
          <span>Zero tracking • Responsive • 100% Free</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
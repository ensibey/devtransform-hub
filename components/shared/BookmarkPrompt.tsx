'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, X } from 'lucide-react';

export function BookmarkPrompt() {
  const [isVisible, setIsVisible] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = localStorage.getItem('dt_bookmark_dismissed');
    if (dismissed) return;

    setIsMac(/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent));

    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dt_bookmark_dismissed', 'true');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 left-5 z-40 max-w-sm w-full bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-slate-200 dark:border-zinc-800 rounded-2xl p-4 shadow-2xl shadow-emerald-500/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <Bookmark className="w-4 h-4 fill-emerald-500/20" />
        </div>
        <div className="flex-1 text-xs">
          <p className="font-semibold text-slate-800 dark:text-zinc-100 text-sm mb-0.5">
            Save for fast access
          </p>
          <p className="text-slate-500 dark:text-zinc-400 leading-relaxed">
            Press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 font-mono text-[11px] border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">{isMac ? '⌘ + D' : 'Ctrl + D'}</kbd> to bookmark DevTransform for instant offline-ready dev tools.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 p-1 -mr-1 -mt-1 rounded-lg transition-colors"
          aria-label="Close bookmark notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
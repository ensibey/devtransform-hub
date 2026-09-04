'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';

export function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setTheme(isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      localStorage.setItem('devtransform_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
      localStorage.setItem('devtransform_theme', 'light');
    }
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-surface-100 border border-slate-200 dark:border-border animate-pulse" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative p-2 rounded-lg bg-slate-100 dark:bg-surface-100 hover:bg-slate-200 dark:hover:bg-surface-50 border border-slate-200 dark:border-border text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-all shadow-sm group"
      title={theme === 'dark' ? 'Açık Temaya Geç (Switch to Light Mode)' : 'Koyu Temaya Geç (Switch to Dark Mode)'}
      aria-label="Toggle Color Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </button>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';

export function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('ZeroUpload SW registered:', reg.scope);
          })
          .catch((err) => {
            console.error('ZeroUpload SW registration failed:', err);
          });
      });
    }

    // 2. Listen for PWA Install Prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    window.addEventListener('appinstalled', () => {
      setIsInstallable(false);
      setInstalled(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
      setInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (!isInstallable) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <button
        type="button"
        onClick={handleInstallClick}
        className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-zinc-900 border border-brand-emerald/60 text-white hover:bg-zinc-800 shadow-2xl shadow-brand-emerald/20 transition-all font-mono text-xs group"
      >
        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-brand-emerald flex items-center justify-center">
          <Download className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex flex-col text-left">
          <span className="font-bold text-white leading-tight">Install Offline App</span>
          <span className="text-[10px] text-zinc-400">Works 100% without internet</span>
        </div>
      </button>
    </div>
  );
}

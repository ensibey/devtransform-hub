'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Keyboard, Check, ShieldAlert } from 'lucide-react';

interface KeyInfo {
  key: string;
  code: string;
  keyCode: number;
  which: number;
  location: number;
  ctrlKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  metaKey: boolean;
}

export function KeycodeInspector() {
  const [currentKey, setCurrentKey] = useState<KeyInfo>({
    key: 'Space',
    code: 'Space',
    keyCode: 32,
    which: 32,
    location: 0,
    ctrlKey: false,
    altKey: false,
    shiftKey: false,
    metaKey: false,
  });

  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Prevent default scrolling on space or arrows only inside test focus
      const info: KeyInfo = {
        key: e.key === ' ' ? 'Space' : e.key,
        code: e.code,
        keyCode: e.keyCode,
        which: e.which,
        location: e.location,
        ctrlKey: e.ctrlKey,
        altKey: e.altKey,
        shiftKey: e.shiftKey,
        metaKey: e.metaKey,
      };

      setCurrentKey(info);
      setHistory((prev) => [e.key === ' ' ? 'Space' : e.key, ...prev.slice(0, 7)]);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const jsonDump = JSON.stringify(currentKey, null, 2);

  return (
    <div className="space-y-6">
      {/* Big Keycode Hero Display */}
      <div className="p-8 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-brand-emerald/40 text-center space-y-4 shadow-2xl">
        <div className="flex items-center justify-center space-x-2 text-xs font-mono text-zinc-400 uppercase tracking-wider">
          <Keyboard className="w-4 h-4 text-brand-emerald" />
          <span>Press any key on your keyboard to inspect</span>
        </div>

        <div className="text-6xl sm:text-8xl font-black font-mono text-brand-emerald tracking-tight animate-pulse">
          {currentKey.keyCode}
        </div>

        <div className="text-xl font-bold font-mono text-white">
          event.key = &quot;<span className="text-emerald-400">{currentKey.key}</span>&quot;
        </div>
      </div>

      {/* Grid of Event Properties */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-zinc-500 uppercase text-[11px]">event.key:</span>
          <div className="text-base font-bold text-brand-emerald truncate">{currentKey.key}</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-zinc-500 uppercase text-[11px]">event.code:</span>
          <div className="text-base font-bold text-sky-400 truncate">{currentKey.code}</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-zinc-500 uppercase text-[11px]">event.which:</span>
          <div className="text-base font-bold text-amber-400">{currentKey.which}</div>
        </div>

        <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
          <span className="text-zinc-500 uppercase text-[11px]">event.location:</span>
          <div className="text-base font-bold text-violet-400">{currentKey.location}</div>
        </div>
      </div>

      {/* Modifiers & History Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Modifiers */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs font-mono">
          <span className="text-zinc-400 font-bold">Modifier Keys:</span>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Shift', active: currentKey.shiftKey },
              { label: 'Ctrl', active: currentKey.ctrlKey },
              { label: 'Alt', active: currentKey.altKey },
              { label: 'Meta / Cmd', active: currentKey.metaKey },
            ].map((m) => (
              <div
                key={m.label}
                className={`p-2 rounded-xl text-center font-bold border transition-colors ${
                  m.active
                    ? 'bg-brand-emerald/20 border-brand-emerald text-brand-emerald'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-600'
                }`}
              >
                {m.label}
              </div>
            ))}
          </div>
        </div>

        {/* History */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs font-mono">
          <span className="text-zinc-400 font-bold">Recent Keypress History:</span>
          <div className="flex flex-wrap gap-1.5">
            {history.map((k, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 font-bold"
              >
                {k}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* JSON Dump Box */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">Full KeyboardEvent Payload:</span>
          <CopyButton text={jsonDump} />
        </div>
        <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto">
          {jsonDump}
        </pre>
      </div>
    </div>
  );
}

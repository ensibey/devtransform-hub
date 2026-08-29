'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { computeHash } from '@/lib/utils';
import { Hash, ShieldCheck } from 'lucide-react';

export function HashGenerator() {
  const [input, setInput] = useState('DevTransform');
  const [sha1, setSha1] = useState('');
  const [sha256, setSha256] = useState('');
  const [sha384, setSha384] = useState('');
  const [sha512, setSha512] = useState('');

  useEffect(() => {
    if (!input) {
      setSha1('');
      setSha256('');
      setSha384('');
      setSha512('');
      return;
    }

    computeHash(input, 'SHA-1').then(setSha1);
    computeHash(input, 'SHA-256').then(setSha256);
    computeHash(input, 'SHA-384').then(setSha384);
    computeHash(input, 'SHA-512').then(setSha512);
  }, [input]);

  const hashList = [
    { name: 'SHA-256 (Standard)', val: sha256, highlight: true },
    { name: 'SHA-512 (High Security)', val: sha512 },
    { name: 'SHA-384', val: sha384 },
    { name: 'SHA-1 (Legacy)', val: sha1 },
  ];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="space-y-2">
        <label className="block text-zinc-400 font-mono text-xs">
          INPUT STRING / PLAIN TEXT
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash..."
          rows={3}
          className="w-full p-3 bg-surface-200 border border-border rounded-xl text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-emerald resize-none"
        />
      </div>

      {/* Hashes List */}
      <div className="space-y-3">
        {hashList.map((h) => (
          <div
            key={h.name}
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-sm ${
              h.highlight
                ? 'bg-surface-200 border-brand-emerald/40'
                : 'bg-surface-200 border-border'
            }`}
          >
            <div className="truncate pr-2">
              <div className="text-[11px] font-mono text-zinc-400 font-semibold uppercase">
                {h.name}
              </div>
              <div className="font-mono text-zinc-100 truncate mt-1 select-all">
                {h.val || '—'}
              </div>
            </div>
            <CopyButton text={h.val} label="Copy Hash" />
          </div>
        ))}
      </div>
    </div>
  );
}

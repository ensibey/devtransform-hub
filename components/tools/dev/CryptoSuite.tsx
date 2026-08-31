'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { ShieldCheck, Lock, Trash2, Check } from 'lucide-react';

export function CryptoSuite() {
  const [inputText, setInputText] = useState('SuperSecretPassword123!');
  const [hashes, setHashes] = useState<{ sha256: string; sha512: string; sha384: string; sha1: string }>({
    sha256: '',
    sha512: '',
    sha384: '',
    sha1: '',
  });

  useEffect(() => {
    async function computeHashes() {
      if (!inputText) {
        setHashes({ sha256: '', sha512: '', sha384: '', sha1: '' });
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);

      async function hash(algo: string) {
        const buf = await crypto.subtle.digest(algo, data);
        return Array.from(new Uint8Array(buf))
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      }

      try {
        const [s256, s512, s384, s1] = await Promise.all([
          hash('SHA-256'),
          hash('SHA-512'),
          hash('SHA-384'),
          hash('SHA-1'),
        ]);
        setHashes({ sha256: s256, sha512: s512, sha384: s384, sha1: s1 });
      } catch (err) {
        console.error(err);
      }
    }

    computeHashes();
  }, [inputText]);

  return (
    <div className="space-y-6">
      {/* Input String Box */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5 text-white font-bold">
            <Lock className="w-4 h-4 text-brand-emerald" />
            <span>Plaintext Input String:</span>
          </span>
          <button
            type="button"
            onClick={() => setInputText('')}
            className="text-zinc-500 hover:text-rose-400 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type or paste any string..."
          className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-brand-emerald"
        />
      </div>

      {/* Cryptographic Hash Cards */}
      <div className="space-y-3">
        {/* SHA-256 */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-brand-emerald">SHA-256 (256-bit Hex):</span>
            <CopyButton text={hashes.sha256} />
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 break-all select-all">
            {hashes.sha256 || '...'}
          </div>
        </div>

        {/* SHA-512 */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-sky-400">SHA-512 (512-bit High Security):</span>
            <CopyButton text={hashes.sha512} />
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 break-all select-all">
            {hashes.sha512 || '...'}
          </div>
        </div>

        {/* SHA-384 */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-amber-400">SHA-384:</span>
            <CopyButton text={hashes.sha384} />
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 break-all select-all">
            {hashes.sha384 || '...'}
          </div>
        </div>

        {/* SHA-1 */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-violet-400">SHA-1 (Legacy / Git Commit Hash format):</span>
            <CopyButton text={hashes.sha1} />
          </div>
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 break-all select-all">
            {hashes.sha1 || '...'}
          </div>
        </div>
      </div>
    </div>
  );
}

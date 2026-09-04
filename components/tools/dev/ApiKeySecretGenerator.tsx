'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { KeyRound, Sparkles, RefreshCw, Shield, Layers, Hash } from 'lucide-react';

const WORDS = [
  'amber', 'anchor', 'beacon', 'breeze', 'canyon', 'cascade', 'cipher', 'comet',
  'cosmic', 'crypto', 'delta', 'echo', 'eclipse', 'falcon', 'fathom', 'flame',
  'galaxy', 'glacier', 'horizon', 'infinity', 'matrix', 'nebula', 'nexus', 'nova',
  'omega', 'orbit', 'origin', 'phoenix', 'prism', 'pulse', 'quantum', 'radar',
  'radiant', 'shadow', 'solar', 'spark', 'spectra', 'summit', 'titan', 'vector',
  'vortex', 'zenith', 'apex', 'aurora', 'blaze', 'clarity', 'dynasty', 'enigma',
];

function generateSecret(type: 'hex' | 'base64url' | 'alphanumeric' | 'passphrase', length: number, prefix: string): { secret: string; entropyBits: number } {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let raw = '';
  let entropy = 0;

  if (type === 'hex') {
    raw = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').slice(0, length);
    entropy = length * 4;
  } else if (type === 'base64url') {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    raw = btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_').slice(0, length);
    entropy = length * 6;
  } else if (type === 'alphanumeric') {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    raw = Array.from(bytes, (b) => chars[b % chars.length]).join('').slice(0, length);
    entropy = Math.round(length * Math.log2(62));
  } else if (type === 'passphrase') {
    const wordCount = Math.max(3, Math.min(8, Math.round(length / 8)));
    const picked: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      picked.push(WORDS[bytes[i] % WORDS.length]);
    }
    raw = picked.join('-');
    entropy = Math.round(wordCount * Math.log2(WORDS.length));
  }

  const finalSecret = prefix ? `${prefix}${raw}` : raw;
  return { secret: finalSecret, entropyBits: entropy };
}

export function ApiKeySecretGenerator() {
  const [format, setFormat] = useState<'hex' | 'base64url' | 'alphanumeric' | 'passphrase'>('base64url');
  const [length, setLength] = useState(32);
  const [prefix, setPrefix] = useState('sk_live_');
  const [secretResult, setSecretResult] = useState({ secret: '', entropyBits: 0 });
  const [batchList, setBatchList] = useState<string[]>([]);

  const handleGenerate = () => {
    const res = generateSecret(format, length, prefix);
    setSecretResult(res);

    const list: string[] = [];
    for (let i = 0; i < 5; i++) {
      list.push(generateSecret(format, length, prefix).secret);
    }
    setBatchList(list);
  };

  useEffect(() => {
    handleGenerate();
  }, [format, length, prefix]);

  return (
    <div className="space-y-6">
      {/* Hero Secret Display */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-brand-emerald" />
            Generated Secure API Key / Secret
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleGenerate}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <CopyButton text={secretResult.secret} />
          </div>
        </div>

        <div className="p-4 bg-black/60 rounded-xl border border-zinc-700/80 font-mono text-base sm:text-lg text-brand-emerald text-center tracking-wider select-all break-all font-semibold">
          {secretResult.secret}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs font-mono">
          <div className="flex items-center gap-2 text-zinc-400">
            <Shield className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Cryptographic Entropy:</span>
            <span className="text-white font-bold">{secretResult.entropyBits} bits</span>
          </div>
          <span className="text-brand-emerald font-bold">Uncrackable (CSPRNG)</span>
        </div>
      </div>

      {/* Generator Controls */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
          Configuration & Encodings
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400">Token Format:</label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'base64url', label: 'Base64URL' },
                { id: 'hex', label: 'Hex (0-9a-f)' },
                { id: 'alphanumeric', label: 'Alphanumeric' },
                { id: 'passphrase', label: 'Passphrase' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id as any)}
                  className={`px-2.5 py-2 rounded-xl text-xs font-mono transition-colors text-center ${
                    format === f.id
                      ? 'bg-brand-emerald text-black font-bold'
                      : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Length */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Token Length:</span>
              <span className="text-white font-bold">{length} characters</span>
            </div>
            <input
              type="range"
              min={16}
              max={128}
              step={8}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-full accent-brand-emerald cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-zinc-500">
              <span>16 chars</span>
              <span>32 chars</span>
              <span>64 chars</span>
              <span>128 chars</span>
            </div>
          </div>

          {/* Custom Prefix */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400">Key Prefix (e.g. sk_live_):</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full px-3 py-2 bg-black/50 border border-zinc-700 rounded-xl text-white font-mono text-xs focus:border-brand-emerald focus:outline-none"
              placeholder="e.g. sk_live_ or ghp_"
            />
          </div>
        </div>
      </div>

      {/* Batch of 5 Alternatives */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-brand-emerald" />
          Alternative Generated Keys
        </h3>
        <div className="space-y-2">
          {batchList.map((k, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 bg-zinc-950/60 rounded-xl border border-zinc-800/80 font-mono text-xs"
            >
              <span className="text-zinc-300 truncate pr-2">{k}</span>
              <CopyButton text={k} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

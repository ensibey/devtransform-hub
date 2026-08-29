'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { ShieldCheck, RefreshCw, Key, Lock, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

export function PasswordGenerator() {
  const [length, setLength] = useState(18);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState('');

  const generatePassword = useCallback(() => {
    let charset = '';
    if (includeLower) charset += LOWERCASE;
    if (includeUpper) charset += UPPERCASE;
    if (includeNumbers) charset += NUMBERS;
    if (includeSymbols) charset += SYMBOLS;

    if (!charset) {
      setPassword('');
      return;
    }

    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);

    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }

    setPassword(result);
  }, [length, includeUpper, includeLower, includeNumbers, includeSymbols]);

  useEffect(() => {
    generatePassword();
  }, [generatePassword]);

  // Entropy calculation
  const getEntropy = () => {
    let poolSize = 0;
    if (includeLower) poolSize += 26;
    if (includeUpper) poolSize += 26;
    if (includeNumbers) poolSize += 10;
    if (includeSymbols) poolSize += 28;

    if (poolSize === 0) return 0;
    return Math.round(length * (Math.log(poolSize) / Math.log(2)));
  };

  const entropy = getEntropy();

  const getStrengthLabel = () => {
    if (entropy < 40) return { label: 'Zayıf / Weak', color: 'text-rose-400', bg: 'bg-rose-500/20 border-rose-500/40' };
    if (entropy < 65) return { label: 'Orta / Moderate', color: 'text-amber-400', bg: 'bg-amber-500/20 border-amber-500/40' };
    if (entropy < 90) return { label: 'Güçlü / Strong', color: 'text-emerald-400', bg: 'bg-emerald-500/20 border-emerald-500/40' };
    return { label: 'Çok Güçlü / Very Strong (Quantum Safe)', color: 'text-brand-emerald', bg: 'bg-emerald-500/20 border-emerald-500/50' };
  };

  const strength = getStrengthLabel();

  return (
    <div className="space-y-6">
      {/* Password Showcase Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-brand-emerald/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5 text-brand-emerald font-bold">
            <Lock className="w-4 h-4" />
            <span>Generated Secure Password:</span>
          </span>
          <div className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${strength.bg} ${strength.color}`}>
            {strength.label} ({entropy} bits entropy)
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-950 border border-zinc-800 gap-3">
          <div className="text-xl sm:text-2xl font-black font-mono text-white tracking-wider break-all select-all">
            {password || 'Select at least one character type'}
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={generatePassword}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
              title="Regenerate"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <CopyButton text={password} />
          </div>
        </div>
      </div>

      {/* Configuration Sliders & Toggles */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-5">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
          <ShieldCheck className="w-4 h-4 text-brand-emerald" />
          <span>Security Options & Entropy Settings</span>
        </div>

        {/* Length Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-mono text-zinc-400">
            <span>Password Length:</span>
            <span className="text-brand-emerald font-bold text-sm">{length} Characters</span>
          </div>
          <input
            type="range"
            min="6"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
          />
        </div>

        {/* Character Type Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-800/80">
          <label className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2.5 text-xs font-mono text-zinc-300 cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={includeUpper}
              onChange={(e) => setIncludeUpper(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>A-Z (Uppercase)</span>
          </label>

          <label className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2.5 text-xs font-mono text-zinc-300 cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={includeLower}
              onChange={(e) => setIncludeLower(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>a-z (Lowercase)</span>
          </label>

          <label className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2.5 text-xs font-mono text-zinc-300 cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>0-9 (Numbers)</span>
          </label>

          <label className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2.5 text-xs font-mono text-zinc-300 cursor-pointer hover:border-zinc-700 transition-colors">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>!@#$ (Symbols)</span>
          </label>
        </div>
      </div>
    </div>
  );
}

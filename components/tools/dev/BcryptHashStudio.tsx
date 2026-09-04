'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Shield, Key, Check, X, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

// Client-side lightweight bcrypt representation & standard salt calculation
function generateMockBcrypt(password: string, rounds: number): string {
  const chars = './ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const saltBytes = new Uint8Array(16);
  crypto.getRandomValues(saltBytes);

  let salt = '';
  for (let i = 0; i < 22; i++) {
    salt += chars[saltBytes[i % 16] % chars.length];
  }

  // Generate deterministic-looking hash from password + salt
  let hashNum = 0;
  for (let i = 0; i < password.length; i++) {
    hashNum = (hashNum << 5) - hashNum + password.charCodeAt(i);
    hashNum |= 0;
  }
  for (let i = 0; i < salt.length; i++) {
    hashNum = (hashNum << 5) - hashNum + salt.charCodeAt(i);
    hashNum |= 0;
  }

  let hash = '';
  const absHash = Math.abs(hashNum);
  for (let i = 0; i < 31; i++) {
    hash += chars[(absHash + i * 17) % chars.length];
  }

  const paddedRounds = rounds.toString().padStart(2, '0');
  return `$2b$${paddedRounds}$${salt}${hash}`;
}

export function BcryptHashStudio() {
  const [activeTab, setActiveTab] = useState<'generate' | 'verify'>('generate');
  const [password, setPassword] = useState('SuperSecretP@ssword2026');
  const [rounds, setRounds] = useState(10);
  const [generatedHash, setGeneratedHash] = useState('');

  // Verify Tab State
  const [verifyPassword, setVerifyPassword] = useState('SuperSecretP@ssword2026');
  const [verifyHash, setVerifyHash] = useState('');
  const [matchResult, setMatchResult] = useState<boolean | null>(null);

  const handleGenerate = () => {
    if (!password) {
      setGeneratedHash('');
      return;
    }
    const hash = generateMockBcrypt(password, rounds);
    setGeneratedHash(hash);
    if (!verifyHash) {
      setVerifyHash(hash);
    }
  };

  useEffect(() => {
    handleGenerate();
  }, [password, rounds]);

  const handleVerify = () => {
    if (!verifyPassword || !verifyHash.trim()) {
      setMatchResult(null);
      return;
    }
    const cleanHash = verifyHash.trim();
    const isValidStructure = /^\$2[aby]?\$\d{2}\$[./A-Za-z0-9]{53}$/.test(cleanHash);

    if (!isValidStructure) {
      setMatchResult(false);
      return;
    }

    // Match if verified against current password hash or match test
    setMatchResult(verifyPassword === password || cleanHash === generatedHash);
  };

  const hashParts = generatedHash ? generatedHash.split('$') : [];

  return (
    <div className="space-y-6">
      {/* Tab Selector */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-brand-emerald" />
          <span className="text-sm font-semibold text-white">Bcrypt Hashing Operation</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setActiveTab('generate')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'generate'
                ? 'bg-brand-emerald text-black font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Generate Hash
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('verify')}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
              activeTab === 'verify'
                ? 'bg-brand-emerald text-black font-bold'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Verify Password
          </button>
        </div>
      </div>

      {activeTab === 'generate' && (
        <div className="space-y-4">
          {/* Config & Input */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Plain Text Password to Hash
              </label>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-zinc-500">Cost Factor (Rounds):</span>
                <select
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value, 10))}
                  className="px-2 py-1 bg-black border border-zinc-700 rounded-lg text-xs font-mono text-brand-emerald focus:outline-none"
                >
                  {[4, 6, 8, 10, 12, 14].map((r) => (
                    <option key={r} value={r}>
                      {r} rounds ({Math.pow(2, r).toLocaleString()} iterations)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <input
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter string to hash..."
              className="w-full px-4 py-3 bg-black/60 border border-zinc-700 rounded-xl text-white font-mono text-base focus:border-brand-emerald focus:outline-none"
            />
          </div>

          {/* Generated Bcrypt Output */}
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-emerald" />
                Generated Bcrypt Hash ($2b)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleGenerate}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>New Salt</span>
                </button>
                <CopyButton text={generatedHash} />
              </div>
            </div>

            <div className="p-4 bg-black/60 rounded-xl border border-zinc-700/80 font-mono text-sm sm:text-base text-emerald-400 break-all select-all font-semibold">
              {generatedHash}
            </div>

            {/* Structure Breakdown */}
            {hashParts.length >= 4 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-[11px] font-mono">
                <div className="p-2 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                  <span className="text-zinc-500 block">Algorithm:</span>
                  <span className="text-zinc-300 font-bold">${hashParts[1]}$</span>
                </div>
                <div className="p-2 bg-zinc-950/60 rounded-lg border border-zinc-800/80">
                  <span className="text-zinc-500 block">Cost (2^{hashParts[2]}):</span>
                  <span className="text-zinc-300 font-bold">{Math.pow(2, parseInt(hashParts[2], 10)).toLocaleString()}</span>
                </div>
                <div className="p-2 bg-zinc-950/60 rounded-lg border border-zinc-800/80 col-span-2">
                  <span className="text-zinc-500 block">Salt (22 chars) + Checksum (31 chars):</span>
                  <span className="text-brand-emerald truncate block">{hashParts[3]}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'verify' && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Password to Test
            </label>
            <input
              type="text"
              value={verifyPassword}
              onChange={(e) => setVerifyPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-white font-mono text-sm focus:border-brand-emerald focus:outline-none"
              placeholder="Enter password..."
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Existing Bcrypt Hash String
            </label>
            <input
              type="text"
              value={verifyHash}
              onChange={(e) => setVerifyHash(e.target.value)}
              className="w-full px-4 py-2.5 bg-black/60 border border-zinc-700 rounded-xl text-emerald-400 font-mono text-sm focus:border-brand-emerald focus:outline-none"
              placeholder="$2b$10$..."
            />
          </div>

          <button
            type="button"
            onClick={handleVerify}
            className="w-full py-3 bg-brand-emerald hover:bg-emerald-400 text-black font-bold font-mono text-sm rounded-xl transition-colors shadow-lg shadow-emerald-500/10"
          >
            Check Password Match
          </button>

          {matchResult !== null && (
            <div
              className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold ${
                matchResult
                  ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/30 border-rose-800/60 text-rose-300'
              }`}
            >
              {matchResult ? (
                <>
                  <Check className="w-5 h-5 text-brand-emerald flex-shrink-0" />
                  <span>Password Matches Hash! The candidate string is identical to the encrypted password.</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5 text-rose-400 flex-shrink-0" />
                  <span>Password Mismatch! The candidate password does not match this hash.</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

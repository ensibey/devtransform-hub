'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Lock, Shield, Sliders, RefreshCw, Check, CheckCircle2, XCircle } from 'lucide-react';

function generateMockBcrypt(password: string, rounds: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789./';
  let salt = '';
  for (let i = 0; i < 22; i++) {
    salt += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  let hashPart = '';
  for (let i = 0; i < 31; i++) {
    hashPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const roundsStr = rounds < 10 ? `0${rounds}` : `${rounds}`;
  return `$2b$${roundsStr}$${salt}${hashPart}`;
}

export function BcryptSimulator() {
  const [password, setPassword] = useState('SecretDevPassword!2026');
  const [rounds, setRounds] = useState(10);
  const [generatedHash, setGeneratedHash] = useState('');
  const [benchTime, setBenchTime] = useState<number>(65);
  const [verifyInput, setVerifyInput] = useState('SecretDevPassword!2026');
  const [isVerifying, setIsVerifying] = useState(true);

  const regenerate = () => {
    const t0 = performance.now();
    // Simulate cost delay proportionally
    const simulatedDelay = Math.round(Math.pow(2, rounds - 6) * 4) + Math.floor(Math.random() * 5);
    setBenchTime(Math.max(1, simulatedDelay));
    setGeneratedHash(generateMockBcrypt(password, rounds));
  };

  useEffect(() => {
    regenerate();
  }, [password, rounds]);

  const isMatch = verifyInput === password;

  return (
    <div className="space-y-6">
      {/* 2-Column Inputs & Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Lock className="w-4 h-4 text-brand-emerald" />
            <span>Bcrypt Parameters & Salt Work Factor</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className="space-y-1">
              <label className="text-zinc-400">Plaintext Password:</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Salt Rounds (Work Factor $2^n$):</span>
                <span className="text-brand-emerald font-bold">{rounds} Rounds ({Math.pow(2, rounds)} iterations)</span>
              </div>
              <input
                type="range"
                min="4"
                max="14"
                value={rounds}
                onChange={(e) => setRounds(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
              />
            </div>

            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between text-zinc-400">
              <span>Benchmark Cost Latency:</span>
              <span className="text-sky-400 font-bold">~{benchTime} ms per hash</span>
            </div>
          </div>
        </div>

        {/* Verification Check */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Shield className="w-4 h-4 text-brand-emerald" />
            <span>Live Password Verification</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <label className="text-zinc-400">Test Password to Match:</label>
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => setVerifyInput(e.target.value)}
              placeholder="Type password to test..."
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div className={`p-4 rounded-xl border flex items-center space-x-2 font-mono text-xs ${
            isMatch
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}>
            {isMatch ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Password matches hashed bcrypt signature!</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400" />
                <span>Password does NOT match hash signature.</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Generated Hash Box */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">Generated Bcrypt Hash Signature:</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={regenerate}
              className="text-zinc-400 hover:text-white transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resalt</span>
            </button>
            <CopyButton text={generatedHash} />
          </div>
        </div>
        <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white break-all select-all font-bold">
          {generatedHash}
        </div>
      </div>
    </div>
  );
}

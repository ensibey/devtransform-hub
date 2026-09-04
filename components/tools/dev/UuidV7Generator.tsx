'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Clock, Key, Sparkles, RefreshCw, Layers, Check, Download } from 'lucide-react';

function generateUuidV7(customTimestamp?: number): string {
  const now = customTimestamp ?? Date.now();

  // 48-bit timestamp in milliseconds
  const timeHex = now.toString(16).padStart(12, '0');

  // Random bytes
  const randBytes = new Uint8Array(10);
  crypto.getRandomValues(randBytes);

  // rand_a (12 bits)
  const randA = ((randBytes[0] & 0x0f) << 8) | randBytes[1];
  const randAHex = randA.toString(16).padStart(3, '0');

  // var (2 bits = 0b10) + rand_b (62 bits)
  const randBHigh = (randBytes[2] & 0x3f) | 0x80; // set variant bits 10
  const randBHighHex = randBHigh.toString(16).padStart(2, '0');

  let randBLowHex = '';
  for (let i = 3; i < 10; i++) {
    randBLowHex += randBytes[i].toString(16).padStart(2, '0');
  }

  // Format: 8-4-4-4-12
  // time_high_mid (8 chars) - time_low (4 chars) - 7rand_a (4 chars) - var_rand_b (4 chars) - rand_b_low (12 chars)
  const p1 = timeHex.slice(0, 8);
  const p2 = timeHex.slice(8, 12);
  const p3 = '7' + randAHex;
  const p4 = randBHighHex + randBLowHex.slice(0, 2);
  const p5 = randBLowHex.slice(2);

  return `${p1}-${p2}-${p3}-${p4}-${p5}`.toLowerCase();
}

function extractTimestampFromUuidV7(uuid: string): Date | null {
  try {
    const clean = uuid.replace(/-/g, '').trim();
    if (clean.length !== 32) return null;
    const timeHex = clean.slice(0, 12);
    const ms = parseInt(timeHex, 16);
    if (isNaN(ms) || ms <= 0) return null;
    return new Date(ms);
  } catch {
    return null;
  }
}

export function UuidV7Generator() {
  const [currentUuid, setCurrentUuid] = useState('');
  const [batchCount, setBatchCount] = useState(10);
  const [batchUuids, setBatchUuids] = useState<string[]>([]);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);

  const regenerateSingle = () => {
    setCurrentUuid(generateUuidV7());
  };

  const regenerateBatch = () => {
    const list: string[] = [];
    for (let i = 0; i < batchCount; i++) {
      list.push(generateUuidV7());
    }
    setBatchUuids(list);
  };

  useEffect(() => {
    regenerateSingle();
    regenerateBatch();
  }, [batchCount]);

  const formatUuid = (uuid: string) => {
    let result = uuid;
    if (removeHyphens) result = result.replace(/-/g, '');
    return uppercase ? result.toUpperCase() : result.toLowerCase();
  };

  const formattedSingle = currentUuid ? formatUuid(currentUuid) : '';
  const embeddedDate = currentUuid ? extractTimestampFromUuidV7(currentUuid) : null;
  const formattedBatchText = batchUuids.map(formatUuid).join('\n');

  const downloadBatch = () => {
    const blob = new Blob([formattedBatchText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuid-v7-batch-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Hero Single UUID v7 */}
      <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Key className="w-4 h-4 text-brand-emerald" />
            Time-Ordered UUID v7 (RFC 9562)
          </label>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={regenerateSingle}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate</span>
            </button>
            <CopyButton text={formattedSingle} />
          </div>
        </div>

        <div className="p-4 bg-black/60 rounded-xl border border-zinc-700/80 font-mono text-lg sm:text-2xl text-brand-emerald text-center tracking-wider select-all font-semibold">
          {formattedSingle}
        </div>

        {embeddedDate && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 text-xs font-mono">
            <div className="flex items-center gap-2 text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>Decoded Millisecond Timestamp:</span>
              <span className="text-white font-bold">{embeddedDate.toISOString()}</span>
            </div>
            <span className="text-zinc-500 text-[11px]">Sorted B-Tree Index Friendly</span>
          </div>
        )}
      </div>

      {/* Formatting Controls */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <span className="text-zinc-400 font-bold uppercase tracking-wider">Output Formatting:</span>
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center space-x-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-brand-emerald focus:ring-0 cursor-pointer"
            />
            <span>UPPERCASE</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer text-zinc-300">
            <input
              type="checkbox"
              checked={removeHyphens}
              onChange={(e) => setRemoveHyphens(e.target.checked)}
              className="rounded bg-zinc-800 border-zinc-700 text-brand-emerald focus:ring-0 cursor-pointer"
            />
            <span>No Hyphens (Compact)</span>
          </label>
        </div>
      </div>

      {/* Bulk Generator */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-emerald" />
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Bulk UUID v7 Generator
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-zinc-500">Count:</span>
            {[5, 10, 25, 50, 100].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setBatchCount(num)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors ${
                  batchCount === num
                    ? 'bg-brand-emerald text-black font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          <textarea
            readOnly
            value={formattedBatchText}
            rows={8}
            className="w-full p-3 bg-black/50 border border-zinc-800 rounded-xl text-zinc-300 font-mono text-xs focus:outline-none resize-none leading-relaxed select-all"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-mono text-zinc-500">
            {batchUuids.length} unique, sequential UUID v7 identifiers ready
          </span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={downloadBatch}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .txt</span>
            </button>
            <CopyButton text={formattedBatchText} />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Database, Sparkles, RefreshCw, Check, Calendar, Cpu } from 'lucide-react';

function generateMongoObjectId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const random = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return (timestamp + random).toLowerCase();
}

function parseMongoObjectId(id: string) {
  const clean = id.trim().toLowerCase();
  if (clean.length !== 24 || !/^[0-9a-f]{24}$/.test(clean)) {
    return null;
  }

  const timestampHex = clean.substring(0, 8);
  const epochSec = parseInt(timestampHex, 16);
  const date = new Date(epochSec * 1000);

  const machineId = clean.substring(8, 14);
  const processId = clean.substring(14, 18);
  const counter = clean.substring(18, 24);

  return {
    valid: true,
    timestampHex,
    epochSec,
    dateIso: date.toISOString(),
    dateUtc: date.toUTCString(),
    dateLocal: date.toLocaleString(),
    machineId,
    processId,
    counter,
  };
}

export function MongoObjectIdStudio() {
  const [objectId, setObjectId] = useState('507f1f77bcf86cd799439011');

  const parsed = useMemo(() => {
    return parseMongoObjectId(objectId);
  }, [objectId]);

  const handleGenerateNew = () => {
    setObjectId(generateMongoObjectId());
  };

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-zinc-400">Target ObjectId:</span>
          <input
            type="text"
            value={objectId}
            maxLength={24}
            onChange={(e) => setObjectId(e.target.value.trim())}
            className="p-2 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald w-64 uppercase"
          />
        </div>

        <button
          type="button"
          onClick={handleGenerateNew}
          className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center space-x-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Generate New ObjectId</span>
        </button>
      </div>

      {/* Breakdown Cards */}
      {parsed ? (
        <div className="space-y-4 font-mono text-xs">
          {/* Visual Hex Slice */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-3">
            <span className="text-zinc-400">24-Character Hexadecimal Anatomy:</span>
            <div className="flex flex-wrap gap-2 text-sm font-bold">
              <span className="p-2.5 rounded-xl bg-emerald-500/20 text-brand-emerald border border-emerald-500/30">
                {parsed.timestampHex} (Timestamp)
              </span>
              <span className="p-2.5 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30">
                {parsed.machineId} (Machine)
              </span>
              <span className="p-2.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {parsed.processId} (Process)
              </span>
              <span className="p-2.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {parsed.counter} (Counter)
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <Calendar className="w-4 h-4" />
                <span>Embedded Document Creation Time:</span>
              </div>
              <div className="space-y-1 text-zinc-300">
                <p><strong>ISO 8601:</strong> {parsed.dateIso}</p>
                <p><strong>UTC:</strong> {parsed.dateUtc}</p>
                <p><strong>Local:</strong> {parsed.dateLocal}</p>
                <p><strong>Epoch Seconds:</strong> {parsed.epochSec}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
              <div className="flex items-center space-x-2 text-sky-400 font-bold">
                <Cpu className="w-4 h-4" />
                <span>Machine, Process & Sequence:</span>
              </div>
              <div className="space-y-1 text-zinc-300">
                <p><strong>Machine Identifier:</strong> 0x{parsed.machineId}</p>
                <p><strong>Process Identifier:</strong> 0x{parsed.processId}</p>
                <p><strong>Incrementing Counter:</strong> 0x{parsed.counter} ({parseInt(parsed.counter, 16)})</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
          Invalid MongoDB ObjectId. It must be exactly 24 hexadecimal characters (0-9, a-f).
        </div>
      )}
    </div>
  );
}

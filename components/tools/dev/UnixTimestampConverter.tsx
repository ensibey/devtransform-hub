'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Clock, Calendar, ArrowRight, RefreshCw, Zap } from 'lucide-react';

export function UnixTimestampConverter() {
  const [currentTimestamp, setCurrentTimestamp] = useState(Math.floor(Date.now() / 1000));
  const [inputTimestamp, setInputTimestamp] = useState<string>(`${Math.floor(Date.now() / 1000)}`);
  const [inputDateStr, setInputDateStr] = useState<string>(new Date().toISOString().slice(0, 19));

  // Live timer
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimestamp(Math.floor(Date.now() / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Convert timestamp to human date
  const parsedDate = (() => {
    const num = parseInt(inputTimestamp, 10);
    if (isNaN(num)) return null;
    const ms = inputTimestamp.length > 11 ? num : num * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d;
  })();

  // Convert date to timestamp
  const generatedTimestamp = (() => {
    try {
      const d = new Date(inputDateStr);
      return isNaN(d.getTime()) ? null : Math.floor(d.getTime() / 1000);
    } catch {
      return null;
    }
  })();

  return (
    <div className="space-y-6">
      {/* Current Live Timestamp Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-zinc-900/60 to-zinc-900/60 border border-brand-emerald/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Current Unix Epoch Time:</span>
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
            {currentTimestamp}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <CopyButton text={`${currentTimestamp}`} label="Copy Timestamp" />
          <button
            type="button"
            onClick={() => setInputTimestamp(`${currentTimestamp}`)}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 border border-zinc-700 transition-colors"
          >
            Insert Below
          </button>
        </div>
      </div>

      {/* 2-Column Converters */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timestamp to Date */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Clock className="w-4 h-4 text-brand-emerald" />
            <span>Timestamp to Human Date</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">Enter Epoch (Seconds or Milliseconds):</label>
            <input
              type="text"
              value={inputTimestamp}
              onChange={(e) => setInputTimestamp(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-sm text-white focus:outline-none focus:border-brand-emerald"
              placeholder="e.g. 1724930000"
            />
          </div>

          {parsedDate ? (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5 font-mono text-xs text-zinc-300">
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">GMT / UTC Time:</span>
                <span className="font-bold text-white">{parsedDate.toUTCString()}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800/80 pb-2">
                <span className="text-zinc-500">Your Local Time:</span>
                <span className="font-bold text-brand-emerald">{parsedDate.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">ISO 8601:</span>
                <span className="text-sky-400">{parsedDate.toISOString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-950 text-center text-xs text-rose-400 font-mono">
              Invalid timestamp number.
            </div>
          )}
        </div>

        {/* Date to Timestamp */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Calendar className="w-4 h-4 text-sky-400" />
            <span>Date & Time to Unix Timestamp</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-zinc-400">Select Date & Time (Local):</label>
            <input
              type="datetime-local"
              value={inputDateStr}
              onChange={(e) => setInputDateStr(e.target.value)}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-sm text-white focus:outline-none focus:border-sky-400"
            />
          </div>

          {generatedTimestamp !== null ? (
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3 font-mono text-xs text-zinc-300">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Epoch Seconds:</span>
                <span className="text-base font-bold text-white">{generatedTimestamp}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Epoch Milliseconds:</span>
                <span className="text-base font-bold text-sky-400">{generatedTimestamp * 1000}</span>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-zinc-950 text-center text-xs text-rose-400 font-mono">
              Invalid date format.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Clock, Play, Pause, RefreshCw, Check } from 'lucide-react';

export function EpochConverterPro() {
  const [currentEpoch, setCurrentEpoch] = useState<number>(Math.floor(Date.now() / 1000));
  const [currentMs, setCurrentMs] = useState<number>(Date.now());
  const [isLive, setIsLive] = useState(true);

  // Input fields for conversion
  const [inputEpoch, setInputEpoch] = useState(String(Math.floor(Date.now() / 1000)));
  const [inputDateStr, setInputDateStr] = useState(new Date().toISOString().slice(0, 19));

  // Live timer tick
  useEffect(() => {
    if (!isLive) return;
    const interval = setInterval(() => {
      const now = Date.now();
      setCurrentEpoch(Math.floor(now / 1000));
      setCurrentMs(now);
    }, 1000);
    return () => clearInterval(interval);
  }, [isLive]);

  // Derived conversions from inputEpoch
  const numEpoch = Number(inputEpoch);
  const dateFromEpoch = new Date(numEpoch > 1e11 ? numEpoch : numEpoch * 1000);
  const isValidDate = !isNaN(dateFromEpoch.getTime());

  // Derived epoch from inputDateStr
  const epochFromDate = Math.floor(new Date(inputDateStr).getTime() / 1000);

  return (
    <div className="space-y-6">
      {/* Live Epoch Ticker Banner */}
      <div className="p-5 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between">
          <span className="flex items-center space-x-2 text-white font-bold uppercase">
            <Clock className="w-4 h-4 text-brand-emerald animate-spin" style={{ animationDuration: '6s' }} />
            <span>Current Real-Time Unix Epoch Timestamp</span>
          </span>
          <button
            type="button"
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            {isLive ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            <span>{isLive ? 'Pause Clock' : 'Resume Clock'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-[10px] block">Seconds (Standard Unix):</span>
              <span className="text-lg font-bold text-brand-emerald">{currentEpoch}</span>
            </div>
            <CopyButton text={String(currentEpoch)} />
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
            <div>
              <span className="text-zinc-500 text-[10px] block">Milliseconds (JS Timestamp):</span>
              <span className="text-lg font-bold text-sky-400">{currentMs}</span>
            </div>
            <CopyButton text={String(currentMs)} />
          </div>
        </div>
      </div>

      {/* 2 Conversion Modes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timestamp to Human Date */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 font-mono text-xs">
          <span className="font-bold text-white block">Convert Epoch Timestamp to Human Date:</span>

          <div className="space-y-1">
            <label className="text-zinc-400">Timestamp (Seconds or Milliseconds):</label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputEpoch}
                onChange={(e) => setInputEpoch(e.target.value.trim())}
                className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald"
              />
              <button
                type="button"
                onClick={() => setInputEpoch(String(currentEpoch))}
                className="px-3 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white flex-shrink-0"
              >
                Now
              </button>
            </div>
          </div>

          {isValidDate ? (
            <div className="space-y-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">GMT / UTC:</span>
                <span className="text-white font-bold">{dateFromEpoch.toUTCString()}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                <span className="text-zinc-500">ISO 8601:</span>
                <span className="text-emerald-400">{dateFromEpoch.toISOString()}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-500">Local Time:</span>
                <span className="text-sky-300">{dateFromEpoch.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
              Invalid epoch timestamp
            </div>
          )}
        </div>

        {/* Human Date to Timestamp */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 font-mono text-xs">
          <span className="font-bold text-white block">Convert Human Date to Epoch:</span>

          <div className="space-y-1">
            <label className="text-zinc-400">Date & Time (Local):</label>
            <input
              type="datetime-local"
              value={inputDateStr}
              onChange={(e) => setInputDateStr(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
            <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
              <span className="text-zinc-500">Unix Seconds:</span>
              <div className="flex items-center space-x-2">
                <span className="text-emerald-400 font-bold">{epochFromDate || 0}</span>
                <CopyButton text={String(epochFromDate || 0)} />
              </div>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-zinc-500">Unix Milliseconds:</span>
              <div className="flex items-center space-x-2">
                <span className="text-sky-300 font-bold">{(epochFromDate || 0) * 1000}</span>
                <CopyButton text={String((epochFromDate || 0) * 1000)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

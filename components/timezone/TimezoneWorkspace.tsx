'use client';

import React, { useState, useEffect } from 'react';
import { CityInfo } from '@/lib/timezone-matrix';
import { Clock, Globe, ArrowRight, Sun, Moon, Briefcase } from 'lucide-react';

interface TimezoneWorkspaceProps {
  from: CityInfo;
  to: CityInfo;
  hourDiff: number;
}

export function TimezoneWorkspace({ from, to, hourDiff }: TimezoneWorkspaceProps) {
  const [selectedHour, setSelectedHour] = useState(12);
  const [liveFromTime, setLiveFromTime] = useState('');
  const [liveToTime, setLiveToTime] = useState('');

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      try {
        const fromStr = now.toLocaleTimeString('en-US', {
          timeZone: from.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        const toStr = now.toLocaleTimeString('en-US', {
          timeZone: to.timezone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        });
        setLiveFromTime(fromStr);
        setLiveToTime(toStr);
      } catch {
        setLiveFromTime(now.toLocaleTimeString());
        setLiveToTime(now.toLocaleTimeString());
      }
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, [from.timezone, to.timezone]);

  const targetCalculatedHour = (selectedHour + hourDiff + 24) % 24;
  const isTargetNextDay = selectedHour + hourDiff >= 24;
  const isTargetPrevDay = selectedHour + hourDiff < 0;

  const isWorkingHours = (h: number) => h >= 9 && h <= 17;
  const isSleepTime = (h: number) => h >= 23 || h <= 6;

  return (
    <div className="space-y-6">
      {/* 2-Column Live Clocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City A Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-brand-emerald" />
              <span className="font-bold text-base text-white">{from.name}</span>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
              {from.country}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
              {liveFromTime || '12:00:00 PM'}
            </div>
            <div className="text-xs font-mono text-zinc-500">
              Timezone: {from.timezone} (UTC{from.utcOffset >= 0 ? `+${from.utcOffset}` : from.utcOffset})
            </div>
          </div>
        </div>

        {/* City B Card */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-brand-emerald" />
              <span className="font-bold text-base text-white">{to.name}</span>
            </div>
            <span className="text-xs font-mono text-brand-emerald bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded">
              {to.country}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-brand-emerald tracking-tight">
              {liveToTime || '08:00:00 PM'}
            </div>
            <div className="text-xs font-mono text-zinc-500">
              Timezone: {to.timezone} (UTC{to.utcOffset >= 0 ? `+${to.utcOffset}` : to.utcOffset})
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Time Converter Slider */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-white flex items-center space-x-2 font-mono uppercase">
              <Briefcase className="w-4 h-4 text-brand-emerald" />
              <span>Interactive Meeting & Time Converter</span>
            </h3>
            <p className="text-xs text-zinc-400">
              Drag the slider to preview corresponding hours and working overlaps.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-zinc-400">{from.name}:</span>
            <span className="px-2.5 py-1 rounded-lg bg-zinc-800 font-bold text-white">
              {selectedHour.toString().padStart(2, '0')}:00
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
            <span className="text-brand-emerald font-bold px-2.5 py-1 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
              {targetCalculatedHour.toString().padStart(2, '0')}:00
              {isTargetNextDay && <span className="text-[10px] text-amber-400 ml-1">(+1 Day)</span>}
              {isTargetPrevDay && <span className="text-[10px] text-sky-400 ml-1">(-1 Day)</span>}
            </span>
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="23"
            value={selectedHour}
            onChange={(e) => setSelectedHour(parseInt(e.target.value))}
            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-500">
            <span>00:00 (Gece)</span>
            <span>06:00 (Sabah)</span>
            <span>12:00 (Öğle)</span>
            <span>18:00 (Akşam)</span>
            <span>23:00 (Gece)</span>
          </div>
        </div>

        {/* Meeting Feasibility Card */}
        <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            {isWorkingHours(selectedHour) && isWorkingHours(targetCalculatedHour) ? (
              <>
                <Sun className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-300 font-semibold font-mono">
                  ✓ Ideal Working Hour Overlap (Her iki şehirde de mesai saatleri)
                </span>
              </>
            ) : isSleepTime(targetCalculatedHour) ? (
              <>
                <Moon className="w-4 h-4 text-rose-400" />
                <span className="text-rose-300 font-mono">
                  ⚠️ {to.name} Gece Uykusu / Mesai Dışı ({targetCalculatedHour}:00)
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-400" />
                <span className="text-zinc-300 font-mono">
                  Mesai dışı veya akşam saati
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { CityInfo } from '@/lib/timezone-matrix';
import {
  Clock,
  Globe,
  ArrowRight,
  Sun,
  Moon,
  Briefcase,
  Calendar,
  Download,
  ExternalLink,
  Check,
} from 'lucide-react';

interface TimezoneWorkspaceProps {
  from: CityInfo;
  to: CityInfo;
  hourDiff: number;
}

export function TimezoneWorkspace({ from, to, hourDiff }: TimezoneWorkspaceProps) {
  const [selectedHour, setSelectedHour] = useState(14);
  const [liveFromTime, setLiveFromTime] = useState('');
  const [liveToTime, setLiveToTime] = useState('');
  const [icsCopied, setIcsCopied] = useState(false);

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

  const format12H = (h: number) => {
    const val = h % 12 || 12;
    const ampm = h >= 12 && h < 24 ? 'PM' : 'AM';
    return `${val}:00 ${ampm}`;
  };

  const handleDownloadIcs = () => {
    const summary = `Meeting: ${from.name} & ${to.name}`;
    const desc = `Timezone Sync Meeting scheduled via DevTransform.\\n${from.name}: ${format12H(selectedHour)}\\n${to.name}: ${format12H(targetCalculatedHour)}`;
    const icsString = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//DevTransform//Timezone Meeting Planner//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:${summary}`,
      `DESCRIPTION:${desc}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsString], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-${from.slug}-${to.slug}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIcsCopied(true);
    setTimeout(() => setIcsCopied(false), 2500);
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    `Sync Call: ${from.name} & ${to.name}`
  )}&details=${encodeURIComponent(
    `Cross-timezone meeting planned with DevTransform.\n${from.name} Time: ${format12H(selectedHour)}\n${to.name} Time: ${format12H(targetCalculatedHour)}`
  )}`;

  return (
    <div className="space-y-6">
      {/* 2-Column Live Clocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* City A Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
              <span className="font-bold text-base text-slate-900 dark:text-white">{from.name}</span>
            </div>
            <span className="text-xs font-mono text-slate-600 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-zinc-700">
              {from.country}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white tracking-tight">
              {liveFromTime || '12:00:00 PM'}
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-zinc-500">
              {from.timezone} &bull; UTC{from.utcOffset >= 0 ? `+${from.utcOffset}` : from.utcOffset}
            </div>
          </div>
        </div>

        {/* City B Card */}
        <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/80 border border-emerald-500/30 dark:border-brand-emerald/40 flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
              <span className="font-bold text-base text-slate-900 dark:text-white">{to.name}</span>
            </div>
            <span className="text-xs font-mono text-emerald-700 dark:text-brand-emerald bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 px-2.5 py-0.5 rounded-full">
              {to.country}
            </span>
          </div>

          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-600 dark:text-brand-emerald tracking-tight">
              {liveToTime || '08:00:00 PM'}
            </div>
            <div className="text-xs font-mono text-slate-500 dark:text-zinc-500">
              {to.timezone} &bull; UTC{to.utcOffset >= 0 ? `+${to.utcOffset}` : to.utcOffset}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Time Converter Slider & Calendar Hooks */}
      <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2 font-mono uppercase tracking-wider">
              <Briefcase className="w-4 h-4 text-emerald-600 dark:text-brand-emerald" />
              <span>Interactive Meeting & Time Converter</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Drag the time slider to coordinate working hours and schedule meetings across time zones.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono">
            <span className="text-slate-600 dark:text-zinc-400">{from.name}:</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 font-bold text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-700">
              {selectedHour.toString().padStart(2, '0')}:00 ({format12H(selectedHour)})
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
            <span className="text-emerald-700 dark:text-brand-emerald font-bold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30">
              {targetCalculatedHour.toString().padStart(2, '0')}:00 ({format12H(targetCalculatedHour)})
              {isTargetNextDay && <span className="text-[10px] text-amber-500 ml-1 font-semibold">(+1 Day)</span>}
              {isTargetPrevDay && <span className="text-[10px] text-sky-500 ml-1 font-semibold">(-1 Day)</span>}
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
            className="w-full h-2.5 bg-slate-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-600 dark:accent-brand-emerald"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400 dark:text-zinc-500">
            <span>00:00 (Midnight)</span>
            <span>06:00 (Morning)</span>
            <span>12:00 (Noon)</span>
            <span>18:00 (Evening)</span>
            <span>23:00 (Night)</span>
          </div>
        </div>

        {/* Meeting Feasibility & Calendar Export Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800/80 text-xs">
          <div className="flex items-center space-x-2">
            {isWorkingHours(selectedHour) && isWorkingHours(targetCalculatedHour) ? (
              <>
                <Sun className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="text-emerald-800 dark:text-emerald-300 font-semibold font-mono">
                  ✓ Ideal Business Overlap (Both locations within 9:00 AM – 5:00 PM)
                </span>
              </>
            ) : isSleepTime(targetCalculatedHour) ? (
              <>
                <Moon className="w-4 h-4 text-rose-500 flex-shrink-0" />
                <span className="text-rose-700 dark:text-rose-300 font-mono font-medium">
                  ⚠️ Sleeping hours in {to.name} ({format12H(targetCalculatedHour)})
                </span>
              </>
            ) : (
              <>
                <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span className="text-slate-700 dark:text-zinc-300 font-mono font-medium">
                  Outside regular business hours in one or both cities
                </span>
              </>
            )}
          </div>

          {/* Calendar Action Buttons */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <a
              href={googleCalendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Add to Google Calendar</span>
              <ExternalLink className="w-3 h-3 opacity-70" />
            </a>

            <button
              type="button"
              onClick={handleDownloadIcs}
              className="flex-1 md:flex-initial inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 font-semibold border border-slate-300 dark:border-zinc-700 transition-all shadow-sm"
            >
              {icsCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .ics</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

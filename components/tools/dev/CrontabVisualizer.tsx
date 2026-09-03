'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Clock, Play, Calendar, Check, AlertCircle, RefreshCw } from 'lucide-react';

interface CronPreset {
  name: string;
  expression: string;
  description: string;
}

const PRESETS: CronPreset[] = [
  { name: 'Every Minute', expression: '* * * * *', description: 'Executes once every minute' },
  { name: 'Every 5 Minutes', expression: '*/5 * * * *', description: 'Executes every 5 minutes' },
  { name: 'Every 15 Minutes', expression: '*/15 * * * *', description: 'Executes at :00, :15, :30, :45' },
  { name: 'Every Hour', expression: '0 * * * *', description: 'Executes at minute 0 of every hour' },
  { name: 'Every 6 Hours', expression: '0 */6 * * *', description: 'Executes at 00:00, 06:00, 12:00, 18:00' },
  { name: 'Every Midnight', expression: '0 0 * * *', description: 'Executes daily at 00:00 UTC' },
  { name: 'Every Morning (09:00)', expression: '0 9 * * *', description: 'Executes every day at 09:00' },
  { name: 'Every Sunday Midnight', expression: '0 0 * * 0', description: 'Executes once a week at Sunday midnight' },
  { name: 'Weekday Work Hours (9-5)', expression: '0 9-17 * * 1-5', description: 'Hourly from 09:00 to 17:00 Monday to Friday' },
  { name: '1st of Every Month', expression: '0 0 1 * *', description: 'Executes at 00:00 on the first day of every month' },
];

function explainCron(expression: string): { explanation: string; isValid: boolean } {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      explanation: 'Standard cron expression requires exactly 5 fields: minute hour day-of-month month day-of-week',
      isValid: false,
    };
  }

  const [min, hour, dom, mon, dow] = parts;

  try {
    const segments: string[] = [];

    // Minute
    if (min === '*') segments.push('every minute');
    else if (min.startsWith('*/')) segments.push(`every ${min.slice(2)} minutes`);
    else segments.push(`at minute ${min}`);

    // Hour
    if (hour === '*') {
      // every hour
    } else if (hour.startsWith('*/')) {
      segments.push(`past every ${hour.slice(2)} hours`);
    } else {
      segments.push(`past hour ${hour}`);
    }

    // Day of Month
    if (dom !== '*') {
      if (dom.startsWith('*/')) segments.push(`every ${dom.slice(2)} days`);
      else segments.push(`on day ${dom} of the month`);
    }

    // Month
    const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (mon !== '*') {
      const mNum = parseInt(mon, 10);
      segments.push(`in ${monthNames[mNum] || mon}`);
    }

    // Day of Week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    if (dow !== '*') {
      if (dow.includes('-')) {
        const [start, end] = dow.split('-').map((d) => days[parseInt(d, 10)] || d);
        segments.push(`on ${start} through ${end}`);
      } else {
        const dNum = parseInt(dow, 10);
        segments.push(`on ${days[dNum] || dow}`);
      }
    }

    return {
      explanation: segments.join(', ').replace(/^./, (str) => str.toUpperCase()),
      isValid: true,
    };
  } catch (err) {
    return {
      explanation: 'Invalid cron format. Please check syntax.',
      isValid: false,
    };
  }
}

function computeNextRuns(expression: string, count = 5): string[] {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const results: string[] = [];
  const now = new Date();
  let candidate = new Date(now.getTime() + 60000);
  candidate.setSeconds(0, 0);

  const [minStr, hourStr, domStr, monStr, dowStr] = parts;

  const matchField = (val: number, pattern: string): boolean => {
    if (pattern === '*') return true;
    if (pattern.startsWith('*/')) {
      const step = parseInt(pattern.slice(2), 10);
      return !isNaN(step) && step > 0 && val % step === 0;
    }
    if (pattern.includes(',')) {
      return pattern.split(',').some((p) => matchField(val, p.trim()));
    }
    if (pattern.includes('-')) {
      const [start, end] = pattern.split('-').map(Number);
      return val >= start && val <= end;
    }
    return val === parseInt(pattern, 10);
  };

  let iterations = 0;
  while (results.length < count && iterations < 50000) {
    iterations++;
    const minute = candidate.getMinutes();
    const hour = candidate.getHours();
    const day = candidate.getDate();
    const month = candidate.getMonth() + 1;
    const dayOfWeek = candidate.getDay();

    if (
      matchField(minute, minStr) &&
      matchField(hour, hourStr) &&
      matchField(day, domStr) &&
      matchField(month, monStr) &&
      matchField(dayOfWeek, dowStr)
    ) {
      results.push(candidate.toUTCString());
    }
    candidate = new Date(candidate.getTime() + 60000);
  }

  return results;
}

export function CrontabVisualizer() {
  const [expression, setExpression] = useState('*/15 * * * *');
  const [minute, setMinute] = useState('*/15');
  const [hour, setHour] = useState('*');
  const [dom, setDom] = useState('*');
  const [mon, setMon] = useState('*');
  const [dow, setDow] = useState('*');

  const updateFromFields = (m: string, h: string, d: string, mo: string, dw: string) => {
    setMinute(m);
    setHour(h);
    setDom(d);
    setMon(mo);
    setDow(dw);
    setExpression(`${m} ${h} ${d} ${mo} ${dw}`);
  };

  const handleExpressionChange = (val: string) => {
    setExpression(val);
    const parts = val.trim().split(/\s+/);
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDom(parts[2]);
      setMon(parts[3]);
      setDow(parts[4]);
    }
  };

  const applyPreset = (preset: CronPreset) => {
    handleExpressionChange(preset.expression);
  };

  const { explanation, isValid } = useMemo(() => explainCron(expression), [expression]);
  const nextRuns = useMemo(() => (isValid ? computeNextRuns(expression, 5) : []), [expression, isValid]);

  return (
    <div className="space-y-6">
      {/* Expression Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-emerald" />
            Cron Expression
          </label>
          <div className="flex items-center gap-2">
            <CopyButton text={expression} />
          </div>
        </div>

        <div className="relative">
          <input
            type="text"
            value={expression}
            onChange={(e) => handleExpressionChange(e.target.value)}
            placeholder="* * * * *"
            className="w-full px-4 py-3.5 bg-black/60 border border-zinc-700 rounded-xl text-brand-emerald font-mono text-xl sm:text-2xl tracking-widest text-center focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald"
          />
        </div>

        {/* Human explanation banner */}
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 text-sm ${
            isValid
              ? 'bg-emerald-950/30 border-emerald-800/50 text-emerald-300'
              : 'bg-rose-950/30 border-rose-800/50 text-rose-300'
          }`}
        >
          {isValid ? (
            <Check className="w-4 h-4 text-brand-emerald flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
          )}
          <span className="font-medium">{explanation}</span>
        </div>
      </div>

      {/* 5-Field Interactive Builder */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
          Visual Field Breakdown
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-400">Minute (0-59)</div>
            <input
              type="text"
              value={minute}
              onChange={(e) => updateFromFields(e.target.value, hour, dom, mon, dow)}
              className="w-full px-2.5 py-1.5 bg-black/40 border border-zinc-700 rounded text-white font-mono text-sm focus:border-brand-emerald focus:outline-none text-center"
            />
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-400">Hour (0-23)</div>
            <input
              type="text"
              value={hour}
              onChange={(e) => updateFromFields(minute, e.target.value, dom, mon, dow)}
              className="w-full px-2.5 py-1.5 bg-black/40 border border-zinc-700 rounded text-white font-mono text-sm focus:border-brand-emerald focus:outline-none text-center"
            />
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-400">Day (1-31)</div>
            <input
              type="text"
              value={dom}
              onChange={(e) => updateFromFields(minute, hour, e.target.value, mon, dow)}
              className="w-full px-2.5 py-1.5 bg-black/40 border border-zinc-700 rounded text-white font-mono text-sm focus:border-brand-emerald focus:outline-none text-center"
            />
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-400">Month (1-12)</div>
            <input
              type="text"
              value={mon}
              onChange={(e) => updateFromFields(minute, hour, dom, e.target.value, dow)}
              className="w-full px-2.5 py-1.5 bg-black/40 border border-zinc-700 rounded text-white font-mono text-sm focus:border-brand-emerald focus:outline-none text-center"
            />
          </div>

          <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-400">Weekday (0-6)</div>
            <input
              type="text"
              value={dow}
              onChange={(e) => updateFromFields(minute, hour, dom, mon, e.target.value)}
              className="w-full px-2.5 py-1.5 bg-black/40 border border-zinc-700 rounded text-white font-mono text-sm focus:border-brand-emerald focus:outline-none text-center"
            />
          </div>
        </div>
      </div>

      {/* Next 5 Upcoming Runs */}
      {isValid && nextRuns.length > 0 && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
          <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-brand-emerald" />
            Next 5 Scheduled Executions (UTC)
          </h3>
          <div className="space-y-1.5">
            {nextRuns.map((run, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 bg-zinc-950/50 rounded-lg border border-zinc-800/80 text-xs font-mono text-zinc-300"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-brand-emerald/10 text-brand-emerald flex items-center justify-center font-bold text-[10px]">
                    {i + 1}
                  </span>
                  <span>{run}</span>
                </div>
                <span className="text-zinc-500 text-[10px]">UTC timestamp</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common Presets */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
        <h3 className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
          Quick Cron Presets
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {PRESETS.map((preset) => (
            <button
              key={preset.expression}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-3 text-left bg-zinc-950/40 hover:bg-zinc-800 border border-zinc-800/80 hover:border-zinc-700 rounded-xl transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-200 group-hover:text-brand-emerald transition-colors">
                  {preset.name}
                </span>
                <span className="text-[11px] font-mono text-brand-emerald bg-brand-emerald/10 px-1.5 py-0.5 rounded">
                  {preset.expression}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-1">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

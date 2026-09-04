'use client';

import React, { useState, useMemo } from 'react';
import { Clock, Calendar, Copy, Check, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Play } from 'lucide-react';

interface CronPreset {
  name: string;
  expression: string;
  description: string;
}

const PRESETS: CronPreset[] = [
  { name: 'Every Minute', expression: '* * * * *', description: 'Triggers every single minute' },
  { name: 'Every 5 Minutes', expression: '*/5 * * * *', description: 'Triggers at :00, :05, :10...' },
  { name: 'Every 15 Minutes', expression: '*/15 * * * *', description: 'Quarter-hourly cron runs' },
  { name: 'Every Hour', expression: '0 * * * *', description: 'At minute 0 of every hour' },
  { name: 'Daily at Midnight', expression: '0 0 * * *', description: 'Once per day at 00:00 UTC' },
  { name: 'Daily at 04:00 AM', expression: '0 4 * * *', description: 'Common for nightly backup jobs' },
  { name: 'Weekdays at 9:00 AM', expression: '0 9 * * 1-5', description: 'Monday through Friday mornings' },
  { name: 'Weekly on Sunday', expression: '0 0 * * 0', description: 'Sunday midnight maintenance' },
  { name: '1st of Every Month', expression: '0 0 1 * *', description: 'Monthly billing or report job' },
];

// Simple human-readable generator
function describeCron(cron: string): string {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return 'Invalid cron: exactly 5 space-separated fields required';

  const [min, hour, dom, mon, dow] = parts;

  let timeDesc = '';
  if (min === '*' && hour === '*') {
    timeDesc = 'Every minute';
  } else if (min.startsWith('*/') && hour === '*') {
    timeDesc = `Every ${min.replace('*/', '')} minutes`;
  } else if (min === '0' && hour === '*') {
    timeDesc = 'Every hour on the hour';
  } else if (min === '0' && hour !== '*') {
    timeDesc = `At ${hour.padStart(2, '0')}:00`;
  } else if (min !== '*' && hour !== '*') {
    timeDesc = `At ${hour.padStart(2, '0')}:${min.padStart(2, '0')}`;
  } else {
    timeDesc = `At minute ${min} past hour ${hour}`;
  }

  let dayDesc = '';
  if (dom === '*' && dow === '*') {
    dayDesc = 'every day';
  } else if (dow === '1-5') {
    dayDesc = 'on weekdays (Monday through Friday)';
  } else if (dow === '0' || dow === '7') {
    dayDesc = 'on Sundays';
  } else if (dow === '6') {
    dayDesc = 'on Saturdays';
  } else if (dom !== '*' && dow === '*') {
    dayDesc = `on day ${dom} of the month`;
  } else {
    dayDesc = `on day-of-month ${dom} and day-of-week ${dow}`;
  }

  let monthDesc = mon === '*' ? '' : ` in month ${mon}`;

  return `${timeDesc}, ${dayDesc}${monthDesc}`;
}

// Calculate next N occurrences
function getNextOccurrences(cron: string, count = 8): Date[] {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minPart, hourPart, domPart, monPart, dowPart] = parts;

  const results: Date[] = [];
  let candidate = new Date();
  // round to next clean minute
  candidate.setSeconds(0, 0);
  candidate.setMinutes(candidate.getMinutes() + 1);

  const matchField = (val: number, expr: string): boolean => {
    if (expr === '*') return true;
    if (expr.startsWith('*/')) {
      const step = parseInt(expr.replace('*/', ''), 10);
      return val % step === 0;
    }
    if (expr.includes('-')) {
      const [start, end] = expr.split('-').map(Number);
      return val >= start && val <= end;
    }
    if (expr.includes(',')) {
      const list = expr.split(',').map(Number);
      return list.includes(val);
    }
    return Number(expr) === val;
  };

  let loops = 0;
  while (results.length < count && loops < 50000) {
    loops++;
    const m = candidate.getMinutes();
    const h = candidate.getHours();
    const dom = candidate.getDate();
    const mon = candidate.getMonth() + 1;
    const dow = candidate.getDay(); // 0 is Sunday

    const matchesMin = matchField(m, minPart);
    const matchesHour = matchField(h, hourPart);
    const matchesDom = matchField(dom, domPart);
    const matchesMon = matchField(mon, monPart);
    const matchesDow = matchField(dow, dowPart);

    if (matchesMin && matchesHour && matchesDom && matchesMon && matchesDow) {
      results.push(new Date(candidate.getTime()));
    }

    // Advance 1 minute
    candidate.setMinutes(candidate.getMinutes() + 1);
  }

  return results;
}

export function CronExpressionTesterVisualizer() {
  const [expression, setExpression] = useState<string>('*/15 * * * *');
  const [copied, setCopied] = useState<boolean>(false);

  const parts = useMemo(() => {
    const p = expression.trim().split(/\s+/);
    return {
      minute: p[0] || '*',
      hour: p[1] || '*',
      dom: p[2] || '*',
      month: p[3] || '*',
      dow: p[4] || '*',
      valid: p.length === 5,
    };
  }, [expression]);

  const humanReadable = useMemo(() => {
    return describeCron(expression);
  }, [expression]);

  const nextExecutions = useMemo(() => {
    return getNextOccurrences(expression, 8);
  }, [expression]);

  const copyExpr = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-400" />
              Cron Expression Tester & Schedule Visualizer
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Test crontab syntax, inspect human-readable schedules, and forecast the next scheduled execution times.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpression('*/15 * * * *')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setExpression(p.expression)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <code>{p.expression}</code>
              <span className="text-slate-400">({p.name})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Cron Expression (5 Fields)
          </label>
          <button
            onClick={copyExpr}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center justify-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy Expression'}
          </button>
        </div>

        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="* * * * *"
          className="w-full text-2xl sm:text-3xl font-mono text-center tracking-widest py-4 px-6 bg-slate-950 border border-slate-800 rounded-xl text-indigo-400 font-bold focus:outline-none focus:border-indigo-500"
        />

        {/* Human Readable Translation Banner */}
        <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-900/60 flex items-center gap-3">
          <Play className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <div className="text-[11px] font-semibold text-indigo-300 uppercase tracking-wider">
              Human Schedule
            </div>
            <div className="text-sm font-medium text-slate-200">
              {humanReadable}
            </div>
          </div>
        </div>

        {/* 5 Field Inspector Columns */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
          {[
            { label: 'Minute', val: parts.minute, range: '0-59' },
            { label: 'Hour', val: parts.hour, range: '0-23' },
            { label: 'Day of Month', val: parts.dom, range: '1-31' },
            { label: 'Month', val: parts.month, range: '1-12' },
            { label: 'Day of Week', val: parts.dow, range: '0-6 (Sun-Sat)' },
          ].map((item) => (
            <div key={item.label} className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
              <div className="text-[11px] text-slate-400 uppercase tracking-wider">{item.label}</div>
              <div className="text-lg font-mono font-bold text-white my-1">{item.val}</div>
              <div className="text-[10px] text-slate-500 font-mono">{item.range}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Upcoming Executions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Next 8 Upcoming Execution Timestamps (Local Timezone)
        </h3>

        {nextExecutions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {nextExecutions.map((date, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between font-mono text-xs"
              >
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-[10px] font-bold">
                    {idx + 1}
                  </span>
                  <span>{date.toLocaleDateString()} {date.toLocaleTimeString()}</span>
                </div>
                <span className="text-emerald-400 text-[11px]">
                  {Math.round((date.getTime() - Date.now()) / (1000 * 60))}m later
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-amber-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            No matching execution within the next forecast cycle. Please check expression syntax.
          </div>
        )}
      </div>
    </div>
  );
}

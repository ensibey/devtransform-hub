'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CopyButton } from '@/components/shared/CopyButton';
import { Clock, Sparkles, Terminal, Calendar, ArrowRight, CheckCircle2, Share2, Check } from 'lucide-react';
import { CRON_SCHEDULES } from '@/lib/cron-data';

interface CronInteractiveTranslatorProps {
  initialExpression?: string;
}

// Basic cron humanizer logic for client-side evaluation
function humanizeCron(expr: string): { en: string; tr: string } {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) {
    return {
      en: 'Please provide a valid 5-part cron expression (minute hour day month day-of-week).',
      tr: 'Lütfen geçerli 5 parçalı bir cron ifadesi girin (dakika saat gün ay haftanın-günü).',
    };
  }

  const [min, hr, dom, mon, dow] = parts;

  // Check if known in our database
  const matched = CRON_SCHEDULES.find((s) => s.expression === expr);
  if (matched) {
    return { en: matched.description, tr: matched.descriptionTr };
  }

  // Dynamic builder
  let timeStr = '';
  if (min === '*' && hr === '*') timeStr = 'every minute';
  else if (min.startsWith('*/') && hr === '*') timeStr = `every ${min.replace('*/', '')} minutes`;
  else if (hr.startsWith('*/')) timeStr = `every ${hr.replace('*/', '')} hours at minute ${min}`;
  else if (hr === '*') timeStr = `at minute ${min} of every hour`;
  else timeStr = `at ${hr.padStart(2, '0')}:${min.padStart(2, '0')}`;

  let dayStr = '';
  if (dow === '*' && dom === '*') dayStr = 'every day';
  else if (dow === '1-5') dayStr = 'every weekday (Monday through Friday)';
  else if (dow === '6,0' || dow === '0,6') dayStr = 'on weekends (Saturday & Sunday)';
  else if (dow !== '*') dayStr = `on day-of-week ${dow}`;
  else if (dom !== '*') dayStr = `on day ${dom} of the month`;

  return {
    en: `Executes ${timeStr}, ${dayStr}.`,
    tr: `${dayStr} ${timeStr} tetiklenir.`,
  };
}

// Calculate the next simulated execution times
function getNextExecutions(expr: string, count: number = 5): string[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const results: string[] = [];
  const now = new Date();
  let cursor = new Date(now.getTime() + 60000);
  cursor.setSeconds(0, 0);

  const [minPart, hrPart] = parts;

  for (let i = 0; i < 2000 && results.length < count; i++) {
    const curMin = cursor.getMinutes();
    const curHr = cursor.getHours();

    let minMatch = false;
    if (minPart === '*') minMatch = true;
    else if (minPart.startsWith('*/')) {
      const step = parseInt(minPart.replace('*/', ''), 10);
      minMatch = curMin % step === 0;
    } else if (parseInt(minPart, 10) === curMin) {
      minMatch = true;
    }

    let hrMatch = false;
    if (hrPart === '*') hrMatch = true;
    else if (hrPart.startsWith('*/')) {
      const step = parseInt(hrPart.replace('*/', ''), 10);
      hrMatch = curHr % step === 0;
    } else if (parseInt(hrPart, 10) === curHr) {
      hrMatch = true;
    }

    if (minMatch && hrMatch) {
      results.push(
        cursor.toLocaleString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
    }
    cursor = new Date(cursor.getTime() + 60000);
  }

  return results.length > 0 ? results : ['Upcoming execution scheduled in line with cron mask.'];
}

export function CronInteractiveTranslator({ initialExpression = '0 0 * * *' }: CronInteractiveTranslatorProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [expression, setExpression] = useState(initialExpression);
  const [commandTarget, setCommandTarget] = useState('/usr/bin/python3 /opt/scripts/backup.py');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const paramExpr = params.get('expr');
      if (paramExpr && paramExpr.trim().split(/\s+/).length === 5) {
        setExpression(paramExpr.trim());
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (expression !== '0 0 * * *') {
        url.searchParams.set('expr', expression);
      } else {
        url.searchParams.delete('expr');
      }
      window.history.replaceState(null, '', url.toString());
    }
  }, [expression]);

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('expr', expression);
      navigator.clipboard.writeText(url.toString());
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const human = useMemo(() => humanizeCron(expression), [expression]);
  const nextRuns = useMemo(() => getNextExecutions(expression), [expression]);

  const parts = expression.trim().split(/\s+/);
  const partMin = parts[0] || '*';
  const partHr = parts[1] || '*';
  const partDom = parts[2] || '*';
  const partMon = parts[3] || '*';
  const partDow = parts[4] || '*';

  const matchedSlug = useMemo(() => {
    return CRON_SCHEDULES.find((s) => s.expression === expression.trim())?.slug;
  }, [expression]);

  const updateField = (index: number, val: string) => {
    const arr = expression.trim().split(/\s+/);
    while (arr.length < 5) arr.push('*');
    arr[index] = val || '*';
    setExpression(arr.join(' '));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1">
            <Sparkles className="w-4 h-4" /> Live Interactive Crontab Translator & Evaluator
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Cron Expression Translator & Next Run Schedule</h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopyShareLink}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono text-neutral-300 transition-colors shadow-sm"
            title="Copy shareable link with this exact cron schedule"
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Share Schedule</span>
              </>
            )}
          </button>

          {matchedSlug && (
            <Link
              href={`/cron/${matchedSlug}/`}
              className="inline-flex items-center gap-1.5 text-xs font-mono font-medium px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors"
            >
              <span>Dedicated Guide</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Main Expression Input & Human Meaning */}
      <div className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-medium text-neutral-400 block mb-1">Crontab Expression (5 fields):</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 text-emerald-400 font-mono text-xl sm:text-2xl font-bold px-4 py-3 rounded-xl tracking-wider focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="* * * * *"
            />
            <CopyButton text={expression} />
          </div>
        </div>

        {/* 5 Field Breakdown Badges */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs font-mono">
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-2.5">
            <div className="text-[10px] uppercase text-neutral-400">Minute</div>
            <input
              type="text"
              value={partMin}
              onChange={(e) => updateField(0, e.target.value)}
              className="w-full bg-transparent text-center font-bold text-white mt-1 focus:outline-none text-sm"
            />
            <div className="text-[9px] text-neutral-400 mt-0.5">0-59</div>
          </div>
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-2.5">
            <div className="text-[10px] uppercase text-neutral-400">Hour</div>
            <input
              type="text"
              value={partHr}
              onChange={(e) => updateField(1, e.target.value)}
              className="w-full bg-transparent text-center font-bold text-white mt-1 focus:outline-none text-sm"
            />
            <div className="text-[9px] text-neutral-400 mt-0.5">0-23</div>
          </div>
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-2.5">
            <div className="text-[10px] uppercase text-neutral-400">Day (Month)</div>
            <input
              type="text"
              value={partDom}
              onChange={(e) => updateField(2, e.target.value)}
              className="w-full bg-transparent text-center font-bold text-white mt-1 focus:outline-none text-sm"
            />
            <div className="text-[9px] text-neutral-400 mt-0.5">1-31</div>
          </div>
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-2.5">
            <div className="text-[10px] uppercase text-neutral-400">Month</div>
            <input
              type="text"
              value={partMon}
              onChange={(e) => updateField(3, e.target.value)}
              className="w-full bg-transparent text-center font-bold text-white mt-1 focus:outline-none text-sm"
            />
            <div className="text-[9px] text-neutral-400 mt-0.5">1-12</div>
          </div>
          <div className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-2.5">
            <div className="text-[10px] uppercase text-neutral-400">Day (Week)</div>
            <input
              type="text"
              value={partDow}
              onChange={(e) => updateField(4, e.target.value)}
              className="w-full bg-transparent text-center font-bold text-white mt-1 focus:outline-none text-sm"
            />
            <div className="text-[9px] text-neutral-400 mt-0.5">0-6 (Sun-Sat)</div>
          </div>
        </div>

        {/* Human Readable Translation Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-r from-emerald-950/30 to-blue-950/30 border border-emerald-500/20">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Human Readable Meaning:
          </div>
          <div className="text-base sm:text-lg font-medium text-white leading-snug">{human.en}</div>
          <div className="text-xs text-neutral-400 mt-1">{human.tr}</div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-neutral-400 font-medium">Quick Presets:</span>
        {[
          { expr: '* * * * *', label: 'Every Minute' },
          { expr: '*/5 * * * *', label: 'Every 5 Mins' },
          { expr: '0 * * * *', label: 'Every Hour' },
          { expr: '0 0 * * *', label: 'Daily Midnight' },
          { expr: '0 9 * * 1-5', label: 'Weekdays 9:00 AM' },
          { expr: '0 0 * * 0', label: 'Every Sunday' },
          { expr: '0 0 1 * *', label: '1st of Month' },
        ].map((p) => (
          <button
            key={p.expr}
            onClick={() => setExpression(p.expr)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors font-mono ${
              expression === p.expr
                ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500 font-semibold'
                : 'bg-neutral-800/50 text-neutral-400 border-neutral-700/60 hover:text-white hover:border-neutral-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Next Execution Times & Linux Crontab Command */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Next Runs */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4">
          <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Calendar className="w-3.5 h-3.5 text-blue-400" /> Next 5 Scheduled Executions
          </div>
          <div className="space-y-1.5">
            {nextRuns.map((time, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-mono text-neutral-300">
                <span className="w-4 text-neutral-400 text-[10px]">{idx + 1}.</span>
                <span className="text-blue-300 font-medium">{time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Linux Crontab Command */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider flex items-center gap-2 mb-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Ready Crontab Line
            </div>
            <input
              type="text"
              value={commandTarget}
              onChange={(e) => setCommandTarget(e.target.value)}
              className="text-xs bg-neutral-900 border border-neutral-800 text-neutral-300 rounded px-2.5 py-1.5 w-full font-mono mb-2.5 focus:outline-none focus:border-emerald-500"
              placeholder="command to run"
            />
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-2.5 flex items-center justify-between font-mono text-xs text-neutral-200">
            <code className="truncate mr-2">{expression} {commandTarget}</code>
            <CopyButton text={`${expression} ${commandTarget}`} />
          </div>
        </div>
      </div>
    </div>
  );
}

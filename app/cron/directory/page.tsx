'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getAllCronSchedules } from '@/lib/cron-data';
import {
  Clock,
  Search,
  Terminal,
  Calendar,
  ArrowRight,
  ChevronRight,
  Zap,
  Sparkles,
} from 'lucide-react';
import { CopyButton } from '@/components/shared/CopyButton';

export default function CronDirectoryPage() {
  const allSchedules = useMemo(() => getAllCronSchedules(), []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = useMemo(() => {
    return ['ALL', 'frequent', 'hourly', 'daily', 'weekly', 'monthly'];
  }, []);

  const filteredSchedules = useMemo(() => {
    return allSchedules.filter((s) => {
      const matchesCategory = selectedCategory === 'ALL' || s.category === selectedCategory;
      const search = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !search ||
        s.expression.toLowerCase().includes(search) ||
        s.title.toLowerCase().includes(search) ||
        s.titleTr.toLowerCase().includes(search) ||
        s.description.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [allSchedules, selectedCategory, searchTerm]);

  return (
    <div className="space-y-8 py-2">
      {/* Breadcrumb Header */}
      <div className="space-y-3">
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-mono text-zinc-400">
          <Link href="/" className="hover:text-zinc-200 transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-zinc-600" />
          <span className="text-brand-emerald font-semibold">Cron Schedules Directory</span>
        </nav>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Cron Expressions &amp; Schedules Directory
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed">
            Everyday cron job schedules explained in plain English. Browse cron syntax for frequent intervals, hourly batches, daily rollups, and weekly maintenance with crontab and GitHub Actions configurations.
          </p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by expression (* * * * *, 0 0 * * *) or keyword (midnight, weekday, hourly, 5 minutes)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-100 border border-border text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-emerald"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-brand-emerald text-black font-bold'
                  : 'bg-surface-100 text-zinc-400 hover:text-white border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cron Schedule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchedules.map((schedule) => (
          <div
            key={schedule.slug}
            className="p-5 rounded-2xl bg-surface-100 border border-border hover:border-brand-emerald/40 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-brand-emerald uppercase">
                  {schedule.category}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-200 text-zinc-400 border border-border">
                  5-Field Cron
                </span>
              </div>

              {/* Expression Display */}
              <div className="p-3 rounded-xl bg-black/70 border border-border flex items-center justify-between gap-2">
                <code className="text-base sm:text-lg font-mono font-bold text-emerald-400 tracking-wider">
                  {schedule.expression}
                </code>
                <CopyButton text={schedule.expression} />
              </div>

              <Link href={`/cron/${schedule.slug}/`} className="block">
                <h2 className="text-base font-bold text-white group-hover:text-brand-emerald transition-colors">
                  {schedule.title}
                </h2>
              </Link>

              <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                {schedule.description}
              </p>

              {/* 5-Field Micro Breakdown */}
              <div className="grid grid-cols-5 gap-1 pt-2 border-t border-border/60 text-center">
                <div className="p-1.5 rounded bg-surface-200/50 border border-border/40">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">Min</div>
                  <div className="text-[11px] font-mono text-zinc-300 truncate">{schedule.minute.split(' ')[0]}</div>
                </div>
                <div className="p-1.5 rounded bg-surface-200/50 border border-border/40">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">Hour</div>
                  <div className="text-[11px] font-mono text-zinc-300 truncate">{schedule.hour.split(' ')[0]}</div>
                </div>
                <div className="p-1.5 rounded bg-surface-200/50 border border-border/40">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">DOM</div>
                  <div className="text-[11px] font-mono text-zinc-300 truncate">{schedule.dayOfMonth.split(' ')[0]}</div>
                </div>
                <div className="p-1.5 rounded bg-surface-200/50 border border-border/40">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">Month</div>
                  <div className="text-[11px] font-mono text-zinc-300 truncate">{schedule.month.split(' ')[0]}</div>
                </div>
                <div className="p-1.5 rounded bg-surface-200/50 border border-border/40">
                  <div className="text-[9px] font-mono text-zinc-500 uppercase">DOW</div>
                  <div className="text-[11px] font-mono text-zinc-300 truncate">{schedule.dayOfWeek.split(' ')[0]}</div>
                </div>
              </div>
            </div>

            <Link
              href={`/cron/${schedule.slug}/`}
              className="inline-flex items-center space-x-1.5 text-xs font-mono text-brand-emerald hover:underline pt-2 border-t border-border"
            >
              <span>Next execution times, crontab &amp; GitHub Actions</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        ))}
      </div>

      {filteredSchedules.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-surface-100 border border-border text-zinc-400 space-y-2">
          <Clock className="w-8 h-8 text-zinc-500 mx-auto" />
          <p className="text-sm">No cron schedules found matching &quot;{searchTerm}&quot;</p>
        </div>
      )}
    </div>
  );
}

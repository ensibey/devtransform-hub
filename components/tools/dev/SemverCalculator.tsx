'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { GitBranch, ArrowRight, Check, X, Sparkles, RefreshCw, Layers, ArrowUpDown } from 'lucide-react';

interface SemVerParts {
  major: number;
  minor: number;
  patch: number;
  prerelease?: string;
  build?: string;
  raw: string;
  isValid: boolean;
}

function parseSemver(v: string): SemVerParts {
  const clean = v.trim().replace(/^v/i, '');
  const semverRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+([0-9A-Za-z.-]+))?$/;
  const match = clean.match(semverRegex);

  if (!match) {
    return {
      major: 0,
      minor: 0,
      patch: 0,
      raw: v,
      isValid: false,
    };
  }

  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
    prerelease: match[4] || undefined,
    build: match[5] || undefined,
    raw: v,
    isValid: true,
  };
}

function compareSemver(a: SemVerParts, b: SemVerParts): number {
  if (!a.isValid || !b.isValid) return 0;
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  if (a.patch !== b.patch) return a.patch - b.patch;

  if (a.prerelease && !b.prerelease) return -1;
  if (!a.prerelease && b.prerelease) return 1;
  if (a.prerelease && b.prerelease) {
    return a.prerelease.localeCompare(b.prerelease);
  }
  return 0;
}

function testSemverRange(versionStr: string, rangeStr: string): { satisfies: boolean; explanation: string } {
  const parsed = parseSemver(versionStr);
  if (!parsed.isValid) {
    return { satisfies: false, explanation: 'Invalid SemVer target format.' };
  }

  const cleanRange = rangeStr.trim();
  if (cleanRange === '*' || cleanRange === 'x' || cleanRange === 'X') {
    return { satisfies: true, explanation: 'Matches any version (* wildcard).' };
  }

  // Caret ^ (allows changes that do not modify the left-most non-zero digit)
  if (cleanRange.startsWith('^')) {
    const base = parseSemver(cleanRange.slice(1));
    if (!base.isValid) return { satisfies: false, explanation: 'Malformed caret range.' };

    if (base.major > 0) {
      const match = parsed.major === base.major && compareSemver(parsed, base) >= 0;
      return {
        satisfies: match,
        explanation: `^${base.raw} allows versions >= ${base.raw} and < ${base.major + 1}.0.0`,
      };
    } else if (base.minor > 0) {
      const match = parsed.major === 0 && parsed.minor === base.minor && parsed.patch >= base.patch;
      return {
        satisfies: match,
        explanation: `^${base.raw} allows versions >= ${base.raw} and < 0.${base.minor + 1}.0`,
      };
    } else {
      const match = parsed.major === 0 && parsed.minor === 0 && parsed.patch === base.patch;
      return {
        satisfies: match,
        explanation: `^${base.raw} strictly requires 0.0.${base.patch}`,
      };
    }
  }

  // Tilde ~ (allows patch-level changes if minor is specified)
  if (cleanRange.startsWith('~')) {
    const base = parseSemver(cleanRange.slice(1));
    if (!base.isValid) return { satisfies: false, explanation: 'Malformed tilde range.' };
    const match = parsed.major === base.major && parsed.minor === base.minor && parsed.patch >= base.patch;
    return {
      satisfies: match,
      explanation: `~${base.raw} allows versions >= ${base.raw} and < ${base.major}.${base.minor + 1}.0`,
    };
  }

  // Exact match
  const base = parseSemver(cleanRange);
  if (base.isValid) {
    const match = compareSemver(parsed, base) === 0;
    return {
      satisfies: match,
      explanation: match ? 'Exact version match.' : `Does not equal exact version ${cleanRange}`,
    };
  }

  return { satisfies: false, explanation: 'Custom complex range syntax.' };
}

export function SemverCalculator() {
  const [activeTab, setActiveTab] = useState<'inspector' | 'range' | 'sort'>('inspector');

  // Tab 1: Inspector & Bump
  const [versionInput, setVersionInput] = useState('2.4.1-beta.2');

  const parsed = useMemo(() => parseSemver(versionInput), [versionInput]);

  // Bumps
  const bumps = useMemo(() => {
    if (!parsed.isValid) return null;
    return {
      patch: `${parsed.major}.${parsed.minor}.${parsed.patch + 1}`,
      minor: `${parsed.major}.${parsed.minor + 1}.0`,
      major: `${parsed.major + 1}.0.0`,
      alpha: `${parsed.major}.${parsed.minor}.${parsed.patch}-alpha.1`,
      beta: `${parsed.major}.${parsed.minor}.${parsed.patch}-beta.1`,
      rc: `${parsed.major}.${parsed.minor}.${parsed.patch}-rc.1`,
    };
  }, [parsed]);

  // Tab 2: Range Tester
  const [rangeTarget, setRangeTarget] = useState('2.4.5');
  const [rangeRule, setRangeRule] = useState('^2.4.0');

  const rangeResult = useMemo(() => {
    return testSemverRange(rangeTarget, rangeRule);
  }, [rangeTarget, rangeRule]);

  // Tab 3: Sorter
  const [sortInput, setSortInput] = useState(`v1.10.0\nv1.2.0\nv2.0.0-rc.1\nv1.9.4\nv2.0.0\nv0.9.1`);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedList = useMemo(() => {
    const lines = sortInput.split('\n').map((l) => l.trim()).filter(Boolean);
    const parsedList = lines.map((l) => ({ raw: l, sem: parseSemver(l) }));

    parsedList.sort((a, b) => {
      const cmp = compareSemver(a.sem, b.sem);
      return sortOrder === 'asc' ? cmp : -cmp;
    });

    return parsedList.map((p) => p.raw).join('\n');
  }, [sortInput, sortOrder]);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 p-1.5 rounded-xl bg-zinc-900 border border-zinc-800">
        <button
          onClick={() => setActiveTab('inspector')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'inspector'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          SemVer Inspector & Version Bumper
        </button>
        <button
          onClick={() => setActiveTab('range')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'range'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <Layers className="w-4 h-4" />
          Range Evaluator (^, ~, *)
        </button>
        <button
          onClick={() => setActiveTab('sort')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'sort'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <ArrowUpDown className="w-4 h-4" />
          Batch Tag Sorter
        </button>
      </div>

      {activeTab === 'inspector' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-400" />
                Target Semantic Version String
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVersionInput('1.0.0')}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  1.0.0
                </button>
                <button
                  onClick={() => setVersionInput('3.12.4-rc.1+build.89')}
                  className="px-2.5 py-1 text-xs font-mono rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                >
                  3.12.4-rc.1+build.89
                </button>
              </div>
            </div>

            <input
              type="text"
              value={versionInput}
              onChange={(e) => setVersionInput(e.target.value)}
              className="w-full px-4 py-3 font-mono text-base rounded-xl bg-zinc-950 border border-zinc-700 text-indigo-300 focus:outline-none focus:border-indigo-500 transition-colors"
              placeholder="e.g. 2.4.1-beta.2"
            />

            {/* Breakdown Cards */}
            {parsed.isValid ? (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xs text-zinc-400 font-medium">MAJOR</div>
                  <div className="text-xl font-bold font-mono text-emerald-400 mt-1">{parsed.major}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Breaking API</div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xs text-zinc-400 font-medium">MINOR</div>
                  <div className="text-xl font-bold font-mono text-cyan-400 mt-1">{parsed.minor}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Backwards compat</div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xs text-zinc-400 font-medium">PATCH</div>
                  <div className="text-xl font-bold font-mono text-indigo-400 mt-1">{parsed.patch}</div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Bug fixes</div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xs text-zinc-400 font-medium">PRERELEASE</div>
                  <div className="text-sm font-bold font-mono text-amber-400 mt-2 truncate">
                    {parsed.prerelease || 'None'}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-center">
                  <div className="text-xs text-zinc-400 font-medium">BUILD META</div>
                  <div className="text-sm font-bold font-mono text-purple-400 mt-2 truncate">
                    {parsed.build || 'None'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-red-950/30 border border-red-800/50 text-red-300 text-sm flex items-center gap-2">
                <X className="w-4 h-4 text-red-400" />
                Invalid SemVer syntax. Follow standard MAJOR.MINOR.PATCH format (e.g. 1.2.3).
              </div>
            )}
          </div>

          {/* Quick Version Bumper */}
          {bumps && (
            <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-200">1-Click Version Bumpers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 font-medium block">Patch Bump (+0.0.1)</span>
                    <span className="text-base font-mono font-bold text-zinc-200">{bumps.patch}</span>
                  </div>
                  <CopyButton text={bumps.patch} label="" />
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 font-medium block">Minor Bump (+0.1.0)</span>
                    <span className="text-base font-mono font-bold text-zinc-200">{bumps.minor}</span>
                  </div>
                  <CopyButton text={bumps.minor} label="" />
                </div>
                <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-zinc-400 font-medium block">Major Bump (+1.0.0)</span>
                    <span className="text-base font-mono font-bold text-zinc-200">{bumps.major}</span>
                  </div>
                  <CopyButton text={bumps.major} label="" />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'range' && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Installed / Target Version</label>
              <input
                type="text"
                value={rangeTarget}
                onChange={(e) => setRangeTarget(e.target.value)}
                className="w-full px-3.5 py-2.5 font-mono text-sm rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. 2.4.5"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Range Rule (e.g. ^2.4.0, ~2.4.0)</label>
              <input
                type="text"
                value={rangeRule}
                onChange={(e) => setRangeRule(e.target.value)}
                className="w-full px-3.5 py-2.5 font-mono text-sm rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-indigo-500"
                placeholder="e.g. ^2.4.0"
              />
            </div>
          </div>

          <div
            className={`p-4 rounded-xl border flex items-center gap-3 ${
              rangeResult.satisfies
                ? 'bg-emerald-950/25 border-emerald-800/60 text-emerald-300'
                : 'bg-red-950/25 border-red-800/60 text-red-300'
            }`}
          >
            {rangeResult.satisfies ? (
              <Check className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <X className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <div>
              <div className="font-semibold text-sm">
                {rangeResult.satisfies ? 'SATISFIES RANGE RULE' : 'DOES NOT SATISFY RANGE RULE'}
              </div>
              <div className="text-xs text-zinc-300 mt-0.5">{rangeResult.explanation}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sort' && (
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300">Input Tag List (one per line)</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSortOrder('desc')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  sortOrder === 'desc'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Newest First (Desc)
              </button>
              <button
                onClick={() => setSortOrder('asc')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition-colors ${
                  sortOrder === 'asc'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Oldest First (Asc)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <textarea
              rows={8}
              value={sortInput}
              onChange={(e) => setSortInput(e.target.value)}
              className="w-full p-3 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
              placeholder="Paste version strings..."
            />
            <div className="relative">
              <textarea
                rows={8}
                readOnly
                value={sortedList}
                className="w-full p-3 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none resize-none"
              />
              <div className="absolute top-2 right-2">
                <CopyButton text={sortedList} label="" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

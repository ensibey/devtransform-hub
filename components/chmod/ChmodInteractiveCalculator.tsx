'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CopyButton } from '@/components/shared/CopyButton';
import { ShieldCheck, ShieldAlert, AlertTriangle, Terminal, Check, Sparkles, Folder, FileCode } from 'lucide-react';

interface ChmodInteractiveCalculatorProps {
  initialOctal?: string;
}

export function ChmodInteractiveCalculator({ initialOctal = '755' }: ChmodInteractiveCalculatorProps) {
  const [owner, setOwner] = useState({
    read: (parseInt(initialOctal[0] || '7', 10) & 4) !== 0,
    write: (parseInt(initialOctal[0] || '7', 10) & 2) !== 0,
    execute: (parseInt(initialOctal[0] || '7', 10) & 1) !== 0,
  });

  const [group, setGroup] = useState({
    read: (parseInt(initialOctal[1] || '5', 10) & 4) !== 0,
    write: (parseInt(initialOctal[1] || '5', 10) & 2) !== 0,
    execute: (parseInt(initialOctal[1] || '5', 10) & 1) !== 0,
  });

  const [others, setOthers] = useState({
    read: (parseInt(initialOctal[2] || '5', 10) & 4) !== 0,
    write: (parseInt(initialOctal[2] || '5', 10) & 2) !== 0,
    execute: (parseInt(initialOctal[2] || '5', 10) & 1) !== 0,
  });

  const [customPath, setCustomPath] = useState('deploy.sh');

  // Compute octal
  const o = (owner.read ? 4 : 0) + (owner.write ? 2 : 0) + (owner.execute ? 1 : 0);
  const g = (group.read ? 4 : 0) + (group.write ? 2 : 0) + (group.execute ? 1 : 0);
  const ot = (others.read ? 4 : 0) + (others.write ? 2 : 0) + (others.execute ? 1 : 0);
  const octal = `${o}${g}${ot}`;

  // Compute symbolic
  const symOwner = (owner.read ? 'r' : '-') + (owner.write ? 'w' : '-') + (owner.execute ? 'x' : '-');
  const symGroup = (group.read ? 'r' : '-') + (group.write ? 'w' : '-') + (group.execute ? 'x' : '-');
  const symOthers = (others.read ? 'r' : '-') + (others.write ? 'w' : '-') + (others.execute ? 'x' : '-');
  const symbolic = `${symOwner}${symGroup}${symOthers}`;

  // Security score
  let securityRating: 'Safe' | 'Standard' | 'Elevated' | 'Dangerous' = 'Standard';
  let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

  if (others.write || (group.write && others.read && ot > 5)) {
    securityRating = 'Dangerous';
    badgeColor = 'bg-red-500/10 text-red-400 border-red-500/20';
  } else if (group.write || others.execute) {
    securityRating = 'Elevated';
    badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  } else if (!group.write && !others.write && !others.execute) {
    securityRating = 'Safe';
    badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  }

  const applyPreset = (presetOctal: string) => {
    const po = parseInt(presetOctal[0], 10);
    const pg = parseInt(presetOctal[1], 10);
    const pot = parseInt(presetOctal[2], 10);
    setOwner({ read: (po & 4) !== 0, write: (po & 2) !== 0, execute: (po & 1) !== 0 });
    setGroup({ read: (pg & 4) !== 0, write: (pg & 2) !== 0, execute: (pg & 1) !== 0 });
    setOthers({ read: (pot & 4) !== 0, write: (pot & 2) !== 0, execute: (pot & 1) !== 0 });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" /> Live Interactive Permission Matrix
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Linux chmod Calculator & Generator</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs text-neutral-400">Octal Value</div>
            <div className="text-3xl font-black font-mono text-emerald-400 tracking-wider">{octal}</div>
          </div>
          <div className="h-10 w-[1px] bg-neutral-800" />
          <div className="text-left">
            <div className="text-xs text-neutral-400">Symbolic</div>
            <div className="text-sm sm:text-base font-mono font-bold text-neutral-200">{symbolic}</div>
          </div>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="text-xs text-neutral-400 font-medium">Quick Presets:</span>
        {[
          { code: '755', label: '755 (Web Dir / Script)' },
          { code: '644', label: '644 (Web Asset / File)' },
          { code: '600', label: '600 (SSH Private Key)' },
          { code: '700', label: '700 (Private Dir)' },
          { code: '775', label: '775 (Team Shared)' },
          { code: '400', label: '400 (Read Only Key)' },
          { code: '777', label: '777 (Full Access - Warning)' },
        ].map((p) => (
          <button
            key={p.code}
            onClick={() => applyPreset(p.code)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              octal === p.code
                ? 'bg-blue-600/20 text-blue-400 border-blue-500 font-semibold'
                : 'bg-neutral-800/50 text-neutral-400 border-neutral-700/60 hover:text-white hover:border-neutral-600'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 3-Column Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6">
        {/* Owner */}
        <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
            <div>
              <div className="font-semibold text-white">Owner (User)</div>
              <div className="text-xs text-neutral-400">The file creator</div>
            </div>
            <span className="text-lg font-mono font-bold text-blue-400">{o}</span>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={owner.read}
                onChange={(e) => setOwner({ ...owner, read: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Read (r / 4)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={owner.write}
                onChange={(e) => setOwner({ ...owner, write: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Write (w / 2)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={owner.execute}
                onChange={(e) => setOwner({ ...owner, execute: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Execute (x / 1)</span>
            </label>
          </div>
        </div>

        {/* Group */}
        <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
            <div>
              <div className="font-semibold text-white">Group</div>
              <div className="text-xs text-neutral-400">Team or service account</div>
            </div>
            <span className="text-lg font-mono font-bold text-indigo-400">{g}</span>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={group.read}
                onChange={(e) => setGroup({ ...group, read: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Read (r / 4)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={group.write}
                onChange={(e) => setGroup({ ...group, write: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Write (w / 2)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={group.execute}
                onChange={(e) => setGroup({ ...group, execute: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Execute (x / 1)</span>
            </label>
          </div>
        </div>

        {/* Others / Public */}
        <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80 mb-4">
            <div>
              <div className="font-semibold text-white">Public (Others)</div>
              <div className="text-xs text-neutral-400">All other system users</div>
            </div>
            <span className="text-lg font-mono font-bold text-violet-400">{ot}</span>
          </div>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={others.read}
                onChange={(e) => setOthers({ ...others, read: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Read (r / 4)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={others.write}
                onChange={(e) => setOthers({ ...others, write: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Write (w / 2)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input
                type="checkbox"
                checked={others.execute}
                onChange={(e) => setOthers({ ...others, execute: e.target.checked })}
                className="w-4 h-4 rounded border-neutral-700 text-blue-600 focus:ring-blue-500 bg-neutral-900"
              />
              <span className="text-sm text-neutral-300 group-hover:text-white">Execute (x / 1)</span>
            </label>
          </div>
        </div>
      </div>

      {/* Security Status Badge */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
        <div className="flex items-center gap-3">
          {securityRating === 'Safe' ? (
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          ) : securityRating === 'Dangerous' ? (
            <ShieldAlert className="w-5 h-5 text-red-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <div>
            <div className="text-xs text-neutral-400">Security Assessment</div>
            <div className="text-sm font-medium text-white">
              Status:{' '}
              <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full border ${badgeColor}`}>
                {securityRating}
              </span>
            </div>
          </div>
        </div>

        {/* Link to dedicated page */}
        <Link
          href={`/chmod/chmod-${octal}/`}
          className="text-xs text-blue-400 hover:text-blue-300 underline font-medium"
        >
          View Full chmod {octal} Guide &rarr;
        </Link>
      </div>

      {/* Command Output Generator */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Generated Terminal Commands
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-500">Target:</span>
            <input
              type="text"
              value={customPath}
              onChange={(e) => setCustomPath(e.target.value)}
              className="text-xs bg-neutral-950 border border-neutral-800 text-neutral-200 rounded px-2 py-1 font-mono w-32 focus:outline-none focus:border-blue-500"
              placeholder="filename or path"
            />
          </div>
        </div>

        {/* Single command */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 flex items-center justify-between font-mono text-xs sm:text-sm text-neutral-200">
          <code>chmod {octal} {customPath}</code>
          <CopyButton text={`chmod ${octal} ${customPath}`} />
        </div>

        {/* Recursive command */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 flex items-center justify-between font-mono text-xs sm:text-sm text-neutral-200">
          <code>chmod -R {octal} {customPath.includes('/') ? customPath : `/var/www/${customPath}`}</code>
          <CopyButton text={`chmod -R ${octal} ${customPath.includes('/') ? customPath : `/var/www/${customPath}`}`} />
        </div>
      </div>
    </div>
  );
}

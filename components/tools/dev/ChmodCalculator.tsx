'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Terminal, Shield, Check, Info } from 'lucide-react';

interface PermissionGroup {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export function ChmodCalculator() {
  const [owner, setOwner] = useState<PermissionGroup>({ read: true, write: true, execute: true });
  const [group, setGroup] = useState<PermissionGroup>({ read: true, write: false, execute: true });
  const [others, setOthers] = useState<PermissionGroup>({ read: true, write: false, execute: true });

  const calculateOctalDigit = (p: PermissionGroup) => {
    let val = 0;
    if (p.read) val += 4;
    if (p.write) val += 2;
    if (p.execute) val += 1;
    return val;
  };

  const calculateSymbolic = (p: PermissionGroup) => {
    return `${p.read ? 'r' : '-'}${p.write ? 'w' : '-'}${p.execute ? 'x' : '-'}`;
  };

  const octal = `${calculateOctalDigit(owner)}${calculateOctalDigit(group)}${calculateOctalDigit(others)}`;
  const symbolic = `-${calculateSymbolic(owner)}${calculateSymbolic(group)}${calculateSymbolic(others)}`;
  const chmodCommand = `chmod ${octal} filename`;

  const PRESETS = [
    { name: '755 (Executables, Folders)', o: [true, true, true], g: [true, false, true], ot: [true, false, true] },
    { name: '644 (Standard Files, HTML)', o: [true, true, false], g: [true, false, false], ot: [true, false, false] },
    { name: '777 (Full Access / Public)', o: [true, true, true], g: [true, true, true], ot: [true, true, true] },
    { name: '700 (Private Script / SSH)', o: [true, true, true], g: [false, false, false], ot: [false, false, false] },
    { name: '600 (Private Key, .env)', o: [true, true, false], g: [false, false, false], ot: [false, false, false] },
  ];

  const applyPreset = (p: any) => {
    setOwner({ read: p.o[0], write: p.o[1], execute: p.o[2] });
    setGroup({ read: p.g[0], write: p.g[1], execute: p.g[2] });
    setOthers({ read: p.ot[0], write: p.ot[1], execute: p.ot[2] });
  };

  return (
    <div className="space-y-6">
      {/* Quick Presets */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <span className="text-xs font-mono text-zinc-400">Popular Linux Permission Presets:</span>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => applyPreset(p)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Showcase Value Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-b from-zinc-900/90 via-zinc-900/60 to-zinc-950 border border-brand-emerald/40 space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5 text-brand-emerald font-bold">
            <Terminal className="w-4 h-4" />
            <span>Linux Permissions Output</span>
          </span>
          <span className="text-zinc-500">Octal & Symbolic Notation</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Octal Code:</span>
            <div className="text-3xl font-black font-mono text-brand-emerald">{octal}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1">
            <span className="text-[11px] font-mono text-zinc-500 uppercase">Symbolic Notation:</span>
            <div className="text-2xl font-black font-mono text-sky-400">{symbolic}</div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-1 flex flex-col justify-between">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase">
              <span>Command:</span>
              <CopyButton text={chmodCommand} />
            </div>
            <div className="text-sm font-bold font-mono text-white truncate">{chmodCommand}</div>
          </div>
        </div>
      </div>

      {/* Interactive Permission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Owner */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-mono text-xs font-bold text-white uppercase">Owner (User)</span>
            <span className="font-mono text-xs text-brand-emerald font-bold">{calculateOctalDigit(owner)}</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.read}
                onChange={(e) => setOwner({ ...owner, read: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
              />
              <span>Read (r = 4)</span>
            </label>
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.write}
                onChange={(e) => setOwner({ ...owner, write: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
              />
              <span>Write (w = 2)</span>
            </label>
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={owner.execute}
                onChange={(e) => setOwner({ ...owner, execute: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
              />
              <span>Execute (x = 1)</span>
            </label>
          </div>
        </div>

        {/* Group */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-mono text-xs font-bold text-white uppercase">Group</span>
            <span className="font-mono text-xs text-sky-400 font-bold">{calculateOctalDigit(group)}</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={group.read}
                onChange={(e) => setGroup({ ...group, read: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-sky-400 focus:ring-0"
              />
              <span>Read (r = 4)</span>
            </label>
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={group.write}
                onChange={(e) => setGroup({ ...group, write: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-sky-400 focus:ring-0"
              />
              <span>Write (w = 2)</span>
            </label>
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={group.execute}
                onChange={(e) => setGroup({ ...group, execute: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-sky-400 focus:ring-0"
              />
              <span>Execute (x = 1)</span>
            </label>
          </div>
        </div>

        {/* Others */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
            <span className="font-mono text-xs font-bold text-white uppercase">Others (Public)</span>
            <span className="font-mono text-xs text-amber-400 font-bold">{calculateOctalDigit(others)}</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={others.read}
                onChange={(e) => setOthers({ ...others, read: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-amber-400 focus:ring-0"
              />
              <span>Read (r = 4)</span>
            </label>
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={others.write}
                onChange={(e) => setOthers({ ...others, write: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-amber-400 focus:ring-0"
              />
              <span>Write (w = 2)</span>
            </label>
            <label className="flex items-center space-x-2.5 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={others.execute}
                onChange={(e) => setOthers({ ...others, execute: e.target.checked })}
                className="rounded bg-zinc-950 border-zinc-800 text-amber-400 focus:ring-0"
              />
              <span>Execute (x = 1)</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

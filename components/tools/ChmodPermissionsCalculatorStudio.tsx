'use client';

import React, { useState, useMemo } from 'react';
import { Terminal, Copy, Check, Sparkles, RefreshCw, Shield, CheckCircle2 } from 'lucide-react';

interface ChmodPreset {
  name: string;
  octal: string;
  desc: string;
}

const PRESETS: ChmodPreset[] = [
  { name: 'Standard Web Directory (755)', octal: '755', desc: 'Owner can read/write/exec, everyone else read/exec' },
  { name: 'Standard Web File (644)', octal: '644', desc: 'Owner read/write, everyone else read only' },
  { name: 'SSH Private Key (600)', octal: '600', desc: 'Strictly owner read/write, nobody else has access' },
  { name: 'SSH Public Key / Config (644)', octal: '644', desc: 'Public key files and general configs' },
  { name: 'Executable Script (755)', octal: '755', desc: 'Bash/Node/Python scripts executable by all' },
  { name: 'Fully Open / Shared (777)', octal: '777', desc: 'Full read, write, execute for all (Use caution!)' },
  { name: 'Secure System File (400)', octal: '400', desc: 'Read-only access for owner only' },
];

export function ChmodPermissionsCalculatorStudio() {
  // Owner (u), Group (g), Others (o)
  const [ownerRead, setOwnerRead] = useState<boolean>(true);
  const [ownerWrite, setOwnerWrite] = useState<boolean>(true);
  const [ownerExec, setOwnerExec] = useState<boolean>(true);

  const [groupRead, setGroupRead] = useState<boolean>(true);
  const [groupWrite, setGroupWrite] = useState<boolean>(false);
  const [groupExec, setGroupExec] = useState<boolean>(true);

  const [otherRead, setOtherRead] = useState<boolean>(true);
  const [otherWrite, setOtherWrite] = useState<boolean>(false);
  const [otherExec, setOtherExec] = useState<boolean>(true);

  // Special bits
  const [suid, setSuid] = useState<boolean>(false);
  const [sgid, setSgid] = useState<boolean>(false);
  const [sticky, setSticky] = useState<boolean>(false);

  const [fileName, setFileName] = useState<string>('app.sh');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Calculate octal values
  const { octal3, octal4, symbolic, command } = useMemo(() => {
    const uVal = (ownerRead ? 4 : 0) + (ownerWrite ? 2 : 0) + (ownerExec ? 1 : 0);
    const gVal = (groupRead ? 4 : 0) + (groupWrite ? 2 : 0) + (groupExec ? 1 : 0);
    const oVal = (otherRead ? 4 : 0) + (otherWrite ? 2 : 0) + (otherExec ? 1 : 0);
    const sVal = (suid ? 4 : 0) + (sgid ? 2 : 0) + (sticky ? 1 : 0);

    const octal3 = `${uVal}${gVal}${oVal}`;
    const octal4 = `${sVal}${uVal}${gVal}${oVal}`;

    // Symbolic representation
    const uSym = (ownerRead ? 'r' : '-') + (ownerWrite ? 'w' : '-') + (suid ? (ownerExec ? 's' : 'S') : (ownerExec ? 'x' : '-'));
    const gSym = (groupRead ? 'r' : '-') + (groupWrite ? 'w' : '-') + (sgid ? (groupExec ? 's' : 'S') : (groupExec ? 'x' : '-'));
    const oSym = (otherRead ? 'r' : '-') + (otherWrite ? 'w' : '-') + (sticky ? (otherExec ? 't' : 'T') : (otherExec ? 'x' : '-'));

    const symbolic = `-${uSym}${gSym}${oSym}`;
    const command = `chmod ${sVal > 0 ? octal4 : octal3} ${fileName}`;

    return { octal3, octal4, symbolic, command };
  }, [ownerRead, ownerWrite, ownerExec, groupRead, groupWrite, groupExec, otherRead, otherWrite, otherExec, suid, sgid, sticky, fileName]);

  const applyOctal = (oct: string) => {
    if (oct.length === 3) {
      const u = parseInt(oct[0], 10);
      const g = parseInt(oct[1], 10);
      const o = parseInt(oct[2], 10);

      setOwnerRead(Boolean(u & 4));
      setOwnerWrite(Boolean(u & 2));
      setOwnerExec(Boolean(u & 1));

      setGroupRead(Boolean(g & 4));
      setGroupWrite(Boolean(g & 2));
      setGroupExec(Boolean(g & 1));

      setOtherRead(Boolean(o & 4));
      setOtherWrite(Boolean(o & 2));
      setOtherExec(Boolean(o & 1));

      setSuid(false);
      setSgid(false);
      setSticky(false);
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-indigo-400" />
              Linux Permissions & Chmod Calculator
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Visual Linux permission matrix calculator. Compute octal notation, symbolic notation, and terminal commands with 1-click presets.
            </p>
          </div>

          <button
            onClick={() => applyOctal('755')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset 755
          </button>
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
              onClick={() => applyOctal(p.octal)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <code className="text-indigo-400 font-bold">{p.octal}</code>
              <span>{p.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Owner (User) */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Owner (User)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-white font-bold">
                {(ownerRead ? 4 : 0) + (ownerWrite ? 2 : 0) + (ownerExec ? 1 : 0)}
              </span>
            </div>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={ownerRead}
                onChange={(e) => setOwnerRead(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Read (r)</span>
                <span className="text-slate-500 ml-2 font-mono">+4</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={ownerWrite}
                onChange={(e) => setOwnerWrite(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Write (w)</span>
                <span className="text-slate-500 ml-2 font-mono">+2</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={ownerExec}
                onChange={(e) => setOwnerExec(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Execute (x)</span>
                <span className="text-slate-500 ml-2 font-mono">+1</span>
              </div>
            </label>
          </div>

          {/* Group */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Group</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-white font-bold">
                {(groupRead ? 4 : 0) + (groupWrite ? 2 : 0) + (groupExec ? 1 : 0)}
              </span>
            </div>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={groupRead}
                onChange={(e) => setGroupRead(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Read (r)</span>
                <span className="text-slate-500 ml-2 font-mono">+4</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={groupWrite}
                onChange={(e) => setGroupWrite(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Write (w)</span>
                <span className="text-slate-500 ml-2 font-mono">+2</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={groupExec}
                onChange={(e) => setGroupExec(e.target.checked)}
                className="w-4 h-4 rounded accent-emerald-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Execute (x)</span>
                <span className="text-slate-500 ml-2 font-mono">+1</span>
              </div>
            </label>
          </div>

          {/* Others (Public) */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Others (Public)</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-white font-bold">
                {(otherRead ? 4 : 0) + (otherWrite ? 2 : 0) + (otherExec ? 1 : 0)}
              </span>
            </div>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={otherRead}
                onChange={(e) => setOtherRead(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Read (r)</span>
                <span className="text-slate-500 ml-2 font-mono">+4</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={otherWrite}
                onChange={(e) => setOtherWrite(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Write (w)</span>
                <span className="text-slate-500 ml-2 font-mono">+2</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-900 cursor-pointer transition">
              <input
                type="checkbox"
                checked={otherExec}
                onChange={(e) => setOtherExec(e.target.checked)}
                className="w-4 h-4 rounded accent-amber-500 cursor-pointer"
              />
              <div className="text-xs">
                <span className="text-white font-medium">Execute (x)</span>
                <span className="text-slate-500 ml-2 font-mono">+1</span>
              </div>
            </label>
          </div>
        </div>

        {/* Special Flags (SUID, SGID, Sticky) */}
        <div className="pt-2 border-t border-slate-800/80">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-3">
            Special Permission Bits
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={suid}
                onChange={(e) => setSuid(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <div className="text-xs">
                <div className="text-white font-medium">SetUID (SUID)</div>
                <div className="text-[11px] text-slate-500 font-mono">Execute as user (+4000)</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={sgid}
                onChange={(e) => setSgid(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <div className="text-xs">
                <div className="text-white font-medium">SetGID (SGID)</div>
                <div className="text-[11px] text-slate-500 font-mono">Execute as group (+2000)</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={sticky}
                onChange={(e) => setSticky(e.target.checked)}
                className="w-4 h-4 rounded accent-indigo-500"
              />
              <div className="text-xs">
                <div className="text-white font-medium">Sticky Bit</div>
                <div className="text-[11px] text-slate-500 font-mono">Only owner can delete (+1000)</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Output Display Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Octal */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Octal Notation</span>
            <button
              onClick={() => copyText(octal3, 'octal')}
              className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
            >
              {copiedKey === 'octal' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'octal' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-3xl font-mono font-bold text-indigo-400 my-2">{octal3}</div>
          <div className="text-[11px] text-slate-500 font-mono">4-digit: {octal4}</div>
        </div>

        {/* Symbolic */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Symbolic Representation</span>
            <button
              onClick={() => copyText(symbolic, 'symbolic')}
              className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
            >
              {copiedKey === 'symbolic' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'symbolic' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400 my-2 tracking-wider">{symbolic}</div>
          <div className="text-[11px] text-slate-500 font-mono">Linux ls -l format</div>
        </div>

        {/* Terminal Command */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Terminal Command</span>
            <button
              onClick={() => copyText(command, 'command')}
              className="text-xs px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
            >
              {copiedKey === 'command' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'command' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-base font-mono font-bold text-amber-300 my-2 truncate">
            {command}
          </div>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="filename"
            className="w-full px-2 py-1 bg-slate-950 border border-slate-800 rounded text-[11px] font-mono text-slate-300"
          />
        </div>
      </div>
    </div>
  );
}

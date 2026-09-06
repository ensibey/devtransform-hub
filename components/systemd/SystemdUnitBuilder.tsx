'use client';

import React, { useState } from 'react';
import { SystemdRecipe } from '@/lib/systemd-recipes-data';
import {
  Copy,
  Check,
  Terminal,
  FileCode,
  Layers,
  Settings2,
  Clock,
  Sparkles,
  HelpCircle,
  Cpu
} from 'lucide-react';

interface SystemdUnitBuilderProps {
  recipe: SystemdRecipe;
}

export function SystemdUnitBuilder({ recipe }: SystemdUnitBuilderProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'service' | 'timer'>('service');
  const [customUser, setCustomUser] = useState(recipe.defaultUser);
  const [customWorkingDir, setCustomWorkingDir] = useState(recipe.defaultWorkingDir);
  const [customExecStart, setCustomExecStart] = useState(recipe.defaultExecStart);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Dynamically tailor unit file content
  const dynamicServiceContent = recipe.unitFileContent
    .replace(new RegExp(`User=${recipe.defaultUser}`, 'g'), `User=${customUser || recipe.defaultUser}`)
    .replace(new RegExp(`Group=${recipe.defaultUser}`, 'g'), `Group=${customUser || recipe.defaultUser}`)
    .replace(new RegExp(`WorkingDirectory=${recipe.defaultWorkingDir}`, 'g'), `WorkingDirectory=${customWorkingDir || recipe.defaultWorkingDir}`)
    .replace(new RegExp(`ExecStart=${recipe.defaultExecStart}`, 'g'), `ExecStart=${customExecStart || recipe.defaultExecStart}`);

  return (
    <div className="space-y-8">
      {/* Unit File Generator Box */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <FileCode className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white font-mono">
              /etc/systemd/system/{activeTab === 'service' ? recipe.unitFileName : (recipe.timerUnitName || 'app.timer')}
            </span>
          </div>

          {recipe.timerUnitContent && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab('service')}
                className={`px-3 py-1 text-xs font-medium rounded transition ${
                  activeTab === 'service'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                .service Unit
              </button>
              <button
                onClick={() => setActiveTab('timer')}
                className={`px-3 py-1 text-xs font-medium rounded transition ${
                  activeTab === 'timer'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                .timer Unit
              </button>
            </div>
          )}
        </div>

        {/* Live File Content */}
        <div className="p-6 bg-slate-950 relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => {
                const textToCopy =
                  activeTab === 'service'
                    ? dynamicServiceContent
                    : (recipe.timerUnitContent || '');
                copyToClipboard(textToCopy, 'unit-file');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition shrink-0 shadow-sm"
            >
              {copiedKey === 'unit-file' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Unit File</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-xs sm:text-sm font-mono text-slate-200 overflow-x-auto p-1 leading-relaxed">
            <code>
              {activeTab === 'service'
                ? dynamicServiceContent
                : (recipe.timerUnitContent || '')}
            </code>
          </pre>

          {/* Dynamic Configuration Controls */}
          {activeTab === 'service' && (
            <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Settings2 className="w-3.5 h-3.5 text-indigo-400" />
                <span className="font-medium text-slate-300">Customize:</span>
              </div>
              <div className="flex items-center gap-2">
                <span>User:</span>
                <input
                  type="text"
                  value={customUser}
                  onChange={(e) => setCustomUser(e.target.value)}
                  placeholder={recipe.defaultUser}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 w-24 font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <span>WorkingDir:</span>
                <input
                  type="text"
                  value={customWorkingDir}
                  onChange={(e) => setCustomWorkingDir(e.target.value)}
                  placeholder={recipe.defaultWorkingDir}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 w-44 font-mono"
                />
              </div>
              <div className="flex items-center gap-2">
                <span>ExecStart:</span>
                <input
                  type="text"
                  value={customExecStart}
                  onChange={(e) => setCustomExecStart(e.target.value)}
                  placeholder={recipe.defaultExecStart}
                  className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 w-52 font-mono"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Systemctl Lifecycle Commands */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400" />
          <span>Systemctl Lifecycle &amp; Journalctl Monitoring</span>
        </h3>

        <div className="space-y-3">
          {recipe.lifecycleCommands.map((cmd, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <code className="text-xs font-mono text-indigo-300 font-semibold block">
                  {cmd.command}
                </code>
                <span className="text-xs text-slate-400 block">
                  {cmd.explanation}
                </span>
              </div>
              <button
                onClick={() => copyToClipboard(cmd.command, `lifecycle-${idx}`)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition self-start sm:self-center shrink-0"
              >
                {copiedKey === `lifecycle-${idx}` ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-medium">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting Tips */}
      {recipe.troubleshootingTips && recipe.troubleshootingTips.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>Linux &amp; Systemd Production Best Practices</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {recipe.troubleshootingTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

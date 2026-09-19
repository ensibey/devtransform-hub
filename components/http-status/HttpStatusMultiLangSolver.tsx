'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Terminal, Code2, Sparkles } from 'lucide-react';
import { getHttpStatusSolutions, HttpStatusSolutions } from '@/lib/http-status-data';

interface HttpStatusMultiLangSolverProps {
  code: number;
  name: string;
}

export function HttpStatusMultiLangSolver({ code, name }: HttpStatusMultiLangSolverProps) {
  const [activeTab, setActiveTab] = useState<'nodejs' | 'python' | 'golang' | 'curl' | 'nginx'>('nodejs');

  const solutions = getHttpStatusSolutions(code, name);

  const tabs: { id: keyof HttpStatusSolutions; label: string; icon: string }[] = [
    { id: 'nodejs', label: 'Node.js / Express', icon: '🟢' },
    { id: 'python', label: 'Python / FastAPI', icon: '🔵' },
    { id: 'golang', label: 'Go (Golang)', icon: '🔷' },
    { id: 'curl', label: 'cURL Terminal', icon: '💻' },
    { id: 'nginx', label: 'Nginx Config', icon: '🌐' },
  ];

  const currentCode = solutions[activeTab];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-7 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" /> Multi-Language Code Implementations
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            How to Handle, Return &amp; Test HTTP {code}
          </h2>
        </div>

        <div className="text-xs text-neutral-400 font-mono">
          Status: <span className="text-white font-bold">{code} {name}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-neutral-800/80 pb-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40 font-semibold'
                : 'bg-neutral-950/60 text-neutral-400 border border-neutral-800 hover:text-white hover:border-neutral-700'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Code Viewer */}
      <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950">
        <div className="flex items-center justify-between px-4 py-2 bg-neutral-900/80 border-b border-neutral-800/80 text-xs text-neutral-400 font-mono">
          <span className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-blue-400" />
            {activeTab === 'nodejs'
              ? 'server.js / handler.ts'
              : activeTab === 'python'
              ? 'main.py'
              : activeTab === 'golang'
              ? 'main.go'
              : activeTab === 'curl'
              ? 'terminal.sh'
              : 'nginx.conf'}
          </span>
          <CopyButton text={currentCode} />
        </div>

        <pre className="p-4 overflow-x-auto text-xs sm:text-sm font-mono text-neutral-200 leading-relaxed">
          <code>{currentCode}</code>
        </pre>
      </div>

      <div className="text-[11px] text-neutral-400 leading-normal">
        💡 <strong className="text-neutral-300">Pro Tip:</strong> Ensure appropriate error handling middleware or proxy interceptors are enabled so client applications receive structured JSON responses for HTTP {code}.
      </div>
    </div>
  );
}

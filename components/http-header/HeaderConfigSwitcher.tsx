'use client';

import React, { useState } from 'react';
import { HttpHeaderItem } from '@/lib/http-headers-data';
import { CopyButton } from '@/components/shared/CopyButton';
import { Server, Terminal, ShieldCheck, AlertTriangle, Layers, Code2 } from 'lucide-react';

interface HeaderConfigSwitcherProps {
  header: HttpHeaderItem;
}

export function HeaderConfigSwitcher({ header }: HeaderConfigSwitcherProps) {
  const [activeTab, setActiveTab] = useState<'nginx' | 'apache' | 'nextjs' | 'express'>('nginx');

  const getConfigCode = () => {
    switch (activeTab) {
      case 'nginx':
        return header.nginxConfig;
      case 'apache':
        return header.apacheConfig;
      case 'nextjs':
        return header.nextjsConfig;
      case 'express':
        return header.expressConfig;
    }
  };

  return (
    <div className="space-y-6">
      {/* Recommended Value Card */}
      <div className="p-5 rounded-2xl bg-surface-100 border border-border shadow-sm space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-emerald" />
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Recommended Production Value
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono border bg-emerald-950/40 text-emerald-400 border-emerald-500/30">
            {header.owaspRating}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-black/70 border border-border flex items-center justify-between gap-3">
          <code className="text-xs sm:text-sm font-mono text-emerald-400 overflow-x-auto whitespace-nowrap">
            {header.recommendedValue}
          </code>
          <CopyButton text={header.recommendedValue} />
        </div>
      </div>

      {/* Server Config Generator Tabs */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-brand-emerald" />
            <span>Production Server Implementation</span>
          </h2>
        </div>

        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-surface-100 border border-border">
          {[
            { id: 'nginx', label: 'NGINX' },
            { id: 'apache', label: 'Apache (.htaccess)' },
            { id: 'nextjs', label: 'Next.js (next.config)' },
            { id: 'express', label: 'Express.js' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-emerald text-black font-bold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-surface-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Box */}
        <div className="rounded-xl bg-surface-100 border border-border overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2 bg-surface-200 border-b border-border text-xs font-mono text-zinc-400">
            <span>{activeTab.toUpperCase()} Configuration Snippet</span>
            <CopyButton text={getConfigCode()} />
          </div>
          <div className="p-4 bg-black/70">
            <pre className="text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
              <code>{getConfigCode()}</code>
            </pre>
          </div>
        </div>
      </div>

      {/* Directives Breakdown */}
      {header.directives.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-2">
            <Layers className="w-4 h-4 text-brand-emerald" />
            <span>Directives &amp; Syntax Breakdown</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {header.directives.map((dir, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-surface-100 border border-border space-y-1.5"
              >
                <div className="font-mono text-xs font-bold text-brand-emerald">
                  {dir.name}
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {dir.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Pitfalls */}
      {header.pitfalls.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-950/20 via-surface-100 to-surface-100 border border-rose-500/30 space-y-2.5">
          <div className="flex items-center space-x-2 text-rose-400">
            <AlertTriangle className="w-4 h-4" />
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider">
              Common Security Hazards &amp; Pitfalls
            </h4>
          </div>
          <ul className="space-y-1.5 text-xs text-zinc-300">
            {header.pitfalls.map((p, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="text-rose-400 font-bold">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

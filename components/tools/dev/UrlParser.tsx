'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Link2, Plus, Trash2, Sliders, Check } from 'lucide-react';

interface ParamItem {
  id: string;
  key: string;
  value: string;
}

export function UrlParser() {
  const [rawUrl, setRawUrl] = useState(
    'https://devtransform-hub.vercel.app/tools/json-formatter?theme=dark&tab=active&query=test%20search#preview-anchor'
  );

  const parsed = useMemo(() => {
    try {
      const u = new URL(rawUrl);
      const paramsList: ParamItem[] = [];
      u.searchParams.forEach((val, k) => {
        paramsList.push({ id: Math.random().toString(), key: k, value: val });
      });

      return {
        protocol: u.protocol,
        hostname: u.hostname,
        port: u.port || '(default 80/443)',
        pathname: u.pathname,
        hash: u.hash,
        search: u.search,
        params: paramsList,
        origin: u.origin,
        valid: true,
      };
    } catch {
      return {
        protocol: '',
        hostname: '',
        port: '',
        pathname: '',
        hash: '',
        search: '',
        params: [],
        origin: '',
        valid: false,
      };
    }
  }, [rawUrl]);

  return (
    <div className="space-y-6">
      {/* URL Input Strip */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5 text-white font-bold">
            <Link2 className="w-4 h-4 text-brand-emerald" />
            <span>Target URL to Parse & Inspect:</span>
          </span>
          <CopyButton text={rawUrl} />
        </div>

        <input
          type="text"
          value={rawUrl}
          onChange={(e) => setRawUrl(e.target.value)}
          placeholder="https://example.com/path?param=value#hash"
          className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 focus:outline-none focus:border-brand-emerald"
        />
      </div>

      {/* Breakdown Breakdown Cards */}
      {parsed.valid ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-500 uppercase">Protocol:</span>
            <div className="text-sm font-bold text-brand-emerald truncate">{parsed.protocol}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-500 uppercase">Hostname:</span>
            <div className="text-sm font-bold text-sky-400 truncate">{parsed.hostname}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-500 uppercase">Pathname:</span>
            <div className="text-sm font-bold text-amber-400 truncate">{parsed.pathname}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-1">
            <span className="text-[11px] text-zinc-500 uppercase">Hash / Fragment:</span>
            <div className="text-sm font-bold text-violet-400 truncate">{parsed.hash || '(none)'}</div>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
          ⚠️ Please enter a valid URL with protocol (e.g. https://...).
        </div>
      )}

      {/* Query Parameters Grid */}
      {parsed.valid && (
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="font-bold text-white">Extracted Query Parameters ({parsed.params.length}):</span>
          </div>

          {parsed.params.length > 0 ? (
            <div className="space-y-2">
              {parsed.params.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs"
                >
                  <div className="w-1/3 text-brand-emerald font-bold truncate">{p.key}</div>
                  <div className="text-zinc-600">=</div>
                  <div className="flex-1 text-zinc-200 truncate">{p.value}</div>
                  <CopyButton text={p.value} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs font-mono text-zinc-500 italic p-3 text-center">
              No query parameters found in this URL.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

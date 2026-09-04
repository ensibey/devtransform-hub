'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { ShieldCheck, Lock, Code, Check, Sparkles, Server } from 'lucide-react';

export function HttpSecurityHeadersGenerator() {
  const [hsts, setHsts] = useState(true);
  const [hstsSubdomains, setHstsSubdomains] = useState(true);
  const [hstsPreload, setHstsPreload] = useState(true);
  const [xFrame, setXFrame] = useState<'DENY' | 'SAMEORIGIN' | 'OFF'>('DENY');
  const [xContentType, setXContentType] = useState(true);
  const [referrerPolicy, setReferrerPolicy] = useState('strict-origin-when-cross-origin');
  const [cspEnabled, setCspEnabled] = useState(true);
  const [permissionsPolicy, setPermissionsPolicy] = useState(true);
  const [activeTab, setActiveTab] = useState<'nginx' | 'nextjs' | 'apache' | 'caddy' | 'cloudflare'>('nginx');

  const headersMap = useMemo(() => {
    const list: { name: string; value: string }[] = [];

    if (hsts) {
      let val = 'max-age=31536000';
      if (hstsSubdomains) val += '; includeSubDomains';
      if (hstsPreload) val += '; preload';
      list.push({ name: 'Strict-Transport-Security', value: val });
    }

    if (xFrame !== 'OFF') {
      list.push({ name: 'X-Frame-Options', value: xFrame });
    }

    if (xContentType) {
      list.push({ name: 'X-Content-Type-Options', value: 'nosniff' });
    }

    if (referrerPolicy !== 'OFF') {
      list.push({ name: 'Referrer-Policy', value: referrerPolicy });
    }

    if (cspEnabled) {
      list.push({
        name: 'Content-Security-Policy',
        value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';",
      });
    }

    if (permissionsPolicy) {
      list.push({
        name: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      });
    }

    return list;
  }, [hsts, hstsSubdomains, hstsPreload, xFrame, xContentType, referrerPolicy, cspEnabled, permissionsPolicy]);

  const exportCode = useMemo(() => {
    switch (activeTab) {
      case 'nginx':
        return headersMap
          .map((h) => `add_header ${h.name} "${h.value}" always;`)
          .join('\n');

      case 'nextjs': {
        const jsonHeaders = headersMap.map((h) => ({
          key: h.name,
          value: h.value,
        }));
        return `// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: ${JSON.stringify(jsonHeaders, null, 10).replace(/^ {10}/gm, '          ')},
      },
    ];
  },
};`;
      }

      case 'apache':
        return `<IfModule mod_headers.c>\n${headersMap
          .map((h) => `  Header always set ${h.name} "${h.value}"`)
          .join('\n')}\n</IfModule>`;

      case 'caddy':
        return `header {\n${headersMap
          .map((h) => `    ${h.name} "${h.value}"`)
          .join('\n')}\n}`;

      case 'cloudflare':
        return `// Cloudflare Worker / Edge Middleware
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  const newHeaders = new Headers(response.headers);
${headersMap.map((h) => `  newHeaders.set('${h.name}', '${h.value}');`).join('\n')}
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}`;

      default:
        return '';
    }
  }, [headersMap, activeTab]);

  return (
    <div className="space-y-6">
      {/* Interactive Header Toggles */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-emerald" />
            <h3 className="text-sm font-semibold text-white">HTTP Security Headers Configuration</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-brand-emerald border border-emerald-500/30">
            A+ Security Grade
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
          {/* HSTS */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">Strict-Transport-Security (HSTS)</span>
              <input
                type="checkbox"
                checked={hsts}
                onChange={(e) => setHsts(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-brand-emerald focus:ring-0 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-400">Forces browser to communicate only over encrypted HTTPS.</p>
            {hsts && (
              <div className="flex items-center space-x-3 text-[11px] font-mono text-zinc-400 pt-1">
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hstsSubdomains}
                    onChange={(e) => setHstsSubdomains(e.target.checked)}
                    className="rounded text-brand-emerald text-xs"
                  />
                  <span>includeSubDomains</span>
                </label>
                <label className="flex items-center space-x-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hstsPreload}
                    onChange={(e) => setHstsPreload(e.target.checked)}
                    className="rounded text-brand-emerald text-xs"
                  />
                  <span>preload</span>
                </label>
              </div>
            )}
          </div>

          {/* X-Frame-Options */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">X-Frame-Options (Clickjacking)</span>
              <select
                value={xFrame}
                onChange={(e) => setXFrame(e.target.value as any)}
                className="px-2 py-1 bg-black border border-zinc-700 rounded-lg text-xs font-mono text-brand-emerald focus:outline-none"
              >
                <option value="DENY">DENY (Strict)</option>
                <option value="SAMEORIGIN">SAMEORIGIN</option>
                <option value="OFF">Disabled</option>
              </select>
            </div>
            <p className="text-[11px] text-zinc-400">Prevents site from being embedded into hostile iframes.</p>
          </div>

          {/* X-Content-Type-Options */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">X-Content-Type-Options</span>
              <input
                type="checkbox"
                checked={xContentType}
                onChange={(e) => setXContentType(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-brand-emerald focus:ring-0 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-400">Blocks MIME-type sniffing (nosniff) attacks.</p>
          </div>

          {/* Referrer-Policy */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">Referrer-Policy</span>
              <select
                value={referrerPolicy}
                onChange={(e) => setReferrerPolicy(e.target.value)}
                className="px-2 py-1 bg-black border border-zinc-700 rounded-lg text-xs font-mono text-brand-emerald focus:outline-none"
              >
                <option value="strict-origin-when-cross-origin">strict-origin-when-cross-origin</option>
                <option value="no-referrer">no-referrer</option>
                <option value="same-origin">same-origin</option>
                <option value="OFF">Disabled</option>
              </select>
            </div>
            <p className="text-[11px] text-zinc-400">Controls how much referrer information is sent with outbound requests.</p>
          </div>

          {/* Content-Security-Policy (CSP) */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">Content-Security-Policy (CSP)</span>
              <input
                type="checkbox"
                checked={cspEnabled}
                onChange={(e) => setCspEnabled(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-brand-emerald focus:ring-0 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-400">Mitigates Cross-Site Scripting (XSS) and data injection.</p>
          </div>

          {/* Permissions-Policy */}
          <div className="p-3.5 bg-zinc-950/60 rounded-xl border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-white">Permissions-Policy</span>
              <input
                type="checkbox"
                checked={permissionsPolicy}
                onChange={(e) => setPermissionsPolicy(e.target.checked)}
                className="rounded bg-zinc-800 border-zinc-700 text-brand-emerald focus:ring-0 cursor-pointer"
              />
            </div>
            <p className="text-[11px] text-zinc-400">Restricts browser hardware access (camera, mic, geo).</p>
          </div>
        </div>
      </div>

      {/* Code Export Tabs */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'nginx', label: 'Nginx' },
              { id: 'nextjs', label: 'Next.js' },
              { id: 'apache', label: 'Apache' },
              { id: 'caddy', label: 'Caddy' },
              { id: 'cloudflare', label: 'Cloudflare' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                  activeTab === tab.id
                    ? 'bg-brand-emerald text-black font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <CopyButton text={exportCode} />
        </div>

        <div className="relative">
          <textarea
            readOnly
            value={exportCode}
            rows={10}
            className="w-full p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
}

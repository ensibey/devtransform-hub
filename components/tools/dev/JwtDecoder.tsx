'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { ShieldCheck, AlertCircle, CheckCircle2, Key, Clock } from 'lucide-react';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNhcmFoIENvbm5vciIsImFkbWluIjp0cnVlLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTk1MTYyMzkwMn0.4z2k9L8e6Q...';

export function JwtDecoder() {
  const [token, setToken] = useState(SAMPLE_JWT);

  const decoded = useMemo(() => {
    try {
      const parts = token.trim().split('.');
      if (parts.length < 2) {
        return { error: 'Invalid JWT structure: Token must contain at least 2 dot-separated parts.' };
      }

      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
          base64 += '=';
        }
        return JSON.parse(decodeURIComponent(escape(atob(base64))));
      };

      const header = decodeBase64Url(parts[0]);
      const payload = decodeBase64Url(parts[1]);
      const signature = parts[2] || '';

      let isExpired = false;
      let expDate: string | null = null;
      let iatDate: string | null = null;

      if (payload.exp) {
        const expTime = payload.exp * 1000;
        expDate = new Date(expTime).toLocaleString();
        isExpired = Date.now() > expTime;
      }

      if (payload.iat) {
        iatDate = new Date(payload.iat * 1000).toLocaleString();
      }

      return {
        header,
        payload,
        signature,
        isExpired,
        expDate,
        iatDate,
        error: null,
      };
    } catch (err: any) {
      return { error: 'Failed to decode token: ' + (err.message || String(err)) };
    }
  }, [token]);

  return (
    <div className="space-y-6">
      {/* Input JWT */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label className="text-zinc-400 font-mono">ENCODED JWT TOKEN</label>
          <button
            type="button"
            onClick={() => setToken(SAMPLE_JWT)}
            className="text-brand-emerald hover:underline"
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your Bearer / JWT token here..."
          rows={4}
          className="w-full p-3 bg-surface-200 border border-border rounded-xl text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-brand-emerald resize-none leading-relaxed"
        />
      </div>

      {/* Validation Status Pill */}
      {decoded.error ? (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{decoded.error}</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-surface-200 border border-border rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Token Status:</span>
            {decoded.isExpired ? (
              <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                EXPIRED ({decoded.expDate})
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-brand-emerald font-bold">
                VALID (Expires: {decoded.expDate || 'No exp claim'})
              </span>
            )}
          </div>

          <div className="p-3 bg-surface-200 border border-border rounded-xl flex items-center justify-between">
            <span className="text-zinc-400">Issued At (iat):</span>
            <span className="text-zinc-200 font-semibold">{decoded.iatDate || 'N/A'}</span>
          </div>
        </div>
      )}

      {/* Decoded Header & Payload Panels */}
      {!decoded.error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Header */}
          <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 bg-surface-300 border-b border-border text-xs">
              <span className="font-mono text-rose-400 font-semibold">HEADER: ALGORITHM & TOKEN TYPE</span>
              <CopyButton text={JSON.stringify(decoded.header, null, 2)} />
            </div>
            <pre className="p-4 bg-oled font-mono text-xs text-rose-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(decoded.header, null, 2)}
            </pre>
          </div>

          {/* Payload */}
          <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 bg-surface-300 border-b border-border text-xs">
              <span className="font-mono text-violet-400 font-semibold">PAYLOAD: DATA & CLAIMS</span>
              <CopyButton text={JSON.stringify(decoded.payload, null, 2)} />
            </div>
            <pre className="p-4 bg-oled font-mono text-xs text-violet-300 overflow-x-auto leading-relaxed">
              {JSON.stringify(decoded.payload, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

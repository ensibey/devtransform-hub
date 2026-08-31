'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Globe, Search, RefreshCw, Server, ShieldCheck, Check } from 'lucide-react';

interface DnsRecord {
  name: string;
  type: number;
  TTL: number;
  data: string;
}

const RECORD_TYPES = ['A', 'AAAA', 'MX', 'TXT', 'CNAME', 'NS', 'SOA'] as const;

const TYPE_NAME_MAP: Record<number, string> = {
  1: 'A',
  28: 'AAAA',
  15: 'MX',
  16: 'TXT',
  5: 'CNAME',
  2: 'NS',
  6: 'SOA',
};

export function DnsInspector() {
  const [domain, setDomain] = useState('google.com');
  const [recordType, setRecordType] = useState<string>('A');
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<DnsRecord[]>([
    { name: 'google.com.', type: 1, TTL: 300, data: '142.250.187.206' },
    { name: 'google.com.', type: 1, TTL: 300, data: '142.250.187.238' },
  ]);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const fetchDns = async (targetDomain?: string, targetType?: string) => {
    const d = (targetDomain || domain).trim().replace(/^https?:\/\//, '').split('/')[0];
    const t = targetType || recordType;
    if (!d) return;

    setLoading(true);
    setStatusMsg('');

    try {
      const res = await fetch(`https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(d)}&type=${encodeURIComponent(t)}`, {
        headers: {
          Accept: 'application/dns-json',
        },
      });

      if (!res.ok) {
        throw new Error(`DNS Query failed with HTTP ${res.status}`);
      }

      const data = await res.json();
      if (data.Answer && Array.isArray(data.Answer)) {
        setRecords(data.Answer);
        setStatusMsg(`Found ${data.Answer.length} ${t} record(s).`);
      } else {
        setRecords([]);
        setStatusMsg(`No ${t} records found for ${d}.`);
      }
    } catch (err: any) {
      setRecords([]);
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Domain Input & Query Bar */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
          <Globe className="w-4 h-4 text-brand-emerald" />
          <span>Live DNS over HTTPS (DoH) Resolver</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchDns()}
              placeholder="e.g. vercel.com, github.com, google.com"
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white focus:outline-none focus:border-brand-emerald placeholder-zinc-600"
            />
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={recordType}
              onChange={(e) => {
                setRecordType(e.target.value);
                fetchDns(domain, e.target.value);
              }}
              className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald"
            >
              {RECORD_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t} Record
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => fetchDns()}
              disabled={loading}
              className="px-5 py-3 rounded-xl bg-brand-emerald hover:bg-emerald-400 text-black font-mono font-bold text-xs transition-colors flex items-center space-x-1.5 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Lookup</span>
            </button>
          </div>
        </div>

        {/* Record Type Quick Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-800 text-xs font-mono">
          {RECORD_TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setRecordType(t);
                fetchDns(domain, t);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                recordType === t
                  ? 'bg-zinc-800 text-brand-emerald font-bold border border-zinc-700'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-white font-bold flex items-center space-x-2">
            <Server className="w-4 h-4 text-brand-emerald" />
            <span>Resolved DNS Records:</span>
          </span>
          <span className="text-zinc-400">{statusMsg}</span>
        </div>

        {records.length > 0 ? (
          <div className="space-y-2 font-mono text-xs">
            {records.map((r, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-brand-emerald border border-emerald-500/30 text-[10px] font-bold">
                    {TYPE_NAME_MAP[r.type] || r.type}
                  </span>
                  <span className="text-zinc-400 text-xs truncate">{r.name}</span>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-zinc-500 text-[11px]">TTL: {r.TTL}s</span>
                  <span className="text-white font-bold break-all select-all">{r.data}</span>
                  <CopyButton text={r.data} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-500">
            {loading ? 'Resolving DNS records from Cloudflare 1.1.1.1...' : 'No records returned for this query.'}
          </div>
        )}
      </div>
    </div>
  );
}

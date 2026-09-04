'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { ShieldCheck, EyeOff, Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';

const SAMPLE_LOG = `[2026-09-04 03:20:11.450] INFO: User login attempt
User email: john.doe@enterprise.corp
IP address: 198.51.100.42
Card on file: 4111-2222-3333-4444
Auth bearer: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozGzN_ce9Trqnh9xsmvrmA6Y8b0VfP_w1sL8sR
Contact phone: +1-555-839-2001
API key provided: sec_demo_948fba02c1149e83204910a9fbc
Payment status: APPROVED for amount $149.00`;

export function DataAnonymizerMasker() {
  const [inputText, setInputText] = useState(SAMPLE_LOG);
  const [maskEmails, setMaskEmails] = useState(true);
  const [maskCards, setMaskCards] = useState(true);
  const [maskIps, setMaskIps] = useState(true);
  const [maskPhones, setMaskPhones] = useState(true);
  const [maskJwts, setMaskJwts] = useState(true);
  const [maskApiKeys, setMaskApiKeys] = useState(true);

  const { maskedText, redactedCount } = useMemo(() => {
    let text = inputText;
    let count = 0;

    // Credit Cards
    if (maskCards) {
      text = text.replace(/\b(?:\d{4}[ -]?){3}(\d{4})\b/g, () => {
        count++;
        return '****-****-****-$1';
      });
    }

    // Emails
    if (maskEmails) {
      text = text.replace(/\b([a-zA-Z0-9_.+-])([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)\b/g, (_, first, rest, domain) => {
        count++;
        return `${first}${'*'.repeat(Math.min(rest.length, 5))}@${domain}`;
      });
    }

    // IPv4 Addresses
    if (maskIps) {
      text = text.replace(/\b(\d{1,3}\.\d{1,3})\.\d{1,3}\.\d{1,3}\b/g, (_, prefix) => {
        count++;
        return `${prefix}.***.***`;
      });
    }

    // JWT Tokens
    if (maskJwts) {
      text = text.replace(/\beyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\b/g, () => {
        count++;
        return '[REDACTED_JWT_TOKEN]';
      });
    }

    // API Keys (sk_live_..., ghp_..., etc.)
    if (maskApiKeys) {
      text = text.replace(/\b(sk_live_|ghp_|ak_|sec_)[a-zA-Z0-9_-]{12,}\b/g, (_, prefix) => {
        count++;
        return `${prefix}[REDACTED_SECRET]`;
      });
    }

    // Phone numbers
    if (maskPhones) {
      text = text.replace(/\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?(\d{4})\b/g, () => {
        count++;
        return '***-***-$1';
      });
    }

    return { maskedText: text, redactedCount: count };
  }, [inputText, maskEmails, maskCards, maskIps, maskPhones, maskJwts, maskApiKeys]);

  return (
    <div className="space-y-6">
      {/* Toggles & Sanitization Stats */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-emerald" />
            <span className="text-sm font-semibold text-white">PII Data Masking Filters</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-brand-emerald/10 text-brand-emerald border border-brand-emerald/20">
              {redactedCount} Sensitive Items Redacted
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-xs font-mono">
          <label className="flex items-center space-x-1.5 cursor-pointer text-zinc-300 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <input
              type="checkbox"
              checked={maskEmails}
              onChange={(e) => setMaskEmails(e.target.checked)}
              className="rounded bg-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>Emails</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer text-zinc-300 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <input
              type="checkbox"
              checked={maskCards}
              onChange={(e) => setMaskCards(e.target.checked)}
              className="rounded bg-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>Credit Cards</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer text-zinc-300 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <input
              type="checkbox"
              checked={maskIps}
              onChange={(e) => setMaskIps(e.target.checked)}
              className="rounded bg-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>IP Addresses</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer text-zinc-300 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <input
              type="checkbox"
              checked={maskJwts}
              onChange={(e) => setMaskJwts(e.target.checked)}
              className="rounded bg-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>JWT Tokens</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer text-zinc-300 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <input
              type="checkbox"
              checked={maskApiKeys}
              onChange={(e) => setMaskApiKeys(e.target.checked)}
              className="rounded bg-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>API Keys</span>
          </label>

          <label className="flex items-center space-x-1.5 cursor-pointer text-zinc-300 p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
            <input
              type="checkbox"
              checked={maskPhones}
              onChange={(e) => setMaskPhones(e.target.checked)}
              className="rounded bg-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>Phone Numbers</span>
          </label>
        </div>
      </div>

      {/* Editor Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Raw Log Input */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Original Log / Payload with PII
            </span>
            <button
              type="button"
              onClick={() => setInputText(SAMPLE_LOG)}
              className="text-[11px] font-mono text-brand-emerald hover:underline"
            >
              Load Sample
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={14}
            placeholder="Paste logs, stack traces, or customer payloads here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-xs focus:border-brand-emerald focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Sanitized Output */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
              <EyeOff className="w-3.5 h-3.5 text-brand-emerald" />
              Sanitized & Masked Output (Safe for LLMs / Sharing)
            </span>
            <CopyButton text={maskedText} />
          </div>
          <textarea
            readOnly
            value={maskedText}
            rows={14}
            placeholder="Sanitized text will appear here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
}

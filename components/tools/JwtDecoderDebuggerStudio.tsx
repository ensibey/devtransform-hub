'use client';

import React, { useState, useMemo } from 'react';
import { Key, Copy, Check, Sparkles, RefreshCw, CheckCircle2, AlertTriangle, Clock, Shield } from 'lucide-react';

const SAMPLE_JWT = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c3JfOTA4MTI0MSIsIm5hbWUiOiJBbGV4IENvbm5vciIsImVtYWlsIjoiYWxleEBkZXZ0cmFuc2Zvcm0uaHViIiwicm9sZSI6InNlbmlvcl9kZXZlbG9wZXIiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNzA0MDY3MjAwLCJleHAiOjE3OTg3NjE2MDB9.dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk`;

// Safe Base64URL decode
function base64UrlDecode(str: string): string {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    return decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  } catch {
    return '';
  }
}

export function JwtDecoderDebuggerStudio() {
  const [jwtInput, setJwtInput] = useState<string>(SAMPLE_JWT);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const { headerJson, payloadJson, signature, error, expDate, iatDate, isExpired } = useMemo(() => {
    if (!jwtInput.trim()) {
      return {
        headerJson: '',
        payloadJson: '',
        signature: '',
        error: null,
        expDate: null,
        iatDate: null,
        isExpired: false,
      };
    }

    const parts = jwtInput.trim().split('.');
    if (parts.length !== 3) {
      return {
        headerJson: '',
        payloadJson: '',
        signature: '',
        error: 'Invalid JWT format: A valid token must contain 3 dot-separated segments (Header.Payload.Signature).',
        expDate: null,
        iatDate: null,
        isExpired: false,
      };
    }

    try {
      const headerStr = base64UrlDecode(parts[0]);
      const payloadStr = base64UrlDecode(parts[1]);

      if (!headerStr || !payloadStr) {
        throw new Error('Failed to decode Base64Url segment');
      }

      const headerObj = JSON.parse(headerStr);
      const payloadObj = JSON.parse(payloadStr);

      let expDate: Date | null = null;
      let isExpired = false;
      if (typeof payloadObj.exp === 'number') {
        expDate = new Date(payloadObj.exp * 1000);
        isExpired = Date.now() > expDate.getTime();
      }

      let iatDate: Date | null = null;
      if (typeof payloadObj.iat === 'number') {
        iatDate = new Date(payloadObj.iat * 1000);
      }

      return {
        headerJson: JSON.stringify(headerObj, null, 2),
        payloadJson: JSON.stringify(payloadObj, null, 2),
        signature: parts[2],
        error: null,
        expDate,
        iatDate,
        isExpired,
      };
    } catch (err: any) {
      return {
        headerJson: '',
        payloadJson: '',
        signature: '',
        error: err.message || 'Corrupt or non-decodable JWT segment',
        expDate: null,
        iatDate: null,
        isExpired: false,
      };
    }
  }, [jwtInput]);

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
              <Key className="w-6 h-6 text-indigo-400" />
              JWT Debugger & Decoder Studio
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Decode JSON Web Tokens instantly with real-time expiration inspection and 100% zero-upload client privacy.
            </p>
          </div>

          <button
            onClick={() => setJwtInput(SAMPLE_JWT)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sample
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Encoded Token (Paste JWT)
        </label>
        <textarea
          value={jwtInput}
          onChange={(e) => setJwtInput(e.target.value.trim())}
          rows={5}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 break-all leading-relaxed"
        />

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-400 text-xs font-mono flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Expiration Status Banner */}
        {expDate && (
          <div
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
              isExpired
                ? 'bg-rose-950/30 border-rose-900/60 text-rose-300'
                : 'bg-emerald-950/30 border-emerald-900/60 text-emerald-300'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-medium">
              <Clock className="w-4 h-4" />
              <span>
                Status: <strong>{isExpired ? 'TOKEN EXPIRED' : 'TOKEN ACTIVE (VALID)'}</strong>
              </span>
            </div>
            <div className="text-xs font-mono opacity-90">
              Exp: {expDate.toLocaleDateString()} {expDate.toLocaleTimeString()}
              {iatDate && ` • Issued: ${iatDate.toLocaleDateString()}`}
            </div>
          </div>
        )}
      </div>

      {/* Decoded Sections (Header, Payload, Signature) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Header (Algorithm & Token Type)
            </span>
            <button
              onClick={() => copyText(headerJson, 'header')}
              disabled={!headerJson}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
            >
              {copiedKey === 'header' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'header' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-rose-300 overflow-x-auto whitespace-pre leading-relaxed">
            {headerJson || '// Awaiting valid token...'}
          </pre>
        </div>

        {/* Payload */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="w-4 h-4" />
              Payload (Claims & User Data)
            </span>
            <button
              onClick={() => copyText(payloadJson, 'payload')}
              disabled={!payloadJson}
              className="text-xs px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1"
            >
              {copiedKey === 'payload' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              {copiedKey === 'payload' ? 'Copied' : 'Copy'}
            </button>
          </div>
          <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
            {payloadJson || '// Awaiting valid token...'}
          </pre>
        </div>
      </div>
    </div>
  );
}

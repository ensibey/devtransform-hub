'use client';

import React, { useState, useMemo } from 'react';
import { FileCode, Copy, Check, Sparkles, RefreshCw, Minimize2, Maximize2, AlertCircle } from 'lucide-react';

const SAMPLE_JSON = `{
  "projectName": "DevTransform Hub",
  "version": "2.4.0",
  "isProduction": true,
  "telemetry": {
    "enabled": false,
    "storage": "0-server",
    "network": "offline-first"
  },
  "tools": [
    { "id": 1, "name": "Base64 Image Studio" },
    { "id": 2, "name": "Aspect Ratio Calculator" }
  ]
}`;

export function JsonMinifierBeautifierStudio() {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [indentOption, setIndentOption] = useState<number | '\t'>(2);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse & process
  const { minified, beautified, error, originalBytes, minifiedBytes, savingsPercent } = useMemo(() => {
    if (!jsonInput.trim()) {
      return {
        minified: '',
        beautified: '',
        error: null,
        originalBytes: 0,
        minifiedBytes: 0,
        savingsPercent: 0,
      };
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const minified = JSON.stringify(parsed);
      const beautified = JSON.stringify(parsed, null, indentOption);

      const origBytes = new Blob([jsonInput]).size;
      const minBytes = new Blob([minified]).size;
      const savings = origBytes > 0 ? Math.max(0, Math.round(((origBytes - minBytes) / origBytes) * 100)) : 0;

      return {
        minified,
        beautified,
        error: null,
        originalBytes: origBytes,
        minifiedBytes: minBytes,
        savingsPercent: savings,
      };
    } catch (err: any) {
      return {
        minified: '',
        beautified: '',
        error: err.message,
        originalBytes: new Blob([jsonInput]).size,
        minifiedBytes: 0,
        savingsPercent: 0,
      };
    }
  }, [jsonInput, indentOption]);

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileCode className="w-6 h-6 text-indigo-400" />
              JSON Minifier & Beautifier Studio
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Minify JSON payloads to reduce bandwidth and latency, or beautify compact JSON with 2-space, 4-space, or tab indentation.
            </p>
          </div>

          <button
            onClick={() => setJsonInput(SAMPLE_JSON)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sample
          </button>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Original Size</span>
            <span className="text-lg font-mono font-bold text-white">{originalBytes} B</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Minified Size</span>
            <span className="text-lg font-mono font-bold text-indigo-400">{minifiedBytes} B</span>
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-medium">Payload Reduction</span>
            <span className="text-lg font-mono font-bold text-emerald-400">-{savingsPercent}%</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Indent:</span>
          {[
            { id: 2, label: '2 Spaces' },
            { id: 4, label: '4 Spaces' },
            { id: '\t', label: 'Tabs' },
          ].map((opt) => (
            <button
              key={opt.label}
              onClick={() => setIndentOption(opt.id as any)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                indentOption === opt.id
                  ? 'bg-indigo-600 text-white border-indigo-500 font-semibold'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => {
            if (minified) setJsonInput(minified);
          }}
          disabled={!minified}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold transition flex items-center gap-2"
        >
          <Minimize2 className="w-4 h-4" />
          Minify in Editor
        </button>

        <button
          onClick={() => {
            if (beautified) setJsonInput(beautified);
          }}
          disabled={!beautified}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition flex items-center gap-2"
        >
          <Maximize2 className="w-4 h-4" />
          Beautify in Editor
        </button>

        <button
          onClick={() => copyText(minified)}
          disabled={!minified}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-semibold transition flex items-center gap-2"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy Minified'}
        </button>
      </div>

      {/* Editor Area */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          JSON Content
        </label>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          rows={16}
          placeholder="Paste JSON here..."
          className="w-full p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
        />

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            Syntax Error: {error}
          </div>
        )}
      </div>
    </div>
  );
}

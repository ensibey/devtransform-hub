'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Sparkles, Minimize2, CheckCircle2, AlertCircle, Trash2 } from 'lucide-react';

export function JsonFormatterValidator() {
  const [jsonInput, setJsonInput] = useState(`{\n  "project": "DevTransform",\n  "version": "1.0.0",\n  "features": [\n    "100% Client-Side",\n    "Web Worker AST processing",\n    "Zero Server Footprint"\n  ],\n  "author": {\n    "name": "DevTeam",\n    "openSource": true\n  }\n}`);

  const [diagnostic, setDiagnostic] = useState<string | null>(null);

  const validateAndFormat = (minify = false) => {
    try {
      const parsed = JSON.parse(jsonInput);
      setDiagnostic(null);
      if (minify) {
        setJsonInput(JSON.stringify(parsed));
      } else {
        setJsonInput(JSON.stringify(parsed, null, 2));
      }
    } catch (err: any) {
      setDiagnostic(err.message || 'Invalid JSON syntax');
    }
  };

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-surface-200 border border-border text-xs">
        <div className="flex items-center space-x-2">
          {diagnostic ? (
            <div className="flex items-center space-x-1.5 text-rose-400 font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="truncate max-w-sm">{diagnostic}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-emerald-400 font-mono">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Valid JSON Syntax</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => validateAndFormat(false)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-300 hover:bg-surface-50 text-zinc-200 border border-border transition-colors font-medium cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Prettify / Format</span>
          </button>

          <button
            type="button"
            onClick={() => validateAndFormat(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface-300 hover:bg-surface-50 text-zinc-200 border border-border transition-colors font-medium cursor-pointer"
          >
            <Minimize2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Minify</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setJsonInput('');
              setDiagnostic(null);
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
            title="Clear input"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <CopyButton text={jsonInput} />
        </div>
      </div>

      {/* Editor Surface */}
      <div className="rounded-xl border border-border bg-oled overflow-hidden h-[480px]">
        <textarea
          value={jsonInput}
          onChange={(e) => {
            const val = e.target.value;
            setJsonInput(val);
            try {
              if (val.trim()) {
                JSON.parse(val);
                setDiagnostic(null);
              }
            } catch (err: any) {
              setDiagnostic(err.message || 'Invalid JSON syntax');
            }
          }}
          spellCheck={false}
          className="w-full h-full p-4 bg-oled text-zinc-100 font-mono text-xs focus:outline-none resize-none leading-relaxed"
          placeholder="Paste or type JSON payload here..."
        />
      </div>
    </div>
  );
}

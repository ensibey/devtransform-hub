'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileCode, Sparkles, Check, AlertCircle } from 'lucide-react';

const SAMPLE_JSON = `{
  "status": "success",
  "code": 200,
  "config": {
    "app_name": "DevTransform",
    "debug": false,
    "max_retries": 5,
    "database": {
      "host": "127.0.0.1",
      "port": 5432,
      "user": "postgres",
      "password": null
    }
  },
  "tags": ["php", "laravel", "array", "developer-tools"]
}`;

function serializeToPhp(val: any, indentLevel: number = 1, shortSyntax: boolean = true): string {
  const indent = '  '.repeat(indentLevel);
  const closingIndent = '  '.repeat(indentLevel - 1);

  if (val === null) return 'null';
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') {
    const escaped = val.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    return `'${escaped}'`;
  }

  if (Array.isArray(val)) {
    if (val.length === 0) return shortSyntax ? '[]' : 'array()';
    const items = val.map((item) => `${indent}${serializeToPhp(item, indentLevel + 1, shortSyntax)}`);
    const open = shortSyntax ? '[' : 'array(';
    const close = shortSyntax ? ']' : ')';
    return `${open}\n${items.join(',\n')}\n${closingIndent}${close}`;
  }

  if (typeof val === 'object') {
    const entries = Object.entries(val);
    if (entries.length === 0) return shortSyntax ? '[]' : 'array()';
    const items = entries.map(([k, v]) => {
      const keyEscaped = `'${k.replace(/'/g, "\\'")}'`;
      return `${indent}${keyEscaped} => ${serializeToPhp(v, indentLevel + 1, shortSyntax)}`;
    });
    const open = shortSyntax ? '[' : 'array(';
    const close = shortSyntax ? ']' : ')';
    return `${open}\n${items.join(',\n')}\n${closingIndent}${close}`;
  }

  return 'null';
}

export function JsonToPhpArrayConverter() {
  const [jsonInput, setJsonInput] = useState(SAMPLE_JSON);
  const [shortSyntax, setShortSyntax] = useState(true);
  const [variableName, setVariableName] = useState('data');

  const { phpCode, error } = useMemo(() => {
    try {
      if (!jsonInput.trim()) {
        return { phpCode: '', error: null };
      }

      const parsed = JSON.parse(jsonInput);
      const phpArrayStr = serializeToPhp(parsed, 1, shortSyntax);
      const varPrefix = variableName.trim() ? `$${variableName.trim().replace(/^\$/, '')} = ` : '';
      const fullPhp = `<?php\n\n${varPrefix}${phpArrayStr};\n`;

      return { phpCode: fullPhp, error: null };
    } catch (err: any) {
      return { phpCode: '', error: `Invalid JSON: ${err.message}` };
    }
  }, [jsonInput, shortSyntax, variableName]);

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">Syntax Style:</span>
              <button
                onClick={() => setShortSyntax(true)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  shortSyntax ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                PHP 7.4+ Short ([...])
              </button>
              <button
                onClick={() => setShortSyntax(false)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                  !shortSyntax ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Classic (array(...))
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-zinc-400">Variable:</span>
              <div className="flex items-center">
                <span className="text-xs font-mono text-indigo-400 bg-zinc-950 px-2 py-1.5 rounded-l-lg border border-r-0 border-zinc-700">
                  $
                </span>
                <input
                  type="text"
                  value={variableName}
                  onChange={(e) => setVariableName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                  className="w-24 text-xs font-mono px-2 py-1.5 rounded-r-lg bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none"
                  placeholder="data"
                />
              </div>
            </div>
          </div>

          <span className="text-xs text-zinc-500 hidden sm:inline">
            Laravel & WordPress Compatible
          </span>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300">JSON Input</label>
            <button
              onClick={() => setJsonInput(SAMPLE_JSON)}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Reset Sample
            </button>
          </div>
          <textarea
            rows={14}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Paste JSON..."
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-400" />
              PHP Associative Array
            </label>
            <CopyButton text={phpCode} label="Copy PHP Code" />
          </div>

          {error ? (
            <div className="h-[280px] p-4 rounded-xl bg-red-950/20 border border-red-900/40 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              {error}
            </div>
          ) : (
            <textarea
              rows={14}
              readOnly
              value={phpCode}
              className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none resize-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}

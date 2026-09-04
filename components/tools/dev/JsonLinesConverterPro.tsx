'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileCode, ArrowLeftRight, Sparkles, Check, AlertCircle, Download } from 'lucide-react';

const SAMPLE_JSONL = `{"id": 1, "name": "Ada Lovelace", "role": "Mathematician", "active": true}
{"id": 2, "name": "Alan Turing", "role": "Computer Scientist", "active": true}
{"id": 3, "name": "Grace Hopper", "role": "Software Pioneer", "active": false}`;

export function JsonLinesConverterPro() {
  const [mode, setMode] = useState<'jsonlToJson' | 'jsonlToCsv' | 'jsonToJsonl'>('jsonlToJson');
  const [input, setInput] = useState(SAMPLE_JSONL);
  const [error, setError] = useState<string | null>(null);

  const { output, rowCount } = useMemo(() => {
    setError(null);
    if (!input.trim()) return { output: '', rowCount: 0 };

    try {
      if (mode === 'jsonlToJson') {
        const lines = input.split('\n').map((l) => l.trim()).filter(Boolean);
        const parsedArray: any[] = [];

        lines.forEach((line, idx) => {
          try {
            parsedArray.push(JSON.parse(line));
          } catch {
            throw new Error(`Syntax error on line ${idx + 1}: Malformed JSON.`);
          }
        });

        return {
          output: JSON.stringify(parsedArray, null, 2),
          rowCount: parsedArray.length,
        };
      } else if (mode === 'jsonlToCsv') {
        const lines = input.split('\n').map((l) => l.trim()).filter(Boolean);
        if (lines.length === 0) return { output: '', rowCount: 0 };

        const parsedArray = lines.map((line, idx) => {
          try {
            return JSON.parse(line);
          } catch {
            throw new Error(`Syntax error on line ${idx + 1}: Malformed JSON.`);
          }
        });

        // Collect all distinct keys
        const allKeys = Array.from(new Set(parsedArray.flatMap((obj) => Object.keys(obj))));
        const headerRow = allKeys.map((k) => `"${k.replace(/"/g, '""')}"`).join(',');

        const dataRows = parsedArray.map((row) => {
          return allKeys
            .map((k) => {
              const val = row[k];
              if (val === undefined || val === null) return '""';
              if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
              return `"${String(val).replace(/"/g, '""')}"`;
            })
            .join(',');
        });

        return {
          output: [headerRow, ...dataRows].join('\n'),
          rowCount: parsedArray.length,
        };
      } else {
        // jsonToJsonl
        const parsed = JSON.parse(input);
        if (!Array.isArray(parsed)) {
          throw new Error('Input must be a valid JSON Array of objects (e.g. [{...}, {...}]).');
        }

        const jsonlStr = parsed.map((item) => JSON.stringify(item)).join('\n');
        return {
          output: jsonlStr,
          rowCount: parsed.length,
        };
      }
    } catch (err: any) {
      setError(err.message || 'Error processing JSON Lines.');
      return { output: '', rowCount: 0 };
    }
  }, [input, mode]);

  const handleDownload = () => {
    if (!output) return;
    const ext = mode === 'jsonlToCsv' ? 'csv' : mode === 'jsonlToJson' ? 'json' : 'jsonl';
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `converted-dataset.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setMode('jsonlToJson');
                setInput(SAMPLE_JSONL);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'jsonlToJson'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              JSONL &rarr; JSON Array
            </button>
            <button
              onClick={() => {
                setMode('jsonlToCsv');
                setInput(SAMPLE_JSONL);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'jsonlToCsv'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              JSONL &rarr; CSV Spreadsheet
            </button>
            <button
              onClick={() => {
                setMode('jsonToJsonl');
                setInput(JSON.stringify(JSON.parse(`[${SAMPLE_JSONL.replace(/\n/g, ',')}]`), null, 2));
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'jsonToJsonl'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              JSON Array &rarr; JSONL
            </button>
          </div>

          <div className="flex items-center gap-3">
            {rowCount > 0 && (
              <span className="text-xs font-mono text-indigo-300 bg-zinc-950 px-2.5 py-1 rounded-md border border-zinc-800">
                {rowCount} records converted
              </span>
            )}
            {output && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              {mode === 'jsonToJsonl' ? 'Input JSON Array ([...])' : 'Input JSON Lines (.jsonl)'}
            </label>
            <button
              onClick={() => setInput('')}
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={14}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder={mode === 'jsonToJsonl' ? '[{"id": 1}, {"id": 2}]' : '{"id": 1}\n{"id": 2}'}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              {mode === 'jsonlToCsv' ? 'CSV Result' : mode === 'jsonlToJson' ? 'Formatted JSON Array' : 'Generated JSONL'}
            </label>
            <CopyButton text={output} label="Copy Output" />
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
              value={output}
              className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none resize-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}

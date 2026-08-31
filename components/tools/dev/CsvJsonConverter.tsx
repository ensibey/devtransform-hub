'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileSpreadsheet, ArrowRightLeft, Download, Trash2, Check, FileText } from 'lucide-react';

export function CsvJsonConverter() {
  const [mode, setMode] = useState<'csv2json' | 'json2csv'>('csv2json');
  const [rawInput, setRawInput] = useState(
    `id,name,role,city,active\n1,Alice,Engineer,San Francisco,true\n2,Bob,Designer,Berlin,true\n3,Charlie,Product Lead,Istanbul,false`
  );
  const [delimiter, setDelimiter] = useState<string>(',');

  // CSV to JSON conversion
  const convertedOutput = useMemo(() => {
    if (!rawInput.trim()) return '';

    if (mode === 'csv2json') {
      try {
        const lines = rawInput.trim().split('\n').filter((l) => l.trim().length > 0);
        if (lines.length === 0) return '[]';

        const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/^["']|["']$/g, ''));
        const rows = lines.slice(1).map((line) => {
          const values = line.split(delimiter).map((v) => v.trim().replace(/^["']|["']$/g, ''));
          const obj: Record<string, any> = {};
          headers.forEach((h, idx) => {
            const val = values[idx] !== undefined ? values[idx] : '';
            if (val === 'true') obj[h] = true;
            else if (val === 'false') obj[h] = false;
            else if (!isNaN(Number(val)) && val !== '') obj[h] = Number(val);
            else obj[h] = val;
          });
          return obj;
        });

        return JSON.stringify(rows, null, 2);
      } catch (err: any) {
        return `/* Parse Error: ${err.message} */`;
      }
    } else {
      // JSON to CSV
      try {
        const parsed = JSON.parse(rawInput);
        if (!Array.isArray(parsed) || parsed.length === 0) {
          return '/* Input must be a non-empty JSON array of objects */';
        }

        const headers = Array.from(new Set(parsed.flatMap((item) => Object.keys(item))));
        const headerRow = headers.join(delimiter);

        const rows = parsed.map((item) => {
          return headers
            .map((h) => {
              const val = item[h];
              if (val === undefined || val === null) return '';
              const str = String(val);
              if (str.includes(delimiter) || str.includes('\n') || str.includes('"')) {
                return `"${str.replace(/"/g, '""')}"`;
              }
              return str;
            })
            .join(delimiter);
        });

        return `${headerRow}\n${rows.join('\n')}`;
      } catch (err: any) {
        return `/* Invalid JSON: ${err.message} */`;
      }
    }
  }, [rawInput, mode, delimiter]);

  const switchMode = () => {
    if (mode === 'csv2json') {
      setMode('json2csv');
      setRawInput(convertedOutput.startsWith('/*') ? '[\n  {\n    "id": 1,\n    "name": "Alice"\n  }\n]' : convertedOutput);
    } else {
      setMode('csv2json');
      setRawInput(convertedOutput.startsWith('/*') ? 'id,name\n1,Alice' : convertedOutput);
    }
  };

  const downloadResult = () => {
    const filename = mode === 'csv2json' ? 'converted.json' : 'converted.csv';
    const mimeType = mode === 'csv2json' ? 'application/json' : 'text/csv';
    const blob = new Blob([convertedOutput], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setMode('csv2json')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mode === 'csv2json' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              CSV to JSON
            </button>
            <button
              type="button"
              onClick={() => setMode('json2csv')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mode === 'json2csv' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              JSON to CSV
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <span>Delimiter:</span>
            <select
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-white focus:outline-none"
            >
              <option value=",">Comma (,)</option>
              <option value=";">Semicolon (;)</option>
              <option value="\t">Tab (\t)</option>
              <option value="|">Pipe (|)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={downloadResult}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center space-x-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download {mode === 'csv2json' ? '.json' : '.csv'}</span>
          </button>
        </div>
      </div>

      {/* 2-Column Inputs & Outputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileSpreadsheet className="w-4 h-4 text-brand-emerald" />
              <span>Input {mode === 'csv2json' ? 'CSV String' : 'JSON Array'}:</span>
            </span>
            <button
              type="button"
              onClick={() => setRawInput('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            rows={12}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder={mode === 'csv2json' ? 'id,name,role\n1,Alice,Dev' : '[\n  {\n    "id": 1,\n    "name": "Alice"\n  }\n]'}
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Converted {mode === 'csv2json' ? 'JSON Structure' : 'CSV Lines'}:</span>
              <CopyButton text={convertedOutput} />
            </div>

            <textarea
              readOnly
              value={convertedOutput}
              rows={12}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

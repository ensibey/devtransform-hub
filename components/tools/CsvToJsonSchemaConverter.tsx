'use client';

import React, { useState, useMemo } from 'react';
import { FileSpreadsheet, Copy, Check, Sparkles, RefreshCw, Code2, Layers } from 'lucide-react';

const SAMPLE_CSV = `id,name,email,age,is_verified,created_at
101,Sarah Jenkins,sarah@example.com,29,true,2026-01-15T08:30:00Z
102,David Miller,david@example.com,34,false,2026-02-20T14:15:00Z
103,Emma Watson,emma@example.com,27,true,2026-03-05T19:45:00Z`;

// Parse CSV text into headers and rows
function parseCsv(csvText: string): { headers: string[]; rows: string[][] } {
  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const delimiter = lines[0].includes('\t') ? '\t' : lines[0].includes(';') ? ';' : ',';

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === delimiter && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  };

  const headers = parseLine(lines[0]);
  const rows = lines.slice(1).map(parseLine);
  return { headers, rows };
}

// Infer JSON Schema type from column values
function inferColumnType(values: string[]): { type: string; format?: string } {
  const nonEmpties = values.filter((v) => v !== '' && v !== 'null' && v !== undefined);
  if (nonEmpties.length === 0) return { type: 'string' };

  // Check boolean
  if (nonEmpties.every((v) => v.toLowerCase() === 'true' || v.toLowerCase() === 'false')) {
    return { type: 'boolean' };
  }

  // Check integer
  if (nonEmpties.every((v) => /^-?\d+$/.test(v))) {
    return { type: 'integer' };
  }

  // Check number
  if (nonEmpties.every((v) => /^-?\d+(\.\d+)?$/.test(v))) {
    return { type: 'number' };
  }

  // Check date-time
  if (nonEmpties.every((v) => !isNaN(Date.parse(v)) && (v.includes('T') || v.includes('-')))) {
    return { type: 'string', format: 'date-time' };
  }

  // Check email
  if (nonEmpties.every((v) => v.includes('@') && v.includes('.'))) {
    return { type: 'string', format: 'email' };
  }

  return { type: 'string' };
}

export function CsvToJsonSchemaConverter() {
  const [csvInput, setCsvInput] = useState<string>(SAMPLE_CSV);
  const [title, setTitle] = useState<string>('UserRecord');
  const [requireAll, setRequireAll] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const jsonSchemaOutput = useMemo(() => {
    if (!csvInput.trim()) return '';

    try {
      const { headers, rows } = parseCsv(csvInput);
      if (headers.length === 0) return '// Waiting for valid CSV input...';

      const properties: Record<string, any> = {};

      for (let colIdx = 0; colIdx < headers.length; colIdx++) {
        const headerName = headers[colIdx];
        const colValues = rows.map((r) => r[colIdx] || '');
        const { type, format } = inferColumnType(colValues);

        const propObj: Record<string, any> = { type };
        if (format) propObj.format = format;
        properties[headerName] = propObj;
      }

      const schema: Record<string, any> = {
        $schema: 'https://json-schema.org/draft/2020-12/schema',
        title,
        type: 'object',
        properties,
      };

      if (requireAll) {
        schema.required = headers;
      }

      return JSON.stringify(schema, null, 2);
    } catch (err: any) {
      return `// Parser error: ${err.message}`;
    }
  }, [csvInput, title, requireAll]);

  const copySchema = () => {
    navigator.clipboard.writeText(jsonSchemaOutput);
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
              <FileSpreadsheet className="w-6 h-6 text-indigo-400" />
              CSV to JSON Schema Converter
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Infer standard JSON Schema (Draft 2020-12) specifications automatically from raw CSV tabular data.
            </p>
          </div>

          <button
            onClick={() => setCsvInput(SAMPLE_CSV)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sample
          </button>
        </div>
      </div>

      {/* Configuration bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center gap-6">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Schema Title:</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="UserRecord"
            className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-white font-mono text-xs"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={requireAll}
            onChange={(e) => setRequireAll(e.target.checked)}
            className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
          />
          <span>Mark all columns as required</span>
        </label>
      </div>

      {/* Grid: CSV Input vs JSON Schema */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CSV Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              CSV Source Data
            </span>
            <span className="text-[11px] text-slate-500">Auto-detects comma / tab / semicolon</span>
          </div>

          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            rows={16}
            placeholder="col1,col2,col3..."
            className="w-full flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
          />
        </div>

        {/* JSON Schema Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-400" />
              Inferred JSON Schema (Draft 2020-12)
            </span>
            <button
              onClick={copySchema}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy JSON Schema'}
            </button>
          </div>

          <pre className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
            {jsonSchemaOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}

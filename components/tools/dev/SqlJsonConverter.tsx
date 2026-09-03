'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Database, Download, FileJson, ArrowRightLeft, Check, Trash2 } from 'lucide-react';

function jsonToSql(jsonStr: string, tableName = 'users'): string {
  try {
    const data = JSON.parse(jsonStr);
    const arr = Array.isArray(data) ? data : [data];
    if (arr.length === 0 || typeof arr[0] !== 'object' || arr[0] === null) {
      return '-- JSON array must contain objects.';
    }

    const columns = Object.keys(arr[0]);
    const colList = columns.map((c) => `\`${c}\``).join(', ');

    const valueRows = arr.map((row) => {
      const vals = columns.map((c) => {
        const val = row[c];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number' || typeof val === 'boolean') return val;
        return `'${String(val).replace(/'/g, "''")}'`;
      });
      return `(${vals.join(', ')})`;
    });

    return `INSERT INTO \`${tableName}\` (${colList}) VALUES\n  ${valueRows.join(',\n  ')};`;
  } catch (err: any) {
    return `-- JSON Parse Error: ${err.message}`;
  }
}

function sqlToJson(sqlStr: string): string {
  try {
    const insertRegex = /INSERT\s+INTO\s+[`"']?(\w+)[`"']?\s*\(([^)]+)\)\s*VALUES\s*([\s\S]+?);?$/i;
    const match = sqlStr.trim().match(insertRegex);

    if (!match) {
      return JSON.stringify({ error: 'Could not parse SQL INSERT statement. Ensure format matches: INSERT INTO table (cols) VALUES (...);' }, null, 2);
    }

    const columns = match[2].split(',').map((c) => c.trim().replace(/[`"']/g, ''));
    const rawValues = match[3].trim();

    // Split rows: (val1, val2), (val3, val4)
    const rows = rawValues.match(/\(([^)]+)\)/g);
    if (!rows) {
      return JSON.stringify([], null, 2);
    }

    const results = rows.map((row) => {
      const cleanRow = row.slice(1, -1);
      // Basic comma-separated value parser
      const vals = cleanRow.split(',').map((v) => {
        const val = v.trim();
        if (val.toUpperCase() === 'NULL') return null;
        if (val.toUpperCase() === 'TRUE') return true;
        if (val.toUpperCase() === 'FALSE') return false;
        if (/^-?\d+(\.\d+)?$/.test(val)) return Number(val);
        return val.replace(/^['"]|['"]$/g, '').replace(/''/g, "'");
      });

      const obj: Record<string, any> = {};
      columns.forEach((col, idx) => {
        obj[col] = vals[idx] !== undefined ? vals[idx] : null;
      });
      return obj;
    });

    return JSON.stringify(results, null, 2);
  } catch (err: any) {
    return JSON.stringify({ error: err.message }, null, 2);
  }
}

export function SqlJsonConverter() {
  const [mode, setMode] = useState<'json2sql' | 'sql2json'>('json2sql');
  const [tableName, setTableName] = useState('users');
  const [inputContent, setInputContent] = useState(
    JSON.stringify(
      [
        { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'admin', isActive: true },
        { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'developer', isActive: false },
        { id: 3, name: 'Charlie Rose', email: 'charlie@example.com', role: 'viewer', isActive: true },
      ],
      null,
      2
    )
  );

  const outputContent = useMemo(() => {
    return mode === 'json2sql' ? jsonToSql(inputContent, tableName) : sqlToJson(inputContent);
  }, [inputContent, mode, tableName]);

  const downloadOutput = () => {
    const filename = mode === 'json2sql' ? `${tableName}.sql` : `${tableName}.json`;
    const mime = mode === 'json2sql' ? 'text/sql' : 'application/json';
    const blob = new Blob([outputContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setMode('json2sql')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'json2sql' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              JSON to SQL INSERT
            </button>
            <button
              type="button"
              onClick={() => setMode('sql2json')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                mode === 'sql2json' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              SQL INSERT to JSON
            </button>
          </div>

          {mode === 'json2sql' && (
            <div className="flex items-center space-x-2">
              <span className="text-zinc-500">Table Name:</span>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="p-1.5 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
              />
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={downloadOutput}
          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download {mode === 'json2sql' ? '.sql' : '.json'}</span>
        </button>
      </div>

      {/* 2-Column Inputs & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Input {mode === 'json2sql' ? 'JSON Array' : 'SQL INSERT Statement'}:</span>
            </span>
            <button
              type="button"
              onClick={() => setInputContent('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
            placeholder={mode === 'json2sql' ? '[ { "id": 1, ... } ]' : 'INSERT INTO users (id, name) VALUES (1, "Alice");'}
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Converted {mode === 'json2sql' ? 'SQL Script' : 'JSON Object Array'}:</span>
              <CopyButton text={outputContent} />
            </div>

            <textarea
              readOnly
              value={outputContent}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

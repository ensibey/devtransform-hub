'use client';

import React, { useState, useMemo } from 'react';
import { Database, Copy, Check, Sparkles, RefreshCw, Code2, Settings } from 'lucide-react';

const SAMPLE_SQL = `CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true NOT NULL,
  balance DECIMAL(12, 2) DEFAULT 0.00,
  metadata JSONB,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);`;

// Convert snake_case to camelCase
function toCamelCase(str: string): string {
  return str.replace(/_([a-z0-9])/g, (_, letter) => letter.toUpperCase());
}

// Convert table name to PascalCase
function toPascalCase(str: string): string {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// Map SQL type to TypeScript type
function mapSqlTypeToTs(sqlType: string, dateType: 'Date' | 'string'): string {
  const t = sqlType.toUpperCase();

  if (t.includes('INT') || t.includes('SERIAL') || t.includes('FLOAT') || t.includes('DOUBLE') || t.includes('DECIMAL') || t.includes('NUMERIC') || t.includes('REAL')) {
    return 'number';
  }
  if (t.includes('CHAR') || t.includes('TEXT') || t.includes('UUID') || t.includes('ENUM') || t.includes('CITEXT')) {
    return 'string';
  }
  if (t.includes('BOOL')) {
    return 'boolean';
  }
  if (t.includes('TIME') || t.includes('DATE')) {
    return dateType;
  }
  if (t.includes('JSON')) {
    return 'Record<string, any>';
  }
  if (t.includes('BYTEA') || t.includes('BLOB')) {
    return 'Uint8Array';
  }

  return 'string';
}

export function SqlSchemaToTypescriptInterfaceConverter() {
  const [sqlInput, setSqlInput] = useState<string>(SAMPLE_SQL);
  const [useCamelCase, setUseCamelCase] = useState<boolean>(true);
  const [dateType, setDateType] = useState<'Date' | 'string'>('Date');
  const [exportStyle, setExportStyle] = useState<'interface' | 'type'>('interface');
  const [copied, setCopied] = useState<boolean>(false);

  // Convert SQL DDL to TypeScript
  const tsOutput = useMemo(() => {
    if (!sqlInput.trim()) return '';

    try {
      // Find table name
      const tableMatch = sqlInput.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["`]?\w+["`]?\.)?["`]?(\w+)["`]?\s*\(/i);
      const tableName = tableMatch ? tableMatch[1] : 'Record';
      const interfaceName = toPascalCase(tableName);

      // Extract body between outermost parentheses
      const firstParen = sqlInput.indexOf('(');
      const lastParen = sqlInput.lastIndexOf(')');
      if (firstParen === -1 || lastParen === -1) {
        return '// Could not find table definition in SQL input';
      }

      const body = sqlInput.slice(firstParen + 1, lastParen);
      const rawLines = body.split('\n');

      const fields: string[] = [];

      for (const line of rawLines) {
        const trimmed = line.trim().replace(/,$/, '');
        if (!trimmed) continue;
        if (
          trimmed.toUpperCase().startsWith('PRIMARY KEY') ||
          trimmed.toUpperCase().startsWith('FOREIGN KEY') ||
          trimmed.toUpperCase().startsWith('CONSTRAINT') ||
          trimmed.toUpperCase().startsWith('UNIQUE') ||
          trimmed.toUpperCase().startsWith('CHECK') ||
          trimmed.startsWith('--')
        ) {
          continue;
        }

        const tokens = trimmed.split(/\s+/);
        if (tokens.length < 2) continue;

        const rawColName = tokens[0].replace(/["`]/g, '');
        const rawSqlType = tokens[1];
        const isNotNull = trimmed.toUpperCase().includes('NOT NULL');
        const isPrimaryKey = trimmed.toUpperCase().includes('PRIMARY KEY');

        const colName = useCamelCase ? toCamelCase(rawColName) : rawColName;
        const validIdentifier = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(colName) ? colName : JSON.stringify(colName);
        const mappedTs = mapSqlTypeToTs(rawSqlType, dateType);

        const optionalMarker = isNotNull || isPrimaryKey ? '' : '?';
        const nullableSuffix = isNotNull || isPrimaryKey ? '' : ' | null';

        fields.push(`  ${validIdentifier}${optionalMarker}: ${mappedTs}${nullableSuffix};`);
      }

      if (exportStyle === 'interface') {
        return `export interface ${interfaceName} {\n${fields.join('\n')}\n}`;
      } else {
        return `export type ${interfaceName} = {\n${fields.join('\n')}\n};`;
      }
    } catch (err: any) {
      return `// Parser error: ${err.message}`;
    }
  }, [sqlInput, useCamelCase, dateType, exportStyle]);

  const copyCode = () => {
    navigator.clipboard.writeText(tsOutput);
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
              <Database className="w-6 h-6 text-indigo-400" />
              SQL Schema to TypeScript Interface Converter
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Convert PostgreSQL, MySQL, and SQLite CREATE TABLE DDL queries into strictly typed TypeScript interfaces and types.
            </p>
          </div>

          <button
            onClick={() => setSqlInput(SAMPLE_SQL)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sample
          </button>
        </div>
      </div>

      {/* Options Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-wrap items-center gap-6">
        {/* CamelCase toggle */}
        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={useCamelCase}
            onChange={(e) => setUseCamelCase(e.target.checked)}
            className="w-4 h-4 rounded accent-indigo-500 cursor-pointer"
          />
          <span>camelCase field names</span>
        </label>

        {/* Date format */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Date Mapping:</span>
          <select
            value={dateType}
            onChange={(e) => setDateType(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white font-mono text-xs"
          >
            <option value="Date">Date</option>
            <option value="string">string</option>
          </select>
        </div>

        {/* Export style */}
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span>Export as:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800">
            <button
              onClick={() => setExportStyle('interface')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                exportStyle === 'interface' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              interface
            </button>
            <button
              onClick={() => setExportStyle('type')}
              className={`px-2 py-0.5 rounded text-xs transition ${
                exportStyle === 'type' ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400'
              }`}
            >
              type
            </button>
          </div>
        </div>
      </div>

      {/* Grid: SQL Input vs TS Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SQL Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-4 h-4 text-indigo-400" />
              SQL CREATE TABLE DDL
            </span>
            <span className="text-[11px] text-slate-500">PostgreSQL / MySQL / SQLite</span>
          </div>

          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            rows={16}
            placeholder="CREATE TABLE ..."
            className="w-full flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
          />
        </div>

        {/* TypeScript Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-400" />
              TypeScript Definition
            </span>
            <button
              onClick={copyCode}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy TypeScript'}
            </button>
          </div>

          <pre className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
            {tsOutput}
          </pre>
        </div>
      </div>
    </div>
  );
}

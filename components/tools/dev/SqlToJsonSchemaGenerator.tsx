'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Database, FileCode, Sparkles, Check, AlertCircle } from 'lucide-react';

const SAMPLE_SQL = `CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  age INT,
  is_active BOOLEAN DEFAULT true,
  account_balance NUMERIC(10, 2),
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

interface ParsedColumn {
  name: string;
  sqlType: string;
  isNullable: boolean;
  isPrimary: boolean;
}

function mapSqlToJsonSchemaType(sqlType: string): { type: string; format?: string; items?: any } {
  const upper = sqlType.toUpperCase();

  if (upper.includes('INT') || upper.includes('SERIAL')) {
    return { type: 'integer' };
  }
  if (upper.includes('FLOAT') || upper.includes('DOUBLE') || upper.includes('NUMERIC') || upper.includes('DECIMAL') || upper.includes('REAL')) {
    return { type: 'number' };
  }
  if (upper.includes('BOOL')) {
    return { type: 'boolean' };
  }
  if (upper.includes('UUID')) {
    return { type: 'string', format: 'uuid' };
  }
  if (upper.includes('TIME') || upper.includes('DATE')) {
    return { type: 'string', format: 'date-time' };
  }
  if (upper.includes('JSON')) {
    return { type: 'object' };
  }
  if (upper.includes('[]') || upper.includes('ARRAY')) {
    return { type: 'array', items: { type: 'string' } };
  }

  return { type: 'string' };
}

export function SqlToJsonSchemaGenerator() {
  const [sqlInput, setSqlInput] = useState(SAMPLE_SQL);
  const [schemaName, setSchemaName] = useState('');
  const [includeDraftMeta, setIncludeDraftMeta] = useState(true);

  const { jsonSchema, tableName, columnCount } = useMemo(() => {
    try {
      if (!sqlInput.trim()) {
        return { jsonSchema: '', tableName: '', columnCount: 0 };
      }

      // Extract Table Name
      const tableMatch = sqlInput.match(/CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?(?:["`]?([a-zA-Z0-9_]+)["`]?\.)?["`]?([a-zA-Z0-9_]+)["`]?\s*\(/i);
      const parsedTableName = tableMatch ? (tableMatch[2] || tableMatch[1]) : 'Record';

      // Extract body between outermost parens
      const firstParen = sqlInput.indexOf('(');
      const lastParen = sqlInput.lastIndexOf(')');
      if (firstParen === -1 || lastParen === -1 || lastParen <= firstParen) {
        return { jsonSchema: '// Malformed CREATE TABLE statement.', tableName: parsedTableName, columnCount: 0 };
      }

      const body = sqlInput.slice(firstParen + 1, lastParen);
      const lines = body.split('\n').map((l) => l.trim()).filter((l) => l && !l.startsWith('--') && !l.startsWith('/*'));

      const properties: Record<string, any> = {};
      const required: string[] = [];

      for (const line of lines) {
        // Skip table constraints like PRIMARY KEY (id), CONSTRAINT ..., FOREIGN KEY ...
        if (/^(PRIMARY\s+KEY|CONSTRAINT|FOREIGN\s+KEY|UNIQUE|CHECK|KEY|INDEX)\b/i.test(line)) {
          continue;
        }

        const colMatch = line.match(/^["`]?([a-zA-Z0-9_]+)["`]?\s+([A-Za-z0-9_()]+(?:\[\])?)/);
        if (colMatch) {
          const colName = colMatch[1];
          const colType = colMatch[2];

          const isNotNull = /NOT\s+NULL/i.test(line) || /PRIMARY\s+KEY/i.test(line);
          const typeMapping = mapSqlToJsonSchemaType(colType);

          const propDef: any = {
            type: typeMapping.type,
          };
          if (typeMapping.format) {
            propDef.format = typeMapping.format;
          }
          if (typeMapping.items) {
            propDef.items = typeMapping.items;
          }
          propDef.description = `SQL Column: ${colType}`;

          properties[colName] = propDef;

          if (isNotNull) {
            required.push(colName);
          }
        }
      }

      const schemaObj: any = {};
      if (includeDraftMeta) {
        schemaObj.$schema = 'https://json-schema.org/draft/2020-12/schema';
      }
      schemaObj.title = schemaName || parsedTableName;
      schemaObj.type = 'object';
      schemaObj.properties = properties;
      if (required.length > 0) {
        schemaObj.required = required;
      }

      return {
        jsonSchema: JSON.stringify(schemaObj, null, 2),
        tableName: parsedTableName,
        columnCount: Object.keys(properties).length,
      };
    } catch (err: any) {
      return { jsonSchema: `// Error parsing SQL: ${err.message}`, tableName: '', columnCount: 0 };
    }
  }, [sqlInput, schemaName, includeDraftMeta]);

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-zinc-200 text-sm">
              SQL Table to JSON Schema (draft 2020-12)
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeDraftMeta}
                onChange={(e) => setIncludeDraftMeta(e.target.checked)}
                className="rounded border-zinc-700 bg-zinc-950 text-indigo-600 focus:ring-0 cursor-pointer"
              />
              Include $schema Header
            </label>
            {columnCount > 0 && (
              <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-indigo-300 font-mono">
                {columnCount} properties parsed
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Editor Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SQL Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Database className="w-4 h-4 text-indigo-400" />
              Input SQL CREATE TABLE
            </label>
            <button
              onClick={() => setSqlInput(SAMPLE_SQL)}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Reset Sample
            </button>
          </div>
          <textarea
            rows={14}
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="CREATE TABLE table_name (...);"
          />
        </div>

        {/* JSON Schema Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-emerald-400" />
              Generated JSON Schema
            </label>
            <CopyButton text={jsonSchema} label="Copy Schema" />
          </div>
          <textarea
            rows={14}
            readOnly
            value={jsonSchema}
            className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileCode2, Sparkles, Check, AlertCircle } from 'lucide-react';

function inferZodSchema(value: any, indent = 2): string {
  const spaces = ' '.repeat(indent);
  const nextSpaces = ' '.repeat(indent + 2);

  if (value === null || value === undefined) {
    return 'z.any().nullable()';
  }

  if (typeof value === 'string') {
    // heuristics
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'z.string().email()';
    }
    if (/^https?:\/\/.+/.test(value)) {
      return 'z.string().url()';
    }
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
      return 'z.string().datetime()';
    }
    if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(value)) {
      return 'z.string().uuid()';
    }
    return 'z.string()';
  }

  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'z.number().int()' : 'z.number()';
  }

  if (typeof value === 'boolean') {
    return 'z.boolean()';
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return 'z.array(z.unknown())';
    }
    const innerSchema = inferZodSchema(value[0], indent);
    return `z.array(${innerSchema})`;
  }

  if (typeof value === 'object') {
    const keys = Object.keys(value);
    if (keys.length === 0) {
      return 'z.record(z.unknown())';
    }

    const fields = keys.map((key) => {
      const sanitizedKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      const val = value[key];
      const zodType = inferZodSchema(val, indent + 2);
      return `${nextSpaces}${sanitizedKey}: ${zodType},`;
    });

    return `z.object({\n${fields.join('\n')}\n${spaces}})`;
  }

  return 'z.unknown()';
}

const DEFAULT_JSON = JSON.stringify(
  {
    id: 'c81d4e2e-bcf2-11e6-869b-7df92533c26e',
    name: 'Sarah Connor',
    email: 'sarah.connor@cyberdyne.io',
    website: 'https://devtransform-hub.vercel.app',
    age: 32,
    rating: 4.95,
    isVerified: true,
    roles: ['admin', 'security'],
    createdAt: '2026-09-04T00:00:00.000Z',
    address: {
      street: '100 Cyber Blvd',
      city: 'Los Angeles',
      zipCode: 90210,
    },
  },
  null,
  2
);

export function JsonToZodConverter() {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [schemaName, setSchemaName] = useState('UserSchema');
  const [zodOutput, setZodOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (!jsonInput.trim()) {
        setZodOutput('');
        setError(null);
        return;
      }

      const parsed = JSON.parse(jsonInput);
      setError(null);

      const inferred = inferZodSchema(parsed, 0);
      const name = schemaName.trim() || 'Schema';
      const typeName = name.replace(/Schema$/, '') || 'Data';

      const fullOutput = `import { z } from 'zod';

export const ${name} = ${inferred};

export type ${typeName} = z.infer<typeof ${name}>;
`;
      setZodOutput(fullOutput);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
      setZodOutput('');
    }
  }, [jsonInput, schemaName]);

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <FileCode2 className="w-5 h-5 text-brand-emerald" />
          <span className="text-sm font-semibold text-white">Zod Schema Name</span>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={schemaName}
            onChange={(e) => setSchemaName(e.target.value)}
            className="px-3 py-1.5 bg-black/50 border border-zinc-700 rounded-xl text-brand-emerald font-mono text-xs focus:border-brand-emerald focus:outline-none"
            placeholder="UserSchema"
          />
        </div>
      </div>

      {/* Side-by-side Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* JSON Input */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Input JSON Payload
            </span>
            <button
              type="button"
              onClick={() => setJsonInput(DEFAULT_JSON)}
              className="text-[11px] font-mono text-brand-emerald hover:underline"
            >
              Load Example
            </button>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={16}
            placeholder="Paste raw JSON here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-xs focus:border-brand-emerald focus:outline-none resize-none leading-relaxed"
          />
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Zod Schema Output */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-emerald" />
              Generated Zod Schema & TypeScript Type
            </span>
            {zodOutput && <CopyButton text={zodOutput} />}
          </div>
          <textarea
            readOnly
            value={zodOutput}
            rows={16}
            placeholder="Generated Zod schema will appear here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
}

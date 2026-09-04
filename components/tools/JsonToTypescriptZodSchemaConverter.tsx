'use client';

import React, { useState, useMemo } from 'react';
import { ShieldCheck, Copy, Check, Sparkles, RefreshCw, Code2, Layers } from 'lucide-react';

const SAMPLE_JSON = `{
  "id": 10842,
  "username": "alex_developer",
  "email": "alex@example.com",
  "isActive": true,
  "role": "admin",
  "bio": null,
  "skills": ["TypeScript", "Next.js", "GraphQL", "TailwindCSS"],
  "profile": {
    "avatarUrl": "https://avatar.dev/alex.png",
    "yearsOfExp": 7,
    "githubVerified": true
  },
  "settings": {
    "theme": "dark",
    "notificationsEnabled": false
  }
}`;

// Helper to infer Zod code from JSON values
function generateZodSchema(val: any, rootName = 'User', indentLevel = 0): { zodCode: string; extraTypes: string[] } {
  const extraTypes: string[] = [];
  const pad = '  '.repeat(indentLevel);
  const innerPad = '  '.repeat(indentLevel + 1);

  if (val === null || val === undefined) {
    return { zodCode: 'z.unknown().nullable()', extraTypes };
  }

  if (typeof val === 'string') {
    if (val.includes('@') && val.includes('.')) {
      return { zodCode: 'z.string().email()', extraTypes };
    }
    if (val.startsWith('http://') || val.startsWith('https://')) {
      return { zodCode: 'z.string().url()', extraTypes };
    }
    return { zodCode: 'z.string()', extraTypes };
  }

  if (typeof val === 'number') {
    return { zodCode: Number.isInteger(val) ? 'z.number().int()' : 'z.number()', extraTypes };
  }

  if (typeof val === 'boolean') {
    return { zodCode: 'z.boolean()', extraTypes };
  }

  if (Array.isArray(val)) {
    if (val.length === 0) {
      return { zodCode: 'z.array(z.unknown())', extraTypes };
    }
    const sampleItem = val[0];
    if (typeof sampleItem === 'object' && sampleItem !== null && !Array.isArray(sampleItem)) {
      const nestedTypeName = `${rootName}Item`;
      const nested = generateZodSchema(sampleItem, nestedTypeName, indentLevel);
      extraTypes.push(...nested.extraTypes);
      return { zodCode: `z.array(${nested.zodCode})`, extraTypes };
    } else {
      const itemZod = generateZodSchema(sampleItem, `${rootName}Item`, indentLevel);
      return { zodCode: `z.array(${itemZod.zodCode})`, extraTypes };
    }
  }

  if (typeof val === 'object') {
    const keys = Object.keys(val);
    if (keys.length === 0) {
      return { zodCode: 'z.record(z.unknown())', extraTypes };
    }

    const lines: string[] = [];
    for (const key of keys) {
      const propVal = val[key];
      const validIdent = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
      const sub = generateZodSchema(propVal, `${rootName}${capitalize(key)}`, indentLevel + 1);
      extraTypes.push(...sub.extraTypes);
      lines.push(`${innerPad}${validIdent}: ${sub.zodCode},`);
    }

    const objCode = `z.object({\n${lines.join('\n')}\n${pad}})`;
    return { zodCode: objCode, extraTypes };
  }

  return { zodCode: 'z.unknown()', extraTypes };
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function JsonToTypescriptZodSchemaConverter() {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_JSON);
  const [rootName, setRootName] = useState<string>('User');
  const [copied, setCopied] = useState<string | null>(null);

  const { schemaCode, typeCode, error } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { schemaCode: '', typeCode: '', error: null };
    }

    try {
      const parsed = JSON.parse(jsonInput);
      const schemaVarName = `${rootName.charAt(0).toLowerCase() + rootName.slice(1)}Schema`;
      const typeName = capitalize(rootName);

      const { zodCode } = generateZodSchema(parsed, rootName, 0);

      const fullSchema = `import { z } from 'zod';

export const ${schemaVarName} = ${zodCode};

export type ${typeName} = z.infer<typeof ${schemaVarName}>;`;

      const pureTypeOnly = `export type ${typeName} = z.infer<typeof ${schemaVarName}>;`;

      return { schemaCode: fullSchema, typeCode: pureTypeOnly, error: null };
    } catch (err: any) {
      return { schemaCode: '', typeCode: '', error: err.message || 'Invalid JSON syntax' };
    }
  }, [jsonInput, rootName]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-indigo-400" />
              JSON to Zod Schema & TypeScript Converter
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Instantly turn JSON payloads into strict runtime Zod schemas with inferred TypeScript types, email/url detection, and integers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setJsonInput(SAMPLE_JSON)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Sample
            </button>
          </div>
        </div>
      </div>

      {/* Inputs Configuration */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="flex-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              Root Schema Name (PascalCase)
            </label>
            <input
              type="text"
              value={rootName}
              onChange={(e) => setRootName(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
              placeholder="User"
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-sm"
            />
          </div>
          <div className="text-xs text-slate-400 sm:self-end pb-2">
            Output: <code className="text-indigo-400">{rootName.charAt(0).toLowerCase() + rootName.slice(1)}Schema</code> and <code className="text-emerald-400">type {capitalize(rootName)}</code>
          </div>
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* JSON Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-400" />
              Source JSON Payload
            </span>
            <button
              onClick={() => {
                try {
                  setJsonInput(JSON.stringify(JSON.parse(jsonInput), null, 2));
                } catch {}
              }}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800 transition"
            >
              Format JSON
            </button>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={18}
            placeholder="Paste your JSON here..."
            className="w-full flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
          />

          {error && (
            <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-400 text-xs font-mono">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Generated Zod Code */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              Zod TypeScript Code
            </span>
            <button
              onClick={() => copyToClipboard(schemaCode, 'zod')}
              disabled={!schemaCode}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium transition flex items-center gap-1.5"
            >
              {copied === 'zod' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'zod' ? 'Copied' : 'Copy Zod Schema'}
            </button>
          </div>

          <pre className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
            {schemaCode || '// Waiting for valid JSON...'}
          </pre>
        </div>
      </div>
    </div>
  );
}

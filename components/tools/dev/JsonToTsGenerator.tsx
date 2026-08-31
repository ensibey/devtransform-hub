'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Code2, FileCode, Check, Trash2 } from 'lucide-react';

function jsonToTypeScript(jsonStr: string, rootName = 'RootObject'): string {
  try {
    const parsed = JSON.parse(jsonStr);
    const interfaces: Record<string, string> = {};

    function capitalize(str: string) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function getType(val: any, keyName: string): string {
      if (val === null) return 'any';
      if (Array.isArray(val)) {
        if (val.length === 0) return 'any[]';
        const innerType = getType(val[0], keyName.replace(/s$/, 'Item'));
        return `${innerType}[]`;
      }
      if (typeof val === 'object') {
        const nestedName = capitalize(keyName);
        generateInterface(val, nestedName);
        return nestedName;
      }
      return typeof val;
    }

    function generateInterface(obj: Record<string, any>, name: string) {
      if (interfaces[name]) return;

      const fields: string[] = [];
      for (const [key, value] of Object.entries(obj)) {
        const type = getType(value, key);
        const validKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : `"${key}"`;
        fields.push(`  ${validKey}: ${type};`);
      }

      interfaces[name] = `export interface ${name} {\n${fields.join('\n')}\n}`;
    }

    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && typeof parsed[0] === 'object' && parsed[0] !== null) {
        generateInterface(parsed[0], `${rootName}Item`);
        return `${Object.values(interfaces).join('\n\n')}\n\nexport type ${rootName} = ${rootName}Item[];`;
      }
      return `export type ${rootName} = any[];`;
    } else if (typeof parsed === 'object' && parsed !== null) {
      generateInterface(parsed, rootName);
      return Object.values(interfaces).join('\n\n');
    }

    return `export type ${rootName} = ${typeof parsed};`;
  } catch (err: any) {
    return `// Invalid JSON: ${err.message}`;
  }
}

export function JsonToTsGenerator() {
  const [jsonInput, setJsonInput] = useState(
    JSON.stringify(
      {
        id: 101,
        title: 'ZeroUpload Pro Suite',
        published: true,
        author: {
          id: 1,
          name: 'Enis Bey',
          roles: ['admin', 'maintainer'],
        },
        tags: ['nextjs', 'typescript', 'seo'],
        stats: {
          views: 45200,
          likes: 3820,
        },
      },
      null,
      2
    )
  );

  const [rootName, setRootName] = useState('ApiResponse');

  const tsOutput = useMemo(() => {
    if (!jsonInput.trim()) return '';
    return jsonToTypeScript(jsonInput, rootName || 'RootObject');
  }, [jsonInput, rootName]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-2">
          <span>Root Interface Name:</span>
          <input
            type="text"
            value={rootName}
            onChange={(e) => setRootName(e.target.value)}
            className="p-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald"
          />
        </div>

        <button
          type="button"
          onClick={() => setJsonInput('')}
          className="text-zinc-500 hover:text-rose-400 transition-colors flex items-center space-x-1"
          title="Clear"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>

      {/* 2-Column JSON Input & TS Interface Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* JSON Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Code2 className="w-4 h-4 text-brand-emerald" />
              <span>Input JSON:</span>
            </span>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Paste your JSON payload here..."
          />
        </div>

        {/* TS Interfaces Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Generated TypeScript Interfaces:</span>
              <CopyButton text={tsOutput} />
            </div>

            <textarea
              readOnly
              value={tsOutput}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

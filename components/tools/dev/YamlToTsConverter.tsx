'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileCode, Sparkles, Check, Trash2 } from 'lucide-react';
import yaml from 'yaml';

function inferType(val: any, indent = 1): string {
  if (val === null || val === undefined) return 'any';
  if (typeof val === 'string') return 'string';
  if (typeof val === 'number') return 'number';
  if (typeof val === 'boolean') return 'boolean';
  if (Array.isArray(val)) {
    if (val.length === 0) return 'any[]';
    const itemType = inferType(val[0], indent);
    return `${itemType}[]`;
  }
  if (typeof val === 'object') {
    const spaces = '  '.repeat(indent);
    const closeSpaces = '  '.repeat(indent - 1);
    const entries = Object.entries(val);
    if (entries.length === 0) return 'Record<string, any>';
    const lines = entries.map(([k, v]) => `${spaces}${k}?: ${inferType(v, indent + 1)};`);
    return `{\n${lines.join('\n')}\n${closeSpaces}}`;
  }
  return 'any';
}

function yamlToTs(yamlStr: string, rootInterface = 'Config'): string {
  try {
    const parsed = yaml.parse(yamlStr);
    if (!parsed || typeof parsed !== 'object') {
      return `/* Invalid or empty YAML object */`;
    }
    const body = inferType(parsed);
    return `export interface ${rootInterface} ${body}\n`;
  } catch (err: any) {
    return `/* YAML Parse Error: ${err.message} */`;
  }
}

export function YamlToTsConverter() {
  const [yamlInput, setYamlInput] = useState(
    `apiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\n  labels:\n    app: frontend\n    environment: production\nspec:\n  replicas: 3\n  template:\n    spec:\n      containers:\n        - name: web\n          image: nginx:1.25\n          ports:\n            - containerPort: 80\n          resources:\n            limits:\n              cpu: "500m"\n              memory: "128Mi"`
  );

  const [interfaceName, setInterfaceName] = useState('KubernetesDeployment');

  const tsCode = useMemo(() => {
    return yamlToTs(yamlInput, interfaceName);
  }, [yamlInput, interfaceName]);

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-zinc-400">TypeScript Root Interface:</span>
          <input
            type="text"
            value={interfaceName}
            onChange={(e) => setInterfaceName(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
            className="p-1.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald"
          />
        </div>
      </div>

      {/* 2-Column YAML & TypeScript */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* YAML Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>YAML Source Configuration:</span>
            </span>
            <button
              type="button"
              onClick={() => setYamlInput('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={yamlInput}
            onChange={(e) => setYamlInput(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
            placeholder="apiVersion: v1..."
          />
        </div>

        {/* TypeScript Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Generated TypeScript Types:</span>
              <CopyButton text={tsCode} />
            </div>

            <textarea
              readOnly
              value={tsCode}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed select-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Code2, Check, FileJson, Sparkles } from 'lucide-react';

function mapSchemaType(prop: any): string {
  if (!prop) return 'any';
  if (prop.enum && Array.isArray(prop.enum)) {
    return prop.enum.map((e: any) => JSON.stringify(e)).join(' | ');
  }
  if (prop.type === 'string') return 'string';
  if (prop.type === 'number' || prop.type === 'integer') return 'number';
  if (prop.type === 'boolean') return 'boolean';
  if (prop.type === 'array') {
    const itemType = prop.items ? mapSchemaType(prop.items) : 'any';
    return `${itemType}[]`;
  }
  if (prop.type === 'object') {
    if (!prop.properties) return 'Record<string, any>';
    return generateTypeBody(prop, 2);
  }
  return 'any';
}

function generateTypeBody(schema: any, indentLevel = 1): string {
  const indent = '  '.repeat(indentLevel);
  const closingIndent = '  '.repeat(indentLevel - 1);
  const props = schema.properties || {};
  const required = schema.required || [];

  const lines: string[] = ['{'];
  for (const [key, val] of Object.entries(props)) {
    const isReq = required.includes(key);
    const typeStr = mapSchemaType(val);
    const opt = isReq ? '' : '?';
    const comment = (val as any).description ? ` // ${(val as any).description}` : '';
    lines.push(`${indent}${key}${opt}: ${typeStr};${comment}`);
  }
  lines.push(`${closingIndent}}`);
  return lines.join('\n');
}

function convertSchemaToTs(schemaStr: string): string {
  try {
    const schema = JSON.parse(schemaStr);
    const title = schema.title ? schema.title.replace(/[^a-zA-Z0-9]/g, '') : 'RootObject';
    const description = schema.description ? `/**\n * ${schema.description}\n */\n` : '';

    const body = generateTypeBody(schema);
    return `${description}export interface ${title} ${body}`;
  } catch (err: any) {
    return `/* JSON Schema Parse Error: ${err.message} */`;
  }
}

export function JsonSchemaToTsConverter() {
  const [schemaInput, setSchemaInput] = useState(
    JSON.stringify(
      {
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: 'UserAccount',
        description: 'Represents a registered user on the platform',
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique user identifier' },
          username: { type: 'string' },
          email: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'editor', 'viewer'] },
          age: { type: 'integer' },
          isActive: { type: 'boolean' },
          tags: {
            type: 'array',
            items: { type: 'string' },
          },
          address: {
            type: 'object',
            properties: {
              city: { type: 'string' },
              zip: { type: 'string' },
            },
            required: ['city'],
          },
        },
        required: ['id', 'username', 'email', 'role'],
      },
      null,
      2
    )
  );

  const tsOutput = useMemo(() => {
    return convertSchemaToTs(schemaInput);
  }, [schemaInput]);

  return (
    <div className="space-y-6">
      {/* 2-Column Schema Input & TypeScript Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Schema Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileJson className="w-4 h-4 text-blue-400" />
              <span>JSON Schema (Draft-07 / 04):</span>
            </span>
          </div>

          <textarea
            value={schemaInput}
            onChange={(e) => setSchemaInput(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-400 resize-none leading-relaxed"
            placeholder="Paste your JSON Schema definition..."
          />
        </div>

        {/* TypeScript Output */}
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

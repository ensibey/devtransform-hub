'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Sparkles, 
  Download, 
  Layers, 
  Code2, 
  CheckCircle2 
} from 'lucide-react';

const SAMPLES = {
  user: JSON.stringify({
    id: "usr_99182",
    username: "alex_dev",
    email: "alex@example.com",
    isActive: true,
    karma: 1420,
    rating: 4.95,
    roles: ["admin", "developer", "maintainer"],
    profile: {
      bio: "Fullstack TypeScript engineer",
      website: "https://example.com",
      avatarUrl: "https://avatar.example.com/alex.png"
    },
    organization: {
      id: "org_441",
      name: "Acme Corp",
      memberCount: 52
    }
  }, null, 2),
  order: JSON.stringify({
    orderId: "ord_10829",
    totalAmount: 299.50,
    currency: "USD",
    paid: true,
    items: [
      { sku: "SKU-991", title: "Mechanical Keyboard", qty: 1, unitPrice: 199.50 },
      { sku: "SKU-312", title: "Desk Mat", qty: 2, unitPrice: 50.00 }
    ],
    shippingAddress: {
      street: "742 Evergreen Terrace",
      city: "Springfield",
      postalCode: "97477"
    }
  }, null, 2)
};

// Recursive GraphQL type inference
function inferGraphqlSchema(
  jsonObj: any,
  rootTypeName = 'Root',
  typesMap: Map<string, string> = new Map()
): string {
  if (Array.isArray(jsonObj)) {
    if (jsonObj.length > 0 && typeof jsonObj[0] === 'object') {
      return inferGraphqlSchema(jsonObj[0], rootTypeName, typesMap);
    }
    return '';
  }

  if (!jsonObj || typeof jsonObj !== 'object') {
    return '';
  }

  const fields: string[] = [];

  for (const [key, val] of Object.entries(jsonObj)) {
    if (val === null || val === undefined) {
      fields.push(`  ${key}: String`);
    } else if (typeof val === 'boolean') {
      fields.push(`  ${key}: Boolean!`);
    } else if (typeof val === 'number') {
      if (Number.isInteger(val)) {
        fields.push(`  ${key}: Int!`);
      } else {
        fields.push(`  ${key}: Float!`);
      }
    } else if (typeof val === 'string') {
      if (key.toLowerCase() === 'id' || key.toLowerCase().endsWith('id')) {
        fields.push(`  ${key}: ID!`);
      } else {
        fields.push(`  ${key}: String!`);
      }
    } else if (Array.isArray(val)) {
      if (val.length === 0) {
        fields.push(`  ${key}: [String!]!`);
      } else if (typeof val[0] === 'object' && val[0] !== null) {
        const nestedTypeName = capitalize(key.endsWith('s') ? key.slice(0, -1) : key);
        inferGraphqlSchema(val[0], nestedTypeName, typesMap);
        fields.push(`  ${key}: [${nestedTypeName}!]!`);
      } else if (typeof val[0] === 'number') {
        fields.push(`  ${key}: [${Number.isInteger(val[0]) ? 'Int' : 'Float'}!]!`);
      } else if (typeof val[0] === 'boolean') {
        fields.push(`  ${key}: [Boolean!]!`);
      } else {
        fields.push(`  ${key}: [String!]!`);
      }
    } else if (typeof val === 'object') {
      const nestedTypeName = capitalize(key);
      inferGraphqlSchema(val, nestedTypeName, typesMap);
      fields.push(`  ${key}: ${nestedTypeName}!`);
    }
  }

  const typeDef = `type ${rootTypeName} {\n${fields.join('\n')}\n}`;
  typesMap.set(rootTypeName, typeDef);

  return Array.from(typesMap.values()).reverse().join('\n\n');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function JsonToGraphqlSchemaConverter() {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLES.user);
  const [rootTypeName, setRootTypeName] = useState<string>('User');
  const [includeQuery, setIncludeQuery] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const schemaResult = useMemo(() => {
    if (!jsonInput.trim()) return { schema: '', error: null };

    try {
      const parsed = JSON.parse(jsonInput);
      const typesMap = new Map<string, string>();
      let sdl = inferGraphqlSchema(parsed, rootTypeName, typesMap);

      if (includeQuery) {
        sdl += `\n\ntype Query {\n  get${rootTypeName}(id: ID!): ${rootTypeName}\n  list${rootTypeName}s(limit: Int = 10, offset: Int = 0): [${rootTypeName}!]!\n}`;
      }

      return { schema: sdl, error: null };
    } catch (err: any) {
      return { schema: '', error: err.message || 'Invalid JSON format' };
    }
  }, [jsonInput, rootTypeName, includeQuery]);

  const handleCopy = () => {
    if (!schemaResult.schema) return;
    navigator.clipboard.writeText(schemaResult.schema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!schemaResult.schema) return;
    const blob = new Blob([schemaResult.schema], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'schema.graphql';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-pink-500/10 text-pink-400 border border-pink-500/20 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5" /> GraphQL SDL Generator
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Recursive Type Inference
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            JSON to GraphQL Schema Converter
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Instantly generate strict GraphQL types, nested schemas, scalar fields, and Root Query resolvers from any JSON data.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-pink-400" />}
            <span>{copied ? 'Copied' : 'Copy SDL'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-pink-500 hover:bg-pink-400 text-slate-950 font-semibold transition shadow-sm shadow-pink-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download .graphql</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Input JSON Payload
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => { setJsonInput(SAMPLES.user); setRootTypeName('User'); }}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-pink-300 border border-slate-700 hover:bg-slate-700"
                >
                  User Profile
                </button>
                <button
                  onClick={() => { setJsonInput(SAMPLES.order); setRootTypeName('Order'); }}
                  className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-pink-300 border border-slate-700 hover:bg-slate-700"
                >
                  Order Payload
                </button>
              </div>
            </div>

            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              rows={15}
              className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition resize-y leading-relaxed"
              placeholder="{ ... }"
            />

            <div className="pt-2 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Root Type Name</label>
                <input
                  type="text"
                  value={rootTypeName}
                  onChange={(e) => setRootTypeName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-4">
                <input
                  type="checkbox"
                  id="includeQuery"
                  checked={includeQuery}
                  onChange={(e) => setIncludeQuery(e.target.checked)}
                  className="w-4 h-4 rounded text-pink-500 focus:ring-pink-500 bg-slate-950 border-slate-800 cursor-pointer"
                />
                <label htmlFor="includeQuery" className="text-xs text-slate-300 cursor-pointer">
                  Include Root Query Resolver
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: GraphQL SDL Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col h-full min-h-[460px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Generated GraphQL Schema (SDL)
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {schemaResult.schema ? `${schemaResult.schema.split('\n').length} lines` : ''}
              </span>
            </div>

            {schemaResult.error ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                Error: {schemaResult.error}
              </div>
            ) : (
              <pre className="flex-1 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-pink-300 whitespace-pre-wrap overflow-y-auto leading-relaxed">
                {schemaResult.schema || '// GraphQL schema definitions will appear here'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

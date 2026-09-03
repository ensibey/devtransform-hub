'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Shield, Lock, FileCode, Check, RefreshCw } from 'lucide-react';

async function computeSriHash(content: string, algo: 'SHA-256' | 'SHA-384' | 'SHA-512'): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle) {
    return '';
  }
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await window.crypto.subtle.digest(algo, data);

  // Convert ArrayBuffer to Base64
  let binary = '';
  const bytes = new Uint8Array(hashBuffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);
  const prefix = algo.toLowerCase().replace('-', '');
  return `${prefix}-${base64}`;
}

export function SriHashGenerator() {
  const [content, setContent] = useState(
    `console.log("Hello from secure CDN script v1.0");\nfunction initializeApp() { return true; }`
  );
  const [url, setUrl] = useState('https://cdn.example.com/app.min.js');
  const [resourceType, setResourceType] = useState<'script' | 'style'>('script');
  const [algo, setAlgo] = useState<'SHA-384' | 'SHA-512' | 'SHA-256'>('SHA-384');
  const [sriHash, setSriHash] = useState('');

  useEffect(() => {
    computeSriHash(content, algo).then((hash) => {
      setSriHash(hash);
    });
  }, [content, algo]);

  const htmlTag =
    resourceType === 'script'
      ? `<script src="${url}" integrity="${sriHash}" crossorigin="anonymous"></script>`
      : `<link rel="stylesheet" href="${url}" integrity="${sriHash}" crossorigin="anonymous" />`;

  return (
    <div className="space-y-6">
      {/* Settings Strip */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
          <Shield className="w-4 h-4 text-brand-emerald" />
          <span>W3C Subresource Integrity (SRI) Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
          <div className="space-y-1">
            <label className="text-zinc-400">Hash Algorithm:</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald"
            >
              <option value="SHA-384">SHA-384 (W3C Recommended)</option>
              <option value="SHA-512">SHA-512 (High Security)</option>
              <option value="SHA-256">SHA-256 (Standard)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Resource Type:</label>
            <select
              value={resourceType}
              onChange={(e) => setResourceType(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
            >
              <option value="script">JavaScript &lt;script&gt;</option>
              <option value="style">CSS Stylesheet &lt;link&gt;</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Target CDN / Public URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
            />
          </div>
        </div>
      </div>

      {/* Code Input & Live Hash */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source Content */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileCode className="w-4 h-4 text-brand-emerald" />
              <span>Script / CSS Code Contents to Hash:</span>
            </span>
          </div>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Paste code to compute cryptographic integrity hash..."
          />
        </div>

        {/* Output Tags */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-4 flex flex-col justify-between">
          {/* Base SRI Hash */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">SRI Hash Attribute Value:</span>
              <CopyButton text={sriHash} />
            </div>
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white font-bold break-all select-all">
              {sriHash || 'Computing hash...'}
            </div>
          </div>

          {/* HTML Tag Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Production HTML Tag Snippet:</span>
              <CopyButton text={htmlTag} />
            </div>
            <textarea
              readOnly
              value={htmlTag}
              rows={4}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

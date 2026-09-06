'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { getCurlTargetBySlug, parseCurlCommand, CURL_TARGETS } from '@/lib/curl-targets-data';
import { CopyButton } from '@/components/shared/CopyButton';
import { Terminal, Code2, RotateCcw, Trash2 } from 'lucide-react';

interface CurlWorkspaceProps {
  targetSlug: string;
}

export function CurlWorkspace({ targetSlug }: CurlWorkspaceProps) {
  const target = getCurlTargetBySlug(targetSlug) || CURL_TARGETS[0];
  const [inputCurl, setInputCurl] = useState(target.defaultCurl);

  const generatedCode = useMemo(() => {
    try {
      const parsed = parseCurlCommand(inputCurl);
      return target.generateCode(parsed);
    } catch {
      return '// Error parsing cURL command. Please check command format.';
    }
  }, [inputCurl, target]);

  return (
    <div className="space-y-6">
      {/* Language Switcher Bar */}
      <div className="flex flex-wrap gap-1.5 p-1.5 rounded-xl bg-surface-100 border border-border">
        {CURL_TARGETS.map((t) => (
          <Link
            key={t.slug}
            href={`/curl-to/${t.slug}/`}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
              t.slug === target.slug
                ? 'bg-brand-emerald text-black font-bold shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-surface-200'
            }`}
          >
            {t.language}
          </Link>
        ))}
      </div>

      {/* Interactive Two-Column Converter Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Input cURL */}
        <div className="flex flex-col bg-surface-100 border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-200 border-b border-border text-xs font-mono">
            <div className="flex items-center space-x-2 text-zinc-300">
              <Terminal className="w-4 h-4 text-brand-emerald" />
              <span>Input cURL Command</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setInputCurl(target.defaultCurl)}
                className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Sample</span>
              </button>
              <button
                type="button"
                onClick={() => setInputCurl('')}
                className="text-[11px] text-zinc-400 hover:text-rose-400 flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <textarea
              value={inputCurl}
              onChange={(e) => setInputCurl(e.target.value)}
              placeholder="Paste your curl command here (e.g. curl -X POST https://api.example.com -H 'Authorization: Bearer...' -d '{&quot;foo&quot;:&quot;bar&quot;}')..."
              className="w-full flex-1 min-h-[280px] p-3 bg-black/60 border border-border focus:border-brand-emerald rounded-lg text-xs font-mono text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-brand-emerald resize-y"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right: Output Generated Code */}
        <div className="flex flex-col bg-surface-100 border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="flex items-center justify-between px-4 py-2.5 bg-surface-200 border-b border-border text-xs font-mono">
            <div className="flex items-center space-x-2 text-zinc-300">
              <Code2 className="w-4 h-4 text-brand-emerald" />
              <span>Generated {target.name} Code</span>
            </div>
            <CopyButton text={generatedCode} />
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <pre className="w-full flex-1 min-h-[280px] p-3 bg-black/70 border border-border rounded-lg text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { getTextTransformationBySlug } from '@/lib/text-matrix';
import { Type, Sparkles, Trash2, ArrowRight, Check } from 'lucide-react';

interface TextWorkspaceProps {
  slug: string;
  sampleInput: string;
}

export function TextWorkspace({ slug, sampleInput }: TextWorkspaceProps) {
  const [inputText, setInputText] = useState(sampleInput);

  const transformation = useMemo(() => {
    return getTextTransformationBySlug(slug);
  }, [slug]);

  const outputText = useMemo(() => {
    if (!transformation) return inputText;
    try {
      return transformation.transform(inputText);
    } catch {
      return 'Error transforming text';
    }
  }, [inputText, transformation]);

  const charCount = inputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const byteCount = new Blob([inputText]).size;

  return (
    <div className="space-y-6">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-3">
          <span>Chars: <strong className="text-white">{charCount}</strong></span>
          <span>•</span>
          <span>Words: <strong className="text-white">{wordCount}</strong></span>
          <span>•</span>
          <span>Bytes: <strong className="text-white">{byteCount} B</strong></span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setInputText(sampleInput)}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
          >
            Load Sample
          </button>
          <button
            type="button"
            onClick={() => setInputText('')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-400 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* 2-Column Side-by-Side Live Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Input Text:</span>
            <span className="text-zinc-500 text-[11px]">Original</span>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={8}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Type or paste your text here..."
          />
        </div>

        {/* Transformed Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Converted Result:</span>
              <CopyButton text={outputText} />
            </div>
            <textarea
              readOnly
              value={outputText}
              rows={8}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

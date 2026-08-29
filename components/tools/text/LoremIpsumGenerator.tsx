'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { RefreshCw, Copy, Check, Sparkles } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export function LoremIpsumGenerator() {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState(3);
  const [asHtml, setAsHtml] = useState(false);
  const [output, setOutput] = useState('');

  const generate = () => {
    let result = '';

    const getSentence = () => {
      const len = Math.floor(Math.random() * 8) + 6;
      const words: string[] = [];
      for (let i = 0; i < len; i++) {
        const randWord = LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
        words.push(randWord);
      }
      const s = words.join(' ');
      return s.charAt(0).toUpperCase() + s.slice(1) + '.';
    };

    const getParagraph = () => {
      const sentenceCount = Math.floor(Math.random() * 3) + 4;
      const sentences: string[] = [];
      for (let i = 0; i < sentenceCount; i++) {
        sentences.push(getSentence());
      }
      return sentences.join(' ');
    };

    if (type === 'paragraphs') {
      const paras: string[] = [];
      for (let i = 0; i < count; i++) {
        paras.push(getParagraph());
      }
      result = asHtml
        ? paras.map((p) => `<p>${p}</p>`).join('\n\n')
        : paras.join('\n\n');
    } else if (type === 'sentences') {
      const sents: string[] = [];
      for (let i = 0; i < count; i++) {
        sents.push(getSentence());
      }
      result = sents.join(' ');
    } else if (type === 'words') {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
      }
      result = words.join(' ');
    }

    setOutput(result);
  };

  useEffect(() => {
    generate();
  }, [type, count, asHtml]);

  return (
    <div className="space-y-6">
      {/* Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface-200 border border-border text-xs">
        <div className="flex items-center space-x-3">
          <div className="flex items-center rounded-lg bg-surface-300 border border-border p-0.5">
            {(['paragraphs', 'sentences', 'words'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-3 py-1.5 rounded-md capitalize font-medium transition-colors ${
                  type === t
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-zinc-400 font-mono">Count:</span>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 bg-surface-300 border border-border rounded px-2 py-1 text-zinc-100 font-mono text-xs focus:ring-1 focus:ring-brand-emerald focus:outline-none"
            />
          </div>

          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={asHtml}
              onChange={(e) => setAsHtml(e.target.checked)}
              className="rounded border-border bg-surface text-brand-emerald focus:ring-0"
            />
            <span>HTML &lt;p&gt; Tags</span>
          </label>
        </div>

        <button
          type="button"
          onClick={generate}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-brand-emerald text-black font-semibold hover:bg-emerald-400 transition-colors shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Output Panel */}
      <div className="rounded-xl border border-border bg-oled overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 bg-surface-200 border-b border-border text-xs">
          <span className="font-mono text-zinc-400">Generated Dummy Text</span>
          <CopyButton text={output} />
        </div>
        <textarea
          readOnly
          value={output}
          rows={10}
          className="w-full p-4 bg-transparent text-sm text-zinc-200 focus:outline-none resize-none leading-relaxed font-serif"
        />
      </div>
    </div>
  );
}

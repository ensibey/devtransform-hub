'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { AlignLeft, RefreshCw, Layers, Check } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip',
  'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export function LoremIpsumGenerator() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [htmlTags, setHtmlTags] = useState(false);

  const generatedText = useMemo(() => {
    const getRandomWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

    const generateSentence = (wordsCount = 12) => {
      const words = Array.from({ length: wordsCount }, getRandomWord);
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      return words.join(' ') + '.';
    };

    const generateParagraph = (sentencesCount = 5) => {
      return Array.from({ length: sentencesCount }, () => generateSentence(Math.floor(Math.random() * 8) + 8)).join(' ');
    };

    let result = '';

    if (type === 'words') {
      const words = Array.from({ length: count }, getRandomWord);
      if (startWithLorem && count >= 5) {
        words[0] = 'Lorem'; words[1] = 'ipsum'; words[2] = 'dolor'; words[3] = 'sit'; words[4] = 'amet';
      }
      result = words.join(' ');
      if (htmlTags) result = `<p>${result}</p>`;
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, () => generateSentence());
      if (startWithLorem && sentences.length > 0) {
        sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
      }
      result = sentences.join(' ');
      if (htmlTags) result = `<p>${result}</p>`;
    } else {
      const paragraphs = Array.from({ length: count }, () => generateParagraph());
      if (startWithLorem && paragraphs.length > 0) {
        paragraphs[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
      }
      result = htmlTags
        ? paragraphs.map((p) => `<p>${p}</p>`).join('\n\n')
        : paragraphs.join('\n\n');
    }

    return result;
  }, [count, type, startWithLorem, htmlTags]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400">Quantity / Sayı:</label>
            <input
              type="number"
              min="1"
              max="50"
              value={count}
              onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-sm text-white focus:outline-none focus:border-brand-emerald"
            />
          </div>

          {/* Type */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-zinc-400">Type / Tür:</label>
            <select
              value={type}
              onChange={(e: any) => setType(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-sm text-white focus:outline-none focus:border-brand-emerald"
            >
              <option value="paragraphs">Paragraphs (Paragraf)</option>
              <option value="sentences">Sentences (Cümle)</option>
              <option value="words">Words (Kelime)</option>
            </select>
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 sm:col-span-2 flex flex-col justify-center pt-2">
            <label className="flex items-center space-x-2 text-xs font-mono text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={startWithLorem}
                onChange={(e) => setStartWithLorem(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
              />
              <span>Start with &quot;Lorem ipsum dolor sit amet...&quot;</span>
            </label>

            <label className="flex items-center space-x-2 text-xs font-mono text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={htmlTags}
                onChange={(e) => setHtmlTags(e.target.checked)}
                className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
              />
              <span>Wrap in HTML &lt;p&gt; tags</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated Result Output */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold flex items-center space-x-1.5">
            <AlignLeft className="w-4 h-4" />
            <span>Generated Placeholder Text:</span>
          </span>
          <CopyButton text={generatedText} />
        </div>

        <textarea
          readOnly
          value={generatedText}
          rows={12}
          className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 focus:outline-none resize-none leading-relaxed"
        />
      </div>
    </div>
  );
}

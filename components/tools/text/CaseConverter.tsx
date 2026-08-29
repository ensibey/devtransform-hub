'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Trash2, Sparkles, Wand2 } from 'lucide-react';

export function CaseConverter() {
  const [text, setText] = useState('Transform any text into multiple cases and formats seamlessly.');

  const toCamelCase = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
  };

  const toPascalCase = (str: string) => {
    const camel = toCamelCase(str);
    return camel.charAt(0).toUpperCase() + camel.slice(1);
  };

  const toSnakeCase = (str: string) => {
    return str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map((x) => x.toLowerCase())
      .join('_') || str.toLowerCase().replace(/\s+/g, '_');
  };

  const toKebabCase = (str: string) => {
    return str
      .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
      ?.map((x) => x.toLowerCase())
      .join('-') || str.toLowerCase().replace(/\s+/g, '-');
  };

  const toTitleCase = (str: string) => {
    return str.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };

  const toSentenceCase = (str: string) => {
    return str.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
  };

  const actions = [
    { label: 'UPPERCASE', fn: () => setText(text.toUpperCase()) },
    { label: 'lowercase', fn: () => setText(text.toLowerCase()) },
    { label: 'Title Case', fn: () => setText(toTitleCase(text)) },
    { label: 'Sentence case', fn: () => setText(toSentenceCase(text)) },
    { label: 'camelCase', fn: () => setText(toCamelCase(text)) },
    { label: 'PascalCase', fn: () => setText(toPascalCase(text)) },
    { label: 'snake_case', fn: () => setText(toSnakeCase(text)) },
    { label: 'kebab-case', fn: () => setText(toKebabCase(text)) },
    { label: 'CONSTANT_CASE', fn: () => setText(toSnakeCase(text).toUpperCase()) },
    {
      label: 'Trim Spaces',
      fn: () => setText(text.replace(/\s+/g, ' ').trim()),
    },
    {
      label: 'Remove Line Breaks',
      fn: () => setText(text.replace(/[\r\n]+/gm, ' ')),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Transformation Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {actions.map((act) => (
          <button
            key={act.label}
            type="button"
            onClick={act.fn}
            className="px-3 py-1.5 rounded-lg bg-surface-200 hover:bg-surface-50 text-xs font-medium text-zinc-200 hover:text-brand-emerald border border-border transition-all active:scale-95"
          >
            {act.label}
          </button>
        ))}
      </div>

      {/* Editor Canvas */}
      <div className="rounded-xl border border-border bg-oled overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-3 py-2 bg-surface-200 border-b border-border text-xs">
          <span className="font-mono text-zinc-400">Live Case Editor</span>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setText('')}
              className="p-1 rounded text-zinc-400 hover:text-rose-400 transition-colors"
              title="Clear text"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <CopyButton text={text} />
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type text here..."
          rows={10}
          className="w-full p-4 bg-transparent text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none resize-y leading-relaxed font-sans"
        />
      </div>
    </div>
  );
}

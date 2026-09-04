'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { ArrowLeftRight, Code2, Sparkles, RefreshCw, FileText } from 'lucide-react';

type EscapeTarget = 'json' | 'js' | 'sql' | 'html' | 'url' | 'regex' | 'csharp';

const SAMPLE_TEXT = `Hello "World"!
Here is a query: SELECT * FROM users WHERE email = 'test@example.com';
<div>Special <b>HTML</b> & characters: 10 < 20 && 30 > 15</div>
Regex pattern: ^[a-z0-9_.-]+@([a-z0-9-]+\\.)+[a-z]{2,6}$
Path: C:\\Users\\Administrator\\AppData\\Local\\Temp`;

export function StringEscapeUnescape() {
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');
  const [target, setTarget] = useState<EscapeTarget>('json');
  const [input, setInput] = useState(SAMPLE_TEXT);

  const output = useMemo(() => {
    if (!input) return '';

    try {
      if (mode === 'escape') {
        switch (target) {
          case 'json':
            return JSON.stringify(input).slice(1, -1);
          case 'js':
            return input
              .replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
              .replace(/"/g, '\\"')
              .replace(/\n/g, '\\n')
              .replace(/\r/g, '\\r')
              .replace(/\t/g, '\\t');
          case 'sql':
            return input.replace(/'/g, "''");
          case 'html':
            return input
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
          case 'url':
            return encodeURIComponent(input);
          case 'regex':
            return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          case 'csharp':
            return input.replace(/"/g, '""');
          default:
            return input;
        }
      } else {
        // Unescape mode
        switch (target) {
          case 'json':
            try {
              return JSON.parse(`"${input.replace(/"/g, '\\"')}"`);
            } catch {
              return input
                .replace(/\\"/g, '"')
                .replace(/\\\\/g, '\\')
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t');
            }
          case 'js':
            return input
              .replace(/\\'/g, "'")
              .replace(/\\"/g, '"')
              .replace(/\\n/g, '\n')
              .replace(/\\r/g, '\r')
              .replace(/\\t/g, '\t')
              .replace(/\\\\/g, '\\');
          case 'sql':
            return input.replace(/''/g, "'");
          case 'html':
            return input
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&#039;/g, "'")
              .replace(/&#39;/g, "'");
          case 'url':
            try {
              return decodeURIComponent(input);
            } catch {
              return input;
            }
          case 'regex':
            return input.replace(/\\([.*+?^${}()|[\]\\])/g, '$1');
          case 'csharp':
            return input.replace(/""/g, '"');
          default:
            return input;
        }
      }
    } catch {
      return input;
    }
  }, [input, mode, target]);

  const TARGET_OPTIONS: { id: EscapeTarget; label: string; desc: string }[] = [
    { id: 'json', label: 'JSON', desc: 'Escapes quotes and control chars (\\", \\n, \\t)' },
    { id: 'js', label: 'JavaScript / TS', desc: 'Single/double quotes, newlines, backslashes' },
    { id: 'sql', label: 'SQL', desc: 'Single quote escaping (\'\' notation)' },
    { id: 'html', label: 'HTML Entities', desc: '&amp;, &lt;, &gt;, &quot;, &#039;' },
    { id: 'url', label: 'URL Component', desc: 'RFC 3986 percent encoding (%20, %3A)' },
    { id: 'regex', label: 'RegEx Meta', desc: 'Escapes regex reserved symbols (*+?^$)' },
    { id: 'csharp', label: 'C# / CSV', desc: 'Verbatim double quote notation ("")' },
  ];

  return (
    <div className="space-y-6">
      {/* Target & Mode Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-zinc-950 border border-zinc-800">
            <button
              onClick={() => setMode('escape')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'escape' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Escape String
            </button>
            <button
              onClick={() => setMode('unescape')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                mode === 'unescape' ? 'bg-indigo-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Unescape String
            </button>
          </div>

          <span className="text-xs text-zinc-400 hidden sm:inline">
            100% Client-side pure string manipulation
          </span>
        </div>

        {/* Target Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {TARGET_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTarget(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                target === opt.id
                  ? 'bg-indigo-950/80 border border-indigo-500/60 text-indigo-300 font-semibold shadow-sm'
                  : 'bg-zinc-950/70 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-400" />
              {mode === 'escape' ? 'Raw Input Text' : 'Escaped Input String'}
            </label>
            <button
              onClick={() => setInput('')}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Clear
            </button>
          </div>
          <textarea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none focus:border-indigo-500 resize-none"
            placeholder="Type or paste text..."
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-emerald-400" />
              {mode === 'escape' ? `Escaped (${target.toUpperCase()})` : `Unescaped Result`}
            </label>
            <CopyButton text={output} label="Copy Output" />
          </div>
          <textarea
            rows={12}
            readOnly
            value={output}
            className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}

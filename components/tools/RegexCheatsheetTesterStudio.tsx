'use client';

import React, { useState, useMemo } from 'react';
import { Search, Copy, Check, Sparkles, RefreshCw, Code2, CheckCircle2, AlertCircle } from 'lucide-react';

interface RegexPreset {
  name: string;
  pattern: string;
  flags: string;
  sample: string;
  desc: string;
}

const REGEX_LIBRARY: RegexPreset[] = [
  {
    name: 'Email Address (RFC 5322 Compliant)',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: 'i',
    sample: 'contact@devtransform.hub\ninvalid-email@\nuser.name+tag@sub.domain.co.uk',
    desc: 'Validates standard and subdomained email addresses.',
  },
  {
    name: 'Strong Password (8+ chars, upper, lower, num, symbol)',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    flags: '',
    sample: 'Super$ecure2026\nweakpass\nNoSpecial123',
    desc: 'At least 8 chars with uppercase, lowercase, number, and special character.',
  },
  {
    name: 'URL / Web Address (HTTP/HTTPS)',
    pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    flags: 'gi',
    sample: 'Visit https://devtransform-hub.vercel.app/tools/ or http://example.org?ref=1',
    desc: 'Matches web URLs with optional query strings and protocol.',
  },
  {
    name: 'IPv4 Address',
    pattern: '\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b',
    flags: 'g',
    sample: '192.168.1.1\n10.0.0.254\n999.999.999.999',
    desc: 'Strictly matches standard 4-octet IPv4 addresses (0-255).',
  },
  {
    name: 'UUID v4 Format',
    pattern: '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}',
    flags: 'gi',
    sample: 'f47ac10b-58cc-4372-a567-0e02b2c3d479\nnot-a-valid-uuid',
    desc: 'RFC 4122 standard version-4 UUID hex pattern.',
  },
  {
    name: 'HEX Color Code',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{8})$',
    flags: '',
    sample: '#6366f1\n#fff\n#10b981aa\n123456',
    desc: 'Matches 3-digit, 6-digit, and 8-digit HEX color codes.',
  },
  {
    name: 'Semantic Version (SemVer 2.0)',
    pattern: '^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
    flags: '',
    sample: '1.0.0\n2.4.1-beta.3\nv3.0.0+20130313144700',
    desc: 'Full SemVer 2.0.0 specification with optional pre-release and build metadata.',
  },
  {
    name: 'Slug URL String',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    flags: '',
    sample: 'my-awesome-post-2026\nInvalid_Slug!\nclean-slug',
    desc: 'Hyphen-separated lowercase alphanumeric URL slug.',
  },
];

export function RegexCheatsheetTesterStudio() {
  const [pattern, setPattern] = useState<string>(REGEX_LIBRARY[0].pattern);
  const [flags, setFlags] = useState<string>(REGEX_LIBRARY[0].flags);
  const [testString, setTestString] = useState<string>(REGEX_LIBRARY[0].sample);
  const [copied, setCopied] = useState<string | null>(null);

  // Evaluate regex
  const { matches, error, isMatch } = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const isMatch = regex.test(testString);

      // Find all matches
      const mList: string[] = [];
      if (flags.includes('g')) {
        const matchesIter = testString.matchAll(new RegExp(pattern, flags));
        for (const m of matchesIter) {
          mList.push(m[0]);
        }
      } else {
        const single = testString.match(regex);
        if (single) mList.push(single[0]);
      }

      return { matches: mList, error: null, isMatch };
    } catch (err: any) {
      return { matches: [], error: err.message, isMatch: false };
    }
  }, [pattern, flags, testString]);

  // Code snippets
  const jsSnippet = useMemo(() => {
    return `const regex = /${pattern}/${flags};
const str = \`${testString}\`;

// Boolean test
const isValid = regex.test(str);

// Extract matches
const matches = str.match(regex);
console.log({ isValid, matches });`;
  }, [pattern, flags, testString]);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (p: RegexPreset) => {
    setPattern(p.pattern);
    setFlags(p.flags);
    setTestString(p.sample);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-6 h-6 text-indigo-400" />
              Regular Expression Library & Live Tester
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Curated library of battle-tested regular expressions with live interactive matching and code generation.
            </p>
          </div>

          <button
            onClick={() => applyPreset(REGEX_LIBRARY[0])}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Email
          </button>
        </div>

        {/* Preset Chips */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Library Patterns:
          </span>
          {REGEX_LIBRARY.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition"
            >
              {p.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Regex Editor */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Pattern input */}
          <div className="flex-1 flex items-center bg-slate-950 border border-slate-800 rounded-xl px-3 py-1 focus-within:border-indigo-500">
            <span className="text-slate-500 font-mono text-lg select-none">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="pattern"
              className="flex-1 bg-transparent border-none text-indigo-400 font-mono text-sm px-2 focus:outline-none"
            />
            <span className="text-slate-500 font-mono text-lg select-none">/</span>
          </div>

          {/* Flags input */}
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 w-full sm:w-28">
            <span className="text-slate-500 text-xs font-mono">flags:</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ''))}
              placeholder="gims"
              className="w-full bg-transparent border-none text-white font-mono text-xs focus:outline-none"
            />
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-950/40 border border-rose-900/60 rounded-xl text-rose-400 text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
      </div>

      {/* Grid: Test String vs Matches */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test String Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Test Input String
            </span>
            <span className={`text-xs font-semibold flex items-center gap-1 ${isMatch ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isMatch ? <CheckCircle2 className="w-3.5 h-3.5" /> : null}
              {isMatch ? `${matches.length} match(es) found` : 'No matches'}
            </span>
          </div>

          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            rows={10}
            placeholder="Enter test string here..."
            className="w-full flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
          />
        </div>

        {/* Matches & Code */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-emerald-400" />
              JavaScript Code Snippet
            </span>
            <button
              onClick={() => copyText(jsSnippet, 'js')}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
            >
              {copied === 'js' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied === 'js' ? 'Copied' : 'Copy JS'}
            </button>
          </div>

          <pre className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
            {jsSnippet}
          </pre>

          {/* Captured matches list */}
          {matches.length > 0 && (
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1.5 max-h-36 overflow-y-auto">
              <span className="text-[11px] text-slate-400 uppercase font-semibold block">Captured Strings:</span>
              <div className="flex flex-wrap gap-1.5">
                {matches.map((m, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-900/60 text-indigo-300 font-mono text-xs">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

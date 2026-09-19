'use client';

import React, { useState } from 'react';
import { GitignoreTemplate } from '@/lib/gitignore-data';
import {
  Copy,
  Check,
  Download,
  FileCode,
  Layers,
  Sparkles,
  HelpCircle,
  Terminal,
  ShieldCheck
} from 'lucide-react';

interface GitignoreViewerProps {
  template: GitignoreTemplate;
}

export function GitignoreViewer({ template }: GitignoreViewerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadFile = () => {
    const filename = template.slug.includes('dockerignore') ? '.dockerignore' : '.gitignore';
    const blob = new Blob([template.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = template.content.split('\n');

  return (
    <div className="space-y-8">
      {/* Primary .gitignore Code Card */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <FileCode className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white font-mono">
              {template.slug.includes('dockerignore') ? '.dockerignore' : '.gitignore'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ({lines.length} lines)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={downloadFile}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Download File</span>
            </button>
            <button
              onClick={() => copyToClipboard(template.content, 'full-content')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shrink-0 shadow-sm"
            >
              {copiedKey === 'full-content' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Content</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* File Content with Line Numbers */}
        <div className="p-4 sm:p-6 bg-slate-950 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => {
                const isComment = line.trim().startsWith('#');
                const isBlank = line.trim() === '';
                return (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="pr-4 text-right select-none text-slate-600 w-8">
                      {idx + 1}
                    </td>
                    <td
                      className={`whitespace-pre ${
                        isComment
                          ? 'text-slate-500 italic'
                          : isBlank
                          ? 'text-transparent'
                          : 'text-emerald-300 font-medium'
                      }`}
                    >
                      {line || ' '}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Rules Breakdown */}
      {template.highlightedRules && template.highlightedRules.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>Key Rules &amp; Why They Are Ignored</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {template.highlightedRules.map((rule, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5"
              >
                <code className="text-xs font-mono font-bold text-emerald-400 block">
                  {rule.pattern}
                </code>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {rule.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergency Git Cache Cleanup Command */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          <span>Already Committed Ignored Files? Purge from Git Cache</span>
        </h3>
        <p className="text-xs text-slate-400">
          Adding a pattern to .gitignore does NOT delete files that were already tracked in previous commits. Run this command to remove them from tracking without deleting your local copies:
        </p>
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
          <code className="text-xs font-mono text-amber-300 truncate pr-2">
            git rm -r --cached . &amp;&amp; git add . &amp;&amp; git commit -m &quot;Untrack ignored files&quot;
          </code>
          <button
            onClick={() => copyToClipboard('git rm -r --cached . && git add . && git commit -m "Untrack ignored files"', 'clean-cache')}
            className="text-slate-400 hover:text-white transition text-xs flex items-center gap-1 shrink-0"
          >
            {copiedKey === 'clean-cache' ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileText, Download, Trash2, ArrowRightLeft, Check } from 'lucide-react';

function simpleMarkdownToHtml(md: string): string {
  // Sanitize raw scripts and iframes to prevent XSS
  let html = md
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote>$1</blockquote>');
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');
  // Unordered list
  html = html.replace(/^\s*\*\s(.*)$/gim, '<ul>\n  <li>$1</li>\n</ul>');
  // Paragraphs
  html = html.replace(/^\s*(\n)?(.+)/gim, function (m) {
    return /^<(\/)?(h1|h2|h3|pre|blockquote|ul|li)/.test(m) ? m : '<p>' + m + '</p>';
  });
  return html.trim();
}

function simpleHtmlToMarkdown(html: string): string {
  let md = html;
  md = md.replace(/<h1>(.*?)<\/h1>/gim, '# $1\n\n');
  md = md.replace(/<h2>(.*?)<\/h2>/gim, '## $1\n\n');
  md = md.replace(/<h3>(.*?)<\/h3>/gim, '### $1\n\n');
  md = md.replace(/<strong>(.*?)<\/strong>/gim, '**$1**');
  md = md.replace(/<b>(.*?)<\/b>/gim, '**$1**');
  md = md.replace(/<em>(.*?)<\/em>/gim, '*$1*');
  md = md.replace(/<i>(.*?)<\/i>/gim, '*$1*');
  md = md.replace(/<blockquote>(.*?)<\/blockquote>/gim, '> $1\n\n');
  md = md.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/gim, '```\n$1\n```\n\n');
  md = md.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)"[^>]*>(.*?)<\/a>/gim, '[$2]($1)');
  md = md.replace(/<li>(.*?)<\/li>/gim, '* $1\n');
  md = md.replace(/<\/?(ul|ol)>/gim, '\n');
  md = md.replace(/<p>(.*?)<\/p>/gim, '$1\n\n');
  md = md.replace(/<br\s*[\/]?>/gi, '\n');
  md = md.replace(/<[^>]+>/g, '');
  return md.trim();
}

export function MarkdownHtmlConverter() {
  const [mode, setMode] = useState<'md2html' | 'html2md'>('md2html');
  const [inputText, setInputText] = useState(
    `# ZeroUpload Platform\n\nUltra-fast **100% client-side** developer utilities.\n\n## Key Advantages\n* Zero server logs\n* Sub-millisecond execution\n* Privacy first\n\n> "Speed and privacy without compromise."\n\nVisit [ZeroUpload](https://devtransform-hub.vercel.app)`
  );

  const convertedText = useMemo(() => {
    if (!inputText.trim()) return '';
    return mode === 'md2html' ? simpleMarkdownToHtml(inputText) : simpleHtmlToMarkdown(inputText);
  }, [inputText, mode]);

  const downloadFile = () => {
    const filename = mode === 'md2html' ? 'document.html' : 'document.md';
    const mime = mode === 'md2html' ? 'text/html' : 'text/markdown';
    const blob = new Blob([convertedText], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
            <button
              type="button"
              onClick={() => setMode('md2html')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mode === 'md2html' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Markdown to HTML
            </button>
            <button
              type="button"
              onClick={() => setMode('html2md')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                mode === 'html2md' ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              HTML to Markdown
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={downloadFile}
          className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors flex items-center space-x-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download {mode === 'md2html' ? '.html' : '.md'}</span>
        </button>
      </div>

      {/* 2-Column Inputs & Converted Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileText className="w-4 h-4 text-brand-emerald" />
              <span>Input {mode === 'md2html' ? 'Markdown' : 'HTML'}:</span>
            </span>
            <button
              type="button"
              onClick={() => setInputText('')}
              className="text-zinc-500 hover:text-rose-400 transition-colors"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder={mode === 'md2html' ? '# Type markdown here...' : '<h1>Type HTML here...</h1>'}
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Converted {mode === 'md2html' ? 'HTML Code' : 'Markdown Source'}:</span>
              <CopyButton text={convertedText} />
            </div>

            <textarea
              readOnly
              value={convertedText}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

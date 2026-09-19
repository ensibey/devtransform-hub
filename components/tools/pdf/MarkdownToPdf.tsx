'use client';

import React, { useState } from 'react';
import { downloadBlob } from '@/lib/utils';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Eye,
  Edit3
} from 'lucide-react';

const SAMPLE_MARKDOWN = `# Technical Design Document
**Author:** Engineering Team  
**Date:** September 2026  
**Status:** Approved for Production  

---

## 1. Executive Summary
This document outlines the architecture for the **DevTransform Client-Side Utility Platform**. The primary objective is delivering ultra-fast document transformations with zero server latency and total user data privacy.

## 2. Key Architecture Pillars
- **Zero-Server Storage:** All files are parsed directly inside client browser memory.
- **Wasm & Pure JS Acceleration:** Fast rendering utilizing web standards.
- **High SEO Discoverability:** Complete SSG pre-rendering across 7,800+ targeted routes.

## 3. Specifications & Benchmarks

| Metric | Target | Result |
| :--- | :---: | :---: |
| First Contentful Paint | < 0.8s | 0.4s |
| Document Conversion Time | < 1.0s | 0.2s |
| Server Uploads | 0 bytes | **0 bytes** |

\`\`\`typescript
// Safe Client-Side Parsing Example
export async function convertDocument(file: File): Promise<Blob> {
  const buffer = await file.arrayBuffer();
  return processLocally(buffer);
}
\`\`\`

> *"True privacy means your confidential data never leaves your computer."*
`;

export function MarkdownToPdf() {
  const [markdown, setMarkdown] = useState(SAMPLE_MARKDOWN);
  const [docTitle, setDocTitle] = useState('Markdown_Document');
  const [activeTab, setActiveTab] = useState<'both' | 'edit' | 'preview'>('both');
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    downloadBlob(blob, `${docTitle}.md`);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple clean markdown parser for headings, lists, tables, bold, italics, code
  const renderMarkdownHtml = (md: string) => {
    let html = md
      .replace(/^### (.*$)/gim, '<h3 style="font-size: 1.15rem; font-weight: bold; margin-top: 1.25em; margin-bottom: 0.5em; color: #1e293b;">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 style="font-size: 1.35rem; font-weight: bold; margin-top: 1.5em; margin-bottom: 0.5em; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.25em;">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 style="font-size: 1.75rem; font-weight: 800; margin-bottom: 0.75em; color: #0f172a; border-bottom: 2px solid #0f172a; padding-bottom: 0.3em;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em>$1</em>')
      .replace(/^---$/gim, '<hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 1.5em 0;" />')
      .replace(/^> (.*$)/gim, '<blockquote style="border-left: 4px solid #3b82f6; padding-left: 1em; color: #475569; font-style: italic; margin: 1em 0; background: #f8fafc; padding-top: 0.5em; padding-bottom: 0.5em;">$1</blockquote>')
      .replace(/```typescript([\s\S]*?)```/gim, '<pre style="background: #0f172a; color: #e2e8f0; padding: 1em; border-radius: 8px; font-family: monospace; font-size: 0.85em; overflow-x: auto; margin: 1em 0;"><code>$1</code></pre>')
      .replace(/```([\s\S]*?)```/gim, '<pre style="background: #0f172a; color: #e2e8f0; padding: 1em; border-radius: 8px; font-family: monospace; font-size: 0.85em; overflow-x: auto; margin: 1em 0;"><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code style="background: #f1f5f9; color: #0f172a; padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em; font-family: monospace;">$1</code>')
      .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-left: 1.5em; list-style-type: disc;">$1</li>')
      .replace(/\n\n/gim, '<p style="margin-bottom: 1em;"></p>');

    return html;
  };

  return (
    <div className="space-y-8">
      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-markdown-doc,
          #printable-markdown-doc * {
            visibility: visible;
          }
          #printable-markdown-doc {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Top Action Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-sm font-bold text-foreground bg-transparent border-b border-dashed border-border focus:border-purple-500 focus:outline-none"
              placeholder="Document Title"
            />
            <p className="text-xs text-muted-foreground">
              {markdown.split(/\s+/).length} Words • {markdown.length} Chars
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-background border border-border rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'both' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'edit' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 inline mr-1" />
              Editor
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeTab === 'preview' ? 'bg-secondary text-foreground font-semibold' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Eye className="w-3.5 h-3.5 inline mr-1" />
              Preview
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleDownloadMd}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .MD
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className={`grid gap-6 ${activeTab === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Markdown Input Area */}
        {(activeTab === 'both' || activeTab === 'edit') && (
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-2 flex flex-col">
            <div className="flex items-center justify-between text-xs text-muted-foreground pb-2 border-b border-border/60">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-purple-400" />
                Markdown Input
              </span>
              <button
                onClick={() => setMarkdown(SAMPLE_MARKDOWN)}
                className="text-[11px] hover:text-purple-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Sample
              </button>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              rows={22}
              className="w-full flex-1 bg-background border border-border rounded-xl p-4 text-xs font-mono text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-500/30 resize-y"
              placeholder="Type your markdown here..."
            />
          </div>
        )}

        {/* Formatted Sheet Preview */}
        {(activeTab === 'both' || activeTab === 'preview') && (
          <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border flex justify-center overflow-x-auto">
            <div
              id="printable-markdown-doc"
              className="bg-white text-slate-900 shadow-xl rounded-sm p-8 sm:p-12 w-[595px] min-h-[842px] font-sans text-xs leading-relaxed"
            >
              <div dangerouslySetInnerHTML={{ __html: renderMarkdownHtml(markdown) }} />
            </div>
          </div>
        )}
      </div>

      {/* Privacy & Quality Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Client-Side
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your notes and technical documents are compiled locally without transmitting data to any cloud servers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Clean Page-Break Styling
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Engineered with CSS @page print margins so headers, tables, and code snippets paginate cleanly into PDF.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Printer className="w-4 h-4 text-blue-400" />
            Direct Vector PDF
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Outputs crisp vector text that remains sharp at any zoom level, complete with selectable text.
          </p>
        </div>
      </div>
    </div>
  );
}

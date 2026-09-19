'use client';

import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Hash,
  Type
} from 'lucide-react';

const SAMPLE_TEXT = `// System Architecture Log & Meeting Minutes
Date: September 20, 2026
Attendees: Core Engineering, DevOps, Architecture Review Board
Status: Production Go-Live Approved

Key Action Items:
1. Complete static build verification across all 7,880+ production routes.
2. Implement client-side PDF and Office transformation engines.
3. Validate zero-server privacy architecture (0 bytes transmitted).
4. Monitor Google Search Console indexing progression and impressions.

Technical Specifications:
- Framework: Next.js 14 SSG with pure HTML export
- CSS Engine: Tailwind CSS with dark/light mode and print stylesheets
- Parsing: Mammoth.js, PapaParse, and pdf-lib
- CDN: Global Edge Deployment with sub-100ms TTFB

Security Notes:
- All sensitive customer documents are processed exclusively inside local client RAM.
- No remote telemetry or cloud storage is utilized.
`;

export function TextToPdf() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [docTitle, setDocTitle] = useState('Text_Document');
  const [fontFamily, setFontFamily] = useState<'mono' | 'sans' | 'serif'>('mono');
  const [fontSize, setFontSize] = useState<'10' | '12' | '14'>('12');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setDocTitle(file.name.replace(/\.[^/.]+$/, ''));

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        setText(content);
      }
    };
    reader.readAsText(file);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${docTitle}.txt`);
  };

  const lines = text.split('\n');
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-8">
      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-text-doc,
          #printable-text-doc * {
            visibility: visible;
          }
          #printable-text-doc {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Top Action Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-sm font-bold text-foreground bg-transparent border-b border-dashed border-border focus:border-blue-500 focus:outline-none"
              placeholder="Document Title"
            />
            <p className="text-xs text-muted-foreground">
              {lines.length} Lines • {wordCount} Words • {text.length} Chars
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value as any)}
            className="bg-background border border-border text-xs rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="mono">Monospace (Code / Logs)</option>
            <option value="sans">Modern Sans (Clean)</option>
            <option value="serif">Classic Serif (Print)</option>
          </select>

          <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none bg-background border border-border px-2.5 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
              className="rounded border-border text-blue-500 focus:ring-blue-500/20 w-3.5 h-3.5"
            />
            <span>Line Numbers</span>
          </label>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleDownloadTxt}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .TXT
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Save as PDF / Print
          </button>
        </div>
      </div>

      {/* Editor & Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Input */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <Type className="w-4 h-4 text-blue-400" />
              Source Text / Code / Notes
            </span>
            <button
              onClick={() => setText(SAMPLE_TEXT)}
              className="text-[11px] hover:text-blue-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Sample
            </button>
          </div>

          <FileDropzone
            accept=".txt,.log,.sh,.js,.ts,.py,.json,.md,.env"
            maxSizeMB={15}
            onFilesSelected={handleFilesSelected}
            title="Upload text or log file"
            subtitle="Drop .txt, .log, code files here"
          />

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={18}
            className="w-full flex-1 bg-background border border-border rounded-xl p-3.5 text-xs font-mono text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-y"
            placeholder="Type or paste plain text here..."
          />
        </div>

        {/* Formatted Sheet Preview */}
        <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border flex justify-center overflow-x-auto">
          <div
            id="printable-text-doc"
            className={`bg-white text-slate-900 shadow-xl rounded-sm p-8 w-[595px] min-h-[842px] ${
              fontFamily === 'mono'
                ? 'font-mono'
                : fontFamily === 'serif'
                ? 'font-serif'
                : 'font-sans'
            } text-xs leading-relaxed`}
          >
            <div className="border-b border-slate-300 pb-3 mb-4 flex items-center justify-between">
              <div>
                <h1 className="text-base font-bold text-slate-900">{docTitle}</h1>
                <p className="text-[10px] text-slate-500">
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • {lines.length} Lines
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400">DevTransform Text to PDF</span>
            </div>

            <div className="space-y-0.5">
              {lines.map((line, idx) => (
                <div key={idx} className="flex leading-relaxed">
                  {showLineNumbers && (
                    <span className="select-none text-slate-400 text-right pr-4 w-9 flex-shrink-0 font-mono text-[10px]">
                      {idx + 1}
                    </span>
                  )}
                  <span className="whitespace-pre-wrap break-all flex-1">{line || '\u00A0'}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% In-Browser Privacy
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your logs, code, meeting notes, and passwords are never uploaded or saved to remote databases.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Hash className="w-4 h-4 text-blue-400" />
            Sequential Line Numbers
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Perfect for code reviews, legal transcripts, contracts, and server error logs with clean margin numbers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Printer className="w-4 h-4 text-purple-400" />
            Vector Sharpness
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Outputs crisp vector text that remains sharp at any zoom level with selectable text.
          </p>
        </div>
      </div>
    </div>
  );
}

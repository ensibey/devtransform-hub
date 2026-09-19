'use client';

import React, { useState } from 'react';
import { downloadBlob } from '@/lib/utils';
import {
  FileCode,
  Printer,
  Download,
  Copy,
  Check,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Maximize2
} from 'lucide-react';

const SAMPLE_HTML = `<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 20px; line-height: 1.6; }
    .header { border-bottom: 2px solid #3b82f6; padding-bottom: 12px; margin-bottom: 24px; }
    h1 { color: #1e40af; margin: 0; font-size: 24px; }
    .invoice-details { display: flex; justify-content: space-between; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th { background: #f1f5f9; text-align: left; padding: 10px; border-bottom: 1px solid #cbd5e1; font-size: 12px; }
    td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
    .total-row { font-weight: bold; background: #f8fafc; }
    .footer { margin-top: 40px; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Project Invoice & Specification</h1>
    <p style="margin: 4px 0 0; color: #64748b; font-size: 12px;">Invoice #: INV-2026-092 • Date: September 20, 2026</p>
  </div>

  <div class="invoice-details">
    <div>
      <strong>Billed To:</strong><br/>
      Client Organization Inc.<br/>
      Tech Park, Innovation Boulevard
    </div>
    <div style="text-align: right;">
      <strong>Payment Terms:</strong><br/>
      Net 30 Days<br/>
      Status: <span style="color: #16a34a; font-weight: bold;">Paid in Full</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Hours / Qty</th>
        <th>Rate</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Web Application Performance Tuning & SEO Architecture</td>
        <td>40 hrs</td>
        <td>$125.00</td>
        <td style="text-align: right;">$5,000.00</td>
      </tr>
      <tr>
        <td>Client-Side Privacy Engine & Wasm Compiler Setup</td>
        <td>25 hrs</td>
        <td>$125.00</td>
        <td style="text-align: right;">$3,125.00</td>
      </tr>
      <tr class="total-row">
        <td colspan="3" style="text-align: right;">Total Balance:</td>
        <td style="text-align: right; color: #1e40af; font-size: 14px;">$8,125.00</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <p>Thank you for your business! Generated locally with DevTransform Privacy Suite.</p>
  </div>
</body>
</html>`;

export function HtmlToPdf() {
  const [htmlCode, setHtmlCode] = useState(SAMPLE_HTML);
  const [docTitle, setDocTitle] = useState('HTML_Invoice_Document');
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlCode], { type: 'text/html;charset=utf-8' });
    downloadBlob(blob, `${docTitle}.html`);
  };

  return (
    <div className="space-y-8">
      {/* Print Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-html-render,
          #printable-html-render * {
            visibility: visible;
          }
          #printable-html-render {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            padding: 15mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Action Toolbar */}
      <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 flex-shrink-0">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="text-sm font-bold text-foreground bg-transparent border-b border-dashed border-border focus:border-amber-500 focus:outline-none"
              placeholder="Document Title"
            />
            <p className="text-xs text-muted-foreground">
              Instant WYSIWYG HTML &amp; CSS to PDF Compiler
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHtmlCode(SAMPLE_HTML)}
            className="px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>

          <button
            onClick={handleCopy}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy HTML'}
          </button>

          <button
            onClick={handleDownloadHtml}
            className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            .HTML
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            Save as PDF / Print
          </button>
        </div>
      </div>

      {/* Two Column Workspace: Code & Live Rendered Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col space-y-2">
          <span className="text-xs font-semibold text-foreground font-mono">
            HTML &amp; Inline CSS Source:
          </span>
          <textarea
            value={htmlCode}
            onChange={(e) => setHtmlCode(e.target.value)}
            rows={24}
            className="w-full flex-1 bg-background border border-border rounded-xl p-3.5 text-xs font-mono text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500/30 resize-y"
            placeholder="<html>...</html>"
          />
        </div>

        <div className="bg-muted/30 p-4 sm:p-6 rounded-2xl border border-border flex justify-center overflow-x-auto">
          <div
            id="printable-html-render"
            className="bg-white shadow-xl rounded-sm p-6 sm:p-8 w-[595px] min-h-[842px] overflow-hidden"
            dangerouslySetInnerHTML={{ __html: htmlCode }}
          />
        </div>
      </div>

      {/* Feature Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Complete Security & Privacy
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your HTML templates and customer invoices render strictly in memory. No credentials or data stored.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            CSS Styling Supported
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Supports flexbox, CSS grids, custom fonts, tables, margins, and inline images for exact pixel placement.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Printer className="w-4 h-4 text-blue-400" />
            Standard A4 Dimensions
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pre-configured with standard 595 x 842 pt A4 dimensions to ensure clean page pagination when printing to PDF.
          </p>
        </div>
      </div>
    </div>
  );
}

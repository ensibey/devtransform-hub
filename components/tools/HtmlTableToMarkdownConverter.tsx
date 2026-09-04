'use client';

import React, { useState, useMemo } from 'react';
import { 
  Table, 
  Copy, 
  Check, 
  Sparkles, 
  RotateCcw, 
  Code2, 
  FileText, 
  CheckCircle2, 
  Eye 
} from 'lucide-react';

const SAMPLE_HTML = `<table class="table-auto">
  <thead>
    <tr>
      <th>Feature</th>
      <th>Client-Side</th>
      <th>Server-Side</th>
      <th>Latency</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Data Privacy</strong></td>
      <td>100% Zero-Upload</td>
      <td>Database Storage</td>
      <td><code>0 ms</code></td>
    </tr>
    <tr>
      <td><strong>Offline Capable</strong></td>
      <td>Yes (Service Worker)</td>
      <td>Requires Network</td>
      <td><code>&lt; 5 ms</code></td>
    </tr>
    <tr>
      <td><strong>Edge Scalability</strong></td>
      <td>Global CDN Edge</td>
      <td>Regional Container</td>
      <td><code>~12 ms</code></td>
    </tr>
  </tbody>
</table>`;

export function HtmlTableToMarkdownConverter() {
  const [htmlInput, setHtmlInput] = useState<string>(SAMPLE_HTML);
  const [copied, setCopied] = useState<boolean>(false);
  const [previewTab, setPreviewTab] = useState<'markdown' | 'rendered'>('rendered');

  // Convert HTML Table to GitHub Flavored Markdown
  const markdownOutput = useMemo(() => {
    if (!htmlInput.trim()) return '';

    try {
      // Create DOM parser for clean client-side extraction
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlInput, 'text/html');
      const table = doc.querySelector('table');

      if (!table) {
        return '<!-- No <table> element detected in HTML -->';
      }

      const rows: string[][] = [];

      // Extract headers
      const theadRows = table.querySelectorAll('thead tr');
      if (theadRows.length > 0) {
        theadRows.forEach(tr => {
          const row: string[] = [];
          tr.querySelectorAll('th, td').forEach(cell => {
            row.push(cell.textContent?.trim().replace(/\|/g, '\\|') || '');
          });
          if (row.length > 0) rows.push(row);
        });
      }

      // Extract body rows
      const tbodyRows = table.querySelectorAll('tbody tr, tr');
      tbodyRows.forEach(tr => {
        // Skip if already in thead
        if (tr.parentElement?.tagName.toLowerCase() === 'thead') return;
        const row: string[] = [];
        tr.querySelectorAll('td, th').forEach(cell => {
          row.push(cell.textContent?.trim().replace(/\|/g, '\\|') || '');
        });
        if (row.length > 0) rows.push(row);
      });

      if (rows.length === 0) return '<!-- Table contains no row data -->';

      // Find max column count
      const colCount = Math.max(...rows.map(r => r.length));

      // Build header
      const headerRow = rows[0] || [];
      while (headerRow.length < colCount) headerRow.push('');

      let md = '| ' + headerRow.join(' | ') + ' |\n';
      md += '| ' + Array(colCount).fill('---').join(' | ') + ' |\n';

      // Build body rows
      for (let i = 1; i < rows.length; i++) {
        const bodyRow = rows[i];
        while (bodyRow.length < colCount) bodyRow.push('');
        md += '| ' + bodyRow.join(' | ') + ' |\n';
      }

      return md.trim();
    } catch {
      return '<!-- Error parsing HTML table structure -->';
    }
  }, [htmlInput]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Table className="w-3.5 h-3.5" /> GFM Table Converter
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Clean DOM Parser
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            HTML Table to Markdown Converter
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Convert HTML &lt;table&gt; markup, scraped web tables, and Wiki tables into clean GitHub Flavored Markdown (GFM).
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold transition shadow-sm shadow-emerald-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Markdown'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input HTML */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-400" /> HTML &lt;table&gt; Markup
              </span>
              <button
                onClick={() => setHtmlInput(SAMPLE_HTML)}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Load Sample
              </button>
            </div>

            <textarea
              value={htmlInput}
              onChange={(e) => setHtmlInput(e.target.value)}
              rows={16}
              className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-y leading-relaxed"
              placeholder="<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table>"
            />

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              <span>Supports &lt;thead&gt;, &lt;tbody&gt;, &lt;th&gt;, &lt;td&gt;</span>
              <span>Pipe characters (|) auto-escaped</span>
            </div>
          </div>
        </div>

        {/* Right: Markdown Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col h-full min-h-[460px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  onClick={() => setPreviewTab('markdown')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                    previewTab === 'markdown' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-400" />
                  <span>GFM Markdown</span>
                </button>
                <button
                  onClick={() => setPreviewTab('rendered')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium transition ${
                    previewTab === 'rendered' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rendered Table</span>
                </button>
              </div>

              <span className="text-xs text-slate-500 font-mono">
                {markdownOutput.split('\n').length} lines
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {previewTab === 'markdown' ? (
                <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed h-full overflow-y-auto">
                  {markdownOutput}
                </pre>
              ) : (
                <div
                  dangerouslySetInnerHTML={{ __html: htmlInput }}
                  className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-200 overflow-x-auto [&_table]:w-full [&_th]:border [&_th]:border-slate-800 [&_th]:p-2 [&_th]:bg-slate-900/80 [&_th]:text-left [&_td]:border [&_td]:border-slate-800 [&_td]:p-2"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

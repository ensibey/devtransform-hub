'use client';

import React, { useState, useMemo } from 'react';
import {
  Table as TableIcon,
  Copy,
  Check,
  Download,
  FileCode,
  FileSpreadsheet,
  Layers,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const SAMPLE_MARKDOWN = `| Feature | Free Tier | Pro Developer | Enterprise Team |
| :--- | :---: | :---: | ---: |
| Monthly Active Users | 5,000 | 100,000 | Unlimited |
| API Rate Limit | 60 req/min | 1,200 req/min | Dedicated Node |
| Client-Side Privacy | 100% | 100% | 100% Air-Gapped |
| Support SLA | Community | 12 Hours | 15 Minutes |
| Price | $0 / mo | $29 / mo | Custom |`;

type OutputStyle = 'tailwind' | 'bootstrap' | 'clean';

export function MarkdownTableToHtmlConverter() {
  const [markdownInput, setMarkdownInput] = useState<string>(SAMPLE_MARKDOWN);
  const [activeTab, setActiveTab] = useState<'preview' | 'html' | 'csv'>('preview');
  const [stylePreset, setStylePreset] = useState<OutputStyle>('tailwind');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Parse markdown table into headers, alignments, and rows
  const parsedTable = useMemo(() => {
    const lines = markdownInput
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && l.startsWith('|'));

    if (lines.length < 2) {
      return { valid: false, headers: [], alignments: [], rows: [], error: 'Please enter at least a header row and separator row.' };
    }

    // Helper to split row cells
    const splitRow = (rowStr: string) => {
      let content = rowStr;
      if (content.startsWith('|')) content = content.slice(1);
      if (content.endsWith('|')) content = content.slice(0, -1);
      return content.split('|').map((c) => c.trim());
    };

    const headerCells = splitRow(lines[0]);
    const separatorCells = splitRow(lines[1]);

    // Check alignments from separator row
    const alignments: ('left' | 'center' | 'right')[] = separatorCells.map((sep) => {
      const trimmed = sep.trim();
      if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
      if (trimmed.endsWith(':')) return 'right';
      return 'left';
    });

    const bodyRows: string[][] = [];
    for (let i = 2; i < lines.length; i++) {
      const cells = splitRow(lines[i]);
      if (cells.length > 0) {
        bodyRows.push(cells);
      }
    }

    return {
      valid: true,
      headers: headerCells,
      alignments,
      rows: bodyRows,
      error: null,
    };
  }, [markdownInput]);

  // Generate HTML based on selected style preset
  const generatedHtml = useMemo(() => {
    if (!parsedTable.valid) return '';

    const getAlignClass = (align: 'left' | 'center' | 'right') => {
      if (stylePreset === 'tailwind') {
        if (align === 'center') return 'text-center';
        if (align === 'right') return 'text-right';
        return 'text-left';
      }
      return `text-${align}`;
    };

    let tableClass = '';
    let thClass = '';
    let tdClass = '';
    let theadClass = '';
    let tbodyClass = '';

    if (stylePreset === 'tailwind') {
      tableClass = 'min-w-full divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden';
      theadClass = 'bg-slate-50 dark:bg-slate-900';
      thClass = 'px-4 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider';
      tbodyClass = 'divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-950';
      tdClass = 'px-4 py-3 text-sm text-slate-800 dark:text-slate-200 whitespace-nowrap';
    } else if (stylePreset === 'bootstrap') {
      tableClass = 'table table-striped table-bordered table-hover';
      theadClass = 'table-light';
      thClass = 'th';
      tdClass = 'td';
    } else {
      tableClass = 'minimal-table';
    }

    const headerHtml = `    <tr${theadClass ? ` class="${theadClass}"` : ''}>\n` +
      parsedTable.headers
        .map((h, i) => {
          const align = parsedTable.alignments[i] || 'left';
          const alignClass = getAlignClass(align);
          const fullClass = [thClass, alignClass].filter(Boolean).join(' ');
          const classAttr = fullClass ? ` class="${fullClass}"` : '';
          return `      <th scope="col"${classAttr}>${h}</th>`;
        })
        .join('\n') +
      '\n    </tr>';

    const bodyHtml = parsedTable.rows
      .map((row) => {
        const cells = row
          .map((cell, i) => {
            const align = parsedTable.alignments[i] || 'left';
            const alignClass = getAlignClass(align);
            const fullClass = [tdClass, alignClass].filter(Boolean).join(' ');
            const classAttr = fullClass ? ` class="${fullClass}"` : '';
            return `      <td${classAttr}>${cell}</td>`;
          })
          .join('\n');
        return `    <tr>\n${cells}\n    </tr>`;
      })
      .join('\n');

    return `<table class="${tableClass}">\n  <thead>\n${headerHtml}\n  </thead>\n  <tbody${tbodyClass ? ` class="${tbodyClass}"` : ''}>\n${bodyHtml}\n  </tbody>\n</table>`;
  }, [parsedTable, stylePreset]);

  // Generate CSV
  const generatedCsv = useMemo(() => {
    if (!parsedTable.valid) return '';
    const escapeCsv = (val: string) => {
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    };
    const headerLine = parsedTable.headers.map(escapeCsv).join(',');
    const bodyLines = parsedTable.rows.map((r) => r.map(escapeCsv).join(','));
    return [headerLine, ...bodyLines].join('\n');
  }, [parsedTable]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const downloadHtml = () => {
    const blob = new Blob([generatedHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'table.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TableIcon className="w-5 h-5 text-emerald-500" />
              Markdown Table to HTML & CSV Studio
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Convert GitHub-flavored Markdown tables into responsive HTML tables (Tailwind, Bootstrap, Clean) and CSV with column alignment support.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            100% Client-Side Privacy
          </div>
        </div>
      </div>

      {/* Editor & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Markdown Input */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-emerald-500" />
              Markdown Table Input:
            </label>
            <button
              onClick={() => setMarkdownInput(SAMPLE_MARKDOWN)}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Load Sample Table
            </button>
          </div>
          <textarea
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            rows={14}
            placeholder="| Col 1 | Col 2 |\n| :--- | ---: |\n| Data | $100 |"
            className="w-full font-mono text-xs leading-relaxed p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Supports :--- (left), :---: (center), ---: (right) alignments</span>
            <span>{parsedTable.rows.length} rows &bull; {parsedTable.headers.length} columns</span>
          </div>
        </div>

        {/* Right Column: Output & Live Preview */}
        <div className="space-y-3 flex flex-col">
          {/* Tabs and Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            {/* View Mode Tabs */}
            <div className="flex items-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Visual Preview
              </button>
              <button
                onClick={() => setActiveTab('html')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'html'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                HTML Code
              </button>
              <button
                onClick={() => setActiveTab('csv')}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                  activeTab === 'csv'
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                CSV Export
              </button>
            </div>

            {/* Style Preset Selector (When in HTML or Preview mode) */}
            {activeTab !== 'csv' && (
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-500 font-medium">Style:</span>
                <select
                  value={stylePreset}
                  onChange={(e) => setStylePreset(e.target.value as OutputStyle)}
                  className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium"
                >
                  <option value="tailwind">Tailwind CSS</option>
                  <option value="bootstrap">Bootstrap 5</option>
                  <option value="clean">Minimal Vanilla</option>
                </select>
              </div>
            )}
          </div>

          {/* Content Box */}
          <div className="flex-1 min-h-[320px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden relative flex flex-col">
            {parsedTable.valid ? (
              <>
                {/* Visual Preview */}
                {activeTab === 'preview' && (
                  <div className="p-4 overflow-x-auto flex-1">
                    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                      <thead className="bg-slate-50 dark:bg-slate-800/60">
                        <tr>
                          {parsedTable.headers.map((h, i) => {
                            const align = parsedTable.alignments[i] || 'left';
                            return (
                              <th
                                key={i}
                                className={`px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-${align}`}
                              >
                                {h}
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                        {parsedTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                            {row.map((cell, cIdx) => {
                              const align = parsedTable.alignments[cIdx] || 'left';
                              return (
                                <td
                                  key={cIdx}
                                  className={`px-4 py-2.5 text-xs text-slate-800 dark:text-slate-200 whitespace-nowrap text-${align}`}
                                >
                                  {cell}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* HTML Code Output */}
                {activeTab === 'html' && (
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 max-h-[300px]">
                      <code>{generatedHtml}</code>
                    </pre>
                  </div>
                )}

                {/* CSV Output */}
                {activeTab === 'csv' && (
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <pre className="font-mono text-xs text-slate-800 dark:text-slate-200 overflow-x-auto p-3 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 max-h-[300px]">
                      <code>{generatedCsv}</code>
                    </pre>
                  </div>
                )}

                {/* Footer Action Buttons */}
                <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Ready for web pages & README files
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        copyToClipboard(
                          activeTab === 'csv' ? generatedCsv : generatedHtml,
                          'content'
                        )
                      }
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-sm"
                    >
                      {copiedKey === 'content' ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy {activeTab === 'csv' ? 'CSV' : 'HTML'}
                        </>
                      )}
                    </button>
                    {activeTab === 'html' && (
                      <button
                        onClick={downloadHtml}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download .html
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-8 text-center text-red-500 text-sm flex items-center justify-center h-full">
                {parsedTable.error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

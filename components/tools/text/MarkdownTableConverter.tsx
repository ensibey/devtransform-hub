'use client';

import React, { useState, useMemo } from 'react';
import Papa from 'papaparse';
import { CopyButton } from '@/components/shared/CopyButton';
import { Table, ArrowRightLeft, FileCode, Sparkles, Check, AlertCircle } from 'lucide-react';

const DEFAULT_MARKDOWN = `| ID | Product Name | Category | Price | Stock |
| :--- | :--- | :--- | :--- | :--- |
| 101 | Wireless Mechanical Keyboard | Hardware | $129.99 | In Stock |
| 102 | Ergonomic Vertical Mouse | Hardware | $69.50 | In Stock |
| 103 | UltraWide Curved Monitor 34" | Displays | $499.00 | Low Stock |
| 104 | USB-C Multiport Hub | Accessories | $39.99 | Sold Out |`;

function parseMarkdownTable(md: string): { headers: string[]; rows: string[][] } | null {
  const lines = md.trim().split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  // Filter out lines that don't look like table rows
  const tableLines = lines.filter((l) => l.startsWith('|') || l.includes('|'));
  if (tableLines.length < 2) return null;

  const splitRow = (line: string) =>
    line
      .replace(/^\|/, '')
      .replace(/\|$/, '')
      .split('|')
      .map((c) => c.trim());

  const headers = splitRow(tableLines[0]);
  // Line 1 is usually the separator line (| :--- | :--- |)
  const contentLines = tableLines.slice(1).filter((l) => !/^[|\s:-]+$/.test(l));
  const rows = contentLines.map(splitRow);

  return { headers, rows };
}

export function MarkdownTableConverter() {
  const [markdownInput, setMarkdownInput] = useState(DEFAULT_MARKDOWN);
  const [outputTab, setOutputTab] = useState<'json' | 'csv' | 'preview'>('json');

  const parsedData = useMemo(() => {
    return parseMarkdownTable(markdownInput);
  }, [markdownInput]);

  const jsonOutput = useMemo(() => {
    if (!parsedData || parsedData.headers.length === 0) return '';
    const { headers, rows } = parsedData;
    const objects = rows.map((row) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h || `col_${i + 1}`] = row[i] ?? '';
      });
      return obj;
    });
    return JSON.stringify(objects, null, 2);
  }, [parsedData]);

  const csvOutput = useMemo(() => {
    if (!parsedData || parsedData.headers.length === 0) return '';
    const { headers, rows } = parsedData;
    return Papa.unparse({
      fields: headers,
      data: rows,
    });
  }, [parsedData]);

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <Table className="w-5 h-5 text-brand-emerald" />
          <span className="text-sm font-semibold text-white">Target Output Format</span>
        </div>

        <div className="flex items-center space-x-2">
          {[
            { id: 'json', label: 'JSON Array' },
            { id: 'csv', label: 'CSV SpreadSheet' },
            { id: 'preview', label: 'Visual Table' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setOutputTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-colors ${
                outputTab === tab.id
                  ? 'bg-brand-emerald text-black font-bold'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Side by side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Markdown Input */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              Markdown Table Source
            </span>
            <button
              type="button"
              onClick={() => setMarkdownInput(DEFAULT_MARKDOWN)}
              className="text-[11px] font-mono text-brand-emerald hover:underline"
            >
              Reset Sample
            </button>
          </div>
          <textarea
            value={markdownInput}
            onChange={(e) => setMarkdownInput(e.target.value)}
            rows={15}
            placeholder="Paste | Header 1 | Header 2 | here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-xs focus:border-brand-emerald focus:outline-none resize-none leading-relaxed"
          />
          {!parsedData && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Could not parse valid markdown table. Please verify pipe (|) formatting.</span>
            </div>
          )}
        </div>

        {/* Output Panel */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Converted {outputTab.toUpperCase()}
            </span>
            {outputTab === 'json' && jsonOutput && <CopyButton text={jsonOutput} />}
            {outputTab === 'csv' && csvOutput && <CopyButton text={csvOutput} />}
          </div>

          {outputTab === 'json' && (
            <textarea
              readOnly
              value={jsonOutput}
              rows={15}
              placeholder="JSON will appear here..."
              className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed select-all"
            />
          )}

          {outputTab === 'csv' && (
            <textarea
              readOnly
              value={csvOutput}
              rows={15}
              placeholder="CSV will appear here..."
              className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed select-all"
            />
          )}

          {outputTab === 'preview' && (
            <div className="w-full flex-1 p-2 bg-black/60 border border-zinc-800 rounded-xl overflow-x-auto">
              {parsedData ? (
                <table className="w-full text-left text-xs font-mono border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-700 bg-zinc-900/80">
                      {parsedData.headers.map((h, idx) => (
                        <th key={idx} className="p-2.5 text-brand-emerald font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {parsedData.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-b border-zinc-800/60 hover:bg-zinc-800/30">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-2.5 text-zinc-300">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <span className="text-xs text-zinc-500 p-4 block">No table data to preview</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

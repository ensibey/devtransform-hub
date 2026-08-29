'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Table, Plus, Trash2, AlignLeft, AlignCenter, AlignRight, FileText, Check } from 'lucide-react';

type Alignment = 'left' | 'center' | 'right';

export function MarkdownTableGenerator() {
  const [headers, setHeaders] = useState(['Feature', 'Client-Side', 'Server Cost', 'Latency']);
  const [alignments, setAlignments] = useState<Alignment[]>(['left', 'center', 'center', 'right']);
  const [rows, setRows] = useState([
    ['Static Export', 'Yes (100%)', '$0.00', '< 1ms'],
    ['WASM PDF Engine', 'Yes', '$0.00', 'Sub-second'],
    ['Privacy Guarantee', 'Zero Log', '$0.00', 'Instant'],
  ]);

  const addRow = () => {
    setRows([...rows, Array(headers.length).fill('New Cell')]);
  };

  const removeRow = (rowIdx: number) => {
    if (rows.length <= 1) return;
    setRows(rows.filter((_, idx) => idx !== rowIdx));
  };

  const addColumn = () => {
    setHeaders([...headers, `Column ${headers.length + 1}`]);
    setAlignments([...alignments, 'left']);
    setRows(rows.map((row) => [...row, 'Data']));
  };

  const removeColumn = (colIdx: number) => {
    if (headers.length <= 1) return;
    setHeaders(headers.filter((_, idx) => idx !== colIdx));
    setAlignments(alignments.filter((_, idx) => idx !== colIdx));
    setRows(rows.map((row) => row.filter((_, idx) => idx !== colIdx)));
  };

  const updateHeader = (colIdx: number, val: string) => {
    const updated = [...headers];
    updated[colIdx] = val;
    setHeaders(updated);
  };

  const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    const updated = [...rows];
    updated[rowIdx][colIdx] = val;
    setRows(updated);
  };

  const toggleAlign = (colIdx: number) => {
    const next: Record<Alignment, Alignment> = { left: 'center', center: 'right', right: 'left' };
    const updated = [...alignments];
    updated[colIdx] = next[updated[colIdx]];
    setAlignments(updated);
  };

  const markdownTable = useMemo(() => {
    const headerRow = `| ${headers.join(' | ')} |`;
    const separatorRow = `| ${alignments
      .map((a) => (a === 'center' ? ':---:' : a === 'right' ? '---:' : ':---'))
      .join(' | ')} |`;
    const dataRows = rows.map((r) => `| ${r.join(' | ')} |`).join('\n');
    return `${headerRow}\n${separatorRow}\n${dataRows}`;
  }, [headers, alignments, rows]);

  return (
    <div className="space-y-6">
      {/* Interactive Grid Table Editor */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Table className="w-4 h-4 text-brand-emerald" />
            <span>Visual Table Editor ({headers.length} Cols × {rows.length} Rows)</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={addColumn}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Column</span>
            </button>
            <button
              type="button"
              onClick={addRow}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-xs font-mono text-emerald-300 border border-emerald-500/40 transition-colors flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Row</span>
            </button>
          </div>
        </div>

        {/* Scrollable Spreadsheet View */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono border-collapse">
            <thead>
              <tr className="bg-zinc-950 border-b border-zinc-800">
                {headers.map((h, colIdx) => (
                  <th key={colIdx} className="p-2 min-w-[130px]">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => toggleAlign(colIdx)}
                          className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white"
                          title={`Alignment: ${alignments[colIdx]}`}
                        >
                          {alignments[colIdx] === 'center' ? (
                            <AlignCenter className="w-3.5 h-3.5 text-sky-400" />
                          ) : alignments[colIdx] === 'right' ? (
                            <AlignRight className="w-3.5 h-3.5 text-amber-400" />
                          ) : (
                            <AlignLeft className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </button>

                        {headers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColumn(colIdx)}
                            className="p-1 rounded hover:bg-rose-950/40 text-zinc-600 hover:text-rose-400"
                            title="Delete Column"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => updateHeader(colIdx, e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-white font-bold focus:outline-none focus:border-brand-emerald"
                      />
                    </div>
                  </th>
                ))}
                <th className="p-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="hover:bg-zinc-800/30">
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className="p-1.5">
                      <input
                        type="text"
                        value={cell}
                        onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                        className="w-full bg-zinc-950/80 border border-zinc-800 rounded px-2 py-1 text-zinc-200 focus:outline-none focus:border-brand-emerald"
                      />
                    </td>
                  ))}
                  <td className="p-1.5 text-center">
                    {rows.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRow(rowIdx)}
                        className="p-1 rounded hover:bg-rose-950/40 text-zinc-600 hover:text-rose-400"
                        title="Delete Row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Generated Markdown Output */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold flex items-center space-x-1.5">
            <FileText className="w-4 h-4" />
            <span>Generated Markdown Table Code:</span>
          </span>
          <CopyButton text={markdownTable} />
        </div>

        <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto leading-relaxed">
          {markdownTable}
        </pre>
      </div>
    </div>
  );
}

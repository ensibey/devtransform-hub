'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { FileText, Scissors, Download, Zap } from 'lucide-react';

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [pageRanges, setPageRanges] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = pdf.getPageCount();
      setFile(selected);
      setPageCount(total);
      setPageRanges(`1-${Math.min(total, 3)}`);
    } catch (err) {
      alert('Could not load PDF document.');
    }
  };

  const parseRanges = (input: string, maxPages: number): number[] => {
    const indices = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((x) => parseInt(x.trim(), 10));
        if (!isNaN(startStr) && !isNaN(endStr)) {
          const start = Math.max(1, startStr);
          const end = Math.min(maxPages, endStr);
          for (let p = start; p <= end; p++) {
            indices.add(p - 1);
          }
        }
      } else {
        const pageNum = parseInt(part, 10);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= maxPages) {
          indices.add(pageNum - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplitPdf = async () => {
    if (!file || pageCount === 0) return;
    setIsSplitting(true);

    try {
      const selectedIndices = parseRanges(pageRanges, pageCount);
      if (selectedIndices.length === 0) {
        alert('Please enter valid page numbers within range.');
        setIsSplitting(false);
        return;
      }

      const originalBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(originalBuffer, { ignoreEncryption: true });
      const newPdf = await PDFDocument.create();

      const copiedPages = await newPdf.copyPages(originalPdf, selectedIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const newBytes = await newPdf.save();
      const blob = new Blob([newBytes as unknown as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, `split_${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to split PDF.');
    } finally {
      setIsSplitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept=".pdf,application/pdf"
          onFilesSelected={handleFilesSelected}
          title="Upload PDF to extract pages"
          subtitle="Split or extract custom page ranges (e.g. 1-3, 5, 8) • 100% Client-Side"
        />
      ) : (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-surface-200 border border-border flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-zinc-100 text-sm">{file.name}</div>
                <div className="text-xs text-zinc-400 font-mono">
                  {formatBytes(file.size)} • {pageCount} Total Pages
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1.5 bg-surface-300 rounded-lg border border-border"
            >
              Change PDF
            </button>
          </div>

          <div className="p-6 rounded-xl bg-surface-200 border border-border space-y-4">
            <div>
              <label className="block text-zinc-300 font-medium text-xs mb-1">
                ENTER PAGE RANGES TO EXTRACT
              </label>
              <input
                type="text"
                value={pageRanges}
                onChange={(e) => setPageRanges(e.target.value)}
                placeholder="e.g. 1-3, 5, 7-10"
                className="w-full bg-surface-300 border border-border rounded-xl p-3 text-zinc-100 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
              <p className="text-xs text-zinc-500 mt-1">
                Enter single pages separated by comma or page ranges (e.g. <code className="text-emerald-400">1-5, 8, 11-14</code>). Available pages: 1 to {pageCount}.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSplitPdf}
                disabled={isSplitting}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-emerald text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all text-sm shadow-md"
              >
                {isSplitting ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Extracting pages...</span>
                  </>
                ) : (
                  <>
                    <Scissors className="w-4 h-4" />
                    <span>Extract Pages & Download PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

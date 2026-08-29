'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import {
  FileText,
  ArrowUp,
  ArrowDown,
  Trash2,
  Download,
  Plus,
  Zap,
  CheckCircle2,
} from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount?: number;
}

export function PdfMerge() {
  const [pdfList, setPdfList] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    const pdfFiles = files.filter(
      (f) => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf')
    );

    const items: PdfFileItem[] = [];
    for (const file of pdfFiles) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        items.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
          pageCount: pdf.getPageCount(),
        });
      } catch (err) {
        items.push({
          id: `${file.name}-${Date.now()}-${Math.random()}`,
          file,
        });
      }
    }

    setPdfList((prev) => [...prev, ...items]);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setPdfList((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const moveDown = (index: number) => {
    if (index === pdfList.length - 1) return;
    setPdfList((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const removeFile = (id: string) => {
    setPdfList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMergePdfs = async () => {
    if (pdfList.length < 2) return;
    setIsMerging(true);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const item of pdfList) {
        const arrayBuffer = await item.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes as unknown as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, `merged_${Date.now()}.pdf`);
    } catch (err) {
      console.error('Failed to merge PDFs:', err);
      alert('Failed to merge PDFs. Please check if any file is password protected.');
    } finally {
      setIsMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* File Dropzone */}
      <FileDropzone
        accept=".pdf,application/pdf"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        title="Upload 2 or more PDF documents"
        subtitle="Combine into a single PDF • 100% Client-Side Processing"
      />

      {/* PDF List Order */}
      {pdfList.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase text-zinc-400">
              PDF Documents Order ({pdfList.length} Files)
            </h3>
            <button
              type="button"
              onClick={() => setPdfList([])}
              className="text-xs text-rose-400 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {pdfList.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3.5 bg-surface-200 border border-border rounded-xl shadow-sm text-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="font-semibold text-zinc-100 truncate">
                      {item.file.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {formatBytes(item.file.size)} • {item.pageCount ? `${item.pageCount} pages` : 'PDF'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="p-1 rounded bg-surface-300 hover:bg-surface-50 text-zinc-300 disabled:opacity-30 border border-border"
                    title="Move Up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(index)}
                    disabled={index === pdfList.length - 1}
                    className="p-1 rounded bg-surface-300 hover:bg-surface-50 text-zinc-300 disabled:opacity-30 border border-border"
                    title="Move Down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(item.id)}
                    className="p-1 rounded hover:bg-surface-300 text-zinc-400 hover:text-rose-400 transition-colors ml-1"
                    title="Remove file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Merge Trigger Button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={handleMergePdfs}
              disabled={pdfList.length < 2 || isMerging}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-emerald text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-lg text-sm"
            >
              {isMerging ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Merging PDFs in browser...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Merge and Download ({pdfList.length} Files)</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

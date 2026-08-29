'use client';

import React, { useState } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { FileText, RotateCw, Download, Zap } from 'lucide-react';

export function PdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotationAngle, setRotationAngle] = useState<90 | 180 | 270>(90);
  const [isRotating, setIsRotating] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    try {
      const buffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
      setFile(selected);
      setPageCount(pdf.getPageCount());
    } catch {
      alert('Could not load PDF document.');
    }
  };

  const handleRotate = async () => {
    if (!file) return;
    setIsRotating(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = pdfDoc.getPages();

      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle;
        page.setRotation(degrees((currentRotation + rotationAngle) % 360));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, `rotated_${file.name}`);
    } catch (err) {
      console.error(err);
      alert('Failed to rotate PDF.');
    } finally {
      setIsRotating(false);
    }
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept=".pdf,application/pdf"
          onFilesSelected={handleFilesSelected}
          title="Upload PDF to rotate pages"
          subtitle="Rotate all pages by 90°, 180°, or 270° • 100% Client-Side"
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
              <label className="block text-zinc-300 font-medium text-xs mb-2">
                SELECT ROTATION ANGLE (CLOCKWISE)
              </label>
              <div className="grid grid-cols-3 gap-3 text-xs">
                {[
                  { angle: 90, label: '90° Clockwise' },
                  { angle: 180, label: '180° Half Turn' },
                  { angle: 270, label: '270° (90° Counter-Clockwise)' },
                ].map((item) => (
                  <button
                    key={item.angle}
                    type="button"
                    onClick={() => setRotationAngle(item.angle as any)}
                    className={`p-3 rounded-xl border font-semibold flex flex-col items-center justify-center space-y-1 transition-all ${
                      rotationAngle === item.angle
                        ? 'bg-brand-emerald/10 border-brand-emerald text-brand-emerald'
                        : 'bg-surface-300 border-border text-zinc-300 hover:text-white'
                    }`}
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleRotate}
                disabled={isRotating}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-brand-emerald text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all text-sm shadow-md"
              >
                {isRotating ? (
                  <>
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Rotating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Rotate & Download PDF</span>
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

'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Image as ImageIcon, Download, Trash2, Zap } from 'lucide-react';

export function ImageToPdf() {
  const [images, setImages] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<'a4' | 'fit'>('a4');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    const valid = files.filter(
      (f) => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(f.name)
    );
    setImages((prev) => [...prev, ...valid]);
  };

  const handleConvertToPdf = async () => {
    if (images.length === 0) return;
    setIsGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgFile of images) {
        const arrayBuffer = await imgFile.arrayBuffer();
        let pdfImage;

        if (imgFile.type === 'image/png' || imgFile.name.toLowerCase().endsWith('.png')) {
          pdfImage = await pdfDoc.embedPng(arrayBuffer);
        } else {
          pdfImage = await pdfDoc.embedJpg(arrayBuffer);
        }

        const { width, height } = pdfImage;

        if (pageSize === 'a4') {
          // A4 dimensions: 595.28 x 841.89 points
          const page = pdfDoc.addPage([595.28, 841.89]);
          const scale = Math.min(550 / width, 790 / height, 1);
          const scaledWidth = width * scale;
          const scaledHeight = height * scale;

          page.drawImage(pdfImage, {
            x: (595.28 - scaledWidth) / 2,
            y: (841.89 - scaledHeight) / 2,
            width: scaledWidth,
            height: scaledHeight,
          });
        } else {
          // Fit page to image dimensions exactly
          const page = pdfDoc.addPage([width, height]);
          page.drawImage(pdfImage, {
            x: 0,
            y: 0,
            width,
            height,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
      downloadBlob(blob, `images_to_pdf_${Date.now()}.pdf`);
    } catch (err) {
      console.error(err);
      alert('Conversion failed. Note: Ensure images are standard PNG or JPG formats.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        accept="image/png,image/jpeg,image/jpg"
        multiple={true}
        onFilesSelected={handleFilesSelected}
        title="Upload PNG or JPG images to convert to PDF"
        subtitle="Combine multiple images into pages of a single PDF • 100% Client-Side"
      />

      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-surface-200 border border-border rounded-xl text-xs">
            <div className="flex items-center space-x-3">
              <span className="text-zinc-400 font-mono">Page Format:</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as any)}
                className="bg-surface-300 border border-border rounded px-2.5 py-1 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald"
              >
                <option value="a4">Standard A4 Printable Pages</option>
                <option value="fit">Fit to Image Size</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setImages([])}
                className="text-xs text-rose-400 hover:underline"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={handleConvertToPdf}
                disabled={isGenerating}
                className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-brand-emerald text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all text-xs shadow-md"
              >
                {isGenerating ? (
                  <>
                    <Zap className="w-3.5 h-3.5 animate-spin" />
                    <span>Building PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>Create PDF ({images.length} Pages)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="p-3 bg-surface-200 border border-border rounded-xl flex items-center justify-between text-xs"
              >
                <div className="truncate pr-2">
                  <div className="font-medium text-zinc-200 truncate">{img.name}</div>
                  <div className="text-[10px] font-mono text-zinc-500">
                    Page {idx + 1} • {formatBytes(img.size)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="text-zinc-500 hover:text-rose-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

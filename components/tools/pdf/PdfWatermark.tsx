'use client';

import React, { useState } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import {
  FileText,
  Download,
  Stamp,
  Trash2,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Hash
} from 'lucide-react';

export function PdfWatermark() {
  const [file, setFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('Watermarked_Document');
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Watermark Options
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [enableWatermark, setEnableWatermark] = useState(true);
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.25);
  const [watermarkColor, setWatermarkColor] = useState<'gray' | 'red' | 'blue'>('gray');
  const [watermarkAngle, setWatermarkAngle] = useState(45);

  // Page Number Options
  const [enablePageNumbers, setEnablePageNumbers] = useState(true);
  const [pageNumberFormat, setPageNumberFormat] = useState<'page_of_total' | 'simple' | 'hyphens'>('page_of_total');
  const [pageNumberPosition, setPageNumberPosition] = useState<'bottom_center' | 'bottom_right' | 'top_right'>('bottom_center');

  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setIsProcessing(true);
    setFile(selected);
    setDocTitle(selected.name.replace(/\.[^/.]+$/, '') + '_watermarked');

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch (err) {
      console.error('Error loading PDF:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyWatermark = async () => {
    if (!file) return;
    setIsGenerating(true);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const helvetica = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const totalPages = pdfDoc.getPageCount();

      // Resolve Watermark RGB
      let colorRgb = rgb(0.5, 0.5, 0.5);
      if (watermarkColor === 'red') colorRgb = rgb(0.85, 0.15, 0.15);
      if (watermarkColor === 'blue') colorRgb = rgb(0.15, 0.35, 0.85);

      for (let i = 0; i < totalPages; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();

        // 1. Draw Diagonal Watermark
        if (enableWatermark && watermarkText.trim()) {
          const fontSize = Math.min(width, height) * 0.12;
          const textWidth = helvetica.widthOfTextAtSize(watermarkText.trim(), fontSize);

          page.drawText(watermarkText.trim(), {
            x: (width - textWidth) / 2,
            y: height / 2,
            size: fontSize,
            font: helvetica,
            color: colorRgb,
            opacity: watermarkOpacity,
            rotate: degrees(watermarkAngle),
          });
        }

        // 2. Draw Page Numbers
        if (enablePageNumbers) {
          const pageNum = i + 1;
          let label = `Page ${pageNum} of ${totalPages}`;
          if (pageNumberFormat === 'simple') label = `${pageNum} / ${totalPages}`;
          if (pageNumberFormat === 'hyphens') label = `- ${pageNum} -`;

          const numFontSize = 10;
          const numWidth = helvetica.widthOfTextAtSize(label, numFontSize);

          let x = (width - numWidth) / 2;
          let y = 24;

          if (pageNumberPosition === 'bottom_right') {
            x = width - numWidth - 36;
          } else if (pageNumberPosition === 'top_right') {
            x = width - numWidth - 36;
            y = height - 30;
          }

          page.drawText(label, {
            x,
            y,
            size: numFontSize,
            font: helvetica,
            color: rgb(0.3, 0.3, 0.3),
            opacity: 0.8,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      downloadBlob(blob, `${docTitle}.pdf`);
    } catch (err) {
      console.error('Error applying watermark:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPageCount(0);
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      {!file && (
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Stamp className="w-5 h-5 text-purple-500" />
              <h2 className="text-base font-bold text-foreground">Upload PDF to Add Watermark &amp; Page Numbers</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-500 font-mono border border-purple-500/20">
              PDF Watermarker
            </span>
          </div>

          <FileDropzone
            accept=".pdf"
            maxSizeMB={40}
            onFilesSelected={handleFileSelected}
            title="Drag & drop your PDF file here"
            subtitle="Add custom diagonal text watermarks and clean page numbering locally"
          />

          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Client-Side Safe
            </span>
            <span>Your confidential documents never touch any external server</span>
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      {file && (
        <div className="space-y-6">
          {/* Top Bar */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-500 flex-shrink-0">
                <Stamp className="w-5 h-5" />
              </div>
              <div>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="text-sm font-bold text-foreground bg-transparent border-b border-dashed border-border focus:border-purple-500 focus:outline-none"
                  placeholder="Output Filename"
                />
                <p className="text-xs text-muted-foreground">
                  {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} • {formatBytes(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleApplyWatermark}
                disabled={isGenerating}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                {isGenerating ? 'Processing PDF...' : 'Apply & Download PDF'}
              </button>

              <button
                onClick={handleReset}
                className="p-2 rounded-xl text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Watermark Settings */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={enableWatermark}
                    onChange={(e) => setEnableWatermark(e.target.checked)}
                    className="rounded border-border text-purple-600 focus:ring-purple-500/20 bg-background w-4 h-4"
                  />
                  <span>Text Watermark</span>
                </label>
                <span className="text-[11px] text-muted-foreground font-mono">Diagonal Stamp</span>
              </div>

              {enableWatermark && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Watermark Text:
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="e.g. CONFIDENTIAL, DRAFT, COPY"
                      className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Color:
                      </label>
                      <select
                        value={watermarkColor}
                        onChange={(e) => setWatermarkColor(e.target.value as any)}
                        className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value="gray">Neutral Gray</option>
                        <option value="red">Warning Red</option>
                        <option value="blue">Corporate Blue</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-muted-foreground block mb-1">
                        Opacity:
                      </label>
                      <select
                        value={watermarkOpacity}
                        onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                        className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                      >
                        <option value={0.15}>15% (Subtle)</option>
                        <option value={0.25}>25% (Standard)</option>
                        <option value={0.45}>45% (Strong)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Page Number Settings */}
            <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-border">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={enablePageNumbers}
                    onChange={(e) => setEnablePageNumbers(e.target.checked)}
                    className="rounded border-border text-purple-600 focus:ring-purple-500/20 bg-background w-4 h-4"
                  />
                  <span>Page Numbers</span>
                </label>
                <span className="text-[11px] text-muted-foreground font-mono">Pagination</span>
              </div>

              {enablePageNumbers && (
                <div className="space-y-3.5">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Numbering Format:
                    </label>
                    <select
                      value={pageNumberFormat}
                      onChange={(e) => setPageNumberFormat(e.target.value as any)}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="page_of_total">Page 1 of {pageCount || 5}</option>
                      <option value="simple">1 / {pageCount || 5}</option>
                      <option value="hyphens">- 1 -</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted-foreground block mb-1">
                      Placement:
                    </label>
                    <select
                      value={pageNumberPosition}
                      onChange={(e) => setPageNumberPosition(e.target.value as any)}
                      className="w-full bg-background border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500"
                    >
                      <option value="bottom_center">Bottom Center</option>
                      <option value="bottom_right">Bottom Right</option>
                      <option value="top_right">Top Right</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feature Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% In-Browser Engine
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            All text stamping and vector drawing operations execute in client memory with pdf-lib. Zero data transmission.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Vector Sharpness
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Watermarks and numbers are rendered as true PostScript vector glyphs, never blurred or pixelated raster images.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            Unlimited Documents
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Process as many PDF contracts, legal briefs, and reports as you need with zero limits.
          </p>
        </div>
      </div>
    </div>
  );
}

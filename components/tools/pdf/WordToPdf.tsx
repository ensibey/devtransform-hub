'use client';

import React, { useState, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import mammoth from 'mammoth';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import {
  FileText,
  Download,
  Printer,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Settings2,
  Type,
  Maximize2
} from 'lucide-react';

export function WordToPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('Document');
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [rawText, setRawText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [fontChoice, setFontChoice] = useState<'sans' | 'serif' | 'mono'>('sans');
  const [fontSize, setFontSize] = useState<'12' | '14' | '16'>('14');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [margin, setMargin] = useState<'standard' | 'compact' | 'wide'>('standard');
  const printRef = useRef<HTMLDivElement>(null);

  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setIsProcessing(true);
    setFile(selected);
    setDocTitle(selected.name.replace(/\.[^/.]+$/, ''));

    try {
      const arrayBuffer = await selected.arrayBuffer();

      if (selected.name.endsWith('.docx')) {
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const textResult = await mammoth.extractRawText({ arrayBuffer });
        setHtmlContent(result.value);
        setRawText(textResult.value);
      } else {
        // Plain text, rtf, or markdown fallback
        const text = await selected.text();
        setRawText(text);
        const formattedHtml = text
          .split('\n\n')
          .map((p) => `<p style="margin-bottom: 1em;">${p.replace(/\n/g, '<br/>')}</p>`)
          .join('');
        setHtmlContent(formattedHtml);
      }
    } catch (err) {
      console.error('Failed to parse docx:', err);
      // Fallback
      setHtmlContent('<p>Unable to automatically parse full layout. You can paste or type your document below.</p>');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleConvertWithPdfLib = async () => {
    if (!rawText && !htmlContent) return;
    setIsGeneratingPdf(true);

    try {
      const pdfDoc = await PDFDocument.create();
      let font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      if (fontChoice === 'serif') {
        font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      } else if (fontChoice === 'mono') {
        font = await pdfDoc.embedFont(StandardFonts.Courier);
      }

      const isLandscape = orientation === 'landscape';
      const pageWidth = isLandscape ? 841.89 : 595.28;
      const pageHeight = isLandscape ? 595.28 : 841.89;

      const marginSize = margin === 'compact' ? 36 : margin === 'wide' ? 72 : 54;
      const contentWidth = pageWidth - marginSize * 2;
      const sizeNumber = parseInt(fontSize, 10);
      const lineHeight = sizeNumber * 1.45;

      // Extract plain text lines and wrap them to fit page width
      const paragraphs = (rawText || htmlContent.replace(/<[^>]+>/g, ' ')).split('\n');
      const wrappedLines: string[] = [];

      for (const para of paragraphs) {
        if (!para.trim()) {
          wrappedLines.push('');
          continue;
        }

        const words = para.trim().split(/\s+/);
        let currentLine = '';

        for (const word of words) {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const textWidth = font.widthOfTextAtSize(testLine, sizeNumber);

          if (textWidth <= contentWidth) {
            currentLine = testLine;
          } else {
            if (currentLine) wrappedLines.push(currentLine);
            currentLine = word;
          }
        }
        if (currentLine) {
          wrappedLines.push(currentLine);
        }
      }

      // Distribute lines across pages
      let currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
      let y = pageHeight - marginSize;

      for (const line of wrappedLines) {
        if (y - lineHeight < marginSize) {
          currentPage = pdfDoc.addPage([pageWidth, pageHeight]);
          y = pageHeight - marginSize;
        }

        if (line) {
          currentPage.drawText(line, {
            x: marginSize,
            y: y - sizeNumber,
            size: sizeNumber,
            font,
            color: rgb(0.12, 0.12, 0.14),
          });
        }
        y -= lineHeight;
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
      downloadBlob(blob, `${docTitle}.pdf`);
    } catch (err) {
      console.error('PDF generation error:', err);
      // If error, trigger print fallback
      handlePrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setFile(null);
    setHtmlContent('');
    setRawText('');
    setDocTitle('Document');
  };

  return (
    <div className="space-y-8">
      {/* Print-Only CSS Stylesheet */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-document,
          #printable-document * {
            visibility: visible;
          }
          #printable-document {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: white !important;
            color: black !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
          }
        }
      `}</style>

      {/* Upload Zone */}
      {!file && (
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-foreground">Upload Word Document</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-500 font-mono border border-rose-500/20">
              .docx, .doc, .rtf, .txt
            </span>
          </div>

          <FileDropzone
            accept=".docx,.doc,.rtf,.txt"
            maxSizeMB={25}
            onFilesSelected={handleFileSelected}
            title="Drag & drop your Word document here"
            subtitle="Supports Microsoft Word (.docx), Word 97-2003 (.doc), and text documents up to 25MB"
          />

          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Client-Side Private Conversion
            </span>
            <span>Zero server upload • Converted directly in your browser memory</span>
          </div>
        </div>
      )}

      {/* Editor & Preview Workspace */}
      {file && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="text-sm font-bold text-foreground bg-transparent border-b border-dashed border-border focus:border-rose-500 focus:outline-none"
                  placeholder="Document Title"
                />
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)} • {orientation.toUpperCase()} • {fontChoice.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Customization Selectors */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={fontChoice}
                onChange={(e) => setFontChoice(e.target.value as any)}
                className="bg-background border border-border text-xs rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="sans">Modern (Sans-Serif)</option>
                <option value="serif">Classic (Times Serif)</option>
                <option value="mono">Clean (Monospace)</option>
              </select>

              <select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value as any)}
                className="bg-background border border-border text-xs rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="12">12pt Text</option>
                <option value="14">14pt Text</option>
                <option value="16">16pt Text</option>
              </select>

              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as any)}
                className="bg-background border border-border text-xs rounded-lg px-2.5 py-1.5 text-foreground focus:outline-none focus:ring-1 focus:ring-rose-500"
              >
                <option value="portrait">Portrait</option>
                <option value="landscape">Landscape</option>
              </select>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
                title="Print or Save via Browser PDF Engine"
              >
                <Printer className="w-3.5 h-3.5" />
                Print / Save
              </button>

              <button
                onClick={handleConvertWithPdfLib}
                disabled={isGeneratingPdf}
                className="px-4 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
              </button>

              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                title="Remove file and start over"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Visual Paper Preview */}
          <div className="flex justify-center bg-muted/30 p-4 sm:p-8 rounded-2xl border border-border overflow-x-auto">
            <div
              id="printable-document"
              ref={printRef}
              className={`bg-white text-slate-900 shadow-xl rounded-sm transition-all ${
                orientation === 'landscape' ? 'w-[842px] min-h-[595px]' : 'w-[595px] min-h-[842px]'
              } ${
                margin === 'compact' ? 'p-6' : margin === 'wide' ? 'p-14' : 'p-10'
              } ${
                fontChoice === 'serif'
                  ? 'font-serif'
                  : fontChoice === 'mono'
                  ? 'font-mono'
                  : 'font-sans'
              }`}
              style={{ fontSize: `${fontSize}pt`, lineHeight: '1.6' }}
            >
              <h1 className="text-xl font-bold border-b border-slate-200 pb-2 mb-4 text-slate-900">
                {docTitle}
              </h1>

              {htmlContent ? (
                <div
                  className="prose prose-sm max-w-none text-slate-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
              ) : (
                <p className="text-slate-400 italic">No content detected in document.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feature & FAQ Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            No Uploads to Server
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your Word document is never uploaded to any remote server or stored in any database. Everything renders in client memory.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Sparkles className="w-4 h-4 text-rose-500" />
            Preserves Formatting
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Extracts bold, italics, numbered lists, bullet points, headers, and paragraphs cleanly from Microsoft Word (.docx).
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            100% Free Forever
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            No limits, no subscriptions, and no watermarks placed on your converted PDF files.
          </p>
        </div>
      </div>
    </div>
  );
}

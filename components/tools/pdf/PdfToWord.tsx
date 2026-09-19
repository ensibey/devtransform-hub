'use client';

import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import {
  FileText,
  Download,
  Copy,
  Check,
  Trash2,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  BookOpen
} from 'lucide-react';

export function PdfToWord() {
  const [file, setFile] = useState<File | null>(null);
  const [docTitle, setDocTitle] = useState('Converted_Document');
  const [pageCount, setPageCount] = useState<number>(0);
  const [extractedText, setExtractedText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFileSelected = async (files: File[]) => {
    const selected = files[0];
    if (!selected) return;

    setIsProcessing(true);
    setFile(selected);
    setDocTitle(selected.name.replace(/\.[^/.]+$/, ''));

    try {
      const arrayBuffer = await selected.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
      const pages = pdf.getPageCount();
      setPageCount(pages);

      // Extract raw streams or fallback representation
      const uint8 = new Uint8Array(arrayBuffer);
      let textContent = '';

      // Decode ASCII and UTF-8 stream tokens from PDF binary
      const decoder = new TextDecoder('latin1');
      const fullString = decoder.decode(uint8);

      // Search for text showing operators (Tj, TJ, ')
      const textMatches: string[] = [];
      const tjRegex = /\(([^)]+)\)\s*Tj/g;
      let match;
      while ((match = tjRegex.exec(fullString)) !== null) {
        if (match[1] && match[1].trim()) {
          textMatches.push(match[1]);
        }
      }

      if (textMatches.length > 0) {
        textContent = textMatches.join(' ');
      } else {
        // Search for bracketed arrays of strings: [(...) ... (...)] TJ
        const arrayMatches: string[] = [];
        const arrayRegex = /\[([^\]]+)\]\s*TJ/g;
        while ((match = arrayRegex.exec(fullString)) !== null) {
          const inner = match[1];
          const subStrings = inner.match(/\(([^)]+)\)/g);
          if (subStrings) {
            arrayMatches.push(subStrings.map((s) => s.slice(1, -1)).join(''));
          }
        }
        textContent = arrayMatches.join('\n\n');
      }

      if (!textContent.trim()) {
        textContent = `[PDF Document: ${selected.name}]\nTotal Pages: ${pages}\n\nNote: The text in this PDF appears to be rasterized or compressed with FlateDecode. You can edit or add your text below before exporting to Microsoft Word.`;
      }

      setExtractedText(textContent);
    } catch (err) {
      console.error('Error loading PDF:', err);
      setExtractedText('Failed to read PDF document. Please verify the file is not password-protected.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadWord = () => {
    if (!extractedText) return;

    // Microsoft Word XML / HTML formatted document
    const paragraphs = extractedText
      .split('\n')
      .map((p) => `<p style="font-family: Calibri, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin-bottom: 8pt;">${p || '&nbsp;'}</p>`)
      .join('');

    const wordHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${docTitle}</title>
        <!--[if gte mso 9]>
        <xml>
          <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
          </w:WordDocument>
        </xml>
        <![endif]-->
        <style>
          @page {
            size: 21.0cm 29.7cm; /* A4 */
            margin: 2.54cm 2.54cm 2.54cm 2.54cm;
            mso-page-orientation: portrait;
          }
          body {
            font-family: 'Calibri', 'Helvetica Neue', Arial, sans-serif;
            font-size: 11pt;
            color: #1a1a1a;
          }
          h1 {
            font-size: 18pt;
            font-weight: bold;
            color: #0d47a1;
            margin-bottom: 12pt;
          }
        </style>
      </head>
      <body>
        <h1>${docTitle}</h1>
        ${paragraphs}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff' + wordHtml], {
      type: 'application/msword;charset=utf-8'
    });

    downloadBlob(blob, `${docTitle}.doc`);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    downloadBlob(blob, `${docTitle}.txt`);
  };

  const handleReset = () => {
    setFile(null);
    setExtractedText('');
    setPageCount(0);
  };

  const wordCount = extractedText.trim() ? extractedText.trim().split(/\s+/).length : 0;
  const charCount = extractedText.length;

  return (
    <div className="space-y-8">
      {/* Upload Zone */}
      {!file && (
        <div className="bg-card border border-border/80 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-bold text-foreground">Upload PDF Document</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500 font-mono border border-blue-500/20">
              .pdf to .doc / .docx
            </span>
          </div>

          <FileDropzone
            accept=".pdf"
            maxSizeMB={30}
            onFilesSelected={handleFileSelected}
            title="Drag & drop your PDF file here"
            subtitle="Supports all PDF files up to 30MB • Extracted directly in your browser"
          />

          <div className="p-4 rounded-xl bg-muted/40 border border-border/70 flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              100% Client-Side Privacy
            </span>
            <span>No data or files ever transmitted to external servers</span>
          </div>
        </div>
      )}

      {/* Editor & Preview Workspace */}
      {file && (
        <div className="space-y-6">
          {/* Action Toolbar */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <input
                  type="text"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="text-sm font-bold text-foreground bg-transparent border-b border-dashed border-border focus:border-blue-500 focus:outline-none"
                  placeholder="Document Title"
                />
                <p className="text-xs text-muted-foreground">
                  {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} • {wordCount} Words • {charCount} Chars • {formatBytes(file.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Text'}
              </button>

              <button
                onClick={handleDownloadTxt}
                className="px-3 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <FileCode className="w-3.5 h-3.5" />
                .TXT
              </button>

              <button
                onClick={handleDownloadWord}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Download className="w-3.5 h-3.5" />
                Export Word (.doc)
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

          {/* Editable Document Text Area */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Extracted Document Content (Editable)
              </span>
              <span>You can edit or format the text before exporting to Word</span>
            </div>

            <textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              rows={16}
              className="w-full bg-background border border-border rounded-xl p-4 text-sm font-sans text-foreground leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              placeholder="Extracted text will appear here..."
            />
          </div>
        </div>
      )}

      {/* Feature & Trust Badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Client Privacy
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Unlike other online PDF converters, your confidential documents are never uploaded or saved to any cloud servers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <Sparkles className="w-4 h-4 text-blue-400" />
            Native Word Compatibility
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The exported file opens directly in Microsoft Office Word, Google Docs, Apple Pages, and LibreOffice with standard margins.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-card border border-border space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            Zero Limits & No Signup
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Convert unlimited pages without email registration, credit cards, or waiting queues.
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/utils';
import { Download, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [targetFormat, setTargetFormat] = useState<'image/webp' | 'image/png' | 'image/jpeg'>('image/webp');
  const [quality, setQuality] = useState(0.9);
  const [convertedBlob, setConvertedBlob] = useState<Blob | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const handleFilesSelected = (files: File[]) => {
    const selected = files[0];
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    convertImage(selected, targetFormat, quality);
  };

  const convertImage = (
    sourceFile: File,
    format: 'image/webp' | 'image/png' | 'image/jpeg',
    q: number
  ) => {
    setIsConverting(true);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (format === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setConvertedBlob(blob);
          }
          setIsConverting(false);
        },
        format,
        q
      );
    };
    img.src = URL.createObjectURL(sourceFile);
  };

  const handleDownload = () => {
    if (!convertedBlob || !file) return;
    const ext = targetFormat === 'image/webp' ? 'webp' : targetFormat === 'image/png' ? 'png' : 'jpg';
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    downloadBlob(convertedBlob, `${nameWithoutExt}.${ext}`);
  };

  return (
    <div className="space-y-6">
      {!file ? (
        <FileDropzone
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          title="Drop image to convert format"
          subtitle="Supports PNG, JPG, WebP, GIF, SVG, BMP • 100% Client-Side"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls */}
          <div className="p-4 rounded-xl bg-surface-200 border border-border flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">Target Format</label>
                <select
                  value={targetFormat}
                  onChange={(e) => {
                    const fmt = e.target.value as any;
                    setTargetFormat(fmt);
                    convertImage(file, fmt, quality);
                  }}
                  className="bg-surface-300 border border-border rounded px-2.5 py-1 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald"
                >
                  <option value="image/webp">WebP (Modern, Smallest)</option>
                  <option value="image/png">PNG (Lossless, Transparent)</option>
                  <option value="image/jpeg">JPEG (Universal)</option>
                </select>
              </div>

              {targetFormat !== 'image/png' && (
                <div>
                  <label className="block text-zinc-400 font-mono mb-1">
                    Quality: {Math.round(quality * 100)}%
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.05}
                    value={quality}
                    onChange={(e) => {
                      const q = parseFloat(e.target.value);
                      setQuality(q);
                      convertImage(file, targetFormat, q);
                    }}
                    className="accent-brand-emerald cursor-pointer w-28 sm:w-36"
                  />
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setFile(null)}
                className="px-3 py-1.5 rounded-lg bg-surface-300 hover:bg-surface-50 text-zinc-300 border border-border transition-colors"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!convertedBlob || isConverting}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-brand-emerald text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download {targetFormat.split('/')[1].toUpperCase()}</span>
              </button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="rounded-xl border border-border bg-oled overflow-hidden p-6 flex flex-col items-center justify-center min-h-[320px]">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[300px] max-w-full object-contain rounded-lg shadow-lg"
            />
            {convertedBlob && (
              <div className="mt-4 text-xs font-mono text-zinc-400 flex items-center space-x-3">
                <span>
                  Original: <strong className="text-zinc-200">{formatBytes(file.size)}</strong>
                </span>
                <span>→</span>
                <span>
                  Target: <strong className="text-brand-emerald">{formatBytes(convertedBlob.size)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

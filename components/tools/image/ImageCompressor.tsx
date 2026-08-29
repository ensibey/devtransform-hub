'use client';

import React, { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { formatBytes, downloadBlob } from '@/lib/utils';
import { Download, Sliders, Zap, CheckCircle2, ArrowRight } from 'lucide-react';

export function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedPreview, setCompressedPreview] = useState<string>('');

  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    compress(file, maxSizeMB, maxWidthOrHeight);
  };

  const compress = async (file: File, targetMB: number, maxDim: number) => {
    setIsCompressing(true);
    try {
      const options = {
        maxSizeMB: targetMB,
        maxWidthOrHeight: maxDim,
        useWebWorker: true,
      };

      const compressed = await imageCompression(file, options);
      setCompressedBlob(compressed);
      setCompressedPreview(URL.createObjectURL(compressed));
    } catch (err) {
      console.error('Compression failed:', err);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBlob || !originalFile) return;
    downloadBlob(compressedBlob, `compressed_${originalFile.name}`);
  };

  const calculateSavings = () => {
    if (!originalFile || !compressedBlob) return 0;
    const diff = originalFile.size - compressedBlob.size;
    if (diff <= 0) return 0;
    return Math.round((diff / originalFile.size) * 100);
  };

  return (
    <div className="space-y-6">
      {!originalFile ? (
        <FileDropzone
          accept="image/png,image/jpeg,image/webp,image/bmp"
          onFilesSelected={handleFilesSelected}
          title="Drop image to compress"
          subtitle="Supports PNG, JPG, WebP • 100% Client-Side Compression"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-4 rounded-xl bg-surface-200 border border-border flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">
                  Target Max Size: {maxSizeMB} MB
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={5}
                  step={0.1}
                  value={maxSizeMB}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setMaxSizeMB(val);
                    compress(originalFile, val, maxWidthOrHeight);
                  }}
                  className="accent-brand-emerald cursor-pointer w-32 sm:w-40"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-mono mb-1">
                  Max Resolution: {maxWidthOrHeight}px
                </label>
                <select
                  value={maxWidthOrHeight}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMaxWidthOrHeight(val);
                    compress(originalFile, maxSizeMB, val);
                  }}
                  className="bg-surface-300 border border-border rounded px-2.5 py-1 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald"
                >
                  <option value={3840}>4K (3840px)</option>
                  <option value={1920}>Full HD (1920px)</option>
                  <option value={1280}>HD (1280px)</option>
                  <option value={800}>Web Small (800px)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setOriginalFile(null)}
                className="px-3 py-1.5 rounded-lg bg-surface-300 hover:bg-surface-50 text-zinc-300 border border-border transition-colors"
              >
                Change Image
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!compressedBlob || isCompressing}
                className="flex items-center space-x-1.5 px-4 py-1.5 rounded-lg bg-brand-emerald text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Compressed</span>
              </button>
            </div>
          </div>

          {/* Side-by-Side Image Previews & Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Preview */}
            <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
              <div className="p-3 bg-surface-300 border-b border-border text-xs flex justify-between items-center">
                <span className="font-semibold text-zinc-200">Original Image</span>
                <span className="font-mono text-zinc-400">
                  {formatBytes(originalFile.size)}
                </span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[300px] bg-oled">
                <img
                  src={originalPreview}
                  alt="Original"
                  className="max-h-[280px] max-w-full object-contain rounded-lg shadow"
                />
              </div>
            </div>

            {/* Compressed Preview */}
            <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
              <div className="p-3 bg-surface-300 border-b border-border text-xs flex justify-between items-center">
                <span className="font-semibold text-brand-emerald">
                  Compressed Result
                </span>
                <div className="flex items-center space-x-2 font-mono">
                  {compressedBlob && (
                    <>
                      <span className="text-zinc-200">
                        {formatBytes(compressedBlob.size)}
                      </span>
                      {calculateSavings() > 0 && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-brand-emerald border border-emerald-500/40 text-[10px]">
                          -{calculateSavings()}% Saved
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[300px] bg-oled">
                {isCompressing ? (
                  <div className="text-xs font-mono text-amber-400 flex items-center space-x-2">
                    <Zap className="w-4 h-4 animate-spin" />
                    <span>Compressing image in Web Worker...</span>
                  </div>
                ) : (
                  <img
                    src={compressedPreview}
                    alt="Compressed"
                    className="max-h-[280px] max-w-full object-contain rounded-lg shadow"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

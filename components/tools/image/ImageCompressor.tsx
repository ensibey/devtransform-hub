'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { formatBytes, downloadBlob } from '@/lib/utils';
import {
  Download,
  Sliders,
  Zap,
  CheckCircle2,
  ArrowRight,
  SplitSquareVertical,
  Columns,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Eye,
} from 'lucide-react';

type PreviewMode = 'slider' | 'side-by-side';

export function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string>('');
  const [compressedPreview, setCompressedPreview] = useState<string>('');

  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(1920);
  const [isCompressing, setIsCompressing] = useState(false);
  const [previewMode, setPreviewMode] = useState<PreviewMode>('slider');

  // Slider state (0 to 100 percentage of width)
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const compress = useCallback(async (file: File, targetMB: number, maxDim: number) => {
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
  }, []);

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0];
    if (!file) return;

    setOriginalFile(file);
    const objectUrl = URL.createObjectURL(file);
    setOriginalPreview(objectUrl);
    compress(file, maxSizeMB, maxWidthOrHeight);
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

  // Dragging slider logic
  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  }, []);

  const handleMouseDown = () => setIsDraggingSlider(true);
  const handleMouseUp = () => setIsDraggingSlider(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingSlider) return;
      handleMove(e.clientX);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDraggingSlider || !e.touches[0]) return;
      handleMove(e.touches[0].clientX);
    };

    const onEnd = () => setIsDraggingSlider(false);

    if (isDraggingSlider) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onEnd);
      window.addEventListener('touchmove', onTouchMove);
      window.addEventListener('touchend', onEnd);
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDraggingSlider, handleMove]);

  return (
    <div className="space-y-6">
      {!originalFile ? (
        <FileDropzone
          accept="image/png,image/jpeg,image/webp,image/bmp"
          onFilesSelected={handleFilesSelected}
          title="Sıkıştırılacak Görseli Buraya Bırakın"
          subtitle="PNG, JPG, WebP formatları desteklenir • %100 Tarayıcı İçi Güvenli Sıkıştırma"
        />
      ) : (
        <div className="space-y-6">
          {/* Controls & Configuration Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-surface-200 border border-slate-200 dark:border-border shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Sliders and Selects */}
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <div className="flex items-center justify-between mb-1 text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    <span>Hedef Maks. Boyut:</span>
                    <span className="font-mono text-emerald-600 dark:text-brand-emerald">{maxSizeMB} MB</span>
                  </div>
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
                    className="accent-emerald-500 cursor-pointer w-36 sm:w-44"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                    Maks. Çözünürlük:
                  </label>
                  <select
                    value={maxWidthOrHeight}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setMaxWidthOrHeight(val);
                      compress(originalFile, maxSizeMB, val);
                    }}
                    className="bg-slate-50 dark:bg-surface-300 border border-slate-200 dark:border-border rounded-xl px-3 py-1.5 text-slate-800 dark:text-zinc-200 text-xs font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value={3840}>4K Ultra HD (3840px)</option>
                    <option value={1920}>Full HD (1920px - Önerilen)</option>
                    <option value={1280}>HD Standart (1280px)</option>
                    <option value={800}>Web Banner (800px)</option>
                    <option value={500}>Küçük Küçük Resim (500px)</option>
                  </select>
                </div>
              </div>

              {/* View Switcher & Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                {/* View Mode Toggle */}
                <div className="flex items-center rounded-xl bg-slate-100 dark:bg-surface-300 p-1 border border-slate-200 dark:border-border">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('slider')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      previewMode === 'slider'
                        ? 'bg-white dark:bg-surface-100 text-emerald-600 dark:text-brand-emerald shadow-sm'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <SplitSquareVertical className="w-3.5 h-3.5" />
                    <span>Kaydırmalı Slider</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('side-by-side')}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      previewMode === 'side-by-side'
                        ? 'bg-white dark:bg-surface-100 text-emerald-600 dark:text-brand-emerald shadow-sm'
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>Yan Yana</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setOriginalFile(null)}
                  className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-surface-300 hover:bg-slate-200 dark:hover:bg-surface-50 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-border text-xs font-semibold transition-colors"
                >
                  Yeni Görsel
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!compressedBlob || isCompressing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs disabled:opacity-50 transition-all shadow-md hover:shadow-emerald-600/30"
                >
                  <Download className="w-4 h-4" />
                  <span>Sıkıştırılmışı İndir</span>
                </button>
              </div>
            </div>

            {/* Savings & Metrics Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-border/60 text-xs font-mono">
              <div className="flex items-center gap-4 text-slate-600 dark:text-zinc-300">
                <span>Orijinal: <strong className="text-slate-900 dark:text-white">{formatBytes(originalFile.size)}</strong></span>
                <span>&rarr;</span>
                <span>Sıkıştırılmış: <strong className="text-emerald-600 dark:text-brand-emerald">{compressedBlob ? formatBytes(compressedBlob.size) : 'Hesaplanıyor...'}</strong></span>
              </div>

              {compressedBlob && calculateSavings() > 0 && (
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold">
                  🎉 %{calculateSavings()} Alan Tasarrufu Sağlandı!
                </span>
              )}
            </div>
          </div>

          {/* Interactive Before / After Comparison Area */}
          {previewMode === 'slider' && originalPreview && compressedPreview ? (
            <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-surface-200 overflow-hidden shadow-sm">
              <div className="p-3 bg-slate-50 dark:bg-surface-300 border-b border-slate-200 dark:border-border text-xs font-medium text-slate-600 dark:text-zinc-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-100">
                  <Eye className="w-4 h-4 text-emerald-500" />
                  Öncesi / Sonrası Karşılaştırma Sliderı (Çubuğu Sağa/Sola Kaydırın)
                </span>
                <span className="text-[11px] text-slate-500">
                  Sol: Orijinal ({formatBytes(originalFile.size)}) | Sağ: Sıkıştırılmış ({compressedBlob ? formatBytes(compressedBlob.size) : ''})
                </span>
              </div>

              {/* Slider Viewport Container */}
              <div
                ref={containerRef}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
                className="relative w-full h-[380px] sm:h-[480px] select-none overflow-hidden cursor-ew-resize bg-slate-950 flex items-center justify-center"
              >
                {/* 1. Base Layer: Compressed Image (Right side / Full) */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <img
                    src={compressedPreview}
                    alt="Sıkıştırılmış Görsel"
                    className="max-h-full max-w-full object-contain pointer-events-none"
                  />
                  <span className="absolute top-4 right-4 px-2.5 py-1 rounded-lg bg-emerald-600/90 text-white text-xs font-bold shadow">
                    Sonrası (Sıkıştırılmış)
                  </span>
                </div>

                {/* 2. Top Layer: Original Image (Clipped to slider position) */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4" style={{ width: containerRef.current?.offsetWidth || '100%' }}>
                    <img
                      src={originalPreview}
                      alt="Orijinal Görsel"
                      className="max-h-full max-w-full object-contain pointer-events-none"
                    />
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-lg bg-slate-900/90 text-white text-xs font-bold shadow">
                      Öncesi (Orijinal)
                    </span>
                  </div>
                </div>

                {/* 3. Draggable Divider Handle */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize shadow-2xl z-20 flex items-center justify-center pointer-events-none"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-9 h-9 rounded-full bg-white text-slate-900 shadow-xl border-2 border-emerald-500 flex items-center justify-center text-xs font-bold tracking-tighter">
                    &#x21c4;
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Side by Side Preview Mode */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original Preview */}
              <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-surface-200 overflow-hidden flex flex-col shadow-sm">
                <div className="p-3 bg-slate-50 dark:bg-surface-300 border-b border-slate-200 dark:border-border text-xs flex justify-between items-center">
                  <span className="font-bold text-slate-800 dark:text-zinc-200">Orijinal Görsel</span>
                  <span className="font-mono text-slate-500 dark:text-zinc-400">
                    {formatBytes(originalFile.size)}
                  </span>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[320px] bg-slate-950">
                  <img
                    src={originalPreview}
                    alt="Orijinal"
                    className="max-h-[300px] max-w-full object-contain rounded-lg shadow"
                  />
                </div>
              </div>

              {/* Compressed Preview */}
              <div className="rounded-2xl border border-slate-200 dark:border-border bg-white dark:bg-surface-200 overflow-hidden flex flex-col shadow-sm">
                <div className="p-3 bg-slate-50 dark:bg-surface-300 border-b border-slate-200 dark:border-border text-xs flex justify-between items-center">
                  <span className="font-bold text-emerald-600 dark:text-brand-emerald">
                    Sıkıştırılmış Sonuç
                  </span>
                  <div className="flex items-center space-x-2 font-mono">
                    {compressedBlob && (
                      <>
                        <span className="text-slate-800 dark:text-zinc-200 font-semibold">
                          {formatBytes(compressedBlob.size)}
                        </span>
                        {calculateSavings() > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-brand-emerald border border-emerald-500/40 text-[10px] font-bold">
                            -%{calculateSavings()}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="p-4 flex items-center justify-center min-h-[320px] bg-slate-950">
                  {isCompressing ? (
                    <div className="text-xs font-mono text-amber-400 flex items-center space-x-2">
                      <Zap className="w-4 h-4 animate-spin" />
                      <span>Web Worker içinde sıkıştırılıyor...</span>
                    </div>
                  ) : (
                    <img
                      src={compressedPreview}
                      alt="Sıkıştırılmış"
                      className="max-h-[300px] max-w-full object-contain rounded-lg shadow"
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

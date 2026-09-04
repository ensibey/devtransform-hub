'use client';

import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileCheck,
  ShieldCheck,
  Sparkles,
  ArrowUpCircle,
  FolderOpen,
} from 'lucide-react';

export interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesSelected: (files: File[]) => void;
  title?: string;
  subtitle?: string;
  className?: string;
}

export function FileDropzone({
  accept,
  multiple = false,
  maxSizeMB = 50,
  onFilesSelected,
  title = 'Dosyalarınızı Buraya Sürükleyin veya Seçin',
  subtitle = '%100 İstemci Taraflı • Dosyalarınız asla tarayıcınızdan çıkmaz',
  className = '',
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      onFilesSelected(filesArray);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      onFilesSelected(filesArray);
    }
    e.target.value = '';
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`group relative cursor-pointer border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 flex flex-col items-center justify-center space-y-4 select-none overflow-hidden ${
        isDragging
          ? 'border-emerald-500 bg-emerald-500/15 ring-4 ring-emerald-500/30 scale-[1.01] shadow-2xl shadow-emerald-500/20'
          : 'border-emerald-500/40 hover:border-emerald-500 bg-gradient-to-b from-emerald-500/5 via-slate-50/50 to-emerald-500/5 dark:from-emerald-950/20 dark:via-zinc-900/60 dark:to-emerald-950/10 hover:shadow-xl hover:shadow-emerald-500/10'
      } ${className}`}
    >
      {/* Background Animated Subtle Radial Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-emerald-500/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      {/* Prominent Glowing Upload Icon Container */}
      <div
        className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
          isDragging
            ? 'bg-emerald-500 text-white scale-110 rotate-3'
            : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white group-hover:scale-105 group-hover:shadow-emerald-500/40'
        }`}
      >
        <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 animate-bounce duration-1000" />
      </div>

      {/* Title & Subtitle */}
      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
          {isDragging ? '🎉 Dosyayı Hemen Bırakın!' : title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Interactive Action Button */}
      <div className="pt-2">
        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm shadow-md transition-all group-hover:shadow-lg group-hover:shadow-emerald-600/30">
          <FolderOpen className="w-4 h-4" />
          <span>Bilgisayardan Dosya Seçin</span>
        </span>
      </div>

      {/* Format & Privacy Badges Row */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono">
        {accept && (
          <span className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800/80 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 shadow-sm">
            Desteklenen: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{accept}</span>
          </span>
        )}
        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 flex items-center gap-1 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          Maks. {maxSizeMB} MB &bull; Sıfır Veri Yükleme
        </span>
      </div>
    </div>
  );
}

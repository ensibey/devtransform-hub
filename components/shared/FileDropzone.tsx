'use client';

import React, { useRef, useState } from 'react';
import { Upload, FileUp, X, Check } from 'lucide-react';
import { formatBytes } from '@/lib/utils';

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
  title = 'Drop files here or click to browse',
  subtitle = '100% Client-Side • Files never leave your browser',
  className = '',
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
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
      className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 text-center transition-all flex flex-col items-center justify-center space-y-3 select-none ${
        isDragging
          ? 'border-brand-emerald bg-brand-emerald/10 scale-[0.99]'
          : 'border-border hover:border-zinc-500 bg-surface-100/70 hover:bg-surface-100'
      } ${className}`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />
      <div className="w-12 h-12 rounded-2xl bg-surface-200 border border-border flex items-center justify-center text-zinc-300 shadow-inner group-hover:text-white">
        <Upload className="w-6 h-6 text-brand-emerald" />
      </div>
      <div>
        <div className="font-semibold text-sm text-zinc-100">{title}</div>
        <div className="text-xs text-zinc-400 mt-1">{subtitle}</div>
      </div>
      {accept && (
        <div className="text-[10px] font-mono text-zinc-500 bg-surface-200 px-2 py-0.5 rounded border border-border">
          Supported: {accept}
        </div>
      )}
    </div>
  );
}

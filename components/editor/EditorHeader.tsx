'use client';

import React, { useRef } from 'react';
import {
  FileCode,
  Sparkles,
  Upload,
  Copy,
  Check,
  Trash2,
  Download,
  ChevronDown,
} from 'lucide-react';
import { FormatId, FORMATS, FORMAT_LIST } from '@/lib/matrix';

export interface EditorHeaderProps {
  title?: string;
  format: FormatId;
  onFormatChange?: (newFormat: FormatId) => void;
  onLoadSample?: () => void;
  onClear?: () => void;
  onFormat?: () => void;
  onFileUpload?: (content: string, filename: string) => void;
  onCopy?: () => void;
  readOnly?: boolean;
  value?: string;
}

export function EditorHeader({
  title,
  format,
  onFormatChange,
  onLoadSample,
  onClear,
  onFormat,
  onFileUpload,
  onCopy,
  readOnly = false,
  value = '',
}: EditorHeaderProps) {
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formatMeta = FORMATS[format] || FORMATS.json;

  const handleCopy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code to clipboard:', err);
    }
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: formatMeta.mimeType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exported_${Date.now()}.${formatMeta.extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (onFileUpload && content) {
        onFileUpload(content, file.name);
      }
    };
    reader.readAsText(file);
    // Reset file input value
    e.target.value = '';
  };

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-surface-200 border-b border-border text-xs text-zinc-300 select-none">
      {/* Left: Format selector / Title */}
      <div className="flex items-center space-x-2">
        {onFormatChange ? (
          <div className="relative group">
            <select
              value={format}
              onChange={(e) => onFormatChange(e.target.value as FormatId)}
              className="appearance-none bg-surface-100 hover:bg-surface-50 border border-border rounded px-2.5 py-1 pr-6 font-medium text-zinc-200 focus:outline-none focus:ring-1 focus:ring-brand-emerald cursor-pointer transition-colors"
            >
              {FORMAT_LIST.map((f) => (
                <option key={f.id} value={f.id} className="bg-surface-100 text-zinc-200">
                  {f.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-zinc-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 font-medium text-zinc-200 px-1">
            <FileCode className="w-3.5 h-3.5 text-brand-emerald" />
            <span>{title || formatMeta.name}</span>
          </div>
        )}

        {/* Extension Pill */}
        <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
          .{formatMeta.extension}
        </span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-1 sm:space-x-1.5">
        {/* Sample Loader (Input Only) */}
        {!readOnly && onLoadSample && (
          <button
            type="button"
            onClick={onLoadSample}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
            title="Load sample code for this format"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Sample</span>
          </button>
        )}

        {/* Upload File (Input Only) */}
        {!readOnly && onFileUpload && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".json,.yaml,.yml,.csv,.xml,.toml,.ts,.go,.rs,.py,.sql,.txt"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
              title="Upload file from computer"
            >
              <Upload className="w-3 h-3 text-sky-400" />
              <span className="hidden md:inline">Upload</span>
            </button>
          </>
        )}

        {/* Format / Beautify */}
        {onFormat && (
          <button
            type="button"
            onClick={onFormat}
            className="flex items-center space-x-1 px-2 py-1 rounded bg-zinc-800/60 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/60 transition-colors"
            title="Prettify formatting (Ctrl/Cmd + Shift + F)"
          >
            <Sparkles className="w-3 h-3 text-brand-emerald" />
            <span className="hidden md:inline">Beautify</span>
          </button>
        )}

        {/* Clear (Input Only) */}
        {!readOnly && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 transition-colors"
            title="Clear editor contents"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Download File */}
        {value && (
          <button
            type="button"
            onClick={handleDownload}
            className="p-1 rounded text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`flex items-center space-x-1 px-2.5 py-1 rounded font-medium transition-all ${
            copied
              ? 'bg-brand-emerald/20 text-brand-emerald border border-brand-emerald/40'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700'
          }`}
          title="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-brand-emerald" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 text-zinc-300" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

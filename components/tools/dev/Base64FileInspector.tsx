'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileDown, FileText, Image as ImageIcon, Check, Download, AlertCircle } from 'lucide-react';

function parseBase64(input: string) {
  const clean = input.trim();
  if (!clean) return null;

  let mime = 'application/octet-stream';
  let rawB64 = clean;
  let filename = 'download.bin';

  if (clean.startsWith('data:')) {
    const parts = clean.split(';base64,');
    if (parts.length === 2) {
      mime = parts[0].replace('data:', '');
      rawB64 = parts[1];
    }
  } else {
    // Guess mime from first characters
    if (clean.startsWith('JVBERi0')) {
      mime = 'application/pdf';
      filename = 'document.pdf';
    } else if (clean.startsWith('iVBORw0KGgo')) {
      mime = 'image/png';
      filename = 'image.png';
    } else if (clean.startsWith('/9j/')) {
      mime = 'image/jpeg';
      filename = 'image.jpg';
    } else if (clean.startsWith('R0lGOD')) {
      mime = 'image/gif';
      filename = 'image.gif';
    }
  }

  // Calculate approximate byte size
  const padding = (rawB64.match(/=/g) || []).length;
  const bytes = Math.floor((rawB64.length * 3) / 4) - padding;

  return {
    rawB64,
    mime,
    filename,
    bytes: bytes > 0 ? bytes : 0,
    dataUrl: clean.startsWith('data:') ? clean : `data:${mime};base64,${clean}`,
  };
}

export function Base64FileInspector() {
  const [b64Input, setB64Input] = useState(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAABxSURBVHgB7dKxCcAwDEVRP3VzO4e7R+sUbm7hNqlCA0Fws3mQoPAVfIeE9dM1eM21/e4fO4ACVIAKUIACVIAKUIACVIAKUIACVIAKUIACVIAKUIACVIAKUIACVIAKUIACVIAKUIACVIAKUIACVIAC4w080gFRw0gqfQAAAABJRU5ErkJggg=='
  );

  const parsed = useMemo(() => {
    return parseBase64(b64Input);
  }, [b64Input]);

  const handleDownload = () => {
    if (!parsed) return;
    try {
      const byteCharacters = atob(parsed.rawB64.replace(/\s+/g, ''));
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: parsed.mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = parsed.filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert('Failed to decode Base64 string: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Base64 Input & File Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileDown className="w-4 h-4 text-emerald-400" />
              <span>Base64 Data or Data URL:</span>
            </span>
          </div>

          <textarea
            value={b64Input}
            onChange={(e) => setB64Input(e.target.value)}
            rows={12}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed select-all"
            placeholder="Paste data:image/png;base64,... or raw base64 string..."
          />
        </div>

        {/* Live File Inspection & Download Card */}
        <div className="p-5 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 flex flex-col justify-between space-y-4">
          <div className="space-y-3 font-mono text-xs">
            <span className="text-brand-emerald font-bold block">Decoded File Details:</span>

            {parsed ? (
              <div className="space-y-2 p-4 rounded-xl bg-zinc-950 border border-zinc-800">
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Detected MIME Type:</span>
                  <span className="text-emerald-400 font-bold">{parsed.mime}</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-zinc-800/60">
                  <span className="text-zinc-500">Calculated Binary Size:</span>
                  <span className="text-white font-bold">
                    {parsed.bytes > 1024
                      ? `${(parsed.bytes / 1024).toFixed(2)} KB`
                      : `${parsed.bytes} Bytes`}
                  </span>
                </div>

                {/* Image Live Preview */}
                {parsed.mime.startsWith('image/') && (
                  <div className="pt-2 flex flex-col items-center justify-center space-y-2">
                    <span className="text-[10px] text-zinc-500">Image Preview:</span>
                    <img
                      src={parsed.dataUrl}
                      alt="Decoded base64 preview"
                      className="max-h-32 rounded-lg border border-zinc-700 bg-zinc-900 p-1 shadow-md"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-500">
                Paste a valid Base64 string to inspect file properties.
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={!parsed}
            onClick={handleDownload}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black font-mono text-xs font-bold transition-colors flex items-center justify-center space-x-2 shadow-lg shadow-emerald-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Decoded Binary File</span>
          </button>
        </div>
      </div>
    </div>
  );
}

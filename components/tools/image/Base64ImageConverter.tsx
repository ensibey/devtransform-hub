'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Image as ImageIcon, Upload, FileCode, Check, Download, Trash2, ArrowRightLeft } from 'lucide-react';

export function Base64ImageConverter() {
  const [base64String, setBase64String] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: string; type: string } | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileDetails({
      name: file.name,
      size: `${(file.size / 1024).toFixed(1)} KB`,
      type: file.type || 'image/png',
    });

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64String(result);
      setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64Input = (val: string) => {
    setBase64String(val);
    if (val.startsWith('data:image/') || val.length > 50) {
      const formatted = val.startsWith('data:image/') ? val : `data:image/png;base64,${val}`;
      setImagePreview(formatted);
    } else {
      setImagePreview(null);
    }
  };

  const htmlImgTag = `<img src="${base64String}" alt="Embedded Image" />`;
  const cssBackgroundTag = `background-image: url('${base64String}');`;

  const downloadDecodedImage = () => {
    if (!imagePreview) return;
    const a = document.createElement('a');
    a.href = imagePreview;
    a.download = fileDetails?.name || 'decoded-image.png';
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Upload Box or Paste Base64 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Image to Base64 */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
              <Upload className="w-4 h-4 text-brand-emerald" />
              <span>Image to Base64 (Görseli Base64&apos;e Çevir)</span>
            </div>
            <p className="text-xs text-zinc-400">
              Select any PNG, JPG, WebP, or SVG file to convert into a Base64 data URI string.
            </p>
          </div>

          <label className="border-2 border-dashed border-zinc-700 hover:border-brand-emerald rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-zinc-950/60 group">
            <ImageIcon className="w-8 h-8 text-zinc-500 group-hover:text-brand-emerald transition-colors mb-2" />
            <span className="text-xs font-mono text-zinc-300 font-bold">
              Click to browse or drop an image file
            </span>
            <span className="text-[10px] font-mono text-zinc-500 mt-1">PNG, JPG, WebP, GIF, SVG</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          {fileDetails && (
            <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 flex items-center justify-between">
              <span className="truncate pr-2">{fileDetails.name}</span>
              <span className="text-brand-emerald font-bold">{fileDetails.size}</span>
            </div>
          )}
        </div>

        {/* Base64 to Image Preview */}
        <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
              <ImageIcon className="w-4 h-4 text-sky-400" />
              <span>Base64 to Image Preview & Download</span>
            </div>
            {imagePreview && (
              <button
                type="button"
                onClick={downloadDecodedImage}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono border border-emerald-500/40 transition-colors flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            )}
          </div>

          <div className="h-[180px] rounded-xl bg-zinc-950 border border-dashed border-zinc-800 flex items-center justify-center p-4 overflow-hidden relative">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imagePreview}
                alt="Decoded Preview"
                className="max-h-full max-w-full object-contain rounded shadow-lg"
              />
            ) : (
              <span className="text-xs text-zinc-600 font-mono">
                Image preview will render here once Base64 is provided.
              </span>
            )}
          </div>

          {base64String && (
            <div className="flex justify-between text-xs font-mono text-zinc-400">
              <span>Base64 String Length:</span>
              <span className="text-white font-bold">{base64String.length.toLocaleString()} characters</span>
            </div>
          )}
        </div>
      </div>

      {/* Raw Base64 Text Area with Export Formats */}
      {base64String && (
        <div className="space-y-4">
          {/* Base64 Data URI */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Base64 Data URI (data:image/...):</span>
              <CopyButton text={base64String} />
            </div>
            <textarea
              readOnly
              value={base64String}
              rows={4}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>

          {/* HTML & CSS Snippets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-sky-400">
                <span className="font-bold">HTML &lt;img&gt; Tag:</span>
                <CopyButton text={htmlImgTag} />
              </div>
              <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto truncate">
                {htmlImgTag}
              </pre>
            </div>

            <div className="p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span className="font-bold">CSS background-image:</span>
                <CopyButton text={cssBackgroundTag} />
              </div>
              <pre className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 overflow-x-auto truncate">
                {cssBackgroundTag}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

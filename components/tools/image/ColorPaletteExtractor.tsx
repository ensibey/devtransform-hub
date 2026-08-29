'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/shared/FileDropzone';
import { CopyButton } from '@/components/shared/CopyButton';
import { Palette, Check, Copy } from 'lucide-react';

interface ExtractedColor {
  hex: string;
  rgb: string;
  count: number;
}

export function ColorPaletteExtractor() {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [palette, setPalette] = useState<ExtractedColor[]>([]);

  const handleFilesSelected = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    extractColors(url);
  };

  const extractColors = (url: string) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);

      const imageData = ctx.getImageData(0, 0, 150, 150).data;
      const colorCounts: Record<string, { r: number; g: number; b: number; count: number }> = {};

      for (let i = 0; i < imageData.length; i += 16) {
        const r = Math.round(imageData[i] / 15) * 15;
        const g = Math.round(imageData[i + 1] / 15) * 15;
        const b = Math.round(imageData[i + 2] / 15) * 15;
        const a = imageData[i + 3];

        if (a < 128) continue; // skip transparent

        const key = `${r},${g},${b}`;
        if (!colorCounts[key]) {
          colorCounts[key] = { r, g, b, count: 0 };
        }
        colorCounts[key].count++;
      }

      const sorted = Object.values(colorCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

      const colors: ExtractedColor[] = sorted.map((c) => {
        const hex =
          '#' +
          [c.r, c.g, c.b]
            .map((x) => x.toString(16).padStart(2, '0'))
            .join('')
            .toUpperCase();
        return {
          hex,
          rgb: `rgb(${c.r}, ${c.g}, ${c.b})`,
          count: c.count,
        };
      });

      setPalette(colors);
    };
    img.src = url;
  };

  return (
    <div className="space-y-6">
      {!imageSrc ? (
        <FileDropzone
          accept="image/*"
          onFilesSelected={handleFilesSelected}
          title="Upload image to extract color palette"
          subtitle="Supports PNG, JPG, WebP • 100% Client-Side Extraction"
        />
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-zinc-200 flex items-center space-x-2">
              <Palette className="w-4 h-4 text-brand-emerald" />
              <span>Extracted Dominant Palette</span>
            </h3>
            <button
              type="button"
              onClick={() => {
                setImageSrc('');
                setPalette([]);
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 px-3 py-1 bg-surface-200 rounded-lg border border-border"
            >
              Upload Another Image
            </button>
          </div>

          {/* Color Swatches Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {palette.map((col, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col shadow-lg"
              >
                <div
                  className="h-24 w-full"
                  style={{ backgroundColor: col.hex }}
                />
                <div className="p-3 bg-surface-300 flex items-center justify-between">
                  <div>
                    <div className="font-mono font-bold text-xs text-white">
                      {col.hex}
                    </div>
                    <div className="text-[10px] font-mono text-zinc-400">
                      {col.rgb}
                    </div>
                  </div>
                  <CopyButton text={col.hex} label="Copy" />
                </div>
              </div>
            ))}
          </div>

          {/* Image Preview */}
          <div className="p-4 rounded-xl bg-oled border border-border flex justify-center">
            <img
              src={imageSrc}
              alt="Source"
              className="max-h-64 object-contain rounded-lg shadow-md"
            />
          </div>
        </div>
      )}
    </div>
  );
}

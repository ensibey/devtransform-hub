'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { formatBytes, downloadText } from '@/lib/utils';
import { Sparkles, Download, Check, RefreshCw } from 'lucide-react';

export function SvgOptimizer() {
  const [inputSvg, setInputSvg] = useState(`<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <!-- Generator: Adobe Illustrator 25.0.0, SVG Export Plug-In . SVG Version: 6.00 Build 0) -->
  <metadata>
    <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
      <rdf:Description rdf:about="" />
    </rdf:RDF>
  </metadata>
  <g id="Layer_1" data-name="Layer 1">
    <circle cx="50" cy="50" r="40" stroke="#10b981" stroke-width="4" fill="#09090b" />
    <path d="M 30 50 L 45 65 L 70 35" stroke="#10b981" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`);

  const [outputSvg, setOutputSvg] = useState('');
  const [savingsPercent, setSavingsPercent] = useState(0);

  const optimizeSvg = (svg: string) => {
    let clean = svg
      // Remove XML doctype and declarations
      .replace(/<\?xml[\s\S]*?\?>/gi, '')
      // Remove comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove metadata tags
      .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
      // Remove useless editor attributes
      .replace(/\s*(data-name|id|xmlns:xlink|xml:space|enable-background)="[^"]*"/gi, '')
      // Remove multiple whitespace & newlines between tags
      .replace(/>\s+</g, '><')
      .trim();

    setOutputSvg(clean);

    const inSize = new Blob([svg]).size;
    const outSize = new Blob([clean]).size;
    if (inSize > 0 && outSize < inSize) {
      setSavingsPercent(Math.round(((inSize - outSize) / inSize) * 100));
    } else {
      setSavingsPercent(0);
    }
  };

  React.useEffect(() => {
    optimizeSvg(inputSvg);
  }, [inputSvg]);

  return (
    <div className="space-y-6">
      {/* Top Bar with Metrics */}
      <div className="p-4 rounded-xl bg-surface-200 border border-border flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-4 font-mono">
          <div>
            Original: <strong className="text-zinc-200">{formatBytes(new Blob([inputSvg]).size)}</strong>
          </div>
          <div>→</div>
          <div>
            Cleaned: <strong className="text-brand-emerald">{formatBytes(new Blob([outputSvg]).size)}</strong>
          </div>
          {savingsPercent > 0 && (
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-brand-emerald border border-emerald-500/40 text-[11px] font-semibold">
              -{savingsPercent}% Reduced
            </span>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <CopyButton text={outputSvg} label="Copy Cleaned SVG" />
          <button
            type="button"
            onClick={() => downloadText(outputSvg, 'optimized.svg', 'image/svg+xml')}
            className="flex items-center space-x-1.5 px-3 py-1 text-xs rounded-lg bg-brand-emerald text-black font-semibold hover:bg-emerald-400 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Editors & Live Visual Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source SVG */}
        <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
          <div className="p-2.5 bg-surface-300 border-b border-border text-xs font-mono text-zinc-400">
            Raw Input SVG
          </div>
          <textarea
            value={inputSvg}
            onChange={(e) => setInputSvg(e.target.value)}
            rows={10}
            className="w-full p-3 bg-oled text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Live Visual Preview & Output */}
        <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
          <div className="p-2.5 bg-surface-300 border-b border-border text-xs font-mono text-zinc-400">
            Live Preview
          </div>
          <div className="flex-1 min-h-[220px] bg-oled p-6 flex items-center justify-center">
            {outputSvg ? (
              <div
                dangerouslySetInnerHTML={{ __html: outputSvg }}
                className="max-h-48 max-w-full flex items-center justify-center [&>svg]:max-h-44 [&>svg]:w-auto"
              />
            ) : (
              <div className="text-zinc-500 text-xs">No SVG to render</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

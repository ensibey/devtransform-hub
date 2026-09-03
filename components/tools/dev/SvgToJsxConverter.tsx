'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Code2, FileCode, Check, Eye, Download } from 'lucide-react';

function svgToJsx(svgString: string, componentName = 'SvgIcon'): string {
  if (!svgString.trim()) return '';

  let jsx = svgString;

  // Replace kebab-case SVG attributes to camelCase
  const attrMap: Record<string, string> = {
    'class=': 'className=',
    'stroke-width=': 'strokeWidth=',
    'stroke-linecap=': 'strokeLinecap=',
    'stroke-linejoin=': 'strokeLinejoin=',
    'stroke-miterlimit=': 'strokeMiterlimit=',
    'stroke-dasharray=': 'strokeDasharray=',
    'stroke-dashoffset=': 'strokeDashoffset=',
    'stroke-opacity=': 'strokeOpacity=',
    'fill-rule=': 'fillRule=',
    'fill-opacity=': 'fillOpacity=',
    'clip-rule=': 'clipRule=',
    'clip-path=': 'clipPath=',
    'font-size=': 'fontSize=',
    'font-family=': 'fontFamily=',
    'font-weight=': 'fontWeight=',
    'text-anchor=': 'textAnchor=',
    'stop-color=': 'stopColor=',
    'stop-opacity=': 'stopOpacity=',
    'xmlns:xlink=': 'xmlnsXlink=',
    'xlink:href=': 'xlinkHref=',
  };

  for (const [kebab, camel] of Object.entries(attrMap)) {
    const regex = new RegExp(kebab, 'gi');
    jsx = jsx.replace(regex, camel);
  }

  // Self closing tags
  const tags = ['path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'ellipse', 'stop', 'use'];
  tags.forEach((tag) => {
    const regex = new RegExp(`<(${tag})((?:\\s+[^>]*?)?)(?<!\\/)>`, 'gi');
    jsx = jsx.replace(regex, '<$1$2 />');
  });

  // Wrap in React Component
  return `import React from 'react';\n\nexport function ${componentName}(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    ${jsx.replace(/^/gm, '    ').trim()}\n  );\n}`;
}

function svgToDataUri(svgString: string): string {
  const clean = svgString
    .replace(/\s+/g, ' ')
    .replace(/"/g, "'")
    .trim();
  return `data:image/svg+xml,${encodeURIComponent(clean)}`;
}

export function SvgToJsxConverter() {
  const [svgInput, setSvgInput] = useState(
    `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n  <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n  <path d="M2 17L12 22L22 17" stroke="#38BDF8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n  <path d="M2 12L12 17L22 12" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n</svg>`
  );

  const [componentName, setComponentName] = useState('LayerIcon');

  const jsxCode = useMemo(() => {
    return svgToJsx(svgInput, componentName);
  }, [svgInput, componentName]);

  const dataUri = useMemo(() => {
    return svgToDataUri(svgInput);
  }, [svgInput]);

  const cssBackground = `background-image: url("${dataUri}");`;

  return (
    <div className="space-y-6">
      {/* Component Name Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
        <div className="flex items-center space-x-2">
          <span className="text-zinc-400">React Component Name:</span>
          <input
            type="text"
            value={componentName}
            onChange={(e) => setComponentName(e.target.value.replace(/[^a-zA-Z0-9]/g, ''))}
            className="p-1.5 px-3 rounded-xl bg-zinc-950 border border-zinc-800 text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald"
          />
        </div>
      </div>

      {/* 2-Column SVG Input & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SVG Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <FileCode className="w-4 h-4 text-emerald-400" />
              <span>Raw SVG Source Code:</span>
            </span>
          </div>

          <textarea
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            rows={10}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-emerald-400 resize-none leading-relaxed"
            placeholder="<svg ...>...</svg>"
          />
        </div>

        {/* Live Visual Preview */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col items-center justify-center min-h-[220px] space-y-3">
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            Live Vector Rendering
          </span>
          <div
            className="w-28 h-28 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center p-4 shadow-xl"
            dangerouslySetInnerHTML={{ __html: svgInput }}
          />
        </div>
      </div>

      {/* Code Outputs: React JSX & CSS Data URI */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 font-mono text-xs">
        {/* React JSX */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
          <div className="flex items-center justify-between text-brand-emerald font-bold">
            <span>React JSX / TSX Component:</span>
            <CopyButton text={jsxCode} />
          </div>
          <textarea
            readOnly
            value={jsxCode}
            rows={8}
            className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-brand-emerald focus:outline-none resize-none leading-relaxed select-all"
          />
        </div>

        {/* CSS Data URI */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-sky-500/40 space-y-2">
          <div className="flex items-center justify-between text-sky-400 font-bold">
            <span>CSS Data URI (background-image):</span>
            <CopyButton text={cssBackground} />
          </div>
          <textarea
            readOnly
            value={cssBackground}
            rows={8}
            className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-sky-300 focus:outline-none resize-none leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
}

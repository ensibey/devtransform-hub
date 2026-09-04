'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Shapes, Sparkles, Check, Code, Layers } from 'lucide-react';

interface ShapePreset {
  name: string;
  polygon: string;
}

const SHAPES: ShapePreset[] = [
  { name: 'Triangle', polygon: '50% 0%, 0% 100%, 100% 100%' },
  { name: 'Inverted Triangle', polygon: '0% 0%, 100% 0%, 50% 100%' },
  { name: 'Trapezoid', polygon: '20% 0%, 80% 0%, 100% 100%, 0% 100%' },
  { name: 'Parallelogram', polygon: '25% 0%, 100% 0%, 75% 100%, 0% 100%' },
  { name: 'Rhombus (Diamond)', polygon: '50% 0%, 100% 50%, 50% 100%, 0% 50%' },
  { name: 'Pentagon', polygon: '50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%' },
  { name: 'Hexagon', polygon: '25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%' },
  { name: 'Octagon', polygon: '30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%' },
  { name: 'Chevron Right', polygon: '75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%' },
  { name: 'Star (5-Point)', polygon: '50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%' },
  { name: 'Speech Bubble', polygon: '0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%' },
  { name: 'Cross / Plus', polygon: '35% 0%, 65% 0%, 65% 35%, 100% 35%, 100% 65%, 65% 65%, 65% 100%, 35% 100%, 35% 65%, 0% 65%, 0% 35%, 35% 35%' },
];

export function CssClipPathGenerator() {
  const [selectedShape, setSelectedShape] = useState<ShapePreset>(SHAPES[0]);
  const [customPolygon, setCustomPolygon] = useState(SHAPES[0].polygon);

  const handleSelectPreset = (preset: ShapePreset) => {
    setSelectedShape(preset);
    setCustomPolygon(preset.polygon);
  };

  const cssSnippet = `/* CSS */\nclip-path: polygon(${customPolygon});\n-webkit-clip-path: polygon(${customPolygon});`;
  const inlineSnippet = `style={{ clipPath: 'polygon(${customPolygon})' }}`;

  return (
    <div className="space-y-6">
      {/* Top Controls & Presets */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shapes className="w-5 h-5 text-brand-emerald" />
            <h3 className="text-sm font-semibold text-white">Select Geometric Shape</h3>
          </div>
          <span className="text-xs font-mono text-zinc-500">{SHAPES.length} CSS Shapes Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5">
          {SHAPES.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleSelectPreset(preset)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col items-center justify-center space-y-2 group ${
                selectedShape.name === preset.name
                  ? 'bg-brand-emerald/15 border-brand-emerald text-brand-emerald font-bold'
                  : 'bg-zinc-950/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700'
              }`}
            >
              <div
                className="w-8 h-8 bg-gradient-to-tr from-brand-emerald to-emerald-400 group-hover:scale-105 transition-transform"
                style={{ clipPath: `polygon(${preset.polygon})` }}
              />
              <span className="text-[11px] font-mono text-center truncate w-full">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Preview Canvas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visual Preview */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center min-h-[320px] shadow-sm relative overflow-hidden">
          <div
            className="w-56 h-56 bg-gradient-to-br from-emerald-400 via-brand-emerald to-teal-700 shadow-2xl transition-all duration-300 flex items-center justify-center"
            style={{ clipPath: `polygon(${customPolygon})` }}
          >
            <span className="text-black/80 font-mono font-bold text-xs pointer-events-none drop-shadow">
              {selectedShape.name}
            </span>
          </div>
        </div>

        {/* Code & Custom Polygon Editor */}
        <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Polygon Coordinates
              </span>
              <CopyButton text={`polygon(${customPolygon})`} />
            </div>
            <textarea
              value={customPolygon}
              onChange={(e) => setCustomPolygon(e.target.value)}
              rows={3}
              className="w-full p-3 bg-black/60 border border-zinc-800 rounded-xl text-brand-emerald font-mono text-xs focus:border-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                CSS Style Declaration
              </span>
              <CopyButton text={cssSnippet} />
            </div>
            <pre className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-zinc-300 font-mono text-xs select-all overflow-x-auto">
              {cssSnippet}
            </pre>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                React / JSX Inline Style
              </span>
              <CopyButton text={inlineSnippet} />
            </div>
            <pre className="p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs select-all overflow-x-auto">
              {inlineSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

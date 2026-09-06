'use client';

import React, { useState } from 'react';
import { ViewportDevice } from '@/lib/viewport-data';
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Watch,
  RotateCw,
  Copy,
  Check,
  Code2,
  Layers,
  Sparkles,
  Maximize2
} from 'lucide-react';

interface DeviceViewportViewerProps {
  device: ViewportDevice;
}

export function DeviceViewportViewer({ device }: DeviceViewportViewerProps) {
  const [isLandscape, setIsLandscape] = useState(false);
  const [activeTab, setActiveTab] = useState<'css' | 'tailwind' | 'js' | 'meta'>('css');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentWidth = isLandscape ? device.cssHeight : device.cssWidth;
  const currentHeight = isLandscape ? device.cssWidth : device.cssHeight;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'smartphone':
        return <Smartphone className="w-5 h-5 text-indigo-400" />;
      case 'tablet':
        return <Tablet className="w-5 h-5 text-sky-400" />;
      case 'laptop':
        return <Laptop className="w-5 h-5 text-emerald-400" />;
      case 'desktop':
        return <Monitor className="w-5 h-5 text-amber-400" />;
      case 'wearable':
        return <Watch className="w-5 h-5 text-purple-400" />;
      default:
        return <Smartphone className="w-5 h-5 text-indigo-400" />;
    }
  };

  const activeMediaQuery = isLandscape
    ? device.mediaQueryLandscape
    : device.mediaQueryPortrait;

  const jsSnippet = `// Check if user is on ${device.name} (${isLandscape ? 'Landscape' : 'Portrait'})
const is${device.slug.replace(/[^a-zA-Z0-9]/g, '')} = window.matchMedia('${activeMediaQuery.replace('@media ', '')}').matches;

if (is${device.slug.replace(/[^a-zA-Z0-9]/g, '')}) {
  console.log('Matched ${device.name} display specs');
}`;

  const tailwindSnippet = `// tailwind.config.js - Custom screen breakpoint
module.exports = {
  theme: {
    extend: {
      screens: {
        '${device.slug}': '${currentWidth}px',
      },
    },
  },
};`;

  const metaSnippet = `<!-- Essential HTML5 mobile viewport meta tag -->
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />`;

  return (
    <div className="space-y-8">
      {/* Quick Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block mb-1">CSS Viewport</span>
          <span className="text-lg font-bold text-white font-mono">
            {currentWidth} &times; {currentHeight}
          </span>
          <span className="text-[10px] text-slate-500 block">px logical</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block mb-1">Physical Screen</span>
          <span className="text-lg font-bold text-sky-400 font-mono">
            {device.physicalWidth} &times; {device.physicalHeight}
          </span>
          <span className="text-[10px] text-slate-500 block">px native</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block mb-1">Device Pixel Ratio</span>
          <span className="text-lg font-bold text-indigo-400 font-mono">
            {device.dpr}&times; DPR
          </span>
          <span className="text-[10px] text-slate-500 block">Retina scale</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block mb-1">Aspect Ratio</span>
          <span className="text-lg font-bold text-emerald-400 font-mono">
            {device.aspectRatio}
          </span>
          <span className="text-[10px] text-slate-500 block">{device.screenDiagonal}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block mb-1">Brand & Year</span>
          <span className="text-lg font-bold text-amber-400">
            {device.brand}
          </span>
          <span className="text-[10px] text-slate-500 block">Released {device.releaseYear}</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
          <span className="text-xs text-slate-400 block mb-1">Tailwind Tier</span>
          <span className="text-sm font-bold text-purple-400 truncate block">
            {device.tailwindBreakpoint.split(' ')[0]}
          </span>
          <span className="text-[10px] text-slate-500 block truncate">{device.tailwindBreakpoint}</span>
        </div>
      </div>

      {/* Interactive Mockup & Controls */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-slate-800">
              {getCategoryIcon(device.category)}
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">
                Interactive Display Canvas Simulator
              </h3>
              <p className="text-xs text-slate-400">
                Simulates {device.name} canvas proportion ({currentWidth} &times; {currentHeight} CSS px)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLandscape(!isLandscape)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Rotate: {isLandscape ? 'Landscape' : 'Portrait'}</span>
            </button>
          </div>
        </div>

        {/* Visual Frame Container */}
        <div className="flex justify-center items-center py-6 bg-slate-950/60 rounded-xl border border-slate-800/60 min-h-[360px]">
          <div
            style={{
              aspectRatio: `${currentWidth} / ${currentHeight}`,
              maxWidth: isLandscape ? '460px' : '260px',
              width: '100%',
            }}
            className="relative rounded-2xl border-4 border-slate-700 bg-slate-900 shadow-2xl p-3 flex flex-col justify-between overflow-hidden transition-all duration-300"
          >
            {/* Top Bar Indicator */}
            <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/80 pb-1.5 mb-2">
              <span className="font-semibold text-slate-300">9:41</span>
              {device.brand === 'Apple' && device.category === 'smartphone' && (
                <div className="w-14 h-3 bg-black rounded-full mx-auto" />
              )}
              <span>100%</span>
            </div>

            {/* Simulated Web App UI */}
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-center">
                <span className="text-[11px] font-bold text-white block">
                  {device.name}
                </span>
                <span className="text-[9px] text-indigo-400 font-mono block">
                  {currentWidth} &times; {currentHeight} px
                </span>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <div className="p-2 rounded bg-slate-800/50 text-[9px] text-slate-300 text-center">
                  DPR: {device.dpr}x
                </div>
                <div className="p-2 rounded bg-slate-800/50 text-[9px] text-slate-300 text-center">
                  {device.aspectRatio}
                </div>
              </div>

              <div className="h-6 rounded bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-[10px] font-medium text-indigo-200">
                Responsive Viewport
              </div>
            </div>

            {/* Bottom Safe Area Bar */}
            <div className="pt-2 text-center">
              <div className="w-20 h-1 bg-slate-600 rounded-full mx-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Code Snippets Section */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 bg-slate-900/80">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Ready-to-Use Developer Snippets
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                activeTab === 'css'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              CSS Media Query
            </button>
            <button
              onClick={() => setActiveTab('tailwind')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                activeTab === 'tailwind'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Tailwind CSS
            </button>
            <button
              onClick={() => setActiveTab('js')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                activeTab === 'js'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              JavaScript
            </button>
            <button
              onClick={() => setActiveTab('meta')}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition ${
                activeTab === 'meta'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              HTML Meta
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-950/80 relative">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => {
                let textToCopy = '';
                if (activeTab === 'css') textToCopy = activeMediaQuery;
                if (activeTab === 'tailwind') textToCopy = tailwindSnippet;
                if (activeTab === 'js') textToCopy = jsSnippet;
                if (activeTab === 'meta') textToCopy = metaSnippet;
                copyToClipboard(textToCopy, activeTab);
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
            >
              {copiedKey === activeTab ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-xs text-slate-200 font-mono overflow-x-auto p-2 leading-relaxed">
            {activeTab === 'css' && activeMediaQuery}
            {activeTab === 'tailwind' && tailwindSnippet}
            {activeTab === 'js' && jsSnippet}
            {activeTab === 'meta' && metaSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

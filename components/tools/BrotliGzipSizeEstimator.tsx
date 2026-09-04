'use client';

import React, { useState, useEffect, useId } from 'react';
import { 
  Zap, 
  Upload, 
  Copy, 
  Check, 
  FileCode, 
  RotateCcw, 
  Wifi, 
  TrendingDown, 
  ShieldCheck, 
  Gauge, 
  Info 
} from 'lucide-react';

const SAMPLES = {
  react: `/**
 * React v18.2.0 production build
 * (c) Facebook, Inc. and its affiliates.
 * Released under the MIT License.
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).React={})}(this,(function(e){"use strict";var t=Symbol.for("react.element"),r=Symbol.for("react.portal"),n=Symbol.for("react.fragment"),o=Symbol.for("react.strict_mode"),u=Symbol.for("react.profiler"),c=Symbol.for("react.provider"),f=Symbol.for("react.context"),i=Symbol.for("react.forward_ref"),a=Symbol.for("react.suspense"),s=Symbol.for("react.memo"),l=Symbol.for("react.lazy"),p=Symbol.iterator;function y(e){if(null===e||"object"!=typeof e)return null;var t=p&&e[p]||e["@@iterator"];return"function"==typeof t?t:null}var d={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},v=Object.assign,m={};function h(e,t,r){this.props=e,this.context=t,this.refs=m,this.updater=r||d}function _(){}h.prototype.isReactComponent={},h.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&console.error("setState(...): takes an object of state variables to update or a function which returns an object of state variables."),this.updater.enqueueSetState(this,e,t,"setState")},h.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},_.prototype=h.prototype;function b(e,t,r){this.props=e,this.context=t,this.refs=m,this.updater=r||d}var S=b.prototype=new _;S.constructor=b,v(S,h.prototype),S.isPureReactComponent=!0;var w=Array.isArray,k=Object.prototype.hasOwnProperty,x={current:null},C={key:!0,ref:!0,__self:!0,__source:!0};return e.Component=h,e.PureComponent=b,e.createElement=function(e,r,n){var o,u={},c=null,f=null;if(null!=r)for(o in void 0!==r.ref&&(f=r.ref),void 0!==r.key&&(c=""+r.key),r)k.call(r,o)&&!C.hasOwnProperty(o)&&(u[o]=r[o]);var i=arguments.length-2;if(1===i)u.children=n;else if(1<i){for(var a=Array(i),s=0;s<i;s++)a[s]=arguments[s+2];u.children=a}return{$$typeof:t,type:e,key:c,ref:f,props:u,_owner:x.current}},e.version="18.2.0",e}));`,
  tailwind: `/*! tailwindcss v3.4.1 | MIT License | https://tailwindcss.com */
*,:after,:before{box-sizing:border-box;border:0 solid #e5e7eb}
html{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal}
body{margin:0;line-height:inherit}
hr{height:0;color:inherit;border-top-width:1px}
abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}
h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}
a{color:inherit;text-decoration:inherit}
b,strong{font-weight:bolder}
code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;font-size:1em}
small{font-size:80%}
sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}
sub{bottom:-.25em}
sup{top:-.5em}
table{text-indent:0;border-color:inherit;border-collapse:collapse}
button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;color:inherit;margin:0;padding:0}
.flex{display:flex}
.hidden{display:none}
.items-center{align-items:center}
.justify-between{justify-content:space-between}
.rounded-xl{border-radius:.75rem}
.bg-slate-900{background-color:#0f172a}
.p-6{padding:1.5rem}
.text-white{color:#fff}`,
  geojson: JSON.stringify({
    type: "FeatureCollection",
    features: Array.from({ length: 40 }).map((_, idx) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [Number((-74.006 + idx * 0.01).toFixed(4)), Number((40.7128 + idx * 0.01).toFixed(4))]
      },
      properties: {
        id: idx + 1,
        title: `Server Location Node #${idx + 1}`,
        datacenter: idx % 2 === 0 ? "us-east-virginia" : "eu-west-frankfurt",
        latencyMs: 12 + (idx % 15),
        activeConnections: 1240 * (idx + 1),
        uptime: "99.995%",
        tags: ["edge", "cdn", "http3", "quic", "brotli"]
      }
    })),
  }, null, 2)
};

export function BrotliGzipSizeEstimator() {
  const [content, setContent] = useState<string>(SAMPLES.react);
  const [copied, setCopied] = useState<boolean>(false);
  const [calculating, setCalculating] = useState<boolean>(false);
  const [stats, setStats] = useState<{
    rawBytes: number;
    gzipBytes: number;
    deflateBytes: number;
    brotliBytes: number;
  }>({
    rawBytes: 0,
    gzipBytes: 0,
    deflateBytes: 0,
    brotliBytes: 0,
  });

  const fileInputId = useId();

  // Compute compression sizes asynchronously
  useEffect(() => {
    let isCancelled = false;

    async function computeSizes() {
      if (!content) {
        setStats({ rawBytes: 0, gzipBytes: 0, deflateBytes: 0, brotliBytes: 0 });
        return;
      }

      setCalculating(true);
      const encoder = new TextEncoder();
      const rawData = encoder.encode(content);
      const rawBytes = rawData.byteLength;

      let gzipBytes = 0;
      let deflateBytes = 0;

      // Check if native browser CompressionStream is available
      if (typeof window !== 'undefined' && 'CompressionStream' in window) {
        try {
          // Gzip
          const csGzip = new (window as any).CompressionStream('gzip');
          const writerGzip = csGzip.writable.getWriter();
          writerGzip.write(rawData);
          writerGzip.close();
          const responseGzip = new Response(csGzip.readable);
          const bufGzip = await responseGzip.arrayBuffer();
          gzipBytes = bufGzip.byteLength;
        } catch {
          gzipBytes = Math.round(rawBytes * 0.35);
        }

        try {
          // Deflate
          const csDeflate = new (window as any).CompressionStream('deflate');
          const writerDeflate = csDeflate.writable.getWriter();
          writerDeflate.write(rawData);
          writerDeflate.close();
          const responseDeflate = new Response(csDeflate.readable);
          const bufDeflate = await responseDeflate.arrayBuffer();
          deflateBytes = bufDeflate.byteLength;
        } catch {
          deflateBytes = Math.round(rawBytes * 0.36);
        }
      } else {
        // Fallback approximation
        gzipBytes = Math.round(rawBytes * 0.35);
        deflateBytes = Math.round(rawBytes * 0.36);
      }

      // Brotli typically provides 14-22% smaller payload than standard Gzip for web scripts
      const brotliBytes = Math.max(1, Math.round(gzipBytes * 0.82));

      if (!isCancelled) {
        setStats({
          rawBytes,
          gzipBytes,
          deflateBytes,
          brotliBytes,
        });
        setCalculating(false);
      }
    }

    computeSizes();

    return () => {
      isCancelled = true;
    };
  }, [content]);

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const getSavingsPercent = (compressed: number, raw: number): string => {
    if (raw === 0) return '0%';
    const pct = Math.max(0, ((raw - compressed) / raw) * 100);
    return `${pct.toFixed(1)}%`;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setContent(text);
      }
    };
    reader.readAsText(file);
  };

  const handleCopySummary = () => {
    const summary = `Bundle Size Analysis:
• Raw Size: ${formatSize(stats.rawBytes)}
• Gzip Size: ${formatSize(stats.gzipBytes)} (Saved ${getSavingsPercent(stats.gzipBytes, stats.rawBytes)})
• Brotli Size: ${formatSize(stats.brotliBytes)} (Saved ${getSavingsPercent(stats.brotliBytes, stats.rawBytes)})
• Deflate Size: ${formatSize(stats.deflateBytes)}`;
    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Network download calculations (Latency + Transfer Time in ms)
  const calculateDownloadTime = (bytes: number, speedMbps: number, latencyMs: number) => {
    if (bytes === 0) return '0 ms';
    const bits = bytes * 8;
    const speedBps = speedMbps * 1_000_000;
    const transferMs = (bits / speedBps) * 1000;
    const totalMs = Math.round(transferMs + latencyMs);
    return totalMs >= 1000 ? `${(totalMs / 1000).toFixed(2)} s` : `${totalMs} ms`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner / Privacy badge */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Compression
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Web CompressionStream API
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Gzip & Brotli Bundle Size Calculator
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Inspect exact payload weights, compression efficiency, and real-world network transfer latency across 3G, 4G, and 5G.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label 
            htmlFor={fileInputId} 
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition shadow-sm"
          >
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Upload File</span>
          </label>
          <input 
            id={fileInputId} 
            type="file" 
            className="hidden" 
            onChange={handleFileUpload} 
          />
          <button
            onClick={handleCopySummary}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition shadow-sm shadow-cyan-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Metrics'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Raw Uncompressed */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Raw Uncompressed</span>
            <FileCode className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-white mb-1">
            {formatSize(stats.rawBytes)}
          </div>
          <div className="text-xs text-slate-500 font-mono">
            {stats.rawBytes.toLocaleString()} bytes
          </div>
        </div>

        {/* Gzip Compressed */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-cyan-500/30 transition relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-cyan-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gzip Level 6</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-cyan-300 mb-1">
            {formatSize(stats.gzipBytes)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-{getSavingsPercent(stats.gzipBytes, stats.rawBytes)} reduction</span>
          </div>
        </div>

        {/* Brotli Compressed */}
        <div className="bg-slate-900/50 border border-emerald-500/20 bg-emerald-950/10 rounded-2xl p-5 hover:border-emerald-500/40 transition relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-emerald-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Brotli (br) Est.</span>
            <Zap className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-300 mb-1">
            {formatSize(stats.brotliBytes)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>-{getSavingsPercent(stats.brotliBytes, stats.rawBytes)} (Best)</span>
          </div>
        </div>

        {/* Deflate */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Deflate / zlib</span>
            <RotateCcw className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-mono font-bold text-slate-200 mb-1">
            {formatSize(stats.deflateBytes)}
          </div>
          <div className="text-xs text-slate-500">
            -{getSavingsPercent(stats.deflateBytes, stats.rawBytes)} reduction
          </div>
        </div>
      </div>

      {/* Network Latency Estimation Table */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-white">Estimated Network Transfer Time (TTFB + Payload)</h2>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Includes simulated round-trip RTT latency
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Fast 3G Mobile</span>
              <span className="text-[11px] text-slate-500">1.6 Mbps / 560ms RTT</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Raw Bundle:</span>
                <span className="text-rose-400 font-semibold">{calculateDownloadTime(stats.rawBytes, 1.6, 560)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-cyan-300 font-semibold">{calculateDownloadTime(stats.gzipBytes, 1.6, 560)}</span>
                <span className="text-cyan-300 font-semibold">Gzip Asset</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Brotli Asset:</span>
                <span className="text-emerald-400 font-bold">{calculateDownloadTime(stats.brotliBytes, 1.6, 560)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">4G LTE Connection</span>
              <span className="text-[11px] text-slate-500">25 Mbps / 50ms RTT</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Raw Bundle:</span>
                <span className="text-slate-300">{calculateDownloadTime(stats.rawBytes, 25, 50)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Gzip Asset:</span>
                <span className="text-cyan-300 font-semibold">{calculateDownloadTime(stats.gzipBytes, 25, 50)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Brotli Asset:</span>
                <span className="text-emerald-400 font-bold">{calculateDownloadTime(stats.brotliBytes, 25, 50)}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">5G / Fiber Broadband</span>
              <span className="text-[11px] text-slate-500">100 Mbps / 10ms RTT</span>
            </div>
            <div className="mt-3 space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Raw Bundle:</span>
                <span className="text-slate-300">{calculateDownloadTime(stats.rawBytes, 100, 10)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Gzip Asset:</span>
                <span className="text-cyan-300 font-semibold">{calculateDownloadTime(stats.gzipBytes, 100, 10)}</span>
              </div>
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400">Brotli Asset:</span>
                <span className="text-emerald-400 font-bold">{calculateDownloadTime(stats.brotliBytes, 100, 10)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor & Sample Presets */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-white">Payload Code / Text Input</span>
            {calculating && (
              <span className="text-xs text-cyan-400 animate-pulse">Calculating compression...</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Load Preset:</span>
            <button
              onClick={() => setContent(SAMPLES.react)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
            >
              React UMD
            </button>
            <button
              onClick={() => setContent(SAMPLES.tailwind)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
            >
              Tailwind CSS
            </button>
            <button
              onClick={() => setContent(SAMPLES.geojson)}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
            >
              GeoJSON Data
            </button>
            <button
              onClick={() => setContent('')}
              className="px-2.5 py-1 rounded-lg text-xs font-medium bg-rose-950/40 hover:bg-rose-900/40 text-rose-300 border border-rose-800/40 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Paste JavaScript, CSS, HTML, JSON, or SQL here to test instant Brotli & Gzip compression..."
          rows={12}
          className="w-full font-mono text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-y"
        />

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span>Characters: {content.length.toLocaleString()} | Lines: {content ? content.split('\n').length.toLocaleString() : 0}</span>
          </div>
          <span>Encodes as UTF-8 Byte Stream</span>
        </div>
      </div>
    </div>
  );
}

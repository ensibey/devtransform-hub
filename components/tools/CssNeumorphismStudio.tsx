"use client";

import React, { useState, useMemo } from "react";
import { Copy, Check, Sparkles, RefreshCw, Box, Layers, Sun } from "lucide-react";

type LightDirection = "top-left" | "top-right" | "bottom-left" | "bottom-right";
type ShapeType = "flat" | "concave" | "convex" | "inset";

interface Preset {
  name: string;
  color: string;
  size: number;
  radius: number;
  distance: number;
  blur: number;
  intensity: number;
  direction: LightDirection;
  shape: ShapeType;
}

const PRESETS: Preset[] = [
  {
    name: "Soft Cloud (Default)",
    color: "#e0e5ec",
    size: 200,
    radius: 32,
    distance: 12,
    blur: 24,
    intensity: 15,
    direction: "top-left",
    shape: "flat",
  },
  {
    name: "Dark Onyx",
    color: "#24272c",
    size: 200,
    radius: 28,
    distance: 14,
    blur: 28,
    intensity: 22,
    direction: "top-left",
    shape: "flat",
  },
  {
    name: "Pressed Button",
    color: "#e0e5ec",
    size: 180,
    radius: 24,
    distance: 8,
    blur: 16,
    intensity: 18,
    direction: "top-left",
    shape: "inset",
  },
  {
    name: "Convex Bubble",
    color: "#e2e8f0",
    size: 200,
    radius: 50,
    distance: 15,
    blur: 30,
    intensity: 20,
    direction: "top-left",
    shape: "convex",
  },
  {
    name: "Concave Plate",
    color: "#dce3eb",
    size: 200,
    radius: 36,
    distance: 12,
    blur: 24,
    intensity: 16,
    direction: "top-left",
    shape: "concave",
  },
  {
    name: "Soft Lavender",
    color: "#e6e6fa",
    size: 200,
    radius: 40,
    distance: 10,
    blur: 20,
    intensity: 14,
    direction: "top-right",
    shape: "flat",
  },
];

// Helper to convert hex to RGB
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let c = hex.replace("#", "");
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c || "e0e5ec", 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Adjust color brightness
function adjustColor(hex: string, percent: number): string {
  const { r, g, b } = hexToRgb(hex);
  const factor = 1 + percent / 100;
  const newR = Math.min(255, Math.max(0, Math.round(r * factor)));
  const newG = Math.min(255, Math.max(0, Math.round(g * factor)));
  const newB = Math.min(255, Math.max(0, Math.round(b * factor)));
  return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
}

export function CssNeumorphismStudio() {
  const [color, setColor] = useState<string>("#e0e5ec");
  const [size, setSize] = useState<number>(200);
  const [radius, setRadius] = useState<number>(32);
  const [distance, setDistance] = useState<number>(12);
  const [blur, setBlur] = useState<number>(24);
  const [intensity, setIntensity] = useState<number>(15);
  const [direction, setDirection] = useState<LightDirection>("top-left");
  const [shape, setShape] = useState<ShapeType>("flat");
  const [copied, setCopied] = useState<string | null>(null);

  // Compute shadow coordinates based on direction
  const { darkX, darkY, lightX, lightY, angleDeg } = useMemo(() => {
    switch (direction) {
      case "top-left":
        return { darkX: distance, darkY: distance, lightX: -distance, lightY: -distance, angleDeg: 145 };
      case "top-right":
        return { darkX: -distance, darkY: distance, lightX: distance, lightY: -distance, angleDeg: 225 };
      case "bottom-left":
        return { darkX: distance, darkY: -distance, lightX: -distance, lightY: distance, angleDeg: 45 };
      case "bottom-right":
        return { darkX: -distance, darkY: -distance, lightX: distance, lightY: distance, angleDeg: 315 };
    }
  }, [direction, distance]);

  // Dark & light shadow colors
  const darkShadowColor = useMemo(() => {
    const factor = -intensity;
    return adjustColor(color, factor);
  }, [color, intensity]);

  const lightShadowColor = useMemo(() => {
    const factor = intensity;
    return adjustColor(color, factor);
  }, [color, intensity]);

  // Compute CSS background gradient if concave/convex
  const backgroundStyle = useMemo(() => {
    if (shape === "concave") {
      const start = adjustColor(color, -intensity * 0.7);
      const end = adjustColor(color, intensity * 0.7);
      return `linear-gradient(${angleDeg}deg, ${start}, ${end})`;
    }
    if (shape === "convex") {
      const start = adjustColor(color, intensity * 0.7);
      const end = adjustColor(color, -intensity * 0.7);
      return `linear-gradient(${angleDeg}deg, ${start}, ${end})`;
    }
    return color;
  }, [shape, color, intensity, angleDeg]);

  // Box shadow CSS string
  const boxShadowValue = useMemo(() => {
    const insetStr = shape === "inset" ? "inset " : "";
    return `${insetStr}${darkX}px ${darkY}px ${blur}px ${darkShadowColor}, ${insetStr}${lightX}px ${lightY}px ${blur}px ${lightShadowColor}`;
  }, [shape, darkX, darkY, lightX, lightY, blur, darkShadowColor, lightShadowColor]);

  // Complete CSS Code
  const generatedCss = useMemo(() => {
    return `border-radius: ${radius}px;
background: ${backgroundStyle};
box-shadow: ${boxShadowValue};`;
  }, [radius, backgroundStyle, boxShadowValue]);

  // Tailwind style export
  const tailwindSnippet = useMemo(() => {
    return `<div style={{
  width: '${size}px',
  height: '${size}px',
  borderRadius: '${radius}px',
  background: '${backgroundStyle}',
  boxShadow: '${boxShadowValue}'
}} />`;
  }, [size, radius, backgroundStyle, boxShadowValue]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const applyPreset = (p: Preset) => {
    setColor(p.color);
    setSize(p.size);
    setRadius(p.radius);
    setDistance(p.distance);
    setBlur(p.blur);
    setIntensity(p.intensity);
    setDirection(p.direction);
    setShape(p.shape);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Box className="w-6 h-6 text-indigo-400" />
              CSS Neumorphism Studio
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Design sleek Soft UI / Neumorphic components with realistic shadows, concave/convex gradients, and instant CSS export.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset(PRESETS[0])}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Default
            </button>
          </div>
        </div>

        {/* Preset chips */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition flex items-center gap-1.5"
            >
              <span
                className="w-2.5 h-2.5 rounded-full border border-slate-600"
                style={{ backgroundColor: p.color }}
              />
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Color & Size */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-400" />
              Color & Surface Properties
            </h3>

            <div>
              <label className="text-xs text-slate-400 mb-1.5 block">
                Background / Base Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-slate-700 bg-slate-800 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono uppercase"
                  placeholder="#e0e5ec"
                />
              </div>
            </div>

            {/* Shape selection */}
            <div>
              <label className="text-xs text-slate-400 mb-2 block">
                Surface Shape
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["flat", "concave", "convex", "inset"] as ShapeType[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => setShape(s)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg capitalize border transition ${
                      shape === s
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Light Source Direction */}
            <div>
              <label className="text-xs text-slate-400 mb-2 block">
                Light Source Position
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(
                  [
                    { id: "top-left", label: "Top-Left ↖" },
                    { id: "top-right", label: "Top-Right ↗" },
                    { id: "bottom-left", label: "Bottom-Left ↙" },
                    { id: "bottom-right", label: "Bottom-Right ↘" },
                  ] as { id: LightDirection; label: string }[]
                ).map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setDirection(d.id)}
                    className={`py-2 px-2.5 text-xs rounded-lg border text-center transition ${
                      direction === d.id
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300 font-medium"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              Dimensions & Shadow Depth
            </h3>

            {/* Size */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Box Size</span>
                <span className="text-white font-mono">{size}px</span>
              </div>
              <input
                type="range"
                min="100"
                max="320"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Border Radius */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Border Radius</span>
                <span className="text-white font-mono">{radius}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Distance */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Shadow Distance</span>
                <span className="text-white font-mono">{distance}px</span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Blur */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Blur Radius</span>
                <span className="text-white font-mono">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="80"
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Intensity */}
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Intensity / Contrast</span>
                <span className="text-white font-mono">{intensity}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Preview & Code Column */}
        <div className="lg:col-span-6 space-y-5">
          {/* Live Preview Stage */}
          <div
            className="rounded-2xl p-8 flex flex-col items-center justify-center min-h-[380px] border border-slate-700/40 relative overflow-hidden transition-colors"
            style={{ backgroundColor: color }}
          >
            <div
              className="flex items-center justify-center transition-all cursor-pointer select-none"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                borderRadius: `${radius}px`,
                background: backgroundStyle,
                boxShadow: boxShadowValue,
              }}
            >
              <div className="text-center p-4">
                <Box className="w-8 h-8 mx-auto opacity-70 mb-1" style={{ color: adjustColor(color, -intensity * 1.5) }} />
                <span
                  className="text-xs font-semibold tracking-wider uppercase opacity-80"
                  style={{ color: adjustColor(color, -intensity * 1.8) }}
                >
                  Neumorphic
                </span>
              </div>
            </div>

            <div className="absolute bottom-3 right-3 text-[11px] px-2.5 py-1 rounded-md bg-black/30 backdrop-blur-sm text-white/80 font-mono">
              {size}×{size}px • r:{radius}px
            </div>
          </div>

          {/* Generated CSS Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                CSS Stylesheet
              </span>
              <button
                onClick={() => copyToClipboard(generatedCss, "css")}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
              >
                {copied === "css" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === "css" ? "Copied!" : "Copy CSS"}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
              {generatedCss}
            </pre>
          </div>

          {/* Tailwind / React Export */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                React Inline Style
              </span>
              <button
                onClick={() => copyToClipboard(tailwindSnippet, "jsx")}
                className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition flex items-center gap-1.5"
              >
                {copied === "jsx" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied === "jsx" ? "Copied!" : "Copy JSX"}
              </button>
            </div>
            <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed">
              {tailwindSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

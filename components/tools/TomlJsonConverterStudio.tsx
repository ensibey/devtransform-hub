'use client';

import React, { useState, useMemo } from 'react';
import { 
  FileCode, 
  ArrowRightLeft, 
  Copy, 
  Check, 
  Sparkles, 
  RefreshCw, 
  RotateCcw, 
  CheckCircle2 
} from 'lucide-react';

const PRESETS = {
  cargo: `[package]
name = "my-rust-app"
version = "0.1.0"
edition = "2021"
authors = ["DevTransform Team <dev@example.com>"]

[dependencies]
tokio = { version = "1.36", features = ["full"] }
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

[profile.release]
opt-level = 3
lto = true`,
  pyproject: `[project]
name = "data-pipeline"
version = "2.4.0"
description = "High throughput async data collector"
readme = "README.md"
requires-python = ">=3.11"
dependencies = [
    "httpx>=0.27.0",
    "pydantic>=2.6.0",
    "fastapi>=0.110.0"
]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"`,
};

// Client-side lightweight TOML parser
function parseSimpleToml(text: string): Record<string, any> {
  const result: Record<string, any> = {};
  let currentSection = result;
  const lines = text.split('\n');

  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith('#')) continue;

    // Section header: [section] or [section.subsection]
    if (line.startsWith('[') && line.endsWith(']')) {
      const sectionPath = line.slice(1, -1).split('.');
      let target = result;
      for (const part of sectionPath) {
        if (!target[part] || typeof target[part] !== 'object') {
          target[part] = {};
        }
        target = target[part];
      }
      currentSection = target;
      continue;
    }

    // Key-value pair: key = value
    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      let rawVal = line.slice(eqIdx + 1).trim();

      // Inline table e.g. { version = "1.0" }
      if (rawVal.startsWith('{') && rawVal.endsWith('}')) {
        const inner = rawVal.slice(1, -1);
        const obj: Record<string, any> = {};
        inner.split(',').forEach(pair => {
          const pEq = pair.indexOf('=');
          if (pEq !== -1) {
            const pKey = pair.slice(0, pEq).trim();
            const pVal = pair.slice(pEq + 1).trim().replace(/^["']|["']$/g, '');
            obj[pKey] = pVal;
          }
        });
        currentSection[key] = obj;
        continue;
      }

      // Arrays e.g. ["a", "b"]
      if (rawVal.startsWith('[') && rawVal.endsWith(']')) {
        try {
          currentSection[key] = JSON.parse(rawVal);
        } catch {
          currentSection[key] = rawVal.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        }
        continue;
      }

      // Strings
      if ((rawVal.startsWith('"') && rawVal.endsWith('"')) || (rawVal.startsWith("'") && rawVal.endsWith("'"))) {
        currentSection[key] = rawVal.slice(1, -1);
      } else if (rawVal === 'true') {
        currentSection[key] = true;
      } else if (rawVal === 'false') {
        currentSection[key] = false;
      } else if (!isNaN(Number(rawVal))) {
        currentSection[key] = Number(rawVal);
      } else {
        currentSection[key] = rawVal;
      }
    }
  }

  return result;
}

// Convert JSON object to TOML format
function jsonToToml(obj: Record<string, any>, prefix = ''): string {
  let toml = '';
  const sections: Array<{ key: string; val: any }> = [];

  for (const [key, val] of Object.entries(obj)) {
    if (val && typeof val === 'object' && !Array.isArray(val)) {
      sections.push({ key: prefix ? `${prefix}.${key}` : key, val });
    } else if (Array.isArray(val)) {
      toml += `${key} = ${JSON.stringify(val)}\n`;
    } else if (typeof val === 'string') {
      toml += `${key} = "${val}"\n`;
    } else {
      toml += `${key} = ${val}\n`;
    }
  }

  for (const s of sections) {
    toml += `\n[${s.key}]\n`;
    toml += jsonToToml(s.val, s.key);
  }

  return toml.trim();
}

export function TomlJsonConverterStudio() {
  const [direction, setDirection] = useState<'toml2json' | 'json2toml'>('toml2json');
  const [inputContent, setInputContent] = useState<string>(PRESETS.cargo);
  const [copied, setCopied] = useState<boolean>(false);

  const convertedResult = useMemo(() => {
    if (!inputContent.trim()) return { output: '', error: null };

    try {
      if (direction === 'toml2json') {
        const parsed = parseSimpleToml(inputContent);
        return { output: JSON.stringify(parsed, null, 2), error: null };
      } else {
        const parsed = JSON.parse(inputContent);
        return { output: jsonToToml(parsed), error: null };
      }
    } catch (err: any) {
      return { output: '', error: err.message || 'Invalid syntax' };
    }
  }, [inputContent, direction]);

  const handleCopy = () => {
    if (!convertedResult.output) return;
    navigator.clipboard.writeText(convertedResult.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwitchDirection = () => {
    if (convertedResult.output && !convertedResult.error) {
      setInputContent(convertedResult.output);
    }
    setDirection(prev => prev === 'toml2json' ? 'json2toml' : 'toml2json');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <FileCode className="w-3.5 h-3.5" /> Two-Way TOML &lt;&gt; JSON
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Rust Cargo & Python Poetry
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            TOML to JSON & JSON to TOML Converter
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Seamlessly convert configuration files between TOML (Cargo, pyproject) and JSON with structure validation and 1-click copy.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleSwitchDirection}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            <ArrowRightLeft className="w-4 h-4 text-amber-400" />
            <span>Switch Direction</span>
          </button>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition shadow-sm shadow-amber-500/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied' : 'Copy Output'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Input */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Input: {direction === 'toml2json' ? 'TOML Config' : 'JSON Object'}
              </span>

              {direction === 'toml2json' && (
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setInputContent(PRESETS.cargo)}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700"
                  >
                    Cargo.toml
                  </button>
                  <button
                    onClick={() => setInputContent(PRESETS.pyproject)}
                    className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-amber-300 border border-slate-700 hover:bg-slate-700"
                  >
                    pyproject.toml
                  </button>
                </div>
              )}
            </div>

            <textarea
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              rows={16}
              className="w-full font-mono text-xs bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition resize-y leading-relaxed"
              placeholder={direction === 'toml2json' ? '[package]\nname = "demo"' : '{\n  "package": {\n    "name": "demo"\n  }\n}'}
            />
          </div>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col h-full min-h-[460px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Converted: {direction === 'toml2json' ? 'JSON Structure' : 'TOML Output'}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {convertedResult.output ? `${convertedResult.output.split('\n').length} lines` : ''}
              </span>
            </div>

            {convertedResult.error ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                Error: {convertedResult.error}
              </div>
            ) : (
              <pre className="flex-1 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-amber-300 whitespace-pre-wrap overflow-y-auto leading-relaxed">
                {convertedResult.output || '// Converted code will appear here'}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

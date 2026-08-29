'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRightLeft,
  Settings2,
  GitCompare,
  Code2,
  Sparkles,
  Share2,
  Copy,
  Check,
  Zap,
  SlidersHorizontal,
} from 'lucide-react';
import { FormatId, FORMATS, FORMAT_LIST } from '@/lib/matrix';
import { CodeMirrorEditor, CodeErrorDiagnostic } from './CodeMirrorEditor';
import { EditorHeader } from './EditorHeader';
import { EditorFooter } from './EditorFooter';
import { DiffViewer } from './DiffViewer';
import { workerClient, ConversionResponse } from '@/workers/workerClient';
import { decodeWorkspaceState, encodeWorkspaceState, generateShareUrl } from '@/lib/lz';
import { QuickTypeOptions } from '@/lib/quicktypeRunner';

export interface ConverterWorkspaceProps {
  initialFrom: FormatId;
  initialTo: FormatId;
  initialInput?: string;
}

export function ConverterWorkspace({
  initialFrom,
  initialTo,
  initialInput,
}: ConverterWorkspaceProps) {
  const router = useRouter();
  const [from, setFrom] = useState<FormatId>(initialFrom);
  const [to, setTo] = useState<FormatId>(initialTo);

  // Input code state
  const [inputCode, setInputCode] = useState<string>(
    initialInput !== undefined ? initialInput : FORMATS[initialFrom]?.sample || ''
  );

  // Output code state
  const [outputCode, setOutputCode] = useState<string>('');
  const [isConverting, setIsConverting] = useState(false);
  const [conversionDuration, setConversionDuration] = useState(0);
  const [errorDiagnostic, setErrorDiagnostic] = useState<CodeErrorDiagnostic | null>(null);

  // View states
  const [viewMode, setViewMode] = useState<'split' | 'diff'>('split');
  const [showOptions, setShowOptions] = useState(false);

  // Converter Options
  const [typeName, setTypeName] = useState('UserProfile');
  const [pythonTarget, setPythonTarget] = useState<'pydantic' | 'dataclass'>('pydantic');
  const [tsPreferInterfaces, setTsPreferInterfaces] = useState(true);
  const [goPackage, setGoPackage] = useState('main');
  const [rustVisibility, setRustVisibility] = useState<'pub' | 'crate' | 'private'>('pub');

  // Share state
  const [shareCopied, setShareCopied] = useState(false);

  // Debounce ref
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load state from URL hash if present on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash;
    if (hash && (hash.includes('data=') || hash.length > 5)) {
      const decoded = decodeWorkspaceState(hash);
      if (decoded) {
        if (decoded.from && FORMATS[decoded.from]) setFrom(decoded.from);
        if (decoded.to && FORMATS[decoded.to]) setTo(decoded.to);
        if (decoded.input) setInputCode(decoded.input);
        if (decoded.options?.typeName) setTypeName(decoded.options.typeName);
      }
    }
  }, []);

  // Update hash when input or formats change (throttled)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const timer = setTimeout(() => {
      const encoded = encodeWorkspaceState({
        input: inputCode,
        from,
        to,
        options: { typeName, pythonTarget, tsPreferInterfaces, goPackage, rustVisibility },
      });
      if (encoded) {
        window.history.replaceState(null, '', `#data=${encoded}`);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [inputCode, from, to, typeName, pythonTarget, tsPreferInterfaces, goPackage, rustVisibility]);

  // Execute Conversion
  const triggerConversion = useCallback(
    async (codeToConvert: string, sourceFormat: FormatId, targetFormat: FormatId) => {
      if (!codeToConvert.trim()) {
        setOutputCode('');
        setErrorDiagnostic(null);
        setConversionDuration(0);
        return;
      }

      setIsConverting(true);
      setErrorDiagnostic(null);

      const options: QuickTypeOptions = {
        typeName,
        pythonTarget,
        tsPreferInterfaces,
        goPackage,
        rustVisibility,
      };

      try {
        const response: ConversionResponse = await workerClient.convert({
          input: codeToConvert,
          from: sourceFormat,
          to: targetFormat,
          options,
        });

        if (response.error) {
          setErrorDiagnostic({
            message: response.error,
            line: response.errorLine,
            column: response.errorColumn,
          });
          // Do not wipe output if previous output exists, or set informative message
        } else {
          setOutputCode(response.output);
          setErrorDiagnostic(null);
          setConversionDuration(response.durationMs);
        }
      } catch (err: any) {
        setErrorDiagnostic({
          message: err?.message || 'Conversion failed.',
        });
      } finally {
        setIsConverting(false);
      }
    },
    [typeName, pythonTarget, tsPreferInterfaces, goPackage, rustVisibility]
  );

  // Trigger conversion on input / format / options changes with debounce
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      triggerConversion(inputCode, from, to);
    }, 150);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [inputCode, from, to, triggerConversion]);

  // Swap Formats
  const handleSwap = () => {
    const nextFrom = to;
    const nextTo = from;
    const nextInput = outputCode || FORMATS[nextFrom]?.sample || '';
    setFrom(nextFrom);
    setTo(nextTo);
    setInputCode(nextInput);
    router.push(`/${nextFrom}-to-${nextTo}/`);
  };

  const handleFromChange = (newFrom: FormatId) => {
    if (newFrom === to) {
      handleSwap();
      return;
    }
    setFrom(newFrom);
    setInputCode(FORMATS[newFrom]?.sample || '');
    router.push(`/${newFrom}-to-${to}/`);
  };

  const handleToChange = (newTo: FormatId) => {
    if (newTo === from) {
      handleSwap();
      return;
    }
    setTo(newTo);
    router.push(`/${from}-to-${newTo}/`);
  };

  const handleFormatInput = async () => {
    try {
      const res = await workerClient.format({
        input: inputCode,
        format: from,
      });
      if (res.output) {
        setInputCode(res.output);
      }
    } catch (err) {
      console.error('Format failed:', err);
    }
  };

  const handleShare = async () => {
    const url = generateShareUrl({
      input: inputCode,
      from,
      to,
      options: { typeName, pythonTarget },
    });
    try {
      await navigator.clipboard.writeText(url);
      setShareCopied(true);
      setTimeout(() => setShareCopied(false), 2000);
    } catch (e) {
      console.error('Copy link failed:', e);
    }
  };

  return (
    <div className="w-full flex flex-col space-y-3">
      {/* Top Workspace Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-surface-100 border border-border">
        {/* Left: Quick Formats & Swap */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1.5 text-xs">
            <span className="font-semibold text-zinc-200 uppercase px-2 py-1 bg-surface-50 rounded border border-border">
              {FORMATS[from]?.shortName}
            </span>
            <button
              type="button"
              onClick={handleSwap}
              className="p-1.5 rounded-lg bg-surface hover:bg-zinc-800 text-zinc-300 hover:text-brand-emerald border border-border transition-all hover:scale-105"
              title="Swap input and output formats"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-zinc-200 uppercase px-2 py-1 bg-surface-50 rounded border border-border">
              {FORMATS[to]?.shortName}
            </span>
          </div>

          {/* Quick options popover button */}
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className={`flex items-center space-x-1 px-2.5 py-1 text-xs rounded-lg border transition-all ${
              showOptions
                ? 'bg-brand-emerald/10 border-brand-emerald/40 text-brand-emerald'
                : 'bg-surface hover:bg-zinc-800 border-border text-zinc-300'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Options</span>
          </button>
        </div>

        {/* Right: View Mode & Share */}
        <div className="flex items-center space-x-2">
          {/* Diff View toggle */}
          <div className="flex items-center rounded-lg bg-surface border border-border p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'split'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split Editor</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('diff')}
              className={`flex items-center space-x-1 px-2.5 py-1 rounded-md font-medium transition-colors ${
                viewMode === 'diff'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <GitCompare className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Diff Mode</span>
            </button>
          </div>

          {/* Share Link Button */}
          <button
            type="button"
            onClick={handleShare}
            className="flex items-center space-x-1.5 px-3 py-1 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-all"
            title="Share this code privately via URL hash"
          >
            {shareCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-brand-emerald" />
                <span className="text-brand-emerald">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-zinc-300" />
                <span>Share</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Extended Target Format Options Drawer */}
      {showOptions && (
        <div className="p-3 bg-surface-100 border border-border rounded-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs animate-in fade-in duration-150">
          <div>
            <label className="block text-zinc-400 font-mono text-[11px] mb-1">
              ROOT TYPE NAME
            </label>
            <input
              type="text"
              value={typeName}
              onChange={(e) => setTypeName(e.target.value)}
              placeholder="UserProfile"
              className="w-full bg-surface border border-border rounded px-2 py-1 text-zinc-200 font-mono text-xs focus:ring-1 focus:ring-brand-emerald focus:outline-none"
            />
          </div>

          {to === 'python' && (
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">
                PYTHON TARGET
              </label>
              <select
                value={pythonTarget}
                onChange={(e) => setPythonTarget(e.target.value as any)}
                className="w-full bg-surface border border-border rounded px-2 py-1 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald focus:outline-none cursor-pointer"
              >
                <option value="pydantic">Pydantic BaseModel</option>
                <option value="dataclass">Standard @dataclass</option>
              </select>
            </div>
          )}

          {to === 'typescript' && (
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">
                TYPESCRIPT STYLE
              </label>
              <select
                value={tsPreferInterfaces ? 'interface' : 'type'}
                onChange={(e) => setTsPreferInterfaces(e.target.value === 'interface')}
                className="w-full bg-surface border border-border rounded px-2 py-1 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald focus:outline-none cursor-pointer"
              >
                <option value="interface">Interfaces (Recommended)</option>
                <option value="type">Type Aliases</option>
              </select>
            </div>
          )}

          {to === 'go' && (
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">GO PACKAGE</label>
              <input
                type="text"
                value={goPackage}
                onChange={(e) => setGoPackage(e.target.value)}
                placeholder="main"
                className="w-full bg-surface border border-border rounded px-2 py-1 text-zinc-200 font-mono text-xs focus:ring-1 focus:ring-brand-emerald focus:outline-none"
              />
            </div>
          )}

          {to === 'rust' && (
            <div>
              <label className="block text-zinc-400 font-mono text-[11px] mb-1">VISIBILITY</label>
              <select
                value={rustVisibility}
                onChange={(e) => setRustVisibility(e.target.value as any)}
                className="w-full bg-surface border border-border rounded px-2 py-1 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald focus:outline-none cursor-pointer"
              >
                <option value="pub">pub (Public)</option>
                <option value="crate">pub(crate)</option>
                <option value="private">private</option>
              </select>
            </div>
          )}
        </div>
      )}

      {/* Editor Split / Diff Layout */}
      {viewMode === 'diff' ? (
        <div className="h-[600px] w-full">
          <DiffViewer
            originalText={inputCode}
            modifiedText={outputCode}
            originalTitle={`${FORMATS[from]?.name} (Input)`}
            modifiedTitle={`${FORMATS[to]?.name} (Output)`}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 min-h-[560px]">
          {/* Source Editor Panel */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-border bg-surface shadow-2xl">
            <EditorHeader
              format={from}
              onFormatChange={handleFromChange}
              onLoadSample={() => setInputCode(FORMATS[from]?.sample || '')}
              onClear={() => setInputCode('')}
              onFormat={handleFormatInput}
              onFileUpload={(content) => setInputCode(content)}
              value={inputCode}
            />
            <div className="flex-1 min-h-[420px] bg-oled">
              <CodeMirrorEditor
                value={inputCode}
                onChange={setInputCode}
                format={from}
                errorDiagnostic={errorDiagnostic}
                onFormatShortcut={handleFormatInput}
              />
            </div>
            <EditorFooter
              value={inputCode}
              error={errorDiagnostic?.message}
              isProcessing={isConverting}
              showTiming={false}
            />
          </div>

          {/* Target Output Editor Panel */}
          <div className="flex flex-col rounded-xl overflow-hidden border border-border bg-surface shadow-2xl">
            <EditorHeader
              format={to}
              onFormatChange={handleToChange}
              readOnly={true}
              value={outputCode}
            />
            <div className="flex-1 min-h-[420px] bg-oled">
              <CodeMirrorEditor
                value={outputCode}
                format={to}
                readOnly={true}
              />
            </div>
            <EditorFooter
              value={outputCode}
              durationMs={conversionDuration}
              isProcessing={isConverting}
              showTiming={true}
            />
          </div>
        </div>
      )}
    </div>
  );
}

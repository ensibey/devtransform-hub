'use client';

import React, { useState, useEffect } from 'react';
import convert from 'xml-js';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileCode, ArrowLeftRight, Sparkles, Download, AlertCircle } from 'lucide-react';

const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<note id="501">
  <to>DevTransform Team</to>
  <from>DevOps Lead</from>
  <heading>Deployment Reminder</heading>
  <body>Zero logs, 100% client-side privacy, sub-50ms edge response.</body>
  <tags>
    <tag>seo</tag>
    <tag>performance</tag>
  </tags>
</note>`;

export function XmlJsonConverterPro() {
  const [mode, setMode] = useState<'xmlToJson' | 'jsonToXml'>('xmlToJson');
  const [inputXml, setInputXml] = useState(DEFAULT_XML);
  const [inputJson, setInputJson] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [indentSpaces, setIndentSpaces] = useState(2);

  useEffect(() => {
    try {
      setError(null);
      if (mode === 'xmlToJson') {
        if (!inputXml.trim()) {
          setOutput('');
          return;
        }
        const jsonStr = convert.xml2json(inputXml, {
          compact: true,
          spaces: indentSpaces,
          ignoreComment: true,
        });
        setOutput(jsonStr);
      } else {
        if (!inputJson.trim()) {
          setOutput('');
          return;
        }
        // Validate JSON first
        const parsed = JSON.parse(inputJson);
        const xmlStr = convert.json2xml(JSON.stringify(parsed), {
          compact: true,
          spaces: indentSpaces,
          ignoreComment: true,
        });
        setOutput(xmlStr);
      }
    } catch (err: any) {
      setError(err.message || 'Conversion error. Check your input syntax.');
      setOutput('');
    }
  }, [mode, inputXml, inputJson, indentSpaces]);

  const handleSwap = () => {
    if (mode === 'xmlToJson') {
      setInputJson(output || '{}');
      setMode('jsonToXml');
    } else {
      setInputXml(output || '<root></root>');
      setMode('xmlToJson');
    }
  };

  const handleDownload = () => {
    const ext = mode === 'xmlToJson' ? 'json' : 'xml';
    const mime = mode === 'xmlToJson' ? 'application/json' : 'application/xml';
    const blob = new Blob([output], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `converted.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Direction and Config Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-2">
          <FileCode className="w-5 h-5 text-brand-emerald" />
          <span className="text-sm font-semibold text-white">
            {mode === 'xmlToJson' ? 'XML Payload ➔ JSON Structure' : 'JSON Structure ➔ XML Payload'}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 text-xs font-mono text-zinc-400">
            <span>Indent:</span>
            {[2, 4].map((sp) => (
              <button
                key={sp}
                type="button"
                onClick={() => setIndentSpaces(sp)}
                className={`px-2 py-0.5 rounded text-xs ${
                  indentSpaces === sp
                    ? 'bg-brand-emerald text-black font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {sp} spaces
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-mono transition-colors"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-brand-emerald" />
            <span>Swap</span>
          </button>
        </div>
      </div>

      {/* Conversion Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {mode === 'xmlToJson' ? 'XML Source' : 'JSON Source'}
            </span>
            <button
              type="button"
              onClick={() => {
                if (mode === 'xmlToJson') setInputXml(DEFAULT_XML);
              }}
              className="text-[11px] font-mono text-brand-emerald hover:underline"
            >
              Reset Sample
            </button>
          </div>
          <textarea
            value={mode === 'xmlToJson' ? inputXml : inputJson}
            onChange={(e) => (mode === 'xmlToJson' ? setInputXml(e.target.value) : setInputJson(e.target.value))}
            rows={15}
            placeholder={mode === 'xmlToJson' ? 'Paste XML here...' : 'Paste JSON here...'}
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-zinc-200 font-mono text-xs focus:border-brand-emerald focus:outline-none resize-none leading-relaxed"
          />
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-brand-emerald uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {mode === 'xmlToJson' ? 'Converted JSON Object' : 'Converted XML Document'}
            </span>
            <div className="flex items-center space-x-2">
              {output && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="flex items-center space-x-1 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-mono transition-colors"
                >
                  <Download className="w-3 h-3" />
                  <span>.{mode === 'xmlToJson' ? 'json' : 'xml'}</span>
                </button>
              )}
              {output && <CopyButton text={output} />}
            </div>
          </div>
          <textarea
            readOnly
            value={output}
            rows={15}
            placeholder="Converted output will appear here..."
            className="w-full flex-1 p-3 bg-black/60 border border-zinc-800 rounded-xl text-emerald-400 font-mono text-xs focus:outline-none resize-none leading-relaxed select-all"
          />
        </div>
      </div>
    </div>
  );
}

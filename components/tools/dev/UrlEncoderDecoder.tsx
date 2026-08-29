'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Link2, ArrowRightLeft, Trash2, CheckCircle2, Layers } from 'lucide-react';

export function UrlEncoderDecoder() {
  const [inputText, setInputText] = useState('https://example.com/search?q=developer tools&category=web development&lang=tr');
  const [encodedText, setEncodedText] = useState('');
  const [decodedText, setDecodedText] = useState('');
  const [queryParams, setQueryParams] = useState<{ key: string; value: string }[]>([]);

  useEffect(() => {
    try {
      setEncodedText(encodeURIComponent(inputText));
    } catch {
      setEncodedText('Error encoding text');
    }

    try {
      setDecodedText(decodeURIComponent(inputText));
    } catch {
      setDecodedText('Error decoding text');
    }

    // Extract query params if URL
    try {
      if (inputText.includes('?')) {
        const queryStr = inputText.split('?')[1];
        const searchParams = new URLSearchParams(queryStr);
        const list: { key: string; value: string }[] = [];
        searchParams.forEach((value, key) => {
          list.push({ key, value });
        });
        setQueryParams(list);
      } else {
        setQueryParams([]);
      }
    } catch {
      setQueryParams([]);
    }
  }, [inputText]);

  return (
    <div className="space-y-6">
      {/* Main Input Textarea */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
          <span className="flex items-center space-x-1.5 text-brand-emerald font-bold">
            <Link2 className="w-4 h-4" />
            <span>Input URL or Text:</span>
          </span>
          <button
            type="button"
            onClick={() => setInputText('')}
            className="text-zinc-500 hover:text-rose-400 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={4}
          className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
          placeholder="Paste URL or string to encode/decode..."
        />
      </div>

      {/* 2-Column Outputs (Encoded vs Decoded) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Encoded Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Encoded (URI Component):</span>
              <CopyButton text={encodedText} />
            </div>
            <textarea
              readOnly
              value={encodedText}
              rows={5}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Decoded Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-sky-400">
              <span className="font-bold">Decoded (Plain String):</span>
              <CopyButton text={decodedText} />
            </div>
            <textarea
              readOnly
              value={decodedText}
              rows={5}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>

      {/* Query Parameters Extractor Table */}
      {queryParams.length > 0 && (
        <div className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-3">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-white uppercase">
            <Layers className="w-4 h-4 text-brand-emerald" />
            <span>Extracted URL Query Parameters ({queryParams.length})</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400 bg-zinc-950">
                  <th className="p-2.5">Parameter Key</th>
                  <th className="p-2.5">Decoded Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {queryParams.map((param, idx) => (
                  <tr key={idx} className="hover:bg-zinc-800/30">
                    <td className="p-2.5 font-bold text-sky-400">{param.key}</td>
                    <td className="p-2.5 text-zinc-200">{param.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

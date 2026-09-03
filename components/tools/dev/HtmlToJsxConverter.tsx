'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Code2, ArrowRightLeft, Sparkles, Check, Download } from 'lucide-react';

function convertStyleToJsx(styleStr: string): string {
  const rules = styleStr.split(';').filter((r) => r.trim().length > 0);
  const objRules: string[] = [];

  for (const rule of rules) {
    const [prop, val] = rule.split(':').map((s) => s.trim());
    if (!prop || !val) continue;

    // Convert kebab-case to camelCase
    const camelProp = prop.replace(/-([a-z])/g, (_, g) => g.toUpperCase());
    objRules.push(`${camelProp}: "${val}"`);
  }

  return `{{ ${objRules.join(', ')} }}`;
}

function convertHtmlToJsx(html: string): string {
  if (!html.trim()) return '';

  let jsx = html;

  // 1. Convert standard attribute replacements
  jsx = jsx.replace(/\bclass=(["'])/gi, 'className=$1');
  jsx = jsx.replace(/\bfor=(["'])/gi, 'htmlFor=$1');
  jsx = jsx.replace(/\btabindex=(["'])/gi, 'tabIndex=$1');
  jsx = jsx.replace(/\bautocomplete=(["'])/gi, 'autoComplete=$1');
  jsx = jsx.replace(/\bautofocus=(["'])/gi, 'autoFocus=$1');
  jsx = jsx.replace(/\breadonly=(["'])/gi, 'readOnly=$1');
  jsx = jsx.replace(/\bcolspan=(["'])/gi, 'colSpan=$1');
  jsx = jsx.replace(/\browspan=(["'])/gi, 'rowSpan=$1');

  // 2. Convert inline style string to style={{ ... }}
  jsx = jsx.replace(/style=["']([^"']+)["']/gi, (_, styleStr) => {
    return `style=${convertStyleToJsx(styleStr)}`;
  });

  // 3. Ensure self-closing tags
  const voidTags = ['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr'];
  voidTags.forEach((tag) => {
    const regex = new RegExp(`<(${tag})((?:\\s+[^>]*?)?)(?<!\\/)>`, 'gi');
    jsx = jsx.replace(regex, '<$1$2 />');
  });

  // 4. Convert HTML comments <!-- ... --> to JSX comments {/* ... */}
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

  return jsx;
}

export function HtmlToJsxConverter() {
  const [htmlInput, setHtmlInput] = useState(
    `<div class="card shadow-lg" style="background-color: #18181b; padding: 20px; border-radius: 12px;">\n  <!-- User Profile Header -->\n  <img src="/avatar.png" alt="Avatar" class="rounded-full">\n  <h2 class="text-xl font-bold">Alex Morgan</h2>\n  <label for="username">Username</label>\n  <input type="text" id="username" class="form-input" placeholder="alex2026">\n  <br>\n  <button class="btn btn-primary" onclick="submit()">Save</button>\n</div>`
  );

  const jsxOutput = useMemo(() => {
    return convertHtmlToJsx(htmlInput);
  }, [htmlInput]);

  return (
    <div className="space-y-6">
      {/* 2-Column Inputs & JSX Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* HTML Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Code2 className="w-4 h-4 text-orange-400" />
              <span>HTML Source Code:</span>
            </span>
          </div>

          <textarea
            value={htmlInput}
            onChange={(e) => setHtmlInput(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-orange-400 resize-none leading-relaxed"
            placeholder="<div class='container'>...</div>"
          />
        </div>

        {/* JSX Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">React JSX Output:</span>
              <CopyButton text={jsxOutput} />
            </div>

            <textarea
              readOnly
              value={jsxOutput}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

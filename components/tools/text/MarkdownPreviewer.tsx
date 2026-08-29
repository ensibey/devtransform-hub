'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { FileCode, Eye, Sparkles } from 'lucide-react';

export function MarkdownPreviewer() {
  const [markdown, setMarkdown] = useState(`# Welcome to Markdown Previewer

This is a **high-performance client-side** previewer.

## Features
- Headings & Typography
- **Bold**, *Italic*, and \`inline code\`
- Blockquotes & Ordered Lists

> "Privacy-first zero-server software that lives inside your browser."

### Code Block
\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  isOnline: boolean;
}
\`\`\`

1. First Item
2. Second Item
3. Third Item
`);

  // Basic lightweight Markdown to HTML converter
  const renderMarkdown = (md: string) => {
    let html = md
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-6 mb-3 border-b border-border pb-1">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-white mt-2 mb-4">$1</h1>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-brand-emerald pl-4 italic text-zinc-400 my-3 bg-surface-200/50 py-2 rounded-r">$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="text-brand-emerald font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic text-zinc-300">$1</em>')
      .replace(/`([^`]+)`/gim, '<code class="bg-surface-300 text-emerald-300 px-1.5 py-0.5 rounded font-mono text-xs border border-border">$1</code>')
      .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre class="bg-oled p-4 rounded-xl border border-border my-3 overflow-x-auto font-mono text-xs text-zinc-200 leading-relaxed">$2</pre>')
      .replace(/^\d+\.\s(.*$)/gim, '<li class="list-decimal ml-6 text-zinc-300 my-1">$1</li>')
      .replace(/^\-\s(.*$)/gim, '<li class="list-disc ml-6 text-zinc-300 my-1">$1</li>')
      .replace(/\n\n/gim, '<p class="my-2 leading-relaxed text-zinc-300"></p>');

    return html;
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[520px]">
        {/* Markdown Source */}
        <div className="flex flex-col rounded-xl border border-border bg-surface-200 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-surface-300 border-b border-border text-xs">
            <span className="font-mono text-zinc-300 flex items-center space-x-1.5">
              <FileCode className="w-3.5 h-3.5 text-brand-emerald" />
              <span>Markdown Source</span>
            </span>
            <CopyButton text={markdown} />
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Write Markdown here..."
            className="flex-1 w-full p-4 bg-oled text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Live HTML Preview */}
        <div className="flex flex-col rounded-xl border border-border bg-surface-200 overflow-hidden">
          <div className="flex items-center justify-between px-3 py-2 bg-surface-300 border-b border-border text-xs">
            <span className="font-mono text-zinc-300 flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Live Rendered HTML</span>
            </span>
          </div>
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
            className="flex-1 w-full p-6 bg-surface-100 overflow-y-auto text-sm text-zinc-200 prose prose-invert max-w-none"
          />
        </div>
      </div>
    </div>
  );
}

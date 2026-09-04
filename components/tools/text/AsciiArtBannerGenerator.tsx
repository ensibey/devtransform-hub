'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Terminal, Sparkles, Type, FileCode, Check } from 'lucide-react';

// Character font glyph definitions
const BLOCK_FONT: Record<string, string[]> = {
  A: ['  ████   ', ' ██  ██  ', '████████ ', '██    ██ ', '██    ██ '],
  B: ['██████   ', '██   ██  ', '██████   ', '██   ██  ', '██████   '],
  C: [' ██████  ', '██       ', '██       ', '██       ', ' ██████  '],
  D: ['██████   ', '██   ██  ', '██    ██ ', '██   ██  ', '██████   '],
  E: ['████████ ', '██       ', '██████   ', '██       ', '████████ '],
  F: ['████████ ', '██       ', '██████   ', '██       ', '██       '],
  G: [' ██████  ', '██       ', '██   ███ ', '██    ██ ', ' ██████  '],
  H: ['██    ██ ', '██    ██ ', '████████ ', '██    ██ ', '██    ██ '],
  I: ['████████ ', '   ██    ', '   ██    ', '   ██    ', '████████ '],
  J: ['   █████ ', '      ██ ', '      ██ ', '██    ██ ', ' ██████  '],
  K: ['██    ██ ', '██   ██  ', '██████   ', '██   ██  ', '██    ██ '],
  L: ['██       ', '██       ', '██       ', '██       ', '████████ '],
  M: ['██    ██ ', '███  ███ ', '██ ██ ██ ', '██    ██ ', '██    ██ '],
  N: ['██    ██ ', '███   ██ ', '██ █  ██ ', '██  █ ██ ', '██   ███ '],
  O: [' ██████  ', '██    ██ ', '██    ██ ', '██    ██ ', ' ██████  '],
  P: ['██████   ', '██   ██  ', '██████   ', '██       ', '██       '],
  Q: [' ██████  ', '██    ██ ', '██    ██ ', '██  █ ██ ', ' ████ ██ '],
  R: ['██████   ', '██   ██  ', '██████   ', '██   ██  ', '██    ██ '],
  S: [' ██████  ', '██       ', ' ██████  ', '      ██ ', '██████   '],
  T: ['████████ ', '   ██    ', '   ██    ', '   ██    ', '   ██    '],
  U: ['██    ██ ', '██    ██ ', '██    ██ ', '██    ██ ', ' ██████  '],
  V: ['██    ██ ', '██    ██ ', '██    ██ ', ' ██  ██  ', '  ████   '],
  W: ['██    ██ ', '██    ██ ', '██ ██ ██ ', '███  ███ ', '██    ██ '],
  X: ['██    ██ ', ' ██  ██  ', '  ████   ', ' ██  ██  ', '██    ██ '],
  Y: ['██    ██ ', ' ██  ██  ', '  ████   ', '   ██    ', '   ██    '],
  Z: ['████████ ', '     ██  ', '   ██    ', ' ██      ', '████████ '],
  ' ': ['    ', '    ', '    ', '    ', '    '],
  '0': [' ██████  ', '██   ███ ', '██ █  ██ ', '███   ██ ', ' ██████  '],
  '1': ['   ██    ', ' ████    ', '   ██    ', '   ██    ', ' ██████  '],
  '2': [' ██████  ', '      ██ ', ' ██████  ', '██       ', '████████ '],
  '3': ['███████  ', '     ██  ', '  █████  ', '     ██  ', '███████  '],
  '4': ['██    ██ ', '██    ██ ', '████████ ', '      ██ ', '      ██ '],
  '5': ['████████ ', '██       ', '███████  ', '      ██ ', '███████  '],
  '6': [' ██████  ', '██       ', '███████  ', '██    ██ ', ' ██████  '],
  '7': ['████████ ', '     ██  ', '    ██   ', '   ██    ', '  ██     '],
  '8': [' ██████  ', '██    ██ ', ' ██████  ', '██    ██ ', ' ██████  '],
  '9': [' ██████  ', '██    ██ ', ' ███████ ', '      ██ ', ' ██████  '],
  '-': ['         ', '         ', '████████ ', '         ', '         '],
  '_': ['         ', '         ', '         ', '         ', '████████ '],
  '!': ['   ██    ', '   ██    ', '   ██    ', '         ', '   ██    '],
  '.': ['         ', '         ', '         ', '   ██    ', '   ██    '],
};

const SLANT_FONT: Record<string, string[]> = {
  A: ['   ____ ', '  / __ \\', ' / /_/ /', '/ /_/ / ', '\\____/  '],
  B: ['   ____ ', '  / __ )', ' / __  |', '/ /_/ / ', '/_____/ '],
  C: ['   ______', '  / ____/', ' / /     ', '/ /___   ', '\\____/   '],
  D: ['   ____  ', '  / __ \\ ', ' / / / / ', '/ /_/ /  ', '/_____/  '],
  E: ['   _____', '  / ____/', ' / __/   ', '/ /___   ', '/_____/  '],
  F: ['   _____', '  / ____/', ' / __/   ', '/ /      ', '/_/      '],
  G: ['   ______', '  / ____/', ' / / __  ', '/ /_/ /  ', '\\____/   '],
  H: ['   __  __', '  / / / /', ' / /_/ / ', '/ __  /  ', '/_/ /_/  '],
  I: ['   ____', '  /  _/', '  / /  ', '_/ /   ', '/___/  '],
  J: ['       __', '      / /', ' __  / / ', '/ /_/ /  ', '\\____/   '],
  K: ['   __ __', '  / //_/', ' / ,<   ', '/ /| |  ', '/_/ |_| '],
  L: ['   __   ', '  / /   ', ' / /    ', '/ /___  ', '/_____/ '],
  M: ['   __  ___', '  /  |/  /', ' / /|_/ / ', '/ /  / /  ', '/_/  /_/  '],
  N: ['   _   __', '  / | / /', ' /  |/ / ', '/ /|  /  ', '/_/ |_/   '],
  O: ['   ____  ', '  / __ \\ ', ' / / / / ', '/ /_/ /  ', '\\____/   '],
  P: ['   ____ ', '  / __ \\', ' / /_/ /', '/ ____/ ', '/_/     '],
  Q: ['   ____  ', '  / __ \\ ', ' / / / / ', '/ /_/ /_ ', '\\___\\_\\_\\'],
  R: ['   ____ ', '  / __ \\', ' / /_/ /', '/ _, _/ ', '/_/ |_| '],
  S: ['   _____', '  / ___/', '  \\__ \\ ', ' ___/ / ', '/____/  '],
  T: ['  ______', ' /_  __/', '  / /   ', ' / /    ', '/_/     '],
  U: ['   __  __', '  / / / /', ' / / / / ', '/ /_/ /  ', '\\____/   '],
  V: ['  _    __', ' | |  / /', ' | | / / ', ' | |/ /  ', ' |___/   '],
  W: [' _       __', '| |     / /', '| | /| / / ', '| |/ |/ /  ', '|__/|__/   '],
  X: ['   _  __', '  | |/ /', '  |   / ', ' /   |  ', '/_/|_|  '],
  Y: ['   __  __', '  / / / /', '  \\_  _/ ', '   / /   ', '  /_/    '],
  Z: ['  ____ ', ' /_  / ', '  / /_ ', ' /___/ ', '/____/ '],
  ' ': ['    ', '    ', '    ', '    ', '    '],
  '0': ['   ____ ', '  / __ \\', ' / / / /', '/ /_/ / ', '\\____/  '],
  '1': ['    ___ ', '   <  / ', '   / /  ', '  / /   ', ' /_/    '],
  '2': ['   ___  ', '  |__ \\ ', '  __/ / ', ' / __/  ', '/____/  '],
  '3': ['   _____', '  |__  /', '   /_ < ', ' ___/ / ', '/____/  '],
  '4': ['   __ __', '  / // /', ' / // /_', '/__  __/', '  /_/   '],
  '5': ['   _____', '  / ____/', ' /___ \\ ', '____/ / ', '/_____/ '],
  '6': ['   _____', '  / ___/', ' / __ \\ ', '/ /_/ / ', '\\____/  '],
  '7': ['  _____ ', ' /__  / ', '   / /  ', '  / /   ', ' /_/    '],
  '8': ['   ____ ', '  ( __ )', ' / __  |', '/ /_/ / ', '\\____/  '],
  '9': ['   ____ ', '  / __ \\', ' / /_/ /', ' \\__, / ', '/____/  '],
  '-': ['      ', '      ', ' _____', '/____/', '      '],
  '_': ['      ', '      ', '      ', ' _____', '/____/'],
  '!': ['   _ ', '  | |', '  | |', '  |_|', '  (_)'],
  '.': ['   ', '   ', '   ', ' _ ', '(_)'],
};

export function AsciiArtBannerGenerator() {
  const [inputText, setInputText] = useState('DEVTRANSFORM');
  const [font, setFont] = useState<'block' | 'slant'>('block');
  const [wrapper, setWrapper] = useState<'none' | 'js' | 'python' | 'html'>('none');

  const asciiArt = useMemo(() => {
    const text = inputText.toUpperCase().slice(0, 24);
    if (!text) return '';

    const fontDict = font === 'block' ? BLOCK_FONT : SLANT_FONT;
    const lines: string[] = ['', '', '', '', ''];

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const glyph = fontDict[char] || fontDict[' '];
      for (let row = 0; row < 5; row++) {
        lines[row] += glyph[row] || '    ';
      }
    }

    const rawBanner = lines.join('\n');

    switch (wrapper) {
      case 'js':
        return `/**\n${lines.map((l) => ` * ${l}`).join('\n')}\n */`;
      case 'python':
        return lines.map((l) => `# ${l}`).join('\n');
      case 'html':
        return `<!--\n${lines.map((l) => `  ${l}`).join('\n')}\n-->`;
      default:
        return rawBanner;
    }
  }, [inputText, font, wrapper]);

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Font Style:</span>
            <button
              onClick={() => setFont('block')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                font === 'block' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Block (Solid)
            </button>
            <button
              onClick={() => setFont('slant')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                font === 'slant' ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Slant (Gothic)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Comment Wrapper:</span>
            <select
              value={wrapper}
              onChange={(e) => setWrapper(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-300 focus:outline-none"
            >
              <option value="none">Raw Text Only</option>
              <option value="js">JavaScript / C++ (/* ... */)</option>
              <option value="python">Python / Bash (# ...)</option>
              <option value="html">HTML / XML (&lt;!-- ... --&gt;)</option>
            </select>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-1.5 pt-2">
          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
            <Type className="w-4 h-4 text-indigo-400" />
            Banner Text (up to 24 characters)
          </label>
          <input
            type="text"
            maxLength={24}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full px-4 py-2.5 font-mono text-sm rounded-xl bg-zinc-950 border border-zinc-700 text-zinc-200 focus:outline-none focus:border-indigo-500"
            placeholder="Type banner text..."
          />
        </div>
      </div>

      {/* Output Display */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            Terminal ASCII Preview
          </span>
          <CopyButton text={asciiArt} label="Copy ASCII Banner" />
        </div>

        <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-x-auto">
          <pre className="font-mono text-[11px] sm:text-xs leading-none text-emerald-400 selection:bg-emerald-800 selection:text-white">
            {asciiArt || 'Type text above to generate ASCII art...'}
          </pre>
        </div>
      </div>
    </div>
  );
}

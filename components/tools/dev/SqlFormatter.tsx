'use client';

import React, { useState } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Database, Sparkles, Trash2, ArrowRightLeft, Check } from 'lucide-react';

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'ORDER BY', 'GROUP BY', 'HAVING',
  'JOIN', 'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'CROSS JOIN',
  'ON', 'AS', 'IN', 'BETWEEN', 'LIKE', 'IS NULL', 'IS NOT NULL',
  'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE',
  'ALTER TABLE', 'ADD CONSTRAINT', 'PRIMARY KEY', 'FOREIGN KEY', 'REFERENCES',
  'UNION', 'UNION ALL', 'LIMIT', 'OFFSET', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END'
];

export function SqlFormatter() {
  const [sqlInput, setSqlInput] = useState(
    `SELECT u.id, u.name, u.email, o.order_id, o.total_amount FROM users u LEFT JOIN orders o ON u.id = o.user_id WHERE u.status = 'ACTIVE' AND o.total_amount > 100 GROUP BY u.id, u.name, u.email, o.order_id, o.total_amount ORDER BY o.total_amount DESC LIMIT 50;`
  );
  const [indentSize, setIndentSize] = useState(2);
  const [uppercaseKeywords, setUppercaseKeywords] = useState(true);

  const formatSql = (sql: string) => {
    if (!sql.trim()) return '';

    let formatted = sql;

    // Normalize whitespace
    formatted = formatted.replace(/\s+/g, ' ').trim();

    // Keyword uppercasing & newline insertion
    const newlineKeywords = [
      'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'GROUP BY', 'HAVING', 'ORDER BY',
      'INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL JOIN', 'JOIN', 'LIMIT', 'OFFSET',
      'VALUES', 'SET'
    ];

    newlineKeywords.forEach((kw) => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, (match) => {
        const replacement = uppercaseKeywords ? match.toUpperCase() : match;
        return `\n${replacement}`;
      });
    });

    // Indent lines
    const indent = ' '.repeat(indentSize);
    const lines = formatted.split('\n').filter((l) => l.trim().length > 0);
    const indentedLines = lines.map((line, idx) => {
      const trimmed = line.trim();
      if (idx === 0 || trimmed.startsWith('SELECT') || trimmed.startsWith('FROM') || trimmed.startsWith('WHERE') || trimmed.startsWith('ORDER BY') || trimmed.startsWith('GROUP BY')) {
        return trimmed;
      }
      return `${indent}${trimmed}`;
    });

    return indentedLines.join('\n').trim();
  };

  const formattedOutput = formatSql(sqlInput);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono text-zinc-400">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercaseKeywords}
              onChange={(e) => setUppercaseKeywords(e.target.checked)}
              className="rounded bg-zinc-950 border-zinc-800 text-brand-emerald focus:ring-0"
            />
            <span>UPPERCASE SQL Keywords</span>
          </label>

          <div className="flex items-center space-x-2">
            <span>Indent:</span>
            <select
              value={indentSize}
              onChange={(e) => setIndentSize(parseInt(e.target.value))}
              className="bg-zinc-950 border border-zinc-800 rounded px-2 py-0.5 text-white focus:outline-none"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setSqlInput('')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-400 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* 2-Column Inputs & Formatted Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Raw Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Database className="w-4 h-4 text-brand-emerald" />
              <span>Raw SQL Query:</span>
            </span>
            <span className="text-zinc-500 text-[11px]">Input</span>
          </div>
          <textarea
            value={sqlInput}
            onChange={(e) => setSqlInput(e.target.value)}
            rows={12}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Paste your unformatted SQL query here..."
          />
        </div>

        {/* Formatted Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Beautified & Formatted SQL:</span>
              <CopyButton text={formattedOutput} />
            </div>
            <textarea
              readOnly
              value={formattedOutput}
              rows={12}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { Terminal, Copy, Check, Sparkles, RefreshCw, Code2, ArrowRight } from 'lucide-react';

const SAMPLE_CURL = `curl -X POST https://api.example.com/v1/users \\
  -H "Authorization: Bearer sk_live_94827104928" \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json" \\
  -d '{"name": "Jane Doe", "email": "jane@example.com", "role": "engineer"}'`;

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string | null;
}

// Client-side curl parser
function parseCurl(curlText: string): ParsedCurl {
  // Normalize multi-line backslashes
  const clean = curlText.replace(/\\\r?\n/g, ' ').trim();
  
  // Extract URL
  const urlMatch = clean.match(/(?:https?:\/\/[^\s"']+)/);
  const url = urlMatch ? urlMatch[0] : 'https://api.example.com/endpoint';

  // Extract Method
  let method = 'GET';
  const methodMatch = clean.match(/-X\s+([A-Z]+)/i) || clean.match(/--request\s+([A-Z]+)/i);
  if (methodMatch) {
    method = methodMatch[1].toUpperCase();
  } else if (clean.includes('-d ') || clean.includes('--data') || clean.includes('--data-raw')) {
    method = 'POST';
  }

  // Extract Headers
  const headers: Record<string, string> = {};
  const headerRegex = /(?:-H|--header)\s+["']([^"']+)["']/g;
  let hMatch: RegExpExecArray | null;
  while ((hMatch = headerRegex.exec(clean)) !== null) {
    const colonIdx = hMatch[1].indexOf(':');
    if (colonIdx > -1) {
      const key = hMatch[1].slice(0, colonIdx).trim();
      const val = hMatch[1].slice(colonIdx + 1).trim();
      headers[key] = val;
    }
  }

  // Extract Body
  let body: string | null = null;
  const bodyMatch = clean.match(/(?:-d|--data|--data-raw)\s+["']([^"']+)["']/s) || clean.match(/(?:-d|--data|--data-raw)\s+(\{[^\}]+\})/s);
  if (bodyMatch) {
    body = bodyMatch[1];
  }

  return { url, method, headers, body };
}

export function CurlToFetchAxiosConverter() {
  const [curlInput, setCurlInput] = useState<string>(SAMPLE_CURL);
  const [activeTab, setActiveTab] = useState<'fetch' | 'axios' | 'python'>('fetch');
  const [copied, setCopied] = useState<string | null>(null);

  const parsed = useMemo(() => parseCurl(curlInput), [curlInput]);

  // Generate fetch snippet
  const fetchSnippet = useMemo(() => {
    const opts: string[] = [`  method: '${parsed.method}',`];
    
    if (Object.keys(parsed.headers).length > 0) {
      const hLines = Object.entries(parsed.headers)
        .map(([k, v]) => `    '${k}': '${v}',`)
        .join('\n');
      opts.push(`  headers: {\n${hLines}\n  },`);
    }

    if (parsed.body && parsed.method !== 'GET') {
      try {
        const formatted = JSON.stringify(JSON.parse(parsed.body), null, 2);
        opts.push(`  body: JSON.stringify(${formatted.replace(/\n/g, '\n  ')}),`);
      } catch {
        opts.push(`  body: JSON.stringify(${JSON.stringify(parsed.body)}),`);
      }
    }

    return `const response = await fetch('${parsed.url}', {
${opts.join('\n')}
});

const data = await response.json();
console.log(data);`;
  }, [parsed]);

  // Generate axios snippet
  const axiosSnippet = useMemo(() => {
    let bodyCode = 'null';
    if (parsed.body && parsed.method !== 'GET') {
      try {
        bodyCode = JSON.stringify(JSON.parse(parsed.body), null, 2);
      } catch {
        bodyCode = JSON.stringify(parsed.body);
      }
    }

    const hasHeaders = Object.keys(parsed.headers).length > 0;
    const headerStr = hasHeaders
      ? `{\n    headers: {\n` +
        Object.entries(parsed.headers)
          .map(([k, v]) => `      '${k}': '${v}',`)
          .join('\n') +
        `\n    }\n  }`
      : '{}';

    if (parsed.method === 'GET') {
      return `import axios from 'axios';

const response = await axios.get('${parsed.url}'${hasHeaders ? `, ${headerStr}` : ''});
console.log(response.data);`;
    }

    if (parsed.method === 'POST') {
      return `import axios from 'axios';

const payload = ${bodyCode};
const response = await axios.post('${parsed.url}', payload${hasHeaders ? `, ${headerStr}` : ''});
console.log(response.data);`;
    }

    return `import axios from 'axios';

const response = await axios({
  method: '${parsed.method.toLowerCase()}',
  url: '${parsed.url}',
  data: ${bodyCode},
  headers: ${JSON.stringify(parsed.headers, null, 4)}
});
console.log(response.data);`;
  }, [parsed]);

  // Generate Python requests snippet
  const pythonSnippet = useMemo(() => {
    const lines = [`import requests\n`];
    lines.push(`url = "${parsed.url}"\n`);

    if (Object.keys(parsed.headers).length > 0) {
      lines.push(`headers = ${JSON.stringify(parsed.headers, null, 4)}\n`);
    } else {
      lines.push(`headers = {}\n`);
    }

    let payloadStr = '';
    if (parsed.body && parsed.method !== 'GET') {
      try {
        const jsonParsed = JSON.parse(parsed.body);
        payloadStr = `payload = ${JSON.stringify(jsonParsed, null, 4)}\n`;
        lines.push(payloadStr);
        lines.push(`response = requests.${parsed.method.toLowerCase()}(url, headers=headers, json=payload)`);
      } catch {
        payloadStr = `payload = ${JSON.stringify(parsed.body)}\n`;
        lines.push(payloadStr);
        lines.push(`response = requests.${parsed.method.toLowerCase()}(url, headers=headers, data=payload)`);
      }
    } else {
      lines.push(`response = requests.${parsed.method.toLowerCase()}(url, headers=headers)`);
    }

    lines.push(`\nprint(response.status_code)`);
    lines.push(`print(response.json())`);

    return lines.join('');
  }, [parsed]);

  const activeSnippet = useMemo(() => {
    switch (activeTab) {
      case 'fetch':
        return fetchSnippet;
      case 'axios':
        return axiosSnippet;
      case 'python':
        return pythonSnippet;
    }
  }, [activeTab, fetchSnippet, axiosSnippet, pythonSnippet]);

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(activeTab);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Terminal className="w-6 h-6 text-indigo-400" />
              cURL to Fetch & Axios Converter
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Convert cURL terminal commands into ready-to-run JavaScript Fetch API, Axios, and Python Requests code.
            </p>
          </div>

          <button
            onClick={() => setCurlInput(SAMPLE_CURL)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset Sample
          </button>
        </div>
      </div>

      {/* Grid: cURL input and converted output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* cURL Input */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-indigo-400" />
              Source cURL Command
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
              {parsed.method}
            </span>
          </div>

          <textarea
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            rows={16}
            placeholder="Paste curl command here..."
            className="w-full flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed resize-y"
          />

          <div className="text-[11px] text-slate-500">
            Target: <code className="text-slate-400">{parsed.url}</code>
          </div>
        </div>

        {/* Output Tabs & Code */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('fetch')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                  activeTab === 'fetch'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Fetch API
              </button>
              <button
                onClick={() => setActiveTab('axios')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                  activeTab === 'axios'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Axios
              </button>
              <button
                onClick={() => setActiveTab('python')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                  activeTab === 'python'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Python Requests
              </button>
            </div>

            <button
              onClick={() => copyCode(activeSnippet)}
              className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : `Copy ${activeTab}`}
            </button>
          </div>

          <pre className="flex-1 p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
            {activeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
}

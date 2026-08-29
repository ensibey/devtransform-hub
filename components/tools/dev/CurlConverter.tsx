'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { ArrowRight, Code2, Sparkles, Terminal, Trash2 } from 'lucide-react';

type TargetLang = 'js-fetch' | 'js-axios' | 'python-requests' | 'go-http' | 'rust-reqwest' | 'node-fetch';

interface ParsedCurl {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
  auth?: string;
}

function parseCurl(curlCommand: string): ParsedCurl {
  const result: ParsedCurl = {
    url: '',
    method: 'GET',
    headers: {},
  };

  const clean = curlCommand.replace(/\\\r?\n/g, ' ').trim();
  if (!clean.startsWith('curl')) {
    result.url = clean;
    return result;
  }

  // Extract Method
  const methodMatch = clean.match(/(?:-X|--request)\s+([A-Z]+)/i);
  if (methodMatch) {
    result.method = methodMatch[1].toUpperCase();
  }

  // Extract URL
  const urlMatch = clean.match(/(?:'|")?(https?:\/\/[^\s'"]+)(?:'|")?/i);
  if (urlMatch) {
    result.url = urlMatch[1];
  } else {
    const rawUrlMatch = clean.match(/curl\s+(?:-[^\s]+\s+)*['"]?([^'"\s]+)/i);
    if (rawUrlMatch && rawUrlMatch[1].startsWith('http')) {
      result.url = rawUrlMatch[1];
    }
  }

  // Extract Headers
  const headerRegex = /(?:-H|--header)\s+['"]([^'"]+)['"]/g;
  let headerMatch;
  while ((headerMatch = headerRegex.exec(clean)) !== null) {
    const parts = headerMatch[1].split(':');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const val = parts.slice(1).join(':').trim();
      result.headers[key] = val;
    }
  }

  // Extract Data
  const dataMatch = clean.match(/(?:-d|--data|--data-raw|--data-binary)\s+['"]([\s\S]*?)['"](?:\s+-[A-Za-z]|$)/);
  if (dataMatch) {
    result.data = dataMatch[1];
    if (result.method === 'GET') {
      result.method = 'POST';
    }
  }

  return result;
}

function generateCode(parsed: ParsedCurl, lang: TargetLang): string {
  const url = parsed.url || 'https://api.example.com/v1/data';
  const method = parsed.method || 'GET';
  const hasHeaders = Object.keys(parsed.headers).length > 0;
  const hasData = !!parsed.data;

  switch (lang) {
    case 'js-fetch': {
      const options: any = { method };
      if (hasHeaders) options.headers = parsed.headers;
      if (hasData) {
        try {
          options.body = JSON.parse(parsed.data!);
        } catch {
          options.body = parsed.data;
        }
      }

      return `// JavaScript (Fetch API)
const response = await fetch("${url}", {
  method: "${method}",${
        hasHeaders
          ? `\n  headers: ${JSON.stringify(parsed.headers, null, 4).replace(/\n/g, '\n  ')},`
          : ''
      }${hasData ? `\n  body: JSON.stringify(${JSON.stringify(parsed.data)}),` : ''}
});

const data = await response.json();
console.log(data);`;
    }

    case 'js-axios': {
      return `// JavaScript (Axios)
import axios from 'axios';

const response = await axios({
  method: '${method.toLowerCase()}',
  url: '${url}',${
        hasHeaders
          ? `\n  headers: ${JSON.stringify(parsed.headers, null, 4).replace(/\n/g, '\n  ')},`
          : ''
      }${hasData ? `\n  data: ${parsed.data},` : ''}
});

console.log(response.data);`;
    }

    case 'python-requests': {
      let pyHeaders = '';
      if (hasHeaders) {
        pyHeaders = `\nheaders = ${JSON.stringify(parsed.headers, null, 4)}\n`;
      }
      let pyData = '';
      if (hasData) {
        pyData = `\npayload = ${parsed.data}\n`;
      }

      return `# Python (Requests)
import requests
${pyHeaders}${pyData}
response = requests.${method.toLowerCase()}(
    "${url}",${hasHeaders ? '\n    headers=headers,' : ''}${
        hasData ? '\n    json=payload,' : ''
      }
)

print(response.status_code)
print(response.json())`;
    }

    case 'go-http': {
      return `// Go (net/http)
package main

import (
	"fmt"
	"io"
	"net/http"${hasData ? '\n\t"strings"' : ''}
)

func main() {
	client := &http.Client{}
	${
    hasData
      ? `req, err := http.NewRequest("${method}", "${url}", strings.NewReader(\`${parsed.data}\`))`
      : `req, err := http.NewRequest("${method}", "${url}", nil)`
  }
	if err != nil {
		panic(err)
	}

${Object.entries(parsed.headers)
  .map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`)
  .join('\n')}

	resp, err := client.Do(req)
	if err != nil {
		panic(err)
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}`;
    }

    case 'rust-reqwest': {
      return `// Rust (reqwest async)
use reqwest::Client;
use std::error::Error;

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let client = Client::new();
    let response = client
        .${method.toLowerCase()}("${url}")${
        Object.entries(parsed.headers)
          .map(([k, v]) => `\n        .header("${k}", "${v}")`)
          .join('')
      }${hasData ? `\n        .body(r#"${parsed.data}"#)` : ''}
        .send()
        .await?;

    let body = response.text().await?;
    println!("{}", body);
    Ok(())
}`;
    }

    case 'node-fetch': {
      return `// Node.js
const http = require('https');

const options = {
  method: '${method}',
  headers: ${JSON.stringify(parsed.headers, null, 2).replace(/\n/g, '\n  ')}
};

const req = http.request('${url}', options, (res) => {
  let chunks = [];
  res.on('data', (d) => chunks.push(d));
  res.on('end', () => console.log(Buffer.concat(chunks).toString()));
});

${hasData ? `req.write(JSON.stringify(${JSON.stringify(parsed.data)}));\n` : ''}req.end();`;
    }

    default:
      return '';
  }
}

export function CurlConverter() {
  const [curlInput, setCurlInput] = useState(`curl -X POST https://api.example.com/v1/users \\
  -H "Authorization: Bearer sec_token_123" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "Alice", "role": "Engineer", "active": true}'`);

  const [targetLang, setTargetLang] = useState<TargetLang>('js-fetch');
  const [outputCode, setOutputCode] = useState('');

  useEffect(() => {
    const parsed = parseCurl(curlInput);
    const code = generateCode(parsed, targetLang);
    setOutputCode(code);
  }, [curlInput, targetLang]);

  return (
    <div className="space-y-6">
      {/* Language Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-surface-200 border border-border rounded-xl text-xs">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-brand-emerald" />
          <span className="font-mono text-zinc-300 font-medium">Target Language:</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {(
            [
              { id: 'js-fetch', label: 'JavaScript (Fetch)' },
              { id: 'js-axios', label: 'JavaScript (Axios)' },
              { id: 'python-requests', label: 'Python (Requests)' },
              { id: 'go-http', label: 'Go (net/http)' },
              { id: 'rust-reqwest', label: 'Rust (Reqwest)' },
              { id: 'node-fetch', label: 'Node.js' },
            ] as const
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTargetLang(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                targetLang === item.id
                  ? 'bg-brand-emerald text-black font-bold shadow-md'
                  : 'bg-surface-300 hover:bg-surface-50 text-zinc-300 border border-border'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2-Column Editors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* cURL Input */}
        <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-surface-300 border-b border-border text-xs">
            <span className="font-mono text-zinc-400">cURL Command</span>
            <button
              type="button"
              onClick={() => setCurlInput('')}
              className="text-zinc-500 hover:text-rose-400"
              title="Clear"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <textarea
            value={curlInput}
            onChange={(e) => setCurlInput(e.target.value)}
            placeholder="Paste your curl command here (e.g. curl https://api.github.com/users)..."
            rows={14}
            className="w-full p-4 bg-oled text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Generated Code Output */}
        <div className="rounded-xl border border-border bg-surface-200 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 bg-surface-300 border-b border-border text-xs">
            <span className="font-mono text-brand-emerald">Generated Code ({targetLang})</span>
            <CopyButton text={outputCode} />
          </div>
          <textarea
            readOnly
            value={outputCode}
            rows={14}
            className="w-full p-4 bg-oled text-xs font-mono text-zinc-200 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );
}

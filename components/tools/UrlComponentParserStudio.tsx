'use client';

import React, { useState, useMemo } from 'react';
import {
  Link2,
  Copy,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Code2,
  Globe,
  Terminal,
  RefreshCw,
  Sliders,
  ShieldCheck,
} from 'lucide-react';

interface QueryParam {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

const PRESET_URLS = [
  {
    name: 'REST API Search & Filter',
    url: 'https://api.example.com/v1/search?query=react+developer&category=engineering&page=1&limit=25&sort=desc&include_details=true',
  },
  {
    name: 'E-commerce Campaign (UTM Tracking)',
    url: 'https://store.example.com/products/wireless-headphones?utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale_2026&utm_content=hero_banner&ref=promo99',
  },
  {
    name: 'OAuth 2.0 Authorization Callback',
    url: 'https://auth.provider.com/oauth2/v2/auth?client_id=client_987654&redirect_uri=https%3A%2F%2Fapp.dev%2Fcallback&response_type=code&scope=openid+profile+email&state=xyzSecureState123#access_token_demo',
  },
];

export function UrlComponentParserStudio() {
  const [rawUrl, setRawUrl] = useState<string>(PRESET_URLS[0].url);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Parse URL components safely
  const parsed = useMemo(() => {
    try {
      const urlToParse = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(rawUrl.trim())
        ? rawUrl.trim()
        : `https://${rawUrl.trim()}`;

      const parsedUrl = new URL(urlToParse);
      const params: QueryParam[] = [];
      parsedUrl.searchParams.forEach((value, key) => {
        params.push({
          id: Math.random().toString(36).substring(2, 9),
          key,
          value,
          enabled: true,
        });
      });

      return {
        valid: true,
        protocol: parsedUrl.protocol.replace(':', ''),
        username: parsedUrl.username,
        password: parsedUrl.password,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? '443 (default)' : parsedUrl.protocol === 'http:' ? '80 (default)' : 'N/A'),
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        hash: parsedUrl.hash,
        origin: parsedUrl.origin,
        initialParams: params,
        error: null,
      };
    } catch (err: unknown) {
      return {
        valid: false,
        protocol: '',
        username: '',
        password: '',
        hostname: '',
        port: '',
        pathname: '',
        search: '',
        hash: '',
        origin: '',
        initialParams: [],
        error: (err as Error).message || 'Invalid URL format',
      };
    }
  }, [rawUrl]);

  // Query parameter builder state
  const [queryParams, setQueryParams] = useState<QueryParam[]>(() => parsed.initialParams);

  // Sync queryParams when rawUrl changes externally (e.g. preset clicked)
  React.useEffect(() => {
    if (parsed.valid) {
      setQueryParams(parsed.initialParams);
    }
  }, [rawUrl]);

  // Build reconstructed URL from components
  const reconstructedUrl = useMemo(() => {
    try {
      const urlToParse = /^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(rawUrl.trim())
        ? rawUrl.trim()
        : `https://${rawUrl.trim()}`;
      const urlObj = new URL(urlToParse);

      // Clear existing searchParams and re-populate only enabled ones
      urlObj.search = '';
      queryParams.forEach((p) => {
        if (p.enabled && p.key.trim()) {
          urlObj.searchParams.append(p.key.trim(), p.value);
        }
      });

      return urlObj.toString();
    } catch {
      return rawUrl;
    }
  }, [rawUrl, queryParams]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleToggleParam = (id: string) => {
    setQueryParams((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
  };

  const handleUpdateParamKey = (id: string, newKey: string) => {
    setQueryParams((prev) =>
      prev.map((p) => (p.id === id ? { ...p, key: newKey } : p))
    );
  };

  const handleUpdateParamVal = (id: string, newVal: string) => {
    setQueryParams((prev) =>
      prev.map((p) => (p.id === id ? { ...p, value: newVal } : p))
    );
  };

  const handleDeleteParam = (id: string) => {
    setQueryParams((prev) => prev.filter((p) => p.id !== id));
  };

  const handleAddParam = () => {
    setQueryParams((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        key: '',
        value: '',
        enabled: true,
      },
    ]);
  };

  const curlCommand = `curl -X GET "${reconstructedUrl}" \\
  -H "Accept: application/json" \\
  -H "User-Agent: Mozilla/5.0 (DevTransform Studio)"`;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-500" />
              URL Component Inspector & Query Parameter Studio
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Deconstruct, inspect, and manipulate web URLs and query parameters in real time. 100% client-side privacy.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            Zero Server Uploads
          </div>
        </div>

        {/* Preset quick buttons */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Presets:</span>
          {PRESET_URLS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => setRawUrl(preset.url)}
              className="px-2.5 py-1 text-xs rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input URL Bar */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>Target URL to Inspect:</span>
          <span className="text-xs text-slate-500">Supports HTTP, HTTPS, ws, ftp & custom schemes</span>
        </label>
        <div className="relative">
          <input
            type="text"
            value={rawUrl}
            onChange={(e) => setRawUrl(e.target.value)}
            placeholder="https://example.com/api/v1/resource?filter=active#section"
            className="w-full font-mono text-sm px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 shadow-sm"
          />
          {rawUrl && (
            <button
              onClick={() => setRawUrl('')}
              className="absolute right-3 top-3 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Clear input"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {parsed.valid ? (
        <div className="space-y-6">
          {/* Visual URL Breakdown Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 font-medium block">Protocol</span>
              <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400 break-all">
                {parsed.protocol || '—'}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 font-medium block">Hostname / Host</span>
              <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200 break-all">
                {parsed.hostname || '—'}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 font-medium block">Port</span>
              <span className="font-mono text-sm font-semibold text-slate-800 dark:text-slate-200">
                {parsed.port}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 font-medium block">Origin</span>
              <span className="font-mono text-xs font-semibold text-indigo-600 dark:text-indigo-400 break-all">
                {parsed.origin || '—'}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 font-medium block">Pathname</span>
              <span className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300 break-all">
                {parsed.pathname || '/'}
              </span>
            </div>
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <span className="text-xs text-slate-500 font-medium block">Hash / Fragment</span>
              <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 break-all">
                {parsed.hash || 'none'}
              </span>
            </div>
          </div>

          {/* Interactive Query Parameter Editor */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-500" />
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  Query Parameters ({queryParams.filter((p) => p.enabled).length} active / {queryParams.length} total)
                </h3>
              </div>
              <button
                onClick={handleAddParam}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 dark:hover:bg-blue-900/50 text-blue-600 dark:text-blue-400 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Parameter
              </button>
            </div>

            {queryParams.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                No query parameters found in this URL. Click &quot;Add Parameter&quot; to append one!
              </div>
            ) : (
              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {queryParams.map((param) => (
                  <div
                    key={param.id}
                    className={`p-3 flex items-center gap-3 transition-colors ${
                      param.enabled ? 'bg-transparent' : 'opacity-40 bg-slate-50 dark:bg-slate-950'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={param.enabled}
                      onChange={() => handleToggleParam(param.id)}
                      title={param.enabled ? 'Disable parameter' : 'Enable parameter'}
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={param.key}
                        onChange={(e) => handleUpdateParamKey(param.id, e.target.value)}
                        placeholder="Key (e.g. page)"
                        className="font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500"
                      />
                      <input
                        type="text"
                        value={param.value}
                        onChange={(e) => handleUpdateParamVal(param.id, e.target.value)}
                        placeholder="Value (e.g. 1)"
                        className="font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => handleDeleteParam(param.id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Delete parameter"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reconstructed URL Display */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-blue-500" />
                Updated & Normalized URL:
              </span>
              <button
                onClick={() => copyToClipboard(reconstructedUrl, 'reconstructed')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                {copiedKey === 'reconstructed' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy URL
                  </>
                )}
              </button>
            </div>
            <div className="p-3 bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 font-mono text-xs break-all text-slate-900 dark:text-slate-100 select-all">
              {reconstructedUrl}
            </div>
          </div>

          {/* cURL Command Export */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 p-4 text-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Ready cURL Command:
              </span>
              <button
                onClick={() => copyToClipboard(curlCommand, 'curl')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
              >
                {copiedKey === 'curl' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy cURL
                  </>
                )}
              </button>
            </div>
            <pre className="p-3 bg-slate-900 rounded-lg font-mono text-xs overflow-x-auto text-emerald-400">
              <code>{curlCommand}</code>
            </pre>
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 text-sm">
          {parsed.error}
        </div>
      )}
    </div>
  );
}

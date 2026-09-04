'use client';

import React, { useState, useMemo } from 'react';
import { Globe, Search, Copy, Check, Sparkles, RefreshCw, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';

interface HttpStatusDetail {
  code: number;
  phrase: string;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  summary: string;
  rfc: string;
  cacheable: boolean;
  retryable: boolean;
  solution: string;
}

const HTTP_STATUS_LIST: HttpStatusDetail[] = [
  { code: 200, phrase: 'OK', category: '2xx', summary: 'Standard response for successful HTTP requests.', rfc: 'RFC 9110 §15.3.1', cacheable: true, retryable: false, solution: 'Request succeeded. Return the expected resource or payload.' },
  { code: 201, phrase: 'Created', category: '2xx', summary: 'Request fulfilled and a new resource has been created.', rfc: 'RFC 9110 §15.3.2', cacheable: false, retryable: false, solution: 'Include a Location header pointing to the newly created resource.' },
  { code: 204, phrase: 'No Content', category: '2xx', summary: 'Server successfully processed the request and returns no body.', rfc: 'RFC 9110 §15.3.5', cacheable: true, retryable: false, solution: 'Common for DELETE or PUT requests when no response body is needed.' },
  { code: 301, phrase: 'Moved Permanently', category: '3xx', summary: 'The target resource has been permanently assigned a new URI.', rfc: 'RFC 9110 §15.4.2', cacheable: true, retryable: false, solution: 'Clients and search engine crawlers should update old links to the Location URI.' },
  { code: 302, phrase: 'Found (Temporary Redirect)', category: '3xx', summary: 'Target resource resides temporarily under a different URI.', rfc: 'RFC 9110 §15.4.3', cacheable: false, retryable: false, solution: 'Ensure search engines retain the current URI for future requests.' },
  { code: 304, phrase: 'Not Modified', category: '3xx', summary: 'Cached version of resource is still valid (conditional GET).', rfc: 'RFC 9110 §15.4.5', cacheable: true, retryable: false, solution: 'Save bandwidth by omitting response body when ETag or If-Modified-Since matches.' },
  { code: 400, phrase: 'Bad Request', category: '4xx', summary: 'The server cannot process the request due to malformed syntax.', rfc: 'RFC 9110 §15.5.1', cacheable: false, retryable: false, solution: 'Check JSON payload syntax, missing query parameters, or invalid header formatting.' },
  { code: 401, phrase: 'Unauthorized', category: '4xx', summary: 'Request lacks valid authentication credentials for the resource.', rfc: 'RFC 9110 §15.5.2', cacheable: false, retryable: true, solution: 'Provide a valid Authorization Bearer token or API key in request headers.' },
  { code: 403, phrase: 'Forbidden', category: '4xx', summary: 'Server understands the request but refuses to authorize it.', rfc: 'RFC 9110 §15.5.4', cacheable: false, retryable: false, solution: 'User is authenticated but lacks required role or permissions for this endpoint.' },
  { code: 404, phrase: 'Not Found', category: '4xx', summary: 'Server cannot find the requested resource or endpoint path.', rfc: 'RFC 9110 §15.5.5', cacheable: true, retryable: false, solution: 'Verify URL routing, path parameters, and check if resource was deleted.' },
  { code: 405, phrase: 'Method Not Allowed', category: '4xx', summary: 'HTTP method used (GET/POST/PUT) is not supported by endpoint.', rfc: 'RFC 9110 §15.5.6', cacheable: false, retryable: false, solution: 'Inspect Allow response header to see allowed methods (e.g. POST, GET).' },
  { code: 409, phrase: 'Conflict', category: '4xx', summary: 'Request conflicts with current state of target resource.', rfc: 'RFC 9110 §15.5.10', cacheable: false, retryable: true, solution: 'Common for duplicate unique email/username registrations or optimistic lock collisions.' },
  { code: 422, phrase: 'Unprocessable Entity', category: '4xx', summary: 'Server understands content type but request data has semantic validation errors.', rfc: 'RFC 9110 §15.5.21', cacheable: false, retryable: false, solution: 'Check field schema validation errors (e.g. password too short, invalid date format).' },
  { code: 429, phrase: 'Too Many Requests', category: '4xx', summary: 'User has sent too many requests in a given amount of time (rate limit).', rfc: 'RFC 6585 §4', cacheable: false, retryable: true, solution: 'Inspect Retry-After response header and implement exponential backoff.' },
  { code: 500, phrase: 'Internal Server Error', category: '5xx', summary: 'Server encountered an unexpected condition that prevented it from fulfilling request.', rfc: 'RFC 9110 §15.6.1', cacheable: false, retryable: true, solution: 'Check backend application crash logs, unhandled exception traces, and database connections.' },
  { code: 502, phrase: 'Bad Gateway', category: '5xx', summary: 'Server acting as gateway/proxy received invalid response from upstream server.', rfc: 'RFC 9110 §15.6.3', cacheable: false, retryable: true, solution: 'Verify upstream app server (e.g. Node.js, Gunicorn) is running and listening on expected port.' },
  { code: 503, phrase: 'Service Unavailable', category: '5xx', summary: 'Server is currently unable to handle request due to maintenance or overload.', rfc: 'RFC 9110 §15.6.4', cacheable: false, retryable: true, solution: 'Implement health check alerts, auto-scaling groups, and check for server maintenance.' },
  { code: 504, phrase: 'Gateway Timeout', category: '5xx', summary: 'Server acting as gateway/proxy did not receive timely response from upstream.', rfc: 'RFC 9110 §15.6.5', cacheable: false, retryable: true, solution: 'Increase Nginx/ALB proxy read timeouts or optimize slow upstream SQL/microservice queries.' },
];

export function HttpStatusCodeInspectorStudio() {
  const [search, setSearch] = useState<string>('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [selectedCode, setSelectedCode] = useState<HttpStatusDetail>(HTTP_STATUS_LIST[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const filteredList = useMemo(() => {
    return HTTP_STATUS_LIST.filter((item) => {
      const matchesSearch =
        item.code.toString().includes(search) ||
        item.phrase.toLowerCase().includes(search.toLowerCase()) ||
        item.summary.toLowerCase().includes(search.toLowerCase());
      const matchesCat = selectedCat === 'all' || item.category === selectedCat;
      return matchesSearch && matchesCat;
    });
  }, [search, selectedCat]);

  const copyStatusInfo = () => {
    const text = `HTTP ${selectedCode.code} ${selectedCode.phrase}\nSpecification: ${selectedCode.rfc}\nSummary: ${selectedCode.summary}\nFix: ${selectedCode.solution}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-6 h-6 text-indigo-400" />
              HTTP Status Code Inspector & Diagnostics
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Search and inspect HTTP response codes, RFC specifications, cacheability rules, retry strategies, and fix guidelines.
            </p>
          </div>

          <button
            onClick={() => {
              setSearch('');
              setSelectedCat('all');
              setSelectedCode(HTTP_STATUS_LIST[0]);
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code (e.g. 404, 500, Bad Gateway)..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 overflow-x-auto">
            {['all', '2xx', '3xx', '4xx', '5xx'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCat(cat)}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium transition uppercase ${
                  selectedCat === cat
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Codes' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Codes List Column */}
        <div className="lg:col-span-5 space-y-2 max-h-[520px] overflow-y-auto pr-1">
          {filteredList.map((item) => {
            const isSelected = selectedCode.code === item.code;
            const badgeColor =
              item.category === '2xx'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : item.category === '3xx'
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                : item.category === '4xx'
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20';

            return (
              <button
                key={item.code}
                onClick={() => setSelectedCode(item)}
                className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white'
                    : 'bg-slate-900 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${badgeColor}`}>
                    {item.code}
                  </span>
                  <span className="text-xs font-semibold">{item.phrase}</span>
                </div>
                <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-slate-600'}`} />
              </button>
            );
          })}
        </div>

        {/* Code Details Column */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl font-mono font-black text-indigo-400">{selectedCode.code}</span>
                  <span className="text-xl font-bold text-white">{selectedCode.phrase}</span>
                </div>
                <span className="text-xs text-slate-500 font-mono">{selectedCode.rfc}</span>
              </div>

              <button
                onClick={copyStatusInfo}
                className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Info'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                Summary Description
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">{selectedCode.summary}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Cacheable by CDNs?
                </span>
                <span className={`text-sm font-semibold ${selectedCode.cacheable ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {selectedCode.cacheable ? '✓ Yes (Cacheable)' : '✗ No (Non-cacheable)'}
                </span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold block mb-1">
                  Retry Strategy
                </span>
                <span className={`text-sm font-semibold ${selectedCode.retryable ? 'text-amber-400' : 'text-slate-400'}`}>
                  {selectedCode.retryable ? '↻ Safe to Retry (Backoff)' : '⊘ Do Not Retry blindly'}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-900/50 space-y-1">
              <span className="text-xs text-indigo-300 uppercase tracking-wider font-semibold block">
                Recommended Developer Resolution
              </span>
              <p className="text-xs text-slate-200 leading-relaxed">{selectedCode.solution}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

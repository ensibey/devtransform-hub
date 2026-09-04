'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Smartphone, Copy, Check, Sparkles, RefreshCw, Monitor, Bot, Cpu, Globe, CheckCircle2 } from 'lucide-react';

interface UaPreset {
  name: string;
  ua: string;
}

const PRESETS: UaPreset[] = [
  {
    name: 'MacBook Pro (Chrome 128)',
    ua: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
  },
  {
    name: 'iPhone 15 Pro (Mobile Safari)',
    ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  },
  {
    name: 'Windows 11 (Microsoft Edge)',
    ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0',
  },
  {
    name: 'Google Pixel 8 (Android Chrome)',
    ua: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.103 Mobile Safari/537.36',
  },
  {
    name: 'Googlebot Smartphone (SEO Crawler)',
    ua: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.6533.119 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
  },
  {
    name: 'OpenAI GPTBot (AI Crawler)',
    ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)',
  },
];

interface ParsedUa {
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot / Crawler';
  engine: string;
  isBot: boolean;
}

function parseUserAgent(ua: string): ParsedUa {
  let browser = 'Unknown Browser';
  let browserVersion = '';
  let os = 'Unknown OS';
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' | 'Bot / Crawler' = 'Desktop';
  let engine = 'Unknown';
  let isBot = false;

  // Bot detection
  if (/bot|crawler|spider|scraper|crawling/i.test(ua)) {
    isBot = true;
    deviceType = 'Bot / Crawler';
  }

  // OS detection
  if (/windows nt 10\.0/i.test(ua)) os = 'Windows 10/11';
  else if (/windows nt 6\.3/i.test(ua)) os = 'Windows 8.1';
  else if (/windows nt 6\.1/i.test(ua)) os = 'Windows 7';
  else if (/macintosh|mac os x/i.test(ua)) {
    const vMatch = ua.match(/mac os x (\d+[._\d]+)/i);
    os = vMatch ? `macOS ${vMatch[1].replace(/_/g, '.')}` : 'macOS';
  } else if (/iphone/i.test(ua)) {
    os = 'iOS (iPhone)';
    deviceType = 'Mobile';
  } else if (/ipad/i.test(ua)) {
    os = 'iPadOS (iPad)';
    deviceType = 'Tablet';
  } else if (/android/i.test(ua)) {
    const vMatch = ua.match(/android\s+([0-9.]+)/i);
    os = vMatch ? `Android ${vMatch[1]}` : 'Android';
    deviceType = /mobile/i.test(ua) ? 'Mobile' : 'Tablet';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
  }

  // Engine detection
  if (/applewebkit/i.test(ua)) engine = 'WebKit / Blink';
  else if (/gecko/i.test(ua)) engine = 'Gecko';
  else if (/trident/i.test(ua)) engine = 'Trident';

  // Browser detection
  if (/edg\/([0-9.]+)/i.test(ua)) {
    browser = 'Microsoft Edge';
    browserVersion = RegExp.$1;
  } else if (/opr\/([0-9.]+)/i.test(ua)) {
    browser = 'Opera';
    browserVersion = RegExp.$1;
  } else if (/chrome\/([0-9.]+)/i.test(ua)) {
    browser = 'Google Chrome';
    browserVersion = RegExp.$1;
  } else if (/version\/([0-9.]+).*safari/i.test(ua)) {
    browser = 'Apple Safari';
    browserVersion = RegExp.$1;
  } else if (/firefox\/([0-9.]+)/i.test(ua)) {
    browser = 'Mozilla Firefox';
    browserVersion = RegExp.$1;
  } else if (isBot) {
    if (/googlebot/i.test(ua)) browser = 'Googlebot';
    else if (/gptbot/i.test(ua)) browser = 'GPTBot';
    else browser = 'Web Bot / Crawler';
  }

  return { browser, browserVersion, os, deviceType, engine, isBot };
}

export function UserAgentParserStudio() {
  const [uaInput, setUaInput] = useState<string>(PRESETS[0].ua);
  const [copied, setCopied] = useState<boolean>(false);

  // Load client's own UA on mount
  useEffect(() => {
    if (typeof navigator !== 'undefined' && navigator.userAgent) {
      setUaInput(navigator.userAgent);
    }
  }, []);

  const parsed = useMemo(() => parseUserAgent(uaInput), [uaInput]);

  const copyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(parsed, null, 2));
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
              User-Agent Parser & Device Inspector
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Analyze and parse raw browser User-Agent strings to extract browser version, OS, rendering engine, and crawler bots.
            </p>
          </div>

          <button
            onClick={() => {
              if (typeof navigator !== 'undefined') {
                setUaInput(navigator.userAgent);
              }
            }}
            className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 self-start md:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Use My Browser UA
          </button>
        </div>

        {/* Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Presets:
          </span>
          {PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => setUaInput(p.ua)}
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 hover:text-white transition"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* UA Input Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          User-Agent Header String
        </label>
        <textarea
          value={uaInput}
          onChange={(e) => setUaInput(e.target.value)}
          rows={3}
          placeholder="Mozilla/5.0..."
          className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs text-indigo-300 focus:outline-none focus:border-indigo-500 leading-relaxed"
        />
      </div>

      {/* Parsed Attributes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Browser */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
            Browser
          </span>
          <div className="text-xl font-bold text-white">{parsed.browser}</div>
          {parsed.browserVersion && (
            <div className="text-xs text-indigo-400 font-mono mt-1">v{parsed.browserVersion}</div>
          )}
        </div>

        {/* Operating System */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
            Operating System
          </span>
          <div className="text-xl font-bold text-emerald-400">{parsed.os}</div>
          <div className="text-xs text-slate-500 font-mono mt-1">Engine: {parsed.engine}</div>
        </div>

        {/* Device Type */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block mb-1">
            Device Form Factor
          </span>
          <div className="flex items-center gap-2 mt-1">
            {parsed.deviceType === 'Mobile' ? (
              <Smartphone className="w-5 h-5 text-amber-400" />
            ) : parsed.deviceType === 'Bot / Crawler' ? (
              <Bot className="w-5 h-5 text-rose-400" />
            ) : (
              <Monitor className="w-5 h-5 text-indigo-400" />
            )}
            <span className="text-xl font-bold text-white">{parsed.deviceType}</span>
          </div>
          {parsed.isBot && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded bg-rose-950/60 border border-rose-900/60 text-rose-300 text-[11px] font-semibold">
              Verified Web Crawler
            </span>
          )}
        </div>
      </div>

      {/* JSON Export */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Parsed JSON Payload
          </span>
          <button
            onClick={copyJson}
            className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied' : 'Copy JSON'}
          </button>
        </div>
        <pre className="p-3.5 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-indigo-300 overflow-x-auto whitespace-pre leading-relaxed">
          {JSON.stringify(parsed, null, 2)}
        </pre>
      </div>
    </div>
  );
}

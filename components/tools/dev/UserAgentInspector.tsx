'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Smartphone, Monitor, Globe, Cpu, Check, RefreshCw } from 'lucide-react';

function parseUserAgent(ua: string) {
  const clean = ua.trim();
  if (!clean) return null;

  // Detect Browser
  let browser = 'Unknown Browser';
  let version = '';
  if (clean.includes('Firefox/')) {
    browser = 'Mozilla Firefox';
    version = clean.split('Firefox/')[1]?.split(' ')[0] || '';
  } else if (clean.includes('Edg/')) {
    browser = 'Microsoft Edge';
    version = clean.split('Edg/')[1]?.split(' ')[0] || '';
  } else if (clean.includes('Chrome/')) {
    browser = 'Google Chrome';
    version = clean.split('Chrome/')[1]?.split(' ')[0] || '';
  } else if (clean.includes('Safari/') && !clean.includes('Chrome/')) {
    browser = 'Apple Safari';
    version = clean.split('Version/')[1]?.split(' ')[0] || '';
  }

  // Detect OS
  let os = 'Unknown OS';
  if (clean.includes('Windows NT 10.0')) os = 'Windows 10 / 11';
  else if (clean.includes('Windows NT 6.3')) os = 'Windows 8.1';
  else if (clean.includes('Mac OS X')) os = 'macOS';
  else if (clean.includes('Android')) os = 'Android';
  else if (clean.includes('iPhone') || clean.includes('iPad')) os = 'iOS';
  else if (clean.includes('Linux')) os = 'Linux';

  // Detect Device Type
  let deviceType = 'Desktop / Laptop';
  let isMobile = false;
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(clean)) {
    deviceType = clean.includes('iPad') ? 'Tablet' : 'Mobile Phone';
    isMobile = true;
  }

  // Detect Rendering Engine
  let engine = 'Blink / Chromium';
  if (clean.includes('Gecko/') && clean.includes('Firefox/')) engine = 'Gecko';
  else if (clean.includes('AppleWebKit/') && !clean.includes('Chrome/')) engine = 'WebKit';

  return {
    browser,
    version,
    os,
    deviceType,
    isMobile,
    engine,
  };
}

export function UserAgentInspector() {
  const [userAgentInput, setUserAgentInput] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserAgentInput(navigator.userAgent);
    }
  }, []);

  const parsed = useMemo(() => {
    return parseUserAgent(userAgentInput);
  }, [userAgentInput]);

  return (
    <div className="space-y-6">
      {/* Input Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-zinc-400">
          <span className="text-white font-bold">User-Agent String:</span>
          <button
            type="button"
            onClick={() => setUserAgentInput(navigator.userAgent)}
            className="text-brand-emerald hover:text-white flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Use My Browser User-Agent</span>
          </button>
        </div>

        <textarea
          value={userAgentInput}
          onChange={(e) => setUserAgentInput(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
          placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64)..."
        />
      </div>

      {/* Parsed Hardware & Browser Cards */}
      {parsed && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
          {/* Browser */}
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-brand-emerald/30 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Globe className="w-4 h-4" />
              <span>Browser & Version</span>
            </div>
            <p className="text-sm font-bold text-white">{parsed.browser}</p>
            <p className="text-zinc-500 text-[11px]">v{parsed.version || 'Latest'}</p>
          </div>

          {/* Operating System */}
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-sky-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-sky-400 font-bold">
              <Monitor className="w-4 h-4" />
              <span>Operating System</span>
            </div>
            <p className="text-sm font-bold text-white">{parsed.os}</p>
            <p className="text-zinc-500 text-[11px]">Architecture 64-bit</p>
          </div>

          {/* Device Type */}
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-purple-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-purple-400 font-bold">
              <Smartphone className="w-4 h-4" />
              <span>Device Form Factor</span>
            </div>
            <p className="text-sm font-bold text-white">{parsed.deviceType}</p>
            <p className="text-zinc-500 text-[11px]">{parsed.isMobile ? 'Touch Enabled' : 'Pointer Device'}</p>
          </div>

          {/* Engine */}
          <div className="p-4 rounded-2xl bg-zinc-900/50 border border-amber-500/30 space-y-2">
            <div className="flex items-center space-x-2 text-amber-400 font-bold">
              <Cpu className="w-4 h-4" />
              <span>Rendering Engine</span>
            </div>
            <p className="text-sm font-bold text-white">{parsed.engine}</p>
            <p className="text-zinc-500 text-[11px]">HTML5 / CSS3 / WebGL</p>
          </div>
        </div>
      )}
    </div>
  );
}

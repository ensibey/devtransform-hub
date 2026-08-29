'use client';

import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { CopyButton } from '@/components/shared/CopyButton';
import { Download, QrCode as QrIcon, Sparkles, Wifi, Link2, Type, Mail } from 'lucide-react';
import { downloadBlob } from '@/lib/utils';

export function QrCodeGenerator() {
  const [mode, setMode] = useState<'url' | 'text' | 'wifi' | 'email'>('url');
  const [text, setText] = useState('https://devtransform.pages.dev');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPass, setWifiPass] = useState('');
  const [wifiType, setWifiType] = useState('WPA');
  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [errorCorrection, setErrorCorrection] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getPayload = () => {
    switch (mode) {
      case 'url':
      case 'text':
        return text;
      case 'wifi':
        return `WIFI:S:${wifiSsid};T:${wifiType};P:${wifiPass};;`;
      case 'email':
        return `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}`;
      default:
        return text;
    }
  };

  useEffect(() => {
    const payload = getPayload();
    if (!payload.trim()) {
      setQrDataUrl('');
      return;
    }

    QRCode.toDataURL(payload, {
      width: 400,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor,
      },
      errorCorrectionLevel: errorCorrection,
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR generation error:', err));
  }, [mode, text, wifiSsid, wifiPass, wifiType, emailTo, emailSubject, fgColor, bgColor, errorCorrection]);

  const handleDownloadPng = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `qrcode_${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSvg = async () => {
    const payload = getPayload();
    try {
      const svgString = await QRCode.toString(payload, {
        type: 'svg',
        margin: 2,
        color: {
          dark: fgColor,
          light: bgColor,
        },
        errorCorrectionLevel: errorCorrection,
      });
      const blob = new Blob([svgString], { type: 'image/svg+xml' });
      downloadBlob(blob, `qrcode_${Date.now()}.svg`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Settings & Input */}
      <div className="lg:col-span-7 space-y-4">
        {/* Presets Mode Selector */}
        <div className="flex flex-wrap gap-1 p-1 bg-surface-200 border border-border rounded-xl text-xs">
          <button
            type="button"
            onClick={() => {
              setMode('url');
              setText('https://devtransform.pages.dev');
            }}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'url' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Link2 className="w-3.5 h-3.5" />
            <span>Website URL</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('text')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'text' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>Plain Text</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('wifi')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'wifi' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Wi-Fi Network</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('email')}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg font-medium transition-colors ${
              mode === 'email' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </button>
        </div>

        {/* Input fields based on mode */}
        <div className="space-y-3 p-4 rounded-xl bg-surface-200 border border-border text-xs">
          {mode === 'url' && (
            <div>
              <label className="block text-zinc-400 font-mono mb-1">TARGET URL</label>
              <input
                type="url"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-surface-300 border border-border rounded-lg p-2.5 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
              />
            </div>
          )}

          {mode === 'text' && (
            <div>
              <label className="block text-zinc-400 font-mono mb-1">TEXT CONTENT</label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter any text..."
                rows={4}
                className="w-full bg-surface-300 border border-border rounded-lg p-2.5 text-zinc-100 text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald resize-none"
              />
            </div>
          )}

          {mode === 'wifi' && (
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">NETWORK SSID (NAME)</label>
                <input
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="MyHomeWifi"
                  className="w-full bg-surface-300 border border-border rounded-lg p-2.5 text-zinc-100 text-xs focus:ring-1 focus:ring-brand-emerald"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">PASSWORD</label>
                <input
                  type="text"
                  value={wifiPass}
                  onChange={(e) => setWifiPass(e.target.value)}
                  placeholder="SecretPassword123"
                  className="w-full bg-surface-300 border border-border rounded-lg p-2.5 text-zinc-100 text-xs focus:ring-1 focus:ring-brand-emerald"
                />
              </div>
            </div>
          )}

          {mode === 'email' && (
            <div className="space-y-3">
              <div>
                <label className="block text-zinc-400 font-mono mb-1">RECIPIENT EMAIL</label>
                <input
                  type="email"
                  value={emailTo}
                  onChange={(e) => setEmailTo(e.target.value)}
                  placeholder="contact@company.com"
                  className="w-full bg-surface-300 border border-border rounded-lg p-2.5 text-zinc-100 text-xs focus:ring-1 focus:ring-brand-emerald"
                />
              </div>
              <div>
                <label className="block text-zinc-400 font-mono mb-1">SUBJECT</label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Hello from QR"
                  className="w-full bg-surface-300 border border-border rounded-lg p-2.5 text-zinc-100 text-xs focus:ring-1 focus:ring-brand-emerald"
                />
              </div>
            </div>
          )}
        </div>

        {/* Style Options */}
        <div className="p-4 rounded-xl bg-surface-200 border border-border grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-zinc-400 font-mono mb-1">FOREGROUND</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
              />
              <span className="font-mono text-zinc-300 uppercase">{fgColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-mono mb-1">BACKGROUND</label>
            <div className="flex items-center space-x-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-8 h-8 rounded border border-border cursor-pointer bg-transparent"
              />
              <span className="font-mono text-zinc-300 uppercase">{bgColor}</span>
            </div>
          </div>

          <div>
            <label className="block text-zinc-400 font-mono mb-1">ERROR CORRECTION</label>
            <select
              value={errorCorrection}
              onChange={(e) => setErrorCorrection(e.target.value as any)}
              className="w-full bg-surface-300 border border-border rounded-lg p-1.5 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald"
            >
              <option value="L">L (Low - 7%)</option>
              <option value="M">M (Medium - 15%)</option>
              <option value="Q">Q (Quartile - 25%)</option>
              <option value="H">H (High - 30%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Right QR Preview & Download */}
      <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-surface-200 border border-border space-y-4">
        <div className="p-4 rounded-2xl bg-white shadow-2xl flex items-center justify-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Generated QR Code" className="w-56 h-56 object-contain" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center text-zinc-400 text-xs">
              Enter content to generate
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 w-full max-w-xs">
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={!qrDataUrl}
            className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-emerald text-black font-semibold hover:bg-emerald-400 disabled:opacity-50 transition-all text-xs shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={!qrDataUrl}
            className="flex items-center justify-center space-x-1 px-3 py-2 rounded-xl bg-surface-300 hover:bg-surface-50 text-zinc-200 border border-border disabled:opacity-50 transition-colors text-xs"
          >
            <span>SVG</span>
          </button>
        </div>
      </div>
    </div>
  );
}

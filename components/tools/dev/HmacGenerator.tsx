'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Lock, Shield, Key, RefreshCw, Check } from 'lucide-react';

async function computeHmac(
  message: string,
  secret: string,
  algo: 'SHA-256' | 'SHA-512' | 'SHA-1',
  format: 'hex' | 'base64'
): Promise<string> {
  if (typeof window === 'undefined' || !window.crypto?.subtle || !secret || !message) {
    return '';
  }

  const enc = new TextEncoder();
  const keyData = enc.encode(secret);
  const msgData = enc.encode(message);

  const cryptoKey = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: { name: algo } },
    false,
    ['sign']
  );

  const signature = await window.crypto.subtle.sign('HMAC', cryptoKey, msgData);

  if (format === 'hex') {
    return Array.from(new Uint8Array(signature))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  } else {
    let binary = '';
    const bytes = new Uint8Array(signature);
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }
}

export function HmacGenerator() {
  const [secret, setSecret] = useState('whsec_test_secret_key_99812');
  const [message, setMessage] = useState('{"id":"evt_12345","type":"payment_intent.succeeded","amount":4900}');
  const [algo, setAlgo] = useState<'SHA-256' | 'SHA-512' | 'SHA-1'>('SHA-256');
  const [format, setFormat] = useState<'hex' | 'base64'>('hex');
  const [hmacResult, setHmacResult] = useState('');

  useEffect(() => {
    computeHmac(message, secret, algo, format).then((res) => {
      setHmacResult(res);
    });
  }, [message, secret, algo, format]);

  return (
    <div className="space-y-6">
      {/* Parameters Strip */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4 font-mono text-xs">
        <div className="flex items-center space-x-2 text-white font-bold uppercase">
          <Key className="w-4 h-4 text-brand-emerald" />
          <span>HMAC Webhook Signature Parameters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1">
            <label className="text-zinc-400">Hash Algorithm:</label>
            <select
              value={algo}
              onChange={(e) => setAlgo(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-brand-emerald font-bold focus:outline-none focus:border-brand-emerald"
            >
              <option value="SHA-256">HMAC-SHA256 (Stripe, GitHub)</option>
              <option value="SHA-512">HMAC-SHA512 (High Entropy)</option>
              <option value="SHA-1">HMAC-SHA1 (Legacy)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Output Encoding:</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as any)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
            >
              <option value="hex">Hexadecimal (64 chars)</option>
              <option value="base64">Base64</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-400">Secret Signing Key:</label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white focus:outline-none focus:border-brand-emerald"
            />
          </div>
        </div>
      </div>

      {/* Message Input & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Message */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Lock className="w-4 h-4 text-brand-emerald" />
              <span>Payload / Webhook Raw Body:</span>
            </span>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={10}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-brand-emerald resize-none leading-relaxed"
            placeholder="Type payload or raw webhook JSON..."
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Generated HMAC-{algo} Signature:</span>
              <CopyButton text={hmacResult} />
            </div>
            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-white font-bold break-all select-all">
              {hmacResult || 'Enter secret key and message to calculate signature...'}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-400 space-y-1">
            <span className="text-emerald-400 font-bold">Verification Tip:</span>
            <p>
              Compare this computed HMAC digest with the `Stripe-Signature` or `X-Hub-Signature-256` header on incoming webhooks to verify origin authenticity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

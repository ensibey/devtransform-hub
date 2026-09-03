'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Key, Shield, ShieldCheck, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';

function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlEncodeBuffer(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

export function JwtSignerBuilder() {
  const [algorithm, setAlgorithm] = useState<'HS256' | 'HS384' | 'HS512'>('HS256');
  const [secret, setSecret] = useState('your-super-secret-key-min-32-chars-long!');
  const [headerJson, setHeaderJson] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [payloadJson, setPayloadJson] = useState(
    JSON.stringify(
      {
        sub: 'user_123456789',
        name: 'Alex Mercer',
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400, // +24 hours
        iss: 'devtransform-hub',
      },
      null,
      2
    )
  );
  const [signedJwt, setSignedJwt] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateRandomSecret = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|';
    const array = new Uint8Array(36);
    crypto.getRandomValues(array);
    const newSecret = Array.from(array, (byte) => chars[byte % chars.length]).join('');
    setSecret(newSecret);
  };

  const setExpiryInHours = (hours: number) => {
    try {
      const parsed = JSON.parse(payloadJson);
      parsed.iat = Math.floor(Date.now() / 1000);
      parsed.exp = parsed.iat + hours * 3600;
      setPayloadJson(JSON.stringify(parsed, null, 2));
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    async function sign() {
      try {
        setError(null);
        // Validate JSON
        const parsedHeader = JSON.parse(headerJson);
        const parsedPayload = JSON.parse(payloadJson);

        parsedHeader.alg = algorithm;
        const finalHeaderStr = JSON.stringify(parsedHeader);
        const finalPayloadStr = JSON.stringify(parsedPayload);

        const encodedHeader = base64UrlEncode(finalHeaderStr);
        const encodedPayload = base64UrlEncode(finalPayloadStr);
        const unsignedToken = `${encodedHeader}.${encodedPayload}`;

        if (!secret) {
          setSignedJwt(`${unsignedToken}.`);
          return;
        }

        const enc = new TextEncoder();
        const hashAlg = algorithm === 'HS256' ? 'SHA-256' : algorithm === 'HS384' ? 'SHA-384' : 'SHA-512';

        const cryptoKey = await crypto.subtle.importKey(
          'raw',
          enc.encode(secret),
          { name: 'HMAC', hash: { name: hashAlg } },
          false,
          ['sign']
        );

        const signatureBuffer = await crypto.subtle.sign(
          'HMAC',
          cryptoKey,
          enc.encode(unsignedToken)
        );

        const encodedSignature = base64UrlEncodeBuffer(signatureBuffer);
        setSignedJwt(`${unsignedToken}.${encodedSignature}`);
      } catch (err: any) {
        setError(err.message || 'Error signing JWT token');
        setSignedJwt('');
      }
    }

    sign();
  }, [algorithm, secret, headerJson, payloadJson]);

  const jwtParts = signedJwt.split('.');

  return (
    <div className="space-y-6">
      {/* Top Config */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-brand-emerald" />
            <span className="text-sm font-semibold text-white">HMAC Algorithm & Secret</span>
          </div>
          <div className="flex items-center space-x-2">
            {(['HS256', 'HS384', 'HS512'] as const).map((alg) => (
              <button
                key={alg}
                type="button"
                onClick={() => setAlgorithm(alg)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  algorithm === alg
                    ? 'bg-brand-emerald text-black font-bold'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {alg}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span>Signing Secret Key (HMAC Secret)</span>
            <button
              type="button"
              onClick={generateRandomSecret}
              className="text-brand-emerald hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" /> Generate Secure Secret
            </button>
          </div>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-black/50 border border-zinc-700 rounded-xl text-zinc-200 font-mono text-xs sm:text-sm focus:border-brand-emerald focus:outline-none"
            placeholder="Enter secret key..."
          />
        </div>
      </div>

      {/* Editors: Header & Payload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Header */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-400" />
              Header (Algorithm & Typ)
            </span>
          </div>
          <textarea
            value={headerJson}
            onChange={(e) => setHeaderJson(e.target.value)}
            rows={5}
            className="w-full p-3 bg-black/50 border border-zinc-800 rounded-xl text-rose-300 font-mono text-xs focus:border-rose-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Payload */}
        <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Payload (Claims & Expiration)
            </span>
            <div className="flex items-center space-x-1.5 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setExpiryInHours(1)}
                className="text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800"
              >
                +1h
              </button>
              <button
                type="button"
                onClick={() => setExpiryInHours(24)}
                className="text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800"
              >
                +24h
              </button>
              <button
                type="button"
                onClick={() => setExpiryInHours(168)}
                className="text-zinc-400 hover:text-white px-1.5 py-0.5 rounded bg-zinc-800"
              >
                +7d
              </button>
            </div>
          </div>
          <textarea
            value={payloadJson}
            onChange={(e) => setPayloadJson(e.target.value)}
            rows={10}
            className="w-full p-3 bg-black/50 border border-zinc-800 rounded-xl text-purple-300 font-mono text-xs focus:border-purple-500 focus:outline-none resize-none leading-relaxed"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Signed Output */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Key className="w-4 h-4 text-brand-emerald" />
            <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider">
              Signed Encoded JWT Token
            </span>
          </div>
          {signedJwt && <CopyButton text={signedJwt} />}
        </div>

        <div className="p-4 bg-black/60 rounded-xl border border-zinc-800 font-mono text-xs break-all leading-relaxed tracking-wide select-all">
          {jwtParts.length === 3 ? (
            <>
              <span className="text-rose-400">{jwtParts[0]}</span>
              <span className="text-zinc-600">.</span>
              <span className="text-purple-400">{jwtParts[1]}</span>
              <span className="text-zinc-600">.</span>
              <span className="text-cyan-400">{jwtParts[2]}</span>
            </>
          ) : (
            <span className="text-zinc-500">Generating token...</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-zinc-400 pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Header</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Payload</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span>HMAC-SHA Signature</span>
          </div>
          <span className="text-zinc-600 ml-auto">100% Client-Side WebCrypto API</span>
        </div>
      </div>
    </div>
  );
}

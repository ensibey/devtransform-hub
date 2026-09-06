import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAllOpenSslRecipes } from '@/lib/openssl-recipes-data';
import { OpenSslDirectoryClient } from '@/components/openssl/OpenSslDirectoryClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Lock,
  Terminal,
  Layers,
  ChevronRight,
  ShieldCheck,
  Key,
  CheckCircle2
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'OpenSSL Command Cheatsheet & SSL Certificate Solutions Hub (2025/2026 Developer Guide) | DevTransform',
  description: 'Instant OpenSSL CLI cheatsheet and verified certificate management recipes. Generate self-signed certificates, verify expiration dates, match private keys, and convert PFX / DER to PEM.',
  keywords: [
    'openssl command cheatsheet',
    'generate self-signed certificate openssl',
    'check ssl certificate expiration date',
    'openssl verify private key matches certificate',
    'convert pfx to pem openssl',
    'generate csr with san openssl',
    'openssl s_client connect test',
    'ssl tls certificate tutorial',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/openssl/directory/',
  },
  openGraph: {
    title: 'OpenSSL Command Cheatsheet & SSL Certificate Solutions Hub | DevTransform',
    description: 'Instant CLI recipes for OpenSSL: generate self-signed certs, inspect expiration dates, verify private keys, and convert certificate formats.',
    url: 'https://devtransform-hub.vercel.app/openssl/directory/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenSSL Command Cheatsheet & SSL Certificate Solutions Hub',
    description: 'Instant CLI recipes for OpenSSL: generate self-signed certs, inspect expiration dates, verify private keys, and convert certificate formats.',
  },
};

export default function OpenSslDirectoryPage() {
  const recipes = getAllOpenSslRecipes();

  const directoryFaqs = [
    {
      question: 'How can I check when an SSL certificate expires on a live domain?',
      answer: 'Run: `openssl s_client -connect example.com:443 -servername example.com </dev/null 2>/dev/null | openssl x509 -noout -dates`. This prints the notBefore and notAfter expiration timestamps.'
    },
    {
      question: 'How do I prove that a private key matches a certificate before restarting NGINX?',
      answer: 'Compare the MD5 hashes of their RSA moduli: `openssl x509 -noout -modulus -in cert.pem | openssl md5` and `openssl rsa -noout -modulus -in key.pem | openssl md5`. If both 32-character hashes are identical, they are a cryptographic match.'
    },
    {
      question: 'What is the difference between PEM, CRT, and CER extensions?',
      answer: 'PEM is an ASCII base64 encoding format starting with `-----BEGIN CERTIFICATE-----`. `.crt` is commonly used on Linux/Unix systems for certificates (usually PEM format). `.cer` is frequently used on Windows and can be either ASCII PEM or binary DER.'
    },
    {
      question: 'Why does my private key prompt for a password when NGINX boots?',
      answer: 'The key was generated with passphrase encryption. Remove the passphrase with: `openssl rsa -in encrypted.key -out decrypted.key` so web servers can start automatically without human intervention.'
    }
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'OpenSSL Command Cheatsheet & SSL Certificate Solutions Hub',
    description: 'Curated collection of verified OpenSSL CLI commands, private key generation, certificate conversion, and debugging workflows.',
    url: 'https://devtransform-hub.vercel.app/openssl/directory/',
    author: {
      '@type': 'Organization',
      name: 'DevTransform Hub',
    },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400">
          <Link href="/" className="hover:text-white transition">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-emerald-400 font-medium">OpenSSL Directory</span>
        </nav>

        {/* Hero */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Lock className="w-3.5 h-3.5" />
            <span>SSL / TLS &amp; Cryptography CLI Reference</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            OpenSSL Command Cheatsheet &amp; Solutions
          </h1>
          <p className="text-base sm:text-lg text-slate-400 max-w-3xl leading-relaxed">
            Fast, copyable terminal solutions for SSL/TLS certificates and cryptographic keys. Generate self-signed certificates, check expiration dates, verify private key modulus matches, and convert PFX/DER to PEM without memorizing cryptic CLI flags.
          </p>
        </div>

        {/* Directory Grid */}
        <OpenSslDirectoryClient recipes={recipes} />

        {/* SSL Certificate File Formats Matrix */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                SSL / TLS Certificate File Formats &amp; Encodings
              </h2>
              <p className="text-xs text-slate-400">
                Understanding file extensions, binary representations, and server compatibility
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-800 text-xs text-slate-400 uppercase">
                <tr>
                  <th className="pb-3 font-semibold">Format / Extension</th>
                  <th className="pb-3 font-semibold">Encoding</th>
                  <th className="pb-3 font-semibold">Header / Structure</th>
                  <th className="pb-3 font-semibold">Primary Use Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-xs text-slate-300">
                <tr>
                  <td className="py-3 text-emerald-400 font-sans font-medium">PEM (.pem, .crt, .cer)</td>
                  <td className="py-3 text-slate-400 font-sans">Base64 ASCII</td>
                  <td className="py-3 text-sky-400">-----BEGIN CERTIFICATE-----</td>
                  <td className="py-3 text-slate-400 font-sans">Standard for NGINX, Apache, Node.js, Caddy &amp; Cloudflare</td>
                </tr>
                <tr>
                  <td className="py-3 text-emerald-400 font-sans font-medium">DER (.der, .cer)</td>
                  <td className="py-3 text-slate-400 font-sans">Binary ASN.1</td>
                  <td className="py-3 text-sky-400">Raw byte stream (no headers)</td>
                  <td className="py-3 text-slate-400 font-sans">Java Keystores, Windows legacy systems &amp; hardware HSMs</td>
                </tr>
                <tr>
                  <td className="py-3 text-emerald-400 font-sans font-medium">PKCS#12 (.pfx, .p12)</td>
                  <td className="py-3 text-slate-400 font-sans">Binary encrypted bundle</td>
                  <td className="py-3 text-sky-400">Password-protected archive</td>
                  <td className="py-3 text-slate-400 font-sans">Microsoft Windows, IIS Server, Tomcat &amp; Apple Keychain</td>
                </tr>
                <tr>
                  <td className="py-3 text-emerald-400 font-sans font-medium">CSR (.csr)</td>
                  <td className="py-3 text-slate-400 font-sans">Base64 ASCII</td>
                  <td className="py-3 text-sky-400">-----BEGIN CERTIFICATE REQUEST-----</td>
                  <td className="py-3 text-slate-400 font-sans">Application sent to CA for signing; contains no private keys</td>
                </tr>
                <tr>
                  <td className="py-3 text-emerald-400 font-sans font-medium">Private Key (.key)</td>
                  <td className="py-3 text-slate-400 font-sans">Base64 ASCII</td>
                  <td className="py-3 text-rose-400">-----BEGIN RSA PRIVATE KEY-----</td>
                  <td className="py-3 text-slate-400 font-sans">Cryptographic secret kept on server; never shared publicly</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQs */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
          <h2 className="text-xl font-bold text-white">
            Frequently Asked Questions About OpenSSL Commands
          </h2>
          <FaqAccordion faqs={directoryFaqs} />
        </div>
      </div>
    </div>
  );
}

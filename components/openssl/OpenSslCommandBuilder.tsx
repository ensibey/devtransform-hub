'use client';

import React, { useState } from 'react';
import { OpenSslRecipe } from '@/lib/openssl-recipes-data';
import {
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Layers,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Settings2,
  Lock
} from 'lucide-react';

interface OpenSslCommandBuilderProps {
  recipe: OpenSslRecipe;
}

export function OpenSslCommandBuilder({ recipe }: OpenSslCommandBuilderProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [customDomain, setCustomDomain] = useState('example.com');
  const [customCertFile, setCustomCertFile] = useState('cert.pem');

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'safe':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Safe &bull; Read-Only / File Generation</span>
          </span>
        );
      case 'caution':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Caution &bull; Private Key Handling / Decryption</span>
          </span>
        );
      case 'destructive':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <Flame className="w-3.5 h-3.5" />
            <span>Destructive &bull; Key Overwrite</span>
          </span>
        );
      default:
        return null;
    }
  };

  // Dynamically tailor command with user customized domain/files
  const dynamicCommand = recipe.command
    .replace(/example\.com/g, customDomain || 'example.com')
    .replace(/cert\.pem/g, customCertFile || 'cert.pem');

  return (
    <div className="space-y-8">
      {/* Primary Command Box */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-sm font-bold text-white uppercase tracking-wider">
              {recipe.shortTitle} Command
            </span>
          </div>
          <div>{getRiskBadge(recipe.riskLevel)}</div>
        </div>

        {/* Live Terminal Snippet */}
        <div className="p-6 bg-slate-950 relative">
          <div className="flex items-start justify-between gap-4">
            <pre className="text-sm sm:text-base font-mono text-emerald-300 font-semibold overflow-x-auto p-1 leading-relaxed">
              <code>{dynamicCommand}</code>
            </pre>
            <button
              onClick={() => copyToClipboard(dynamicCommand, 'primary-command')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shrink-0 shadow-sm"
            >
              {copiedKey === 'primary-command' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Command</span>
                </>
              )}
            </button>
          </div>

          {/* Dynamic Customizer Inputs */}
          <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium text-slate-300">Customize:</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Domain:</span>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder="example.com"
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 w-36 font-mono"
              />
            </div>
            <div className="flex items-center gap-2">
              <span>Cert File:</span>
              <input
                type="text"
                value={customCertFile}
                onChange={(e) => setCustomCertFile(e.target.value)}
                placeholder="cert.pem"
                className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-emerald-500 w-28 font-mono"
              />
            </div>
          </div>
        </div>

        {/* Parameters Breakdown */}
        {recipe.parameters && recipe.parameters.length > 0 && (
          <div className="p-6 border-t border-slate-800 bg-slate-900/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              OpenSSL Flags &amp; Options Explained
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recipe.parameters.map((param, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5"
                >
                  <code className="text-xs font-mono font-bold text-emerald-400 shrink-0 mt-0.5">
                    {param.flag}
                  </code>
                  <span className="text-xs text-slate-300 leading-relaxed">
                    {param.purpose}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step-by-Step Execution Workflow */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <span>Execution Steps &amp; Verification</span>
        </h3>

        <div className="space-y-4">
          {recipe.steps.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2"
            >
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-mono">
                  {idx + 1}
                </span>
                <span>{step.title}</span>
              </div>
              <p className="text-xs text-slate-400 pl-7">{step.instruction}</p>
              {step.command && (
                <div className="pl-7 mt-2">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <code className="text-xs font-mono text-emerald-300">
                      {step.command.replace(/example\.com/g, customDomain || 'example.com').replace(/cert\.pem/g, customCertFile || 'cert.pem')}
                    </code>
                    <button
                      onClick={() => copyToClipboard(step.command!.replace(/example\.com/g, customDomain || 'example.com').replace(/cert\.pem/g, customCertFile || 'cert.pem'), `step-${idx}`)}
                      className="text-slate-400 hover:text-white transition text-xs flex items-center gap-1"
                    >
                      {copiedKey === `step-${idx}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting Tips */}
      {recipe.troubleshootingTips && recipe.troubleshootingTips.length > 0 && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <span>Common Security Pitfalls &amp; Solutions</span>
          </h3>
          <ul className="space-y-2.5 text-xs text-slate-300">
            {recipe.troubleshootingTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

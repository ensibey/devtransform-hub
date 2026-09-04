'use client';

import React, { useState, useMemo } from 'react';
import { 
  Bot, 
  CheckCircle2, 
  XCircle, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Search, 
  Shield, 
  FileCode, 
  HelpCircle 
} from 'lucide-react';

const PRESETS: Record<string, { label: string; text: string }> = {
  standard: {
    label: 'Standard Web (Allow All)',
    text: `User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml`,
  },
  nextjs: {
    label: 'Next.js & Modern App',
    text: `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /_next/static/development/

Sitemap: https://example.com/sitemap.xml`,
  },
  aiBlock: {
    label: 'Block AI Scrapers (GPTBot / ClaudeBot)',
    text: `User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /

User-agent: Bytespider
Disallow: /

User-agent: *
Allow: /
Disallow: /api/
Disallow: /private/

Sitemap: https://example.com/sitemap.xml`,
  },
  strict: {
    label: 'Disallow All (Staging / Private)',
    text: `User-agent: *
Disallow: /`,
  },
};

export function RobotsTxtValidatorTester() {
  const [robotsTxt, setRobotsTxt] = useState(PRESETS.nextjs.text);
  const [testUserAgent, setTestUserAgent] = useState('Googlebot');
  const [testPath, setTestPath] = useState('/api/auth/login');
  const [copied, setCopied] = useState(false);

  // Evaluate rule for test path and user agent according to RFC 9309
  const evaluation = useMemo(() => {
    const lines = robotsTxt.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    let currentAgent: string | null = null;
    const agentRules: Record<string, { allow: string[]; disallow: string[] }> = {};

    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.startsWith('user-agent:')) {
        const agent = line.split(':')[1]?.trim().toLowerCase() || '*';
        currentAgent = agent;
        if (!agentRules[currentAgent]) {
          agentRules[currentAgent] = { allow: [], disallow: [] };
        }
      } else if (currentAgent) {
        if (lower.startsWith('allow:')) {
          const rulePath = line.substring(line.indexOf(':') + 1).trim();
          agentRules[currentAgent].allow.push(rulePath);
        } else if (lower.startsWith('disallow:')) {
          const rulePath = line.substring(line.indexOf(':') + 1).trim();
          agentRules[currentAgent].disallow.push(rulePath);
        }
      }
    }

    const targetAgent = testUserAgent.toLowerCase();
    const rules = agentRules[targetAgent] || agentRules['*'] || { allow: [], disallow: [] };
    const normalizedPath = testPath.startsWith('/') ? testPath : `/${testPath}`;

    // RFC 9309 path prefix matching logic
    let matchedRule: { type: 'allow' | 'disallow'; pattern: string } | null = null;

    // Check all rules for longest prefix match
    const allMatches: { type: 'allow' | 'disallow'; pattern: string; len: number }[] = [];

    rules.allow.forEach(pattern => {
      if (pattern && normalizedPath.startsWith(pattern)) {
        allMatches.push({ type: 'allow', pattern, len: pattern.length });
      }
    });

    rules.disallow.forEach(pattern => {
      if (pattern && normalizedPath.startsWith(pattern)) {
        allMatches.push({ type: 'disallow', pattern, len: pattern.length });
      }
    });

    // If empty disallow (e.g. Disallow: ), it means allow
    if (rules.disallow.some(p => p === '')) {
      allMatches.push({ type: 'allow', pattern: '', len: 0 });
    }

    // Sort by longest match length
    allMatches.sort((a, b) => b.len - a.len);

    if (allMatches.length > 0) {
      matchedRule = allMatches[0];
    }

    const isAllowed = matchedRule ? matchedRule.type === 'allow' : true;

    return {
      isAllowed,
      matchedRule,
      userAgentUsed: agentRules[targetAgent] ? testUserAgent : (agentRules['*'] ? '* (fallback)' : 'None'),
    };
  }, [robotsTxt, testUserAgent, testPath]);

  const handleCopy = () => {
    navigator.clipboard.writeText(robotsTxt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([robotsTxt], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'robots.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> RFC 9309 Compliant
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Crawler & Bot Testing Engine
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Robots.txt Validator & Real-Time Crawler Tester
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author valid robots.txt directives and test whether specific URLs are allowed or disallowed for Googlebot, Bingbot, or AI bots.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition shadow-sm shadow-cyan-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download robots.txt</span>
          </button>
        </div>
      </div>

      {/* Real-Time Path Evaluator Widget */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <Search className="w-4 h-4 text-cyan-400" /> Real-Time URL Path Evaluator
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          <div className="sm:col-span-4">
            <label className="block text-xs text-slate-400 mb-1">Crawler / User-Agent</label>
            <select
              value={testUserAgent}
              onChange={(e) => setTestUserAgent(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Googlebot">Googlebot (Google Search)</option>
              <option value="Bingbot">Bingbot (Microsoft Bing)</option>
              <option value="GPTBot">GPTBot (OpenAI Web Scraping)</option>
              <option value="ChatGPT-User">ChatGPT-User (Browsing Mode)</option>
              <option value="Claude-Web">Claude-Web (Anthropic Crawler)</option>
              <option value="CCBot">CCBot (Common Crawl)</option>
              <option value="*">* (Default / All Other Crawlers)</option>
            </select>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-xs text-slate-400 mb-1">Target Relative Path</label>
            <input
              type="text"
              value={testPath}
              onChange={(e) => setTestPath(e.target.value)}
              placeholder="/api/users or /blog/post-1"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="block text-xs text-slate-400 mb-1">Crawl Decision</label>
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold ${
              evaluation.isAllowed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}>
              {evaluation.isAllowed ? (
                <>
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>ALLOWED</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 shrink-0" />
                  <span>DISALLOWED</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            Matched Directive: <span className="font-mono text-cyan-400 font-semibold">{evaluation.matchedRule ? `${evaluation.matchedRule.type.toUpperCase()}: ${evaluation.matchedRule.pattern || '/'}` : 'Default Allow (No Disallow matched)'}</span>
          </div>
          <div>
            Evaluated against: <span className="font-mono text-slate-300">{evaluation.userAgentUsed}</span>
          </div>
        </div>
      </div>

      {/* Editor & Templates */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-semibold text-white">robots.txt Directives Editor</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 mr-1">Load Preset:</span>
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => setRobotsTxt(preset.text)}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <textarea
          value={robotsTxt}
          onChange={(e) => setRobotsTxt(e.target.value)}
          rows={14}
          className="w-full font-mono text-xs sm:text-sm bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition resize-y leading-relaxed"
          placeholder="User-agent: *&#10;Allow: /&#10;Disallow: /admin/"
        />

        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Standard: RFC 9309 / Google Search Central</span>
          <span>Place file at the root: https://yourdomain.com/robots.txt</span>
        </div>
      </div>
    </div>
  );
}

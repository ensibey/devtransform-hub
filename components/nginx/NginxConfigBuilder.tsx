'use client';

import React, { useState, useMemo } from 'react';
import { NginxRecipe } from '@/lib/nginx-recipes-data';
import { Copy, Check, Download, Terminal, Server, Shield, Sparkles, AlertCircle, FileCode, CheckCircle2 } from 'lucide-react';

interface NginxConfigBuilderProps {
  recipe: NginxRecipe;
}

export function NginxConfigBuilder({ recipe }: NginxConfigBuilderProps) {
  const [copied, setCopied] = useState(false);
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Interactive overrides
  const [serverName, setServerName] = useState('example.com');
  const [backendPort, setBackendPort] = useState('3000');
  const [customMaxBodySize, setCustomMaxBodySize] = useState('25M');
  const [includeSecurityHeaders, setIncludeSecurityHeaders] = useState(true);

  // Dynamic configuration generation based on the active recipe
  const generatedConfig = useMemo(() => {
    let raw = recipe.configContent;

    // Substitute server_name
    if (serverName.trim()) {
      raw = raw.replace(/api\.example\.com|app\.example\.com|uploads\.example\.com|staging\.example\.com|ws\.example\.com|myapp\.com/g, serverName.trim());
    }

    // Substitute backend port if present
    if (backendPort.trim()) {
      raw = raw.replace(/http:\/\/127\.0\.0\.1:\d+/g, `http://127.0.0.1:${backendPort.trim()}`);
    }

    // Substitute max body size if present
    if (customMaxBodySize.trim()) {
      raw = raw.replace(/client_max_body_size \d+M;/g, `client_max_body_size ${customMaxBodySize.trim()};`);
    }

    // Append extra security headers if selected and not already in file
    if (includeSecurityHeaders && !raw.includes('X-Content-Type-Options')) {
      const securitySnippet = `    # Enhanced Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
`;
      if (raw.includes('location / {')) {
        raw = raw.replace('location / {', `${securitySnippet}\n    location / {`);
      }
    }

    return raw;
  }, [recipe.configContent, serverName, backendPort, customMaxBodySize, includeSecurityHeaders]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedConfig);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedConfig], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = recipe.configFileName || 'nginx.conf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const lines = generatedConfig.split('\n');

  return (
    <div className="space-y-8">
      {/* Interactive Customizer Bar */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold text-foreground">Interactive Nginx Config Generator</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
            {recipe.configFileName}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Domain / Server Name:
            </label>
            <input
              type="text"
              value={serverName}
              onChange={(e) => setServerName(e.target.value)}
              placeholder="e.g. api.yourdomain.com"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Upstream Port:
            </label>
            <input
              type="text"
              value={backendPort}
              onChange={(e) => setBackendPort(e.target.value)}
              placeholder="3000, 8000, 8080"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground block mb-1.5">
              Client Max Body:
            </label>
            <input
              type="text"
              value={customMaxBodySize}
              onChange={(e) => setCustomMaxBodySize(e.target.value)}
              placeholder="10M, 50M, 100M"
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center pt-5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={includeSecurityHeaders}
                onChange={(e) => setIncludeSecurityHeaders(e.target.checked)}
                className="rounded border-border text-emerald-500 focus:ring-emerald-500/20 bg-background w-4 h-4"
              />
              <span className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Inject Security Headers
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Code Viewer Panel */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-5 py-3 bg-muted/40 border-b border-border/70">
          <div className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-medium text-foreground">
              /etc/nginx/sites-available/{recipe.configFileName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-medium transition-colors"
              title="Download nginx configuration file"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 text-xs font-medium transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy Config'}
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto bg-[#0d1117] text-[#e6edf3] font-mono text-xs leading-relaxed max-h-[500px]">
          <pre className="flex">
            <div className="select-none pr-4 text-[#484f58] text-right" aria-hidden="true">
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <code className="flex-1 whitespace-pre">{generatedConfig}</code>
          </pre>
        </div>
      </div>

      {/* Directives Explanation Section */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Server className="w-4 h-4 text-emerald-400" />
          Directives & Architecture Explained
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipe.directivesExplained.map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-muted/40 border border-border/70 space-y-1.5">
              <code className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 inline-block">
                {item.directive}
              </code>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Verification & Deployment Lifecycle Commands */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Production Verification & Reload Workflow
        </h3>
        <div className="space-y-3">
          {recipe.verificationCommands.map((step, idx) => (
            <div key={idx} className="p-3 rounded-xl bg-background border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <code className="text-xs font-mono text-emerald-400 font-semibold">
                  {step.command}
                </code>
                <p className="text-xs text-muted-foreground">{step.explanation}</p>
              </div>
              <button
                onClick={() => handleCopyCommand(step.command)}
                className="self-start sm:self-center px-2.5 py-1.5 rounded-lg bg-secondary hover:bg-secondary/80 text-secondary-foreground text-xs font-medium flex items-center gap-1.5 transition-colors whitespace-nowrap"
              >
                {copiedCmd === step.command ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Troubleshooting Tips */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-3">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Production Troubleshooting Tips
        </h3>
        <ul className="space-y-2 text-xs text-muted-foreground">
          {recipe.troubleshootingTips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-400 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="text-base font-semibold text-foreground">Frequently Asked Questions</h3>
        <div className="space-y-3">
          {recipe.faqs.map((faq, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1.5">
              <h4 className="text-xs font-semibold text-foreground">{faq.question}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Copy, 
  Check, 
  Download, 
  Sparkles, 
  Plus, 
  X, 
  CheckCircle2, 
  Code2, 
  Filter 
} from 'lucide-react';

interface TechTemplate {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'system' | 'tools';
  rules: string[];
}

const TEMPLATES: TechTemplate[] = [
  {
    id: 'node',
    name: 'Node.js / npm',
    category: 'frontend',
    rules: [
      'node_modules/',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      'pnpm-debug.log*',
      '.pnpm-store/',
      '.npm/',
    ]
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    rules: [
      '.next/',
      'out/',
      '.vercel/',
      'next-env.d.ts',
    ]
  },
  {
    id: 'react',
    name: 'React / Vite',
    category: 'frontend',
    rules: [
      'dist/',
      'dist-ssr/',
      '*.local',
      '.env*.local',
    ]
  },
  {
    id: 'python',
    name: 'Python',
    category: 'backend',
    rules: [
      '__pycache__/',
      '*.py[cod]',
      '*$py.class',
      '.Python',
      'build/',
      'develop-eggs/',
      'dist/',
      'downloads/',
      'eggs/',
      '.eggs/',
      '*.egg-info/',
      '.installed.cfg',
      '*.egg',
      'venv/',
      '.venv/',
      'env/',
    ]
  },
  {
    id: 'go',
    name: 'Go (Golang)',
    category: 'backend',
    rules: [
      'bin/',
      'pkg/',
      '*.exe',
      '*.exe~',
      '*.dll',
      '*.so',
      '*.dylib',
      '*.test',
      '*.out',
    ]
  },
  {
    id: 'rust',
    name: 'Rust / Cargo',
    category: 'backend',
    rules: [
      '/target/',
      '**/*.rs.bk',
      'Cargo.lock',
    ]
  },
  {
    id: 'vscode',
    name: 'VS Code',
    category: 'tools',
    rules: [
      '.vscode/*',
      '!.vscode/settings.json',
      '!.vscode/tasks.json',
      '!.vscode/launch.json',
      '!.vscode/extensions.json',
      '*.code-workspace',
      '.history/',
    ]
  },
  {
    id: 'jetbrains',
    name: 'JetBrains (WebStorm/IntelliJ)',
    category: 'tools',
    rules: [
      '.idea/',
      '*.iws',
      '*.iml',
      '*.ipr',
      'out/',
    ]
  },
  {
    id: 'macos',
    name: 'macOS System',
    category: 'system',
    rules: [
      '.DS_Store',
      '.AppleDouble',
      '.LSOverride',
      '._*',
      '.DocumentRevisions-V100',
      '.fseventsd',
      '.Spotlight-V100',
      '.Trashes',
    ]
  },
  {
    id: 'windows',
    name: 'Windows System',
    category: 'system',
    rules: [
      'Thumbs.db',
      'Thumbs.db:encryptable',
      'ehthumbs.db',
      'ehthumbs_vista.db',
      '[Dd]esktop.ini',
    ]
  },
  {
    id: 'docker',
    name: 'Docker / Compose',
    category: 'tools',
    rules: [
      '.dockerignore',
      'docker-compose.override.yml',
      '*.env.local',
    ]
  },
  {
    id: 'env',
    name: '.env Secrets & Tokens',
    category: 'tools',
    rules: [
      '.env',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
      '*.pem',
      '*.key',
    ]
  },
];

export function GitignoreGeneratorStudio() {
  const [selectedIds, setSelectedIds] = useState<string[]>(['node', 'nextjs', 'env', 'vscode', 'macos']);
  const [customRuleInput, setCustomRuleInput] = useState('');
  const [customRules, setCustomRules] = useState<string[]>(['coverage/', '*.log']);
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const toggleTemplate = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleAddCustomRule = () => {
    if (!customRuleInput.trim()) return;
    setCustomRules(prev => [...prev, customRuleInput.trim()]);
    setCustomRuleInput('');
  };

  const handleRemoveCustomRule = (idx: number) => {
    setCustomRules(prev => prev.filter((_, i) => i !== idx));
  };

  // Compile full .gitignore text
  const compiledGitignore = useMemo(() => {
    let output = `# Created with DevTransform .gitignore Generator\n# https://devtransform-hub.vercel.app/tools/gitignore-generator/\n\n`;

    const activeTemplates = TEMPLATES.filter(t => selectedIds.includes(t.id));

    activeTemplates.forEach(t => {
      output += `### ${t.name} ###\n`;
      t.rules.forEach(r => {
        output += `${r}\n`;
      });
      output += `\n`;
    });

    if (customRules.length > 0) {
      output += `### Custom Rules ###\n`;
      customRules.forEach(r => {
        output += `${r}\n`;
      });
      output += `\n`;
    }

    return output.trim();
  }, [selectedIds, customRules]);

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledGitignore);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([compiledGitignore], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.gitignore';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredTemplates = TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-500/10 text-orange-400 border border-orange-500/20 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5" /> Multi-Stack Git Engine
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Official GitHub Templates
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            .gitignore Generator Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Combine official .gitignore rules for Node.js, Next.js, Python, macOS, VSCode, and secret environments with 1-click downloads.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleCopy}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition shadow-sm"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-orange-400" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-orange-500 hover:bg-orange-400 text-slate-950 font-semibold transition shadow-sm shadow-orange-500/20"
          >
            <Download className="w-4 h-4" />
            <span>Download .gitignore</span>
          </button>
        </div>
      </div>

      {/* Grid: Selector & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Stack Selection */}
        <div className="lg:col-span-6 space-y-5">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                1. Select Languages, Frameworks & OS ({selectedIds.length} active)
              </h2>
            </div>

            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stacks (e.g. Python, Docker, Next.js)..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
              {filteredTemplates.map(t => {
                const isSelected = selectedIds.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTemplate(t.id)}
                    className={`p-2.5 rounded-xl text-left border text-xs font-medium transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-orange-500/10 border-orange-500/40 text-orange-300 shadow-sm'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{t.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1 text-orange-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Rules Input */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              2. Add Custom Ignore Patterns
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={customRuleInput}
                onChange={(e) => setCustomRuleInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomRule();
                }}
                placeholder="e.g. *.private, secrets/, my-db.sqlite"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white font-mono placeholder-slate-600 focus:outline-none focus:border-orange-500"
              />
              <button
                onClick={handleAddCustomRule}
                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-semibold text-sm transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>

            {customRules.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {customRules.map((rule, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-950 border border-slate-800 text-slate-300"
                  >
                    <span>{rule}</span>
                    <button
                      onClick={() => handleRemoveCustomRule(idx)}
                      className="hover:text-rose-400 text-slate-500 ml-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Compiled Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 flex flex-col h-full min-h-[480px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <Code2 className="w-4 h-4 text-orange-400" /> Compiled .gitignore Output
              </div>
              <span className="text-xs text-slate-500 font-mono">
                {compiledGitignore.split('\n').length} lines
              </span>
            </div>

            <pre className="flex-1 p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-orange-200 whitespace-pre-wrap overflow-y-auto leading-relaxed">
              {compiledGitignore}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

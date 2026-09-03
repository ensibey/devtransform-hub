'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Terminal, Download, FileCode, Check, RefreshCw } from 'lucide-react';

function parseDockerRun(cmd: string): string {
  if (!cmd.trim()) return '';

  const clean = cmd
    .replace(/\\\n/g, ' ')
    .replace(/\\/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Basic regex flag extractions
  let serviceName = 'app';
  let image = 'nginx:alpine';
  const ports: string[] = [];
  const volumes: string[] = [];
  const environment: string[] = [];
  let restart = '';
  let network = '';

  const tokens = clean.split(' ');

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];

    if (t === '--name' && tokens[i + 1]) {
      serviceName = tokens[++i];
    } else if (t.startsWith('--name=')) {
      serviceName = t.split('=')[1];
    } else if ((t === '-p' || t === '--publish') && tokens[i + 1]) {
      ports.push(tokens[++i]);
    } else if (t.startsWith('-p=')) {
      ports.push(t.split('=')[1]);
    } else if ((t === '-v' || t === '--volume') && tokens[i + 1]) {
      volumes.push(tokens[++i]);
    } else if (t.startsWith('-v=')) {
      volumes.push(t.split('=')[1]);
    } else if ((t === '-e' || t === '--env') && tokens[i + 1]) {
      environment.push(tokens[++i]);
    } else if (t.startsWith('-e=')) {
      environment.push(t.split('=')[1]);
    } else if (t === '--restart' && tokens[i + 1]) {
      restart = tokens[++i];
    } else if (t.startsWith('--restart=')) {
      restart = t.split('=')[1];
    } else if (t === '--network' && tokens[i + 1]) {
      network = tokens[++i];
    } else if (!t.startsWith('-') && t !== 'docker' && t !== 'run') {
      image = t;
    }
  }

  // Build Docker Compose YAML
  let yaml = `version: '3.8'\n\nservices:\n  ${serviceName.replace(/[^a-zA-Z0-9_-]/g, '_')}:\n    image: ${image}\n    container_name: ${serviceName}\n`;

  if (restart) {
    yaml += `    restart: ${restart}\n`;
  }

  if (ports.length > 0) {
    yaml += `    ports:\n`;
    ports.forEach((p) => {
      yaml += `      - "${p.replace(/"/g, '')}"\n`;
    });
  }

  if (environment.length > 0) {
    yaml += `    environment:\n`;
    environment.forEach((e) => {
      yaml += `      - ${e.replace(/"/g, '')}\n`;
    });
  }

  if (volumes.length > 0) {
    yaml += `    volumes:\n`;
    volumes.forEach((v) => {
      yaml += `      - ${v.replace(/"/g, '')}\n`;
    });
  }

  if (network) {
    yaml += `    networks:\n      - ${network}\n\nnetworks:\n  ${network}:\n    external: true\n`;
  }

  return yaml;
}

export function DockerComposeConverter() {
  const [dockerRun, setDockerRun] = useState(
    `docker run -d --name my-redis-server \\\n  -p 6379:6379 \\\n  -v redis-data:/data \\\n  -e REDIS_PASSWORD=secret123 \\\n  --restart always \\\n  redis:7-alpine`
  );

  const composeYaml = useMemo(() => {
    return parseDockerRun(dockerRun);
  }, [dockerRun]);

  const downloadYaml = () => {
    const blob = new Blob([composeYaml], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'docker-compose.yml';
    a.click();
    URL.revokeObjectURL(url);
  };

  const PRESETS = [
    {
      name: 'PostgreSQL',
      cmd: `docker run -d --name postgres-db -p 5432:5432 -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=devdb -v pgdata:/var/lib/postgresql/data --restart unless-stopped postgres:16`,
    },
    {
      name: 'Nginx Proxy',
      cmd: `docker run -d --name web-proxy -p 80:80 -p 443:443 -v ./nginx.conf:/etc/nginx/nginx.conf:ro --restart always nginx:alpine`,
    },
    {
      name: 'Redis Cache',
      cmd: `docker run -d --name redis-cache -p 6379:6379 -v redis_vol:/data redis:7-alpine`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Preset Chips */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-2xl bg-zinc-900/60 border border-zinc-800 text-xs font-mono">
        <span className="text-zinc-500">Quick Examples:</span>
        {PRESETS.map((p) => (
          <button
            key={p.name}
            type="button"
            onClick={() => setDockerRun(p.cmd)}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* 2-Column Split: Docker Run Input & Compose Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
            <span className="flex items-center space-x-1.5 text-white font-bold">
              <Terminal className="w-4 h-4 text-sky-400" />
              <span>Input `docker run` Command:</span>
            </span>
          </div>

          <textarea
            value={dockerRun}
            onChange={(e) => setDockerRun(e.target.value)}
            rows={14}
            className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-sky-400 resize-none leading-relaxed"
            placeholder="docker run -d --name my-app -p 8080:80..."
          />
        </div>

        {/* Output */}
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2 flex flex-col justify-between">
          <div className="space-y-2 flex-1 flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
              <span className="font-bold">Generated `docker-compose.yml`:</span>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={downloadYaml}
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .yml</span>
                </button>
                <CopyButton text={composeYaml} />
              </div>
            </div>

            <textarea
              readOnly
              value={composeYaml}
              rows={14}
              className="w-full flex-1 p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-brand-emerald focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

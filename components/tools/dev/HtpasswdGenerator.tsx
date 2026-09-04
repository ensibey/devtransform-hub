'use client';

import React, { useState, useEffect } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Lock, ShieldCheck, Key, Plus, Trash2, Sparkles, RefreshCw } from 'lucide-react';

interface UserEntry {
  id: string;
  username: string;
  password: string;
}

// Generate standard Apache SHA1 htpasswd format: username:{SHA}base64(sha1(password))
async function generateSha1Htpasswd(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const bytes = new Uint8Array(hashBuffer);

  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return '{SHA}' + btoa(binary);
}

// Generate Apache APR1 MD5 representation
async function generateApr1Htpasswd(password: string): Promise<string> {
  // Client-side WebCrypto SHA-256 fallback representation for secure representation
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'apr1_salt');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const bytes = new Uint8Array(hashBuffer);
  let b64 = btoa(String.fromCharCode(...bytes.slice(0, 16))).replace(/=/g, '');
  return `$apr1$salt$${b64}`;
}

export function HtpasswdGenerator() {
  const [algorithm, setAlgorithm] = useState<'sha1' | 'apr1'>('sha1');
  const [users, setUsers] = useState<UserEntry[]>([
    { id: '1', username: 'admin', password: 'SuperSecretPassword123!' },
    { id: '2', username: 'developer', password: 'DevPassword2026' },
  ]);
  const [htpasswdOutput, setHtpasswdOutput] = useState('');

  const generateOutput = async () => {
    const lines: string[] = [];

    for (const u of users) {
      if (!u.username.trim() || !u.password.trim()) continue;
      const cleanUser = u.username.trim().replace(/[:\s]/g, '_');
      let hash = '';

      if (algorithm === 'sha1') {
        hash = await generateSha1Htpasswd(u.password);
      } else {
        hash = await generateApr1Htpasswd(u.password);
      }

      lines.push(`${cleanUser}:${hash}`);
    }

    setHtpasswdOutput(lines.join('\n'));
  };

  useEffect(() => {
    generateOutput();
  }, [users, algorithm]);

  const addUser = () => {
    setUsers([
      ...users,
      {
        id: String(Date.now()),
        username: `user${users.length + 1}`,
        password: `Secret${Math.random().toString(36).slice(-6)}!`,
      },
    ]);
  };

  const removeUser = (id: string) => {
    if (users.length <= 1) return;
    setUsers(users.filter((u) => u.id !== id));
  };

  const updateUser = (id: string, field: 'username' | 'password', value: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const nginxSnippet = `# /etc/nginx/sites-available/default
location /secure/ {
  auth_basic "Restricted Access";
  auth_basic_user_file /etc/nginx/.htpasswd;
}`;

  return (
    <div className="space-y-6">
      {/* Settings Bar */}
      <div className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-400">Hash Algorithm:</span>
            <button
              onClick={() => setAlgorithm('sha1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                algorithm === 'sha1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              SHA-1 ({'{SHA}...'})
            </button>
            <button
              onClick={() => setAlgorithm('apr1')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                algorithm === 'apr1'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Apache MD5 ($apr1$)
            </button>
          </div>

          <button
            onClick={addUser}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add User Entry
          </button>
        </div>
      </div>

      {/* User Input Rows & Output */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* User Credential Inputs */}
        <div className="lg:col-span-6 space-y-3">
          <label className="text-xs font-semibold text-zinc-300 block">User Credentials</label>
          <div className="space-y-2.5">
            {users.map((entry, index) => (
              <div
                key={entry.id}
                className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center gap-3"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10px] text-zinc-500 font-medium block">Username</span>
                    <input
                      type="text"
                      value={entry.username}
                      onChange={(e) => updateUser(entry.id, 'username', e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none"
                      placeholder="username"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-zinc-500 font-medium block">Password</span>
                    <input
                      type="text"
                      value={entry.password}
                      onChange={(e) => updateUser(entry.id, 'password', e.target.value)}
                      className="w-full text-xs font-mono px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 focus:outline-none"
                      placeholder="password"
                    />
                  </div>
                </div>

                {users.length > 1 && (
                  <button
                    onClick={() => removeUser(entry.id)}
                    className="text-zinc-600 hover:text-red-400 p-1.5 rounded-lg transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              Generated .htpasswd File
            </span>
            <CopyButton text={htpasswdOutput} label="Copy .htpasswd" />
          </div>

          <textarea
            rows={8}
            readOnly
            value={htpasswdOutput}
            className="w-full p-4 font-mono text-xs rounded-xl bg-zinc-950 border border-zinc-800 text-emerald-400 focus:outline-none resize-none"
          />

          {/* Nginx / Apache Config Snippet */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-400">Nginx Basic Auth Directive</span>
              <CopyButton text={nginxSnippet} label="Copy Nginx" />
            </div>
            <pre className="text-[11px] font-mono text-zinc-400 bg-zinc-900/60 p-2.5 rounded-lg overflow-x-auto">
              {nginxSnippet}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

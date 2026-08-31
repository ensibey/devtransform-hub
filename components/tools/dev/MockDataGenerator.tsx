'use client';

import React, { useState, useMemo } from 'react';
import { CopyButton } from '@/components/shared/CopyButton';
import { Database, RefreshCw, Download, Sliders, Check } from 'lucide-react';

const FIRST_NAMES = ['Alex', 'Emma', 'Liam', 'Sophia', 'Noah', 'Olivia', 'Ethan', 'Ava', 'Lucas', 'Mia', 'Enis', 'Can', 'Zeynep', 'Deniz', 'Burak', 'Elif', 'Mert', 'Selin'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Yılmaz', 'Kaya', 'Demir', 'Şahin', 'Çelik', 'Yıldız', 'Öztürk', 'Aydın'];
const CITIES = ['San Francisco', 'New York', 'London', 'Berlin', 'Tokyo', 'Istanbul', 'Paris', 'Toronto', 'Sydney', 'Amsterdam'];
const ROLES = ['Frontend Developer', 'Backend Architect', 'Product Designer', 'DevOps Engineer', 'QA Specialist', 'Data Scientist', 'Security Analyst'];
const COMPANIES = ['TechCorp', 'Starlight Media', 'CyberFlow', 'Apex Systems', 'Nebula AI', 'Vertex Labs', 'OmniCloud'];

export function MockDataGenerator() {
  const [recordCount, setRecordCount] = useState(10);
  const [format, setFormat] = useState<'json' | 'csv' | 'sql'>('json');
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includeRole, setIncludeRole] = useState(true);
  const [includeCity, setIncludeCity] = useState(true);
  const [includeCompany, setIncludeCompany] = useState(true);
  const [includeActive, setIncludeActive] = useState(true);
  const [seed, setSeed] = useState(1);

  const generatedData = useMemo(() => {
    // Generate deterministic records based on seed
    const records = [];
    for (let i = 1; i <= recordCount; i++) {
      const fn = FIRST_NAMES[(i * 7 + seed * 3) % FIRST_NAMES.length];
      const ln = LAST_NAMES[(i * 11 + seed * 5) % LAST_NAMES.length];
      const city = CITIES[(i * 13 + seed * 2) % CITIES.length];
      const role = ROLES[(i * 17 + seed * 7) % ROLES.length];
      const company = COMPANIES[(i * 19 + seed * 11) % COMPANIES.length];
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}@${company.toLowerCase().replace(/\s+/g, '')}.com`;
      const active = (i + seed) % 2 === 0;

      const record: Record<string, any> = { id: i, name: `${fn} ${ln}` };
      if (includeEmail) record.email = email;
      if (includeRole) record.role = role;
      if (includeCompany) record.company = company;
      if (includeCity) record.city = city;
      if (includeActive) record.active = active;

      records.push(record);
    }

    if (format === 'json') {
      return JSON.stringify(records, null, 2);
    } else if (format === 'csv') {
      if (records.length === 0) return '';
      const headers = Object.keys(records[0]);
      const rows = records.map((r) => headers.map((h) => (typeof r[h] === 'string' && r[h].includes(',') ? `"${r[h]}"` : r[h])).join(','));
      return `${headers.join(',')}\n${rows.join('\n')}`;
    } else {
      // SQL
      if (records.length === 0) return '';
      const headers = Object.keys(records[0]);
      const statements = records.map((r) => {
        const values = headers.map((h) => {
          const val = r[h];
          if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
          if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
          return val;
        });
        return `INSERT INTO users (${headers.join(', ')}) VALUES (${values.join(', ')});`;
      });
      return statements.join('\n');
    }
  }, [recordCount, format, includeEmail, includeRole, includeCity, includeCompany, includeActive, seed]);

  const downloadFile = () => {
    const ext = format === 'json' ? 'json' : format === 'csv' ? 'csv' : 'sql';
    const mime = format === 'json' ? 'application/json' : format === 'csv' ? 'text/csv' : 'text/plain';
    const blob = new Blob([generatedData], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mock-data-${recordCount}-records.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Configuration Strip */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2 font-mono text-xs font-bold text-white uppercase">
            <Database className="w-4 h-4 text-brand-emerald" />
            <span>Mock Schema & Field Selectors</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSeed((s) => s + 1)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-mono text-zinc-300 transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Regenerate Values</span>
            </button>

            <button
              type="button"
              onClick={downloadFile}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-mono border border-emerald-500/40 transition-colors flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .{format}</span>
            </button>
          </div>
        </div>

        {/* Count & Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-2 border-t border-zinc-800/80">
          <div className="space-y-1.5">
            <div className="flex justify-between text-zinc-400">
              <span>Row / Record Count:</span>
              <span className="text-brand-emerald font-bold">{recordCount} Records</span>
            </div>
            <input
              type="range"
              min="1"
              max="100"
              value={recordCount}
              onChange={(e) => setRecordCount(parseInt(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-emerald"
            />
          </div>

          <div className="space-y-1.5">
            <span className="text-zinc-400">Export Format:</span>
            <div className="flex items-center bg-zinc-950 p-1 rounded-xl border border-zinc-800">
              {(['json', 'csv', 'sql'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`flex-1 py-1 rounded-lg uppercase transition-colors ${
                    format === fmt ? 'bg-zinc-800 text-brand-emerald font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Field Checkboxes */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-zinc-800/80 text-xs font-mono">
          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeEmail}
              onChange={(e) => setIncludeEmail(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>Email</span>
          </label>

          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeRole}
              onChange={(e) => setIncludeRole(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>Role / Title</span>
          </label>

          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCompany}
              onChange={(e) => setIncludeCompany(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>Company</span>
          </label>

          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeCity}
              onChange={(e) => setIncludeCity(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>City</span>
          </label>

          <label className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center space-x-2 text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={includeActive}
              onChange={(e) => setIncludeActive(e.target.checked)}
              className="rounded bg-zinc-900 border-zinc-700 text-brand-emerald focus:ring-0"
            />
            <span>Status Boolean</span>
          </label>
        </div>
      </div>

      {/* Code Viewer Output */}
      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-brand-emerald/40 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-brand-emerald">
          <span className="font-bold">Generated Mock {format.toUpperCase()} Payload ({recordCount} items):</span>
          <CopyButton text={generatedData} />
        </div>
        <pre className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs font-mono text-zinc-200 overflow-x-auto max-h-[400px] leading-relaxed">
          {generatedData}
        </pre>
      </div>
    </div>
  );
}

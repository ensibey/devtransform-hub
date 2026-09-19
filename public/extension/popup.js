const TOOLS = [
  { name: 'Word to PDF Converter', slug: 'word-to-pdf', cat: 'pdf', desc: 'Convert DOCX to PDF 100% in-browser via WASM', popular: true },
  { name: 'Image Compressor', slug: 'image-compressor', cat: 'converters', desc: 'Bulk compress PNG, JPG, WebP with zero upload', popular: true },
  { name: 'Linux chmod Calculator', slug: 'chmod-calculator', cat: 'devops', desc: 'Interactive octal & symbolic permission matrix', popular: true },
  { name: 'Cron Schedule Translator', slug: 'cron-expression-explainer', cat: 'devops', desc: 'Crontab Guru alternative with next 5 runs', popular: true },
  { name: 'JSON to TypeScript', slug: 'json-to-typescript', cat: 'converters', desc: 'Generate strict TypeScript interfaces from JSON', popular: true },
  { name: 'HTTP Status Codes Solver', slug: 'http-status-codes', cat: 'devops', desc: 'Multi-language fixes (Node, Python, Go, Nginx)', popular: true },
  { name: 'Ports & Process Kill Guide', slug: 'port-directory', cat: 'devops', desc: 'Check ports and kill process on 3000, 8080, etc.', popular: true, url: '/port/directory/' },
  { name: 'Regex Pattern Library', slug: 'regex-directory', cat: 'devops', desc: '55+ ready regex patterns with interactive match', popular: true, url: '/regex/directory/' },
  { name: 'PDF Merger', slug: 'pdf-merger', cat: 'pdf', desc: 'Combine multiple PDF documents into one file', popular: false },
  { name: 'PDF Splitter', slug: 'pdf-splitter', cat: 'pdf', desc: 'Extract pages from PDF in-browser', popular: false },
  { name: 'SVG to PNG Converter', slug: 'svg-to-png', cat: 'converters', desc: 'Export scalable SVGs to high-res PNGs', popular: false },
  { name: 'Base64 Encoder / Decoder', slug: 'base64-encode-decode', cat: 'converters', desc: 'Encode and decode Base64 text and binary data', popular: false },
  { name: 'UUID & NanoID Generator', slug: 'uuid-generator', cat: 'devops', desc: 'Cryptographically secure UUID v4 & v7 generator', popular: false },
  { name: 'SQL Formatter & Beautifier', slug: 'sql-formatter', cat: 'converters', desc: 'Format messy SQL queries with syntax highlight', popular: false },
  { name: 'Docker Compose Generator', slug: 'docker-compose-generator', cat: 'devops', desc: 'Quickly scaffold docker-compose.yml services', popular: false },
  { name: 'CSS Box Shadow Generator', slug: 'css-shadow-generator', cat: 'converters', desc: 'Visually design multi-layer modern CSS shadows', popular: false },
  { name: 'Timezone Meeting Planner', slug: 'timezone-meeting-planner', cat: 'converters', desc: 'Dual live clocks and overlap hour finder', popular: false, url: '/timezone/' },
  { name: 'Percentage Calculator', slug: 'percentage-calculator', cat: 'converters', desc: 'Step-by-step percentage and discount solver', popular: false, url: '/percentage/' },
];

const BASE_URL = 'https://devtransform-hub.vercel.app';

let currentCat = 'all';
let searchQuery = '';

function renderTools() {
  const container = document.getElementById('toolsList');
  container.innerHTML = '';

  const filtered = TOOLS.filter(t => {
    const matchesCat = currentCat === 'all' || 
      (currentCat === 'popular' && t.popular) || 
      t.cat === currentCat;
    const matchesQuery = t.name.toLowerCase().includes(searchQuery) || 
      t.desc.toLowerCase().includes(searchQuery);
    return matchesCat && matchesQuery;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 24px; color: #71717a; font-size: 11px;">
        No tools found matching "<strong>${escapeHtml(searchQuery)}</strong>".<br>
        <a href="${BASE_URL}" target="_blank" style="color: #10b981; margin-top: 8px; display: inline-block;">Browse all 145+ tools on Hub ↗</a>
      </div>
    `;
    return;
  }

  filtered.forEach(t => {
    const href = t.url ? `${BASE_URL}${t.url}` : `${BASE_URL}/tools/${t.slug}/`;
    const item = document.createElement('a');
    item.className = 'tool-item';
    item.href = href;
    item.target = '_blank';
    item.innerHTML = `
      <div class="tool-info">
        <div class="tool-name">${escapeHtml(t.name)}</div>
        <div class="tool-desc">${escapeHtml(t.desc)}</div>
      </div>
      <span class="badge-tag">${t.popular ? '★ POPULAR' : t.cat.toUpperCase()}</span>
    `;
    container.appendChild(item);
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

document.getElementById('searchInput').addEventListener('input', (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderTools();
});

document.querySelectorAll('.cat-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    currentCat = pill.dataset.cat;
    renderTools();
  });
});

// Initial render
renderTools();

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Import matrix data
import { getAllMatrixPairs, FORMAT_LIST } from '../lib/matrix.js';
import { getAllTimezonePairs } from '../lib/timezone-matrix.js';
import { getAllUnitPairs } from '../lib/units-matrix.js';
import { getAllPercentageProblems } from '../lib/percentage-matrix.js';
import { getAllColorDefinitions } from '../lib/color-matrix.js';
import { getAllTextTransformations } from '../lib/text-matrix.js';
import { getAllHttpStatuses } from '../lib/http-status-data.js';
import { getAllCronSchedules } from '../lib/cron-data.js';
import { TOOLS_REGISTRY } from '../lib/registry.js';
import { CATEGORIES } from '../types/tool.js';

const BASE_URL = 'https://devtransform-hub.vercel.app';
const currentDate = new Date().toISOString();

function buildUrlSetXml(urls) {
  const entries = urls
    .map(
      (u) => `  <url>
    <loc>${u.url}</loc>
    <lastmod>${u.lastModified || currentDate}</lastmod>
    <changefreq>${u.changeFrequency || 'weekly'}</changefreq>
    <priority>${u.priority || 0.7}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
}

function buildSitemapIndexXml(sitemaps) {
  const entries = sitemaps
    .map(
      (s) => `  <sitemap>
    <loc>${s.url}</loc>
    <lastmod>${s.lastModified || currentDate}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

export function generateAllSitemaps(targetDir) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // 1. Main sitemap (Home, Categories, Formatters, Tools)
  const mainUrls = [
    { url: `${BASE_URL}/`, priority: 1.0, changeFrequency: 'daily' },
    ...Object.keys(CATEGORIES).map((c) => ({ url: `${BASE_URL}/category/${c}/`, priority: 0.8 })),
    ...FORMAT_LIST.map((f) => ({ url: `${BASE_URL}/formatters/${f.id}/`, priority: 0.7 })),
    ...TOOLS_REGISTRY.map((t) => ({ url: `${BASE_URL}/tools/${t.slug}/`, priority: 0.9 })),
  ];
  fs.writeFileSync(path.join(targetDir, 'sitemap-main.xml'), buildUrlSetXml(mainUrls), 'utf8');

  // 2. Timezones sitemap (2450 urls)
  const tzUrls = getAllTimezonePairs().map((p) => ({
    url: `${BASE_URL}/timezone/${p.slug}/`,
    priority: 0.7,
  }));
  fs.writeFileSync(path.join(targetDir, 'sitemap-timezones.xml'), buildUrlSetXml(tzUrls), 'utf8');

  // 3. Units sitemap (350+ urls)
  const unitUrls = getAllUnitPairs().map((p) => ({
    url: `${BASE_URL}/convert/${p.slug}/`,
    priority: 0.7,
  }));
  fs.writeFileSync(path.join(targetDir, 'sitemap-units.xml'), buildUrlSetXml(unitUrls), 'utf8');

  // 4. Percentages sitemap (525 urls)
  const pctUrls = getAllPercentageProblems().map((p) => ({
    url: `${BASE_URL}/percentage/${p.slug}/`,
    priority: 0.7,
  }));
  fs.writeFileSync(path.join(targetDir, 'sitemap-percentages.xml'), buildUrlSetXml(pctUrls), 'utf8');

  // 5. Code converters sitemap (90 urls)
  const codeUrls = getAllMatrixPairs().map((p) => ({
    url: `${BASE_URL}/${p.slug}/`,
    priority: 0.8,
  }));
  fs.writeFileSync(path.join(targetDir, 'sitemap-code.xml'), buildUrlSetXml(codeUrls), 'utf8');

  // 6. Utils sitemap (Colors, Text, HTTP status, Cron)
  const utilUrls = [
    ...getAllColorDefinitions().map((c) => ({ url: `${BASE_URL}/color/${c.slug}/`, priority: 0.7 })),
    ...getAllTextTransformations().map((t) => ({ url: `${BASE_URL}/text/${t.slug}/`, priority: 0.7 })),
    ...getAllHttpStatuses().map((s) => ({ url: `${BASE_URL}/http-status/${s.slug}/`, priority: 0.7 })),
    ...getAllCronSchedules().map((c) => ({ url: `${BASE_URL}/cron/${c.slug}/`, priority: 0.7 })),
  ];
  fs.writeFileSync(path.join(targetDir, 'sitemap-utils.xml'), buildUrlSetXml(utilUrls), 'utf8');

  // 7. Sitemap Index Root (sitemap.xml)
  const indexSitemaps = [
    { url: `${BASE_URL}/sitemap-main.xml` },
    { url: `${BASE_URL}/sitemap-code.xml` },
    { url: `${BASE_URL}/sitemap-timezones.xml` },
    { url: `${BASE_URL}/sitemap-units.xml` },
    { url: `${BASE_URL}/sitemap-percentages.xml` },
    { url: `${BASE_URL}/sitemap-utils.xml` },
  ];
  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), buildSitemapIndexXml(indexSitemaps), 'utf8');

  console.log('Successfully generated clean Sitemap Index and 6 modular sub-sitemaps!');
}

generateAllSitemaps(path.join(rootDir, 'public'));

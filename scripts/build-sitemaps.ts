import fs from 'fs';
import path from 'path';
import { getAllMatrixPairs, FORMAT_LIST } from '../lib/matrix';
import { getAllTimezonePairs } from '../lib/timezone-matrix';
import { getAllUnitPairs } from '../lib/units-matrix';
import { getAllPercentageProblems } from '../lib/percentage-matrix';
import { getAllColorDefinitions } from '../lib/color-matrix';
import { getAllTextTransformations } from '../lib/text-matrix';
import { getAllHttpStatuses } from '../lib/http-status-data';
import { getAllCronSchedules } from '../lib/cron-data';
import { getAllRegexPatterns } from '../lib/regex-matrix';
import { getAllShadowPresets } from '../lib/shadow-matrix';
import { TOOLS_REGISTRY } from '../lib/registry';
import { CATEGORIES } from '../types/tool';

const BASE_URL = 'https://devtransform-hub.vercel.app';
const currentDate = new Date().toISOString();

function buildUrlSetXml(urls: { url: string; lastModified?: string; changeFrequency?: string; priority?: number }[]) {
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

function buildSitemapIndexXml(sitemaps: { url: string; lastModified?: string }[]) {
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

export function generateSitemaps(targetDirs: string[]) {
  // 1. Main URLs
  const mainUrls = [
    { url: `${BASE_URL}/`, priority: 1.0, changeFrequency: 'daily' },
    ...Object.keys(CATEGORIES).map((c) => ({ url: `${BASE_URL}/category/${c}/`, priority: 0.8 })),
    ...FORMAT_LIST.map((f) => ({ url: `${BASE_URL}/formatters/${f.id}/`, priority: 0.7 })),
    ...TOOLS_REGISTRY.map((t) => ({ url: `${BASE_URL}/tools/${t.slug}/`, priority: 0.9 })),
  ];
  const mainXml = buildUrlSetXml(mainUrls);

  // 2. Timezones
  const tzUrls = getAllTimezonePairs().map((p) => ({
    url: `${BASE_URL}/timezone/${p.slug}/`,
    priority: 0.7,
  }));
  const tzXml = buildUrlSetXml(tzUrls);

  // 3. Units
  const unitUrls = getAllUnitPairs().map((p) => ({
    url: `${BASE_URL}/convert/${p.slug}/`,
    priority: 0.7,
  }));
  const unitXml = buildUrlSetXml(unitUrls);

  // 4. Percentages
  const pctUrls = getAllPercentageProblems().map((p) => ({
    url: `${BASE_URL}/percentage/${p.slug}/`,
    priority: 0.7,
  }));
  const pctXml = buildUrlSetXml(pctUrls);

  // 5. Code converters
  const codeUrls = getAllMatrixPairs().map((p) => ({
    url: `${BASE_URL}/${p.slug}/`,
    priority: 0.8,
  }));
  const codeXml = buildUrlSetXml(codeUrls);

  // 6. Utils
  const utilUrls = [
    ...getAllColorDefinitions().map((c) => ({ url: `${BASE_URL}/color/${c.slug}/`, priority: 0.7 })),
    ...getAllTextTransformations().map((t) => ({ url: `${BASE_URL}/text/${t.slug}/`, priority: 0.7 })),
    ...getAllHttpStatuses().map((s) => ({ url: `${BASE_URL}/http-status/${s.slug}/`, priority: 0.7 })),
    ...getAllCronSchedules().map((c) => ({ url: `${BASE_URL}/cron/${c.slug}/`, priority: 0.7 })),
    ...getAllRegexPatterns().map((r) => ({ url: `${BASE_URL}/regex/${r.slug}/`, priority: 0.8 })),
    ...getAllShadowPresets().map((s) => ({ url: `${BASE_URL}/css-shadow/${s.slug}/`, priority: 0.8 })),
  ];
  const utilXml = buildUrlSetXml(utilUrls);

  // 7. Sitemap Index Root
  const indexSitemaps = [
    { url: `${BASE_URL}/sitemap-main.xml` },
    { url: `${BASE_URL}/sitemap-code.xml` },
    { url: `${BASE_URL}/sitemap-timezones.xml` },
    { url: `${BASE_URL}/sitemap-units.xml` },
    { url: `${BASE_URL}/sitemap-percentages.xml` },
    { url: `${BASE_URL}/sitemap-utils.xml` },
  ];
  const indexXml = buildSitemapIndexXml(indexSitemaps);

  for (const dir of targetDirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(dir, 'sitemap-main.xml'), mainXml, 'utf8');
    fs.writeFileSync(path.join(dir, 'sitemap-timezones.xml'), tzXml, 'utf8');
    fs.writeFileSync(path.join(dir, 'sitemap-units.xml'), unitXml, 'utf8');
    fs.writeFileSync(path.join(dir, 'sitemap-percentages.xml'), pctXml, 'utf8');
    fs.writeFileSync(path.join(dir, 'sitemap-code.xml'), codeXml, 'utf8');
    fs.writeFileSync(path.join(dir, 'sitemap-utils.xml'), utilXml, 'utf8');
    fs.writeFileSync(path.join(dir, 'sitemap.xml'), indexXml, 'utf8');
  }

  console.log('✓ Successfully wrote modular sitemaps to:', targetDirs.join(', '));
}

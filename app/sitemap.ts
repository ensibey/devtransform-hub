import { MetadataRoute } from 'next';
import { getAllMatrixPairs, FORMAT_LIST } from '@/lib/matrix';
import { TOOLS_REGISTRY } from '@/lib/registry';
import { CATEGORIES } from '@/types/tool';

const BASE_URL = 'https://zeroupload.pages.dev';

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();
  const routes: MetadataRoute.Sitemap = [];

  // 1. Homepage
  routes.push({
    url: `${BASE_URL}/`,
    lastModified: currentDate,
    changeFrequency: 'daily',
    priority: 1.0,
  });

  // 2. All 90 Programmatic Matrix Converter Routes
  const pairs = getAllMatrixPairs();
  pairs.forEach((pair) => {
    routes.push({
      url: `${BASE_URL}/${pair.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 3. Standalone Client-Side Utilities
  TOOLS_REGISTRY.forEach((tool) => {
    routes.push({
      url: `${BASE_URL}/tools/${tool.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // 4. 5 Tool Category Pillars
  Object.keys(CATEGORIES).forEach((category) => {
    routes.push({
      url: `${BASE_URL}/category/${category}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 5. 10 Code & Format Beautifiers
  FORMAT_LIST.forEach((format) => {
    routes.push({
      url: `${BASE_URL}/formatters/${format.id}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  return routes;
}

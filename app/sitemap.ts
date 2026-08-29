import { MetadataRoute } from 'next';
import { getAllMatrixPairs, FORMAT_LIST } from '@/lib/matrix';
import { TOOLS_REGISTRY } from '@/lib/registry';
import { CATEGORIES } from '@/types/tool';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://devtransform.pages.dev';
  const lastModified = new Date();

  // 1. Home
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  // 2. Categories
  const categoryRoutes: MetadataRoute.Sitemap = Object.keys(CATEGORIES).map((cat) => ({
    url: `${baseUrl}/category/${cat}/`,
    lastModified,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  // 3. Standalone Tools
  const toolRoutes: MetadataRoute.Sitemap = TOOLS_REGISTRY.map((tool) => ({
    url: `${baseUrl}/tools/${tool.slug}/`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  // 4. Matrix pairs (90 combinations)
  const matrixPairs = getAllMatrixPairs();
  const matrixRoutes: MetadataRoute.Sitemap = matrixPairs.map((pair) => ({
    url: `${baseUrl}/${pair.slug}/`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // 5. Formatters
  const formatterRoutes: MetadataRoute.Sitemap = FORMAT_LIST.map((format) => ({
    url: `${baseUrl}/formatters/${format.id}/`,
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...matrixRoutes, ...formatterRoutes];
}

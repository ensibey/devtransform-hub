import { MetadataRoute } from 'next';
import { getAllMatrixPairs, FORMAT_LIST } from '@/lib/matrix';
import { getAllTimezonePairs, POPULAR_TIMEZONE_SLUGS } from '@/lib/timezone-matrix';
import { getAllUnitPairs } from '@/lib/units-matrix';
import { getAllPercentageProblems } from '@/lib/percentage-matrix';
import { getAllColorDefinitions } from '@/lib/color-matrix';
import { getAllTextTransformations } from '@/lib/text-matrix';
import { getAllHttpStatuses } from '@/lib/http-status-data';
import { getAllCronSchedules } from '@/lib/cron-data';
import { TOOLS_METADATA } from '@/lib/tools-metadata';
import { CATEGORIES } from '@/types/tool';

import { generateSitemaps } from '@/scripts/build-sitemaps';

const BASE_URL = 'https://devtransform-hub.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  try {
    generateSitemaps(['public', 'out']);
  } catch (e) {
    console.error('Error in generateSitemaps:', e);
  }
  const currentDate = new Date();
  const routes: MetadataRoute.Sitemap = [];

  // 1. Homepage & EEAT Trust Pages
  routes.push(
    {
      url: `${BASE_URL}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/about/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/terms/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/contact/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    }
  );

  // 2. 90 Code Converters
  const matrixPairs = getAllMatrixPairs();
  matrixPairs.forEach((pair) => {
    routes.push({
      url: `${BASE_URL}/${pair.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 3. Timezone Pairs (Top 2450 world city pairs, boosted popular corridors)
  const popularSet = new Set(POPULAR_TIMEZONE_SLUGS);
  const tzPairs = getAllTimezonePairs();
  tzPairs.forEach((pair) => {
    routes.push({
      url: `${BASE_URL}/timezone/${pair.slug}/`,
      lastModified: currentDate,
      changeFrequency: popularSet.has(pair.slug) ? 'daily' : 'weekly',
      priority: popularSet.has(pair.slug) ? 1.0 : 0.7,
    });
  });

  // 4. Unit Conversion Pairs (350+ pairs)
  const unitPairs = getAllUnitPairs();
  unitPairs.forEach((pair) => {
    routes.push({
      url: `${BASE_URL}/convert/${pair.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  // 5. 525 Percentage Calculations
  const percentageProblems = getAllPercentageProblems();
  percentageProblems.forEach((prob) => {
    routes.push({
      url: `${BASE_URL}/percentage/${prob.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // 6. Color Code Converters
  const colors = getAllColorDefinitions();
  colors.forEach((col) => {
    routes.push({
      url: `${BASE_URL}/color/${col.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // 7. Text Transformations
  const textTransforms = getAllTextTransformations();
  textTransforms.forEach((t) => {
    routes.push({
      url: `${BASE_URL}/text/${t.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // 8. HTTP Status Codes
  const httpStatuses = getAllHttpStatuses();
  httpStatuses.forEach((status) => {
    routes.push({
      url: `${BASE_URL}/http-status/${status.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // 9. Cron Schedule Explanations
  const cronSchedules = getAllCronSchedules();
  cronSchedules.forEach((cron) => {
    routes.push({
      url: `${BASE_URL}/cron/${cron.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  // 10. Standalone Utilities
  TOOLS_METADATA.forEach((tool) => {
    routes.push({
      url: `${BASE_URL}/tools/${tool.slug}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // 11. Category Hubs
  Object.keys(CATEGORIES).forEach((category) => {
    routes.push({
      url: `${BASE_URL}/category/${category}/`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  });

  // 12. Formatters
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

import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://zeroupload-edb.pages.dev/sitemap.xml',
      'https://zeroupload-edb.pages.dev/sitemap-main.xml',
      'https://zeroupload-edb.pages.dev/sitemap-code.xml',
      'https://zeroupload-edb.pages.dev/sitemap-timezones.xml',
      'https://zeroupload-edb.pages.dev/sitemap-units.xml',
      'https://zeroupload-edb.pages.dev/sitemap-percentages.xml',
      'https://zeroupload-edb.pages.dev/sitemap-utils.xml',
    ],
  };
}

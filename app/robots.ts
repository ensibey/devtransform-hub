import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://devtransform-hub.vercel.app/sitemap.xml',
      'https://devtransform-hub.vercel.app/sitemap-main.xml',
      'https://devtransform-hub.vercel.app/sitemap-code.xml',
      'https://devtransform-hub.vercel.app/sitemap-timezones.xml',
      'https://devtransform-hub.vercel.app/sitemap-units.xml',
      'https://devtransform-hub.vercel.app/sitemap-percentages.xml',
      'https://devtransform-hub.vercel.app/sitemap-utils.xml',
    ],
  };
}

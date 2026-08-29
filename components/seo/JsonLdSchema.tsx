import React from 'react';
import { FormatMetadata } from '@/lib/matrix';
import { FaqItem } from './FaqAccordion';

export interface JsonLdSchemaProps {
  fromMeta?: FormatMetadata;
  toMeta?: FormatMetadata;
  formatterMeta?: FormatMetadata;
  faqs?: FaqItem[];
  url: string;
}

export function JsonLdSchema({
  fromMeta,
  toMeta,
  formatterMeta,
  faqs = [],
  url,
}: JsonLdSchemaProps) {
  const isConverter = fromMeta && toMeta;
  const isFormatter = !!formatterMeta;

  const appName = isConverter
    ? `${fromMeta.shortName} to ${toMeta.shortName} Converter`
    : isFormatter
    ? `${formatterMeta.shortName} Formatter & Beautifier`
    : 'DevTransform Developer Utility Suite';

  const appDesc = isConverter
    ? `Free client-side ${fromMeta.name} to ${toMeta.name} converter. Fast, zero server storage, runs 100% in your browser.`
    : isFormatter
    ? `Online ${formatterMeta.name} code formatter and syntax validator with instant client-side beautification.`
    : '100% client-side developer converters, formatters, and utility suite.';

  // 1. WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: appName,
    url: url,
    description: appDesc,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      '100% Client-Side Web Worker Execution',
      'Zero Server Telemetry or Cloud Data Storage',
      'Private URL Hash State Sharing',
      'Real-time Code Highlighting and Syntax Diagnostics',
    ],
  };

  // 2. BreadcrumbList Schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://devtransform-hub.vercel.app/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: isConverter ? 'Converters' : 'Formatters',
        item: isConverter
          ? 'https://devtransform-hub.vercel.app/#converters'
          : 'https://devtransform-hub.vercel.app/#formatters',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: appName,
        item: url,
      },
    ],
  };

  // 3. FAQPage Schema (if FAQs are present)
  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webAppSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema),
          }}
        />
      )}
    </>
  );
}

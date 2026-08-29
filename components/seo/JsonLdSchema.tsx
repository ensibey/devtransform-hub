import React from 'react';
import { FormatMetadata } from '@/lib/matrix';

export interface JsonLdSchemaProps {
  fromMeta?: FormatMetadata;
  toMeta?: FormatMetadata;
  formatterMeta?: FormatMetadata;
  url: string;
}

export function JsonLdSchema({ fromMeta, toMeta, formatterMeta, url }: JsonLdSchemaProps) {
  const isConverter = fromMeta && toMeta;

  const appName = isConverter
    ? `${fromMeta.shortName} to ${toMeta.shortName} Converter`
    : `${formatterMeta?.shortName || 'Code'} Formatter & Beautifier`;

  const appDescription = isConverter
    ? `Convert ${fromMeta.name} to ${toMeta.name} online in milliseconds. 100% client-side Web Worker execution, zero server transmission, and free code sharing.`
    : `Format, beautify, validate, and minify ${formatterMeta?.name || 'code'} directly in your browser.`;

  // 1. WebApplication Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: appName,
    url: url,
    description: appDescription,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any (Web Browser)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5 Web Workers.',
    permissions: 'none',
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
        item: 'https://devtransform.pages.dev/',
      },
      ...(isConverter
        ? [
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Converters',
              item: 'https://devtransform.pages.dev/',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: `${fromMeta.shortName} to ${toMeta.shortName}`,
              item: url,
            },
          ]
        : [
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Formatters',
              item: 'https://devtransform.pages.dev/formatters/',
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: `${formatterMeta?.shortName} Formatter`,
              item: url,
            },
          ]),
    ],
  };

  // 3. FAQPage Schema
  const faqSchema = isConverter
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: `How to convert ${fromMeta.shortName} to ${toMeta.shortName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `Paste or drag-and-drop your ${fromMeta.name} code into the source editor on the left. The Web Worker automatically parses the AST and generates idiomatic ${toMeta.name} in real time.`,
            },
          },
          {
            '@type': 'Question',
            name: 'Is my data transmitted to any external server or API?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. All conversions, syntax validation, and formatting execute 100% locally in your web browser via Web Workers. Zero bytes ever leave your machine.',
            },
          },
          {
            '@type': 'Question',
            name: `What is the difference between ${fromMeta.shortName} and ${toMeta.shortName}?`,
            acceptedAnswer: {
              '@type': 'Answer',
              text: `${fromMeta.description} In comparison, ${toMeta.description}`,
            },
          },
        ],
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}

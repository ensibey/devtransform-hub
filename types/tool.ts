import React from 'react';

export type ToolCategory = 'text' | 'image' | 'pdf' | 'calculator' | 'dev';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  category: ToolCategory;
  keywords: string[];
  icon: string; // Lucide icon name or identifier
  isPopular?: boolean;
  isNew?: boolean;
  seoDescription: string;
  faqs?: ToolFaq[];
  component: React.ComponentType;
}

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string; // Tailwind color class
  accentHex: string;
}

export const CATEGORIES: Record<ToolCategory, CategoryInfo> = {
  text: {
    id: 'text',
    name: 'Text & Content',
    slug: 'text',
    description: 'Word counters, case converters, text diffing, markdown previewers, and generators.',
    icon: 'FileText',
    color: 'emerald',
    accentHex: '#10b981',
  },
  image: {
    id: 'image',
    name: 'Image & Media',
    slug: 'image',
    description: 'Client-side image compression, format conversion, QR code generator, and color extractors.',
    icon: 'Image',
    color: 'sky',
    accentHex: '#0ea5e9',
  },
  pdf: {
    id: 'pdf',
    name: 'PDF & Documents',
    slug: 'pdf',
    description: '100% private in-browser PDF merging, splitting, image-to-PDF, and page rotation.',
    icon: 'FileSpreadsheet',
    color: 'rose',
    accentHex: '#f43f5e',
  },
  calculator: {
    id: 'calculator',
    name: 'Daily Calculators',
    slug: 'calculator',
    description: 'Percentages, responsive aspect ratios, timezone comparisons, and unit conversions.',
    icon: 'Calculator',
    color: 'amber',
    accentHex: '#f59e0b',
  },
  dev: {
    id: 'dev',
    name: 'Developer & Data',
    slug: 'dev',
    description: 'JSON formatters, Base64 encoder, Web Crypto hashes, UUID generators, and JWT decoders.',
    icon: 'Code2',
    color: 'violet',
    accentHex: '#8b5cf6',
  },
};

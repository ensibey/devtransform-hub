import { TOOLS_REGISTRY } from '@/lib/registry';

export type ToolCategoryKey =
  | 'all'
  | 'pdf'
  | 'image'
  | 'text'
  | 'dev'
  | 'converters'
  | 'calculators';

export interface CategoryFilterItem {
  key: ToolCategoryKey;
  label: string;
  iconName: string;
}

export interface DeveloperToolItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ToolCategoryKey;
  categoryLabel: string;
  icon: string;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  path: string;
}

export const CATEGORY_FILTERS: CategoryFilterItem[] = [
  { key: 'all', label: 'All Tools', iconName: 'Sparkles' },
  { key: 'dev', label: '💻 Developer & Code', iconName: 'Terminal' },
  { key: 'text', label: '✍️ Text & Content', iconName: 'FileText' },
  { key: 'image', label: '🖼️ Image & Media', iconName: 'Image' },
  { key: 'pdf', label: '📄 PDF & Documents', iconName: 'FileSpreadsheet' },
  { key: 'calculators', label: '🧮 Math & Calculators', iconName: 'Calculator' },
  { key: 'converters', label: '🔄 Code Converters', iconName: 'ArrowRightLeft' },
];

const CATEGORY_LABEL_MAP: Record<string, { key: ToolCategoryKey; label: string }> = {
  text: { key: 'text', label: 'Text & Content' },
  image: { key: 'image', label: 'Image & Media' },
  pdf: { key: 'pdf', label: 'PDF & Documents' },
  dev: { key: 'dev', label: 'Developer & Code' },
  calculator: { key: 'calculators', label: 'Calculators' },
};

export const DEVELOPER_TOOLS: DeveloperToolItem[] = TOOLS_REGISTRY.map((t) => {
  const cat = CATEGORY_LABEL_MAP[t.category] || { key: 'dev', label: 'Developer' };
  return {
    id: t.id,
    slug: t.slug,
    title: t.title,
    description: t.shortDesc,
    category: cat.key,
    categoryLabel: cat.label,
    icon: t.icon || 'Code2',
    tags: t.keywords.map((k) => `#${k.replace(/\s+/g, '')}`),
    isPopular: t.isPopular,
    isNew: t.isNew,
    path: `/tools/${t.slug}/`,
  };
});

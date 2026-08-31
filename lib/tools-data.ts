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
  { key: 'all', label: 'Tüm Araçlar / All Tools', iconName: 'Sparkles' },
  { key: 'dev', label: '💻 Geliştirici & API (Dev)', iconName: 'Terminal' },
  { key: 'text', label: '✍️ Metin & Yazı (Text)', iconName: 'FileText' },
  { key: 'image', label: '🖼️ Görsel & Fotoğraf (Image)', iconName: 'Image' },
  { key: 'pdf', label: '📄 PDF & Belgeler', iconName: 'FileSpreadsheet' },
  { key: 'calculators', label: '🧮 Hesaplayıcılar (Calc)', iconName: 'Calculator' },
  { key: 'converters', label: '🔄 Kod Dönüştürücüler', iconName: 'ArrowRightLeft' },
];

const CATEGORY_LABEL_MAP: Record<string, { key: ToolCategoryKey; label: string }> = {
  text: { key: 'text', label: 'Metin & Yazı' },
  image: { key: 'image', label: 'Görsel & Fotoğraf' },
  pdf: { key: 'pdf', label: 'PDF & Belgeler' },
  dev: { key: 'dev', label: 'Geliştirici & Kod' },
  calculator: { key: 'calculators', label: 'Hesaplayıcılar' },
};

export const DEVELOPER_TOOLS: DeveloperToolItem[] = TOOLS_REGISTRY.map((t) => {
  const cat = CATEGORY_LABEL_MAP[t.category] || { key: 'dev', label: 'Geliştirici' };
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

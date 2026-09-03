export interface ShadowPreset {
  slug: string;
  title: string;
  category: 'cards' | 'glow' | 'buttons' | 'glass' | 'elevation';
  cssValue: string;
  tailwindClass: string;
  description: string;
}

export const SHADOW_PRESETS: ShadowPreset[] = [
  {
    slug: 'subtle-card-shadow',
    title: 'Subtle Modern Card Shadow',
    category: 'cards',
    cssValue: 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);',
    tailwindClass: 'shadow-md',
    description: 'Clean, versatile elevation shadow for dashboard cards and modern web interfaces.',
  },
  {
    slug: 'soft-layered-elevation',
    title: 'Soft Layered Elevation Shadow',
    category: 'elevation',
    cssValue: 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);',
    tailwindClass: 'shadow-lg',
    description: 'High-aesthetic dual-layer box shadow ideal for modal dialogs and dropdown menus.',
  },
  {
    slug: 'emerald-neon-glow',
    title: 'Cyberpunk Emerald Neon Glow',
    category: 'glow',
    cssValue: 'box-shadow: 0 0 20px rgba(16, 185, 129, 0.4), 0 0 40px rgba(16, 185, 129, 0.2);',
    tailwindClass: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    description: 'Vibrant neon emerald backlight glow for active badges, highlights, and futuristic buttons.',
  },
  {
    slug: 'sky-blue-ambient-glow',
    title: 'Sky Blue Ambient Backlight',
    category: 'glow',
    cssValue: 'box-shadow: 0 0 25px rgba(56, 189, 248, 0.35), 0 0 50px rgba(56, 189, 248, 0.15);',
    tailwindClass: 'shadow-[0_0_25px_rgba(56,189,248,0.35)]',
    description: 'Soft electric blue radiance for SaaS feature cards and hero image containers.',
  },
  {
    slug: 'floating-action-button',
    title: 'Floating Action Button (FAB) Shadow',
    category: 'buttons',
    cssValue: 'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2);',
    tailwindClass: 'shadow-xl',
    description: 'Deep high-contrast shadow designed for call-to-action buttons that appear above the page.',
  },
  {
    slug: 'inner-pressed-inset-shadow',
    title: 'Inner Pressed Inset Shadow',
    category: 'elevation',
    cssValue: 'box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.25);',
    tailwindClass: 'shadow-inner',
    description: 'Recessed inset shadow giving input fields and pressed toggle buttons a tactile feel.',
  },
  {
    slug: 'glassmorphism-border-shadow',
    title: 'Glassmorphism Frosted Border Shadow',
    category: 'glass',
    cssValue: 'box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);',
    tailwindClass: 'shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]',
    description: 'Smooth broad dispersion shadow designed to sit underneath frosted glass blur backgrounds.',
  },
  {
    slug: 'sharp-brutalist-offset-shadow',
    title: 'Neo-Brutalist Hard Offset Shadow',
    category: 'elevation',
    cssValue: 'box-shadow: 5px 5px 0px 0px rgba(0, 0, 0, 1);',
    tailwindClass: 'shadow-[5px_5px_0px_0px_rgba(0,0,0,1)]',
    description: 'Bold zero-blur hard edge shadow popular in neo-brutalist web design and Web3 apps.',
  },
  {
    slug: 'violet-purple-glow',
    title: 'Violet Radiant Purple Glow',
    category: 'glow',
    cssValue: 'box-shadow: 0 0 25px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.2);',
    tailwindClass: 'shadow-[0_0_25px_rgba(139,92,246,0.4)]',
    description: 'Mystical purple diffused halo shadow for AI products and luxury dark mode designs.',
  },
  {
    slug: 'warm-amber-sunburst-glow',
    title: 'Warm Amber Sunburst Glow',
    category: 'glow',
    cssValue: 'box-shadow: 0 0 30px rgba(245, 158, 11, 0.35);',
    tailwindClass: 'shadow-[0_0_30px_rgba(245,158,11,0.35)]',
    description: 'Warm glowing aura for badges, star icons, and premium subscription feature highlights.',
  },
];

export function getAllShadowPresets(): ShadowPreset[] {
  return SHADOW_PRESETS;
}

export function getShadowPreset(slug: string): ShadowPreset | null {
  return SHADOW_PRESETS.find((s) => s.slug === slug) || null;
}

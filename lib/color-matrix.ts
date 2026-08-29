export interface ColorDefinition {
  hex: string;
  name: string;
  nameTr: string;
  slug: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  cmyk: [number, number, number, number];
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  if (k === 1) return [0, 0, 0, 100];
  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  return [c, m, y, Math.round(k * 100)];
}

const RAW_COLORS: [string, string, string][] = [
  ['#000000', 'Black', 'Siyah'],
  ['#FFFFFF', 'White', 'Beyaz'],
  ['#10B981', 'Emerald Green', 'Zümrüt Yeşili'],
  ['#6366F1', 'Indigo Blue', 'İndigo Mavisi'],
  ['#EF4444', 'Red', 'Kırmızı'],
  ['#3B82F6', 'Blue', 'Mavi'],
  ['#F59E0B', 'Amber / Orange', 'Kehribar / Turuncu'],
  ['#EC4899', 'Pink', 'Pembe'],
  ['#8B5CF6', 'Purple / Violet', 'Mor / Menekşe'],
  ['#14B8A6', 'Teal', 'Camgöbeği'],
  ['#84CC16', 'Lime Green', 'Açık Yeşil'],
  ['#06B6D4', 'Cyan', 'Açık Mavi'],
  ['#64748B', 'Slate Gray', 'Arduvaz Grisi'],
  ['#71717A', 'Zinc Gray', 'Çinko Grisi'],
  ['#78716C', 'Stone Gray', 'Taş Grisi'],
  ['#DC2626', 'Crimson Red', 'Koyu Kırmızı'],
  ['#EA580C', 'Dark Orange', 'Koyu Turuncu'],
  ['#D97706', 'Ochre Amber', 'Koyu Kehribar'],
  ['#16A34A', 'Forest Green', 'Orman Yeşili'],
  ['#0D9488', 'Dark Teal', 'Koyu Camgöbeği'],
  ['#0284C7', 'Sky Blue', 'Gök Mavisi'],
  ['#2563EB', 'Royal Blue', 'Kraliyet Mavisi'],
  ['#4F46E5', 'Deep Indigo', 'Koyu İndigo'],
  ['#7C3AED', 'Deep Violet', 'Koyu Mor'],
  ['#C026D3', 'Fuchsia', 'Fuşya'],
  ['#DB2777', 'Hot Pink', 'Canlı Pembe'],
  ['#E11D48', 'Ruby Rose', 'Yakut Gülü'],
  ['#FF5733', 'Coral Red', 'Mercan Kırmızısı'],
  ['#33FF57', 'Neon Green', 'Neon Yeşili'],
  ['#3357FF', 'Electric Blue', 'Elektrik Mavisi'],
  ['#FF33F5', 'Neon Pink', 'Neon Pembesi'],
  ['#33FFF5', 'Aqua Cyan', 'Turkuaz'],
  ['#FFE933', 'Bright Yellow', 'Parlak Sarı'],
];

export const POPULAR_COLORS: ColorDefinition[] = RAW_COLORS.map(([hex, name, nameTr]) => {
  const cleanHex = hex.replace('#', '').toLowerCase();
  const rgb = hexToRgb(hex);
  const hsl = rgbToHsl(rgb[0], rgb[1], rgb[2]);
  const cmyk = rgbToCmyk(rgb[0], rgb[1], rgb[2]);
  return {
    hex: hex.toUpperCase(),
    name,
    nameTr,
    slug: `hex-${cleanHex}-to-rgb`,
    rgb,
    hsl,
    cmyk,
  };
});

export function getAllColorDefinitions(): ColorDefinition[] {
  return POPULAR_COLORS;
}

export function getColorBySlug(slug: string): ColorDefinition | undefined {
  return POPULAR_COLORS.find((c) => c.slug === slug || c.hex.replace('#', '').toLowerCase() === slug.replace('hex-', '').replace('-to-rgb', '').toLowerCase());
}

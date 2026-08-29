export type UnitCategory =
  | 'length'
  | 'weight'
  | 'data'
  | 'temperature'
  | 'speed'
  | 'area'
  | 'volume'
  | 'time';

export interface UnitDefinition {
  slug: string;
  name: string;
  nameTr: string;
  symbol: string;
  category: UnitCategory;
  categoryName: string;
  categoryNameTr: string;
  baseRatio: number; // Ratio relative to SI base unit
}

export const UNITS: UnitDefinition[] = [
  // 1. Length (SI base: meter)
  { slug: 'meter', name: 'Meter', nameTr: 'Metre', symbol: 'm', category: 'length', categoryName: 'Length', categoryNameTr: 'Uzunluk', baseRatio: 1 },
  { slug: 'kilometer', name: 'Kilometer', nameTr: 'Kilometre', symbol: 'km', category: 'length', categoryName: 'Length', categoryNameTr: 'Uzunluk', baseRatio: 1000 },
  { slug: 'centimeter', name: 'Centimeter', nameTr: 'Santimetre', symbol: 'cm', category: 'length', categoryName: 'Length', categoryNameTr: 'Uzunluk', baseRatio: 0.01 },
  { slug: 'millimeter', name: 'Millimeter', nameTr: 'Milimetre', symbol: 'mm', category: 'length', categoryName: 'Length', categoryNameTr: 'Uzunluk', baseRatio: 0.001 },
  { slug: 'mile', name: 'Mile', nameTr: 'Mil', symbol: 'mi', category: 'length', categoryName: 'Length', categoryNameTr: 'Uzunluk', baseRatio: 1609.344 },
  { slug: 'yard', name: 'Yard', nameTr: 'Yarda', symbol: 'yd', category: 'length', categoryName: 'Length', categoryNameTr: 'Uzunluk', baseRatio: 0.9144 },
  { slug: 'foot', name: 'Foot', nameTr: 'Fit (Foot)', symbol: 'ft', category: 'length', categoryName: 'Length', categoryNameTr: 'Uzunluk', baseRatio: 0.3048 },
  { slug: 'inch', name: 'Inch', nameTr: 'İnç', symbol: 'in', category: 'length', categoryName: 'Length', categoryNameTr: 'Uzunluk', baseRatio: 0.0254 },

  // 2. Weight / Mass (SI base: gram)
  { slug: 'gram', name: 'Gram', nameTr: 'Gram', symbol: 'g', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Ağırlık', baseRatio: 1 },
  { slug: 'kilogram', name: 'Kilogram', nameTr: 'Kilogram', symbol: 'kg', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Ağırlık', baseRatio: 1000 },
  { slug: 'milligram', name: 'Milligram', nameTr: 'Miligram', symbol: 'mg', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Ağırlık', baseRatio: 0.001 },
  { slug: 'metric-ton', name: 'Metric Ton', nameTr: 'Ton', symbol: 't', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Ağırlık', baseRatio: 1000000 },
  { slug: 'pound', name: 'Pound (lbs)', nameTr: 'Pound (Libre)', symbol: 'lb', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Ağırlık', baseRatio: 453.59237 },
  { slug: 'ounce', name: 'Ounce (oz)', nameTr: 'Ons', symbol: 'oz', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Ağırlık', baseRatio: 28.349523 },

  // 3. Digital Data Storage (SI base: byte)
  { slug: 'byte', name: 'Byte', nameTr: 'Bayt', symbol: 'B', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 1 },
  { slug: 'kilobyte', name: 'Kilobyte', nameTr: 'Kilobayt', symbol: 'KB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 1024 },
  { slug: 'megabyte', name: 'Megabyte', nameTr: 'Megabayt', symbol: 'MB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 1048576 },
  { slug: 'gigabyte', name: 'Gigabyte', nameTr: 'Gigabayt', symbol: 'GB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 1073741824 },
  { slug: 'terabyte', name: 'Terabyte', nameTr: 'Terabayt', symbol: 'TB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 1099511627776 },
  { slug: 'petabyte', name: 'Petabyte', nameTr: 'Petabayt', symbol: 'PB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 1125899906842624 },
  { slug: 'bit', name: 'Bit', nameTr: 'Bit', symbol: 'b', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 0.125 },
  { slug: 'megabit', name: 'Megabit', nameTr: 'Megabit', symbol: 'Mb', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 131072 },
  { slug: 'gigabit', name: 'Gigabit', nameTr: 'Gigabit', symbol: 'Gb', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Veri & Bellek', baseRatio: 134217728 },

  // 4. Speed (SI base: m/s)
  { slug: 'meter-per-second', name: 'Meter per Second', nameTr: 'Metre / Saniye', symbol: 'm/s', category: 'speed', categoryName: 'Speed', categoryNameTr: 'Hız', baseRatio: 1 },
  { slug: 'kilometer-per-hour', name: 'Kilometer per Hour', nameTr: 'Kilometre / Saat', symbol: 'km/h', category: 'speed', categoryName: 'Speed', categoryNameTr: 'Hız', baseRatio: 0.277778 },
  { slug: 'mile-per-hour', name: 'Mile per Hour', nameTr: 'Mil / Saat (mph)', symbol: 'mph', category: 'speed', categoryName: 'Speed', categoryNameTr: 'Hız', baseRatio: 0.44704 },
  { slug: 'knot', name: 'Knot (Nautical Mile/h)', nameTr: 'Knot (Deniz Mili/Saat)', symbol: 'kn', category: 'speed', categoryName: 'Speed', categoryNameTr: 'Hız', baseRatio: 0.514444 },

  // 5. Area (SI base: square meter)
  { slug: 'square-meter', name: 'Square Meter', nameTr: 'Metrekare', symbol: 'm²', category: 'area', categoryName: 'Area', categoryNameTr: 'Alan', baseRatio: 1 },
  { slug: 'square-kilometer', name: 'Square Kilometer', nameTr: 'Kilometrekare', symbol: 'km²', category: 'area', categoryName: 'Area', categoryNameTr: 'Alan', baseRatio: 1000000 },
  { slug: 'square-foot', name: 'Square Foot', nameTr: 'Fitkare (sq ft)', symbol: 'sq ft', category: 'area', categoryName: 'Area', categoryNameTr: 'Alan', baseRatio: 0.092903 },
  { slug: 'hectare', name: 'Hectare', nameTr: 'Hektar', symbol: 'ha', category: 'area', categoryName: 'Area', categoryNameTr: 'Alan', baseRatio: 10000 },
  { slug: 'acre', name: 'Acre', nameTr: 'Akre (Dönüm Benzeri)', symbol: 'ac', category: 'area', categoryName: 'Area', categoryNameTr: 'Alan', baseRatio: 4046.856422 },

  // 6. Volume (SI base: liter)
  { slug: 'liter', name: 'Liter', nameTr: 'Litre', symbol: 'L', category: 'volume', categoryName: 'Volume', categoryNameTr: 'Hacim', baseRatio: 1 },
  { slug: 'milliliter', name: 'Milliliter', nameTr: 'Mililitre', symbol: 'mL', category: 'volume', categoryName: 'Volume', categoryNameTr: 'Hacim', baseRatio: 0.001 },
  { slug: 'cubic-meter', name: 'Cubic Meter', nameTr: 'Metreküp', symbol: 'm³', category: 'volume', categoryName: 'Volume', categoryNameTr: 'Hacim', baseRatio: 1000 },
  { slug: 'gallon', name: 'Gallon (US)', nameTr: 'Galon (ABD)', symbol: 'gal', category: 'volume', categoryName: 'Volume', categoryNameTr: 'Hacim', baseRatio: 3.78541 },
];

export interface UnitPair {
  slug: string;
  from: UnitDefinition;
  to: UnitDefinition;
  multiplier: number; // to = from * multiplier
}

export function getAllUnitPairs(): UnitPair[] {
  const pairs: UnitPair[] = [];

  // Only pair units that belong to the SAME category
  const categories: UnitCategory[] = ['length', 'weight', 'data', 'speed', 'area', 'volume'];

  categories.forEach((cat) => {
    const catUnits = UNITS.filter((u) => u.category === cat);
    for (let i = 0; i < catUnits.length; i++) {
      for (let j = 0; j < catUnits.length; j++) {
        if (i !== j) {
          const from = catUnits[i];
          const to = catUnits[j];
          const multiplier = from.baseRatio / to.baseRatio;
          pairs.push({
            slug: `${from.slug}-to-${to.slug}`,
            from,
            to,
            multiplier,
          });
        }
      }
    }
  });

  return pairs;
}

export function getUnitPair(slug: string): UnitPair | null {
  const parts = slug.split('-to-');
  if (parts.length !== 2) return null;

  const from = UNITS.find((u) => u.slug === parts[0]);
  const to = UNITS.find((u) => u.slug === parts[1]);

  if (!from || !to || from.category !== to.category) return null;

  return {
    slug,
    from,
    to,
    multiplier: from.baseRatio / to.baseRatio,
  };
}

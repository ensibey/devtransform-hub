export type UnitCategory =
  | 'length'
  | 'weight'
  | 'data'
  | 'temperature'
  | 'speed'
  | 'area'
  | 'volume'
  | 'pressure'
  | 'time'
  | 'energy'
  | 'angle';

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
  { slug: 'meter', name: 'Meter', nameTr: 'Metre', symbol: 'm', category: 'length', categoryName: 'Length', categoryNameTr: 'Length', baseRatio: 1 },
  { slug: 'kilometer', name: 'Kilometer', nameTr: 'Kilometre', symbol: 'km', category: 'length', categoryName: 'Length', categoryNameTr: 'Length', baseRatio: 1000 },
  { slug: 'centimeter', name: 'Centimeter', nameTr: 'Santimetre', symbol: 'cm', category: 'length', categoryName: 'Length', categoryNameTr: 'Length', baseRatio: 0.01 },
  { slug: 'millimeter', name: 'Millimeter', nameTr: 'Milimetre', symbol: 'mm', category: 'length', categoryName: 'Length', categoryNameTr: 'Length', baseRatio: 0.001 },
  { slug: 'mile', name: 'Mile', nameTr: 'Mil', symbol: 'mi', category: 'length', categoryName: 'Length', categoryNameTr: 'Length', baseRatio: 1609.344 },
  { slug: 'yard', name: 'Yard', nameTr: 'Yarda', symbol: 'yd', category: 'length', categoryName: 'Length', categoryNameTr: 'Length', baseRatio: 0.9144 },
  { slug: 'foot', name: 'Foot', nameTr: 'Foot', symbol: 'ft', category: 'length', categoryName: 'Length', categoryNameTr: 'Length', baseRatio: 0.3048 },
  { slug: 'inch', name: 'Inch', nameTr: 'Inch', symbol: 'in', category: 'length', categoryName: 'Length', categoryNameTr: 'Length', baseRatio: 0.0254 },

  // 2. Weight / Mass (SI base: gram)
  { slug: 'gram', name: 'Gram', nameTr: 'Gram', symbol: 'g', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Weight', baseRatio: 1 },
  { slug: 'kilogram', name: 'Kilogram', nameTr: 'Kilogram', symbol: 'kg', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Weight', baseRatio: 1000 },
  { slug: 'milligram', name: 'Milligram', nameTr: 'Miligram', symbol: 'mg', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Weight', baseRatio: 0.001 },
  { slug: 'metric-ton', name: 'Metric Ton', nameTr: 'Ton', symbol: 't', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Weight', baseRatio: 1000000 },
  { slug: 'pound', name: 'Pound (lbs)', nameTr: 'Pound (lbs)', symbol: 'lb', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Weight', baseRatio: 453.59237 },
  { slug: 'ounce', name: 'Ounce (oz)', nameTr: 'Ounce (oz)', symbol: 'oz', category: 'weight', categoryName: 'Weight', categoryNameTr: 'Weight', baseRatio: 28.349523 },

  // 3. Digital Data Storage (SI base: byte)
  { slug: 'byte', name: 'Byte', nameTr: 'Byte', symbol: 'B', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 1 },
  { slug: 'kilobyte', name: 'Kilobyte', nameTr: 'Kilobyte', symbol: 'KB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 1024 },
  { slug: 'megabyte', name: 'Megabyte', nameTr: 'Megabyte', symbol: 'MB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 1048576 },
  { slug: 'gigabyte', name: 'Gigabyte', nameTr: 'Gigabyte', symbol: 'GB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 1073741824 },
  { slug: 'terabyte', name: 'Terabyte', nameTr: 'Terabyte', symbol: 'TB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 1099511627776 },
  { slug: 'petabyte', name: 'Petabyte', nameTr: 'Petabyte', symbol: 'PB', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 1125899906842624 },
  { slug: 'bit', name: 'Bit', nameTr: 'Bit', symbol: 'b', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 0.125 },
  { slug: 'megabit', name: 'Megabit', nameTr: 'Megabit', symbol: 'Mb', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 131072 },
  { slug: 'gigabit', name: 'Gigabit', nameTr: 'Gigabit', symbol: 'Gb', category: 'data', categoryName: 'Data Storage', categoryNameTr: 'Data Storage', baseRatio: 134217728 },

  // 4. Speed (SI base: m/s)
  { slug: 'meter-per-second', name: 'Meter per Second', nameTr: 'Meter per Second', symbol: 'm/s', category: 'speed', categoryName: 'Speed', categoryNameTr: 'Speed', baseRatio: 1 },
  { slug: 'kilometer-per-hour', name: 'Kilometer per Hour', nameTr: 'Kilometer per Hour', symbol: 'km/h', category: 'speed', categoryName: 'Speed', categoryNameTr: 'Speed', baseRatio: 0.277778 },
  { slug: 'mile-per-hour', name: 'Mile per Hour', nameTr: 'Mile per Hour (mph)', symbol: 'mph', category: 'speed', categoryName: 'Speed', categoryNameTr: 'Speed', baseRatio: 0.44704 },
  { slug: 'knot', name: 'Knot (Nautical Mile/h)', nameTr: 'Knot', symbol: 'kn', category: 'speed', categoryName: 'Speed', categoryNameTr: 'Speed', baseRatio: 0.514444 },

  // 5. Area (SI base: square meter)
  { slug: 'square-meter', name: 'Square Meter', nameTr: 'Square Meter', symbol: 'm²', category: 'area', categoryName: 'Area', categoryNameTr: 'Area', baseRatio: 1 },
  { slug: 'square-kilometer', name: 'Square Kilometer', nameTr: 'Square Kilometer', symbol: 'km²', category: 'area', categoryName: 'Area', categoryNameTr: 'Area', baseRatio: 1000000 },
  { slug: 'square-foot', name: 'Square Foot', nameTr: 'Square Foot (sq ft)', symbol: 'sq ft', category: 'area', categoryName: 'Area', categoryNameTr: 'Area', baseRatio: 0.092903 },
  { slug: 'hectare', name: 'Hectare', nameTr: 'Hectare', symbol: 'ha', category: 'area', categoryName: 'Area', categoryNameTr: 'Area', baseRatio: 10000 },
  { slug: 'acre', name: 'Acre', nameTr: 'Acre', symbol: 'ac', category: 'area', categoryName: 'Area', categoryNameTr: 'Area', baseRatio: 4046.856422 },

  // 6. Volume (SI base: liter)
  { slug: 'liter', name: 'Liter', nameTr: 'Liter', symbol: 'L', category: 'volume', categoryName: 'Volume', categoryNameTr: 'Volume', baseRatio: 1 },
  { slug: 'milliliter', name: 'Milliliter', nameTr: 'Milliliter', symbol: 'mL', category: 'volume', categoryName: 'Volume', categoryNameTr: 'Volume', baseRatio: 0.001 },
  { slug: 'cubic-meter', name: 'Cubic Meter', nameTr: 'Cubic Meter', symbol: 'm³', category: 'volume', categoryName: 'Volume', categoryNameTr: 'Volume', baseRatio: 1000 },
  { slug: 'gallon', name: 'Gallon (US)', nameTr: 'Gallon (US)', symbol: 'gal', category: 'volume', categoryName: 'Volume', categoryNameTr: 'Volume', baseRatio: 3.78541 },

  // 7. Pressure (SI base: Pascal)
  { slug: 'pascal', name: 'Pascal', nameTr: 'Pascal', symbol: 'Pa', category: 'pressure', categoryName: 'Pressure', categoryNameTr: 'Pressure', baseRatio: 1 },
  { slug: 'kilopascal', name: 'Kilopascal', nameTr: 'Kilopascal', symbol: 'kPa', category: 'pressure', categoryName: 'Pressure', categoryNameTr: 'Pressure', baseRatio: 1000 },
  { slug: 'bar', name: 'Bar', nameTr: 'Bar', symbol: 'bar', category: 'pressure', categoryName: 'Pressure', categoryNameTr: 'Pressure', baseRatio: 100000 },
  { slug: 'psi', name: 'Pounds per Square Inch (PSI)', nameTr: 'PSI', symbol: 'psi', category: 'pressure', categoryName: 'Pressure', categoryNameTr: 'Pressure', baseRatio: 6894.76 },
  { slug: 'atmosphere', name: 'Standard Atmosphere', nameTr: 'Atmosphere (atm)', symbol: 'atm', category: 'pressure', categoryName: 'Pressure', categoryNameTr: 'Pressure', baseRatio: 101325 },

  // 8. Time (SI base: Second)
  { slug: 'second', name: 'Second', nameTr: 'Second', symbol: 's', category: 'time', categoryName: 'Time', categoryNameTr: 'Time', baseRatio: 1 },
  { slug: 'millisecond', name: 'Millisecond', nameTr: 'Millisecond', symbol: 'ms', category: 'time', categoryName: 'Time', categoryNameTr: 'Time', baseRatio: 0.001 },
  { slug: 'minute', name: 'Minute', nameTr: 'Minute', symbol: 'min', category: 'time', categoryName: 'Time', categoryNameTr: 'Time', baseRatio: 60 },
  { slug: 'hour', name: 'Hour', nameTr: 'Hour', symbol: 'hr', category: 'time', categoryName: 'Time', categoryNameTr: 'Time', baseRatio: 3600 },
  { slug: 'day', name: 'Day', nameTr: 'Day', symbol: 'd', category: 'time', categoryName: 'Time', categoryNameTr: 'Time', baseRatio: 86400 },
  { slug: 'week', name: 'Week', nameTr: 'Week', symbol: 'wk', category: 'time', categoryName: 'Time', categoryNameTr: 'Time', baseRatio: 604800 },
  { slug: 'year', name: 'Year (365 days)', nameTr: 'Year', symbol: 'yr', category: 'time', categoryName: 'Time', categoryNameTr: 'Time', baseRatio: 31536000 },

  // 9. Energy (SI base: Joule)
  { slug: 'joule', name: 'Joule', nameTr: 'Joule', symbol: 'J', category: 'energy', categoryName: 'Energy', categoryNameTr: 'Energy', baseRatio: 1 },
  { slug: 'kilojoule', name: 'Kilojoule', nameTr: 'Kilojoule', symbol: 'kJ', category: 'energy', categoryName: 'Energy', categoryNameTr: 'Energy', baseRatio: 1000 },
  { slug: 'calorie', name: 'Calorie (cal)', nameTr: 'Calorie', symbol: 'cal', category: 'energy', categoryName: 'Energy', categoryNameTr: 'Energy', baseRatio: 4.184 },
  { slug: 'kilocalorie', name: 'Kilocalorie (kcal)', nameTr: 'Kilocalorie', symbol: 'kcal', category: 'energy', categoryName: 'Energy', categoryNameTr: 'Energy', baseRatio: 4184 },
  { slug: 'watt-hour', name: 'Watt-hour', nameTr: 'Watt-hour', symbol: 'Wh', category: 'energy', categoryName: 'Energy', categoryNameTr: 'Energy', baseRatio: 3600 },
  { slug: 'kilowatt-hour', name: 'Kilowatt-hour (kWh)', nameTr: 'Kilowatt-hour', symbol: 'kWh', category: 'energy', categoryName: 'Energy', categoryNameTr: 'Energy', baseRatio: 3600000 },
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
  const categories: UnitCategory[] = [
    'length',
    'weight',
    'data',
    'speed',
    'area',
    'volume',
    'pressure',
    'time',
    'energy',
  ];

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

  const multiplier = from.baseRatio / to.baseRatio;

  return {
    slug,
    from,
    to,
    multiplier,
  };
}

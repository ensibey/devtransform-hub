'use client';

import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

type UnitCategory = 'length' | 'weight' | 'temp' | 'data' | 'speed';

const CONVERSIONS: Record<
  UnitCategory,
  {
    name: string;
    units: { id: string; name: string; toBase: (v: number) => number; fromBase: (v: number) => number }[];
  }
> = {
  length: {
    name: 'Length & Distance',
    units: [
      { id: 'm', name: 'Meters (m)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'km', name: 'Kilometers (km)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
      { id: 'cm', name: 'Centimeters (cm)', toBase: (v) => v / 100, fromBase: (v) => v * 100 },
      { id: 'mm', name: 'Millimeters (mm)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'ft', name: 'Feet (ft)', toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
      { id: 'in', name: 'Inches (in)', toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
      { id: 'mi', name: 'Miles (mi)', toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    ],
  },
  weight: {
    name: 'Weight & Mass',
    units: [
      { id: 'kg', name: 'Kilograms (kg)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'g', name: 'Grams (g)', toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
      { id: 'mg', name: 'Milligrams (mg)', toBase: (v) => v / 1e6, fromBase: (v) => v * 1e6 },
      { id: 'lb', name: 'Pounds (lb)', toBase: (v) => v * 0.45359237, fromBase: (v) => v / 0.45359237 },
      { id: 'oz', name: 'Ounces (oz)', toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
      { id: 'ton', name: 'Metric Tons (t)', toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    ],
  },
  temp: {
    name: 'Temperature',
    units: [
      { id: 'c', name: 'Celsius (°C)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', name: 'Fahrenheit (°F)', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', name: 'Kelvin (K)', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  data: {
    name: 'Data Storage',
    units: [
      { id: 'b', name: 'Bytes (B)', toBase: (v) => v, fromBase: (v) => v },
      { id: 'kb', name: 'Kilobytes (KB)', toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
      { id: 'mb', name: 'Megabytes (MB)', toBase: (v) => v * 1024 ** 2, fromBase: (v) => v / 1024 ** 2 },
      { id: 'gb', name: 'Gigabytes (GB)', toBase: (v) => v * 1024 ** 3, fromBase: (v) => v / 1024 ** 3 },
      { id: 'tb', name: 'Terabytes (TB)', toBase: (v) => v * 1024 ** 4, fromBase: (v) => v / 1024 ** 4 },
    ],
  },
  speed: {
    name: 'Speed',
    units: [
      { id: 'kmh', name: 'km/h', toBase: (v) => v, fromBase: (v) => v },
      { id: 'mph', name: 'Miles per hour (mph)', toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
      { id: 'ms', name: 'Meters per second (m/s)', toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
      { id: 'knot', name: 'Knots', toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
    ],
  },
};

export function UnitConverter() {
  const [category, setCategory] = useState<UnitCategory>('length');
  const catConfig = CONVERSIONS[category];

  const [fromUnit, setFromUnit] = useState(catConfig.units[0].id);
  const [toUnit, setToUnit] = useState(catConfig.units[1].id);
  const [value, setValue] = useState<number>(100);

  const calculateResult = () => {
    const fromObj = catConfig.units.find((u) => u.id === fromUnit) || catConfig.units[0];
    const toObj = catConfig.units.find((u) => u.id === toUnit) || catConfig.units[1];
    const baseValue = fromObj.toBase(value);
    const converted = toObj.fromBase(baseValue);
    return converted.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const handleSwap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const handleCategoryChange = (cat: UnitCategory) => {
    setCategory(cat);
    setFromUnit(CONVERSIONS[cat].units[0].id);
    setToUnit(CONVERSIONS[cat].units[1].id);
  };

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(CONVERSIONS).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => handleCategoryChange(key as UnitCategory)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              category === key
                ? 'bg-brand-emerald/10 text-brand-emerald border-brand-emerald/40'
                : 'bg-surface-200 hover:bg-surface-50 text-zinc-300 border-border'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="p-6 rounded-2xl bg-surface-200 border border-border space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          {/* From */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-zinc-400 font-mono text-xs">FROM</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
              className="w-full bg-surface-300 border border-border rounded-xl p-3 text-zinc-100 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-brand-emerald"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full bg-surface-300 border border-border rounded-xl p-2.5 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald"
            >
              {catConfig.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-xl bg-surface-300 hover:bg-surface-50 text-zinc-300 hover:text-brand-emerald border border-border transition-all"
              title="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* To */}
          <div className="md:col-span-2 space-y-2">
            <label className="block text-zinc-400 font-mono text-xs">TO</label>
            <div className="w-full bg-oled border border-border rounded-xl p-3 text-brand-emerald font-mono font-bold text-sm min-h-[46px] flex items-center">
              {calculateResult()}
            </div>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full bg-surface-300 border border-border rounded-xl p-2.5 text-zinc-200 text-xs focus:ring-1 focus:ring-brand-emerald"
            >
              {catConfig.units.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

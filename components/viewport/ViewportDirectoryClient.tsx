'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ViewportDevice } from '@/lib/viewport-data';
import {
  Search,
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  Watch,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';

interface ViewportDirectoryClientProps {
  devices: ViewportDevice[];
}

export function ViewportDirectoryClient({ devices }: ViewportDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Devices' },
    { id: 'smartphone', label: 'Smartphones' },
    { id: 'tablet', label: 'Tablets' },
    { id: 'laptop', label: 'Laptops' },
    { id: 'desktop', label: 'Desktops' },
    { id: 'wearable', label: 'Wearables' },
  ];

  const brands = useMemo(() => {
    const list = Array.from(new Set(devices.map((d) => d.brand)));
    return ['all', ...list];
  }, [devices]);

  const filteredDevices = useMemo(() => {
    return devices.filter((device) => {
      const matchesSearch =
        device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${device.cssWidth}x${device.cssHeight}`.includes(searchQuery.toLowerCase()) ||
        device.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || device.category === selectedCategory;

      const matchesBrand =
        selectedBrand === 'all' || device.brand === selectedBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [devices, searchQuery, selectedCategory, selectedBrand]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'smartphone':
        return <Smartphone className="w-4 h-4 text-indigo-400" />;
      case 'tablet':
        return <Tablet className="w-4 h-4 text-sky-400" />;
      case 'laptop':
        return <Laptop className="w-4 h-4 text-emerald-400" />;
      case 'desktop':
        return <Monitor className="w-4 h-4 text-amber-400" />;
      case 'wearable':
        return <Watch className="w-4 h-4 text-purple-400" />;
      default:
        return <Smartphone className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="space-y-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by device name (iPhone 16, Pixel 8, Galaxy S24) or width (390, 1080)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Brand:</span>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b === 'all' ? 'All Brands' : b}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Device Cards Grid */}
      {filteredDevices.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-slate-400 text-sm">
            No devices found matching &quot;{searchQuery}&quot;. Try clearing filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDevices.map((device) => (
            <Link
              key={device.slug}
              href={`/viewport/${device.slug}/`}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition group flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-slate-800">
                      {getCategoryIcon(device.category)}
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      {device.brand} &bull; {device.screenDiagonal}
                    </span>
                  </div>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 font-mono text-indigo-400">
                    {device.dpr}x DPR
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-semibold text-white group-hover:text-indigo-400 transition">
                    {device.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                    {device.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">CSS Viewport</span>
                  <span className="text-sm font-bold text-white font-mono">
                    {device.cssWidth} &times; {device.cssHeight} px
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs text-indigo-400 font-medium group-hover:translate-x-1 transition-transform">
                  <span>View Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

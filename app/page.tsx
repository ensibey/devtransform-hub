'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { RecentTools } from '@/components/home/RecentTools';
import { ToolGrid } from '@/components/home/ToolGrid';
import { PrivacyBlueprint } from '@/components/home/PrivacyBlueprint';
import { SeoFooterDirectory } from '@/components/home/SeoFooterDirectory';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Hero Section with Live Search & Trust Metrics */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Recent Tools Quick-Access Row */}
      <RecentTools />

      {/* 3. Category Filters & Interactive Tool Grid */}
      <ToolGrid
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      {/* 4. Privacy Architecture Blueprint (Zero-Trust Model) */}
      <PrivacyBlueprint />

      {/* 5. Semantic SEO Directory & Structured FAQ Accordion */}
      <SeoFooterDirectory />
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { DailyEssentials } from '@/components/home/DailyEssentials';
import { RecentTools } from '@/components/home/RecentTools';
import { ToolGrid } from '@/components/home/ToolGrid';
import { PrivacyBlueprint } from '@/components/home/PrivacyBlueprint';
import { SeoFooterDirectory } from '@/components/home/SeoFooterDirectory';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Section with Live Search & Trust Badges */}
      <HeroSection
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 2. Daily Essentials Featured Showcase (PDF, Images, Text, Dev) */}
      <DailyEssentials />

      {/* 3. Recent Tools Quick-Access Row */}
      <RecentTools />

      {/* 4. Complete Tool Matrix Grid with Category Tabs */}
      <ToolGrid
        searchQuery={searchQuery}
        onClearSearch={() => setSearchQuery('')}
      />

      {/* 5. Zero-Trust Privacy Architecture Blueprint */}
      <PrivacyBlueprint />

      {/* 6. Semantic SEO Link Matrix & Structured FAQ */}
      <SeoFooterDirectory />
    </div>
  );
}

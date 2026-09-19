'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { NGINX_RECIPES, NginxRecipe } from '@/lib/nginx-recipes-data';
import { Search, Server, ArrowRight, Shield, Zap, RefreshCw, Layers } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Reverse Proxy & APIs',
  'Security & SSL',
  'Frontend & SPAs',
  'Performance & Caching'
] as const;

export function NginxDirectoryClient() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredRecipes = useMemo(() => {
    return NGINX_RECIPES.filter((r) => {
      const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
      const q = search.toLowerCase();
      const matchesSearch =
        r.title.toLowerCase().includes(q) ||
        r.shortTitle.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.directivesExplained.some((d) => d.directive.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [search, selectedCategory]);

  return (
    <div className="space-y-10">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search proxy_pass, ssl, try_files, gzip..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Nginx Recipes */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <div
              key={recipe.slug}
              className="group bg-card border border-border hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-200 hover:shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20">
                    {recipe.category}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {recipe.configFileName}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-foreground group-hover:text-emerald-400 transition-colors line-clamp-2">
                  {recipe.title}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {recipe.summary}
                </p>

                {/* Key directives preview */}
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {recipe.directivesExplained.slice(0, 2).map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground truncate max-w-[200px]"
                    >
                      {d.directive}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-border/60 mt-6 flex items-center justify-between">
                <Link
                  href={`/nginx/${recipe.slug}`}
                  className="text-xs font-semibold text-emerald-400 group-hover:text-emerald-300 flex items-center gap-1 transition-colors"
                >
                  Configure & Copy
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <span className="text-[11px] text-muted-foreground">
                  Production ready
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card border border-border rounded-2xl p-8 space-y-3">
          <Server className="w-10 h-10 text-muted-foreground mx-auto opacity-50" />
          <h3 className="text-sm font-semibold text-foreground">No matching Nginx recipes found</h3>
          <p className="text-xs text-muted-foreground">
            Try searching for another keyword like &quot;ssl&quot;, &quot;try_files&quot;, or &quot;gzip&quot;.
          </p>
        </div>
      )}

      {/* Production Guide & Best Practices */}
      <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
          <Server className="w-5 h-5 text-emerald-400" />
          Nginx Architecture & High-Performance Best Practices
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-muted-foreground leading-relaxed">
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <Zap className="w-4 h-4 text-amber-400" />
              Event-Driven Worker Model
            </div>
            <p>
              Unlike thread-per-connection servers like Apache, Nginx relies on an asynchronous, non-blocking event loop using Linux epoll. A single worker process can handle over 10,000 concurrent keep-alive client connections with negligible RAM overhead.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <Shield className="w-4 h-4 text-emerald-400" />
              Security at the Perimeter
            </div>
            <p>
              Placing Nginx in front of internal Node.js or Python processes isolates your application from slow-loris attacks, malformed request bodies, and SSL vulnerabilities. Enforce modern TLS 1.3 ciphers, HSTS headers, and strict rate limits at the edge.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 font-semibold text-foreground text-sm">
              <RefreshCw className="w-4 h-4 text-blue-400" />
              Zero-Downtime Reloads
            </div>
            <p>
              Never restart Nginx in production with <code className="text-foreground font-mono">systemctl restart</code>. Always test configuration validity with <code className="text-foreground font-mono">sudo nginx -t</code> and apply updates with <code className="text-foreground font-mono">sudo systemctl reload nginx</code> to keep live connections uninterrupted.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

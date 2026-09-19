import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { NGINX_RECIPES } from '@/lib/nginx-recipes-data';
import { NginxDirectoryClient } from '@/components/nginx/NginxDirectoryClient';
import { FaqAccordion } from '@/components/seo/FaqAccordion';
import {
  Server,
  Terminal,
  ShieldCheck,
  Zap,
  ChevronRight,
  FileCode,
  CheckCircle2,
  Lock,
  Globe
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Nginx Config Generator & Production Recipes Directory (2025/2026 Guide) | DevTransform',
  description: 'Production-tested Nginx configuration templates and boilerplates for Reverse Proxy, SSL HTTPS Redirects, React/Vue SPA routing, Rate Limiting, CORS preflight, WebSockets, and Gzip compression.',
  keywords: [
    'nginx config generator',
    'nginx reverse proxy nodejs',
    'nginx ssl redirect http to https',
    'nginx try_files react router 404',
    'nginx rate limiting api',
    'nginx cors headers options preflight',
    'nginx websocket proxy_pass',
    'nginx gzip brotli compression',
    'nginx client_max_body_size 413 fix',
    'nginx basic auth htpasswd',
  ],
  alternates: {
    canonical: 'https://devtransform-hub.vercel.app/nginx/directory/',
  },
  openGraph: {
    title: 'Nginx Config Generator & Production Recipes Directory | DevTransform',
    description: 'Production-tested Nginx configuration templates for Reverse Proxy, SSL, SPAs, Rate Limiting, and CORS.',
    url: 'https://devtransform-hub.vercel.app/nginx/directory/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nginx Config Generator & Production Recipes Directory',
    description: 'Production-tested Nginx configuration templates for Reverse Proxy, SSL, SPAs, Rate Limiting, and CORS.',
  },
};

export default function NginxDirectoryPage() {
  const directoryFaqs = [
    {
      question: 'Where should Nginx virtual host configuration files be saved on Linux?',
      answer: 'On Ubuntu/Debian, save server blocks in `/etc/nginx/sites-available/yourdomain.conf` and activate them by creating a symbolic link to `/etc/nginx/sites-enabled/` with `sudo ln -s /etc/nginx/sites-available/yourdomain.conf /etc/nginx/sites-enabled/`. On RHEL/CentOS, configurations typically live in `/etc/nginx/conf.d/yourdomain.conf`.'
    },
    {
      question: 'Why should I always run sudo nginx -t before reloading?',
      answer: '`sudo nginx -t` parses all configuration files and tests for syntax errors, missing certificates, or port conflicts without interrupting live traffic. If an error is present, Nginx will output the exact offending line number without taking your website offline.'
    },
    {
      question: 'What is the difference between systemctl restart nginx and systemctl reload nginx?',
      answer: '`restart` terminates all existing worker processes immediately, severing in-flight client HTTP connections and file downloads. `reload` starts new workers with the updated configuration while allowing existing workers to gracefully finish active requests, achieving true zero-downtime updates.'
    },
    {
      question: 'How do I pass the real client visitor IP to my backend server?',
      answer: 'Set `proxy_set_header X-Real-IP $remote_addr;` and `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` inside your `location` block. If running behind Cloudflare or AWS ALB, also enable the `ngx_http_realip_module` and configure `set_real_ip_from` CIDRs.'
    }
  ];

  // Structured Data Schema (Directory + FAQ)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Nginx Configuration Recipes & Production Boilerplates Directory',
        description: 'Comprehensive directory of tested Nginx configurations for reverse proxies, SSL redirects, SPAs, and security headers.',
        url: 'https://devtransform-hub.vercel.app/nginx/directory/',
        hasPart: NGINX_RECIPES.map((recipe) => ({
          '@type': 'TechArticle',
          name: recipe.title,
          headline: recipe.title,
          url: `https://devtransform-hub.vercel.app/nginx/${recipe.slug}/`,
          description: recipe.summary,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: directoryFaqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground font-medium">Nginx Recipes Directory</span>
        </nav>

        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-medium border border-emerald-500/20">
            <Server className="w-3.5 h-3.5" />
            High-Performance Web Server & Reverse Proxy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Nginx Production Recipes & Configuration Directory
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Copy-pasteable, hardened Nginx server blocks and reverse proxy configurations. Optimized for high throughput, sub-millisecond SSL handshakes, Single-Page Applications, WebSockets, and API rate limiting.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {NGINX_RECIPES.length} Production-Grade Recipes
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              TLS 1.3 & HSTS Hardened
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Zero-Downtime Reloads
            </span>
          </div>
        </div>

        {/* Interactive Directory Client Component */}
        <NginxDirectoryClient />

        {/* Essential Nginx Management CLI Cheatsheet */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-emerald-400" />
            Essential Nginx CLI Operations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1.5">
              <span className="text-xs font-semibold text-foreground">Test Configuration</span>
              <code className="block text-xs font-mono text-emerald-400 bg-black/40 px-2.5 py-1.5 rounded border border-border">
                sudo nginx -t
              </code>
              <p className="text-[11px] text-muted-foreground">Checks syntax without reloading</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1.5">
              <span className="text-xs font-semibold text-foreground">Graceful Reload</span>
              <code className="block text-xs font-mono text-emerald-400 bg-black/40 px-2.5 py-1.5 rounded border border-border">
                sudo systemctl reload nginx
              </code>
              <p className="text-[11px] text-muted-foreground">Applies changes with zero downtime</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1.5">
              <span className="text-xs font-semibold text-foreground">View Error Logs</span>
              <code className="block text-xs font-mono text-emerald-400 bg-black/40 px-2.5 py-1.5 rounded border border-border">
                sudo tail -f /var/log/nginx/error.log
              </code>
              <p className="text-[11px] text-muted-foreground">Streams connection & upstream errors</p>
            </div>

            <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-1.5">
              <span className="text-xs font-semibold text-foreground">Enable Site (Debian/Ubuntu)</span>
              <code className="block text-xs font-mono text-emerald-400 bg-black/40 px-2.5 py-1.5 rounded border border-border">
                sudo ln -s /etc/nginx/sites-available/site.conf /etc/nginx/sites-enabled/
              </code>
              <p className="text-[11px] text-muted-foreground">Symlinks config to active directory</p>
            </div>
          </div>
        </div>

        {/* Directory FAQ Accordion */}
        <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-foreground">
              Frequently Asked Questions About Nginx
            </h2>
            <p className="text-xs text-muted-foreground">
              Everything you need to know about setting up and operating Nginx in high-load production environments.
            </p>
          </div>
          <FaqAccordion faqs={directoryFaqs} />
        </div>
      </div>
    </div>
  );
}

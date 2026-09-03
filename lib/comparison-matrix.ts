export interface ComparisonFeature {
  feature: string;
  itemA: string;
  itemB: string;
  verdict: 'A' | 'B' | 'TIE';
}

export interface ComparisonDefinition {
  slug: string;
  title: string;
  itemAName: string;
  itemBName: string;
  summary: string;
  features: ComparisonFeature[];
  recommendations: {
    whenToUseA: string[];
    whenToUseB: string[];
  };
}

export const COMPARISONS: ComparisonDefinition[] = [
  {
    slug: 'json-vs-yaml',
    title: 'JSON vs YAML: Comprehensive Format Comparison',
    itemAName: 'JSON',
    itemBName: 'YAML',
    summary: 'A deep-dive technical comparison between JSON (JavaScript Object Notation) and YAML (YAML Ain\'t Markup Language) for API payloads, config files, and DevOps.',
    features: [
      { feature: 'Syntax Complexity', itemA: 'Strict, minimal, curly braces', itemB: 'Whitespace sensitive, rich syntax', verdict: 'A' },
      { feature: 'Comments Support', itemA: 'No native comments allowed', itemB: 'Supports # inline and block comments', verdict: 'B' },
      { feature: 'Parsing Speed', itemA: 'Ultra-fast native C/V8 parsers', itemB: 'Slower, complex grammar', verdict: 'A' },
      { feature: 'Human Readability', itemA: 'Good, but cluttered with brackets', itemB: 'Exceptional, clean indentations', verdict: 'B' },
      { feature: 'Primary Use Case', itemA: 'Web APIs, network data serialization', itemB: 'Kubernetes, Docker Compose, CI/CD configs', verdict: 'TIE' },
    ],
    recommendations: {
      whenToUseA: ['High-throughput HTTP REST APIs', 'Browser client-server communication', 'When execution speed and strict validation are paramount'],
      whenToUseB: ['Kubernetes manifests and Helm charts', 'Docker Compose configurations', 'Settings files maintained by human developers'],
    },
  },
  {
    slug: 'sql-vs-nosql',
    title: 'SQL vs NoSQL: Relational vs Document Databases',
    itemAName: 'SQL (Relational)',
    itemBName: 'NoSQL (Document/Key-Value)',
    summary: 'Comparing relational RDBMS databases (PostgreSQL, MySQL) against non-relational document/NoSQL stores (MongoDB, Redis, Cassandra).',
    features: [
      { feature: 'Schema', itemA: 'Strict, predefined relational schema', itemB: 'Dynamic, flexible, schema-less', verdict: 'TIE' },
      { feature: 'ACID Transactions', itemA: 'Full ACID compliance guaranteed', itemB: 'Often BASE model (eventual consistency)', verdict: 'A' },
      { feature: 'Horizontal Scaling', itemA: 'Complex sharding, vertical scaling', itemB: 'Built-in automatic sharding & clusters', verdict: 'B' },
      { feature: 'Complex Queries & Joins', itemA: 'Native powerful relational JOINs', itemB: 'Limited joins, requires denormalization', verdict: 'A' },
    ],
    recommendations: {
      whenToUseA: ['E-commerce, billing, banking, and accounting systems', 'Highly structured data with complex relationships', 'When ACID guarantees are strictly required'],
      whenToUseB: ['Rapid prototyping with changing schema', 'Real-time high-velocity big data ingestion', 'Distributed caching and mobile session stores'],
    },
  },
  {
    slug: 'rest-vs-graphql',
    title: 'REST vs GraphQL: API Architecture Comparison',
    itemAName: 'REST API',
    itemBName: 'GraphQL',
    summary: 'Evaluate architectural trade-offs between traditional endpoint-based RESTful services and flexible single-endpoint GraphQL schemas.',
    features: [
      { feature: 'Over/Under Fetching', itemA: 'Common issue with fixed endpoints', itemB: 'Eliminated: client requests exact fields', verdict: 'B' },
      { feature: 'HTTP Caching', itemA: 'Trivial with standard HTTP GET / ETag', itemB: 'Complex, requires specialized client cache', verdict: 'A' },
      { feature: 'Learning Curve', itemA: 'Low, universal standard', itemB: 'Moderate, requires schema definitions', verdict: 'A' },
      { feature: 'Multiple Resources', itemA: 'Requires multiple HTTP roundtrips', itemB: 'Single query fetches multiple entities', verdict: 'B' },
    ],
    recommendations: {
      whenToUseA: ['Simple CRUD applications', 'When standard HTTP caching is critical', 'Public APIs exposed to diverse external clients'],
      whenToUseB: ['Complex dashboards requiring multiple aggregated services', 'Mobile apps on constrained bandwidth', 'Microservices federation (Apollo Federation)'],
    },
  },
  {
    slug: 'jwt-vs-session',
    title: 'JWT vs Session Cookies: Authentication Architecture',
    itemAName: 'JWT (Stateless Tokens)',
    itemBName: 'Session Cookies (Stateful)',
    summary: 'Compare client-side cryptographic JWT tokens against server-side session databases for user authentication.',
    features: [
      { feature: 'Server Storage', itemA: 'Zero server memory, stateless', itemB: 'Requires Redis/DB session store', verdict: 'A' },
      { feature: 'Revocation / Invalidation', itemA: 'Hard: token valid until expiration', itemB: 'Instant: delete session from Redis', verdict: 'B' },
      { feature: 'Payload Size', itemA: 'Larger (300-800 bytes per request)', itemB: 'Tiny (cookie ID ~32 bytes)', verdict: 'B' },
      { feature: 'Cross-Domain / Microservices', itemA: 'Seamless, verify key on any service', itemB: 'Requires shared session database', verdict: 'A' },
    ],
    recommendations: {
      whenToUseA: ['Distributed microservices architecture', 'Single Page Apps (SPA) with mobile apps', 'Third-party API authorization (OAuth 2.0)'],
      whenToUseB: ['Monolithic web applications (Rails, Django, Laravel)', 'Strict enterprise logout and immediate session revocation', 'High-security financial applications'],
    },
  },
  {
    slug: 'typescript-vs-javascript',
    title: 'TypeScript vs JavaScript: Static Types vs Dynamic Scripting',
    itemAName: 'TypeScript',
    itemBName: 'JavaScript',
    summary: 'Analyze the architectural trade-offs between static typing and dynamic scripting for web development, maintenance, and enterprise scalability.',
    features: [
      { feature: 'Type Safety', itemA: 'Compile-time static typing & type inference', itemB: 'Dynamic runtime typing', verdict: 'A' },
      { feature: 'Compilation Step', itemA: 'Requires build step (tsc / esbuild)', itemB: 'Native browser & Node.js execution', verdict: 'B' },
      { feature: 'Refactoring & IDE Support', itemA: 'Exceptional autocompletion and rename refactoring', itemB: 'Limited, prone to runtime regressions', verdict: 'A' },
      { feature: 'Learning Curve', itemA: 'Moderate: Generics, interfaces, unions', itemB: 'Low: Easy for beginners to pick up', verdict: 'B' },
      { feature: 'Ecosystem Standard', itemA: 'De facto standard for modern web frameworks', itemB: 'Universal web runtime foundation', verdict: 'TIE' },
    ],
    recommendations: {
      whenToUseA: ['Medium-to-large production codebases', 'Multi-developer engineering teams', 'Projects requiring robust refactoring and contract validation'],
      whenToUseB: ['Quick scripts and tiny automation hacks', 'Teaching absolute beginners coding basics', 'Ultra-lightweight embedded web pages without bundlers'],
    },
  },
  {
    slug: 'vite-vs-webpack',
    title: 'Vite vs Webpack: Modern Bundler & Build Tool Comparison',
    itemAName: 'Vite',
    itemBName: 'Webpack',
    summary: 'Compare next-generation native ESM frontend tooling (Vite) against the battle-tested industry standard module bundler (Webpack).',
    features: [
      { feature: 'Dev Server Startup', itemA: 'Instant (<300ms) via native browser ESM', itemB: 'Slow (requires full bundle compilation)', verdict: 'A' },
      { feature: 'Hot Module Replacement (HMR)', itemA: 'Blazing fast regardless of app size', itemB: 'Slows down as module graph expands', verdict: 'A' },
      { feature: 'Config Complexity', itemA: 'Minimal, zero-config sane defaults', itemB: 'Extensive, complex configuration files', verdict: 'A' },
      { feature: 'Legacy Plugin Ecosystem', itemA: 'Growing rapidly (Rollup compatible)', itemB: 'Massive, thousands of mature plugins', verdict: 'B' },
    ],
    recommendations: {
      whenToUseA: ['Modern SPA projects (React, Vue, Svelte)', 'Teams frustrated by sluggish local dev reloads', 'New greenfield frontend applications'],
      whenToUseB: ['Large legacy enterprise codebases heavily tuned for Webpack', 'Complex non-standard asset pipelines requiring bespoke loaders', 'Custom micro-frontend setups using Module Federation'],
    },
  },
  {
    slug: 'npm-vs-pnpm',
    title: 'npm vs pnpm: Node.js Package Manager Efficiency',
    itemAName: 'pnpm',
    itemBName: 'npm',
    summary: 'A deep-dive technical comparison into node_modules storage strategy, disk space savings, install performance, and monorepo workflows.',
    features: [
      { feature: 'Disk Space Management', itemA: 'Hard links to global content-addressable store', itemB: 'Duplicates packages across every project', verdict: 'A' },
      { feature: 'Installation Speed', itemA: 'Up to 2-3x faster than npm', itemB: 'Slower due to full file extraction', verdict: 'A' },
      { feature: 'Phantom Dependencies', itemA: 'Strict non-flat layout prevents undeclared imports', itemB: 'Flat hoisting allows accidental phantom imports', verdict: 'A' },
      { feature: 'Default Pre-installed', itemA: 'Requires Corepack or npm install -g', itemB: 'Ships natively bundled with Node.js', verdict: 'B' },
    ],
    recommendations: {
      whenToUseA: ['Monorepo setups (Turborepo, Nx, Lerna)', 'Laptops and CI runners with constrained disk space', 'Large projects with hundreds of shared dependencies'],
      whenToUseB: ['Zero-install beginner environments using stock Node.js', 'Simple isolated scripts with no performance bottlenecks', 'Legacy CI pipelines strictly tied to standard npm CLI'],
    },
  },
  {
    slug: 'tailwind-vs-bootstrap',
    title: 'Tailwind CSS vs Bootstrap: Modern CSS Styling Frameworks',
    itemAName: 'Tailwind CSS',
    itemBName: 'Bootstrap',
    summary: 'Compare utility-first composable CSS styling (Tailwind) with component-driven prebuilt UI frameworks (Bootstrap 5).',
    features: [
      { feature: 'Design Uniqueness', itemA: '100% custom, no "template" look and feel', itemB: 'Recognizable default Bootstrap aesthetic', verdict: 'A' },
      { feature: 'Production Bundle Size', itemA: 'Tiny (<10KB) via automatic JIT class purging', itemB: 'Larger, includes unused component CSS/JS', verdict: 'A' },
      { feature: 'HTML Readability', itemA: 'Long class strings inside JSX / HTML', itemB: 'Clean, concise component class names', verdict: 'B' },
      { feature: 'Prebuilt Components', itemA: 'Requires headless UI or copy-paste libraries', itemB: 'Comprehensive navbars, modals, and carousels included', verdict: 'B' },
    ],
    recommendations: {
      whenToUseA: ['Custom bespoke web applications and design systems', 'Modern React, Next.js, and Vue single-page applications', 'Performance-critical e-commerce and SaaS landing pages'],
      whenToUseB: ['Internal admin portals where custom branding is secondary', 'Rapid prototypes needed in under an hour', 'Traditional server-rendered MVC apps (Rails, Django, PHP)'],
    },
  },
  {
    slug: 'postgresql-vs-mysql',
    title: 'PostgreSQL vs MySQL: Battle of Open-Source RDBMS',
    itemAName: 'PostgreSQL',
    itemBName: 'MySQL',
    summary: 'Technical evaluation of PostgreSQL (the world\'s most advanced relational database) against MySQL (the ubiquitous web standard).',
    features: [
      { feature: 'JSON & Semi-structured Data', itemA: 'First-class JSONB with GIN indexing', itemB: 'JSON support, but slower binary indexing', verdict: 'A' },
      { feature: 'SQL Standards Compliance', itemA: 'Nearly 100% ANSI-SQL compliant', itemB: 'Historically relaxed, some proprietary syntax', verdict: 'A' },
      { feature: 'Extensibility', itemA: 'Vast extension ecosystem (PostGIS, pgvector, Citus)', itemB: 'Limited custom extension capabilities', verdict: 'A' },
      { feature: 'Read-heavy Simple Queries', itemA: 'Excellent, powerful query planner', itemB: 'Historically exceptional throughput on simple reads', verdict: 'B' },
      { feature: 'Hosting & Managed Cloud', itemA: 'Universal (Supabase, Neon, AWS RDS)', itemB: 'Universal (every web host, AWS RDS, PlanetScale)', verdict: 'TIE' },
    ],
    recommendations: {
      whenToUseA: ['AI/Vector applications (pgvector) and geospatial systems (PostGIS)', 'Complex analytical queries with multiple JOINs and window functions', 'Modern applications storing hybrid relational and document JSONB data'],
      whenToUseB: ['WordPress, Drupal, and classic LAMP stack deployments', 'High-throughput simple key-lookup read operations', 'Legacy infrastructure deeply optimized for InnoDB replication'],
    },
  },
];

export function getAllComparisons(): ComparisonDefinition[] {
  return COMPARISONS;
}

export function getComparisonBySlug(slug: string): ComparisonDefinition | null {
  return COMPARISONS.find((c) => c.slug === slug) || null;
}

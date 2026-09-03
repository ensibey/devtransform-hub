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
];

export function getAllComparisons(): ComparisonDefinition[] {
  return COMPARISONS;
}

export function getComparisonBySlug(slug: string): ComparisonDefinition | null {
  return COMPARISONS.find((c) => c.slug === slug) || null;
}

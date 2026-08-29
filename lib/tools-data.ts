export type ToolCategoryKey =
  | 'all'
  | 'converters'
  | 'security'
  | 'web-api'
  | 'formatters'
  | 'calculators';

export interface CategoryFilterItem {
  key: ToolCategoryKey;
  label: string;
  iconName: string;
}

export interface DeveloperToolItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ToolCategoryKey;
  categoryLabel: string;
  icon: string;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
  path: string;
}

export const CATEGORY_FILTERS: CategoryFilterItem[] = [
  { key: 'all', label: 'All Tools', iconName: 'Sparkles' },
  { key: 'converters', label: 'Converters & Types', iconName: 'ArrowRightLeft' },
  { key: 'security', label: 'Security & Encoders', iconName: 'ShieldCheck' },
  { key: 'web-api', label: 'Web & APIs', iconName: 'Terminal' },
  { key: 'formatters', label: 'Formatters & Minifiers', iconName: 'Code2' },
  { key: 'calculators', label: 'Calculators & Units', iconName: 'Calculator' },
];

export const DEVELOPER_TOOLS: DeveloperToolItem[] = [
  // 1. Converters & Types
  {
    id: 'json-to-typescript',
    slug: 'json-to-typescript',
    title: 'JSON to TypeScript Interfaces',
    description: 'Transform arbitrary JSON objects and nested arrays into clean, strongly typed TypeScript interfaces.',
    category: 'converters',
    categoryLabel: 'Converters & Types',
    icon: 'Braces',
    tags: ['#typescript', '#json', '#types', '#ast'],
    isPopular: true,
    path: '/json-to-typescript/',
  },
  {
    id: 'json-to-go',
    slug: 'json-to-go',
    title: 'JSON to Go Structs',
    description: 'Generate idiomatic Golang struct definitions complete with JSON tags and camelCase to PascalCase mapping.',
    category: 'converters',
    categoryLabel: 'Converters & Types',
    icon: 'Code2',
    tags: ['#golang', '#structs', '#serde'],
    isPopular: true,
    path: '/json-to-go/',
  },
  {
    id: 'json-to-rust',
    slug: 'json-to-rust',
    title: 'JSON to Rust Serde',
    description: 'Synthesize production-grade Rust structs with #[derive(Serialize, Deserialize)] and Option<T> fields.',
    category: 'converters',
    categoryLabel: 'Converters & Types',
    icon: 'Layers',
    tags: ['#rust', '#serde', '#wasm'],
    isPopular: true,
    path: '/json-to-rust/',
  },
  {
    id: 'yaml-to-json',
    slug: 'yaml-to-json',
    title: 'YAML to JSON Converter',
    description: 'Bi-directional parsing between YAML manifests and formatted JSON with zero data loss or type coercion bugs.',
    category: 'converters',
    categoryLabel: 'Converters & Types',
    icon: 'FileCode',
    tags: ['#yaml', '#k8s', '#json'],
    isPopular: true,
    path: '/yaml-to-json/',
  },
  {
    id: 'csv-to-json',
    slug: 'csv-to-json',
    title: 'CSV to JSON & Tabular Parser',
    description: 'Parse large CSV and TSV spreadsheet tables into normalized JSON record arrays with automatic header detection.',
    category: 'converters',
    categoryLabel: 'Converters & Types',
    icon: 'Table',
    tags: ['#csv', '#tabular', '#excel'],
    path: '/csv-to-json/',
  },
  {
    id: 'xml-to-json',
    slug: 'xml-to-json',
    title: 'XML to JSON & Schema Converter',
    description: 'Convert complex hierarchical XML documents, tags, attributes, and CDATA elements into native JSON.',
    category: 'converters',
    categoryLabel: 'Converters & Types',
    icon: 'FileText',
    tags: ['#xml', '#soap', '#parser'],
    path: '/xml-to-json/',
  },
  {
    id: 'json-to-sql',
    slug: 'json-to-sql',
    title: 'JSON to SQL DDL & Seeder',
    description: 'Infer relational schema columns from JSON payloads and generate CREATE TABLE scripts with INSERT statements.',
    category: 'converters',
    categoryLabel: 'Converters & Types',
    icon: 'Database',
    tags: ['#sql', '#postgres', '#schema'],
    isPopular: true,
    path: '/json-to-sql/',
  },
  {
    id: 'toml-to-json',
    slug: 'toml-to-json',
    title: 'TOML to JSON Converter',
    description: 'Transform Rust Cargo and Python pyproject TOML configurations into standard JSON data representations.',
    category: 'converters',
    categoryLabel: 'Converters & Types',
    icon: 'FileCode',
    tags: ['#toml', '#cargo', '#pyproject'],
    path: '/toml-to-json/',
  },

  // 2. Web & APIs
  {
    id: 'curl-to-code',
    slug: 'curl-to-code',
    title: 'cURL to Code Converter',
    description: 'Instantly convert cURL commands into native JavaScript Fetch, Axios, Python Requests, Go http, and Rust reqwest.',
    category: 'web-api',
    categoryLabel: 'Web & APIs',
    icon: 'Terminal',
    tags: ['#curl', '#fetch', '#python', '#api'],
    isPopular: true,
    isNew: true,
    path: '/tools/curl-to-code/',
  },
  {
    id: 'markdown-previewer',
    slug: 'markdown-previewer',
    title: 'Live Markdown Previewer & HTML Exporter',
    description: 'Real-time Markdown editor with live rendered HTML preview, GitHub-flavored markdown tables, and syntax blocks.',
    category: 'web-api',
    categoryLabel: 'Web & APIs',
    icon: 'FileEdit',
    tags: ['#gfm', '#markdown', '#html'],
    path: '/tools/markdown-previewer/',
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    title: 'Custom QR Code Generator',
    description: 'Generate high-resolution QR codes for URLs, WiFi networks, and vCards with custom colors, logos, and SVG export.',
    category: 'web-api',
    categoryLabel: 'Web & APIs',
    icon: 'QrCode',
    tags: ['#qrcode', '#svg', '#wifi'],
    isPopular: true,
    path: '/tools/qr-code-generator/',
  },
  {
    id: 'svg-optimizer',
    slug: 'svg-optimizer',
    title: 'SVG Optimizer & Minifier',
    description: 'Strip unnecessary metadata, comments, and empty attributes from SVG graphics for maximum web performance.',
    category: 'web-api',
    categoryLabel: 'Web & APIs',
    icon: 'Wand2',
    tags: ['#svg', '#minify', '#assets'],
    path: '/tools/svg-optimizer/',
  },

  // 3. Security & Encoders
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    title: 'JWT Token Decoder & Claims Inspector',
    description: 'Privately inspect JSON Web Token headers, payload claims, issuer verification, and expiration dates.',
    category: 'security',
    categoryLabel: 'Security & Encoders',
    icon: 'Key',
    tags: ['#jwt', '#auth', '#tokens'],
    isPopular: true,
    path: '/tools/jwt-decoder/',
  },
  {
    id: 'base64-encoder-decoder',
    slug: 'base64-encoder-decoder',
    title: 'Base64 Encoder & Decoder',
    description: 'Encode and decode plain text and raw binary strings to Base64 with standard and URL-safe RFC 4648 modes.',
    category: 'security',
    categoryLabel: 'Security & Encoders',
    icon: 'Binary',
    tags: ['#base64', '#rfc4648', '#encode'],
    isPopular: true,
    path: '/tools/base64-encoder-decoder/',
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    title: 'Web Crypto Hash Generator',
    description: 'Compute SHA-256, SHA-512, SHA-384, and SHA-1 cryptographic hashes via hardware-accelerated Web Crypto API.',
    category: 'security',
    categoryLabel: 'Security & Encoders',
    icon: 'Fingerprint',
    tags: ['#sha256', '#crypto', '#hash'],
    path: '/tools/hash-generator/',
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    title: 'Bulk UUID v4 Identifier Generator',
    description: 'Generate thousands of cryptographically random UUID v4 identifiers with uppercase, hyphen, and brace toggles.',
    category: 'security',
    categoryLabel: 'Security & Encoders',
    icon: 'Fingerprint',
    tags: ['#uuid', '#v4', '#guid'],
    path: '/tools/uuid-generator/',
  },

  // 4. Formatters & Minifiers
  {
    id: 'json-formatter-validator',
    slug: 'json-formatter-validator',
    title: 'JSON Formatter & Syntax Validator',
    description: 'Prettify, format, validate, and minify JSON payloads with exact error line indicators and 2-space indentation.',
    category: 'formatters',
    categoryLabel: 'Formatters & Minifiers',
    icon: 'CheckCircle2',
    tags: ['#prettier', '#lint', '#json'],
    isPopular: true,
    path: '/tools/json-formatter-validator/',
  },
  {
    id: 'sql-formatter',
    slug: 'sql-formatter',
    title: 'SQL Query Beautifier & Formatter',
    description: 'Beautify complex PostgreSQL, MySQL, and SQLite queries with customizable keyword casing and line breaks.',
    category: 'formatters',
    categoryLabel: 'Formatters & Minifiers',
    icon: 'Sparkles',
    tags: ['#sql', '#formatter', '#beautify'],
    isPopular: true,
    path: '/formatters/sql/',
  },
  {
    id: 'text-diff',
    slug: 'text-diff',
    title: 'Text & Code Diff Comparison',
    description: 'Side-by-side and unified diff comparison highlighting added, removed, and modified lines in real-time.',
    category: 'formatters',
    categoryLabel: 'Formatters & Minifiers',
    icon: 'GitCompare',
    tags: ['#diff', '#git', '#compare'],
    path: '/tools/text-diff/',
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    title: 'Multi-Case String Converter',
    description: 'Convert strings between camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and Title Case.',
    category: 'formatters',
    categoryLabel: 'Formatters & Minifiers',
    icon: 'Type',
    tags: ['#camelcase', '#snake_case', '#strings'],
    path: '/tools/case-converter/',
  },

  // 5. Calculators & Media
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    title: 'Client-Side Image Compressor',
    description: 'Compress PNG, JPG, and WebP images up to 80% directly in your browser using multi-threaded Web Workers.',
    category: 'calculators',
    categoryLabel: 'Calculators & Units',
    icon: 'Image',
    tags: ['#compress', '#webp', '#worker'],
    isPopular: true,
    path: '/tools/image-compressor/',
  },
  {
    id: 'pdf-merge',
    slug: 'pdf-merge',
    title: 'Private PDF Merge & Combiner',
    description: 'Combine multiple PDF documents into a single organized PDF without uploading any file bytes to the cloud.',
    category: 'calculators',
    categoryLabel: 'Calculators & Units',
    icon: 'FileSpreadsheet',
    tags: ['#pdf', '#merge', '#wasm'],
    isPopular: true,
    path: '/tools/pdf-merge/',
  },
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    title: 'Multi-Mode Percentage Calculator',
    description: 'Calculate percentage increases, percentage decreases, fractional differences, and discount values.',
    category: 'calculators',
    categoryLabel: 'Calculators & Units',
    icon: 'Percent',
    tags: ['#math', '#percentage', '#discount'],
    path: '/tools/percentage-calculator/',
  },
  {
    id: 'aspect-ratio-calculator',
    slug: 'aspect-ratio-calculator',
    title: 'Aspect Ratio & Resolution Calculator',
    description: 'Calculate image and video dimension scaling across 16:9, 4:3, 21:9, and custom display ratios.',
    category: 'calculators',
    categoryLabel: 'Calculators & Units',
    icon: 'Maximize2',
    tags: ['#aspectratio', '#4k', '#1080p'],
    path: '/tools/aspect-ratio-calculator/',
  },
];

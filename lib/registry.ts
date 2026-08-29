import { ToolDefinition, ToolCategory, CATEGORIES } from '@/types/tool';

// Text Tools
import { WordCounter } from '@/components/tools/text/WordCounter';
import { CaseConverter } from '@/components/tools/text/CaseConverter';
import { TextDiff } from '@/components/tools/text/TextDiff';
import { LoremIpsumGenerator } from '@/components/tools/text/LoremIpsumGenerator';
import { MarkdownPreviewer } from '@/components/tools/text/MarkdownPreviewer';

// Image Tools
import { ImageCompressor } from '@/components/tools/image/ImageCompressor';
import { ImageConverter } from '@/components/tools/image/ImageConverter';
import { QrCodeGenerator } from '@/components/tools/image/QrCodeGenerator';
import { SvgOptimizer } from '@/components/tools/image/SvgOptimizer';
import { ColorPaletteExtractor } from '@/components/tools/image/ColorPaletteExtractor';

// PDF Tools
import { PdfMerge } from '@/components/tools/pdf/PdfMerge';
import { PdfSplit } from '@/components/tools/pdf/PdfSplit';
import { ImageToPdf } from '@/components/tools/pdf/ImageToPdf';
import { PdfRotate } from '@/components/tools/pdf/PdfRotate';

// Calculator Tools
import { PercentageCalculator } from '@/components/tools/calculator/PercentageCalculator';
import { AspectRatioCalculator } from '@/components/tools/calculator/AspectRatioCalculator';
import { TimezoneConverter } from '@/components/tools/calculator/TimezoneConverter';
import { UnitConverter } from '@/components/tools/calculator/UnitConverter';

// Dev Tools
import { JsonFormatterValidator } from '@/components/tools/dev/JsonFormatterValidator';
import { Base64EncoderDecoder } from '@/components/tools/dev/Base64EncoderDecoder';
import { HashGenerator } from '@/components/tools/dev/HashGenerator';
import { UuidGenerator } from '@/components/tools/dev/UuidGenerator';
import { JwtDecoder } from '@/components/tools/dev/JwtDecoder';
import { CurlConverter } from '@/components/tools/dev/CurlConverter';
import { RegexTester } from '@/components/tools/dev/RegexTester';
import { UnixTimestampConverter } from '@/components/tools/dev/UnixTimestampConverter';
import { UrlEncoderDecoder } from '@/components/tools/dev/UrlEncoderDecoder';

export const TOOLS_REGISTRY: ToolDefinition[] = [
  // A. Text & Content
  {
    id: 'word-counter',
    slug: 'word-counter',
    title: 'Word Counter & Text Analyzer',
    shortDesc: 'Calculate words, characters, sentences, paragraphs, reading time, and keyword density.',
    category: 'text',
    keywords: ['word counter', 'character count', 'reading time', 'text analysis', 'keyword density', 'sentences'],
    icon: 'FileText',
    isPopular: true,
    seoDescription: 'Free online word counter and text statistics analyzer. Computes word count, character count without spaces, reading duration, and keyword frequencies in real-time client-side.',
    faqs: [
      {
        question: 'How is reading time calculated?',
        answer: 'Reading time is estimated using the standard average reading speed of 200 words per minute (WPM), while speaking time is based on 130 WPM.',
      },
      {
        question: 'Is my text stored or uploaded to any server?',
        answer: 'No. All calculations occur locally in your browser memory via pure JavaScript.',
      },
    ],
    component: WordCounter,
  },
  {
    id: 'case-converter',
    slug: 'case-converter',
    title: 'Case Converter & Text Formatter',
    shortDesc: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and PascalCase.',
    category: 'text',
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake_case', 'kebab-case', 'pascalcase'],
    icon: 'Type',
    isPopular: true,
    seoDescription: 'Transform text across multiple letter cases and programming variable naming conventions instantly online.',
    faqs: [
      {
        question: 'What casing styles are supported?',
        answer: 'We support UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, and extra whitespace cleanup.',
      },
    ],
    component: CaseConverter,
  },
  {
    id: 'text-diff',
    slug: 'text-diff',
    title: 'Text Diff & Comparison Checker',
    shortDesc: 'Compare two text snippets side-by-side with color-coded line and word additions and deletions.',
    category: 'text',
    keywords: ['text diff', 'diff checker', 'compare text', 'text difference', 'code comparison'],
    icon: 'GitCompare',
    seoDescription: 'Compare two text documents or code snippets side-by-side to highlight additions, removals, and changes.',
    component: TextDiff,
  },
  {
    id: 'lorem-ipsum-generator',
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Dummy Text Generator',
    shortDesc: 'Generate custom placeholder dummy text by paragraphs, sentences, or word count with HTML tags.',
    category: 'text',
    keywords: ['lorem ipsum', 'dummy text', 'placeholder text', 'filler text', 'generator'],
    icon: 'AlignLeft',
    seoDescription: 'Customizable Lorem Ipsum generator for designers, developers, and copywriters. Output raw paragraphs or HTML markup.',
    component: LoremIpsumGenerator,
  },
  {
    id: 'markdown-previewer',
    slug: 'markdown-previewer',
    title: 'Live Markdown Previewer & HTML Exporter',
    shortDesc: 'Edit Markdown with live split-screen rendered HTML preview, code highlighting, and clean export.',
    category: 'text',
    keywords: ['markdown previewer', 'markdown to html', 'md editor', 'markdown viewer'],
    icon: 'FileCode',
    seoDescription: 'Real-time client-side Markdown editor and HTML previewer. Format headings, tables, blockquotes, and code snippets.',
    component: MarkdownPreviewer,
  },

  // B. Image & Media
  {
    id: 'image-compressor',
    slug: 'image-compressor',
    title: 'Client-Side Image Compressor',
    shortDesc: 'Compress PNG, JPG, and WebP images directly in your browser with target file size and resolution controls.',
    category: 'image',
    keywords: ['image compressor', 'compress image', 'reduce image size', 'compress png', 'compress jpg', 'webp compressor'],
    icon: 'Minimize2',
    isPopular: true,
    seoDescription: 'High-quality lossy and lossless image compression running 100% locally in your browser via WebAssembly and Canvas. Zero server uploads.',
    faqs: [
      {
        question: 'How much can I reduce image size?',
        answer: 'You can typically achieve 60% to 90% file size reduction with minimal visual quality loss by adjusting target MB and max dimension sliders.',
      },
    ],
    component: ImageCompressor,
  },
  {
    id: 'image-converter',
    slug: 'image-converter',
    title: 'Image Format Converter (WebP, PNG, JPG)',
    shortDesc: 'Convert images to WebP, PNG, or JPEG with adjustable quality settings using browser Canvas.',
    category: 'image',
    keywords: ['image converter', 'png to webp', 'jpg to png', 'convert image format', 'webp converter'],
    icon: 'Image',
    isPopular: true,
    seoDescription: 'Convert any image format to WebP, PNG, or JPEG in seconds without uploading files to remote servers.',
    component: ImageConverter,
  },
  {
    id: 'qr-code-generator',
    slug: 'qr-code-generator',
    title: 'Custom QR Code Generator',
    shortDesc: 'Create high-resolution QR codes with custom colors, URLs, Wi-Fi networks, emails, and download as PNG/SVG.',
    category: 'image',
    keywords: ['qr code generator', 'create qr code', 'custom qr', 'wifi qr code', 'svg qr code'],
    icon: 'QrCode',
    isPopular: true,
    seoDescription: 'Generate custom QR codes online for URLs, Wi-Fi passwords, contact cards, and plain text. Download high-res PNG and vector SVG.',
    component: QrCodeGenerator,
  },
  {
    id: 'svg-optimizer',
    slug: 'svg-optimizer',
    title: 'SVG Optimizer & Minifier',
    shortDesc: 'Clean SVG files, strip metadata, comments, and unused attributes for maximum web performance.',
    category: 'image',
    keywords: ['svg optimizer', 'minify svg', 'clean svg', 'svg compressor', 'svg minifier'],
    icon: 'Sparkles',
    seoDescription: 'Optimize SVG markup, remove bloated editor metadata, and reduce vector file sizes with real-time visual preview.',
    component: SvgOptimizer,
  },
  {
    id: 'color-palette-extractor',
    slug: 'color-palette-extractor',
    title: 'Image Color Palette Extractor',
    shortDesc: 'Extract dominant color palettes and Hex/RGB swatches from uploaded images using Canvas pixel sampling.',
    category: 'image',
    keywords: ['color palette extractor', 'extract colors from image', 'image color picker', 'dominant colors'],
    icon: 'Palette',
    seoDescription: 'Upload any image to generate harmonious dominant color swatches with one-click HEX and RGB copying.',
    component: ColorPaletteExtractor,
  },

  // C. PDF & Documents
  {
    id: 'pdf-merge',
    slug: 'pdf-merge',
    title: 'PDF Merger & Combiner',
    shortDesc: 'Merge multiple PDF documents into a single organized file with drag-and-drop page ordering.',
    category: 'pdf',
    keywords: ['pdf merge', 'combine pdf', 'join pdf', 'merge pdf files', 'pdf combiner online'],
    icon: 'Layers',
    isPopular: true,
    seoDescription: 'Merge PDF files online privately. 100% client-side manipulation using pdf-lib with zero server uploads.',
    faqs: [
      {
        question: 'Are my confidential documents secure?',
        answer: 'Yes! PDF merging executes 100% locally inside your browser via WebAssembly and pdf-lib. Zero bytes leave your device.',
      },
    ],
    component: PdfMerge,
  },
  {
    id: 'pdf-split',
    slug: 'pdf-split',
    title: 'PDF Splitter & Page Extractor',
    shortDesc: 'Extract specific pages or custom page ranges (e.g. 1-3, 5, 8) from any PDF document.',
    category: 'pdf',
    keywords: ['pdf split', 'extract pdf pages', 'split pdf online', 'separate pdf pages'],
    icon: 'Scissors',
    isPopular: true,
    seoDescription: 'Split large PDF files into smaller documents or extract custom page intervals privately on your device.',
    component: PdfSplit,
  },
  {
    id: 'image-to-pdf',
    slug: 'image-to-pdf',
    title: 'Image to PDF Converter',
    shortDesc: 'Convert multiple PNG and JPG images into printable multi-page A4 PDF documents.',
    category: 'pdf',
    keywords: ['image to pdf', 'jpg to pdf', 'png to pdf', 'convert photos to pdf'],
    icon: 'FileUp',
    seoDescription: 'Turn photos and images into structured A4 PDF pages online in seconds with zero data transmission.',
    component: ImageToPdf,
  },
  {
    id: 'pdf-rotate',
    slug: 'pdf-rotate',
    title: 'PDF Page Rotator',
    shortDesc: 'Rotate PDF pages permanently by 90, 180, or 270 degrees clockwise or counter-clockwise.',
    category: 'pdf',
    keywords: ['pdf rotate', 'rotate pdf pages', 'rotate pdf permanently', 'turn pdf'],
    icon: 'RotateCw',
    seoDescription: 'Permanently rotate upside-down or sideways PDF pages by 90°, 180°, or 270° directly in your browser.',
    component: PdfRotate,
  },

  // D. Daily Calculators
  {
    id: 'percentage-calculator',
    slug: 'percentage-calculator',
    title: 'Percentage & Discount Calculator',
    shortDesc: 'Calculate percentage of a number, percentage changes (increase/decrease), and final sale discounts.',
    category: 'calculator',
    keywords: ['percentage calculator', 'percent change', 'discount calculator', 'percent increase', 'math tools'],
    icon: 'Percent',
    isPopular: true,
    seoDescription: 'Fast multi-mode percentage calculator. Compute what is X% of Y, percentage increase or decrease, and sale discounts.',
    component: PercentageCalculator,
  },
  {
    id: 'aspect-ratio-calculator',
    slug: 'aspect-ratio-calculator',
    title: 'Aspect Ratio & Dimension Calculator',
    shortDesc: 'Calculate 16:9, 4:3, 1:1, 21:9 responsive dimensions and scale resolutions with live preview.',
    category: 'calculator',
    keywords: ['aspect ratio calculator', '16:9 calculator', 'image dimensions', 'screen ratio', 'resolution scaler'],
    icon: 'Maximize2',
    seoDescription: 'Calculate aspect ratios and proportional dimensions for video editing, web design, photography, and UI layouts.',
    component: AspectRatioCalculator,
  },
  {
    id: 'timezone-converter',
    slug: 'timezone-converter',
    title: 'Timezone Converter & World Clock',
    shortDesc: 'Compare global times and schedule meetings across major world cities with an interactive hour slider.',
    category: 'calculator',
    keywords: ['timezone converter', 'world clock', 'time difference', 'utc converter', 'gmt offset'],
    icon: 'Clock',
    seoDescription: 'Interactive timezone converter comparing live time in New York, London, Tokyo, Istanbul, and Sydney.',
    component: TimezoneConverter,
  },
  {
    id: 'unit-converter',
    slug: 'unit-converter',
    title: 'Universal Unit Converter',
    shortDesc: 'Convert units across Length, Weight, Temperature, Data Storage, Speed, and Area.',
    category: 'calculator',
    keywords: ['unit converter', 'metric converter', 'celsius to fahrenheit', 'bytes to mb', 'km to miles'],
    icon: 'ArrowRightLeft',
    seoDescription: 'Comprehensive unit conversion tool for metric and imperial standards across length, mass, temperature, and digital storage.',
    component: UnitConverter,
  },

  // E. Developer & Data
  {
    id: 'json-formatter-validator',
    slug: 'json-formatter-validator',
    title: 'JSON Formatter, Beautifier & Validator',
    shortDesc: 'Format, beautify, validate, and minify JSON payloads with syntax error diagnostic markers.',
    category: 'dev',
    keywords: ['json formatter', 'json beautifier', 'json validator', 'minify json', 'json lint'],
    icon: 'Braces',
    isPopular: true,
    seoDescription: 'Online JSON formatter and linter powered by CodeMirror 6 and Prettier. Highlights exact error lines and minifies payloads.',
    component: JsonFormatterValidator,
  },
  {
    id: 'base64-encoder-decoder',
    slug: 'base64-encoder-decoder',
    title: 'Base64 Encoder & Decoder',
    shortDesc: 'Encode and decode plain text and data to Base64 with URL-safe RFC 4648 formatting.',
    category: 'dev',
    keywords: ['base64 encoder', 'base64 decoder', 'btoa', 'atob', 'url safe base64'],
    icon: 'Binary',
    isPopular: true,
    seoDescription: 'Convert plain text and binary strings to Base64 and decode Base64 back to text with URL-safe option.',
    component: Base64EncoderDecoder,
  },
  {
    id: 'hash-generator',
    slug: 'hash-generator',
    title: 'Hash Generator (SHA-256, SHA-512, SHA-1)',
    shortDesc: 'Generate cryptographic hashes from input strings using the hardware-accelerated Web Crypto API.',
    category: 'dev',
    keywords: ['hash generator', 'sha256', 'sha512', 'sha1', 'md5', 'cryptography', 'checksum'],
    icon: 'Hash',
    seoDescription: 'Generate instant SHA-256, SHA-512, SHA-384, and SHA-1 cryptographic hashes via Web Crypto API in your browser.',
    component: HashGenerator,
  },
  {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    title: 'Bulk UUID v4 Generator',
    shortDesc: 'Generate cryptographically random UUID v4 identifiers in bulk with uppercase, hyphen, and brace toggles.',
    category: 'dev',
    keywords: ['uuid generator', 'guid generator', 'random uuid', 'bulk uuid', 'uuid v4'],
    icon: 'Fingerprint',
    seoDescription: 'Generate thousands of random UUID v4 identifiers instantly. Export as plain text with customizable hyphenation.',
    component: UuidGenerator,
  },
  {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    title: 'JWT Token Decoder & Expiration Inspector',
    shortDesc: 'Decode JSON Web Token headers, payload claims, timestamps, and verify expiration dates privately.',
    category: 'dev',
    keywords: ['jwt decoder', 'decode jwt', 'jwt inspector', 'bearer token', 'json web token'],
    icon: 'Key',
    isPopular: true,
    seoDescription: 'Inspect and debug JWT tokens without sending sensitive authorization credentials or secrets over the wire.',
    component: JwtDecoder,
  },
  {
    id: 'curl-to-code',
    slug: 'curl-to-code',
    title: 'cURL to Code Converter (Fetch, Axios, Python, Go, Rust)',
    shortDesc: 'Convert cURL command syntax into native JavaScript fetch, Axios, Python requests, Go http, and Rust reqwest.',
    category: 'dev',
    keywords: ['curl to fetch', 'curl to python', 'curl to code', 'curl to axios', 'curl to go', 'curl converter'],
    icon: 'Terminal',
    isPopular: true,
    isNew: true,
    seoDescription: 'Instantly convert cURL API requests into clean, idiomatic JavaScript Fetch, Axios, Python Requests, Go net/http, and Rust reqwest code in your browser.',
    component: CurlConverter,
  },
  {
    id: 'regex-tester',
    slug: 'regex-tester',
    title: 'Regex Tester & Match Visualizer',
    shortDesc: 'Test regular expressions in real-time with capture group extraction, flags support, and error diagnostics.',
    category: 'dev',
    keywords: ['regex tester', 'regular expression', 'regex matcher', 'regex debugger', 'regex online'],
    icon: 'Terminal',
    isPopular: true,
    isNew: true,
    seoDescription: 'Test and debug JavaScript regular expressions in real-time with capture groups and flags.',
    component: RegexTester,
  },
  {
    id: 'unix-timestamp',
    slug: 'unix-timestamp',
    title: 'Unix Timestamp & Epoch Converter',
    shortDesc: 'Convert epoch seconds and milliseconds to human-readable dates (UTC, Local, ISO-8601) and vice-versa.',
    category: 'dev',
    keywords: ['unix timestamp', 'epoch converter', 'epoch to date', 'timestamp to date', 'current epoch'],
    icon: 'Clock',
    isPopular: true,
    isNew: true,
    seoDescription: 'Live Unix epoch clock and bidirectional date-to-timestamp converter.',
    component: UnixTimestampConverter,
  },
  {
    id: 'url-encoder-decoder',
    slug: 'url-encoder-decoder',
    title: 'URL & URI Component Encoder / Decoder',
    shortDesc: 'Encode and decode URI strings, escape query parameters, and parse URL search query parameters.',
    category: 'dev',
    keywords: ['url encoder', 'url decoder', 'encode uri', 'decode uri', 'query string parser'],
    icon: 'Binary',
    isPopular: true,
    isNew: true,
    seoDescription: 'Encode, decode, and parse URL query parameters instantly in your browser.',
    component: UrlEncoderDecoder,
  },
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.category === category);
}

export function getPopularTools(): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((t) => t.isPopular);
}

import { FormatId, FORMATS } from './matrix';

export interface FormatDetail {
  id: FormatId;
  name: string;
  shortName: string;
  extension: string;
  mimeType: string;
  typeSystem: 'Static' | 'Dynamic' | 'Schema-less' | 'Relational' | 'Document' | 'Tabular';
  specificationUrl: string;
  primaryUseCases: string[];
  syntaxHighlights: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface ComparisonFeature {
  feature: string;
  fromValue: string;
  toValue: string;
}

export interface PairSEOContent {
  title: string;
  description: string;
  h1: string;
  subtitle: string;
  advantages: string[];
  howToSteps: { step: number; title: string; description: string }[];
  faqs: { question: string; answer: string }[];
  comparisonTable: ComparisonFeature[];
}

export const FORMAT_DETAILS: Record<FormatId, FormatDetail> = {
  json: {
    id: 'json',
    name: 'JavaScript Object Notation',
    shortName: 'JSON',
    extension: 'json',
    mimeType: 'application/json',
    typeSystem: 'Schema-less',
    specificationUrl: 'https://www.json.org/json-en.html',
    primaryUseCases: ['REST APIs', 'NoSQL document storage', 'Configuration files', 'Browser-server data exchange'],
    syntaxHighlights: 'Key-value pairs enclosed in curly braces {}, double-quoted keys, comma-separated.',
    description: 'JSON is a lightweight, language-independent data-interchange format easily read by humans and parsed by machines.',
    pros: ['Universal runtime and language support', 'Human readable and compact', 'Native browser JSON.parse/stringify'],
    cons: ['No native comment support', 'No date or binary data types', 'Strict syntax requiring double quotes'],
  },
  yaml: {
    id: 'yaml',
    name: 'YAML Ain\'t Markup Language',
    shortName: 'YAML',
    extension: 'yaml',
    mimeType: 'application/x-yaml',
    typeSystem: 'Schema-less',
    specificationUrl: 'https://yaml.org/spec/',
    primaryUseCases: ['Kubernetes manifests', 'CI/CD pipeline workflows (GitHub Actions)', 'Application configuration (Docker Compose)'],
    syntaxHighlights: 'Indentation-sensitive structure, colon key-value pairs, dash-prefixed list items.',
    description: 'YAML is a human-friendly data serialization language optimized for readability and hierarchical configuration.',
    pros: ['First-class multi-line strings and comments', 'Minimal visual noise without braces', 'Rich anchor and alias reference system'],
    cons: ['Significant whitespace errors', 'Ambiguous type coercion (e.g. NO/YES as booleans)', 'Slower parsing speed'],
  },
  typescript: {
    id: 'typescript',
    name: 'TypeScript Interfaces & Types',
    shortName: 'TypeScript',
    extension: 'ts',
    mimeType: 'text/typescript',
    typeSystem: 'Static',
    specificationUrl: 'https://www.typescriptlang.org/docs/',
    primaryUseCases: ['Full-stack web applications', 'Frontend component prop types', 'SDKs & API contract validation'],
    syntaxHighlights: 'Typed interfaces with optional modifier (?), union types (|), generics, and readonly markers.',
    description: 'TypeScript adds static type definitions to JavaScript, enabling compile-time type safety and rich IDE autocomplete.',
    pros: ['Compile-time type checking prevents bugs', 'Self-documenting codebase', 'Universal frontend & backend ecosystem'],
    cons: ['Transpilation step required', 'Type erase at runtime without reflection', 'Complex union/generic syntax overhead'],
  },
  go: {
    id: 'go',
    name: 'Go Structs (Golang)',
    shortName: 'Go',
    extension: 'go',
    mimeType: 'text/x-go',
    typeSystem: 'Static',
    specificationUrl: 'https://go.dev/ref/spec',
    primaryUseCases: ['Cloud-native microservices', 'High-throughput backend APIs', 'CLI developer tools & DevOps agents'],
    syntaxHighlights: 'PascalCase struct fields with struct tags `json:"field_name,omitempty"`.',
    description: 'Go is a statically typed, compiled language engineered at Google for extreme concurrency and memory efficiency.',
    pros: ['Sub-millisecond serialization with struct tags', 'Fast compilation and lightweight memory footprint', 'Zero runtime reflection overhead'],
    cons: ['Verbose boilerplate for optional fields', 'No standard enum type', 'Nil pointer risks if unmarshaled improperly'],
  },
  rust: {
    id: 'rust',
    name: 'Rust Structs & Serde',
    shortName: 'Rust',
    extension: 'rs',
    mimeType: 'text/rust',
    typeSystem: 'Static',
    specificationUrl: 'https://serde.rs/',
    primaryUseCases: ['Systems programming', 'WebAssembly (Wasm) modules', 'Ultra-low latency microservices', 'Embedded & crypto'],
    syntaxHighlights: '#[derive(Serialize, Deserialize, Debug, Clone)] with Option<T> and snake_case serde renames.',
    description: 'Rust provides memory safety without garbage collection. Its Serde framework is the world standard for zero-copy deserialization.',
    pros: ['Zero-cost abstractions and fearless concurrency', 'Compile-time memory safety without GC', 'Serde macro ecosystem'],
    cons: ['Steep learning curve with borrow checker', 'Longer compilation times', 'Explicit Option and Result wrapping'],
  },
  python: {
    id: 'python',
    name: 'Python (Pydantic / TypedDict)',
    shortName: 'Python',
    extension: 'py',
    mimeType: 'text/x-python',
    typeSystem: 'Dynamic',
    specificationUrl: 'https://docs.pydantic.dev/',
    primaryUseCases: ['FastAPI backend microservices', 'Data science & Machine Learning pipelines', 'Automation scripts'],
    syntaxHighlights: 'Class definitions inheriting from BaseModel with Field(...) aliases and Optional[T] typing.',
    description: 'Python is a high-level interpreted language. Pydantic provides robust runtime schema validation and data parsing.',
    pros: ['Rapid prototyping and expressive syntax', 'Automatic runtime type coercion with Pydantic', 'Vast AI/ML library ecosystem'],
    cons: ['Interpreted performance overhead', 'Dynamic typing bugs without runtime validation', 'GIL concurrency constraints'],
  },
  csv: {
    id: 'csv',
    name: 'Comma-Separated Values',
    shortName: 'CSV',
    extension: 'csv',
    mimeType: 'text/csv',
    typeSystem: 'Tabular',
    specificationUrl: 'https://datatracker.ietf.org/doc/html/rfc4180',
    primaryUseCases: ['Spreadsheet export (Excel, Google Sheets)', 'Database bulk data loads', 'Data analytics datasets'],
    syntaxHighlights: 'First row header labels, comma delimiter, quoted fields with embedded commas or newlines.',
    description: 'CSV is the universal delimiter-based plain text format for tabular datasets and rectangular spreadsheets.',
    pros: ['Universal spreadsheet and database compatibility', 'Very small file size for flat records', 'Instant streaming ingestion'],
    cons: ['No support for nested or hierarchical data', 'No data types (everything is a string)', 'Delimiter escaping quirks'],
  },
  xml: {
    id: 'xml',
    name: 'Extensible Markup Language',
    shortName: 'XML',
    extension: 'xml',
    mimeType: 'application/xml',
    typeSystem: 'Document',
    specificationUrl: 'https://www.w3.org/TR/xml/',
    primaryUseCases: ['Enterprise SOAP integrations', 'Android layout resources & SVG graphics', 'Sitemaps and RSS feeds'],
    syntaxHighlights: 'Opening/closing tags <element>...</element>, element attributes, self-closing tags <tag/>.',
    description: 'XML is a flexible, structured markup language standard developed by the W3C for document and data interchange.',
    pros: ['Strict schema validation (XSD/DTD)', 'First-class attributes, namespaces, and CDATA', 'Universal enterprise legacy support'],
    cons: ['Extremely verbose and high bandwidth usage', 'Complex parsing models (DOM vs SAX)', 'Vulnerable to XXE injection if unparsed safely'],
  },
  toml: {
    id: 'toml',
    name: 'Tom\'s Obvious Minimal Language',
    shortName: 'TOML',
    extension: 'toml',
    mimeType: 'application/toml',
    typeSystem: 'Schema-less',
    specificationUrl: 'https://toml.io/en/',
    primaryUseCases: ['Rust Cargo.toml configuration', 'Python pyproject.toml package metadata', 'Hugo / static site configs'],
    syntaxHighlights: '[section_headers], key = "value" pairs, [[array_of_tables]], native ISO 8601 datetimes.',
    description: 'TOML aims to be a minimal configuration file format that is unambiguous and easy for humans to read and write.',
    pros: ['Unambiguous semantics with native date types', 'Clean table syntax for flat & grouped configs', 'No whitespace-dependent bugs'],
    cons: ['Clunky for deeply nested data structures', 'Less common in web APIs than JSON/YAML', 'Slightly more verbose for arrays of objects'],
  },
  sql: {
    id: 'sql',
    name: 'SQL (DDL & INSERT)',
    shortName: 'SQL',
    extension: 'sql',
    mimeType: 'application/sql',
    typeSystem: 'Relational',
    specificationUrl: 'https://en.wikipedia.org/wiki/SQL',
    primaryUseCases: ['Relational database table creation (PostgreSQL, MySQL, SQLite)', 'Batch record seeding', 'Data migrations'],
    syntaxHighlights: 'CREATE TABLE schema with VARCHAR, INT, BOOLEAN column types, PRIMARY KEY constraints, and INSERT statements.',
    description: 'SQL is the ANSI/ISO standard domain-specific language for managing and querying structured relational databases.',
    pros: ['ACID transaction and data integrity guarantees', 'Expressive relational constraints and index definition', 'Universal database query standard'],
    cons: ['Dialect fragmentation (Postgres vs MySQL vs SQLite)', 'Rigid schema alterations for live migrations', 'Requires normalized tabular structure'],
  },
};

/**
 * Returns customized, non-duplicate technical SEO content, comparative tables, and FAQs
 * for any given pair permutation from the 90 available converter matrix routes.
 */
export function getPairSEOData(fromId: FormatId, toId: FormatId): PairSEOContent {
  const from = FORMAT_DETAILS[fromId] || FORMAT_DETAILS.json;
  const to = FORMAT_DETAILS[toId] || FORMAT_DETAILS.typescript;

  const isTypeGenerator = ['typescript', 'go', 'rust', 'python'].includes(toId);
  const isDataSerialization = ['json', 'yaml', 'toml', 'xml', 'csv'].includes(toId);
  const isSqlGeneration = toId === 'sql';

  const title = `Convert ${from.shortName} to ${to.shortName} Online (Free, 100% Private & Instant)`;
  const description = `Transform ${from.name} (${from.shortName}) into clean, idiomatic ${to.name} (${to.shortName}) instantly. 100% client-side Web Worker execution, zero server uploads, and private URL sharing.`;
  const h1 = `${from.shortName} to ${to.shortName} Converter`;
  const subtitle = `Convert ${from.name} to ${to.name} with instant AST type inference, syntax validation, and zero server storage.`;

  // Dynamic advantages based on pair combination
  const advantages: string[] = [
    `100% Client-Side Privacy: Your ${from.shortName} payload never leaves your browser sandbox.`,
    `Sub-millisecond AST Engine: Parses ${from.shortName} and compiles ${to.shortName} in dedicated background Web Workers.`,
    isTypeGenerator
      ? `Idiomatic ${to.shortName} Code Generation: Synthesizes strict type definitions, struct tags, and optional field modifiers.`
      : isSqlGeneration
      ? `Relational Schema Synthesis: Automatically generates CREATE TABLE DDL and normalized INSERT INTO statements.`
      : `Lossless Serialization: Preserves primitive types, nested objects, and arrays when transforming into ${to.shortName}.`,
    `URL State Sharing: State is compressed into the URL hash (#data=...) with LZ-String without touching any cloud database.`,
  ];

  // Dynamic How-To Steps
  const howToSteps = [
    {
      step: 1,
      title: `Paste or Upload Your ${from.shortName}`,
      description: `Enter your ${from.shortName} code into the input editor, drop a .${from.extension} file, or click "Sample" to load a test template.`,
    },
    {
      step: 2,
      title: `Real-Time AST Compilation`,
      description: `The client-side parser parses your input into an Abstract Syntax Tree and maps data types to ${to.shortName} equivalents.`,
    },
    {
      step: 3,
      title: `Customize Output & Copy / Export`,
      description: `Review the synthesized ${to.shortName} output with full syntax highlighting, copy it with one click, or download as .${to.extension}.`,
    },
  ];

  // Dynamic Comparison Table
  const comparisonTable: ComparisonFeature[] = [
    {
      feature: 'Formal Name',
      fromValue: from.name,
      toValue: to.name,
    },
    {
      feature: 'Type System',
      fromValue: `${from.typeSystem} Typing`,
      toValue: `${to.typeSystem} Typing`,
    },
    {
      feature: 'Primary File Extension',
      fromValue: `.${from.extension}`,
      toValue: `.${to.extension}`,
    },
    {
      feature: 'MIME Standard',
      fromValue: from.mimeType,
      toValue: to.mimeType,
    },
    {
      feature: 'Core Strengths',
      fromValue: from.pros.slice(0, 2).join('; '),
      toValue: to.pros.slice(0, 2).join('; '),
    },
    {
      feature: 'Primary Environment',
      fromValue: from.primaryUseCases[0] || 'General computing',
      toValue: to.primaryUseCases[0] || 'General computing',
    },
  ];

  // Dynamic Contextual FAQs
  const faqs = [
    {
      question: `How does the ${from.shortName} to ${to.shortName} conversion work without a server?`,
      answer: `Our conversion engine runs entirely inside your browser using Web Workers and TypeScript AST compilation algorithms. When you paste your ${from.shortName}, it is parsed into memory and synthesized into ${to.shortName} within microseconds. Zero data is transmitted over the internet.`,
    },
    {
      question: `Is it safe to convert proprietary or confidential ${from.shortName} data?`,
      answer: `Yes, 100%. Because DevTransform operates under a zero-server architecture, your code, API keys, and sensitive schemas never leave your device. You can verify this by inspecting the Network tab in your browser developer tools.`,
    },
    {
      question: `How does this tool handle ${from.shortName} nested objects and arrays when converting to ${to.shortName}?`,
      answer: `Nested objects are recursively analyzed. In type-generating targets (like TypeScript, Go, or Rust), sub-objects are decomposed into individual typed interfaces or structs. In serialized targets (like YAML, TOML, or XML), hierarchy is preserved according to format specifications.`,
    },
    {
      question: `Can I share my converted ${to.shortName} code with teammates?`,
      answer: `Yes! Clicking "Share" compresses your workspace state using the LZ-String algorithm directly into the URL hash fragment (#data=...). Since hash fragments are never sent to web servers by HTTP protocol, your shared links remain completely confidential.`,
    },
    {
      question: `What is the maximum file size supported for ${from.shortName} conversion?`,
      answer: `Because calculations run in background Web Workers off the main UI thread, payloads up to tens of megabytes are handled smoothly without freezing your browser interface.`,
    },
  ];

  return {
    title,
    description,
    h1,
    subtitle,
    advantages,
    howToSteps,
    faqs,
    comparisonTable,
  };
}

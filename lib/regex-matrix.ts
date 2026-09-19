export interface RegexDefinition {
  slug: string;
  title: string;
  category: 'validation' | 'web' | 'formatting' | 'security';
  pattern: string;
  flags: string;
  description: string;
  sampleMatch: string;
  sampleFail: string;
  explanation: string[];
}

export const REGEX_PATTERNS: RegexDefinition[] = [
  {
    slug: 'email-validation-regex',
    title: 'Email Address Validation Regex',
    category: 'validation',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: 'i',
    description: 'Standard RFC-compliant email address validation pattern for form inputs.',
    sampleMatch: 'developer@example.com',
    sampleFail: 'developer@.com',
    explanation: [
      '^[a-zA-Z0-9._%+-]+ : Matches username with allowed email characters',
      '@[a-zA-Z0-9.-]+ : Matches domain name and subdomains',
      '\\.[a-zA-Z]{2,}$ : Matches top-level domain extension (at least 2 letters)',
    ],
  },
  {
    slug: 'strong-password-regex',
    title: 'Strong Password Policy Regex',
    category: 'security',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    flags: '',
    description: 'Enforces minimum 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol.',
    sampleMatch: 'P@ssw0rd2026!',
    sampleFail: 'password',
    explanation: [
      '(?=.*[a-z]) : At least one lowercase letter',
      '(?=.*[A-Z]) : At least one uppercase letter',
      '(?=.*\\d) : At least one digit',
      '(?=.*[@$!%*?&]) : At least one special symbol',
      '{8,} : Minimum length of 8 characters',
    ],
  },
  {
    slug: 'url-validation-regex',
    title: 'HTTP/HTTPS URL Validation Regex',
    category: 'web',
    pattern: '^https?:\\/\\/(?:www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b(?:[-a-zA-Z0-9()@:%_\\+.~#?&\\/=]*)$',
    flags: 'i',
    description: 'Validates web URLs including domain, optional port, and query parameter path.',
    sampleMatch: 'https://devtransform-hub.vercel.app/tools/',
    sampleFail: 'htp://invalid-url',
    explanation: [
      '^https?:\\/\\/ : Matches http or https protocol',
      '(?:www\\.)? : Optional www prefix',
      '[-a-zA-Z0-9...]{1,256} : Domain name',
      '\\.[a-zA-Z0-9()]{1,6} : Valid TLD extension',
    ],
  },
  {
    slug: 'ipv4-address-regex',
    title: 'IPv4 Address Validation Regex',
    category: 'security',
    pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    flags: '',
    description: 'Validates standard dotted decimal IPv4 network address within range 0.0.0.0 to 255.255.255.255.',
    sampleMatch: '192.168.1.1',
    sampleFail: '999.12.34.56',
    explanation: [
      '25[0-5] : Matches numbers 250-255',
      '2[0-4][0-9] : Matches numbers 200-249',
      '[01]?[0-9][0-9]? : Matches numbers 0-199',
      '\\. : Period delimiter repeated 3 times',
    ],
  },
  {
    slug: 'uuid-v4-regex',
    title: 'UUID v4 Identifier Validation Regex',
    category: 'validation',
    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    flags: 'i',
    description: 'Validates 36-character canonical random UUID version 4 format.',
    sampleMatch: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    sampleFail: 'invalid-uuid-string',
    explanation: [
      '^[0-9a-f]{8} : 8 hex digits',
      '-[0-9a-f]{4} : 4 hex digits',
      '-4[0-9a-f]{3} : Version 4 prefix with 3 hex digits',
      '-[89ab][0-9a-f]{3} : Variant bits (8, 9, a, or b)',
      '-[0-9a-f]{12}$ : 12 hex digits node identifier',
    ],
  },
  {
    slug: 'hex-color-regex',
    title: 'Hex Color Code Regex (#RGB and #RRGGBB)',
    category: 'web',
    pattern: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$',
    flags: 'i',
    description: 'Matches 3-digit or 6-digit CSS hexadecimal color notation.',
    sampleMatch: '#10b981',
    sampleFail: '#12345',
    explanation: [
      '^# : Requires starting hash symbol',
      '[A-Fa-f0-9]{6} : Matches full 6-digit hex format',
      '| : Or',
      '[A-Fa-f0-9]{3} : Matches shorthand 3-digit hex format',
    ],
  },
  {
    slug: 'slug-url-regex',
    title: 'SEO Friendly URL Slug Regex',
    category: 'web',
    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
    flags: '',
    description: 'Enforces lowercase alphanumeric words separated only by single hyphens with no trailing dashes.',
    sampleMatch: 'universal-developer-tools-2026',
    sampleFail: 'Invalid--Slug_Name',
    explanation: [
      '^[a-z0-9]+ : Starts with lowercase letter or digit',
      '(?:-[a-z0-9]+)*$ : Hyphen followed by alphanumeric segment repeated',
    ],
  },
  {
    slug: 'us-phone-number-regex',
    title: 'US Phone Number Format Regex',
    category: 'formatting',
    pattern: '^\\(?([0-9]{3})\\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$',
    flags: '',
    description: 'Validates 10-digit North American telephone numbers in formats like (123) 456-7890 or 123-456-7890.',
    sampleMatch: '(555) 234-5678',
    sampleFail: '12345',
    explanation: [
      '^\\(?([0-9]{3})\\)? : 3-digit area code with optional parentheses',
      '[-. ]? : Optional delimiter (hyphen, period, or space)',
      '([0-9]{3}) : 3-digit exchange code',
      '([0-9]{4})$ : 4-digit subscriber line number',
    ],
  },
  {
    slug: 'date-yyyy-mm-dd-regex',
    title: 'ISO 8601 Date (YYYY-MM-DD) Regex',
    category: 'formatting',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    flags: '',
    description: 'Matches standard ISO year-month-day calendar dates.',
    sampleMatch: '2026-09-04',
    sampleFail: '2026-13-45',
    explanation: [
      '^\\d{4} : 4-digit year',
      '-(0[1-9]|1[0-2]) : Month between 01 and 12',
      '-(0[1-9]|[12]\\d|3[01])$ : Day between 01 and 31',
    ],
  },
  {
    slug: 'jwt-token-regex',
    title: 'JSON Web Token (JWT) Format Regex',
    category: 'security',
    pattern: '^[A-Za-z0-9-_=]+\\.[A-Za-z0-9-_=]+\\.?[A-Za-z0-9-_.+/=]*$',
    flags: '',
    description: 'Validates structure of Base64URL-encoded Header.Payload.Signature JWT strings.',
    sampleMatch: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozGzN_ce9Trqnh9xsmvrmA6Y8b0VfP_w1sL8sR',
    sampleFail: 'not-a-jwt-token',
    explanation: [
      '^[A-Za-z0-9-_=]+ : Base64URL encoded header',
      '\\. : Period delimiter',
      '[A-Za-z0-9-_=]+ : Base64URL encoded payload',
      '\\.?... : Optional cryptographic signature block',
    ],
  },
  {
    slug: 'semver-version-regex',
    title: 'Semantic Versioning (SemVer) Regex',
    category: 'validation',
    pattern: '^v?(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
    flags: '',
    description: 'Validates official Semantic Versioning 2.0.0 strings including pre-release and build metadata.',
    sampleMatch: 'v2.4.1-alpha.3+build.2026',
    sampleFail: '2.4',
    explanation: [
      '^v? : Optional leading v prefix',
      '(0|[1-9]\\d*) : Major version number without leading zeros',
      '\\.(0|[1-9]\\d*) : Minor version number',
      '\\.(0|[1-9]\\d*) : Patch version number',
      '(?:-...) : Optional pre-release identifiers',
    ],
  },
  {
    slug: 'base64-string-regex',
    title: 'Base64 Encoded String Validation Regex',
    category: 'validation',
    pattern: '^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$',
    flags: '',
    description: 'Validates standard RFC 4648 Base64 encoded strings with valid length multiples of 4 and padding.',
    sampleMatch: 'SGVsbG8gV29ybGQh',
    sampleFail: 'Invalid Base64 string==',
    explanation: [
      '(?:[A-Za-z0-9+/]{4})* : Matches multiples of 4 base64 characters',
      '(?:...==|...=)? : Validates 0, 1, or 2 trailing padding equals signs',
    ],
  },
  {
    slug: 'hex-color-code-regex',
    title: 'Hexadecimal Color Code (#HEX) Regex',
    category: 'formatting',
    pattern: '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$',
    flags: '',
    description: 'Matches 3-digit shorthand, 6-digit RGB, or 8-digit RGBA hex color codes.',
    sampleMatch: '#10b981',
    sampleFail: '#10b981999',
    explanation: [
      '^# : Requires hashtag prefix',
      '[0-9a-fA-F]{3} : 3-digit shorthand (#RGB)',
      '[0-9a-fA-F]{6} : 6-digit standard (#RRGGBB)',
      '[0-9a-fA-F]{8} : 8-digit alpha (#RRGGBBAA)',
    ],
  },
  {
    slug: 'credit-card-number-regex',
    title: 'Credit Card Number (Visa / Master / Amex) Regex',
    category: 'validation',
    pattern: '^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$',
    flags: '',
    description: 'Validates primary card major industry identifiers for Visa, MasterCard, American Express, and Discover.',
    sampleMatch: '4111111111111111',
    sampleFail: '1234567890123456',
    explanation: [
      '4[0-9]{12}(?:[0-9]{3})? : Visa card format (13 or 16 digits starting with 4)',
      '5[1-5][0-9]{14} : MasterCard format (16 digits starting 51-55)',
      '3[47][0-9]{13} : American Express format (15 digits starting 34 or 37)',
    ],
  },
  {
    slug: 'mac-address-regex',
    title: 'Hardware MAC Address Regex',
    category: 'formatting',
    pattern: '^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$',
    flags: '',
    description: 'Matches standard 48-bit physical MAC addresses formatted with colons or hyphens.',
    sampleMatch: '00:1A:2B:3C:4D:5E',
    sampleFail: '00:1A:2B:3C:4D',
    explanation: [
      '([0-9A-Fa-f]{2}[:-]){5} : First five pairs of hex digits followed by colon or dash',
      '([0-9A-Fa-f]{2}) : Final hex octet pair',
    ],
  },
  {
    slug: 'port-number-regex',
    title: 'TCP / UDP Network Port (1-65535) Regex',
    category: 'validation',
    pattern: '^([1-9][0-9]{0,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$',
    flags: '',
    description: 'Validates network port numbers strictly between 1 and 65,535.',
    sampleMatch: '8080',
    sampleFail: '70000',
    explanation: [
      'Matches all valid 16-bit unsigned integer port boundaries up to 65535 without leading zeros.',
    ],
  },
  {
    slug: 'git-commit-hash-regex',
    title: 'Git Commit Hash (SHA-1 / SHA-256) Regex',
    category: 'validation',
    pattern: '^[0-9a-fA-F]{7,40}$',
    flags: '',
    description: 'Matches short (7-char) and full (40-char SHA-1) Git commit hashes.',
    sampleMatch: '7075d8a',
    sampleFail: 'git-commit-xyz',
    explanation: [
      '^[0-9a-fA-F]{7,40}$ : Hexadecimal string between 7 and 40 characters in length.',
    ],
  },
  {
    slug: 'cuid-validation-regex',
    title: 'CUID & CUID2 Collision-Resistant ID Regex',
    category: 'validation',
    pattern: '^[a-z0-9]{24,32}$',
    flags: '',
    description: 'Validates modern secure collision-resistant identifiers (CUID and CUID2) used in high-scale distributed systems.',
    sampleMatch: 'cl01abcde000001l0abcdefgh',
    sampleFail: 'INVALID_CUID_WITH_UPPERCASE!',
    explanation: [
      '^[a-z0-9]{24,32}$ : Matches lowercase alphanumeric string between 24 and 32 characters',
    ],
  },
  {
    slug: 'cron-expression-regex',
    title: '5-Field Unix Cron Expression Regex',
    category: 'validation',
    pattern: '^(@(annually|yearly|monthly|weekly|daily|hourly|reboot))|(@every (\\d+(ns|us|µs|ms|s|m|h))+)|((((\\d+,)+\\d+|(\\d+(\\/|-)\\d+)|\\d+|\\*) ?){5,7})$',
    flags: '',
    description: 'Validates standard 5-to-7 field crontab expressions including wildcard, ranges, steps, and shortcuts.',
    sampleMatch: '*/15 0 1,15 * 1-5',
    sampleFail: 'invalid cron string',
    explanation: [
      'Matches standard 5 to 7 space-separated fields for minute, hour, day of month, month, and day of week.',
    ],
  },
  {
    slug: 'nanoid-validation-regex',
    title: 'NanoID (21-character) URL-Friendly ID Regex',
    category: 'validation',
    pattern: '^[A-Za-z0-9_-]{21}$',
    flags: '',
    description: 'Validates default 21-character URL-friendly, compact NanoID strings.',
    sampleMatch: 'V1StGXR8_Z5jdHi6B-myT',
    sampleFail: 'too_short_id',
    explanation: [
      '^[A-Za-z0-9_-]{21}$ : Matches exactly 21 URL-safe characters from the A-Z, a-z, 0-9, _, - alphabet.',
    ],
  },
  {
    slug: 'youtube-video-id-regex',
    title: 'YouTube Video ID & URL Extractor Regex',
    category: 'web',
    pattern: '^(?:https?:\\/\\/)?(?:www\\.)?(?:youtu\\.be\\/|youtube\\.com\\/(?:embed\\/|v\\/|watch\\?v=|watch\\?.+&v=))([\\w-]{11})(?:\\S+)?$',
    flags: 'i',
    description: 'Matches YouTube video URLs and captures the 11-character unique video identifier.',
    sampleMatch: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    sampleFail: 'https://vimeo.com/123456',
    explanation: [
      'Captures the 11-character alphanumeric YouTube ID from youtu.be, embed, or watch URLs.',
    ],
  },
  {
    slug: 'html-tag-regex',
    title: 'HTML Opening & Closing Tag Stripper Regex',
    category: 'web',
    pattern: '<\\/?[a-zA-Z][^>]*>',
    flags: 'g',
    description: 'Finds and strips opening, closing, and self-closing HTML/XML markup tags from rich text strings.',
    sampleMatch: '<div class="active" data-id="10">',
    sampleFail: 'Plain text with no markup',
    explanation: [
      '< : Opening bracket',
      '\\/? : Optional forward slash for closing tags',
      '[a-zA-Z] : Starts with tag element letter',
      '[^>]*> : Matches all attribute characters until closing bracket',
    ],
  },
  {
    slug: 'markdown-image-link-regex',
    title: 'Markdown Image Syntax Regex',
    category: 'web',
    pattern: '!\\[([^\\]]*)\\]\\(([^\\s)]+)(?:\\s+"([^"]+)")?\\)',
    flags: 'g',
    description: 'Extracts alt text, image URL, and optional title from standard Markdown image tags.',
    sampleMatch: '![Company Logo](https://example.com/logo.png "Brand")',
    sampleFail: '[Normal link](https://example.com)',
    explanation: [
      '! : Image indicator exclamation mark',
      '\\[([^\\]]*)\\] : Captures alt text within brackets',
      '\\(([^\\s)]+) : Captures image URL within parentheses',
      '(?:\\s+"([^"]+)")?\\) : Captures optional title quote before closing parenthesis',
    ],
  },
  {
    slug: 'semantic-version-semver-regex',
    title: 'Semantic Versioning (SemVer 2.0.0) Regex',
    category: 'validation',
    pattern: '^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?$',
    flags: '',
    description: 'Official SemVer 2.0.0 regular expression supporting MAJOR.MINOR.PATCH, prerelease identifiers, and build metadata.',
    sampleMatch: '2.1.0-alpha.1+build.847',
    sampleFail: '01.2.3',
    explanation: [
      '^(0|[1-9]\\d*) : Major version with no leading zeros',
      '\\.(0|[1-9]\\d*) : Minor version with no leading zeros',
      '\\.(0|[1-9]\\d*) : Patch version with no leading zeros',
      '(?:-((...)))? : Optional prerelease tag (e.g. -beta.1)',
      '(?:\\+((...)))? : Optional build metadata (e.g. +sha.49a8f2)',
    ],
  },
  {
    slug: 'docker-image-tag-regex',
    title: 'Docker Image Repository & Tag Name Regex',
    category: 'validation',
    pattern: '^(?:(?=[^:\\/]{1,253})(?!-)[a-zA-Z0-9-]{1,63}(?<!-)(?:\\.(?!-)[a-zA-Z0-9-]{1,63}(?<!-))*(?::[0-9]{1,5})?\\/)?(?:[a-z0-9]+(?:[._-][a-z0-9]+)*\\/)*[a-z0-9]+(?:[._-][a-z0-9]+)*(?::[\\w][\\w.-]{0,127})?$',
    flags: '',
    description: 'Validates complete Docker image references including optional registry domain, namespace, image name, and tag.',
    sampleMatch: 'ghcr.io/org/service-app:v1.4.2',
    sampleFail: 'Invalid Image Name : With Spaces',
    explanation: [
      'Matches optional registry host (e.g. registry.hub.docker.com:5000/)',
      'Matches multi-tier organization or username repositories',
      'Matches standard Docker tag with colon separator',
    ],
  },
  {
    slug: 'hex-uuid-clean-regex',
    title: 'Un-hyphenated 32-Char Hexadecimal UUID Regex',
    category: 'formatting',
    pattern: '^[0-9a-fA-F]{32}$',
    flags: '',
    description: 'Validates 32-character compact hexadecimal UUIDs/GUIDs stripped of standard hyphen delimiters.',
    sampleMatch: 'e7236c525b5b444da6428c3ed5a29340',
    sampleFail: 'e7236c52-5b5b-444d-a642-8c3ed5a29340',
    explanation: [
      '^[0-9a-fA-F]{32}$ : Matches exactly thirty-two hexadecimal digits from start to end without hyphens.',
    ],
  },
  {
    slug: 'sql-injection-heuristic-regex',
    title: 'SQL Injection Attack Detection Heuristic Regex',
    category: 'security',
    pattern: '(?i)(?:\\b(select|union|insert|update|delete|drop|alter|create|truncate|exec|execute)\\b|--|/\\*|\\*/|xp_cmdshell|\\bwaitfor\\s+delay\\b)',
    flags: 'i',
    description: 'Detects common SQL injection attack signatures, comments, and dangerous stored procedures in user inputs.',
    sampleMatch: "1' UNION SELECT username, password FROM users --",
    sampleFail: 'john_doe_99',
    explanation: [
      '(?i) : Case insensitive match',
      '\\b(select|union|...) : Matches high-risk SQL keywords as discrete tokens',
      '--|/\\* : Detects inline SQL comment syntax intended to truncate remaining queries',
    ],
  },
  {
  "slug": "ipv6-address-regex",
  "title": "IPv6 Address Validation Regex",
  "category": "web",
  "pattern": "^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$",
  "flags": "i",
  "description": "Validates standard, compressed, and IPv4-mapped IPv6 network addresses compliant with RFC 4291.",
  "sampleMatch": "2001:0db8:85a3:0000:0000:8a2e:0370:7334",
  "sampleFail": "2001:db8:::8a2e:370:7334:extra",
  "explanation": [
    "^ : Starts at beginning of string",
    "([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4} : Matches full 8-group 128-bit hex notation",
    "| : Evaluates compressed double-colon (::) representations",
    "$ : Must terminate without trailing characters"
  ]
},
  {
  "slug": "international-e164-phone-regex",
  "title": "International E.164 Phone Number Regex",
  "category": "validation",
  "pattern": "^\\+[1-9]\\d{1,14}$",
  "flags": "",
  "description": "Strict ITU-T E.164 international phone number format beginning with plus sign followed by 2 to 15 digits.",
  "sampleMatch": "+14155552671",
  "sampleFail": "05321234567",
  "explanation": [
    "^\\+ : Requires leading plus symbol for country calling code",
    "[1-9] : Leading country code digit cannot be zero",
    "\\d{1,14}$ : Accommodates up to 14 subscriber digits according to ITU standard"
  ]
},
  {
  "slug": "uk-phone-number-regex",
  "title": "United Kingdom Phone Number Regex",
  "category": "validation",
  "pattern": "^(?:(?:\\(?(?:0(?:0|11)\\)?[\\s-]?\\(?|\\+)44\\)?[\\s-]?(?:\\(?0\\)?[\\s-]?)?)|(?:\\(?0))(?:(?:\\d{5}\\)?[\\s-]?\\d{4,5})|(?:\\d{4}\\)?[\\s-]?(?:\\d{5}|\\d{3}[\\s-]?\\d{3}))|(?:\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{3,4})|(?:\\d{2}\\)?[\\s-]?\\d{4}[\\s-]?\\d{4}))(?:[\\s-]?(?:x|ext\\.?)[\\s-]?\\d{1,5})?$",
  "flags": "i",
  "description": "Comprehensive United Kingdom mobile, landline, and national dialing format validator.",
  "sampleMatch": "+44 7911 123456",
  "sampleFail": "+44 123",
  "explanation": [
    "^(?:\\+44|0) : Supports international +44 prefix or local leading zero",
    "Matches standard 10 or 11 digit geographic and mobile UK area codes",
    "Permits optional spacing, hyphens, and office extension tags"
  ]
},
  {
  "slug": "visa-card-regex",
  "title": "Visa Credit Card Number Regex",
  "category": "security",
  "pattern": "^4[0-9]{12}(?:[0-9]{3})?$",
  "flags": "",
  "description": "Matches 13-digit and standard 16-digit Visa debit and credit card numbers starting with 4.",
  "sampleMatch": "4111111111111111",
  "sampleFail": "5111111111111111",
  "explanation": [
    "^4 : Visa Issuer Identification Number (IIN) always begins with digit 4",
    "[0-9]{12} : Base 12 digits",
    "(?:[0-9]{3})?$ : Optional 3 additional digits for standard 16-digit cards"
  ]
},
  {
  "slug": "mastercard-card-regex",
  "title": "Mastercard Credit Card Number Regex",
  "category": "security",
  "pattern": "^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$",
  "flags": "",
  "description": "Validates 16-digit Mastercard card numbers across traditional 51-55 series and 2221-2720 2-series ranges.",
  "sampleMatch": "5500000000000004",
  "sampleFail": "4500000000000004",
  "explanation": [
    "5[1-5] : Traditional Mastercard bin range 51 through 55",
    "222[1-9]|... : Modern 2-series BIN ranges introduced in 2017",
    "[0-9]{12}$ : Remaining 12 subscriber account digits"
  ]
},
  {
  "slug": "amex-card-regex",
  "title": "American Express (Amex) Card Regex",
  "category": "security",
  "pattern": "^3[47][0-9]{13}$",
  "flags": "",
  "description": "Validates 15-digit American Express credit cards starting with prefixes 34 or 37.",
  "sampleMatch": "378282246310005",
  "sampleFail": "388282246310005",
  "explanation": [
    "^3[47] : Amex cards strictly begin with either 34 or 37",
    "[0-9]{13}$ : Exactly 13 digits follow for a 15-digit total card number"
  ]
},
  {
  "slug": "iso-8601-datetime-regex",
  "title": "ISO 8601 UTC / Timestamp Regex",
  "category": "formatting",
  "pattern": "^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(?:\\.\\d+)?(?:Z|[+-]\\d{2}:\\d{2})$",
  "flags": "",
  "description": "Matches standard ISO 8601 and RFC 3339 formatted timestamps including millisecond precision and UTC/timezone offsets.",
  "sampleMatch": "2026-09-20T02:45:00.000Z",
  "sampleFail": "2026-09-20 02:45:00",
  "explanation": [
    "^\\d{4}-\\d{2}-\\d{2} : YYYY-MM-DD calendar date components",
    "T : Literal delimiter separating date from time",
    "\\d{2}:\\d{2}:\\d{2} : Hour, minute, and second values",
    "(?:\\.\\d+)? : Optional millisecond fractions",
    "(?:Z|[+-]\\d{2}:\\d{2})$ : UTC indicator (Z) or explicit timezone delta"
  ]
},
  {
  "slug": "time-24-hour-hh-mm-regex",
  "title": "24-Hour Time (HH:mm) Regex",
  "category": "formatting",
  "pattern": "^(?:[01]\\d|2[0-3]):[0-5]\\d$",
  "flags": "",
  "description": "Validates 24-hour military and European clock time from 00:00 through 23:59.",
  "sampleMatch": "23:59",
  "sampleFail": "24:00",
  "explanation": [
    "[01]\\d|2[0-3] : Restricts hours from 00 to 23",
    ": : Colon separator",
    "[0-5]\\d : Restricts minutes from 00 to 59"
  ]
},
  {
  "slug": "time-12-hour-am-pm-regex",
  "title": "12-Hour Time with AM/PM Regex",
  "category": "formatting",
  "pattern": "^(?:1[0-2]|0?[1-9]):[0-5]\\d\\s*(?:[AaPp][Mm])$",
  "flags": "",
  "description": "Validates standard 12-hour time formats with case-insensitive AM or PM indicators.",
  "sampleMatch": "11:45 PM",
  "sampleFail": "13:00 PM",
  "explanation": [
    "(?:1[0-2]|0?[1-9]) : Hours 1 through 12 with optional leading zero",
    ": : Time colon delimiter",
    "[0-5]\\d : Valid minute representation 00-59",
    "\\s*(?:[AaPp][Mm]) : Optional space followed by AM or PM designation"
  ]
},
  {
  "slug": "zip-code-us-regex",
  "title": "United States Postal ZIP Code Regex",
  "category": "validation",
  "pattern": "^\\d{5}(?:-\\d{4})?$",
  "flags": "",
  "description": "Matches 5-digit US ZIP codes and standard 9-digit ZIP+4 formats (12345 or 12345-6789).",
  "sampleMatch": "94016-1234",
  "sampleFail": "9401",
  "explanation": [
    "^\\d{5} : Mandatory 5-digit base postal zone",
    "(?:-\\d{4})?$ : Optional hyphen and 4-digit routing extension"
  ]
},
  {
  "slug": "postal-code-uk-regex",
  "title": "United Kingdom Postcode Regex",
  "category": "validation",
  "pattern": "^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$",
  "flags": "i",
  "description": "Validates official UK postcodes across all outward and inward alphanumeric sectors.",
  "sampleMatch": "SW1A 1AA",
  "sampleFail": "12345",
  "explanation": [
    "^[A-Z]{1,2}[0-9][A-Z0-9]? : Outward code representing postal area and district",
    " ? : Optional spacing",
    "[0-9][A-Z]{2}$ : Inward code pinpointing street unit"
  ]
},
  {
  "slug": "postal-code-canada-regex",
  "title": "Canada Postal Code Regex",
  "category": "validation",
  "pattern": "^[A-CEGHJ-NPR-TVXY]\\d[A-CEGHJ-NPR-TV-Z] ?\\d[A-CEGHJ-NPR-TV-Z]\\d$",
  "flags": "i",
  "description": "Validates Canadian postal codes adhering to official Canada Post character exclusions (excludes D, F, I, O, Q, U).",
  "sampleMatch": "K1A 0B1",
  "sampleFail": "D1A 0B1",
  "explanation": [
    "^[A-CEGHJ-NPR-TVXY] : First letter denotes geographic province (excludes disallowed letters)",
    "\\d[A-Z] : Alternating number and letter structure",
    "? : Optional space separating Forward Sortation Area from Local Delivery Unit"
  ]
},
  {
  "slug": "bitcoin-address-regex",
  "title": "Bitcoin (BTC) Address Regex",
  "category": "security",
  "pattern": "^(?:1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-zA-HJ-NP-Z0-9]{25,39})$",
  "flags": "",
  "description": "Validates Bitcoin Legacy (P2PKH starting with 1), SegWit P2SH (starting with 3), and Native SegWit (Bech32 starting with bc1) wallet addresses.",
  "sampleMatch": "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq",
  "sampleFail": "0x71C8451C3343244F00806440",
  "explanation": [
    "1[...] : Base58Check P2PKH address",
    "3[...] : Base58Check script hash P2SH address",
    "bc1[...] : Native Bech32 SegWit format"
  ]
},
  {
  "slug": "ethereum-address-regex",
  "title": "Ethereum (ETH) Address Regex",
  "category": "security",
  "pattern": "^0x[a-fA-F0-9]{40}$",
  "flags": "",
  "description": "Validates Ethereum and EVM-compatible (Polygon, Arbitrum, BSC) public account and contract hexadecimal addresses.",
  "sampleMatch": "0x71C8451C3343244F0080644085429188e7D4d715",
  "sampleFail": "71C8451C3343244F0080644085429188e7D4d715",
  "explanation": [
    "^0x : Mandatory hexadecimal prefix",
    "[a-fA-F0-9]{40}$ : Exactly 40 hexadecimal characters representing 20-byte address hash"
  ]
},
  {
  "slug": "twitter-username-handle-regex",
  "title": "Twitter / X Username Handle Regex",
  "category": "web",
  "pattern": "^@?[a-zA-Z0-9_]{1,15}$",
  "flags": "",
  "description": "Validates Twitter and X user handles, allowing an optional leading @ symbol and up to 15 alphanumeric or underscore characters.",
  "sampleMatch": "@devtransform",
  "sampleFail": "@this_username_is_way_too_long_for_x",
  "explanation": [
    "^@? : Optional leading @ symbol",
    "[a-zA-Z0-9_]{1,15}$ : Restricts handle length to Twitter policy max of 15 chars"
  ]
},
  {
  "slug": "github-username-regex",
  "title": "GitHub Username Regex",
  "category": "web",
  "pattern": "^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$",
  "flags": "",
  "description": "Strictly complies with GitHub username rules: max 39 chars, alphanumeric, single internal hyphens, no consecutive hyphens, cannot start or end with a hyphen.",
  "sampleMatch": "ensibey",
  "sampleFail": "-invalid-name",
  "explanation": [
    "^[a-zA-Z0-9] : Must begin with alphanumeric character",
    "-(?=[a-zA-Z0-9]) : Hyphens permitted only if followed immediately by alphanumeric (no consecutive hyphens)",
    "{0,38}$ : Total length capped at 39 characters"
  ]
},
  {
  "slug": "domain-name-fqdn-regex",
  "title": "Fully Qualified Domain Name (FQDN) Regex",
  "category": "web",
  "pattern": "^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\\.(?:[A-Za-z]{2,}|(?:[A-Za-z0-9-]{1,63}(?<!-)\\.)+[A-Za-z]{2,})$",
  "flags": "",
  "description": "RFC 1035 compliant domain name and hostname validator preventing leading/trailing hyphens in labels.",
  "sampleMatch": "api.devtransform-hub.vercel.app",
  "sampleFail": "-bad-domain.com",
  "explanation": [
    "(?!-)[A-Za-z0-9-]{1,63}(?<!-) : Each domain label up to 63 chars, disallowing leading/trailing dashes",
    "\\.[A-Za-z]{2,}$ : Top level domain must contain at least 2 alphabetic characters"
  ]
},
  {
  "slug": "subdomain-extractor-regex",
  "title": "Subdomain Extraction Regex",
  "category": "web",
  "pattern": "^(?:https?:\\/\\/)?([a-zA-Z0-9-]+)\\.[a-zA-Z0-9-]+\\.[a-zA-Z]{2,}",
  "flags": "i",
  "description": "Captures and isolates the third-level subdomain prefix from a full hostname or URL.",
  "sampleMatch": "https://staging.example.com",
  "sampleFail": "example.com",
  "explanation": [
    "(?:https?:\\/\\/)? : Disregards optional protocol schema",
    "([a-zA-Z0-9-]+) : First capturing group isolates the leading subdomain label",
    "\\.[a-zA-Z0-9-]+\\.[a-zA-Z]{2,} : Confirms presence of root domain and TLD"
  ]
},
  {
  "slug": "file-extension-regex",
  "title": "File Extension Extraction Regex",
  "category": "formatting",
  "pattern": "\\.([a-zA-Z0-9]+)(?:\\?|#|$)",
  "flags": "i",
  "description": "Isolates the trailing file extension from local paths, URLs, or document names while safely ignoring query strings and hashes.",
  "sampleMatch": "/uploads/invoice_report.pdf?version=2",
  "sampleFail": "folder_without_extension/",
  "explanation": [
    "\\. : Literal period preceding extension name",
    "([a-zA-Z0-9]+) : Captures alphanumeric extension tag",
    "(?:\\?|#|$) : Stops before URL query parameters, fragment anchors, or end of string"
  ]
},
  {
  "slug": "rgb-rgba-color-regex",
  "title": "CSS RGB / RGBA Color Function Regex",
  "category": "formatting",
  "pattern": "^rgba?\\(\\s*(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\s*,\\s*(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\s*,\\s*(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d)\\s*(?:,\\s*(?:0|1|0?\\.\\d+)\\s*)?\\)$",
  "flags": "i",
  "description": "Matches valid CSS rgb(255, 255, 255) and rgba(0, 0, 0, 0.5) declarations restricting channels to 0-255.",
  "sampleMatch": "rgba(16, 185, 129, 0.85)",
  "sampleFail": "rgb(300, 0, 0)",
  "explanation": [
    "^rgba? : Matches rgb or rgba function declaration",
    "(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]?\\d) : Ensures each R, G, B channel falls within valid 0 to 255 boundary",
    "(?:,\\s*(?:0|1|0?\\.\\d+))? : Optional alpha transparency channel (0.0 to 1.0)"
  ]
},
  {
  "slug": "hsl-hsla-color-regex",
  "title": "CSS HSL / HSLA Color Function Regex",
  "category": "formatting",
  "pattern": "^hsla?\\(\\s*(?:360|3[0-5]\\d|[12]?\\d{1,2})\\s*,\\s*(?:100|[1-9]?\\d)%\\s*,\\s*(?:100|[1-9]?\\d)%\\s*(?:,\\s*(?:0|1|0?\\.\\d+)\\s*)?\\)$",
  "flags": "i",
  "description": "Validates CSS hsl() and hsla() syntax, clamping hue to 0-360 and saturation/lightness to 0%-100%.",
  "sampleMatch": "hsl(142, 70%, 45%)",
  "sampleFail": "hsl(400, 50%, 50%)",
  "explanation": [
    "(?:360|3[0-5]\\d|[12]?\\d{1,2}) : Validates hue angle from 0 to 360 degrees",
    "(?:100|[1-9]?\\d)% : Validates percentage values 0% to 100% for saturation and lightness",
    "Optional alpha channel for hsla"
  ]
},
  {
  "slug": "html-attribute-extractor-regex",
  "title": "HTML Attribute Value Extractor Regex",
  "category": "formatting",
  "pattern": "\\b([a-zA-Z-]+)=[\"\\']([^\"\\']+)[\"\\']",
  "flags": "g",
  "description": "Extracts HTML attribute key-value pairs (e.g., href=\"...\", class=\"...\", data-id=\"...\") from markup tags.",
  "sampleMatch": "href=\"https://devtransform-hub.vercel.app\" class=\"text-brand\"",
  "sampleFail": "plain text without attributes",
  "explanation": [
    "\\b([a-zA-Z-]+) : First capture group matches attribute name",
    "=[\"\\'] : Equals sign with double or single opening quote",
    "([^\"\\']+) : Second capture group matches attribute value until closing quote"
  ]
},
  {
  "slug": "markdown-url-link-regex",
  "title": "Markdown Link Extractor Regex",
  "category": "formatting",
  "pattern": "\\[([^\\]]+)\\]\\((https?:\\/\\/[^\\s\\)]+)\\)",
  "flags": "g",
  "description": "Parses and extracts markdown hyperlink text labels and target destination URLs [Title](https://...).",
  "sampleMatch": "[DevTransform Suite](https://devtransform-hub.vercel.app)",
  "sampleFail": "![Alt text](image.png)",
  "explanation": [
    "\\[([^\\]]+)\\] : Captures link anchor text inside square brackets",
    "\\((https?:\\/\\/[^\\s\\)]+)\\) : Captures valid HTTP/HTTPS destination URL in parentheses"
  ]
},
  {
  "slug": "camelcase-to-snakecase-regex",
  "title": "CamelCase Word Boundary Regex",
  "category": "formatting",
  "pattern": "([a-z0-9])([A-Z])",
  "flags": "g",
  "description": "Identifies transitional word boundaries in camelCase and PascalCase identifiers to convert strings into snake_case or kebab-case.",
  "sampleMatch": "devTransformHub",
  "sampleFail": "lowercase",
  "explanation": [
    "([a-z0-9]) : Captures preceding lowercase letter or digit",
    "([A-Z]) : Captures subsequent uppercase letter initiating new word"
  ]
},
  {
  "slug": "double-word-duplicate-regex",
  "title": "Duplicate Consecutive Word Regex",
  "category": "formatting",
  "pattern": "\\b([a-zA-Z]+)\\s+\\1\\b",
  "flags": "i",
  "description": "Finds accidental repeated words in editorial prose and code comments (e.g., \"the the\", \"in in\").",
  "sampleMatch": "This is the the best tool",
  "sampleFail": "This is the best tool",
  "explanation": [
    "\\b([a-zA-Z]+) : Matches and captures an entire word at a word boundary",
    "\\s+ : One or more whitespace spaces",
    "\\1\\b : Backreference matches the exact duplicate word"
  ]
},
  {
  "slug": "leading-trailing-whitespace-regex",
  "title": "Leading & Trailing Whitespace Regex",
  "category": "formatting",
  "pattern": "^\\s+|\\s+$",
  "flags": "g",
  "description": "Targets superfluous leading and trailing spaces or tab characters across string lines for clean sanitization.",
  "sampleMatch": "   untrimmed developer input   ",
  "sampleFail": "clean input",
  "explanation": [
    "^\\s+ : Matches spaces at beginning of line",
    "| : Logical OR operator",
    "\\s+$ : Matches trailing whitespace before end of line"
  ]
},
  {
  "slug": "c-style-comment-regex",
  "title": "C-Style Code Comment Regex",
  "category": "formatting",
  "pattern": "\\/\\*[\\s\\S]*?\\*\\/|\\/\\/.*",
  "flags": "g",
  "description": "Matches single-line (//) and multi-line (/* ... */) code comments across JavaScript, C, Java, Go, and PHP.",
  "sampleMatch": "/* Multi-line comment block */ // single line comment",
  "sampleFail": "const x = 10 / 2;",
  "explanation": [
    "\\/\\*[\\s\\S]*?\\*\\/ : Non-greedy match of multi-line comment blocks",
    "| : Logical OR operator",
    "\\/\\/.* : Single line comment from double slash to end of line"
  ]
},
  {
  "slug": "json-key-value-regex",
  "title": "JSON Key-Value Pair Extractor Regex",
  "category": "formatting",
  "pattern": "\"([^\"]+)\"\\s*:\\s*(\"[^\"]*\"|\\d+(?:\\.\\d+)?|true|false|null)",
  "flags": "g",
  "description": "Extracts property keys and primitive values (strings, numbers, booleans, null) from JSON data strings.",
  "sampleMatch": "\"status\": 200, \"isClient\": true, \"name\": \"DevTransform\"",
  "sampleFail": "{ empty: object }",
  "explanation": [
    "\"([^\"]+)\" : Captures JSON attribute key name",
    "\\s*:\\s* : Colon property delimiter with surrounding whitespace",
    "Second group captures string values, numbers, or boolean literals"
  ]
}
];



export function getAllRegexPatterns(): RegexDefinition[] {
  return REGEX_PATTERNS;
}

export function getRegexPattern(slug: string): RegexDefinition | null {
  return REGEX_PATTERNS.find((r) => r.slug === slug) || null;
}

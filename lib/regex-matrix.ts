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
];

export function getAllRegexPatterns(): RegexDefinition[] {
  return REGEX_PATTERNS;
}

export function getRegexPattern(slug: string): RegexDefinition | null {
  return REGEX_PATTERNS.find((r) => r.slug === slug) || null;
}

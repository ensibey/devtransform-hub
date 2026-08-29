export interface TextTransformation {
  slug: string;
  name: string;
  nameTr: string;
  description: string;
  descriptionTr: string;
  category: 'case' | 'clean' | 'crypto' | 'encoding';
  sampleInput: string;
  transform: (input: string) => string;
}

export const TEXT_TRANSFORMATIONS: TextTransformation[] = [
  // 1. Case Conversions
  {
    slug: 'camelcase-to-snake-case',
    name: 'camelCase to snake_case',
    nameTr: 'camelCase metnini snake_case formatına çevirme',
    description: 'Converts camelCase text into snake_case separated by underscores.',
    descriptionTr: 'camelCase (deve hörgücü) formatındaki değişkenleri alt çizgi (_) ile ayrılmış snake_case formatına dönüştürür.',
    category: 'case',
    sampleInput: 'userProfileDataAndAccountSettings',
    transform: (str) =>
      str
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[\s-]+/g, '_')
        .toLowerCase(),
  },
  {
    slug: 'snake-case-to-camelcase',
    name: 'snake_case to camelCase',
    nameTr: 'snake_case metnini camelCase formatına çevirme',
    description: 'Converts snake_case text into camelCase variables.',
    descriptionTr: 'Alt çizgi ile ayrılmış snake_case formatındaki metinleri camelCase formatına dönüştürür.',
    category: 'case',
    sampleInput: 'user_profile_data_and_account_settings',
    transform: (str) =>
      str
        .toLowerCase()
        .replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
  },
  {
    slug: 'snake-case-to-kebab-case',
    name: 'snake_case to kebab-case',
    nameTr: 'snake_case metnini kebab-case formatına çevirme',
    description: 'Converts snake_case text into hyphenated kebab-case URLs or identifiers.',
    descriptionTr: 'snake_case metinlerini tire (-) ile ayrılmış URL dostu kebab-case formatına çevirir.',
    category: 'case',
    sampleInput: 'developer_utility_and_conversion_hub',
    transform: (str) => str.replace(/_/g, '-').toLowerCase(),
  },
  {
    slug: 'kebab-case-to-camelcase',
    name: 'kebab-case to camelCase',
    nameTr: 'kebab-case metnini camelCase formatına çevirme',
    description: 'Converts hyphenated kebab-case strings into camelCase JavaScript identifiers.',
    descriptionTr: 'Tire ile ayrılmış kebab-case metinlerini camelCase formatına dönüştürür.',
    category: 'case',
    sampleInput: 'developer-utility-and-conversion-hub',
    transform: (str) =>
      str
        .toLowerCase()
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
  },
  {
    slug: 'pascalcase-to-camelcase',
    name: 'PascalCase to camelCase',
    nameTr: 'PascalCase metnini camelCase formatına çevirme',
    description: 'Converts PascalCase class names to camelCase instance variables.',
    descriptionTr: 'İlk harfi büyük olan PascalCase isimlerini camelCase formatına çevirir.',
    category: 'case',
    sampleInput: 'UserProfileController',
    transform: (str) => str.charAt(0).toLowerCase() + str.slice(1),
  },
  {
    slug: 'camelcase-to-pascalcase',
    name: 'camelCase to PascalCase',
    nameTr: 'camelCase metnini PascalCase formatına çevirme',
    description: 'Converts camelCase identifiers to PascalCase class or component names.',
    descriptionTr: 'camelCase metinlerinin ilk harfini büyüterek PascalCase formatına çevirir.',
    category: 'case',
    sampleInput: 'userProfileController',
    transform: (str) => str.charAt(0).toUpperCase() + str.slice(1),
  },
  {
    slug: 'string-to-slug',
    name: 'String to URL Slug',
    nameTr: 'Metni URL Slug Formatına Çevirme',
    description: 'Converts any text or article title into a clean, SEO-friendly URL slug.',
    descriptionTr: 'Herhangi bir başlığı veya metni Türkçe karakterleri de düzelterek temiz bir URL slug yapısına dönüştürür.',
    category: 'clean',
    sampleInput: 'Next.js 14 Programmatic SEO & Cloudflare Pages Rehberi 2026!',
    transform: (str) => {
      const trMap: Record<string, string> = {
        ç: 'c', Ç: 'c', ğ: 'g', Ğ: 'g', ı: 'i', İ: 'i', ö: 'o', Ö: 'o', ş: 's', Ş: 's', ü: 'u', Ü: 'u',
      };
      return str
        .replace(/[çÇğĞıİöÖşŞüÜ]/g, (m) => trMap[m] || m)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
    },
  },
  {
    slug: 'title-case-converter',
    name: 'Title Case Converter (Capitalize Every Word)',
    nameTr: 'Başlık Düzeni (Her Kelimenin İlk Harfini Büyüt)',
    description: 'Capitalizes the first letter of each word according to headline standards.',
    descriptionTr: 'Metindeki tüm kelimelerin ilk harflerini büyüterek profesyonel başlık formatına dönüştürür.',
    category: 'case',
    sampleInput: 'the ultimate guide to programmatic seo and web performance',
    transform: (str) =>
      str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
  },
  {
    slug: 'uppercase-to-lowercase',
    name: 'UPPERCASE to lowercase',
    nameTr: 'BÜYÜK HARFTEN küçük harfe çevirme',
    description: 'Converts all uppercase capital characters to lowercase letters.',
    descriptionTr: 'Tüm büyük harfleri tek tıklamayla küçük harflere dönüştürür.',
    category: 'case',
    sampleInput: 'THIS IS A SAMPLE UPPERCASE TEXT WITH ALL CAPS LETTERS.',
    transform: (str) => str.toLowerCase(),
  },
  {
    slug: 'lowercase-to-uppercase',
    name: 'lowercase to UPPERCASE',
    nameTr: 'küçük harften BÜYÜK HARFE çevirme',
    description: 'Converts all lowercase letters to uppercase capital characters.',
    descriptionTr: 'Tüm küçük harfleri tek tıklamayla büyük harflere dönüştürür.',
    category: 'case',
    sampleInput: 'this is a sample lowercase text string.',
    transform: (str) => str.toUpperCase(),
  },

  // 2. Cleaners & String Utils
  {
    slug: 'remove-whitespace',
    name: 'Remove Extra Whitespace & Spaces',
    nameTr: 'Gereksiz Boşlukları Temizleme',
    description: 'Removes redundant consecutive spaces, leading, and trailing whitespaces.',
    descriptionTr: 'Metindeki mükerrer boşlukları, satır başı ve sonu boşluklarını temizler.',
    category: 'clean',
    sampleInput: '   This    text     has     too     many    spaces!   ',
    transform: (str) => str.replace(/\s+/g, ' ').trim(),
  },
  {
    slug: 'remove-line-breaks',
    name: 'Remove Line Breaks & Newlines',
    nameTr: 'Satır Başlarını ve Boş Satırları Kaldırma',
    description: 'Merges multi-line text into a single continuous line of text.',
    descriptionTr: 'Çok satırlı metinlerdeki tüm satır başı (newline) karakterlerini kaldırarak tek bir satıra birleştirir.',
    category: 'clean',
    sampleInput: 'Line 1: Introduction\nLine 2: Main Body\n\nLine 3: Conclusion',
    transform: (str) => str.replace(/(\r\n|\n|\r)/gm, ' ').replace(/\s+/g, ' ').trim(),
  },
  {
    slug: 'reverse-string',
    name: 'Reverse Text & String',
    nameTr: 'Metni Tersten Yazdırma (Ters Çevirme)',
    description: 'Reverses the sequence of characters in a string backwards.',
    descriptionTr: 'Girilen metindeki tüm karakterleri baştan sona ters sıraya dizer.',
    category: 'clean',
    sampleInput: 'Hello World from ZeroUpload!',
    transform: (str) => str.split('').reverse().join(''),
  },

  // 3. Binary & Ciphers
  {
    slug: 'text-to-binary',
    name: 'Text to Binary Converter (01001000)',
    nameTr: 'Metni İkili Sayı Sistemine (Binary) Çevirme',
    description: 'Converts ASCII/UTF-8 text characters into 8-bit binary numbers.',
    descriptionTr: 'Metindeki her karakterin ASCII kodunu 8 bitlik ikili (binary) sayı dizisine dönüştürür.',
    category: 'encoding',
    sampleInput: 'ZeroUpload',
    transform: (str) =>
      str
        .split('')
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' '),
  },
  {
    slug: 'binary-to-text',
    name: 'Binary to Text Converter',
    nameTr: 'İkili (Binary) Sayıları Metne Çevirme',
    description: 'Converts 8-bit binary space-separated numbers back into readable text.',
    descriptionTr: '0 ve 1\'lerden oluşan ikili sayıları okunabilir metne dönüştürür.',
    category: 'encoding',
    sampleInput: '01011010 01100101 01110010 01101111',
    transform: (str) =>
      str
        .split(/\s+/)
        .filter((b) => b.length > 0)
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join(''),
  },
  {
    slug: 'rot13-cipher-encoder',
    name: 'ROT13 Cipher Encoder & Decoder',
    nameTr: 'ROT13 Şifreleme ve Çözücü',
    description: 'Rotates each letter by 13 positions in the Latin alphabet.',
    descriptionTr: 'Her harfi alfabede 13 basamak kaydırarak basit şifreleme ve çözümleme yapar.',
    category: 'crypto',
    sampleInput: 'ZeroUpload is fast and private!',
    transform: (str) =>
      str.replace(/[a-zA-Z]/g, (c) => {
        const base = c <= 'Z' ? 65 : 97;
        return String.fromCharCode(((c.charCodeAt(0) - base + 13) % 26) + base);
      }),
  },
];

export function getAllTextTransformations(): TextTransformation[] {
  return TEXT_TRANSFORMATIONS;
}

export function getTextTransformationBySlug(slug: string): TextTransformation | undefined {
  return TEXT_TRANSFORMATIONS.find((t) => t.slug === slug);
}

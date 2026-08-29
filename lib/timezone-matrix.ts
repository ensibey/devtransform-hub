export interface CityInfo {
  slug: string;
  name: string;
  nameTr: string;
  country: string;
  countryTr: string;
  timezone: string;
  utcOffset: number; // Standard UTC offset in hours
}

export const CITIES: CityInfo[] = [
  { slug: 'istanbul', name: 'Istanbul', nameTr: 'İstanbul', country: 'Turkey', countryTr: 'Türkiye', timezone: 'Europe/Istanbul', utcOffset: 3 },
  { slug: 'london', name: 'London', nameTr: 'Londra', country: 'United Kingdom', countryTr: 'Birleşik Krallık', timezone: 'Europe/London', utcOffset: 0 },
  { slug: 'new-york', name: 'New York', nameTr: 'New York', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'America/New_York', utcOffset: -5 },
  { slug: 'tokyo', name: 'Tokyo', nameTr: 'Tokyo', country: 'Japan', countryTr: 'Japonya', timezone: 'Asia/Tokyo', utcOffset: 9 },
  { slug: 'paris', name: 'Paris', nameTr: 'Paris', country: 'France', countryTr: 'Fransa', timezone: 'Europe/Paris', utcOffset: 1 },
  { slug: 'berlin', name: 'Berlin', nameTr: 'Berlin', country: 'Germany', countryTr: 'Almanya', timezone: 'Europe/Berlin', utcOffset: 1 },
  { slug: 'dubai', name: 'Dubai', nameTr: 'Dubai', country: 'United Arab Emirates', countryTr: 'Birleşik Arap Emirlikleri', timezone: 'Asia/Dubai', utcOffset: 4 },
  { slug: 'singapore', name: 'Singapore', nameTr: 'Singapur', country: 'Singapore', countryTr: 'Singapur', timezone: 'Asia/Singapore', utcOffset: 8 },
  { slug: 'sydney', name: 'Sydney', nameTr: 'Sidney', country: 'Australia', countryTr: 'Avustralya', timezone: 'Australia/Sydney', utcOffset: 10 },
  { slug: 'los-angeles', name: 'Los Angeles', nameTr: 'Los Angeles', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'America/Los_Angeles', utcOffset: -8 },
  { slug: 'chicago', name: 'Chicago', nameTr: 'Chicago', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'America/Chicago', utcOffset: -6 },
  { slug: 'toronto', name: 'Toronto', nameTr: 'Toronto', country: 'Canada', countryTr: 'Kanada', timezone: 'America/Toronto', utcOffset: -5 },
  { slug: 'amsterdam', name: 'Amsterdam', nameTr: 'Amsterdam', country: 'Netherlands', countryTr: 'Hollanda', timezone: 'Europe/Amsterdam', utcOffset: 1 },
  { slug: 'rome', name: 'Rome', nameTr: 'Roma', country: 'Italy', countryTr: 'İtalya', timezone: 'Europe/Rome', utcOffset: 1 },
  { slug: 'madrid', name: 'Madrid', nameTr: 'Madrid', country: 'Spain', countryTr: 'İspanya', timezone: 'Europe/Madrid', utcOffset: 1 },
  { slug: 'frankfurt', name: 'Frankfurt', nameTr: 'Frankfurt', country: 'Germany', countryTr: 'Almanya', timezone: 'Europe/Berlin', utcOffset: 1 },
  { slug: 'zurich', name: 'Zurich', nameTr: 'Zürih', country: 'Switzerland', countryTr: 'İsviçre', timezone: 'Europe/Zurich', utcOffset: 1 },
  { slug: 'moscow', name: 'Moscow', nameTr: 'Moskova', country: 'Russia', countryTr: 'Rusya', timezone: 'Europe/Moscow', utcOffset: 3 },
  { slug: 'seoul', name: 'Seoul', nameTr: 'Seul', country: 'South Korea', countryTr: 'Güney Kore', timezone: 'Asia/Seoul', utcOffset: 9 },
  { slug: 'hong-kong', name: 'Hong Kong', nameTr: 'Hong Kong', country: 'Hong Kong', countryTr: 'Hong Kong', timezone: 'Asia/Hong_Kong', utcOffset: 8 },
  { slug: 'shanghai', name: 'Shanghai', nameTr: 'Şanghay', country: 'China', countryTr: 'Çin', timezone: 'Asia/Shanghai', utcOffset: 8 },
  { slug: 'bangkok', name: 'Bangkok', nameTr: 'Bangkok', country: 'Thailand', countryTr: 'Tayland', timezone: 'Asia/Bangkok', utcOffset: 7 },
  { slug: 'mumbai', name: 'Mumbai', nameTr: 'Mumbai', country: 'India', countryTr: 'Hindistan', timezone: 'Asia/Kolkata', utcOffset: 5.5 },
  { slug: 'delhi', name: 'Delhi', nameTr: 'Delhi', country: 'India', countryTr: 'Hindistan', timezone: 'Asia/Kolkata', utcOffset: 5.5 },
  { slug: 'riyadh', name: 'Riyadh', nameTr: 'Riyad', country: 'Saudi Arabia', countryTr: 'Suudi Arabistan', timezone: 'Asia/Riyadh', utcOffset: 3 },
  { slug: 'doha', name: 'Doha', nameTr: 'Doha', country: 'Qatar', countryTr: 'Katar', timezone: 'Asia/Qatar', utcOffset: 3 },
  { slug: 'cairo', name: 'Cairo', nameTr: 'Kahire', country: 'Egypt', countryTr: 'Mısır', timezone: 'Africa/Cairo', utcOffset: 2 },
  { slug: 'johannesburg', name: 'Johannesburg', nameTr: 'Johannesburg', country: 'South Africa', countryTr: 'Güney Afrika', timezone: 'Africa/Johannesburg', utcOffset: 2 },
  { slug: 'sao-paulo', name: 'Sao Paulo', nameTr: 'Sao Paulo', country: 'Brazil', countryTr: 'Brezilya', timezone: 'America/Sao_Paulo', utcOffset: -3 },
  { slug: 'buenos-aires', name: 'Buenos Aires', nameTr: 'Buenos Aires', country: 'Argentina', countryTr: 'Arjantin', timezone: 'America/Argentina/Buenos_Aires', utcOffset: -3 },
  { slug: 'mexico-city', name: 'Mexico City', nameTr: 'Mexico City', country: 'Mexico', countryTr: 'Meksika', timezone: 'America/Mexico_City', utcOffset: -6 },
  { slug: 'vancouver', name: 'Vancouver', nameTr: 'Vancouver', country: 'Canada', countryTr: 'Kanada', timezone: 'America/Vancouver', utcOffset: -8 },
  { slug: 'san-francisco', name: 'San Francisco', nameTr: 'San Francisco', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'America/Los_Angeles', utcOffset: -8 },
  { slug: 'miami', name: 'Miami', nameTr: 'Miami', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'America/New_York', utcOffset: -5 },
  { slug: 'houston', name: 'Houston', nameTr: 'Houston', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'America/Chicago', utcOffset: -6 },
  { slug: 'boston', name: 'Boston', nameTr: 'Boston', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'America/New_York', utcOffset: -5 },
  { slug: 'seattle', name: 'Seattle', nameTr: 'Seattle', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'America/Los_Angeles', utcOffset: -8 },
  { slug: 'dublin', name: 'Dublin', nameTr: 'Dublin', country: 'Ireland', countryTr: 'İrlanda', timezone: 'Europe/Dublin', utcOffset: 0 },
  { slug: 'stockholm', name: 'Stockholm', nameTr: 'Stockholm', country: 'Sweden', countryTr: 'İsveç', timezone: 'Europe/Stockholm', utcOffset: 1 },
  { slug: 'oslo', name: 'Oslo', nameTr: 'Oslo', country: 'Norway', countryTr: 'Norveç', timezone: 'Europe/Oslo', utcOffset: 1 },
  { slug: 'copenhagen', name: 'Copenhagen', nameTr: 'Kopenhag', country: 'Denmark', countryTr: 'Danimarka', timezone: 'Europe/Copenhagen', utcOffset: 1 },
  { slug: 'vienna', name: 'Vienna', nameTr: 'Viyana', country: 'Austria', countryTr: 'Avusturya', timezone: 'Europe/Vienna', utcOffset: 1 },
  { slug: 'brussels', name: 'Brussels', nameTr: 'Brüksel', country: 'Belgium', countryTr: 'Belçika', timezone: 'Europe/Brussels', utcOffset: 1 },
  { slug: 'athens', name: 'Athens', nameTr: 'Atina', country: 'Greece', countryTr: 'Yunanistan', timezone: 'Europe/Athens', utcOffset: 2 },
  { slug: 'ankara', name: 'Ankara', nameTr: 'Ankara', country: 'Turkey', countryTr: 'Türkiye', timezone: 'Europe/Istanbul', utcOffset: 3 },
  { slug: 'izmir', name: 'Izmir', nameTr: 'İzmir', country: 'Turkey', countryTr: 'Türkiye', timezone: 'Europe/Istanbul', utcOffset: 3 },
  { slug: 'melbourne', name: 'Melbourne', nameTr: 'Melbourne', country: 'Australia', countryTr: 'Avustralya', timezone: 'Australia/Melbourne', utcOffset: 10 },
  { slug: 'auckland', name: 'Auckland', nameTr: 'Auckland', country: 'New Zealand', countryTr: 'Yeni Zelanda', timezone: 'Pacific/Auckland', utcOffset: 12 },
  { slug: 'honolulu', name: 'Honolulu', nameTr: 'Honolulu', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', timezone: 'Pacific/Honolulu', utcOffset: -10 },
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur', nameTr: 'Kuala Lumpur', country: 'Malaysia', countryTr: 'Malezya', timezone: 'Asia/Kuala_Lumpur', utcOffset: 8 },
];

export interface TimezonePair {
  slug: string;
  from: CityInfo;
  to: CityInfo;
  hourDifference: number;
}

export function getAllTimezonePairs(): TimezonePair[] {
  const pairs: TimezonePair[] = [];

  for (let i = 0; i < CITIES.length; i++) {
    for (let j = 0; j < CITIES.length; j++) {
      if (i !== j) {
        const from = CITIES[i];
        const to = CITIES[j];
        const hourDifference = to.utcOffset - from.utcOffset;
        pairs.push({
          slug: `${from.slug}-to-${to.slug}`,
          from,
          to,
          hourDifference,
        });
      }
    }
  }

  return pairs;
}

export function getTimezonePair(slug: string): TimezonePair | null {
  const parts = slug.split('-to-');
  if (parts.length !== 2) return null;

  const from = CITIES.find((c) => c.slug === parts[0]);
  const to = CITIES.find((c) => c.slug === parts[1]);

  if (!from || !to) return null;

  return {
    slug,
    from,
    to,
    hourDifference: to.utcOffset - from.utcOffset,
  };
}

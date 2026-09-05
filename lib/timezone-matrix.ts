export interface CityInfo {
  slug: string;
  name: string;
  nameTr: string;
  country: string;
  countryTr: string;
  countryCode: string;
  timezone: string;
  utcOffset: number; // Standard UTC offset in hours
  lat: number;
  lng: number;
  iata: string; // IATA Airport code e.g. 'JFK', 'LHR', 'BKK', 'SIN'
  tzAbbr: string; // Timezone abbreviation e.g. 'EST/EDT', 'GMT/BST', 'ICT'
  hasDst: boolean; // Whether city observes Daylight Saving Time
  isMiddleEastWorkweek?: boolean; // Sunday to Thursday workweek
}

export const CITIES: CityInfo[] = [
  { slug: 'istanbul', name: 'Istanbul', nameTr: 'İstanbul', country: 'Turkey', countryTr: 'Türkiye', countryCode: 'TR', timezone: 'Europe/Istanbul', utcOffset: 3, lat: 41.0082, lng: 28.9784, iata: 'IST', tzAbbr: 'TRT', hasDst: false },
  { slug: 'london', name: 'London', nameTr: 'Londra', country: 'United Kingdom', countryTr: 'Birleşik Krallık', countryCode: 'GB', timezone: 'Europe/London', utcOffset: 0, lat: 51.5074, lng: -0.1278, iata: 'LHR', tzAbbr: 'GMT/BST', hasDst: true },
  { slug: 'new-york', name: 'New York', nameTr: 'New York', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/New_York', utcOffset: -5, lat: 40.7128, lng: -74.0060, iata: 'JFK', tzAbbr: 'EST/EDT', hasDst: true },
  { slug: 'tokyo', name: 'Tokyo', nameTr: 'Tokyo', country: 'Japan', countryTr: 'Japonya', countryCode: 'JP', timezone: 'Asia/Tokyo', utcOffset: 9, lat: 35.6762, lng: 139.6503, iata: 'HND', tzAbbr: 'JST', hasDst: false },
  { slug: 'paris', name: 'Paris', nameTr: 'Paris', country: 'France', countryTr: 'Fransa', countryCode: 'FR', timezone: 'Europe/Paris', utcOffset: 1, lat: 48.8566, lng: 2.3522, iata: 'CDG', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'berlin', name: 'Berlin', nameTr: 'Berlin', country: 'Germany', countryTr: 'Almanya', countryCode: 'DE', timezone: 'Europe/Berlin', utcOffset: 1, lat: 52.5200, lng: 13.4050, iata: 'BER', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'dubai', name: 'Dubai', nameTr: 'Dubai', country: 'United Arab Emirates', countryTr: 'Birleşik Arap Emirlikleri', countryCode: 'AE', timezone: 'Asia/Dubai', utcOffset: 4, lat: 25.2048, lng: 55.2708, isMiddleEastWorkweek: true, iata: 'DXB', tzAbbr: 'GST', hasDst: false },
  { slug: 'singapore', name: 'Singapore', nameTr: 'Singapur', country: 'Singapore', countryTr: 'Singapur', countryCode: 'SG', timezone: 'Asia/Singapore', utcOffset: 8, lat: 1.3521, lng: 103.8198, iata: 'SIN', tzAbbr: 'SGT', hasDst: false },
  { slug: 'sydney', name: 'Sydney', nameTr: 'Sidney', country: 'Australia', countryTr: 'Avustralya', countryCode: 'AU', timezone: 'Australia/Sydney', utcOffset: 10, lat: -33.8688, lng: 151.2093, iata: 'SYD', tzAbbr: 'AEST/AEDT', hasDst: true },
  { slug: 'los-angeles', name: 'Los Angeles', nameTr: 'Los Angeles', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Los_Angeles', utcOffset: -8, lat: 34.0522, lng: -118.2437, iata: 'LAX', tzAbbr: 'PST/PDT', hasDst: true },
  { slug: 'chicago', name: 'Chicago', nameTr: 'Chicago', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Chicago', utcOffset: -6, lat: 41.8781, lng: -87.6298, iata: 'ORD', tzAbbr: 'CST/CDT', hasDst: true },
  { slug: 'toronto', name: 'Toronto', nameTr: 'Toronto', country: 'Canada', countryTr: 'Kanada', countryCode: 'CA', timezone: 'America/Toronto', utcOffset: -5, lat: 43.6532, lng: -79.3832, iata: 'YYZ', tzAbbr: 'EST/EDT', hasDst: true },
  { slug: 'amsterdam', name: 'Amsterdam', nameTr: 'Amsterdam', country: 'Netherlands', countryTr: 'Hollanda', countryCode: 'NL', timezone: 'Europe/Amsterdam', utcOffset: 1, lat: 52.3676, lng: 4.9041, iata: 'AMS', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'rome', name: 'Rome', nameTr: 'Roma', country: 'Italy', countryTr: 'İtalya', countryCode: 'IT', timezone: 'Europe/Rome', utcOffset: 1, lat: 41.9028, lng: 12.4964, iata: 'FCO', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'madrid', name: 'Madrid', nameTr: 'Madrid', country: 'Spain', countryTr: 'İspanya', countryCode: 'ES', timezone: 'Europe/Madrid', utcOffset: 1, lat: 40.4168, lng: -3.7038, iata: 'MAD', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'frankfurt', name: 'Frankfurt', nameTr: 'Frankfurt', country: 'Germany', countryTr: 'Almanya', countryCode: 'DE', timezone: 'Europe/Berlin', utcOffset: 1, lat: 50.1109, lng: 8.6821, iata: 'FRA', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'zurich', name: 'Zurich', nameTr: 'Zürih', country: 'Switzerland', countryTr: 'İsviçre', countryCode: 'CH', timezone: 'Europe/Zurich', utcOffset: 1, lat: 47.3769, lng: 8.5417, iata: 'ZRH', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'moscow', name: 'Moscow', nameTr: 'Moskova', country: 'Russia', countryTr: 'Rusya', countryCode: 'RU', timezone: 'Europe/Moscow', utcOffset: 3, lat: 55.7558, lng: 37.6173, iata: 'SVO', tzAbbr: 'MSK', hasDst: false },
  { slug: 'seoul', name: 'Seoul', nameTr: 'Seul', country: 'South Korea', countryTr: 'Güney Kore', countryCode: 'KR', timezone: 'Asia/Seoul', utcOffset: 9, lat: 37.5665, lng: 126.9780, iata: 'ICN', tzAbbr: 'KST', hasDst: false },
  { slug: 'hong-kong', name: 'Hong Kong', nameTr: 'Hong Kong', country: 'Hong Kong', countryTr: 'Hong Kong', countryCode: 'HK', timezone: 'Asia/Hong_Kong', utcOffset: 8, lat: 22.3193, lng: 114.1694, iata: 'HKG', tzAbbr: 'HKT', hasDst: false },
  { slug: 'shanghai', name: 'Shanghai', nameTr: 'Şanghay', country: 'China', countryTr: 'Çin', countryCode: 'CN', timezone: 'Asia/Shanghai', utcOffset: 8, lat: 31.2304, lng: 121.4737, iata: 'PVG', tzAbbr: 'CST', hasDst: false },
  { slug: 'bangkok', name: 'Bangkok', nameTr: 'Bangkok', country: 'Thailand', countryTr: 'Tayland', countryCode: 'TH', timezone: 'Asia/Bangkok', utcOffset: 7, lat: 13.7563, lng: 100.5018, iata: 'BKK', tzAbbr: 'ICT', hasDst: false },
  { slug: 'mumbai', name: 'Mumbai', nameTr: 'Mumbai', country: 'India', countryTr: 'Hindistan', countryCode: 'IN', timezone: 'Asia/Kolkata', utcOffset: 5.5, lat: 19.0760, lng: 72.8777, iata: 'BOM', tzAbbr: 'IST', hasDst: false },
  { slug: 'delhi', name: 'Delhi', nameTr: 'Delhi', country: 'India', countryTr: 'Hindistan', countryCode: 'IN', timezone: 'Asia/Kolkata', utcOffset: 5.5, lat: 28.7041, lng: 77.1025, iata: 'DEL', tzAbbr: 'IST', hasDst: false },
  { slug: 'riyadh', name: 'Riyadh', nameTr: 'Riyad', country: 'Saudi Arabia', countryTr: 'Suudi Arabistan', countryCode: 'SA', timezone: 'Asia/Riyadh', utcOffset: 3, lat: 24.7136, lng: 46.6753, isMiddleEastWorkweek: true, iata: 'RUH', tzAbbr: 'AST', hasDst: false },
  { slug: 'doha', name: 'Doha', nameTr: 'Doha', country: 'Qatar', countryTr: 'Katar', countryCode: 'QA', timezone: 'Asia/Qatar', utcOffset: 3, lat: 25.2854, lng: 51.5310, isMiddleEastWorkweek: true, iata: 'DOH', tzAbbr: 'AST', hasDst: false },
  { slug: 'cairo', name: 'Cairo', nameTr: 'Kahire', country: 'Egypt', countryTr: 'Mısır', countryCode: 'EG', timezone: 'Africa/Cairo', utcOffset: 2, lat: 30.0444, lng: 31.2357, isMiddleEastWorkweek: true, iata: 'CAI', tzAbbr: 'EET/EEST', hasDst: true },
  { slug: 'johannesburg', name: 'Johannesburg', nameTr: 'Johannesburg', country: 'South Africa', countryTr: 'Güney Afrika', countryCode: 'ZA', timezone: 'Africa/Johannesburg', utcOffset: 2, lat: -26.2041, lng: 28.0473, iata: 'JNB', tzAbbr: 'SAST', hasDst: false },
  { slug: 'sao-paulo', name: 'Sao Paulo', nameTr: 'Sao Paulo', country: 'Brazil', countryTr: 'Brezilya', countryCode: 'BR', timezone: 'America/Sao_Paulo', utcOffset: -3, lat: -23.5505, lng: -46.6333, iata: 'GRU', tzAbbr: 'BRT', hasDst: false },
  { slug: 'buenos-aires', name: 'Buenos Aires', nameTr: 'Buenos Aires', country: 'Argentina', countryTr: 'Arjantin', countryCode: 'AR', timezone: 'America/Argentina/Buenos_Aires', utcOffset: -3, lat: -34.6037, lng: -58.3816, iata: 'EZE', tzAbbr: 'ART', hasDst: false },
  { slug: 'mexico-city', name: 'Mexico City', nameTr: 'Mexico City', country: 'Mexico', countryTr: 'Meksika', countryCode: 'MX', timezone: 'America/Mexico_City', utcOffset: -6, lat: 19.4326, lng: -99.1332, iata: 'MEX', tzAbbr: 'CST', hasDst: false },
  { slug: 'vancouver', name: 'Vancouver', nameTr: 'Vancouver', country: 'Canada', countryTr: 'Kanada', countryCode: 'CA', timezone: 'America/Vancouver', utcOffset: -8, lat: 49.2827, lng: -123.1207, iata: 'YVR', tzAbbr: 'PST/PDT', hasDst: true },
  { slug: 'san-francisco', name: 'San Francisco', nameTr: 'San Francisco', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Los_Angeles', utcOffset: -8, lat: 37.7749, lng: -122.4194, iata: 'SFO', tzAbbr: 'PST/PDT', hasDst: true },
  { slug: 'miami', name: 'Miami', nameTr: 'Miami', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/New_York', utcOffset: -5, lat: 25.7617, lng: -80.1918, iata: 'MIA', tzAbbr: 'EST/EDT', hasDst: true },
  { slug: 'houston', name: 'Houston', nameTr: 'Houston', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Chicago', utcOffset: -6, lat: 29.7604, lng: -95.3698, iata: 'IAH', tzAbbr: 'CST/CDT', hasDst: true },
  { slug: 'boston', name: 'Boston', nameTr: 'Boston', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/New_York', utcOffset: -5, lat: 42.3601, lng: -71.0589, iata: 'BOS', tzAbbr: 'EST/EDT', hasDst: true },
  { slug: 'seattle', name: 'Seattle', nameTr: 'Seattle', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Los_Angeles', utcOffset: -8, lat: 47.6062, lng: -122.3321, iata: 'SEA', tzAbbr: 'PST/PDT', hasDst: true },
  { slug: 'dublin', name: 'Dublin', nameTr: 'Dublin', country: 'Ireland', countryTr: 'İrlanda', countryCode: 'IE', timezone: 'Europe/Dublin', utcOffset: 0, lat: 53.3498, lng: -6.2603, iata: 'DUB', tzAbbr: 'IST/GMT', hasDst: true },
  { slug: 'stockholm', name: 'Stockholm', nameTr: 'Stockholm', country: 'Sweden', countryTr: 'İsveç', countryCode: 'SE', timezone: 'Europe/Stockholm', utcOffset: 1, lat: 59.3293, lng: 18.0686, iata: 'ARN', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'oslo', name: 'Oslo', nameTr: 'Oslo', country: 'Norway', countryTr: 'Norveç', countryCode: 'NO', timezone: 'Europe/Oslo', utcOffset: 1, lat: 59.9139, lng: 10.7522, iata: 'OSL', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'copenhagen', name: 'Copenhagen', nameTr: 'Kopenhag', country: 'Denmark', countryTr: 'Danimarka', countryCode: 'DK', timezone: 'Europe/Copenhagen', utcOffset: 1, lat: 55.6761, lng: 12.5683, iata: 'COP', tzAbbr: 'UTC', hasDst: false },
  { slug: 'vienna', name: 'Vienna', nameTr: 'Viyana', country: 'Austria', countryTr: 'Avusturya', countryCode: 'AT', timezone: 'Europe/Vienna', utcOffset: 1, lat: 48.2082, lng: 16.3738, iata: 'VIE', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'brussels', name: 'Brussels', nameTr: 'Brüksel', country: 'Belgium', countryTr: 'Belçika', countryCode: 'BE', timezone: 'Europe/Brussels', utcOffset: 1, lat: 50.8503, lng: 4.3517, iata: 'BRU', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'athens', name: 'Athens', nameTr: 'Atina', country: 'Greece', countryTr: 'Yunanistan', countryCode: 'GR', timezone: 'Europe/Athens', utcOffset: 2, lat: 37.9838, lng: 23.7275, iata: 'ATH', tzAbbr: 'EET/EEST', hasDst: true },
  { slug: 'ankara', name: 'Ankara', nameTr: 'Ankara', country: 'Turkey', countryTr: 'Türkiye', countryCode: 'TR', timezone: 'Europe/Istanbul', utcOffset: 3, lat: 39.9334, lng: 32.8597, iata: 'ESB', tzAbbr: 'TRT', hasDst: false },
  { slug: 'izmir', name: 'Izmir', nameTr: 'İzmir', country: 'Turkey', countryTr: 'Türkiye', countryCode: 'TR', timezone: 'Europe/Istanbul', utcOffset: 3, lat: 38.4237, lng: 27.1428, iata: 'ADB', tzAbbr: 'TRT', hasDst: false },
  { slug: 'melbourne', name: 'Melbourne', nameTr: 'Melbourne', country: 'Australia', countryTr: 'Avustralya', countryCode: 'AU', timezone: 'Australia/Melbourne', utcOffset: 10, lat: -37.8136, lng: 144.9631, iata: 'MEL', tzAbbr: 'UTC', hasDst: false },
  { slug: 'auckland', name: 'Auckland', nameTr: 'Auckland', country: 'New Zealand', countryTr: 'Yeni Zelanda', countryCode: 'NZ', timezone: 'Pacific/Auckland', utcOffset: 12, lat: -36.8485, lng: 174.7633, iata: 'AKL', tzAbbr: 'NZST/NZDT', hasDst: true },
  { slug: 'honolulu', name: 'Honolulu', nameTr: 'Honolulu', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'Pacific/Honolulu', utcOffset: -10, lat: 21.3069, lng: -157.8583, iata: 'HNL', tzAbbr: 'HST', hasDst: false },
  { slug: 'kuala-lumpur', name: 'Kuala Lumpur', nameTr: 'Kuala Lumpur', country: 'Malaysia', countryTr: 'Malezya', countryCode: 'MY', timezone: 'Asia/Kuala_Lumpur', utcOffset: 8, lat: 3.1390, lng: 101.6869, iata: 'KUL', tzAbbr: 'MYT', hasDst: false },
  { slug: 'lisbon', name: 'Lisbon', nameTr: 'Lizbon', country: 'Portugal', countryTr: 'Portekiz', countryCode: 'PT', timezone: 'Europe/Lisbon', utcOffset: 0, lat: 38.7223, lng: -9.1393, iata: 'LIS', tzAbbr: 'WET/WEST', hasDst: true },
  { slug: 'warsaw', name: 'Warsaw', nameTr: 'Varşova', country: 'Poland', countryTr: 'Polonya', countryCode: 'PL', timezone: 'Europe/Warsaw', utcOffset: 1, lat: 52.2297, lng: 21.0122, iata: 'WAW', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'prague', name: 'Prague', nameTr: 'Prag', country: 'Czech Republic', countryTr: 'Çek Cumhuriyeti', countryCode: 'CZ', timezone: 'Europe/Prague', utcOffset: 1, lat: 50.0755, lng: 14.4378, iata: 'PRG', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'budapest', name: 'Budapest', nameTr: 'Budapeşte', country: 'Hungary', countryTr: 'Macaristan', countryCode: 'HU', timezone: 'Europe/Budapest', utcOffset: 1, lat: 47.4979, lng: 19.0402, iata: 'BUD', tzAbbr: 'CET/CEST', hasDst: true },
  { slug: 'helsinki', name: 'Helsinki', nameTr: 'Helsinki', country: 'Finland', countryTr: 'Finlandiya', countryCode: 'FI', timezone: 'Europe/Helsinki', utcOffset: 2, lat: 60.1699, lng: 24.9384, iata: 'HEL', tzAbbr: 'EET/EEST', hasDst: true },
  { slug: 'austin', name: 'Austin', nameTr: 'Austin', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Chicago', utcOffset: -6, lat: 30.2672, lng: -97.7431, iata: 'AUS', tzAbbr: 'CST/CDT', hasDst: true },
  { slug: 'dallas', name: 'Dallas', nameTr: 'Dallas', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Chicago', utcOffset: -6, lat: 32.7767, lng: -96.7970, iata: 'DFW', tzAbbr: 'CST/CDT', hasDst: true },
  { slug: 'atlanta', name: 'Atlanta', nameTr: 'Atlanta', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/New_York', utcOffset: -5, lat: 33.7490, lng: -84.3880, iata: 'ATL', tzAbbr: 'EST/EDT', hasDst: true },
  { slug: 'denver', name: 'Denver', nameTr: 'Denver', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Denver', utcOffset: -7, lat: 39.7392, lng: -104.9903, iata: 'DEN', tzAbbr: 'MST/MDT', hasDst: true },
  { slug: 'phoenix', name: 'Phoenix', nameTr: 'Phoenix', country: 'United States', countryTr: 'Amerika Birleşik Devletleri', countryCode: 'US', timezone: 'America/Phoenix', utcOffset: -7, lat: 33.4484, lng: -112.0740, iata: 'PHX', tzAbbr: 'MST', hasDst: false },
  { slug: 'montreal', name: 'Montreal', nameTr: 'Montreal', country: 'Canada', countryTr: 'Kanada', countryCode: 'CA', timezone: 'America/Toronto', utcOffset: -5, lat: 45.5017, lng: -73.5673, iata: 'YUL', tzAbbr: 'EST/EDT', hasDst: true },
  { slug: 'calgary', name: 'Calgary', nameTr: 'Calgary', country: 'Canada', countryTr: 'Kanada', countryCode: 'CA', timezone: 'America/Edmonton', utcOffset: -7, lat: 51.0447, lng: -114.0719, iata: 'CAL', tzAbbr: 'UTC', hasDst: false },
  { slug: 'bangalore', name: 'Bangalore', nameTr: 'Bangalore', country: 'India', countryTr: 'Hindistan', countryCode: 'IN', timezone: 'Asia/Kolkata', utcOffset: 5.5, lat: 12.9716, lng: 77.5946, iata: 'BAN', tzAbbr: 'UTC', hasDst: false },
  { slug: 'hyderabad', name: 'Hyderabad', nameTr: 'Haydarabad', country: 'India', countryTr: 'Hindistan', countryCode: 'IN', timezone: 'Asia/Kolkata', utcOffset: 5.5, lat: 17.3850, lng: 78.4867, iata: 'HYD', tzAbbr: 'UTC', hasDst: false },
  { slug: 'taipei', name: 'Taipei', nameTr: 'Taipei', country: 'Taiwan', countryTr: 'Tayvan', countryCode: 'TW', timezone: 'Asia/Taipei', utcOffset: 8, lat: 25.0330, lng: 121.5654, iata: 'TPE', tzAbbr: 'CST', hasDst: false },
  { slug: 'jakarta', name: 'Jakarta', nameTr: 'Cakarta', country: 'Indonesia', countryTr: 'Endonezya', countryCode: 'ID', timezone: 'Asia/Jakarta', utcOffset: 7, lat: -6.2088, lng: 106.8456, iata: 'CGK', tzAbbr: 'WIB', hasDst: false },
  { slug: 'manila', name: 'Manila', nameTr: 'Manila', country: 'Philippines', countryTr: 'Filipinler', countryCode: 'PH', timezone: 'Asia/Manila', utcOffset: 8, lat: 14.5995, lng: 120.9842, iata: 'MNL', tzAbbr: 'PHT', hasDst: false },
  { slug: 'tel-aviv', name: 'Tel Aviv', nameTr: 'Tel Aviv', country: 'Israel', countryTr: 'İsrail', countryCode: 'IL', timezone: 'Asia/Jerusalem', utcOffset: 2, lat: 32.0853, lng: 34.7818, isMiddleEastWorkweek: true, iata: 'TLV', tzAbbr: 'IST/IDT', hasDst: true },
  { slug: 'nairobi', name: 'Nairobi', nameTr: 'Nairobi', country: 'Kenya', countryTr: 'Kenya', countryCode: 'KE', timezone: 'Africa/Nairobi', utcOffset: 3, lat: -1.2921, lng: 36.8219, iata: 'NAI', tzAbbr: 'UTC', hasDst: false },
  { slug: 'santiago', name: 'Santiago', nameTr: 'Santiago', country: 'Chile', countryTr: 'Şili', countryCode: 'CL', timezone: 'America/Santiago', utcOffset: -4, lat: -33.4489, lng: -70.6693, iata: 'SCL', tzAbbr: 'CLT/CLST', hasDst: true },
  { slug: 'bogota', name: 'Bogota', nameTr: 'Bogota', country: 'Colombia', countryTr: 'Kolombiya', countryCode: 'CO', timezone: 'America/Bogota', utcOffset: -5, lat: 4.7110, lng: -74.0721, iata: 'BOG', tzAbbr: 'COT', hasDst: false },
  { slug: 'lima', name: 'Lima', nameTr: 'Lima', country: 'Peru', countryTr: 'Peru', countryCode: 'PE', timezone: 'America/Lima', utcOffset: -5, lat: -12.0464, lng: -77.0428, iata: 'LIM', tzAbbr: 'PET', hasDst: false },
  { slug: 'brisbane', name: 'Brisbane', nameTr: 'Brisbane', country: 'Australia', countryTr: 'Avustralya', countryCode: 'AU', timezone: 'Australia/Brisbane', utcOffset: 10, lat: -27.4698, lng: 153.0251, iata: 'BRI', tzAbbr: 'UTC', hasDst: false },
  { slug: 'perth', name: 'Perth', nameTr: 'Perth', country: 'Australia', countryTr: 'Avustralya', countryCode: 'AU', timezone: 'Australia/Perth', utcOffset: 8, lat: -31.9505, lng: 115.8605, iata: 'PER', tzAbbr: 'UTC', hasDst: false },
  { slug: 'osaka', name: 'Osaka', nameTr: 'Osaka', country: 'Japan', countryTr: 'Japonya', countryCode: 'JP', timezone: 'Asia/Tokyo', utcOffset: 9, lat: 34.6937, lng: 135.5023, iata: 'OSA', tzAbbr: 'UTC', hasDst: false },
];

export interface TimezonePair {
  slug: string;
  from: CityInfo;
  to: CityInfo;
  hourDifference: number;
  distanceKm: number;
  distanceMiles: number;
  flightTime: string;
  overlapHoursCount: number;
  overlapWindowFrom: string;
  overlapWindowTo: string;
  instantAnswer: string;
  workweekAlignment: string;
}

// Great Circle / Haversine formula
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function calculateFlightTimeFormatted(km: number): string {
  // Commercial cruising speed ~820 km/h + 30 min takeoff/approach buffer
  const totalMinutes = Math.round((km / 820) * 60) + 30;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `~${hours}h ${minutes}m` : `~${minutes}m`;
}

export function calculateOverlapHours(hourDiff: number): {
  overlapCount: number;
  fromWindow: string;
  toWindow: string;
} {
  const overlappingHours: number[] = [];
  for (let h = 0; h < 24; h++) {
    const target = (h + hourDiff + 24) % 24;
    // Business hours 9am to 5pm (09:00 to 17:00)
    if (h >= 9 && h <= 17 && target >= 9 && target <= 17) {
      overlappingHours.push(h);
    }
  }

  if (overlappingHours.length === 0) {
    return {
      overlapCount: 0,
      fromWindow: 'No direct 9-5 overlap',
      toWindow: 'Flex morning / evening required',
    };
  }

  const startH = overlappingHours[0];
  const endH = overlappingHours[overlappingHours.length - 1] + 1;
  const targetStart = (startH + hourDiff + 24) % 24;
  const targetEnd = (endH + hourDiff + 24) % 24;

  const formatH = (val: number) => {
    const hour12 = val % 12 || 12;
    const ampm = val >= 12 && val < 24 ? 'PM' : 'AM';
    return `${hour12}:00 ${ampm}`;
  };

  return {
    overlapCount: overlappingHours.length,
    fromWindow: `${formatH(startH)} - ${formatH(endH)}`,
    toWindow: `${formatH(targetStart)} - ${formatH(targetEnd)}`,
  };
}

export function calculateInstantAnswer(from: CityInfo, to: CityInfo, diff: number): string {
  if (diff > 0) {
    const targetHour = (12 + diff) % 24;
    const target12 = targetHour % 12 || 12;
    const ampm = targetHour >= 12 ? 'PM' : 'AM';
    return `${to.name} is ${diff} hour${diff === 1 ? '' : 's'} ahead of ${from.name}. When it is 12:00 PM in ${from.name}, it is ${target12}:00 ${ampm} in ${to.name}.`;
  } else if (diff < 0) {
    const absDiff = Math.abs(diff);
    const targetHour = (12 + diff + 24) % 24;
    const target12 = targetHour % 12 || 12;
    const ampm = targetHour >= 12 ? 'PM' : 'AM';
    return `${to.name} is ${absDiff} hour${absDiff === 1 ? '' : 's'} behind ${from.name}. When it is 12:00 PM in ${from.name}, it is ${target12}:00 ${ampm} in ${to.name}.`;
  }
  return `${from.name} and ${to.name} share the exact same local time. When it is 12:00 PM in ${from.name}, it is also 12:00 PM in ${to.name}.`;
}

export function calculateWorkweekAlignment(from: CityInfo, to: CityInfo): string {
  const fromIsME = !!from.isMiddleEastWorkweek;
  const toIsME = !!to.isMiddleEastWorkweek;

  if (fromIsME && toIsME) {
    return 'Sunday – Thursday workweek alignment (Friday/Saturday weekend).';
  }
  if (!fromIsME && !toIsME) {
    return 'Standard Monday – Friday business week alignment.';
  }
  return 'Cross-calendar notice: One location observes Sunday – Thursday, while the other observes Monday – Friday (Shared working days: Monday – Thursday).';
}

export function getAllTimezonePairs(): TimezonePair[] {
  const pairs: TimezonePair[] = [];

  for (let i = 0; i < CITIES.length; i++) {
    for (let j = 0; j < CITIES.length; j++) {
      if (i !== j) {
        const from = CITIES[i];
        const to = CITIES[j];
        const hourDifference = to.utcOffset - from.utcOffset;
        const distanceKm = calculateDistanceKm(from.lat, from.lng, to.lat, to.lng);
        const distanceMiles = Math.round(distanceKm * 0.621371);
        const flightTime = calculateFlightTimeFormatted(distanceKm);
        const overlap = calculateOverlapHours(hourDifference);
        const instantAnswer = calculateInstantAnswer(from, to, hourDifference);
        const workweekAlignment = calculateWorkweekAlignment(from, to);

        pairs.push({
          slug: `${from.slug}-to-${to.slug}`,
          from,
          to,
          hourDifference,
          distanceKm,
          distanceMiles,
          flightTime,
          overlapHoursCount: overlap.overlapCount,
          overlapWindowFrom: overlap.fromWindow,
          overlapWindowTo: overlap.toWindow,
          instantAnswer,
          workweekAlignment,
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

  const hourDifference = to.utcOffset - from.utcOffset;
  const distanceKm = calculateDistanceKm(from.lat, from.lng, to.lat, to.lng);
  const distanceMiles = Math.round(distanceKm * 0.621371);
  const flightTime = calculateFlightTimeFormatted(distanceKm);
  const overlap = calculateOverlapHours(hourDifference);
  const instantAnswer = calculateInstantAnswer(from, to, hourDifference);
  const workweekAlignment = calculateWorkweekAlignment(from, to);

  return {
    slug,
    from,
    to,
    hourDifference,
    distanceKm,
    distanceMiles,
    flightTime,
    overlapHoursCount: overlap.overlapCount,
    overlapWindowFrom: overlap.fromWindow,
    overlapWindowTo: overlap.toWindow,
    instantAnswer,
    workweekAlignment,
  };
}

// Top metropolis pairs for crawl prioritization and internal linking
export const POPULAR_TIMEZONE_SLUGS: string[] = [
  'doha-to-sydney',
  'sydney-to-doha',
  'frankfurt-to-istanbul',
  'istanbul-to-frankfurt',
  'paris-to-ankara',
  'ankara-to-paris',
  'oslo-to-istanbul',
  'istanbul-to-oslo',
  'london-to-new-york',
  'new-york-to-london',
  'tokyo-to-london',
  'london-to-tokyo',
  'los-angeles-to-london',
  'london-to-los-angeles',
  'dubai-to-london',
  'london-to-dubai',
  'singapore-to-sydney',
  'sydney-to-singapore',
  'paris-to-tokyo',
  'tokyo-to-paris',
  'new-york-to-tokyo',
  'tokyo-to-new-york',
  'chicago-to-london',
  'london-to-chicago',
  'san-francisco-to-new-york',
  'new-york-to-san-francisco',
  'toronto-to-vancouver',
  'vancouver-to-toronto',
  'berlin-to-istanbul',
  'istanbul-to-berlin',
  'amsterdam-to-new-york',
  'new-york-to-amsterdam',
  'dubai-to-new-york',
  'new-york-to-dubai',
  'mumbai-to-london',
  'london-to-mumbai',
  'sydney-to-auckland',
  'auckland-to-sydney',
  'zurich-to-singapore',
  'singapore-to-zurich',
];


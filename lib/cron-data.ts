export interface CronScheduleInfo {
  slug: string;
  expression: string;
  title: string;
  titleTr: string;
  description: string;
  descriptionTr: string;
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
  category: 'frequent' | 'hourly' | 'daily' | 'weekly' | 'monthly';
}

export const CRON_SCHEDULES: CronScheduleInfo[] = [
  // Frequent
  {
    slug: 'every-minute',
    expression: '* * * * *',
    title: 'Every Minute (* * * * *)',
    titleTr: 'Her Dakika Başı',
    description: 'Runs every single minute of every hour, every day.',
    descriptionTr: 'Günün her saatinde, her dakika başı sürekli olarak çalışır.',
    minute: 'Every minute (*)',
    hour: 'Every hour (*)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'frequent',
  },
  {
    slug: 'every-5-minutes',
    expression: '*/5 * * * *',
    title: 'Every 5 Minutes (*/5 * * * *)',
    titleTr: 'Her 5 Dakikada Bir',
    description: 'Runs every 5th minute (0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55).',
    descriptionTr: 'Her 5 dakikada bir düzenli aralıklarla çalışır.',
    minute: 'Every 5th minute (*/5)',
    hour: 'Every hour (*)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'frequent',
  },
  {
    slug: 'every-10-minutes',
    expression: '*/10 * * * *',
    title: 'Every 10 Minutes (*/10 * * * *)',
    titleTr: 'Her 10 Dakikada Bir',
    description: 'Runs every 10 minutes at the top of the 10-minute mark.',
    descriptionTr: 'Her 10 dakikada bir otomatik olarak tetiklenir.',
    minute: 'Every 10th minute (*/10)',
    hour: 'Every hour (*)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'frequent',
  },
  {
    slug: 'every-15-minutes',
    expression: '*/15 * * * *',
    title: 'Every 15 Minutes (*/15 * * * *)',
    titleTr: 'Her 15 Dakikada Bir (Çeyrek Saatte Bir)',
    description: 'Runs at minute 0, 15, 30, and 45 of every hour.',
    descriptionTr: 'Her saatin 0, 15, 30 ve 45. dakikalarında çeyrek saatte bir çalışır.',
    minute: 'Every 15th minute (*/15)',
    hour: 'Every hour (*)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'frequent',
  },
  {
    slug: 'every-30-minutes',
    expression: '*/30 * * * *',
    title: 'Every 30 Minutes / Half Hour (*/30 * * * *)',
    titleTr: 'Her 30 Dakikada Bir (Yarım Saatte Bir)',
    description: 'Runs twice an hour: at minute 0 and minute 30.',
    descriptionTr: 'Saatte iki kez, 0. ve 30. dakikalarda tetiklenir.',
    minute: 'At minute 0 and 30 (*/30)',
    hour: 'Every hour (*)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'frequent',
  },

  // Hourly
  {
    slug: 'every-hour',
    expression: '0 * * * *',
    title: 'Every Hour at Minute 0 (0 * * * *)',
    titleTr: 'Her Saat Başı',
    description: 'Runs exactly at minute 0 of every hour.',
    descriptionTr: 'Her saatin başında (00. dakikada) çalışır.',
    minute: '0',
    hour: 'Every hour (*)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'hourly',
  },
  {
    slug: 'every-2-hours',
    expression: '0 */2 * * *',
    title: 'Every 2 Hours (0 */2 * * *)',
    titleTr: 'Her 2 Saatte Bir',
    description: 'Runs every even hour at minute 0 (00:00, 02:00, 04:00, etc.).',
    descriptionTr: 'Her iki saatte bir, saat başlarında çalışır.',
    minute: '0',
    hour: 'Every 2nd hour (*/2)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'hourly',
  },
  {
    slug: 'every-6-hours',
    expression: '0 */6 * * *',
    title: 'Every 6 Hours (0 */6 * * *)',
    titleTr: 'Her 6 Saatte Bir (Günde 4 Kez)',
    description: 'Runs at 00:00, 06:00, 12:00, and 18:00 every day.',
    descriptionTr: 'Günde 4 kez: Gece 00:00, Sabah 06:00, Öğle 12:00 ve Akşam 18:00 saatlerinde çalışır.',
    minute: '0',
    hour: 'At 00, 06, 12, 18 (*/6)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'hourly',
  },
  {
    slug: 'every-12-hours',
    expression: '0 */12 * * *',
    title: 'Every 12 Hours (0 */12 * * *)',
    titleTr: 'Her 12 Saatte Bir (Günde 2 Kez)',
    description: 'Runs twice a day: at midnight (00:00) and noon (12:00).',
    descriptionTr: 'Günde 2 kez: Gece yarısı (00:00) ve Öğlen (12:00) çalışır.',
    minute: '0',
    hour: 'At 00:00 and 12:00 (*/12)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'hourly',
  },

  // Daily
  {
    slug: 'every-day-at-midnight',
    expression: '0 0 * * *',
    title: 'Every Day at Midnight (0 0 * * *)',
    titleTr: 'Her Gece Yarısı (00:00)',
    description: 'Runs once per day at 00:00 (12:00 AM).',
    descriptionTr: 'Günde bir kez, her gece tam 00:00 saatinde çalışır (Günlük yedeklemeler ve temizlik için ideal).',
    minute: '0',
    hour: '0 (Midnight)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'daily',
  },
  {
    slug: 'every-day-at-noon',
    expression: '0 12 * * *',
    title: 'Every Day at Noon (0 12 * * *)',
    titleTr: 'Her Gün Öğlen (12:00)',
    description: 'Runs once per day at 12:00 PM (noon).',
    descriptionTr: 'Her gün tam öğlen saat 12:00\'de çalışır.',
    minute: '0',
    hour: '12 (Noon)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'daily',
  },
  {
    slug: 'every-weekday-at-9am',
    expression: '0 9 * * 1-5',
    title: 'Every Weekday at 9:00 AM (0 9 * * 1-5)',
    titleTr: 'Hafta İçi Her Gün Sabah 09:00 (Pazartesi-Cuma)',
    description: 'Runs Monday through Friday at 09:00 AM local time.',
    descriptionTr: 'Pazartesi ile Cuma günleri arasında, sabah mesai başlangıcı olan 09:00\'da çalışır.',
    minute: '0',
    hour: '9 (9:00 AM)',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Monday to Friday (1-5)',
    category: 'daily',
  },

  // Weekly & Monthly
  {
    slug: 'every-sunday-at-midnight',
    expression: '0 0 * * 0',
    title: 'Every Sunday at Midnight (0 0 * * 0)',
    titleTr: 'Her Pazar Gece Yarısı',
    description: 'Runs once a week on Sunday at 00:00.',
    descriptionTr: 'Haftada bir kez, Pazar günleri gece yarısı 00:00 saatinde çalışır.',
    minute: '0',
    hour: '0',
    dayOfMonth: 'Every day (*)',
    month: 'Every month (*)',
    dayOfWeek: 'Sunday (0)',
    category: 'weekly',
  },
  {
    slug: 'every-month-on-the-1st',
    expression: '0 0 1 * *',
    title: 'Every Month on the 1st at Midnight (0 0 1 * *)',
    titleTr: 'Her Ayın 1. Günü Gece Yarısı',
    description: 'Runs on the first day of every month at 00:00.',
    descriptionTr: 'Her ayın ilk gününde (1\'inde) gece 00:00\'da çalışır (Aylık faturalandırma ve raporlama için ideal).',
    minute: '0',
    hour: '0',
    dayOfMonth: '1st of the month (1)',
    month: 'Every month (*)',
    dayOfWeek: 'Every day of week (*)',
    category: 'monthly',
  },
];

export function getAllCronSchedules(): CronScheduleInfo[] {
  return CRON_SCHEDULES;
}

export function getCronScheduleBySlug(slug: string): CronScheduleInfo | undefined {
  return CRON_SCHEDULES.find((s) => s.slug === slug);
}

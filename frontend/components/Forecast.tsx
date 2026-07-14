import { motion } from 'framer-motion';
import type { WeatherData } from '@/backend/services/weatherService';
import { CloudRain } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { WeatherIcon } from './WeatherIcon';

export function Forecast({ days, unit }: { days: WeatherData['forecast']['forecastday']; unit: 'c' | 'f' }) {
  const t = useTranslations('forecast');
  const locale = useLocale();
  const isC = unit === 'c';
  return <section><h2 className="mb-3 text-lg font-semibold">{t('heading')}</h2><div className="flex snap-x gap-3 overflow-x-auto pb-2">{days.map((day, index) => {
    const date = new Date(`${day.date}T12:00:00`); const info = day.day;
    return <motion.article whileHover={{ y: -4 }} key={day.date} className="glass min-w-[142px] snap-start rounded-2xl p-4 sm:min-w-[156px]"><p className="text-sm font-medium">{index === 0 ? t('today') : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)}</p><p className="mt-1 text-xs text-white/60">{new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date)}</p><WeatherIcon code={info.condition.code} className="my-5 h-10 w-10 text-amber-100" /><div className="flex gap-2 text-sm"><span className="font-semibold">{Math.round(isC ? info.maxtemp_c : info.maxtemp_f)}°</span><span className="text-white/55">{Math.round(isC ? info.mintemp_c : info.mintemp_f)}°</span></div><p className="mt-3 flex items-center gap-1 text-xs text-sky-100/85"><CloudRain className="h-3.5 w-3.5" />{t('rainChance', { percent: info.daily_chance_of_rain })}</p></motion.article>;
  })}</div></section>;
}

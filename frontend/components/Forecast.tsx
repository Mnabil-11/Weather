import { AnimatePresence, motion } from 'framer-motion';
import type { WeatherData } from '@/backend/services/weatherService';
import { CloudRain } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { WeatherIcon } from './WeatherIcon';

export function Forecast({ days, unit }: { days: WeatherData['forecast']['forecastday']; unit: 'c' | 'f' }) {
  const t = useTranslations('forecast');
  const locale = useLocale();
  const isC = unit === 'c';
  const [selected, setSelected] = useState<string | null>(null);
  const selectedDay = days.find((day) => day.date === selected);
  return <section>
    <h2 className="mb-3 text-lg font-semibold">{t('heading')}</h2>
    <div className="flex snap-x gap-3 overflow-x-auto pb-2">{days.map((day, index) => {
      const date = new Date(`${day.date}T12:00:00`); const info = day.day; const isSelected = selected === day.date;
      return <motion.article
        role="button"
        tabIndex={0}
        aria-pressed={isSelected}
        onClick={() => setSelected(isSelected ? null : day.date)}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(isSelected ? null : day.date); } }}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.96 }}
        animate={{ scale: isSelected ? 1.02 : 1, borderColor: isSelected ? 'rgba(255,255,255,.55)' : 'rgba(255,255,255,.2)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        key={day.date}
        className={`glass min-w-[142px] cursor-pointer snap-start rounded-2xl p-4 outline-none sm:min-w-[156px] ${isSelected ? 'bg-white/[.18]' : ''}`}
      >
        <p className="text-sm font-medium">{index === 0 ? t('today') : new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date)}</p>
        <p className="mt-1 text-xs text-white/60">{new Intl.DateTimeFormat(locale, { month: 'short', day: 'numeric' }).format(date)}</p>
        <motion.div animate={{ rotate: isSelected ? [0, -8, 8, 0] : 0 }} transition={{ duration: 0.5 }}>
          <WeatherIcon code={info.condition.code} className="my-5 h-10 w-10 text-amber-100" />
        </motion.div>
        <div className="flex gap-2 text-sm"><span className="font-semibold">{Math.round(isC ? info.maxtemp_c : info.maxtemp_f)}°</span><span className="text-white/55">{Math.round(isC ? info.mintemp_c : info.mintemp_f)}°</span></div>
        <p className="mt-3 flex items-center gap-1 text-xs text-sky-100/85"><CloudRain className="h-3.5 w-3.5" />{t('rainChance', { percent: info.daily_chance_of_rain })}</p>
      </motion.article>;
    })}</div>
    <AnimatePresence>
      {selectedDay && <motion.div
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
        exit={{ opacity: 0, height: 0, marginTop: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden"
      >
        <div className="glass flex flex-wrap items-center justify-between gap-4 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <WeatherIcon code={selectedDay.day.condition.code} className="h-10 w-10 shrink-0 text-amber-100" />
            <div>
              <p className="font-medium">{selectedDay.day.condition.text}</p>
              <p className="text-xs text-white/60">{new Intl.DateTimeFormat(locale, { weekday: 'long', month: 'short', day: 'numeric' }).format(new Date(`${selectedDay.date}T12:00:00`))}</p>
            </div>
          </div>
          <div className="flex items-center gap-5 text-sm">
            <span>{t('rainChance', { percent: selectedDay.day.daily_chance_of_rain })}</span>
            <span className="font-semibold">{Math.round(isC ? selectedDay.day.maxtemp_c : selectedDay.day.maxtemp_f)}° / {Math.round(isC ? selectedDay.day.mintemp_c : selectedDay.day.mintemp_f)}°</span>
          </div>
        </div>
      </motion.div>}
    </AnimatePresence>
  </section>;
}

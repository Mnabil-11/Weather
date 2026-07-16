import { AnimatePresence, motion, useMotionValue, useTransform } from 'framer-motion';
import { Droplets, Gauge, Navigation, Wind } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { WeatherData } from '@/backend/services/weatherService';
import { WeatherIcon } from './WeatherIcon';

export function WeatherCard({ data, unit }: { data: WeatherData; unit: 'c' | 'f' }) {
  const t = useTranslations('weather');
  const locale = useLocale();
  const [activeMetric, setActiveMetric] = useState<string | null>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useTransform(rotateY, (v) => v);
  const springY = useTransform(rotateX, (v) => v);
  const handleIconMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 22);
    rotateX.set(((e.clientY - rect.top) / rect.height - 0.5) * -22);
  };
  const resetIcon = () => { rotateX.set(0); rotateY.set(0); };
  const c = data.current; const isC = unit === 'c'; const temp = Math.round(isC ? c.temp_c : c.temp_f); const feels = Math.round(isC ? c.feelslike_c : c.feelslike_f); const wind = Math.round(isC ? c.wind_kph : c.wind_mph);
  const details = [
    { icon: Droplets, label: t('humidity'), value: `${c.humidity}%` },
    { icon: Wind, label: t('wind'), value: `${wind} ${isC ? 'km/h' : 'mph'}` },
    { icon: Navigation, label: t('direction'), value: c.wind_dir },
    { icon: Gauge, label: t('uvIndex'), value: String(c.uv) }
  ];
  return <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass overflow-hidden rounded-3xl p-5 sm:p-7">
    <div className="flex items-start justify-between gap-3"><div><p className="text-lg font-semibold">{data.location.name}</p><p className="mt-0.5 text-sm text-white/65">{data.location.region ? `${data.location.region}, ` : ''}{data.location.country}</p></div><p className="text-sm text-white/65">{new Intl.DateTimeFormat(locale, { weekday: 'long', hour: 'numeric', minute: '2-digit' }).format(new Date(data.location.localtime.replace(' ', 'T')))}</p></div>
    <div className="my-8 flex items-center justify-between">
      <div>
        <p className="text-white/70">{c.condition.text}</p>
        <div className="mt-1 flex items-start text-7xl font-light tracking-tighter sm:text-8xl">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span key={`${unit}-${temp}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>{temp}</motion.span>
          </AnimatePresence>
          <sup className="text-3xl">°{isC ? 'C' : 'F'}</sup>
        </div>
        <p className="mt-2 text-sm text-white/70">{t('feelsLike', { value: feels })}</p>
      </div>
      <motion.div style={{ perspective: 400 }} onMouseMove={handleIconMove} onMouseLeave={resetIcon} className="cursor-default">
        <motion.div style={{ rotateX: springY, rotateY: springX }}>
          <WeatherIcon code={c.condition.code} isDay={Boolean(c.is_day)} className="h-28 w-28 text-amber-100 drop-shadow-[0_8px_25px_rgba(255,255,255,.18)] sm:h-36 sm:w-36" />
        </motion.div>
      </motion.div>
    </div>
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{details.map(({ icon: Icon, label, value }) => <motion.div
      className="metric cursor-default"
      key={label}
      onHoverStart={() => setActiveMetric(label)}
      onHoverEnd={() => setActiveMetric((current) => (current === label ? null : current))}
      whileHover={{ y: -3, scale: 1.03, backgroundColor: 'rgba(255,255,255,.14)' }}
      whileTap={{ scale: 0.97 }}
      animate={{ borderColor: activeMetric === label ? 'rgba(255,255,255,.35)' : 'rgba(255,255,255,.1)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <motion.div animate={{ rotate: activeMetric === label ? -8 : 0, scale: activeMetric === label ? 1.1 : 1 }}><Icon className="mb-3 h-5 w-5 text-white/75" /></motion.div>
      <p className="text-xs text-white/60">{label}</p>
      <p className="mt-1 font-semibold">{value}</p>
    </motion.div>)}</div>
  </motion.section>;
}

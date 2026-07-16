'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Moon, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRef, useState } from 'react';
import { deriveWeatherTheme } from '@/shared/weatherTheme';
import { useWeatherQuery } from '@/frontend/hooks/useWeatherQuery';
import { useGeolocationQuery } from '@/frontend/hooks/useGeolocationQuery';
import { useKeyboardShortcuts } from '@/frontend/hooks/useKeyboardShortcuts';
import { BackgroundImage } from './BackgroundImage';
import { Forecast } from './Forecast';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchBar } from './SearchBar';
import { WeatherCard } from './WeatherCard';

function Skeleton() { return <div className="glass animate-pulse rounded-3xl p-7"><div className="h-5 w-36 rounded bg-white/15" /><div className="my-8 h-28 rounded-2xl bg-white/10" /><div className="grid grid-cols-4 gap-3">{Array.from({ length: 4 }, (_, i) => <div key={i} className="h-24 rounded-2xl bg-white/10" />)}</div></div>; }

export function Dashboard() {
  const t = useTranslations();
  const searchInputRef = useRef<HTMLInputElement>(null);
  useKeyboardShortcuts(searchInputRef);
  const [query, setQuery] = useState('Riyadh'); const [unit, setUnit] = useState<'c' | 'f'>('c'); const [dark, setDark] = useState(false);
  const { data: weather, isLoading, error } = useWeatherQuery(query);
  const { locate, locating, error: geoError } = useGeolocationQuery();
  const errorMessage = geoError || (error instanceof Error ? error.message : '');
  const handleLocate = async () => { const coords = await locate(); if (coords) setQuery(coords); };
  const theme = deriveWeatherTheme(weather);
  return <main className={`relative min-h-screen overflow-hidden ${dark ? 'brightness-[.68]' : ''}`}>
    <BackgroundImage theme={theme} />
    <div className="pointer-events-none absolute -left-20 top-20 h-72 w-72 rounded-full bg-cyan-200/20 blur-3xl" /><div className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-indigo-300/20 blur-3xl" />
    <div className="relative mx-auto max-w-6xl px-4 py-5 sm:px-7 sm:py-8"><header className="mb-9 flex flex-wrap items-center justify-between gap-4"><div><p className="text-xl font-semibold tracking-tight">{t('app.name')}<span className="text-white/55">.</span></p><p className="text-xs text-white/60">{t('app.tagline')}</p></div><div className="flex items-center gap-2"><LanguageSwitcher />
        <div className="glass relative flex rounded-xl p-0.5 text-sm font-medium" role="radiogroup" aria-label={t('header.unitToggle')}>
          {(['c', 'f'] as const).map((option) => <button key={option} role="radio" aria-checked={unit === option} onClick={() => setUnit(option)} className="relative z-10 px-3 py-1.5">
            {unit === option && <motion.span layoutId="unit-pill" className="absolute inset-0 -z-10 rounded-lg bg-white/25" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
            °{option.toUpperCase()}
          </button>)}
        </div>
        <motion.button whileTap={{ scale: 0.9, rotate: 15 }} onClick={() => setDark(!dark)} className="glass grid h-9 w-9 place-items-center rounded-xl hover:bg-white/20" aria-label={t('header.themeToggle')}><AnimatePresence mode="wait" initial={false}><motion.span key={dark ? 'sun' : 'moon'} initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}>{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</motion.span></AnimatePresence></motion.button></div></header>
      <SearchBar ref={searchInputRef} onSearch={setQuery} onLocate={handleLocate} locating={locating} />
      <AnimatePresence>{errorMessage && <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 flex max-w-xl items-center gap-2 rounded-2xl border border-rose-200/30 bg-rose-950/35 px-4 py-3 text-sm text-rose-50"><AlertCircle className="h-5 w-5 shrink-0" />{errorMessage}</motion.div>}</AnimatePresence>
      <div className="mt-7">{isLoading ? <Skeleton /> : weather && <WeatherCard data={weather} unit={unit} />}</div>
      {!isLoading && weather && <div className="mt-7"><Forecast days={weather.forecast.forecastday} unit={unit} /></div>}
    </div>
  </main>;
}

'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed, Search, Star, X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { weatherClient } from '@/frontend/lib/weatherClient';
import { addHistory, getFavorites, getHistory, toggleFavorite } from '@/frontend/lib/favorites';

type Location = { id: number; name: string; region: string; country: string };

export const SearchBar = forwardRef<HTMLInputElement, { onSearch: (city: string) => void; onLocate: () => void | Promise<void>; locating: boolean }>(
  function SearchBar({ onSearch, onLocate, locating }, ref) {
    const t = useTranslations('search');
    const queryClient = useQueryClient();
    const [query, setQuery] = useState(''); const [items, setItems] = useState<Location[]>([]); const [focused, setFocused] = useState(false);
    const [favorites, setFavorites] = useState<string[]>([]); const [history, setHistory] = useState<string[]>([]);
    const timer = useRef<ReturnType<typeof setTimeout>>(); const latestQuery = useRef('');

    useEffect(() => { setFavorites(getFavorites()); setHistory(getHistory()); }, []);

    useEffect(() => {
      latestQuery.current = query; clearTimeout(timer.current);
      if (query.trim().length < 2) return setItems([]);
      timer.current = setTimeout(() => {
        const requested = query;
        weatherClient.search(query)
          .then((results) => { if (latestQuery.current === requested) setItems(results); })
          .catch(() => { if (latestQuery.current === requested) setItems([]); });
      }, 300);
      return () => clearTimeout(timer.current);
    }, [query]);

    const select = (city: string) => { setQuery(''); setItems([]); setHistory(addHistory(city)); onSearch(city); };
    const prefetch = (city: string) => queryClient.prefetchQuery({ queryKey: ['weather', city], queryFn: () => weatherClient.get(city) });
    const toggleStar = (city: string) => setFavorites(toggleFavorite(city));

    const suggestions = query.trim().length >= 2
      ? items.map((item) => ({ key: String(item.id), city: `${item.name}, ${item.country}`, label: item.name, meta: item.region ? `${item.region}, ${item.country}` : item.country }))
      : focused
        ? Array.from(new Set([...favorites, ...history])).map((city) => ({ key: city, city, label: city, meta: '' }))
        : [];

    return <div className="relative z-20 flex w-full max-w-xl gap-2">
      <div className="glass flex min-w-0 flex-1 items-center rounded-2xl px-4 transition focus-within:bg-white/[.18]">
        <Search className="mr-3 h-5 w-5 shrink-0 text-white/65" />
        <input ref={ref} value={query} onChange={(e) => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setTimeout(() => setFocused(false), 150)} onKeyDown={(e) => e.key === 'Enter' && query.trim() && select(query.trim())} placeholder={t('placeholder')} className="h-12 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-white/55" aria-label={t('ariaLabel')} />
        {query && <button onClick={() => { setQuery(''); setItems([]); }} aria-label={t('clear')}><X className="h-4 w-4 text-white/65" /></button>}
      </div>
      <button onClick={onLocate} disabled={locating} className="glass grid h-12 w-12 shrink-0 place-items-center rounded-2xl transition hover:bg-white/[.2] disabled:opacity-60" aria-label={t('locate')}><LocateFixed className={locating ? 'h-5 w-5 animate-pulse' : 'h-5 w-5'} /></button>
      <AnimatePresence>{suggestions.length > 0 && <motion.ul initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass absolute top-14 w-[calc(100%-3.5rem)] overflow-hidden rounded-2xl p-1.5">
        {suggestions.slice(0, 6).map((item) => <li key={item.key} className="flex items-center gap-1">
          <button onClick={() => select(item.city)} onMouseEnter={() => prefetch(item.city)} className="min-w-0 flex-1 rounded-xl px-3 py-2.5 text-left text-sm transition hover:bg-white/15"><span className="font-medium">{item.label}</span>{item.meta && <span className="ml-2 text-white/60">{item.meta}</span>}</button>
          <button onClick={() => toggleStar(item.city)} className="shrink-0 rounded-xl p-2 hover:bg-white/15" aria-label={t('favorite')}><Star className={`h-4 w-4 ${favorites.includes(item.city) ? 'fill-amber-300 text-amber-300' : 'text-white/50'}`} /></button>
        </li>)}
      </motion.ul>}</AnimatePresence>
    </div>;
  }
);

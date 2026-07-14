'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useRouter, usePathname } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';

export function LanguageSwitcher() {
  const locale = useLocale();
  const t = useTranslations('header');
  const router = useRouter();
  const pathname = usePathname();

  const next = routing.locales.find((l) => l !== locale) ?? routing.defaultLocale;

  return (
    <button
      onClick={() => router.replace(pathname, { locale: next })}
      className="glass rounded-xl px-3 py-2 text-sm font-medium hover:bg-white/20"
      aria-label={t('language')}
    >
      {next.toUpperCase()}
    </button>
  );
}

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Dashboard } from '@/frontend/components/Dashboard';

export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const t = await getTranslations('app');
  const city = searchParams.q;
  const title = city ? `${city} — ${t('name')}` : `${t('name')} | ${t('tagline')}`;
  return { title, description: t('tagline') };
}

export default function Home() { return <Dashboard />; }

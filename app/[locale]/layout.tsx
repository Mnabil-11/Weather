import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Cairo, Tajawal, Inter } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { ErrorBoundary } from '@/frontend/providers/ErrorBoundary';
import { ReactQueryProvider } from '@/frontend/providers/ReactQueryProvider';
import { ServiceWorkerRegistrar } from '@/frontend/components/ServiceWorkerRegistrar';
import '../globals.css';

const cairo = Cairo({ subsets: ['arabic', 'latin'], weight: ['400', '600', '700', '800'], variable: '--font-cairo', display: 'swap' });
const tajawal = Tajawal({ subsets: ['arabic'], weight: ['400', '700', '800'], variable: '--font-tajawal', display: 'swap' });
const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '700', '800'], variable: '--font-inter', display: 'swap' });

export const metadata: Metadata = { title: 'Atmos | Weather dashboard', description: 'A glassmorphism weather dashboard' };

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: { locale: string } }) {
  const { locale } = params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const messages = await getMessages();
  const dir = locale === 'ar' ? 'rtl' : 'ltr';
  const fontVariables = locale === 'ar' ? `${cairo.variable} ${tajawal.variable}` : inter.variable;
  const fontClass = locale === 'ar' ? 'font-cairo' : 'font-sans';

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <body className={`${fontVariables} ${fontClass}`}>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryProvider>
            <ErrorBoundary>{children}</ErrorBoundary>
            <ServiceWorkerRegistrar />
          </ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const alt = 'Atmos weather dashboard';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { locale: string } }) {
  const t = await getTranslations({ locale: params.locale, namespace: 'app' });
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #3197f7, #18274a)', color: 'white' }}>
        <div style={{ fontSize: 96, fontWeight: 700 }}>{t('name')}</div>
        <div style={{ fontSize: 36, opacity: 0.85, marginTop: 16 }}>{t('tagline')}</div>
      </div>
    ),
    { ...size }
  );
}

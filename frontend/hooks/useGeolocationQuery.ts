import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';

export function useGeolocationQuery() {
  const t = useTranslations('errors');
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');

  const locate = useCallback((): Promise<string | null> => {
    if (!navigator.geolocation) {
      setError(t('geoUnsupported'));
      return Promise.resolve(null);
    }
    setLocating(true);
    setError('');
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => { setLocating(false); resolve(`${coords.latitude},${coords.longitude}`); },
        () => { setLocating(false); setError(t('geoDenied')); resolve(null); },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, [t]);

  return { locate, locating, error };
}

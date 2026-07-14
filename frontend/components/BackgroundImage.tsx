'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useBackgroundQuery } from '@/frontend/hooks/useBackgroundQuery';
import { backgroundGradients, type WeatherTheme } from '@/shared/weatherTheme';

// Minimal 1x1 pixel used as a blur-up placeholder while the full photo loads.
const BLUR_DATA_URL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';

export function BackgroundImage({ theme }: { theme: WeatherTheme }) {
  const { data: url } = useBackgroundQuery(theme);
  return (
    <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${backgroundGradients[theme]} transition-colors duration-700`}>
      <AnimatePresence>
        {url && (
          <motion.div key={url} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0">
            <Image src={url} alt="" fill sizes="100vw" priority placeholder="blur" blurDataURL={BLUR_DATA_URL} className="object-cover" />
            <div className="absolute inset-0 bg-black/25" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

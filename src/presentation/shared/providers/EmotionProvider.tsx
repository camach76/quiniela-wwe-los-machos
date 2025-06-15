'use client';

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ReactNode } from 'react';

const cache = createCache({
  key: 'css',
  prepend: true,
});

export function EmotionProvider({ children }: { children: ReactNode }) {
  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

export default EmotionProvider;

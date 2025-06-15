'use client';

import { QueryProvider } from "@/presentation/shared/providers/QueryProvider";
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';

// Configuración de Emotion para Next.js 13+
const createEmotionCache = () => {
  return createCache({
    key: 'css',
    prepend: true,
  });
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [cache] = useState(createEmotionCache);
  
  // Inyectar estilos en el head del documento
  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(' '),
        }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <StyleProvider hashPriority="high">
        <QueryProvider>{children}</QueryProvider>
      </StyleProvider>
    </CacheProvider>
  );
}

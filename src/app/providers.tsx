'use client';

import { QueryProvider } from "@/presentation/shared/providers/QueryProvider";
import { CacheProvider } from '@emotion/react';
import { useServerInsertedHTML } from 'next/navigation';
import { useEffect, useState } from 'react';
import { StyleProvider } from '@ant-design/cssinjs';
import createCache from '@emotion/cache';

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
    const { key, inserted } = cache;
    return (
      <style
        data-emotion={`${key} ${Object.keys(inserted).join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(inserted).join(' '),
        }}
      />
    );
  });

  // Limpiar la caché al desmontar
  useEffect(() => {
    return () => {
      // Limpiar la caché al desmontar
      Object.keys(cache.inserted).forEach((key) => {
        delete cache.inserted[key];
      });
    };
  }, [cache]);

  return (
    <CacheProvider value={cache}>
      <StyleProvider hashPriority="high">
        <QueryProvider>{children}</QueryProvider>
      </StyleProvider>
    </CacheProvider>
  );
}

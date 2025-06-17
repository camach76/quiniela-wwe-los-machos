import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Mapeo de nombres de equipos a URLs de imágenes locales
const TEAM_LOGO_MAP: Record<string, string> = {
  'Urawa Red Diamonds': '/images/logos/urawa-red-diamonds.png',
  'River Plate': '/images/logos/river-plate.png',
  'Mamelodi Sundowns': '/images/logos/mamelodi-sundowns.png',
  // Logo predeterminado para equipos sin imagen
  'default': '/images/logos/default-team-logo.svg',
  // Agrega más mapeos según sea necesario
};

// Función para generar una clave de caché única basada en la URL de la imagen
const getCacheKey = (url: string) => `team-logo-cache:${btoa(url)}`;

// Función segura para parsear JSON
const safeJsonParse = (json: string) => {
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
};

type TeamLogoProps = {
  name: string;
  logoUrl?: string | null;
  size?: number;
  className?: string;
  bgColor?: string;
};

// Función para obtener la URL de la imagen del equipo
const getTeamLogoUrl = (teamName: string, logoUrl?: string | null): string => {
  // Primero intentar con el mapeo local
  const mappedLogo = TEAM_LOGO_MAP[teamName];
  if (mappedLogo) return mappedLogo;
  
  // Si hay una URL proporcionada, usarla
  if (logoUrl) return logoUrl;
  
  // Si no hay URL, usar el logo predeterminado
  return TEAM_LOGO_MAP['default'] || '';
};

export const TeamLogo = ({
  name = 'Team',
  logoUrl,
  size = 48,
  className = '',
  bgColor = '#e5e7eb',
}: TeamLogoProps) => {
  const [imageError, setImageError] = useState(false);
  const [isImageValid, setIsImageValid] = useState<boolean | null>(null);
  const [cachedImage, setCachedImage] = useState<string | null>(null);
  const [finalLogoUrl, setFinalLogoUrl] = useState<string | null>(null);

  // Verificar si la URL de la imagen está en caché y es válida
  const checkImageCache = useCallback((url: string) => {
    if (!url) return false;

    // Si es una ruta local, no usar caché
    if (url.startsWith('/')) {
      setCachedImage(url);
      return true;
    }

    try {
      const cacheKey = getCacheKey(url);
      const cachedData = localStorage.getItem(cacheKey);
      
      if (cachedData) {
        const parsed = safeJsonParse(cachedData);
        if (parsed?.timestamp && parsed?.data) {
          // Verificar si el caché es reciente (menos de 7 días)
          const isFresh = Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000;
          if (isFresh) {
            setCachedImage(parsed.data);
            return true;
          }
        }
      }
    } catch (e) {
      // Silenciar errores de caché
    }
    return false;
  }, []);

  // Cargar y guardar en caché la imagen
  const loadAndCacheImage = useCallback(async (url: string) => {
    // Si ya tenemos una imagen en caché, la usamos
    if (checkImageCache(url)) return true;

    // Si no hay URL, marcamos como error
    if (!url) {
      setIsImageValid(false);
      return false;
    }

    // Creamos una promesa que se resuelve cuando la imagen se carga o falla
    return new Promise<boolean>((resolve) => {
      const img = new window.Image();
      
      // Configuramos un timeout para evitar que la promesa quede colgada
      const timeout = setTimeout(() => {
        setIsImageValid(false);
        resolve(false);
      }, 5000); // 5 segundos de timeout

      img.onload = () => {
        clearTimeout(timeout);
        try {
          const canvas = document.createElement('canvas');
          const size = Math.max(img.naturalWidth || 100, img.naturalHeight || 100, 100);
          canvas.width = size;
          canvas.height = size;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Intentamos dibujar la imagen, pero si falla, continuamos igual
            try {
              // Limpiamos el canvas
              ctx.clearRect(0, 0, size, size);
              // Dibujamos la imagen centrada
              const x = (size - (img.naturalWidth || size)) / 2;
              const y = (size - (img.naturalHeight || size)) / 2;
              ctx.drawImage(img, x, y, img.naturalWidth || size, img.naturalHeight || size);
            } catch (e) {
              // Silenciar errores de dibujo
            }
            
            const dataUrl = canvas.toDataURL('image/png');
            
            // Guardar en caché
            try {
              const cacheKey = getCacheKey(url);
              const cacheData = {
                timestamp: Date.now(),
                data: dataUrl
              };
              localStorage.setItem(cacheKey, JSON.stringify(cacheData));
              
              setCachedImage(dataUrl);
              setIsImageValid(true);
              setImageError(false);
              resolve(true);
              return;
            } catch (e) {
              // Silenciar errores de caché
            }
          }
        } catch (e) {
          // Silenciar errores de procesamiento
        }
        
        setIsImageValid(false);
        resolve(false);
      };
      
      img.onerror = () => {
        clearTimeout(timeout);
        setIsImageValid(false);
        resolve(false);
      };
      
      // Configuramos CORS después de los manejadores
      img.crossOrigin = 'anonymous';
      img.referrerPolicy = 'no-referrer';
      img.src = url;
    });
  }, [checkImageCache]);

  // Efecto para manejar la carga y caché de la imagen
  useEffect(() => {
    if (!logoUrl) {
      setIsImageValid(false);
      return;
    }

    const processImage = async () => {
      const isCached = await checkImageCache(logoUrl);
      if (!isCached) {
        await loadAndCacheImage(logoUrl);
      } else {
        setIsImageValid(true);
      }
    };

    processImage();
  }, [logoUrl, checkImageCache, loadAndCacheImage]);

  // Obtener las iniciales del nombre del equipo
  const getInitials = (teamName: string) => {
    if (!teamName) return '??';
    
    // Tomar las primeras letras de las primeras dos palabras
    return teamName
      .split(' ')
      .slice(0, 2)
      .map(word => word[0]?.toUpperCase() || '')
      .join('')
      .substring(0, 2);
  };

  // Mostrar carga mientras se verifica la imagen
  if (isImageValid === null) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full animate-pulse ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bgColor,
        }}
      />
    );
  }

  // Si hay un error o la imagen no es válida, mostrar un placeholder
  if (imageError || isImageValid === false) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gray-200 ${className}`}
        style={{
          width: size,
          minWidth: size,
          height: size,
          backgroundColor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <span 
          className="text-xs font-medium text-gray-500 text-center"
          style={{
            fontSize: Math.max(8, size * 0.25),
            lineHeight: 1,
            padding: 4,
          }}
        >
          {name
            .split(' ')
            .map((word) => word[0] || '')
            .join('')
            .toUpperCase()
            .substring(0, 2) || 'T'}
        </span>
      </div>
    );
  }

  // Renderizar la imagen si está disponible
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {cachedImage && (
        <Image
          src={cachedImage}
          alt={`${name} logo`}
          width={size}
          height={size}
          className="rounded-full object-cover"
          onError={() => {
            setImageError(true);
            setIsImageValid(false);
          }}
          onLoadingComplete={(result) => {
            if (result.naturalWidth === 0) {
              setImageError(true);
              setIsImageValid(false);
            } else {
              setIsImageValid(true);
            }
          }}
        />
      )}
    </div>
  );
}

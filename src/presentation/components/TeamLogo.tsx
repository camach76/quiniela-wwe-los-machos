import { useState, useEffect, useCallback } from 'react';
import Image, { ImageProps } from 'next/image';

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

  // Verificar si la URL de la imagen está en caché y es válida
  const checkImageCache = useCallback((url: string) => {
    if (!url) return false;

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

  // Si no hay URL de logo o hubo un error, mostrar las iniciales
  if (!logoUrl || !isImageValid || imageError) {
    return (
      <div 
        className={`flex items-center justify-center rounded-full ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: bgColor,
          fontSize: `${size * 0.4}px`,
          fontWeight: 'bold',
          color: '#4b5563', // gray-600
        }}
      >
        {getInitials(name)}
      </div>
    );
  }

  // Mostrar la imagen del logo
  return (
    <div className={`relative ${className}`} style={{ width: `${size}px`, height: `${size}px` }}>
      <div 
        className="absolute inset-0 rounded-full" 
        style={{ backgroundColor: bgColor }}
      />
      {cachedImage ? (
        <Image
          src={cachedImage}
          alt={name}
          width={size}
          height={size}
          className="relative z-10 object-contain p-1 rounded-full"
          onError={() => setImageError(true)}
          unoptimized={true}
        />
      ) : (
        <Image
          src={logoUrl}
          alt={name}
          width={size}
          height={size}
          className="relative z-10 object-contain p-1 rounded-full"
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
};

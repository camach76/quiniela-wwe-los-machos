interface CacheData<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos en milisegundos

export const getCachedData = <T>(key: string): T | null => {
  try {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached) as CacheData<T>;
    
    // Verificar si el caché ha expirado
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error al obtener datos del caché:', error);
    return null;
  }
};

export const setCachedData = <T>(key: string, data: T): void => {
  try {
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error al guardar en caché:', error);
  }
};

export const clearCachedData = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error al limpiar caché:', error);
  }
};

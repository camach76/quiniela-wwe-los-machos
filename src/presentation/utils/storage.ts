interface CacheData<T> {
  data: T;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000;

const isStorageAvailable = (): boolean => {
  try {
    return typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function';
  } catch {
    return false;
  }
};

export const getCachedData = <T>(key: string): T | null => {
  try {
    if (!isStorageAvailable()) return null;
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached) as CacheData<T>;

    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }

    return data;
  } catch {
    return null;
  }
};

export const setCachedData = <T>(key: string, data: T): void => {
  try {
    if (!isStorageAvailable()) return;
    const cacheData: CacheData<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(key, JSON.stringify(cacheData));
  } catch {
    // Silenciar errores de storage
  }
};

export const clearCachedData = (key: string): void => {
  try {
    if (!isStorageAvailable()) return;
    localStorage.removeItem(key);
  } catch {
    // Silenciar errores de storage
  }
};

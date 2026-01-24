export interface ClearCacheOptions {
  whitelistedKeys?: string[];
  clearServiceWorkers?: boolean;
  clearCacheStorage?: boolean;
  clearIndexedDB?: boolean;
}

export class CacheCleaner {
  static async clearAll(options: ClearCacheOptions = {}): Promise<void> {
    const {
      whitelistedKeys = [],
      clearServiceWorkers = true,
      clearCacheStorage = true,
      clearIndexedDB = true,
    } = options;

    await Promise.allSettled([
      this.clearLocalStorage(whitelistedKeys),
      clearServiceWorkers ? this.clearServiceWorkers() : Promise.resolve(),
      clearCacheStorage ? this.clearCacheStorage() : Promise.resolve(),
      clearIndexedDB ? this.clearIndexedDB() : Promise.resolve(),
    ]);
  }

  static clearLocalStorage(whitelistedKeys: string[] = []): void {
    const keysToKeep = new Map<string, string>();
    
    whitelistedKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value !== null) {
        keysToKeep.set(key, value);
      }
    });

    localStorage.clear();

    keysToKeep.forEach((value, key) => {
      localStorage.setItem(key, value);
    });
  }

  static async clearServiceWorkers(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(
        registrations.map(registration => registration.unregister())
      );
    } catch (error) {
      console.error('Error clearing service workers:', error);
    }
  }

  static async clearCacheStorage(): Promise<void> {
    if (!('caches' in window)) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    } catch (error) {
      console.error('Error clearing cache storage:', error);
    }
  }

  static async clearIndexedDB(): Promise<void> {
    if (!('indexedDB' in window)) {
      return;
    }

    try {
      if ('databases' in indexedDB) {
        const databases = await indexedDB.databases();
        await Promise.all(
          databases.map(db => {
            if (db.name) {
              return new Promise<void>((resolve, reject) => {
                const request = indexedDB.deleteDatabase(db.name!);
                request.onsuccess = () => resolve();
                request.onerror = () => reject(request.error);
                request.onblocked = () => resolve();
              });
            }
            return Promise.resolve();
          })
        );
      }
    } catch (error) {
      console.error('Error clearing IndexedDB:', error);
    }
  }
}

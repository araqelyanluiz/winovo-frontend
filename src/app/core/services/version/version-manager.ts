import { CacheCleaner, ClearCacheOptions } from './cache-cleaner';

export const APP_VERSION = `${new Date().getTime()}`;

const VERSION_STORAGE_KEY = 'app_version';
const RELOAD_FLAG_KEY = 'force_reload_done';

interface VersionManagerConfig extends ClearCacheOptions {
  version?: string;
  enableTelegramWebApp?: boolean;
}

export class VersionManager {
  private static config: VersionManagerConfig = {
    version: APP_VERSION,
    whitelistedKeys: [],
    clearServiceWorkers: true,
    clearCacheStorage: true,
    clearIndexedDB: true,
    enableTelegramWebApp: true,
  };

  static configure(config: Partial<VersionManagerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  static async checkVersion(): Promise<void> {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    const currentVersion = this.config.version || APP_VERSION;
    const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY);

    if (storedVersion !== currentVersion) {
      await this.handleVersionChange(currentVersion);
    }

    if (this.config.enableTelegramWebApp) {
      this.initTelegramWebApp();
    }
  }

  private static async handleVersionChange(newVersion: string): Promise<void> {
    if (sessionStorage.getItem(RELOAD_FLAG_KEY) === 'true') {
      localStorage.setItem(VERSION_STORAGE_KEY, newVersion);
      return;
    }

    console.log(`Version changed. Clearing caches and updating to ${newVersion}`);

    await CacheCleaner.clearAll({
      whitelistedKeys: this.config.whitelistedKeys,
      clearServiceWorkers: this.config.clearServiceWorkers,
      clearCacheStorage: this.config.clearCacheStorage,
      clearIndexedDB: this.config.clearIndexedDB,
    });

    localStorage.setItem(VERSION_STORAGE_KEY, newVersion);
    sessionStorage.setItem(RELOAD_FLAG_KEY, 'true');

    window.location.reload();
  }

  private static initTelegramWebApp(): void {
    if (typeof window !== 'undefined' && 'Telegram' in window) {
      const telegram = (window as unknown as { 
        Telegram?: { 
          WebApp?: { 
            ready: () => void;
            enableClosingConfirmation: () => void;
          } 
        } 
      }).Telegram;
      
      if (telegram?.WebApp) {
        if (telegram.WebApp.ready) {
          telegram.WebApp.ready();
        }
        if (telegram.WebApp.enableClosingConfirmation) {
          telegram.WebApp.enableClosingConfirmation();
        }
      }
    }
  }

  static getVersionedUrl(url: string): string {
    if (!url) return url;

    const version = this.config.version || APP_VERSION;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${encodeURIComponent(version)}`;
  }

  static getCurrentVersion(): string {
    return this.config.version || APP_VERSION;
  }

  static getStoredVersion(): string | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    return localStorage.getItem(VERSION_STORAGE_KEY);
  }
}

export async function initAppVersioning(config?: Partial<VersionManagerConfig>): Promise<void> {
  if (config) {
    VersionManager.configure(config);
  }
  await VersionManager.checkVersion();
}

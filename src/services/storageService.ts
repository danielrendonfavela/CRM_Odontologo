export interface StorageService {
  isPrivateMode(): Promise<boolean>;
  setItem(key: string, value: any): Promise<void>;
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

export class StorageServiceImpl implements StorageService {
  private memoryStorage = new Map<string, string>();
  private isPrivateCached: boolean | null = null;

  public resetCache(): void {
    this.isPrivateCached = null;
    this.memoryStorage.clear();
  }

  async isPrivateMode(): Promise<boolean> {
    if (this.isPrivateCached !== null) {
      return this.isPrivateCached;
    }

    if (typeof window === 'undefined') {
      this.isPrivateCached = true;
      return true;
    }

    try {
      const isDbRestricted = await new Promise<boolean>((resolve) => {
        if (!window.indexedDB) {
          resolve(true);
          return;
        }
        try {
          const request = window.indexedDB.open('__incognito_test__');
          request.onsuccess = () => resolve(false);
          request.onerror = () => resolve(true);
        } catch {
          resolve(true);
        }
      });

      if (isDbRestricted) {
        this.isPrivateCached = true;
        return true;
      }

      const testKey = '__incognito_test_ls__';
      window.localStorage.setItem(testKey, '1');
      window.localStorage.removeItem(testKey);

      this.isPrivateCached = false;
      return false;
    } catch {
      this.isPrivateCached = true;
      return true;
    }
  }

  async setItem(key: string, value: any): Promise<void> {
    const isPrivate = await this.isPrivateMode();
    const stringValue = JSON.stringify(value);

    if (isPrivate) {
      this.memoryStorage.set(key, stringValue);
      return;
    }

    try {
      window.localStorage.setItem(key, stringValue);
    } catch {
      this.memoryStorage.set(key, stringValue);
    }
  }

  async getItem<T>(key: string): Promise<T | null> {
    const isPrivate = await this.isPrivateMode();

    if (isPrivate) {
      const ramItem = this.memoryStorage.get(key);
      return ramItem ? JSON.parse(ramItem) : null;
    }

    try {
      const localItem = window.localStorage.getItem(key);
      if (localItem !== null) {
        return JSON.parse(localItem);
      }
      const ramItem = this.memoryStorage.get(key);
      return ramItem ? JSON.parse(ramItem) : null;
    } catch {
      const ramItem = this.memoryStorage.get(key);
      return ramItem ? JSON.parse(ramItem) : null;
    }
  }

  async removeItem(key: string): Promise<void> {
    this.memoryStorage.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {
      // Ignorar excepciones de localStorage en modo privado
    }
  }

  async clear(): Promise<void> {
    this.memoryStorage.clear();
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.clear();
      }
    } catch {
      // Ignorar excepciones de localStorage en modo privado
    }
  }
}

export const storageService = new StorageServiceImpl();

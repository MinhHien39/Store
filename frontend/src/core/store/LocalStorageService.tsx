import { JsonUtils } from '@/core/utils';

export enum LocalStorageKey {
  MEMBER = "member",
  MANAGER = "manager",
  ADMIN = "admin",
  TOKEN = "token",
};

export interface LocalStorageService {
  setItem<T>(key: string, value: T): Promise<void>;
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;

  setItemSync<T>(key: string, value: T, logError?: boolean): void;
  getItemSync<T>(key: string, logError?: boolean): T | null;
  removeItemSync(key: string, logError?: boolean): void;
  clearSync(logError?: boolean): void;
}

class LocalStorageImpl implements LocalStorageService {

  private static instance: LocalStorageImpl;

  private constructor() {
    // No-Op
  }

  static getInstance(): LocalStorageService {
    if (!LocalStorageImpl.instance) {
      LocalStorageImpl.instance = new LocalStorageImpl();
    }
    return LocalStorageImpl.instance;
  }

  private get isAvailable(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage?.getItem === 'function';
  }

  // Save an item to local storage asynchronously
  async setItem<T>(key: string, value: T): Promise<void> {
    if (!this.isAvailable) return;
    const stringValue = JsonUtils.stringify(value);
    if (stringValue !== null) {
      try {
        localStorage.setItem(key, stringValue);
      } catch (error) {
        console.error(`Failed to set item '${key}' in localStorage:`, error);
        throw error;
      }
    }
  }

  // Get an item from local storage asynchronously
  async getItem<T>(key: string): Promise<T | null> {
    if (!this.isAvailable) return null;
    try {
      const item = localStorage.getItem(key);
      return JsonUtils.parse<T>(item);
    } catch (error) {
      console.error(`Failed to get item '${key}' from localStorage:`, error);
      throw error;
    }
  }

  // Remove an item from local storage asynchronously
  async removeItem(key: string): Promise<void> {
    if (!this.isAvailable) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item '${key}' from localStorage:`, error);
      throw error;
    }
  }

  // Clear all items from local storage asynchronously
  async clear(): Promise<void> {
    if (!this.isAvailable) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
      throw error;
    }
  }

  // Save an item to local storage synchronously with optional error logging
  setItemSync<T>(key: string, value: T, logError: boolean = true): void {
    if (!this.isAvailable) return;
    const stringValue = JsonUtils.stringify(value);
    if (stringValue !== null) {
      try {
        localStorage.setItem(key, stringValue);
      } catch (error) {
        if (logError) console.error(`Failed to set item '${key}' in localStorage:`, error);
      }
    }
  }

  // Get an item from local storage synchronously with optional error logging
  getItemSync<T>(key: string, logError: boolean = true): T | null {
    if (!this.isAvailable) return null;
    try {
      const item = localStorage.getItem(key);
      return JsonUtils.parse<T>(item);
    } catch (error) {
      if (logError) console.error(`Failed to get item '${key}' from localStorage:`, error);
      return null;
    }
  }

  // Remove an item from local storage synchronously with optional error logging
  removeItemSync(key: string, logError: boolean = true): void {
    if (!this.isAvailable) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      if (logError) console.error(`Failed to remove item '${key}' from localStorage:`, error);
    }
  }

  // Clear all items from local storage synchronously with optional error logging
  clearSync(logError: boolean = true): void {
    if (!this.isAvailable) return;
    try {
      localStorage.clear();
    } catch (error) {
      if (logError) console.error('Failed to clear localStorage:', error);
    }
  }
}

export default LocalStorageImpl;

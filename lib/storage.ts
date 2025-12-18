/**
 * Enhanced storage utilities for the dApp
 * Handles localStorage with error handling and versioning
 */

const STORAGE_VERSION = 'v1';
const FEED_KEY = `arcnet_nostr_feed_${STORAGE_VERSION}`;
const PROFILE_KEY = 'arcnet_nostr_profile';
const SETTINGS_KEY = 'arcnet_nostr_settings';

export interface StoredFeed {
  events: any[];
  lastSync: number;
  version: string;
}

export interface UserSettings {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: boolean;
  autoConnect?: boolean;
}

/**
 * Save feed to localStorage
 */
export function saveFeed(events: any[]): boolean {
  try {
    const data: StoredFeed = {
      events,
      lastSync: Date.now(),
      version: STORAGE_VERSION,
    };
    localStorage.setItem(FEED_KEY, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving feed:', error);
    return false;
  }
}

/**
 * Load feed from localStorage
 */
export function loadFeed(): any[] {
  try {
    const stored = localStorage.getItem(FEED_KEY);
    if (!stored) return [];

    const data: StoredFeed = JSON.parse(stored);
    
    // Version check - migrate if needed
    if (data.version !== STORAGE_VERSION) {
      console.warn('Feed version mismatch, clearing old data');
      localStorage.removeItem(FEED_KEY);
      return [];
    }

    return data.events || [];
  } catch (error) {
    console.error('Error loading feed:', error);
    return [];
  }
}

/**
 * Clear feed from localStorage
 */
export function clearFeed(): void {
  try {
    localStorage.removeItem(FEED_KEY);
  } catch (error) {
    console.error('Error clearing feed:', error);
  }
}

/**
 * Save user profile
 */
export function saveProfile(profile: any): boolean {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
}

/**
 * Load user profile
 */
export function loadProfile(): any | null {
  try {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading profile:', error);
    return null;
  }
}

/**
 * Save user settings
 */
export function saveSettings(settings: UserSettings): boolean {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
}

/**
 * Load user settings
 */
export function loadSettings(): UserSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading settings:', error);
    return {};
  }
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): { used: number; available: number } {
  try {
    let used = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        used += localStorage[key].length + key.length;
      }
    }
    // Approximate 5MB limit for most browsers
    const available = 5 * 1024 * 1024 - used;
    return { used, available };
  } catch {
    return { used: 0, available: 0 };
  }
}


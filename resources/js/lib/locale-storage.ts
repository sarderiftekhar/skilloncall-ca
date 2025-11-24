/**
 * Locale Storage Utility
 * 
 * Manages language preference in localStorage for both guests and authenticated users.
 * Provides a unified interface for getting, setting, and syncing locale preferences.
 */

const LOCALE_STORAGE_KEY = 'skilloncall_locale';

export type Locale = 'en' | 'fr';

/**
 * Get the stored locale from localStorage
 * @returns The stored locale or null if not set
 */
export function getStoredLocale(): Locale | null {
    try {
        const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
        if (stored === 'en' || stored === 'fr') {
            return stored;
        }
        return null;
    } catch (error) {
        console.warn('Failed to read locale from localStorage:', error);
        return null;
    }
}

/**
 * Store locale preference in localStorage
 * @param locale The locale to store ('en' or 'fr')
 */
export function setStoredLocale(locale: Locale): void {
    try {
        localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch (error) {
        console.error('Failed to save locale to localStorage:', error);
    }
}

/**
 * Remove locale from localStorage
 */
export function clearStoredLocale(): void {
    try {
        localStorage.removeItem(LOCALE_STORAGE_KEY);
    } catch (error) {
        console.error('Failed to clear locale from localStorage:', error);
    }
}

/**
 * Sync locale to server (for authenticated users)
 * This updates the user's locale in the database
 * @param locale The locale to sync to the server
 * @returns Promise that resolves when sync is complete
 */
export async function syncLocaleToServer(locale: Locale): Promise<void> {
    try {
        const response = await fetch('/settings/locale', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
            body: JSON.stringify({ locale }),
        });

        if (!response.ok) {
            throw new Error('Failed to sync locale to server');
        }
    } catch (error) {
        console.error('Failed to sync locale to server:', error);
        throw error;
    }
}


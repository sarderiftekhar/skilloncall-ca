import { usePage } from '@inertiajs/react';

type Translations = Record<string, any>;

export function useTranslations() {
    const page = usePage();
    const props: any = page.props || {};
    const translations: Translations = (props as any).translations || {};
    const locale: string = (props as any).locale || 'en';

    const t = (key: string, fallback?: string) => {
        // Handle nested keys like 'stats.total_applications'
        const keys = key.split('.');
        let value = translations;
        
        for (const k of keys) {
            if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, k)) {
                value = value[k];
            } else {
                return fallback ?? key;
            }
        }
        
        return typeof value === 'string' ? value : (fallback ?? key);
    };

    return { t, locale };
}



import { usePage } from '@inertiajs/react';

type Translations = Record<string, any>;

export function useTranslations() {
    const page = usePage();
    const props: any = page.props || {};
    const translations: Translations = (props as any).translations || {};
    const locale: string = (props as any).locale || 'en';

    const t = (key: string, fallback?: string, replacements?: Record<string, string | number>): string => {
        // Handle nested keys like 'stats.total_applications'
        const keys = key.split('.');
        let value: any = translations;

        for (const k of keys) {
            if (value && typeof value === 'object' && Object.prototype.hasOwnProperty.call(value, k)) {
                value = value[k];
            } else {
                value = undefined;
                break;
            }
        }

        let result = (value !== undefined && value !== null) ? String(value) : (fallback ?? key);

        if (replacements) {
            for (const [placeholder, replacement] of Object.entries(replacements)) {
                result = result.replace(`:${placeholder}`, String(replacement));
            }
        }

        return result;
    };

    return { t, locale };
}

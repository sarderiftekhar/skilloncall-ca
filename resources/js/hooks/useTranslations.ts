import { usePage } from '@inertiajs/react';

type Translations = Record<string, string>;

export function useTranslations() {
    const page = usePage();
    const props: any = page.props || {};
    const translations: Translations = (props as any).translations || {};
    const locale: string = (props as any).locale || 'en';

    const t = (key: string, fallback?: string) => {
        if (Object.prototype.hasOwnProperty.call(translations, key)) {
            return translations[key];
        }
        return fallback ?? key;
    };

    return { t, locale };
}



import { useTranslations } from '@/hooks/useTranslations';

interface LanguageSwitcherProps {
    variant?: 'default' | 'compact' | 'sidebar';
    className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
    const { locale } = useTranslations();

    const switchLang = (next: 'en' | 'fr') => {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        window.location.href = url.toString();
    };

    // Compact version for sidebar/header
    if (variant === 'compact' || variant === 'sidebar') {
        return (
            <div className={`flex items-center space-x-1 border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm ${className}`}>
                <button 
                    onClick={() => switchLang('en')} 
                    className={`px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                        locale === 'en' 
                            ? 'bg-[#10B3D6] text-white' 
                            : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    EN
                </button>
                <button 
                    onClick={() => switchLang('fr')} 
                    className={`px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                        locale === 'fr' 
                            ? 'bg-[#10B3D6] text-white' 
                            : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    FR
                </button>
            </div>
        );
    }

    // Default version (like welcome page)
    return (
        <div className={`flex items-center space-x-1 border border-gray-600 rounded-md overflow-hidden ${className}`}>
            <button 
                onClick={() => switchLang('en')} 
                className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                    locale === 'en' 
                        ? 'bg-white text-gray-900' 
                        : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                EN
            </button>
            <button 
                onClick={() => switchLang('fr')} 
                className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                    locale === 'fr' 
                        ? 'bg-white text-gray-900' 
                        : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                FR
            </button>
        </div>
    );
}

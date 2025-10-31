import { useTranslations } from '@/hooks/useTranslations';
import { useState } from 'react';

interface LanguageSwitcherProps {
    variant?: 'default' | 'compact' | 'sidebar';
    className?: string;
}

export function LanguageSwitcher({ variant = 'default', className = '' }: LanguageSwitcherProps) {
    const { locale } = useTranslations();
    const [switching, setSwitching] = useState<string | null>(null);

    const switchLang = (next: 'en' | 'fr') => {
        // Don't switch if already on that language
        if (locale === next) return;
        
        setSwitching(next);
        
        // Store the preference and navigate
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        
        // Force reload to ensure session is updated
        window.location.href = url.toString();
    };

    // Compact version for sidebar/header
    if (variant === 'compact' || variant === 'sidebar') {
        return (
            <div className={`flex items-center space-x-1 border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm ${className}`}>
                <button 
                    onClick={() => switchLang('en')} 
                    disabled={switching === 'en'}
                    className={`px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                        locale === 'en' 
                            ? 'bg-[#10B3D6] text-white' 
                            : switching === 'en' 
                                ? 'bg-gray-200 text-gray-500 cursor-wait'
                                : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {switching === 'en' ? '...' : 'EN'}
                </button>
                <button 
                    onClick={() => switchLang('fr')} 
                    disabled={switching === 'fr'}
                    className={`px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-all ${
                        locale === 'fr' 
                            ? 'bg-[#10B3D6] text-white' 
                            : switching === 'fr' 
                                ? 'bg-gray-200 text-gray-500 cursor-wait'
                                : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    {switching === 'fr' ? '...' : 'FR'}
                </button>
            </div>
        );
    }

    // Default version (like welcome page)
    return (
        <div className={`flex items-center space-x-1 border border-gray-600 rounded-md overflow-hidden ${className}`}>
            <button 
                onClick={() => switchLang('en')} 
                disabled={switching === 'en'}
                className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                    locale === 'en' 
                        ? 'bg-white text-gray-900' 
                        : switching === 'en'
                            ? 'bg-gray-600 text-gray-400 cursor-wait'
                            : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {switching === 'en' ? '...' : 'EN'}
            </button>
            <button 
                onClick={() => switchLang('fr')} 
                disabled={switching === 'fr'}
                className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                    locale === 'fr' 
                        ? 'bg-white text-gray-900' 
                        : switching === 'fr'
                            ? 'bg-gray-600 text-gray-400 cursor-wait'
                            : 'bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
            >
                {switching === 'fr' ? '...' : 'FR'}
            </button>
        </div>
    );
}

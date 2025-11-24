import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Globe } from 'react-feather';
import { setStoredLocale, syncLocaleToServer, type Locale } from '@/lib/locale-storage';
import type { SharedData } from '@/types';

interface LanguageSelectionModalProps {
    isOpen: boolean;
}

export function LanguageSelectionModal({ isOpen }: LanguageSelectionModalProps) {
    const { auth } = usePage<SharedData>().props;
    const [selectedLang, setSelectedLang] = useState<Locale | null>(null);

    if (!isOpen) return null;

    const handleSelect = async (locale: Locale) => {
        setSelectedLang(locale);
        
        // Store in localStorage for guests and persistence
        setStoredLocale(locale);
        
        // If authenticated, sync to database
        if (auth?.user) {
            try {
                await syncLocaleToServer(locale);
            } catch (error) {
                console.error('Failed to sync locale to server:', error);
            }
        }
        
        // Redirect with language parameter to set session
        const url = new URL(window.location.href);
        url.searchParams.set('lang', locale);
        window.location.href = url.toString();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10B3D6] mb-4">
                        <Globe className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Choose Your Language / Choisissez votre langue
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Select your preferred language to continue
                    </p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => handleSelect('en')}
                        disabled={selectedLang !== null}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            selectedLang === 'en'
                                ? 'border-[#10B3D6] bg-[#10B3D6] text-white'
                                : selectedLang !== null
                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 bg-white text-gray-900 hover:border-[#10B3D6] hover:bg-[#10B3D6]/5'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="font-semibold text-lg">English</div>
                                <div className="text-sm opacity-80">Continue in English</div>
                            </div>
                            <div className="text-2xl">🇬🇧</div>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect('fr')}
                        disabled={selectedLang !== null}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                            selectedLang === 'fr'
                                ? 'border-[#10B3D6] bg-[#10B3D6] text-white'
                                : selectedLang !== null
                                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                                : 'border-gray-300 bg-white text-gray-900 hover:border-[#10B3D6] hover:bg-[#10B3D6]/5'
                        }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <div className="font-semibold text-lg">Français</div>
                                <div className="text-sm opacity-80">Continuer en français</div>
                            </div>
                            <div className="text-2xl">🇫🇷</div>
                        </div>
                    </button>
                </div>

                {selectedLang && (
                    <div className="mt-4 text-center">
                        <div className="inline-flex items-center text-sm text-gray-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#10B3D6] border-t-transparent mr-2"></div>
                            Loading...
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


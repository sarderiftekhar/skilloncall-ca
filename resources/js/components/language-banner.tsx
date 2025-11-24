import React, { useState } from 'react';
import { X } from 'react-feather';
import { Button } from '@/components/ui/button';
import { setStoredLocale } from '@/lib/locale-storage';

interface LanguageBannerProps {
    detectedLocale: 'en' | 'fr';
}

export function LanguageBanner({ detectedLocale }: LanguageBannerProps) {
    const [visible, setVisible] = useState(true);

    if (!visible) return null;

    const handleDismiss = () => {
        // Store the auto-detected locale in localStorage
        setStoredLocale(detectedLocale);
        setVisible(false);
    };

    const handleChangeLanguage = () => {
        const newLocale = detectedLocale === 'en' ? 'fr' : 'en';
        setStoredLocale(newLocale);
        
        // Redirect with language parameter
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLocale);
        window.location.href = url.toString();
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 max-w-md animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-white rounded-xl shadow-2xl border-2 border-[#10B3D6] p-4">
                <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#10B3D6] flex items-center justify-center">
                        <span className="text-xl">🌐</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 mb-2">
                            {detectedLocale === 'en' 
                                ? "We've selected English based on your browser settings." 
                                : "Nous avons sélectionné le français selon les paramètres de votre navigateur."}
                        </p>
                        
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleDismiss}
                                variant="ghost"
                                size="sm"
                                className="h-8 px-3 text-xs cursor-pointer hover:bg-gray-100"
                            >
                                {detectedLocale === 'en' ? 'OK' : 'OK'}
                            </Button>
                            <Button
                                onClick={handleChangeLanguage}
                                size="sm"
                                className="h-8 px-3 text-xs text-white cursor-pointer"
                                style={{ backgroundColor: '#10B3D6' }}
                            >
                                {detectedLocale === 'en' 
                                    ? 'Change to Français' 
                                    : 'Changer pour English'}
                            </Button>
                        </div>
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 cursor-pointer transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}


import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { setStoredLocale, syncLocaleToServer, type Locale } from '@/lib/locale-storage';

// Breadcrumbs will be set dynamically based on locale
const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('settings_page.title', 'Account Settings'),
        href: `/settings/profile?lang=${locale}`,
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { t, locale } = useTranslations();
    const { auth } = usePage<SharedData>().props;
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);
    const breadcrumbs = getBreadcrumbs(t, locale);
    const [changingLanguage, setChangingLanguage] = useState(false);

    const handleLanguageChange = async (newLocale: Locale) => {
        if (newLocale === locale || changingLanguage) return;
        
        setChangingLanguage(true);
        
        try {
            // Store in localStorage
            setStoredLocale(newLocale);
            
            // Sync to server if authenticated
            if (auth?.user) {
                await syncLocaleToServer(newLocale);
            }
            
            // Redirect to reload page with new language
            const url = new URL(window.location.href);
            url.searchParams.set('lang', newLocale);
            window.location.href = url.toString();
        } catch (error) {
            console.error('Failed to change language:', error);
            alert(t('settings_page.language_update_failed', 'Failed to update language preference. Please try again.'));
            setChangingLanguage(false);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        
        try {
            const response = await fetch('/settings/password', {
                method: 'PUT',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify({
                    current_password: formData.get('current_password'),
                    password: formData.get('password'),
                    password_confirmation: formData.get('password_confirmation'),
                }),
            });

            if (!response.ok) {
                const result = await response.json();
                if (result.message) {
                    alert(result.message);
                }
            } else {
                alert(t('settings_page.password_updated', 'Password updated successfully!'));
            }
        } catch (error) {
            console.error('Password update failed:', error);
            alert(t('settings_page.password_update_failed', 'Failed to update password. Please try again.'));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('settings_page.title', 'Account Settings')} />
            
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-8">
                <Card className="border w-full max-w-2xl" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                    <CardContent className="p-6">
                        <Tabs defaultValue="password" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="password" className="cursor-pointer">
                                    {t('settings_page.password_tab', 'Password')}
                                </TabsTrigger>
                                <TabsTrigger value="language" className="cursor-pointer">
                                    {t('settings_page.language_tab', 'Language')}
                                </TabsTrigger>
                                <TabsTrigger value="deactivate" className="cursor-pointer">
                                    {t('settings_page.deactivate_tab', 'Deactivate Account')}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="password" className="space-y-4">
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current_password">{t('settings_page.current_password', 'Current password')}</Label>
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="current-password"
                                            placeholder={t('settings_page.current_password', 'Current password')}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">{t('settings_page.new_password', 'New password')}</Label>
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            placeholder={t('settings_page.new_password', 'New password')}
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">{t('settings_page.confirm_password', 'Confirm password')}</Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            placeholder={t('settings_page.confirm_password', 'Confirm password')}
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button 
                                            type="submit"
                                            className="text-white cursor-pointer"
                                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        >
                                            {t('settings_page.save_password', 'Save password')}
                                        </Button>
                                    </div>
                                </form>
                            </TabsContent>

                            <TabsContent value="language" className="space-y-4">
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            {t('settings_page.language_preference', 'Language Preference')}
                                        </h3>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {t('settings_page.language_description', 'Select your preferred language for the platform')}
                                        </p>
                                    </div>

                                    <div className="grid gap-3">
                                        <button
                                            onClick={() => handleLanguageChange('en')}
                                            disabled={changingLanguage}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                                                locale === 'en'
                                                    ? 'border-[#10B3D6] bg-[#10B3D6]/5'
                                                    : changingLanguage
                                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                                    : 'border-gray-300 bg-white hover:border-[#10B3D6] hover:bg-[#10B3D6]/5'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-lg">English</div>
                                                    <div className="text-sm text-gray-600">Use English for all content</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">🇬🇧</span>
                                                    {locale === 'en' && (
                                                        <div className="w-3 h-3 rounded-full bg-[#10B3D6]"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => handleLanguageChange('fr')}
                                            disabled={changingLanguage}
                                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                                                locale === 'fr'
                                                    ? 'border-[#10B3D6] bg-[#10B3D6]/5'
                                                    : changingLanguage
                                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
                                                    : 'border-gray-300 bg-white hover:border-[#10B3D6] hover:bg-[#10B3D6]/5'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="font-semibold text-lg">Français</div>
                                                    <div className="text-sm text-gray-600">Utiliser le français pour tout le contenu</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-2xl">🇫🇷</span>
                                                    {locale === 'fr' && (
                                                        <div className="w-3 h-3 rounded-full bg-[#10B3D6]"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    </div>

                                    {changingLanguage && (
                                        <div className="text-center">
                                            <div className="inline-flex items-center text-sm text-gray-600">
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#10B3D6] border-t-transparent mr-2"></div>
                                                {t('settings_page.changing_language', 'Changing language...')}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </TabsContent>

                            <TabsContent value="deactivate" className="space-y-4">
                                <DeleteUser />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

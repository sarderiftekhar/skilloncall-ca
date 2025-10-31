import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { Form } from '@inertiajs/react';
import { useRef } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

import DeleteUser from '@/components/delete-user';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Account Settings',
        href: '/settings/profile',
    },
];

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string }) {
    const { t } = useTranslations();
    const { auth } = usePage<SharedData>().props;
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

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
                alert('Password updated successfully!');
            }
        } catch (error) {
            console.error('Password update failed:', error);
            alert('Failed to update password. Please try again.');
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Account Settings" />
            
            <div className="flex justify-center items-center min-h-[calc(100vh-200px)] py-8">
                <Card className="border w-full max-w-2xl" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                    <CardContent className="p-6">
                        <Tabs defaultValue="password" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 mb-6">
                                <TabsTrigger value="password" className="cursor-pointer">
                                    Password
                                </TabsTrigger>
                                <TabsTrigger value="deactivate" className="cursor-pointer">
                                    Deactivate Account
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="password" className="space-y-4">
                                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                                    <div className="grid gap-2">
                                        <Label htmlFor="current_password">Current password</Label>
                                        <Input
                                            id="current_password"
                                            ref={currentPasswordInput}
                                            name="current_password"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="current-password"
                                            placeholder="Current password"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">New password</Label>
                                        <Input
                                            id="password"
                                            ref={passwordInput}
                                            name="password"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            placeholder="New password"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">Confirm password</Label>
                                        <Input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type="password"
                                            className="mt-1 block w-full"
                                            autoComplete="new-password"
                                            placeholder="Confirm password"
                                            required
                                        />
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Button 
                                            type="submit"
                                            className="text-white cursor-pointer"
                                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        >
                                            Save password
                                        </Button>
                                    </div>
                                </form>
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

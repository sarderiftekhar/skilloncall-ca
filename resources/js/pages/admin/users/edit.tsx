import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Save } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import InputError from '@/components/input-error';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface EditUserPageProps {
    user: User;
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string, userName: string): BreadcrumbItem[] => [
    {
        title: t('admin.users.title', 'User Management'),
        href: `/admin/users?lang=${locale}`,
    },
    {
        title: userName,
        href: `/admin/users/${userName}?lang=${locale}`,
    },
    {
        title: t('admin.users.edit.title', 'Edit User'),
        href: '#',
    },
];

export default function EditUserPage({ user }: EditUserPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale, user.name);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        // Role is not included in form data as it should not be editable
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Role is already excluded from form data, so we can submit directly
        put(`/admin/users/${user.id}?lang=${locale}`, {
            preserveScroll: true,
            onSuccess: () => {
                router.visit(`/admin/users/${user.id}?lang=${locale}`);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.users.edit.title', 'Edit User')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer { cursor: pointer !important; }
                    .page-title { color: #192341 !important; }
                    .text-default { color: #192341 !important; }
                    .card-with-border { border-top: .5px solid #192341 !important; }
                `}</style>
            </Head>

            <div className="w-full px-6 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex items-center gap-4 mb-6">
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => router.get(`/admin/users/${user.id}?lang=${locale}`)}
                            style={{ height: '2.7em' }}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            {t('admin.common.cancel', 'Cancel')}
                        </Button>
                    </div>

                    <Card className="card-with-border rounded-xl bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold page-title">
                                {t('admin.users.edit.title', 'Edit User')}
                            </CardTitle>
                            <CardDescription>
                                {t('admin.users.edit.subtitle', 'Update user information')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <Label htmlFor="name" className="text-default">
                                        {t('admin.users.edit.form.name', 'Name')} *
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="mt-1 cursor-pointer"
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-default">
                                        {t('admin.users.edit.form.email', 'Email')} *
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="mt-1 cursor-pointer"
                                        required
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <div>
                                    <Label htmlFor="password" className="text-default">
                                        {t('admin.users.edit.form.password', 'Password (leave blank to keep current)')}
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="mt-1 cursor-pointer"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation" className="text-default">
                                        {t('admin.users.edit.form.password_confirmation', 'Confirm Password')}
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="mt-1 cursor-pointer"
                                    />
                                    <InputError message={errors.password_confirmation} />
                                </div>

                                <div>
                                    <Label htmlFor="role" className="text-default">
                                        {t('admin.users.edit.form.role', 'Role')}
                                    </Label>
                                    <Input
                                        id="role"
                                        type="text"
                                        value={t(`admin.roles.${user.role}`, user.role)}
                                        className="mt-1 bg-gray-100 cursor-not-allowed"
                                        disabled
                                        readOnly
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {t('admin.users.edit.form.role_readonly', 'Role cannot be changed after user creation')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4 pt-4">
                                    <Button
                                        type="submit"
                                        className="text-white cursor-pointer"
                                        disabled={processing}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {t('admin.users.edit.form.submit', 'Update User')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => router.get(`/admin/users/${user.id}?lang=${locale}`)}
                                        style={{ height: '2.7em' }}
                                    >
                                        {t('admin.users.edit.form.cancel', 'Cancel')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}


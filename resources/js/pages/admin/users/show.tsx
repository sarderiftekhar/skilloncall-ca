import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Edit, Trash2, Mail, Key, Users, Briefcase, DollarSign, TrendingUp } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
}

interface UserStats {
    totalJobs: number;
    activeJobs: number;
    completedJobs: number;
    totalApplications: number;
    totalEarnings: number;
}

interface ShowUserPageProps {
    user: User;
    stats: UserStats;
    recentActivity: any[];
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string, userName: string): BreadcrumbItem[] => [
    {
        title: t('admin.users.title', 'User Management'),
        href: `/admin/users?lang=${locale}`,
    },
    {
        title: userName,
        href: '#',
    },
];

export default function ShowUserPage({ user, stats, recentActivity }: ShowUserPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale, user.name);

    const handleDelete = () => {
        if (confirm(t('admin.common.confirm_delete', 'Are you sure you want to delete this user?'))) {
            router.delete(`/admin/users/${user.id}?lang=${locale}`, {
                onSuccess: () => {
                    router.visit(`/admin/users?lang=${locale}`);
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(amount);
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-purple-100 text-purple-800';
            case 'employer':
                return 'bg-blue-100 text-blue-800';
            case 'employee':
            case 'worker':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.users.show.title', 'User Details')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer { cursor: pointer !important; }
                    .page-title { color: #192341 !important; }
                    .text-default { color: #192341 !important; }
                    .card-with-border { border-top: .5px solid #192341 !important; }
                `}</style>
            </Head>

            <div className="w-full px-6 py-8">
                <div className="flex h-full flex-1 flex-col gap-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => router.get(`/admin/users?lang=${locale}`)}
                                style={{ height: '2.7em' }}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('admin.common.cancel', 'Back')}
                            </Button>
                            <div>
                                <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{user.name}</h1>
                                <p className="mt-1 text-lg leading-relaxed text-gray-600">{user.email}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                className="cursor-pointer"
                                onClick={() => router.get(`/admin/users/${user.id}/edit?lang=${locale}`)}
                                style={{ height: '2.7em' }}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                {t('admin.users.show.edit', 'Edit User')}
                            </Button>
                            <Button
                                variant="outline"
                                className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                onClick={handleDelete}
                                style={{ height: '2.7em' }}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('admin.users.show.delete', 'Delete User')}
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Profile Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.users.show.profile', 'Profile Information')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white"
                                            style={{ backgroundColor: '#10B3D6', width: '60px', height: '60px', fontSize: '24px' }}
                                        >
                                            {user.name
                                                .split(' ')
                                                .map((n) => n[0])
                                                .join('')
                                                .toUpperCase()
                                                .slice(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="text-default text-xl font-semibold">{user.name}</h3>
                                            <p className="text-gray-600">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.users.index.columns.role', 'Role')}</p>
                                            <Badge className={getRoleBadgeColor(user.role)} style={{ fontSize: '11px', marginTop: '4px' }}>
                                                {t(`admin.roles.${user.role}`, user.role)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.users.index.columns.status', 'Status')}</p>
                                            <Badge
                                                className={user.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                                style={{ fontSize: '11px', marginTop: '4px' }}
                                            >
                                                {user.email_verified_at ? t('admin.statuses.verified', 'Verified') : t('admin.statuses.unverified', 'Unverified')}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.users.index.columns.created_at', 'Created')}</p>
                                            <p className="text-default font-medium">{formatDate(user.created_at)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Statistics */}
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.users.show.statistics', 'Statistics')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Briefcase className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                                <p className="text-sm text-gray-600">{t('admin.users.show.stats.total_jobs', 'Total Jobs')}</p>
                                            </div>
                                            <p className="text-default text-2xl font-bold">{stats.totalJobs}</p>
                                        </div>
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <TrendingUp className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                                <p className="text-sm text-gray-600">{t('admin.users.show.stats.active_jobs', 'Active Jobs')}</p>
                                            </div>
                                            <p className="text-default text-2xl font-bold">{stats.activeJobs}</p>
                                        </div>
                                        <div className="p-4 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Users className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                                <p className="text-sm text-gray-600">{t('admin.users.show.stats.total_applications', 'Applications')}</p>
                                            </div>
                                            <p className="text-default text-2xl font-bold">{stats.totalApplications}</p>
                                        </div>
                                        {stats.totalEarnings > 0 && (
                                            <div className="p-4 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <DollarSign className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                                    <p className="text-sm text-gray-600">{t('admin.users.show.stats.total_earnings', 'Total Earnings')}</p>
                                                </div>
                                                <p className="text-default text-2xl font-bold">{formatCurrency(stats.totalEarnings)}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Actions Sidebar */}
                        <div className="space-y-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.users.show.actions', 'Actions')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button
                                        variant="outline"
                                        className="w-full cursor-pointer justify-start"
                                        onClick={() => router.get(`/admin/users/${user.id}/edit?lang=${locale}`)}
                                        style={{ height: '2.7em' }}
                                    >
                                        <Edit className="h-4 w-4 mr-2" />
                                        {t('admin.users.show.edit', 'Edit User')}
                                    </Button>
                                    {!user.email_verified_at && (
                                        <Button
                                            variant="outline"
                                            className="w-full cursor-pointer justify-start"
                                            style={{ height: '2.7em' }}
                                        >
                                            <Mail className="h-4 w-4 mr-2" />
                                            {t('admin.users.show.verify_email', 'Verify Email')}
                                        </Button>
                                    )}
                                    <Button
                                        variant="outline"
                                        className="w-full cursor-pointer justify-start"
                                        style={{ height: '2.7em' }}
                                    >
                                        <Key className="h-4 w-4 mr-2" />
                                        {t('admin.users.show.reset_password', 'Reset Password')}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full cursor-pointer justify-start border-red-300 text-red-700 hover:bg-red-50"
                                        onClick={handleDelete}
                                        style={{ height: '2.7em' }}
                                    >
                                        <Trash2 className="h-4 w-4 mr-2" />
                                        {t('admin.users.show.delete', 'Delete User')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


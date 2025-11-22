import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Search, Plus, Eye, Edit, Trash2, Users, Filter, X } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
    subscription_plan_name?: string | null;
}

interface PaginatedUsers {
    data: User[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

interface IndexUsersPageProps {
    users: PaginatedUsers;
    filters: {
        search?: string;
        role?: string;
        status?: string;
    };
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.users.title', 'User Management'),
        href: `/admin/users?lang=${locale}`,
    },
];

export default function IndexUsersPage({ users, filters }: IndexUsersPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        role: filters.role || '',
        status: filters.status || '',
    });

    const handleFilter = () => {
        get(`/admin/users?lang=${locale}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            role: '',
            status: '',
        });
        router.get(`/admin/users?lang=${locale}`, {}, {
            preserveState: false,
        });
    };

    const handleDelete = (userId: number) => {
        if (confirm(t('admin.common.confirm_delete', 'Are you sure you want to delete this user?'))) {
            router.delete(`/admin/users/${userId}?lang=${locale}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Success handled by flash message
                },
            });
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
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
            <Head title={t('admin.users.index.title', 'Users')}>
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
                        <div>
                            <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{t('admin.users.index.title', 'Users')}</h1>
                            <p className="mt-1 text-lg leading-relaxed text-gray-600">{t('admin.users.subtitle', 'Manage all platform users')}</p>
                        </div>
                        <Button
                            className="text-white cursor-pointer transition-all duration-200 hover:scale-105 hover:opacity-90"
                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            onClick={() => router.get(`/admin/users/create?lang=${locale}`)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {t('admin.users.index.create_user', 'Create User')}
                        </Button>
                    </div>

                    {/* Filters */}
                    <Card className="card-with-border rounded-xl bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                <Filter className="mr-2 h-5 w-5" />
                                {t('admin.common.filter', 'Filter')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.common.search', 'Search')}
                                    </label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder={t('admin.users.index.search_placeholder', 'Search by name or email...')}
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                            className="pl-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.users.index.filter_by_role', 'Filter by Role')}
                                    </label>
                                    <Select value={data.role || 'all'} onValueChange={(value) => setData('role', value === 'all' ? '' : value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder={t('admin.users.index.all_roles', 'All Roles')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="cursor-pointer">{t('admin.users.index.all_roles', 'All Roles')}</SelectItem>
                                            <SelectItem value="admin" className="cursor-pointer">{t('admin.roles.admin', 'Admin')}</SelectItem>
                                            <SelectItem value="employer" className="cursor-pointer">{t('admin.roles.employer', 'Employer')}</SelectItem>
                                            <SelectItem value="employee" className="cursor-pointer">{t('admin.roles.employee', 'Employee')}</SelectItem>
                                            <SelectItem value="worker" className="cursor-pointer">{t('admin.roles.worker', 'Worker')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.users.index.filter_by_status', 'Filter by Status')}
                                    </label>
                                    <Select value={data.status || 'all'} onValueChange={(value) => setData('status', value === 'all' ? '' : value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder={t('admin.users.index.all_statuses', 'All Statuses')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="cursor-pointer">{t('admin.users.index.all_statuses', 'All Statuses')}</SelectItem>
                                            <SelectItem value="verified" className="cursor-pointer">{t('admin.users.index.verified', 'Verified')}</SelectItem>
                                            <SelectItem value="unverified" className="cursor-pointer">{t('admin.users.index.unverified', 'Unverified')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end gap-2">
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={handleReset}
                                        style={{ height: '2.7em' }}
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        {t('admin.common.reset', 'Reset')}
                                    </Button>
                                    <Button
                                        className="text-white cursor-pointer"
                                        onClick={handleFilter}
                                        disabled={processing}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        <Search className="h-4 w-4 mr-2" />
                                        {t('admin.common.filter', 'Filter')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users Table */}
                    <Card className="card-with-border rounded-xl bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold page-title">
                                {t('admin.users.index.title', 'Users')} ({users.total})
                            </CardTitle>
                            <CardDescription>
                                {t('admin.common.showing', 'Showing')} {users.from} - {users.to} {t('admin.common.of', 'of')} {users.total} {t('admin.users.index.title', 'users')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {users.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.users.index.columns.name', 'Name')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.users.index.columns.email', 'Email')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.users.index.columns.role', 'Role')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.users.index.columns.subscription', 'Subscription Type')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.users.index.columns.status', 'Status')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.users.index.columns.created_at', 'Created')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.users.index.columns.actions', 'Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.data.map((user) => (
                                                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <div
                                                                className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white mr-3"
                                                                style={{ backgroundColor: '#10B3D6', width: '30px', height: '30px', fontSize: '12px' }}
                                                            >
                                                                {user.name
                                                                    .split(' ')
                                                                    .map((n) => n[0])
                                                                    .join('')
                                                                    .toUpperCase()
                                                                    .slice(0, 2)}
                                                            </div>
                                                            <span className="text-default font-medium">{user.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{user.email}</td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={getRoleBadgeColor(user.role)} style={{ fontSize: '11px' }}>
                                                            {t(`admin.roles.${user.role}`, user.role)}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {user.subscription_plan_name ? (
                                                            <Badge className="bg-gradient-to-r from-[#10B3D6] to-[#0D8FA8] text-white" style={{ fontSize: '11px' }}>
                                                                {user.subscription_plan_name}
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-gray-100 text-gray-600" style={{ fontSize: '11px' }}>
                                                                {t('admin.users.index.free_tier', 'Free Tier')}
                                                            </Badge>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <Badge
                                                            className={user.email_verified_at ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                                                            style={{ fontSize: '11px' }}
                                                        >
                                                            {user.email_verified_at ? t('admin.statuses.verified', 'Verified') : t('admin.statuses.unverified', 'Unverified')}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="cursor-pointer"
                                                                onClick={() => router.get(`/admin/users/${user.id}?lang=${locale}`)}
                                                                style={{ height: '2.5em' }}
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="cursor-pointer"
                                                                onClick={() => router.get(`/admin/users/${user.id}/edit?lang=${locale}`)}
                                                                style={{ height: '2.5em' }}
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                className="border-red-300 text-red-700 hover:bg-red-50 cursor-pointer"
                                                                onClick={() => handleDelete(user.id)}
                                                                style={{ height: '2.5em' }}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">{t('admin.users.index.no_users', 'No users found')}</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {users.last_page > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                                    <div className="text-sm text-gray-600">
                                        {t('admin.common.showing', 'Showing')} {users.from} - {users.to} {t('admin.common.of', 'of')} {users.total}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {users.links.map((link, index) =>
                                            link.url ? (
                                                <Link
                                                    key={index}
                                                    href={`${link.url}${link.url.includes('?') ? '&' : '?'}lang=${locale}`}
                                                    className={`px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
                                                        link.active
                                                            ? 'bg-[#10B3D6] text-white'
                                                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                                                    }`}
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            ) : (
                                                <span
                                                    key={index}
                                                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-400 cursor-not-allowed"
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}


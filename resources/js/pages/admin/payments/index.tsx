import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { Search, Eye, DollarSign, Filter, X, Download, CreditCard } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface Payment {
    id: number;
    amount: number;
    status: string;
    type: string;
    created_at: string;
    payer?: {
        id: number;
        name: string;
    };
    payee?: {
        id: number;
        name: string;
    };
}

interface PaginatedPayments {
    data: Payment[];
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

interface IndexPaymentsPageProps {
    payments: PaginatedPayments;
    filters: {
        search?: string;
        status?: string;
        type?: string;
    };
    financialSummary?: {
        totalRevenue: number;
        pendingAmount: number;
        commission: number;
    };
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.payments.title', 'Payment Management'),
        href: `/admin/payments?lang=${locale}`,
    },
];

export default function IndexPaymentsPage({ payments, filters, financialSummary }: IndexPaymentsPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);

    const { data, setData, get, processing } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        type: filters.type || '',
    });

    const handleFilter = () => {
        get(`/admin/payments?lang=${locale}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setData({
            search: '',
            status: '',
            type: '',
        });
        router.get(`/admin/payments?lang=${locale}`, {}, {
            preserveState: false,
        });
    };

    const handleExport = () => {
        router.get(`/admin/reports/export/payments?lang=${locale}`, {
            preserveState: false,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(amount);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'failed':
                return 'bg-red-100 text-red-800';
            case 'refunded':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.payments.index.title', 'Payments')}>
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
                            <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{t('admin.payments.index.title', 'Payments')}</h1>
                            <p className="mt-1 text-lg leading-relaxed text-gray-600">{t('admin.payments.subtitle', 'Monitor and process payments')}</p>
                        </div>
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={handleExport}
                            style={{ height: '2.7em' }}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {t('admin.payments.index.export', 'Export to CSV')}
                        </Button>
                    </div>

                    {/* Financial Summary */}
                    {financialSummary && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg p-3" style={{ backgroundColor: '#FCF2F0' }}>
                                            <DollarSign className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.index.total_revenue', 'Total Revenue')}</p>
                                            <p className="text-default text-2xl font-bold">{formatCurrency(financialSummary.totalRevenue)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg p-3" style={{ backgroundColor: '#FCF2F0' }}>
                                            <CreditCard className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.index.pending_amount', 'Pending Amount')}</p>
                                            <p className="text-default text-2xl font-bold">{formatCurrency(financialSummary.pendingAmount)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg p-3" style={{ backgroundColor: '#FCF2F0' }}>
                                            <DollarSign className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.index.commission', 'Commission')}</p>
                                            <p className="text-default text-2xl font-bold">{formatCurrency(financialSummary.commission)}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

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
                                            placeholder={t('admin.payments.index.search_placeholder', 'Search payments...')}
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleFilter()}
                                            className="pl-10 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.payments.index.filter_by_status', 'Filter by Status')}
                                    </label>
                                    <Select value={data.status || 'all'} onValueChange={(value) => setData('status', value === 'all' ? '' : value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue placeholder={t('admin.payments.index.all_statuses', 'All Statuses')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="cursor-pointer">{t('admin.payments.index.all_statuses', 'All Statuses')}</SelectItem>
                                            <SelectItem value="pending" className="cursor-pointer">{t('admin.statuses.pending', 'Pending')}</SelectItem>
                                            <SelectItem value="completed" className="cursor-pointer">{t('admin.statuses.completed', 'Completed')}</SelectItem>
                                            <SelectItem value="failed" className="cursor-pointer">{t('admin.statuses.failed', 'Failed')}</SelectItem>
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

                    {/* Payments Table */}
                    <Card className="card-with-border rounded-xl bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold page-title">
                                {t('admin.payments.index.title', 'Payments')} ({payments.total})
                            </CardTitle>
                            <CardDescription>
                                {t('admin.common.showing', 'Showing')} {payments.from} - {payments.to} {t('admin.common.of', 'of')} {payments.total} {t('admin.payments.index.title', 'payments')}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {payments.data.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.payments.index.columns.id', 'ID')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.payments.index.columns.payer', 'Payer')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.payments.index.columns.payee', 'Payee')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.payments.index.columns.amount', 'Amount')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.payments.index.columns.status', 'Status')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.payments.index.columns.date', 'Date')}</th>
                                                <th className="text-left py-3 px-4 text-sm font-semibold text-default">{t('admin.payments.index.columns.actions', 'Actions')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.data.map((payment) => (
                                                <tr key={payment.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                    <td className="py-3 px-4 text-sm text-gray-600">#{payment.id}</td>
                                                    <td className="py-3 px-4 text-sm text-default">{payment.payer?.name || 'N/A'}</td>
                                                    <td className="py-3 px-4 text-sm text-default">{payment.payee?.name || 'N/A'}</td>
                                                    <td className="py-3 px-4 text-sm font-semibold text-default">{formatCurrency(payment.amount)}</td>
                                                    <td className="py-3 px-4">
                                                        <Badge className={getStatusColor(payment.status)} style={{ fontSize: '11px' }}>
                                                            {t(`admin.statuses.${payment.status.toLowerCase()}`, payment.status)}
                                                        </Badge>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-gray-600">{formatDate(payment.created_at)}</td>
                                                    <td className="py-3 px-4">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="cursor-pointer"
                                                            onClick={() => router.visit(`/admin/payments/${payment.id}?lang=${locale}`)}
                                                            style={{ height: '2.5em' }}
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">{t('admin.payments.index.no_payments', 'No payments found')}</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {payments.last_page > 1 && (
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
                                    <div className="text-sm text-gray-600">
                                        {t('admin.common.showing', 'Showing')} {payments.from} - {payments.to} {t('admin.common.of', 'of')} {payments.total}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {payments.links.map((link, index) =>
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


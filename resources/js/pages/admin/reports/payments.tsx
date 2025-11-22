import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Download, DollarSign, Filter } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface PaymentReportData {
    data: Array<{
        date: string;
        count: number;
        total_amount: number;
        status: string;
    }>;
    totalAmount: number;
    totalCount: number;
}

interface PaymentReportsPageProps {
    reports: PaymentReportData;
    filters: {
        period?: string;
        type?: string;
    };
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.reports.title', 'Reports & Analytics'),
        href: `/admin/reports?lang=${locale}`,
    },
    {
        title: t('admin.reports.payments.title', 'Payment Reports'),
        href: '#',
    },
];

export default function PaymentReportsPage({ reports, filters }: PaymentReportsPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);

    const { data, setData, get } = useForm({
        period: filters.period || '30days',
        type: filters.type || '',
    });

    const handleFilter = () => {
        get(`/admin/reports/payments?lang=${locale}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        router.get(`/admin/reports/export/payments?lang=${locale}&period=${data.period}&type=${data.type}`, {
            preserveState: false,
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: 'CAD',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.reports.payments.title', 'Payment Reports')}>
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
                                onClick={() => router.get(`/admin/reports?lang=${locale}`)}
                                style={{ height: '2.7em' }}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('admin.common.cancel', 'Back')}
                            </Button>
                            <div>
                                <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{t('admin.reports.payments.title', 'Payment Reports')}</h1>
                                <p className="mt-1 text-lg leading-relaxed text-gray-600">{t('admin.reports.payments.subtitle', 'Payment and revenue reports')}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={handleExport}
                            style={{ height: '2.7em' }}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {t('admin.reports.payments.export', 'Export to CSV')}
                        </Button>
                    </div>

                    {/* Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="card-with-border rounded-xl bg-white shadow-sm">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg p-3" style={{ backgroundColor: '#FCF2F0' }}>
                                        <DollarSign className="h-6 w-6" style={{ color: '#10B3D6' }} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600">{t('admin.reports.payments.total_revenue', 'Total Revenue')}</p>
                                        <p className="text-default text-2xl font-bold">{formatCurrency(reports.totalAmount)}</p>
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
                                        <p className="text-sm text-gray-600">{t('admin.reports.payments.total_count', 'Total Payments')}</p>
                                        <p className="text-default text-2xl font-bold">{reports.totalCount.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.reports.payments.filter_by_period', 'Filter by Period')}
                                    </label>
                                    <Select value={data.period} onValueChange={(value) => setData('period', value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="7days" className="cursor-pointer">{t('admin.reports.periods.7days', 'Last 7 Days')}</SelectItem>
                                            <SelectItem value="30days" className="cursor-pointer">{t('admin.reports.periods.30days', 'Last 30 Days')}</SelectItem>
                                            <SelectItem value="90days" className="cursor-pointer">{t('admin.reports.periods.90days', 'Last 90 Days')}</SelectItem>
                                            <SelectItem value="1year" className="cursor-pointer">{t('admin.reports.periods.1year', 'Last Year')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.reports.payments.filter_by_type', 'Filter by Type')}
                                    </label>
                                    <Select value={data.type || 'all'} onValueChange={(value) => setData('type', value === 'all' ? '' : value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="cursor-pointer">{t('admin.payments.index.all_types', 'All Types')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex items-end">
                                    <Button
                                        className="text-white cursor-pointer"
                                        onClick={handleFilter}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        {t('admin.common.filter', 'Filter')}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report Data */}
                    <Card className="card-with-border rounded-xl bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold page-title">
                                {t('admin.reports.payments.revenue_trends', 'Revenue Trends')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {reports.data.length > 0 ? (
                                <div className="space-y-2">
                                    {reports.data.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: '#FCF2F0' }}>
                                            <div>
                                                <span className="text-default font-medium">{new Date(item.date).toLocaleDateString('en-CA')}</span>
                                                <span className="text-gray-600 ml-2">({t(`admin.statuses.${item.status.toLowerCase()}`, item.status)})</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-gray-600 font-semibold block">{item.count} {t('admin.reports.payments.payments', 'payments')}</span>
                                                <span className="text-default font-bold">{formatCurrency(item.total_amount)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600">{t('admin.common.no_data', 'No data available')}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}


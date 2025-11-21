import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, Download, Briefcase, Filter } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface JobReportData {
    data: Array<{
        date: string;
        count: number;
        status: string;
    }>;
    total: number;
}

interface JobReportsPageProps {
    reports: JobReportData;
    filters: {
        period?: string;
        category?: string;
    };
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.reports.title', 'Reports & Analytics'),
        href: `/admin/reports?lang=${locale}`,
    },
    {
        title: t('admin.reports.jobs.title', 'Job Reports'),
        href: '#',
    },
];

export default function JobReportsPage({ reports, filters }: JobReportsPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);

    const { data, setData, get } = useForm({
        period: filters.period || '30days',
        category: filters.category || '',
    });

    const handleFilter = () => {
        get(`/admin/reports/jobs?lang=${locale}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleExport = () => {
        router.get(`/admin/reports/export/jobs?lang=${locale}&period=${data.period}&category=${data.category}`, {
            preserveState: false,
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.reports.jobs.title', 'Job Reports')}>
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
                                <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{t('admin.reports.jobs.title', 'Job Reports')}</h1>
                                <p className="mt-1 text-lg leading-relaxed text-gray-600">{t('admin.reports.jobs.subtitle', 'Job posting and activity reports')}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="cursor-pointer"
                            onClick={handleExport}
                            style={{ height: '2.7em' }}
                        >
                            <Download className="h-4 w-4 mr-2" />
                            {t('admin.reports.jobs.export', 'Export to CSV')}
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                                        {t('admin.reports.jobs.filter_by_period', 'Filter by Period')}
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
                                        {t('admin.reports.jobs.filter_by_category', 'Filter by Category')}
                                    </label>
                                    <Select value={data.category || 'all'} onValueChange={(value) => setData('category', value === 'all' ? '' : value)}>
                                        <SelectTrigger className="cursor-pointer">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all" className="cursor-pointer">{t('admin.jobs.index.all_categories', 'All Categories')}</SelectItem>
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
                                {t('admin.reports.jobs.creation_trends', 'Job Creation Trends')}
                            </CardTitle>
                            <CardDescription>
                                {t('admin.reports.jobs.total', 'Total')}: {reports.total} {t('admin.reports.jobs.jobs', 'jobs')}
                            </CardDescription>
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
                                            <span className="text-gray-600 font-semibold">{item.count} {t('admin.reports.jobs.jobs', 'jobs')}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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


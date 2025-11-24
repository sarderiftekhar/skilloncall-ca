import { Head, Link, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslations } from '@/hooks/useTranslations';
import { AlertTriangle, Clipboard, ChevronDown, ChevronUp, Search } from 'react-feather';
import { useMemo, useState } from 'react';
import { type BreadcrumbItem } from '@/types';

interface ExceptionLog {
    id: number;
    exception_class: string | null;
    message: string | null;
    file: string | null;
    line: number | null;
    trace: string | null;
    request_url: string | null;
    request_method: string | null;
    request_payload: Record<string, unknown> | null;
    headers: Record<string, unknown> | null;
    ip_address: string | null;
    created_at: string | null;
    user: {
        id: number;
        name: string;
        email: string;
    } | null;
}

interface PaginatedLogs {
    data: ExceptionLog[];
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

interface ExceptionLogPageProps {
    logs: PaginatedLogs;
    filters: {
        search?: string | null;
    };
    stats: {
        total: number;
        today: number;
        unique_messages: number;
        last_log_at: string | null;
    };
}

const formatDateTime = (value?: string | null) => {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString();
};

const truncate = (value: string | null | undefined, length = 160) => {
    if (!value) {
        return '';
    }

    return value.length > length ? `${value.slice(0, length)}...` : value;
};

export default function ExceptionLogsPage({ logs, filters, stats }: ExceptionLogPageProps) {
    const { t, locale } = useTranslations();
    const [openLog, setOpenLog] = useState<number | null>(null);
    const { data, setData, get } = useForm({
        search: filters.search ?? '',
    });

    const title = t('logs.exceptions.title', 'Exception Logs');

    const breadcrumbs: BreadcrumbItem[] = useMemo(
        () => [
            {
                title: t('nav.dashboard', 'Dashboard'),
                href: `/admin/dashboard?lang=${locale}`,
            },
            {
                title,
                href: `/admin/logs/exceptions?lang=${locale}`,
            },
        ],
        [locale, t, title],
    );

    const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        get('/admin/logs/exceptions', {
            search: data.search,
            lang: locale,
        }, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const clearSearch = () => {
        setData('search', '');
        router.get('/admin/logs/exceptions', { lang: locale }, {
            preserveState: true,
            replace: true,
        });
    };

    const copyTrace = async (trace: string | null) => {
        if (!trace || !navigator.clipboard) return;
        await navigator.clipboard.writeText(trace);
    };

    const statCards = [
        {
            label: t('logs.exceptions.stats.total', 'Total Logged'),
            value: stats.total,
        },
        {
            label: t('logs.exceptions.stats.today', 'Logged Today'),
            value: stats.today,
        },
        {
            label: t('logs.exceptions.stats.unique', 'Unique Issues'),
            value: stats.unique_messages,
        },
        {
            label: t('logs.exceptions.stats.last_entry', 'Last Entry'),
            value: formatDateTime(stats.last_log_at),
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className="space-y-6">
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#10B3D6]">
                            <AlertTriangle className="h-5 w-5" />
                            {title}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            {t('logs.exceptions.subtitle', 'Monitor recent application exceptions and inspect stack traces.')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <form onSubmit={handleSearch} className="flex flex-col gap-3 md:flex-row md:items-center">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        value={data.search}
                                        onChange={(event) => setData('search', event.target.value)}
                                        placeholder={t('logs.exceptions.search_placeholder', 'Search message, URL or exception')}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button type="submit" className="cursor-pointer" style={{ height: '2.7em' }}>
                                    {t('common.search', 'Search')}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={clearSearch}
                                    className="cursor-pointer"
                                    style={{ height: '2.7em' }}
                                >
                                    {t('common.reset', 'Reset')}
                                </Button>
                            </div>
                        </form>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {statCards.map((stat) => (
                                <Card key={stat.label} className="border border-gray-200 shadow-sm">
                                    <CardContent className="py-4">
                                        <p className="text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader>
                        <CardTitle className="text-[#10B3D6]">
                            {t('logs.exceptions.table_title', 'Recent Exceptions')}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                            {t('logs.exceptions.table_subtitle', 'Newest entries appear first. Expand a row to view payload and stack trace.')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {logs.data.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <p className="text-gray-600">{t('logs.exceptions.no_results', 'No exceptions have been logged yet.')}</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {logs.data.map((log) => {
                                    const isOpen = openLog === log.id;

                                    return (
                                        <div key={log.id} className="rounded-lg border border-gray-200 bg-white shadow-sm">
                                            <div className="flex flex-col gap-2 p-4 md:flex-row md:items-center md:justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge className="bg-red-100 text-red-600">
                                                            {log.exception_class ?? 'Exception'}
                                                        </Badge>
                                                        {log.request_method && (
                                                            <Badge variant="outline" className="uppercase">
                                                                {log.request_method}
                                                            </Badge>
                                                        )}
                                                        <span className="text-xs text-gray-500">{formatDateTime(log.created_at)}</span>
                                                    </div>
                                                    <p className="font-semibold text-gray-900">{truncate(log.message)}</p>
                                                    {log.request_url && (
                                                        <p className="text-sm text-gray-600 break-all">{log.request_url}</p>
                                                    )}
                                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                        {log.file && (
                                                            <span>
                                                                {t('logs.exceptions.fields.location', 'Location')}: {log.file}{log.line ? `:${log.line}` : ''}
                                                            </span>
                                                        )}
                                                        <span>
                                                            {t('logs.exceptions.fields.user', 'User')}:{' '}
                                                            {log.user ? `${log.user.name} (${log.user.email})` : t('logs.exceptions.system_user', 'Guest / System')}
                                                        </span>
                                                        {log.ip_address && (
                                                            <span>
                                                                {t('logs.exceptions.fields.ip', 'IP Address')}: {log.ip_address}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {log.trace && (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="cursor-pointer"
                                                            onClick={() => copyTrace(log.trace)}
                                                            style={{ height: '2.5em' }}
                                                        >
                                                            <Clipboard className="h-4 w-4 mr-2" />
                                                            {t('logs.exceptions.copy_trace', 'Copy trace')}
                                                        </Button>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="cursor-pointer"
                                                        onClick={() => setOpenLog(isOpen ? null : log.id)}
                                                        style={{ height: '2.5em' }}
                                                    >
                                                        {isOpen ? (
                                                            <>
                                                                {t('logs.exceptions.hide_details', 'Hide details')}
                                                                <ChevronUp className="h-4 w-4 ml-2" />
                                                            </>
                                                        ) : (
                                                            <>
                                                                {t('logs.exceptions.view_details', 'View details')}
                                                                <ChevronDown className="h-4 w-4 ml-2" />
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                            {isOpen && (
                                                <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                                                    {log.request_payload && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-[#10B3D6] mb-2">
                                                                {t('logs.exceptions.fields.payload', 'Request Payload')}
                                                            </h4>
                                                            <pre className="overflow-x-auto rounded-md bg-white p-3 text-xs text-gray-800 border border-gray-200">
{JSON.stringify(log.request_payload, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                    {log.headers && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-[#10B3D6] mb-2">
                                                                {t('logs.exceptions.fields.headers', 'Request Headers')}
                                                            </h4>
                                                            <pre className="overflow-x-auto rounded-md bg-white p-3 text-xs text-gray-800 border border-gray-200">
{JSON.stringify(log.headers, null, 2)}
                                                            </pre>
                                                        </div>
                                                    )}
                                                    {log.trace && (
                                                        <div>
                                                            <h4 className="text-sm font-semibold text-[#10B3D6] mb-2">
                                                                {t('logs.exceptions.fields.trace', 'Stack trace')}
                                                            </h4>
                                                            <pre className="overflow-x-auto rounded-md bg-white p-3 text-xs text-gray-800 border border-gray-200 whitespace-pre-wrap">
{log.trace}
                                                            </pre>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {logs.last_page > 1 && (
                            <div className="flex flex-col gap-4 border-t border-gray-200 pt-4 md:flex-row md:items-center md:justify-between">
                                <div className="text-sm text-gray-600">
                                    {t('admin.common.showing', 'Showing')} {logs.from} - {logs.to} {t('admin.common.of', 'of')} {logs.total}
                                </div>
                                <div className="flex flex-wrap items-center gap-2">
                                    {logs.links.map((link, index) =>
                                        link.url ? (
                                            <Link
                                                key={index}
                                                href={link.url.includes('lang=') ? link.url : `${link.url}${link.url.includes('?') ? '&' : '?'}lang=${locale}`}
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
                                        ),
                                    )}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}


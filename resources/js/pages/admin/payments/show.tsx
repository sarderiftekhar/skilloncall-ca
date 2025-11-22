import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeft, CheckCircle, DollarSign, CreditCard, Clock, User, Briefcase } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface Payment {
    id: number;
    amount: number;
    commission_amount: number;
    net_amount: number;
    currency: string;
    status: string;
    type: string;
    payment_method: string;
    transaction_id: string;
    processed_at: string | null;
    processed_by: number | null;
    created_at: string;
    payer?: {
        id: number;
        name: string;
        email: string;
    };
    payee?: {
        id: number;
        name: string;
        email: string;
    };
    job?: {
        id: number;
        title: string;
    };
    processor?: {
        id: number;
        name: string;
    };
}

interface PaymentTimeline {
    status: string;
    timestamp: string;
    description: string;
}

interface ShowPaymentPageProps {
    payment: Payment;
    timeline: PaymentTimeline[];
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.payments.title', 'Payment Management'),
        href: `/admin/payments?lang=${locale}`,
    },
    {
        title: `#${t('admin.payments.show.title', 'Payment Details')}`,
        href: '#',
    },
];

export default function ShowPaymentPage({ payment, timeline }: ShowPaymentPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);

    const handleProcess = () => {
        if (confirm(t('admin.payments.show.confirm_process', 'Are you sure you want to process this payment?'))) {
            router.put(`/admin/payments/${payment.id}/process?lang=${locale}`, {}, {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-CA', {
            style: 'currency',
            currency: payment.currency || 'CAD',
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
            <Head title={t('admin.payments.show.title', 'Payment Details')}>
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
                                onClick={() => router.get(`/admin/payments?lang=${locale}`)}
                                style={{ height: '2.7em' }}
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                {t('admin.common.cancel', 'Back')}
                            </Button>
                            <div>
                                <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">
                                    {t('admin.payments.show.title', 'Payment Details')} #{payment.id}
                                </h1>
                                <p className="mt-1 text-lg leading-relaxed text-gray-600">
                                    <Badge className={getStatusColor(payment.status)} style={{ fontSize: '11px' }}>
                                        {t(`admin.statuses.${payment.status.toLowerCase()}`, payment.status)}
                                    </Badge>
                                </p>
                            </div>
                        </div>
                        {payment.status === 'pending' && (
                            <Button
                                className="text-white cursor-pointer"
                                onClick={handleProcess}
                                style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {t('admin.payments.show.process_payment', 'Process Payment')}
                            </Button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Payment Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.payments.show.payment_information', 'Payment Information')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.show.details.amount', 'Amount')}</p>
                                            <p className="text-default text-2xl font-bold">{formatCurrency(payment.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.show.details.commission', 'Commission')}</p>
                                            <p className="text-default text-xl font-semibold">{formatCurrency(payment.commission_amount || 0)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.show.details.net_amount', 'Net Amount')}</p>
                                            <p className="text-default text-xl font-semibold">{formatCurrency(payment.net_amount || payment.amount)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.show.details.currency', 'Currency')}</p>
                                            <p className="text-default font-medium">{payment.currency || 'CAD'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.show.details.status', 'Status')}</p>
                                            <Badge className={getStatusColor(payment.status)} style={{ fontSize: '11px', marginTop: '4px' }}>
                                                {t(`admin.statuses.${payment.status.toLowerCase()}`, payment.status)}
                                            </Badge>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">{t('admin.payments.show.details.type', 'Type')}</p>
                                            <p className="text-default font-medium">{payment.type || 'N/A'}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Payer Information */}
                            {payment.payer && (
                                <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                            {t('admin.payments.show.payer_information', 'Payer Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white"
                                                style={{ backgroundColor: '#10B3D6', width: '50px', height: '50px', fontSize: '20px' }}
                                            >
                                                {payment.payer.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </div>
                                            <div>
                                                <h3 className="text-default font-semibold">{payment.payer.name}</h3>
                                                <p className="text-gray-600 text-sm">{payment.payer.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Payee Information */}
                            {payment.payee && (
                                <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                            {t('admin.payments.show.payee_information', 'Payee Information')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="flex flex-shrink-0 items-center justify-center rounded-full font-semibold text-white"
                                                style={{ backgroundColor: '#10B3D6', width: '50px', height: '50px', fontSize: '20px' }}
                                            >
                                                {payment.payee.name
                                                    .split(' ')
                                                    .map((n) => n[0])
                                                    .join('')
                                                    .toUpperCase()
                                                    .slice(0, 2)}
                                            </div>
                                            <div>
                                                <h3 className="text-default font-semibold">{payment.payee.name}</h3>
                                                <p className="text-gray-600 text-sm">{payment.payee.email}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Transaction Details */}
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.payments.show.transaction_details', 'Transaction Details')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">{t('admin.payments.show.details.payment_method', 'Payment Method')}</span>
                                        <span className="text-default font-medium">{payment.payment_method || 'N/A'}</span>
                                    </div>
                                    {payment.transaction_id && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">{t('admin.payments.show.details.transaction_id', 'Transaction ID')}</span>
                                            <span className="text-default font-medium">{payment.transaction_id}</span>
                                        </div>
                                    )}
                                    {payment.processed_by && payment.processor && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">{t('admin.payments.show.details.processed_by', 'Processed By')}</span>
                                            <span className="text-default font-medium">{payment.processor.name}</span>
                                        </div>
                                    )}
                                    {payment.processed_at && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">{t('admin.payments.show.details.processed_at', 'Processed At')}</span>
                                            <span className="text-default font-medium">{formatDate(payment.processed_at)}</span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Timeline */}
                            {timeline && timeline.length > 0 && (
                                <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                            {t('admin.payments.show.timeline', 'Payment Timeline')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {timeline.map((item, index) => (
                                                <div key={index} className="flex items-start gap-3">
                                                    <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
                                                    <div className="flex-1">
                                                        <p className="text-default text-sm">{item.description}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{formatDate(item.timestamp)}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Actions Sidebar */}
                        <div className="space-y-6">
                            <Card className="card-with-border rounded-xl bg-white shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {t('admin.payments.show.actions', 'Actions')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {payment.status === 'pending' && (
                                        <Button
                                            className="w-full text-white cursor-pointer"
                                            onClick={handleProcess}
                                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            {t('admin.payments.show.process_payment', 'Process Payment')}
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}


import { Head, router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { type BreadcrumbItem } from '@/types';
import { Save, Settings } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import InputError from '@/components/input-error';
import { useState } from 'react';

interface SettingsData {
    general: {
        site_name: string;
        site_description: string;
        contact_email: string;
        timezone: string;
        maintenance_mode: boolean;
        registration_enabled: boolean;
        job_approval_required: boolean;
    };
    email: {
        smtp_host: string;
        smtp_port: number;
        smtp_username: string;
        smtp_encryption: string;
        from_address: string;
        from_name: string;
        notifications_enabled: boolean;
        welcome_email_enabled: boolean;
    };
    payment: {
        commission_rate: number;
        minimum_payout: number;
        payment_methods: string[];
        auto_payout_enabled: boolean;
        payout_schedule: string;
        currency: string;
    };
    security: {
        two_factor_enabled: boolean;
        password_min_length: number;
        password_require_special: boolean;
        session_timeout: number;
        max_login_attempts: number;
        lockout_duration: number;
    };
    features: {
        job_categories: string[];
        max_job_duration: number;
        max_applications_per_job: number;
        rating_system_enabled: boolean;
        messaging_enabled: boolean;
        file_upload_enabled: boolean;
        max_file_size: number;
    };
}

interface SettingsPageProps {
    settings: SettingsData;
}

const getBreadcrumbs = (t: (key: string, fallback?: string) => string, locale: string): BreadcrumbItem[] => [
    {
        title: t('admin.settings.title', 'System Settings'),
        href: `/admin/settings?lang=${locale}`,
    },
];

export default function SettingsPage({ settings }: SettingsPageProps) {
    const { t, locale } = useTranslations();
    const breadcrumbs = getBreadcrumbs(t, locale);
    const [activeTab, setActiveTab] = useState('general');

    const { data, setData, put, processing, errors } = useForm({
        general: settings.general || {},
        email: settings.email || {},
        payment: settings.payment || {},
        security: settings.security || {},
        features: settings.features || {},
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/settings?lang=${locale}`, {
            preserveScroll: true,
            onSuccess: () => {
                // Success handled by flash message
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={t('admin.settings.title', 'System Settings')}>
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer { cursor: pointer !important; }
                    .page-title { color: #192341 !important; }
                    .text-default { color: #192341 !important; }
                    .card-with-border { border-top: .5px solid #192341 !important; }
                `}</style>
            </Head>

            <div className="w-full px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="page-title text-2xl leading-tight font-bold md:text-3xl">{t('admin.settings.title', 'System Settings')}</h1>
                        <p className="mt-1 text-lg leading-relaxed text-gray-600">{t('admin.settings.subtitle', 'Configure platform settings')}</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Card className="card-with-border rounded-xl bg-white shadow-sm">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold page-title">
                                    {t('admin.settings.title', 'System Settings')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <TabsList className="grid w-full grid-cols-5 mb-6">
                                        <TabsTrigger value="general" className="cursor-pointer">
                                            {t('admin.settings.tabs.general', 'General')}
                                        </TabsTrigger>
                                        <TabsTrigger value="email" className="cursor-pointer">
                                            {t('admin.settings.tabs.email', 'Email')}
                                        </TabsTrigger>
                                        <TabsTrigger value="payment" className="cursor-pointer">
                                            {t('admin.settings.tabs.payment', 'Payment')}
                                        </TabsTrigger>
                                        <TabsTrigger value="security" className="cursor-pointer">
                                            {t('admin.settings.tabs.security', 'Security')}
                                        </TabsTrigger>
                                        <TabsTrigger value="features" className="cursor-pointer">
                                            {t('admin.settings.tabs.features', 'Features')}
                                        </TabsTrigger>
                                    </TabsList>

                                    {/* General Settings */}
                                    <TabsContent value="general" className="space-y-6">
                                        <div>
                                            <Label htmlFor="site_name" className="text-default">
                                                {t('admin.settings.general.site_name', 'Site Name')}
                                            </Label>
                                            <Input
                                                id="site_name"
                                                type="text"
                                                value={data.general.site_name || ''}
                                                onChange={(e) => setData('general', { ...data.general, site_name: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['general.site_name']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="site_description" className="text-default">
                                                {t('admin.settings.general.site_description', 'Site Description')}
                                            </Label>
                                            <Textarea
                                                id="site_description"
                                                value={data.general.site_description || ''}
                                                onChange={(e) => setData('general', { ...data.general, site_description: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                                rows={3}
                                            />
                                            <InputError message={errors['general.site_description']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="contact_email" className="text-default">
                                                {t('admin.settings.general.contact_email', 'Contact Email')}
                                            </Label>
                                            <Input
                                                id="contact_email"
                                                type="email"
                                                value={data.general.contact_email || ''}
                                                onChange={(e) => setData('general', { ...data.general, contact_email: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['general.contact_email']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="timezone" className="text-default">
                                                {t('admin.settings.general.timezone', 'Timezone')}
                                            </Label>
                                            <Input
                                                id="timezone"
                                                type="text"
                                                value={data.general.timezone || ''}
                                                onChange={(e) => setData('general', { ...data.general, timezone: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['general.timezone']} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="maintenance_mode" className="text-default">
                                                    {t('admin.settings.general.maintenance_mode', 'Maintenance Mode')}
                                                </Label>
                                                <p className="text-sm text-gray-600">{t('admin.settings.general.maintenance_mode_desc', 'Enable maintenance mode')}</p>
                                            </div>
                                            <Checkbox
                                                id="maintenance_mode"
                                                checked={data.general.maintenance_mode || false}
                                                onCheckedChange={(checked) => setData('general', { ...data.general, maintenance_mode: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="registration_enabled" className="text-default">
                                                    {t('admin.settings.general.registration_enabled', 'Registration Enabled')}
                                                </Label>
                                                <p className="text-sm text-gray-600">{t('admin.settings.general.registration_enabled_desc', 'Allow new user registrations')}</p>
                                            </div>
                                            <Checkbox
                                                id="registration_enabled"
                                                checked={data.general.registration_enabled !== false}
                                                onCheckedChange={(checked) => setData('general', { ...data.general, registration_enabled: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="job_approval_required" className="text-default">
                                                    {t('admin.settings.general.job_approval_required', 'Job Approval Required')}
                                                </Label>
                                                <p className="text-sm text-gray-600">{t('admin.settings.general.job_approval_required_desc', 'Require admin approval for jobs')}</p>
                                            </div>
                                            <Checkbox
                                                id="job_approval_required"
                                                checked={data.general.job_approval_required !== false}
                                                onCheckedChange={(checked) => setData('general', { ...data.general, job_approval_required: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </TabsContent>

                                    {/* Email Settings */}
                                    <TabsContent value="email" className="space-y-6">
                                        <div>
                                            <Label htmlFor="smtp_host" className="text-default">
                                                {t('admin.settings.email.smtp_host', 'SMTP Host')}
                                            </Label>
                                            <Input
                                                id="smtp_host"
                                                type="text"
                                                value={data.email.smtp_host || ''}
                                                onChange={(e) => setData('email', { ...data.email, smtp_host: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['email.smtp_host']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="smtp_port" className="text-default">
                                                {t('admin.settings.email.smtp_port', 'SMTP Port')}
                                            </Label>
                                            <Input
                                                id="smtp_port"
                                                type="number"
                                                value={data.email.smtp_port || ''}
                                                onChange={(e) => setData('email', { ...data.email, smtp_port: parseInt(e.target.value) || 0 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['email.smtp_port']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="smtp_username" className="text-default">
                                                {t('admin.settings.email.smtp_username', 'SMTP Username')}
                                            </Label>
                                            <Input
                                                id="smtp_username"
                                                type="text"
                                                value={data.email.smtp_username || ''}
                                                onChange={(e) => setData('email', { ...data.email, smtp_username: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['email.smtp_username']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="smtp_encryption" className="text-default">
                                                {t('admin.settings.email.smtp_encryption', 'SMTP Encryption')}
                                            </Label>
                                            <Select 
                                                value={data.email.smtp_encryption || 'tls'} 
                                                onValueChange={(value) => setData('email', { ...data.email, smtp_encryption: value })}
                                            >
                                                <SelectTrigger className="mt-1 cursor-pointer">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="tls" className="cursor-pointer">TLS</SelectItem>
                                                    <SelectItem value="ssl" className="cursor-pointer">SSL</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors['email.smtp_encryption']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="from_address" className="text-default">
                                                {t('admin.settings.email.from_address', 'From Address')}
                                            </Label>
                                            <Input
                                                id="from_address"
                                                type="email"
                                                value={data.email.from_address || ''}
                                                onChange={(e) => setData('email', { ...data.email, from_address: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['email.from_address']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="from_name" className="text-default">
                                                {t('admin.settings.email.from_name', 'From Name')}
                                            </Label>
                                            <Input
                                                id="from_name"
                                                type="text"
                                                value={data.email.from_name || ''}
                                                onChange={(e) => setData('email', { ...data.email, from_name: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['email.from_name']} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="notifications_enabled" className="text-default">
                                                    {t('admin.settings.email.notifications_enabled', 'Notifications Enabled')}
                                                </Label>
                                            </div>
                                            <Checkbox
                                                id="notifications_enabled"
                                                checked={data.email.notifications_enabled !== false}
                                                onCheckedChange={(checked) => setData('email', { ...data.email, notifications_enabled: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="welcome_email_enabled" className="text-default">
                                                    {t('admin.settings.email.welcome_email_enabled', 'Welcome Email Enabled')}
                                                </Label>
                                            </div>
                                            <Checkbox
                                                id="welcome_email_enabled"
                                                checked={data.email.welcome_email_enabled !== false}
                                                onCheckedChange={(checked) => setData('email', { ...data.email, welcome_email_enabled: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </TabsContent>

                                    {/* Payment Settings */}
                                    <TabsContent value="payment" className="space-y-6">
                                        <div>
                                            <Label htmlFor="commission_rate" className="text-default">
                                                {t('admin.settings.payment.commission_rate', 'Commission Rate (%)')}
                                            </Label>
                                            <Input
                                                id="commission_rate"
                                                type="number"
                                                step="0.01"
                                                value={data.payment.commission_rate || ''}
                                                onChange={(e) => setData('payment', { ...data.payment, commission_rate: parseFloat(e.target.value) || 0 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['payment.commission_rate']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="minimum_payout" className="text-default">
                                                {t('admin.settings.payment.minimum_payout', 'Minimum Payout')}
                                            </Label>
                                            <Input
                                                id="minimum_payout"
                                                type="number"
                                                step="0.01"
                                                value={data.payment.minimum_payout || ''}
                                                onChange={(e) => setData('payment', { ...data.payment, minimum_payout: parseFloat(e.target.value) || 0 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['payment.minimum_payout']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="payout_schedule" className="text-default">
                                                {t('admin.settings.payment.payout_schedule', 'Payout Schedule')}
                                            </Label>
                                            <Select 
                                                value={data.payment.payout_schedule || 'weekly'} 
                                                onValueChange={(value) => setData('payment', { ...data.payment, payout_schedule: value })}
                                            >
                                                <SelectTrigger className="mt-1 cursor-pointer">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="daily" className="cursor-pointer">{t('admin.settings.payment.daily', 'Daily')}</SelectItem>
                                                    <SelectItem value="weekly" className="cursor-pointer">{t('admin.settings.payment.weekly', 'Weekly')}</SelectItem>
                                                    <SelectItem value="monthly" className="cursor-pointer">{t('admin.settings.payment.monthly', 'Monthly')}</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <InputError message={errors['payment.payout_schedule']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="currency" className="text-default">
                                                {t('admin.settings.payment.currency', 'Currency')}
                                            </Label>
                                            <Input
                                                id="currency"
                                                type="text"
                                                value={data.payment.currency || 'CAD'}
                                                onChange={(e) => setData('payment', { ...data.payment, currency: e.target.value })}
                                                className="mt-1 cursor-pointer"
                                                maxLength={3}
                                            />
                                            <InputError message={errors['payment.currency']} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="auto_payout_enabled" className="text-default">
                                                    {t('admin.settings.payment.auto_payout_enabled', 'Auto Payout Enabled')}
                                                </Label>
                                            </div>
                                            <Checkbox
                                                id="auto_payout_enabled"
                                                checked={data.payment.auto_payout_enabled || false}
                                                onCheckedChange={(checked) => setData('payment', { ...data.payment, auto_payout_enabled: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </TabsContent>

                                    {/* Security Settings */}
                                    <TabsContent value="security" className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="two_factor_enabled" className="text-default">
                                                    {t('admin.settings.security.two_factor_enabled', 'Two-Factor Authentication')}
                                                </Label>
                                            </div>
                                            <Checkbox
                                                id="two_factor_enabled"
                                                checked={data.security.two_factor_enabled || false}
                                                onCheckedChange={(checked) => setData('security', { ...data.security, two_factor_enabled: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="password_min_length" className="text-default">
                                                {t('admin.settings.security.password_min_length', 'Password Min Length')}
                                            </Label>
                                            <Input
                                                id="password_min_length"
                                                type="number"
                                                value={data.security.password_min_length || 8}
                                                onChange={(e) => setData('security', { ...data.security, password_min_length: parseInt(e.target.value) || 8 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['security.password_min_length']} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="password_require_special" className="text-default">
                                                    {t('admin.settings.security.password_require_special', 'Require Special Characters')}
                                                </Label>
                                            </div>
                                            <Checkbox
                                                id="password_require_special"
                                                checked={data.security.password_require_special !== false}
                                                onCheckedChange={(checked) => setData('security', { ...data.security, password_require_special: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="session_timeout" className="text-default">
                                                {t('admin.settings.security.session_timeout', 'Session Timeout (minutes)')}
                                            </Label>
                                            <Input
                                                id="session_timeout"
                                                type="number"
                                                value={data.security.session_timeout || 120}
                                                onChange={(e) => setData('security', { ...data.security, session_timeout: parseInt(e.target.value) || 120 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['security.session_timeout']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="max_login_attempts" className="text-default">
                                                {t('admin.settings.security.max_login_attempts', 'Max Login Attempts')}
                                            </Label>
                                            <Input
                                                id="max_login_attempts"
                                                type="number"
                                                value={data.security.max_login_attempts || 5}
                                                onChange={(e) => setData('security', { ...data.security, max_login_attempts: parseInt(e.target.value) || 5 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['security.max_login_attempts']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="lockout_duration" className="text-default">
                                                {t('admin.settings.security.lockout_duration', 'Lockout Duration (minutes)')}
                                            </Label>
                                            <Input
                                                id="lockout_duration"
                                                type="number"
                                                value={data.security.lockout_duration || 15}
                                                onChange={(e) => setData('security', { ...data.security, lockout_duration: parseInt(e.target.value) || 15 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['security.lockout_duration']} />
                                        </div>
                                    </TabsContent>

                                    {/* Features Settings */}
                                    <TabsContent value="features" className="space-y-6">
                                        <div>
                                            <Label htmlFor="max_job_duration" className="text-default">
                                                {t('admin.settings.features.max_job_duration', 'Max Job Duration (days)')}
                                            </Label>
                                            <Input
                                                id="max_job_duration"
                                                type="number"
                                                value={data.features.max_job_duration || 365}
                                                onChange={(e) => setData('features', { ...data.features, max_job_duration: parseInt(e.target.value) || 365 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['features.max_job_duration']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="max_applications_per_job" className="text-default">
                                                {t('admin.settings.features.max_applications_per_job', 'Max Applications per Job')}
                                            </Label>
                                            <Input
                                                id="max_applications_per_job"
                                                type="number"
                                                value={data.features.max_applications_per_job || 100}
                                                onChange={(e) => setData('features', { ...data.features, max_applications_per_job: parseInt(e.target.value) || 100 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['features.max_applications_per_job']} />
                                        </div>

                                        <div>
                                            <Label htmlFor="max_file_size" className="text-default">
                                                {t('admin.settings.features.max_file_size', 'Max File Size (MB)')}
                                            </Label>
                                            <Input
                                                id="max_file_size"
                                                type="number"
                                                value={data.features.max_file_size || 10}
                                                onChange={(e) => setData('features', { ...data.features, max_file_size: parseInt(e.target.value) || 10 })}
                                                className="mt-1 cursor-pointer"
                                            />
                                            <InputError message={errors['features.max_file_size']} />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="rating_system_enabled" className="text-default">
                                                    {t('admin.settings.features.rating_system_enabled', 'Rating System Enabled')}
                                                </Label>
                                            </div>
                                            <Checkbox
                                                id="rating_system_enabled"
                                                checked={data.features.rating_system_enabled !== false}
                                                onCheckedChange={(checked) => setData('features', { ...data.features, rating_system_enabled: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="messaging_enabled" className="text-default">
                                                    {t('admin.settings.features.messaging_enabled', 'Messaging Enabled')}
                                                </Label>
                                            </div>
                                            <Checkbox
                                                id="messaging_enabled"
                                                checked={data.features.messaging_enabled !== false}
                                                onCheckedChange={(checked) => setData('features', { ...data.features, messaging_enabled: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <Label htmlFor="file_upload_enabled" className="text-default">
                                                    {t('admin.settings.features.file_upload_enabled', 'File Upload Enabled')}
                                                </Label>
                                            </div>
                                            <Checkbox
                                                id="file_upload_enabled"
                                                checked={data.features.file_upload_enabled !== false}
                                                onCheckedChange={(checked) => setData('features', { ...data.features, file_upload_enabled: checked })}
                                                className="cursor-pointer"
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="flex items-center gap-4 pt-6 border-t border-gray-200 mt-6">
                                    <Button
                                        type="submit"
                                        className="text-white cursor-pointer"
                                        disabled={processing}
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {t('admin.settings.save', 'Save Settings')}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}


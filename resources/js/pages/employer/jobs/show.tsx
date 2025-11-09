import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { type BreadcrumbItem } from '@/types';
import { Calendar, CheckCircle, Clipboard, DollarSign, FileText, MapPin, TrendingUp, UserCheck, Users } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import type { ReactNode } from 'react';

interface EmployerJobDetails {
    id: number;
    title: string;
    status: string;
    budget?: number | string | null;
    deadline?: string | null;
    required_skills?: string[] | null;
    location?: string | null;
    city?: string | null;
    province?: string | null;
    job_type?: string | null;
    experience_level?: string | null;
    description?: string | null;
    created_at?: string;
    published_at?: string | null;
    applications_count?: number;
    views_count?: number;
    payment_status?: string | null;
}

interface EmployerJobStats {
    totalApplications?: number;
    pendingApplications?: number;
    acceptedApplications?: number;
    rejectedApplications?: number;
    viewsCount?: number;
    averageRating?: number;
    totalReviews?: number;
}

interface RecentApplication {
    id: number;
    status: string;
    created_at?: string;
    employee?: {
        name?: string;
        email?: string;
    };
}

interface EmployerJobShowProps {
    job: {
        job: EmployerJobDetails;
        stats: EmployerJobStats;
        recentApplications: RecentApplication[];
    };
}

const statusLabels: Record<string, { en: string; fr: string; color: string }> = {
    active: { en: 'Active', fr: 'Actif', color: 'bg-green-100 text-green-800' },
    pending: { en: 'Pending', fr: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
    completed: { en: 'Completed', fr: 'Terminé', color: 'bg-blue-100 text-blue-800' },
    cancelled: { en: 'Cancelled', fr: 'Annulé', color: 'bg-red-100 text-red-800' },
    rejected: { en: 'Rejected', fr: 'Refusé', color: 'bg-red-100 text-red-800' },
    draft: { en: 'Draft', fr: 'Brouillon', color: 'bg-gray-100 text-gray-800' },
};

const jobTypeLabels: Record<string, { en: string; fr: string }> = {
    full_time: { en: 'Full-time', fr: 'Temps plein' },
    part_time: { en: 'Part-time', fr: 'Temps partiel' },
    contract: { en: 'Contract', fr: 'Contrat' },
    freelance: { en: 'Freelance', fr: 'Freelance' },
};

const experienceLabels: Record<string, { en: string; fr: string }> = {
    entry: { en: 'Entry level', fr: 'Débutant' },
    intermediate: { en: 'Intermediate', fr: 'Intermédiaire' },
    expert: { en: 'Expert', fr: 'Expert' },
};

function formatCurrency(amount: number | string | null | undefined, locale: string) {
    if (amount === null || amount === undefined || amount === '') {
        return '—';
    }

    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

    if (isNaN(Number(numericAmount))) {
        return '—';
    }

    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
        style: 'currency',
        currency: 'CAD',
    }).format(Number(numericAmount));
}

function formatDate(value: string | null | undefined, locale: string) {
    if (!value) {
        return '—';
    }

    try {
        return new Date(value).toLocaleDateString(locale === 'fr' ? 'fr-CA' : 'en-CA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    } catch (error) {
        return value;
    }
}

const copyByLocale = {
    en: {
        pageTitle: 'Job Details',
        pageSubtitle: 'Review the key information, performance and recent activity for this posting.',
        summaryTitle: 'Overview',
        statusLabel: 'Status',
        budgetLabel: 'Budget',
        deadlineLabel: 'Deadline',
        postedLabel: 'Posted on',
        descriptionTitle: 'Position Description',
        detailsTitle: 'Role Details',
        jobTypeLabel: 'Job type',
        experienceLabel: 'Experience level',
        locationLabel: 'Location',
        skillsTitle: 'Required Skills',
        noSkills: 'No skills specified for this job yet.',
        statsTitle: 'Performance',
        totalApplications: 'Total applications',
        pendingApplications: 'Pending review',
        acceptedApplications: 'Accepted',
        rejectedApplications: 'Rejected',
        viewsCount: 'Views',
        averageRating: 'Average rating',
        totalReviews: 'Reviews received',
        applicationsTitle: 'Recent Applications',
        noApplications: 'No applications have been received for this job yet.',
        viewApplication: 'View Application',
        manageJob: 'Manage Job',
        editJob: 'Edit Job',
        backToJobs: 'Back to Listings',
    },
    fr: {
        pageTitle: "Détails de l'offre",
        pageSubtitle: "Consultez les informations clés, la performance et l'activité récente de cette offre.",
        summaryTitle: 'Aperçu',
        statusLabel: 'Statut',
        budgetLabel: 'Budget',
        deadlineLabel: 'Date limite',
        postedLabel: 'Publié le',
        descriptionTitle: 'Description du poste',
        detailsTitle: 'Détails du rôle',
        jobTypeLabel: "Type d'emploi",
        experienceLabel: "Niveau d'expérience",
        locationLabel: 'Lieu',
        skillsTitle: 'Compétences requises',
        noSkills: "Aucune compétence n'a encore été précisée pour ce poste.",
        statsTitle: 'Performance',
        totalApplications: 'Candidatures totales',
        pendingApplications: 'En attente de revue',
        acceptedApplications: 'Acceptées',
        rejectedApplications: 'Refusées',
        viewsCount: 'Vues',
        averageRating: 'Note moyenne',
        totalReviews: 'Avis reçus',
        applicationsTitle: 'Candidatures récentes',
        noApplications: "Aucune candidature n'a encore été reçue pour ce poste.",
        viewApplication: 'Voir la candidature',
        manageJob: 'Gérer le poste',
        editJob: 'Modifier le poste',
        backToJobs: "Retour aux offres",
    },
};

export default function EmployerJobShow({ job }: EmployerJobShowProps) {
    const { locale } = useTranslations();
    const details = (job?.job ?? {}) as EmployerJobDetails;
    const stats = (job?.stats ?? {}) as EmployerJobStats;
    const recentApplications = Array.isArray(job?.recentApplications) ? job.recentApplications : [];
    const copy = copyByLocale[locale === 'fr' ? 'fr' : 'en'];

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: locale === 'fr' ? 'Tableau de bord employeur' : 'Employer Dashboard',
            href: locale ? `/employer/dashboard?lang=${locale}` : '/employer/dashboard',
        },
        {
            title: locale === 'fr' ? "Offres d'emploi" : 'Job Postings',
            href: locale ? `/employer/jobs?lang=${locale}` : '/employer/jobs',
        },
        {
            title: details?.title || copy.pageTitle,
            href: '#',
        },
    ];

    const appendLangParam = (path: string) => {
        if (!locale) {
            return path;
        }

        return path.includes('?') ? `${path}&lang=${locale}` : `${path}?lang=${locale}`;
    };

    const statusMeta = statusLabels[details?.status ?? ''] || {
        en: details?.status ?? '—',
        fr: details?.status ?? '—',
        color: 'bg-gray-100 text-gray-800',
    };

    const displayStatus = locale === 'fr' ? statusMeta.fr : statusMeta.en;
    const locationValue = details?.location || [details?.city, details?.province].filter(Boolean).join(', ');

    const roundedAverageRating = typeof stats?.averageRating === 'number' ? stats.averageRating.toFixed(1) : '—';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${details?.title || copy.pageTitle} | SkillOnCall`} />

            <div className="py-6 sm:py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h1
                                className="text-2xl md:text-3xl font-bold leading-tight"
                                style={{ color: '#192341' }}
                            >
                                {details?.title || copy.pageTitle}
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-2">
                                {copy.pageSubtitle}
                            </p>
                        </div>

                        <Card className="bg-white rounded-xl shadow-sm">
                            <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-6">
                                <div className="flex flex-col gap-3">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge className={`${statusMeta.color} uppercase tracking-wide text-xs font-semibold`}> {displayStatus} </Badge>
                                        {details?.published_at && (
                                            <span className="flex items-center text-xs sm:text-sm text-gray-500">
                                                <CheckCircle className="h-4 w-4 mr-1" style={{ color: '#10B3D6' }} />
                                                {locale === 'fr' ? 'Publié' : 'Published'}
                                                <span className="ml-1">
                                                    {formatDate(details.published_at, locale)}
                                                </span>
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{copy.budgetLabel}</p>
                                                <p className="text-base font-semibold" style={{ color: '#192341' }}>
                                                    {formatCurrency(details?.budget ?? null, locale)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{copy.deadlineLabel}</p>
                                                <p className="text-base font-semibold" style={{ color: '#192341' }}>
                                                    {formatDate(details?.deadline ?? null, locale)}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clipboard className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">{copy.postedLabel}</p>
                                                <p className="text-base font-semibold" style={{ color: '#192341' }}>
                                                    {formatDate(details?.created_at ?? null, locale)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:items-end gap-2">
                                    <Button
                                        className="text-white font-semibold"
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        onClick={() => window.location.href = appendLangParam(`/employer/jobs/${details?.id}/edit`)}
                                    >
                                        {copy.editJob}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        style={{ height: '2.7em' }}
                                        onClick={() => window.location.href = appendLangParam('/employer/jobs')}
                                    >
                                        {copy.backToJobs}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-white rounded-xl shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {copy.descriptionTitle}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600">
                                        {locale === 'fr'
                                            ? "Présentez clairement les responsabilités et attentes pour attirer les bons talents."
                                            : 'Clearly outline responsibilities and expectations to attract the right talent.'}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {details?.description ? (
                                        <div className="prose prose-sm sm:prose-base max-w-none text-gray-700" style={{ color: '#192341' }}>
                                            <p>{details.description}</p>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {locale === 'fr'
                                                ? "Aucune description détaillée n'a encore été fournie pour ce poste."
                                                : 'No detailed description has been provided for this job yet.'}
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="bg-white rounded-xl shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {copy.detailsTitle}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <DetailItem
                                            icon={<Users className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                            label={copy.jobTypeLabel}
                                            value={details?.job_type && jobTypeLabels[details.job_type]
                                                ? (locale === 'fr' ? jobTypeLabels[details.job_type].fr : jobTypeLabels[details.job_type].en)
                                                : '—'}
                                        />
                                        <DetailItem
                                            icon={<UserCheck className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                            label={copy.experienceLabel}
                                            value={details?.experience_level && experienceLabels[details.experience_level]
                                                ? (locale === 'fr' ? experienceLabels[details.experience_level].fr : experienceLabels[details.experience_level].en)
                                                : '—'}
                                        />
                                        <DetailItem
                                            icon={<MapPin className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                            label={copy.locationLabel}
                                            value={locationValue || '—'}
                                        />
                                        <DetailItem
                                            icon={<TrendingUp className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                            label={locale === 'fr' ? 'Statut de paiement' : 'Payment Status'}
                                            value={details?.payment_status
                                                ? locale === 'fr'
                                                    ? details.payment_status === 'completed' ? 'Payé' : 'En attente'
                                                    : (details.payment_status === 'completed' ? 'Completed' : 'Pending')
                                                : '—'}
                                        />
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-semibold mb-3" style={{ color: '#10B3D6' }}>
                                            {copy.skillsTitle}
                                        </h3>
                                        {Array.isArray(details?.required_skills) && details.required_skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {details.required_skills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="px-3 py-1 rounded-full text-xs font-medium"
                                                        style={{ backgroundColor: '#F6FBFD', color: '#192341' }}
                                                    >
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500">{copy.noSkills}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card className="bg-white rounded-xl shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {copy.statsTitle}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <StatRow
                                        icon={<Users className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                        label={copy.totalApplications}
                                        value={stats?.totalApplications ?? details?.applications_count ?? 0}
                                    />
                                    <StatRow
                                        icon={<Clipboard className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                        label={copy.pendingApplications}
                                        value={stats?.pendingApplications ?? 0}
                                    />
                                    <StatRow
                                        icon={<CheckCircle className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                        label={copy.acceptedApplications}
                                        value={stats?.acceptedApplications ?? 0}
                                    />
                                    <StatRow
                                        icon={<FileText className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                        label={copy.rejectedApplications}
                                        value={stats?.rejectedApplications ?? 0}
                                    />
                                    <StatRow
                                        icon={<TrendingUp className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                        label={copy.viewsCount}
                                        value={stats?.viewsCount ?? details?.views_count ?? 0}
                                    />
                                    <StatRow
                                        icon={<StarIcon />}
                                        label={copy.averageRating}
                                        value={roundedAverageRating}
                                    />
                                    <StatRow
                                        icon={<FileText className="h-5 w-5" style={{ color: '#10B3D6' }} />}
                                        label={copy.totalReviews}
                                        value={stats?.totalReviews ?? 0}
                                    />
                                </CardContent>
                            </Card>

                            <Card className="bg-white rounded-xl shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold" style={{ color: '#10B3D6' }}>
                                        {copy.applicationsTitle}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {recentApplications.length > 0 ? (
                                        recentApplications.map((application) => {
                                            const applicantName = application.employee?.name || application.employee?.email || '—';
                                            const applicationStatusMeta = statusLabels[application.status] || {
                                                en: application.status,
                                                fr: application.status,
                                                color: 'bg-gray-100 text-gray-800',
                                            };

                                            return (
                                                <div
                                                    key={application.id}
                                                    className="p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                                    style={{ backgroundColor: '#FDF7F5' }}
                                                    onClick={() => window.location.href = appendLangParam(`/employer/applications/${application.id}`)}
                                                >
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex items-center justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-semibold" style={{ color: '#192341' }}>
                                                                    {applicantName}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    {formatDate(application.created_at ?? null, locale)}
                                                                </p>
                                                            </div>
                                                            <Badge className={`${applicationStatusMeta.color} uppercase tracking-wide text-xs font-semibold`}>
                                                                {locale === 'fr' ? applicationStatusMeta.fr : applicationStatusMeta.en}
                                                            </Badge>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            className="self-start cursor-pointer"
                                                            style={{ height: '2.7em' }}
                                                            onClick={(event) => {
                                                                event.stopPropagation();
                                                                window.location.href = appendLangParam(`/employer/applications/${application.id}`);
                                                            }}
                                                        >
                                                            {copy.viewApplication}
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            {copy.noApplications}
                                        </p>
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

interface DetailItemProps {
    icon: ReactNode;
    label: string;
    value: string | number | null | undefined;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg" style={{ backgroundColor: '#F6FBFD' }}>
            <div className="mt-1">
                {icon}
            </div>
            <div>
                <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
                <p className="text-sm font-medium" style={{ color: '#192341' }}>
                    {value ?? '—'}
                </p>
            </div>
        </div>
    );
}

interface StatRowProps {
    icon: ReactNode;
    label: string;
    value: number | string;
}

function StatRow({ icon, label, value }: StatRowProps) {
    return (
        <div className="flex items-center justify-between gap-4 p-3 rounded-lg" style={{ backgroundColor: '#F6FBFD' }}>
            <div className="flex items-center gap-3">
                {icon}
                <span className="text-sm font-medium" style={{ color: '#192341' }}>{label}</span>
            </div>
            <span className="text-base font-semibold" style={{ color: '#10B3D6' }}>{value}</span>
        </div>
    );
}

function StarIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            style={{ color: '#10B3D6' }}
        >
            <polygon points="12 2 15 8.5 22 9.3 17 14.1 18.5 21.1 12 17.8 5.5 21.1 7 14.1 2 9.3 9 8.5 12 2"></polygon>
        </svg>
    );
}


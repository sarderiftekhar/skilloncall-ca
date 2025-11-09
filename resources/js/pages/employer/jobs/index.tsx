import { Head, Link, router, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { type FormEvent, useMemo, useState, useEffect, useCallback } from 'react'
import { useTranslations } from '@/hooks/useTranslations'
import {
    Briefcase,
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    DollarSign,
    Edit,
    Eye,
    MapPin,
    PauseCircle,
    PlusCircle,
    Search as SearchIcon,
    Trash2,
    Upload,
} from 'react-feather'

type JobSummary = {
    id: number
    title: string
    status: string
    category?: string | null
    budget?: number | string | null
    job_type?: string | null
    experience_level?: string | null
    location?: string | null
    province?: string | null
    city?: string | null
    published_at?: string | null
    created_at?: string
    updated_at?: string
    applications_count?: number
}

type PaginatedJobs = {
    data: JobSummary[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
}

type ManageJobsPageProps = {
    jobs: PaginatedJobs
    filters?: {
        search?: string
        status?: string
        category?: string
    }
    categories?: Record<string, string>
    [key: string]: unknown
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    draft: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
    active: { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' },
    closed: { bg: '#F3F4F6', text: '#374151', border: '#D1D5DB' },
    archived: { bg: '#F9FAFB', text: '#6B7280', border: '#E5E7EB' },
    pending: { bg: '#FEF3C7', text: '#92400E', border: '#FCD34D' },
    unpublished: { bg: '#F3F4F6', text: '#4B5563', border: '#D1D5DB' },
}

function formatJobType(jobType: string | null | undefined) {
    if (!jobType) return '-'
    return jobType
        .split('_')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')
}

function formatCurrency(value: number | string | null | undefined, locale: string) {
    if (value === null || value === undefined || value === '') {
        return locale === 'fr' ? 'Non défini' : 'Not set'
    }

    const parsed = typeof value === 'string' ? Number(value) : value

    if (Number.isNaN(parsed)) {
        return locale === 'fr' ? 'Non défini' : 'Not set'
    }

    return new Intl.NumberFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
        style: 'currency',
        currency: 'CAD',
        minimumFractionDigits: parsed % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(parsed)
}

function formatLocaleDate(value: string | null | undefined, locale: string) {
    if (!value) return locale === 'fr' ? 'Non publié' : 'Not published'

    try {
        return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-CA' : 'en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(new Date(value))
    } catch {
        return value
    }
}

function formatApplications(count: number | undefined, locale: string) {
    const total = count ?? 0
    if (locale === 'fr') {
        return total === 1 ? '1 candidature' : `${total} candidatures`
    }
    return total === 1 ? '1 application' : `${total} applications`
}

function buildFiltersQuery(
    locale: string,
    search: string,
    status: string,
    category: string,
    page?: number
) {
    const query: Record<string, string> = { lang: locale }

    if (search.trim().length) {
        query.search = search.trim()
    }

    if (status !== 'all') {
        query.status = status
    }

    if (category !== 'all') {
        query.category = category
    }

    if (page && page > 1) {
        query.page = String(page)
    }

    return query
}

export default function ManageJobsPage() {
    const { t, locale } = useTranslations()
    const { jobs, filters = {}, categories = {} } = usePage<ManageJobsPageProps>().props

    const [searchTerm, setSearchTerm] = useState(filters.search ?? '')
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all')
    const [categoryFilter, setCategoryFilter] = useState(filters.category ?? 'all')
    const [processingJobId, setProcessingJobId] = useState<number | null>(null)
    const [processingAction, setProcessingAction] = useState<string | null>(null)

    const statusOptions = useMemo(
        () => [
            { value: 'all', label: t('jobs.manage.status_all', 'All statuses') },
            { value: 'draft', label: t('jobs.status.draft', 'Draft') },
            { value: 'active', label: t('jobs.status.active', 'Active') },
            { value: 'pending', label: t('jobs.status.pending', 'Pending Approval') },
            { value: 'closed', label: t('jobs.status.closed', 'Closed') },
            { value: 'archived', label: t('jobs.status.archived', 'Archived') },
        ],
        [t]
    )

    const categoryOptions = useMemo(() => {
        const entries = Object.entries(categories || {})
        return [
            { value: 'all', label: t('jobs.manage.category_all', 'All categories') },
            ...entries.map(([value, label]) => ({
                value,
                label: t(`jobs.categories.${value}`, label),
            })),
        ]
    }, [categories, t])

    const stats = useMemo(() => {
        const base = {
            total: jobs?.total ?? 0,
            active: 0,
            draft: 0,
            closed: 0,
        }

        if (!jobs?.data?.length) {
            return base
        }

        jobs.data.forEach(job => {
            const status = (job.status || '').toLowerCase()

            if (status === 'active') {
                base.active += 1
            } else if (status === 'draft' || status === 'unpublished') {
                base.draft += 1
            } else if (status === 'closed' || status === 'archived') {
                base.closed += 1
            }
        })

        return base
    }, [jobs])

    const handleApplyFilters = useCallback((event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault()
        }

        router.get('/employer/jobs', buildFiltersQuery(locale, searchTerm, statusFilter, categoryFilter), {
            preserveScroll: true,
            preserveState: true,
        })
    }, [locale, searchTerm, statusFilter, categoryFilter])

    useEffect(() => {
        if (filters.status !== statusFilter || filters.category !== categoryFilter) {
            handleApplyFilters();
        }
    }, [statusFilter, categoryFilter, filters.status, filters.category, handleApplyFilters]);

    const handleResetFilters = () => {
        setSearchTerm('')
        setStatusFilter('all')
        setCategoryFilter('all')

        router.get('/employer/jobs', { lang: locale }, {
            preserveScroll: true,
        })
    }

    const handlePageChange = (page: number) => {
        router.get('/employer/jobs', buildFiltersQuery(locale, searchTerm, statusFilter, categoryFilter, page), {
            preserveScroll: true,
            preserveState: true,
        })
    }

    const handlePublishToggle = (jobId: number, shouldPublish: boolean) => {
        setProcessingJobId(jobId)
        setProcessingAction(shouldPublish ? 'publish' : 'unpublish')

        const actionPath = shouldPublish ? 'publish' : 'unpublish'

        router.visit(`/employer/jobs/${jobId}/${actionPath}?lang=${locale}`, {
            method: 'put',
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setProcessingJobId(null)
                setProcessingAction(null)
            },
        })
    }

    const handleDelete = (jobId: number) => {
        const confirmed = window.confirm(
            t(
                'jobs.manage.confirm_delete',
                'Are you sure you want to delete this job? This action cannot be undone.'
            )
        )

        if (!confirmed) {
            return
        }

        setProcessingJobId(jobId)
        setProcessingAction('delete')

        router.visit(`/employer/jobs/${jobId}?lang=${locale}`, {
            method: 'delete',
            preserveScroll: true,
            preserveState: true,
            onFinish: () => {
                setProcessingJobId(null)
                setProcessingAction(null)
            },
        })
    }

    const renderStatusBadge = (status: string) => {
        const normalized = status?.toLowerCase?.() || 'draft'
        const styles = statusColors[normalized] || statusColors.draft

        return (
            <Badge
                variant="outline"
                className="px-3 py-1 rounded-full text-xs font-semibold border"
                style={{
                    backgroundColor: styles.bg,
                    color: styles.text,
                    borderColor: styles.border,
                }}
            >
                {t(`jobs.status.${normalized}`, normalized.charAt(0).toUpperCase() + normalized.slice(1))}
            </Badge>
        )
    }

    const getCategoryLabel = (category: string | null | undefined) => {
        if (!category) return null
        return t(`jobs.categories.${category}`, categories?.[category] ?? category)
    }

    const isProcessing = (jobId: number, action: string) => {
        return processingJobId === jobId && processingAction === action
    }

    return (
        <AppLayout>
            <Head title={t('jobs.manage.title', 'Manage Jobs')}>
                <style>{`
                    .job-title {
                        color: #192341;
                    }

                    .card-title-colored {
                        color: #10B3D6;
                    }
                `}</style>
            </Head>

            <div className="w-full px-4 py-6 md:px-6 md:py-8">
                <div className="mx-auto w-full max-w-6xl">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold leading-tight job-title md:text-3xl">
                                {t('jobs.manage.title', 'Manage Jobs')}
                            </h1>
                            <p className="text-base text-gray-600">
                                {t(
                                    'jobs.manage.subtitle',
                                    'Track and optimize your job postings in one place.'
                                )}
                            </p>
                        </div>

                        <Button
                            asChild
                            className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition hover:opacity-95 cursor-pointer"
                            style={{ backgroundColor: '#10B3D6', color: '#FFFFFF' }}
                        >
                            <Link href={`/employer/jobs/create?lang=${locale}`}>
                                <PlusCircle className="h-4 w-4" />
                                {t('jobs.manage.create_job', 'Post New Job')}
                            </Link>
                        </Button>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Card className="border border-[#10B3D6] shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wide card-title-colored">
                                    {t('jobs.manage.stats.total', 'Total Jobs')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-[#192341]">{stats.total}</p>
                                <p className="text-xs text-gray-500">
                                    {t('jobs.manage.total_helper', 'Across all statuses')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-[#10B3D6] shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wide card-title-colored">
                                    {t('jobs.manage.stats.active', 'Active Jobs')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-[#192341]">{stats.active}</p>
                                <p className="text-xs text-gray-500">
                                    {t('jobs.manage.active_helper', 'Visible to candidates')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-[#10B3D6] shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wide card-title-colored">
                                    {t('jobs.manage.stats.draft', 'Draft Jobs')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-[#192341]">{stats.draft}</p>
                                <p className="text-xs text-gray-500">
                                    {t('jobs.manage.draft_helper', 'Ready to publish')}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border border-[#10B3D6] shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-semibold uppercase tracking-wide card-title-colored">
                                    {t('jobs.manage.stats.closed', 'Closed Jobs')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold text-[#192341]">{stats.closed}</p>
                                <p className="text-xs text-gray-500">
                                    {t('jobs.manage.closed_helper', 'No longer accepting applications')}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="mt-6 border border-[#10B3D6] shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-semibold card-title-colored">
                                {t('jobs.manage.filters_title', 'Filters')}
                            </CardTitle>
                            <p className="text-sm text-gray-500">
                                {t('jobs.manage.filters_hint', 'Fine-tune your job listings with quick filters.')}
                            </p>
                        </CardHeader>
                        <CardContent>
                            <form
                                onSubmit={handleApplyFilters}
                                className="flex flex-col gap-4 lg:flex-row lg:items-end"
                            >
                                <div className="flex-1">
                                    <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="job-search">
                                        {t('jobs.manage.search_label', 'Search jobs')}
                                    </label>
                                    <div className="relative">
                                        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="job-search"
                                            value={searchTerm}
                                            onChange={event => setSearchTerm(event.target.value)}
                                            placeholder={t(
                                                'jobs.manage.search_placeholder',
                                                'Search by title or description'
                                            )}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {t('jobs.manage.status_label', 'Status')}
                                        </label>
                                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue
                                                    placeholder={t(
                                                        'jobs.manage.status_all',
                                                        'All statuses'
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statusOptions.map(option => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="cursor-pointer"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-medium text-gray-700">
                                            {t('jobs.manage.category_label', 'Category')}
                                        </label>
                                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                            <SelectTrigger className="w-full cursor-pointer">
                                                <SelectValue
                                                    placeholder={t(
                                                        'jobs.manage.category_all',
                                                        'All categories'
                                                    )}
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categoryOptions.map(option => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                        className="cursor-pointer"
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleResetFilters}
                                        className="cursor-pointer"
                                    >
                                        {t('jobs.manage.clear_filters', 'Clear filters')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="cursor-pointer"
                                        style={{ backgroundColor: '#10B3D6', color: '#FFFFFF' }}
                                    >
                                        {t('jobs.manage.apply_filters', 'Apply filters')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <div className="mt-6 space-y-4">
                        {jobs?.data?.length ? (
                            jobs.data.map(job => (
                                <Card key={job.id} className="border border-[#10B3D6]/30 shadow-sm">
                                    <CardContent className="flex flex-col gap-4 p-5">
                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                            <div className="flex-1">
                                                <div className="flex flex-col gap-2">
                                                    <h2 className="text-lg font-semibold" style={{ color: '#192341' }}>
                                                        {job.title}
                                                    </h2>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                                                        {(job.location || job.city || job.province) && (
                                                            <span className="flex items-center gap-2">
                                                                <MapPin className="h-4 w-4" style={{ color: '#10B3D6' }} />
                                                                <span className="truncate">
                                                                    {job.location || [job.city, job.province].filter(Boolean).join(', ')}
                                                                </span>
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-2">
                                                            <DollarSign className="h-4 w-4" style={{ color: '#10B3D6' }} />
                                                            <span className="font-semibold text-[#192341]">
                                                                {formatCurrency(job.budget, locale)}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {t('jobs.manage.per_hour', 'per hour')}
                                                            </span>
                                                        </span>
                                                        {job.job_type && (
                                                            <span className="flex items-center gap-2">
                                                                <Clock className="h-4 w-4" style={{ color: '#10B3D6' }} />
                                                                <span className="capitalize text-gray-600">
                                                                    {formatJobType(job.job_type)}
                                                                </span>
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {renderStatusBadge(job.status)}
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Briefcase className="h-3 w-3" />
                                                {formatApplications(job.applications_count, locale)}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {t('jobs.manage.posted_on', 'Posted on')} {formatLocaleDate(job.published_at || job.created_at, locale)}
                                            </span>
                                            {getCategoryLabel(job.category) && (
                                                <span className="flex items-center gap-1">
                                                    <Badge
                                                        variant="outline"
                                                        className="rounded-full border px-3 py-1 text-xs font-medium"
                                                        style={{ borderColor: '#10B3D6', color: '#10B3D6' }}
                                                    >
                                                        {getCategoryLabel(job.category)}
                                                    </Badge>
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3 border-t border-dashed border-gray-200 pt-3 md:flex-row md:items-center md:justify-between">
                                            <p className="text-sm text-gray-500">
                                                {t(
                                                    'jobs.manage.last_updated',
                                                    'Last updated'
                                                )}{' '}
                                                {formatLocaleDate(job.updated_at || job.created_at, locale)}
                                            </p>

                                            <div className="flex flex-wrap gap-2">
                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                >
                                                    <Link href={`/employer/jobs/${job.id}?lang=${locale}`} className="inline-flex items-center gap-2">
                                                        <Eye className="h-4 w-4" />
                                                        {t('jobs.manage.view', 'View')}
                                                    </Link>
                                                </Button>

                                                <Button
                                                    asChild
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                >
                                                    <Link href={`/employer/jobs/${job.id}/edit?lang=${locale}`} className="inline-flex items-center gap-2">
                                                        <Edit className="h-4 w-4" />
                                                        {t('jobs.manage.edit', 'Edit')}
                                                    </Link>
                                                </Button>

                                                {job.status === 'active' ? (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => handlePublishToggle(job.id, false)}
                                                        disabled={isProcessing(job.id, 'unpublish')}
                                                        className="cursor-pointer"
                                                    >
                                                        <PauseCircle className="mr-2 h-4 w-4" />
                                                        {isProcessing(job.id, 'unpublish')
                                                            ? t('jobs.manage.processing', 'Processing...')
                                                            : t('jobs.manage.unpublish', 'Unpublish')}
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        type="button"
                                                        onClick={() => handlePublishToggle(job.id, true)}
                                                        disabled={isProcessing(job.id, 'publish')}
                                                        className="cursor-pointer"
                                                        style={{ backgroundColor: '#10B3D6', color: '#FFFFFF' }}
                                                    >
                                                        <Upload className="mr-2 h-4 w-4" />
                                                        {isProcessing(job.id, 'publish')
                                                            ? t('jobs.manage.processing', 'Processing...')
                                                            : t('jobs.manage.publish', 'Publish')}
                                                    </Button>
                                                )}

                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={() => handleDelete(job.id)}
                                                    disabled={isProcessing(job.id, 'delete')}
                                                    className="cursor-pointer"
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    {isProcessing(job.id, 'delete')
                                                        ? t('jobs.manage.processing', 'Processing...')
                                                        : t('jobs.manage.delete', 'Delete')}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card className="border border-dashed border-[#10B3D6]">
                                <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
                                    <Briefcase className="h-10 w-10 text-[#10B3D6]" />
                                    <h3 className="text-lg font-semibold" style={{ color: '#192341' }}>
                                        {t('jobs.manage.no_jobs', 'No jobs yet')}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {t(
                                            'jobs.manage.no_jobs_description',
                                            'Start by creating a new job posting to see it listed here.'
                                        )}
                                    </p>
                                    <Button
                                        asChild
                                        className="cursor-pointer"
                                        style={{ backgroundColor: '#10B3D6', color: '#FFFFFF' }}
                                    >
                                        <Link href={`/employer/jobs/create?lang=${locale}`} className="inline-flex items-center gap-2">
                                            <PlusCircle className="h-4 w-4" />
                                            {t('jobs.manage.empty_state_action', 'Create a job')}
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {jobs?.last_page > 1 && (
                        <div className="mt-6 flex flex-col gap-3 rounded-lg border border-gray-200 bg-white px-4 py-4 text-sm text-gray-600 md:flex-row md:items-center md:justify-between">
                            <div>
                                {t('jobs.manage.pagination_summary', 'Showing')} {jobs.from} {t('jobs.manage.to', 'to')} {jobs.to}{' '}
                                {t('jobs.manage.of', 'of')} {jobs.total} {t('jobs.manage.results', 'results')}
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={jobs.current_page === 1}
                                    onClick={() => handlePageChange(jobs.current_page - 1)}
                                    className="cursor-pointer"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center gap-1">
                                    {Array.from({
                                        length: Math.min(jobs.last_page, 5),
                                    }).map((_, index) => {
                                        const page = index + 1
                                        const isActive = jobs.current_page === page

                                        return (
                                            <Button
                                                key={page}
                                                variant={isActive ? 'default' : 'outline'}
                                                size="sm"
                                                onClick={() => handlePageChange(page)}
                                                className="cursor-pointer"
                                                style={
                                                    isActive
                                                        ? { backgroundColor: '#10B3D6', color: '#FFFFFF' }
                                                        : undefined
                                                }
                                            >
                                                {page}
                                            </Button>
                                        )
                                    })}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={jobs.current_page === jobs.last_page}
                                    onClick={() => handlePageChange(jobs.current_page + 1)}
                                    className="cursor-pointer"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}


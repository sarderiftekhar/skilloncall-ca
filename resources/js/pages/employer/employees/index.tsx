import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Head, Link, router } from '@inertiajs/react'

import AppLayout from '@/layouts/app-layout'
import { useTranslations } from '@/hooks/useTranslations'

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

import {
    AlertCircle,
    ArrowRightCircle,
    Award,
    ChevronDown,
    Filter as FilterIcon,
    Globe,
    MapPin,
    Phone,
    Search,
    Shield,
    Star,
    Users,
    Mail,
} from 'react-feather'

interface WorkerContact {
    email?: string | null
    phone?: string | null
    is_masked: boolean
}

interface WorkerPreview {
    id: number
    full_name: string | null
    display_name: string
    title?: string | null
    summary?: string | null
    location?: string | null
    city?: string | null
    province?: string | null
    experience_years?: number | null
    experience_level?: string | null
    hourly_rate_min?: number | null
    hourly_rate_max?: number | null
    skills: string[]
    languages: string[]
    certifications: string[]
    availability_summary?: string | null
    rating: {
        average: number | null
        count: number
    }
    badges: string[]
    contact: WorkerContact
    profile_photo?: string | null
    last_active_at?: string | null
    profile_completion?: number | null
}

interface ProvinceOption {
    code: string
    name: string
}

interface WorkersPaginator {
    data: WorkerPreview[]
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
}

interface FilterOptions {
    skills: string[]
    languages: string[]
    provinces: ProvinceOption[]
    certifications: string[]
    experience_levels: { value: string; label: string }[]
    availability_options: { value: string; label: string }[]
}

interface AnalyticsSummary {
    total_matches: number
    available_now: number
    top_skills: string[]
    average_rate: number | null
    senior_talent: number
}

interface EmployerFindEmployeesPageProps {
    workers: WorkersPaginator
    filters: Record<string, any>
    filterOptions: FilterOptions
    analytics: AnalyticsSummary
    isFreeTier: boolean
}

interface MultiSelectFilterProps {
    label: string
    placeholder: string
    emptyText: string
    options: string[]
    selected: string[]
    onChange: (values: string[]) => void
}

const MultiSelectFilter = ({
    label,
    placeholder,
    emptyText,
    options,
    selected,
    onChange,
}: MultiSelectFilterProps) => {
    const [open, setOpen] = useState(false)

    const toggleOption = useCallback(
        (option: string) => {
            const exists = selected.includes(option)
            const next = exists
                ? selected.filter(item => item !== option)
                : [...selected, option]
            onChange(next)
        },
        [onChange, selected]
    )

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between rounded-lg border border-slate-200 bg-white text-left text-sm font-medium hover:bg-slate-50 cursor-pointer"
                >
                    <span className="truncate">
                        {selected.length > 0 ? `${label} (${selected.length})` : placeholder}
                    </span>
                    <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 shadow-lg">
                <Command>
                    <CommandInput placeholder={placeholder} />
                    <CommandList>
                        <CommandEmpty>{emptyText}</CommandEmpty>
                        <CommandGroup>
                            {options.map(option => {
                                const isSelected = selected.includes(option)
                                return (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        onSelect={() => toggleOption(option)}
                                        className="flex items-center justify-between gap-2 cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Checkbox checked={isSelected} />
                                            <span className="truncate text-sm">{option}</span>
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

const normalizeFilterValue = (value: unknown): string[] => {
    if (!value) {
        return []
    }

    if (Array.isArray(value)) {
        return value.map(item => String(item))
    }

    if (typeof value === 'string') {
        try {
            const parsed = JSON.parse(value)
            if (Array.isArray(parsed)) {
                return parsed.map(item => String(item))
            }
        } catch {
            return value
                .split(',')
                .map(item => item.trim())
                .filter(Boolean)
        }

        return value ? [value] : []
    }

    return []
}

const EmployerFindEmployeesPage = ({
    workers,
    filters,
    filterOptions,
    analytics,
    isFreeTier,
}: EmployerFindEmployeesPageProps) => {
    const { t, locale } = useTranslations()

    const initialState = useMemo(() => ({
        search: filters.search ?? '',
        province: filters.province ?? '',
        city: filters.city ?? '',
        experience_level: filters.experience_level ?? '',
        availability: filters.availability ?? '',
        rate_min: filters.rate_min ?? '',
        rate_max: filters.rate_max ?? '',
        skills: normalizeFilterValue(filters.skills),
        languages: normalizeFilterValue(filters.languages),
        certifications: normalizeFilterValue(filters.certifications),
    }), [filters])

    const [formState, setFormState] = useState(initialState)
    const [isApplying, setIsApplying] = useState(false)

    useEffect(() => {
        setFormState(initialState)
    }, [initialState])

    const formatTranslation = useCallback((key: string, fallback: string, replacements: Record<string, string | number> = {}) => {
        let text = t(key, fallback)
        Object.entries(replacements).forEach(([replacementKey, value]) => {
            text = text.replace(`:${replacementKey}`, String(value))
        })
        return text
    }, [t])

    const handleInputChange = (field: keyof typeof formState, value: string) => {
        setFormState(prev => ({
            ...prev,
            [field]: value,
        }))
    }

    const handleApplyFilters = useCallback((event?: FormEvent<HTMLFormElement>) => {
        if (event) {
            event.preventDefault()
        }

        const query = {
            lang: locale,
            search: formState.search || undefined,
            province: formState.province || undefined,
            city: formState.city || undefined,
            experience_level: formState.experience_level || undefined,
            availability: formState.availability || undefined,
            rate_min: formState.rate_min || undefined,
            rate_max: formState.rate_max || undefined,
            skills: formState.skills.length ? JSON.stringify(formState.skills) : undefined,
            languages: formState.languages.length ? JSON.stringify(formState.languages) : undefined,
            certifications: formState.certifications.length ? JSON.stringify(formState.certifications) : undefined,
        }

        setIsApplying(true)

        router.get('/employer/employees', query, {
            preserveScroll: true,
            preserveState: true,
            onFinish: () => setIsApplying(false),
        })
    }, [formState, locale])

    const handleResetFilters = () => {
        setFormState({
            search: '',
            province: '',
            city: '',
            experience_level: '',
            availability: '',
            rate_min: '',
            rate_max: '',
            skills: [],
            languages: [],
            certifications: [],
        })

        router.get('/employer/employees', { lang: locale }, {
            preserveScroll: true,
            preserveState: true,
        })
    }

    const handlePageChange = (page: number) => {
        if (page < 1 || page > workers.last_page) {
            return
        }

        const query = {
            lang: locale,
            page,
            search: formState.search || undefined,
            province: formState.province || undefined,
            city: formState.city || undefined,
            experience_level: formState.experience_level || undefined,
            availability: formState.availability || undefined,
            rate_min: formState.rate_min || undefined,
            rate_max: formState.rate_max || undefined,
            skills: formState.skills.length ? JSON.stringify(formState.skills) : undefined,
            languages: formState.languages.length ? JSON.stringify(formState.languages) : undefined,
            certifications: formState.certifications.length ? JSON.stringify(formState.certifications) : undefined,
        }

        router.get('/employer/employees', query, {
            preserveScroll: true,
            preserveState: true,
        })
    }

    const paginationWindow = useMemo(() => {
        const totalPages = workers.last_page
        const current = workers.current_page
        const windowSize = 5

        if (totalPages <= windowSize) {
            return Array.from({ length: totalPages }, (_, index) => index + 1)
        }

        const half = Math.floor(windowSize / 2)
        let start = Math.max(current - half, 1)
        let end = start + windowSize - 1

        if (end > totalPages) {
            end = totalPages
            start = end - windowSize + 1
        }

        return Array.from({ length: end - start + 1 }, (_, index) => start + index)
    }, [workers.current_page, workers.last_page])

    const highlightedSkills = analytics.top_skills || []

    const getExperienceLabel = (level?: string | null) => {
        if (!level) {
            return null
        }

        const match = filterOptions.experience_levels.find(item => item.value === level)
        return match?.label ?? level
    }

    const cardsTitleColor = { color: '#10B3D6' }

    return (
        <AppLayout>
            <Head title={t('find_employees.title', 'Find Employees')}>
                <style>{`
                    .page-title {
                        color: #192341;
                    }

                    .section-title {
                        color: #10B3D6;
                    }

                    .text-default {
                        color: #192341;
                    }

                    .talent-card-header {
                        color: #192341;
                    }
                `}</style>
            </Head>

            <TooltipProvider delayDuration={80}>
                <div className="w-full px-4 py-6 md:px-6 md:py-8">
                    <div className="mx-auto w-full max-w-7xl space-y-8">
                        <div className="flex flex-col gap-4">
                            <div>
                                <h1 className="page-title text-2xl font-bold leading-tight md:text-3xl">
                                    {t('find_employees.title', 'Find the right employees')}
                                </h1>
                                <p className="text-base text-gray-600 md:text-lg">
                                    {t('find_employees.subtitle', 'Search, filter, and connect with qualified professionals across Canada.')}
                                </p>
                            </div>

                            {isFreeTier && (
                                <Alert className="border border-orange-200 bg-orange-50">
                                    <AlertCircle className="h-5 w-5 text-orange-500" />
                                    <AlertTitle className="font-semibold text-orange-800">
                                        {t('find_employees.free_tier_notice', 'You are currently on the Free plan.')}
                                    </AlertTitle>
                                    <AlertDescription className="text-sm text-orange-700">
                                        {t('find_employees.upgrade_description', 'Unlock full profiles, unlimited saves, and instant messaging.')}
                                        <Link
                                            href={`/subscriptions?lang=${locale}`}
                                            className="ml-2 inline-flex items-center gap-1 font-semibold text-orange-800 underline decoration-orange-500 cursor-pointer"
                                        >
                                            {t('find_employees.upgrade_cta', 'Upgrade Plan')}
                                            <ArrowRightCircle className="h-4 w-4" />
                                        </Link>
                                    </AlertDescription>
                                </Alert>
                            )}
                        </div>

                        <Card className="border border-slate-200 shadow-sm">
                            <CardHeader>
                                <CardTitle className="section-title text-lg font-semibold">
                                    {t('find_employees.filters_heading', 'Refine your search')}
                                </CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                    {t('find_employees.search_label', 'Search and filter to narrow the talent pool.')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleApplyFilters} className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                                        <div className="lg:col-span-2">
                                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                                {t('find_employees.search_label', 'Search')}
                                            </label>
                                            <div className="relative">
                                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={formState.search}
                                                    onChange={event => handleInputChange('search', event.target.value)}
                                                    placeholder={t('find_employees.search_placeholder', 'Role, skill, certification...')}
                                                    className="pl-9 pr-4 h-11 rounded-lg border border-slate-200 text-sm"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                                {t('find_employees.province_label', 'Province')}
                                            </label>
                                            <Select
                                                value={formState.province}
                                                onValueChange={value => handleInputChange('province', value)}
                                            >
                                                <SelectTrigger className="h-11 rounded-lg border border-slate-200">
                                                    <SelectValue placeholder={t('find_employees.province_label', 'Province')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">{t('find_employees.reset', 'Reset')}</SelectItem>
                                                    {filterOptions.provinces.map(province => (
                                                        <SelectItem key={province.code} value={province.name}>
                                                            {province.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                                {t('find_employees.city_placeholder', 'City or region')}
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                                <Input
                                                    value={formState.city}
                                                    onChange={event => handleInputChange('city', event.target.value)}
                                                    placeholder={t('find_employees.city_placeholder', 'City or region')}
                                                    className="pl-9 pr-4 h-11 rounded-lg border border-slate-200 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                                        <div>
                                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                                {t('find_employees.experience_label', 'Experience level')}
                                            </label>
                                            <Select
                                                value={formState.experience_level}
                                                onValueChange={value => handleInputChange('experience_level', value)}
                                            >
                                                <SelectTrigger className="h-11 rounded-lg border border-slate-200">
                                                    <SelectValue placeholder={t('find_employees.experience_label', 'Experience level')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">{t('find_employees.reset', 'Reset')}</SelectItem>
                                                    {filterOptions.experience_levels.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="mb-1 block text-sm font-semibold text-gray-700">
                                                {t('find_employees.availability_label', 'Availability')}
                                            </label>
                                            <Select
                                                value={formState.availability}
                                                onValueChange={value => handleInputChange('availability', value)}
                                            >
                                                <SelectTrigger className="h-11 rounded-lg border border-slate-200">
                                                    <SelectValue placeholder={t('find_employees.availability_label', 'Availability')} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">{t('find_employees.reset', 'Reset')}</SelectItem>
                                                    {filterOptions.availability_options.map(option => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                                    {t('find_employees.rate_label', 'Hourly rate ($/hr)')}
                                                </label>
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={formState.rate_min}
                                                    onChange={event => handleInputChange('rate_min', event.target.value)}
                                                    placeholder={t('find_employees.rate_min_placeholder', 'Min')}
                                                    className="h-11 rounded-lg border border-slate-200 text-sm"
                                                />
                                            </div>
                                            <div className="mt-6">
                                                <Input
                                                    type="number"
                                                    min={0}
                                                    value={formState.rate_max}
                                                    onChange={event => handleInputChange('rate_max', event.target.value)}
                                                    placeholder={t('find_employees.rate_max_placeholder', 'Max')}
                                                    className="h-11 rounded-lg border border-slate-200 text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                        <div>
                                            <span className="mb-1 block text-sm font-semibold text-gray-700">
                                                {t('find_employees.skills_label', 'Skills')}
                                            </span>
                                            <MultiSelectFilter
                                                label={t('find_employees.skills_label', 'Skills')}
                                                placeholder={t('find_employees.skills_label', 'Skills')}
                                                emptyText={t('find_employees.no_results', 'No options found')}
                                                options={filterOptions.skills}
                                                selected={formState.skills}
                                                onChange={values => setFormState(prev => ({ ...prev, skills: values }))}
                                            />
                                        </div>
                                        <div>
                                            <span className="mb-1 block text-sm font-semibold text-gray-700">
                                                {t('find_employees.languages_label', 'Languages')}
                                            </span>
                                            <MultiSelectFilter
                                                label={t('find_employees.languages_label', 'Languages')}
                                                placeholder={t('find_employees.languages_label', 'Languages')}
                                                emptyText={t('find_employees.no_results', 'No options found')}
                                                options={filterOptions.languages}
                                                selected={formState.languages}
                                                onChange={values => setFormState(prev => ({ ...prev, languages: values }))}
                                            />
                                        </div>
                                        <div>
                                            <span className="mb-1 block text-sm font-semibold text-gray-700">
                                                {t('find_employees.certifications_label', 'Certifications')}
                                            </span>
                                            <MultiSelectFilter
                                                label={t('find_employees.certifications_label', 'Certifications')}
                                                placeholder={t('find_employees.certifications_label', 'Certifications')}
                                                emptyText={t('find_employees.no_results', 'No options found')}
                                                options={filterOptions.certifications}
                                                selected={formState.certifications}
                                                onChange={values => setFormState(prev => ({ ...prev, certifications: values }))}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={handleResetFilters}
                                            className="h-11 rounded-lg border border-transparent hover:bg-slate-50 cursor-pointer"
                                        >
                                            {t('find_employees.clear_filters', 'Clear filters')}
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="h-11 rounded-lg text-white shadow-sm transition hover:opacity-90 cursor-pointer"
                                            style={{ backgroundColor: '#10B3D6' }}
                                            disabled={isApplying}
                                        >
                                            <FilterIcon className="mr-2 h-4 w-4" />
                                            {isApplying
                                                ? t('common.loading', 'Loading...')
                                                : t('find_employees.apply_filters', 'Apply filters')}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                            <Card className="border border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="section-title text-sm font-semibold uppercase tracking-wide" style={cardsTitleColor}>
                                        {t('find_employees.analytics_total', 'Total matches')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Users className="h-10 w-10 text-[#10B3D6]" />
                                        <div>
                                            <p className="text-2xl font-bold text-default">{analytics.total_matches}</p>
                                            <p className="text-xs text-gray-500">
                                                {formatTranslation('find_employees.results_range', 'Showing :from – :to of :total results', {
                                                    from: workers.from ?? 0,
                                                    to: workers.to ?? workers.from ?? 0,
                                                    total: workers.total ?? 0,
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="section-title text-sm font-semibold uppercase tracking-wide" style={cardsTitleColor}>
                                        {t('find_employees.analytics_available_now', 'Available now')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Globe className="h-10 w-10 text-[#10B3D6]" />
                                        <div>
                                            <p className="text-2xl font-bold text-default">{analytics.available_now}</p>
                                            <p className="text-xs text-gray-500">
                                                {t('find_employees.availability_label', 'Availability')}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="section-title text-sm font-semibold uppercase tracking-wide" style={cardsTitleColor}>
                                        {t('find_employees.analytics_average_rate', 'Average rate')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Shield className="h-10 w-10 text-[#10B3D6]" />
                                        <div>
                                            <p className="text-2xl font-bold text-default">
                                                {analytics.average_rate ? `$${analytics.average_rate.toFixed(2)}` : '—'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {t('find_employees.rate_label', 'Hourly rate ($/hr)')}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="border border-slate-200 shadow-sm">
                                <CardHeader>
                                    <CardTitle className="section-title text-sm font-semibold uppercase tracking-wide" style={cardsTitleColor}>
                                        {t('find_employees.analytics_senior_talent', 'Senior & expert talent')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <Award className="h-10 w-10 text-[#10B3D6]" />
                                        <div>
                                            <p className="text-2xl font-bold text-default">{analytics.senior_talent}</p>
                                            <p className="text-xs text-gray-500">
                                                {t('find_employees.experience_label', 'Experience level')}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {highlightedSkills.length > 0 && (
                            <Card className="border border-slate-200 shadow-sm">
                                <CardHeader className="pb-3">
                                    <CardTitle className="section-title text-base font-semibold" style={cardsTitleColor}>
                                        {t('find_employees.analytics_top_skills', 'Top skills this week')}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-500">
                                        {t('find_employees.results_description', 'Showing :count professionals ready to collaborate.').replace(':count', String(analytics.total_matches))}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-wrap gap-2">
                                    {highlightedSkills.map(skill => (
                                        <Badge key={skill} variant="outline" className="rounded-full border-[#10B3D6] bg-[#10B3D6]/10 px-3 py-1 text-sm font-medium text-[#10B3D6]">
                                            {skill}
                                        </Badge>
                                    ))}
                                </CardContent>
                            </Card>
                        )}

                        <div className="space-y-6">
                            {workers.data.length > 0 ? (
                                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                                    {workers.data.map(worker => (
                                        <Card key={worker.id} className="h-full border border-slate-200 shadow-[0_18px_40px_rgba(16,179,214,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(16,179,214,0.18)]">
                                            <CardHeader className="flex flex-col gap-2">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h2 className="talent-card-header text-xl font-semibold">
                                                            {worker.display_name}
                                                        </h2>
                                                        <p className="text-sm text-gray-600">
                                                            {worker.title || t('find_employees.title', 'Skilled Professional')}
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-2">
                                                        {worker.rating.average ? (
                                                            <div className="flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                                                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                                                {worker.rating.average} ({worker.rating.count})
                                                            </div>
                                                        ) : (
                                                            <Badge variant="secondary" className="rounded-full">
                                                                {t('find_employees.badge_free_plan', 'New talent')}
                                                            </Badge>
                                                        )}
                                                        <div className="flex flex-wrap gap-1 justify-end">
                                                            {worker.badges.map(badge => (
                                                                <Badge key={`${worker.id}-${badge}`} variant="outline" className="rounded-full border-[#10B3D6] bg-[#10B3D6]/10 text-xs font-semibold text-[#10B3D6]">
                                                                    {badge}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                                    {worker.location && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <MapPin className="h-4 w-4 text-[#10B3D6]" />
                                                            {worker.location}
                                                        </span>
                                                    )}
                                                    {worker.experience_level && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Award className="h-4 w-4 text-[#10B3D6]" />
                                                            {getExperienceLabel(worker.experience_level)}
                                                        </span>
                                                    )}
                                                    {worker.hourly_rate_min && (
                                                        <span className="inline-flex items-center gap-1">
                                                            <Shield className="h-4 w-4 text-[#10B3D6]" />
                                                            ${worker.hourly_rate_min}{worker.hourly_rate_max ? ` - $${worker.hourly_rate_max}` : ''}/h
                                                        </span>
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-5">
                                                {worker.summary && (
                                                    <p className="text-sm text-gray-600 leading-relaxed">
                                                        {worker.summary}
                                                    </p>
                                                )}

                                                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                                                    {worker.availability_summary && (
                                                        <div className="flex items-center gap-2 rounded-full border border-[#10B3D6]/30 px-3 py-1 text-xs text-[#10B3D6]">
                                                            <Globe className="h-4 w-4" />
                                                            {worker.availability_summary}
                                                        </div>
                                                    )}
                                                    {worker.languages.length > 0 && (
                                                        <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs text-gray-600">
                                                            <Globe className="h-4 w-4 text-[#10B3D6]" />
                                                            {worker.languages.join(', ')}
                                                        </div>
                                                    )}
                                                </div>

                                                {worker.skills.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#10B3D6]">
                                                            {t('find_employees.skills', 'Skills')}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {worker.skills.slice(0, 8).map(skill => (
                                                                <Badge key={`${worker.id}-${skill}`} variant="outline" className="rounded-full border-slate-200 bg-slate-50 px-3 py-1 text-xs text-gray-700">
                                                                    {skill}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {worker.certifications.length > 0 && (
                                                    <div className="space-y-2">
                                                        <p className="text-xs font-semibold uppercase tracking-wide text-[#10B3D6]">
                                                            {t('find_employees.certifications', 'Certifications')}
                                                        </p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {worker.certifications.slice(0, 4).map(certification => (
                                                                <Badge key={`${worker.id}-${certification}`} variant="secondary" className="rounded-full bg-[#10B3D6]/15 text-xs font-medium text-[#10B3D6]">
                                                                    {certification}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                                                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                        <span className="font-semibold text-[#10B3D6]">{t('find_employees.contact_email', 'Email')}</span>
                                                        <span>{worker.contact.email ?? t('find_employees.contact_masked', 'Contact details hidden on Free plan')}</span>
                                                    </div>
                                                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                                                        <span className="font-semibold text-[#10B3D6]">{t('find_employees.contact_phone', 'Phone')}</span>
                                                        <span>{worker.contact.phone ?? t('find_employees.contact_masked', 'Contact details hidden on Free plan')}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                                                    <Link
                                                        href={`/employer/employees/${worker.id}?lang=${locale}`}
                                                        className="inline-flex items-center gap-2 text-sm font-semibold text-[#10B3D6] hover:opacity-80 cursor-pointer"
                                                    >
                                                        {t('find_employees.view_profile', 'View profile')}
                                                        <ArrowRightCircle className="h-4 w-4" />
                                                    </Link>

                                                    {worker.contact.is_masked ? (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    asChild
                                                                    className="h-10 rounded-lg border border-dashed border-[#10B3D6] bg-transparent text-[#10B3D6] hover:bg-[#10B3D6]/10 cursor-pointer"
                                                                >
                                                                    <Link href={`/subscriptions?lang=${locale}`} className="inline-flex items-center gap-2">
                                                                        <Shield className="h-4 w-4" />
                                                                        {t('find_employees.upgrade_cta', 'Upgrade Plan')}
                                                                    </Link>
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                {t('find_employees.masked_tooltip', 'Upgrade your plan to unlock full contact access.')}
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ) : (
                                                        <div className="flex gap-2">
                                                            {worker.contact.email && (
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 rounded-lg border border-slate-200 bg-white text-gray-700 hover:bg-slate-50 cursor-pointer"
                                                                    asChild
                                                                >
                                                                    <a href={`mailto:${worker.contact.email}`} className="inline-flex items-center gap-2">
                                                                        <Mail className="h-4 w-4" />
                                                                        {t('find_employees.contact', 'Contact')}
                                                                    </a>
                                                                </Button>
                                                            )}
                                                            {worker.contact.phone && (
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-10 rounded-lg border border-slate-200 bg-white text-gray-700 hover:bg-slate-50 cursor-pointer"
                                                                    asChild
                                                                >
                                                                    <a href={`tel:${worker.contact.phone}`} className="inline-flex items-center gap-2">
                                                                        <Phone className="h-4 w-4" />
                                                                        {t('find_employees.contact', 'Contact')}
                                                                    </a>
                                                                </Button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="border border-slate-200">
                                    <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                                        <FilterIcon className="h-12 w-12 text-gray-300" />
                                        <h3 className="text-lg font-semibold text-default">
                                            {t('find_employees.empty_state_title', 'No employees found')}
                                        </h3>
                                        <p className="max-w-md text-sm text-gray-500">
                                            {t('find_employees.empty_state_body', 'Try adjusting your filters or broadening your search.')}
                                        </p>
                                        <Button
                                            onClick={handleResetFilters}
                                            className="h-10 rounded-lg bg-[#10B3D6] px-6 text-white hover:opacity-90 cursor-pointer"
                                        >
                                            {t('find_employees.clear_filters', 'Clear filters')}
                                        </Button>
                                    </CardContent>
                                </Card>
                            )}
                        </div>

                        {workers.last_page > 1 && (
                            <Card className="border border-slate-200">
                                <CardContent className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
                                    <div className="text-sm text-gray-600">
                                        {formatTranslation('find_employees.results_range', 'Showing :from – :to of :total results', {
                                            from: workers.from ?? 0,
                                            to: workers.to ?? workers.from ?? 0,
                                            total: workers.total ?? 0,
                                        })}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={workers.current_page === 1}
                                            onClick={() => handlePageChange(workers.current_page - 1)}
                                            className="cursor-pointer h-9 rounded-lg"
                                        >
                                            ‹
                                        </Button>
                                        <div className="flex items-center gap-1">
                                            {paginationWindow.map(page => (
                                                <Button
                                                    key={page}
                                                    variant={workers.current_page === page ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => handlePageChange(page)}
                                                    className="h-9 w-9 rounded-lg p-0 cursor-pointer"
                                                    style={workers.current_page === page ? { backgroundColor: '#10B3D6', color: 'white' } : {}}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={workers.current_page === workers.last_page}
                                            onClick={() => handlePageChange(workers.current_page + 1)}
                                            className="cursor-pointer h-9 rounded-lg"
                                        >
                                            ›
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </TooltipProvider>
        </AppLayout>
    )
}

export default EmployerFindEmployeesPage



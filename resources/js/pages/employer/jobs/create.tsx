import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { type BreadcrumbItem } from '@/types';
import { Briefcase, X, Plus } from 'react-feather';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post Jobs',
        href: '/employer/jobs/create',
    },
];

interface CreateJobPageProps {
    categories: Record<string, string>;
    globalSkills?: any[];
}

const JOB_TYPES = [
    { value: 'full_time', label: 'Full Time' },
    { value: 'part_time', label: 'Part Time' },
    { value: 'contract', label: 'Contract' },
    { value: 'freelance', label: 'Freelance' },
];

const EXPERIENCE_LEVELS = [
    { value: 'entry', label: 'Entry Level' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'expert', label: 'Expert' },
];

export default function CreateJobPage({ categories, globalSkills = [] }: CreateJobPageProps) {
    const { t, locale } = useTranslations();
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: '',
        budget: '',
        deadline: '',
        required_skills: [] as string[],
        province: '',
        city: '',
        global_province_id: null as number | null,
        global_city_id: null as number | null,
        job_type: '',
        experience_level: '',
    });

    const [skillSearch, setSkillSearch] = useState('');
    const [showSkillSuggestions, setShowSkillSuggestions] = useState<boolean>(false);
    const [selectedSkillId, setSelectedSkillId] = useState<string>('');
    const skillInputRef = useRef<HTMLDivElement>(null);
    const [firstErrorField, setFirstErrorField] = useState<string | null>(null);
    const [citySearch, setCitySearch] = useState<string>('');
    const [showCitySuggestions, setShowCitySuggestions] = useState<boolean>(false);
    const [cities, setCities] = useState<Array<{ id: number; name: string; global_province_id: number }>>([]);
    const [loadingCities, setLoadingCities] = useState<boolean>(false);
    const [citiesLoaded, setCitiesLoaded] = useState<boolean>(false);
    const [previousProvince, setPreviousProvince] = useState<string | null>(null);
    const cityInputRef = useRef<HTMLDivElement>(null);

    const CANADIAN_PROVINCES = [
        { value: 'AB', label: t('provinces.AB', 'Alberta') },
        { value: 'BC', label: t('provinces.BC', 'British Columbia') },
        { value: 'MB', label: t('provinces.MB', 'Manitoba') },
        { value: 'NB', label: t('provinces.NB', 'New Brunswick') },
        { value: 'NL', label: t('provinces.NL', 'Newfoundland and Labrador') },
        { value: 'NS', label: t('provinces.NS', 'Nova Scotia') },
        { value: 'NT', label: t('provinces.NT', 'Northwest Territories') },
        { value: 'NU', label: t('provinces.NU', 'Nunavut') },
        { value: 'ON', label: t('provinces.ON', 'Ontario') },
        { value: 'PE', label: t('provinces.PE', 'Prince Edward Island') },
        { value: 'QC', label: t('provinces.QC', 'Quebec') },
        { value: 'SK', label: t('provinces.SK', 'Saskatchewan') },
        { value: 'YT', label: t('provinces.YT', 'Yukon') },
    ];

    // Fetch cities from API only when user interacts with city field
    const fetchCities = async () => {
        if (!data.province) {
            return;
        }

        setLoadingCities(true);
        try {
            // First, fetch province to get global_province_id
            const provinceResponse = await fetch(`/employer/api/provinces`);
            if (provinceResponse.ok) {
                const provinces = await provinceResponse.json();
                const selectedProvince = provinces.find((p: { code: string }) => p.code === data.province);
                if (selectedProvince) {
                    setData('global_province_id', selectedProvince.id);
                }
            }

            // Then fetch cities
            const searchParam = citySearch ? `?search=${encodeURIComponent(citySearch)}` : '';
            const response = await fetch(`/employer/api/provinces/code/${data.province}/cities${searchParam}`);
            if (response.ok) {
                const citiesData = await response.json();
                setCities(citiesData);
                setCitiesLoaded(true);
            }
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setLoadingCities(false);
        }
    };

    // Debounce city search when user types
    useEffect(() => {
        if (!data.province || !citiesLoaded || !citySearch) {
            return;
        }

        const timer = setTimeout(() => {
            fetchCities();
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [citySearch]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
                setShowCitySuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clear city when province changes
    useEffect(() => {
        if (previousProvince !== null && data.province !== previousProvince) {
            setData('city', '');
            setData('global_city_id', null);
            setData('global_province_id', null);
            setCitySearch('');
            setCities([]);
            setCitiesLoaded(false);
        }
        setPreviousProvince(data.province);
    }, [data.province]);

    // Initialize citySearch with the selected city name
    useEffect(() => {
        if (data.city && !citySearch) {
            setCitySearch(data.city);
        }
    }, [data.city, citySearch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Find first error field
        const errorFields = Object.keys(errors);
        if (errorFields.length > 0) {
            setFirstErrorField(errorFields[0]);
            const errorElement = document.getElementById(errorFields[0]);
            if (errorElement) {
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        post('/employer/jobs', {
            onSuccess: () => {
                reset();
            },
        });
    };

    // Close skill suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (skillInputRef.current && !skillInputRef.current.contains(event.target as Node)) {
                setShowSkillSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Group skills by category for easier selection
    const skillsByCategory = globalSkills.reduce((acc: any, skill: any) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});

    // Filter skills based on search
    const filteredSkills = globalSkills.filter(skill => 
        skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !data.required_skills.includes(skill.name)
    ).slice(0, 15); // Show max 15 results

    // Group filtered skills by category
    const filteredSkillsByCategory = filteredSkills.reduce((acc: any, skill: any) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});

    const addSkill = () => {
        let skillToAdd = '';
        
        // If a skill is selected from dropdown, use that
        if (selectedSkillId) {
            const skill = globalSkills.find(s => s.id.toString() === selectedSkillId);
            if (skill && !data.required_skills.includes(skill.name)) {
                skillToAdd = skill.name;
            }
        } 
        // Otherwise, use the typed text
        else if (skillSearch.trim() && !data.required_skills.includes(skillSearch.trim())) {
            skillToAdd = skillSearch.trim();
        }

        if (skillToAdd) {
            setData('required_skills', [...data.required_skills, skillToAdd]);
            setSkillSearch('');
            setSelectedSkillId('');
            setShowSkillSuggestions(false);
        }
    };

    const removeSkill = (skill: string) => {
        setData('required_skills', data.required_skills.filter(s => s !== skill));
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addSkill();
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Post Job">
                <style>{`
                    * { cursor: default; }
                    a, button, [role="button"], .cursor-pointer { cursor: pointer !important; }
                    
                    .job-title {
                        color: #192341 !important;
                    }
                    
                    .text-default {
                        color: #192341 !important;
                    }
                    
                    .card-with-border {
                        border-top: .5px solid #192341 !important;
                    }
                `}</style>
            </Head>
            
            <div className="w-full px-4 py-6 md:px-6 md:py-8">
                <div className="mx-auto max-w-3xl">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold leading-tight job-title mb-2">
                            {t('jobs.create.title', 'Post a New Job')}
                        </h1>
                        <p className="text-lg leading-relaxed text-gray-600">
                            {t('jobs.create.subtitle', 'Fill in the details to post your job listing')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-lg job-title">
                                    {t('jobs.create.job_details', 'Job Details')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Job Title */}
                                <div id="title">
                                    <Label htmlFor="title" className="text-sm font-medium">
                                        {t('jobs.create.title_label', 'Job Title')} <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder={t('jobs.create.title_placeholder', 'e.g., Restaurant Server Needed')}
                                        className={`mt-1 ${errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                    )}
                                </div>

                                {/* Description */}
                                <div id="description">
                                    <Label htmlFor="description" className="text-sm font-medium">
                                        {t('jobs.create.description_label', 'Job Description')} <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        placeholder={t('jobs.create.description_placeholder', 'Describe the job requirements, responsibilities, and expectations')}
                                        className={`mt-1 min-h-[120px] ${errors.description ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                        required
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                    )}
                                </div>

                                {/* Category */}
                                <div id="category">
                                    <Label htmlFor="category" className="text-sm font-medium">
                                        {t('jobs.create.category_label', 'Category')} <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger className={`mt-1 cursor-pointer ${errors.category ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}>
                                            <SelectValue placeholder={t('jobs.create.category_placeholder', 'Select a category')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(categories).map(([key, label]) => (
                                                <SelectItem key={key} value={key}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                    )}
                                </div>

                                {/* Job Type and Experience Level */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div id="job_type">
                                        <Label htmlFor="job_type" className="text-sm font-medium">
                                            {t('jobs.create.job_type_label', 'Job Type')} <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.job_type}
                                            onValueChange={(value) => setData('job_type', value)}
                                        >
                                            <SelectTrigger className={`mt-1 cursor-pointer ${errors.job_type ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}>
                                                <SelectValue placeholder={t('jobs.create.job_type_placeholder', 'Select job type')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {JOB_TYPES.map((type) => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        {type.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.job_type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.job_type}</p>
                                        )}
                                    </div>

                                    <div id="experience_level">
                                        <Label htmlFor="experience_level" className="text-sm font-medium">
                                            {t('jobs.create.experience_label', 'Experience Level')} <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.experience_level}
                                            onValueChange={(value) => setData('experience_level', value)}
                                        >
                                            <SelectTrigger className={`mt-1 cursor-pointer ${errors.experience_level ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}>
                                                <SelectValue placeholder={t('jobs.create.experience_placeholder', 'Select experience level')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {EXPERIENCE_LEVELS.map((level) => (
                                                    <SelectItem key={level.value} value={level.value}>
                                                        {level.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.experience_level && (
                                            <p className="mt-1 text-sm text-red-600">{errors.experience_level}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Budget and Deadline */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div id="budget">
                                        <Label htmlFor="budget" className="text-sm font-medium">
                                            {t('jobs.create.budget_label', 'Budget')} <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="budget"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={data.budget}
                                            onChange={(e) => setData('budget', e.target.value)}
                                            placeholder={t('jobs.create.budget_placeholder', '0.00')}
                                            className={`mt-1 ${errors.budget ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                            required
                                        />
                                        {errors.budget && (
                                            <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                                        )}
                                    </div>

                                    <div id="deadline">
                                        <Label htmlFor="deadline" className="text-sm font-medium">
                                            {t('jobs.create.deadline_label', 'Deadline')} 
                                            <span className="text-gray-500 ml-1">({t('jobs.create.optional', 'Optional')})</span>
                                        </Label>
                                        <Input
                                            id="deadline"
                                            type="date"
                                            value={data.deadline}
                                            onChange={(e) => setData('deadline', e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            className={`mt-1 ${errors.deadline ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.deadline && (
                                            <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Province and City */}
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div id="province">
                                        <Label htmlFor="province" className="text-sm font-medium">
                                            {t('jobs.create.province_label', 'Province')} <span className="text-red-500">*</span>
                                        </Label>
                                        <Select
                                            value={data.province}
                                            onValueChange={(value) => setData('province', value)}
                                        >
                                            <SelectTrigger className={`mt-1 cursor-pointer ${errors.province ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}>
                                                <SelectValue placeholder={t('jobs.create.province_placeholder', 'Select province')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CANADIAN_PROVINCES.map((province) => (
                                                    <SelectItem key={province.value} value={province.value}>
                                                        {province.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {errors.province && (
                                            <p className="mt-1 text-sm text-red-600">{errors.province}</p>
                                        )}
                                    </div>

                                    <div ref={cityInputRef} id="city" className="relative">
                                        <Label htmlFor="city" className="text-sm font-medium">
                                            {t('jobs.create.city_label', 'City')} <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative mt-1">
                                            <Input
                                                id="city"
                                                type="text"
                                                value={citySearch || data.city || ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    setCitySearch(value);
                                                    setShowCitySuggestions(true);
                                                    if (!value) {
                                                        setData('city', '');
                                                        setData('global_city_id', null);
                                                    }
                                                }}
                                                onFocus={() => {
                                                    if (data.province && !citiesLoaded) {
                                                        fetchCities();
                                                    }
                                                    setShowCitySuggestions(true);
                                                }}
                                                placeholder={
                                                    data.province 
                                                        ? t('jobs.create.city_placeholder', 'Type to search cities...') 
                                                        : t('jobs.create.city_placeholder_disabled', 'Select a province first')
                                                }
                                                className={`${errors.city ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                                disabled={!data.province}
                                                style={{ cursor: data.province ? 'text' : 'not-allowed' }}
                                                required
                                            />

                                            {/* Suggestions dropdown */}
                                            {showCitySuggestions && cities.length > 0 && (
                                                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                                    {cities.map((city) => (
                                                        <div
                                                            key={city.id}
                                                            className="cursor-pointer px-3 py-2 font-medium text-gray-900 hover:bg-gray-100"
                                                            onClick={() => {
                                                                setData('city', city.name);
                                                                setData('global_city_id', city.id);
                                                                setCitySearch(city.name);
                                                                setShowCitySuggestions(false);
                                                            }}
                                                        >
                                                            {city.name}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Loading message */}
                                            {showCitySuggestions && loadingCities && (
                                                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
                                                    {t('jobs.create.loading_cities', 'Loading cities...')}
                                                </div>
                                            )}

                                            {/* No results message */}
                                            {showCitySuggestions && !loadingCities && citySearch && cities.length === 0 && (
                                                <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
                                                    {t('jobs.create.no_cities', 'No cities found matching')}{' '}"{citySearch}"
                                                </div>
                                            )}
                                        </div>
                                        {!data.province && (
                                            <p className="mt-1 text-sm text-gray-500">
                                                {t('jobs.create.city_placeholder_disabled', 'Select a province first')}
                                            </p>
                                        )}
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Required Skills */}
                                <div id="required_skills">
                                    <Label className="text-sm font-medium">
                                        {t('jobs.create.skills_label', 'Required Skills')} <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="mt-1 flex gap-2">
                                        <div className="flex-1 relative" ref={skillInputRef}>
                                            <div className="relative">
                                                <Input
                                                    type="text"
                                                    value={skillSearch}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setSkillSearch(value);
                                                        setShowSkillSuggestions(true);
                                                        setSelectedSkillId('');
                                                    }}
                                                    onFocus={() => setShowSkillSuggestions(true)}
                                                    onKeyPress={handleKeyPress}
                                                    placeholder={t('jobs.create.skills_placeholder', 'Type to search skills or select from list...')}
                                                    className="w-full"
                                                />
                                                
                                                {/* Suggestions dropdown */}
                                                {showSkillSuggestions && (skillSearch.length > 0 ? filteredSkills.length > 0 : globalSkills.length > 0) && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto">
                                                        {skillSearch.length === 0 ? (
                                                            /* Show all skills grouped by category when no search */
                                                            Object.entries(skillsByCategory).map(([category, skills]) => (
                                                                <div key={category}>
                                                                    <div className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 sticky top-0">
                                                                        {category}
                                                                    </div>
                                                                    {(skills as any[]).map((skill) => {
                                                                        const isDisabled = data.required_skills.includes(skill.name);
                                                                        return (
                                                                            <div
                                                                                key={skill.id}
                                                                                className={`px-3 py-2 text-sm text-gray-900 font-medium ${
                                                                                    isDisabled 
                                                                                        ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                                                                                        : 'cursor-pointer hover:bg-gray-100'
                                                                                }`}
                                                                                onClick={() => {
                                                                                    if (!isDisabled) {
                                                                                        setSelectedSkillId(skill.id.toString());
                                                                                        setSkillSearch(skill.name);
                                                                                        setShowSkillSuggestions(false);
                                                                                    }
                                                                                }}
                                                                            >
                                                                                {skill.name}
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            /* Show filtered skills grouped by category when searching */
                                                            Object.entries(filteredSkillsByCategory).map(([category, skills]) => (
                                                                <div key={category}>
                                                                    <div className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 sticky top-0">
                                                                        {category}
                                                                    </div>
                                                                    {(skills as any[]).map((skill) => (
                                                                        <div
                                                                            key={skill.id}
                                                                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-900 font-medium"
                                                                            onClick={() => {
                                                                                setSelectedSkillId(skill.id.toString());
                                                                                setSkillSearch(skill.name);
                                                                                setShowSkillSuggestions(false);
                                                                            }}
                                                                        >
                                                                            {skill.name}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* No results message with option to add custom skill */}
                                                {showSkillSuggestions && skillSearch && filteredSkills.length === 0 && (
                                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
                                                        <div className="p-3">
                                                            <p className="text-sm text-gray-500 mb-2">
                                                                {t('jobs.create.no_skills_found', 'No skills found matching')} "{skillSearch}"
                                                            </p>
                                                            <p className="text-xs text-gray-400">
                                                                {t('jobs.create.add_custom_skill_hint', 'Press Enter or click Add to add as custom skill')}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <Button
                                            type="button"
                                            onClick={addSkill}
                                            disabled={!selectedSkillId && !skillSearch.trim()}
                                            className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    {data.required_skills.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {data.required_skills.map((skill) => (
                                                <Badge
                                                    key={skill}
                                                    variant="outline"
                                                    className="flex items-center gap-1 px-2 py-1 cursor-pointer"
                                                    onClick={() => removeSkill(skill)}
                                                >
                                                    {skill}
                                                    <X className="h-3 w-3" />
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                    {errors.required_skills && (
                                        <p className="mt-1 text-sm text-red-600">{errors.required_skills}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                className="cursor-pointer"
                                style={{ height: '2.7em' }}
                            >
                                {t('jobs.create.cancel', 'Cancel')}
                            </Button>
                            <Button
                                type="submit"
                                disabled={processing}
                                className="text-white hover:opacity-90 hover:scale-105 transition-all duration-200 cursor-pointer"
                                style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            >
                                <Briefcase className="h-4 w-4 mr-2" />
                                {processing ? t('jobs.create.posting', 'Posting...') : t('jobs.create.post_job', 'Post Job')}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}


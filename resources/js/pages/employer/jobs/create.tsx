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
import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Post Jobs',
        href: '/employer/jobs/create',
    },
];

interface CreateJobPageProps {
    categories: Record<string, string>;
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

export default function CreateJobPage({ categories }: CreateJobPageProps) {
    const { t, locale } = useTranslations();
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        category: '',
        budget: '',
        deadline: '',
        required_skills: [] as string[],
        location: '',
        job_type: '',
        experience_level: '',
    });

    const [skillInput, setSkillInput] = useState('');
    const [firstErrorField, setFirstErrorField] = useState<string | null>(null);

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

    const addSkill = () => {
        if (skillInput.trim() && !data.required_skills.includes(skillInput.trim())) {
            setData('required_skills', [...data.required_skills, skillInput.trim()]);
            setSkillInput('');
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

                                {/* Location */}
                                <div id="location">
                                    <Label htmlFor="location" className="text-sm font-medium">
                                        {t('jobs.create.location_label', 'Location')} 
                                        <span className="text-gray-500 ml-1">({t('jobs.create.optional', 'Optional')})</span>
                                    </Label>
                                    <Input
                                        id="location"
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder={t('jobs.create.location_placeholder', 'e.g., Toronto, ON')}
                                        className={`mt-1 ${errors.location ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                    />
                                    {errors.location && (
                                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                                    )}
                                </div>

                                {/* Required Skills */}
                                <div id="required_skills">
                                    <Label className="text-sm font-medium">
                                        {t('jobs.create.skills_label', 'Required Skills')} 
                                        <span className="text-gray-500 ml-1">({t('jobs.create.optional', 'Optional')})</span>
                                    </Label>
                                    <div className="mt-1 flex gap-2">
                                        <Input
                                            type="text"
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder={t('jobs.create.skills_placeholder', 'Enter a skill and press Enter')}
                                            className="flex-1"
                                        />
                                        <Button
                                            type="button"
                                            onClick={addSkill}
                                            className="cursor-pointer"
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


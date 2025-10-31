import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ValidatedInput from '@/components/ui/validated-input';
import ValidatedTextarea from '@/components/ui/validated-textarea';
import { useTranslations } from '@/hooks/useTranslations';
import React from 'react';
import { Briefcase } from 'react-feather';

interface BusinessInfoStepProps {
    formData: Record<string, unknown>;
    updateFormData: (data: Record<string, unknown>) => void;
    validationErrors: Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalIndustries: any[];
}

export default function BusinessInfoStep({ 
    formData, 
    updateFormData, 
    validationErrors,
    globalIndustries = []
}: BusinessInfoStepProps) {
    const { t } = useTranslations();

    const handleInputChange = (field: string, value: unknown) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#FCF2F0' }}>
                    <Briefcase className="h-8 w-8" style={{ color: '#10B3D6' }} />
                </div>
                <h2 className="mb-2 text-xl font-bold" style={{ color: '#192341' }}>
                    {t('employer.steps.business_info.welcome_title', 'Welcome to SkillOnCall!')}
                </h2>
                <p className="text-sm text-gray-600">
                    {t('employer.steps.business_info.welcome_subtitle', "Let's get started by setting up your business profile.")}
                </p>
            </div>

            {/* Business Information */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                        {t('employer.steps.business_info.title', 'Business Information')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Business Name */}
                    <ValidatedInput
                        id="business_name"
                        label={t('employer.steps.business_info.business_name', 'Business Name')}
                        fieldType="name"
                        value={formData.business_name || ''}
                        onChange={(value) => handleInputChange('business_name', value)}
                        error={validationErrors.business_name}
                        required
                        placeholder={t('employer.steps.business_info.business_name_placeholder', 'Enter your business name')}
                    />

                    {/* Phone Number */}
                    <ValidatedInput
                        id="phone"
                        label={t('employer.steps.business_info.phone', 'Phone Number')}
                        fieldType="phone"
                        value={formData.phone || ''}
                        onChange={(value) => handleInputChange('phone', value)}
                        error={validationErrors.phone}
                        helperText={t('employer.steps.business_info.phone_helper', 'Workers will use this to contact you')}
                        required
                        placeholder="(416) 555-0123"
                    />

                    {/* Industry Type (Optional) */}
                    <div>
                        <Label htmlFor="global_industry_id" className="text-sm font-medium">
                            {t('employer.steps.business_info.industry', 'Industry Type')} 
                            <span className="text-gray-500">({t('employer.steps.business_info.optional', 'Optional')})</span>
                        </Label>
                        <Select
                            value={formData.global_industry_id ? String(formData.global_industry_id) : undefined}
                            onValueChange={(value) => handleInputChange('global_industry_id', parseInt(value))}
                        >
                            <SelectTrigger className="mt-1 cursor-pointer">
                                <SelectValue placeholder={t('employer.steps.business_info.industry_placeholder', 'Select industry (optional)')} />
                            </SelectTrigger>
                            <SelectContent>
                                {[...globalIndustries].sort((a, b) => a.name.localeCompare(b.name)).map((industry) => (
                                    <SelectItem key={industry.id} value={String(industry.id)}>
                                        {industry.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {validationErrors.global_industry_id && (
                            <p className="mt-1 text-sm text-red-600">{validationErrors.global_industry_id}</p>
                        )}
                    </div>

                    {/* Business Description (Optional) */}
                    <ValidatedTextarea
                        id="bio"
                        label={t('employer.steps.business_info.description', 'Business Description (Optional)')}
                        fieldType="bio"
                        value={formData.bio || ''}
                        onChange={(value) => handleInputChange('bio', value)}
                        error={validationErrors.bio}
                        helperText={t('employer.steps.business_info.description_helper', 'Tell workers about your business')}
                        className="h-20"
                        placeholder={t('employer.steps.business_info.description_placeholder', 'Briefly describe your business...')}
                    />
                </CardContent>
            </Card>
        </div>
    );
}


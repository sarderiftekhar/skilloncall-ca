import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, X, Calendar, CheckCircle, User, Phone, AlertCircle } from 'react-feather';

interface WorkHistoryStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    validationErrors: any;
    globalSkills: any[];
    globalIndustries: any[];
}

interface WorkExperience {
    id: string;
    company_name: string;
    job_title: string;
    start_date: string;
    end_date: string;
    is_current: boolean;
    description: string;
    supervisor_name?: string;
    supervisor_contact?: string;
    global_skill_id?: number;
    global_industry_id?: number;
}

interface Reference {
    id: string;
    reference_name: string;
    reference_phone: string;
    reference_email?: string;
    relationship: string;
    company_name?: string;
    notes?: string;
}

const RELATIONSHIP_OPTIONS = [
    { value: 'previous_employer', label: 'Previous Employer' },
    { value: 'previous_supervisor', label: 'Previous Supervisor' },
    { value: 'satisfied_client', label: 'Satisfied Client' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'business_partner', label: 'Business Partner' },
];

export default function WorkHistoryStep({
    formData,
    updateFormData,
    validationErrors,
    globalSkills = [],
    globalIndustries = []
}: WorkHistoryStepProps) {
    const [workExperiences, setWorkExperiences] = useState<WorkExperience[]>(
        formData.work_experiences || []
    );
    const [references, setReferences] = useState<Reference[]>(
        formData.references || []
    );

    // Work Experience Management
    const addWorkExperience = () => {
        const newExperience: WorkExperience = {
            id: Date.now().toString(),
            company_name: '',
            job_title: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            supervisor_name: '',
            supervisor_contact: '',
            global_skill_id: undefined,
            global_industry_id: undefined
        };

        const updated = [...workExperiences, newExperience];
        setWorkExperiences(updated);
        updateFormData({ work_experiences: updated });
    };

    const removeWorkExperience = (id: string) => {
        const updated = workExperiences.filter(exp => exp.id !== id);
        setWorkExperiences(updated);
        updateFormData({ work_experiences: updated });
    };

    const updateWorkExperience = (id: string, field: string, value: any) => {
        const updated = workExperiences.map(exp => 
            exp.id === id ? { ...exp, [field]: value } : exp
        );
        setWorkExperiences(updated);
        updateFormData({ work_experiences: updated });
    };

    // Reference Management
    const addReference = () => {
        const newReference: Reference = {
            id: Date.now().toString(),
            reference_name: '',
            reference_phone: '',
            reference_email: '',
            relationship: '',
            company_name: '',
            notes: ''
        };

        const updated = [...references, newReference];
        setReferences(updated);
        updateFormData({ references: updated });
    };

    const removeReference = (id: string) => {
        const updated = references.filter(ref => ref.id !== id);
        setReferences(updated);
        updateFormData({ references: updated });
    };

    const updateReference = (id: string, field: string, value: any) => {
        const updated = references.map(ref => 
            ref.id === id ? { ...ref, [field]: value } : ref
        );
        setReferences(updated);
        updateFormData({ references: updated });
    };

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4" 
                     style={{backgroundColor: '#FCF2F0'}}>
                    <Calendar className="h-8 w-8" style={{color: '#10B3D6'}} />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{color: '#192341'}}>
                    Your Work History
                </h2>
                <p className="text-gray-600 text-sm">
                    Tell us about your current job and past work experience. This helps employers understand your background.
                </p>
            </div>

            {/* Current Employment Status */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                        Employment Status <span className="text-red-500">*</span>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Required: Please select your current employment status
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                        <div
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                formData.employment_status === 'employed'
                                    ? 'border-[#10B3D6] bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => updateFormData({ employment_status: 'employed' })}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Currently Employed</p>
                                    <p className="text-sm text-gray-600">I have a job and want to pick up extra work</p>
                                </div>
                                {formData.employment_status === 'employed' && (
                                    <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                )}
                            </div>
                        </div>
                        
                        <div
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                formData.employment_status === 'unemployed'
                                    ? 'border-[#10B3D6] bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => updateFormData({ employment_status: 'unemployed' })}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Looking for Work</p>
                                    <p className="text-sm text-gray-600">I'm actively seeking employment opportunities</p>
                                </div>
                                {formData.employment_status === 'unemployed' && (
                                    <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                )}
                            </div>
                        </div>

                        <div
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                formData.employment_status === 'self_employed'
                                    ? 'border-[#10B3D6] bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                            }`}
                            onClick={() => updateFormData({ employment_status: 'self_employed' })}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-900">Self-Employed</p>
                                    <p className="text-sm text-gray-600">I run my own business or freelance</p>
                                </div>
                                {formData.employment_status === 'self_employed' && (
                                    <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center">
                            <Briefcase className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                            Work Experience <span className="text-red-500 ml-1">*</span>
                        </span>
                        <Button
                            onClick={addWorkExperience}
                            className="text-white cursor-pointer"
                            style={{backgroundColor: '#10B3D6', height: '2.7em'}}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Job
                        </Button>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Required: Add your current job and previous work experience. Include at least 2-3 jobs if you have them.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {workExperiences.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No work experience added yet</p>
                            <p className="text-sm">Add your current or most recent job to get started</p>
                        </div>
                    ) : (
                        workExperiences.map((experience, index) => (
                            <div key={experience.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                {/* Header with remove button */}
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">
                                        Job #{index + 1}
                                        {experience.is_current && (
                                            <Badge className="ml-2 text-xs" style={{backgroundColor: '#10B3D6', color: 'white'}}>
                                                Current Job
                                            </Badge>
                                        )}
                                    </h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeWorkExperience(experience.id)}
                                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {/* Company & Job Title */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Company Name *</Label>
                                            <Input
                                                value={experience.company_name}
                                                onChange={(e) => updateWorkExperience(experience.id, 'company_name', e.target.value)}
                                                placeholder="ABC Company Ltd."
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Job Title *</Label>
                                            <Input
                                                value={experience.job_title}
                                                onChange={(e) => updateWorkExperience(experience.id, 'job_title', e.target.value)}
                                                placeholder="Cook, Server, Cleaner, etc."
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Skill & Industry */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Main Skill Used (Optional)</Label>
                                            <Select
                                                value={experience.global_skill_id?.toString() || ''}
                                                onValueChange={(value) => updateWorkExperience(experience.id, 'global_skill_id', parseInt(value))}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select skill or skip if not listed" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">None / Skip</SelectItem>
                                                    {globalSkills.map((skill) => (
                                                        <SelectItem key={skill.id} value={skill.id.toString()}>
                                                            {skill.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-gray-500 mt-1">Select if your skill is in the list, or skip this</p>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Industry (Optional)</Label>
                                            <Select
                                                value={experience.global_industry_id?.toString() || ''}
                                                onValueChange={(value) => updateWorkExperience(experience.id, 'global_industry_id', parseInt(value))}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select industry or skip if not listed" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="">None / Skip</SelectItem>
                                                    {globalIndustries.map((industry) => (
                                                        <SelectItem key={industry.id} value={industry.id.toString()}>
                                                            {industry.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-gray-500 mt-1">Select if your industry is in the list, or skip this</p>
                                        </div>
                                    </div>

                                    {/* Current Job Toggle */}
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id={`current-${experience.id}`}
                                            checked={experience.is_current}
                                            onChange={(e) => {
                                                updateWorkExperience(experience.id, 'is_current', e.target.checked);
                                                if (e.target.checked) {
                                                    updateWorkExperience(experience.id, 'end_date', '');
                                                }
                                            }}
                                            className="h-4 w-4 text-blue-600 rounded"
                                        />
                                        <Label htmlFor={`current-${experience.id}`} className="text-sm">
                                            This is my current job
                                        </Label>
                                    </div>

                                    {/* Date Range */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Start Date *</Label>
                                            <Input
                                                type="date"
                                                value={experience.start_date}
                                                onChange={(e) => updateWorkExperience(experience.id, 'start_date', e.target.value)}
                                                className="mt-1"
                                                max={new Date().toISOString().split('T')[0]}
                                            />
                                        </div>
                                        {!experience.is_current && (
                                            <div>
                                                <Label className="text-sm font-medium">End Date *</Label>
                                                <Input
                                                    type="date"
                                                    value={experience.end_date}
                                                    onChange={(e) => updateWorkExperience(experience.id, 'end_date', e.target.value)}
                                                    className="mt-1"
                                                    min={experience.start_date}
                                                    max={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Job Description */}
                                    <div>
                                        <Label className="text-sm font-medium">What did you do in this job?</Label>
                                        <Textarea
                                            value={experience.description}
                                            onChange={(e) => updateWorkExperience(experience.id, 'description', e.target.value)}
                                            className="mt-1 h-20"
                                            placeholder="Describe your main responsibilities and achievements..."
                                            maxLength={300}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            {experience.description.length}/300
                                        </p>
                                    </div>

                                    {/* Supervisor Details (Optional) */}
                                    <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                                        <p className="text-sm font-medium text-gray-700">
                                            Supervisor Details (Optional - for references)
                                        </p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <Label className="text-sm">Supervisor Name</Label>
                                                <Input
                                                    value={experience.supervisor_name || ''}
                                                    onChange={(e) => updateWorkExperience(experience.id, 'supervisor_name', e.target.value)}
                                                    placeholder="Manager's full name"
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-sm">Supervisor Phone</Label>
                                                <Input
                                                    value={experience.supervisor_contact || ''}
                                                    onChange={(e) => updateWorkExperience(experience.id, 'supervisor_contact', e.target.value)}
                                                    placeholder="(416) 555-0123"
                                                    className="mt-1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {validationErrors.work_experiences && (
                        <p className="text-red-600 text-sm">{validationErrors.work_experiences}</p>
                    )}
                </CardContent>
            </Card>

            {/* Professional References */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center">
                            <User className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                            Professional References
                        </span>
                        <Button
                            onClick={addReference}
                            disabled={references.length >= 3}
                            className="text-white cursor-pointer"
                            style={{backgroundColor: '#10B3D6', height: '2.7em'}}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Reference
                        </Button>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Add 2-3 people who can speak about your work. These can be previous employers, supervisors, or satisfied clients.
                    </p>
                </CardHeader>
                <CardContent className="space-y-6">
                    {references.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                            <p>No references added yet</p>
                            <p className="text-sm">Add people who can vouch for your work quality</p>
                        </div>
                    ) : (
                        references.map((reference, index) => (
                            <div key={reference.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium text-gray-900">Reference #{index + 1}</h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeReference(reference.id)}
                                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {/* Name and Relationship */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Full Name *</Label>
                                            <Input
                                                value={reference.reference_name}
                                                onChange={(e) => updateReference(reference.id, 'reference_name', e.target.value)}
                                                placeholder="John Smith"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Relationship *</Label>
                                            <Select
                                                value={reference.relationship}
                                                onValueChange={(value) => updateReference(reference.id, 'relationship', value)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Select relationship" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {RELATIONSHIP_OPTIONS.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Contact Details */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Phone Number *</Label>
                                            <Input
                                                value={reference.reference_phone}
                                                onChange={(e) => updateReference(reference.id, 'reference_phone', e.target.value)}
                                                placeholder="(416) 555-0123"
                                                className="mt-1"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Email (Optional)</Label>
                                            <Input
                                                type="email"
                                                value={reference.reference_email || ''}
                                                onChange={(e) => updateReference(reference.id, 'reference_email', e.target.value)}
                                                placeholder="john.smith@company.com"
                                                className="mt-1"
                                            />
                                        </div>
                                    </div>

                                    {/* Company Name */}
                                    <div>
                                        <Label className="text-sm font-medium">Company Name (Optional)</Label>
                                        <Input
                                            value={reference.company_name || ''}
                                            onChange={(e) => updateReference(reference.id, 'company_name', e.target.value)}
                                            placeholder="ABC Company Ltd."
                                            className="mt-1"
                                        />
                                    </div>

                                    {/* Notes */}
                                    <div>
                                        <Label className="text-sm font-medium">Additional Notes (Optional)</Label>
                                        <Textarea
                                            value={reference.notes || ''}
                                            onChange={(e) => updateReference(reference.id, 'notes', e.target.value)}
                                            className="mt-1 h-16"
                                            placeholder="How do you know this person? What can they tell employers about your work?"
                                            maxLength={200}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            {(reference.notes || '').length}/200
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}

                    {validationErrors.references && (
                        <p className="text-red-600 text-sm">{validationErrors.references}</p>
                    )}
                </CardContent>
            </Card>

            {/* Reference Help */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Phone className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">About References</p>
                        <p className="text-blue-700 text-xs">
                            Good references include: previous bosses, supervisors, clients who were happy with your work, 
                            or coworkers who can speak about your skills. Make sure to ask their permission before adding them.
                        </p>
                    </div>
                </div>
            </div>

            {/* Validation Warning */}
            {(!formData.employment_status || !workExperiences.length) && (
                <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                        <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                            <p className="font-medium text-orange-800 mb-2">Required fields missing:</p>
                            <ul className="text-orange-700 text-xs space-y-1 list-disc list-inside">
                                {!formData.employment_status && (
                                    <li>Please select your Employment Status</li>
                                )}
                                {!workExperiences.length && (
                                    <li>Please add at least one Work Experience</li>
                                )}
                            </ul>
                            <p className="text-orange-700 text-xs mt-2">
                                You must complete these fields before you can continue to the next step.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, X, Edit, Save, User, Phone, Home, Calendar, CheckCircle } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface WorkHistoryTabProps {
    profile: any;
    onUpdate: (data: any) => void;
}

const EMPLOYMENT_STATUS_OPTIONS = [
    { value: 'employed', label: 'Currently Employed', description: 'I have a job and want to pick up extra work' },
    { value: 'unemployed', label: 'Looking for Work', description: 'I\'m actively seeking employment opportunities' },
    { value: 'self_employed', label: 'Self-Employed', description: 'I run my own business or freelance' }
];

const RELATIONSHIP_OPTION_DEFS = [
    { value: 'previous_employer', defaultLabel: 'Previous Employer' },
    { value: 'previous_supervisor', defaultLabel: 'Previous Supervisor' },
    { value: 'satisfied_client', defaultLabel: 'Satisfied Client' },
    { value: 'colleague', defaultLabel: 'Colleague' },
    { value: 'business_partner', defaultLabel: 'Business Partner' },
    { value: 'mentor', defaultLabel: 'Mentor' },
    { value: 'trainer', defaultLabel: 'Trainer' },
    { value: 'team_lead', defaultLabel: 'Team Lead' },
    { value: 'volunteer_coordinator', defaultLabel: 'Volunteer Coordinator' },
    { value: 'community_leader', defaultLabel: 'Community Leader' },
];

export default function WorkHistoryTab({ profile, onUpdate }: WorkHistoryTabProps) {
    const { t } = useTranslations();
    const [isEditingStatus, setIsEditingStatus] = useState(false);
    const [isEditingExperiences, setIsEditingExperiences] = useState(false);
    const [isEditingReferences, setIsEditingReferences] = useState(false);
    
    const [employmentStatus, setEmploymentStatus] = useState(profile?.employment_status || '');
    const [workExperiences, setWorkExperiences] = useState(profile?.work_experiences || []);
    const [references, setReferences] = useState(profile?.references || []);

    const relationshipOptions = RELATIONSHIP_OPTION_DEFS.map((option) => ({
        value: option.value,
        label: t(`work_history.relationships.${option.value}`, option.defaultLabel),
    }));

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.substring(0, 10);
        
        if (limited.length === 0) return '';
        if (limited.length <= 3) return `(${limited}`;
        if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
        return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    };

    const addWorkExperience = () => {
        const newExperience = {
            id: Date.now(),
            company_name: '',
            job_title: '',
            start_date: '',
            end_date: '',
            is_current: false,
            description: '',
            supervisor_name: '',
            supervisor_contact: ''
        };
        setWorkExperiences([...workExperiences, newExperience]);
    };

    const removeWorkExperience = (id: number) => {
        setWorkExperiences(workExperiences.filter((exp: any) => exp.id !== id));
    };

    const updateWorkExperience = (id: number, field: string, value: any) => {
        setWorkExperiences(workExperiences.map((exp: any) => 
            exp.id === id ? { ...exp, [field]: value } : exp
        ));
    };

    const addReference = () => {
        if (references.length >= 3) return;
        
        const newReference = {
            id: Date.now(),
            reference_name: '',
            reference_phone: '',
            reference_email: '',
            relationship: '',
            company_name: '',
            notes: ''
        };
        setReferences([...references, newReference]);
    };

    const removeReference = (id: number) => {
        setReferences(references.filter((ref: any) => ref.id !== id));
    };

    const updateReference = (id: number, field: string, value: any) => {
        setReferences(references.map((ref: any) => 
            ref.id === id ? { ...ref, [field]: value } : ref
        ));
    };

    const handleStatusSave = async () => {
        try {
            await onUpdate({ employment_status: employmentStatus });
            setIsEditingStatus(false);
        } catch (error) {
            console.error('Error updating employment status:', error);
        }
    };

    const handleExperiencesSave = async () => {
        try {
            await onUpdate({ work_experiences: workExperiences });
            setIsEditingExperiences(false);
        } catch (error) {
            console.error('Error updating work experiences:', error);
        }
    };

    const handleReferencesSave = async () => {
        try {
            await onUpdate({ references: references });
            setIsEditingReferences(false);
        } catch (error) {
            console.error('Error updating references:', error);
        }
    };

    const getEmploymentStatusLabel = (status: string) => {
        return EMPLOYMENT_STATUS_OPTIONS.find(option => option.value === status)?.label || status;
    };

    return (
        <div className="space-y-6">
            {/* Employment Status */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl" style={{ color: '#192341' }}>
                            Employment Status
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingStatus(!isEditingStatus)}
                            className="cursor-pointer"
                        >
                            {isEditingStatus ? (
                                <>
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditingStatus ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                                    <div
                                        key={option.value}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                            employmentStatus === option.value
                                                ? 'border-[#10B3D6] bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setEmploymentStatus(option.value)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{option.label}</p>
                                                <p className="text-sm text-gray-600">{option.description}</p>
                                            </div>
                                            {employmentStatus === option.value && (
                                                <CheckCircle className="h-5 w-5" style={{ color: '#10B3D6' }} />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setEmploymentStatus(profile?.employment_status || '');
                                        setIsEditingStatus(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleStatusSave}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {profile?.employment_status ? (
                                <div className="flex items-center space-x-3">
                                    <Briefcase className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-lg">
                                            {getEmploymentStatusLabel(profile.employment_status)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {EMPLOYMENT_STATUS_OPTIONS.find(option => option.value === profile.employment_status)?.description}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No employment status set</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Work Experience */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl" style={{ color: '#192341' }}>
                                Work Experience
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Your current and previous work history
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-sm">
                                {workExperiences.length} {workExperiences.length === 1 ? 'Job' : 'Jobs'}
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingExperiences(!isEditingExperiences)}
                                className="cursor-pointer"
                            >
                                {isEditingExperiences ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditingExperiences ? (
                        <div className="space-y-6">
                            {/* Add New Experience Button */}
                            <Button
                                onClick={addWorkExperience}
                                className="text-white cursor-pointer"
                                style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Work Experience
                            </Button>

                            {/* Work Experiences */}
                            <div className="space-y-6">
                                {workExperiences.map((experience: any, index: number) => (
                                    <div key={experience.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                        {/* Header with remove button */}
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium" style={{ color: '#192341' }}>
                                                Job #{index + 1}
                                                {experience.is_current && (
                                                    <Badge className="ml-2 text-xs" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                        Current Job
                                                    </Badge>
                                                )}
                                            </h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeWorkExperience(experience.id)}
                                                className="text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Company & Job Title */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-sm font-medium">Company Name *</Label>
                                                    <Input
                                                        value={experience.company_name || ''}
                                                        onChange={(e) => updateWorkExperience(experience.id, 'company_name', e.target.value)}
                                                        placeholder="ABC Company Ltd."
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium">Job Title *</Label>
                                                    <Input
                                                        value={experience.job_title || ''}
                                                        onChange={(e) => updateWorkExperience(experience.id, 'job_title', e.target.value)}
                                                        placeholder="Cook, Server, Cleaner, etc."
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>

                                            {/* Dates and Current Job */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                                                <div>
                                                    <Label className="text-sm font-medium">Start Date *</Label>
                                                    <Input
                                                        type="date"
                                                        value={experience.start_date || ''}
                                                        onChange={(e) => updateWorkExperience(experience.id, 'start_date', e.target.value)}
                                                        className="mt-1"
                                                        max={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium">End Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={experience.end_date || ''}
                                                        onChange={(e) => updateWorkExperience(experience.id, 'end_date', e.target.value)}
                                                        className="mt-1"
                                                        min={experience.start_date || ''}
                                                        max={new Date().toISOString().split('T')[0]}
                                                        disabled={experience.is_current}
                                                    />
                                                </div>
                                                <div className="flex items-center space-x-3 self-end h-[42px]">
                                                    <button
                                                        type="button"
                                                        onClick={() => updateWorkExperience(experience.id, 'is_current', !experience.is_current)}
                                                        className={`
                                                            relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer
                                                            ${experience.is_current ? 'bg-blue-600' : 'bg-gray-200'}
                                                        `}
                                                    >
                                                        <span
                                                            className={`
                                                                inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out
                                                                ${experience.is_current ? 'translate-x-6' : 'translate-x-1'}
                                                            `}
                                                        />
                                                    </button>
                                                    <span
                                                        onClick={() => updateWorkExperience(experience.id, 'is_current', !experience.is_current)}
                                                        className="text-sm cursor-pointer select-none"
                                                    >
                                                        Current job
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Job Description */}
                                            <div>
                                                <Label className="text-sm font-medium">Job Description</Label>
                                                <Textarea
                                                    value={experience.description || ''}
                                                    onChange={(e) => updateWorkExperience(experience.id, 'description', e.target.value)}
                                                    className="mt-1 h-20"
                                                    placeholder="Describe your main responsibilities and achievements..."
                                                    maxLength={300}
                                                />
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {(experience.description || '').length}/300
                                                </p>
                                            </div>

                                            {/* Supervisor Details */}
                                            <div className="bg-gray-50 p-3 rounded-lg space-y-3">
                                                <p className="text-sm font-medium text-gray-700">
                                                    Supervisor Details (Optional)
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
                                                            onChange={(e) => {
                                                                const formatted = formatPhoneNumber(e.target.value);
                                                                updateWorkExperience(experience.id, 'supervisor_contact', formatted);
                                                            }}
                                                            placeholder="(416) 555-0123"
                                                            className="mt-1"
                                                            maxLength={14}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {workExperiences.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No work experience added yet</p>
                                    <p className="text-sm">Add your current or most recent job to get started</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setWorkExperiences(profile?.work_experiences || []);
                                        setIsEditingExperiences(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleExperiencesSave}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Save className="w-4 w-4 mr-2" />
                                    Save Experience
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {workExperiences.length > 0 ? (
                                <div className="space-y-4">
                                    {workExperiences.map((experience: any) => (
                                        <div key={experience.id} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium" style={{ color: '#192341' }}>{experience.job_title}</h4>
                                                        {experience.is_current && (
                                                            <Badge className="text-xs" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                                Current
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 mb-2">{experience.company_name}</p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-4 h-4 mr-1" />
                                                            {experience.start_date} - {experience.is_current ? 'Present' : experience.end_date || 'Not specified'}
                                                        </div>
                                                    </div>
                                                    {experience.description && (
                                                        <p className="text-sm text-gray-600 mt-2">{experience.description}</p>
                                                    )}
                                                </div>
                                                <Home className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No work experience added yet</p>
                                    <p className="text-sm">Click "Edit" to add your work history</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Professional References */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl" style={{ color: '#192341' }}>
                                Professional References
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                People who can speak about your work (Maximum 3)
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-sm">
                                {references.length}/3 References
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingReferences(!isEditingReferences)}
                                className="cursor-pointer"
                            >
                                {isEditingReferences ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditingReferences ? (
                        <div className="space-y-6">
                            {/* Add New Reference Button */}
                            <Button
                                onClick={addReference}
                                disabled={references.length >= 3}
                                className="text-white cursor-pointer"
                                style={{ backgroundColor: references.length >= 3 ? '#ccc' : '#10B3D6', height: '2.7em' }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Reference {references.length >= 3 && '(Maximum reached)'}
                            </Button>

                            {/* References */}
                            <div className="space-y-6">
                                {references.map((reference: any, index: number) => (
                                    <div key={reference.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium" style={{ color: '#192341' }}>Reference #{index + 1}</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeReference(reference.id)}
                                                className="text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Name and Relationship */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-sm font-medium">Full Name</Label>
                                                    <Input
                                                        value={reference.reference_name || ''}
                                                        onChange={(e) => updateReference(reference.id, 'reference_name', e.target.value)}
                                                        placeholder="John Smith"
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium">Relationship</Label>
                                                    <Select
                                                        value={reference.relationship || ''}
                                                        onValueChange={(value) => updateReference(reference.id, 'relationship', value)}
                                                    >
                                                        <SelectTrigger className="mt-1">
                                                            <SelectValue placeholder="Select relationship" />
                                                        </SelectTrigger>
                                                    <SelectContent>
                                                        {relationshipOptions.map((option) => (
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
                                                    <Label className="text-sm font-medium">Phone Number</Label>
                                                    <Input
                                                        value={reference.reference_phone || ''}
                                                        onChange={(e) => {
                                                            const formatted = formatPhoneNumber(e.target.value);
                                                            updateReference(reference.id, 'reference_phone', formatted);
                                                        }}
                                                        placeholder="(416) 555-0123"
                                                        className="mt-1"
                                                        maxLength={14}
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
                                ))}
                            </div>

                            {references.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No references added yet</p>
                                    <p className="text-sm">Add people who can speak about your work quality</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setReferences(profile?.references || []);
                                        setIsEditingReferences(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleReferencesSave}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save References
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {references.length > 0 ? (
                                <div className="space-y-4">
                                    {references.map((reference: any, index: number) => (
                                        <div key={reference.id} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-start space-x-4">
                                                <User className="w-5 h-5 text-gray-400 mt-1" />
                                                <div className="flex-1">
                                                    <h4 className="font-medium" style={{ color: '#192341' }}>{reference.reference_name}</h4>
                                                    <p className="text-sm text-gray-600">{reference.relationship?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}</p>
                                                    {reference.company_name && (
                                                        <p className="text-sm text-gray-500">{reference.company_name}</p>
                                                    )}
                                                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                                        {reference.reference_phone && (
                                                            <div className="flex items-center">
                                                                <Phone className="w-4 h-4 mr-1" />
                                                                {reference.reference_phone}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <User className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No references added yet</p>
                                    <p className="text-sm">Click "Edit" to add professional references</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

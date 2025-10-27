import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Star, Plus, X, CheckCircle } from 'react-feather';

interface SkillsExperienceStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    validationErrors: any;
    globalSkills: any[];
}

const EXPERIENCE_LEVELS = [
    { value: 'beginner', label: 'Beginner (0-1 years)', description: 'Just starting out or some training' },
    { value: 'intermediate', label: 'Intermediate (1-3 years)', description: 'Some experience, can work independently' },
    { value: 'advanced', label: 'Advanced (3-5 years)', description: 'Very experienced, can train others' },
    { value: 'expert', label: 'Expert (5+ years)', description: 'Highly skilled, leadership experience' },
];

const PROFICIENCY_LEVELS = [
    { value: 'beginner', label: 'Learning', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'intermediate', label: 'Good', color: 'bg-blue-100 text-blue-800' },
    { value: 'advanced', label: 'Very Good', color: 'bg-green-100 text-green-800' },
    { value: 'expert', label: 'Expert', color: 'bg-purple-100 text-purple-800' },
];

const MAX_SKILLS = 10;

export default function SkillsExperienceStep({ 
    formData, 
    updateFormData, 
    validationErrors, 
    globalSkills = []
}: SkillsExperienceStepProps) {
    const [selectedSkills, setSelectedSkills] = useState<any[]>(formData.selected_skills || []);
    const [selectedSkillId, setSelectedSkillId] = useState<string>('');
    const [skillSearch, setSkillSearch] = useState<string>('');
    const [showSkillSuggestions, setShowSkillSuggestions] = useState<boolean>(false);
    const skillInputRef = React.useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    React.useEffect(() => {
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
        !selectedSkills.find(s => s.id === skill.id)
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
        if (!selectedSkillId) return;
        
        // Check if maximum skills limit is reached
        if (selectedSkills.length >= MAX_SKILLS) {
            return;
        }

        const skill = globalSkills.find(s => s.id.toString() === selectedSkillId);
        if (!skill || selectedSkills.find(s => s.id === skill.id)) return;

        const newSkill = {
            id: skill.id,
            name: skill.name,
            category: skill.category,
            proficiency_level: 'intermediate',
            is_primary: selectedSkills.length === 0 // First skill is primary
        };

        const updatedSkills = [...selectedSkills, newSkill];
        setSelectedSkills(updatedSkills);
        updateFormData({ selected_skills: updatedSkills });
        setSelectedSkillId('');
    };

    const removeSkill = (skillId: number) => {
        const updatedSkills = selectedSkills.filter(s => s.id !== skillId);
        
        // If we removed the primary skill, make the first remaining skill primary
        if (updatedSkills.length > 0 && !updatedSkills.find(s => s.is_primary)) {
            updatedSkills[0].is_primary = true;
        }
        
        setSelectedSkills(updatedSkills);
        updateFormData({ selected_skills: updatedSkills });
    };

    const updateSkillProficiency = (skillId: number, proficiency: string) => {
        const updatedSkills = selectedSkills.map(skill => 
            skill.id === skillId ? { ...skill, proficiency_level: proficiency } : skill
        );
        setSelectedSkills(updatedSkills);
        updateFormData({ selected_skills: updatedSkills });
    };

    const setPrimarySkill = (skillId: number) => {
        const updatedSkills = selectedSkills.map(skill => ({
            ...skill,
            is_primary: skill.id === skillId
        }));
        setSelectedSkills(updatedSkills);
        updateFormData({ selected_skills: updatedSkills });
    };

    const handleOverallExperience = (experience: string) => {
        updateFormData({ overall_experience: experience });
    };

    const getProficiencyColor = (level: string) => {
        return PROFICIENCY_LEVELS.find(p => p.value === level)?.color || 'bg-gray-100 text-gray-800';
    };

    const getProficiencyLabel = (level: string) => {
        return PROFICIENCY_LEVELS.find(p => p.value === level)?.label || level;
    };

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4" 
                     style={{backgroundColor: '#FCF2F0'}}>
                    <Briefcase className="h-8 w-8" style={{color: '#10B3D6'}} />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{color: '#192341'}}>
                    What Are Your Skills?
                </h2>
                <p className="text-gray-600 text-sm">
                    Tell us about your skills and experience level so employers can find the right person for their jobs.
                </p>
            </div>

            {/* Overall Experience Level */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Overall Work Experience</CardTitle>
                    <p className="text-sm text-gray-600">
                        How many years of work experience do you have in total?
                    </p>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 gap-3">
                        {EXPERIENCE_LEVELS.map((level) => (
                            <div
                                key={level.value}
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ease-in-out transform ${
                                    formData.overall_experience === level.value
                                        ? 'border-[#10B3D6] bg-blue-50 shadow-md scale-[1.02]'
                                        : 'border-gray-200 hover:border-[#10B3D6] hover:bg-blue-50/30 hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1'
                                }`}
                                onClick={() => handleOverallExperience(level.value)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="transition-transform duration-300 ease-in-out">
                                        <p className="font-medium text-gray-900 transition-colors duration-300">{level.label}</p>
                                        <p className="text-sm text-gray-600 transition-colors duration-300">{level.description}</p>
                                    </div>
                                    {formData.overall_experience === level.value && (
                                        <CheckCircle className="h-5 w-5 animate-in fade-in zoom-in duration-300" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {validationErrors.overall_experience && (
                        <p className="text-red-600 text-sm mt-2">{validationErrors.overall_experience}</p>
                    )}
                </CardContent>
            </Card>

            {/* Skills Selection */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-lg">Your Skills & Services</CardTitle>
                            <p className="text-sm text-gray-600">
                                Select the skills you have. You can choose multiple skills and set your experience level for each one.
                            </p>
                        </div>
                        <Badge 
                            variant="outline" 
                            className={`text-sm px-3 py-1 ${
                                selectedSkills.length >= MAX_SKILLS 
                                    ? 'border-red-500 text-red-600 bg-red-50' 
                                    : 'border-gray-300 text-gray-600'
                            }`}
                        >
                            {selectedSkills.length}/{MAX_SKILLS}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Maximum limit warning */}
                    {selectedSkills.length >= MAX_SKILLS && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <p className="text-sm text-orange-800">
                                <strong>Maximum limit reached:</strong> You can add up to {MAX_SKILLS} skills. Remove a skill to add a different one.
                            </p>
                        </div>
                    )}
                    
                    {/* Add New Skill */}
                    <div className="flex flex-col sm:flex-row gap-3">
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
                                    placeholder={
                                        selectedSkills.length >= MAX_SKILLS 
                                            ? `Maximum of ${MAX_SKILLS} skills reached` 
                                            : "Type to search skills..."
                                    }
                                    disabled={selectedSkills.length >= MAX_SKILLS}
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
                                                        const isDisabled = selectedSkills.find(s => s.id === skill.id);
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
                                
                                {/* No results message */}
                                {showSkillSuggestions && skillSearch && filteredSkills.length === 0 && (
                                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg p-3 text-sm text-gray-500">
                                        No skills found matching "{skillSearch}"
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button
                            onClick={() => {
                                addSkill();
                                setSkillSearch('');
                                setSelectedSkillId('');
                            }}
                            disabled={!selectedSkillId || selectedSkills.length >= MAX_SKILLS}
                            className={`text-white ${selectedSkills.length >= MAX_SKILLS ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            style={{backgroundColor: '#10B3D6', height: '2.7em'}}
                            title={selectedSkills.length >= MAX_SKILLS ? `Maximum of ${MAX_SKILLS} skills allowed` : 'Add skill to your profile'}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Skill
                        </Button>
                    </div>

                    {/* Selected Skills */}
                    <div className="space-y-3">
                        {selectedSkills.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                <p>No skills added yet</p>
                                <p className="text-sm">Add your first skill above to get started</p>
                            </div>
                        ) : (
                            selectedSkills.map((skill, index) => (
                                <div 
                                    key={skill.id} 
                                    className={`p-4 rounded-lg border-2 ${
                                        skill.is_primary ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                                                {skill.is_primary && (
                                                    <Badge className="text-xs px-2 py-0.5" style={{backgroundColor: '#10B3D6', color: 'white'}}>
                                                        Main Skill
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{skill.category}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSkill(skill.id)}
                                            className="text-gray-400 hover:text-red-500 cursor-pointer"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Proficiency Level */}
                                        <div>
                                            <Label className="text-sm font-medium mb-2 block">
                                                Your Experience Level
                                            </Label>
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                {PROFICIENCY_LEVELS.map((level) => (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        onClick={() => updateSkillProficiency(skill.id, level.value)}
                                                        className={`p-2 rounded-lg border-2 text-sm transition-all duration-200 ${
                                                            skill.proficiency_level === level.value
                                                                ? 'border-[#10B3D6] bg-blue-50 text-[#10B3D6] font-medium'
                                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                        }`}
                                                    >
                                                        {level.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Set as Primary Skill */}
                                        {!skill.is_primary && selectedSkills.length > 1 && (
                                            <div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPrimarySkill(skill.id)}
                                                    className="text-sm cursor-pointer"
                                                >
                                                    <Star className="h-4 w-4 mr-1" />
                                                    Make Main Skill
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Validation Error */}
                    {validationErrors.selected_skills && (
                        <p className="text-red-600 text-sm">{validationErrors.selected_skills}</p>
                    )}

                    {/* Skills Help */}
                    {selectedSkills.length > 0 && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm">
                                    <p className="font-medium text-green-800 mb-1">Great job!</p>
                                    <p className="text-green-700">
                                        You've added {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''}. 
                                        {selectedSkills.length === 1 && ' You can add more skills to get more job opportunities.'}
                                        {selectedSkills.length > 1 && ` Your main skill is "${selectedSkills.find(s => s.is_primary)?.name}".`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Professional Requirements Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-yellow-800 mb-1">Skills That May Need Licenses</p>
                        <p className="text-yellow-700 text-xs">
                            Some skills like food service, personal care, and trades may require certifications or licenses in Canada. 
                            We'll help you add those details in the next steps.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}



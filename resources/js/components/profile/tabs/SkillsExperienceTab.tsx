import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Star, Plus, X, Edit, Save, CheckCircle } from 'react-feather';

interface SkillsExperienceTabProps {
    profile: any;
    globalSkills?: any[];
    onUpdate: (data: any) => void;
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

export default function SkillsExperienceTab({ profile, globalSkills = [], onUpdate }: SkillsExperienceTabProps) {
    const [isEditingExperience, setIsEditingExperience] = useState(false);
    const [isEditingSkills, setIsEditingSkills] = useState(false);
    const [overallExperience, setOverallExperience] = useState(profile?.overall_experience || '');
    const [skillSearch, setSkillSearch] = useState('');
    const [showSkillSuggestions, setShowSkillSuggestions] = useState(false);
    const [selectedSkills, setSelectedSkills] = useState(profile?.skills || []);

    const handleExperienceSave = async () => {
        try {
            await onUpdate({ overall_experience: overallExperience });
            setIsEditingExperience(false);
        } catch (error) {
            console.error('Error updating experience:', error);
        }
    };

    const handleSkillsSave = async () => {
        try {
            await onUpdate({ skills: selectedSkills });
            setIsEditingSkills(false);
        } catch (error) {
            console.error('Error updating skills:', error);
        }
    };

    const addSkill = (skill: any) => {
        if (selectedSkills.find((s: any) => s.id === skill.id)) return;
        
        const newSkill = {
            id: skill.id,
            name: skill.name,
            category: skill.category,
            pivot: {
                proficiency_level: 'intermediate',
                is_primary: selectedSkills.length === 0
            }
        };
        
        setSelectedSkills([...selectedSkills, newSkill]);
        setSkillSearch('');
        setShowSkillSuggestions(false);
    };

    const removeSkill = (skillId: number) => {
        const updatedSkills = selectedSkills.filter((s: any) => s.id !== skillId);
        
        // If we removed the primary skill, make the first remaining skill primary
        if (updatedSkills.length > 0 && !updatedSkills.find((s: any) => s.pivot.is_primary)) {
            updatedSkills[0].pivot.is_primary = true;
        }
        
        setSelectedSkills(updatedSkills);
    };

    const updateSkillProficiency = (skillId: number, proficiency: string) => {
        const updatedSkills = selectedSkills.map((skill: any) => 
            skill.id === skillId 
                ? { ...skill, pivot: { ...skill.pivot, proficiency_level: proficiency } }
                : skill
        );
        setSelectedSkills(updatedSkills);
    };

    const setPrimarySkill = (skillId: number) => {
        const updatedSkills = selectedSkills.map((skill: any) => ({
            ...skill,
            pivot: { ...skill.pivot, is_primary: skill.id === skillId }
        }));
        setSelectedSkills(updatedSkills);
    };

    // Group skills by category for easier selection
    const skillsByCategory = globalSkills.reduce((acc: any, skill: any) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});

    const filteredSkills = globalSkills.filter(skill => 
        skill.name.toLowerCase().includes(skillSearch.toLowerCase()) &&
        !selectedSkills.find((s: any) => s.id === skill.id)
    ).slice(0, 15);

    // Group filtered skills by category
    const filteredSkillsByCategory = filteredSkills.reduce((acc: any, skill: any) => {
        if (!acc[skill.category]) {
            acc[skill.category] = [];
        }
        acc[skill.category].push(skill);
        return acc;
    }, {});

    const getExperienceLabel = (level: string) => {
        return EXPERIENCE_LEVELS.find(exp => exp.value === level)?.label || level;
    };

    const getProficiencyColor = (level: string) => {
        return PROFICIENCY_LEVELS.find(p => p.value === level)?.color || 'bg-gray-100 text-gray-800';
    };

    const getProficiencyLabel = (level: string) => {
        return PROFICIENCY_LEVELS.find(p => p.value === level)?.label || level;
    };

    return (
        <div className="space-y-6">
            {/* Overall Experience Level */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl" style={{ color: '#192341' }}>
                            Overall Work Experience
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setIsEditingExperience(!isEditingExperience)}
                            className="cursor-pointer"
                        >
                            {isEditingExperience ? (
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
                    {isEditingExperience ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-3">
                                {EXPERIENCE_LEVELS.map((level) => (
                                    <div
                                        key={level.value}
                                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                            overallExperience === level.value
                                                ? 'border-[#10B3D6] bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => setOverallExperience(level.value)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-900">{level.label}</p>
                                                <p className="text-sm text-gray-600">{level.description}</p>
                                            </div>
                                            {overallExperience === level.value && (
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
                                        setOverallExperience(profile?.overall_experience || '');
                                        setIsEditingExperience(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleExperienceSave}
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
                            {profile?.overall_experience ? (
                                <div className="flex items-center space-x-3">
                                    <Briefcase className="w-5 h-5 text-gray-400" />
                                    <div>
                                        <p className="font-medium text-lg">
                                            {getExperienceLabel(profile.overall_experience)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {EXPERIENCE_LEVELS.find(exp => exp.value === profile.overall_experience)?.description}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-500">No experience level set</p>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Skills & Services */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl" style={{ color: '#192341' }}>
                                Your Skills & Services
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                The skills you offer to employers
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-sm">
                                {selectedSkills.length} Skills
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingSkills(!isEditingSkills)}
                                className="cursor-pointer"
                            >
                                {isEditingSkills ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Skills
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditingSkills ? (
                        <div className="space-y-6">
                            {/* Add New Skill */}
                            <div className="relative">
                                <Label className="text-sm font-medium mb-2 block">Add New Skill</Label>
                                <div className="flex space-x-3">
                                    <div className="flex-1 relative">
                                        <Input
                                            type="text"
                                            value={skillSearch}
                                            onChange={(e) => {
                                                setSkillSearch(e.target.value);
                                                setShowSkillSuggestions(true);
                                            }}
                                            onFocus={() => setShowSkillSuggestions(true)}
                                            placeholder="Type to search skills..."
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
                                                                const isDisabled = selectedSkills.find((s: any) => s.id === skill.id);
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
                                                                                addSkill(skill);
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
                                                                    onClick={() => addSkill(skill)}
                                                                >
                                                                    {skill.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                                )}
                                                
                                                {/* No results message with option to add custom skill */}
                                                {skillSearch && filteredSkills.length === 0 && (
                                                    <div className="p-3">
                                                        <p className="text-sm text-gray-500 mb-2">
                                                            No skills found matching "{skillSearch}"
                                                        </p>
                                                        <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                                                            Note: Custom skills can be added by typing the skill name
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Selected Skills */}
                            <div className="space-y-4">
                                {selectedSkills.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                        <p>No skills added yet</p>
                                        <p className="text-sm">Search and add your skills above</p>
                                    </div>
                                ) : (
                                    selectedSkills.map((skill: any) => (
                                        <div 
                                            key={skill.id} 
                                            className={`p-4 rounded-lg border-2 ${
                                                skill.pivot?.is_primary ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium text-gray-900">{skill.name}</h4>
                                                        {skill.pivot?.is_primary && (
                                                            <Badge className="text-xs px-2 py-0.5" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                                Primary Skill
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
                                                                className={`p-2 rounded-lg border-2 text-sm transition-all duration-200 cursor-pointer ${
                                                                    skill.pivot?.proficiency_level === level.value
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
                                                {!skill.pivot?.is_primary && selectedSkills.length > 1 && (
                                                    <div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setPrimarySkill(skill.id)}
                                                            className="text-sm cursor-pointer"
                                                        >
                                                            <Star className="h-4 w-4 mr-1" />
                                                            Make Primary Skill
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSelectedSkills(profile?.skills || []);
                                        setIsEditingSkills(false);
                                        setSkillSearch('');
                                        setShowSkillSuggestions(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSkillsSave}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Skills
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {selectedSkills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedSkills.map((skill: any) => (
                                        <div
                                            key={skill.id}
                                            className={`p-3 rounded-lg border ${
                                                skill.pivot?.is_primary ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200 bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">{skill.name}</h4>
                                                {skill.pivot?.is_primary && (
                                                    <Star className="h-4 w-4" style={{ color: '#10B3D6' }} />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 mb-2">{skill.category}</p>
                                            <Badge 
                                                className={`text-xs ${getProficiencyColor(skill.pivot?.proficiency_level || 'intermediate')}`}
                                            >
                                                {getProficiencyLabel(skill.pivot?.proficiency_level || 'intermediate')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No skills added yet</p>
                                    <p className="text-sm">Click "Edit Skills" to add your skills and services</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

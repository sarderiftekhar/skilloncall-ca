import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, Plus, X, Edit, Save, Star } from 'react-feather';

interface LanguagesTabProps {
    profile: any;
    globalLanguages?: any[];
    onUpdate: (data: any) => void;
}

const PROFICIENCY_LEVELS = [
    { value: 'basic', label: 'Basic', description: 'Simple conversations', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'conversational', label: 'Conversational', description: 'Can discuss work topics', color: 'bg-blue-100 text-blue-800' },
    { value: 'fluent', label: 'Fluent', description: 'Very comfortable speaking', color: 'bg-green-100 text-green-800' },
    { value: 'native', label: 'Native', description: 'First language', color: 'bg-purple-100 text-purple-800' },
];

export default function LanguagesTab({ profile, globalLanguages = [], onUpdate }: LanguagesTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [languageSearch, setLanguageSearch] = useState('');
    const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);
    const [selectedLanguages, setSelectedLanguages] = useState(profile?.languages || []);
    const languageInputRef = useRef<HTMLDivElement>(null);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageInputRef.current && !languageInputRef.current.contains(event.target as Node)) {
                setShowLanguageSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Deduplicate languages by name since there might be duplicates
    const uniqueLanguages = globalLanguages.reduce((acc: any[], lang: any) => {
        if (!acc.find(l => l.name.toLowerCase() === lang.name.toLowerCase())) {
            acc.push(lang);
        }
        return acc;
    }, []);

    const handleSave = async () => {
        try {
            await onUpdate({ languages: selectedLanguages });
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating languages:', error);
        }
    };

    const addLanguage = (language: any) => {
        if (selectedLanguages.find((l: any) => l.id === language.id)) return;
        
        const newLanguage = {
            id: language.id,
            name: language.name,
            is_official_canada: language.is_official_canada,
            pivot: {
                proficiency_level: 'conversational',
                is_primary: selectedLanguages.length === 0
            }
        };
        
        setSelectedLanguages([...selectedLanguages, newLanguage]);
        setLanguageSearch('');
        setShowLanguageSuggestions(false);
    };

    const removeLanguage = (languageId: number) => {
        const updatedLanguages = selectedLanguages.filter((l: any) => l.id !== languageId);
        
        // If we removed the primary language, make the first remaining language primary
        if (updatedLanguages.length > 0 && !updatedLanguages.find((l: any) => l.pivot.is_primary)) {
            updatedLanguages[0].pivot.is_primary = true;
        }
        
        setSelectedLanguages(updatedLanguages);
    };

    const updateLanguageProficiency = (languageId: number, proficiency: string) => {
        const updatedLanguages = selectedLanguages.map((language: any) => 
            language.id === languageId 
                ? { ...language, pivot: { ...language.pivot, proficiency_level: proficiency } }
                : language
        );
        setSelectedLanguages(updatedLanguages);
    };

    const setPrimaryLanguage = (languageId: number) => {
        const updatedLanguages = selectedLanguages.map((language: any) => ({
            ...language,
            pivot: { ...language.pivot, is_primary: language.id === languageId }
        }));
        setSelectedLanguages(updatedLanguages);
    };

    const filteredLanguages = uniqueLanguages.filter(lang => 
        lang.name.toLowerCase().includes(languageSearch.toLowerCase()) &&
        !selectedLanguages.find((l: any) => l.id === lang.id)
    ).slice(0, 15);

    const getProficiencyColor = (level: string) => {
        return PROFICIENCY_LEVELS.find(p => p.value === level)?.color || 'bg-gray-100 text-gray-800';
    };

    const getProficiencyLabel = (level: string) => {
        return PROFICIENCY_LEVELS.find(p => p.value === level)?.label || level;
    };

    return (
        <div className="space-y-6">
            {/* Languages Section */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl" style={{ color: '#192341' }}>
                                Languages
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Languages you can speak and understand
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-sm">
                                {selectedLanguages.length} {selectedLanguages.length === 1 ? 'Language' : 'Languages'}
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditing(!isEditing)}
                                className="cursor-pointer"
                            >
                                {isEditing ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Languages
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <div className="space-y-6">
                            {/* Add New Language */}
                            <div className="relative" ref={languageInputRef}>
                                <Label className="text-sm font-medium mb-2 block">Add New Language</Label>
                                <div className="flex space-x-3">
                                    <div className="flex-1 relative">
                                        <Input
                                            type="text"
                                            value={languageSearch}
                                            onChange={(e) => {
                                                setLanguageSearch(e.target.value);
                                                setShowLanguageSuggestions(true);
                                            }}
                                            onFocus={() => setShowLanguageSuggestions(true)}
                                            placeholder="Type to search languages..."
                                            className="w-full"
                                        />
                                        
                                        {/* Suggestions dropdown */}
                                        {showLanguageSuggestions && (languageSearch.length > 0 ? filteredLanguages.length > 0 : uniqueLanguages.length > 0) && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                                {languageSearch.length === 0 ? (
                                                    /* Show all languages when no search */
                                                    <>
                                                        {/* Official Languages First */}
                                                        <div className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 sticky top-0">
                                                            Official Languages of Canada
                                                        </div>
                                                        {uniqueLanguages
                                                            .filter(lang => lang.is_official_canada && !selectedLanguages.find((l: any) => l.id === lang.id))
                                                            .map((language) => (
                                                                <div
                                                                    key={language.id}
                                                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-900 font-medium"
                                                                    onClick={() => addLanguage(language)}
                                                                >
                                                                    <div className="flex justify-between items-center">
                                                                        <span>{language.name}</span>
                                                                        <Badge className="text-xs" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                                            Official
                                                                        </Badge>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                        
                                                        {/* Other Languages */}
                                                        <div className="px-3 py-2 text-sm font-semibold text-gray-700 bg-gray-50 sticky top-0">
                                                            Other Languages
                                                        </div>
                                                        {uniqueLanguages
                                                            .filter(lang => !lang.is_official_canada && !selectedLanguages.find((l: any) => l.id === lang.id))
                                                            .map((language) => (
                                                                <div
                                                                    key={language.id}
                                                                    className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-900"
                                                                    onClick={() => addLanguage(language)}
                                                                >
                                                                    {language.name}
                                                                </div>
                                                            ))
                                                        }
                                                    </>
                                                ) : (
                                                    /* Show filtered languages when searching */
                                                    filteredLanguages.length > 0 ? (
                                                        filteredLanguages.map((language) => (
                                                            <div
                                                                key={language.id}
                                                                className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-900"
                                                                onClick={() => addLanguage(language)}
                                                            >
                                                                <div className="flex justify-between items-center">
                                                                    <span className="font-medium">{language.name}</span>
                                                                    {language.is_official_canada && (
                                                                        <Badge className="text-xs" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                                            Official
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="px-3 py-2 text-sm text-gray-500">
                                                            No languages found matching "{languageSearch}"
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Selected Languages */}
                            <div className="space-y-4">
                                {selectedLanguages.length === 0 ? (
                                    <div className="text-center py-8 text-gray-500">
                                        <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                        <p>No languages added yet</p>
                                        <p className="text-sm">Search and add the languages you speak above</p>
                                    </div>
                                ) : (
                                    selectedLanguages.map((language: any) => (
                                        <div 
                                            key={language.id} 
                                            className={`p-4 rounded-lg border-2 ${
                                                language.pivot?.is_primary ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium text-gray-900">{language.name}</h4>
                                                        {language.pivot?.is_primary && (
                                                            <Badge className="text-xs px-2 py-0.5" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                                Primary Language
                                                            </Badge>
                                                        )}
                                                        {language.is_official_canada && (
                                                            <Badge variant="outline" className="text-xs px-2 py-0.5 border-green-500 text-green-700">
                                                                Official Language
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeLanguage(language.id)}
                                                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Proficiency Level */}
                                                <div>
                                                    <Label className="text-sm font-medium mb-2 block">
                                                        Proficiency Level
                                                    </Label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                                        {PROFICIENCY_LEVELS.map((level) => (
                                                            <button
                                                                key={level.value}
                                                                type="button"
                                                                onClick={() => updateLanguageProficiency(language.id, level.value)}
                                                                className={`p-3 rounded-lg border-2 text-sm transition-all duration-200 cursor-pointer ${
                                                                    language.pivot?.proficiency_level === level.value
                                                                        ? 'border-[#10B3D6] bg-blue-50 text-[#10B3D6] font-medium'
                                                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                                }`}
                                                                title={level.description}
                                                            >
                                                                <div className="text-center">
                                                                    <div className="font-medium">{level.label}</div>
                                                                    <div className="text-xs text-gray-500 mt-1">{level.description}</div>
                                                                </div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Set as Primary Language */}
                                                {!language.pivot?.is_primary && selectedLanguages.length > 1 && (
                                                    <div>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setPrimaryLanguage(language.id)}
                                                            className="text-sm cursor-pointer"
                                                        >
                                                            <Star className="h-4 w-4 mr-1" />
                                                            Make Primary Language
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
                                        setSelectedLanguages(profile?.languages || []);
                                        setIsEditing(false);
                                        setLanguageSearch('');
                                        setShowLanguageSuggestions(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Languages
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {selectedLanguages.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {selectedLanguages.map((language: any) => (
                                        <div
                                            key={language.id}
                                            className={`p-4 rounded-lg border ${
                                                language.pivot?.is_primary ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200 bg-gray-50'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-medium text-gray-900">{language.name}</h4>
                                                <div className="flex items-center space-x-1">
                                                    {language.pivot?.is_primary && (
                                                        <Star className="h-4 w-4" style={{ color: '#10B3D6' }} />
                                                    )}
                                                    {language.is_official_canada && (
                                                        <Badge variant="outline" className="text-xs border-green-500 text-green-700">
                                                            Official
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <Badge 
                                                className={`text-xs ${getProficiencyColor(language.pivot?.proficiency_level || 'conversational')}`}
                                            >
                                                {getProficiencyLabel(language.pivot?.proficiency_level || 'conversational')}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Globe className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No languages added yet</p>
                                    <p className="text-sm">Click "Edit Languages" to add the languages you speak</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Language Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Globe className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-blue-800 mb-1">Language Tips</p>
                        <ul className="text-blue-700 text-xs space-y-1 list-disc list-inside">
                            <li>Canada's official languages (English and French) are highlighted</li>
                            <li>Be honest about your proficiency level - employers appreciate accuracy</li>
                            <li>Your primary language should be the one you're most comfortable working in</li>
                            <li>Bilingual workers often have more job opportunities in Canada</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { CheckCircle, Clock, Globe, Plus, Star, X } from 'react-feather';

interface GlobeAvailabilityStepProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateFormData: (data: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validationErrors: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalLanguages: any[];
}

interface SelectedLanguage {
    id: number;
    name: string;
    code: string;
    proficiency_level: string;
    is_primary_language: boolean;
    is_official_canada: boolean;
}

interface AvailabilitySlot {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
    rate_multiplier: number;
}

const PROFICIENCY_LEVELS = [
    { value: 'basic', label: 'Basic', description: 'Simple conversations' },
    { value: 'conversational', label: 'Conversational', description: 'Can discuss work topics' },
    { value: 'fluent', label: 'Fluent', description: 'Speak easily and clearly' },
    { value: 'native', label: 'Native', description: 'First language' },
];

const DAYS_OF_WEEK = [
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
    { value: 0, label: 'Sunday', short: 'Sun' },
];

const TIME_SLOTS = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
];

export default function GlobeAvailabilityStep({ formData, updateFormData, validationErrors, globalLanguages = [] }: GlobeAvailabilityStepProps) {
    const [selectedGlobe, setSelectedGlobe] = useState<SelectedLanguage[]>(formData.selected_languages || []);
    const [availability, setAvailability] = useState<AvailabilitySlot[]>(() => {
        if (formData.availability && formData.availability.length > 0) {
            return formData.availability;
        }
        return DAYS_OF_WEEK.map((day) => ({
            day_of_week: day.value,
            start_time: '09:00',
            end_time: '17:00',
            is_available: day.value >= 1 && day.value <= 5, // Weekdays default available
            rate_multiplier: day.value === 0 || day.value === 6 ? 1.25 : 1.0, // Weekend premium
        }));
    });
    const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
    const [quickSchedule, setQuickSchedule] = useState<string>('');

    // Sync availability with form data and ensure it's initialized
    useEffect(() => {
        if (formData.availability && formData.availability.length > 0) {
            setAvailability(formData.availability);
        } else if (!formData.availability || formData.availability.length === 0) {
            // Initialize with default availability if not set
            const defaultAvailability = DAYS_OF_WEEK.map((day) => ({
                day_of_week: day.value,
                start_time: '09:00',
                end_time: '17:00',
                is_available: day.value >= 1 && day.value <= 5, // Weekdays default available
                rate_multiplier: day.value === 0 || day.value === 6 ? 1.25 : 1.0, // Weekend premium
            }));
            setAvailability(defaultAvailability);
            updateFormData({ availability: defaultAvailability });
        }
    }, [formData.availability, updateFormData]);

    // Language Management
    const addLanguage = () => {
        if (!selectedLanguageId) return;

        const language = globalLanguages.find((l) => l.id.toString() === selectedLanguageId);
        if (!language || selectedGlobe.find((l) => l.id === language.id)) return;

        const newLanguage: SelectedLanguage = {
            id: language.id,
            name: language.name,
            code: language.code,
            is_official_canada: language.is_official_canada,
            proficiency_level: language.is_official_canada ? 'fluent' : 'conversational',
            is_primary_language: selectedGlobe.length === 0,
        };

        const updatedGlobe = [...selectedGlobe, newLanguage];
        setSelectedGlobe(updatedGlobe);
        updateFormData({ selected_languages: updatedGlobe });
        setSelectedLanguageId('');
    };

    const removeLanguage = (languageId: number) => {
        const updatedGlobe = selectedGlobe.filter((l) => l.id !== languageId);

        // If we removed the primary language, make the first remaining language primary
        if (updatedGlobe.length > 0 && !updatedGlobe.find((l) => l.is_primary_language)) {
            updatedGlobe[0].is_primary_language = true;
        }

        setSelectedGlobe(updatedGlobe);
        updateFormData({ selected_languages: updatedGlobe });
    };

    const updateLanguageProficiency = (languageId: number, proficiency: string) => {
        const updatedGlobe = selectedGlobe.map((lang) => (lang.id === languageId ? { ...lang, proficiency_level: proficiency } : lang));
        setSelectedGlobe(updatedGlobe);
        updateFormData({ selected_languages: updatedGlobe });
    };

    const setPrimaryLanguage = (languageId: number) => {
        const updatedGlobe = selectedGlobe.map((lang) => ({
            ...lang,
            is_primary_language: lang.id === languageId,
        }));
        setSelectedGlobe(updatedGlobe);
        updateFormData({ selected_languages: updatedGlobe });
    };

    // Availability Management
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateAvailability = (dayOfWeek: number, field: string, value: any) => {
        const updatedAvailability = availability.map((slot) => (slot.day_of_week === dayOfWeek ? { ...slot, [field]: value } : slot));
        setAvailability(updatedAvailability);
        updateFormData({ availability: updatedAvailability });
    };

    const toggleDayAvailability = (dayOfWeek: number) => {
        updateAvailability(dayOfWeek, 'is_available', !availability.find((a) => a.day_of_week === dayOfWeek)?.is_available);
    };

    const handleQuickSchedule = (schedule: string) => {
        let updatedAvailability;

        switch (schedule) {
            case 'weekdays':
                updatedAvailability = availability.map((slot) => ({
                    ...slot,
                    is_available: slot.day_of_week >= 1 && slot.day_of_week <= 5,
                    start_time: '09:00',
                    end_time: '17:00',
                }));
                break;
            case 'evenings':
                updatedAvailability = availability.map((slot) => ({
                    ...slot,
                    is_available: true,
                    start_time: '18:00',
                    end_time: '22:00',
                }));
                break;
            case 'weekends':
                updatedAvailability = availability.map((slot) => ({
                    ...slot,
                    is_available: slot.day_of_week === 0 || slot.day_of_week === 6,
                    start_time: '10:00',
                    end_time: '18:00',
                }));
                break;
            case 'flexible':
                updatedAvailability = availability.map((slot) => ({
                    ...slot,
                    is_available: true,
                    start_time: '08:00',
                    end_time: '20:00',
                }));
                break;
            default:
                return;
        }

        setAvailability(updatedAvailability);
        updateFormData({ availability: updatedAvailability });
        setQuickSchedule(schedule);
    };

    const getProficiencyColor = (level: string) => {
        const colors = {
            basic: 'bg-yellow-100 text-yellow-800',
            conversational: 'bg-blue-100 text-blue-800',
            fluent: 'bg-green-100 text-green-800',
            native: 'bg-purple-100 text-purple-800',
        };
        return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const getAvailableHours = () => {
        const availableSlots = availability.filter((slot) => slot.is_available);
        const totalHours = availableSlots.reduce((total, slot) => {
            const start = new Date(`2000-01-01 ${slot.start_time}`);
            const end = new Date(`2000-01-01 ${slot.end_time}`);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return total + hours;
        }, 0);

        return totalHours;
    };

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#FCF2F0' }}>
                    <Globe className="h-8 w-8" style={{ color: '#10B3D6' }} />
                </div>
                <h2 className="mb-2 text-xl font-bold" style={{ color: '#192341' }}>
                    Globe & Schedule
                </h2>
                <p className="text-sm text-gray-600">Tell us what languages you speak and when you're available to work.</p>
            </div>

            {/* Globe */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Globe className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                        Globe You Speak
                    </CardTitle>
                    <p className="text-sm text-gray-600">Speaking multiple languages helps you work with more employers and clients.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Add Language */}
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="flex-1">
                            <Select value={selectedLanguageId} onValueChange={setSelectedLanguageId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a language to add" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* Official Canadian Languages First */}
                                    <div className="bg-gray-50 px-2 py-1 text-sm font-medium text-gray-500">Official Canadian Languages</div>
                                    {globalLanguages
                                        .filter((lang) => lang.is_official_canada)
                                        .map((language) => (
                                            <SelectItem
                                                key={language.id}
                                                value={language.id.toString()}
                                                disabled={!!selectedGlobe.find((l) => l.id === language.id)}
                                            >
                                                {language.name} (Official)
                                            </SelectItem>
                                        ))}

                                    <div className="bg-gray-50 px-2 py-1 text-sm font-medium text-gray-500">Other Languages</div>
                                    {globalLanguages
                                        .filter((lang) => !lang.is_official_canada)
                                        .map((language) => (
                                            <SelectItem
                                                key={language.id}
                                                value={language.id.toString()}
                                                disabled={!!selectedGlobe.find((l) => l.id === language.id)}
                                            >
                                                {language.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={addLanguage}
                            disabled={!selectedLanguageId}
                            className="cursor-pointer text-white"
                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Language
                        </Button>
                    </div>

                    {/* Selected Globe */}
                    <div className="space-y-3">
                        {selectedGlobe.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <Globe className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                <p>No languages added yet</p>
                                <p className="text-sm">Add at least English or French to continue</p>
                            </div>
                        ) : (
                            selectedGlobe.map((language) => (
                                <div
                                    key={language.id}
                                    className={`rounded-lg border-2 p-4 ${
                                        language.is_primary_language ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200'
                                    }`}
                                >
                                    <div className="mb-3 flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="mb-1 flex items-center gap-2">
                                                <h4 className="font-medium text-gray-900">{language.name}</h4>
                                                {language.is_official_canada && (
                                                    <Badge className="px-2 py-0.5 text-xs" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                        Official
                                                    </Badge>
                                                )}
                                                {language.is_primary_language && (
                                                    <Badge className="px-2 py-0.5 text-xs" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                        Primary
                                                    </Badge>
                                                )}
                                            </div>
                                            <Badge className={`px-2 py-1 text-xs ${getProficiencyColor(language.proficiency_level)}`}>
                                                {PROFICIENCY_LEVELS.find((p) => p.value === language.proficiency_level)?.label}
                                            </Badge>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeLanguage(language.id)}
                                            className="cursor-pointer text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Proficiency Level */}
                                        <div>
                                            <Label className="mb-2 block text-sm font-medium">How well do you speak {language.name}?</Label>
                                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                                {PROFICIENCY_LEVELS.map((level) => (
                                                    <button
                                                        key={level.value}
                                                        type="button"
                                                        onClick={() => updateLanguageProficiency(language.id, level.value)}
                                                        className={`rounded-lg border-2 p-2 text-sm transition-all duration-200 ${
                                                            language.proficiency_level === level.value
                                                                ? 'border-[#10B3D6] bg-blue-50 font-medium text-[#10B3D6]'
                                                                : 'border-gray-200 text-gray-700 hover:border-gray-300'
                                                        }`}
                                                        title={level.description}
                                                    >
                                                        {level.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Set as Primary Language */}
                                        {!language.is_primary_language && selectedGlobe.length > 1 && (
                                            <div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setPrimaryLanguage(language.id)}
                                                    className="cursor-pointer text-sm"
                                                >
                                                    <Star className="mr-1 h-4 w-4" />
                                                    Make Primary Language
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {validationErrors.selected_languages && <p className="text-sm text-red-600">{validationErrors.selected_languages}</p>}

                    {/* Language Help */}
                    {selectedGlobe.length > 0 && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                <div className="text-sm">
                                    <p className="mb-1 font-medium text-green-800">
                                        Great! You speak {selectedGlobe.length} language{selectedGlobe.length > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-xs text-green-700">
                                        {selectedGlobe.find((l) => l.is_official_canada)
                                            ? 'Speaking an official Canadian language opens up more job opportunities.'
                                            : 'Consider adding English or French to reach more employers.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Availability Schedule */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Clock className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                        When Are You Available?
                    </CardTitle>
                    <p className="text-sm text-gray-600">Set your general availability. You can always negotiate specific times with employers.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Quick Schedule Options */}
                    <div>
                        <Label className="mb-3 block text-sm font-medium">Quick Schedule Options</Label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            <Button
                                variant="outline"
                                onClick={() => handleQuickSchedule('weekdays')}
                                className={`h-auto cursor-pointer py-3 text-sm ${quickSchedule === 'weekdays' ? 'border-[#10B3D6] bg-blue-50' : ''}`}
                            >
                                <div className="text-center">
                                    <div className="font-medium">Weekdays</div>
                                    <div className="text-xs text-gray-500">Mon-Fri 9-5</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleQuickSchedule('evenings')}
                                className={`h-auto cursor-pointer py-3 text-sm ${quickSchedule === 'evenings' ? 'border-[#10B3D6] bg-blue-50' : ''}`}
                            >
                                <div className="text-center">
                                    <div className="font-medium">Evenings</div>
                                    <div className="text-xs text-gray-500">Daily 6-10PM</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleQuickSchedule('weekends')}
                                className={`h-auto cursor-pointer py-3 text-sm ${quickSchedule === 'weekends' ? 'border-[#10B3D6] bg-blue-50' : ''}`}
                            >
                                <div className="text-center">
                                    <div className="font-medium">Weekends</div>
                                    <div className="text-xs text-gray-500">Sat-Sun 10-6</div>
                                </div>
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleQuickSchedule('flexible')}
                                className={`h-auto cursor-pointer py-3 text-sm ${quickSchedule === 'flexible' ? 'border-[#10B3D6] bg-blue-50' : ''}`}
                            >
                                <div className="text-center">
                                    <div className="font-medium">Very Flexible</div>
                                    <div className="text-xs text-gray-500">Daily 8-8</div>
                                </div>
                            </Button>
                        </div>
                    </div>

                    {/* Custom Schedule */}
                    <div>
                        <Label className="mb-3 block text-sm font-medium">Custom Schedule (Tap days to toggle availability)</Label>
                        <div className="space-y-3">
                            {DAYS_OF_WEEK.map((day) => {
                                const daySchedule = availability.find((a) => a.day_of_week === day.value) || {
                                    day_of_week: day.value,
                                    start_time: '09:00',
                                    end_time: '17:00',
                                    is_available: day.value >= 1 && day.value <= 5,
                                    rate_multiplier: day.value === 0 || day.value === 6 ? 1.25 : 1.0,
                                };

                                return (
                                    <div
                                        key={day.value}
                                        className={`rounded-lg border-2 p-3 transition-all duration-200 ${
                                            daySchedule.is_available ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200 bg-gray-50'
                                        }`}
                                    >
                                        <div className="mb-2 flex items-center justify-between">
                                            <button
                                                type="button"
                                                onClick={() => toggleDayAvailability(day.value)}
                                                className="flex cursor-pointer items-center"
                                            >
                                                <div
                                                    className={`mr-3 flex h-5 w-5 items-center justify-center rounded border-2 ${
                                                        daySchedule.is_available ? 'border-[#10B3D6] bg-[#10B3D6]' : 'border-gray-300'
                                                    }`}
                                                >
                                                    {daySchedule.is_available && <CheckCircle className="h-3 w-3 text-white" />}
                                                </div>
                                                <span className={`font-medium ${daySchedule.is_available ? 'text-gray-900' : 'text-gray-500'}`}>
                                                    {day.label}
                                                </span>
                                                {(day.value === 0 || day.value === 6) && daySchedule.rate_multiplier > 1 && (
                                                    <Badge className="ml-2 text-xs" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                        +{Math.round((daySchedule.rate_multiplier - 1) * 100)}%
                                                    </Badge>
                                                )}
                                            </button>
                                        </div>

                                        {daySchedule.is_available && (
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-gray-600">Start Time</Label>
                                                    <Select
                                                        value={daySchedule.start_time}
                                                        onValueChange={(value) => updateAvailability(day.value, 'start_time', value)}
                                                    >
                                                        <SelectTrigger className="h-8 text-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_SLOTS.map((time) => (
                                                                <SelectItem key={time} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <Label className="text-xs text-gray-600">End Time</Label>
                                                    <Select
                                                        value={daySchedule.end_time}
                                                        onValueChange={(value) => updateAvailability(day.value, 'end_time', value)}
                                                    >
                                                        <SelectTrigger className="h-8 text-sm">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {TIME_SLOTS.filter((time) => time > daySchedule.start_time).map((time) => (
                                                                <SelectItem key={time} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Schedule Summary */}
                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-blue-800">Your Availability: {getAvailableHours()} hours per week</p>
                                    <p className="mt-1 text-sm text-blue-700">
                                        Available {availability.filter((a) => a.is_available).length} days per week
                                    </p>
                                </div>
                            </div>
                        </div>

                        {validationErrors.availability && <p className="text-sm text-red-600">{validationErrors.availability}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Schedule Tips */}
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-start space-x-3">
                    <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                    <div className="text-sm">
                        <p className="mb-1 font-medium text-yellow-800">Schedule Tips</p>
                        <p className="text-xs text-yellow-700">
                            • More availability = more job opportunities
                            <br />
                            • Weekend and evening work often pays more
                            <br />
                            • You can always negotiate specific times with employers
                            <br />• Update your schedule anytime in your profile
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

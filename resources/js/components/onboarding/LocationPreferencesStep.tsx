import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, X, Truck, Tool, Globe, DollarSign, CheckCircle, Star, Loader, Check } from 'react-feather';

interface LocationPreferencesStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    validationErrors: any;
    globalLanguages: any[];
}

interface ServiceArea {
    id: string;
    postal_code: string;
    city: string;
    province: string;
    travel_time_minutes: number;
    additional_charge: number;
    is_primary_area: boolean;
}

interface City {
    id: number;
    name: string;
    global_province_id: number;
}

interface SelectedLanguage {
    id: number;
    name: string;
    code: string;
    proficiency_level: string;
    is_primary_language: boolean;
    is_official_canada: boolean;
}

const CANADIAN_PROVINCES = [
    { value: 'AB', label: 'Alberta' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'NU', label: 'Nunavut' },
    { value: 'ON', label: 'Ontario' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'QC', label: 'Quebec' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'YT', label: 'Yukon' },
];

const PROFICIENCY_LEVELS = [
    { value: 'basic', label: 'Basic', description: 'Simple conversations' },
    { value: 'conversational', label: 'Conversational', description: 'Can discuss work topics' },
    { value: 'fluent', label: 'Fluent', description: 'Speak easily and clearly' },
    { value: 'native', label: 'Native', description: 'First language' },
];

export default function LocationPreferencesStep({
    formData,
    updateFormData,
    validationErrors,
    globalLanguages = []
}: LocationPreferencesStepProps) {
    // Deduplicate languages by NAME (not ID) since there are duplicate names in DB
    const uniqueLanguages = useMemo(() => {
        const seenNames = new Map();
        
        globalLanguages.forEach(lang => {
            const key = `${lang.name}-${lang.is_official_canada}`;
            // Keep the first occurrence of each unique name
            if (!seenNames.has(key)) {
                seenNames.set(key, lang);
            }
        });
        
        const unique = Array.from(seenNames.values());
        
        console.log('=== DEDUPLICATION DEBUG ===');
        console.log('Original count:', globalLanguages.length);
        console.log('After deduplication by name:', unique.length);
        console.log('Unique languages:', unique.map(l => `${l.name} (${l.is_official_canada ? 'Official' : 'Other'})`));
        
        return unique;
    }, [globalLanguages]);

    const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(() => {
        // Always ensure the home area is first
        const homeArea: ServiceArea = {
            id: 'primary',
            postal_code: formData.postal_code || '',
            city: formData.city || '',
            province: formData.province || '',
            travel_time_minutes: 0,
            additional_charge: 0,
            is_primary_area: true
        };
        
        // If we have saved service areas, filter out any that might be marked as primary
        // and prepend the home area
        if (formData.service_areas && Array.isArray(formData.service_areas)) {
            const additionalAreas = formData.service_areas.filter((area: ServiceArea) => !area.is_primary_area);
            return [homeArea, ...additionalAreas];
        }
        
        return [homeArea];
    });
    
    const [selectedLanguages, setSelectedLanguages] = useState<SelectedLanguage[]>(formData.selected_languages || []);
    const [selectedLanguageId, setSelectedLanguageId] = useState<string>('');
    
    // City loading states for each service area
    const [citiesByArea, setCitiesByArea] = useState<Record<string, City[]>>({});
    const [loadingCitiesByArea, setLoadingCitiesByArea] = useState<Record<string, boolean>>({});
    const [citySearchByArea, setCitySearchByArea] = useState<Record<string, string>>({});
    const [showCitySuggestionsByArea, setShowCitySuggestionsByArea] = useState<Record<string, boolean>>({});
    const cityInputRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const handleBasicFieldChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

    // Fetch cities for a specific service area
    const fetchCitiesForArea = async (areaId: string, province: string, searchTerm?: string) => {
        if (!province) return;

        setLoadingCitiesByArea(prev => ({ ...prev, [areaId]: true }));
        try {
            const searchParam = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
            const response = await fetch(`/worker/api/provinces/code/${province}/cities${searchParam}`, {
                credentials: 'same-origin',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setCitiesByArea(prev => ({ ...prev, [areaId]: data }));
            }
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setLoadingCitiesByArea(prev => ({ ...prev, [areaId]: false }));
        }
    };

    // Debounce city search for each service area
    useEffect(() => {
        const timers: Record<string, NodeJS.Timeout> = {};

        Object.keys(citySearchByArea).forEach(areaId => {
            const searchTerm = citySearchByArea[areaId];
            const area = serviceAreas.find(a => a.id === areaId);
            
            if (area && area.province && citiesByArea[areaId]) {
                // Only refetch if we have an existing city list (meaning user is searching)
                timers[areaId] = setTimeout(() => {
                    fetchCitiesForArea(areaId, area.province, searchTerm);
                }, 300);
            }
        });

        return () => {
            Object.values(timers).forEach(timer => clearTimeout(timer));
        };
    }, [citySearchByArea]);

    // Validate Canadian postal code format
    const validatePostalCode = (postalCode: string): boolean => {
        const canadianPostalCodeRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
        return canadianPostalCodeRegex.test(postalCode.trim());
    };

    // Format postal code (add space if needed)
    const formatPostalCode = (value: string): string => {
        const cleaned = value.toUpperCase().replace(/\s/g, '');
        if (cleaned.length > 3) {
            return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
        }
        return cleaned;
    };

    // Close city suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            Object.keys(cityInputRefs.current).forEach(areaId => {
                const ref = cityInputRefs.current[areaId];
                if (ref && !ref.contains(event.target as Node)) {
                    setShowCitySuggestionsByArea(prev => ({ ...prev, [areaId]: false }));
                }
            });
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);


    // Service Area Management
    const addServiceArea = () => {
        const newArea: ServiceArea = {
            id: Date.now().toString(),
            postal_code: '',
            city: '',
            province: serviceAreas[0]?.province || '',
            travel_time_minutes: 30,
            additional_charge: 0,
            is_primary_area: false
        };

        const updated = [...serviceAreas, newArea];
        setServiceAreas(updated);
        updateFormData({ service_areas: updated });
    };

    const removeServiceArea = (id: string) => {
        if (id === 'primary') return; // Can't remove primary area
        
        const updated = serviceAreas.filter(area => area.id !== id);
        setServiceAreas(updated);
        updateFormData({ service_areas: updated });
    };

    const updateServiceArea = (id: string, field: string, value: any) => {
        const updated = serviceAreas.map(area => 
            area.id === id ? { ...area, [field]: value } : area
        );
        setServiceAreas(updated);
        updateFormData({ service_areas: updated });
        
        // When province changes, clear the current city and reset city data
        if (field === 'province') {
            const updatedWithClearedCity = updated.map(a => 
                a.id === id ? { ...a, city: '' } : a
            );
            setServiceAreas(updatedWithClearedCity);
            updateFormData({ service_areas: updatedWithClearedCity });
            
            // Clear city-related state for this area
            setCitiesByArea(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            setCitySearchByArea(prev => {
                const newState = { ...prev };
                delete newState[id];
                return newState;
            });
            setShowCitySuggestionsByArea(prev => ({ ...prev, [id]: false }));
        }
    };

    // Language Management
    const addLanguage = () => {
        if (!selectedLanguageId) return;

        const language = uniqueLanguages.find((l) => l.id.toString() === selectedLanguageId);
        if (!language || selectedLanguages.find((l) => l.id === language.id)) return;

        const newLanguage: SelectedLanguage = {
            id: language.id,
            name: language.name,
            code: language.code,
            is_official_canada: language.is_official_canada,
            proficiency_level: language.is_official_canada ? 'fluent' : 'conversational',
            is_primary_language: selectedLanguages.length === 0,
        };

        const updatedLanguages = [...selectedLanguages, newLanguage];
        setSelectedLanguages(updatedLanguages);
        updateFormData({ selected_languages: updatedLanguages });
        setSelectedLanguageId('');
    };

    const removeLanguage = (languageId: number) => {
        const updatedLanguages = selectedLanguages.filter((l) => l.id !== languageId);

        if (updatedLanguages.length > 0 && !updatedLanguages.find((l) => l.is_primary_language)) {
            updatedLanguages[0].is_primary_language = true;
        }

        setSelectedLanguages(updatedLanguages);
        updateFormData({ selected_languages: updatedLanguages });
    };

    const updateLanguageProficiency = (languageId: number, proficiency: string) => {
        const updatedLanguages = selectedLanguages.map((lang) => (lang.id === languageId ? { ...lang, proficiency_level: proficiency } : lang));
        setSelectedLanguages(updatedLanguages);
        updateFormData({ selected_languages: updatedLanguages });
    };

    const setPrimaryLanguage = (languageId: number) => {
        const updatedLanguages = selectedLanguages.map((lang) => ({
            ...lang,
            is_primary_language: lang.id === languageId,
        }));
        setSelectedLanguages(updatedLanguages);
        updateFormData({ selected_languages: updatedLanguages });
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

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4" 
                     style={{backgroundColor: '#FCF2F0'}}>
                    <MapPin className="h-8 w-8" style={{color: '#10B3D6'}} />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{color: '#192341'}}>
                    Location & Rates
                </h2>
                <p className="text-gray-600 text-sm">
                    Tell us where you can work, how much you charge, and what equipment you have.
                </p>
            </div>

            {/* Transportation & Equipment */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Transportation & Equipment</CardTitle>
                    <p className="text-sm text-gray-600">
                        This helps employers understand if you can travel to them and do the work
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Vehicle Access */}
                    <div>
                        <Label className="text-sm font-medium mb-3 block">
                            Do you have access to a vehicle? *
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.has_vehicle === true
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('has_vehicle', true)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Card className="h-5 w-5 mr-3" style={{color: '#10B3D6'}} />
                                        <div>
                                            <p className="font-medium text-gray-900">Yes, I have a vehicle</p>
                                            <p className="text-sm text-gray-600">I can drive to job locations</p>
                                        </div>
                                    </div>
                                    {formData.has_vehicle === true && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                            
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.has_vehicle === false && formData.has_vehicle !== undefined
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('has_vehicle', false)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">No vehicle</p>
                                            <p className="text-sm text-gray-600">I use public transit or work locally</p>
                                        </div>
                                    </div>
                                    {formData.has_vehicle === false && formData.has_vehicle !== undefined && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                        </div>
                        {validationErrors.has_vehicle && (
                            <p className="text-red-600 text-sm mt-2">{validationErrors.has_vehicle}</p>
                        )}
                    </div>

                    {/* Tools and Equipment */}
                    <div>
                        <Label className="text-sm font-medium mb-3 block">
                            Do you have your own tools and equipment? *
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.has_tools_equipment === true
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('has_tools_equipment', true)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Tool className="h-5 w-5 mr-3" style={{color: '#10B3D6'}} />
                                        <div>
                                            <p className="font-medium text-gray-900">Yes, I bring my own tools</p>
                                            <p className="text-sm text-gray-600">I have everything I need to work</p>
                                        </div>
                                    </div>
                                    {formData.has_tools_equipment === true && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                            
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.has_tools_equipment === false && formData.has_tools_equipment !== undefined
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('has_tools_equipment', false)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Tool className="h-5 w-5 mr-3 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">No, I need tools provided</p>
                                            <p className="text-sm text-gray-600">Employer should provide equipment</p>
                                        </div>
                                    </div>
                                    {formData.has_tools_equipment === false && formData.has_tools_equipment !== undefined && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                        </div>
                        {validationErrors.has_tools_equipment && (
                            <p className="text-red-600 text-sm mt-2">{validationErrors.has_tools_equipment}</p>
                        )}
                    </div>
                </CardContent>
              </Card>

            {/* Service Areas */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span>Where You Can Work</span>
                        <Button
                            onClick={addServiceArea}
                            disabled={serviceAreas.length >= 5}
                            className="text-white cursor-pointer"
                            style={{backgroundColor: '#10B3D6', height: '2.7em'}}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Area
                        </Button>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Add specific postal codes or cities where you can work. Your home area is automatically included.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {serviceAreas.map((area, index) => (
                        <div 
                            key={area.id} 
                            className={`p-4 rounded-lg border-2 ${
                                area.is_primary_area ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center">
                                    <h4 className="font-medium text-gray-900">
                                        {area.is_primary_area ? 'Home Area' : `Service Area #${index}`}
                                    </h4>
                                    {area.is_primary_area && (
                                        <Badge className="ml-2 text-xs" style={{backgroundColor: '#10B3D6', color: 'white'}}>
                                            Primary
                                        </Badge>
                                    )}
                                </div>
                                {!area.is_primary_area && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeServiceArea(area.id)}
                                        className="text-gray-400 hover:text-red-500 cursor-pointer"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Location Details */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">Province *</Label>
                                        <Select
                                            value={area.province}
                                            onValueChange={(value) => updateServiceArea(area.id, 'province', value)}
                                            disabled={area.is_primary_area}
                                        >
                                            <SelectTrigger className="mt-1">
                                                <SelectValue placeholder="Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {CANADIAN_PROVINCES.map((province) => (
                                                    <SelectItem key={province.value} value={province.value}>
                                                        {province.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">City *</Label>
                                        {area.is_primary_area ? (
                                            <Input
                                                value={area.city}
                                                className="mt-1"
                                                disabled={true}
                                            />
                                        ) : (
                                            <div ref={(el) => {cityInputRefs.current[area.id] = el}} className="relative mt-1">
                                                <Input
                                                    value={citySearchByArea[area.id] !== undefined ? citySearchByArea[area.id] : area.city || ''}
                                                    onChange={(e) => {
                                                        const value = e.target.value;
                                                        setCitySearchByArea(prev => ({ ...prev, [area.id]: value }));
                                                        setShowCitySuggestionsByArea(prev => ({ ...prev, [area.id]: true }));
                                                        // If user clears the input, clear the city
                                                        if (!value) {
                                                            updateServiceArea(area.id, 'city', '');
                                                        }
                                                    }}
                                                    onFocus={() => {
                                                        if (area.province && !citiesByArea[area.id]) {
                                                            // Load cities on first focus when province is selected
                                                            fetchCitiesForArea(area.id, area.province);
                                                        }
                                                        if (area.province) {
                                                            setShowCitySuggestionsByArea(prev => ({ ...prev, [area.id]: true }));
                                                        }
                                                    }}
                                                    placeholder={area.province ? "Type to search cities..." : "Select a province first"}
                                                    disabled={!area.province}
                                                    style={{ cursor: area.province ? 'text' : 'not-allowed' }}
                                                    className="pr-10"
                                                />
                                                {area.city && !loadingCitiesByArea[area.id] && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <div className="bg-green-500 rounded-full p-1">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                                {loadingCitiesByArea[area.id] && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                        <Loader className="h-4 w-4 animate-spin text-gray-400" />
                                                    </div>
                                                )}
                                                {/* Suggestions dropdown */}
                                                {showCitySuggestionsByArea[area.id] && citiesByArea[area.id] && citiesByArea[area.id].length > 0 && (
                                                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                                        {citiesByArea[area.id].map((city) => (
                                                            <div
                                                                key={city.id}
                                                                className="cursor-pointer px-3 py-2 font-medium text-gray-900 hover:bg-gray-100"
                                                                onClick={() => {
                                                                    updateServiceArea(area.id, 'city', city.name);
                                                                    setCitySearchByArea(prev => ({ ...prev, [area.id]: city.name }));
                                                                    setShowCitySuggestionsByArea(prev => ({ ...prev, [area.id]: false }));
                                                                }}
                                                            >
                                                                {city.name}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {/* Loading message */}
                                                {showCitySuggestionsByArea[area.id] && loadingCitiesByArea[area.id] && (
                                                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
                                                        Loading cities...
                                                    </div>
                                                )}
                                                {/* No results message */}
                                                {showCitySuggestionsByArea[area.id] && !loadingCitiesByArea[area.id] && citySearchByArea[area.id] && citiesByArea[area.id] && citiesByArea[area.id].length === 0 && (
                                                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
                                                        No cities found matching "{citySearchByArea[area.id]}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">Postal Code *</Label>
                                        {area.is_primary_area ? (
                                            <Input
                                                value={area.postal_code}
                                                className="mt-1"
                                                disabled={true}
                                            />
                                        ) : (
                                            <div className="relative mt-1">
                                                <Input
                                                    value={area.postal_code}
                                                    onChange={(e) => {
                                                        const formatted = formatPostalCode(e.target.value);
                                                        updateServiceArea(area.id, 'postal_code', formatted);
                                                    }}
                                                    onBlur={(e) => {
                                                        const value = e.target.value.trim();
                                                        if (value && !validatePostalCode(value)) {
                                                            console.warn('Invalid postal code format');
                                                        }
                                                    }}
                                                    placeholder="K1A 0A6"
                                                    className={`pr-10 ${
                                                        area.postal_code && !validatePostalCode(area.postal_code) 
                                                            ? 'border-red-500' 
                                                            : ''
                                                    }`}
                                                    maxLength={7}
                                                />
                                                {area.postal_code && validatePostalCode(area.postal_code) && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <div className="bg-green-500 rounded-full p-1">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                                {area.postal_code && !validatePostalCode(area.postal_code) && (
                                                    <p className="text-xs text-red-600 mt-1">
                                                        Please enter a valid Canadian postal code (e.g., K1A 0A6)
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Travel Time and Additional Charges */}
                                {!area.is_primary_area && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Travel Time (minutes)</Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    type="number"
                                                    value={area.travel_time_minutes}
                                                    onChange={(e) => updateServiceArea(area.id, 'travel_time_minutes', parseInt(e.target.value) || 0)}
                                                    placeholder="30"
                                                    className="pr-10"
                                                    min="0"
                                                    max="180"
                                                />
                                                {area.travel_time_minutes > 0 && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <div className="bg-green-500 rounded-full p-1">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Extra Travel Fee ($CAD)</Label>
                                            <div className="relative mt-1">
                                                <Input
                                                    type="number"
                                                    value={area.additional_charge}
                                                    onChange={(e) => updateServiceArea(area.id, 'additional_charge', parseFloat(e.target.value) || 0)}
                                                    placeholder="0.00"
                                                    className="pr-10"
                                                    min="0"
                                                    step="0.50"
                                                />
                                                {area.additional_charge >= 0 && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <div className="bg-green-500 rounded-full p-1">
                                                            <Check className="h-3 w-3 text-white" />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                Optional extra charge for this area
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {area.is_primary_area && (
                                    <p className="text-sm text-gray-600">
                                        This is your home area based on your address. No extra travel charges apply here.
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {validationErrors.service_areas && (
                        <p className="text-red-600 text-sm">{validationErrors.service_areas}</p>
                    )}
                </CardContent>
              </Card>

            {/* Hourly Rates */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                        <DollarSign className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                        Your Hourly Rates
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Set your minimum hourly rate. You can negotiate higher rates with employers.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="hourly_rate_min" className="text-sm font-medium">
                                Minimum Hourly Rate * ($CAD)
                            </Label>
                            <div className="relative mt-1">
                                <Input
                                    id="hourly_rate_min"
                                    type="number"
                                    value={formData.hourly_rate_min || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Restrict to 3 digits (max 999)
                                        if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 999)) {
                                            handleBasicFieldChange('hourly_rate_min', parseFloat(value) || 0);
                                        }
                                    }}
                                    className="pr-10"
                                    placeholder="20.00"
                                    min="5.00"
                                    max="999"
                                    step="0.50"
                                />
                                {formData.hourly_rate_min && formData.hourly_rate_min >= 5 && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="bg-green-500 rounded-full p-1">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Your lowest acceptable rate ($5 - $999)
                            </p>
                            {validationErrors.hourly_rate_min && (
                                <p className="text-red-600 text-sm mt-1">{validationErrors.hourly_rate_min}</p>
                            )}
                        </div>
                        
                        <div>
                            <Label htmlFor="hourly_rate_max" className="text-sm font-medium">
                                Maximum Preferred Rate (Optional) ($CAD)
                            </Label>
                            <div className="relative mt-1">
                                <Input
                                    id="hourly_rate_max"
                                    type="number"
                                    value={formData.hourly_rate_max || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        // Restrict to 4 digits (max 9999)
                                        if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 9999)) {
                                            handleBasicFieldChange('hourly_rate_max', parseFloat(value) || 0);
                                        }
                                    }}
                                    className="pr-10"
                                    placeholder="35.00"
                                    min={formData.hourly_rate_min || 5}
                                    max="9999"
                                    step="0.50"
                                />
                                {formData.hourly_rate_max && formData.hourly_rate_max > 0 && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                        <div className="bg-green-500 rounded-full p-1">
                                            <Check className="h-3 w-3 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Your ideal hourly rate ($5 - $9999)
                            </p>
                        </div>
                    </div>
                </CardContent>
              </Card>


            {/* Languages Section */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Globe className="mr-2 h-5 w-5" style={{color: '#10B3D6'}} />
                        Languages You Speak
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
                                    {uniqueLanguages
                                        .filter((lang) => lang.is_official_canada)
                                        .map((language) => (
                                            <SelectItem
                                                key={language.id}
                                                value={language.id.toString()}
                                                disabled={!!selectedLanguages.find((l) => l.id === language.id)}
                                            >
                                                {language.name} (Official)
                                            </SelectItem>
                                        ))}

                                    <div className="bg-gray-50 px-2 py-1 text-sm font-medium text-gray-500">Other Languages</div>
                                    {uniqueLanguages
                                        .filter((lang) => !lang.is_official_canada)
                                        .map((language) => (
                                            <SelectItem
                                                key={language.id}
                                                value={language.id.toString()}
                                                disabled={!!selectedLanguages.find((l) => l.id === language.id)}
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
                            style={{backgroundColor: '#10B3D6', height: '2.7em'}}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Language
                        </Button>
                    </div>

                    {/* Selected Languages */}
                    <div className="space-y-3">
                        {selectedLanguages.length === 0 ? (
                            <div className="py-8 text-center text-gray-500">
                                <Globe className="mx-auto mb-3 h-12 w-12 text-gray-300" />
                                <p>No languages added yet</p>
                                <p className="text-sm">Add at least English or French to continue</p>
                            </div>
                        ) : (
                            selectedLanguages.map((language) => (
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
                                                    <Badge className="px-2 py-0.5 text-xs" style={{backgroundColor: '#10B3D6', color: 'white'}}>
                                                        Official
                                                    </Badge>
                                                )}
                                                {language.is_primary_language && (
                                                    <Badge className="px-2 py-0.5 text-xs" style={{backgroundColor: '#10B3D6', color: 'white'}}>
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
                                        {!language.is_primary_language && selectedLanguages.length > 1 && (
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
                    {selectedLanguages.length > 0 && (
                        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                                <div className="text-sm">
                                    <p className="mb-1 font-medium text-green-800">
                                        Great! You speak {selectedLanguages.length} language{selectedLanguages.length > 1 ? 's' : ''}
                                    </p>
                                    <p className="text-xs text-green-700">
                                        {selectedLanguages.find((l) => l.is_official_canada)
                                            ? 'Speaking an official Canadian language opens up more job opportunities.'
                                            : 'Consider adding English or French to reach more employers.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

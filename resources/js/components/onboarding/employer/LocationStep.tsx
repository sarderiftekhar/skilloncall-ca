import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ValidatedInput from '@/components/ui/validated-input';
import { useTranslations } from '@/hooks/useTranslations';
import React, { useState } from 'react';
import { MapPin } from 'react-feather';

interface LocationStepProps {
    formData: Record<string, unknown>;
    updateFormData: (data: Record<string, unknown>) => void;
    validationErrors: Record<string, string>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalProvinces: any[];
}

interface City {
    id: number;
    name: string;
    global_province_id: number;
}

export default function LocationStep({ 
    formData, 
    updateFormData, 
    validationErrors,
    globalProvinces = []
}: LocationStepProps) {
    const { t } = useTranslations();

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

    const [citySearch, setCitySearch] = useState<string>('');
    const [showCitySuggestions, setShowCitySuggestions] = useState<boolean>(false);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState<boolean>(false);
    const [citiesLoaded, setCitiesLoaded] = useState<boolean>(false);
    const [previousProvince, setPreviousProvince] = useState<string | null>(null);
    const cityInputRef = React.useRef<HTMLDivElement>(null);

    // Fetch cities from API only when user interacts with city field
    const fetchCities = async () => {
        if (!formData.province) {
            return;
        }

        setLoadingCities(true);
        try {
            const searchParam = citySearch ? `?search=${encodeURIComponent(citySearch)}` : '';
            const response = await fetch(`/employer/api/provinces/code/${formData.province}/cities${searchParam}`);
            if (response.ok) {
                const data = await response.json();
                setCities(data);
                setCitiesLoaded(true);
            }
        } catch (error) {
            console.error('Failed to fetch cities:', error);
        } finally {
            setLoadingCities(false);
        }
    };

    // Debounce city search when user types
    React.useEffect(() => {
        if (!formData.province || !citiesLoaded || !citySearch) {
            return;
        }

        const timer = setTimeout(() => {
            fetchCities();
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [citySearch]);

    // Close suggestions when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
                setShowCitySuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clear city when province changes (but not on initial mount)
    React.useEffect(() => {
        if (previousProvince !== null && formData.province !== previousProvince) {
            // Clear city, cities list, and reset loaded state when province actually changes
            handleInputChange('city', '');
            setCitySearch('');
            setCities([]);
            setCitiesLoaded(false);
        }
        setPreviousProvince(formData.province as string);
    }, [formData.province]);

    // Initialize citySearch with the selected city name
    React.useEffect(() => {
        if (formData.city && !citySearch) {
            // Just display the city name from formData
            setCitySearch(formData.city);
        }
    }, [formData.city, citySearch]);

    const handleInputChange = (field: string, value: unknown) => {
        updateFormData({ [field]: value });
    };

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#FCF2F0' }}>
                    <MapPin className="h-8 w-8" style={{ color: '#10B3D6' }} />
                </div>
                <h2 className="mb-2 text-xl font-bold" style={{ color: '#192341' }}>
                    {t('employer.steps.location.welcome_title', 'Business Location')}
                </h2>
                <p className="text-sm text-gray-600">
                    {t('employer.steps.location.welcome_subtitle', "This helps workers find jobs in their area.")}
                </p>
            </div>

            {/* Address Information */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">
                        {t('employer.steps.location.address_title', 'Business Address')}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        {t('employer.steps.location.address_subtitle', 'This helps workers find jobs near your business')}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Street Address */}
                    <ValidatedInput
                        id="address_line_1"
                        label={t('employer.steps.location.street', 'Street Address')}
                        fieldType="address"
                        value={formData.address_line_1 || ''}
                        onChange={(value) => handleInputChange('address_line_1', value)}
                        error={validationErrors.address_line_1}
                        required
                        placeholder={t('employer.steps.location.street_placeholder', '123 Main Street')}
                    />

                    {/* Apartment/Unit (Optional) */}
                    <ValidatedInput
                        id="address_line_2"
                        label={t('employer.steps.location.unit', 'Apartment/Unit (Optional)')}
                        fieldType="address"
                        value={formData.address_line_2 || ''}
                        onChange={(value) => handleInputChange('address_line_2', value)}
                        placeholder={t('employer.steps.location.unit_placeholder', 'Suite 200, Unit 101, etc.')}
                    />

                    {/* Province, City, Postal Code */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <Label htmlFor="province" className="text-sm font-medium">
                                {t('employer.steps.location.province', 'Province')} *
                            </Label>
                            <Select 
                                value={formData.province as string | undefined} 
                                onValueChange={(value) => handleInputChange('province', value)}
                            >
                                <SelectTrigger className="mt-1 cursor-pointer">
                                    <SelectValue placeholder={t('employer.steps.location.province_placeholder', 'Select')} />
                                </SelectTrigger>
                                <SelectContent>
                                    {CANADIAN_PROVINCES.map((province) => (
                                        <SelectItem key={province.value} value={province.value}>
                                            {province.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {validationErrors.province && <p className="mt-1 text-sm text-red-600">{validationErrors.province}</p>}
                        </div>

                        <div ref={cityInputRef} className="relative">
                            <Label htmlFor="city" className="text-sm font-medium">
                                {t('employer.steps.location.city', 'City')} *
                            </Label>
                            <div className="relative mt-1">
                                <Input
                                    id="city"
                                    type="text"
                                    value={citySearch || formData.city || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setCitySearch(value);
                                        setShowCitySuggestions(true);
                                        // If user clears the input, clear the city
                                        if (!value) {
                                            handleInputChange('city', '');
                                        }
                                    }}
                                    onFocus={() => {
                                        if (formData.province && !citiesLoaded) {
                                            // Load cities on first focus when province is selected
                                            fetchCities();
                                        }
                                        setShowCitySuggestions(true);
                                    }}
                                    placeholder={
                                        formData.province 
                                            ? t('employer.steps.location.city_placeholder', 'Type to search cities...') 
                                            : t('employer.steps.location.city_placeholder_disabled', 'Select a province first')
                                    }
                                    className={validationErrors.city ? 'border-red-500' : ''}
                                    disabled={!formData.province}
                                    style={{ cursor: formData.province ? 'text' : 'not-allowed' }}
                                />

                                {/* Suggestions dropdown */}
                                {showCitySuggestions && cities.length > 0 && (
                                    <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
                                        {cities.map((city) => (
                                            <div
                                                key={city.id}
                                                className="cursor-pointer px-3 py-2 font-medium text-gray-900 hover:bg-gray-100"
                                                onClick={() => {
                                                    handleInputChange('city', city.name);
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
                                        {t('employer.steps.location.loading_cities', 'Loading cities...')}
                                    </div>
                                )}

                                {/* No results message */}
                                {showCitySuggestions && !loadingCities && citySearch && cities.length === 0 && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
                                        {t('employer.steps.location.no_cities', 'No cities found matching')}{' '}"{citySearch}"
                                    </div>
                                )}
                            </div>
                            {!formData.province && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {t('employer.steps.location.city_placeholder_disabled', 'Select a province first')}
                                </p>
                            )}
                            {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
                        </div>

                        <ValidatedInput
                            id="postal_code"
                            label={t('employer.steps.location.postal_code', 'Postal Code')}
                            fieldType="postalCode"
                            value={formData.postal_code || ''}
                            onChange={(value) => handleInputChange('postal_code', value.toUpperCase())}
                            error={validationErrors.postal_code}
                            required
                            placeholder="K1A 0A6"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}


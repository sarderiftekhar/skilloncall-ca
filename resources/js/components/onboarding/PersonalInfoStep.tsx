import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ValidatedInput from '@/components/ui/validated-input';
import ValidatedTextarea from '@/components/ui/validated-textarea';
import React, { useState } from 'react';
import { AlertCircle, Camera, Shield, Upload, User } from 'react-feather';

interface PersonalInfoStepProps {
    formData: Record<string, unknown>;
    updateFormData: (data: Record<string, unknown>) => void;
    validationErrors: Record<string, string>;
}

const WORK_AUTHORIZATION_OPTIONS = [
    { value: 'canadian_citizen', label: 'Canadian Citizen' },
    { value: 'permanent_resident', label: 'Permanent Resident' },
    { value: 'work_permit', label: 'Work Permit' },
    { value: 'student_permit', label: 'Student Permit' },
];

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


interface City {
    id: number;
    name: string;
    global_province_id: number;
}

export default function PersonalInfoStep({ formData, updateFormData, validationErrors }: PersonalInfoStepProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [citySearch, setCitySearch] = useState<string>('');
    const [showCitySuggestions, setShowCitySuggestions] = useState<boolean>(false);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState<boolean>(false);
    const cityInputRef = React.useRef<HTMLDivElement>(null);

    // Fetch cities from API when province changes or when user searches
    React.useEffect(() => {
        if (!formData.province) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            setLoadingCities(true);
            try {
                const searchParam = citySearch ? `?search=${encodeURIComponent(citySearch)}` : '';
                const response = await fetch(`/worker/api/provinces/code/${formData.province}/cities${searchParam}`);
                if (response.ok) {
                    const data = await response.json();
                    setCities(data);
                }
            } catch (error) {
                console.error('Failed to fetch cities:', error);
            } finally {
                setLoadingCities(false);
            }
        };

        // Debounce the search
        const timer = setTimeout(() => {
            fetchCities();
        }, 300);

        return () => clearTimeout(timer);
    }, [formData.province, citySearch]);

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

    // Clear city when province changes
    React.useEffect(() => {
        if (formData.province && formData.city) {
            // Clear city when province changes as cities will be refetched
            handleInputChange('city', '');
            setCitySearch('');
        }
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

    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setPhotoPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Update form data
            handleInputChange('profile_photo', file);
        }
    };

    const calculateAge = (birthDate: string): number => {
        const today = new Date();
        const birth = new Date(birthDate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#FCF2F0' }}>
                    <User className="h-8 w-8" style={{ color: '#10B3D6' }} />
                </div>
                <h2 className="mb-2 text-xl font-bold" style={{ color: '#192341' }}>
                    Welcome to SkillOnCall!
                </h2>
                <p className="text-sm text-gray-600">
                    Let's start by getting to know you better. This information helps employers find and trust you.
                </p>
            </div>

            {/* Profile Photo Upload */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Camera className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                        Profile Photo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center space-y-4">
                        {/* Photo Preview */}
                        <div className="relative">
                            <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center">
                                        <User className="h-10 w-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Upload Button */}
                        <div className="text-center">
                            <input type="file" id="photo-upload" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                            <label htmlFor="photo-upload">
                                <Button type="button" variant="outline" className="cursor-pointer" asChild style={{ height: '2.7em' }}>
                                    <span className="flex items-center">
                                        <Upload className="mr-2 h-4 w-4" />
                                        {photoPreview ? 'Change Photo' : 'Upload Photo'}
                                    </span>
                                </Button>
                            </label>
                            <p className="mt-2 text-xs text-gray-500">Clear photos get better job opportunities</p>
                        </div>
                    </div>
                    {validationErrors.profile_photo && <p className="mt-2 text-center text-sm text-red-600">{validationErrors.profile_photo}</p>}
                </CardContent>
            </Card>

            {/* Basic Information */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* First Name & Last Name */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ValidatedInput
                            id="first_name"
                            label="First Name"
                            fieldType="name"
                            value={formData.first_name || ''}
                            onChange={(value) => handleInputChange('first_name', value)}
                            error={validationErrors.first_name}
                            required
                            placeholder="Enter your first name"
                        />

                        <ValidatedInput
                            id="last_name"
                            label="Last Name"
                            fieldType="name"
                            value={formData.last_name || ''}
                            onChange={(value) => handleInputChange('last_name', value)}
                            error={validationErrors.last_name}
                            required
                            placeholder="Enter your last name"
                        />
                    </div>

                    {/* Phone Number & Date of Birth */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ValidatedInput
                            id="phone"
                            label="Phone Number"
                            fieldType="phone"
                            value={formData.phone || ''}
                            onChange={(value) => handleInputChange('phone', value)}
                            error={validationErrors.phone}
                            helperText="Employers will use this to contact you"
                            required
                            placeholder="(416) 555-0123"
                        />

                        <div>
                            <ValidatedInput
                                id="date_of_birth"
                                label="Date of Birth (Optional)"
                                fieldType="date"
                                value={formData.date_of_birth || ''}
                                onChange={(value) => handleInputChange('date_of_birth', value)}
                                error={validationErrors.date_of_birth}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            {formData.date_of_birth && (
                                <p className="mt-1 text-xs text-gray-500">
                                    Age: {calculateAge(formData.date_of_birth)} years
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Brief Description */}
                    <ValidatedTextarea
                        id="bio"
                        label="Tell Us About Yourself (Optional)"
                        fieldType="bio"
                        value={formData.bio || ''}
                        onChange={(value) => handleInputChange('bio', value)}
                        error={validationErrors.bio}
                        helperText="This helps employers understand your background"
                        className="h-20"
                        placeholder="Briefly describe your experience and what makes you great at your job..."
                    />
                </CardContent>
            </Card>

            {/* Canadian Legal Requirements */}
            <Card className="border bg-orange-50" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg text-orange-800">
                        <Shield className="mr-2 h-5 w-5" />
                        Work Authorization (Required by Canadian Law)
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3 rounded-lg bg-orange-100 p-3">
                        <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600" />
                        <div>
                            <p className="text-sm font-medium text-orange-800">Canadian employers are required by law to verify work authorization</p>
                            <p className="mt-1 text-xs text-orange-700">This information is kept secure and only shared with employers when needed</p>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="work_authorization" className="text-sm font-medium">
                            Work Authorization Status *
                        </Label>
                        <Select value={formData.work_authorization || ''} onValueChange={(value) => handleInputChange('work_authorization', value)}>
                            <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select your work status" />
                            </SelectTrigger>
                            <SelectContent>
                                {WORK_AUTHORIZATION_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {validationErrors.work_authorization && <p className="mt-1 text-sm text-red-600">{validationErrors.work_authorization}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Address Information</CardTitle>
                    <p className="text-sm text-gray-600">This helps employers find workers in their area</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Street Address */}
                    <ValidatedInput
                        id="address_line_1"
                        label="Street Address"
                        fieldType="address"
                        value={formData.address_line_1 || ''}
                        onChange={(value) => handleInputChange('address_line_1', value)}
                        error={validationErrors.address_line_1}
                        required
                        placeholder="123 Main Street"
                    />

                    {/* Apartment/Unit (Optional) */}
                    <ValidatedInput
                        id="address_line_2"
                        label="Apartment/Unit (Optional)"
                        fieldType="address"
                        value={formData.address_line_2 || ''}
                        onChange={(value) => handleInputChange('address_line_2', value)}
                        placeholder="Apt 4B, Unit 101, etc."
                    />

                    {/* Province, City, Postal Code */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <Label htmlFor="province" className="text-sm font-medium">
                                Province *
                            </Label>
                            <Select value={formData.province || ''} onValueChange={(value) => handleInputChange('province', value)}>
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
                            {validationErrors.province && <p className="mt-1 text-sm text-red-600">{validationErrors.province}</p>}
                        </div>

                        <div ref={cityInputRef} className="relative">
                            <Label htmlFor="city" className="text-sm font-medium">
                                City *
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
                                    onFocus={() => setShowCitySuggestions(true)}
                                    placeholder="Type to search cities..."
                                    className={validationErrors.city ? 'border-red-500' : ''}
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
                                        Loading cities...
                                    </div>
                                )}

                                {/* No results message */}
                                {showCitySuggestions && !loadingCities && citySearch && cities.length === 0 && (
                                    <div className="absolute z-50 mt-1 w-full rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-500 shadow-lg">
                                        No cities found matching "{citySearch}"
                                    </div>
                                )}
                            </div>
                            {validationErrors.city && <p className="mt-1 text-sm text-red-600">{validationErrors.city}</p>}
                        </div>

                        <ValidatedInput
                            id="postal_code"
                            label="Postal Code"
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

            {/* Emergency Contact */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Emergency Contact</CardTitle>
                    <p className="text-sm text-gray-600">Someone we can contact if there's an emergency while you're working</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <ValidatedInput
                            id="emergency_contact_name"
                            label="Contact Name"
                            fieldType="name"
                            value={formData.emergency_contact_name || ''}
                            onChange={(value) => handleInputChange('emergency_contact_name', value)}
                            error={validationErrors.emergency_contact_name}
                            required
                            placeholder="Full name"
                        />

                        <ValidatedInput
                            id="emergency_contact_relationship"
                            label="Relationship"
                            fieldType="name"
                            value={formData.emergency_contact_relationship || ''}
                            onChange={(value) => handleInputChange('emergency_contact_relationship', value)}
                            error={validationErrors.emergency_contact_relationship}
                            required
                            placeholder="Parent, Spouse, Sibling, Friend"
                        />
                    </div>

                    <ValidatedInput
                        id="emergency_contact_phone"
                        label="Phone Number"
                        fieldType="phone"
                        value={formData.emergency_contact_phone || ''}
                        onChange={(value) => handleInputChange('emergency_contact_phone', value)}
                        error={validationErrors.emergency_contact_phone}
                        required
                        placeholder="(416) 555-0123"
                    />
                </CardContent>
            </Card>

            {/* Privacy Notice */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start space-x-3">
                    <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div className="text-sm">
                        <p className="mb-1 font-medium text-blue-800">Your Privacy is Protected</p>
                        <p className="text-xs text-blue-700">
                            We keep your personal information secure and only share necessary details with employers when you apply for jobs. You
                            control what information is visible in your profile.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

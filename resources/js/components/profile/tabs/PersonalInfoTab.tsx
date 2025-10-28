import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Edit, Save, X, User, Phone, MapPin, Shield } from 'react-feather';

interface PersonalInfoTabProps {
    profile: any;
    onUpdate: (data: any) => void;
    globalProvinces?: any[];
}

interface City {
    id: number;
    name: string;
}

const WORK_AUTHORIZATION_OPTIONS = [
    { value: 'canadian_citizen', label: 'Canadian Citizen' },
    { value: 'permanent_resident', label: 'Permanent Resident' },
    { value: 'work_permit', label: 'Work Permit' },
    { value: 'student_permit', label: 'Student Permit' }
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

export default function PersonalInfoTab({ profile, onUpdate, globalProvinces = [] }: PersonalInfoTabProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(
        profile?.profile_photo ? `/storage/${profile.profile_photo}` : null
    );
    const [editForm, setEditForm] = useState({
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        phone: profile?.phone || '',
        date_of_birth: profile?.date_of_birth || '',
        bio: profile?.bio || '',
        address_line_1: profile?.address_line_1 || '',
        address_line_2: profile?.address_line_2 || '',
        city: profile?.city || '',
        province: profile?.province || '',
        postal_code: profile?.postal_code || '',
        work_authorization: profile?.work_authorization || '',
        emergency_contact_name: profile?.emergency_contact_name || '',
        emergency_contact_phone: profile?.emergency_contact_phone || '',
        emergency_contact_relationship: profile?.emergency_contact_relationship || ''
    });
    const [errors, setErrors] = useState<any>({});
    
    // City search states
    const [citySearch, setCitySearch] = useState<string>('');
    const [showCitySuggestions, setShowCitySuggestions] = useState<boolean>(false);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState<boolean>(false);
    const [citiesLoaded, setCitiesLoaded] = useState<boolean>(false);
    const [previousProvince, setPreviousProvince] = useState<string | null>(null);
    const cityInputRef = useRef<HTMLDivElement>(null);

    // Update profile photo URL when profile prop changes
    useEffect(() => {
        console.log('Profile photo effect triggered:', {
            profile_photo: profile?.profile_photo,
            current_url: profilePhotoUrl,
            new_url: profile?.profile_photo ? `/storage/${profile.profile_photo}` : null
        });
        setProfilePhotoUrl(profile?.profile_photo ? `/storage/${profile.profile_photo}` : null);
    }, [profile?.profile_photo]);

    // Fetch cities from API only when user interacts with city field
    const fetchCities = async () => {
        if (!editForm.province) {
            return;
        }

        setLoadingCities(true);
        try {
            const searchParam = citySearch ? `?search=${encodeURIComponent(citySearch)}` : '';
            const response = await fetch(`/worker/api/provinces/code/${editForm.province}/cities${searchParam}`);
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
    useEffect(() => {
        if (!editForm.province || !citiesLoaded) {
            return;
        }

        const timer = setTimeout(() => {
            fetchCities();
        }, 300);

        return () => clearTimeout(timer);
    }, [citySearch]);

    // Close suggestions when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (cityInputRef.current && !cityInputRef.current.contains(event.target as Node)) {
                setShowCitySuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clear city when province changes
    useEffect(() => {
        if (previousProvince !== null && editForm.province !== previousProvince) {
            handleInputChange('city', '');
            setCitySearch('');
            setCities([]);
            setCitiesLoaded(false);
        }
        setPreviousProvince(editForm.province);
    }, [editForm.province]);

    // Initialize citySearch with the selected city name
    useEffect(() => {
        if (editForm.city && !citySearch) {
            setCitySearch(editForm.city);
        }
    }, [editForm.city, citySearch]);

    const handleInputChange = (field: string, value: any) => {
        setEditForm(prev => ({ ...prev, [field]: value }));
        setErrors((prev: any) => ({ ...prev, [field]: undefined }));
    };

    const handleSave = async () => {
        try {
            await onUpdate(editForm);
            setIsEditing(false);
            setErrors({});
        } catch (error: any) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            }
        }
    };

    const handleCancel = () => {
        setEditForm({
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            phone: profile?.phone || '',
            date_of_birth: profile?.date_of_birth || '',
            bio: profile?.bio || '',
            address_line_1: profile?.address_line_1 || '',
            address_line_2: profile?.address_line_2 || '',
            city: profile?.city || '',
            province: profile?.province || '',
            postal_code: profile?.postal_code || '',
            work_authorization: profile?.work_authorization || '',
            emergency_contact_name: profile?.emergency_contact_name || '',
            emergency_contact_phone: profile?.emergency_contact_phone || '',
            emergency_contact_relationship: profile?.emergency_contact_relationship || ''
        });
        setIsEditing(false);
        setErrors({});
    };

    const formatPhoneNumber = (value: string) => {
        const cleaned = value.replace(/\D/g, '');
        const limited = cleaned.substring(0, 10);
        
        if (limited.length === 0) return '';
        if (limited.length <= 3) return `(${limited}`;
        if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`;
        return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`;
    };

    const getWorkAuthLabel = (value: string) => {
        return WORK_AUTHORIZATION_OPTIONS.find(option => option.value === value)?.label || value;
    };

    return (
        <div className="space-y-6">
            {/* Profile Photo Section */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-xl" style={{ color: '#192341' }}>
                        Profile Photo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <div
                                className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: '#FCF2F0' }}
                            >
                                {profilePhotoUrl ? (
                                    <img
                                        src={profilePhotoUrl}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User className="w-8 h-8" style={{ color: '#10B3D6' }} />
                                )}
                            </div>
                            <button
                                className="absolute bottom-0 right-0 p-2 rounded-full bg-white border-2 border-gray-300 hover:border-[#10B3D6] cursor-pointer transition-colors"
                                title="Change photo"
                            >
                                <Camera className="w-4 h-4" style={{ color: '#10B3D6' }} />
                            </button>
                        </div>
                        <div>
                            <h3 className="font-medium text-lg" style={{ color: '#192341' }}>
                                {profile?.first_name} {profile?.last_name}
                            </h3>
                            <p className="text-gray-600">
                                {profile?.bio ? profile.bio.substring(0, 100) + '...' : 'No bio added yet'}
                            </p>
                            <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 cursor-pointer"
                                onClick={() => document.getElementById('photo-upload')?.click()}
                            >
                                <Camera className="w-4 h-4 mr-2" />
                                Upload Photo
                            </Button>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        console.log('File selected:', file);
                                        
                                        // Create preview immediately for better UX
                                        const reader = new FileReader();
                                        reader.onload = (event) => {
                                            setProfilePhotoUrl(event.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                        
                                        try {
                                            console.log('🖼️ Profile photo selected:', {
                                                name: file.name,
                                                size: file.size,
                                                type: file.type
                                            });
                                            
                                            // Call onUpdate with the profile photo file
                                            await onUpdate({ profile_photo: file });
                                            console.log('✅ Profile photo upload initiated successfully');
                                            
                                            // Clear the file input so the same file can be uploaded again if needed
                                            e.target.value = '';
                                        } catch (error) {
                                            console.error('Error uploading profile photo:', error);
                                            // Reset to previous photo on error
                                            setProfilePhotoUrl(profile?.profile_photo ? `/storage/${profile.profile_photo}` : null);
                                        }
                                    }
                                }}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Basic Information Section */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-xl" style={{ color: '#192341' }}>
                            Basic Information
                        </CardTitle>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
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
                                    Edit
                                </>
                            )}
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditing ? (
                        <div className="space-y-4">
                            {/* Name Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">
                                        First Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={editForm.first_name}
                                        onChange={(e) => handleInputChange('first_name', e.target.value)}
                                        className="mt-1"
                                        placeholder="Enter your first name"
                                    />
                                    {errors.first_name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.first_name}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">
                                        Last Name <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={editForm.last_name}
                                        onChange={(e) => handleInputChange('last_name', e.target.value)}
                                        className="mt-1"
                                        placeholder="Enter your last name"
                                    />
                                    {errors.last_name && (
                                        <p className="text-red-600 text-sm mt-1">{errors.last_name}</p>
                                    )}
                                </div>
                            </div>

                            {/* Contact Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium">
                                        Phone Number <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={editForm.phone}
                                        onChange={(e) => {
                                            const formatted = formatPhoneNumber(e.target.value);
                                            handleInputChange('phone', formatted);
                                        }}
                                        className="mt-1"
                                        placeholder="(416) 555-0123"
                                        maxLength={14}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-600 text-sm mt-1">{errors.phone}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">
                                        Date of Birth <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        type="date"
                                        value={editForm.date_of_birth}
                                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                                        className="mt-1"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.date_of_birth && (
                                        <p className="text-red-600 text-sm mt-1">{errors.date_of_birth}</p>
                                    )}
                                </div>
                            </div>

                            {/* Bio */}
                            <div>
                                <Label className="text-sm font-medium">Bio / About Me</Label>
                                <Textarea
                                    value={editForm.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    className="mt-1 h-24"
                                    placeholder="Tell employers about yourself, your experience, and what makes you great to work with..."
                                    maxLength={500}
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    {editForm.bio.length}/500 characters
                                </p>
                                {errors.bio && (
                                    <p className="text-red-600 text-sm mt-1">{errors.bio}</p>
                                )}
                            </div>

                            {/* Address Fields */}
                            <div className="space-y-4">
                                <h4 className="font-medium" style={{ color: '#192341' }}>Address</h4>
                                <div>
                                    <Label className="text-sm font-medium">
                                        Street Address <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={editForm.address_line_1}
                                        onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                                        className="mt-1"
                                        placeholder="123 Main Street"
                                    />
                                    {errors.address_line_1 && (
                                        <p className="text-red-600 text-sm mt-1">{errors.address_line_1}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">Apartment, Unit, etc. (Optional)</Label>
                                    <Input
                                        value={editForm.address_line_2}
                                        onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                                        className="mt-1"
                                        placeholder="Apt 4B"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">
                                            City <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={editForm.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="mt-1"
                                            placeholder="Toronto"
                                        />
                                        {errors.city && (
                                            <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                                        )}
                                    </div>
                                <div>
                                    <Label className="text-sm font-medium">
                                        Province <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={editForm.province}
                                        onValueChange={(value) => handleInputChange('province', value)}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select province" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CANADIAN_PROVINCES.map((province) => (
                                                <SelectItem key={province.value} value={province.value}>
                                                    {province.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.province && (
                                        <p className="text-red-600 text-sm mt-1">{errors.province}</p>
                                    )}
                                </div>
                                <div ref={cityInputRef} className="relative">
                                    <Label className="text-sm font-medium">
                                        City <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="relative mt-1">
                                        <Input
                                            type="text"
                                            value={citySearch || editForm.city || ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                setCitySearch(value);
                                                setShowCitySuggestions(true);
                                                if (!value) {
                                                    handleInputChange('city', '');
                                                }
                                            }}
                                            onFocus={() => {
                                                if (editForm.province && !citiesLoaded) {
                                                    fetchCities();
                                                }
                                                setShowCitySuggestions(true);
                                            }}
                                            placeholder={editForm.province ? "Start typing city name..." : "Select province first"}
                                            disabled={!editForm.province}
                                            className="w-full"
                                        />
                                        
                                        {/* City suggestions dropdown */}
                                        {showCitySuggestions && editForm.province && (
                                            <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                                                {loadingCities ? (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        Loading cities...
                                                    </div>
                                                ) : cities.length > 0 ? (
                                                    cities.map((city) => (
                                                        <div
                                                            key={city.id}
                                                            className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 text-gray-900"
                                                            onClick={() => {
                                                                handleInputChange('city', city.name);
                                                                setCitySearch(city.name);
                                                                setShowCitySuggestions(false);
                                                            }}
                                                        >
                                                            {city.name}
                                                        </div>
                                                    ))
                                                ) : citySearch ? (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        No cities found matching "{citySearch}"
                                                    </div>
                                                ) : (
                                                    <div className="px-3 py-2 text-sm text-gray-500">
                                                        Start typing to search cities...
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {errors.city && (
                                        <p className="text-red-600 text-sm mt-1">{errors.city}</p>
                                    )}
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">
                                        Postal Code <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={editForm.postal_code}
                                        onChange={(e) => handleInputChange('postal_code', e.target.value.toUpperCase())}
                                        className="mt-1"
                                        placeholder="M5V 3A8"
                                        maxLength={7}
                                    />
                                    {errors.postal_code && (
                                        <p className="text-red-600 text-sm mt-1">{errors.postal_code}</p>
                                    )}
                                </div>
                                </div>
                            </div>

                            {/* Work Authorization */}
                            <div>
                                <Label className="text-sm font-medium">
                                    Work Authorization <span className="text-red-500">*</span>
                                </Label>
                                <Select
                                    value={editForm.work_authorization}
                                    onValueChange={(value) => handleInputChange('work_authorization', value)}
                                >
                                    <SelectTrigger className="mt-1">
                                        <SelectValue placeholder="Select work authorization" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {WORK_AUTHORIZATION_OPTIONS.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.work_authorization && (
                                    <p className="text-red-600 text-sm mt-1">{errors.work_authorization}</p>
                                )}
                            </div>

                            {/* Emergency Contact */}
                            <div className="space-y-4">
                                <h4 className="font-medium" style={{ color: '#192341' }}>Emergency Contact</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium">
                                            Contact Name <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={editForm.emergency_contact_name}
                                            onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                                            className="mt-1"
                                            placeholder="John Smith"
                                        />
                                        {errors.emergency_contact_name && (
                                            <p className="text-red-600 text-sm mt-1">{errors.emergency_contact_name}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">
                                            Contact Phone <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            value={editForm.emergency_contact_phone}
                                            onChange={(e) => {
                                                const formatted = formatPhoneNumber(e.target.value);
                                                handleInputChange('emergency_contact_phone', formatted);
                                            }}
                                            className="mt-1"
                                            placeholder="(416) 555-0123"
                                            maxLength={14}
                                        />
                                        {errors.emergency_contact_phone && (
                                            <p className="text-red-600 text-sm mt-1">{errors.emergency_contact_phone}</p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium">
                                        Relationship <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        value={editForm.emergency_contact_relationship}
                                        onChange={(e) => handleInputChange('emergency_contact_relationship', e.target.value)}
                                        className="mt-1"
                                        placeholder="Spouse, Parent, Sibling, Friend"
                                    />
                                    {errors.emergency_contact_relationship && (
                                        <p className="text-red-600 text-sm mt-1">{errors.emergency_contact_relationship}</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleCancel}
                                    className="cursor-pointer"
                                >
                                    <X className="w-4 h-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSave}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* View Mode - Personal Details */}
                            <div>
                                <h4 className="font-medium mb-4" style={{ color: '#192341' }}>Personal Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <User className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Full Name</p>
                                                <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <Phone className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Phone</p>
                                                <p className="font-medium">{profile?.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        {profile?.date_of_birth && (
                                            <div className="flex items-center space-x-3">
                                                <User className="w-5 h-5 text-gray-400" />
                                                <div>
                                                    <p className="text-sm text-gray-600">Date of Birth</p>
                                                    <p className="font-medium">{new Date(profile.date_of_birth).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <Shield className="w-5 h-5 text-gray-400" />
                                            <div>
                                                <p className="text-sm text-gray-600">Work Authorization</p>
                                                <p className="font-medium">
                                                    {profile?.work_authorization ? 
                                                        getWorkAuthLabel(profile.work_authorization) : 
                                                        'Not provided'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Emergency Contact</p>
                                            <p className="font-medium">
                                                {profile?.emergency_contact_name ? 
                                                    `${profile.emergency_contact_name} (${profile.emergency_contact_relationship})` : 
                                                    'Not provided'
                                                }
                                            </p>
                                            {profile?.emergency_contact_phone && (
                                                <p className="text-sm text-gray-500">{profile.emergency_contact_phone}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Current Address Section */}
                            <div>
                                <h4 className="font-medium mb-4 flex items-center" style={{ color: '#192341' }}>
                                    <MapPin className="w-5 h-5 text-gray-400 mr-2" />
                                    Current Address
                                </h4>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    {profile?.address_line_1 ? (
                                        <div className="space-y-2">
                                            <p className="font-medium text-gray-900">
                                                {profile.address_line_1}
                                                {profile?.address_line_2 && `, ${profile.address_line_2}`}
                                            </p>
                                            <p className="text-gray-600">
                                                {profile?.city && profile?.province && profile?.postal_code ? 
                                                    `${profile.city}, ${profile.province} ${profile.postal_code}` :
                                                    [profile?.city, profile?.province, profile?.postal_code].filter(Boolean).join(', ')
                                                }
                                            </p>
                                            {(!profile?.city || !profile?.province || !profile?.postal_code) && (
                                                <p className="text-sm text-orange-600">
                                                    <span className="font-medium">Incomplete:</span> Please complete your address information
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-6">
                                            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                            <p className="text-gray-500 font-medium mb-1">No address provided</p>
                                            <p className="text-gray-400 text-sm">Click "Edit" above to add your current address</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Bio */}
                            {profile?.bio && (
                                <div>
                                    <h4 className="font-medium mb-2" style={{ color: '#192341' }}>About Me</h4>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-900">{profile.bio}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

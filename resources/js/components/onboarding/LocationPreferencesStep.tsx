import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Plus, X, Truck, Tool, Shield, DollarSign, CheckCircle } from 'react-feather';

interface LocationPreferencesStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    validationErrors: any;
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

export default function LocationPreferencesStep({
    formData,
    updateFormData,
    validationErrors
}: LocationPreferencesStepProps) {
    const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>(
        formData.service_areas || [{
            id: 'primary',
            postal_code: formData.postal_code || '',
            city: formData.city || '',
            province: formData.province || '',
            travel_time_minutes: 0,
            additional_charge: 0,
            is_primary_area: true
        }]
    );

    const handleBasicFieldChange = (field: string, value: any) => {
        updateFormData({ [field]: value });
    };

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
                                    formData.has_vehicle === false
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
                                    {formData.has_vehicle === false && (
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
                                    formData.has_tools_equipment === false
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
                                    {formData.has_tools_equipment === false && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                        </div>
                        {validationErrors.has_tools_equipment && (
                            <p className="text-red-600 text-sm mt-2">{validationErrors.has_tools_equipment}</p>
                        )}
                    </div>

                    {/* Maximum Travel Distance */}
                    <div>
                        <Label htmlFor="travel_distance_max" className="text-sm font-medium">
                            Maximum Travel Distance *
                        </Label>
                        <div className="mt-1 relative">
                            <Select
                                value={formData.travel_distance_max?.toString() || ''}
                                onValueChange={(value) => handleBasicFieldChange('travel_distance_max', parseInt(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="How far will you travel?" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="5">Within 5 km</SelectItem>
                                    <SelectItem value="10">Within 10 km</SelectItem>
                                    <SelectItem value="15">Within 15 km</SelectItem>
                                    <SelectItem value="25">Within 25 km</SelectItem>
                                    <SelectItem value="50">Within 50 km</SelectItem>
                                    <SelectItem value="100">Within 100 km</SelectItem>
                                    <SelectItem value="999">Anywhere in the province</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            {formData.has_vehicle === false ? 
                                'Consider public transit limits when setting distance' : 
                                'Distance from your home address'
                            }
                        </p>
                        {validationErrors.travel_distance_max && (
                            <p className="text-red-600 text-sm mt-1">{validationErrors.travel_distance_max}</p>
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
                                        <Label className="text-sm font-medium">Postal Code *</Label>
                                        <Input
                                            value={area.postal_code}
                                            onChange={(e) => updateServiceArea(area.id, 'postal_code', e.target.value.toUpperCase())}
                                            placeholder="K1A 0A6"
                                            className="mt-1"
                                            maxLength={7}
                                            disabled={area.is_primary_area}
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium">City *</Label>
                                        <Input
                                            value={area.city}
                                            onChange={(e) => updateServiceArea(area.id, 'city', e.target.value)}
                                            placeholder="Toronto"
                                            className="mt-1"
                                            disabled={area.is_primary_area}
                                        />
                                    </div>
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
                                </div>

                                {/* Travel Time and Additional Charges */}
                                {!area.is_primary_area && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <Label className="text-sm font-medium">Travel Time (minutes)</Label>
                                            <Input
                                                type="number"
                                                value={area.travel_time_minutes}
                                                onChange={(e) => updateServiceArea(area.id, 'travel_time_minutes', parseInt(e.target.value) || 0)}
                                                placeholder="30"
                                                className="mt-1"
                                                min="0"
                                                max="180"
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-sm font-medium">Extra Travel Fee ($CAD)</Label>
                                            <Input
                                                type="number"
                                                value={area.additional_charge}
                                                onChange={(e) => updateServiceArea(area.id, 'additional_charge', parseFloat(e.target.value) || 0)}
                                                placeholder="0.00"
                                                className="mt-1"
                                                min="0"
                                                step="0.50"
                                            />
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
                            <Input
                                id="hourly_rate_min"
                                type="number"
                                value={formData.hourly_rate_min || ''}
                                onChange={(e) => handleBasicFieldChange('hourly_rate_min', parseFloat(e.target.value) || 0)}
                                className="mt-1"
                                placeholder="20.00"
                                min="15.00" // Minimum wage consideration
                                step="0.50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Your lowest acceptable rate
                            </p>
                            {validationErrors.hourly_rate_min && (
                                <p className="text-red-600 text-sm mt-1">{validationErrors.hourly_rate_min}</p>
                            )}
                        </div>
                        
                        <div>
                            <Label htmlFor="hourly_rate_max" className="text-sm font-medium">
                                Maximum Preferred Rate (Optional) ($CAD)
                            </Label>
                            <Input
                                id="hourly_rate_max"
                                type="number"
                                value={formData.hourly_rate_max || ''}
                                onChange={(e) => handleBasicFieldChange('hourly_rate_max', parseFloat(e.target.value) || 0)}
                                className="mt-1"
                                placeholder="35.00"
                                min={formData.hourly_rate_min || 15}
                                step="0.50"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Your ideal hourly rate
                            </p>
                        </div>
                    </div>

                    {/* Rate Display */}
                    {formData.hourly_rate_min && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <DollarSign className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">
                                        Your Rate Range: ${formData.hourly_rate_min}
                                        {formData.hourly_rate_max && formData.hourly_rate_max > formData.hourly_rate_min 
                                            ? ` - $${formData.hourly_rate_max}` 
                                            : '+'} CAD per hour
                                    </p>
                                    <p className="text-sm text-green-700 mt-1">
                                        {formData.hourly_rate_min >= 20 
                                            ? 'Great! This is competitive for skilled work.' 
                                            : 'Consider if this rate reflects your skills and experience.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
              </Card>

            {/* Insurance & Safety */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center">
                        <Shield className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                        Insurance & Safety
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        These help build trust with employers and may be required for certain jobs
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Liability Insurance */}
                    <div>
                        <Label className="text-sm font-medium mb-3 block">
                            Do you have liability insurance?
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.is_insured === true
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('is_insured', true)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 mr-3" style={{color: '#10B3D6'}} />
                                        <div>
                                            <p className="font-medium text-gray-900">Yes, I have insurance</p>
                                            <p className="text-sm text-gray-600">Liability coverage for my work</p>
                                        </div>
                                    </div>
                                    {formData.is_insured === true && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                            
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.is_insured === false
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('is_insured', false)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 mr-3 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">No insurance yet</p>
                                            <p className="text-sm text-gray-600">I plan to get coverage later</p>
                                        </div>
                                    </div>
                                    {formData.is_insured === false && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WCB Coverage */}
                    <div>
                        <Label className="text-sm font-medium mb-3 block">
                            Do you have Workers' Compensation coverage?
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.has_wcb_coverage === true
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('has_wcb_coverage', true)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 mr-3" style={{color: '#10B3D6'}} />
                                        <div>
                                            <p className="font-medium text-gray-900">Yes, I have WCB coverage</p>
                                            <p className="text-sm text-gray-600">Registered with provincial WCB</p>
                                        </div>
                                    </div>
                                    {formData.has_wcb_coverage === true && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                            
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.has_wcb_coverage === false
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('has_wcb_coverage', false)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Shield className="h-5 w-5 mr-3 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">No WCB coverage</p>
                                            <p className="text-sm text-gray-600">Not registered yet</p>
                                        </div>
                                    </div>
                                    {formData.has_wcb_coverage === false && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Check */}
                    <div>
                        <Label className="text-sm font-medium mb-3 block">
                            Do you have a current criminal background check?
                        </Label>
                        <div className="grid grid-cols-1 gap-3">
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.has_criminal_background_check === true
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('has_criminal_background_check', true)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-3" style={{color: '#10B3D6'}} />
                                        <div>
                                            <p className="font-medium text-gray-900">Yes, I have background check</p>
                                            <p className="text-sm text-gray-600">Current police clearance</p>
                                        </div>
                                    </div>
                                    {formData.has_criminal_background_check === true && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                            
                            <div
                                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    formData.has_criminal_background_check === false
                                        ? 'border-[#10B3D6] bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => handleBasicFieldChange('has_criminal_background_check', false)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <X className="h-5 w-5 mr-3 text-gray-400" />
                                        <div>
                                            <p className="font-medium text-gray-900">No background check</p>
                                            <p className="text-sm text-gray-600">I can get one if needed</p>
                                        </div>
                                    </div>
                                    {formData.has_criminal_background_check === false && (
                                        <CheckCircle className="h-5 w-5" style={{color: '#10B3D6'}} />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Check Date */}
                    {formData.has_criminal_background_check && (
                        <div>
                            <Label htmlFor="background_check_date" className="text-sm font-medium">
                                When did you get your background check?
                            </Label>
                            <Input
                                id="background_check_date"
                                type="date"
                                value={formData.background_check_date || ''}
                                onChange={(e) => handleBasicFieldChange('background_check_date', e.target.value)}
                                className="mt-1"
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Most employers want checks less than 1 year old
                            </p>
                        </div>
                    )}
                </CardContent>
              </Card>

            {/* Insurance Help */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-yellow-800 mb-1">About Insurance & Coverage</p>
                        <p className="text-yellow-700 text-xs">
                            While not always required, having insurance and background checks makes you more attractive to employers. 
                            Many jobs in people's homes require background checks for safety.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Image, Plus, X, Edit, Save, Upload, Award, Calendar, CheckCircle, AlertCircle } from 'react-feather';

interface PortfolioCertificationsTabProps {
    profile: any;
    onUpdate: (data: any) => void;
}

export default function PortfolioCertificationsTab({ profile, onUpdate }: PortfolioCertificationsTabProps) {
    const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
    const [isEditingCertifications, setIsEditingCertifications] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    const [portfolioPhotos, setPortfolioPhotos] = useState(profile?.portfolio_photos || []);
    const [certifications, setCertifications] = useState(profile?.certifications || []);

    const addPortfolioPhoto = () => {
        const newPhoto = {
            id: Date.now(),
            caption: '',
            file: null,
            preview: null
        };
        setPortfolioPhotos([...portfolioPhotos, newPhoto]);
    };

    const removePortfolioPhoto = (id: number) => {
        setPortfolioPhotos(portfolioPhotos.filter((photo: any) => photo.id !== id));
    };

    const updatePortfolioPhoto = (id: number, field: string, value: any) => {
        setPortfolioPhotos(portfolioPhotos.map((photo: any) => 
            photo.id === id ? { ...photo, [field]: value } : photo
        ));
    };

    const handleFileSelect = (id: number, file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            updatePortfolioPhoto(id, 'file', file);
            updatePortfolioPhoto(id, 'preview', e.target?.result);
        };
        reader.readAsDataURL(file);
    };

    const savePortfolioPhotos = async () => {
        setIsSaving(true);
        try {
            console.log('Saving portfolio photos:', portfolioPhotos);
            
            // Create a FormData-compatible structure for portfolio photos
            const portfolioData: any = {};
            
            portfolioPhotos.forEach((photo: any, index: number) => {
                if (photo.file) {
                    portfolioData[`portfolio_photos[${index}][file]`] = photo.file;
                    portfolioData[`portfolio_photos[${index}][caption]`] = photo.caption || '';
                    
                    console.log(`📸 Portfolio photo ${index}:`, {
                        name: photo.file.name,
                        size: photo.file.size,
                        type: photo.file.type,
                        caption: photo.caption || 'No caption'
                    });
                }
            });
            
            console.log('🗂️ Portfolio data structure keys:', Object.keys(portfolioData));
            
            await onUpdate(portfolioData);
            
            console.log('Portfolio photos saved successfully');
            setIsEditingPortfolio(false);
        } catch (error) {
            console.error('Error saving portfolio photos:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const addCertification = () => {
        const newCertification = {
            id: Date.now(),
            name: '',
            issuing_organization: '',
            issue_date: '',
            expiry_date: '',
            credential_id: '',
            verification_url: '',
            is_verified: false
        };
        setCertifications([...certifications, newCertification]);
    };

    const removeCertification = (id: number) => {
        setCertifications(certifications.filter((cert: any) => cert.id !== id));
    };

    const updateCertification = (id: number, field: string, value: any) => {
        setCertifications(certifications.map((cert: any) => 
            cert.id === id ? { ...cert, [field]: value } : cert
        ));
    };

    const handlePortfolioSave = async () => {
        try {
            await onUpdate({ portfolio_photos: portfolioPhotos });
            setIsEditingPortfolio(false);
        } catch (error) {
            console.error('Error updating portfolio:', error);
        }
    };

    const handleCertificationsSave = async () => {
        try {
            await onUpdate({ certifications: certifications });
            setIsEditingCertifications(false);
        } catch (error) {
            console.error('Error updating certifications:', error);
        }
    };

    const isExpired = (expiryDate: string) => {
        if (!expiryDate) return false;
        return new Date(expiryDate) < new Date();
    };

    const isExpiringSoon = (expiryDate: string) => {
        if (!expiryDate) return false;
        const expiryTime = new Date(expiryDate).getTime();
        const currentTime = new Date().getTime();
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        return expiryTime - currentTime <= thirtyDaysInMs && expiryTime > currentTime;
    };

    return (
        <div className="space-y-6">
            {/* Portfolio Section */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl" style={{ color: '#192341' }}>
                                Portfolio
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Photos of your work to show employers your quality
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-sm">
                                {portfolioPhotos.length} {portfolioPhotos.length === 1 ? 'Photo' : 'Photos'}
                            </Badge>
                            {isEditingPortfolio ? (
                                <div className="flex space-x-2">
                                    <Button
                                        onClick={savePortfolioPhotos}
                                        disabled={isSaving}
                                        className="text-white cursor-pointer"
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        size="sm"
                                    >
                                        <Save className="w-4 h-4 mr-2" />
                                        {isSaving ? 'Saving...' : 'Save Portfolio'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setIsEditingPortfolio(false)}
                                        className="cursor-pointer"
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditingPortfolio(true)}
                                    className="cursor-pointer"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Portfolio
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditingPortfolio ? (
                        <div className="space-y-6">
                            {/* Add New Photo Button */}
                            <Button
                                onClick={addPortfolioPhoto}
                                className="text-white cursor-pointer"
                                style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Portfolio Photo
                            </Button>

                            {/* Portfolio Photos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolioPhotos.map((photo: any, index: number) => (
                                    <div key={photo.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                        {/* Photo Upload Area */}
                                        <div className="relative">
                                            <div
                                                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#10B3D6] transition-colors"
                                                onClick={() => document.getElementById(`photo-upload-${photo.id}`)?.click()}
                                            >
                                                {photo.preview ? (
                                                    <img
                                                        src={photo.preview}
                                                        alt={`Portfolio ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <div className="text-center">
                                                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                                                        <p className="text-sm text-gray-500">Click to upload photo</p>
                                                        <p className="text-xs text-gray-400">JPG, PNG up to 5MB</p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                id={`photo-upload-${photo.id}`}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        handleFileSelect(photo.id, file);
                                                    }
                                                }}
                                            />
                                            {/* Remove Button */}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removePortfolioPhoto(photo.id)}
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Caption */}
                                        <div>
                                            <Label className="text-sm font-medium">Caption</Label>
                                            <Textarea
                                                value={photo.caption || ''}
                                                onChange={(e) => updatePortfolioPhoto(photo.id, 'caption', e.target.value)}
                                                className="mt-1 h-16"
                                                placeholder="Describe what this photo shows..."
                                                maxLength={150}
                                            />
                                            <p className="text-xs text-gray-400 mt-1">
                                                {(photo.caption || '').length}/150
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {portfolioPhotos.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Image className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No portfolio photos added yet</p>
                                    <p className="text-sm">Add photos of your work to showcase your skills</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setPortfolioPhotos(profile?.portfolio_photos || []);
                                        setIsEditingPortfolio(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handlePortfolioSave}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Portfolio
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {portfolioPhotos.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {portfolioPhotos.map((photo: any, index: number) => (
                                        <div key={photo.id} className="relative group">
                                            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                                {photo.url ? (
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.caption || `Portfolio ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <Image className="h-8 w-8 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            {photo.caption && (
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{photo.caption}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Image className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No portfolio photos added yet</p>
                                    <p className="text-sm">Click "Edit Portfolio" to add photos of your work</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Certifications Section */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl" style={{ color: '#192341' }}>
                                Certifications & Qualifications
                            </CardTitle>
                            <p className="text-sm text-gray-600 mt-1">
                                Professional certifications, licenses, and training certificates
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="outline" className="text-sm">
                                {certifications.length} {certifications.length === 1 ? 'Certification' : 'Certifications'}
                            </Badge>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsEditingCertifications(!isEditingCertifications)}
                                className="cursor-pointer"
                            >
                                {isEditingCertifications ? (
                                    <>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit className="w-4 h-4 mr-2" />
                                        Edit Certifications
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isEditingCertifications ? (
                        <div className="space-y-6">
                            {/* Add New Certification Button */}
                            <Button
                                onClick={addCertification}
                                className="text-white cursor-pointer"
                                style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Certification
                            </Button>

                            {/* Certifications */}
                            <div className="space-y-6">
                                {certifications.map((certification: any, index: number) => (
                                    <div key={certification.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                        {/* Header */}
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-medium text-gray-900">Certification #{index + 1}</h4>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeCertification(certification.id)}
                                                className="text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                                            >
                                                <X className="h-5 w-5" />
                                            </Button>
                                        </div>

                                        <div className="space-y-4">
                                            {/* Name and Organization */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-sm font-medium">Certification Name *</Label>
                                                    <Input
                                                        value={certification.name || ''}
                                                        onChange={(e) => updateCertification(certification.id, 'name', e.target.value)}
                                                        placeholder="Food Handler's Certificate"
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium">Issuing Organization *</Label>
                                                    <Input
                                                        value={certification.issuing_organization || ''}
                                                        onChange={(e) => updateCertification(certification.id, 'issuing_organization', e.target.value)}
                                                        placeholder="Public Health Ontario"
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>

                                            {/* Dates */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-sm font-medium">Issue Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={certification.issue_date || ''}
                                                        onChange={(e) => updateCertification(certification.id, 'issue_date', e.target.value)}
                                                        className="mt-1"
                                                        max={new Date().toISOString().split('T')[0]}
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium">Expiry Date (if applicable)</Label>
                                                    <Input
                                                        type="date"
                                                        value={certification.expiry_date || ''}
                                                        onChange={(e) => updateCertification(certification.id, 'expiry_date', e.target.value)}
                                                        className="mt-1"
                                                        min={certification.issue_date || ''}
                                                    />
                                                </div>
                                            </div>

                                            {/* Credential ID and URL */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <Label className="text-sm font-medium">Credential ID (Optional)</Label>
                                                    <Input
                                                        value={certification.credential_id || ''}
                                                        onChange={(e) => updateCertification(certification.id, 'credential_id', e.target.value)}
                                                        placeholder="ABC123456"
                                                        className="mt-1"
                                                    />
                                                </div>
                                                <div>
                                                    <Label className="text-sm font-medium">Verification URL (Optional)</Label>
                                                    <Input
                                                        type="url"
                                                        value={certification.verification_url || ''}
                                                        onChange={(e) => updateCertification(certification.id, 'verification_url', e.target.value)}
                                                        placeholder="https://verify.example.com"
                                                        className="mt-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {certifications.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No certifications added yet</p>
                                    <p className="text-sm">Add your professional certifications and qualifications</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setCertifications(profile?.certifications || []);
                                        setIsEditingCertifications(false);
                                    }}
                                    className="cursor-pointer"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleCertificationsSave}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Certifications
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {certifications.length > 0 ? (
                                <div className="space-y-4">
                                    {certifications.map((certification: any) => (
                                        <div key={certification.id} className="p-4 border border-gray-200 rounded-lg">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-medium text-gray-900">{certification.name}</h4>
                                                        {certification.expiry_date && (
                                                            <>
                                                                {isExpired(certification.expiry_date) ? (
                                                                    <Badge className="text-xs bg-red-100 text-red-800 border-red-300">
                                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                                        Expired
                                                                    </Badge>
                                                                ) : isExpiringSoon(certification.expiry_date) ? (
                                                                    <Badge className="text-xs bg-yellow-100 text-yellow-800 border-yellow-300">
                                                                        <AlertCircle className="w-3 h-3 mr-1" />
                                                                        Expiring Soon
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="text-xs bg-green-100 text-green-800 border-green-300">
                                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                                        Valid
                                                                    </Badge>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-600 mb-2">{certification.issuing_organization}</p>
                                                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                        {certification.issue_date && (
                                                            <div className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                Issued: {new Date(certification.issue_date).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                        {certification.expiry_date && (
                                                            <div className="flex items-center">
                                                                <Calendar className="w-4 h-4 mr-1" />
                                                                Expires: {new Date(certification.expiry_date).toLocaleDateString()}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {certification.credential_id && (
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            ID: {certification.credential_id}
                                                        </p>
                                                    )}
                                                    {certification.verification_url && (
                                                        <a
                                                            href={certification.verification_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer mt-1 inline-block"
                                                        >
                                                            Verify Certificate →
                                                        </a>
                                                    )}
                                                </div>
                                                <Award className="w-5 h-5 text-gray-400" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Award className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                    <p>No certifications added yet</p>
                                    <p className="text-sm">Click "Edit Certifications" to add your professional qualifications</p>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Tips */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Award className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                        <p className="font-medium text-green-800 mb-1">Portfolio & Certification Tips</p>
                        <ul className="text-green-700 text-xs space-y-1 list-disc list-inside">
                            <li>Use high-quality photos that clearly show your work quality</li>
                            <li>Keep certifications up to date - expired certificates may hurt your credibility</li>
                            <li>Include verification links when possible to build trust with employers</li>
                            <li>Add captions to portfolio photos explaining what the work involved</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

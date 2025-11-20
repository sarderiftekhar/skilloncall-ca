import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Image, Plus, X, Edit, Save, Upload, Award, Calendar, CheckCircle, AlertCircle, Trash2 } from 'react-feather';

interface PortfolioCertificationsTabProps {
    profile: any;
    onUpdate: (data: any) => void;
}

export default function PortfolioCertificationsTab({ profile, onUpdate }: PortfolioCertificationsTabProps) {
    const [isEditingPortfolio, setIsEditingPortfolio] = useState(false);
    const [isEditingCertifications, setIsEditingCertifications] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [certificationToDelete, setCertificationToDelete] = useState<any>(null);
    const [urlErrors, setUrlErrors] = useState<{[key: number]: string}>({});
    
    // Ensure each photo has a unique ID
    const [portfolioPhotos, setPortfolioPhotos] = useState(() => {
        const photos = profile?.portfolio_photos || [];
        return photos.map((photo: any, index: number) => ({
            ...photo,
            id: photo.id || Date.now() + index
        }));
    });
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

    const handleMultipleFileSelect = (files: FileList) => {
        const maxPhotos = 6;
        const currentCount = portfolioPhotos.length;
        const availableSlots = maxPhotos - currentCount;
        const filesToAdd = Math.min(files.length, availableSlots);

        const newPhotos: any[] = [];
        
        for (let i = 0; i < filesToAdd; i++) {
            const file = files[i];
            const photoId = Date.now() + i;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPhoto = {
                    id: photoId,
                    caption: '',
                    file: file,
                    preview: e.target?.result
                };
                
                setPortfolioPhotos(prev => {
                    // Check if this photo was already added
                    if (prev.find((p: any) => p.id === photoId)) {
                        return prev;
                    }
                    return [...prev, newPhoto];
                });
            };
            reader.readAsDataURL(file);
        }

        if (filesToAdd < files.length) {
            alert(`You can only upload up to ${maxPhotos} photos. ${filesToAdd} photos will be added.`);
        }
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
        
        // Validate URL if the field is verification_url
        if (field === 'verification_url') {
            validateUrl(id, value);
        }
    };

    const validateUrl = (id: number, url: string) => {
        if (!url || url.trim() === '') {
            // Clear error if URL is empty (it's optional)
            setUrlErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
            return;
        }

        const urlPattern = /^(https?:\/\/|www\.)/i;
        if (!urlPattern.test(url.trim())) {
            setUrlErrors(prev => ({
                ...prev,
                [id]: 'URL must start with http://, https://, or www.'
            }));
        } else {
            setUrlErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[id];
                return newErrors;
            });
        }
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

    const handleDeleteCertification = async () => {
        if (certificationToDelete) {
            const updatedCerts = certifications.filter((c: any) => c.id !== certificationToDelete.id);
            setCertifications(updatedCerts);
            await onUpdate({ certifications: updatedCerts });
            setShowDeleteModal(false);
            setCertificationToDelete(null);
        }
    };

    return (
        <div className="space-y-6">            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
                    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-2" style={{ color: '#192341' }}>
                                    Remove Certification?
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    Are you sure you want to remove <span className="font-medium text-gray-900">"{certificationToDelete?.name}"</span>? This action cannot be undone.
                                </p>
                            </div>
                        </div>
                        
                        <div className="flex justify-end space-x-3 pt-4">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setShowDeleteModal(false);
                                    setCertificationToDelete(null);
                                }}
                                className="cursor-pointer"
                                style={{ height: '2.7em' }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleDeleteCertification}
                                className="text-white cursor-pointer"
                                style={{ backgroundColor: '#DC2626', height: '2.7em' }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                            </Button>
                        </div>
                    </div>
                </div>
            )}


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
                            {/* Multiple Photo Upload Button */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    onClick={() => document.getElementById('multiple-photo-upload')?.click()}
                                    disabled={portfolioPhotos.length >= 6}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Photos (Max 6)
                                </Button>
                                <input
                                    id="multiple-photo-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files.length > 0) {
                                            handleMultipleFileSelect(e.target.files);
                                            e.target.value = ''; // Reset input
                                        }
                                    }}
                                />
                                <Button
                                    onClick={addPortfolioPhoto}
                                    disabled={portfolioPhotos.length >= 6}
                                    variant="outline"
                                    className="cursor-pointer"
                                    style={{ height: '2.7em' }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Single Photo
                                </Button>
                            </div>

                            {portfolioPhotos.length >= 6 && (
                                <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 p-3 rounded-lg">
                                    <AlertCircle className="w-5 h-5" />
                                    <p className="text-sm font-medium">
                                        Maximum of 6 portfolio photos reached. Remove a photo to add more.
                                    </p>
                                </div>
                            )}

                            {/* Portfolio Photos */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {portfolioPhotos.map((photo: any, index: number) => (
                                    <div key={photo.id} className="p-4 border border-gray-200 rounded-lg space-y-4">
                                        {/* Photo Upload Area */}
                                        <div className="relative">
                                            <div
                                                className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-[#10B3D6] transition-colors overflow-hidden"
                                                onClick={() => document.getElementById(`photo-upload-${photo.id}`)?.click()}
                                            >
                                                {(photo.preview || photo.url || photo.path) ? (
                                                    <img
                                                        src={(() => {
                                                            if (photo.preview) return photo.preview;
                                                            if (photo.url) {
                                                                // If already a full URL, use it as is
                                                                if (photo.url.startsWith('http://') || photo.url.startsWith('https://')) {
                                                                    return photo.url;
                                                                }
                                                                return photo.url;
                                                            }
                                                            if (photo.path) {
                                                                // If already a full URL, use it as is
                                                                if (photo.path.startsWith('http://') || photo.path.startsWith('https://')) {
                                                                    return photo.path;
                                                                }
                                                                // Remove any existing /storage/ prefix
                                                                let cleanPath = photo.path.replace(/^\/?storage\//, '');
                                                                cleanPath = cleanPath.replace(/^\/+/, '');
                                                                return `/storage/${cleanPath}`;
                                                            }
                                                            return '';
                                                        })()}
                                                        alt={`Portfolio ${index + 1}`}
                                                        className="w-full h-full object-cover rounded-lg"
                                                        onError={(e) => {
                                                            // If image fails to load, show upload placeholder
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const parent = target.parentElement;
                                                            if (parent && !parent.querySelector('.upload-placeholder')) {
                                                                const placeholder = document.createElement('div');
                                                                placeholder.className = 'upload-placeholder text-center';
                                                                placeholder.innerHTML = '<svg class="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg><p class="text-sm text-gray-500">Click to upload photo</p><p class="text-xs text-gray-400">JPG, PNG up to 5MB</p>';
                                                                parent.appendChild(placeholder);
                                                            }
                                                        }}
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
                                        const photos = profile?.portfolio_photos || [];
                                        setPortfolioPhotos(photos.map((photo: any, index: number) => ({
                                            ...photo,
                                            id: photo.id || Date.now() + index
                                        })));
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
                                        <div key={photo.id || index} className="relative group">
                                            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                                                {(photo.url || photo.path || photo.preview) ? (
                                                    <img
                                                        src={(() => {
                                                            if (photo.preview) return photo.preview;
                                                            if (photo.url) {
                                                                // If already a full URL, use it as is
                                                                if (photo.url.startsWith('http://') || photo.url.startsWith('https://')) {
                                                                    return photo.url;
                                                                }
                                                                return photo.url;
                                                            }
                                                            if (photo.path) {
                                                                // If already a full URL, use it as is
                                                                if (photo.path.startsWith('http://') || photo.path.startsWith('https://')) {
                                                                    return photo.path;
                                                                }
                                                                // Remove any existing /storage/ prefix
                                                                let cleanPath = photo.path.replace(/^\/?storage\//, '');
                                                                cleanPath = cleanPath.replace(/^\/+/, '');
                                                                return `/storage/${cleanPath}`;
                                                            }
                                                            return '';
                                                        })()}
                                                        alt={photo.caption || `Portfolio ${index + 1}`}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                        onError={(e) => {
                                                            // If image fails to load, show placeholder
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const parent = target.parentElement;
                                                            if (parent && !parent.querySelector('.placeholder-icon')) {
                                                                const placeholder = document.createElement('div');
                                                                placeholder.className = 'placeholder-icon w-full h-full flex items-center justify-center';
                                                                placeholder.innerHTML = '<svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>';
                                                                parent.appendChild(placeholder);
                                                            }
                                                        }}
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
                                            <h4 className="font-medium" style={{ color: '#192341' }}>Certification #{index + 1}</h4>
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
                                                        className={`mt-1 ${urlErrors[certification.id] ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
                                                    />
                                                    {urlErrors[certification.id] && (
                                                        <p className="text-sm text-red-600 mt-1 flex items-center">
                                                            <AlertCircle className="w-4 h-4 mr-1" />
                                                            {urlErrors[certification.id]}
                                                        </p>
                                                    )}
                                                    {!urlErrors[certification.id] && certification.verification_url && certification.verification_url.trim() !== '' && (
                                                        <p className="text-sm text-green-600 mt-1 flex items-center">
                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                            Valid URL format
                                                        </p>
                                                    )}
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
                                                        <h4 className="font-medium" style={{ color: '#192341' }}>{certification.name}</h4>
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
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            setCertificationToDelete(certification);
                                                            setShowDeleteModal(true);
                                                        }}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                                                        title="Remove certification"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                    <Award className="w-5 h-5 text-gray-400" />
                                                </div>
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

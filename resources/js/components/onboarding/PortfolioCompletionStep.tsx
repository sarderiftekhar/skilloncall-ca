import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
    Camera, 
    Upload, 
    X, 
    CheckCircle, 
    AlertCircle,
    Instagram,
    Facebook,
    Star,
    Shield,
    Clock
} from 'react-feather';

interface PortfolioCompletionStepProps {
    formData: any;
    updateFormData: (data: any) => void;
    validationErrors: any;
}

interface PortfolioPhoto {
    id: string;
    file: File | null;
    preview: string;
    description: string;
}

interface SocialMediaLink {
    platform: string;
    url: string;
    is_public: boolean;
}

export default function PortfolioCompletionStep({
    formData,
    updateFormData,
    validationErrors
}: PortfolioCompletionStepProps) {
    const [portfolioPhotos, setPortfolioPhotos] = useState<PortfolioPhoto[]>(
        formData.portfolio_photos || []
    );
    const [socialMediaLinks, setSocialMediaLinks] = useState<SocialMediaLink[]>(
        formData.social_media_links || []
    );

    // Portfolio Photo Management
    const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        const newPhotos: PortfolioPhoto[] = [];
        for (let i = 0; i < files.length && portfolioPhotos.length + newPhotos.length < 6; i++) {
            const file = files[i];
            const photoId = `${Date.now()}-${i}`;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                const newPhoto: PortfolioPhoto = {
                    id: photoId,
                    file: file,
                    preview: e.target?.result as string,
                    description: ''
                };
                
                setPortfolioPhotos(prev => {
                    const updated = [...prev, newPhoto];
                    updateFormData({ portfolio_photos: updated });
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        }
    };

    const removePhoto = (photoId: string) => {
        const updated = portfolioPhotos.filter(photo => photo.id !== photoId);
        setPortfolioPhotos(updated);
        updateFormData({ portfolio_photos: updated });
    };

    const updatePhotoDescription = (photoId: string, description: string) => {
        const updated = portfolioPhotos.map(photo =>
            photo.id === photoId ? { ...photo, description } : photo
        );
        setPortfolioPhotos(updated);
        updateFormData({ portfolio_photos: updated });
    };

    // Social Media Management
    const addSocialMediaLink = (platform: string) => {
        const newLink: SocialMediaLink = {
            platform,
            url: '',
            is_public: true
        };
        const updated = [...socialMediaLinks, newLink];
        setSocialMediaLinks(updated);
        updateFormData({ social_media_links: updated });
    };

    const updateSocialMediaLink = (index: number, field: string, value: any) => {
        const updated = socialMediaLinks.map((link, i) =>
            i === index ? { ...link, [field]: value } : link
        );
        setSocialMediaLinks(updated);
        updateFormData({ social_media_links: updated });
    };

    const removeSocialMediaLink = (index: number) => {
        const updated = socialMediaLinks.filter((_, i) => i !== index);
        setSocialMediaLinks(updated);
        updateFormData({ social_media_links: updated });
    };

    // Profile Completion Check
    const getProfileCompletion = () => {
        const sections = {
            personal: !!(formData.first_name && formData.last_name && formData.phone),
            skills: !!(formData.selected_skills && formData.selected_skills.length > 0),
            workHistory: !!(formData.work_experiences && formData.work_experiences.length > 0),
            location: !!(formData.hourly_rate_min && formData.travel_distance_max),
            languages: !!(formData.selected_languages && formData.selected_languages.length > 0),
            availability: !!(formData.availability && formData.availability.some((slot: any) => slot.is_available))
        };

        const completed = Object.values(sections).filter(Boolean).length;
        const total = Object.keys(sections).length;
        const percentage = Math.round((completed / total) * 100);

        return { sections, completed, total, percentage };
    };

    const completion = getProfileCompletion();
    const isReadyToComplete = completion.percentage >= 80;
    const isFullyComplete = completion.percentage >= 100;

    return (
        <div className="space-y-6">
            {/* Compact success badge when fully complete */}
            {isFullyComplete && (
                <div className="flex justify-end">
                    <Badge className="px-3 py-1 text-xs" style={{backgroundColor: '#16a34a', color: 'white'}}>
                        <span className="inline-flex items-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-white" />
                            Profile complete • 100%
                        </span>
                    </Badge>
                </div>
            )}

            {/* Welcome Message */}
            <div className="text-center mb-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full mx-auto mb-4" 
                     style={{backgroundColor: '#FCF2F0'}}>
                    <Camera className="h-8 w-8" style={{color: '#10B3D6'}} />
                </div>
                <h2 className="text-xl font-bold mb-2" style={{color: '#192341'}}>
                    Portfolio & Complete Setup
                </h2>
                <p className="text-gray-600 text-sm">
                    Add work samples to showcase your skills and finalize your profile.
                </p>
            </div>

            {/* Profile Completion Status - hide bulky card when fully complete */}
            {!isFullyComplete && (
                <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                            Profile Completion: {completion.percentage}%
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                                className="h-3 rounded-full transition-all duration-500"
                                style={{
                                    backgroundColor: '#10B3D6',
                                    width: `${completion.percentage}%`
                                }}
                            />
                        </div>

                        {/* Section Checklist */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {Object.entries({
                                'Personal Info': completion.sections.personal,
                                'Skills & Experience': completion.sections.skills,
                                'Work History': completion.sections.workHistory,
                                'Location & Rates': completion.sections.location,
                                'Languages': completion.sections.languages,
                                'Availability': completion.sections.availability
                            }).map(([section, completed]) => (
                                <div key={section} className="flex items-center">
                                    {completed ? (
                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                    ) : (
                                        <AlertCircle className="h-4 w-4 mr-2 text-orange-500" />
                                    )}
                                    <span className={completed ? 'text-green-700' : 'text-orange-700'}>
                                        {section}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Completion Status */}
                        {isReadyToComplete ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="font-medium text-green-800">Ready to Complete!</p>
                                        <p className="text-sm text-green-700">
                                            Your profile has all the essential information. Add portfolio photos below to make it even better.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <AlertCircle className="h-5 w-5 text-orange-600" />
                                    <div>
                                        <p className="font-medium text-orange-800">Almost There!</p>
                                        <p className="text-sm text-orange-700">
                                            Complete a few more sections to activate your profile and start receiving job opportunities.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Portfolio Photos */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center justify-between">
                        <span className="flex items-center">
                            <Camera className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />
                            Work Portfolio (Optional)
                        </span>
                        <Badge variant="outline" className="text-xs">
                            {portfolioPhotos.length}/6 photos
                        </Badge>
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                        Show examples of your work to help employers understand your quality and style.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                        <div className="text-center">
                            <Camera className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                            <p className="font-medium text-gray-700 mb-2">Add Work Photos</p>
                            <p className="text-sm text-gray-500 mb-4">
                                Upload photos of your completed work, clean workspaces, or professional results
                            </p>
                            
                            <input
                                type="file"
                                id="portfolio-upload"
                                accept="image/*"
                                multiple
                                onChange={handlePhotoUpload}
                                className="hidden"
                                disabled={portfolioPhotos.length >= 6}
                            />
                            
                            <Button
                                asChild
                                disabled={portfolioPhotos.length >= 6}
                                className="text-white cursor-pointer"
                                style={{backgroundColor: '#10B3D6', height: '2.7em'}}
                            >
                                <label htmlFor="portfolio-upload">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose Photos
                                </label>
                            </Button>
                            
                            {portfolioPhotos.length >= 6 && (
                                <p className="text-sm text-gray-500 mt-2">Maximum 6 photos reached</p>
                            )}
                        </div>
                    </div>

                    {/* Portfolio Photos Grid */}
                    {portfolioPhotos.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {portfolioPhotos.map((photo) => (
                                <div key={photo.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                    {/* Photo */}
                                    <div className="relative">
                                        <img 
                                            src={photo.preview} 
                                            alt="Portfolio"
                                            className="w-full h-48 object-cover"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removePhoto(photo.id)}
                                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white hover:bg-opacity-70 cursor-pointer"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    
                                    {/* Description */}
                                    <div className="p-3">
                                        <Textarea
                                            value={photo.description}
                                            onChange={(e) => updatePhotoDescription(photo.id, e.target.value)}
                                            placeholder="Describe this work example..."
                                            className="h-16 text-sm"
                                            maxLength={150}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">
                                            {photo.description.length}/150
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Portfolio Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                            <Star className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-blue-800 mb-1">Great Portfolio Photos Include:</p>
                                <p className="text-blue-700 text-xs">
                                    • Before/after shots of your work<br />
                                    • Clean, well-lit photos<br />
                                    • Your workspace or tools<br />
                                    • Completed projects you're proud of<br />
                                    • Professional-looking results
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Social Media Links */}
            <Card className="border" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Social Media & Professional Links (Optional)</CardTitle>
                    <p className="text-sm text-gray-600">
                        Share links to your professional social media or portfolio websites.
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Add Social Media Buttons */}
                    {socialMediaLinks.length < 3 && (
                        <div className="flex flex-wrap gap-3">
                            {!socialMediaLinks.find(link => link.platform === 'instagram') && (
                                <Button
                                    variant="outline"
                                    onClick={() => addSocialMediaLink('instagram')}
                                    className="cursor-pointer"
                                >
                                    <Instagram className="h-4 w-4 mr-2" />
                                    Instagram
                                </Button>
                            )}
                            {!socialMediaLinks.find(link => link.platform === 'facebook') && (
                                <Button
                                    variant="outline"
                                    onClick={() => addSocialMediaLink('facebook')}
                                    className="cursor-pointer"
                                >
                                    <Facebook className="h-4 w-4 mr-2" />
                                    Facebook
                                </Button>
                            )}
                            {!socialMediaLinks.find(link => link.platform === 'website') && (
                                <Button
                                    variant="outline"
                                    onClick={() => addSocialMediaLink('website')}
                                    className="cursor-pointer"
                                >
                                    <Camera className="h-4 w-4 mr-2" />
                                    Website
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Social Media Links */}
                    <div className="space-y-3">
                        {socialMediaLinks.map((link, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                <div className="flex items-center min-w-0 flex-1">
                                    {link.platform === 'instagram' && <Instagram className="h-5 w-5 mr-2 text-pink-600" />}
                                    {link.platform === 'facebook' && <Facebook className="h-5 w-5 mr-2 text-blue-600" />}
                                    {link.platform === 'website' && <Camera className="h-5 w-5 mr-2" style={{color: '#10B3D6'}} />}
                                    
                                    <div className="flex-1 min-w-0">
                                        <Label className="text-sm font-medium capitalize">{link.platform}</Label>
                                        <Input
                                            value={link.url}
                                            onChange={(e) => updateSocialMediaLink(index, 'url', e.target.value)}
                                            placeholder={`Your ${link.platform} URL`}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>
                                
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeSocialMediaLink(index)}
                                    className="text-gray-400 hover:text-red-500 cursor-pointer flex-shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                    {socialMediaLinks.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                            <Camera className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No social media links added yet</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Final Privacy Notice */}
            <Card className="border bg-blue-50" style={{borderColor: '#10B3D6', borderWidth: '0.05px'}}>
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        <Shield className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <h3 className="font-semibold text-blue-900 mb-2">Your Profile is Almost Ready!</h3>
                            <div className="text-sm text-blue-800 space-y-2">
                                <p>
                                    <strong>What happens next:</strong>
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-blue-700 ml-4">
                                    <li>Your profile will be visible to employers in your area</li>
                                    <li>You'll start receiving job notifications matching your skills</li>
                                    <li>Employers can contact you for work opportunities</li>
                                    <li>You can browse and apply for jobs immediately</li>
                                </ul>
                                
                                <div className="bg-blue-100 rounded-lg p-3 mt-3">
                                    <div className="flex items-center">
                                        <Clock className="h-4 w-4 mr-2 text-blue-600" />
                                        <p className="text-xs text-blue-800 font-medium">
                                            You can update your profile, rates, and availability anytime from your dashboard.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Completion Status for Button */}
            {!isReadyToComplete && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-orange-600" />
                        <div className="text-sm">
                            <p className="font-medium text-orange-800">Complete Required Sections</p>
                            <p className="text-orange-700">
                                Go back and complete the missing sections marked with ⚠️ above to finish your setup.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {validationErrors.general && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm">{validationErrors.general}</p>
                </div>
            )}
        </div>
    );
}



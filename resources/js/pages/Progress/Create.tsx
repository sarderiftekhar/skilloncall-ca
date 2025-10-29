import { Head, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Plus,
    ArrowLeft,
    Upload,
    X
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

// Form data interface
interface FormData {
    main_section: string;
    feature_section: string;
    conditions_applied: string;
    designed: 'YES' | 'NO' | 'PENDING';
    testing: 'YES' | 'NO' | 'PENDING';
    debug: 'YES' | 'NO' | 'PENDING';
    confirm: 'YES' | 'NO' | 'PENDING';
    uat: 'YES' | 'NO' | 'PENDING';
    notes_comments: string;
    page_url_link: string;
    screenshots: File[];
}

export default function CreateProgressEntry() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<FormData>({
        main_section: '',
        feature_section: '',
        conditions_applied: '',
        designed: 'PENDING',
        testing: 'PENDING',
        debug: 'PENDING',
        confirm: 'PENDING',
        uat: 'PENDING',
        notes_comments: '',
        page_url_link: '',
        screenshots: []
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setFormData(prev => ({
            ...prev,
            screenshots: [...prev.screenshots, ...files]
        }));
    };

    const handlePasteScreenshot = async (event: ClipboardEvent) => {
        const items = event.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const file = new File([blob], `pasted-screenshot-${Date.now()}.png`, {
                        type: 'image/png'
                    });
                    setFormData(prev => ({
                        ...prev,
                        screenshots: [...prev.screenshots, file]
                    }));
                }
            }
        }
    };

    const removeScreenshot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            screenshots: prev.screenshots.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const submitData = new FormData();
            
            // Add text fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'screenshots' && value) {
                    submitData.append(key, value);
                }
            });

            // Add screenshots
            formData.screenshots.forEach((file, index) => {
                submitData.append(`screenshots[${index}]`, file);
            });

            router.post('/progress', submitData, {
                preserveScroll: true,
                onSuccess: () => {
                    router.visit('/progress');
                }
            });
        } catch (error) {
            console.error('Error creating entry:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        document.addEventListener('paste', handlePasteScreenshot);
        return () => document.removeEventListener('paste', handlePasteScreenshot);
    }, []);

    return (
        <PublicLayout title="Create New Progress Entry">
            <div className="w-full px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{color: '#192341'}}>
                                Create New Progress Entry
                            </h1>
                            <p className="text-lg leading-relaxed text-gray-600 mt-1">
                                Add a new development progress entry for SkillOnCall.ca
                            </p>
                        </div>
                        <Button 
                            variant="outline"
                            onClick={() => router.visit('/progress')}
                            className="cursor-pointer hover:scale-105 transition-all duration-200"
                            style={{height: '2.7em'}}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to List
                        </Button>
                    </div>

                    {/* Create Form */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{borderTop: '0.5px solid #192341'}}>
                        <CardHeader>
                            <CardTitle className="text-lg font-semibold">
                                Entry Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Main Section *
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.main_section}
                                            onChange={(e) => setFormData(prev => ({...prev, main_section: e.target.value}))}
                                            required
                                            placeholder="e.g., Welcome page"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Feature / Section
                                        </label>
                                        <Input
                                            type="text"
                                            value={formData.feature_section}
                                            onChange={(e) => setFormData(prev => ({...prev, feature_section: e.target.value}))}
                                            placeholder="e.g., Login button"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Conditions Applied
                                    </label>
                                    <textarea
                                        value={formData.conditions_applied}
                                        onChange={(e) => setFormData(prev => ({...prev, conditions_applied: e.target.value}))}
                                        rows={3}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe the conditions or requirements applied..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {['designed', 'testing', 'debug', 'confirm', 'uat'].map((field) => (
                                        <div key={field}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                                                {field}
                                            </label>
                                            <select
                                                value={formData[field as keyof FormData] as string}
                                                onChange={(e) => setFormData(prev => ({...prev, [field]: e.target.value}))}
                                                className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="PENDING">PENDING</option>
                                                <option value="YES">YES</option>
                                                <option value="NO">NO</option>
                                            </select>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Notes / Comments
                                    </label>
                                    <textarea
                                        value={formData.notes_comments}
                                        onChange={(e) => setFormData(prev => ({...prev, notes_comments: e.target.value}))}
                                        rows={4}
                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Additional notes or comments..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Page URL / Link
                                    </label>
                                    <Input
                                        type="url"
                                        value={formData.page_url_link}
                                        onChange={(e) => setFormData(prev => ({...prev, page_url_link: e.target.value}))}
                                        placeholder="https://example.com/page"
                                    />
                                </div>

                                {/* Screenshots Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Screenshots / Pictures
                                    </label>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileUpload}
                                                multiple
                                                accept="image/*"
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="cursor-pointer"
                                            >
                                                <Upload className="h-4 w-4 mr-2" />
                                                Browse Files
                                            </Button>
                                            <span className="text-sm text-gray-600">
                                                or paste screenshots (Ctrl+V)
                                            </span>
                                        </div>

                                        {formData.screenshots.length > 0 && (
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                {formData.screenshots.map((file, index) => (
                                                    <div key={index} className="relative border border-gray-200 rounded-lg p-2">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-xs text-gray-600 truncate">
                                                                {file.name}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeScreenshot(index)}
                                                                className="cursor-pointer h-6 w-6 p-0"
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-200">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.visit('/progress')}
                                        className="cursor-pointer"
                                        style={{height: '2.7em'}}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="text-white cursor-pointer"
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        {isSubmitting ? 'Creating...' : 'Create Entry'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    );
}

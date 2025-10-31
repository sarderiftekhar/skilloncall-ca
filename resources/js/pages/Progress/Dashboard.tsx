import { Head, router, usePage } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
    Plus,
    Search,
    Filter,
    Eye,
    Edit,
    Trash2,
    Upload,
    Calendar,
    Clock,
    CheckCircle,
    AlertCircle,
    FileImage,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
    X
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import ViewEntryModal from './ViewEntryModal';

interface ProgressEntry {
    id: number;
    project: string;
    main_section: string;
    feature_section?: string;
    conditions_applied?: string;
    designed: 'YES' | 'NO' | 'PENDING';
    testing: 'YES' | 'NO' | 'PENDING';
    debug: 'YES' | 'NO' | 'PENDING';
    confirm: 'YES' | 'NO' | 'PENDING';
    uat: 'YES' | 'NO' | 'PENDING';
    notes_comments?: string;
    page_url_link?: string;
    screenshots_pictures?: string[];
    created_at: string;
    updated_at: string;
}

interface PaginatedEntries {
    data: ProgressEntry[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
}

interface ProgressDashboardProps {
    entries: PaginatedEntries;
    filters: {
        search?: string;
        status_filter?: string;
    };
}

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

export default function ProgressDashboard({ entries, filters }: ProgressDashboardProps) {
    const { props } = usePage();
    const flash = props.flash as any;
    
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedEntry, setSelectedEntry] = useState<ProgressEntry | null>(null);
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status_filter || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: 'designed:YES', label: 'Designed: Yes' },
        { value: 'designed:PENDING', label: 'Designed: Pending' },
        { value: 'testing:YES', label: 'Testing: Yes' },
        { value: 'testing:PENDING', label: 'Testing: Pending' },
        { value: 'uat:YES', label: 'UAT: Yes' },
        { value: 'uat:PENDING', label: 'UAT: Pending' },
    ];

    const getStatusColor = (status: 'YES' | 'NO' | 'PENDING') => {
        switch (status) {
            case 'YES':
                return 'bg-green-100 text-green-800';
            case 'NO':
                return 'bg-red-100 text-red-800';
            case 'PENDING':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter) params.append('status_filter', statusFilter);
        
        router.get('/progress', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleViewEntry = (entry: ProgressEntry) => {
        setSelectedEntry(entry);
        setShowViewModal(true);
    };

    const handleDeleteEntry = async (entryId: number) => {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        
        setIsLoading(true);
        try {
            router.delete(`/progress/${entryId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Reload the page to refresh data
                    router.reload();
                }
            });
        } catch (error) {
            console.error('Error deleting entry:', error);
        } finally {
            setIsLoading(false);
        }
    };

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
                    setShowCreateForm(false);
                    setFormData({
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
                    router.reload();
                }
            });
        } catch (error) {
            console.error('Error creating entry:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams();
        if (searchTerm) params.append('search', searchTerm);
        if (statusFilter) params.append('status_filter', statusFilter);
        params.append('page', page.toString());
        
        router.get('/progress', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: false
        });
    };

    useEffect(() => {
        if (showCreateForm) {
            document.addEventListener('paste', handlePasteScreenshot);
            return () => document.removeEventListener('paste', handlePasteScreenshot);
        }
    }, [showCreateForm]);

    useEffect(() => {
        if (flash?.success) {
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
            }, 5000);
        }
    }, [flash]);

    return (
        <PublicLayout title="SkillOnCall Progress Tracker">
            
            <div className="w-full px-6 py-8">
                <div className="flex h-full flex-1 flex-col gap-8">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold leading-tight" style={{color: '#192341'}}>
                                SkillOnCall Progress Tracker
                            </h1>
                            <p className="text-lg leading-relaxed text-gray-600 mt-1">
                                Track development progress for the SkillOnCall.ca project
                            </p>
                        </div>
                        <Button 
                            className="text-white cursor-pointer hover:scale-105 transition-all duration-200"
                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            onClick={() => setShowCreateForm(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            New Entry
                        </Button>
                    </div>

                    {/* Success Message */}
                    {showSuccessMessage && flash?.success && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between animate-[slideInDown_0.3s_ease-out]">
                            <div className="flex items-center gap-3">
                                <CheckCircle className="h-5 w-5 text-green-600" />
                                <span className="text-green-800 font-medium">{flash.success}</span>
                            </div>
                            <button
                                onClick={() => setShowSuccessMessage(false)}
                                className="text-green-600 hover:text-green-800 cursor-pointer"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {/* Filters */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{borderTop: '0.5px solid #192341'}}>
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search entries..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        />
                                    </div>
                                </div>
                                <div className="sm:w-64">
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full h-9 rounded-md border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <Button 
                                    onClick={handleSearch}
                                    className="text-white cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filter
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress Tracking Table */}
                    <Card className="bg-white rounded-xl shadow-sm" style={{borderTop: '0.5px solid #192341'}}>
                        <CardHeader className="pb-4">
                            <div>
                                <CardTitle className="text-xl font-bold" style={{color: '#192341'}}>
                                    Current Progress Tracking
                                </CardTitle>
                                <p className="text-sm text-gray-600 mt-1">
                                    Monitor development progress across all sections
                                </p>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            {entries.data.length > 0 ? (
                                <div>
                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-white text-sm font-medium" style={{backgroundColor: '#192341'}}>
                                                    <th className="px-4 py-3 text-left border-r border-gray-500">SL NO</th>
                                                    <th className="px-4 py-3 text-left border-r border-gray-500">MAIN SECTION</th>
                                                    <th className="px-4 py-3 text-left border-r border-gray-500">FEATURE / SECTION</th>
                                                    <th className="px-4 py-3 text-center border-r border-gray-500">DESIGNED & CODING</th>
                                                    <th className="px-4 py-3 text-center border-r border-gray-500">UNIT TESTING</th>
                                                    <th className="px-4 py-3 text-center border-r border-gray-500">DEBUGGING</th>
                                                    <th className="px-4 py-3 text-center border-r border-gray-500">CONFIRMED</th>
                                                    <th className="px-4 py-3 text-center border-r border-gray-500">UAT TESTING</th>
                                                    <th className="px-4 py-3 text-center border-r border-gray-500">ENTRY DATE</th>
                                                    <th className="px-4 py-3 text-center">ACTIONS</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {entries.data.map((entry, index) => (
                                                    <tr key={entry.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {(entries.current_page - 1) * entries.per_page + index + 1}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                            {entry.main_section}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600">
                                                            {entry.feature_section || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge className={getStatusColor(entry.designed)} style={{fontSize: '11px', fontWeight: 'bold'}}>
                                                                {entry.designed}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge className={getStatusColor(entry.testing)} style={{fontSize: '11px', fontWeight: 'bold'}}>
                                                                {entry.testing}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge className={getStatusColor(entry.debug)} style={{fontSize: '11px', fontWeight: 'bold'}}>
                                                                {entry.debug}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge className={getStatusColor(entry.confirm)} style={{fontSize: '11px', fontWeight: 'bold'}}>
                                                                {entry.confirm}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <Badge className={getStatusColor(entry.uat)} style={{fontSize: '11px', fontWeight: 'bold'}}>
                                                                {entry.uat}
                                                            </Badge>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-600 text-center">
                                                            {new Date(entry.created_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="px-4 py-3 text-center">
                                                            <div className="flex items-center justify-center gap-3">
                                                                <button
                                                                    onClick={() => handleViewEntry(entry)}
                                                                    className="text-green-600 hover:text-green-800 cursor-pointer p-1 hover:bg-green-50 rounded transition-all duration-200"
                                                                    title="View Entry"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => window.location.href = `/progress/${entry.id}/edit`}
                                                                    className="text-blue-600 hover:text-blue-800 cursor-pointer p-1 hover:bg-blue-50 rounded transition-all duration-200"
                                                                    title="Edit Entry"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteEntry(entry.id)}
                                                                    className="text-red-600 hover:text-red-800 cursor-pointer p-1 hover:bg-red-50 rounded transition-all duration-200"
                                                                    disabled={isLoading}
                                                                    title="Delete Entry"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
                                        <div className="text-sm text-gray-600">
                                            Showing {entries.from} to {entries.to} of {entries.total} entries
                                        </div>
                                        {entries.last_page > 1 && (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={entries.current_page === 1}
                                                    onClick={() => handlePageChange(entries.current_page - 1)}
                                                    className="cursor-pointer"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: Math.min(entries.last_page, 5) }, (_, i) => {
                                                        const page = i + 1;
                                                        return (
                                                            <Button
                                                                key={page}
                                                                variant={entries.current_page === page ? "default" : "outline"}
                                                                size="sm"
                                                                onClick={() => handlePageChange(page)}
                                                                className="cursor-pointer w-8 h-8 p-0"
                                                                style={entries.current_page === page ? {backgroundColor: '#192341', color: 'white'} : {}}
                                                            >
                                                                {page}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    disabled={entries.current_page === entries.last_page}
                                                    onClick={() => handlePageChange(entries.current_page + 1)}
                                                    className="cursor-pointer"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No progress entries found{searchTerm || statusFilter ? ' matching your filters' : ''}</p>
                                    <Button 
                                        className="text-white cursor-pointer"
                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                        onClick={() => setShowCreateForm(true)}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Create First Entry
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Create Form Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold" style={{color: '#192341'}}>
                                    Create New Progress Entry
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowCreateForm(false)}
                                    className="cursor-pointer"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

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
                                        onClick={() => setShowCreateForm(false)}
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
                                        {isSubmitting ? 'Creating...' : 'Create Entry'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* View Entry Modal */}
            {showViewModal && selectedEntry && (
                <ViewEntryModal
                    entry={selectedEntry}
                    onClose={() => {
                        setShowViewModal(false);
                        setSelectedEntry(null);
                    }}
                />
            )}
        </PublicLayout>
    );
}

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
    X,
    Calendar,
    ExternalLink,
    FileImage,
    Edit,
    Trash2,
    Download
} from 'lucide-react';
import { router } from '@inertiajs/react';

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

interface ViewEntryModalProps {
    entry: ProgressEntry;
    onClose: () => void;
}

export default function ViewEntryModal({ entry, onClose }: ViewEntryModalProps) {
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
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this entry?')) return;
        
        try {
            router.delete(`/progress/${entry.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    onClose();
                    router.reload();
                }
            });
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    const handleEdit = () => {
        window.location.href = `/progress/${entry.id}/edit`;
    };

    const getScreenshotUrl = (path: string) => {
        return `/storage/${path}`;
    };

    const statusFields = [
        { key: 'designed', label: 'Designed', value: entry.designed },
        { key: 'testing', label: 'Testing', value: entry.testing },
        { key: 'debug', label: 'Debug', value: entry.debug },
        { key: 'confirm', label: 'Confirm', value: entry.confirm },
        { key: 'uat', label: 'UAT', value: entry.uat },
    ];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold mb-1" style={{color: '#192341'}}>
                            Progress Entry Details
                        </h2>
                        <p className="text-sm text-gray-600">
                            Created {formatDate(entry.created_at)}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleEdit}
                            className="cursor-pointer hover:scale-105 transition-all duration-200"
                        >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className="cursor-pointer hover:scale-105 transition-all duration-200 text-red-600 hover:text-red-800"
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onClose}
                            className="cursor-pointer"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Main Section
                            </label>
                            <div className="text-lg font-semibold" style={{color: '#192341'}}>
                                {entry.main_section}
                            </div>
                        </div>

                        {entry.feature_section && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Feature / Section
                                </label>
                                <div className="text-lg" style={{color: '#192341'}}>
                                    {entry.feature_section}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Project Badge */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project
                        </label>
                        <Badge 
                            className="text-white capitalize" 
                            style={{backgroundColor: '#10B3D6'}}
                        >
                            {entry.project}
                        </Badge>
                    </div>

                    {/* Conditions Applied */}
                    {entry.conditions_applied && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Conditions Applied
                            </label>
                            <div className="bg-gray-50 rounded-lg p-4 text-gray-800">
                                {entry.conditions_applied}
                            </div>
                        </div>
                    )}

                    {/* Status Grid */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-4">
                            Status Overview
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {statusFields.map((field) => (
                                <div key={field.key} className="text-center">
                                    <div className="text-sm font-medium text-gray-600 mb-2 capitalize">
                                        {field.label}
                                    </div>
                                    <Badge className={getStatusColor(field.value)}>
                                        {field.value}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Notes */}
                    {entry.notes_comments && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Notes / Comments
                            </label>
                            <div className="bg-gray-50 rounded-lg p-4 text-gray-800 whitespace-pre-wrap">
                                {entry.notes_comments}
                            </div>
                        </div>
                    )}

                    {/* Page URL */}
                    {entry.page_url_link && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Page URL / Link
                            </label>
                            <a
                                href={entry.page_url_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer hover:underline"
                            >
                                <ExternalLink className="h-4 w-4" />
                                {entry.page_url_link}
                            </a>
                        </div>
                    )}

                    {/* Screenshots */}
                    {entry.screenshots_pictures && entry.screenshots_pictures.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-4">
                                Screenshots / Pictures ({entry.screenshots_pictures.length})
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {entry.screenshots_pictures.map((screenshot, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200">
                                        <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                            <img
                                                src={getScreenshotUrl(screenshot)}
                                                alt={`Screenshot ${index + 1}`}
                                                className="max-w-full max-h-full object-contain cursor-pointer"
                                                onClick={() => window.open(getScreenshotUrl(screenshot), '_blank')}
                                            />
                                        </div>
                                        <div className="p-3 flex items-center justify-between">
                                            <span className="text-xs text-gray-600 flex items-center gap-1">
                                                <FileImage className="h-3 w-3" />
                                                Screenshot {index + 1}
                                            </span>
                                            <a
                                                href={getScreenshotUrl(screenshot)}
                                                download
                                                className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer flex items-center gap-1"
                                            >
                                                <Download className="h-3 w-3" />
                                                Download
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Metadata */}
                    <div className="border-t border-gray-200 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Created: {formatDate(entry.created_at)}</span>
                            </div>
                            {entry.updated_at !== entry.created_at && (
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    <span>Updated: {formatDate(entry.updated_at)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-4 p-6 border-t border-gray-200">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="cursor-pointer"
                        style={{height: '2.7em'}}
                    >
                        Close
                    </Button>
                    <Button
                        onClick={handleEdit}
                        className="text-white cursor-pointer"
                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Entry
                    </Button>
                </div>
            </div>
        </div>
    );
}

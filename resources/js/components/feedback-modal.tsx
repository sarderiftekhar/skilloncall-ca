import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Info, X } from 'react-feather';

type FeedbackType = 'success' | 'error' | 'info' | 'warning';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    message: string;
    type?: FeedbackType;
    details?: string | string[];
    primaryAction?: { label: string; onClick: () => void };
}

export function FeedbackModal({
    isOpen,
    onClose,
    title,
    message,
    type = 'info',
    details,
    primaryAction,
}: FeedbackModalProps) {
    if (!isOpen) return null;

    const Icon = type === 'success' ? CheckCircle : type === 'error' ? AlertCircle : Info;
    const accentColor = type === 'success' ? '#16a34a' : type === 'error' ? '#ef4444' : '#10B3D6';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
            }}
        >
            <div
                className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border-2 border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start p-6 border-b border-gray-200">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3" style={{ backgroundColor: accentColor }}>
                        <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold" style={{ color: '#192341' }}>{title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{message}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {details && (
                    <div className="p-6 pt-4 text-sm text-gray-700 space-y-2">
                        {Array.isArray(details) ? (
                            <ul className="list-disc pl-5 space-y-1">
                                {details.map((d, idx) => (
                                    <li key={idx}>{d}</li>
                                ))}
                            </ul>
                        ) : (
                            <p>{details}</p>
                        )}
                    </div>
                )}

                <div className="p-6 pt-0 flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={onClose} className="cursor-pointer" style={{ height: '2.7em' }}>
                        Close
                    </Button>
                    {primaryAction && (
                        <Button onClick={primaryAction.onClick} className="text-white cursor-pointer" style={{ backgroundColor: '#10B3D6', height: '2.7em' }}>
                            {primaryAction.label}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FeedbackModal;



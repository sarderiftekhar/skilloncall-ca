import { useState } from 'react';
import { X, Mail, Phone, User, MessageSquare, Send } from 'react-feather';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);


    if (!isOpen) return null;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const response = await fetch('/contact', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                setIsSubmitted(true);
                // Keep the form data to show in success message
            } else {
                // Handle validation errors or other issues
                alert(result.message || 'There was an error sending your message. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('There was an error sending your message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '', phone: '', message: '' });
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center p-4" 
            onClick={onClose} 
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 9999
            }}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border-2 border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#10B3D6'}}>
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900">Contact Us</h2>
                            <p className="text-sm text-gray-600">SkillOnCall.ca</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!isSubmitted ? (
                        <div>
                            <div className="mb-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Get in Touch</h3>
                                <p className="text-gray-600">
                                    Have a question or need assistance? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Mail className="w-4 h-4 inline mr-2" />
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your email address"
                                    />
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        <Phone className="w-4 h-4 inline mr-2" />
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Enter your phone number (optional)"
                                    />
                                </div>

                                {/* Message Field */}
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                        <MessageSquare className="w-4 h-4 inline mr-2" />
                                        Message *
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        required
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                {/* Submit Button */}
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{
                                            backgroundColor: isSubmitting ? '#9CA3AF' : '#10B3D6',
                                            cursor: isSubmitting ? 'not-allowed' : 'pointer'
                                        }}
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        /* Success Message */
                        <div className="text-center py-8">
                            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{backgroundColor: '#10F2C5'}}>
                                <Mail className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Message Sent Successfully!</h3>
                            <p className="text-gray-600 mb-6">
                                Thank you for contacting us. We've received your message and will get back to you within 24 hours at <strong>{formData.email}</strong>.
                            </p>
                            <div className="space-y-3">
                                <button
                                    onClick={resetForm}
                                    className="w-full px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    Send Another Message
                                </button>
                                <button
                                    onClick={onClose}
                                    className="w-full px-6 py-2 text-white rounded-md transition-colors"
                                    style={{backgroundColor: '#10B3D6'}}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!isSubmitted && (
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                        <div className="flex items-center justify-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2" style={{color: '#10B3D6'}} />
                            Messages will be sent to: <strong className="ml-1">contact@skilloncall.ca</strong>
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            We typically respond within 24 hours during business days.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

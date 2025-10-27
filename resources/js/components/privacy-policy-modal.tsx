import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X, Shield, Eye, Lock, Users, MapPin, CreditCard, Bell, FileText } from 'react-feather';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
    const [activeSection, setActiveSection] = useState('overview');

    if (!isOpen) return null;

    const sections = [
        { id: 'overview', title: 'Overview', icon: Shield },
        { id: 'collection', title: 'Information We Collect', icon: Eye },
        { id: 'usage', title: 'How We Use Information', icon: Users },
        { id: 'sharing', title: 'Information Sharing', icon: FileText },
        { id: 'location', title: 'Location Data', icon: MapPin },
        { id: 'payments', title: 'Payment Information', icon: CreditCard },
        { id: 'security', title: 'Data Security', icon: Lock },
        { id: 'communications', title: 'Communications', icon: Bell },
        { id: 'rights', title: 'Your Rights', icon: Users },
        { id: 'contact', title: 'Contact Us', icon: FileText },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Privacy Policy Overview</h3>
                        <p className="text-gray-600 leading-relaxed">
                            At SkillOnCall.ca, we are committed to protecting your privacy and ensuring the security of your personal information. 
                            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform 
                            to connect Canadian businesses with skilled workers.
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">🍁 Canadian Privacy Commitment</h4>
                            <p className="text-blue-800 text-sm">
                                As a Canadian company, we comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) 
                                and applicable provincial privacy legislation to protect your personal information.
                            </p>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            <strong>Last Updated:</strong> January 2025<br />
                            <strong>Effective Date:</strong> January 1, 2025
                        </p>
                    </div>
                );

            case 'collection':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Information We Collect</h3>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Account Information</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Name, email address, phone number</li>
                                    <li>• Profile photos and business logos</li>
                                    <li>• Skills, certifications, and work experience (for workers)</li>
                                    <li>• Business information and verification documents (for employers)</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Location Information</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• GPS coordinates for job matching and check-in verification</li>
                                    <li>• Preferred work locations and service areas</li>
                                    <li>• Address information for job postings</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Usage Data</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Job applications, postings, and work history</li>
                                    <li>• Messages and communications on the platform</li>
                                    <li>• Ratings, reviews, and feedback</li>
                                    <li>• Device information and IP addresses</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Verification Data</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Government-issued ID for identity verification</li>
                                    <li>• Selfies for check-in verification</li>
                                    <li>• Banking information for payments (securely processed by Stripe)</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'usage':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">How We Use Your Information</h3>
                        
                        <div className="grid gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔍 Platform Services</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Match workers with suitable job opportunities</li>
                                    <li>• Enable communication between employers and workers</li>
                                    <li>• Process payments and manage subscriptions</li>
                                    <li>• Verify user identities and prevent fraud</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📱 Notifications & Updates</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Send job alerts and application updates</li>
                                    <li>• Notify about platform updates and new features</li>
                                    <li>• Send security alerts and account notifications</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🛡️ Safety & Security</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Verify work attendance with GPS and selfie check-ins</li>
                                    <li>• Detect and prevent fraudulent activities</li>
                                    <li>• Maintain platform safety and user trust</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📊 Platform Improvement</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Analyze usage patterns to improve our services</li>
                                    <li>• Develop new features based on user needs</li>
                                    <li>• Ensure platform performance and reliability</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'sharing':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Information Sharing</h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-red-900 mb-2">🚫 We Never Sell Your Data</h4>
                            <p className="text-red-800 text-sm">
                                SkillOnCall.ca does not sell, rent, or trade your personal information to third parties for marketing purposes.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">✅ When We Share Information</h4>
                                <ul className="text-gray-600 space-y-2 text-sm">
                                    <li><strong>With Other Users:</strong> Profile information visible to facilitate job matching</li>
                                    <li><strong>Service Providers:</strong> Stripe for payments, Twilio for SMS, Firebase for notifications</li>
                                    <li><strong>Legal Requirements:</strong> When required by Canadian law or to protect platform safety</li>
                                    <li><strong>Business Transfers:</strong> In case of merger or acquisition (with notice to users)</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔒 How We Protect Shared Data</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• All service providers must meet our security standards</li>
                                    <li>• Data sharing agreements limit use to specified purposes only</li>
                                    <li>• Regular security audits of third-party integrations</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'location':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Location Data</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">📍 Why We Use Location Data</h4>
                            <p className="text-blue-800 text-sm">
                                Location data is essential for matching workers with nearby jobs and verifying work attendance. 
                                We only collect location data when you're actively using the app.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Job Matching</h4>
                                <p className="text-gray-600 text-sm">
                                    We use your location to show relevant job opportunities within your preferred distance 
                                    and help employers find workers in their area.
                                </p>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Work Verification</h4>
                                <p className="text-gray-600 text-sm">
                                    GPS check-in ensures workers are at the correct job location, protecting both 
                                    employers and workers from fraud and disputes.
                                </p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">Your Control</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• You can disable location services in your device settings</li>
                                    <li>• Location data is only collected during active app use</li>
                                    <li>• You can set your preferred work radius in your profile</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'payments':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Payment Information</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">🔒 Secure Payment Processing</h4>
                            <p className="text-green-800 text-sm">
                                All payment processing is handled by Stripe, a PCI DSS Level 1 certified payment processor. 
                                SkillOnCall.ca does not store your complete credit card information.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">💳 What We Collect</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Last 4 digits of credit cards (for account management)</li>
                                    <li>• Payment method types (Visa, Mastercard, etc.)</li>
                                    <li>• Transaction history and receipts</li>
                                    <li>• Banking information for worker payouts (encrypted)</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🛡️ Security Measures</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• End-to-end encryption for all payment data</li>
                                    <li>• Fraud detection and prevention systems</li>
                                    <li>• Regular security audits and compliance checks</li>
                                    <li>• Secure tokenization of payment methods</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">💰 Payout Protection</h4>
                                <p className="text-gray-600 text-sm">
                                    Worker payouts are only sent to bank accounts verified to match the worker's legal name, 
                                    preventing fraud and ensuring secure compensation.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Data Security</h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">🛡️ Enterprise-Grade Security</h4>
                            <p className="text-red-800 text-sm">
                                We implement multiple layers of security to protect your data, including encryption, 
                                access controls, and continuous monitoring.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔐 Authentication Security</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• One-Time Password (OTP) login verification</li>
                                    <li>• Passkey support for passwordless authentication</li>
                                    <li>• Device limits to prevent account sharing</li>
                                    <li>• Automatic session termination on new device login</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔒 Data Protection</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• AES-256 encryption for data at rest</li>
                                    <li>• TLS 1.3 encryption for data in transit</li>
                                    <li>• Regular security audits and penetration testing</li>
                                    <li>• Secure cloud infrastructure with AWS/Google Cloud</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🚨 Fraud Prevention</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• AI-powered risk detection engine</li>
                                    <li>• Suspicious activity monitoring and alerts</li>
                                    <li>• GPS and selfie verification for work check-ins</li>
                                    <li>• Multi-factor authentication for sensitive actions</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'communications':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Communications</h3>
                        
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">📱 Types of Communications</h4>
                                <ul className="text-blue-800 space-y-1 text-sm">
                                    <li>• Job alerts and application notifications</li>
                                    <li>• Platform updates and new feature announcements</li>
                                    <li>• Security alerts and account notifications</li>
                                    <li>• Marketing communications (with your consent)</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">✉️ Communication Channels</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li><strong>Email:</strong> Account updates, job notifications, newsletters</li>
                                    <li><strong>SMS:</strong> Urgent alerts, OTP codes, shift reminders</li>
                                    <li><strong>Push Notifications:</strong> Real-time job alerts and messages</li>
                                    <li><strong>In-App Messages:</strong> Direct communication between users</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🎛️ Your Communication Preferences</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Customize notification types in your account settings</li>
                                    <li>• Unsubscribe from marketing emails at any time</li>
                                    <li>• Control push notification permissions in your device settings</li>
                                    <li>• Essential security and account notifications cannot be disabled</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'rights':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Your Privacy Rights</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">🍁 Canadian Privacy Rights</h4>
                            <p className="text-green-800 text-sm">
                                Under Canadian privacy law (PIPEDA), you have specific rights regarding your personal information. 
                                We're committed to honoring these rights and making them easy to exercise.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">👁️ Access Your Data</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    Request a copy of all personal information we have about you, including:
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Profile information and work history</li>
                                    <li>• Messages and communications</li>
                                    <li>• Payment and transaction records</li>
                                    <li>• Location and usage data</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">✏️ Correct Your Data</h4>
                                <p className="text-gray-600 text-sm">
                                    Update or correct any inaccurate personal information in your account. 
                                    Most information can be updated directly in your profile settings.
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🗑️ Delete Your Data</h4>
                                <p className="text-gray-600 text-sm">
                                    Request deletion of your account and associated data. Note that some information 
                                    may be retained for legal compliance, fraud prevention, or dispute resolution.
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📤 Data Portability</h4>
                                <p className="text-gray-600 text-sm">
                                    Export your data in a machine-readable format to transfer to another service, 
                                    where technically feasible.
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🚫 Object to Processing</h4>
                                <p className="text-gray-600 text-sm">
                                    Object to certain types of data processing, such as marketing communications 
                                    or automated decision-making.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">📧 Exercise Your Rights</h4>
                            <p className="text-gray-600 text-sm">
                                To exercise any of these rights, contact us at <strong>privacy@skilloncall.ca</strong> 
                                or use the contact form in your account settings. We'll respond within 30 days.
                            </p>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Contact Us</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">📞 Get in Touch</h4>
                            <p className="text-blue-800 text-sm">
                                Have questions about this Privacy Policy or how we handle your data? 
                                We're here to help and committed to transparency.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🏢 SkillOnCall.ca Inc.</h4>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>Privacy Officer:</strong> privacy@skilloncall.ca</p>
                                    <p><strong>General Support:</strong> support@skilloncall.ca</p>
                                    <p><strong>Mailing Address:</strong></p>
                                    <p className="ml-4">
                                        SkillOnCall.ca Inc.<br />
                                        Privacy Department<br />
                                        123 Main Street, Suite 456<br />
                                        Toronto, ON M5V 3A8<br />
                                        Canada
                                    </p>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">⏰ Response Times</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Privacy requests: Within 30 days</li>
                                    <li>• General inquiries: Within 2 business days</li>
                                    <li>• Security concerns: Within 24 hours</li>
                                    <li>• Urgent issues: Same day response</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🏛️ Regulatory Complaints</h4>
                                <p className="text-gray-600 text-sm">
                                    If you're not satisfied with our response to your privacy concerns, you can file a complaint 
                                    with the Office of the Privacy Commissioner of Canada at <strong>priv.gc.ca</strong> or 
                                    your provincial privacy commissioner.
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">🔄 Policy Updates</h4>
                            <p className="text-gray-600 text-sm">
                                We may update this Privacy Policy from time to time. We'll notify you of significant changes 
                                via email or through the platform. The "Last Updated" date at the top indicates when changes were made.
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div 
            className="fixed inset-0 flex items-center justify-center z-50 p-4" 
            onClick={onClose} 
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)'
            }}
        >
            <div 
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] flex shadow-2xl border-2 border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Sidebar Navigation */}
                <div className="w-80 bg-gray-50 rounded-l-2xl border-r border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: '#10B3D6'}}>
                                    <Shield className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Privacy Policy</h2>
                                    <p className="text-sm text-gray-500">SkillOnCall.ca</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                        activeSection === section.id
                                            ? 'bg-blue-100 text-blue-900 border border-blue-200'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <Icon className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm font-medium">{section.title}</span>
                                </button>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-gray-200">
                        <div className="text-xs text-gray-500 text-center">
                            <p>🍁 Made in Canada</p>
                            <p className="mt-1">Last updated: January 2025</p>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1 p-8 overflow-y-auto">
                        {renderContent()}
                    </div>

                    <div className="border-t border-gray-200 p-6 bg-gray-50 rounded-br-2xl">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Questions? Contact us at <strong>privacy@skilloncall.ca</strong>
                            </div>
                            <Button 
                                onClick={onClose}
                                className="text-white hover:opacity-90"
                                style={{backgroundColor: '#10B3D6'}}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

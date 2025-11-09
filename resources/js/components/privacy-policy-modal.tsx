import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X, Shield, Eye, Lock, Users, MapPin, CreditCard, Bell, FileText } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
    const { t, locale } = useTranslations();
    const isFrench = locale === 'fr';
    const [activeSection, setActiveSection] = useState('overview');

    if (!isOpen) return null;

    const sections = [
        { id: 'overview', title: t('privacy_modal.sections.overview', 'Overview'), icon: Shield },
        { id: 'collection', title: t('privacy_modal.sections.collection', 'Information We Collect'), icon: Eye },
        { id: 'usage', title: t('privacy_modal.sections.usage', 'How We Use Information'), icon: Users },
        { id: 'sharing', title: t('privacy_modal.sections.sharing', 'Information Sharing'), icon: FileText },
        { id: 'location', title: t('privacy_modal.sections.location', 'Location Data'), icon: MapPin },
        { id: 'payments', title: t('privacy_modal.sections.payments', 'Payment Information'), icon: CreditCard },
        { id: 'security', title: t('privacy_modal.sections.security', 'Data Security'), icon: Lock },
        { id: 'communications', title: t('privacy_modal.sections.communications', 'Communications'), icon: Bell },
        { id: 'rights', title: t('privacy_modal.sections.rights', 'Your Rights'), icon: Users },
        { id: 'contact', title: t('privacy_modal.sections.contact', 'Contact Us'), icon: FileText },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.overview.title', 'Privacy Policy Overview')}</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {t('privacy_modal.content.overview.intro', 'At SkillOnCall.ca, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform to connect Canadian businesses with skilled workers.')}
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('privacy_modal.content.overview.commitment_title', '🍁 Canadian Privacy Commitment')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('privacy_modal.content.overview.commitment_text', 'As a Canadian company, we comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation to protect your personal information.')}
                            </p>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            <strong>{t('privacy_modal.content.overview.last_updated_label', 'Last Updated:')}</strong> {t('privacy_modal.content.overview.last_updated_value', 'January 2025')}<br />
                            <strong>{t('privacy_modal.content.overview.effective_date_label', 'Effective Date:')}</strong> {t('privacy_modal.content.overview.effective_date_value', 'January 1, 2025')}
                        </p>
                    </div>
                );

            case 'collection':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.collection.title', 'Information We Collect')}</h3>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.collection.account_title', 'Account Information')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.collection.account_item1', 'Name, email address, phone number')}</li>
                                    <li>• {t('privacy_modal.content.collection.account_item2', 'Profile photos and business logos')}</li>
                                    <li>• {t('privacy_modal.content.collection.account_item3', 'Skills, certifications, and work experience (for workers)')}</li>
                                    <li>• {t('privacy_modal.content.collection.account_item4', 'Business information and verification documents (for employers)')}</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.collection.location_title', 'Location Information')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.collection.location_item1', 'GPS coordinates for job matching and check-in verification')}</li>
                                    <li>• {t('privacy_modal.content.collection.location_item2', 'Preferred work locations and service areas')}</li>
                                    <li>• {t('privacy_modal.content.collection.location_item3', 'Address information for job postings')}</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.collection.usage_title', 'Usage Data')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.collection.usage_item1', 'Job applications, postings, and work history')}</li>
                                    <li>• {t('privacy_modal.content.collection.usage_item2', 'Messages and communications on the platform')}</li>
                                    <li>• {t('privacy_modal.content.collection.usage_item3', 'Ratings, reviews, and feedback')}</li>
                                    <li>• {t('privacy_modal.content.collection.usage_item4', 'Device information and IP addresses')}</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.collection.verification_title', 'Verification Data')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.collection.verification_item1', 'Government-issued ID for identity verification')}</li>
                                    <li>• {t('privacy_modal.content.collection.verification_item2', 'Selfies for check-in verification')}</li>
                                    <li>• {t('privacy_modal.content.collection.verification_item3', 'Banking information for payments (securely processed by Stripe)')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'usage':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.usage.title', 'How We Use Your Information')}</h3>
                        
                        <div className="grid gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.usage.platform_title', '🔍 Platform Services')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.usage.platform_item1', 'Match workers with suitable job opportunities')}</li>
                                    <li>• {t('privacy_modal.content.usage.platform_item2', 'Enable communication between employers and workers')}</li>
                                    <li>• {t('privacy_modal.content.usage.platform_item3', 'Process payments and manage subscriptions')}</li>
                                    <li>• {t('privacy_modal.content.usage.platform_item4', 'Verify user identities and prevent fraud')}</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.usage.notifications_title', '📱 Notifications & Updates')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.usage.notifications_item1', 'Send job alerts and application updates')}</li>
                                    <li>• {t('privacy_modal.content.usage.notifications_item2', 'Notify about platform updates and new features')}</li>
                                    <li>• {t('privacy_modal.content.usage.notifications_item3', 'Send security alerts and account notifications')}</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.usage.safety_title', '🛡️ Safety & Security')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.usage.safety_item1', 'Verify work attendance with GPS and selfie check-ins')}</li>
                                    <li>• {t('privacy_modal.content.usage.safety_item2', 'Detect and prevent fraudulent activities')}</li>
                                    <li>• {t('privacy_modal.content.usage.safety_item3', 'Maintain platform safety and user trust')}</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.usage.improvement_title', '📊 Platform Improvement')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.usage.improvement_item1', 'Analyze usage patterns to improve our services')}</li>
                                    <li>• {t('privacy_modal.content.usage.improvement_item2', 'Develop new features based on user needs')}</li>
                                    <li>• {t('privacy_modal.content.usage.improvement_item3', 'Ensure platform performance and reliability')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'sharing':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.sharing.title', 'Information Sharing')}</h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-red-900 mb-2">{t('privacy_modal.content.sharing.never_sell_title', '🚫 We Never Sell Your Data')}</h4>
                            <p className="text-red-800 text-sm">
                                {t('privacy_modal.content.sharing.never_sell_text', 'SkillOnCall.ca does not sell, rent, or trade your personal information to third parties for marketing purposes.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.sharing.when_share_title', '✅ When We Share Information')}</h4>
                                <ul className="text-gray-600 space-y-2 text-sm">
                                    <li><strong>{t('privacy_modal.content.sharing.when_share_item1', 'With Other Users: Profile information visible to facilitate job matching')}</strong></li>
                                    <li><strong>{t('privacy_modal.content.sharing.when_share_item2', 'Service Providers: Stripe for payments, Twilio for SMS, Firebase for notifications')}</strong></li>
                                    <li><strong>{t('privacy_modal.content.sharing.when_share_item3', 'Legal Requirements: When required by Canadian law or to protect platform safety')}</strong></li>
                                    <li><strong>{t('privacy_modal.content.sharing.when_share_item4', 'Business Transfers: In case of merger or acquisition (with notice to users)')}</strong></li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.sharing.protect_title', '🔒 How We Protect Shared Data')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.sharing.protect_item1', 'All service providers must meet our security standards')}</li>
                                    <li>• {t('privacy_modal.content.sharing.protect_item2', 'Data sharing agreements limit use to specified purposes only')}</li>
                                    <li>• {t('privacy_modal.content.sharing.protect_item3', 'Regular security audits of third-party integrations')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'location':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.location.title', 'Location Data')}</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('privacy_modal.content.location.why_title', '📍 Why We Use Location Data')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('privacy_modal.content.location.why_text', 'Location data is essential for matching workers with nearby jobs and verifying work attendance. We only collect location data when you\'re actively using the app.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.location.matching_title', 'Job Matching')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.content.location.matching_text', 'We use your location to show relevant job opportunities within your preferred distance and help employers find workers in their area.')}
                                </p>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.location.verification_title', 'Work Verification')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.content.location.verification_text', 'GPS check-in ensures workers are at the correct job location, protecting both employers and workers from fraud and disputes.')}
                                </p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.location.control_title', 'Your Control')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.location.control_item1', 'You can disable location services in your device settings')}</li>
                                    <li>• {t('privacy_modal.content.location.control_item2', 'Location data is only collected during active app use')}</li>
                                    <li>• {t('privacy_modal.content.location.control_item3', 'You can set your preferred work radius in your profile')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'payments':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.payments.title', 'Payment Information')}</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">{t('privacy_modal.content.payments.secure_title', '🔒 Secure Payment Processing')}</h4>
                            <p className="text-green-800 text-sm">
                                {t('privacy_modal.content.payments.secure_text', 'All payment processing is handled by Stripe, a PCI DSS Level 1 certified payment processor. SkillOnCall.ca does not store your complete credit card information.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.payments.collect_title', '💳 What We Collect')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.payments.collect_item1', 'Last 4 digits of credit cards (for account management)')}</li>
                                    <li>• {t('privacy_modal.content.payments.collect_item2', 'Payment method types (Visa, Mastercard, etc.)')}</li>
                                    <li>• {t('privacy_modal.content.payments.collect_item3', 'Transaction history and receipts')}</li>
                                    <li>• {t('privacy_modal.content.payments.collect_item4', 'Banking information for worker payouts (encrypted)')}</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.payments.security_title', '🛡️ Security Measures')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.payments.security_item1', 'End-to-end encryption for all payment data')}</li>
                                    <li>• {t('privacy_modal.content.payments.security_item2', 'Fraud detection and prevention systems')}</li>
                                    <li>• {t('privacy_modal.content.payments.security_item3', 'Regular security audits and compliance checks')}</li>
                                    <li>• {t('privacy_modal.content.payments.security_item4', 'Secure tokenization of payment methods')}</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.payments.payout_title', '💰 Payout Protection')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.content.payments.payout_text', 'Worker payouts are only sent to bank accounts verified to match the worker\'s legal name, preventing fraud and ensuring secure compensation.')}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.security.title', 'Data Security')}</h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">{t('privacy_modal.content.security.enterprise_title', '🛡️ Enterprise-Grade Security')}</h4>
                            <p className="text-red-800 text-sm">
                                {t('privacy_modal.content.security.enterprise_text', 'We implement multiple layers of security to protect your data, including encryption, access controls, and continuous monitoring.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.security.auth_title', '🔐 Authentication Security')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.security.auth_item1', 'One-Time Password (OTP) login verification')}</li>
                                    <li>• {t('privacy_modal.content.security.auth_item2', 'Passkey support for passwordless authentication')}</li>
                                    <li>• {t('privacy_modal.content.security.auth_item3', 'Device limits to prevent account sharing')}</li>
                                    <li>• {t('privacy_modal.content.security.auth_item4', 'Automatic session termination on new device login')}</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.security.protection_title', '🔒 Data Protection')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.security.protection_item1', 'AES-256 encryption for data at rest')}</li>
                                    <li>• {t('privacy_modal.content.security.protection_item2', 'TLS 1.3 encryption for data in transit')}</li>
                                    <li>• {t('privacy_modal.content.security.protection_item3', 'Regular security audits and penetration testing')}</li>
                                    <li>• {t('privacy_modal.content.security.protection_item4', 'Secure cloud infrastructure with AWS/Google Cloud')}</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.security.fraud_title', '🚨 Fraud Prevention')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.security.fraud_item1', 'AI-powered risk detection engine')}</li>
                                    <li>• {t('privacy_modal.content.security.fraud_item2', 'Suspicious activity monitoring and alerts')}</li>
                                    <li>• {t('privacy_modal.content.security.fraud_item3', 'GPS and selfie verification for work check-ins')}</li>
                                    <li>• {t('privacy_modal.content.security.fraud_item4', 'Multi-factor authentication for sensitive actions')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'communications':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.communications.title', 'Communications')}</h3>
                        
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">{t('privacy_modal.content.communications.types_title', '📱 Types of Communications')}</h4>
                                <ul className="text-blue-800 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.communications.types_item1', 'Job alerts and application notifications')}</li>
                                    <li>• {t('privacy_modal.content.communications.types_item2', 'Platform updates and new feature announcements')}</li>
                                    <li>• {t('privacy_modal.content.communications.types_item3', 'Security alerts and account notifications')}</li>
                                    <li>• {t('privacy_modal.content.communications.types_item4', 'Marketing communications (with your consent)')}</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.communications.channels_title', '✉️ Communication Channels')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li><strong>{t('privacy_modal.content.communications.channels_item1', 'Email: Account updates, job notifications, newsletters')}</strong></li>
                                    <li><strong>{t('privacy_modal.content.communications.channels_item2', 'SMS: Urgent alerts, OTP codes, shift reminders')}</strong></li>
                                    <li><strong>{t('privacy_modal.content.communications.channels_item3', 'Push Notifications: Real-time job alerts and messages')}</strong></li>
                                    <li><strong>{t('privacy_modal.content.communications.channels_item4', 'In-App Messages: Direct communication between users')}</strong></li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.communications.preferences_title', '🎛️ Your Communication Preferences')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.communications.preferences_item1', 'Customize notification types in your account settings')}</li>
                                    <li>• {t('privacy_modal.content.communications.preferences_item2', 'Unsubscribe from marketing emails at any time')}</li>
                                    <li>• {t('privacy_modal.content.communications.preferences_item3', 'Control push notification permissions in your device settings')}</li>
                                    <li>• {t('privacy_modal.content.communications.preferences_item4', 'Essential security and account notifications cannot be disabled')}</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'rights':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.rights.title', 'Your Privacy Rights')}</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">{t('privacy_modal.content.rights.canadian_title', '🍁 Canadian Privacy Rights')}</h4>
                            <p className="text-green-800 text-sm">
                                {t('privacy_modal.content.rights.canadian_text', 'Under Canadian privacy law (PIPEDA), you have specific rights regarding your personal information. We\'re committed to honoring these rights and making them easy to exercise.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.rights.access_title', '👁️ Access Your Data')}</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    {t('privacy_modal.content.rights.access_intro', 'Request a copy of all personal information we have about you, including:')}
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.rights.access_item1', 'Profile information and work history')}</li>
                                    <li>• {t('privacy_modal.content.rights.access_item2', 'Messages and communications')}</li>
                                    <li>• {t('privacy_modal.content.rights.access_item3', 'Payment and transaction records')}</li>
                                    <li>• {t('privacy_modal.content.rights.access_item4', 'Location and usage data')}</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.rights.correct_title', '✏️ Correct Your Data')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.content.rights.correct_text', 'Update or correct any inaccurate personal information in your account. Most information can be updated directly in your profile settings.')}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.rights.delete_title', '🗑️ Delete Your Data')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.content.rights.delete_text', 'Request deletion of your account and associated data. Note that some information may be retained for legal compliance, fraud prevention, or dispute resolution.')}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.rights.portability_title', '📤 Data Portability')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.content.rights.portability_text', 'Export your data in a machine-readable format to transfer to another service, where technically feasible.')}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.rights.object_title', '🚫 Object to Processing')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.content.rights.object_text', 'Object to certain types of data processing, such as marketing communications or automated decision-making.')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.rights.exercise_title', '📧 Exercise Your Rights')}</h4>
                            <p className="text-gray-600 text-sm">
                                {t('privacy_modal.content.rights.exercise_text', 'To exercise any of these rights, contact us at privacy@skilloncall.ca or use the contact form in your account settings. We\'ll respond within 30 days.')}
                            </p>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.content.contact.title', 'Contact Us')}</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('privacy_modal.content.contact.get_touch_title', '📞 Get in Touch')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('privacy_modal.content.contact.get_touch_text', 'Have questions about this Privacy Policy or how we handle your data? We\'re here to help and committed to transparency.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.contact.company_title', '🏢 SkillOnCall.ca Inc.')}</h4>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>{t('privacy_modal.content.contact.privacy_officer', 'Privacy Officer:')}</strong> privacy@skilloncall.ca</p>
                                    <p><strong>{t('privacy_modal.content.contact.general_support', 'General Support:')}</strong> support@skilloncall.ca</p>
                                    <p><strong>{t('privacy_modal.content.contact.mailing_address', 'Mailing Address:')}</strong></p>
                                    <p className="ml-4" dangerouslySetInnerHTML={{__html: t('privacy_modal.content.contact.company_address', 'SkillOnCall.ca Inc.<br />Privacy Department<br />123 Main Street, Suite 456<br />Toronto, ON M5V 3A8<br />Canada')}} />
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.contact.response_title', '⏰ Response Times')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• {t('privacy_modal.content.contact.response_item1', 'Privacy requests: Within 30 days')}</li>
                                    <li>• {t('privacy_modal.content.contact.response_item2', 'General inquiries: Within 2 business days')}</li>
                                    <li>• {t('privacy_modal.content.contact.response_item3', 'Security concerns: Within 24 hours')}</li>
                                    <li>• {t('privacy_modal.content.contact.response_item4', 'Urgent issues: Same day response')}</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.contact.regulatory_title', '🏛️ Regulatory Complaints')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.content.contact.regulatory_text', 'If you\'re not satisfied with our response to your privacy concerns, you can file a complaint with the Office of the Privacy Commissioner of Canada at priv.gc.ca or your provincial privacy commissioner.')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.content.contact.updates_title', '🔄 Policy Updates')}</h4>
                            <p className="text-gray-600 text-sm">
                                {t('privacy_modal.content.contact.updates_text', 'We may update this Privacy Policy from time to time. We\'ll notify you of significant changes via email or through the platform. The "Last Updated" date at the top indicates when changes were made.')}
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
                                    <h2 className="text-lg font-bold text-gray-900">{t('privacy_modal.title', 'Privacy Policy')}</h2>
                                    <p className="text-sm text-gray-500">{t('privacy_modal.subtitle', 'SkillOnCall.ca')}</p>
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
                            <p>{t('privacy_modal.made_in_canada', '🍁 Made in Canada')}</p>
                            <p className="mt-1">{t('privacy_modal.last_updated', 'Last updated: January 2025')}</p>
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
                                {t('privacy_modal.questions', 'Questions? Contact us at')} <strong>privacy@skilloncall.ca</strong>
                            </div>
                            <Button 
                                onClick={onClose}
                                className="text-white hover:opacity-90"
                                style={{backgroundColor: '#10B3D6'}}
                            >
                                {t('privacy_modal.close', 'Close')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

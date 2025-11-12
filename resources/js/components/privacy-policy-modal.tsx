import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X, Shield, Eye, Lock, Users, MapPin, CreditCard, Bell, FileText } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface PrivacyPolicyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function PrivacyPolicyModal({ isOpen, onClose }: PrivacyPolicyModalProps) {
    const { t } = useTranslations();
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
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.overview.title', 'Privacy Policy Overview')}</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {t('privacy_modal.overview.description', 'At SkillOnCall.ca, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform to connect Canadian businesses with skilled workers.')}
                        </p>
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('privacy_modal.overview.canadian_commitment_title', '🍁 Canadian Privacy Commitment')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('privacy_modal.overview.canadian_commitment', 'As a Canadian company, we comply with the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy legislation to protect your personal information.')}
                            </p>
                        </div>
                        <p className="text-gray-600 leading-relaxed">
                            <strong>{t('privacy_modal.overview.last_updated', 'Last Updated:')}</strong> January 2025<br />
                            <strong>{t('privacy_modal.overview.effective_date', 'Effective Date:')}</strong> January 1, 2025
                        </p>
                    </div>
                );

            case 'collection':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.collection.title', 'Information We Collect')}</h3>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.collection.account_title', 'Account Information')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.collection.account_items', [])) ? t('privacy_modal.collection.account_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.collection.location_title', 'Location Information')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.collection.location_items', [])) ? t('privacy_modal.collection.location_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.collection.usage_title', 'Usage Data')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.collection.usage_items', [])) ? t('privacy_modal.collection.usage_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.collection.verification_title', 'Verification Data')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.collection.verification_items', [])) ? t('privacy_modal.collection.verification_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'usage':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.usage.title', 'How We Use Your Information')}</h3>
                        
                        <div className="grid gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.usage.platform_title', '🔍 Platform Services')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.usage.platform_items', [])) ? t('privacy_modal.usage.platform_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.usage.notifications_title', '📱 Notifications & Updates')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.usage.notifications_items', [])) ? t('privacy_modal.usage.notifications_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.usage.safety_title', '🛡️ Safety & Security')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.usage.safety_items', [])) ? t('privacy_modal.usage.safety_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.usage.improvement_title', '📊 Platform Improvement')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.usage.improvement_items', [])) ? t('privacy_modal.usage.improvement_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'sharing':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.sharing.title', 'Information Sharing')}</h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold text-red-900 mb-2">{t('privacy_modal.sharing.never_sell_title', '🚫 We Never Sell Your Data')}</h4>
                            <p className="text-red-800 text-sm">
                                {t('privacy_modal.sharing.never_sell', 'SkillOnCall.ca does not sell, rent, or trade your personal information to third parties for marketing purposes.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.sharing.when_share_title', '✅ When We Share Information')}</h4>
                                <ul className="text-gray-600 space-y-2 text-sm">
                                    {(Array.isArray(t('privacy_modal.sharing.when_share_items', [])) ? t('privacy_modal.sharing.when_share_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.sharing.protect_title', '🔒 How We Protect Shared Data')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.sharing.protect_items', [])) ? t('privacy_modal.sharing.protect_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'location':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.location.title', 'Location Data')}</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('privacy_modal.location.why_title', '📍 Why We Use Location Data')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('privacy_modal.location.why_description', 'Location data is essential for matching workers with nearby jobs and verifying work attendance. We only collect location data when you\'re actively using the app.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.location.matching_title', 'Job Matching')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.location.matching_description', 'We use your location to show relevant job opportunities within your preferred distance and help employers find workers in their area.')}
                                </p>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.location.verification_title', 'Work Verification')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.location.verification_description', 'GPS check-in ensures workers are at the correct job location, protecting both employers and workers from fraud and disputes.')}
                                </p>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.location.control_title', 'Your Control')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.location.control_items', [])) ? t('privacy_modal.location.control_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'payments':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.payments.title', 'Payment Information')}</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">{t('privacy_modal.payments.secure_title', '🔒 Secure Payment Processing')}</h4>
                            <p className="text-green-800 text-sm">
                                {t('privacy_modal.payments.secure_description', 'All payment processing is handled by Stripe, a PCI DSS Level 1 certified payment processor. SkillOnCall.ca does not store your complete credit card information.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.payments.collect_title', '💳 What We Collect')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.payments.collect_items', [])) ? t('privacy_modal.payments.collect_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.payments.security_title', '🛡️ Security Measures')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.payments.security_items', [])) ? t('privacy_modal.payments.security_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.payments.payout_title', '💰 Payout Protection')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.payments.payout_description', 'Worker payouts are only sent to bank accounts verified to match the worker\'s legal name, preventing fraud and ensuring secure compensation.')}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'security':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.security.title', 'Data Security')}</h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">{t('privacy_modal.security.enterprise_title', '🛡️ Enterprise-Grade Security')}</h4>
                            <p className="text-red-800 text-sm">
                                {t('privacy_modal.security.enterprise_description', 'We implement multiple layers of security to protect your data, including encryption, access controls, and continuous monitoring.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.security.auth_title', '🔐 Authentication Security')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.security.auth_items', [])) ? t('privacy_modal.security.auth_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.security.protection_title', '🔒 Data Protection')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.security.protection_items', [])) ? t('privacy_modal.security.protection_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.security.fraud_title', '🚨 Fraud Prevention')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.security.fraud_items', [])) ? t('privacy_modal.security.fraud_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'communications':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.communications.title', 'Communications')}</h3>
                        
                        <div className="space-y-4">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">{t('privacy_modal.communications.types_title', '📱 Types of Communications')}</h4>
                                <ul className="text-blue-800 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.communications.types_items', [])) ? t('privacy_modal.communications.types_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.communications.channels_title', '✉️ Communication Channels')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.communications.channels_items', [])) ? t('privacy_modal.communications.channels_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx} dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.communications.preferences_title', '🎛️ Your Communication Preferences')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.communications.preferences_items', [])) ? t('privacy_modal.communications.preferences_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                );

            case 'rights':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.rights.title', 'Your Privacy Rights')}</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">{t('privacy_modal.rights.canadian_title', '🍁 Canadian Privacy Rights')}</h4>
                            <p className="text-green-800 text-sm">
                                {t('privacy_modal.rights.canadian_description', 'Under Canadian privacy law (PIPEDA), you have specific rights regarding your personal information. We\'re committed to honoring these rights and making them easy to exercise.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.rights.access_title', '👁️ Access Your Data')}</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    {t('privacy_modal.rights.access_description', 'Request a copy of all personal information we have about you, including:')}
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.rights.access_items', [])) ? t('privacy_modal.rights.access_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.rights.correct_title', '✏️ Correct Your Data')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.rights.correct_description', 'Update or correct any inaccurate personal information in your account. Most information can be updated directly in your profile settings.')}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.rights.delete_title', '🗑️ Delete Your Data')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.rights.delete_description', 'Request deletion of your account and associated data. Note that some information may be retained for legal compliance, fraud prevention, or dispute resolution.')}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.rights.portability_title', '📤 Data Portability')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.rights.portability_description', 'Export your data in a machine-readable format to transfer to another service, where technically feasible.')}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.rights.object_title', '🚫 Object to Processing')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.rights.object_description', 'Object to certain types of data processing, such as marketing communications or automated decision-making.')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.rights.exercise_title', '📧 Exercise Your Rights')}</h4>
                            <p className="text-gray-600 text-sm">
                                {t('privacy_modal.rights.exercise_description', 'To exercise any of these rights, contact us at privacy@skilloncall.ca or use the contact form in your account settings. We\'ll respond within 30 days.')}
                            </p>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('privacy_modal.contact.title', 'Contact Us')}</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('privacy_modal.contact.get_touch_title', '📞 Get in Touch')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('privacy_modal.contact.get_touch_description', 'Have questions about this Privacy Policy or how we handle your data? We\'re here to help and committed to transparency.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.contact.company_title', '🏢 SkillOnCall.ca Inc.')}</h4>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>{t('privacy_modal.contact.privacy_officer', 'Privacy Officer:')}</strong> privacy@skilloncall.ca</p>
                                    <p><strong>{t('privacy_modal.contact.general_support', 'General Support:')}</strong> support@skilloncall.ca</p>
                                    <p><strong>{t('privacy_modal.contact.mailing_address', 'Mailing Address:')}</strong></p>
                                    <p className="ml-4" dangerouslySetInnerHTML={{ __html: t('privacy_modal.contact.company_address', 'SkillOnCall.ca Inc.<br />Privacy Department<br />123 Main Street, Suite 456<br />Toronto, ON M5V 3A8<br />Canada') }} />
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.contact.response_times_title', '⏰ Response Times')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('privacy_modal.contact.response_items', [])) ? t('privacy_modal.contact.response_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.contact.regulatory_title', '🏛️ Regulatory Complaints')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('privacy_modal.contact.regulatory_description', 'If you\'re not satisfied with our response to your privacy concerns, you can file a complaint with the Office of the Privacy Commissioner of Canada at priv.gc.ca or your provincial privacy commissioner.')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{t('privacy_modal.contact.updates_title', '🔄 Policy Updates')}</h4>
                            <p className="text-gray-600 text-sm">
                                {t('privacy_modal.contact.updates_description', 'We may update this Privacy Policy from time to time. We\'ll notify you of significant changes via email or through the platform. The "Last Updated" date at the top indicates when changes were made.')}
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
                                {t('privacy_modal.questions_contact', 'Questions? Contact us at')} <strong>privacy@skilloncall.ca</strong>
                            </div>
                            <Button 
                                onClick={onClose}
                                className="text-white hover:opacity-90"
                                style={{backgroundColor: '#10B3D6', cursor: 'pointer'}}
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

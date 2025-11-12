import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X, FileText, Users, Briefcase, CreditCard, Shield, AlertTriangle, Globe, Phone, Settings } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
    const { t } = useTranslations();
    const [activeSection, setActiveSection] = useState('overview');

    if (!isOpen) return null;

    const sections = [
        { id: 'overview', title: t('terms_modal.sections.overview', 'Terms Overview'), icon: FileText },
        { id: 'acceptance', title: t('terms_modal.sections.acceptance', 'Acceptance of Terms'), icon: Settings },
        { id: 'platform', title: t('terms_modal.sections.platform', 'Platform Services'), icon: Globe },
        { id: 'accounts', title: t('terms_modal.sections.accounts', 'User Accounts'), icon: Users },
        { id: 'employers', title: t('terms_modal.sections.employers', 'Employer Terms'), icon: Briefcase },
        { id: 'workers', title: t('terms_modal.sections.workers', 'Worker Terms'), icon: Users },
        { id: 'payments', title: t('terms_modal.sections.payments', 'Payments & Billing'), icon: CreditCard },
        { id: 'conduct', title: t('terms_modal.sections.conduct', 'User Conduct'), icon: Shield },
        { id: 'liability', title: t('terms_modal.sections.liability', 'Liability & Disputes'), icon: AlertTriangle },
        { id: 'termination', title: t('terms_modal.sections.termination', 'Termination'), icon: X },
        { id: 'legal', title: t('terms_modal.sections.legal', 'Legal Information'), icon: Settings },
        { id: 'contact', title: t('terms_modal.sections.contact', 'Contact Information'), icon: Phone },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.overview.title', 'Terms of Service Overview')}</h3>
                        <p className="text-gray-600 leading-relaxed">
                            {t('terms_modal.overview.description', 'Welcome to SkillOnCall.ca, Canada\'s premier platform for connecting skilled workers with local businesses. These Terms of Service ("Terms") govern your use of our platform and services.')}
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('terms_modal.overview.canadian_title', '🍁 Canadian Platform')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('terms_modal.overview.canadian_description', 'SkillOnCall.ca is a Canadian company operating under Canadian law. Our platform is designed specifically for the Canadian market, connecting local businesses with skilled workers across Canada.')}
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.overview.for_employers_title', '👔 For Employers')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('terms_modal.overview.for_employers_description', 'Post jobs, find skilled workers, manage shifts, and build your team with trusted professionals in your area.')}
                                </p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.overview.for_workers_title', '👷 For Workers')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('terms_modal.overview.for_workers_description', 'Find flexible work opportunities, showcase your skills, build your reputation, and earn income on your schedule.')}
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                            <strong>{t('terms_modal.overview.last_updated', 'Last Updated:')}</strong> {t('terms_modal.overview.last_updated_date', 'January 2025')}<br />
                            <strong>{t('terms_modal.overview.effective_date', 'Effective Date:')}</strong> {t('terms_modal.overview.effective_date_value', 'January 1, 2025')}
                        </p>
                    </div>
                );

            case 'acceptance':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.acceptance.title', 'Acceptance of Terms')}</h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">{t('terms_modal.acceptance.legal_title', '⚖️ Legal Agreement')}</h4>
                            <p className="text-red-800 text-sm">
                                {t('terms_modal.acceptance.legal_description', 'By accessing or using SkillOnCall.ca, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not use our platform.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.acceptance.agreeing_title', '📋 What You\'re Agreeing To')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.acceptance.agreeing_items', [])) ? t('terms_modal.acceptance.agreeing_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.acceptance.eligibility_title', '✅ Eligibility Requirements')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.acceptance.eligibility_items', [])) ? t('terms_modal.acceptance.eligibility_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.acceptance.changes_title', '🔄 Changes to Terms')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('terms_modal.acceptance.changes_description', 'We may update these Terms from time to time. We\'ll notify you of material changes via email or through the platform. Continued use after changes constitutes acceptance of the new terms.')}
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'platform':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.platform.title', 'Platform Services')}</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('terms_modal.platform.provide_title', '🌐 What We Provide')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('terms_modal.platform.provide_description', 'SkillOnCall.ca is a technology platform that facilitates connections between employers and workers. We are not an employment agency and do not employ workers directly.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.platform.core_title', '🔧 Core Services')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.platform.core_items', [])) ? t('terms_modal.platform.core_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.platform.availability_title', '📱 Platform Availability')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.platform.availability_items', [])) ? t('terms_modal.platform.availability_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.platform.dont_provide_title', '🚫 What We Don\'t Provide')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.platform.dont_provide_items', [])) ? t('terms_modal.platform.dont_provide_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">{t('terms_modal.platform.limitations_title', '⚠️ Platform Limitations')}</h4>
                            <p className="text-yellow-800 text-sm">
                                {t('terms_modal.platform.limitations_description', 'While we strive for 100% uptime, we cannot guarantee uninterrupted service. We may temporarily suspend services for maintenance, updates, or technical issues.')}
                            </p>
                        </div>
                    </div>
                );

            case 'accounts':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.accounts.title', 'User Accounts')}</h3>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.accounts.creation_title', '📝 Account Creation')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.accounts.creation_items', [])) ? t('terms_modal.accounts.creation_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.accounts.security_title', '🔒 Account Security')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.accounts.security_items', [])) ? t('terms_modal.accounts.security_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.accounts.restrictions_title', '🚫 Account Restrictions')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.accounts.restrictions_items', [])) ? t('terms_modal.accounts.restrictions_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-red-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.accounts.verification_title', '⚖️ Account Verification')}</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    {t('terms_modal.accounts.verification_description', 'We may require identity verification including:')}
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.accounts.verification_items', [])) ? t('terms_modal.accounts.verification_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.accounts.communications_title', '📧 Account Communications')}</h4>
                            <p className="text-gray-600 text-sm">
                                {t('terms_modal.accounts.communications_description', 'By creating an account, you consent to receive communications from SkillOnCall.ca including job alerts, platform updates, and important account notifications via email, SMS, and push notifications.')}
                            </p>
                        </div>
                    </div>
                );

            case 'employers':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.employers.title', 'Employer Terms')}</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('terms_modal.employers.responsibilities_title', '👔 Employer Responsibilities')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('terms_modal.employers.responsibilities_description', 'As an employer on SkillOnCall.ca, you are responsible for compliance with all applicable employment laws, workplace safety regulations, and tax obligations.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.employers.posting_title', '📋 Job Posting Requirements')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.employers.posting_items', [])) ? t('terms_modal.employers.posting_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.employers.relationship_title', '💼 Employment Relationship')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.employers.relationship_items', [])) ? t('terms_modal.employers.relationship_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.employers.verification_title', '🔍 Worker Verification')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.employers.verification_items', [])) ? t('terms_modal.employers.verification_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.employers.payment_title', '💳 Payment Obligations')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.employers.payment_items', [])) ? t('terms_modal.employers.payment_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">{t('terms_modal.employers.prohibited_title', '⚠️ Prohibited Activities')}</h4>
                            <ul className="text-yellow-800 space-y-1 text-sm">
                                {(Array.isArray(t('terms_modal.employers.prohibited_items', [])) ? t('terms_modal.employers.prohibited_items', []) : []).map((item: string, idx: number) => (
                                    <li key={idx}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case 'workers':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.workers.title', 'Worker Terms')}</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">{t('terms_modal.workers.rights_title', '👷 Worker Rights & Responsibilities')}</h4>
                            <p className="text-green-800 text-sm">
                                {t('terms_modal.workers.rights_description', 'As a worker on SkillOnCall.ca, you have the right to fair treatment and safe working conditions, along with responsibilities to provide quality service and maintain professionalism.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.workers.profile_title', '📝 Profile Requirements')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.workers.profile_items', [])) ? t('terms_modal.workers.profile_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.workers.commitments_title', '✅ Work Commitments')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.workers.commitments_items', [])) ? t('terms_modal.workers.commitments_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.workers.verification_title', '🔒 Verification Requirements')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.workers.verification_items', [])) ? t('terms_modal.workers.verification_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.workers.payment_title', '💰 Payment & Taxes')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.workers.payment_items', [])) ? t('terms_modal.workers.payment_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">{t('terms_modal.workers.prohibited_title', '🚫 Prohibited Conduct')}</h4>
                            <ul className="text-red-800 space-y-1 text-sm">
                                {(Array.isArray(t('terms_modal.workers.prohibited_items', [])) ? t('terms_modal.workers.prohibited_items', []) : []).map((item: string, idx: number) => (
                                    <li key={idx}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case 'payments':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.payments.title', 'Payments & Billing')}</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('terms_modal.payments.processing_title', '💳 Payment Processing')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('terms_modal.payments.processing_description', 'All payments are processed securely through Stripe. SkillOnCall.ca does not store complete payment information and follows PCI DSS compliance standards.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.payments.employer_billing_title', '👔 Employer Billing')}</h4>
                                <div className="space-y-3">
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.payments.free_trial_title', 'Free Trial')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.payments.free_trial_description', 'First job posting is free for new employers')}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.payments.pay_per_job_title', 'Pay-Per-Job')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.payments.pay_per_job_description', '$5 CAD per job posting (charged when posted)')}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.payments.subscription_title', 'Monthly Subscription')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.payments.subscription_description', '$49 CAD/month for unlimited job postings')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.payments.worker_fees_title', '👷 Worker Fees')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.payments.worker_fees_items', [])) ? t('terms_modal.payments.worker_fees_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.payments.billing_title', '🔄 Billing Terms')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.payments.billing_items', [])) ? t('terms_modal.payments.billing_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.payments.refund_title', '💰 Refund Policy')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.payments.refund_items', [])) ? t('terms_modal.payments.refund_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">{t('terms_modal.payments.disputes_title', '⚠️ Payment Disputes')}</h4>
                            <p className="text-yellow-800 text-sm">
                                {t('terms_modal.payments.disputes_description', 'For payment disputes, contact our support team within 30 days. We\'ll work with you and Stripe to resolve any billing issues fairly and promptly.')}
                            </p>
                        </div>
                    </div>
                );

            case 'conduct':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.conduct.title', 'User Conduct')}</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">{t('terms_modal.conduct.standards_title', '🤝 Community Standards')}</h4>
                            <p className="text-green-800 text-sm">
                                {t('terms_modal.conduct.standards_description', 'SkillOnCall.ca is built on trust, respect, and professionalism. All users must maintain high standards of conduct to ensure a safe and positive experience for everyone.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.conduct.expected_title', '✅ Expected Behavior')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.conduct.expected_items', [])) ? t('terms_modal.conduct.expected_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.conduct.prohibited_title', '🚫 Prohibited Activities')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.conduct.prohibited_items', [])) ? t('terms_modal.conduct.prohibited_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.conduct.safety_title', '🛡️ Safety Measures')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.conduct.safety_items', [])) ? t('terms_modal.conduct.safety_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.conduct.reporting_title', '📢 Reporting System')}</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    {t('terms_modal.conduct.reporting_description', 'If you encounter inappropriate behavior, please report it immediately:')}
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.conduct.reporting_items', [])) ? t('terms_modal.conduct.reporting_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">{t('terms_modal.conduct.enforcement_title', '⚖️ Enforcement Actions')}</h4>
                            <p className="text-red-800 text-sm">
                                {t('terms_modal.conduct.enforcement_description', 'Violations may result in warnings, account suspension, or permanent termination. Serious violations may be reported to law enforcement authorities.')}
                            </p>
                        </div>
                    </div>
                );

            case 'liability':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.liability.title', 'Liability & Disputes')}</h3>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">{t('terms_modal.liability.platform_title', '⚖️ Platform Liability')}</h4>
                            <p className="text-yellow-800 text-sm">
                                {t('terms_modal.liability.platform_description', 'SkillOnCall.ca is a technology platform that facilitates connections. We are not responsible for the actions, conduct, or performance of employers or workers using our platform.')}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.liability.limitation_title', '🚫 Limitation of Liability')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.liability.limitation_items', [])) ? t('terms_modal.liability.limitation_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.liability.user_responsibilities_title', '👥 User Responsibilities')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.liability.user_responsibilities_items', [])) ? t('terms_modal.liability.user_responsibilities_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.liability.dispute_title', '🤝 Dispute Resolution')}</h4>
                                <div className="space-y-2">
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.liability.step1_title', 'Step 1: Direct Communication')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.liability.step1_description', 'Try to resolve disputes directly with the other party')}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.liability.step2_title', 'Step 2: Platform Mediation')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.liability.step2_description', 'Contact our support team for assistance')}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.liability.step3_title', 'Step 3: Formal Resolution')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.liability.step3_description', 'Binding arbitration or legal proceedings if necessary')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.liability.governing_title', '🏛️ Governing Law')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.liability.governing_items', [])) ? t('terms_modal.liability.governing_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('terms_modal.liability.emergency_title', '📞 Emergency Situations')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('terms_modal.liability.emergency_description', 'For workplace emergencies, safety concerns, or criminal activity, contact local emergency services (911) immediately. Report the incident to SkillOnCall.ca after ensuring safety.')}
                            </p>
                        </div>
                    </div>
                );

            case 'termination':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.termination.title', 'Account Termination')}</h3>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.termination.voluntary_title', '👤 Voluntary Termination')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.termination.voluntary_items', [])) ? t('terms_modal.termination.voluntary_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-red-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.termination.by_platform_title', '⚖️ Termination by SkillOnCall.ca')}</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    {t('terms_modal.termination.by_platform_description', 'We may suspend or terminate accounts for:')}
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.termination.by_platform_items', [])) ? t('terms_modal.termination.by_platform_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.termination.process_title', '📋 Termination Process')}</h4>
                                <div className="space-y-2">
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.termination.warning_title', 'Warning')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.termination.warning_description', 'First violation typically results in a warning')}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.termination.suspension_title', 'Suspension')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.termination.suspension_description', 'Temporary suspension for repeated violations')}</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">{t('terms_modal.termination.termination_title', 'Termination')}</h5>
                                        <p className="text-gray-600 text-sm">{t('terms_modal.termination.termination_description', 'Permanent account closure for serious violations')}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.termination.appeals_title', '🔄 Appeals Process')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.termination.appeals_items', [])) ? t('terms_modal.termination.appeals_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">{t('terms_modal.termination.data_title', '💾 Data After Termination')}</h4>
                            <ul className="text-yellow-800 space-y-1 text-sm">
                                {(Array.isArray(t('terms_modal.termination.data_items', [])) ? t('terms_modal.termination.data_items', []) : []).map((item: string, idx: number) => (
                                    <li key={idx}>• {item}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">{t('terms_modal.termination.effect_title', '🚫 Effect of Termination')}</h4>
                            <ul className="text-red-800 space-y-1 text-sm">
                                {(Array.isArray(t('terms_modal.termination.effect_items', [])) ? t('terms_modal.termination.effect_items', []) : []).map((item: string, idx: number) => (
                                    <li key={idx}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                );

            case 'legal':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.legal.title', 'Legal Information')}</h3>
                        
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.legal.company_title', '🏢 Company Information')}</h4>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>{t('terms_modal.legal.legal_name', 'Legal Name:')}</strong> SkillOnCall.ca Inc.</p>
                                    <p><strong>{t('terms_modal.legal.business_number', 'Business Number:')}</strong> 123456789RC0001</p>
                                    <p><strong>{t('terms_modal.legal.incorporation', 'Incorporation:')}</strong> Federally incorporated in Canada</p>
                                    <p><strong>{t('terms_modal.legal.registered_office', 'Registered Office:')}</strong></p>
                                    <p className="ml-4" dangerouslySetInnerHTML={{__html: t('terms_modal.legal.company_address', '123 Main Street, Suite 456<br />Toronto, ON M5V 3A8<br />Canada')}} />
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.legal.governing_title', '⚖️ Governing Law & Jurisdiction')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.legal.governing_items', [])) ? t('terms_modal.legal.governing_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.legal.compliance_title', '📋 Compliance & Regulations')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.legal.compliance_items', [])) ? t('terms_modal.legal.compliance_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.legal.ip_title', '🔒 Intellectual Property')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.legal.ip_items', [])) ? t('terms_modal.legal.ip_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.legal.severability_title', '📄 Severability')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('terms_modal.legal.severability_description', 'If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect. Invalid provisions will be replaced with enforceable provisions that achieve the same intent.')}
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.legal.entire_title', '🔄 Entire Agreement')}</h4>
                                <p className="text-gray-600 text-sm">
                                    {t('terms_modal.legal.entire_description', 'These Terms, together with our Privacy Policy and other referenced policies, constitute the entire agreement between you and SkillOnCall.ca regarding use of our platform.')}
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('terms_modal.legal.values_title', '🍁 Canadian Values')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('terms_modal.legal.values_description', 'SkillOnCall.ca is proud to be a Canadian company. We\'re committed to supporting Canadian workers and businesses while upholding Canadian values of fairness, diversity, and inclusion.')}
                            </p>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">{t('terms_modal.contact.title', 'Contact Information')}</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">{t('terms_modal.contact.support_title', '📞 Get Support')}</h4>
                            <p className="text-blue-800 text-sm">
                                {t('terms_modal.contact.support_description', 'Have questions about these Terms of Service? Need help with your account? Our support team is here to help Canadian employers and workers succeed.')}
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.contact.company_title', '🏢 SkillOnCall.ca Inc.')}</h4>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>{t('terms_modal.contact.general_support', 'General Support:')}</strong> support@skilloncall.ca</p>
                                    <p><strong>{t('terms_modal.contact.legal_inquiries', 'Legal Inquiries:')}</strong> legal@skilloncall.ca</p>
                                    <p><strong>{t('terms_modal.contact.appeals', 'Appeals:')}</strong> appeals@skilloncall.ca</p>
                                    <p><strong>{t('terms_modal.contact.business_development', 'Business Development:')}</strong> partnerships@skilloncall.ca</p>
                                    <p><strong>{t('terms_modal.contact.phone', 'Phone:')}</strong> 1-800-SKILL-ON (1-800-754-5566)</p>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.contact.mailing_title', '📍 Mailing Address')}</h4>
                                <div className="text-gray-600 text-sm" dangerouslySetInnerHTML={{__html: t('terms_modal.contact.mailing_address', 'SkillOnCall.ca Inc.<br />Legal Department<br />123 Main Street, Suite 456<br />Toronto, ON M5V 3A8<br />Canada')}} />
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.contact.hours_title', '⏰ Support Hours')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li><strong>{t('terms_modal.contact.general_hours', 'General Support:')}</strong> {t('terms_modal.contact.general_hours_time', 'Monday-Friday, 9 AM - 6 PM EST')}</li>
                                    <li><strong>{t('terms_modal.contact.emergency_hours', 'Emergency Support:')}</strong> {t('terms_modal.contact.emergency_hours_time', '24/7 for safety issues')}</li>
                                    <li><strong>{t('terms_modal.contact.legal_hours', 'Legal Inquiries:')}</strong> {t('terms_modal.contact.legal_hours_time', '2-3 business days response')}</li>
                                    <li><strong>{t('terms_modal.contact.phone_hours', 'Phone Support:')}</strong> {t('terms_modal.contact.phone_hours_time', 'Monday-Friday, 9 AM - 5 PM EST')}</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.contact.resources_title', '🌐 Online Resources')}</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    {(Array.isArray(t('terms_modal.contact.resources_items', [])) ? t('terms_modal.contact.resources_items', []) : []).map((item: string, idx: number) => (
                                        <li key={idx}>• {item}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">{t('terms_modal.contact.feedback_title', '💬 Feedback Welcome')}</h4>
                            <p className="text-green-800 text-sm">
                                {t('terms_modal.contact.feedback_description', 'We value your feedback! Help us improve SkillOnCall.ca by sharing your suggestions, reporting issues, or telling us about your experience. Email feedback@skilloncall.ca')}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">{t('terms_modal.contact.updates_title', '🔄 Terms Updates')}</h4>
                            <p className="text-gray-600 text-sm">
                                {t('terms_modal.contact.updates_description', 'We may update these Terms of Service from time to time. Significant changes will be communicated via email and through the platform. Continued use constitutes acceptance of updated terms.')}
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
                                    <FileText className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">{t('terms_modal.title', 'Terms of Service')}</h2>
                                    <p className="text-sm text-gray-500">{t('terms_modal.subtitle', 'SkillOnCall.ca')}</p>
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
                            <p>{t('terms_modal.made_in_canada', '🍁 Made in Canada')}</p>
                            <p className="mt-1">{t('terms_modal.last_updated', 'Last updated: January 2025')}</p>
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
                                {t('terms_modal.questions_contact', 'Questions? Contact us at')} <strong>legal@skilloncall.ca</strong>
                            </div>
                            <Button 
                                onClick={onClose}
                                className="text-white hover:opacity-90"
                                style={{backgroundColor: '#10B3D6', cursor: 'pointer'}}
                            >
                                {t('terms_modal.close', 'Close')}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

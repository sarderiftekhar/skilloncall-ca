import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { X, FileText, Users, Briefcase, CreditCard, Shield, AlertTriangle, Globe, Phone, Settings } from 'react-feather';

interface TermsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
    const [activeSection, setActiveSection] = useState('overview');

    if (!isOpen) return null;

    const sections = [
        { id: 'overview', title: 'Terms Overview', icon: FileText },
        { id: 'acceptance', title: 'Acceptance of Terms', icon: Settings },
        { id: 'platform', title: 'Platform Services', icon: Globe },
        { id: 'accounts', title: 'User Accounts', icon: Users },
        { id: 'employers', title: 'Employer Terms', icon: Briefcase },
        { id: 'workers', title: 'Worker Terms', icon: Users },
        { id: 'payments', title: 'Payments & Billing', icon: CreditCard },
        { id: 'conduct', title: 'User Conduct', icon: Shield },
        { id: 'liability', title: 'Liability & Disputes', icon: AlertTriangle },
        { id: 'termination', title: 'Termination', icon: X },
        { id: 'legal', title: 'Legal Information', icon: Settings },
        { id: 'contact', title: 'Contact Information', icon: Phone },
    ];

    const renderContent = () => {
        switch (activeSection) {
            case 'overview':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Terms of Service Overview</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Welcome to SkillOnCall.ca, Canada's premier platform for connecting skilled workers with local businesses. 
                            These Terms of Service ("Terms") govern your use of our platform and services.
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">🍁 Canadian Platform</h4>
                            <p className="text-blue-800 text-sm">
                                SkillOnCall.ca is a Canadian company operating under Canadian law. Our platform is designed 
                                specifically for the Canadian market, connecting local businesses with skilled workers across Canada.
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">👔 For Employers</h4>
                                <p className="text-gray-600 text-sm">
                                    Post jobs, find skilled workers, manage shifts, and build your team with trusted professionals 
                                    in your area.
                                </p>
                            </div>
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">👷 For Workers</h4>
                                <p className="text-gray-600 text-sm">
                                    Find flexible work opportunities, showcase your skills, build your reputation, and earn 
                                    income on your schedule.
                                </p>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed">
                            <strong>Last Updated:</strong> January 2025<br />
                            <strong>Effective Date:</strong> January 1, 2025
                        </p>
                    </div>
                );

            case 'acceptance':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Acceptance of Terms</h3>
                        
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">⚖️ Legal Agreement</h4>
                            <p className="text-red-800 text-sm">
                                By accessing or using SkillOnCall.ca, you agree to be bound by these Terms of Service. 
                                If you do not agree to these terms, you may not use our platform.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📋 What You're Agreeing To</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• These Terms of Service and all policies referenced herein</li>
                                    <li>• Our Privacy Policy and data handling practices</li>
                                    <li>• Community Guidelines and acceptable use policies</li>
                                    <li>• Payment Terms and billing policies</li>
                                    <li>• Applicable Canadian federal and provincial laws</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">✅ Eligibility Requirements</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• You must be at least 18 years old</li>
                                    <li>• You must be legally authorized to work in Canada</li>
                                    <li>• You must provide accurate and truthful information</li>
                                    <li>• You must have the legal capacity to enter into contracts</li>
                                    <li>• Your use must comply with all applicable laws</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-purple-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔄 Changes to Terms</h4>
                                <p className="text-gray-600 text-sm">
                                    We may update these Terms from time to time. We'll notify you of material changes via email 
                                    or through the platform. Continued use after changes constitutes acceptance of the new terms.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'platform':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Platform Services</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">🌐 What We Provide</h4>
                            <p className="text-blue-800 text-sm">
                                SkillOnCall.ca is a technology platform that facilitates connections between employers and workers. 
                                We are not an employment agency and do not employ workers directly.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔧 Core Services</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Job posting and worker search functionality</li>
                                    <li>• Messaging and communication tools</li>
                                    <li>• Profile creation and skill verification</li>
                                    <li>• Rating and review systems</li>
                                    <li>• Payment processing through Stripe</li>
                                    <li>• GPS check-in and work verification</li>
                                    <li>• Dispute resolution assistance</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📱 Platform Availability</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Web platform accessible 24/7 (subject to maintenance)</li>
                                    <li>• Mobile apps for iOS and Android (coming soon)</li>
                                    <li>• Email and SMS notifications</li>
                                    <li>• Customer support during business hours</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🚫 What We Don't Provide</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Employment relationships or job guarantees</li>
                                    <li>• Background checks or employment verification</li>
                                    <li>• Insurance coverage for work performed</li>
                                    <li>• Legal advice or employment law guidance</li>
                                    <li>• Tax preparation or payroll services</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Platform Limitations</h4>
                            <p className="text-yellow-800 text-sm">
                                While we strive for 100% uptime, we cannot guarantee uninterrupted service. We may temporarily 
                                suspend services for maintenance, updates, or technical issues.
                            </p>
                        </div>
                    </div>
                );

            case 'accounts':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">User Accounts</h3>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📝 Account Creation</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Provide accurate, current, and complete information</li>
                                    <li>• Choose a secure password and enable two-factor authentication</li>
                                    <li>• Verify your email address and phone number</li>
                                    <li>• Upload required identification documents</li>
                                    <li>• Select appropriate account type (Employer or Worker)</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔒 Account Security</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• You are responsible for maintaining account security</li>
                                    <li>• Do not share login credentials with others</li>
                                    <li>• Report suspicious activity immediately</li>
                                    <li>• Use strong, unique passwords</li>
                                    <li>• Log out from shared or public devices</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🚫 Account Restrictions</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• One account per person (no multiple accounts)</li>
                                    <li>• No account sharing or selling</li>
                                    <li>• Limited to 3 devices per account</li>
                                    <li>• Must be 18+ years old to create an account</li>
                                    <li>• Must be legally authorized to work in Canada</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-red-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">⚖️ Account Verification</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    We may require identity verification including:
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Government-issued photo ID</li>
                                    <li>• Social Insurance Number (for tax purposes)</li>
                                    <li>• Business registration documents (for employers)</li>
                                    <li>• Banking information for payments</li>
                                    <li>• Professional certifications or licenses</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">📧 Account Communications</h4>
                            <p className="text-gray-600 text-sm">
                                By creating an account, you consent to receive communications from SkillOnCall.ca including 
                                job alerts, platform updates, and important account notifications via email, SMS, and push notifications.
                            </p>
                        </div>
                    </div>
                );

            case 'employers':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Employer Terms</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">👔 Employer Responsibilities</h4>
                            <p className="text-blue-800 text-sm">
                                As an employer on SkillOnCall.ca, you are responsible for compliance with all applicable 
                                employment laws, workplace safety regulations, and tax obligations.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📋 Job Posting Requirements</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Provide accurate job descriptions and requirements</li>
                                    <li>• Specify fair wages meeting minimum wage laws</li>
                                    <li>• Include clear work location and schedule details</li>
                                    <li>• Comply with human rights and anti-discrimination laws</li>
                                    <li>• Do not post illegal, harmful, or inappropriate content</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">💼 Employment Relationship</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• You are the direct employer of hired workers</li>
                                    <li>• Responsible for all employment law compliance</li>
                                    <li>• Must provide safe working conditions</li>
                                    <li>• Handle payroll, taxes, and benefits as required by law</li>
                                    <li>• Maintain appropriate insurance coverage</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔍 Worker Verification</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Verify worker eligibility to work in Canada</li>
                                    <li>• Conduct any required background checks</li>
                                    <li>• Ensure workers have necessary skills/certifications</li>
                                    <li>• Provide appropriate training and supervision</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">💳 Payment Obligations</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Pay platform fees as outlined in your subscription</li>
                                    <li>• Pay workers directly according to agreed terms</li>
                                    <li>• Handle all tax withholdings and remittances</li>
                                    <li>• Provide required employment documentation</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Prohibited Activities</h4>
                            <ul className="text-yellow-800 space-y-1 text-sm">
                                <li>• Discriminatory hiring practices</li>
                                <li>• Posting fake or misleading job opportunities</li>
                                <li>• Requesting inappropriate personal information</li>
                                <li>• Circumventing platform payment systems</li>
                                <li>• Harassment or inappropriate conduct toward workers</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'workers':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Worker Terms</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">👷 Worker Rights & Responsibilities</h4>
                            <p className="text-green-800 text-sm">
                                As a worker on SkillOnCall.ca, you have the right to fair treatment and safe working conditions, 
                                along with responsibilities to provide quality service and maintain professionalism.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📝 Profile Requirements</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Provide accurate skills, experience, and availability</li>
                                    <li>• Upload current, professional profile photos</li>
                                    <li>• Maintain up-to-date contact information</li>
                                    <li>• Include relevant certifications and training</li>
                                    <li>• Be honest about work history and references</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">✅ Work Commitments</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Honor accepted job commitments and schedules</li>
                                    <li>• Arrive on time and complete assigned tasks</li>
                                    <li>• Follow employer instructions and safety protocols</li>
                                    <li>• Use GPS check-in and selfie verification as required</li>
                                    <li>• Maintain professional conduct at all times</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔒 Verification Requirements</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Provide valid government-issued identification</li>
                                    <li>• Verify eligibility to work in Canada</li>
                                    <li>• Complete identity verification process</li>
                                    <li>• Submit banking information for payments</li>
                                    <li>• Upload required certifications or licenses</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">💰 Payment & Taxes</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Payments made directly by employers (not through platform)</li>
                                    <li>• Responsible for your own tax obligations</li>
                                    <li>• Keep records of all work performed and payments received</li>
                                    <li>• Report income as required by Canadian tax law</li>
                                    <li>• Consider consulting a tax professional</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">🚫 Prohibited Conduct</h4>
                            <ul className="text-red-800 space-y-1 text-sm">
                                <li>• No-shows without proper notice</li>
                                <li>• Misrepresenting skills or experience</li>
                                <li>• Inappropriate behavior toward employers or customers</li>
                                <li>• Sharing account credentials or allowing others to work under your account</li>
                                <li>• Circumventing platform systems or policies</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'payments':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Payments & Billing</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">💳 Payment Processing</h4>
                            <p className="text-blue-800 text-sm">
                                All payments are processed securely through Stripe. SkillOnCall.ca does not store 
                                complete payment information and follows PCI DSS compliance standards.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">👔 Employer Billing</h4>
                                <div className="space-y-3">
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Free Trial</h5>
                                        <p className="text-gray-600 text-sm">First job posting is free for new employers</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Pay-Per-Job</h5>
                                        <p className="text-gray-600 text-sm">$5 CAD per job posting (charged when posted)</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Monthly Subscription</h5>
                                        <p className="text-gray-600 text-sm">$49 CAD/month for unlimited job postings</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">👷 Worker Fees</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Basic platform use is free for workers</li>
                                    <li>• Optional premium features available for enhanced visibility</li>
                                    <li>• No fees for job applications or messaging</li>
                                    <li>• Workers are paid directly by employers</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔄 Billing Terms</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• All prices shown in Canadian dollars (CAD)</li>
                                    <li>• Applicable taxes (HST/GST/PST) added as required</li>
                                    <li>• Subscription fees billed monthly in advance</li>
                                    <li>• Pay-per-job fees charged immediately upon posting</li>
                                    <li>• Failed payments may result in service suspension</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">💰 Refund Policy</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Subscription refunds available within 7 days of billing</li>
                                    <li>• Pay-per-job fees are non-refundable once posted</li>
                                    <li>• Refunds processed to original payment method</li>
                                    <li>• Contact support for refund requests</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Payment Disputes</h4>
                            <p className="text-yellow-800 text-sm">
                                For payment disputes, contact our support team within 30 days. We'll work with you and 
                                Stripe to resolve any billing issues fairly and promptly.
                            </p>
                        </div>
                    </div>
                );

            case 'conduct':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">User Conduct</h3>
                        
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">🤝 Community Standards</h4>
                            <p className="text-green-800 text-sm">
                                SkillOnCall.ca is built on trust, respect, and professionalism. All users must maintain 
                                high standards of conduct to ensure a safe and positive experience for everyone.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">✅ Expected Behavior</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Treat all users with respect and professionalism</li>
                                    <li>• Communicate clearly and honestly</li>
                                    <li>• Honor commitments and agreements</li>
                                    <li>• Provide accurate information in profiles and job postings</li>
                                    <li>• Report suspicious or inappropriate behavior</li>
                                    <li>• Follow all applicable laws and regulations</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🚫 Prohibited Activities</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Harassment, discrimination, or hate speech</li>
                                    <li>• Posting false, misleading, or fraudulent content</li>
                                    <li>• Sharing inappropriate or offensive material</li>
                                    <li>• Attempting to circumvent platform systems</li>
                                    <li>• Spamming or unsolicited marketing</li>
                                    <li>• Violating intellectual property rights</li>
                                    <li>• Engaging in illegal activities</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🛡️ Safety Measures</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• GPS verification for work check-ins</li>
                                    <li>• Selfie verification to prevent fraud</li>
                                    <li>• Rating and review system for accountability</li>
                                    <li>• Secure messaging within the platform</li>
                                    <li>• Identity verification for all users</li>
                                    <li>• 24/7 monitoring for suspicious activity</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📢 Reporting System</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    If you encounter inappropriate behavior, please report it immediately:
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Use the "Report" button on profiles or messages</li>
                                    <li>• Contact support at support@skilloncall.ca</li>
                                    <li>• For emergencies, contact local authorities first</li>
                                    <li>• Provide detailed information about the incident</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">⚖️ Enforcement Actions</h4>
                            <p className="text-red-800 text-sm">
                                Violations may result in warnings, account suspension, or permanent termination. 
                                Serious violations may be reported to law enforcement authorities.
                            </p>
                        </div>
                    </div>
                );

            case 'liability':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Liability & Disputes</h3>
                        
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">⚖️ Platform Liability</h4>
                            <p className="text-yellow-800 text-sm">
                                SkillOnCall.ca is a technology platform that facilitates connections. We are not responsible 
                                for the actions, conduct, or performance of employers or workers using our platform.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🚫 Limitation of Liability</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• We provide the platform "as is" without warranties</li>
                                    <li>• Not liable for employment relationships or disputes</li>
                                    <li>• Not responsible for workplace injuries or accidents</li>
                                    <li>• Not liable for payment disputes between users</li>
                                    <li>• Maximum liability limited to fees paid to SkillOnCall.ca</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">👥 User Responsibilities</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Users are responsible for their own actions and decisions</li>
                                    <li>• Employers must maintain appropriate insurance coverage</li>
                                    <li>• Workers should verify job details and safety conditions</li>
                                    <li>• All users must comply with applicable laws</li>
                                    <li>• Users indemnify SkillOnCall.ca against third-party claims</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🤝 Dispute Resolution</h4>
                                <div className="space-y-2">
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Step 1: Direct Communication</h5>
                                        <p className="text-gray-600 text-sm">Try to resolve disputes directly with the other party</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Step 2: Platform Mediation</h5>
                                        <p className="text-gray-600 text-sm">Contact our support team for assistance</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Step 3: Formal Resolution</h5>
                                        <p className="text-gray-600 text-sm">Binding arbitration or legal proceedings if necessary</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🏛️ Governing Law</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• These Terms are governed by Canadian federal law</li>
                                    <li>• Provincial laws of Ontario apply where applicable</li>
                                    <li>• Disputes subject to jurisdiction of Canadian courts</li>
                                    <li>• Arbitration conducted under Canadian arbitration rules</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">📞 Emergency Situations</h4>
                            <p className="text-blue-800 text-sm">
                                For workplace emergencies, safety concerns, or criminal activity, contact local emergency 
                                services (911) immediately. Report the incident to SkillOnCall.ca after ensuring safety.
                            </p>
                        </div>
                    </div>
                );

            case 'termination':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Account Termination</h3>
                        
                        <div className="space-y-4">
                            <div className="border-l-4 border-blue-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">👤 Voluntary Termination</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• You may delete your account at any time</li>
                                    <li>• Complete any outstanding work commitments first</li>
                                    <li>• Cancel active subscriptions to avoid future charges</li>
                                    <li>• Download any data you wish to keep</li>
                                    <li>• Contact support if you need assistance</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-red-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">⚖️ Termination by SkillOnCall.ca</h4>
                                <p className="text-gray-600 text-sm mb-2">
                                    We may suspend or terminate accounts for:
                                </p>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Violation of these Terms of Service</li>
                                    <li>• Fraudulent or illegal activity</li>
                                    <li>• Repeated policy violations</li>
                                    <li>• Non-payment of fees</li>
                                    <li>• Abuse of other users</li>
                                    <li>• Security concerns</li>
                                </ul>
                            </div>

                            <div className="border-l-4 border-orange-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📋 Termination Process</h4>
                                <div className="space-y-2">
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Warning</h5>
                                        <p className="text-gray-600 text-sm">First violation typically results in a warning</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Suspension</h5>
                                        <p className="text-gray-600 text-sm">Temporary suspension for repeated violations</p>
                                    </div>
                                    <div className="bg-gray-50 rounded p-3">
                                        <h5 className="font-medium text-gray-900 mb-1">Termination</h5>
                                        <p className="text-gray-600 text-sm">Permanent account closure for serious violations</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-l-4 border-green-500 pl-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔄 Appeals Process</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• You may appeal termination decisions</li>
                                    <li>• Submit appeals to appeals@skilloncall.ca</li>
                                    <li>• Provide detailed explanation and evidence</li>
                                    <li>• Appeals reviewed within 7 business days</li>
                                    <li>• Decision is final after appeal review</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <h4 className="font-semibold text-yellow-900 mb-2">💾 Data After Termination</h4>
                            <ul className="text-yellow-800 space-y-1 text-sm">
                                <li>• Account data deleted within 30 days of termination</li>
                                <li>• Some data retained for legal compliance (tax records, etc.)</li>
                                <li>• Messages and job history may be preserved for disputes</li>
                                <li>• Request data export before account deletion</li>
                            </ul>
                        </div>

                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <h4 className="font-semibold text-red-900 mb-2">🚫 Effect of Termination</h4>
                            <ul className="text-red-800 space-y-1 text-sm">
                                <li>• Immediate loss of access to platform services</li>
                                <li>• Outstanding payment obligations remain</li>
                                <li>• No refunds for unused subscription time</li>
                                <li>• Prohibited from creating new accounts</li>
                            </ul>
                        </div>
                    </div>
                );

            case 'legal':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Legal Information</h3>
                        
                        <div className="space-y-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🏢 Company Information</h4>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>Legal Name:</strong> SkillOnCall.ca Inc.</p>
                                    <p><strong>Business Number:</strong> 123456789RC0001</p>
                                    <p><strong>Incorporation:</strong> Federally incorporated in Canada</p>
                                    <p><strong>Registered Office:</strong></p>
                                    <p className="ml-4">
                                        123 Main Street, Suite 456<br />
                                        Toronto, ON M5V 3A8<br />
                                        Canada
                                    </p>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">⚖️ Governing Law & Jurisdiction</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• These Terms governed by laws of Canada and Ontario</li>
                                    <li>• Disputes subject to exclusive jurisdiction of Ontario courts</li>
                                    <li>• Canadian Charter of Rights and Freedoms applies</li>
                                    <li>• Consumer protection laws of your province may apply</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📋 Compliance & Regulations</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Personal Information Protection and Electronic Documents Act (PIPEDA)</li>
                                    <li>• Anti-Spam Legislation (CASL)</li>
                                    <li>• Accessibility for Ontarians with Disabilities Act (AODA)</li>
                                    <li>• Employment Standards Act (various provinces)</li>
                                    <li>• Human Rights Code (various provinces)</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔒 Intellectual Property</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• SkillOnCall.ca trademark and logo are our property</li>
                                    <li>• Platform software and design protected by copyright</li>
                                    <li>• Users retain rights to their own content</li>
                                    <li>• Users grant us license to use content for platform operations</li>
                                    <li>• Respect third-party intellectual property rights</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📄 Severability</h4>
                                <p className="text-gray-600 text-sm">
                                    If any provision of these Terms is found to be unenforceable, the remaining provisions 
                                    will continue in full force and effect. Invalid provisions will be replaced with 
                                    enforceable provisions that achieve the same intent.
                                </p>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🔄 Entire Agreement</h4>
                                <p className="text-gray-600 text-sm">
                                    These Terms, together with our Privacy Policy and other referenced policies, 
                                    constitute the entire agreement between you and SkillOnCall.ca regarding use of our platform.
                                </p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">🍁 Canadian Values</h4>
                            <p className="text-blue-800 text-sm">
                                SkillOnCall.ca is proud to be a Canadian company. We're committed to supporting Canadian 
                                workers and businesses while upholding Canadian values of fairness, diversity, and inclusion.
                            </p>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-2">📞 Get Support</h4>
                            <p className="text-blue-800 text-sm">
                                Have questions about these Terms of Service? Need help with your account? 
                                Our support team is here to help Canadian employers and workers succeed.
                            </p>
                        </div>

                        <div className="grid gap-4">
                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🏢 SkillOnCall.ca Inc.</h4>
                                <div className="text-gray-600 text-sm space-y-1">
                                    <p><strong>General Support:</strong> support@skilloncall.ca</p>
                                    <p><strong>Legal Inquiries:</strong> legal@skilloncall.ca</p>
                                    <p><strong>Appeals:</strong> appeals@skilloncall.ca</p>
                                    <p><strong>Business Development:</strong> partnerships@skilloncall.ca</p>
                                    <p><strong>Phone:</strong> 1-800-SKILL-ON (1-800-754-5566)</p>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">📍 Mailing Address</h4>
                                <div className="text-gray-600 text-sm">
                                    <p>SkillOnCall.ca Inc.</p>
                                    <p>Legal Department</p>
                                    <p>123 Main Street, Suite 456</p>
                                    <p>Toronto, ON M5V 3A8</p>
                                    <p>Canada</p>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">⏰ Support Hours</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li><strong>General Support:</strong> Monday-Friday, 9 AM - 6 PM EST</li>
                                    <li><strong>Emergency Support:</strong> 24/7 for safety issues</li>
                                    <li><strong>Legal Inquiries:</strong> 2-3 business days response</li>
                                    <li><strong>Phone Support:</strong> Monday-Friday, 9 AM - 5 PM EST</li>
                                </ul>
                            </div>

                            <div className="border rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 mb-2">🌐 Online Resources</h4>
                                <ul className="text-gray-600 space-y-1 text-sm">
                                    <li>• Help Center: help.skilloncall.ca</li>
                                    <li>• Community Forum: community.skilloncall.ca</li>
                                    <li>• Status Page: status.skilloncall.ca</li>
                                    <li>• Developer API: developers.skilloncall.ca</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-semibold text-green-900 mb-2">💬 Feedback Welcome</h4>
                            <p className="text-green-800 text-sm">
                                We value your feedback! Help us improve SkillOnCall.ca by sharing your suggestions, 
                                reporting issues, or telling us about your experience. Email feedback@skilloncall.ca
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="font-semibold text-gray-900 mb-2">🔄 Terms Updates</h4>
                            <p className="text-gray-600 text-sm">
                                We may update these Terms of Service from time to time. Significant changes will be 
                                communicated via email and through the platform. Continued use constitutes acceptance of updated terms.
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
                                    <h2 className="text-lg font-bold text-gray-900">Terms of Service</h2>
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
                                Questions? Contact us at <strong>legal@skilloncall.ca</strong>
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

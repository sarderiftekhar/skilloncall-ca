import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Briefcase, CheckCircle, Clock, FileText, Globe, MapPin, User } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';

// Import step components (we'll create these next)
import FeedbackModal from '@/components/feedback-modal';
import LanguagesAvailabilityStep from '@/components/onboarding/LanguagesAvailabilityStep';
import LocationPreferencesStep from '@/components/onboarding/LocationPreferencesStep';
import PersonalInfoStep from '@/components/onboarding/PersonalInfoStep';
import SkillsExperienceStep from '@/components/onboarding/SkillsExperienceStep';
import WorkHistoryStep from '@/components/onboarding/WorkHistoryStep';

interface OnboardingProps {
    currentStep: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profileData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalSkills: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalIndustries: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalLanguages: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalCertifications: any[];
}

export default function WorkerOnboarding({
    currentStep,
    profileData,
    globalSkills = [],
    globalIndustries = [],
    globalLanguages = [],
    globalCertifications = [],
}: OnboardingProps) {
    const { t, locale } = useTranslations();
    const [step, setStep] = useState(currentStep || 1);
    const [formData, setFormData] = useState(profileData || {});
    const [isSubmitting, setIsSubmitting] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [validationErrors, setValidationErrors] = useState<any>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalMessage, setModalMessage] = useState('');
    const [modalType, setModalType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
    const [modalDetails, setModalDetails] = useState<string | string[] | undefined>(undefined);

    // Language switcher function
    const switchLang = (next: 'en' | 'fr') => {
        const url = new URL(window.location.href);
        url.searchParams.set('lang', next);
        window.location.href = url.toString();
    };

    const queryLang = `?lang=${locale}`;

    const OnboardingSteps = [
        {
            id: 1,
            title: t('steps.personal_info.title', 'Personal Info'),
            icon: User,
            description: t('steps.personal_info.description', 'Basic information and photo'),
            mobileTitle: t('steps.personal_info.mobile', 'About You'),
        },
        {
            id: 2,
            title: t('steps.skills.title', 'Skills & Experience'),
            icon: Briefcase,
            description: t('steps.skills.description', 'Your skills and experience level'),
            mobileTitle: t('steps.skills.mobile', 'Your Skills'),
        },
        {
            id: 3,
            title: t('steps.work_history.title', 'Work History'),
            icon: FileText,
            description: t('steps.work_history.description', 'Current and previous jobs'),
            mobileTitle: t('steps.work_history.mobile', 'Work History'),
        },
        {
            id: 4,
            title: t('steps.location.title', 'Location & Rates'),
            icon: MapPin,
            description: t('steps.location.description', 'Where you work and your rates'),
            mobileTitle: t('steps.location.mobile', 'Location & Rates'),
        },
        {
            id: 5,
            title: t('steps.schedule.title', 'Your Schedule'),
            icon: Clock,
            description: t('steps.schedule.description', 'When you are available to work'),
            mobileTitle: t('steps.schedule.mobile', 'Schedule'),
        },
    ];

    const progress = (step / OnboardingSteps.length) * 100;
    const currentStepInfo = OnboardingSteps.find((s) => s.id === step);

    // Smooth slow scroll helper
    const scrollToElementSlowly = (element: HTMLElement, durationMs = 1400) => {
        const headerOffset = 120;
        const startY = window.scrollY || window.pageYOffset;
        const targetY = element.getBoundingClientRect().top + startY - headerOffset;
        const distance = targetY - startY;
        let startTime: number | null = null;

        const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

        const stepAnim = (timestamp: number) => {
            if (startTime === null) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const pct = Math.min(elapsed / durationMs, 1);
            const eased = easeInOutCubic(pct);
            window.scrollTo(0, startY + distance * eased);
            if (elapsed < durationMs) {
                window.requestAnimationFrame(stepAnim);
            } else {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (element as HTMLElement).focus({ preventScroll: true } as any);
            }
        };

        window.requestAnimationFrame(stepAnim);
    };

    // Handle form data updates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateFormData = (newData: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setFormData((prev: any) => ({ ...prev, ...newData }));
        setValidationErrors({}); // Clear errors when user updates data
    };

    // Check if the current step can proceed (for validation)
    const canProceedToNextStep = () => {
        // Step 3: Work History - requires employment status and at least 1 work experience
        if (step === 3) {
            const hasEmploymentStatus =
                formData.employment_status && ['employed', 'unemployed', 'self_employed'].includes(formData.employment_status);
            const hasWorkExperience = formData.work_experiences && formData.work_experiences.length > 0;
            return hasEmploymentStatus && hasWorkExperience;
        }

        return true; // Other steps can proceed
    };

    // Navigation functions
    const goToNextStep = async () => {
        if (step < OnboardingSteps.length) {
            setIsSubmitting(true);

            try {
                // Prepare data for backend - remove temporary IDs from new records
                const dataToSend = { ...formData };

                // For step 3 (Work History), clean up the IDs
                if (step === 3) {
                    if (dataToSend.work_experiences) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        dataToSend.work_experiences = dataToSend.work_experiences.map((exp: any) => {
                            const cleaned = { ...exp };
                            // Remove the temporary string ID for new records
                            if (typeof cleaned.id === 'string') {
                                delete cleaned.id;
                            }
                            // Ensure is_current is a boolean
                            cleaned.is_current = Boolean(cleaned.is_current);
                            // Ensure dates are properly formatted
                            if (cleaned.start_date && typeof cleaned.start_date === 'object') {
                                cleaned.start_date = cleaned.start_date.toISOString?.() || cleaned.start_date;
                            }
                            if (cleaned.end_date && typeof cleaned.end_date === 'object') {
                                cleaned.end_date = cleaned.end_date.toISOString?.() || cleaned.end_date;
                            }
                            // Remove empty/undefined optional fields
                            if (!cleaned.description) delete cleaned.description;
                            if (!cleaned.supervisor_name) delete cleaned.supervisor_name;
                            if (!cleaned.supervisor_contact) delete cleaned.supervisor_contact;
                            if (!cleaned.global_skill_id) delete cleaned.global_skill_id;
                            if (!cleaned.global_industry_id) delete cleaned.global_industry_id;
                            return cleaned;
                        });
                    }
                    if (dataToSend.references) {
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        dataToSend.references = dataToSend.references.map((ref: any) => {
                            const cleaned = { ...ref };
                            // Remove the temporary string ID for new records
                            if (typeof cleaned.id === 'string') {
                                delete cleaned.id;
                            }
                            // Remove empty optional fields
                            if (!cleaned.reference_email) delete cleaned.reference_email;
                            if (!cleaned.company_name) delete cleaned.company_name;
                            if (!cleaned.notes) delete cleaned.notes;
                            return cleaned;
                        });
                    }
                }

                // Log data being sent for debugging
                console.log('=== SENDING DATA TO BACKEND ===');
                console.log('Step:', step);
                console.log('Data:', dataToSend);
                console.log('Employment Status:', dataToSend.employment_status);
                console.log('Work Experiences:', dataToSend.work_experiences);
                console.log('References:', dataToSend.references);
                console.log('Profile Photo:', dataToSend.profile_photo);
                console.log('===');

                // For step 1 with photo upload, use FormData
                const shouldUseFormData = step === 1 && dataToSend.profile_photo instanceof File;

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let submitData: any;
                if (shouldUseFormData) {
                    const formDataObj = new FormData();
                    formDataObj.append('step', String(step));

                    // Append all data fields except the photo
                    Object.keys(dataToSend).forEach((key) => {
                        if (key === 'profile_photo' && dataToSend[key] instanceof File) {
                            formDataObj.append('data[profile_photo]', dataToSend[key]);
                        } else if (dataToSend[key] !== null && dataToSend[key] !== undefined) {
                            formDataObj.append(`data[${key}]`, String(dataToSend[key]));
                        }
                    });

                    submitData = formDataObj;
                    console.log('Using FormData for file upload');
                } else {
                    submitData = {
                        step: step,
                        data: dataToSend,
                    };
                }

                // Save current step data
                await router.post('/worker/onboarding/save', submitData, {
                    preserveState: true,
                    preserveScroll: true,
                    forceFormData: shouldUseFormData,
                    onSuccess: () => {
                        setStep(step + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    },
                    onError: (errors) => {
                        console.log('=== ONBOARDING SUBMISSION ERROR ===');
                        console.log('Step:', step);
                        console.log('Raw errors object:', errors);
                        console.log('Error keys:', Object.keys(errors));
                        console.log('Error values:', Object.values(errors));
                        console.log('Stringified errors:', JSON.stringify(errors, null, 2));
                        console.error('Validation errors:', errors);
                        setValidationErrors(errors);
                        // Also display a modal with a friendly summary
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const errorList = Object.entries(errors || {}).map(([key, value]: [string, any]) => `${key}: ${String(value)}`);
                        setModalType('error');
                        setModalTitle(t('modal.error.title', 'Please fix the highlighted fields'));
                        setModalMessage(t('modal.error.message', 'There were some issues with your input.'));
                        setModalDetails(errorList.slice(0, 10));
                        setModalOpen(true);
                        // Scroll to first field with an error slowly
                        const firstKey = Object.keys(errors)[0];
                        if (firstKey) {
                            const el = document.getElementById(firstKey);
                            if (el) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                scrollToElementSlowly(el as any, 1400);
                            }
                        }
                    },
                });
            } catch (error) {
                console.error('Error saving step:', error);
                setModalType('error');
                setModalTitle(t('modal.save_failed.title', 'Save failed'));
                setModalMessage(t('modal.save_failed.message', 'An unexpected error occurred while saving this step. Please try again.'));
                setModalOpen(true);
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const goToPreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const goToStep = (targetStep: number) => {
        // Allow navigation to any previous step or the current step
        // Don't allow skipping ahead to future steps
        if (targetStep <= step && targetStep >= 1) {
            setStep(targetStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const completeOnboarding = async () => {
        setIsSubmitting(true);

        try {
            // Use Inertia router to handle CSRF automatically
            router.post('/worker/onboarding/complete', 
                { data: formData }, 
                {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: (page) => {
                        // Check if the response is successful
                        const props = page.props as any;
                        if (props?.flash?.success || props?.success) {
                            setModalType('success');
                            setModalTitle(t('modal.complete.title', 'Profile completed'));
                            setModalMessage(props?.flash?.message || props?.message || t('modal.complete.message', 'Your profile is now complete.'));
                            setModalDetails(undefined);
                            setModalOpen(true);
                        }
                        setIsSubmitting(false);
                    },
                    onError: (errors) => {
                        console.error('Completion errors:', errors);
                        const errorMessage = errors?.message || (typeof errors === 'string' ? errors : t('modal.complete_error.message', 'An error occurred while completing your profile.'));
                        const details = errors && typeof errors === 'object' && !errors?.message 
                            ? Object.entries(errors).map(([key, value]) => `${key}: ${String(value)}`)
                            : (errors?.error ? [String(errors.error)] : undefined);
                        setModalType('error');
                        setModalTitle(t('modal.complete_error.title', 'Unable to complete setup'));
                        setModalMessage(errorMessage);
                        setModalDetails(details);
                        setModalOpen(true);
                        setIsSubmitting(false);
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                }
            );
        } catch (error) {
            console.error('Error completing onboarding:', error);
            setModalType('error');
            setModalTitle(t('modal.unexpected.title', 'Unexpected error'));
            setModalMessage(t('modal.unexpected.message', 'Something went wrong while completing your profile. Please try again.'));
            setModalOpen(true);
            setIsSubmitting(false);
        }
    };

    // Render current step component
    const renderStepComponent = () => {
        const commonProps = {
            formData,
            updateFormData,
            validationErrors,
            globalSkills,
            globalIndustries,
            globalLanguages,
            globalCertifications,
        };

        switch (step) {
            case 1:
                return <PersonalInfoStep {...commonProps} />;
            case 2:
                return <SkillsExperienceStep {...commonProps} />;
            case 3:
                return <WorkHistoryStep {...commonProps} />;
            case 4:
                return <LocationPreferencesStep {...commonProps} />;
            case 5:
                return <LanguagesAvailabilityStep {...commonProps} />;
            default:
                return <PersonalInfoStep {...commonProps} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6">
            <Head title={`${t('title', 'Worker Setup')} - ${t('step_of', 'Step :step of :total').replace(':step', String(step)).replace(':total', String(OnboardingSteps.length))}`} />
            
            {/* Language Switcher - Fixed at top right */}
            <div className="fixed top-4 right-4 z-50 flex items-center space-x-1 border border-gray-300 rounded-md overflow-hidden bg-white shadow-sm">
                <button 
                    onClick={() => switchLang('en')} 
                    className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                        locale === 'en' 
                            ? 'bg-[#10B3D6] text-white' 
                            : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    EN
                </button>
                <button 
                    onClick={() => switchLang('fr')} 
                    className={`px-3 py-1.5 text-sm font-medium cursor-pointer transition-all ${
                        locale === 'fr' 
                            ? 'bg-[#10B3D6] text-white' 
                            : 'bg-transparent text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    FR
                </button>
            </div>

            <FeedbackModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    if (modalType === 'success') {
                        router.visit('/worker/dashboard');
                    }
                }}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                details={modalDetails}
                primaryAction={modalType === 'success' ? { label: t('modal.action.dashboard', 'Go to dashboard'), onClick: () => router.visit('/worker/dashboard') } : undefined}
            />

            {/* Responsive container */}
            <div className="mx-auto max-w-6xl">
                {/* Progress Section */}
                <div className="mb-6 rounded-xl bg-white p-4 shadow-sm md:p-6" style={{ border: '0.05px solid #10B3D6' }}>
                    <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center space-x-2 rounded-full bg-[#10B3D6] px-3 py-2 text-white shadow-sm">
                                <span className="text-sm font-medium">{currentStepInfo?.mobileTitle}</span>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">
                                    {t('step_of', 'Step :step of :total').replace(':step', String(step)).replace(':total', String(OnboardingSteps.length))}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {/* Cancel Button */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => router.visit(`/${queryLang}`)}
                                className="border-2 cursor-pointer text-sm font-semibold hover:opacity-90 transition-all"
                                style={{ 
                                    borderColor: '#ef4444', 
                                    color: '#ef4444',
                                    backgroundColor: 'transparent'
                                }}
                            >
                                {t('nav.cancel', 'Cancel')}
                            </Button>
                            <div className="text-sm font-medium" style={{ color: '#10B3D6' }}>
                                {t('progress_percent', ':percent%').replace(':percent', String(Math.round(progress)))}
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <Progress value={progress} className="h-2 bg-gray-200" style={{ '--progress-background': '#10B3D6' } as React.CSSProperties} />
                </div>

                {/* Desktop Step Navigation (hidden on mobile) */}
                <div className="mb-8 hidden md:block">
                    <div className="flex max-w-full items-center justify-between overflow-hidden">
                        {OnboardingSteps.map((stepInfo, index) => (
                            <div key={stepInfo.id} className="flex min-w-0 flex-1 items-center">
                                {/* Compact Step Indicator */}
                                <div
                                    onClick={() => goToStep(stepInfo.id)}
                                    className={`relative flex w-full items-center justify-center space-x-2 rounded-full px-3 py-2 transition-all duration-300 ${
                                        step >= stepInfo.id ? 'bg-[#10B3D6] text-white shadow-sm' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    } ${stepInfo.id <= step ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
                                >
                                    {/* Icon */}
                                    <stepInfo.icon className="h-4 w-4 flex-shrink-0" />

                                    {/* Title */}
                                    <span className="truncate text-sm font-medium">{stepInfo.title}</span>
                                </div>

                                {/* Connector Line */}
                                {index < OnboardingSteps.length - 1 && (
                                    <div className="mx-1 flex-shrink-0">
                                        <div
                                            className={`h-0.5 w-3 rounded-full transition-all duration-300 ${
                                                step > stepInfo.id ? 'bg-[#10B3D6]' : 'bg-gray-300'
                                            }`}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content Card */}
                <Card className="rounded-xl bg-white shadow-sm" style={{ border: '0.05px solid #10B3D6' }}>
                    <CardContent className="p-6 md:p-8">{renderStepComponent()}</CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="mt-6 flex items-center justify-between gap-4">
                    <Button
                        variant="outline"
                        onClick={goToPreviousStep}
                        disabled={step === 1}
                        className="flex cursor-pointer items-center px-6"
                        style={{ height: '2.7em' }}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">{t('nav.previous', 'Previous')}</span>
                        <span className="sm:hidden">{t('nav.back', 'Back')}</span>
                    </Button>

                    {step < OnboardingSteps.length ? (
                        <Button
                            onClick={goToNextStep}
                            disabled={isSubmitting || !canProceedToNextStep()}
                            className={`flex flex-1 items-center px-6 text-white sm:flex-none ${
                                !canProceedToNextStep() ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                            }`}
                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                            title={
                                step === 3 && !canProceedToNextStep() ? t('validation_required', 'Please select employment status and add at least one work experience') : ''
                            }
                        >
                            <span className="hidden sm:inline">{isSubmitting ? t('nav.saving', 'Saving...') : t('nav.continue', 'Continue')}</span>
                            <span className="sm:hidden">{isSubmitting ? t('nav.saving', 'Saving...') : t('nav.next', 'Next')}</span>
                            {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
                        </Button>
                    ) : (
                        <Button
                            onClick={completeOnboarding}
                            disabled={isSubmitting}
                            className="flex flex-1 cursor-pointer items-center px-6 text-white sm:flex-none"
                            style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {isSubmitting ? t('nav.finishing', 'Finishing...') : t('nav.complete', 'Complete Setup')}
                        </Button>
                    )}
                </div>

                {/* Mobile Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">{t('help_text', 'Need help? You can always come back to complete this later.')}</p>
                </div>
            </div>
        </div>
    );
}

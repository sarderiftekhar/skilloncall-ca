import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Briefcase, MapPin, X } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import { logout } from '@/routes';

import FeedbackModal from '@/components/feedback-modal';
import BusinessInfoStep from '@/components/onboarding/employer/BusinessInfoStep';
import LocationStep from '@/components/onboarding/employer/LocationStep';

interface OnboardingProps {
    currentStep: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profileData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalIndustries: any[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    globalProvinces: any[];
}

export default function EmployerOnboarding({
    currentStep,
    profileData,
    globalIndustries = [],
    globalProvinces = [],
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
    const [firstErrorField, setFirstErrorField] = useState<string | null>(null);

    const OnboardingSteps = [
        {
            id: 1,
            title: t('employer.steps.business_info.title', 'Business Information'),
            icon: Briefcase,
            description: t('employer.steps.business_info.description', 'Business name and contact'),
            mobileTitle: t('employer.steps.business_info.mobile', 'Business Info'),
        },
        {
            id: 2,
            title: t('employer.steps.location.title', 'Location'),
            icon: MapPin,
            description: t('employer.steps.location.description', 'Business address'),
            mobileTitle: t('employer.steps.location.mobile', 'Location'),
        },
    ];

    const progress = (step / OnboardingSteps.length) * 100;
    const currentStepInfo = OnboardingSteps.find((s) => s.id === step);

    // Smooth scroll helper
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
        setValidationErrors({});
    };

    // Navigation functions
    const goToNextStep = async () => {
        if (step < OnboardingSteps.length) {
            setIsSubmitting(true);

            try {
                const dataToSend = { ...formData };

                // Save current step data
                await router.post('/employer/onboarding/save', {
                    step: step,
                    data: dataToSend,
                }, {
                    preserveState: true,
                    preserveScroll: true,
                    onSuccess: () => {
                        setStep(step + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    },
                    onError: (errors) => {
                        console.error('Validation errors:', errors);
                        
                        // Check for 419 Page Expired error (CSRF token expired)
                        const isCsrfError = errors.form === '419 Page Expired' || 
                                           errors.message === '419 Page Expired' ||
                                           (typeof errors.form === 'string' && errors.form.includes('419')) ||
                                           (typeof errors.message === 'string' && errors.message.includes('419'));
                        
                        if (isCsrfError) {
                            console.warn('CSRF token expired - reloading page to refresh token');
                            // Reload the page to get a fresh CSRF token and session
                            window.location.reload();
                            return;
                        }
                        
                        setValidationErrors(errors);

                        // Find first error field and scroll to it
                        const errorKeys = Object.keys(errors);
                        if (errorKeys.length > 0) {
                            const firstError = errorKeys[0];
                            setFirstErrorField(firstError);

                            // Try to find and scroll to the error field
                            setTimeout(() => {
                                const errorElement = document.getElementById(firstError) || 
                                    document.querySelector(`[name="${firstError}"]`) ||
                                    document.querySelector(`[data-field="${firstError}"]`);
                                
                                if (errorElement instanceof HTMLElement) {
                                    scrollToElementSlowly(errorElement);
                                } else {
                                    // Scroll to top of form
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                }
                            }, 100);
                        }

                        // Show error modal
                        const errorMessages = Object.values(errors).filter((msg) => 
                            typeof msg === 'string' && !msg.includes('debug_')
                        ) as string[];

                        if (errorMessages.length > 0) {
                            setModalTitle(t('employer.errors.validation_title', 'Validation Error'));
                            setModalMessage(t('employer.errors.validation_message', 'Please correct the following errors:'));
                            setModalDetails(errorMessages);
                            setModalType('error');
                            setModalOpen(true);
                        }
                    },
                    onFinish: () => {
                        setIsSubmitting(false);
                    },
                });
            } catch (error) {
                console.error('Error saving step:', error);
                setIsSubmitting(false);
            }
        } else {
            // Complete onboarding
            handleComplete();
        }
    };

    const goToPreviousStep = () => {
        if (step > 1) {
            setStep(step - 1);
            setValidationErrors({});
            setFirstErrorField(null);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleCancel = () => {
        // Logout and redirect to homepage
        router.post(logout.url(), {}, {
            onSuccess: () => {
                router.visit('/');
            },
        });
    };

    const handleComplete = async () => {
        setIsSubmitting(true);

        try {
            // First, save the current step data before completing
            const dataToSend = { ...formData };
            
            // Save current step first
            await router.post('/employer/onboarding/save', {
                step: step,
                data: dataToSend,
            }, {
                preserveState: true,
                preserveScroll: true,
                onSuccess: async () => {
                    // After saving, now complete the onboarding
                    router.post('/employer/onboarding/complete', {}, {
                        onSuccess: () => {
                            setModalTitle(t('employer.success.title', 'Welcome!'));
                            setModalMessage(t('employer.success.message', 'Your profile has been completed successfully.'));
                            setModalType('success');
                            setModalOpen(true);

                            // Redirect to dashboard after modal
                            setTimeout(() => {
                                router.visit('/employer/dashboard');
                            }, 2000);
                        },
                        onError: (errors) => {
                            console.error('Completion errors:', errors);
                            
                            // Check for 419 Page Expired error (CSRF token expired)
                            const isCsrfError = errors.form === '419 Page Expired' || 
                                               errors.message === '419 Page Expired' ||
                                               (typeof errors.form === 'string' && errors.form.includes('419')) ||
                                               (typeof errors.message === 'string' && errors.message.includes('419'));
                            
                            if (isCsrfError) {
                                console.warn('CSRF token expired - reloading page to refresh token');
                                // Reload the page to get a fresh CSRF token and session
                                window.location.reload();
                                return;
                            }
                            
                            setValidationErrors(errors);

                            const errorMessages = Object.values(errors).filter((msg) => 
                                typeof msg === 'string' && !msg.includes('debug_')
                            ) as string[];

                            if (errorMessages.length > 0) {
                                setModalTitle(t('employer.errors.completion_title', 'Unable to Complete'));
                                setModalMessage(t('employer.errors.completion_message', 'Please correct the following:'));
                                setModalDetails(errorMessages);
                                setModalType('error');
                                setModalOpen(true);
                            }
                            setIsSubmitting(false);
                        },
                    });
                },
                onError: (errors) => {
                    console.error('Save errors:', errors);
                    
                    // Check for 419 Page Expired error (CSRF token expired)
                    const isCsrfError = errors.form === '419 Page Expired' || 
                                       errors.message === '419 Page Expired' ||
                                       (typeof errors.form === 'string' && errors.form.includes('419')) ||
                                       (typeof errors.message === 'string' && errors.message.includes('419'));
                    
                    if (isCsrfError) {
                        console.warn('CSRF token expired - reloading page to refresh token');
                        // Reload the page to get a fresh CSRF token and session
                        window.location.reload();
                        return;
                    }
                    
                    setValidationErrors(errors);
                    setIsSubmitting(false);
                    
                    const errorMessages = Object.values(errors).filter((msg) => 
                        typeof msg === 'string' && !msg.includes('debug_')
                    ) as string[];

                    if (errorMessages.length > 0) {
                        setModalTitle(t('employer.errors.validation_title', 'Validation Error'));
                        setModalMessage(t('employer.errors.validation_message', 'Please correct the following:'));
                        setModalDetails(errorMessages);
                        setModalType('error');
                        setModalOpen(true);
                    }
                },
            });
        } catch (error) {
            console.error('Error completing onboarding:', error);
            setIsSubmitting(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <BusinessInfoStep
                        formData={formData}
                        updateFormData={updateFormData}
                        validationErrors={validationErrors}
                        globalIndustries={globalIndustries}
                    />
                );
            case 2:
                return (
                    <LocationStep
                        formData={formData}
                        updateFormData={updateFormData}
                        validationErrors={validationErrors}
                        globalProvinces={globalProvinces}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Head title={t('employer.title', 'Employer Setup')} />
            <div className="min-h-screen" style={{ backgroundColor: '#F6FBFD' }}>
                <div className="mx-auto max-w-4xl px-4 py-8">
                    {/* Progress Header */}
                    <Card className="mb-6 border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                        <CardContent className="p-6">
                            <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <h1 className="text-2xl font-bold md:text-3xl" style={{ color: '#192341' }}>
                                    {t('employer.title', 'Employer Setup')}
                                </h1>
                                <div className="flex items-center justify-between gap-4 md:justify-end">
                                    <span className="text-sm font-medium text-gray-600">
                                        {t('employer.step_of', 'Step :step of :total', { step, total: OnboardingSteps.length })}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={isSubmitting}
                                        className="cursor-pointer"
                                        style={{ height: '2.7em' }}
                                    >
                                        <X className="mr-2 h-4 w-4" />
                                        {t('nav.cancel', 'Cancel')}
                                    </Button>
                                </div>
                            </div>

                            <Progress value={progress} className="h-2" />

                            {/* Step Indicators - Mobile */}
                            <div className="mt-4 flex justify-between md:hidden">
                                {OnboardingSteps.map((s) => {
                                    const StepIcon = s.icon;
                                    const isActive = s.id === step;
                                    const isCompleted = s.id < step;

                                    return (
                                        <div
                                            key={s.id}
                                            className="flex flex-col items-center"
                                            style={{
                                                flex: 1,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div
                                                className={`mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                                                    isCompleted
                                                        ? 'bg-green-500'
                                                        : isActive
                                                        ? 'bg-[#10B3D6]'
                                                        : 'bg-gray-300'
                                                }`}
                                            >
                                                <StepIcon className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="text-xs font-medium" style={{ color: '#192341' }}>
                                                {s.mobileTitle}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Step Indicators - Desktop */}
                            <div className="mt-6 hidden md:flex md:justify-between">
                                {OnboardingSteps.map((s) => {
                                    const StepIcon = s.icon;
                                    const isActive = s.id === step;
                                    const isCompleted = s.id < step;

                                    return (
                                        <div
                                            key={s.id}
                                            className="flex items-center"
                                            style={{
                                                flex: 1,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            <div
                                                className={`mr-3 flex h-12 w-12 items-center justify-center rounded-full ${
                                                    isCompleted
                                                        ? 'bg-green-500'
                                                        : isActive
                                                        ? 'bg-[#10B3D6]'
                                                        : 'bg-gray-300'
                                                }`}
                                            >
                                                <StepIcon className="h-6 w-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium" style={{ color: '#192341' }}>
                                                    {s.title}
                                                </div>
                                                <div className="text-xs text-gray-600">{s.description}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Step Content */}
                    <div className="mb-6">{renderStep()}</div>

                    {/* Navigation Buttons */}
                    <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                        <CardContent className="flex items-center justify-between p-6">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={goToPreviousStep}
                                disabled={step === 1 || isSubmitting}
                                className="cursor-pointer"
                                style={{ height: '2.7em' }}
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                {t('nav.previous', 'Previous')}
                            </Button>

                            <Button
                                type="button"
                                onClick={step === OnboardingSteps.length ? handleComplete : goToNextStep}
                                disabled={isSubmitting}
                                className="cursor-pointer"
                                style={{ 
                                    backgroundColor: '#10B3D6',
                                    height: '2.7em',
                                    color: 'white'
                                }}
                            >
                                {isSubmitting
                                    ? t('nav.saving', 'Saving...')
                                    : step === OnboardingSteps.length
                                    ? t('nav.complete', 'Complete Setup')
                                    : t('nav.next', 'Next')}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Feedback Modal */}
            <FeedbackModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                details={modalDetails}
            />
        </>
    );
}


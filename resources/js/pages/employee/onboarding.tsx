import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Head, router } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Briefcase, CheckCircle, Clock, FileText, Globe, MapPin, User } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import { CsrfTokenUpdater } from '@/components/CsrfTokenUpdater';

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

export default function EmployeeOnboarding({
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
    const [firstErrorField, setFirstErrorField] = useState<string | null>(null);

    // Reference Data State - Fetched on demand to reduce memory load
    const [skills, setSkills] = useState<any[]>(globalSkills || []);
    const [industries, setIndustries] = useState<any[]>(globalIndustries || []);
    const [languages, setLanguages] = useState<any[]>(globalLanguages || []);
    const [certifications, setCertifications] = useState<any[]>(globalCertifications || []);

    useEffect(() => {
        const fetchConfig = {
            credentials: 'same-origin' as RequestCredentials,
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        };

        const loadSkillsData = async () => {
            if (skills.length > 0) return;
            try {
                const [s, i, c] = await Promise.all([
                    fetch('/employee/api/skills', fetchConfig).then(r => r.json()),
                    fetch('/employee/api/industries', fetchConfig).then(r => r.json()),
                    fetch('/employee/api/certifications', fetchConfig).then(r => r.json())
                ]);
                setSkills(s);
                setIndustries(i);
                setCertifications(c);
            } catch (e) {
                console.error('Error loading skills data', e);
            }
        };

        const loadLanguageData = async () => {
            if (languages.length > 0) return;
            try {
                const l = await fetch('/employee/api/languages', fetchConfig).then(r => r.json());
                setLanguages(l);
            } catch (e) {
                console.error('Error loading language data', e);
            }
        };

        // Load data based on step requirements
        if (step === 2 || step === 3) {
            loadSkillsData();
        }
        
        // Load languages for location (step 4) and schedule/languages (step 5)
        if (step === 4 || step === 5) {
            loadLanguageData();
        }
    }, [step]);


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

                    // Explicitly add CSRF token to FormData to prevent 419 errors
                    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
                    if (csrfToken) {
                        formDataObj.append('_token', csrfToken);
                    }

                    submitData = formDataObj;
                    console.log('Using FormData for file upload');
                } else {
                    submitData = {
                        step: step,
                        data: dataToSend,
                    };
                }

                // Save current step data
                await router.post('/employee/onboarding/save', submitData, {
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
                        
                        // Check for 419 Page Expired error (CSRF token expired)
                        const isCsrfError = errors.form === '419 Page Expired' || 
                                           errors.message === '419 Page Expired' ||
                                           (typeof errors.form === 'string' && errors.form.includes('419'));
                        
                        if (isCsrfError) {
                            console.warn('CSRF token expired - reloading page to refresh token');
                            // Reload the page to get a fresh CSRF token and session
                            window.location.reload();
                            return;
                        }
                        
                        // Check for debug info to show detailed development errors
                        if (errors.debug_file || errors.debug_line || errors.debug_step || errors.debug_data) {
                            console.group('🐛 DEBUG INFO');
                            if (errors.debug_file) console.log('File:', errors.debug_file);
                            if (errors.debug_line) console.log(errors.debug_line);
                            if (errors.debug_step) console.log(errors.debug_step);
                            if (errors.debug_data) console.log(errors.debug_data);
                            console.groupEnd();
                        }
                        
                        // Check for development errors (more detailed error messages)
                        const isDevelopmentError = errors.form && errors.form.toString().startsWith('Development Error:');
                        
                        setValidationErrors(errors);
                        
                        // Helper function to convert field names to user-friendly labels
                        const getFieldLabel = (fieldName: string): string => {
                            const fieldLabels: Record<string, string> = {
                                'hourly_rate_min': 'Minimum Hourly Rate',
                                'hourly_rate_max': 'Maximum Hourly Rate',
                                'travel_distance_max': 'Maximum Travel Distance',
                                'has_vehicle': 'Vehicle Ownership',
                                'has_tools_equipment': 'Tools & Equipment',
                                'first_name': 'First Name',
                                'last_name': 'Last Name',
                                'phone': 'Phone Number',
                                'email': 'Email Address',
                                'address_line_1': 'Address',
                                'city': 'City',
                                'province': 'Province',
                                'postal_code': 'Postal Code',
                                'work_authorization': 'Work Authorization',
                                'date_of_birth': 'Date of Birth',
                                'employment_status': 'Employment Status',
                                'overall_experience': 'Experience Level',
                                'selected_skills': 'Skills',
                                'work_experiences': 'Work Experience',
                                'selected_languages': 'Languages',
                                'availability_by_month': 'Availability Schedule',
                                // Reference fields
                                'references.reference_name': 'Reference Name',
                                'references.reference_phone': 'Reference Phone',
                                'references.reference_email': 'Reference Email',
                                'references.relationship': 'Relationship with Reference',
                                'references.company_name': 'Reference Company',
                                // Work experience fields
                                'work_experiences.company_name': 'Company Name',
                                'work_experiences.job_title': 'Job Title',
                                'work_experiences.start_date': 'Start Date',
                                'work_experiences.end_date': 'End Date',
                                // Skill fields
                                'selected_skills.id': 'Skill',
                                'selected_skills.proficiency_level': 'Skill Proficiency',
                            };
                            
                            // Remove array indexes like ".0.", ".1.", etc.
                            const cleanFieldName = fieldName.replace(/\.\d+\./g, '.');
                            
                            // Check if we have a label for the clean field name
                            if (fieldLabels[cleanFieldName]) {
                                return fieldLabels[cleanFieldName];
                            }
                            
                            // Check if we have a label for the original field name
                            if (fieldLabels[fieldName]) {
                                return fieldLabels[fieldName];
                            }
                            
                            // For nested fields with indexes, extract the last part and make it readable
                            const lastPart = cleanFieldName.split('.').pop() || cleanFieldName;
                            return lastPart.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        };
                        
                        // Create error list with better formatting
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const errorList: string[] = [];
                        
                        Object.entries(errors || {}).forEach(([key, value]: [string, any]) => {
                            if (key.startsWith('debug_')) {
                                // Format debug info nicely
                                errorList.push(`${String(value)}`);
                            } else if (key === 'form' && isDevelopmentError) {
                                // Show development error prominently
                                errorList.unshift(`🚨 ${value}`);
                            } else if (key !== 'form') {
                                // Convert field names to user-friendly labels
                                const fieldLabel = getFieldLabel(key);
                                errorList.push(`${fieldLabel}: ${String(value)}`);
                            }
                        });
                        
                        setModalType('error');
                        setModalTitle(isDevelopmentError ? 'Development Error' : t('modal.error.title', 'Please fix the highlighted fields'));
                        setModalMessage(isDevelopmentError 
                            ? 'Check console for detailed error information.'
                            : t('modal.error.message', 'There were some issues with your input.')
                        );
                        setModalDetails(errorList.slice(0, 15)); // Show more details in dev mode
                        setModalOpen(true);
                        
                        // Store the first error field for scrolling after modal closes
                        const firstKey = Object.keys(errors).find(key => !key.startsWith('debug_') && key !== 'form') || Object.keys(errors)[0];
                        setFirstErrorField(firstKey || null);
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
            router.post('/employee/onboarding/complete', 
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
                        
                        // Check for 419 Page Expired error (CSRF token expired)
                        const isCsrfError = errors.form === '419 Page Expired' || 
                                           errors.message === '419 Page Expired' ||
                                           (typeof errors.form === 'string' && errors.form.includes('419'));
                        
                        if (isCsrfError) {
                            console.warn('CSRF token expired during completion - reloading page to refresh token');
                            window.location.reload();
                            return;
                        }
                        
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
            globalSkills: skills,
            globalIndustries: industries,
            globalLanguages: languages,
            globalCertifications: certifications,
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
        <>
            <CsrfTokenUpdater />
            <div className="min-h-screen bg-gray-50 px-4 py-4 sm:px-6">
                <Head title={`${t('title', 'Employee Setup')} - ${t('step_of', 'Step :step of :total').replace(':step', String(step)).replace(':total', String(OnboardingSteps.length))}`} />
                
            <FeedbackModal
                isOpen={modalOpen}
                onClose={() => {
                    setModalOpen(false);
                    
                    // Scroll to first error field after modal closes
                    if (modalType === 'error' && firstErrorField) {
                        setTimeout(() => {
                            const el = document.getElementById(firstErrorField);
                            if (el) {
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                scrollToElementSlowly(el as any, 1400);
                            }
                            setFirstErrorField(null);
                        }, 300); // Small delay to ensure modal is closed
                    }
                    
                    if (modalType === 'success') {
                        router.visit('/employee/dashboard');
                    }
                }}
                title={modalTitle}
                message={modalMessage}
                type={modalType}
                details={modalDetails}
                primaryAction={modalType === 'success' ? { label: t('modal.action.dashboard', 'Go to dashboard'), onClick: () => router.visit('/employee/dashboard') } : undefined}
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
        </>
    );
}

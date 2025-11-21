import { Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Play,
    Square,
    Search,
    User,
    ChevronDown,
    ChevronUp,
    Check,
    Shield,
    X,
    Plus,
    Upload,
} from 'lucide-react';
import PublicLayout from '@/layouts/public-layout';

interface TestResult {
    id: number;
    test_id: string;
    category: string;
    feature: string;
    scenario: string;
    steps?: string;
    expected_result: string;
    test_status: 'not_tested' | 'pass' | 'fail' | 'blocked';
    issue_resolved: boolean;
    actual_result?: string;
    notes?: string;
    tested_by?: string;
    tested_at?: string;
}

interface TesterSession {
    id: number;
    tester_name: string;
    session_start: string;
    elapsed_time?: number;
    formatted_elapsed_time?: string;
    tests_completed: number;
    tests_passed: number;
    tests_failed: number;
}

interface Progress {
    total: number;
    tested: number;
    passed: number;
    failed: number;
    blocked: number;
    not_tested: number;
    completion_percentage: number;
    pass_percentage: number;
}

interface Props {
    tests: TestResult[];
    testsByCategory: Record<string, TestResult[]>;
    testsByFeature: Record<string, TestResult[]>;
    progress: Progress;
    activeSession?: TesterSession | null;
    isAdminAuthenticated?: boolean;
}

type TestMode = 'tester' | 'admin';
type TestSection = 'employer' | 'employee' | 'admin' | 'tracking' | 'custom';

export default function UatTesting({
    tests,
    testsByCategory,
    testsByFeature,
    progress,
    activeSession: initialActiveSession,
    isAdminAuthenticated: initialAdminAuth = false,
}: Props) {
    const { t, locale } = useTranslations();
    const isFrench = locale === 'fr';

    const [showSessionModal, setShowSessionModal] = useState(!initialActiveSession);
    const [testMode, setTestMode] = useState<TestMode>('tester');
    const [testerName, setTesterName] = useState('');
    const [defaultSection, setDefaultSection] = useState<TestSection>('employer');
    const [activeSection, setActiveSection] = useState<TestSection>('employer');
    const [activeSession, setActiveSession] = useState<TesterSession | null>(initialActiveSession || null);
    const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
    const [showFailedOnly, setShowFailedOnly] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isStartingSession, setIsStartingSession] = useState(false);
    const [isEndingSession, setIsEndingSession] = useState(false);
    const [updatingTests, setUpdatingTests] = useState<Set<string>>(new Set());
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(initialAdminAuth);
    const [adminEmail, setAdminEmail] = useState('');
    const [adminPassword, setAdminPassword] = useState('');
    const [isAdminLoggingIn, setIsAdminLoggingIn] = useState(false);
    const [adminRecords, setAdminRecords] = useState<any>(null);
    const [isLoadingRecords, setIsLoadingRecords] = useState(false);
    const [customTests, setCustomTests] = useState<any[]>([]);
    const [isLoadingCustomTests, setIsLoadingCustomTests] = useState(false);
    const [customTestForm, setCustomTestForm] = useState({
        section_name: '',
        what_is_tested: '',
        result_or_feedback: '',
        page_url: '',
        screenshots: [] as File[],
    });
    const [screenshotPreviews, setScreenshotPreviews] = useState<string[]>([]);
    const [isSubmittingCustomTest, setIsSubmittingCustomTest] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const sessionStartTimeRef = useRef<Date | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const dropZoneRef = useRef<HTMLDivElement>(null);

    // Get previously used name from localStorage
    useEffect(() => {
        const savedName = localStorage.getItem('uat_tester_name');
        if (savedName) {
            setTesterName(savedName);
        }
        // Check admin auth status and load records if authenticated
        if (initialAdminAuth) {
            setIsAdminAuthenticated(true);
            setShowSessionModal(false);
            loadAdminRecords();
        } else {
            checkAdminAuth();
        }
    }, []);

    // Load custom tests when custom tab is active
    useEffect(() => {
        if (activeSection === 'custom' && testerName) {
            loadCustomTests();
        }
    }, [activeSection, testerName]);

    // Handle clipboard paste for screenshots
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (activeSection !== 'custom') return;
            
            const items = e.clipboardData?.items;
            if (!items) return;

            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                if (item.type.indexOf('image') !== -1) {
                    e.preventDefault();
                    const blob = item.getAsFile();
                    if (blob) {
                        handleScreenshotAdd(blob);
                    }
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [activeSection]);

    // Load custom tests
    const loadCustomTests = async () => {
        if (!testerName.trim()) return;
        
        setIsLoadingCustomTests(true);
        try {
            const response = await fetch(`/uat-testing/custom-tests?tester_name=${encodeURIComponent(testerName)}`, {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data.success) {
                setCustomTests(data.custom_tests || []);
            }
        } catch (error) {
            console.error('Error loading custom tests:', error);
        } finally {
            setIsLoadingCustomTests(false);
        }
    };

    // Handle screenshot file selection
    const handleScreenshotAdd = (file: File | Blob) => {
        const fileObj = file instanceof File ? file : new File([file], `screenshot-${Date.now()}.png`, { type: 'image/png' });
        
        // Validate file
        if (!fileObj.type.match(/^image\/(png|jpg|jpeg|gif|webp)$/)) {
            alert(isFrench ? 'Format de fichier non supporté. Utilisez PNG, JPG, JPEG, GIF ou WEBP.' : 'File format not supported. Use PNG, JPG, JPEG, GIF, or WEBP.');
            return;
        }

        if (fileObj.size > 10 * 1024 * 1024) {
            alert(isFrench ? 'La taille du fichier ne doit pas dépasser 10MB.' : 'File size must not exceed 10MB.');
            return;
        }

        if (customTestForm.screenshots.length >= 10) {
            alert(isFrench ? 'Maximum 10 captures d\'écran autorisées.' : 'Maximum 10 screenshots allowed.');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = e.target?.result as string;
            setScreenshotPreviews((prev) => [...prev, preview]);
            setCustomTestForm((prev) => ({
                ...prev,
                screenshots: [...prev.screenshots, fileObj],
            }));
        };
        reader.readAsDataURL(fileObj);
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => handleScreenshotAdd(file));
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handle drag and drop
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        const files = e.dataTransfer.files;
        if (files) {
            Array.from(files).forEach((file) => handleScreenshotAdd(file));
        }
    };

    // Remove screenshot
    const removeScreenshot = (index: number) => {
        setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index));
        setCustomTestForm((prev) => ({
            ...prev,
            screenshots: prev.screenshots.filter((_, i) => i !== index),
        }));
    };

    // Submit custom test
    const handleSubmitCustomTest = async () => {
        if (!testerName.trim()) {
            alert(isFrench ? 'Veuillez entrer votre nom de testeur' : 'Please enter your tester name');
            return;
        }

        if (!customTestForm.section_name.trim() || !customTestForm.what_is_tested.trim()) {
            alert(isFrench ? 'Veuillez remplir tous les champs requis' : 'Please fill in all required fields');
            return;
        }

        setIsSubmittingCustomTest(true);
        try {
            const formData = new FormData();
            formData.append('tester_name', testerName);
            formData.append('section_name', customTestForm.section_name);
            formData.append('what_is_tested', customTestForm.what_is_tested);
            formData.append('result_or_feedback', customTestForm.result_or_feedback || '');
            formData.append('page_url', customTestForm.page_url || '');
            
            customTestForm.screenshots.forEach((file) => {
                formData.append('screenshots[]', file);
            });

            const response = await fetch('/uat-testing/custom-tests', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: formData,
            });

            const data = await response.json();
            if (data.success) {
                alert(isFrench ? 'Test personnalisé créé avec succès' : 'Custom test created successfully');
                // Clear form
                setCustomTestForm({
                    section_name: '',
                    what_is_tested: '',
                    result_or_feedback: '',
                    page_url: '',
                    screenshots: [],
                });
                setScreenshotPreviews([]);
                // Reload custom tests
                loadCustomTests();
            } else {
                alert(data.message || (isFrench ? 'Erreur lors de la création du test' : 'Error creating test'));
            }
        } catch (error) {
            console.error('Error submitting custom test:', error);
            alert(isFrench ? 'Erreur lors de la soumission' : 'Error submitting');
        } finally {
            setIsSubmittingCustomTest(false);
        }
    };

    // Clear custom test form
    const clearCustomTestForm = () => {
        setCustomTestForm({
            section_name: '',
            what_is_tested: '',
            result_or_feedback: '',
            page_url: '',
            screenshots: [],
        });
        setScreenshotPreviews([]);
    };

    // Delete custom test
    const handleDeleteCustomTest = async (id: number) => {
        if (!confirm(isFrench ? 'Êtes-vous sûr de vouloir supprimer ce test personnalisé?' : 'Are you sure you want to delete this custom test?')) {
            return;
        }

        try {
            const response = await fetch(`/uat-testing/custom-tests/${id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });

            const data = await response.json();
            if (data.success) {
                alert(isFrench ? 'Test personnalisé supprimé avec succès' : 'Custom test deleted successfully');
                loadCustomTests();
            }
        } catch (error) {
            console.error('Error deleting custom test:', error);
            alert(isFrench ? 'Erreur lors de la suppression' : 'Error deleting');
        }
    };

    // Check admin authentication
    const checkAdminAuth = async () => {
        try {
            const response = await fetch('/uat-testing/admin/check-auth', {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data.authenticated) {
                setIsAdminAuthenticated(true);
                setShowSessionModal(false);
                loadAdminRecords();
            }
        } catch (error) {
            console.error('Error checking admin auth:', error);
        }
    };

    // Load admin records
    const loadAdminRecords = async () => {
        setIsLoadingRecords(true);
        try {
            const response = await fetch('/uat-testing/admin/records', {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            const data = await response.json();
            if (data.success) {
                setAdminRecords(data);
            }
        } catch (error) {
            console.error('Error loading admin records:', error);
        } finally {
            setIsLoadingRecords(false);
        }
    };

    // Admin login
    const handleAdminLogin = async () => {
        if (!adminEmail.trim() || !adminPassword.trim()) {
            alert(isFrench ? 'Veuillez entrer l\'email et le mot de passe' : 'Please enter email and password');
            return;
        }

        setIsAdminLoggingIn(true);
        try {
            const response = await fetch('/uat-testing/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    email: adminEmail,
                    password: adminPassword,
                }),
            });

            const data = await response.json();
            if (data.success) {
                setIsAdminAuthenticated(true);
                setShowSessionModal(false);
                setActiveSection('tracking');
                loadAdminRecords();
            } else {
                alert(data.message || (isFrench ? 'Identifiants invalides' : 'Invalid credentials'));
            }
        } catch (error) {
            console.error('Error logging in:', error);
            alert(isFrench ? 'Erreur de connexion' : 'Login error');
        } finally {
            setIsAdminLoggingIn(false);
        }
    };

    // Admin logout
    const handleAdminLogout = async () => {
        try {
            // Clear admin session on server
            await fetch('/uat-testing/admin/logout', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
            });
            setIsAdminAuthenticated(false);
            setAdminRecords(null);
            setActiveSection('employer');
            setShowSessionModal(true);
            setTestMode('tester');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    // Update elapsed time every second if session is active
    useEffect(() => {
        if (activeSession && sessionStartTimeRef.current) {
            intervalRef.current = setInterval(() => {
                const now = new Date();
                const elapsed = Math.floor((now.getTime() - sessionStartTimeRef.current!.getTime()) / 1000);
                setElapsedTime(elapsed);
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [activeSession]);

    // Initialize session start time
    useEffect(() => {
        if (activeSession?.session_start) {
            sessionStartTimeRef.current = new Date(activeSession.session_start);
            const now = new Date();
            const elapsed = Math.floor((now.getTime() - sessionStartTimeRef.current.getTime()) / 1000);
            setElapsedTime(elapsed);
        }
    }, [activeSession?.session_start]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    const startSession = async () => {
        if (!testerName.trim()) {
            alert(isFrench ? 'Veuillez entrer votre nom' : 'Please enter your name');
            return;
        }

        setIsStartingSession(true);
        try {
            const response = await fetch('/uat-testing/session/start', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ tester_name: testerName }),
            });

            const data = await response.json();
            if (data.success) {
                localStorage.setItem('uat_tester_name', testerName);
                setActiveSession({
                    id: data.session.id,
                    tester_name: data.session.tester_name,
                    session_start: data.session.session_start,
                    tests_completed: 0,
                    tests_passed: 0,
                    tests_failed: 0,
                });
                sessionStartTimeRef.current = new Date(data.session.session_start);
                setElapsedTime(0);
                setShowSessionModal(false);
                setActiveSection(defaultSection);
            }
        } catch (error) {
            console.error('Error starting session:', error);
        } finally {
            setIsStartingSession(false);
        }
    };

    const endSession = async () => {
        if (!activeSession) return;

        setIsEndingSession(true);
        try {
            const response = await fetch('/uat-testing/session/end', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({ tester_name: activeSession.tester_name }),
            });

            const data = await response.json();
            if (data.success) {
                setActiveSession(null);
                setElapsedTime(0);
                sessionStartTimeRef.current = null;
            }
        } catch (error) {
            console.error('Error ending session:', error);
        } finally {
            setIsEndingSession(false);
        }
    };

    const updateTestStatus = async (
        testId: string,
        status: 'not_tested' | 'pass' | 'fail' | 'blocked',
        notes?: string,
        actualResult?: string,
        issueResolved?: boolean
    ) => {
        setUpdatingTests((prev) => new Set(prev).add(testId));

        try {
            const response = await fetch('/uat-testing/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    test_id: testId,
                    test_status: status,
                    notes: notes || '',
                    tested_by: testerName || 'Anonymous Tester',
                    actual_result: actualResult || '',
                    issue_resolved: issueResolved || false,
                }),
            });

            const data = await response.json();
            if (data.success) {
                router.reload({ only: ['tests', 'testsByCategory', 'progress', 'activeSession'] });
            }
        } catch (error) {
            console.error('Error updating test:', error);
        } finally {
            setUpdatingTests((prev) => {
                const newSet = new Set(prev);
                newSet.delete(testId);
                return newSet;
            });
        }
    };

    // Filter tests by section
    const getSectionTests = (section: TestSection): TestResult[] => {
        const sectionMap: Record<TestSection, string[]> = {
            employer: [
                'Employer Onboarding',
                'Job Posting',
                'Application Management',
                'Worker Search',
                'Messaging',
                'Reviews',
                'Subscriptions',
                'Dashboard',
                'Profile Management',
                'Payment Management',
            ],
            employee: [
                'Employee Onboarding',
                'Job Search & Applications',
                'Profile Management',
                'Skills Management',
                'Availability Management',
                'Payment Management',
                'Messaging',
                'Reviews',
                'Subscriptions',
                'Dashboard',
            ],
            admin: ['Authentication', 'Dashboard'],
        };

        const sectionCategories = sectionMap[section] || [];
        return tests.filter((test) => sectionCategories.some((cat) => test.category === cat));
    };

    const sectionTests = getSectionTests(activeSection);
    const sectionProgress = {
        total: sectionTests.length,
        tested: sectionTests.filter((t) => t.test_status !== 'not_tested').length,
        passed: sectionTests.filter((t) => t.test_status === 'pass').length,
        failed: sectionTests.filter((t) => t.test_status === 'fail').length,
        blocked: sectionTests.filter((t) => t.test_status === 'blocked').length,
    };

    // Filter by failed only if enabled
    const filteredSectionTests = showFailedOnly
        ? sectionTests.filter((t) => t.test_status === 'fail')
        : sectionTests;

    // Group by category
    const sectionTestsByCategory = filteredSectionTests.reduce((acc, test) => {
        if (!acc[test.category]) {
            acc[test.category] = [];
        }
        acc[test.category].push(test);
        return acc;
    }, {} as Record<string, TestResult[]>);

    const expandAll = () => {
        const allExpanded: Record<string, boolean> = {};
        Object.keys(sectionTestsByCategory).forEach((cat) => {
            allExpanded[cat] = true;
        });
        setExpandedCategories(allExpanded);
    };

    const collapseAll = () => {
        setExpandedCategories({});
    };

    const getCategoryProgress = (category: string) => {
        const categoryTests = sectionTestsByCategory[category] || [];
        const tested = categoryTests.filter((t) => t.test_status !== 'not_tested').length;
        const passed = categoryTests.filter((t) => t.test_status === 'pass').length;
        return { total: categoryTests.length, tested, passed };
    };

    return (
        <PublicLayout title={isFrench ? 'Portail de Tests UAT' : 'UAT Testing Portal'}>
            <Head title={isFrench ? 'Portail de Tests UAT' : 'UAT Testing Portal'} />

            {/* Session Start Modal */}
            {showSessionModal && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 p-4"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        backdropFilter: 'blur(4px)',
                    }}
                >
                    <div
                        className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8">
                            {/* Mode Selection */}
                            <div className="flex gap-2 mb-6">
                                <button
                                    onClick={() => setTestMode('tester')}
                                    className={`flex-1 px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
                                        testMode === 'tester'
                                            ? 'text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                    style={
                                        testMode === 'tester'
                                            ? { backgroundColor: '#192341' }
                                            : {}
                                    }
                                >
                                    {isFrench ? 'Mode Testeur' : 'Tester Mode'}
                                </button>
                                <button
                                    onClick={() => setTestMode('admin')}
                                    className={`flex-1 px-4 py-2 rounded-full font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                                        testMode === 'admin'
                                            ? 'text-white'
                                            : 'bg-gray-100 text-gray-700'
                                    }`}
                                    style={
                                        testMode === 'admin'
                                            ? { backgroundColor: '#192341' }
                                            : {}
                                    }
                                >
                                    {isFrench ? 'Mode Admin' : 'Admin Mode'}
                                    {testMode === 'admin' && <Shield className="w-4 h-4" />}
                                </button>
                            </div>

                            {/* User Icon */}
                            <div className="flex justify-center mb-6">
                                <div
                                    className="w-24 h-24 rounded-full flex items-center justify-center"
                                    style={{ backgroundColor: testMode === 'admin' ? '#F97316' : '#192341' }}
                                >
                                    {testMode === 'admin' ? (
                                        <Shield className="w-12 h-12 text-white" />
                                    ) : (
                                        <User className="w-12 h-12 text-white" />
                                    )}
                                </div>
                            </div>

                            {testMode === 'admin' ? (
                                <>
                                    {/* Admin Login Form */}
                                    <h2
                                        className="text-2xl font-bold text-center mb-2"
                                        style={{ color: '#192341' }}
                                    >
                                        {isFrench ? 'Accès Admin' : 'Admin Access'}
                                    </h2>
                                    <p className="text-sm text-gray-600 text-center mb-6">
                                        {isFrench
                                            ? 'Connectez-vous pour voir les résultats des tests sans suivi de session'
                                            : 'Login to view test results without session tracking'}
                                    </p>

                                    <div className="mb-4">
                                        <Label className="mb-2 block" style={{ color: '#192341' }}>
                                            {isFrench ? 'Email Admin' : 'Admin Email'} *
                                        </Label>
                                        <Input
                                            type="email"
                                            value={adminEmail}
                                            onChange={(e) => setAdminEmail(e.target.value)}
                                            placeholder="admin@skilloncall.ca"
                                            className="w-full"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <Label className="mb-2 block" style={{ color: '#192341' }}>
                                            {isFrench ? 'Mot de Passe' : 'Password'} *
                                        </Label>
                                        <Input
                                            type="password"
                                            value={adminPassword}
                                            onChange={(e) => setAdminPassword(e.target.value)}
                                            placeholder={isFrench ? 'Entrez votre mot de passe' : 'Enter your password'}
                                            className="w-full"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleAdminLogin();
                                                }
                                            }}
                                        />
                                    </div>

                                    <Button
                                        onClick={handleAdminLogin}
                                        disabled={!adminEmail.trim() || !adminPassword.trim() || isAdminLoggingIn}
                                        className="w-full text-white hover:opacity-90 cursor-pointer"
                                        style={{ backgroundColor: '#192341', height: '2.7em' }}
                                    >
                                        <Shield className="w-4 h-4 mr-2" />
                                        {isAdminLoggingIn
                                            ? isFrench
                                                ? 'Connexion...'
                                                : 'Logging in...'
                                            : isFrench
                                            ? 'Se Connecter en Admin'
                                            : 'Login as Admin'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {/* Tester Mode Form */}
                                    <h2
                                        className="text-2xl font-bold text-center mb-2"
                                        style={{ color: '#192341' }}
                                    >
                                        {isFrench
                                            ? 'Bienvenue au Portail de Tests UAT'
                                            : 'Welcome to UAT Testing Portal'}
                                    </h2>
                                    <p className="text-sm text-gray-600 text-center mb-6">
                                        {isFrench
                                            ? 'Veuillez confirmer votre nom pour commencer à suivre votre session de test'
                                            : 'Please confirm your name to start tracking your testing session'}
                                    </p>

                                    {/* Name Input */}
                                    <div className="mb-6">
                                        <Label className="mb-2 block" style={{ color: '#192341' }}>
                                            {isFrench ? 'Votre Nom' : 'Your Name'} *
                                        </Label>
                                        <Input
                                            type="text"
                                            value={testerName}
                                            onChange={(e) => setTesterName(e.target.value)}
                                            placeholder={isFrench ? 'Entrez votre nom' : 'Enter your name'}
                                            className="w-full"
                                        />
                                    </div>

                                    {/* Start Session Button */}
                                    <Button
                                        onClick={startSession}
                                        disabled={!testerName.trim() || isStartingSession}
                                        className="w-full text-white hover:opacity-90 cursor-pointer mb-6"
                                        style={{ backgroundColor: '#192341', height: '2.7em' }}
                                    >
                                        <Play className="w-4 h-4 mr-2" />
                                        {isStartingSession
                                            ? isFrench
                                                ? 'Démarrage...'
                                                : 'Starting...'
                                            : isFrench
                                            ? 'Démarrer la Session'
                                            : 'Start Session'}
                                    </Button>

                                    {/* Default Section Selection */}
                                    <div>
                                        <Label className="mb-3 block" style={{ color: '#192341' }}>
                                            {isFrench ? 'Section par Défaut:' : 'Default Section:'}
                                        </Label>
                                        <RadioGroup
                                            value={defaultSection}
                                            onValueChange={(value) => setDefaultSection(value as TestSection)}
                                        >
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="employer" id="employer" />
                                                    <Label htmlFor="employer" className="cursor-pointer">
                                                        {isFrench ? 'Employeur' : 'Employer'}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="employee" id="employee" />
                                                    <Label htmlFor="employee" className="cursor-pointer">
                                                        {isFrench ? 'Employé' : 'Employee'}
                                                    </Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="admin" id="admin" />
                                                    <Label htmlFor="admin" className="cursor-pointer">
                                                        {isFrench ? 'Admin' : 'Admin'}
                                                    </Label>
                                                </div>
                                            </div>
                                        </RadioGroup>
                                    </div>
                                </>
                            )}

                            {/* Previously Used Name */}
                            {localStorage.getItem('uat_tester_name') && (
                                <p className="text-xs text-gray-500 text-center mt-4">
                                    {isFrench ? 'Précédemment utilisé:' : 'Previously used:'}{' '}
                                    {localStorage.getItem('uat_tester_name')}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="min-h-screen" style={{ backgroundColor: '#F6FBFD' }}>
                {/* Session Timer Bar */}
                {activeSession && (
                    <div
                        className="w-full py-3 px-4 flex items-center justify-between"
                        style={{ backgroundColor: '#192341' }}
                    >
                        <div className="flex items-center gap-4 text-white">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span className="font-mono text-sm">
                                    {isFrench ? 'Minuteur de Session:' : 'Session Timer:'} {formatTime(elapsedTime)}
                                </span>
                            </div>
                            <span className="text-sm">
                                {isFrench ? 'Démarré:' : 'Started:'} {formatDateTime(activeSession.session_start)}
                            </span>
                        </div>
                        <Button
                            onClick={endSession}
                            disabled={isEndingSession}
                            variant="destructive"
                            size="sm"
                            className="cursor-pointer"
                        >
                            <Square className="w-4 h-4 mr-2" />
                            {isFrench ? 'Terminer la Session' : 'End Session'}
                        </Button>
                    </div>
                )}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Page Title */}
                    <div className="mb-6">
                        <h1
                            className="text-2xl md:text-3xl font-bold leading-tight mb-2"
                            style={{ color: '#192341' }}
                        >
                            {isFrench ? 'Portail de Tests UAT' : 'UAT Testing Portal'} :
                        </h1>
                        <p className="text-gray-600">
                            {isFrench
                                ? 'Test et documentation systématique de tous les types d\'utilisateurs dans la plateforme'
                                : 'Systematic testing and documentation of all user types in the platform'}
                        </p>
                    </div>

                    {/* Tester Name Input (when session active) or Admin Logout */}
                    <div className="mb-4 flex items-center justify-between gap-4">
                        {activeSession && (
                            <div className="flex items-center gap-2">
                                <Label style={{ color: '#192341' }}>
                                    {isFrench ? 'Testeur:' : 'Tester:'}
                                </Label>
                                <Input
                                    type="text"
                                    value={testerName}
                                    onChange={(e) => setTesterName(e.target.value)}
                                    className="w-48"
                                />
                                <Button
                                    size="sm"
                                    onClick={() => localStorage.setItem('uat_tester_name', testerName)}
                                    className="cursor-pointer"
                                    style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                >
                                    {isFrench ? 'Enregistrer' : 'Save'}
                                </Button>
                            </div>
                        )}
                        {isAdminAuthenticated && (
                            <Button
                                size="sm"
                                onClick={handleAdminLogout}
                                variant="outline"
                                className="cursor-pointer"
                                style={{ height: '2.7em' }}
                            >
                                <X className="w-4 h-4 mr-2" />
                                {isFrench ? 'Déconnexion Admin' : 'Admin Logout'}
                            </Button>
                        )}
                    </div>

                    {/* Progress Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center border">
                            <div className="text-xl font-bold" style={{ color: '#192341' }}>
                                {sectionProgress.total}
                            </div>
                            <div className="text-sm text-gray-600">
                                {isFrench ? 'Total' : 'Total'}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center border">
                            <div className="text-xl font-bold text-blue-600">{sectionProgress.tested}</div>
                            <div className="text-sm text-gray-600">
                                {isFrench ? 'Testé' : 'Tested'}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center border">
                            <div className="text-xl font-bold text-green-600">{sectionProgress.passed}</div>
                            <div className="text-sm text-gray-600">
                                {isFrench ? 'Réussi' : 'Passed'}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center border">
                            <div className="text-xl font-bold text-red-600">{sectionProgress.failed}</div>
                            <div className="text-sm text-gray-600">
                                {isFrench ? 'Échoué' : 'Failed'}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center border">
                            <div
                                className="text-xl font-bold"
                                style={{ color: '#10B3D6' }}
                            >
                                {sectionProgress.total > 0
                                    ? Math.round((sectionProgress.tested / sectionProgress.total) * 100)
                                    : 0}
                                %
                            </div>
                            <div className="text-sm text-gray-600">
                                {isFrench ? 'Progrès' : 'Progress'}
                            </div>
                        </div>
                    </div>

                    {/* Section Tabs - More Prominent */}
                    <div className="mb-8">
                        <Tabs value={activeSection} onValueChange={(value) => setActiveSection(value as TestSection)}>
                            <TabsList 
                                className={`grid w-full h-auto p-2 gap-3 bg-transparent border-0 shadow-none ${
                                    isAdminAuthenticated ? 'grid-cols-5' : 'grid-cols-4'
                                }`}
                            >
                                <TabsTrigger
                                    value="employer"
                                    className="cursor-pointer text-base font-bold py-3 px-6 rounded-xl transition-all border-2 relative"
                                    style={
                                        activeSection === 'employer'
                                            ? { 
                                                backgroundColor: '#192341', 
                                                color: 'white',
                                                borderColor: '#192341',
                                                boxShadow: '0 8px 16px rgba(25, 35, 65, 0.3)',
                                                transform: 'translateY(-3px)',
                                                zIndex: 10
                                            }
                                            : { 
                                                backgroundColor: 'white',
                                                color: '#192341',
                                                borderColor: '#E5E7EB',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }
                                    }
                                >
                                    {isFrench ? 'Employeur' : 'Employer'}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="employee"
                                    className="cursor-pointer text-base font-bold py-3 px-6 rounded-xl transition-all border-2 relative"
                                    style={
                                        activeSection === 'employee'
                                            ? { 
                                                backgroundColor: '#192341', 
                                                color: 'white',
                                                borderColor: '#192341',
                                                boxShadow: '0 8px 16px rgba(25, 35, 65, 0.3)',
                                                transform: 'translateY(-3px)',
                                                zIndex: 10
                                            }
                                            : { 
                                                backgroundColor: 'white',
                                                color: '#192341',
                                                borderColor: '#E5E7EB',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }
                                    }
                                >
                                    {isFrench ? 'Employé' : 'Employee'}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="admin"
                                    className="cursor-pointer text-base font-bold py-3 px-6 rounded-xl transition-all border-2 relative"
                                    style={
                                        activeSection === 'admin'
                                            ? { 
                                                backgroundColor: '#192341', 
                                                color: 'white',
                                                borderColor: '#192341',
                                                boxShadow: '0 8px 16px rgba(25, 35, 65, 0.3)',
                                                transform: 'translateY(-3px)',
                                                zIndex: 10
                                            }
                                            : { 
                                                backgroundColor: 'white',
                                                color: '#192341',
                                                borderColor: '#E5E7EB',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }
                                    }
                                >
                                    {isFrench ? 'Admin' : 'Admin'}
                                </TabsTrigger>
                                {isAdminAuthenticated && (
                                    <TabsTrigger
                                        value="tracking"
                                        className="cursor-pointer text-base font-bold py-3 px-6 rounded-xl transition-all border-2 relative"
                                        style={
                                            activeSection === 'tracking'
                                                ? { 
                                                    backgroundColor: '#192341', 
                                                    color: 'white',
                                                    borderColor: '#192341',
                                                    boxShadow: '0 8px 16px rgba(25, 35, 65, 0.3)',
                                                    transform: 'translateY(-3px)',
                                                    zIndex: 10
                                                }
                                                : { 
                                                    backgroundColor: 'white',
                                                    color: '#192341',
                                                    borderColor: '#E5E7EB',
                                                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                                }
                                        }
                                    >
                                        {isFrench ? 'Suivi' : 'Tracking'}
                                    </TabsTrigger>
                                )}
                                <TabsTrigger
                                    value="custom"
                                    className="cursor-pointer text-base font-bold py-3 px-6 rounded-xl transition-all border-2 relative"
                                    style={
                                        activeSection === 'custom'
                                            ? { 
                                                backgroundColor: '#192341', 
                                                color: 'white',
                                                borderColor: '#192341',
                                                boxShadow: '0 8px 16px rgba(25, 35, 65, 0.3)',
                                                transform: 'translateY(-3px)',
                                                zIndex: 10
                                            }
                                            : { 
                                                backgroundColor: 'white',
                                                color: '#192341',
                                                borderColor: '#E5E7EB',
                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                                            }
                                    }
                                >
                                    {isFrench ? 'Personnalisé' : 'Custom'}
                                </TabsTrigger>
                            </TabsList>

                            {/* Section Content */}
                            <TabsContent value={activeSection} className="mt-6">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle style={{ color: '#192341' }}>
                                                {activeSection === 'employer'
                                                    ? isFrench
                                                        ? 'Section de Test du Flux Employeur'
                                                        : 'Employer Flow Testing Section'
                                                    : activeSection === 'employee'
                                                    ? isFrench
                                                        ? 'Section de Test du Flux Employé'
                                                        : 'Employee Flow Testing Section'
                                                    : isFrench
                                                    ? 'Section de Test Admin'
                                                    : 'Admin Testing Section'}
                                            </CardTitle>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {activeSection === 'employer'
                                                    ? isFrench
                                                        ? 'Tester toutes les fonctionnalités liées aux employeurs de l\'enregistrement à la publication et à la gestion des emplois'
                                                        : 'Test all employer-related features from registration through job posting and management'
                                                    : activeSection === 'employee'
                                                    ? isFrench
                                                        ? 'Tester toutes les fonctionnalités liées aux employés de l\'enregistrement à la recherche d\'emploi'
                                                        : 'Test all employee-related features from registration through job search'
                                                    : isFrench
                                                    ? 'Tester toutes les fonctionnalités administratives'
                                                    : 'Test all admin-related features'}
                                            </p>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {/* Filters */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="show-failed"
                                                checked={showFailedOnly}
                                                onCheckedChange={(checked) =>
                                                    setShowFailedOnly(checked === true)
                                                }
                                            />
                                            <Label
                                                htmlFor="show-failed"
                                                className="cursor-pointer"
                                            >
                                                {isFrench ? 'Afficher uniquement les échecs' : 'Show Failed Only'}
                                            </Label>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={expandAll}
                                                className="cursor-pointer"
                                            >
                                                {isFrench ? 'Tout Développer' : 'Expand All'}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={collapseAll}
                                                className="cursor-pointer"
                                            >
                                                {isFrench ? 'Tout Réduire' : 'Collapse All'}
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Test Categories */}
                                    <div className="space-y-4">
                                        {Object.entries(sectionTestsByCategory).map(([category, categoryTests], index) => {
                                            const catProgress = getCategoryProgress(category);
                                            return (
                                                <Card key={category}>
                                                    <CardHeader>
                                                        <button
                                                            onClick={() =>
                                                                setExpandedCategories((prev) => ({
                                                                    ...prev,
                                                                    [category]: !prev[category],
                                                                }))
                                                            }
                                                            className="flex items-center justify-between w-full text-left cursor-pointer"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <div
                                                                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                                                                    style={{ backgroundColor: '#192341' }}
                                                                >
                                                                    {index + 1}
                                                                </div>
                                                                <div>
                                                                    <CardTitle style={{ color: '#192341' }}>
                                                                        {category}
                                                                    </CardTitle>
                                                                    <p className="text-sm text-gray-600 mt-1">
                                                                        {catProgress.tested} / {catProgress.total}{' '}
                                                                        {isFrench ? 'testé' : 'tested'} {catProgress.passed}{' '}
                                                                        {isFrench ? 'réussi' : 'passed'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            {expandedCategories[category] ? (
                                                                <ChevronUp className="w-5 h-5" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                    </CardHeader>
                                                    {expandedCategories[category] && (
                                                        <CardContent>
                                                            <div className="space-y-4">
                                                                {categoryTests.map((test) => (
                                                                    <TestCard
                                                                        key={test.id}
                                                                        test={test}
                                                                        onStatusChange={updateTestStatus}
                                                                        isUpdating={updatingTests.has(test.test_id)}
                                                                        isFrench={isFrench}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </CardContent>
                                                    )}
                                                </Card>
                                            );
                                        })}
                                    </div>

                                    {Object.keys(sectionTestsByCategory).length === 0 && (
                                        <div className="text-center text-gray-500 py-8">
                                            {isFrench
                                                ? 'Aucun test trouvé pour cette section'
                                                : 'No tests found for this section'}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                            </TabsContent>

                            {/* Tracking Tab - Admin Only */}
                            {isAdminAuthenticated && (
                                <TabsContent value="tracking" className="mt-6">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle style={{ color: '#192341' }}>
                                                        {isFrench ? 'Suivi et Enregistrements' : 'Tracking & Records'}
                                                    </CardTitle>
                                                    <p className="text-sm text-gray-600 mt-1">
                                                        {isFrench
                                                            ? 'Voir toutes les sessions de test et les tâches complétées par les testeurs'
                                                            : 'View all testing sessions and tasks completed by testers'}
                                                    </p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={loadAdminRecords}
                                                    disabled={isLoadingRecords}
                                                    variant="outline"
                                                    className="cursor-pointer"
                                                >
                                                    <Search className="w-4 h-4 mr-2" />
                                                    {isLoadingRecords
                                                        ? isFrench
                                                            ? 'Chargement...'
                                                            : 'Loading...'
                                                        : isFrench
                                                        ? 'Actualiser'
                                                        : 'Refresh'}
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            {isLoadingRecords ? (
                                                <div className="text-center py-8">
                                                    <div className="text-gray-500">
                                                        {isFrench ? 'Chargement...' : 'Loading...'}
                                                    </div>
                                                </div>
                                            ) : adminRecords ? (
                                                <div className="space-y-6">
                                                    {/* Sessions Summary */}
                                                    <div>
                                                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#192341' }}>
                                                            {isFrench ? 'Résumé des Sessions' : 'Sessions Summary'}
                                                        </h3>
                                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                                            <div className="bg-white rounded-lg p-4 border text-center">
                                                                <div className="text-2xl font-bold" style={{ color: '#192341' }}>
                                                                    {adminRecords.total_sessions || 0}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {isFrench ? 'Sessions Totales' : 'Total Sessions'}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-4 border text-center">
                                                                <div className="text-2xl font-bold text-blue-600">
                                                                    {adminRecords.sessions?.filter((s: any) => s.is_active).length || 0}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {isFrench ? 'Sessions Actives' : 'Active Sessions'}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-4 border text-center">
                                                                <div className="text-2xl font-bold text-green-600">
                                                                    {adminRecords.sessions?.reduce((sum: number, s: any) => sum + (s.tests_passed || 0), 0) || 0}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {isFrench ? 'Tests Réussis' : 'Tests Passed'}
                                                                </div>
                                                            </div>
                                                            <div className="bg-white rounded-lg p-4 border text-center">
                                                                <div className="text-2xl font-bold text-red-600">
                                                                    {adminRecords.sessions?.reduce((sum: number, s: any) => sum + (s.tests_failed || 0), 0) || 0}
                                                                </div>
                                                                <div className="text-sm text-gray-600">
                                                                    {isFrench ? 'Tests Échoués' : 'Tests Failed'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Sessions List */}
                                                        <div className="space-y-4">
                                                            <h4 className="font-semibold" style={{ color: '#192341' }}>
                                                                {isFrench ? 'Toutes les Sessions' : 'All Sessions'}
                                                            </h4>
                                                            {adminRecords.sessions && adminRecords.sessions.length > 0 ? (
                                                                <div className="space-y-3">
                                                                    {adminRecords.sessions.map((session: any) => (
                                                                        <Card key={session.id}>
                                                                            <CardContent className="pt-6">
                                                                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                                                    <div>
                                                                                        <div className="font-semibold mb-1" style={{ color: '#192341' }}>
                                                                                            {session.tester_name}
                                                                                        </div>
                                                                                        <div className="text-sm text-gray-600">
                                                                                            {isFrench ? 'Démarré:' : 'Started:'}{' '}
                                                                                            {new Date(session.session_start).toLocaleString()}
                                                                                            {session.session_end && (
                                                                                                <>
                                                                                                    <br />
                                                                                                    {isFrench ? 'Terminé:' : 'Ended:'}{' '}
                                                                                                    {new Date(session.session_end).toLocaleString()}
                                                                                                </>
                                                                                            )}
                                                                                        </div>
                                                                                        {session.is_active && (
                                                                                            <Badge className="bg-green-100 text-green-800 mt-2">
                                                                                                {isFrench ? 'Actif' : 'Active'}
                                                                                            </Badge>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex gap-4 text-sm">
                                                                                        <div>
                                                                                            <div className="font-semibold" style={{ color: '#192341' }}>
                                                                                                {session.tests_completed}
                                                                                            </div>
                                                                                            <div className="text-gray-600">
                                                                                                {isFrench ? 'Complétés' : 'Completed'}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="font-semibold text-green-600">
                                                                                                {session.tests_passed}
                                                                                            </div>
                                                                                            <div className="text-gray-600">
                                                                                                {isFrench ? 'Réussis' : 'Passed'}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="font-semibold text-red-600">
                                                                                                {session.tests_failed}
                                                                                            </div>
                                                                                            <div className="text-gray-600">
                                                                                                {isFrench ? 'Échoués' : 'Failed'}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div>
                                                                                            <div className="font-semibold" style={{ color: '#10B3D6' }}>
                                                                                                {session.formatted_time || '00:00:00'}
                                                                                            </div>
                                                                                            <div className="text-gray-600">
                                                                                                {isFrench ? 'Durée' : 'Duration'}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>
                                                                    ))}
                                                                </div>
                                                            ) : (
                                                                <div className="text-center text-gray-500 py-8">
                                                                    {isFrench ? 'Aucune session trouvée' : 'No sessions found'}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Test Results */}
                                                    <div className="mt-8">
                                                        <h3 className="text-lg font-semibold mb-4" style={{ color: '#192341' }}>
                                                            {isFrench ? 'Résultats des Tests' : 'Test Results'}
                                                        </h3>
                                                        {adminRecords.test_results && adminRecords.test_results.length > 0 ? (
                                                            <div className="space-y-3">
                                                                {adminRecords.test_results.map((test: any) => (
                                                                    <Card key={test.id}>
                                                                        <CardContent className="pt-6">
                                                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <span className="font-semibold" style={{ color: '#192341' }}>
                                                                                            {test.test_id}
                                                                                        </span>
                                                                                        <Badge
                                                                                            className={
                                                                                                test.test_status === 'pass'
                                                                                                    ? 'bg-green-100 text-green-800'
                                                                                                    : test.test_status === 'fail'
                                                                                                    ? 'bg-red-100 text-red-800'
                                                                                                    : 'bg-gray-100 text-gray-800'
                                                                                            }
                                                                                        >
                                                                                            {test.test_status === 'pass'
                                                                                                ? isFrench
                                                                                                    ? 'Réussi'
                                                                                                    : 'Pass'
                                                                                                : test.test_status === 'fail'
                                                                                                ? isFrench
                                                                                                    ? 'Échoué'
                                                                                                    : 'Fail'
                                                                                                : isFrench
                                                                                                ? 'Non Testé'
                                                                                                : 'Not Tested'}
                                                                                        </Badge>
                                                                                        {test.issue_resolved && (
                                                                                            <Badge className="bg-green-100 text-green-800">
                                                                                                <Check className="w-3 h-3 mr-1" />
                                                                                                {isFrench ? 'Résolu' : 'Resolved'}
                                                                                            </Badge>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="text-sm font-medium mb-1" style={{ color: '#192341' }}>
                                                                                        {test.scenario}
                                                                                    </div>
                                                                                    <div className="text-xs text-gray-600">
                                                                                        {test.category} - {test.feature}
                                                                                    </div>
                                                                                </div>
                                                                                <div className="text-sm text-gray-600">
                                                                                    <div>
                                                                                        {isFrench ? 'Testé par:' : 'Tested by:'} {test.tested_by}
                                                                                    </div>
                                                                                    <div>
                                                                                        {test.tested_at &&
                                                                                            new Date(test.tested_at).toLocaleString()}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </CardContent>
                                                                    </Card>
                                                                ))}
                                                            </div>
                                                        ) : (
                                                            <div className="text-center text-gray-500 py-8">
                                                                {isFrench ? 'Aucun résultat de test trouvé' : 'No test results found'}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-8">
                                                    <Button
                                                        onClick={loadAdminRecords}
                                                        className="cursor-pointer"
                                                        style={{ backgroundColor: '#10B3D6', height: '2.7em' }}
                                                    >
                                                        {isFrench ? 'Charger les Enregistrements' : 'Load Records'}
                                                    </Button>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            )}

                            {/* Custom Tests Tab */}
                            <TabsContent value="custom" className="mt-6">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <CardTitle style={{ color: '#192341' }}>
                                                    {isFrench ? 'Tests Personnalisés' : 'Custom Test Entries'}
                                                </CardTitle>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {isFrench
                                                        ? 'Créez des tests personnalisés avec des captures d\'écran et des commentaires'
                                                        : 'Create custom tests with screenshots and feedback'}
                                                </p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={clearCustomTestForm}
                                                variant="outline"
                                                className="cursor-pointer"
                                                style={{ backgroundColor: '#10B3D6', color: 'white', height: '2.7em' }}
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                {isFrench ? 'Nouvelle Entrée' : '+ Add New Entry'}
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Custom Test Form */}
                                        <div className="space-y-6 mb-8">
                                            <div className="bg-white rounded-lg border p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-semibold" style={{ color: '#192341' }}>
                                                        {isFrench ? 'Nouvelle Entrée de Test Personnalisé' : 'Custom Test Entry'}
                                                    </h3>
                                                </div>

                                                <div className="space-y-4">
                                                    {/* Section Name */}
                                                    <div>
                                                        <Label className="mb-2 block" style={{ color: '#192341' }}>
                                                            {isFrench ? 'Nom de la Section' : 'Section Name'} *
                                                        </Label>
                                                        <Input
                                                            type="text"
                                                            value={customTestForm.section_name}
                                                            onChange={(e) =>
                                                                setCustomTestForm((prev) => ({
                                                                    ...prev,
                                                                    section_name: e.target.value,
                                                                }))
                                                            }
                                                            placeholder={isFrench ? 'ex: Intégration de Paiement' : 'e.g., Payment Integration'}
                                                            className="w-full"
                                                        />
                                                    </div>

                                                    {/* What is Tested */}
                                                    <div>
                                                        <Label className="mb-2 block" style={{ color: '#192341' }}>
                                                            {isFrench ? 'Ce qui est Testé' : 'What is Tested'} *
                                                        </Label>
                                                        <Textarea
                                                            value={customTestForm.what_is_tested}
                                                            onChange={(e) =>
                                                                setCustomTestForm((prev) => ({
                                                                    ...prev,
                                                                    what_is_tested: e.target.value,
                                                                }))
                                                            }
                                                            placeholder={isFrench ? 'Décrivez ce que vous testez...' : 'Describe what you are testing...'}
                                                            className="w-full min-h-[100px]"
                                                            rows={4}
                                                        />
                                                    </div>

                                                    {/* Result or Feedback */}
                                                    <div>
                                                        <Label className="mb-2 block" style={{ color: '#192341' }}>
                                                            {isFrench ? 'Résultat ou Commentaires' : 'Result or Feedback'}
                                                        </Label>
                                                        <Textarea
                                                            value={customTestForm.result_or_feedback}
                                                            onChange={(e) =>
                                                                setCustomTestForm((prev) => ({
                                                                    ...prev,
                                                                    result_or_feedback: e.target.value,
                                                                }))
                                                            }
                                                            placeholder={isFrench ? 'Ajoutez les résultats du test, commentaires ou observations...' : 'Add test results, feedback, or observations...'}
                                                            className="w-full min-h-[100px]"
                                                            rows={4}
                                                        />
                                                    </div>

                                                    {/* Page URL */}
                                                    <div>
                                                        <Label className="mb-2 block" style={{ color: '#192341' }}>
                                                            {isFrench ? 'URL de la Page' : 'Page URL'}
                                                        </Label>
                                                        <Input
                                                            type="url"
                                                            value={customTestForm.page_url}
                                                            onChange={(e) =>
                                                                setCustomTestForm((prev) => ({
                                                                    ...prev,
                                                                    page_url: e.target.value,
                                                                }))
                                                            }
                                                            placeholder="https://example.com/page-link (optional)"
                                                            className="w-full"
                                                        />
                                                    </div>

                                                    {/* Screenshots Upload */}
                                                    <div>
                                                        <Label className="mb-2 block" style={{ color: '#192341' }}>
                                                            {isFrench ? 'Captures d\'écran / Images' : 'Screenshots / Pictures'}
                                                        </Label>
                                                        <div
                                                            ref={dropZoneRef}
                                                            onDragOver={handleDragOver}
                                                            onDrop={handleDrop}
                                                            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                                                            onClick={() => fileInputRef.current?.click()}
                                                        >
                                                            <input
                                                                ref={fileInputRef}
                                                                type="file"
                                                                multiple
                                                                accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                                                                onChange={handleFileInputChange}
                                                                className="hidden"
                                                            />
                                                            <div className="flex flex-col items-center gap-2">
                                                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                                                                    <Upload className="w-6 h-6 text-gray-400" />
                                                                </div>
                                                                <p className="font-medium" style={{ color: '#192341' }}>
                                                                    {isFrench ? 'Ajouter des Captures d\'écran ou Images' : 'Add Screenshots or Pictures'}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {isFrench
                                                                        ? 'Astuce: Appuyez sur Ctrl+V pour coller des captures d\'écran depuis le presse-papiers'
                                                                        : 'Tip: Press Ctrl+V to paste screenshots from clipboard'}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-2">
                                                                    {isFrench
                                                                        ? 'Glissez-déposez des images ici ou utilisez Ctrl+V pour coller'
                                                                        : 'Drag and drop images here or use Ctrl+V to paste'}
                                                                </p>
                                                                <p className="text-xs text-gray-400">
                                                                    {isFrench
                                                                        ? 'Formats supportés: PNG, JPG, JPEG, GIF, WEBP (jusqu\'à 10MB chacun)'
                                                                        : 'Supports: PNG, JPG, JPEG, GIF, WEBP (up to 10MB each)'}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        {/* Screenshot Previews */}
                                                        {screenshotPreviews.length > 0 && (
                                                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {screenshotPreviews.map((preview, index) => (
                                                                    <div key={index} className="relative group">
                                                                        <img
                                                                            src={preview}
                                                                            alt={`Screenshot ${index + 1}`}
                                                                            className="w-full h-32 object-cover rounded-lg border"
                                                                        />
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                removeScreenshot(index);
                                                                            }}
                                                                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                                        >
                                                                            <X className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {customTestForm.screenshots.length > 0 && (
                                                            <p className="text-xs text-gray-500 mt-2">
                                                                {customTestForm.screenshots.length} / 10{' '}
                                                                {isFrench ? 'images ajoutées' : 'images added'}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex gap-3 pt-4">
                                                        <Button
                                                            onClick={handleSubmitCustomTest}
                                                            disabled={isSubmittingCustomTest || !customTestForm.section_name.trim() || !customTestForm.what_is_tested.trim()}
                                                            className="cursor-pointer flex-1"
                                                            style={{ backgroundColor: '#192341', color: 'white', height: '2.7em' }}
                                                        >
                                                            {isSubmittingCustomTest
                                                                ? isFrench
                                                                    ? 'Envoi...'
                                                                    : 'Submitting...'
                                                                : isFrench
                                                                ? 'Soumettre le Test Personnalisé'
                                                                : 'Submit Custom Test'}
                                                        </Button>
                                                        <Button
                                                            onClick={clearCustomTestForm}
                                                            variant="outline"
                                                            className="cursor-pointer"
                                                            style={{ height: '2.7em' }}
                                                        >
                                                            {isFrench ? 'Effacer le Formulaire' : 'Clear Form'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submitted Custom Tests */}
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold mb-4" style={{ color: '#192341' }}>
                                                {isFrench ? 'Vos Tests Personnalisés Soumis' : 'Your Submitted Custom Tests'}
                                            </h3>
                                            {isLoadingCustomTests ? (
                                                <div className="text-center py-8">
                                                    <div className="text-gray-500">
                                                        {isFrench ? 'Chargement...' : 'Loading...'}
                                                    </div>
                                                </div>
                                            ) : customTests.length > 0 ? (
                                                <div className="space-y-4">
                                                    {customTests.map((test: any) => (
                                                        <Card key={test.id}>
                                                            <CardContent className="pt-6">
                                                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                                                    <div className="flex-1">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <h4 className="font-semibold" style={{ color: '#192341' }}>
                                                                                {test.section_name}
                                                                            </h4>
                                                                            <Badge variant="outline">
                                                                                {new Date(test.created_at).toLocaleDateString()}
                                                                            </Badge>
                                                                        </div>
                                                                        <div className="mb-2">
                                                                            <p className="text-sm font-medium mb-1" style={{ color: '#192341' }}>
                                                                                {isFrench ? 'Ce qui est Testé:' : 'What is Tested:'}
                                                                            </p>
                                                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                                                {test.what_is_tested}
                                                                            </p>
                                                                        </div>
                                                                        {test.result_or_feedback && (
                                                                            <div className="mb-2">
                                                                                <p className="text-sm font-medium mb-1" style={{ color: '#192341' }}>
                                                                                    {isFrench ? 'Résultat/Commentaires:' : 'Result/Feedback:'}
                                                                                </p>
                                                                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                                                                    {test.result_or_feedback}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                        {test.page_url && (
                                                                            <div className="mb-2">
                                                                                <a
                                                                                    href={test.page_url}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="text-sm text-blue-600 hover:underline cursor-pointer"
                                                                                >
                                                                                    {test.page_url}
                                                                                </a>
                                                                            </div>
                                                                        )}
                                                                        {test.screenshots && test.screenshots.length > 0 && (
                                                                            <div className="mt-4">
                                                                                <p className="text-sm font-medium mb-2" style={{ color: '#192341' }}>
                                                                                    {isFrench ? 'Captures d\'écran:' : 'Screenshots:'}
                                                                                </p>
                                                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                                    {test.screenshots.map((screenshot: any, idx: number) => (
                                                                                        <div key={idx} className="relative">
                                                                                            <img
                                                                                                src={screenshot.url || screenshot.path}
                                                                                                alt={`Screenshot ${idx + 1}`}
                                                                                                className="w-full h-32 object-cover rounded-lg border cursor-pointer"
                                                                                                onClick={() => window.open(screenshot.url || screenshot.path, '_blank')}
                                                                                            />
                                                                                        </div>
                                                                                    ))}
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className="flex gap-2">
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => handleDeleteCustomTest(test.id)}
                                                                            className="cursor-pointer text-red-600"
                                                                        >
                                                                            <X className="w-4 h-4 mr-1" />
                                                                            {isFrench ? 'Supprimer' : 'Delete'}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    {isFrench
                                                        ? 'Aucun test personnalisé pour le moment. Créez votre premier test ci-dessus!'
                                                        : 'No custom tests yet. Create your first one above!'}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}

interface TestCardProps {
    test: TestResult;
    onStatusChange: (
        testId: string,
        status: 'not_tested' | 'pass' | 'fail' | 'blocked',
        notes?: string,
        actualResult?: string,
        issueResolved?: boolean
    ) => void;
    isUpdating: boolean;
    isFrench: boolean;
}

function TestCard({ test, onStatusChange, isUpdating, isFrench }: TestCardProps) {
    const [notes, setNotes] = useState(test.notes || '');
    const [actualResult, setActualResult] = useState(test.actual_result || '');
    const [status, setStatus] = useState(test.test_status);
    const [issueResolved, setIssueResolved] = useState(test.issue_resolved);
    const [showDetails, setShowDetails] = useState(false);

    const handleStatusChange = (newStatus: 'not_tested' | 'pass' | 'fail' | 'blocked') => {
        setStatus(newStatus);
        onStatusChange(test.test_id, newStatus, notes, actualResult, issueResolved);
    };

    const handleNotesChange = (newNotes: string) => {
        setNotes(newNotes);
        onStatusChange(test.test_id, status, newNotes, actualResult, issueResolved);
    };

    const handleActualResultChange = (newResult: string) => {
        setActualResult(newResult);
        onStatusChange(test.test_id, status, notes, newResult, issueResolved);
    };

    const handleIssueResolved = (resolved: boolean) => {
        setIssueResolved(resolved);
        onStatusChange(test.test_id, status, notes, actualResult, resolved);
    };

    return (
        <div className="border rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold" style={{ color: '#192341' }}>
                            {test.test_id}
                        </span>
                        {issueResolved && (
                            <Badge className="bg-green-100 text-green-800">
                                <Check className="w-3 h-3 mr-1" />
                                {isFrench ? 'Résolu' : 'Resolved'}
                            </Badge>
                        )}
                    </div>
                    <div className="text-sm font-medium mb-1" style={{ color: '#192341' }}>
                        {test.scenario}
                    </div>
                    {test.feature && (
                        <div className="text-xs text-gray-600">{test.feature}</div>
                    )}
                </div>
            </div>

            {/* Status Radio Buttons */}
            <div className="mb-4">
                <RadioGroup value={status} onValueChange={(value) => handleStatusChange(value as typeof status)}>
                    <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pass" id={`${test.id}-pass`} />
                            <Label htmlFor={`${test.id}-pass`} className="cursor-pointer flex items-center gap-1">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                {isFrench ? 'Réussi' : 'Pass'}
                            </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fail" id={`${test.id}-fail`} />
                            <Label htmlFor={`${test.id}-fail`} className="cursor-pointer flex items-center gap-1">
                                <XCircle className="w-4 h-4 text-red-600" />
                                {isFrench ? 'Échoué' : 'Fail'}
                            </Label>
                        </div>
                    </div>
                </RadioGroup>
            </div>

            {/* Comments/Findings */}
            <div className="mb-3">
                <Label className="mb-2 block" style={{ color: '#192341' }}>
                    {isFrench ? 'Commentaires / Constatations' : 'Comments / Findings'}
                </Label>
                <Textarea
                    value={notes}
                    onChange={(e) => handleNotesChange(e.target.value)}
                    placeholder={
                        isFrench
                            ? 'Ajoutez vos commentaires de test, observations ou problèmes trouvés ici...'
                            : 'Add your testing comments, observations, or issues found here...'
                    }
                    className="min-h-[100px]"
                />
            </div>

            {/* Tested By Info */}
            {test.tested_by && test.tested_at && (
                <div className="text-xs text-gray-500 mb-3">
                    {isFrench ? 'Testé par:' : 'Tested by:'} {test.tested_by}{' '}
                    {new Date(test.tested_at).toLocaleDateString('en-US', {
                        month: '2-digit',
                        day: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    })}
                </div>
            )}

            {/* Issue Resolved Section */}
            {status === 'fail' && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center space-x-2 mb-2">
                        <Checkbox
                            id={`${test.id}-resolved`}
                            checked={issueResolved}
                            onCheckedChange={(checked) => handleIssueResolved(checked === true)}
                        />
                        <Label htmlFor={`${test.id}-resolved`} className="cursor-pointer font-medium text-green-800">
                            {isFrench ? 'Problème Résolu' : 'Issue Resolved'}
                        </Label>
                    </div>
                    {issueResolved && (
                        <p className="text-sm text-green-700">
                            {isFrench
                                ? 'Ce problème a été marqué comme résolu.'
                                : 'This issue has been marked as resolved.'}
                            {test.tested_by && (
                                <>
                                    {' '}
                                    {isFrench ? 'Testé par:' : 'Tested by:'} {test.tested_by}{' '}
                                    {test.tested_at &&
                                        new Date(test.tested_at).toLocaleDateString('en-US', {
                                            month: '2-digit',
                                            day: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit',
                                        })}
                                </>
                            )}
                        </p>
                    )}
                </div>
            )}

            {/* Expandable Details */}
            <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-gray-600 hover:text-gray-800 mt-2 cursor-pointer flex items-center gap-1"
            >
                {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {isFrench ? 'Détails' : 'Details'}
            </button>

            {showDetails && (
                <div className="mt-3 space-y-3 border-t pt-3">
                    {test.steps && (
                        <div>
                            <Label className="block text-sm font-medium mb-1" style={{ color: '#192341' }}>
                                {isFrench ? 'Étapes:' : 'Steps:'}
                            </Label>
                            <div className="text-sm text-gray-700 whitespace-pre-line bg-gray-50 p-3 rounded">
                                {test.steps}
                            </div>
                        </div>
                    )}
                    <div>
                        <Label className="block text-sm font-medium mb-1" style={{ color: '#192341' }}>
                            {isFrench ? 'Résultat Attendu:' : 'Expected Result:'}
                        </Label>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{test.expected_result}</div>
                    </div>
                    <div>
                        <Label className="block text-sm font-medium mb-1" style={{ color: '#192341' }}>
                            {isFrench ? 'Résultat Réel:' : 'Actual Result:'}
                        </Label>
                        <Textarea
                            value={actualResult}
                            onChange={(e) => handleActualResultChange(e.target.value)}
                            placeholder={
                                isFrench ? 'Décrivez le résultat observé...' : 'Describe the observed result...'
                            }
                            className="min-h-[80px]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

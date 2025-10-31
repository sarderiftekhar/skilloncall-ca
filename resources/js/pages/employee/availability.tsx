import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle, Clock, Copy, Save } from 'react-feather';
import { useTranslations } from '@/hooks/useTranslations';
import AppLayout from '@/layouts/app-layout';
import FeedbackModal from '@/components/feedback-modal';

interface AvailabilityProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profileData: any;
}

interface AvailabilitySlot {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_available: boolean;
    rate_multiplier: number;
}

interface MonthAvailability {
    month: string; // 'YYYY-MM'
    availability: AvailabilitySlot[];
}

const DAYS_OF_WEEK = [
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
    { value: 0, label: 'Sunday', short: 'Sun' },
];

const TIME_SLOTS = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
    '21:00',
    '22:00',
];

// Loading Skeleton Components
const HeaderSkeleton = () => (
    <div className="mb-8 text-center animate-pulse">
        <div className="h-8 md:h-10 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
        <div className="h-5 bg-gray-200 rounded w-96 mx-auto"></div>
    </div>
);

const MonthTabsSkeleton = () => (
    <div className="mb-6 overflow-hidden border-2 border-gray-200 rounded-lg animate-pulse">
        <div className="grid grid-cols-2 gap-0">
            <div className="py-4 px-4 bg-gray-100">
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
            <div className="py-4 px-4 bg-gray-50 border-l-2 border-gray-200">
                <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-2">
                        <div className="h-5 w-5 bg-gray-300 rounded"></div>
                        <div className="h-4 bg-gray-300 rounded w-32"></div>
                    </div>
                    <div className="h-5 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    </div>
);

const AvailabilityCardSkeleton = () => (
    <div className="border border-gray-200 rounded-lg animate-pulse">
        <div className="p-6 border-b border-gray-200">
            <div className="flex items-center mb-2">
                <div className="h-6 w-6 bg-gray-300 rounded mr-3"></div>
                <div className="h-6 bg-gray-300 rounded w-64"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="p-6 space-y-6">
            {/* Quick Schedule Options */}
            <div>
                <div className="h-4 bg-gray-300 rounded w-48 mb-4"></div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded border-2 border-gray-200"></div>
                    ))}
                </div>
            </div>
            
            {/* Custom Schedule */}
            <div>
                <div className="h-4 bg-gray-300 rounded w-64 mb-4"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                        <div key={i} className="rounded-lg border-2 border-gray-200 bg-gray-50 p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="h-5 w-5 bg-gray-300 rounded mr-3"></div>
                                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Schedule Summary */}
                <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-5">
                    <div className="flex items-center space-x-4">
                        <div className="h-6 w-6 bg-gray-300 rounded"></div>
                        <div>
                            <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

const ButtonsSkeleton = () => (
    <div className="space-y-6">
        <div className="flex justify-center py-4">
            <div className="h-11 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>
        <div className="flex justify-center py-6">
            <div className="h-11 bg-gray-300 rounded w-40 animate-pulse"></div>
        </div>
    </div>
);

const TipsSkeleton = () => (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 animate-pulse">
        <div className="flex items-start space-x-3">
            <div className="mt-0.5 h-5 w-5 bg-gray-300 rounded"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                <div className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
            </div>
        </div>
    </div>
);

export default function EmployeeAvailability({ profileData }: AvailabilityProps) {
    const { t } = useTranslations('availability');
    const [isLoading, setIsLoading] = useState(true);
    const [showContent, setShowContent] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { props } = usePage();
    const [modal, setModal] = useState<{
        open: boolean;
        title: string;
        message: string;
        type: 'success' | 'error' | 'info';
    }>({
        open: false,
        title: '',
        message: '',
        type: 'info'
    });

    // Helper functions for month calculations
    const getCurrentMonth = (): string => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    };

    const getNextMonth = (): string => {
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}`;
    };

    const formatMonthDisplay = (month: string): string => {
        const [year, monthNum] = month.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Initialize months
    const currentMonth = useMemo(() => getCurrentMonth(), []);
    const nextMonth = useMemo(() => getNextMonth(), []);

    // Initialize default availability for a month
    const getDefaultAvailability = (): AvailabilitySlot[] => {
        return DAYS_OF_WEEK.map((day) => ({
            day_of_week: day.value,
            start_time: '09:00',
            end_time: '17:00',
            is_available: day.value >= 1 && day.value <= 5, // Weekdays default available
            rate_multiplier: day.value === 0 || day.value === 6 ? 1.25 : 1.0, // Weekend premium
        }));
    };

    // State for availability by month
    const [availabilityByMonth, setAvailabilityByMonth] = useState<MonthAvailability[]>(() => {
        if (profileData.availability_by_month && profileData.availability_by_month.length > 0) {
            return profileData.availability_by_month;
        }
        // Initialize with default availability for current and next month
        return [
            { month: currentMonth, availability: getDefaultAvailability() },
            { month: nextMonth, availability: getDefaultAvailability() },
        ];
    });

    const [selectedMonth, setSelectedMonth] = useState<string>(currentMonth);
    const [quickSchedule, setQuickSchedule] = useState<string>('');
    const [isCopying, setIsCopying] = useState(false);

    // Loading animation effect
    useEffect(() => {
        const loadingTimer = setTimeout(() => {
            setIsLoading(false);
            // Quick content reveal
            setTimeout(() => setShowContent(true), 50);
        }, 800);

        return () => clearTimeout(loadingTimer);
    }, []);

    // Handle flash messages from backend
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const flash = (props as any).flash || {};
        if (flash.success !== undefined) {
            setModal({
                open: true,
                title: flash.success ? 'Success!' : 'Error',
                message: flash.message || (flash.success ? 'Operation completed successfully!' : 'An error occurred.'),
                type: flash.success ? 'success' : 'error'
            });
        }
    }, [props]);

    // Sync with profileData
    useEffect(() => {
        if (profileData.availability_by_month && profileData.availability_by_month.length > 0) {
            setAvailabilityByMonth(profileData.availability_by_month);
        } else {
            // Initialize with defaults
            const defaults = [
                { month: currentMonth, availability: getDefaultAvailability() },
                { month: nextMonth, availability: getDefaultAvailability() },
            ];
            setAvailabilityByMonth(defaults);
        }
    }, [profileData.availability_by_month, currentMonth, nextMonth]);

    // Get availability for the selected month
    const currentAvailability = useMemo(() => {
        const monthData = availabilityByMonth.find((m) => m.month === selectedMonth);
        return monthData?.availability || getDefaultAvailability();
    }, [availabilityByMonth, selectedMonth]);

    // Update availability for a specific month and day
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateMonthAvailability = (month: string, dayOfWeek: number, field: string, value: any) => {
        const updatedByMonth = availabilityByMonth.map((monthData) => {
            if (monthData.month !== month) return monthData;

            const updatedAvailability = monthData.availability.map((slot) =>
                slot.day_of_week === dayOfWeek ? { ...slot, [field]: value } : slot
            );

            return { ...monthData, availability: updatedAvailability };
        });

        setAvailabilityByMonth(updatedByMonth);
    };

    const toggleDayAvailability = (dayOfWeek: number) => {
        const currentSlot = currentAvailability.find((a) => a.day_of_week === dayOfWeek);
        updateMonthAvailability(selectedMonth, dayOfWeek, 'is_available', !currentSlot?.is_available);
    };

    const handleQuickSchedule = (schedule: string) => {
        let updatedAvailability: AvailabilitySlot[];

        switch (schedule) {
            case 'weekdays':
                updatedAvailability = currentAvailability.map((slot) => ({
                    ...slot,
                    is_available: slot.day_of_week >= 1 && slot.day_of_week <= 5,
                    start_time: '09:00',
                    end_time: '17:00',
                }));
                break;
            case 'evenings':
                updatedAvailability = currentAvailability.map((slot) => ({
                    ...slot,
                    is_available: true,
                    start_time: '18:00',
                    end_time: '22:00',
                }));
                break;
            case 'weekends':
                updatedAvailability = currentAvailability.map((slot) => ({
                    ...slot,
                    is_available: slot.day_of_week === 0 || slot.day_of_week === 6,
                    start_time: '10:00',
                    end_time: '18:00',
                }));
                break;
            case 'flexible':
                updatedAvailability = currentAvailability.map((slot) => ({
                    ...slot,
                    is_available: true,
                    start_time: '08:00',
                    end_time: '20:00',
                }));
                break;
            default:
                return;
        }

        const updatedByMonth = availabilityByMonth.map((monthData) =>
            monthData.month === selectedMonth ? { ...monthData, availability: updatedAvailability } : monthData
        );

        setAvailabilityByMonth(updatedByMonth);
        setQuickSchedule(schedule);
    };

    const copyToNextMonth = () => {
        setIsCopying(true);
        
        // Copy current month's availability to next month
        const currentMonthData = availabilityByMonth.find((m) => m.month === currentMonth);
        if (!currentMonthData) return;

        const updatedByMonth = availabilityByMonth.map((monthData) => {
            if (monthData.month === nextMonth) {
                return { ...monthData, availability: [...currentMonthData.availability] };
            }
            return monthData;
        });

        setAvailabilityByMonth(updatedByMonth);

        // Show success message briefly
        setTimeout(() => {
            setIsCopying(false);
        }, 1000);
    };

    const getAvailableHours = (availability: AvailabilitySlot[]) => {
        const availableSlots = availability.filter((slot) => slot.is_available);
        const totalHours = availableSlots.reduce((total, slot) => {
            const start = new Date(`2000-01-01 ${slot.start_time}`);
            const end = new Date(`2000-01-01 ${slot.end_time}`);
            const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return total + hours;
        }, 0);

        return totalHours;
    };

    const hasAvailability = (month: string) => {
        const monthData = availabilityByMonth.find((m) => m.month === month);
        if (!monthData) return false;
        return monthData.availability.some((slot) => slot.is_available);
    };

    const saveAvailability = () => {
        setIsSaving(true);

        router.put('/employee/availability', {
            data: {
                availability_by_month: availabilityByMonth,
            },
        }, {
            onFinish: () => setIsSaving(false),
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Availability" />
            
            <FeedbackModal
                isOpen={modal.open}
                onClose={() => setModal(m => ({ ...m, open: false }))}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
            
            <div className="min-h-screen" style={{ backgroundColor: '#F6FBFD' }}>
                <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* Page Header */}
                    <div className={`transition-all duration-400 ease-out ${
                        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        {isLoading ? (
                            <HeaderSkeleton />
                        ) : (
                            <div className="mb-8 text-center">
                                <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4" style={{ color: '#10B3D6' }}>
                                    Manage Your Availability
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Update your schedule to help employers know when you're available for work.
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="space-y-6">
                        {/* Month Tabs */}
                        <div className={`transition-all duration-400 ease-out ${
                            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            {isLoading ? (
                                <MonthTabsSkeleton />
                            ) : (
                                <Card className="mb-6 overflow-hidden border-2" style={{ borderColor: '#10B3D6' }}>
                            <div className="grid grid-cols-2 gap-0">
                                <button
                                    type="button"
                                    onClick={() => setSelectedMonth(currentMonth)}
                                    className={`cursor-pointer relative py-4 px-4 text-center font-semibold transition-all duration-200 ${
                                        selectedMonth === currentMonth
                                            ? 'text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                    style={selectedMonth === currentMonth ? { backgroundColor: '#10B3D6' } : {}}
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5" />
                                            <span className="text-base">{formatMonthDisplay(currentMonth)}</span>
                                        </div>
                                        {hasAvailability(currentMonth) && (
                                            <Badge 
                                                className="text-xs"
                                                style={{ 
                                                    backgroundColor: selectedMonth === currentMonth ? 'white' : '#10B3D6',
                                                    color: selectedMonth === currentMonth ? '#10B3D6' : 'white'
                                                }}
                                            >
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                Set
                                            </Badge>
                                        )}
                                    </div>
                                    {selectedMonth === currentMonth && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#FCF2F0' }} />
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setSelectedMonth(nextMonth)}
                                    className={`cursor-pointer relative py-4 px-4 text-center font-semibold transition-all duration-200 border-l-2 ${
                                        selectedMonth === nextMonth
                                            ? 'text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                    style={
                                        selectedMonth === nextMonth 
                                            ? { backgroundColor: '#10B3D6', borderColor: 'white' } 
                                            : { borderColor: '#E5E7EB' }
                                    }
                                >
                                    <div className="flex flex-col items-center space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <Calendar className="h-5 w-5" />
                                            <span className="text-base">{formatMonthDisplay(nextMonth)}</span>
                                        </div>
                                        {hasAvailability(nextMonth) && (
                                            <Badge 
                                                className="text-xs"
                                                style={{ 
                                                    backgroundColor: selectedMonth === nextMonth ? 'white' : '#10B3D6',
                                                    color: selectedMonth === nextMonth ? '#10B3D6' : 'white'
                                                }}
                                            >
                                                <CheckCircle className="mr-1 h-3 w-3" />
                                                Set
                                            </Badge>
                                        )}
                                    </div>
                                    {selectedMonth === nextMonth && (
                                        <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#FCF2F0' }} />
                                    )}
                                </button>
                            </div>
                                </Card>
                            )}
                        </div>

                        {/* Availability Schedule */}
                        <div className={`transition-all duration-400 ease-out ${
                            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            {isLoading ? (
                                <AvailabilityCardSkeleton />
                            ) : (
                                <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-xl">
                                    <Clock className="mr-3 h-6 w-6" style={{ color: '#10B3D6' }} />
                                    {formatMonthDisplay(selectedMonth)} Availability
                                </CardTitle>
                                <p className="text-base text-gray-600">Set your availability for {formatMonthDisplay(selectedMonth)}. You can always negotiate specific times with employers.</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Quick Schedule Options */}
                                <div>
                                    <Label className="mb-4 block text-base font-medium">Quick Schedule Options</Label>
                                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleQuickSchedule('weekdays')}
                                            className={`h-auto cursor-pointer py-3 text-sm ${quickSchedule === 'weekdays' ? 'border-[#10B3D6] bg-blue-50' : ''}`}
                                        >
                                            <div className="text-center">
                                                <div className="font-medium">Weekdays</div>
                                                <div className="text-xs text-gray-500">Mon-Fri 9-5</div>
                                            </div>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleQuickSchedule('evenings')}
                                            className={`h-auto cursor-pointer py-3 text-sm ${quickSchedule === 'evenings' ? 'border-[#10B3D6] bg-blue-50' : ''}`}
                                        >
                                            <div className="text-center">
                                                <div className="font-medium">Evenings</div>
                                                <div className="text-xs text-gray-500">Daily 6-10PM</div>
                                            </div>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleQuickSchedule('weekends')}
                                            className={`h-auto cursor-pointer py-3 text-sm ${quickSchedule === 'weekends' ? 'border-[#10B3D6] bg-blue-50' : ''}`}
                                        >
                                            <div className="text-center">
                                                <div className="font-medium">Weekends</div>
                                                <div className="text-xs text-gray-500">Sat-Sun 10-6</div>
                                            </div>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => handleQuickSchedule('flexible')}
                                            className={`h-auto cursor-pointer py-3 text-sm ${quickSchedule === 'flexible' ? 'border-[#10B3D6] bg-blue-50' : ''}`}
                                        >
                                            <div className="text-center">
                                                <div className="font-medium">Very Flexible</div>
                                                <div className="text-xs text-gray-500">Daily 8-8</div>
                                            </div>
                                        </Button>
                                    </div>
                                </div>

                                {/* Custom Schedule */}
                                <div>
                                    <Label className="mb-4 block text-base font-medium">Custom Schedule (Tap days to toggle availability)</Label>
                                    <div className="space-y-4">
                                        {DAYS_OF_WEEK.map((day) => {
                                            const daySchedule = currentAvailability.find((a) => a.day_of_week === day.value) || {
                                                day_of_week: day.value,
                                                start_time: '09:00',
                                                end_time: '17:00',
                                                is_available: day.value >= 1 && day.value <= 5,
                                                rate_multiplier: day.value === 0 || day.value === 6 ? 1.25 : 1.0,
                                            };

                                            return (
                                                <div
                                                    key={day.value}
                                                    className={`rounded-lg border-2 p-4 transition-all duration-200 ${
                                                        daySchedule.is_available ? 'border-[#10B3D6] bg-blue-50' : 'border-gray-200 bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleDayAvailability(day.value)}
                                                            className="flex cursor-pointer items-center"
                                                        >
                                                            <div
                                                                className={`mr-3 flex h-5 w-5 items-center justify-center rounded border-2 ${
                                                                    daySchedule.is_available ? 'border-[#10B3D6] bg-[#10B3D6]' : 'border-gray-300'
                                                                }`}
                                                            >
                                                                {daySchedule.is_available && <CheckCircle className="h-3 w-3 text-white" />}
                                                            </div>
                                                            <span className={`font-medium ${daySchedule.is_available ? 'text-gray-900' : 'text-gray-500'}`}>
                                                                {day.label}
                                                            </span>
                                                            {(day.value === 0 || day.value === 6) && daySchedule.rate_multiplier > 1 && (
                                                                <Badge className="ml-2 text-xs" style={{ backgroundColor: '#10B3D6', color: 'white' }}>
                                                                    +{Math.round((daySchedule.rate_multiplier - 1) * 100)}%
                                                                </Badge>
                                                            )}
                                                        </button>
                                                    </div>

                                                    {daySchedule.is_available && (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <Label className="text-sm text-gray-600 mb-1 block">Start Time</Label>
                                                                <Select
                                                                    value={daySchedule.start_time}
                                                                    onValueChange={(value) => updateMonthAvailability(selectedMonth, day.value, 'start_time', value)}
                                                                >
                                                                    <SelectTrigger className="h-10 text-sm">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {TIME_SLOTS.map((time) => (
                                                                            <SelectItem key={time} value={time}>
                                                                                {time}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div>
                                                                <Label className="text-sm text-gray-600 mb-1 block">End Time</Label>
                                                                <Select
                                                                    value={daySchedule.end_time}
                                                                    onValueChange={(value) => updateMonthAvailability(selectedMonth, day.value, 'end_time', value)}
                                                                >
                                                                    <SelectTrigger className="h-10 text-sm">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {TIME_SLOTS.filter((time) => time > daySchedule.start_time).map((time) => (
                                                                            <SelectItem key={time} value={time}>
                                                                                {time}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Schedule Summary */}
                                    <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-5">
                                        <div className="flex items-center space-x-4">
                                            <Clock className="h-6 w-6 text-blue-600" />
                                            <div>
                                                <p className="font-semibold text-blue-800 text-base">
                                                    {formatMonthDisplay(selectedMonth)}: {getAvailableHours(currentAvailability)} hours per week
                                                </p>
                                                <p className="mt-1 text-sm text-blue-700">
                                                    Available {currentAvailability.filter((a) => a.is_available).length} days per week
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                                </Card>
                            )}
                        </div>

                        {/* Copy to Next Month Button & Save Button */}
                        <div className={`transition-all duration-400 ease-out ${
                            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            {isLoading ? (
                                <ButtonsSkeleton />
                            ) : (
                                <>
                                    {/* Copy to Next Month Button */}
                                    {selectedMonth === currentMonth && (
                                        <div className="flex justify-center py-4">
                                            <Button
                                                type="button"
                                                onClick={copyToNextMonth}
                                                disabled={isCopying}
                                                className="cursor-pointer px-6 py-3"
                                                style={{ backgroundColor: '#10B3D6', color: 'white', height: '2.7em' }}
                                            >
                                                <Copy className="mr-2 h-4 w-4" />
                                                {isCopying ? 'Copied!' : `Copy to ${formatMonthDisplay(nextMonth)}`}
                                            </Button>
                                        </div>
                                    )}

                                    {/* Save Button */}
                                    <div className="flex justify-center py-6">
                                        <Button
                                            onClick={saveAvailability}
                                            disabled={isSaving}
                                            className="cursor-pointer px-10 py-3"
                                            style={{ backgroundColor: '#10B3D6', color: 'white', height: '2.7em' }}
                                        >
                                            <Save className="mr-2 h-5 w-5" />
                                            {isSaving ? 'Saving...' : 'Save Availability'}
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Schedule Tips */}
                        <div className={`transition-all duration-400 ease-out ${
                            showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                            {isLoading ? (
                                <TipsSkeleton />
                            ) : (
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                            <div className="flex items-start space-x-3">
                                <Clock className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
                                <div className="text-sm">
                                    <p className="mb-1 font-medium text-yellow-800">Schedule Tips</p>
                                    <p className="text-xs text-yellow-700">
                                        • Set your availability for both months to get more opportunities
                                        <br />
                                        • More availability = more job opportunities
                                        <br />
                                        • Weekend and evening work often pays more
                                        <br />
                                        • You can always negotiate specific times with employers
                                        <br />• Update your schedule anytime from your dashboard
                                    </p>
                                </div>
                            </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

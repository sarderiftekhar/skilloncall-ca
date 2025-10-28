import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect, useMemo, useState } from 'react';
import { Calendar, CheckCircle, Clock, Copy } from 'react-feather';

interface GlobeAvailabilityStepProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateFormData: (data: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validationErrors: any;
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

export default function GlobeAvailabilityStep({ formData, updateFormData, validationErrors }: GlobeAvailabilityStepProps) {
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
        if (formData.availability_by_month && formData.availability_by_month.length > 0) {
            return formData.availability_by_month;
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

    // Sync with formData
    useEffect(() => {
        if (formData.availability_by_month && formData.availability_by_month.length > 0) {
            setAvailabilityByMonth(formData.availability_by_month);
        } else {
            // Initialize with defaults
            const defaults = [
                { month: currentMonth, availability: getDefaultAvailability() },
                { month: nextMonth, availability: getDefaultAvailability() },
            ];
            setAvailabilityByMonth(defaults);
            updateFormData({ availability_by_month: defaults });
        }
    }, [formData.availability_by_month, currentMonth, nextMonth, updateFormData]);

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
        updateFormData({ availability_by_month: updatedByMonth });
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
        updateFormData({ availability_by_month: updatedByMonth });
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
        updateFormData({ availability_by_month: updatedByMonth });

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

    return (
        <div className="space-y-6">
            {/* Welcome Message */}
            <div className="mb-6 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: '#FCF2F0' }}>
                    <Clock className="h-8 w-8" style={{ color: '#10B3D6' }} />
                </div>
                <h2 className="mb-2 text-xl font-bold" style={{ color: '#192341' }}>
                    Your Schedule
                </h2>
                <p className="text-sm text-gray-600">Tell us when you are available to work for the next 2 months.</p>
            </div>

            {/* Month Tabs */}
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

            {/* Availability Schedule */}
            <Card className="border" style={{ borderColor: '#10B3D6', borderWidth: '0.05px' }}>
                <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                        <Clock className="mr-2 h-5 w-5" style={{ color: '#10B3D6' }} />
                        {formatMonthDisplay(selectedMonth)} Availability
                    </CardTitle>
                    <p className="text-sm text-gray-600">Set your availability for {formatMonthDisplay(selectedMonth)}. You can always negotiate specific times with employers.</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* Quick Schedule Options */}
                    <div>
                        <Label className="mb-3 block text-sm font-medium">Quick Schedule Options</Label>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
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
                        <Label className="mb-3 block text-sm font-medium">Custom Schedule (Tap days to toggle availability)</Label>
                        <div className="space-y-3">
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
                                        className={`rounded-lg border-2 p-3 transition-all duration-200 ${
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
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-xs text-gray-600">Start Time</Label>
                                                    <Select
                                                        value={daySchedule.start_time}
                                                        onValueChange={(value) => updateMonthAvailability(selectedMonth, day.value, 'start_time', value)}
                                                    >
                                                        <SelectTrigger className="h-8 text-sm">
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
                                                    <Label className="text-xs text-gray-600">End Time</Label>
                                                    <Select
                                                        value={daySchedule.end_time}
                                                        onValueChange={(value) => updateMonthAvailability(selectedMonth, day.value, 'end_time', value)}
                                                    >
                                                        <SelectTrigger className="h-8 text-sm">
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
                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                            <div className="flex items-center space-x-3">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="font-medium text-blue-800">
                                        {formatMonthDisplay(selectedMonth)}: {getAvailableHours(currentAvailability)} hours per week
                                    </p>
                                    <p className="mt-1 text-sm text-blue-700">
                                        Available {currentAvailability.filter((a) => a.is_available).length} days per week
                                    </p>
                                </div>
                            </div>
                        </div>

                        {validationErrors.availability_by_month && <p className="text-sm text-red-600">{validationErrors.availability_by_month}</p>}
                    </div>
                </CardContent>
            </Card>

            {/* Copy to Next Month Button */}
            {selectedMonth === currentMonth && (
                <div className="flex justify-center">
                    <Button
                        type="button"
                        onClick={copyToNextMonth}
                        disabled={isCopying}
                        className="cursor-pointer"
                        style={{ backgroundColor: '#10B3D6', color: 'white' }}
                    >
                        <Copy className="mr-2 h-4 w-4" />
                        {isCopying ? 'Copied!' : `Copy to ${formatMonthDisplay(nextMonth)}`}
                    </Button>
                </div>
            )}

            {/* Schedule Tips */}
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
                            <br />• Update your schedule anytime in your profile
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

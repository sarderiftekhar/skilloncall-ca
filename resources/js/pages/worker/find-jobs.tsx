import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    MapPin,
    Clock,
    DollarSign,
    Briefcase,
    Heart,
    Search,
    ChevronDown,
    ChevronUp,
    Star,
    Menu,
    X,
} from 'react-feather';
import { useState, useMemo } from 'react';

interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    postal_code: string;
    hourly_rate_min: number;
    hourly_rate_max: number;
    job_type: string;
    shift_pattern: string;
    experience_level: string;
    required_skills: string[];
    description: string;
    posted_hours_ago: number;
    workers_interested: number;
    rating?: number;
    urgent?: boolean;
}

// 50 Diverse Service Industry Jobs
const DUMMY_JOBS: Job[] = [
    { id: 1, title: 'Evening Cashier', company: 'Metro Foods', location: 'Toronto, ON', postal_code: 'M5V 3A8', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'entry', required_skills: ['Cashier', 'Customer Service', 'POS'], description: 'Reliable cashier needed for busy evenings', posted_hours_ago: 2, workers_interested: 5, urgent: true },
    { id: 2, title: 'Weekend Barista', company: 'Bean There Coffee', location: 'Toronto, ON', postal_code: 'M4Y 1H9', hourly_rate_min: 16, hourly_rate_max: 18, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'intermediate', required_skills: ['Barista', 'Food Safe'], description: 'Experienced barista for weekend shifts', posted_hours_ago: 4, workers_interested: 8 },
    { id: 3, title: 'Line Cook', company: 'Downtown Restaurant', location: 'Toronto, ON', postal_code: 'M5H 2N2', hourly_rate_min: 22, hourly_rate_max: 25, job_type: 'full_time', shift_pattern: 'morning', experience_level: 'intermediate', required_skills: ['Professional Cooking', 'Food Safety'], description: 'Experienced line cook for busy kitchen', posted_hours_ago: 1, workers_interested: 3 },
    { id: 4, title: 'Server - Busy Pub', company: 'The Irish House', location: 'Toronto, ON', postal_code: 'M5T 1G4', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'entry', required_skills: ['Server', 'Customer Service'], description: 'Server for evening/night shifts, tips included', posted_hours_ago: 3, workers_interested: 12 },
    { id: 5, title: 'Food Prep', company: 'Catering Company', location: 'Toronto, ON', postal_code: 'M2N 6G5', hourly_rate_min: 19, hourly_rate_max: 21, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'intermediate', required_skills: ['Food Prep', 'Food Safe'], description: 'Food prep for catering events', posted_hours_ago: 6, workers_interested: 2 },
    { id: 6, title: 'Stock Worker - Grocery', company: 'Save-A-Lot', location: 'Toronto, ON', postal_code: 'M1P 4Z7', hourly_rate_min: 17.5, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'night', experience_level: 'entry', required_skills: ['Stocking', 'Inventory'], description: 'Night shift stock worker needed', posted_hours_ago: 5, workers_interested: 1 },
    { id: 7, title: 'Retail Associate', company: 'Fashion Store', location: 'Toronto, ON', postal_code: 'M5G 1Z5', hourly_rate_min: 16, hourly_rate_max: 18, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Customer Service', 'Sales'], description: 'Retail associate for weekends', posted_hours_ago: 8, workers_interested: 6 },
    { id: 8, title: 'Customer Service Rep', company: 'Electronics Store', location: 'Toronto, ON', postal_code: 'M4W 3E2', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Customer Service', 'Sales'], description: 'Customer service rep for retail store', posted_hours_ago: 2, workers_interested: 4 },
    { id: 9, title: 'Barista', company: 'Daily Grind Coffee', location: 'Vancouver, BC', postal_code: 'V6B 2R3', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'morning', experience_level: 'intermediate', required_skills: ['Barista', 'Food Safe'], description: 'Morning shift barista needed', posted_hours_ago: 3, workers_interested: 7 },
    { id: 10, title: 'Dishwasher', company: 'Seaside Restaurant', location: 'Vancouver, BC', postal_code: 'V6G 1Z4', hourly_rate_min: 16, hourly_rate_max: 17, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'entry', required_skills: ['Dishwashing'], description: 'Dishwasher for evening service', posted_hours_ago: 1, workers_interested: 2 },
    { id: 11, title: 'Stock Associate', company: 'Outdoor Gear Store', location: 'Vancouver, BC', postal_code: 'V6Z 1A2', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Stocking', 'Inventory'], description: 'Stock associate for retail store', posted_hours_ago: 4, workers_interested: 3 },
    { id: 12, title: 'Waiter', company: 'Steakhouse Premier', location: 'Calgary, AB', postal_code: 'T2P 1K7', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'intermediate', required_skills: ['Server', 'Customer Service'], description: 'Experienced waiter for upscale restaurant', posted_hours_ago: 2, workers_interested: 9, rating: 4.8 },
    { id: 13, title: 'Kitchen Helper', company: 'Fast Casual Diner', location: 'Calgary, AB', postal_code: 'T2N 1N4', hourly_rate_min: 16.5, hourly_rate_max: 18, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Food Prep', 'Kitchen'], description: 'Kitchen helper for busy diner', posted_hours_ago: 5, workers_interested: 1 },
    { id: 14, title: 'Grocery Cashier', company: 'Fresh Market', location: 'Calgary, AB', postal_code: 'T2R 0L8', hourly_rate_min: 17.5, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Cashier', 'Customer Service'], description: 'Cashier for grocery store', posted_hours_ago: 6, workers_interested: 4 },
    { id: 15, title: 'Chef de Partie', company: 'Bistro Montreal', location: 'Montreal, QC', postal_code: 'H2X 1Y9', hourly_rate_min: 24, hourly_rate_max: 28, job_type: 'full_time', shift_pattern: 'evening', experience_level: 'expert', required_skills: ['Professional Cooking', 'Food Safety'], description: 'Experienced chef de partie needed', posted_hours_ago: 1, workers_interested: 2, rating: 4.9 },
    { id: 16, title: 'Sommelier/Wine Service', company: 'Wine Bar Downtown', location: 'Montreal, QC', postal_code: 'H1R 3H8', hourly_rate_min: 19, hourly_rate_max: 22, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'intermediate', required_skills: ['Wine Knowledge', 'Customer Service'], description: 'Wine service staff for upscale bar', posted_hours_ago: 3, workers_interested: 5 },
    { id: 17, title: 'Pastry Assistant', company: 'French Bakery', location: 'Montreal, QC', postal_code: 'H2R 2Y6', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'morning', experience_level: 'intermediate', required_skills: ['Baking', 'Food Safe'], description: 'Assistant pastry chef for bakery', posted_hours_ago: 2, workers_interested: 3 },
    { id: 18, title: 'Delivery Driver', company: 'Food Delivery Plus', location: 'Edmonton, AB', postal_code: 'T5J 4H1', hourly_rate_min: 18, hourly_rate_max: 22, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Driving', 'Navigation'], description: 'Delivery driver with vehicle', posted_hours_ago: 1, workers_interested: 8 },
    { id: 19, title: 'Cashier', company: 'Convenience Store', location: 'Edmonton, AB', postal_code: 'T5K 1P4', hourly_rate_min: 16, hourly_rate_max: 17.5, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Cashier', 'Customer Service'], description: '24-hour convenience store cashier', posted_hours_ago: 4, workers_interested: 2 },
    { id: 20, title: 'Warehouse Worker', company: 'Distribution Center', location: 'Edmonton, AB', postal_code: 'T6E 1S8', hourly_rate_min: 19, hourly_rate_max: 21, job_type: 'part_time', shift_pattern: 'night', experience_level: 'entry', required_skills: ['Physical Labor', 'Forklift'], description: 'Warehouse stocker for night shift', posted_hours_ago: 2, workers_interested: 1 },
    { id: 21, title: 'Server', company: 'Parliament Hill Cafe', location: 'Ottawa, ON', postal_code: 'K1P 5A9', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Server', 'Customer Service'], description: 'Server for busy cafe', posted_hours_ago: 3, workers_interested: 6 },
    { id: 22, title: 'Janitor/Cleaner', company: 'Building Services Inc', location: 'Ottawa, ON', postal_code: 'K1N 5T6', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'entry', required_skills: ['Cleaning', 'Safety'], description: 'Evening cleaning for office building', posted_hours_ago: 5, workers_interested: 1 },
    { id: 23, title: 'Butcher Assistant', company: 'Butcher Shop', location: 'Ottawa, ON', postal_code: 'K2P 1L1', hourly_rate_min: 20, hourly_rate_max: 22, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Butchering', 'Food Safe'], description: 'Assistant butcher for meat counter', posted_hours_ago: 2, workers_interested: 2 },
    { id: 24, title: 'Barista', company: 'Local Coffee Shop', location: 'Winnipeg, MB', postal_code: 'R3B 2E5', hourly_rate_min: 16, hourly_rate_max: 18, job_type: 'part_time', shift_pattern: 'morning', experience_level: 'intermediate', required_skills: ['Barista', 'Food Safe'], description: 'Morning barista shifts', posted_hours_ago: 3, workers_interested: 4 },
    { id: 25, title: 'Stock Associate', company: 'Supermarket Chain', location: 'Winnipeg, MB', postal_code: 'R3C 0R8', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Stocking', 'Inventory'], description: 'Stock shelves for supermarket', posted_hours_ago: 4, workers_interested: 3 },
    { id: 26, title: 'Line Cook', company: 'Restaurant Downtown', location: 'Winnipeg, MB', postal_code: 'R3B 0N2', hourly_rate_min: 21, hourly_rate_max: 24, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'intermediate', required_skills: ['Professional Cooking', 'Food Safety'], description: 'Experienced line cook needed', posted_hours_ago: 1, workers_interested: 2 },
    { id: 27, title: 'Server', company: 'Waterfront Restaurant', location: 'Halifax, NS', postal_code: 'B3J 2S5', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'entry', required_skills: ['Server', 'Customer Service'], description: 'Server for waterfront restaurant', posted_hours_ago: 2, workers_interested: 5 },
    { id: 28, title: 'Kitchen Staff', company: 'Seafood Grill', location: 'Halifax, NS', postal_code: 'B3K 5R7', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Food Prep', 'Kitchen'], description: 'Kitchen staff for seafood restaurant', posted_hours_ago: 4, workers_interested: 2 },
    { id: 29, title: 'Cashier', company: 'Retail Store', location: 'Halifax, NS', postal_code: 'B3H 1Z8', hourly_rate_min: 16.5, hourly_rate_max: 18, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Cashier', 'Customer Service'], description: 'Retail cashier for store', posted_hours_ago: 5, workers_interested: 3 },
    { id: 30, title: 'Hair Stylist', company: 'Modern Salon', location: 'Mississauga, ON', postal_code: 'L5H 2R2', hourly_rate_min: 20, hourly_rate_max: 25, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'intermediate', required_skills: ['Hair Styling', 'Customer Service'], description: 'Part-time hair stylist needed', posted_hours_ago: 3, workers_interested: 4 },
    { id: 31, title: 'Barber', company: 'Classic Barbershop', location: 'Brampton, ON', postal_code: 'L6W 4P6', hourly_rate_min: 18, hourly_rate_max: 22, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'intermediate', required_skills: ['Barbering', 'Customer Service'], description: 'Experienced barber wanted', posted_hours_ago: 2, workers_interested: 6 },
    { id: 32, title: 'Housekeeper', company: 'Hotel Downtown', location: 'Quebec City, QC', postal_code: 'G1R 4M1', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'morning', experience_level: 'entry', required_skills: ['Cleaning', 'Hospitality'], description: 'Hotel housekeeper needed', posted_hours_ago: 1, workers_interested: 2 },
    { id: 33, title: 'Porter', company: 'Luxury Hotel', location: 'London, ON', postal_code: 'N6A 1E8', hourly_rate_min: 17.5, hourly_rate_max: 19.5, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Physical Labor', 'Customer Service'], description: 'Hotel porter for guest services', posted_hours_ago: 4, workers_interested: 1 },
    { id: 34, title: 'Cleaner', company: 'Cleaning Services', location: 'Kitchener, ON', postal_code: 'N2H 2R2', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'entry', required_skills: ['Cleaning', 'Safety'], description: 'Office cleaner for evenings', posted_hours_ago: 3, workers_interested: 3 },
    { id: 35, title: 'Food Delivery Driver', company: 'Courier Service', location: 'Windsor, ON', postal_code: 'N8Y 4S5', hourly_rate_min: 18, hourly_rate_max: 21, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Driving', 'Customer Service'], description: 'Delivery driver with own vehicle', posted_hours_ago: 5, workers_interested: 2 },
    { id: 36, title: 'Butcher', company: 'Premium Meats', location: 'Kingston, ON', postal_code: 'K7L 3N6', hourly_rate_min: 22, hourly_rate_max: 25, job_type: 'full_time', shift_pattern: 'flexible', experience_level: 'intermediate', required_skills: ['Butchering', 'Food Safe', 'Food Handling'], description: 'Experienced butcher needed', posted_hours_ago: 2, workers_interested: 1 },
    { id: 37, title: 'Baker', company: 'Artisan Bakery', location: 'Toronto, ON', postal_code: 'M6P 2A5', hourly_rate_min: 19, hourly_rate_max: 22, job_type: 'part_time', shift_pattern: 'night', experience_level: 'intermediate', required_skills: ['Baking', 'Food Safe'], description: 'Night shift baker for bakery', posted_hours_ago: 1, workers_interested: 2, rating: 4.7 },
    { id: 38, title: 'Deli Counter Staff', company: 'Fresh Market', location: 'Vancouver, BC', postal_code: 'V5Z 3B7', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Food Service', 'Food Safe'], description: 'Deli counter staff needed', posted_hours_ago: 3, workers_interested: 4 },
    { id: 39, title: 'Warehouse Stocker', company: 'Logistics Hub', location: 'Calgary, AB', postal_code: 'T2A 5L4', hourly_rate_min: 19.5, hourly_rate_max: 21.5, job_type: 'part_time', shift_pattern: 'night', experience_level: 'entry', required_skills: ['Physical Labor', 'Inventory'], description: 'Night shift warehouse stocker', posted_hours_ago: 2, workers_interested: 1 },
    { id: 40, title: 'Retail Sales', company: 'Tech Store', location: 'Montreal, QC', postal_code: 'H2Z 1H6', hourly_rate_min: 17.5, hourly_rate_max: 19.5, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Sales', 'Customer Service'], description: 'Retail sales associate wanted', posted_hours_ago: 4, workers_interested: 5 },
    { id: 41, title: 'Prep Cook', company: 'Asian Fusion', location: 'Edmonton, AB', postal_code: 'T5K 1Z8', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'intermediate', required_skills: ['Food Prep', 'Asian Cuisine'], description: 'Prep cook for Asian restaurant', posted_hours_ago: 3, workers_interested: 3 },
    { id: 42, title: 'Fastfood Crew', company: 'Quick Bites', location: 'Ottawa, ON', postal_code: 'K2J 7Y7', hourly_rate_min: 16, hourly_rate_max: 17.5, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Food Service', 'Teamwork'], description: 'Fast food crew member needed', posted_hours_ago: 2, workers_interested: 8 },
    { id: 43, title: 'Dishwasher', company: 'Fine Dining', location: 'Winnipeg, MB', postal_code: 'R3B 2G9', hourly_rate_min: 16.5, hourly_rate_max: 18, job_type: 'part_time', shift_pattern: 'evening', experience_level: 'entry', required_skills: ['Dishwashing', 'Food Safety'], description: 'Dishwasher for upscale restaurant', posted_hours_ago: 1, workers_interested: 1 },
    { id: 44, title: 'Package Handler', company: 'Shipping Center', location: 'Halifax, NS', postal_code: 'B3J 2T3', hourly_rate_min: 17.5, hourly_rate_max: 19.5, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Physical Labor', 'Sorting'], description: 'Package handler for shipping center', posted_hours_ago: 3, workers_interested: 2 },
    { id: 45, title: 'Produce Clerk', company: 'Supermarket', location: 'Mississauga, ON', postal_code: 'L4X 1L2', hourly_rate_min: 17, hourly_rate_max: 18.5, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Produce', 'Food Handling'], description: 'Produce section clerk needed', posted_hours_ago: 4, workers_interested: 2 },
    { id: 46, title: 'Laundry Staff', company: 'Hotel Service', location: 'Brampton, ON', postal_code: 'L6Z 3L9', hourly_rate_min: 16.5, hourly_rate_max: 18, job_type: 'part_time', shift_pattern: 'morning', experience_level: 'entry', required_skills: ['Laundry', 'Hospitality'], description: 'Hotel laundry staff member', posted_hours_ago: 5, workers_interested: 1 },
    { id: 47, title: 'Landscaper', company: 'Green Spaces', location: 'Quebec City, QC', postal_code: 'G1S 2R8', hourly_rate_min: 18, hourly_rate_max: 21, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Landscaping', 'Physical Labor'], description: 'Landscaper for garden maintenance', posted_hours_ago: 2, workers_interested: 3 },
    { id: 48, title: 'Auto Detailer', company: 'Car Wash Plus', location: 'London, ON', postal_code: 'N5Y 1J8', hourly_rate_min: 18, hourly_rate_max: 20, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Detailing', 'Customer Service'], description: 'Auto detailing staff wanted', posted_hours_ago: 1, workers_interested: 4 },
    { id: 49, title: 'Reception', company: 'Office Building', location: 'Kitchener, ON', postal_code: 'N2G 4T9', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Customer Service', 'Office Skills'], description: 'Receptionist for busy office', posted_hours_ago: 3, workers_interested: 2 },
    { id: 50, title: 'Event Staff', company: 'Event Services', location: 'Windsor, ON', postal_code: 'N9A 2P4', hourly_rate_min: 17, hourly_rate_max: 19, job_type: 'part_time', shift_pattern: 'flexible', experience_level: 'entry', required_skills: ['Event Support', 'Customer Service'], description: 'Event staff for various venues', posted_hours_ago: 2, workers_interested: 5 },
];

// Extract unique professions from job titles
const extractProfessions = () => {
    const professions = new Set<string>();
    DUMMY_JOBS.forEach(job => {
        const titleParts = job.title.toLowerCase().split(/[\s-/]+/);
        titleParts.forEach(part => {
            if (part.length > 2 && !['the', 'for', 'and', 'or', 'a', 'an'].includes(part)) {
                professions.add(part.charAt(0).toUpperCase() + part.slice(1));
            }
        });
    });
    return Array.from(professions).sort();
};

export default function FindJobs() {
    const [searchQuery, setSearchQuery] = useState('');
    const [professionSearch, setProfessionSearch] = useState('');
    const [selectedProfessions, setSelectedProfessions] = useState<string[]>([]);
    const [selectedShifts, setSelectedShifts] = useState<string[]>([]);
    const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
    const [minRate, setMinRate] = useState<number>(16);
    const [maxRate, setMaxRate] = useState<number>(28);
    const [savedJobs, setSavedJobs] = useState<number[]>([]);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    
    const [expandedFilters, setExpandedFilters] = useState({
        profession: true,
        shift: true,
        experience: true,
        rate: true,
    });

    const allProfessions = extractProfessions();
    const filteredProfessions = professionSearch.length > 0 
        ? allProfessions.filter(p => p.toLowerCase().includes(professionSearch.toLowerCase()))
        : allProfessions;

    const filteredJobs = useMemo(() => {
        return DUMMY_JOBS.filter(job => {
            const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                job.location.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesProfession = selectedProfessions.length === 0 || 
                selectedProfessions.some(prof => job.title.toLowerCase().includes(prof.toLowerCase()));
            
            const matchesShift = selectedShifts.length === 0 || selectedShifts.includes(job.shift_pattern);
            const matchesExperience = selectedExperience.length === 0 || selectedExperience.includes(job.experience_level);
            const matchesRate = job.hourly_rate_min >= minRate && job.hourly_rate_max <= maxRate;

            return matchesSearch && matchesProfession && matchesShift && matchesExperience && matchesRate;
        });
    }, [searchQuery, selectedProfessions, selectedShifts, selectedExperience, minRate, maxRate]);

    const toggleSaveJob = (jobId: number) => {
        setSavedJobs(prev => 
            prev.includes(jobId) ? prev.filter(id => id !== jobId) : [...prev, jobId]
        );
    };

    const toggleFilter = (filterKey: keyof typeof expandedFilters) => {
        setExpandedFilters(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey],
        }));
    };

    const toggleMultiFilter = (value: string, currentList: string[], setter: (val: string[]) => void) => {
        if (currentList.includes(value)) {
            setter(currentList.filter(v => v !== value));
        } else {
            setter([...currentList, value]);
        }
    };

    return (
        <AppLayout>
            <Head title="Find Jobs" />

            {/* Mobile-First Responsive Layout */}
            <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 max-w-7xl mx-auto pt-16 px-4 lg:px-0">
                
                {/* Mobile Filter Toggle */}
                <div className="lg:hidden flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-gray-800">Filters</h2>
                    <button
                        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                        className="p-2 rounded-lg border border-gray-200"
                    >
                        {mobileFiltersOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Sidebar Filters */}
                <div className={`${mobileFiltersOpen ? 'block' : 'hidden'} lg:block lg:w-72 flex-shrink-0 mb-6 lg:mb-0`}>
                    <div className="bg-white rounded-lg shadow-sm p-5 lg:p-6 space-y-5 lg:space-y-6 lg:sticky lg:top-20">
                        
                        {/* Search */}
                        <div>
                            <label className="text-sm font-semibold text-gray-700 block mb-2">Search</label>
                            <div className="relative">
                                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Job, company, location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 h-10 text-sm"
                                />
                            </div>
                        </div>

                        {/* Profession Filter with Search */}
                        <div>
                            <button
                                onClick={() => toggleFilter('profession')}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <label className="text-sm font-semibold text-gray-700">Profession</label>
                                {expandedFilters.profession ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedFilters.profession && (
                                <div className="space-y-3">
                                    {/* Profession Search */}
                                    <div className="relative">
                                        <Search className="absolute left-2 top-2 w-3 h-3 text-gray-400" />
                                        <Input
                                            type="text"
                                            placeholder="Search professions..."
                                            value={professionSearch}
                                            onChange={(e) => setProfessionSearch(e.target.value)}
                                            className="pl-7 h-9 text-xs"
                                        />
                                    </div>
                                    
                                    {/* Professions List */}
                                    <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {filteredProfessions.length > 0 ? (
                                            filteredProfessions.map(prof => (
                                                <label key={prof} className="flex items-center gap-2 cursor-pointer text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedProfessions.includes(prof)}
                                                        onChange={() => toggleMultiFilter(prof, selectedProfessions, setSelectedProfessions)}
                                                        className="w-4 h-4 rounded"
                                                    />
                                                    <span className="text-gray-700">{prof}</span>
                                                </label>
                                            ))
                                        ) : (
                                            <p className="text-xs text-gray-500">No professions found</p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Shift Pattern Filter */}
                        <div>
                            <button
                                onClick={() => toggleFilter('shift')}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <label className="text-sm font-semibold text-gray-700">Shift</label>
                                {expandedFilters.shift ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedFilters.shift && (
                                <div className="space-y-2 text-sm">
                                    {['morning', 'evening', 'night', 'flexible'].map(shift => (
                                        <label key={shift} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedShifts.includes(shift)}
                                                onChange={() => toggleMultiFilter(shift, selectedShifts, setSelectedShifts)}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700 capitalize">{shift}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Experience Level Filter */}
                        <div>
                            <button
                                onClick={() => toggleFilter('experience')}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <label className="text-sm font-semibold text-gray-700">Experience</label>
                                {expandedFilters.experience ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedFilters.experience && (
                                <div className="space-y-2 text-sm">
                                    {['entry', 'intermediate', 'expert'].map(level => (
                                        <label key={level} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={selectedExperience.includes(level)}
                                                onChange={() => toggleMultiFilter(level, selectedExperience, setSelectedExperience)}
                                                className="w-4 h-4 rounded"
                                            />
                                            <span className="text-gray-700 capitalize">{level}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hourly Rate Filter */}
                        <div>
                            <button
                                onClick={() => toggleFilter('rate')}
                                className="flex items-center justify-between w-full mb-3"
                            >
                                <label className="text-sm font-semibold text-gray-700">Hourly Rate</label>
                                {expandedFilters.rate ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            {expandedFilters.rate && (
                                <div className="space-y-4 text-sm">
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs text-gray-600">Min</label>
                                            <span className="text-xs font-semibold">${minRate}/hr</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="16"
                                            max="28"
                                            value={minRate}
                                            onChange={(e) => setMinRate(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <label className="text-xs text-gray-600">Max</label>
                                            <span className="text-xs font-semibold">${maxRate}/hr</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="16"
                                            max="28"
                                            value={maxRate}
                                            onChange={(e) => setMaxRate(Number(e.target.value))}
                                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Clear Filters */}
                        {(searchQuery || selectedProfessions.length || selectedShifts.length || selectedExperience.length) && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setSearchQuery('');
                                    setSelectedProfessions([]);
                                    setSelectedShifts([]);
                                    setSelectedExperience([]);
                                    setMinRate(16);
                                    setMaxRate(28);
                                    setProfessionSearch('');
                                }}
                                className="w-full text-xs"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#10B3D6' }}>Browse Jobs</h1>
                                <p className="text-sm lg:text-base text-gray-600">Discover opportunities that match your skills and experience</p>
                            </div>
                            <div className="text-right">
                                <div className="text-2xl lg:text-3xl font-bold text-blue-600">{filteredJobs.length}</div>
                                <p className="text-xs lg:text-sm text-gray-600">jobs found</p>
                            </div>
                        </div>
                    </div>

                    {/* Info Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 lg:p-4 mb-6 text-xs lg:text-sm" style={{ borderColor: '#10B3D6' }}>
                        <p className="text-gray-700">
                            <strong style={{ color: '#10B3D6' }}>ℹ️ How it works:</strong> Click "Apply" to express interest. Your profile will be visible to the employer. If interested, they'll message you through the platform.
                        </p>
                    </div>

                    {/* Jobs List */}
                    <div className="space-y-3 lg:space-y-4 pb-8">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map(job => (
                                <Card key={job.id} className="hover:shadow-md transition-shadow">
                                    <CardContent className="p-4 lg:p-5">
                                        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-4">
                                            {/* Job Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                                    <h3 className="text-base lg:text-lg font-semibold" style={{ color: '#192341' }}>
                                                        {job.title}
                                                    </h3>
                                                    {job.urgent && (
                                                        <Badge className="bg-red-100 text-red-700 border-0 text-xs">URGENT</Badge>
                                                    )}
                                                </div>
                                                <p className="text-xs lg:text-sm text-gray-600 mb-3">{job.company}</p>

                                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 mb-3">
                                                    <div className="flex items-center gap-2 text-xs lg:text-sm">
                                                        <MapPin className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" style={{ color: '#10B3D6' }} />
                                                        <span className="text-gray-700 truncate">{job.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs lg:text-sm">
                                                        <DollarSign className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" style={{ color: '#10B3D6' }} />
                                                        <span className="text-gray-700 font-semibold">
                                                            ${job.hourly_rate_min}-${job.hourly_rate_max}/hr
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs lg:text-sm">
                                                        <Clock className="w-3 h-3 lg:w-4 lg:h-4 flex-shrink-0" style={{ color: '#10B3D6' }} />
                                                        <span className="text-gray-700 capitalize">{job.shift_pattern}</span>
                                                    </div>
                                                </div>

                                                <p className="text-xs lg:text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>

                                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                                    <span>{job.workers_interested} interested</span>
                                                    {job.rating && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                            <span>{job.rating}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex sm:flex-col gap-2 w-full sm:w-auto flex-shrink-0">
                                                <Button
                                                    size="sm"
                                                    className="text-white text-xs px-4 lg:px-6 flex-1 sm:flex-none"
                                                    style={{ backgroundColor: '#10B3D6' }}
                                                >
                                                    Apply
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => toggleSaveJob(job.id)}
                                                    className={`text-xs flex-1 sm:flex-none ${savedJobs.includes(job.id) ? 'text-red-500' : ''}`}
                                                >
                                                    <Heart 
                                                        className="w-4 h-4"
                                                        fill={savedJobs.includes(job.id) ? 'currentColor' : 'none'}
                                                    />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Card>
                                <CardContent className="p-8 lg:p-12 text-center">
                                    <Briefcase className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-4 text-gray-300" />
                                    <h3 className="text-base lg:text-lg font-semibold text-gray-600 mb-2">No jobs found</h3>
                                    <p className="text-sm text-gray-500">Try adjusting your filters or search terms</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

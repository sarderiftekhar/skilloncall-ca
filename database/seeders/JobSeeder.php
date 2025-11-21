<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get an employer user
        $employer = User::where('role', 'employer')->first();
        
        if (!$employer) {
            $this->command->warn('No employer user found. Please run the DatabaseSeeder first.');
            return;
        }

        $jobs = [
            // Cleaning & Maintenance Jobs
            [
                'title' => 'House Cleaner Needed - Weekly Service',
                'description' => 'Looking for reliable house cleaner for weekly cleaning service. Duties include vacuuming, mopping, dusting, bathroom and kitchen cleaning. Must have own transportation and cleaning supplies.',
                'category' => 'Cleaning & Maintenance',
                'budget' => 25.00,
                'deadline' => now()->addDays(7),
                'required_skills' => ['House Cleaner', 'Residential Cleaner'],
                'location' => 'Toronto, ON',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Office Cleaner - Evening Shift',
                'description' => 'Part-time office cleaning position, Monday to Friday 6PM-10PM. Responsibilities include emptying trash, cleaning offices, washrooms, and common areas. Experience preferred but will train.',
                'category' => 'Cleaning & Maintenance',
                'budget' => 22.00,
                'deadline' => now()->addDays(10),
                'required_skills' => ['Office Cleaner', 'Commercial Cleaner', 'Janitor'],
                'location' => 'Vancouver, BC',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(1),
            ],
            [
                'title' => 'Deep Cleaning Specialist - Move-Out Clean',
                'description' => 'One-time deep cleaning job for 3-bedroom apartment. Move-out cleaning including appliances, baseboards, windows, and thorough sanitization. Must be completed within 2 days.',
                'category' => 'Cleaning & Maintenance',
                'budget' => 30.00,
                'deadline' => now()->addDays(5),
                'required_skills' => ['Deep Cleaning Specialist', 'Move-Out Cleaning'],
                'location' => 'Calgary, AB',
                'job_type' => 'contract',
                'experience_level' => 'intermediate',
                'status' => 'active',
                'published_at' => now()->subHours(6),
            ],

            // Food Service Jobs
            [
                'title' => 'Food Delivery Driver - Flexible Hours',
                'description' => 'Join our delivery team! Use your own vehicle to deliver food orders. Flexible scheduling, work when you want. Must have valid license, insurance, and smartphone. Tips included.',
                'category' => 'Food Service',
                'budget' => 18.00,
                'deadline' => now()->addDays(14),
                'required_skills' => ['Delivery Driver', 'Customer Service'],
                'location' => 'Toronto, ON',
                'job_type' => 'contract',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Kitchen Helper - Fast-Paced Restaurant',
                'description' => 'Busy restaurant seeking kitchen helper for food prep, dishwashing, and general kitchen support. No experience necessary - we will train. Must be able to work in fast-paced environment.',
                'category' => 'Food Service',
                'budget' => 16.50,
                'deadline' => now()->addDays(12),
                'required_skills' => ['Kitchen Helper', 'Food Preparation'],
                'location' => 'Montreal, QC',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(4),
            ],
            [
                'title' => 'Server/Waitress - Weekend Shifts',
                'description' => 'Popular family restaurant looking for friendly server for weekend shifts. Experience preferred but will train right candidate. Must have excellent customer service skills and positive attitude.',
                'category' => 'Food Service',
                'budget' => 15.00,
                'deadline' => now()->addDays(8),
                'required_skills' => ['Waiter/Waitress', 'Customer Service'],
                'location' => 'Ottawa, ON',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(1),
            ],

            // Transportation & Delivery
            [
                'title' => 'Moving Helper - Weekend Work',
                'description' => 'Help with residential moves on weekends. Loading, unloading, and packing assistance. Must be physically fit and able to lift heavy items. Great weekend income opportunity.',
                'category' => 'Transportation & Delivery',
                'budget' => 20.00,
                'deadline' => now()->addDays(6),
                'required_skills' => ['Moving Helper', 'Loading/Unloading'],
                'location' => 'Toronto, ON',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subHours(12),
            ],
            [
                'title' => 'Warehouse Worker - Day Shift',
                'description' => 'Full-time warehouse position involving receiving, organizing inventory, and order fulfillment. Forklift certification preferred but not required. Benefits after 90 days.',
                'category' => 'Transportation & Delivery',
                'budget' => 19.50,
                'deadline' => now()->addDays(15),
                'required_skills' => ['Warehouse Worker', 'Inventory Management'],
                'location' => 'Vancouver, BC',
                'job_type' => 'full_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'Courier - Same Day Delivery',
                'description' => 'Independent courier needed for same-day package delivery across the city. Must have reliable vehicle and GPS. Routes provided daily. Immediate start available.',
                'category' => 'Transportation & Delivery',
                'budget' => 22.50,
                'deadline' => now()->addDays(3),
                'required_skills' => ['Courier', 'Same Day Delivery'],
                'location' => 'Calgary, AB',
                'job_type' => 'contract',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(2),
            ],

            // Personal Care & Services
            [
                'title' => 'Pet Sitter - Dog Walking Services',
                'description' => 'Reliable pet sitter needed for daily dog walking and pet care services. Must love animals and be available weekdays. References required. Perfect for animal lovers!',
                'category' => 'Personal Care',
                'budget' => 17.00,
                'deadline' => now()->addDays(9),
                'required_skills' => ['Pet Sitting', 'Dog Walking'],
                'location' => 'Toronto, ON',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(3),
            ],
            [
                'title' => 'Home Care Assistant - Elder Care',
                'description' => 'Compassionate home care assistant needed to help elderly client with daily activities, light housekeeping, and companionship. Flexible schedule, background check required.',
                'category' => 'Personal Care',
                'budget' => 24.00,
                'deadline' => now()->addDays(11),
                'required_skills' => ['Personal Care Assistant', 'Elder Care'],
                'location' => 'Vancouver, BC',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(6),
            ],

            // Handyman & Maintenance
            [
                'title' => 'Handyman - Small Home Repairs',
                'description' => 'General handyman needed for various small repair jobs around residential properties. Basic carpentry, painting, and fixture installation. Must have own basic tools.',
                'category' => 'Handyman Services',
                'budget' => 28.00,
                'deadline' => now()->addDays(20),
                'required_skills' => ['Handyman', 'Basic Carpentry', 'Painting'],
                'location' => 'Ottawa, ON',
                'job_type' => 'contract',
                'experience_level' => 'intermediate',
                'status' => 'active',
                'published_at' => now()->subDays(4),
            ],
            [
                'title' => 'Lawn Care Specialist - Weekly Service',
                'description' => 'Lawn maintenance for residential properties including mowing, edging, and basic landscaping. Must have transportation for equipment. Regular weekly clients available.',
                'category' => 'Landscaping & Outdoors',
                'budget' => 26.00,
                'deadline' => now()->addDays(7),
                'required_skills' => ['Lawn Care', 'Landscaping'],
                'location' => 'Toronto, ON',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(1),
            ],

            // Retail & Customer Service
            [
                'title' => 'Cashier - Part-Time Evenings',
                'description' => 'Part-time cashier position for busy grocery store. Evening shifts available, perfect for students or second job. Customer service experience preferred. Benefits available.',
                'category' => 'Retail',
                'budget' => 16.00,
                'deadline' => now()->addDays(13),
                'required_skills' => ['Cashier', 'Customer Service'],
                'location' => 'Montreal, QC',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(2),
            ],
            [
                'title' => 'Stock Associate - Weekend Work',
                'description' => 'Weekend stock associate for retail store. Duties include receiving shipments, stocking shelves, and inventory management. Must be able to lift 50lbs. Great for extra income.',
                'category' => 'Retail',
                'budget' => 17.50,
                'deadline' => now()->addDays(10),
                'required_skills' => ['Stock Associate', 'Inventory Management'],
                'location' => 'Calgary, AB',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(7),
            ],

            // Event & Hospitality
            [
                'title' => 'Event Setup Crew - Weddings & Parties',
                'description' => 'Event setup and breakdown crew needed for weddings and private parties. Weekend work, must be reliable and detail-oriented. Experience with tent and equipment setup preferred.',
                'category' => 'Event Services',
                'budget' => 21.00,
                'deadline' => now()->addDays(5),
                'required_skills' => ['Event Setup', 'Team Work'],
                'location' => 'Vancouver, BC',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subHours(18),
            ],
            [
                'title' => 'Parking Attendant - Downtown Events',
                'description' => 'Parking attendant needed for downtown events and venues. Must be friendly, professional, and able to handle cash transactions. Evening and weekend availability required.',
                'category' => 'Event Services',
                'budget' => 18.50,
                'deadline' => now()->addDays(8),
                'required_skills' => ['Customer Service', 'Cash Handling'],
                'location' => 'Toronto, ON',
                'job_type' => 'part_time',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(3),
            ],

            // Seasonal & Temporary Work
            [
                'title' => 'Snow Removal Crew - Winter Contract',
                'description' => 'Snow removal team member for residential and commercial properties. Must be available for early morning calls and have warm weather gear. Seasonal contract with good pay.',
                'category' => 'Seasonal Work',
                'budget' => 23.00,
                'deadline' => now()->addDays(4),
                'required_skills' => ['Snow Removal', 'Physical Labor'],
                'location' => 'Ottawa, ON',
                'job_type' => 'contract',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subHours(8),
            ],
            [
                'title' => 'General Laborer - Construction Cleanup',
                'description' => 'General laborer needed for construction site cleanup and basic tasks. No experience required but must be physically capable. Safety training provided. Potential for full-time.',
                'category' => 'Construction',
                'budget' => 20.50,
                'deadline' => now()->addDays(6),
                'required_skills' => ['General Labor', 'Construction Cleanup'],
                'location' => 'Calgary, AB',
                'job_type' => 'contract',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now()->subDays(1),
            ],
        ];

        foreach ($jobs as $jobData) {
            Job::updateOrCreate(
                [
                    'employer_id' => $employer->id,
                    'title' => $jobData['title'],
                    'location' => $jobData['location'],
                ],
                array_merge($jobData, [
                    'views_count' => rand(5, 50),
                    'applications_count' => rand(0, 8),
                    'payment_status' => 'pending',
                ])
            );
        }

        $this->command->info('Sample jobs created successfully!');
    }
}
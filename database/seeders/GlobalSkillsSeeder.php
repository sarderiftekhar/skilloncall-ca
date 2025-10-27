<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GlobalSkillsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        
        $skills = [
            // Food Service
            ['name' => 'Head Chef', 'category' => 'Food Service', 'requires_certification' => true, 'sort_order' => 1],
            ['name' => 'Sous Chef', 'category' => 'Food Service', 'requires_certification' => false, 'sort_order' => 2],
            ['name' => 'Line Cook', 'category' => 'Food Service', 'requires_certification' => false, 'sort_order' => 3],
            ['name' => 'Prep Cook', 'category' => 'Food Service', 'requires_certification' => false, 'sort_order' => 4],
            ['name' => 'Pizza Maker', 'category' => 'Food Service', 'requires_certification' => false, 'sort_order' => 5],
            ['name' => 'Baker', 'category' => 'Food Service', 'requires_certification' => false, 'sort_order' => 6],
            ['name' => 'Pastry Chef', 'category' => 'Food Service', 'requires_certification' => false, 'sort_order' => 7],
            ['name' => 'Barista', 'category' => 'Food Service', 'requires_certification' => false, 'sort_order' => 8],
            ['name' => 'Food Server', 'category' => 'Food Service', 'requires_certification' => true, 'sort_order' => 9],
            ['name' => 'Kitchen Helper', 'category' => 'Food Service', 'requires_certification' => true, 'sort_order' => 10],
            ['name' => 'Dishwasher', 'category' => 'Food Service', 'requires_certification' => false, 'sort_order' => 11],
            ['name' => 'Catering Assistant', 'category' => 'Food Service', 'requires_certification' => true, 'sort_order' => 12],

            // Personal Care
            ['name' => 'Barber', 'category' => 'Personal Care', 'requires_certification' => true, 'sort_order' => 13],
            ['name' => 'Hair Stylist', 'category' => 'Personal Care', 'requires_certification' => true, 'sort_order' => 14],
            ['name' => 'Manicurist', 'category' => 'Personal Care', 'requires_certification' => true, 'sort_order' => 15],
            ['name' => 'Pedicurist', 'category' => 'Personal Care', 'requires_certification' => true, 'sort_order' => 16],
            ['name' => 'Esthetician', 'category' => 'Personal Care', 'requires_certification' => true, 'sort_order' => 17],
            ['name' => 'Massage Therapist', 'category' => 'Personal Care', 'requires_certification' => true, 'sort_order' => 18],
            ['name' => 'Makeup Artist', 'category' => 'Personal Care', 'requires_certification' => false, 'sort_order' => 19],

            // Trades & Maintenance
            ['name' => 'Handyman', 'category' => 'Trades & Maintenance', 'requires_certification' => false, 'sort_order' => 20],
            ['name' => 'Plumber', 'category' => 'Trades & Maintenance', 'requires_certification' => true, 'sort_order' => 21],
            ['name' => 'Electrician', 'category' => 'Trades & Maintenance', 'requires_certification' => true, 'sort_order' => 22],
            ['name' => 'Carpenter', 'category' => 'Trades & Maintenance', 'requires_certification' => true, 'sort_order' => 23],
            ['name' => 'Painter', 'category' => 'Trades & Maintenance', 'requires_certification' => false, 'sort_order' => 24],
            ['name' => 'HVAC Technician', 'category' => 'Trades & Maintenance', 'requires_certification' => true, 'sort_order' => 25],
            ['name' => 'Appliance Repair', 'category' => 'Trades & Maintenance', 'requires_certification' => false, 'sort_order' => 26],
            ['name' => 'Locksmith', 'category' => 'Trades & Maintenance', 'requires_certification' => true, 'sort_order' => 27],
            ['name' => 'Roofer', 'category' => 'Trades & Maintenance', 'requires_certification' => true, 'sort_order' => 28],
            ['name' => 'Flooring Installer', 'category' => 'Trades & Maintenance', 'requires_certification' => false, 'sort_order' => 29],

            // Cleaning & Maintenance
            ['name' => 'House Cleaner', 'category' => 'Cleaning & Maintenance', 'requires_certification' => false, 'sort_order' => 30],
            ['name' => 'Office Cleaner', 'category' => 'Cleaning & Maintenance', 'requires_certification' => false, 'sort_order' => 31],
            ['name' => 'Janitor', 'category' => 'Cleaning & Maintenance', 'requires_certification' => false, 'sort_order' => 32],
            ['name' => 'Carpet Cleaner', 'category' => 'Cleaning & Maintenance', 'requires_certification' => false, 'sort_order' => 33],
            ['name' => 'Window Cleaner', 'category' => 'Cleaning & Maintenance', 'requires_certification' => false, 'sort_order' => 34],
            ['name' => 'Power Washing', 'category' => 'Cleaning & Maintenance', 'requires_certification' => false, 'sort_order' => 35],

            // Landscaping & Outdoors
            ['name' => 'Landscaper', 'category' => 'Landscaping & Outdoors', 'requires_certification' => false, 'sort_order' => 36],
            ['name' => 'Gardener', 'category' => 'Landscaping & Outdoors', 'requires_certification' => false, 'sort_order' => 37],
            ['name' => 'Lawn Care', 'category' => 'Landscaping & Outdoors', 'requires_certification' => false, 'sort_order' => 38],
            ['name' => 'Pool Cleaner', 'category' => 'Landscaping & Outdoors', 'requires_certification' => false, 'sort_order' => 39],
            ['name' => 'Snow Removal', 'category' => 'Landscaping & Outdoors', 'requires_certification' => false, 'sort_order' => 40],
            ['name' => 'Tree Service', 'category' => 'Landscaping & Outdoors', 'requires_certification' => true, 'sort_order' => 41],

            // Transportation & Delivery
            ['name' => 'Delivery Driver', 'category' => 'Transportation & Delivery', 'requires_certification' => false, 'sort_order' => 42],
            ['name' => 'Moving Helper', 'category' => 'Transportation & Delivery', 'requires_certification' => false, 'sort_order' => 43],
            ['name' => 'Courier', 'category' => 'Transportation & Delivery', 'requires_certification' => false, 'sort_order' => 44],
            ['name' => 'Furniture Assembly', 'category' => 'Transportation & Delivery', 'requires_certification' => false, 'sort_order' => 45],

            // Personal Services
            ['name' => 'Pet Walker', 'category' => 'Personal Services', 'requires_certification' => false, 'sort_order' => 46],
            ['name' => 'Pet Sitter', 'category' => 'Personal Services', 'requires_certification' => false, 'sort_order' => 47],
            ['name' => 'Babysitter', 'category' => 'Personal Services', 'requires_certification' => true, 'sort_order' => 48],
            ['name' => 'Elder Care', 'category' => 'Personal Services', 'requires_certification' => true, 'sort_order' => 49],
            ['name' => 'Personal Shopper', 'category' => 'Personal Services', 'requires_certification' => false, 'sort_order' => 50],
            ['name' => 'Errand Runner', 'category' => 'Personal Services', 'requires_certification' => false, 'sort_order' => 51],

            // Event Services
            ['name' => 'Event Setup', 'category' => 'Event Services', 'requires_certification' => false, 'sort_order' => 52],
            ['name' => 'DJ', 'category' => 'Event Services', 'requires_certification' => false, 'sort_order' => 53],
            ['name' => 'Photographer', 'category' => 'Event Services', 'requires_certification' => false, 'sort_order' => 54],
            ['name' => 'Event Server', 'category' => 'Event Services', 'requires_certification' => true, 'sort_order' => 55],
            ['name' => 'Bartender', 'category' => 'Event Services', 'requires_certification' => true, 'sort_order' => 56],

            // Automotive
            ['name' => 'Car Detailing', 'category' => 'Automotive', 'requires_certification' => false, 'sort_order' => 57],
            ['name' => 'Auto Mechanic', 'category' => 'Automotive', 'requires_certification' => true, 'sort_order' => 58],
            ['name' => 'Tire Service', 'category' => 'Automotive', 'requires_certification' => false, 'sort_order' => 59],

            // Technology
            ['name' => 'Computer Repair', 'category' => 'Technology', 'requires_certification' => false, 'sort_order' => 60],
            ['name' => 'Phone Repair', 'category' => 'Technology', 'requires_certification' => false, 'sort_order' => 61],
            ['name' => 'TV Installation', 'category' => 'Technology', 'requires_certification' => false, 'sort_order' => 62],
        ];

        foreach ($skills as $skill) {
            $skill['created_at'] = $now;
            $skill['updated_at'] = $now;
            $skill['is_active'] = true;
        }

        DB::table('global_skills')->insert($skills);
    }
}



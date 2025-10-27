<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GlobalIndustriesSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        
        $industries = [
            // Food & Beverage
            ['name' => 'Restaurant', 'category' => 'Food & Beverage', 'sort_order' => 1],
            ['name' => 'Fast Food', 'category' => 'Food & Beverage', 'sort_order' => 2],
            ['name' => 'Catering', 'category' => 'Food & Beverage', 'sort_order' => 3],
            ['name' => 'Bakery', 'category' => 'Food & Beverage', 'sort_order' => 4],
            ['name' => 'Coffee Shop', 'category' => 'Food & Beverage', 'sort_order' => 5],
            ['name' => 'Bar/Pub', 'category' => 'Food & Beverage', 'sort_order' => 6],
            ['name' => 'Food Truck', 'category' => 'Food & Beverage', 'sort_order' => 7],
            ['name' => 'Hotel Kitchen', 'category' => 'Food & Beverage', 'sort_order' => 8],
            ['name' => 'Grocery Store', 'category' => 'Food & Beverage', 'sort_order' => 9],
            ['name' => 'Brewery/Distillery', 'category' => 'Food & Beverage', 'sort_order' => 10],

            // Personal Care Services
            ['name' => 'Hair Salon', 'category' => 'Personal Care Services', 'sort_order' => 11],
            ['name' => 'Barbershop', 'category' => 'Personal Care Services', 'sort_order' => 12],
            ['name' => 'Nail Salon', 'category' => 'Personal Care Services', 'sort_order' => 13],
            ['name' => 'Spa', 'category' => 'Personal Care Services', 'sort_order' => 14],
            ['name' => 'Beauty Salon', 'category' => 'Personal Care Services', 'sort_order' => 15],
            ['name' => 'Massage Clinic', 'category' => 'Personal Care Services', 'sort_order' => 16],
            ['name' => 'Tattoo Parlor', 'category' => 'Personal Care Services', 'sort_order' => 17],
            ['name' => 'Dental Office', 'category' => 'Personal Care Services', 'sort_order' => 18],

            // Construction & Trades
            ['name' => 'Construction Company', 'category' => 'Construction & Trades', 'sort_order' => 19],
            ['name' => 'Home Renovation', 'category' => 'Construction & Trades', 'sort_order' => 20],
            ['name' => 'Plumbing Company', 'category' => 'Construction & Trades', 'sort_order' => 21],
            ['name' => 'Electrical Services', 'category' => 'Construction & Trades', 'sort_order' => 22],
            ['name' => 'HVAC Company', 'category' => 'Construction & Trades', 'sort_order' => 23],
            ['name' => 'Roofing Company', 'category' => 'Construction & Trades', 'sort_order' => 24],
            ['name' => 'Painting Contractor', 'category' => 'Construction & Trades', 'sort_order' => 25],
            ['name' => 'Flooring Company', 'category' => 'Construction & Trades', 'sort_order' => 26],
            ['name' => 'Handyman Services', 'category' => 'Construction & Trades', 'sort_order' => 27],

            // Hospitality & Tourism
            ['name' => 'Hotel', 'category' => 'Hospitality & Tourism', 'sort_order' => 28],
            ['name' => 'Resort', 'category' => 'Hospitality & Tourism', 'sort_order' => 29],
            ['name' => 'Event Venue', 'category' => 'Hospitality & Tourism', 'sort_order' => 30],
            ['name' => 'Bed & Breakfast', 'category' => 'Hospitality & Tourism', 'sort_order' => 31],
            ['name' => 'Vacation Rental', 'category' => 'Hospitality & Tourism', 'sort_order' => 32],
            ['name' => 'Wedding Venue', 'category' => 'Hospitality & Tourism', 'sort_order' => 33],

            // Cleaning Services
            ['name' => 'Cleaning Service', 'category' => 'Cleaning Services', 'sort_order' => 34],
            ['name' => 'Janitorial Service', 'category' => 'Cleaning Services', 'sort_order' => 35],
            ['name' => 'Carpet Cleaning', 'category' => 'Cleaning Services', 'sort_order' => 36],
            ['name' => 'Window Cleaning', 'category' => 'Cleaning Services', 'sort_order' => 37],
            ['name' => 'Power Washing', 'category' => 'Cleaning Services', 'sort_order' => 38],
            ['name' => 'Maid Service', 'category' => 'Cleaning Services', 'sort_order' => 39],

            // Landscaping & Outdoors
            ['name' => 'Landscaping Company', 'category' => 'Landscaping & Outdoors', 'sort_order' => 40],
            ['name' => 'Garden Centre', 'category' => 'Landscaping & Outdoors', 'sort_order' => 41],
            ['name' => 'Lawn Care Service', 'category' => 'Landscaping & Outdoors', 'sort_order' => 42],
            ['name' => 'Tree Service', 'category' => 'Landscaping & Outdoors', 'sort_order' => 43],
            ['name' => 'Pool Service', 'category' => 'Landscaping & Outdoors', 'sort_order' => 44],
            ['name' => 'Snow Removal', 'category' => 'Landscaping & Outdoors', 'sort_order' => 45],

            // Property Management
            ['name' => 'Property Management', 'category' => 'Property Management', 'sort_order' => 46],
            ['name' => 'Real Estate', 'category' => 'Property Management', 'sort_order' => 47],
            ['name' => 'Apartment Building', 'category' => 'Property Management', 'sort_order' => 48],
            ['name' => 'Condo Management', 'category' => 'Property Management', 'sort_order' => 49],

            // Transportation
            ['name' => 'Delivery Service', 'category' => 'Transportation', 'sort_order' => 50],
            ['name' => 'Moving Company', 'category' => 'Transportation', 'sort_order' => 51],
            ['name' => 'Courier Service', 'category' => 'Transportation', 'sort_order' => 52],
            ['name' => 'Taxi/Rideshare', 'category' => 'Transportation', 'sort_order' => 53],
            ['name' => 'Logistics Company', 'category' => 'Transportation', 'sort_order' => 54],

            // Healthcare
            ['name' => 'Hospital', 'category' => 'Healthcare', 'sort_order' => 55],
            ['name' => 'Clinic', 'category' => 'Healthcare', 'sort_order' => 56],
            ['name' => 'Long-term Care', 'category' => 'Healthcare', 'sort_order' => 57],
            ['name' => 'Home Care', 'category' => 'Healthcare', 'sort_order' => 58],
            ['name' => 'Veterinary Clinic', 'category' => 'Healthcare', 'sort_order' => 59],

            // Retail
            ['name' => 'Department Store', 'category' => 'Retail', 'sort_order' => 60],
            ['name' => 'Boutique', 'category' => 'Retail', 'sort_order' => 61],
            ['name' => 'Hardware Store', 'category' => 'Retail', 'sort_order' => 62],
            ['name' => 'Pharmacy', 'category' => 'Retail', 'sort_order' => 63],
            ['name' => 'Auto Parts Store', 'category' => 'Retail', 'sort_order' => 64],

            // Automotive
            ['name' => 'Auto Repair Shop', 'category' => 'Automotive', 'sort_order' => 65],
            ['name' => 'Car Dealership', 'category' => 'Automotive', 'sort_order' => 66],
            ['name' => 'Car Wash', 'category' => 'Automotive', 'sort_order' => 67],
            ['name' => 'Tire Shop', 'category' => 'Automotive', 'sort_order' => 68],
            ['name' => 'Auto Detailing', 'category' => 'Automotive', 'sort_order' => 69],

            // Entertainment
            ['name' => 'Event Planning', 'category' => 'Entertainment', 'sort_order' => 70],
            ['name' => 'Photography Studio', 'category' => 'Entertainment', 'sort_order' => 71],
            ['name' => 'Music Venue', 'category' => 'Entertainment', 'sort_order' => 72],
            ['name' => 'Dance Studio', 'category' => 'Entertainment', 'sort_order' => 73],

            // Technology
            ['name' => 'Computer Repair', 'category' => 'Technology', 'sort_order' => 74],
            ['name' => 'Electronics Store', 'category' => 'Technology', 'sort_order' => 75],
            ['name' => 'Telecommunications', 'category' => 'Technology', 'sort_order' => 76],

            // Other Services
            ['name' => 'Pet Services', 'category' => 'Other Services', 'sort_order' => 77],
            ['name' => 'Childcare', 'category' => 'Other Services', 'sort_order' => 78],
            ['name' => 'Fitness Centre', 'category' => 'Other Services', 'sort_order' => 79],
            ['name' => 'Laundromat', 'category' => 'Other Services', 'sort_order' => 80],
        ];

        foreach ($industries as $industry) {
            $industry['created_at'] = $now;
            $industry['updated_at'] = $now;
            $industry['is_active'] = true;
        }

        DB::table('global_industries')->insert($industries);
    }
}



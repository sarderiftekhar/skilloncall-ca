<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GlobalCertificationsSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        
        $certifications = [
            // Food Service Certifications
            [
                'name' => 'Food Safe Level 1',
                'issuing_authority' => 'Provincial Health Authority',
                'skill_category' => 'Food Service',
                'province' => null, // Available in all provinces
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 5
            ],
            [
                'name' => 'ServSafe Food Handler',
                'issuing_authority' => 'National Restaurant Association',
                'skill_category' => 'Food Service',
                'province' => null,
                'is_required' => false,
                'has_expiry' => true,
                'validity_years' => 3
            ],
            [
                'name' => 'Smart Serve (Alcohol Service)',
                'issuing_authority' => 'Smart Serve Ontario',
                'skill_category' => 'Food Service',
                'province' => 'ON',
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 5
            ],
            [
                'name' => 'Serving It Right (BC)',
                'issuing_authority' => 'Justice Institute of BC',
                'skill_category' => 'Food Service',
                'province' => 'BC',
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 5
            ],

            // Personal Care Certifications
            [
                'name' => 'Cosmetology License',
                'issuing_authority' => 'Provincial Regulatory Body',
                'skill_category' => 'Personal Care',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 2
            ],
            [
                'name' => 'Barbering License',
                'issuing_authority' => 'Provincial Regulatory Body',
                'skill_category' => 'Personal Care',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 2
            ],
            [
                'name' => 'Nail Technician License',
                'issuing_authority' => 'Provincial Regulatory Body',
                'skill_category' => 'Personal Care',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 2
            ],

            // Trades Certifications (Red Seal)
            [
                'name' => 'Red Seal - Plumber',
                'issuing_authority' => 'Red Seal Program',
                'skill_category' => 'Trades & Maintenance',
                'province' => null,
                'is_required' => true,
                'has_expiry' => false,
                'validity_years' => null
            ],
            [
                'name' => 'Red Seal - Electrician',
                'issuing_authority' => 'Red Seal Program',
                'skill_category' => 'Trades & Maintenance',
                'province' => null,
                'is_required' => true,
                'has_expiry' => false,
                'validity_years' => null
            ],
            [
                'name' => 'Red Seal - Carpenter',
                'issuing_authority' => 'Red Seal Program',
                'skill_category' => 'Trades & Maintenance',
                'province' => null,
                'is_required' => false,
                'has_expiry' => false,
                'validity_years' => null
            ],
            [
                'name' => 'HVAC Technician License',
                'issuing_authority' => 'Provincial Regulatory Body',
                'skill_category' => 'Trades & Maintenance',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 3
            ],

            // Safety Certifications
            [
                'name' => 'WHMIS 2015',
                'issuing_authority' => 'Health Canada',
                'skill_category' => 'General',
                'province' => null,
                'is_required' => false,
                'has_expiry' => true,
                'validity_years' => 3
            ],
            [
                'name' => 'First Aid & CPR Level C',
                'issuing_authority' => 'Red Cross / St. John Ambulance',
                'skill_category' => 'General',
                'province' => null,
                'is_required' => false,
                'has_expiry' => true,
                'validity_years' => 3
            ],
            [
                'name' => 'Working at Heights',
                'issuing_authority' => 'Ministry of Labour (Ontario)',
                'skill_category' => 'Construction & Trades',
                'province' => 'ON',
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 3
            ],
            [
                'name' => 'Fall Protection',
                'issuing_authority' => 'WorkSafeBC',
                'skill_category' => 'Construction & Trades',
                'province' => 'BC',
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 3
            ],

            // Childcare & Healthcare
            [
                'name' => 'Early Childhood Education Certificate',
                'issuing_authority' => 'Provincial College',
                'skill_category' => 'Personal Services',
                'province' => null,
                'is_required' => true,
                'has_expiry' => false,
                'validity_years' => null
            ],
            [
                'name' => 'Personal Support Worker Certificate',
                'issuing_authority' => 'Provincial College',
                'skill_category' => 'Personal Services',
                'province' => null,
                'is_required' => true,
                'has_expiry' => false,
                'validity_years' => null
            ],
            [
                'name' => 'Criminal Background Check',
                'issuing_authority' => 'Local Police Service',
                'skill_category' => 'General',
                'province' => null,
                'is_required' => false,
                'has_expiry' => true,
                'validity_years' => 1
            ],
            [
                'name' => 'Vulnerable Sector Check',
                'issuing_authority' => 'Local Police Service',
                'skill_category' => 'Personal Services',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 1
            ],

            // Transportation
            [
                'name' => 'Class 5 Driver\'s License',
                'issuing_authority' => 'Provincial Motor Vehicle Department',
                'skill_category' => 'Transportation & Delivery',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 5
            ],
            [
                'name' => 'Commercial Vehicle License',
                'issuing_authority' => 'Provincial Motor Vehicle Department',
                'skill_category' => 'Transportation & Delivery',
                'province' => null,
                'is_required' => false,
                'has_expiry' => true,
                'validity_years' => 5
            ],

            // Specialized Certifications
            [
                'name' => 'Tree Service Arborist',
                'issuing_authority' => 'International Society of Arboriculture',
                'skill_category' => 'Landscaping & Outdoors',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 3
            ],
            [
                'name' => 'Pool Operator Certificate',
                'issuing_authority' => 'Pool & Hot Tub Council of Canada',
                'skill_category' => 'Landscaping & Outdoors',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 3
            ],
            [
                'name' => 'Pet First Aid',
                'issuing_authority' => 'Canadian Pet First Aid',
                'skill_category' => 'Personal Services',
                'province' => null,
                'is_required' => false,
                'has_expiry' => true,
                'validity_years' => 2
            ],

            // Event Services
            [
                'name' => 'Special Event Security License',
                'issuing_authority' => 'Provincial Security Licensing',
                'skill_category' => 'Event Services',
                'province' => null,
                'is_required' => false,
                'has_expiry' => true,
                'validity_years' => 2
            ],
        ];

        // Use updateOrInsert to prevent duplicates when seeder runs multiple times
        foreach ($certifications as $certification) {
            DB::table('global_certifications')->updateOrInsert(
                [
                    'name' => $certification['name'],
                    'issuing_authority' => $certification['issuing_authority'],
                    'province' => $certification['province']
                ],
                [
                    'skill_category' => $certification['skill_category'],
                    'is_required' => $certification['is_required'],
                    'has_expiry' => $certification['has_expiry'],
                    'validity_years' => $certification['validity_years'],
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}



<?php

namespace Database\Seeders;

use App\Models\EmployeeAvailability;
use App\Models\EmployeeCertification;
use App\Models\EmployeeProfile;
use App\Models\EmployeeReference;
use App\Models\EmployeeServiceArea;
use App\Models\GlobalCertification;
use App\Models\GlobalCity;
use App\Models\GlobalIndustry;
use App\Models\GlobalLanguage;
use App\Models\GlobalProvince;
use App\Models\GlobalSkill;
use App\Models\User;
use App\Models\WorkExperience;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EmployeeSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $now = Carbon::now();
            $effectiveMonth = $now->format('Y-m');

            $categories = $this->categoryDefinitions();
            $employees = $this->employeeRoster();

            $skillCache = [];
            $languageCache = [];
            $industryCache = [];
            $certificationCache = [];
            $provinceCache = [];
            $cityCache = [];

            $categoryCounters = [];
            $referenceCounter = 0;

            $sinBase = 100000000;

            foreach ($employees as $index => $employeeData) {
                $categoryKey = $employeeData['category'];
                if (! isset($categories[$categoryKey])) {
                    throw new \RuntimeException("Category {$categoryKey} is not defined for employee {$employeeData['first_name']} {$employeeData['last_name']}.");
                }

                $categoryCounters[$categoryKey] = ($categoryCounters[$categoryKey] ?? 0) + 1;
                $category = $categories[$categoryKey];
                $categoryIndex = $categoryCounters[$categoryKey] - 1;

                $locationInfo = $this->resolveLocation($employeeData, $category);
                $provinceCode = $locationInfo['province_code'] ?? $category['province_code'] ?? null;
                if (! $provinceCode) {
                    throw new \RuntimeException("Province code missing for employee {$employeeData['first_name']} {$employeeData['last_name']}.");
                }

                $provinceId = $provinceCache[$provinceCode] ??= GlobalProvince::where('code', $provinceCode)->value('id');
                if (! $provinceId) {
                    throw new \RuntimeException("Province {$provinceCode} not found in global provinces.");
                }

                $cityCacheKey = $provinceId.'|'.$locationInfo['city'];
                $cityId = $cityCache[$cityCacheKey] ??= GlobalCity::where('name', $locationInfo['city'])
                    ->where('global_province_id', $provinceId)
                    ->value('id');

                if (! $cityId) {
                    throw new \RuntimeException("City {$locationInfo['city']} not found for province {$provinceCode}.");
                }

                $user = User::updateOrCreate(
                    ['email' => $employeeData['email']],
                    [
                        'name' => $employeeData['first_name'].' '.$employeeData['last_name'],
                        'password' => 'password',
                        'role' => 'employee',
                        'email_verified_at' => $now,
                    ]
                );

                $profileBlueprint = $this->buildProfileData(
                    $employeeData,
                    $category,
                    $categoryKey,
                    $categoryIndex,
                    $locationInfo,
                    $now,
                    $sinBase + $index
                );

                $profile = EmployeeProfile::updateOrCreate(
                    ['user_id' => $user->id],
                    $profileBlueprint['attributes']
                );

                $profile->global_province_id = $provinceId;
                $profile->global_city_id = $cityId;
                $profile->employment_status = $profileBlueprint['employment_status'];
                $profile->save();

                $this->syncSkills($profile, $category, $employeeData, $categoryIndex, $skillCache);
                $this->syncLanguages($profile, $category, $employeeData, $categoryIndex, $languageCache);
                $this->syncWorkExperiences($profile, $category, $categoryKey, $employeeData, $categoryIndex, $locationInfo, $now, $industryCache, $skillCache);
                $this->syncReferences($profile, $category, $categoryKey, $employeeData, $categoryIndex, $locationInfo, $referenceCounter);
                $this->syncServiceAreas($profile, $locationInfo, $category, $categoryIndex);
                $this->syncAvailability($profile, $category, $categoryIndex, $effectiveMonth);
                $this->syncCertifications($profile, $category, $employeeData, $categoryIndex, $now, $certificationCache);
            }
        });
    }

    /**
     * @return array<string, array>
     */
    protected function categoryDefinitions(): array
    {
        return [
            'electrical' => [
                'province_code' => 'ON',
                'locations' => [
                    'M5A' => [
                        'postal_code' => 'M5A',
                        'city' => 'Toronto',
                        'address_line_1' => '120 Front St W',
                        'address_line_2' => 'Suite 1500',
                        'secondary_service' => [
                            ['postal_code' => 'L4A', 'city' => 'Richmond Hill', 'province_code' => 'ON', 'travel_time_minutes' => 40, 'additional_charge' => 25.00],
                        ],
                    ],
                    'M4A' => [
                        'postal_code' => 'M4A',
                        'city' => 'Toronto',
                        'address_line_1' => '250 Lawrence Ave W',
                        'address_line_2' => 'Unit 402',
                        'secondary_service' => [
                            ['postal_code' => 'M1C', 'city' => 'Toronto', 'province_code' => 'ON', 'travel_time_minutes' => 35, 'additional_charge' => 20.00],
                        ],
                    ],
                    'M1B' => [
                        'postal_code' => 'M1B',
                        'city' => 'Toronto',
                        'address_line_1' => '88 Progress Ave',
                        'address_line_2' => 'Bay 6',
                        'secondary_service' => [
                            ['postal_code' => 'L5A', 'city' => 'Mississauga', 'province_code' => 'ON', 'travel_time_minutes' => 45, 'additional_charge' => 30.00],
                        ],
                    ],
                    'K1A' => [
                        'postal_code' => 'K1A',
                        'city' => 'Ottawa',
                        'address_line_1' => '395 Wellington St',
                        'address_line_2' => 'Level 2',
                        'secondary_service' => [
                            ['postal_code' => 'N1A', 'city' => 'Kitchener', 'province_code' => 'ON', 'travel_time_minutes' => 55, 'additional_charge' => 35.00],
                        ],
                    ],
                    'L6A' => [
                        'postal_code' => 'L6A',
                        'city' => 'Oakville',
                        'address_line_1' => '218 Lakeshore Rd',
                        'address_line_2' => 'Shop 4',
                        'secondary_service' => [
                            ['postal_code' => 'P1A', 'city' => 'Sudbury', 'province_code' => 'ON', 'travel_time_minutes' => 60, 'additional_charge' => 45.00],
                        ],
                    ],
                ],
                'area_code' => '647',
                'base_hourly_rates' => ['min' => 65, 'max' => 95, 'step' => 5],
                'travel_distance' => 80,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['canadian_citizen', 'permanent_resident', 'canadian_citizen', 'work_permit', 'permanent_resident'],
                'employment_statuses' => ['self_employed', 'employed', 'self_employed', 'employed', 'self_employed'],
                'overall_experience_levels' => ['expert', 'expert', 'advanced', 'expert', 'advanced'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '07:00', 'end_time' => '16:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '07:00', 'end_time' => '16:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '07:00', 'end_time' => '16:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 4, 'start_time' => '07:30', 'end_time' => '15:30', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 5, 'start_time' => '08:00', 'end_time' => '14:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 6, 'start_time' => '09:00', 'end_time' => '13:00', 'rate_multiplier' => 1.25],
                ],
                'skills' => [
                    ['name' => 'Electrician', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Electrical Panel Upgrade', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Smart Home Installation', 'proficiency' => 'advanced', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'French', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Mandarin', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Hindi', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Portuguese', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'Red Seal - Electrician', 'issued_years_ago' => 6, 'expiry_in_years' => null, 'status' => 'verified', 'certificate_number_prefix' => 'ELEC'],
                    ['name' => 'WHMIS 2015', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'WHM'],
                    ['name' => 'Working at Heights', 'issued_years_ago' => 2, 'expiry_in_years' => 1, 'status' => 'verified', 'certificate_number_prefix' => 'WAH'],
                ],
                'work_preferences' => [
                    ['en' => 'Commercial retrofits', 'fr' => 'Renovations commerciales'],
                    ['en' => 'Smart home integration', 'fr' => 'Integration domotique'],
                    ['en' => 'Emergency power restoration', 'fr' => 'Restauration electrique urgence'],
                    ['en' => 'Energy storage installations', 'fr' => 'Installation stockage energie'],
                    ['en' => 'EV charging deployment', 'fr' => 'Deploiement bornes VE'],
                ],
                'portfolio_tags' => ['ev-infrastructure', 'smart-panels', 'data-center', 'residential-upgrade', 'solar-storage'],
                'industry' => 'Electrical Services',
                'bio_templates' => [
                    'en' => ':first delivers :focus across the :city region, coordinating smart infrastructure upgrades end to end.',
                    'fr' => ':first realise :focus dans la region de :city en assurant la coordination complete des projets.',
                ],
                'focus_options' => [
                    'EV infrastructure upgrades for commercial fleets',
                    'hospital energy retrofits with clean backup power',
                    'multi-residential smart metering deployments',
                    'data center commissioning and load balancing',
                    'solar plus storage integration for condos',
                ],
                'company_names' => [
                    'BrightSpark Electrical',
                    'Metro Grid Services',
                    'Aurora Power Solutions',
                    'Greenline Electrical',
                    'VoltGuard Contractors',
                ],
                'previous_company_names' => [
                    'Citywide Electric',
                    'Prime Circuit Contractors',
                    'East End Electrical',
                    'Northern Wireworks',
                    'Harbour Power',
                ],
                'supervisors' => [
                    'Jamie Ellis',
                    'Morgan Reid',
                    'Taylor Brooks',
                    'Jordan Singh',
                    'Casey Clarke',
                ],
                'emergency_contacts' => [
                    ['name' => 'Morgan Thompson', 'relationship' => 'Sibling'],
                    ['name' => 'Aiden Chen', 'relationship' => 'Partner'],
                    ['name' => 'Priya Patel', 'relationship' => 'Spouse'],
                    ['name' => 'Kelly Brooks', 'relationship' => 'Friend'],
                    ['name' => 'Noah Sinclair', 'relationship' => 'Sibling'],
                ],
            ],
            'culinary' => [
                'province_code' => 'QC',
                'locations' => [
                    'H3A' => [
                        'postal_code' => 'H3A',
                        'city' => 'Montreal',
                        'address_line_1' => '410 Rue Sherbrooke Ouest',
                        'address_line_2' => 'Cuisine atelier',
                        'secondary_service' => [
                            ['postal_code' => 'H1A', 'city' => 'Montreal', 'province_code' => 'QC', 'travel_time_minutes' => 30, 'additional_charge' => 18.00],
                        ],
                    ],
                    'G1A' => [
                        'postal_code' => 'G1A',
                        'city' => 'Quebec City',
                        'address_line_1' => '85 Rue Dalhousie',
                        'address_line_2' => 'Cuisine 2',
                        'secondary_service' => [
                            ['postal_code' => 'J4A', 'city' => 'Longueuil', 'province_code' => 'QC', 'travel_time_minutes' => 45, 'additional_charge' => 22.00],
                        ],
                    ],
                    'J4A' => [
                        'postal_code' => 'J4A',
                        'city' => 'Longueuil',
                        'address_line_1' => '1025 Boulevard Taschereau',
                        'address_line_2' => 'Suite 9',
                        'secondary_service' => [
                            ['postal_code' => 'J5A', 'city' => 'Saint-Jean-sur-Richelieu', 'province_code' => 'QC', 'travel_time_minutes' => 35, 'additional_charge' => 20.00],
                        ],
                    ],
                    'J5A' => [
                        'postal_code' => 'J5A',
                        'city' => 'Saint-Jean-sur-Richelieu',
                        'address_line_1' => '215 Rue Foch',
                        'address_line_2' => 'Cuisine studio',
                        'secondary_service' => [
                            ['postal_code' => 'J7A', 'city' => 'Laval', 'province_code' => 'QC', 'travel_time_minutes' => 40, 'additional_charge' => 24.00],
                        ],
                    ],
                    'J1A' => [
                        'postal_code' => 'J1A',
                        'city' => 'Sherbrooke',
                        'address_line_1' => '60 Rue King Ouest',
                        'address_line_2' => 'Atelier 3',
                        'secondary_service' => [
                            ['postal_code' => 'G1A', 'city' => 'Quebec City', 'province_code' => 'QC', 'travel_time_minutes' => 60, 'additional_charge' => 28.00],
                        ],
                    ],
                ],
                'area_code' => '514',
                'base_hourly_rates' => ['min' => 30, 'max' => 55, 'step' => 4],
                'travel_distance' => 45,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['canadian_citizen', 'permanent_resident', 'canadian_citizen', 'permanent_resident', 'work_permit'],
                'employment_statuses' => ['employed', 'self_employed', 'employed', 'self_employed', 'employed'],
                'overall_experience_levels' => ['expert', 'advanced', 'advanced', 'advanced', 'expert'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '10:00', 'end_time' => '20:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '12:00', 'end_time' => '22:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '12:00', 'end_time' => '22:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 4, 'start_time' => '14:00', 'end_time' => '23:00', 'rate_multiplier' => 1.10],
                    ['day_of_week' => 5, 'start_time' => '15:00', 'end_time' => '23:30', 'rate_multiplier' => 1.15],
                    ['day_of_week' => 6, 'start_time' => '16:00', 'end_time' => '23:30', 'rate_multiplier' => 1.25],
                ],
                'skills' => [
                    ['name' => 'Executive Chef', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Sous Chef', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Catering Chef', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Food Safety Inspector', 'proficiency' => 'intermediate', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'French', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'English', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'French', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'French', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Italian', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'French', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'English', 'proficiency' => 'fluent', 'primary' => false],
                        ['name' => 'Portuguese (Brazilian)', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                    [
                        ['name' => 'French', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'German', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'Food Safe Level 1', 'issued_years_ago' => 3, 'expiry_in_years' => 5, 'status' => 'verified', 'certificate_number_prefix' => 'FSL'],
                    ['name' => 'ServSafe Food Handler', 'issued_years_ago' => 2, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'SAFE'],
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                ],
                'work_preferences' => [
                    ['en' => 'Seasonal tasting menus', 'fr' => 'Menus degustation saisonniers'],
                    ['en' => 'Farm to table sourcing', 'fr' => 'Approvisionnement ferme table'],
                    ['en' => 'Culinary workshops', 'fr' => 'Ateliers culinaires'],
                    ['en' => 'Large scale banquets', 'fr' => 'Banquets grande echelle'],
                    ['en' => 'Pastry innovation labs', 'fr' => 'Laboratoires patisserie'],
                ],
                'portfolio_tags' => ['farm-to-table', 'banquet', 'plated-dinners', 'culinary-workshops', 'pastry-showcases'],
                'industry' => 'Restaurant',
                'bio_templates' => [
                    'en' => ':first leads :focus, pairing regional producers with refined service models across :city.',
                    'fr' => ':first dirige :focus en reliant producteurs locaux et service raffine a :city.',
                ],
                'focus_options' => [
                    'farm to table tasting experiences for private clubs',
                    'seasonal banquet programs for heritage venues',
                    'culinary workshops and chef training intensives',
                    'large scale catering with zero waste operations',
                    'pastry innovation menus for boutique hotels',
                ],
                'company_names' => [
                    'Atelier Montreal',
                    'Riviere Gastronomie',
                    'Maison Laurent',
                    'Cuisine Summit',
                    'Bistro Panorama',
                ],
                'previous_company_names' => [
                    'Brasserie Vieux-Port',
                    'Hotel Royale Dining',
                    'Cafe Plateau',
                    'Auberge de Quebec',
                    'Le Marche Gourmet',
                ],
                'supervisors' => [
                    'Lucie Bernard',
                    'Marc Pelletier',
                    'Isabelle Roy',
                    'Andre Gagne',
                    'Sophie Moreau',
                ],
                'emergency_contacts' => [
                    ['name' => 'Julien Tremblay', 'relationship' => 'Partner'],
                    ['name' => 'Amelie Gagnon', 'relationship' => 'Sibling'],
                    ['name' => 'Clara Boucher', 'relationship' => 'Parent'],
                    ['name' => 'Nicolas Lefebvre', 'relationship' => 'Friend'],
                    ['name' => 'Helene Parent', 'relationship' => 'Sibling'],
                ],
            ],
            'events' => [
                'province_code' => 'BC',
                'locations' => [
                    'V5A' => [
                        'postal_code' => 'V5A',
                        'city' => 'Vancouver',
                        'address_line_1' => '1380 Burrard St',
                        'address_line_2' => 'Studio 3',
                        'secondary_service' => [
                            ['postal_code' => 'V6A', 'city' => 'Vancouver', 'province_code' => 'BC', 'travel_time_minutes' => 25, 'additional_charge' => 18.00],
                        ],
                    ],
                    'V6A' => [
                        'postal_code' => 'V6A',
                        'city' => 'Vancouver',
                        'address_line_1' => '90 Alexander St',
                        'address_line_2' => 'Warehouse B',
                        'secondary_service' => [
                            ['postal_code' => 'V3A', 'city' => 'Burnaby', 'province_code' => 'BC', 'travel_time_minutes' => 30, 'additional_charge' => 22.00],
                        ],
                    ],
                    'V3A' => [
                        'postal_code' => 'V3A',
                        'city' => 'Burnaby',
                        'address_line_1' => '6400 Willingdon Ave',
                        'address_line_2' => 'Suite 215',
                        'secondary_service' => [
                            ['postal_code' => 'V4A', 'city' => 'Richmond', 'province_code' => 'BC', 'travel_time_minutes' => 35, 'additional_charge' => 24.00],
                        ],
                    ],
                    'V4A' => [
                        'postal_code' => 'V4A',
                        'city' => 'Richmond',
                        'address_line_1' => '5200 River Rd',
                        'address_line_2' => 'Bay 8',
                        'secondary_service' => [
                            ['postal_code' => 'V8A', 'city' => 'Victoria', 'province_code' => 'BC', 'travel_time_minutes' => 55, 'additional_charge' => 30.00],
                        ],
                    ],
                    'V8A' => [
                        'postal_code' => 'V8A',
                        'city' => 'Victoria',
                        'address_line_1' => '950 Wharf St',
                        'address_line_2' => 'Event hub',
                        'secondary_service' => [
                            ['postal_code' => 'V5A', 'city' => 'Vancouver', 'province_code' => 'BC', 'travel_time_minutes' => 60, 'additional_charge' => 32.00],
                        ],
                    ],
                ],
                'area_code' => '604',
                'base_hourly_rates' => ['min' => 32, 'max' => 55, 'step' => 3],
                'travel_distance' => 60,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['permanent_resident', 'canadian_citizen', 'work_permit', 'canadian_citizen', 'permanent_resident'],
                'employment_statuses' => ['self_employed', 'self_employed', 'employed', 'self_employed', 'employed'],
                'overall_experience_levels' => ['advanced', 'expert', 'advanced', 'advanced', 'expert'],
                'availability_template' => [
                    ['day_of_week' => 2, 'start_time' => '11:00', 'end_time' => '20:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '11:00', 'end_time' => '22:00', 'rate_multiplier' => 1.05],
                    ['day_of_week' => 4, 'start_time' => '12:00', 'end_time' => '23:30', 'rate_multiplier' => 1.10],
                    ['day_of_week' => 5, 'start_time' => '13:00', 'end_time' => '23:59', 'rate_multiplier' => 1.15],
                    ['day_of_week' => 6, 'start_time' => '14:00', 'end_time' => '23:59', 'rate_multiplier' => 1.25],
                    ['day_of_week' => 0, 'start_time' => '10:00', 'end_time' => '18:00', 'rate_multiplier' => 1.05],
                ],
                'skills' => [
                    ['name' => 'Event Coordinator', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Lighting Technician', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Sound Engineer', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Event Photographer', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'DJ', 'proficiency' => 'advanced', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Punjabi', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Mandarin', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Cantonese', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Tagalog', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                    ['name' => 'Serving It Right (BC)', 'issued_years_ago' => 2, 'expiry_in_years' => 5, 'status' => 'verified', 'certificate_number_prefix' => 'SIR'],
                    ['name' => 'Special Event Security License', 'issued_years_ago' => 1, 'expiry_in_years' => 2, 'status' => 'verified', 'certificate_number_prefix' => 'EVT'],
                ],
                'work_preferences' => [
                    ['en' => 'Immersive brand launches', 'fr' => 'Lancements immersifs'],
                    ['en' => 'Hybrid conference production', 'fr' => 'Production conferences hybrides'],
                    ['en' => 'Festival stage management', 'fr' => 'Gestion scenes festival'],
                    ['en' => 'Wedding lighting design', 'fr' => 'Eclairage mariages'],
                    ['en' => 'Community cultural events', 'fr' => 'Evenements communautaires'],
                ],
                'portfolio_tags' => ['immersive-launches', 'festival-stages', 'wedding-production', 'conference-av', 'hybrid-events'],
                'industry' => 'Event Planning',
                'bio_templates' => [
                    'en' => ':first curates :focus with full production leadership across :city and the Lower Mainland.',
                    'fr' => ':first orchestre :focus en assurant la production complete a :city et dans la region.',
                ],
                'focus_options' => [
                    'immersive product launches with lighting design',
                    'hybrid conferences with multi language streams',
                    'music festival stage management and crew leadership',
                    'luxury wedding lighting and AV direction',
                    'non profit galas with donor experience design',
                ],
                'company_names' => [
                    'Pacific Event Lab',
                    'Coastline Productions',
                    'Harbour AV Collective',
                    'Summit Light & Sound',
                    'Aurora Event Studio',
                ],
                'previous_company_names' => [
                    'West Coast AV',
                    'Metro Event Crew',
                    'Cascadia Productions',
                    'Urban Canvas Events',
                    'Soundstage Collective',
                ],
                'supervisors' => [
                    'Helen Wu',
                    'Parminder Gill',
                    'Liam Carter',
                    'Noah Kim',
                    'Melissa Chan',
                ],
                'emergency_contacts' => [
                    ['name' => 'Simran Singh', 'relationship' => 'Sibling'],
                    ['name' => 'Luis Martinez', 'relationship' => 'Partner'],
                    ['name' => 'Mai Nguyen', 'relationship' => 'Sibling'],
                    ['name' => 'Jordan Morgan', 'relationship' => 'Friend'],
                    ['name' => 'Alex Zhao', 'relationship' => 'Sibling'],
                ],
            ],
            'hvac' => [
                'province_code' => 'AB',
                'locations' => [
                    'T2A' => [
                        'postal_code' => 'T2A',
                        'city' => 'Calgary',
                        'address_line_1' => '4500 4 Ave SE',
                        'address_line_2' => 'Shop 12',
                        'secondary_service' => [
                            ['postal_code' => 'T3A', 'city' => 'Calgary', 'province_code' => 'AB', 'travel_time_minutes' => 25, 'additional_charge' => 18.00],
                        ],
                    ],
                    'T3A' => [
                        'postal_code' => 'T3A',
                        'city' => 'Calgary',
                        'address_line_1' => '133 Crowfoot Way NW',
                        'address_line_2' => 'Unit 205',
                        'secondary_service' => [
                            ['postal_code' => 'T5A', 'city' => 'Edmonton', 'province_code' => 'AB', 'travel_time_minutes' => 45, 'additional_charge' => 28.00],
                        ],
                    ],
                    'T5A' => [
                        'postal_code' => 'T5A',
                        'city' => 'Edmonton',
                        'address_line_1' => '7015 104 Ave NW',
                        'address_line_2' => 'Bay 7',
                        'secondary_service' => [
                            ['postal_code' => 'T8A', 'city' => 'Fort McMurray', 'province_code' => 'AB', 'travel_time_minutes' => 60, 'additional_charge' => 35.00],
                        ],
                    ],
                    'T8A' => [
                        'postal_code' => 'T8A',
                        'city' => 'Fort McMurray',
                        'address_line_1' => '9714 Hardin St',
                        'address_line_2' => 'Mechanical bay',
                        'secondary_service' => [
                            ['postal_code' => 'T4A', 'city' => 'Red Deer', 'province_code' => 'AB', 'travel_time_minutes' => 50, 'additional_charge' => 30.00],
                        ],
                    ],
                    'T4A' => [
                        'postal_code' => 'T4A',
                        'city' => 'Red Deer',
                        'address_line_1' => '120 Burnt Lake Trail',
                        'address_line_2' => 'Suite 16',
                        'secondary_service' => [
                            ['postal_code' => 'T2A', 'city' => 'Calgary', 'province_code' => 'AB', 'travel_time_minutes' => 55, 'additional_charge' => 32.00],
                        ],
                    ],
                ],
                'area_code' => '403',
                'base_hourly_rates' => ['min' => 55, 'max' => 85, 'step' => 4],
                'travel_distance' => 90,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['canadian_citizen', 'permanent_resident', 'canadian_citizen', 'work_permit', 'permanent_resident'],
                'employment_statuses' => ['self_employed', 'employed', 'self_employed', 'employed', 'self_employed'],
                'overall_experience_levels' => ['expert', 'expert', 'advanced', 'advanced', 'expert'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '07:30', 'end_time' => '17:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '07:30', 'end_time' => '17:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '07:30', 'end_time' => '17:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 4, 'start_time' => '07:30', 'end_time' => '17:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 5, 'start_time' => '08:00', 'end_time' => '13:00', 'rate_multiplier' => 1.05],
                    ['day_of_week' => 6, 'start_time' => '08:00', 'end_time' => '12:00', 'rate_multiplier' => 1.20],
                ],
                'skills' => [
                    ['name' => 'HVAC Technician', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Plumber', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Gas Line Installation', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Furnace Repair', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Air Conditioning Repair', 'proficiency' => 'advanced', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'French', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Tagalog', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Punjabi', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Japanese', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'HVAC Technician License', 'issued_years_ago' => 4, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'HVAC'],
                    ['name' => 'Red Seal - Plumber', 'issued_years_ago' => 5, 'expiry_in_years' => null, 'status' => 'verified', 'certificate_number_prefix' => 'RSP'],
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                ],
                'work_preferences' => [
                    ['en' => 'Commercial boiler retrofits', 'fr' => 'Retrofits chaudiere commercial'],
                    ['en' => 'Emergency call outs', 'fr' => 'Interventions urgence'],
                    ['en' => 'Energy efficiency audits', 'fr' => 'Audits efficacite energetique'],
                    ['en' => 'Heat pump deployments', 'fr' => 'Installations thermopompe'],
                    ['en' => 'Industrial ventilation balancing', 'fr' => 'Equilibrage ventilation industrielle'],
                ],
                'portfolio_tags' => ['boiler-upgrades', 'chiller-optimization', 'northern-pipeline', 'emergency-repairs', 'ventilation-balancing'],
                'industry' => 'HVAC Company',
                'bio_templates' => [
                    'en' => ':first manages :focus while coordinating safety and commissioning across :city job sites.',
                    'fr' => ':first gere :focus en coordonnant securite et mise en service sur les chantiers de :city.',
                ],
                'focus_options' => [
                    'district energy retrofits for civic buildings',
                    'hospital HVAC upgrades with redundant systems',
                    'oil sands camp climate system maintenance',
                    'mid rise hydronic conversion projects',
                    'aerothermal heat pump deployments for schools',
                ],
                'company_names' => [
                    'Prairie Climate Solutions',
                    'Calgary Comfort Systems',
                    'Northern Flow Mechanical',
                    'Summit Thermal Services',
                    'Evergreen Mechanical',
                ],
                'previous_company_names' => [
                    'Metro HVAC',
                    'Alberta Climate Control',
                    'Precision Plumbing',
                    'Red Deer Mechanical',
                    'Frontier Heating',
                ],
                'supervisors' => [
                    'Graham Peters',
                    'Lena Castillo',
                    'Isaac Romero',
                    'Amrita Singh',
                    'Caleb Nguyen',
                ],
                'emergency_contacts' => [
                    ['name' => 'Riley Fraser', 'relationship' => 'Partner'],
                    ['name' => 'Mila MacLeod', 'relationship' => 'Sibling'],
                    ['name' => 'Tyler Oconnor', 'relationship' => 'Sibling'],
                    ['name' => 'Parker Wallace', 'relationship' => 'Spouse'],
                    ['name' => 'Jamie Nakamura', 'relationship' => 'Sibling'],
                ],
            ],
            'cleaning' => [
                'province_code' => 'MB',
                'locations' => [
                    'R3A_main' => [
                        'postal_code' => 'R3A',
                        'city' => 'Winnipeg',
                        'address_line_1' => '321 Portage Ave',
                        'address_line_2' => 'Suite 401',
                        'secondary_service' => [
                            ['postal_code' => 'R2A', 'city' => 'Winnipeg', 'province_code' => 'MB', 'travel_time_minutes' => 25, 'additional_charge' => 15.00],
                        ],
                    ],
                    'R2A_main' => [
                        'postal_code' => 'R2A',
                        'city' => 'Winnipeg',
                        'address_line_1' => '980 Henderson Hwy',
                        'address_line_2' => 'Unit 12',
                        'secondary_service' => [
                            ['postal_code' => 'R7A', 'city' => 'Brandon', 'province_code' => 'MB', 'travel_time_minutes' => 50, 'additional_charge' => 25.00],
                        ],
                    ],
                    'R1A_main' => [
                        'postal_code' => 'R1A',
                        'city' => 'Winnipeg',
                        'address_line_1' => '75 Waterfront Dr',
                        'address_line_2' => 'Suite 210',
                        'secondary_service' => [
                            ['postal_code' => 'R3A', 'city' => 'Winnipeg', 'province_code' => 'MB', 'travel_time_minutes' => 20, 'additional_charge' => 12.00],
                        ],
                    ],
                    'R7A_main' => [
                        'postal_code' => 'R7A',
                        'city' => 'Brandon',
                        'address_line_1' => '120 10th St',
                        'address_line_2' => 'Bay 3',
                        'secondary_service' => [
                            ['postal_code' => 'R1A', 'city' => 'Winnipeg', 'province_code' => 'MB', 'travel_time_minutes' => 55, 'additional_charge' => 28.00],
                        ],
                    ],
                    'R3A_exchange' => [
                        'postal_code' => 'R3A',
                        'city' => 'Winnipeg',
                        'address_line_1' => '125 Bannatyne Ave',
                        'address_line_2' => 'Studio 5',
                        'secondary_service' => [
                            ['postal_code' => 'R2A', 'city' => 'Winnipeg', 'province_code' => 'MB', 'travel_time_minutes' => 22, 'additional_charge' => 14.00],
                        ],
                    ],
                ],
                'area_code' => '204',
                'base_hourly_rates' => ['min' => 24, 'max' => 38, 'step' => 2],
                'travel_distance' => 50,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['permanent_resident', 'canadian_citizen', 'canadian_citizen', 'permanent_resident', 'work_permit'],
                'employment_statuses' => ['employed', 'self_employed', 'employed', 'self_employed', 'employed'],
                'overall_experience_levels' => ['expert', 'advanced', 'advanced', 'expert', 'advanced'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '06:00', 'end_time' => '14:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '06:00', 'end_time' => '14:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '14:00', 'end_time' => '22:00', 'rate_multiplier' => 1.05],
                    ['day_of_week' => 4, 'start_time' => '14:00', 'end_time' => '22:00', 'rate_multiplier' => 1.05],
                    ['day_of_week' => 5, 'start_time' => '07:00', 'end_time' => '15:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 6, 'start_time' => '08:00', 'end_time' => '12:00', 'rate_multiplier' => 1.20],
                ],
                'skills' => [
                    ['name' => 'Deep Cleaning Specialist', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Disinfection Specialist', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Industrial Cleaner', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Hospital Cleaner', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Power Washing', 'proficiency' => 'intermediate', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'French', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Somali', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Tagalog', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Hindi', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'WHMIS 2015', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'WHM'],
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                    ['name' => 'Criminal Background Check', 'issued_years_ago' => 0, 'expiry_in_years' => 1, 'status' => 'verified', 'certificate_number_prefix' => 'CBC'],
                ],
                'work_preferences' => [
                    ['en' => 'Hospital isolation cleaning', 'fr' => 'Nettoyage isolation hospitalier'],
                    ['en' => 'Industrial shutdown detailing', 'fr' => 'Detallage arret industriel'],
                    ['en' => 'Post disaster remediation', 'fr' => 'Remediation apres sinistre'],
                    ['en' => 'Food plant sanitation', 'fr' => 'Sanitation usine alimentaire'],
                    ['en' => 'Campus custodial programs', 'fr' => 'Programmes entretien campus'],
                ],
                'portfolio_tags' => ['hospital-turnover', 'manufacturing-detail', 'flood-remediation', 'education-campus', 'heritage-cleaning'],
                'industry' => 'Cleaning Service',
                'bio_templates' => [
                    'en' => ':first leads :focus with rigorous compliance programs across :city and surrounding communities.',
                    'fr' => ':first pilote :focus avec des programmes conformes dans :city et les environs.',
                ],
                'focus_options' => [
                    'hospital isolation cleaning for regional health networks',
                    'industrial shutdown detailing for manufacturing plants',
                    'post disaster remediation for municipal facilities',
                    'food plant sanitation programs for packaging hubs',
                    'multi site janitorial coordination for education campuses',
                ],
                'company_names' => [
                    'Prairie Hygiene Group',
                    'Cleanline Manitoba',
                    'True North Sanitation',
                    'River City Facilities',
                    'Keystone Clean Team',
                ],
                'previous_company_names' => [
                    'Winnipeg Health Cleaners',
                    'Brandon Medical Sanitation',
                    'Metro Janitorial',
                    'Shield Industrial Cleaning',
                    'Prairie BioClean',
                ],
                'supervisors' => [
                    'Andrea Silva',
                    'Binh Tran',
                    'Monique Hardy',
                    'Samuel Ortiz',
                    'Farah Hassan',
                ],
                'emergency_contacts' => [
                    ['name' => 'Liam Clarke', 'relationship' => 'Partner'],
                    ['name' => 'Renee Fontaine', 'relationship' => 'Sibling'],
                    ['name' => 'Gavin Pelletier', 'relationship' => 'Parent'],
                    ['name' => 'Erin Kowalski', 'relationship' => 'Spouse'],
                    ['name' => 'Dev Banerjee', 'relationship' => 'Sibling'],
                ],
            ],
            'landscaping' => [
                'province_code' => 'SK',
                'locations' => [
                    'S7A_core' => [
                        'postal_code' => 'S7A',
                        'city' => 'Saskatoon',
                        'address_line_1' => '120 Spadina Cres',
                        'address_line_2' => 'Suite 18',
                        'secondary_service' => [
                            ['postal_code' => 'S4A', 'city' => 'Regina', 'province_code' => 'SK', 'travel_time_minutes' => 55, 'additional_charge' => 35.00],
                        ],
                    ],
                    'S4A_core' => [
                        'postal_code' => 'S4A',
                        'city' => 'Regina',
                        'address_line_1' => '200 Broad St',
                        'address_line_2' => 'Yard 6',
                        'secondary_service' => [
                            ['postal_code' => 'S7A', 'city' => 'Saskatoon', 'province_code' => 'SK', 'travel_time_minutes' => 55, 'additional_charge' => 35.00],
                        ],
                    ],
                    'S9A_core' => [
                        'postal_code' => 'S9A',
                        'city' => 'North Battleford',
                        'address_line_1' => '890 100 St',
                        'address_line_2' => 'Shop 2',
                        'secondary_service' => [
                            ['postal_code' => 'S4A', 'city' => 'Regina', 'province_code' => 'SK', 'travel_time_minutes' => 70, 'additional_charge' => 40.00],
                        ],
                    ],
                    'S7A_east' => [
                        'postal_code' => 'S7A',
                        'city' => 'Saskatoon',
                        'address_line_1' => '45 33rd St E',
                        'address_line_2' => 'Depot 4',
                        'secondary_service' => [
                            ['postal_code' => 'S9A', 'city' => 'North Battleford', 'province_code' => 'SK', 'travel_time_minutes' => 65, 'additional_charge' => 32.00],
                        ],
                    ],
                    'S4A_south' => [
                        'postal_code' => 'S4A',
                        'city' => 'Regina',
                        'address_line_1' => '17 Parliament Ave',
                        'address_line_2' => 'Barn 3',
                        'secondary_service' => [
                            ['postal_code' => 'S7A', 'city' => 'Saskatoon', 'province_code' => 'SK', 'travel_time_minutes' => 60, 'additional_charge' => 34.00],
                        ],
                    ],
                ],
                'area_code' => '306',
                'base_hourly_rates' => ['min' => 40, 'max' => 60, 'step' => 3],
                'travel_distance' => 120,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['canadian_citizen', 'permanent_resident', 'canadian_citizen', 'permanent_resident', 'canadian_citizen'],
                'employment_statuses' => ['self_employed', 'self_employed', 'employed', 'self_employed', 'employed'],
                'overall_experience_levels' => ['expert', 'advanced', 'advanced', 'expert', 'advanced'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '06:00', 'end_time' => '15:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '06:00', 'end_time' => '15:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '06:00', 'end_time' => '15:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 4, 'start_time' => '06:00', 'end_time' => '15:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 5, 'start_time' => '07:00', 'end_time' => '14:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 6, 'start_time' => '07:00', 'end_time' => '12:00', 'rate_multiplier' => 1.25],
                ],
                'skills' => [
                    ['name' => 'Landscaper', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Arborist', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Irrigation Specialist', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Snow Removal', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Tree Service', 'proficiency' => 'advanced', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Cree', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'French', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Ukrainian', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'German', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Polish', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'Tree Service Arborist', 'issued_years_ago' => 3, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'ARB'],
                    ['name' => 'Fall Protection', 'issued_years_ago' => 2, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'FALL'],
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                ],
                'work_preferences' => [
                    ['en' => 'Prairie drought planning', 'fr' => 'Planification secheresse prairie'],
                    ['en' => 'Native species restoration', 'fr' => 'Restauration especes natives'],
                    ['en' => 'Golf course maintenance', 'fr' => 'Entretien terrains golf'],
                    ['en' => 'Estate landscape management', 'fr' => 'Gestion paysage domaine'],
                    ['en' => 'Winter operations planning', 'fr' => 'Planification operations hiver'],
                ],
                'portfolio_tags' => ['urban-forestry', 'sports-turf', 'farmstead-design', 'residential-retreat', 'snow-control'],
                'industry' => 'Landscaping Company',
                'bio_templates' => [
                    'en' => ':first orchestrates :focus with season ready crews across :city and rural clients.',
                    'fr' => ':first orchestre :focus avec des equipes adapteees aux saisons a :city et chez les clients ruraux.',
                ],
                'focus_options' => [
                    'urban canopy renewal and forestry programs',
                    'sports field drainage and turf rebuilding',
                    'indigenous plant restoration for community spaces',
                    'large estate maintenance with four season crews',
                    'municipal snow and ice control planning',
                ],
                'company_names' => [
                    'Prairie Roots Outdoors',
                    'Sask Terrain Services',
                    'Northern Plains Landscape',
                    'Cathedral Groundskeeping',
                    'Riverbend Outdoor Works',
                ],
                'previous_company_names' => [
                    'Greenbelt Maintenance',
                    'Fieldcrest Landscaping',
                    'SnowShield Services',
                    'Saskatoon Arboreal',
                    'Canopy Care',
                ],
                'supervisors' => [
                    'Tara McLeod',
                    'Brent Sinclair',
                    'Elias Cardinal',
                    'Maya Kowalski',
                    'Oliver Jensen',
                ],
                'emergency_contacts' => [
                    ['name' => 'Logan Johnson', 'relationship' => 'Sibling'],
                    ['name' => 'Skye Cardinal', 'relationship' => 'Partner'],
                    ['name' => 'Drew Watson', 'relationship' => 'Friend'],
                    ['name' => 'Paul Neufeld', 'relationship' => 'Sibling'],
                    ['name' => 'River Bear', 'relationship' => 'Parent'],
                ],
            ],
            'healthcare' => [
                'province_code' => 'NS',
                'locations' => [
                    'B3A_core' => [
                        'postal_code' => 'B3A',
                        'city' => 'Halifax',
                        'address_line_1' => '2020 Brunswick St',
                        'address_line_2' => 'Suite 405',
                        'secondary_service' => [
                            ['postal_code' => 'B4A', 'city' => 'Kentville', 'province_code' => 'NS', 'travel_time_minutes' => 50, 'additional_charge' => 24.00],
                        ],
                    ],
                    'B1A_core' => [
                        'postal_code' => 'B1A',
                        'city' => 'Sydney',
                        'address_line_1' => '66 Prince St',
                        'address_line_2' => 'Unit 9',
                        'secondary_service' => [
                            ['postal_code' => 'B3A', 'city' => 'Halifax', 'province_code' => 'NS', 'travel_time_minutes' => 60, 'additional_charge' => 28.00],
                        ],
                    ],
                    'B4A_core' => [
                        'postal_code' => 'B4A',
                        'city' => 'Kentville',
                        'address_line_1' => '12 Cornwallis St',
                        'address_line_2' => 'Clinic 3',
                        'secondary_service' => [
                            ['postal_code' => 'B1A', 'city' => 'Sydney', 'province_code' => 'NS', 'travel_time_minutes' => 65, 'additional_charge' => 30.00],
                        ],
                    ],
                    'B3A_dartmouth' => [
                        'postal_code' => 'B3A',
                        'city' => 'Halifax',
                        'address_line_1' => '40 Alderney Dr',
                        'address_line_2' => 'Unit 16',
                        'secondary_service' => [
                            ['postal_code' => 'B4A', 'city' => 'Kentville', 'province_code' => 'NS', 'travel_time_minutes' => 52, 'additional_charge' => 23.00],
                        ],
                    ],
                    'B1A_harbour' => [
                        'postal_code' => 'B1A',
                        'city' => 'Sydney',
                        'address_line_1' => '109 Esplanade',
                        'address_line_2' => 'Suite 2',
                        'secondary_service' => [
                            ['postal_code' => 'B3A', 'city' => 'Halifax', 'province_code' => 'NS', 'travel_time_minutes' => 62, 'additional_charge' => 29.00],
                        ],
                    ],
                ],
                'area_code' => '902',
                'base_hourly_rates' => ['min' => 28, 'max' => 40, 'step' => 2],
                'travel_distance' => 40,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['canadian_citizen', 'permanent_resident', 'canadian_citizen', 'permanent_resident', 'canadian_citizen'],
                'employment_statuses' => ['employed', 'self_employed', 'employed', 'self_employed', 'employed'],
                'overall_experience_levels' => ['expert', 'advanced', 'advanced', 'advanced', 'advanced'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '08:00', 'end_time' => '18:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '08:00', 'end_time' => '18:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '12:00', 'end_time' => '20:00', 'rate_multiplier' => 1.05],
                    ['day_of_week' => 4, 'start_time' => '08:00', 'end_time' => '16:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 5, 'start_time' => '08:00', 'end_time' => '14:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 6, 'start_time' => '09:00', 'end_time' => '13:00', 'rate_multiplier' => 1.15],
                ],
                'skills' => [
                    ['name' => 'Caregiver', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Home Health Aide', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Massage Therapist', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Personal Trainer', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Yoga Instructor', 'proficiency' => 'advanced', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'French', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Arabic', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Tagalog', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Somali', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'Personal Support Worker Certificate', 'issued_years_ago' => 4, 'expiry_in_years' => null, 'status' => 'verified', 'certificate_number_prefix' => 'PSW'],
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                    ['name' => 'Vulnerable Sector Check', 'issued_years_ago' => 0, 'expiry_in_years' => 1, 'status' => 'verified', 'certificate_number_prefix' => 'VSC'],
                ],
                'work_preferences' => [
                    ['en' => 'Home respite care', 'fr' => 'Soins repit a domicile'],
                    ['en' => 'Hospital discharge support', 'fr' => 'Soutien sortie hopital'],
                    ['en' => 'Wellness coaching for seniors', 'fr' => 'Encadrement bien etre seniors'],
                    ['en' => 'Rehabilitation massage sessions', 'fr' => 'Seances massage readaptation'],
                    ['en' => 'Mobility focused yoga sessions', 'fr' => 'Seances yoga mobilite'],
                ],
                'portfolio_tags' => ['respite-care', 'wellness-plans', 'hospital-transition', 'community-yoga', 'palliative-support'],
                'industry' => 'Home Care',
                'bio_templates' => [
                    'en' => ':first coordinates :focus with interdisciplinary teams across :city and surrounding coastal communities.',
                    'fr' => ':first coordonne :focus avec des equipes interdisciplinaires a :city et dans les communautes voisines.',
                ],
                'focus_options' => [
                    'complex mobility support for multi diagnosis clients',
                    'post operative recovery coaching for seniors',
                    'neurological care routines with allied therapists',
                    'integrated wellness programming for caregivers',
                    'palliative comfort plans with allied clinicians',
                ],
                'company_names' => [
                    'Harbour Care Collective',
                    'Atlantic Wellness Support',
                    'Maritime Home Health',
                    'Lighthouse Wellness Team',
                    'Coastal Compassion Services',
                ],
                'previous_company_names' => [
                    'Nova Scotia Health Authority',
                    'Sydney Community Care',
                    'Kentville Support Hub',
                    'Halifax Wellness Centre',
                    'Atlantic Hospice Outreach',
                ],
                'supervisors' => [
                    'Patricia Fraser',
                    'Gavin LeBlanc',
                    'Noelle Singh',
                    'Fiona MacKay',
                    'Iman Yusuf',
                ],
                'emergency_contacts' => [
                    ['name' => 'Callum MacDonald', 'relationship' => 'Sibling'],
                    ['name' => 'Isla Samson', 'relationship' => 'Partner'],
                    ['name' => 'Yasmin Ahmed', 'relationship' => 'Spouse'],
                    ['name' => 'Theo Poirier', 'relationship' => 'Parent'],
                    ['name' => 'Owen Doucette', 'relationship' => 'Sibling'],
                ],
            ],
            'childcare' => [
                'province_code' => 'NB',
                'locations' => [
                    'E3A_core' => [
                        'postal_code' => 'E3A',
                        'city' => 'Fredericton',
                        'address_line_1' => '678 Queen St',
                        'address_line_2' => 'Suite 14',
                        'secondary_service' => [
                            ['postal_code' => 'E1A', 'city' => 'Moncton', 'province_code' => 'NB', 'travel_time_minutes' => 45, 'additional_charge' => 20.00],
                        ],
                    ],
                    'E1A_core' => [
                        'postal_code' => 'E1A',
                        'city' => 'Moncton',
                        'address_line_1' => '110 Main St',
                        'address_line_2' => 'Unit 5',
                        'secondary_service' => [
                            ['postal_code' => 'E2A', 'city' => 'Saint John', 'province_code' => 'NB', 'travel_time_minutes' => 50, 'additional_charge' => 24.00],
                        ],
                    ],
                    'E2A_core' => [
                        'postal_code' => 'E2A',
                        'city' => 'Saint John',
                        'address_line_1' => '200 Prince William St',
                        'address_line_2' => 'Suite 202',
                        'secondary_service' => [
                            ['postal_code' => 'E3A', 'city' => 'Fredericton', 'province_code' => 'NB', 'travel_time_minutes' => 55, 'additional_charge' => 26.00],
                        ],
                    ],
                    'E3A_south' => [
                        'postal_code' => 'E3A',
                        'city' => 'Fredericton',
                        'address_line_1' => '88 Smythe St',
                        'address_line_2' => 'Studio 2',
                        'secondary_service' => [
                            ['postal_code' => 'E1A', 'city' => 'Moncton', 'province_code' => 'NB', 'travel_time_minutes' => 48, 'additional_charge' => 22.00],
                        ],
                    ],
                    'E1A_west' => [
                        'postal_code' => 'E1A',
                        'city' => 'Moncton',
                        'address_line_1' => '45 Mountain Rd',
                        'address_line_2' => 'Suite 7',
                        'secondary_service' => [
                            ['postal_code' => 'E2A', 'city' => 'Saint John', 'province_code' => 'NB', 'travel_time_minutes' => 52, 'additional_charge' => 25.00],
                        ],
                    ],
                ],
                'area_code' => '506',
                'base_hourly_rates' => ['min' => 22, 'max' => 32, 'step' => 2],
                'travel_distance' => 30,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['canadian_citizen', 'permanent_resident', 'canadian_citizen', 'permanent_resident', 'canadian_citizen'],
                'employment_statuses' => ['self_employed', 'employed', 'self_employed', 'employed', 'self_employed'],
                'overall_experience_levels' => ['advanced', 'advanced', 'advanced', 'advanced', 'advanced'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '07:30', 'end_time' => '17:30', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '07:30', 'end_time' => '17:30', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '08:00', 'end_time' => '18:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 4, 'start_time' => '07:30', 'end_time' => '17:30', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 5, 'start_time' => '08:00', 'end_time' => '16:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 6, 'start_time' => '09:00', 'end_time' => '12:00', 'rate_multiplier' => 1.15],
                ],
                'skills' => [
                    ['name' => 'Babysitter', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Nanny', 'proficiency' => 'expert', 'primary' => false],
                    ['name' => 'Tutor', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Personal Organizer', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Life Coach', 'proficiency' => 'intermediate', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'French', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'English', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Hindi', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'French', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Arabic', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'French', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'Early Childhood Education Certificate', 'issued_years_ago' => 5, 'expiry_in_years' => null, 'status' => 'verified', 'certificate_number_prefix' => 'ECE'],
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                    ['name' => 'Criminal Background Check', 'issued_years_ago' => 0, 'expiry_in_years' => 1, 'status' => 'verified', 'certificate_number_prefix' => 'CBC'],
                ],
                'work_preferences' => [
                    ['en' => 'STEM activity planning', 'fr' => 'Planification activites STEM'],
                    ['en' => 'Bilingual homework support', 'fr' => 'Soutien devoirs bilingue'],
                    ['en' => 'Family schedule coordination', 'fr' => 'Coordination horaires familial'],
                    ['en' => 'Sensory play workshops', 'fr' => 'Ateliers jeux sensoriels'],
                    ['en' => 'Outdoor learning adventures', 'fr' => 'Aventures apprentissage plein air'],
                ],
                'portfolio_tags' => ['stem-labs', 'language-camps', 'family-systems', 'sensory-studios', 'nature-clubs'],
                'industry' => 'Childcare',
                'bio_templates' => [
                    'en' => ':first designs :focus for families around :city with inclusive planning and communication.',
                    'fr' => ':first conçoit :focus pour les familles de :city avec planification et communication inclusives.',
                ],
                'focus_options' => [
                    'Reggio inspired preschool programs',
                    'bilingual tutoring cohorts for newcomers',
                    'family logistics coaching for busy households',
                    'inclusive sensory programming for neurodiverse youth',
                    'outdoor learning expeditions for nature clubs',
                ],
                'company_names' => [
                    'River Valley Learning',
                    'Acadian Family Hub',
                    'Harbour Youth Studio',
                    'Fundy Play Collective',
                    'North Shore Enrichment',
                ],
                'previous_company_names' => [
                    'Fredericton Kids Co-op',
                    'Moncton Early Years',
                    'Saint John Literacy Lab',
                    'Fundy Childcare Network',
                    'Acadian Youth Services',
                ],
                'supervisors' => [
                    'Chantal Boudreau',
                    'Ethan Wright',
                    'Mina Farah',
                    'Pierre Levesque',
                    'Alisha Verma',
                ],
                'emergency_contacts' => [
                    ['name' => 'Luc LeBlanc', 'relationship' => 'Sibling'],
                    ['name' => 'Arjun Sharma', 'relationship' => 'Partner'],
                    ['name' => 'Sara Ouellet', 'relationship' => 'Parent'],
                    ['name' => 'Mark Reid', 'relationship' => 'Sibling'],
                    ['name' => 'Grace Campbell', 'relationship' => 'Parent'],
                ],
            ],
            'automotive' => [
                'province_code' => 'NL',
                'locations' => [
                    'A1A_core' => [
                        'postal_code' => 'A1A',
                        'city' => "St. John's",
                        'address_line_1' => '85 Water St',
                        'address_line_2' => 'Service bay',
                        'secondary_service' => [
                            ['postal_code' => 'A0A', 'city' => 'Corner Brook', 'province_code' => 'NL', 'travel_time_minutes' => 50, 'additional_charge' => 28.00],
                        ],
                    ],
                    'A0A_core' => [
                        'postal_code' => 'A0A',
                        'city' => 'Corner Brook',
                        'address_line_1' => '22 West St',
                        'address_line_2' => 'Unit 1',
                        'secondary_service' => [
                            ['postal_code' => 'A1A', 'city' => "St. John's", 'province_code' => 'NL', 'travel_time_minutes' => 55, 'additional_charge' => 30.00],
                        ],
                    ],
                    'A1A_east' => [
                        'postal_code' => 'A1A',
                        'city' => "St. John's",
                        'address_line_1' => '430 Torbay Rd',
                        'address_line_2' => 'Garage 4',
                        'secondary_service' => [
                            ['postal_code' => 'A0A', 'city' => 'Corner Brook', 'province_code' => 'NL', 'travel_time_minutes' => 50, 'additional_charge' => 28.00],
                        ],
                    ],
                    'A0A_north' => [
                        'postal_code' => 'A0A',
                        'city' => 'Corner Brook',
                        'address_line_1' => '18 Riverside Dr',
                        'address_line_2' => 'Shop 7',
                        'secondary_service' => [
                            ['postal_code' => 'A1A', 'city' => "St. John's", 'province_code' => 'NL', 'travel_time_minutes' => 55, 'additional_charge' => 30.00],
                        ],
                    ],
                    'A1A_harbour' => [
                        'postal_code' => 'A1A',
                        'city' => "St. John's",
                        'address_line_1' => '12 Harbour Dr',
                        'address_line_2' => 'Inspection bay',
                        'secondary_service' => [
                            ['postal_code' => 'A0A', 'city' => 'Corner Brook', 'province_code' => 'NL', 'travel_time_minutes' => 52, 'additional_charge' => 27.00],
                        ],
                    ],
                ],
                'area_code' => '709',
                'base_hourly_rates' => ['min' => 45, 'max' => 70, 'step' => 4],
                'travel_distance' => 70,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['canadian_citizen', 'permanent_resident', 'canadian_citizen', 'permanent_resident', 'canadian_citizen'],
                'employment_statuses' => ['self_employed', 'self_employed', 'employed', 'self_employed', 'employed'],
                'overall_experience_levels' => ['expert', 'advanced', 'advanced', 'expert', 'advanced'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '07:00', 'end_time' => '17:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '07:00', 'end_time' => '17:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '07:00', 'end_time' => '17:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 4, 'start_time' => '07:00', 'end_time' => '17:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 5, 'start_time' => '07:00', 'end_time' => '15:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 6, 'start_time' => '08:00', 'end_time' => '13:00', 'rate_multiplier' => 1.20],
                ],
                'skills' => [
                    ['name' => 'Auto Mechanic', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Diesel Mechanic', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Tow Truck Driver', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Auto Body Repair', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Vehicle Inspector', 'proficiency' => 'advanced', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'French', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Portuguese (Brazilian)', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'German', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Italian', 'proficiency' => 'conversational', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'Commercial Vehicle License', 'issued_years_ago' => 3, 'expiry_in_years' => 5, 'status' => 'verified', 'certificate_number_prefix' => 'CVL'],
                    ['name' => "Class 5 Driver's License", 'issued_years_ago' => 8, 'expiry_in_years' => 5, 'status' => 'verified', 'certificate_number_prefix' => 'CLS5'],
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                ],
                'work_preferences' => [
                    ['en' => 'Offshore fleet maintenance', 'fr' => 'Maintenance flotte offshore'],
                    ['en' => 'Emergency roadside coverage', 'fr' => 'Couverture depannage'],
                    ['en' => 'Diesel rebuild projects', 'fr' => 'Reconstruction diesel'],
                    ['en' => 'Collision repair planning', 'fr' => 'Planification carrosserie'],
                    ['en' => 'Pre purchase inspections', 'fr' => 'Inspections preachat'],
                ],
                'portfolio_tags' => ['fleet-overhaul', 'coastal-rescue', 'diesel-diagnostics', 'collision-restoration', 'inspection-lab'],
                'industry' => 'Auto Repair Shop',
                'bio_templates' => [
                    'en' => ':first handles :focus supporting operators throughout :city and coastal routes.',
                    'fr' => ':first gere :focus pour les exploitants de :city et des routes cotieres.',
                ],
                'focus_options' => [
                    'fleet maintenance for offshore vessels',
                    '24-7 roadside recovery operations',
                    'heavy equipment drivetrain rebuilds',
                    'precision auto body restoration',
                    'commercial vehicle inspection services',
                ],
                'company_names' => [
                    'Avalon Motor Works',
                    'Harbourline Diesel',
                    'North Atlantic Recovery',
                    'Signal Hill Collision',
                    'Long Range Auto Diagnostics',
                ],
                'previous_company_names' => [
                    "St. Johns Transit Garage",
                    'Corner Brook Heavy Equipment',
                    'Atlantic Tow Service',
                    'Harbour Collision Centre',
                    'Mariner Fleet Services',
                ],
                'supervisors' => [
                    'Declan Burke',
                    'Isla Walsh',
                    'Connor Doyle',
                    'Maeve Kennedy',
                    'Rory Flynn',
                ],
                'emergency_contacts' => [
                    ['name' => 'Aoife Obrien', 'relationship' => 'Spouse'],
                    ['name' => 'Kyle MacIsaac', 'relationship' => 'Sibling'],
                    ['name' => 'Seamus Gallagher', 'relationship' => 'Partner'],
                    ['name' => 'Nora Hanley', 'relationship' => 'Sibling'],
                    ['name' => 'Farah Khan', 'relationship' => 'Spouse'],
                ],
            ],
            'remote' => [
                'province_code' => null,
                'locations' => [
                    'C1A_core' => [
                        'postal_code' => 'C1A',
                        'city' => 'Charlottetown',
                        'province_code' => 'PE',
                        'address_line_1' => '180 Kent St',
                        'address_line_2' => 'Suite 402',
                        'area_code' => '902',
                        'secondary_service' => [
                            ['postal_code' => 'C0A', 'city' => 'Summerside', 'province_code' => 'PE', 'travel_time_minutes' => 35, 'additional_charge' => 18.00],
                        ],
                    ],
                    'C0A_core' => [
                        'postal_code' => 'C0A',
                        'city' => 'Summerside',
                        'province_code' => 'PE',
                        'address_line_1' => '98 Water St',
                        'address_line_2' => 'Unit 6',
                        'area_code' => '902',
                        'secondary_service' => [
                            ['postal_code' => 'C1A', 'city' => 'Charlottetown', 'province_code' => 'PE', 'travel_time_minutes' => 35, 'additional_charge' => 18.00],
                        ],
                    ],
                    'Y1A_core' => [
                        'postal_code' => 'Y1A',
                        'city' => 'Whitehorse',
                        'province_code' => 'YT',
                        'address_line_1' => '210 Main St',
                        'address_line_2' => 'Tech hub',
                        'area_code' => '867',
                        'secondary_service' => [
                            ['postal_code' => 'X1A', 'city' => 'Yellowknife', 'province_code' => 'NT', 'travel_time_minutes' => 75, 'additional_charge' => 32.00],
                        ],
                    ],
                    'X1A_core' => [
                        'postal_code' => 'X1A',
                        'city' => 'Yellowknife',
                        'province_code' => 'NT',
                        'address_line_1' => '4908 50 St',
                        'address_line_2' => 'Operations bay',
                        'area_code' => '867',
                        'secondary_service' => [
                            ['postal_code' => 'X0A', 'city' => 'Iqaluit', 'province_code' => 'NU', 'travel_time_minutes' => 80, 'additional_charge' => 35.00],
                        ],
                    ],
                    'X0A_core' => [
                        'postal_code' => 'X0A',
                        'city' => 'Iqaluit',
                        'province_code' => 'NU',
                        'address_line_1' => '328 Federal Rd',
                        'address_line_2' => 'Hangar 2',
                        'area_code' => '867',
                        'secondary_service' => [
                            ['postal_code' => 'Y1A', 'city' => 'Whitehorse', 'province_code' => 'YT', 'travel_time_minutes' => 85, 'additional_charge' => 38.00],
                        ],
                    ],
                ],
                'area_code' => '902',
                'base_hourly_rates' => ['min' => 48, 'max' => 75, 'step' => 5],
                'travel_distance' => 150,
                'has_vehicle' => true,
                'has_tools_equipment' => true,
                'is_insured' => true,
                'has_wcb_coverage' => true,
                'work_authorizations' => ['canadian_citizen', 'permanent_resident', 'canadian_citizen', 'permanent_resident', 'work_permit'],
                'employment_statuses' => ['self_employed', 'employed', 'self_employed', 'employed', 'self_employed'],
                'overall_experience_levels' => ['advanced', 'expert', 'advanced', 'expert', 'advanced'],
                'availability_template' => [
                    ['day_of_week' => 1, 'start_time' => '08:00', 'end_time' => '18:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 2, 'start_time' => '08:00', 'end_time' => '18:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 3, 'start_time' => '10:00', 'end_time' => '20:00', 'rate_multiplier' => 1.05],
                    ['day_of_week' => 4, 'start_time' => '08:00', 'end_time' => '18:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 5, 'start_time' => '08:00', 'end_time' => '16:00', 'rate_multiplier' => 1.00],
                    ['day_of_week' => 6, 'start_time' => '09:00', 'end_time' => '14:00', 'rate_multiplier' => 1.20],
                ],
                'skills' => [
                    ['name' => 'IT Support', 'proficiency' => 'expert', 'primary' => true],
                    ['name' => 'Network Installation', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Security Camera Installation', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Courier', 'proficiency' => 'advanced', 'primary' => false],
                    ['name' => 'Heavy Equipment Operator', 'proficiency' => 'advanced', 'primary' => false],
                ],
                'language_sets' => [
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'French', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Inuktitut', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Cree', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Tagalog', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                    [
                        ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                        ['name' => 'Spanish', 'proficiency' => 'fluent', 'primary' => false],
                    ],
                ],
                'certifications' => [
                    ['name' => 'First Aid & CPR Level C', 'issued_years_ago' => 1, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'CPR'],
                    ['name' => 'WHMIS 2015', 'issued_years_ago' => 2, 'expiry_in_years' => 3, 'status' => 'verified', 'certificate_number_prefix' => 'WHM'],
                    ['name' => 'Commercial Vehicle License', 'issued_years_ago' => 4, 'expiry_in_years' => 5, 'status' => 'verified', 'certificate_number_prefix' => 'CVL'],
                ],
                'work_preferences' => [
                    ['en' => 'Remote site IT stabilization', 'fr' => 'Stabilisation TI sites eloignes'],
                    ['en' => 'Community broadband deployments', 'fr' => 'Deploiements large bande communautaires'],
                    ['en' => 'Seasonal supply chain planning', 'fr' => 'Planification chaine approvisionnement saisonniere'],
                    ['en' => 'Aerial drone inspections', 'fr' => 'Inspections drone aerien'],
                    ['en' => 'Winter runway maintenance', 'fr' => 'Entretien pistes hiver'],
                ],
                'portfolio_tags' => ['broadband-rollout', 'telehealth-support', 'arctic-logistics', 'airstrip-maintenance', 'drone-surveys'],
                'industry' => 'Telecommunications',
                'bio_templates' => [
                    'en' => ':first delivers :focus across remote hubs from :city with readiness for extreme conditions.',
                    'fr' => ':first fournit :focus dans les regions eloignees a partir de :city en s adaptant aux conditions extremes.',
                ],
                'focus_options' => [
                    'community broadband upgrades',
                    'northern healthcare IT support',
                    'remote logistics coordination',
                    'aerial infrastructure inspections',
                    'winter runway readiness programs',
                ],
                'company_names' => [
                    'Northlink Remote Services',
                    'Polar Tech Support',
                    'Frontier Logistics Collective',
                    'Aurora Systems Group',
                    'Arctic Airfield Partners',
                ],
                'previous_company_names' => [
                    'Island IT Co-op',
                    'Whitehorse Network Hub',
                    'Yellowknife Supply Group',
                    'Nunavut Digital Services',
                    'PEI Logistics Centre',
                ],
                'supervisors' => [
                    'Elliot Green',
                    'Sasha Noor',
                    'Indira Patel',
                    'Rowan Blake',
                    'Henrik Sorensen',
                ],
                'emergency_contacts' => [
                    ['name' => 'Morgan Hawthorne', 'relationship' => 'Sibling'],
                    ['name' => 'Jamie True', 'relationship' => 'Partner'],
                    ['name' => 'Lara Wolfe', 'relationship' => 'Sibling'],
                    ['name' => 'Noor Fox', 'relationship' => 'Parent'],
                    ['name' => 'Isla Noor', 'relationship' => 'Sibling'],
                ],
            ],
        ];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    protected function employeeRoster(): array
    {
        return [
            // Electrical & Smart Infrastructure (Ontario)
            ['first_name' => 'Avery', 'last_name' => 'Thompson', 'email' => 'avery.thompson@skilloncall.test', 'category' => 'electrical', 'date_of_birth' => '1985-03-12', 'location_key' => 'M5A'],
            ['first_name' => 'Riley', 'last_name' => 'Chen', 'email' => 'riley.chen@skilloncall.test', 'category' => 'electrical', 'date_of_birth' => '1988-07-24', 'location_key' => 'M4A', 'language_overrides' => [
                ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                ['name' => 'Mandarin', 'proficiency' => 'fluent', 'primary' => false],
            ]],
            ['first_name' => 'Jordan', 'last_name' => 'Patel', 'email' => 'jordan.patel@skilloncall.test', 'category' => 'electrical', 'date_of_birth' => '1982-11-05', 'location_key' => 'M1B', 'work_authorization' => 'permanent_resident'],
            ['first_name' => 'Taylor', 'last_name' => 'Brooks', 'email' => 'taylor.brooks@skilloncall.test', 'category' => 'electrical', 'date_of_birth' => '1990-02-18', 'location_key' => 'K1A', 'work_authorization' => 'work_permit'],
            ['first_name' => 'Morgan', 'last_name' => 'Sinclair', 'email' => 'morgan.sinclair@skilloncall.test', 'category' => 'electrical', 'date_of_birth' => '1986-09-30', 'location_key' => 'L6A'],

            // Culinary & Hospitality (Quebec)
            ['first_name' => 'Camille', 'last_name' => 'Tremblay', 'email' => 'camille.tremblay@skilloncall.test', 'category' => 'culinary', 'date_of_birth' => '1984-04-22', 'location_key' => 'H3A'],
            ['first_name' => 'Etienne', 'last_name' => 'Gagnon', 'email' => 'etienne.gagnon@skilloncall.test', 'category' => 'culinary', 'date_of_birth' => '1987-08-13', 'location_key' => 'G1A'],
            ['first_name' => 'Laurence', 'last_name' => 'Boucher', 'email' => 'laurence.boucher@skilloncall.test', 'category' => 'culinary', 'date_of_birth' => '1991-12-02', 'location_key' => 'J4A', 'employment_status' => 'self_employed'],
            ['first_name' => 'Maude', 'last_name' => 'Lefebvre', 'email' => 'maude.lefebvre@skilloncall.test', 'category' => 'culinary', 'date_of_birth' => '1993-06-17', 'location_key' => 'J5A'],
            ['first_name' => 'Olivier', 'last_name' => 'Parent', 'email' => 'olivier.parent@skilloncall.test', 'category' => 'culinary', 'date_of_birth' => '1980-10-29', 'location_key' => 'J1A', 'work_authorization' => 'work_permit'],

            // Event & Production (British Columbia)
            ['first_name' => 'Harper', 'last_name' => 'Singh', 'email' => 'harper.singh@skilloncall.test', 'category' => 'events', 'date_of_birth' => '1989-03-11', 'location_key' => 'V5A'],
            ['first_name' => 'Quinn', 'last_name' => 'Martinez', 'email' => 'quinn.martinez@skilloncall.test', 'category' => 'events', 'date_of_birth' => '1992-09-27', 'location_key' => 'V6A'],
            ['first_name' => 'Dakota', 'last_name' => 'Nguyen', 'email' => 'dakota.nguyen@skilloncall.test', 'category' => 'events', 'date_of_birth' => '1986-01-09', 'location_key' => 'V3A'],
            ['first_name' => 'Reese', 'last_name' => 'Morgan', 'email' => 'reese.morgan@skilloncall.test', 'category' => 'events', 'date_of_birth' => '1994-05-18', 'location_key' => 'V4A', 'employment_status' => 'employed'],
            ['first_name' => 'Skyler', 'last_name' => 'Zhao', 'email' => 'skyler.zhao@skilloncall.test', 'category' => 'events', 'date_of_birth' => '1990-08-30', 'location_key' => 'V8A'],

            // HVAC & Plumbing Specialists (Alberta)
            ['first_name' => 'Logan', 'last_name' => 'Fraser', 'email' => 'logan.fraser@skilloncall.test', 'category' => 'hvac', 'date_of_birth' => '1983-02-14', 'location_key' => 'T2A'],
            ['first_name' => 'Peyton', 'last_name' => 'MacLeod', 'email' => 'peyton.macleod@skilloncall.test', 'category' => 'hvac', 'date_of_birth' => '1987-07-22', 'location_key' => 'T3A'],
            ['first_name' => 'Casey', 'last_name' => 'Oconnor', 'email' => 'casey.oconnor@skilloncall.test', 'category' => 'hvac', 'date_of_birth' => '1985-11-19', 'location_key' => 'T5A'],
            ['first_name' => 'Drew', 'last_name' => 'Wallace', 'email' => 'drew.wallace@skilloncall.test', 'category' => 'hvac', 'date_of_birth' => '1991-01-05', 'location_key' => 'T8A', 'work_authorization' => 'work_permit'],
            ['first_name' => 'Blair', 'last_name' => 'Nakamura', 'email' => 'blair.nakamura@skilloncall.test', 'category' => 'hvac', 'date_of_birth' => '1988-04-28', 'location_key' => 'T4A'],

            // Facility & Cleaning Specialists (Manitoba)
            ['first_name' => 'Sydney', 'last_name' => 'Clarke', 'email' => 'sydney.clarke@skilloncall.test', 'category' => 'cleaning', 'date_of_birth' => '1982-06-06', 'location_key' => 'R3A_main'],
            ['first_name' => 'Alexis', 'last_name' => 'Fontaine', 'email' => 'alexis.fontaine@skilloncall.test', 'category' => 'cleaning', 'date_of_birth' => '1989-09-14', 'location_key' => 'R2A_main', 'employment_status' => 'self_employed'],
            ['first_name' => 'Jamie', 'last_name' => 'Pelletier', 'email' => 'jamie.pelletier@skilloncall.test', 'category' => 'cleaning', 'date_of_birth' => '1993-03-03', 'location_key' => 'R1A_main'],
            ['first_name' => 'Robin', 'last_name' => 'Kowalski', 'email' => 'robin.kowalski@skilloncall.test', 'category' => 'cleaning', 'date_of_birth' => '1985-12-12', 'location_key' => 'R7A_main'],
            ['first_name' => 'Corey', 'last_name' => 'Banerjee', 'email' => 'corey.banerjee@skilloncall.test', 'category' => 'cleaning', 'date_of_birth' => '1990-07-25', 'location_key' => 'R3A_exchange'],

            // Landscaping & Outdoor (Saskatchewan)
            ['first_name' => 'Emery', 'last_name' => 'Johnson', 'email' => 'emery.johnson@skilloncall.test', 'category' => 'landscaping', 'date_of_birth' => '1984-05-21', 'location_key' => 'S7A_core'],
            ['first_name' => 'Rowan', 'last_name' => 'Cardinal', 'email' => 'rowan.cardinal@skilloncall.test', 'category' => 'landscaping', 'date_of_birth' => '1988-10-02', 'location_key' => 'S4A_core', 'language_overrides' => [
                ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                ['name' => 'Cree', 'proficiency' => 'fluent', 'primary' => false],
                ['name' => 'French', 'proficiency' => 'conversational', 'primary' => false],
            ]],
            ['first_name' => 'Jules', 'last_name' => 'Watson', 'email' => 'jules.watson@skilloncall.test', 'category' => 'landscaping', 'date_of_birth' => '1992-04-08', 'location_key' => 'S9A_core'],
            ['first_name' => 'Charlie', 'last_name' => 'Neufeld', 'email' => 'charlie.neufeld@skilloncall.test', 'category' => 'landscaping', 'date_of_birth' => '1986-08-16', 'location_key' => 'S7A_east'],
            ['first_name' => 'Casey', 'last_name' => 'Bear', 'email' => 'casey.bear@skilloncall.test', 'category' => 'landscaping', 'date_of_birth' => '1991-11-30', 'location_key' => 'S4A_south', 'work_authorization' => 'permanent_resident'],

            // Healthcare & Personal Support (Nova Scotia)
            ['first_name' => 'Avery', 'last_name' => 'MacDonald', 'email' => 'avery.macdonald@skilloncall.test', 'category' => 'healthcare', 'date_of_birth' => '1983-01-28', 'location_key' => 'B3A_core'],
            ['first_name' => 'Brielle', 'last_name' => 'Samson', 'email' => 'brielle.samson@skilloncall.test', 'category' => 'healthcare', 'date_of_birth' => '1989-07-09', 'location_key' => 'B1A_core'],
            ['first_name' => 'Noel', 'last_name' => 'Ahmed', 'email' => 'noel.ahmed@skilloncall.test', 'category' => 'healthcare', 'date_of_birth' => '1992-02-14', 'location_key' => 'B4A_core'],
            ['first_name' => 'Rowan', 'last_name' => 'Poirier', 'email' => 'rowan.poirier@skilloncall.test', 'category' => 'healthcare', 'date_of_birth' => '1994-09-03', 'location_key' => 'B3A_dartmouth', 'employment_status' => 'self_employed'],
            ['first_name' => 'Sasha', 'last_name' => 'Doucette', 'email' => 'sasha.doucette@skilloncall.test', 'category' => 'healthcare', 'date_of_birth' => '1987-05-26', 'location_key' => 'B1A_harbour', 'work_authorization' => 'permanent_resident'],

            // Childcare & Education (New Brunswick)
            ['first_name' => 'Elodie', 'last_name' => 'LeBlanc', 'email' => 'elodie.leblanc@skilloncall.test', 'category' => 'childcare', 'date_of_birth' => '1990-06-18', 'location_key' => 'E3A_core'],
            ['first_name' => 'Priya', 'last_name' => 'Sharma', 'email' => 'priya.sharma@skilloncall.test', 'category' => 'childcare', 'date_of_birth' => '1988-03-22', 'location_key' => 'E1A_core'],
            ['first_name' => 'Miles', 'last_name' => 'Ouellet', 'email' => 'miles.ouellet@skilloncall.test', 'category' => 'childcare', 'date_of_birth' => '1993-10-11', 'location_key' => 'E2A_core'],
            ['first_name' => 'Tessa', 'last_name' => 'Reid', 'email' => 'tessa.reid@skilloncall.test', 'category' => 'childcare', 'date_of_birth' => '1985-12-28', 'location_key' => 'E3A_south', 'employment_status' => 'employed'],
            ['first_name' => 'Jonah', 'last_name' => 'Campbell', 'email' => 'jonah.campbell@skilloncall.test', 'category' => 'childcare', 'date_of_birth' => '1991-04-04', 'location_key' => 'E1A_west'],

            // Automotive & Transport (Newfoundland & Labrador)
            ['first_name' => 'Declan', 'last_name' => 'Obrien', 'email' => 'declan.obrien@skilloncall.test', 'category' => 'automotive', 'date_of_birth' => '1982-07-07', 'location_key' => 'A1A_core'],
            ['first_name' => 'Kelsey', 'last_name' => 'MacIsaac', 'email' => 'kelsey.macisaac@skilloncall.test', 'category' => 'automotive', 'date_of_birth' => '1987-11-23', 'location_key' => 'A0A_core'],
            ['first_name' => 'Finn', 'last_name' => 'Gallagher', 'email' => 'finn.gallagher@skilloncall.test', 'category' => 'automotive', 'date_of_birth' => '1985-02-02', 'location_key' => 'A1A_east'],
            ['first_name' => 'Rowan', 'last_name' => 'Hanley', 'email' => 'rowan.hanley@skilloncall.test', 'category' => 'automotive', 'date_of_birth' => '1989-09-15', 'location_key' => 'A0A_north', 'work_authorization' => 'permanent_resident'],
            ['first_name' => 'Mira', 'last_name' => 'Khan', 'email' => 'mira.khan@skilloncall.test', 'category' => 'automotive', 'date_of_birth' => '1992-01-25', 'location_key' => 'A1A_harbour'],

            // Remote Technical & Logistics (PEI, Territories)
            ['first_name' => 'Avery', 'last_name' => 'Hawthorne', 'email' => 'avery.hawthorne@skilloncall.test', 'category' => 'remote', 'date_of_birth' => '1986-06-12', 'location_key' => 'C1A_core'],
            ['first_name' => 'Peyton', 'last_name' => 'True', 'email' => 'peyton.true@skilloncall.test', 'category' => 'remote', 'date_of_birth' => '1991-08-08', 'location_key' => 'C0A_core', 'employment_status' => 'employed'],
            ['first_name' => 'Orion', 'last_name' => 'Wolfe', 'email' => 'orion.wolfe@skilloncall.test', 'category' => 'remote', 'date_of_birth' => '1984-03-19', 'location_key' => 'Y1A_core', 'language_overrides' => [
                ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
                ['name' => 'Cree', 'proficiency' => 'fluent', 'primary' => false],
            ]],
            ['first_name' => 'Leni', 'last_name' => 'Fox', 'email' => 'leni.fox@skilloncall.test', 'category' => 'remote', 'date_of_birth' => '1990-11-05', 'location_key' => 'X1A_core'],
            ['first_name' => 'Cedar', 'last_name' => 'Noor', 'email' => 'cedar.noor@skilloncall.test', 'category' => 'remote', 'date_of_birth' => '1995-02-27', 'location_key' => 'X0A_core', 'work_authorization' => 'work_permit'],
        ];
    }

    /**
     * @param  array<string, mixed>  $employeeData
     * @param  array<string, mixed>  $category
     * @return array<string, mixed>
     */
    protected function resolveLocation(array $employeeData, array $category): array
    {
        $locationKey = $employeeData['location_key'] ?? null;
        $locations = $category['locations'] ?? [];

        if ($locationKey && isset($locations[$locationKey])) {
            return $locations[$locationKey];
        }

        if ($locationKey) {
            foreach ($locations as $candidate) {
                if (($candidate['postal_code'] ?? null) === $locationKey) {
                    return $candidate;
                }
            }
            throw new \RuntimeException("Location key {$locationKey} not defined in category {$employeeData['category']}.");
        }

        return reset($locations);
    }

    /**
     * @param  array<string, mixed>  $employeeData
     * @param  array<string, mixed>  $category
     */
    protected function buildProfileData(
        array $employeeData,
        array $category,
        string $categoryKey,
        int $categoryIndex,
        array $location,
        Carbon $now,
        int $sinNumber
    ): array {
        $areaCode = $this->resolveAreaCode($category, $location);
        $slug = $this->buildSlug($employeeData, $categoryKey);
        $focus = $this->determineFocus($employeeData, $category, $categoryIndex);

        $bioTemplates = $category['bio_templates'] ?? ['en' => ':first is active in :city.', 'fr' => ':first est actif a :city.'];
        $bioEn = str_replace(
            [':first', ':city', ':focus'],
            [$employeeData['first_name'], $location['city'], $focus],
            $bioTemplates['en'] ?? $bioTemplates['en'] ?? ''
        );
        $bioFr = str_replace(
            [':first', ':city', ':focus'],
            [$employeeData['first_name'], $location['city'], $focus],
            $bioTemplates['fr'] ?? $bioTemplates['en'] ?? ''
        );
        $bio = trim($bioEn)."\n\n".trim($bioFr);

        $workAuthorization = $employeeData['work_authorization']
            ?? $category['work_authorizations'][$categoryIndex % max(count($category['work_authorizations'] ?? [1]), 1)] ?? 'canadian_citizen';

        $employmentStatus = $employeeData['employment_status']
            ?? $category['employment_statuses'][$categoryIndex % max(count($category['employment_statuses'] ?? [1]), 1)] ?? 'self_employed';

        $overallExperience = $employeeData['overall_experience']
            ?? $category['overall_experience_levels'][$categoryIndex % max(count($category['overall_experience_levels'] ?? [1]), 1)] ?? 'advanced';

        $rates = $category['base_hourly_rates'] ?? ['min' => 30, 'max' => 60, 'step' => 5];
        $step = $rates['step'] ?? 5;
        $defaultMin = min($rates['min'] + ($categoryIndex * $step), $rates['max']);
        $hourlyRateMin = round($employeeData['hourly_rate_min'] ?? $defaultMin, 2);
        $hourlyRateMax = round($employeeData['hourly_rate_max'] ?? max($hourlyRateMin + 18, min($rates['max'], $hourlyRateMin + 24)), 2);

        $travelDistance = $employeeData['travel_distance_max']
            ?? (($category['travel_distance'] ?? 50) + (($categoryIndex % 3) * 5));

        $hasVehicle = $employeeData['has_vehicle'] ?? ($category['has_vehicle'] ?? true);
        $hasTools = $employeeData['has_tools_equipment'] ?? ($category['has_tools_equipment'] ?? true);
        $isInsured = $employeeData['is_insured'] ?? ($category['is_insured'] ?? true);
        $hasWcbCoverage = $employeeData['has_wcb_coverage'] ?? ($category['has_wcb_coverage'] ?? true);

        $requiresBackground = in_array($categoryKey, ['healthcare', 'childcare', 'cleaning', 'culinary', 'remote'], true)
            || ($employeeData['has_criminal_background_check'] ?? ($categoryIndex % 2 === 0));
        $backgroundCheckDate = $requiresBackground
            ? $now->copy()->subMonths(2 + ($categoryIndex % 5))->startOfMonth()
            : null;

        $workPermitExpiry = in_array($workAuthorization, ['work_permit', 'student_permit'], true)
            ? $now->copy()->addYears(2)->addMonths($categoryIndex % 6)->toDateString()
            : null;

        $availabilitySchedule = $this->buildAvailabilityScheduleArray($category['availability_template'] ?? [], $categoryIndex);

        $workPreferences = $this->buildWorkPreferences($category, $categoryIndex);

        $portfolioPhotos = $this->buildPortfolioPhotos($category, $categoryKey, $slug, $categoryIndex);

        $certificationSummary = $this->summarizeCertifications($category, $categoryIndex, $now);

        $socialMediaLinks = [
            'linkedin' => 'https://www.linkedin.com/in/'.$slug,
            'website' => 'https://'.$slug.'.'.$categoryKey.'.ca',
            'instagram' => 'https://instagram.com/'.$slug,
        ];

        $phoneSuffix = $this->phoneSuffixFromEmail($employeeData['email']);
        $phone = $areaCode.'-555-'.$phoneSuffix;

        $contact = $category['emergency_contacts'][$categoryIndex % max(count($category['emergency_contacts'] ?? [1]), 1)] ?? ['name' => 'Emergency Contact', 'relationship' => 'Contact'];
        $emergencySuffix = $this->incrementPhoneSuffix($phoneSuffix, 173);
        $emergencyPhone = $areaCode.'-444-'.$emergencySuffix;

        $profileCompletedAt = $now->copy()->subDays(5 + ($categoryIndex % 11))->setTime(14, 0, 0);

        $provinceCode = $location['province_code'] ?? $category['province_code'] ?? 'ON';

        return [
            'attributes' => [
                'first_name' => $employeeData['first_name'],
                'last_name' => $employeeData['last_name'],
                'phone' => $phone,
                'profile_photo' => "https://cdn.skilloncall.ca/profiles/{$categoryKey}/{$slug}.jpg",
                'date_of_birth' => $employeeData['date_of_birth'],
                'bio' => $bio,
                'overall_experience' => $overallExperience,
                'address_line_1' => $location['address_line_1'] ?? '123 Main St',
                'address_line_2' => $location['address_line_2'] ?? null,
                'city' => $location['city'],
                'province' => $provinceCode,
                'postal_code' => $location['postal_code'],
                'country' => 'Canada',
                'sin_number' => str_pad((string) $sinNumber, 9, '0', STR_PAD_LEFT),
                'work_authorization' => $workAuthorization,
                'work_permit_expiry' => $workPermitExpiry,
                'has_criminal_background_check' => $requiresBackground,
                'background_check_date' => $backgroundCheckDate,
                'hourly_rate_min' => $hourlyRateMin,
                'hourly_rate_max' => $hourlyRateMax,
                'travel_distance_max' => $travelDistance,
                'has_vehicle' => $hasVehicle,
                'has_tools_equipment' => $hasTools,
                'is_insured' => $isInsured,
                'has_wcb_coverage' => $hasWcbCoverage,
                'emergency_contact_name' => $contact['name'],
                'emergency_contact_phone' => $emergencyPhone,
                'emergency_contact_relationship' => $contact['relationship'],
                'availability_schedule' => $availabilitySchedule,
                'work_preferences' => $workPreferences,
                'portfolio_photos' => $portfolioPhotos,
                'certifications' => $certificationSummary,
                'social_media_links' => $socialMediaLinks,
                'is_profile_complete' => true,
                'onboarding_step' => 6,
                'profile_completed_at' => $profileCompletedAt,
            ],
            'employment_status' => $employmentStatus,
        ];
    }

    protected function syncSkills(
        EmployeeProfile $profile,
        array $category,
        array $employeeData,
        int $categoryIndex,
        array &$skillCache
    ): void {
        $skills = $this->resolveSkills($category, $employeeData, $categoryIndex);

        $syncPayload = [];
        foreach ($skills as $index => $skill) {
            $skillId = $this->skillId($skill['name'], $skillCache);
            $syncPayload[$skillId] = [
                'proficiency_level' => $skill['proficiency'] ?? 'advanced',
                'is_primary_skill' => $skill['primary'] ?? ($index === 0),
            ];
        }

        $profile->skills()->sync($syncPayload);
    }
    protected function syncLanguages(
        EmployeeProfile $profile,
        array $category,
        array $employeeData,
        int $categoryIndex,
        array &$languageCache
    ): void {
        $languages = $this->resolveLanguages($category, $employeeData, $categoryIndex);

        $syncPayload = [];
        $hasPrimary = false;
        foreach ($languages as $language) {
            if (! empty($language['primary'])) {
                $hasPrimary = true;
            }
        }

        foreach ($languages as $index => $language) {
            $langId = $this->languageId($language['name'], $languageCache);
            $syncPayload[$langId] = [
                'proficiency_level' => $language['proficiency'] ?? 'fluent',
                'is_primary_language' => $language['primary'] ?? (!$hasPrimary && $index === 0),
            ];
        }

        $profile->languages()->sync($syncPayload);
    }
    protected function syncWorkExperiences(
        EmployeeProfile $profile,
        array $category,
        string $categoryKey,
        array $employeeData,
        int $categoryIndex,
        array $location,
        Carbon $now,
        array &$industryCache,
        array &$skillCache
    ): void {
        $profile->workExperiences()->delete();

        $focus = $this->determineFocus($employeeData, $category, $categoryIndex);
        $skills = $this->resolveSkills($category, $employeeData, $categoryIndex);
        $primarySkill = $skills[0]['name'] ?? 'General Contractor';
        $secondarySkill = $skills[1]['name'] ?? $primarySkill;

        $industryName = $category['industry'] ?? 'General Contractor';
        $industryId = $this->industryId($industryName, $industryCache);

        $currentCompany = $category['company_names'][$categoryIndex % max(count($category['company_names'] ?? [1]), 1)] ?? 'Company One';
        $previousCompany = $category['previous_company_names'][$categoryIndex % max(count($category['previous_company_names'] ?? [1]), 1)] ?? 'Company Two';

        $supervisor = $category['supervisors'][$categoryIndex % max(count($category['supervisors'] ?? [1]), 1)] ?? 'Supervisor Name';
        $areaCode = $this->resolveAreaCode($category, $location);

        $currentStart = $now->copy()->subYears(2 + ($categoryIndex % 3))->startOfMonth();
        $previousStart = $now->copy()->subYears(6 + ($categoryIndex % 4))->startOfMonth();
        $previousEnd = $previousStart->copy()->addYears(3 + ($categoryIndex % 2))->endOfMonth();

        $currentDescriptionEn = 'Leads '.$focus.' initiatives for '.$currentCompany.' across '.$location['city'].'.';
        $currentDescriptionFr = 'Dirige des initiatives de '.$focus.' pour '.$currentCompany.' a '.$location['city'].'.';

        $previousDescriptionEn = 'Delivered '.$secondarySkill.' services at '.$previousCompany.' supporting regional operations.';
        $previousDescriptionFr = 'A fourni des services de '.$secondarySkill.' chez '.$previousCompany.' pour soutenir les operations regionales.';

        $experiences = [
            [
                'global_skill_id' => $this->skillId($primarySkill, $skillCache),
                'global_industry_id' => $industryId,
                'company_name' => $currentCompany,
                'job_title' => 'Lead '.$primarySkill,
                'start_date' => $currentStart,
                'end_date' => null,
                'is_current' => true,
                'description' => $currentDescriptionEn."\n\n".$currentDescriptionFr,
                'supervisor_name' => $supervisor,
                'supervisor_contact' => $areaCode.'-777-'.$this->incrementPhoneSuffix($this->phoneSuffixFromEmail($employeeData['email']), 211),
            ],
            [
                'global_skill_id' => $this->skillId($secondarySkill, $skillCache),
                'global_industry_id' => $industryId,
                'company_name' => $previousCompany,
                'job_title' => 'Senior '.$secondarySkill,
                'start_date' => $previousStart,
                'end_date' => $previousEnd,
                'is_current' => false,
                'description' => $previousDescriptionEn."\n\n".$previousDescriptionFr,
                'supervisor_name' => $supervisor,
                'supervisor_contact' => $areaCode.'-888-'.$this->incrementPhoneSuffix($this->phoneSuffixFromEmail($employeeData['email']), 337),
            ],
        ];

        $profile->workExperiences()->createMany($experiences);
    }

    protected function syncReferences(
        EmployeeProfile $profile,
        array $category,
        string $categoryKey,
        array $employeeData,
        int $categoryIndex,
        array $location,
        int &$referenceCounter
    ): void {
        $profile->references()->delete();

        $referenceNames = [
            'Jordan Ellis', 'Taylor Reid', 'Morgan Blake', 'Jamie Singh', 'Casey Martin',
            'Alexis Turner', 'Hayden Clarke', 'Riley Cooper', 'Quinn James', 'Parker Stone',
            'Sidney Harper', 'Ainsley Brooks', 'Devon Hayes', 'Shawn Porter', 'Jessie Doyle',
            'Briar Watts', 'Reagan Cole', 'Sky Patel', 'Sage Howard', 'Emerson Lane',
        ];

        $relationships = ['previous_employer', 'satisfied_client', 'previous_supervisor', 'colleague', 'business_partner'];
        $areaCode = $this->resolveAreaCode($category, $location);

        $focus = $this->determineFocus($employeeData, $category, $categoryIndex);
        $currentCompany = $category['company_names'][$categoryIndex % max(count($category['company_names'] ?? [1]), 1)] ?? 'Current Company';
        $previousCompany = $category['previous_company_names'][$categoryIndex % max(count($category['previous_company_names'] ?? [1]), 1)] ?? 'Previous Company';

        $references = [];
        for ($i = 0; $i < 2; $i++) {
            $name = $referenceNames[$referenceCounter % count($referenceNames)];
            $relationship = $relationships[($categoryIndex + $i) % count($relationships)];
            $company = $i === 0 ? $currentCompany : $previousCompany;
            $notesEn = ($i === 0
                ? 'Managed '.$focus.' delivery with outstanding quality.'
                : 'Provided reliable support on '.$focus.' engagements.')." Reference for {$employeeData['first_name']} {$employeeData['last_name']}.";
            $notesFr = ($i === 0
                ? 'A gere la prestation '.$focus.' avec une qualite remarquable.'
                : 'A fourni un soutien fiable sur les projets '.$focus.'.').' Reference pour '.$employeeData['first_name'].' '.$employeeData['last_name'].'.';

            $references[] = [
                'reference_name' => $name,
                'reference_phone' => $areaCode.'-669-'.$this->incrementPhoneSuffix($this->phoneSuffixFromEmail($employeeData['email']), 91 + ($i * 57)),
                'reference_email' => Str::slug($name, '.').'@reference.test',
                'relationship' => $relationship,
                'company_name' => $company,
                'notes' => $notesEn."\n\n".$notesFr,
                'permission_to_contact' => $i === 0 || ($categoryIndex % 2 === 0),
            ];

            $referenceCounter++;
        }

        $profile->references()->createMany($references);
    }

    protected function syncServiceAreas(
        EmployeeProfile $profile,
        array $location,
        array $category,
        int $categoryIndex
    ): void {
        $profile->serviceAreas()->delete();

        $provinceCode = $location['province_code'] ?? $category['province_code'] ?? 'ON';
        $primaryArea = [
            'postal_code' => $location['postal_code'],
            'city' => $location['city'],
            'province' => $provinceCode,
            'travel_time_minutes' => 20 + ($categoryIndex % 4) * 10,
            'additional_charge' => 0,
            'is_primary_area' => true,
        ];

        $secondary = $location['secondary_service'][0] ?? null;
        if (! $secondary) {
            foreach ($category['locations'] ?? [] as $key => $candidate) {
                if ($candidate['postal_code'] !== $location['postal_code']) {
                    $secondary = [
                        'postal_code' => $candidate['postal_code'],
                        'city' => $candidate['city'],
                        'province_code' => $candidate['province_code'] ?? $provinceCode,
                        'travel_time_minutes' => 35 + ($categoryIndex % 5) * 8,
                        'additional_charge' => 20.00 + ($categoryIndex % 3) * 5,
                    ];
                    break;
                }
            }
        }

        $serviceAreas = [$primaryArea];

        if ($secondary) {
            $serviceAreas[] = [
                'postal_code' => $secondary['postal_code'],
                'city' => $secondary['city'],
                'province' => $secondary['province_code'] ?? $provinceCode,
                'travel_time_minutes' => $secondary['travel_time_minutes'] ?? (35 + ($categoryIndex % 5) * 8),
                'additional_charge' => $secondary['additional_charge'] ?? 25.00,
                'is_primary_area' => false,
            ];
        }

        $profile->serviceAreas()->createMany($serviceAreas);
    }
    protected function syncAvailability(
        EmployeeProfile $profile,
        array $category,
        int $categoryIndex,
        string $effectiveMonth
    ): void {
        $profile->availability()->delete();

        $template = $category['availability_template'] ?? [];
        if (empty($template)) {
            return;
        }

        $records = [];
        foreach ($template as $entry) {
            $startTime = $this->shiftTime($entry['start_time'], ($categoryIndex % 3) * 5);
            $endTime = $this->shiftTime($entry['end_time'], ($categoryIndex % 2) * 5);

            $records[] = [
                'effective_month' => $effectiveMonth,
                'day_of_week' => $entry['day_of_week'],
                'start_time' => $startTime.':00',
                'end_time' => $endTime.':00',
                'is_available' => true,
                'rate_multiplier' => round(($entry['rate_multiplier'] ?? 1.00) + (($categoryIndex % 2) * 0.02), 2),
            ];
        }

        $profile->availability()->createMany($records);
    }
    protected function syncCertifications(
        EmployeeProfile $profile,
        array $category,
        array $employeeData,
        int $categoryIndex,
        Carbon $now,
        array &$certificationCache
    ): void {
        $profile->certifications()->delete();

        $certifications = $employeeData['certification_overrides'] ?? $category['certifications'] ?? [];
        if (empty($certifications)) {
            return;
        }

        $created = [];
        foreach ($certifications as $index => $cert) {
            $issuedDate = $now->copy()
                ->subYears($cert['issued_years_ago'] ?? 1)
                ->subMonths(($categoryIndex + $index) % 6)
                ->startOfMonth();

            $expiryDate = null;
            if (! empty($cert['expiry_in_years'])) {
                $expiryDate = $issuedDate->copy()->addYears($cert['expiry_in_years'])->endOfMonth();
            }

            $verificationStatus = $cert['status'] ?? 'verified';
            $verifiedAt = $verificationStatus === 'verified'
                ? $issuedDate->copy()->addWeeks(2)
                : null;

            $created[] = [
                'global_certification_id' => $this->certificationId($cert['name'], $certificationCache),
                'certificate_number' => ($cert['certificate_number_prefix'] ?? 'CERT').'-'.str_pad((string) $profile->id, 4, '0', STR_PAD_LEFT).'-'.str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT),
                'issued_date' => $issuedDate,
                'expiry_date' => $expiryDate,
                'certificate_file' => null,
                'verification_status' => $verificationStatus,
                'verified_at' => $verifiedAt,
            ];
        }

        $profile->certifications()->createMany($created);
    }
    protected function skillId(string $name, array &$cache): int
    {
        if (isset($cache[$name])) {
            return $cache[$name];
        }

        $id = GlobalSkill::where('name', $name)->value('id');
        if (! $id) {
            throw new \RuntimeException("Global skill {$name} not found.");
        }

        return $cache[$name] = $id;
    }

    protected function languageId(string $name, array &$cache): int
    {
        if (isset($cache[$name])) {
            return $cache[$name];
        }

        $id = GlobalLanguage::where('name', $name)->value('id');
        if (! $id) {
            throw new \RuntimeException("Global language {$name} not found.");
        }

        return $cache[$name] = $id;
    }

    protected function industryId(string $name, array &$cache): int
    {
        if (isset($cache[$name])) {
            return $cache[$name];
        }

        $id = GlobalIndustry::where('name', $name)->value('id');
        if (! $id) {
            throw new \RuntimeException("Global industry {$name} not found.");
        }

        return $cache[$name] = $id;
    }

    protected function certificationId(string $name, array &$cache): int
    {
        if (isset($cache[$name])) {
            return $cache[$name];
        }

        $id = GlobalCertification::where('name', $name)->value('id');
        if (! $id) {
            throw new \RuntimeException("Global certification {$name} not found.");
        }

        return $cache[$name] = $id;
    }

    /**
     * Helper methods
     */

    protected function resolveSkills(array $category, array $employeeData, int $categoryIndex): array
    {
        $skills = $employeeData['skill_overrides'] ?? $category['skills'] ?? [];
        if (! empty($employeeData['skill_additions'])) {
            $skills = array_merge($skills, $employeeData['skill_additions']);
        }

        if (empty($skills)) {
            $skills = [
                ['name' => 'General Contractor', 'proficiency' => 'advanced', 'primary' => true],
            ];
        }

        $hasPrimary = false;
        foreach ($skills as $skill) {
            if (! empty($skill['primary'])) {
                $hasPrimary = true;
                break;
            }
        }
        if (! $hasPrimary) {
            $skills[0]['primary'] = true;
        }

        return $skills;
    }

    protected function resolveLanguages(array $category, array $employeeData, int $categoryIndex): array
    {
        if (! empty($employeeData['language_overrides'])) {
            return $employeeData['language_overrides'];
        }

        $languageSets = $category['language_sets'] ?? [
            [
                ['name' => 'English', 'proficiency' => 'native', 'primary' => true],
            ],
        ];

        $languages = $languageSets[$categoryIndex % count($languageSets)];

        if (! empty($employeeData['language_additions'])) {
            foreach ($employeeData['language_additions'] as $addition) {
                $languages[] = $addition;
            }
        }

        return $languages;
    }

    protected function buildSlug(array $employeeData, string $categoryKey): string
    {
        $base = Str::slug($employeeData['first_name'].' '.$employeeData['last_name'], '-');
        return $base.'-'.$categoryKey;
    }

    protected function determineFocus(array $employeeData, array $category, int $categoryIndex): string
    {
        if (! empty($employeeData['focus_override'])) {
            return $employeeData['focus_override'];
        }

        $focusOptions = $category['focus_options'] ?? ['specialized service delivery'];
        return $focusOptions[$categoryIndex % count($focusOptions)];
    }

    protected function buildWorkPreferences(array $category, int $categoryIndex): array
    {
        $preferences = $category['work_preferences'] ?? [];
        if (empty($preferences)) {
            return ['Client collaboration / Collaboration client'];
        }

        $result = [];
        $count = count($preferences);
        for ($i = 0; $i < min(3, $count); $i++) {
            $pref = $preferences[($categoryIndex + $i) % $count];
            $result[] = ($pref['en'] ?? 'Preference')." / ".($pref['fr'] ?? 'Preference');
        }

        return $result;
    }

    protected function buildPortfolioPhotos(array $category, string $categoryKey, string $slug, int $categoryIndex): array
    {
        $tags = $category['portfolio_tags'] ?? ['project'];
        $tag1 = $tags[$categoryIndex % count($tags)];
        $tag2 = $tags[($categoryIndex + 1) % count($tags)];

        return [
            [
                'url' => "https://cdn.skilloncall.ca/portfolio/{$categoryKey}/{$slug}-{$tag1}.jpg",
                'caption_en' => ucwords(str_replace('-', ' ', $tag1)).' project highlight',
                'caption_fr' => ucwords(str_replace('-', ' ', $tag1)).' projet vedette',
            ],
            [
                'url' => "https://cdn.skilloncall.ca/portfolio/{$categoryKey}/{$slug}-{$tag2}.jpg",
                'caption_en' => ucwords(str_replace('-', ' ', $tag2)).' field work',
                'caption_fr' => ucwords(str_replace('-', ' ', $tag2)).' travaux terrain',
            ],
        ];
    }

    protected function summarizeCertifications(array $category, int $categoryIndex, Carbon $now): array
    {
        $certs = $category['certifications'] ?? [];
        $summary = [];

        foreach ($certs as $index => $cert) {
            $issuedDate = $now->copy()
                ->subYears($cert['issued_years_ago'] ?? 1)
                ->subMonths(($categoryIndex + $index) % 4);

            $summary[] = [
                'name' => $cert['name'],
                'issued_year' => $issuedDate->year,
            ];
        }

        return $summary;
    }

    protected function phoneSuffixFromEmail(string $email): string
    {
        $hash = abs(crc32($email));
        $number = ($hash % 9000) + 1000;
        return str_pad((string) $number, 4, '0', STR_PAD_LEFT);
    }

    protected function incrementPhoneSuffix(string $suffix, int $increment): string
    {
        $num = (int) $suffix;
        $num = (($num + $increment) % 9000) + 1000;
        return str_pad((string) $num, 4, '0', STR_PAD_LEFT);
    }

    protected function resolveAreaCode(array $category, array $location): string
    {
        return $location['area_code'] ?? ($category['area_code'] ?? '000');
    }

    protected function buildAvailabilityScheduleArray(array $template, int $categoryIndex): array
    {
        $schedule = [];
        foreach ($template as $entry) {
            $dayName = $this->dayName($entry['day_of_week']);
            $start = $this->shiftTime($entry['start_time'], ($categoryIndex % 3) * 5);
            $end = $this->shiftTime($entry['end_time'], ($categoryIndex % 2) * 5);
            $schedule[$dayName][] = [
                'start' => $start,
                'end' => $end,
            ];
        }

        return $schedule;
    }

    protected function shiftTime(string $time, int $minutes): string
    {
        $base = substr($time, 0, 5);
        $carbon = Carbon::createFromFormat('H:i', $base);
        $carbon->addMinutes($minutes);
        return $carbon->format('H:i');
    }

    protected function dayName(int $dayOfWeek): string
    {
        $days = [
            0 => 'sunday',
            1 => 'monday',
            2 => 'tuesday',
            3 => 'wednesday',
            4 => 'thursday',
            5 => 'friday',
            6 => 'saturday',
        ];

        return $days[$dayOfWeek] ?? 'monday';
    }
}



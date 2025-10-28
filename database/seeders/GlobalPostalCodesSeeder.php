<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GlobalPostalCodesSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        
        $postalCodes = [
            // Ontario - Toronto Area
            ['postal_code' => 'M1A', 'city' => 'Toronto', 'province' => 'ON', 'latitude' => 43.7735, 'longitude' => -79.2644],
            ['postal_code' => 'M1B', 'city' => 'Toronto', 'province' => 'ON', 'latitude' => 43.8065, 'longitude' => -79.1944],
            ['postal_code' => 'M1C', 'city' => 'Toronto', 'province' => 'ON', 'latitude' => 43.7845, 'longitude' => -79.1594],
            ['postal_code' => 'M4A', 'city' => 'Toronto', 'province' => 'ON', 'latitude' => 43.7335, 'longitude' => -79.2944],
            ['postal_code' => 'M5A', 'city' => 'Toronto', 'province' => 'ON', 'latitude' => 43.6545, 'longitude' => -79.3644],
            ['postal_code' => 'L1A', 'city' => 'Oshawa', 'province' => 'ON', 'latitude' => 43.8971, 'longitude' => -78.8658],
            ['postal_code' => 'L4A', 'city' => 'Richmond Hill', 'province' => 'ON', 'latitude' => 43.8828, 'longitude' => -79.4403],
            ['postal_code' => 'L5A', 'city' => 'Mississauga', 'province' => 'ON', 'latitude' => 43.5890, 'longitude' => -79.6441],
            ['postal_code' => 'L6A', 'city' => 'Oakville', 'province' => 'ON', 'latitude' => 43.4675, 'longitude' => -79.6877],
            ['postal_code' => 'K1A', 'city' => 'Ottawa', 'province' => 'ON', 'latitude' => 45.4215, 'longitude' => -75.6972],
            ['postal_code' => 'N1A', 'city' => 'Kitchener', 'province' => 'ON', 'latitude' => 43.4516, 'longitude' => -80.4925],
            ['postal_code' => 'P1A', 'city' => 'Sudbury', 'province' => 'ON', 'latitude' => 46.4917, 'longitude' => -80.9930],

            // Quebec - Montreal Area
            ['postal_code' => 'H1A', 'city' => 'Montreal', 'province' => 'QC', 'latitude' => 45.6080, 'longitude' => -73.5570],
            ['postal_code' => 'H2A', 'city' => 'Montreal', 'province' => 'QC', 'latitude' => 45.5580, 'longitude' => -73.6070],
            ['postal_code' => 'H3A', 'city' => 'Montreal', 'province' => 'QC', 'latitude' => 45.5080, 'longitude' => -73.5770],
            ['postal_code' => 'G1A', 'city' => 'Quebec City', 'province' => 'QC', 'latitude' => 46.8139, 'longitude' => -71.2080],
            ['postal_code' => 'J1A', 'city' => 'Sherbrooke', 'province' => 'QC', 'latitude' => 45.4042, 'longitude' => -71.8929],
            ['postal_code' => 'J4A', 'city' => 'Longueuil', 'province' => 'QC', 'latitude' => 45.5312, 'longitude' => -73.5186],
            ['postal_code' => 'J5A', 'city' => 'Saint-Jean-sur-Richelieu', 'province' => 'QC', 'latitude' => 45.3075, 'longitude' => -73.2625],
            ['postal_code' => 'J7A', 'city' => 'Laval', 'province' => 'QC', 'latitude' => 45.5601, 'longitude' => -73.7512],

            // British Columbia - Vancouver Area
            ['postal_code' => 'V1A', 'city' => 'Vernon', 'province' => 'BC', 'latitude' => 50.2670, 'longitude' => -119.2720],
            ['postal_code' => 'V5A', 'city' => 'Vancouver', 'province' => 'BC', 'latitude' => 49.2827, 'longitude' => -123.1207],
            ['postal_code' => 'V6A', 'city' => 'Vancouver', 'province' => 'BC', 'latitude' => 49.2827, 'longitude' => -123.1207],
            ['postal_code' => 'V7A', 'city' => 'North Vancouver', 'province' => 'BC', 'latitude' => 49.3163, 'longitude' => -123.0693],
            ['postal_code' => 'V3A', 'city' => 'Burnaby', 'province' => 'BC', 'latitude' => 49.2488, 'longitude' => -122.9805],
            ['postal_code' => 'V4A', 'city' => 'Richmond', 'province' => 'BC', 'latitude' => 49.1666, 'longitude' => -123.1336],
            ['postal_code' => 'V8A', 'city' => 'Victoria', 'province' => 'BC', 'latitude' => 48.4284, 'longitude' => -123.3656],
            ['postal_code' => 'V9A', 'city' => 'Sidney', 'province' => 'BC', 'latitude' => 48.6520, 'longitude' => -123.3991],
            ['postal_code' => 'V2A', 'city' => 'Prince George', 'province' => 'BC', 'latitude' => 53.9171, 'longitude' => -122.7497],

            // Alberta - Calgary/Edmonton
            ['postal_code' => 'T1A', 'city' => 'Calgary', 'province' => 'AB', 'latitude' => 51.0447, 'longitude' => -114.0719],
            ['postal_code' => 'T2A', 'city' => 'Calgary', 'province' => 'AB', 'latitude' => 51.0447, 'longitude' => -114.0719],
            ['postal_code' => 'T3A', 'city' => 'Calgary', 'province' => 'AB', 'latitude' => 51.0447, 'longitude' => -114.0719],
            ['postal_code' => 'T5A', 'city' => 'Edmonton', 'province' => 'AB', 'latitude' => 53.5444, 'longitude' => -113.4909],
            ['postal_code' => 'T6A', 'city' => 'Edmonton', 'province' => 'AB', 'latitude' => 53.5444, 'longitude' => -113.4909],
            ['postal_code' => 'T8A', 'city' => 'Fort McMurray', 'province' => 'AB', 'latitude' => 56.7267, 'longitude' => -111.3790],
            ['postal_code' => 'T4A', 'city' => 'Red Deer', 'province' => 'AB', 'latitude' => 52.2681, 'longitude' => -113.8112],
            ['postal_code' => 'T9A', 'city' => 'Grande Prairie', 'province' => 'AB', 'latitude' => 55.1708, 'longitude' => -118.8035],

            // Manitoba
            ['postal_code' => 'R1A', 'city' => 'Winnipeg', 'province' => 'MB', 'latitude' => 49.8955, 'longitude' => -97.1384],
            ['postal_code' => 'R2A', 'city' => 'Winnipeg', 'province' => 'MB', 'latitude' => 49.8955, 'longitude' => -97.1384],
            ['postal_code' => 'R3A', 'city' => 'Winnipeg', 'province' => 'MB', 'latitude' => 49.8955, 'longitude' => -97.1384],
            ['postal_code' => 'R7A', 'city' => 'Brandon', 'province' => 'MB', 'latitude' => 49.8478, 'longitude' => -99.9531],

            // Saskatchewan
            ['postal_code' => 'S4A', 'city' => 'Regina', 'province' => 'SK', 'latitude' => 50.4452, 'longitude' => -104.6189],
            ['postal_code' => 'S7A', 'city' => 'Saskatoon', 'province' => 'SK', 'latitude' => 52.1579, 'longitude' => -106.6702],
            ['postal_code' => 'S9A', 'city' => 'North Battleford', 'province' => 'SK', 'latitude' => 52.7755, 'longitude' => -108.2866],

            // Nova Scotia
            ['postal_code' => 'B1A', 'city' => 'Sydney', 'province' => 'NS', 'latitude' => 46.1351, 'longitude' => -60.1831],
            ['postal_code' => 'B3A', 'city' => 'Halifax', 'province' => 'NS', 'latitude' => 44.6488, 'longitude' => -63.5752],
            ['postal_code' => 'B4A', 'city' => 'Kentville', 'province' => 'NS', 'latitude' => 45.0776, 'longitude' => -64.4963],

            // New Brunswick
            ['postal_code' => 'E1A', 'city' => 'Moncton', 'province' => 'NB', 'latitude' => 46.0878, 'longitude' => -64.7782],
            ['postal_code' => 'E3A', 'city' => 'Fredericton', 'province' => 'NB', 'latitude' => 45.9636, 'longitude' => -66.6431],
            ['postal_code' => 'E2A', 'city' => 'Saint John', 'province' => 'NB', 'latitude' => 45.2733, 'longitude' => -66.0633],

            // Newfoundland and Labrador
            ['postal_code' => 'A1A', 'city' => 'St. John\'s', 'province' => 'NL', 'latitude' => 47.5615, 'longitude' => -52.7126],
            ['postal_code' => 'A0A', 'city' => 'Corner Brook', 'province' => 'NL', 'latitude' => 48.9501, 'longitude' => -57.9520],

            // Prince Edward Island
            ['postal_code' => 'C1A', 'city' => 'Charlottetown', 'province' => 'PE', 'latitude' => 46.2382, 'longitude' => -63.1311],
            ['postal_code' => 'C0A', 'city' => 'Summerside', 'province' => 'PE', 'latitude' => 46.3953, 'longitude' => -63.7989],

            // Northwest Territories
            ['postal_code' => 'X1A', 'city' => 'Yellowknife', 'province' => 'NT', 'latitude' => 62.4540, 'longitude' => -114.3718],

            // Yukon
            ['postal_code' => 'Y1A', 'city' => 'Whitehorse', 'province' => 'YT', 'latitude' => 60.7212, 'longitude' => -135.0568],

            // Nunavut
            ['postal_code' => 'X0A', 'city' => 'Iqaluit', 'province' => 'NU', 'latitude' => 63.7467, 'longitude' => -68.5170],
        ];

        // Use updateOrInsert to prevent duplicates when seeder runs multiple times
        foreach ($postalCodes as $postalCode) {
            DB::table('global_postal_codes')->updateOrInsert(
                [
                    'postal_code' => $postalCode['postal_code'],
                    'province' => $postalCode['province']
                ],
                [
                    'city' => $postalCode['city'],
                    'country' => 'Canada',
                    'latitude' => $postalCode['latitude'],
                    'longitude' => $postalCode['longitude'],
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}



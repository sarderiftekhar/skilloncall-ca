<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GlobalLanguagesSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();
        
        $languages = [
            // Official Canadian Languages (priority)
            ['name' => 'English', 'code' => 'en', 'is_official_canada' => true, 'sort_order' => 1],
            ['name' => 'French', 'code' => 'fr', 'is_official_canada' => true, 'sort_order' => 2],

            // Most Common Immigrant Languages in Canada
            ['name' => 'Spanish', 'code' => 'es', 'is_official_canada' => false, 'sort_order' => 3],
            ['name' => 'Mandarin', 'code' => 'zh', 'is_official_canada' => false, 'sort_order' => 4],
            ['name' => 'Cantonese', 'code' => 'yue', 'is_official_canada' => false, 'sort_order' => 5],
            ['name' => 'Punjabi', 'code' => 'pa', 'is_official_canada' => false, 'sort_order' => 6],
            ['name' => 'Arabic', 'code' => 'ar', 'is_official_canada' => false, 'sort_order' => 7],
            ['name' => 'Hindi', 'code' => 'hi', 'is_official_canada' => false, 'sort_order' => 8],
            ['name' => 'Tagalog', 'code' => 'tl', 'is_official_canada' => false, 'sort_order' => 9],
            ['name' => 'Italian', 'code' => 'it', 'is_official_canada' => false, 'sort_order' => 10],
            ['name' => 'German', 'code' => 'de', 'is_official_canada' => false, 'sort_order' => 11],
            ['name' => 'Portuguese', 'code' => 'pt', 'is_official_canada' => false, 'sort_order' => 12],

            // Other Common Languages
            ['name' => 'Ukrainian', 'code' => 'uk', 'is_official_canada' => false, 'sort_order' => 13],
            ['name' => 'Polish', 'code' => 'pl', 'is_official_canada' => false, 'sort_order' => 14],
            ['name' => 'Russian', 'code' => 'ru', 'is_official_canada' => false, 'sort_order' => 15],
            ['name' => 'Vietnamese', 'code' => 'vi', 'is_official_canada' => false, 'sort_order' => 16],
            ['name' => 'Korean', 'code' => 'ko', 'is_official_canada' => false, 'sort_order' => 17],
            ['name' => 'Japanese', 'code' => 'ja', 'is_official_canada' => false, 'sort_order' => 18],
            ['name' => 'Dutch', 'code' => 'nl', 'is_official_canada' => false, 'sort_order' => 19],
            ['name' => 'Greek', 'code' => 'el', 'is_official_canada' => false, 'sort_order' => 20],

            // Indigenous Languages
            ['name' => 'Cree', 'code' => 'cr', 'is_official_canada' => false, 'sort_order' => 21],
            ['name' => 'Inuktitut', 'code' => 'iu', 'is_official_canada' => false, 'sort_order' => 22],
            ['name' => 'Ojibwe', 'code' => 'oj', 'is_official_canada' => false, 'sort_order' => 23],

            // South Asian Languages
            ['name' => 'Urdu', 'code' => 'ur', 'is_official_canada' => false, 'sort_order' => 24],
            ['name' => 'Tamil', 'code' => 'ta', 'is_official_canada' => false, 'sort_order' => 25],
            ['name' => 'Gujarati', 'code' => 'gu', 'is_official_canada' => false, 'sort_order' => 26],
            ['name' => 'Bengali', 'code' => 'bn', 'is_official_canada' => false, 'sort_order' => 27],

            // African Languages
            ['name' => 'Somali', 'code' => 'so', 'is_official_canada' => false, 'sort_order' => 28],
            ['name' => 'Amharic', 'code' => 'am', 'is_official_canada' => false, 'sort_order' => 29],
            ['name' => 'Tigrinya', 'code' => 'ti', 'is_official_canada' => false, 'sort_order' => 30],

            // Middle Eastern
            ['name' => 'Persian/Farsi', 'code' => 'fa', 'is_official_canada' => false, 'sort_order' => 31],
            ['name' => 'Turkish', 'code' => 'tr', 'is_official_canada' => false, 'sort_order' => 32],
            ['name' => 'Kurdish', 'code' => 'ku', 'is_official_canada' => false, 'sort_order' => 33],

            // Eastern European
            ['name' => 'Romanian', 'code' => 'ro', 'is_official_canada' => false, 'sort_order' => 34],
            ['name' => 'Hungarian', 'code' => 'hu', 'is_official_canada' => false, 'sort_order' => 35],
            ['name' => 'Czech', 'code' => 'cs', 'is_official_canada' => false, 'sort_order' => 36],
            ['name' => 'Slovak', 'code' => 'sk', 'is_official_canada' => false, 'sort_order' => 37],

            // Latin American
            ['name' => 'Portuguese (Brazilian)', 'code' => 'pt-br', 'is_official_canada' => false, 'sort_order' => 38],

            // Nordic Languages
            ['name' => 'Swedish', 'code' => 'sv', 'is_official_canada' => false, 'sort_order' => 39],
            ['name' => 'Norwegian', 'code' => 'no', 'is_official_canada' => false, 'sort_order' => 40],
            ['name' => 'Danish', 'code' => 'da', 'is_official_canada' => false, 'sort_order' => 41],
            ['name' => 'Finnish', 'code' => 'fi', 'is_official_canada' => false, 'sort_order' => 42],

            // Other
            ['name' => 'Hebrew', 'code' => 'he', 'is_official_canada' => false, 'sort_order' => 43],
            ['name' => 'Thai', 'code' => 'th', 'is_official_canada' => false, 'sort_order' => 44],
            ['name' => 'Indonesian', 'code' => 'id', 'is_official_canada' => false, 'sort_order' => 45],
            ['name' => 'Malay', 'code' => 'ms', 'is_official_canada' => false, 'sort_order' => 46],
            ['name' => 'Swahili', 'code' => 'sw', 'is_official_canada' => false, 'sort_order' => 47],
        ];

        // Use updateOrCreate to prevent duplicates when seeder runs multiple times
        foreach ($languages as $language) {
            DB::table('global_languages')->updateOrInsert(
                [
                    'name' => $language['name'],
                    'is_official_canada' => $language['is_official_canada']
                ],
                [
                    'code' => $language['code'],
                    'sort_order' => $language['sort_order'],
                    'is_active' => true,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]
            );
        }
    }
}



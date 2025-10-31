<?php

namespace Database\Factories;

use App\Models\GlobalProvince;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GlobalProvince>
 */
class GlobalProvinceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $provinces = [
            ['code' => 'ON', 'name' => 'Ontario'],
            ['code' => 'BC', 'name' => 'British Columbia'],
            ['code' => 'AB', 'name' => 'Alberta'],
            ['code' => 'QC', 'name' => 'Quebec'],
            ['code' => 'MB', 'name' => 'Manitoba'],
            ['code' => 'SK', 'name' => 'Saskatchewan'],
            ['code' => 'NS', 'name' => 'Nova Scotia'],
            ['code' => 'NB', 'name' => 'New Brunswick'],
            ['code' => 'NL', 'name' => 'Newfoundland and Labrador'],
            ['code' => 'PE', 'name' => 'Prince Edward Island'],
            ['code' => 'NT', 'name' => 'Northwest Territories'],
            ['code' => 'YT', 'name' => 'Yukon'],
            ['code' => 'NU', 'name' => 'Nunavut'],
        ];

        $province = fake()->randomElement($provinces);

        return [
            'code' => $province['code'],
            'name' => $province['name'],
        ];
    }
}

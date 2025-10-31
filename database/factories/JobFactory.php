<?php

namespace Database\Factories;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Job>
 */
class JobFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->jobTitle(),
            'description' => fake()->paragraph(),
            'category' => fake()->randomElement(['web_development', 'mobile_development', 'design', 'writing', 'marketing', 'data_entry', 'customer_service', 'other']),
            'budget' => fake()->randomFloat(2, 100, 10000),
            'deadline' => fake()->optional()->dateTimeBetween('now', '+3 months'),
            'required_skills' => fake()->optional()->words(3),
            'location' => fake()->city(),
            'job_type' => fake()->randomElement(['full_time', 'part_time', 'contract', 'freelance']),
            'experience_level' => fake()->randomElement(['entry', 'intermediate', 'expert']),
            'status' => 'draft',
            'payment_status' => 'pending',
        ];
    }
}

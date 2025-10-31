<?php

namespace Database\Factories;

use App\Models\EmployerProfile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EmployerProfile>
 */
class EmployerProfileFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'business_name' => 'Test Business ' . fake()->company(),
            'phone' => fake()->phoneNumber(),
            'bio' => fake()->optional()->sentence(),
            'address_line_1' => null,
            'address_line_2' => null,
            'city' => null,
            'province' => null,
            'postal_code' => null,
            'country' => 'Canada',
            'is_profile_complete' => false,
            'onboarding_step' => 1,
        ];
    }

    /**
     * Indicate that the profile is complete.
     */
    public function complete(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_profile_complete' => true,
            'onboarding_step' => 2,
            'profile_completed_at' => now(),
        ]);
    }
}

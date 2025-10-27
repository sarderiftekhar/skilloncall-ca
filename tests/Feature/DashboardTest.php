<?php

use App\Models\User;
use App\Models\WorkerProfile;

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard'))->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create(['role' => 'worker']);

    // Create a complete worker profile with required fields
    WorkerProfile::create([
        'user_id' => $user->id,
        'first_name' => 'Test',
        'last_name' => 'Worker',
        'phone' => '+1234567890',
        'date_of_birth' => '1990-01-01',
        'address_line_1' => '123 Test St',
        'city' => 'Test City',
        'province' => 'Test Province',
        'postal_code' => 'A1A 1A1',
        'country' => 'Canada',
        'work_authorization' => 'canadian_citizen',
        'hourly_rate_min' => 50,
        'travel_distance_max' => 50,
        'emergency_contact_name' => 'Emergency Contact',
        'emergency_contact_phone' => '+0987654321',
        'emergency_contact_relationship' => 'Family',
        'is_profile_complete' => true,
    ]);

    $this->actingAs($user);

    // The /dashboard route redirects to role-specific dashboards
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('worker.dashboard'));
});

test('workers without complete profile are redirected to onboarding', function () {
    $user = User::factory()->create(['role' => 'worker']);

    $this->actingAs($user);

    // Workers without a complete profile should be redirected to onboarding
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('worker.onboarding.index'));
});

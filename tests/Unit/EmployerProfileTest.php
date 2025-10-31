<?php

use App\Models\EmployerProfile;
use App\Models\GlobalIndustry;
use App\Models\GlobalProvince;
use App\Models\Job;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('employer profile belongs to user', function () {
    $user = User::factory()->create(['role' => 'employer']);
    $profile = EmployerProfile::factory()->for($user)->create();

    expect($profile->user)->toBeInstanceOf(User::class);
    expect($profile->user->id)->toBe($user->id);
});

test('employer profile belongs to industry', function () {
    $user = User::factory()->create(['role' => 'employer']);
    $industry = GlobalIndustry::factory()->create();
    $profile = EmployerProfile::factory()->for($user)->create([
        'global_industry_id' => $industry->id,
    ]);

    expect($profile->industry)->toBeInstanceOf(GlobalIndustry::class);
    expect($profile->industry->id)->toBe($industry->id);
});

test('employer profile can have jobs', function () {
    $user = User::factory()->create(['role' => 'employer']);
    $profile = EmployerProfile::factory()->for($user)->create();
    
    $job = Job::factory()->create(['employer_id' => $user->id]);

    expect($profile->jobs)->toHaveCount(1);
    expect($profile->jobs->first()->id)->toBe($job->id);
});

test('can complete onboarding returns true when required fields are present', function () {
    $user = User::factory()->create(['role' => 'employer']);
    $profile = EmployerProfile::factory()->for($user)->create([
        'business_name' => 'Test Business',
        'phone' => '416-555-0123',
        'address_line_1' => '123 Main Street',
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => 'M5H 2N2',
    ]);

    expect($profile->canCompleteOnboarding())->toBeTrue();
});

test('can complete onboarding returns false when required fields are missing', function () {
    $user = User::factory()->create(['role' => 'employer']);
    $profile = EmployerProfile::factory()->for($user)->create([
        'business_name' => 'Test Business',
        'phone' => '416-555-0123',
        'address_line_1' => null,
        'city' => null,
        'province' => null,
        'postal_code' => null,
        // Missing address fields
    ]);

    expect($profile->canCompleteOnboarding())->toBeFalse();
});

test('employer profile scope complete filters complete profiles', function () {
    $user1 = User::factory()->create(['role' => 'employer']);
    $user2 = User::factory()->create(['role' => 'employer']);
    
    EmployerProfile::factory()->for($user1)->create([
        'is_profile_complete' => true,
    ]);
    
    EmployerProfile::factory()->for($user2)->create([
        'is_profile_complete' => false,
    ]);

    $completeProfiles = EmployerProfile::complete()->get();
    
    expect($completeProfiles)->toHaveCount(1);
    expect($completeProfiles->first()->is_profile_complete)->toBeTrue();
});

test('employer profile scope incomplete filters incomplete profiles', function () {
    $user1 = User::factory()->create(['role' => 'employer']);
    $user2 = User::factory()->create(['role' => 'employer']);
    
    EmployerProfile::factory()->for($user1)->create([
        'is_profile_complete' => true,
    ]);
    
    EmployerProfile::factory()->for($user2)->create([
        'is_profile_complete' => false,
    ]);

    $incompleteProfiles = EmployerProfile::incomplete()->get();
    
    expect($incompleteProfiles)->toHaveCount(1);
    expect($incompleteProfiles->first()->is_profile_complete)->toBeFalse();
});


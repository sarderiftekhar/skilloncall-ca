<?php

use App\Models\EmployerProfile;
use App\Models\GlobalIndustry;
use App\Models\GlobalProvince;
use App\Models\User;

test('onboarding page can be rendered for employers', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->withoutVite()
        ->actingAs($user)
        ->get(route('employer.onboarding.index'));

    $response->assertStatus(200);
});

test('employers with complete profile are redirected to dashboard', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::create([
        'user_id' => $user->id,
        'business_name' => 'Test Business',
        'phone' => '1234567890',
        'address_line_1' => '123 Test St',
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => 'M5H 2N2',
        'country' => 'Canada',
        'is_profile_complete' => true,
        'onboarding_step' => 2,
    ]);

    $response = $this
        ->actingAs($user)
        ->get(route('employer.onboarding.index'));

    $response->assertRedirect(route('employer.dashboard'));
});

test('employer can save step 1 - business information', function () {
    $user = User::factory()->create(['role' => 'employer']);
    $industry = GlobalIndustry::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 1,
            'data' => [
                'business_name' => 'Test Business Inc',
                'phone' => '416-555-0123',
                'global_industry_id' => $industry->id,
                'bio' => 'A test business',
            ],
        ]);

    $response->assertRedirect();

    $profile = EmployerProfile::where('user_id', $user->id)->first();
    expect($profile)->not->toBeNull();
    expect($profile->business_name)->toBe('Test Business Inc');
    expect($profile->phone)->toBe('416-555-0123');
    expect($profile->global_industry_id)->toBe($industry->id);
    expect($profile->bio)->toBe('A test business');
    expect($profile->onboarding_step)->toBe(2); // After saving step 1, step is incremented to 2
});

test('employer step 1 validation requires business name', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 1,
            'data' => [
                'phone' => '416-555-0123',
            ],
        ]);

    $response->assertSessionHasErrors();
});

test('employer step 1 validation requires phone', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 1,
            'data' => [
                'business_name' => 'Test Business',
            ],
        ]);

    $response->assertSessionHasErrors();
});

test('employer can save step 2 - location information', function () {
    $user = User::factory()->create(['role' => 'employer']);
    
    // Create a profile from step 1 first
    $profile = EmployerProfile::create([
        'user_id' => $user->id,
        'business_name' => 'Test Business',
        'phone' => '416-555-0123',
        'onboarding_step' => 1,
    ]);

    $province = GlobalProvince::create(['code' => 'ON', 'name' => 'Ontario']);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 2,
            'data' => [
                'address_line_1' => '123 Main Street',
                'address_line_2' => 'Suite 200',
                'city' => 'Toronto',
                'province' => 'ON',
                'postal_code' => 'M5H 2N2',
                'global_province_id' => $province->id,
            ],
        ]);

    $response->assertRedirect();

    $profile->refresh();
    expect($profile->address_line_1)->toBe('123 Main Street');
    expect($profile->address_line_2)->toBe('Suite 200');
    expect($profile->city)->toBe('Toronto');
    expect($profile->province)->toBe('ON');
    expect($profile->postal_code)->toBe('M5H 2N2');
    expect($profile->onboarding_step)->toBe(2);
});

test('employer step 2 validation requires address line 1', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 2,
            'data' => [
                'city' => 'Toronto',
                'province' => 'ON',
                'postal_code' => 'M5H 2N2',
            ],
        ]);

    $response->assertSessionHasErrors();
});

test('employer step 2 validation requires city', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 2,
            'data' => [
                'address_line_1' => '123 Main Street',
                'province' => 'ON',
                'postal_code' => 'M5H 2N2',
            ],
        ]);

    $response->assertSessionHasErrors();
});

test('employer step 2 validation requires province', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 2,
            'data' => [
                'address_line_1' => '123 Main Street',
                'city' => 'Toronto',
                'postal_code' => 'M5H 2N2',
            ],
        ]);

    $response->assertSessionHasErrors();
});

test('employer step 2 validation requires postal code', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 2,
            'data' => [
                'address_line_1' => '123 Main Street',
                'city' => 'Toronto',
                'province' => 'ON',
            ],
        ]);

    $response->assertSessionHasErrors();
});

test('employer step 2 validates postal code format', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.save'), [
            'step' => 2,
            'data' => [
                'address_line_1' => '123 Main Street',
                'city' => 'Toronto',
                'province' => 'ON',
                'postal_code' => 'INVALID',
            ],
        ]);

    $response->assertSessionHasErrors();
});

test('employer can complete onboarding', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $profile = EmployerProfile::factory()->for($user)->create([
        'business_name' => 'Test Business',
        'phone' => '416-555-0123',
        'address_line_1' => '123 Main Street',
        'city' => 'Toronto',
        'province' => 'ON',
        'postal_code' => 'M5H 2N2',
        'country' => 'Canada',
        'onboarding_step' => 2,
        'is_profile_complete' => false,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.complete'));

    $response->assertRedirect(route('employer.dashboard'));

    $profile->refresh();
    expect($profile->is_profile_complete)->toBeTrue();
    expect($profile->profile_completed_at)->not->toBeNull();
});

test('employer cannot complete onboarding with incomplete profile', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $profile = EmployerProfile::factory()->for($user)->create([
        'business_name' => 'Test Business',
        'phone' => '416-555-0123',
        'onboarding_step' => 1,
        'is_profile_complete' => false,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.onboarding.complete'));

    $response->assertSessionHasErrors();

    $profile->refresh();
    expect($profile->is_profile_complete)->toBeFalse();
});


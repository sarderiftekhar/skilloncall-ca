<?php

use App\Models\EmployerProfile;
use App\Models\User;

test('onboarding route requires authentication', function () {
    $response = $this->get(route('employer.onboarding.index'));

    $response->assertRedirect(route('login'));
});

test('onboarding route requires employer role', function () {
    $user = User::factory()->create(['role' => 'worker']);

    $response = $this
        ->actingAs($user)
        ->get(route('employer.onboarding.index'));

    $response->assertForbidden();
});

test('location API routes are accessible to authenticated employers', function () {
    $user = User::factory()->create(['role' => 'employer']);

    $response = $this
        ->actingAs($user)
        ->get(route('employer.api.provinces'));

    $response->assertStatus(200);
});

test('location API routes require authentication', function () {
    $response = $this->get(route('employer.api.provinces'));

    $response->assertRedirect(route('login'));
});


<?php

test('employers are redirected to onboarding after registration', function () {
    $response = $this->post(route('register.store'), [
        'name' => 'Test Employer',
        'email' => 'employer@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
        'role' => 'employer',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('employer.onboarding.index'));
});


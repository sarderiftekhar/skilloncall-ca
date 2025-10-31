<?php

use App\Models\EmployerProfile;
use App\Models\Job;
use App\Models\User;

test('employer can view the create job page', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->withoutVite()
        ->actingAs($user)
        ->get(route('employer.jobs.create'));

    $response->assertStatus(200);
});

test('employer can create a job with valid data', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $jobData = [
        'title' => 'Test Job Title',
        'description' => 'This is a test job description that provides details about the job requirements and responsibilities.',
        'category' => 'web_development',
        'budget' => 1000.00,
        'deadline' => now()->addDays(30)->format('Y-m-d'),
        'required_skills' => ['PHP', 'Laravel', 'React'],
        'location' => 'Toronto, ON',
        'job_type' => 'full_time',
        'experience_level' => 'intermediate',
    ];

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), $jobData);

    $response->assertRedirect();

    $job = Job::where('employer_id', $user->id)
        ->where('title', 'Test Job Title')
        ->first();

    expect($job)->not->toBeNull();
    expect($job->title)->toBe('Test Job Title');
    expect($job->description)->toBe('This is a test job description that provides details about the job requirements and responsibilities.');
    expect($job->category)->toBe('web_development');
    expect($job->budget)->toBe('1000.00');
    expect($job->job_type)->toBe('full_time');
    expect($job->experience_level)->toBe('intermediate');
    expect($job->status)->toBe('draft');
    expect($job->required_skills)->toBe(['PHP', 'Laravel', 'React']);
});

test('employer cannot create a job without title', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'description' => 'Job description',
            'category' => 'web_development',
            'budget' => 1000,
            'job_type' => 'full_time',
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['title']);
});

test('employer cannot create a job without description', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'category' => 'web_development',
            'budget' => 1000,
            'job_type' => 'full_time',
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['description']);
});

test('employer cannot create a job without category', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'budget' => 1000,
            'job_type' => 'full_time',
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['category']);
});

test('employer cannot create a job with invalid category', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'category' => 'invalid_category',
            'budget' => 1000,
            'job_type' => 'full_time',
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['category']);
});

test('employer cannot create a job without budget', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'category' => 'web_development',
            'job_type' => 'full_time',
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['budget']);
});

test('employer cannot create a job with negative budget', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'category' => 'web_development',
            'budget' => -100,
            'job_type' => 'full_time',
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['budget']);
});

test('employer cannot create a job without job_type', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'category' => 'web_development',
            'budget' => 1000,
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['job_type']);
});

test('employer cannot create a job without experience_level', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'category' => 'web_development',
            'budget' => 1000,
            'job_type' => 'full_time',
        ]);

    $response->assertSessionHasErrors(['experience_level']);
});

test('employer cannot create a job with deadline in the past', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'category' => 'web_development',
            'budget' => 1000,
            'deadline' => now()->subDays(1)->format('Y-m-d'),
            'job_type' => 'full_time',
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['deadline']);
});

test('employer cannot create a job with invalid job_type', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'category' => 'web_development',
            'budget' => 1000,
            'job_type' => 'invalid_type',
            'experience_level' => 'intermediate',
        ]);

    $response->assertSessionHasErrors(['job_type']);
});

test('employer cannot create a job with invalid experience_level', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('employer.jobs.store'), [
            'title' => 'Test Job',
            'description' => 'Job description',
            'category' => 'web_development',
            'budget' => 1000,
            'job_type' => 'full_time',
            'experience_level' => 'invalid_level',
        ]);

    $response->assertSessionHasErrors(['experience_level']);
});

test('non-employer cannot access create job page', function () {
    $user = User::factory()->create(['role' => 'worker']);

    $response = $this
        ->actingAs($user)
        ->get(route('employer.jobs.create'));

    $response->assertForbidden();
});

test('employer without complete profile cannot access create job page', function () {
    $user = User::factory()->create(['role' => 'employer']);

    EmployerProfile::factory()->for($user)->create([
        'is_profile_complete' => false,
    ]);

    $response = $this
        ->withoutVite()
        ->actingAs($user)
        ->get(route('employer.jobs.create'));

    // Should redirect to onboarding
    $response->assertRedirect();
});


<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\UpdateProfileRequest;
use App\Services\Employer\EmployerProfileService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class EmployerProfileController extends Controller
{
    public function __construct(
        protected EmployerProfileService $profileService
    ) {}

    /**
     * Display the employer's profile.
     */
    public function show(): Response
    {
        $profile = $this->profileService->getProfile(auth()->user());

        return Inertia::render('employer/profile/show', [
            'profile' => $profile,
        ]);
    }

    /**
     * Show the form for editing the employer's profile.
     */
    public function edit(): Response
    {
        $profile = $this->profileService->getProfile(auth()->user());

        return Inertia::render('employer/profile/edit', [
            'profile' => $profile,
        ]);
    }

    /**
     * Update the employer's profile.
     */
    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $this->profileService->updateProfile(auth()->user(), $request->validated());

        return redirect()->route('employer.profile.show')
            ->with('success', 'Profile updated successfully.');
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingsRequest;
use App\Services\Admin\AdminSettingsService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingsController extends Controller
{
    public function __construct(
        protected AdminSettingsService $settingsService
    ) {}

    /**
     * Display the admin settings.
     */
    public function index(): Response
    {
        $settings = $this->settingsService->getSettings();

        return Inertia::render('admin/settings/index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the admin settings.
     */
    public function update(UpdateSettingsRequest $request): RedirectResponse
    {
        $this->settingsService->updateSettings($request->validated());

        return redirect()->back()
            ->with('success', 'Settings updated successfully.');
    }
}

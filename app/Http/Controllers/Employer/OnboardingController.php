<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\GlobalIndustry;
use App\Models\GlobalProvince;
use App\Models\EmployerProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Check if user already has a profile
        $employerProfile = EmployerProfile::where('user_id', $user->id)->first();

        // If profile is complete, redirect to dashboard
        if ($employerProfile && $employerProfile->is_profile_complete) {
            return redirect()->route('employer.dashboard');
        }

        $currentStep = $employerProfile ? $employerProfile->onboarding_step : 1;

        // Load global reference data
        $globalData = [
            'globalIndustries' => GlobalIndustry::active()->ordered()->get(),
            'globalProvinces' => GlobalProvince::with('cities')->orderBy('name')->get(),
        ];

        // Load existing profile data
        $profileData = [];
        if ($employerProfile) {
            $profileData = $employerProfile->toArray();
        }

        return Inertia::render('employer/onboarding', array_merge([
            'currentStep' => $currentStep,
            'profileData' => $profileData,
            'translations' => trans('onboarding'),
        ], $globalData));
    }

    public function save(Request $request)
    {
        $user = $request->user();
        $step = (int) $request->input('step');
        $data = $request->input('data', []);

        Log::info('Employer onboarding save attempt', [
            'user_id' => $user->id,
            'step' => $step,
            'data_keys' => array_keys($data),
            'timestamp' => now()->toISOString(),
        ]);

        try {
            DB::beginTransaction();

            // Create or get existing profile
            $employerProfile = EmployerProfile::firstOrNew(['user_id' => $user->id]);
            if (! $employerProfile->exists) {
                $employerProfile->onboarding_step = 1;
            }

            switch ($step) {
                case 1:
                    $this->saveBusinessInfo($employerProfile, $data);
                    break;
                case 2:
                    $this->saveLocation($employerProfile, $data);
                    break;
            }

            // Update onboarding step (do not exceed final step - 2)
            if ($step >= $employerProfile->onboarding_step) {
                $employerProfile->onboarding_step = min($step + 1, 2);
                $employerProfile->save();
            }

            DB::commit();

            return back();
        } catch (ValidationException $e) {
            DB::rollBack();
            Log::error('Employer onboarding validation error', [
                'step' => $step,
                'errors' => $e->errors(),
                'data' => $data,
            ]);
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();
            
            Log::error('Employer onboarding save error', [
                'step' => $step,
                'user_id' => $user->id,
                'data' => $data,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            if (config('app.debug')) {
                return back()->withErrors([
                    'form' => 'Development Error: ' . $e->getMessage(),
                ]);
            }

            return back()->withErrors(['form' => 'An unexpected error occurred. Please try again.']);
        }
    }

    public function complete(Request $request)
    {
        $user = $request->user();
        
        $employerProfile = EmployerProfile::where('user_id', $user->id)->first();
        
        if (!$employerProfile) {
            return back()->withErrors(['form' => 'Profile not found.']);
        }

        // Refresh the model to ensure we have the latest data
        $employerProfile->refresh();

        // Log the current state for debugging
        Log::info('Employer onboarding completion check', [
            'user_id' => $user->id,
            'business_name' => $employerProfile->business_name,
            'phone' => $employerProfile->phone,
            'address_line_1' => $employerProfile->address_line_1,
            'city' => $employerProfile->city,
            'province' => $employerProfile->province,
            'postal_code' => $employerProfile->postal_code,
            'onboarding_step' => $employerProfile->onboarding_step,
            'can_complete' => $employerProfile->canCompleteOnboarding(),
        ]);

        if (!$employerProfile->canCompleteOnboarding()) {
            // Get detailed info about what's missing
            $missingFields = [];
            $essentialFields = ['business_name', 'phone', 'address_line_1', 'city', 'province', 'postal_code'];
            foreach ($essentialFields as $field) {
                if (empty($employerProfile->$field)) {
                    $missingFields[] = $field;
                }
            }
            
            Log::warning('Employer onboarding completion blocked', [
                'user_id' => $user->id,
                'missing_fields' => $missingFields,
            ]);
            
            return back()->withErrors(['form' => 'Please complete all required fields before finishing. Missing: ' . implode(', ', $missingFields)]);
        }

        $employerProfile->is_profile_complete = true;
        $employerProfile->onboarding_step = 2; // Final step
        $employerProfile->profile_completed_at = now();
        $employerProfile->save();

        // Check if there's an intended URL in session
        $intendedUrl = $request->session()->get('url.intended');
        if ($intendedUrl) {
            $request->session()->forget('url.intended');
            return redirect($intendedUrl)
                ->with('success', 'Profile completed successfully!');
        }

        return redirect()->route('employer.dashboard')
            ->with('success', 'Profile completed successfully!');
    }

    private function saveBusinessInfo(EmployerProfile $profile, array $data): void
    {
        $validated = validator($data, [
            'business_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'global_industry_id' => 'nullable|exists:global_industries,id',
            'bio' => 'nullable|string|max:1000',
        ], [
            'business_name.required' => __('validation.employer.business_name_required'),
            'phone.required' => __('validation.employer.phone_required'),
            'global_industry_id.exists' => __('validation.employer.industry_exists'),
        ])->validate();

        $profile->fill($validated);
        $profile->save();
    }

    private function saveLocation(EmployerProfile $profile, array $data): void
    {
        $validated = validator($data, [
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:100',
            'province' => 'required|string|size:2',
            'postal_code' => 'required|string|regex:/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/',
            'global_province_id' => 'nullable|exists:global_provinces,id',
            'global_city_id' => 'nullable|exists:global_cities,id',
        ], [
            'address_line_1.required' => __('validation.employer.address_line_1_required'),
            'city.required' => __('validation.employer.city_required'),
            'province.required' => __('validation.employer.province_required'),
            'province.size' => __('validation.employer.province_size'),
            'postal_code.required' => __('validation.employer.postal_code_required'),
            'postal_code.regex' => __('validation.employer.postal_code_regex'),
        ])->validate();

        $profile->fill($validated);
        $profile->save();
    }
}


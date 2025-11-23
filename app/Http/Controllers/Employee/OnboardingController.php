<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\GlobalCertification;
use App\Models\GlobalIndustry;
use App\Models\GlobalLanguage;
use App\Models\GlobalProvince;
use App\Models\GlobalSkill;
use App\Models\EmployeeProfile;
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
        $employeeProfile = EmployeeProfile::where('user_id', $user->id)->first();

        // If profile is complete, redirect to dashboard
        if ($employeeProfile && $employeeProfile->is_profile_complete) {
            return redirect()->route('employee.dashboard');
        }

        $currentStep = $employeeProfile ? $employeeProfile->onboarding_step : 1;

        // Load global reference data
        $globalData = [
            'globalSkills' => GlobalSkill::active()->ordered()->get(),
            'globalIndustries' => GlobalIndustry::active()->ordered()->get(),
            'globalLanguages' => GlobalLanguage::active()->ordered()->get(),
            'globalCertifications' => GlobalCertification::where('is_active', true)->get(),
            // 'globalProvinces' => GlobalProvince::with('cities')->orderBy('name')->get(), // Unused and heavy
        ];

        // Load existing profile data
        $profileData = [];
        if ($employeeProfile) {
            $profileData = $employeeProfile->toArray();
            
            // Don't send default false values for boolean fields to avoid pre-selection in the UI
            // These will only be sent if they have been explicitly set by the user
            $booleanFields = ['has_vehicle', 'has_tools_equipment', 'is_insured', 'has_wcb_coverage', 'has_criminal_background_check'];
            foreach ($booleanFields as $field) {
                // Only include if it's been explicitly set (true), or if we're viewing this step again
                if ($profileData[$field] === false && $currentStep < 4) {
                    unset($profileData[$field]);
                }
            }

            // Load relationships
            $profileData['selected_skills'] = $employeeProfile->skills()
                ->withPivot(['proficiency_level', 'is_primary_skill'])
                ->get()
                ->map(function ($skill) {
                    return [
                        'id' => $skill->id,
                        'name' => $skill->name,
                        'category' => $skill->category,
                        'proficiency_level' => $skill->pivot->proficiency_level,
                        'is_primary' => $skill->pivot->is_primary_skill,
                    ];
                });

            $profileData['selected_languages'] = $employeeProfile->languages()
                ->withPivot(['proficiency_level', 'is_primary_language'])
                ->get()
                ->map(function ($language) {
                    return [
                        'id' => $language->id,
                        'name' => $language->name,
                        'code' => $language->code,
                        'is_official_canada' => $language->is_official_canada,
                        'proficiency_level' => $language->pivot->proficiency_level,
                        'is_primary_language' => $language->pivot->is_primary_language,
                    ];
                });

            $profileData['work_experiences'] = $employeeProfile->workExperiences()
                ->with(['skill', 'industry'])
                ->ordered()
                ->get()
                ->map(function ($experience) {
                    $exp = $experience->toArray();
                    $exp['id'] = (string) $experience->id; // For frontend

                    return $exp;
                });

            $profileData['references'] = $employeeProfile->references()
                ->get()
                ->map(function ($reference) {
                    $ref = $reference->toArray();
                    $ref['id'] = (string) $reference->id; // For frontend

                    return $ref;
                });

            $profileData['service_areas'] = $employeeProfile->serviceAreas()->get();
            
            // Load availability grouped by month
            $availabilityRecords = $employeeProfile->availability()->get();
            $profileData['availability_by_month'] = $availabilityRecords
                ->groupBy('effective_month')
                ->map(function ($monthAvailability, $month) {
                    return [
                        'month' => $month,
                        'availability' => $monthAvailability->toArray(),
                    ];
                })
                ->values()
                ->toArray();
        }

        return Inertia::render('employee/onboarding', array_merge([
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

        // Check if profile photo is uploaded directly (not nested in data)
        if ($request->hasFile('data.profile_photo')) {
            $data['profile_photo'] = $request->file('data.profile_photo');
        }

        // Comprehensive debugging logging
        Log::info('Onboarding save attempt', [
            'user_id' => $user->id,
            'step' => $step,
            'data_keys' => array_keys($data),
            'data_types' => array_map('gettype', $data),
            'request_method' => $request->method(),
            'request_content_type' => $request->header('Content-Type'),
            'has_files' => $request->hasFile('data.profile_photo'),
            'all_files' => array_keys($request->allFiles()),
            'timestamp' => now()->toISOString(),
        ]);

        // Debug specific data based on step
        if ($step === 1) {
            Log::info('Step 1 data details', [
                'first_name' => $data['first_name'] ?? 'missing',
                'last_name' => $data['last_name'] ?? 'missing',
                'phone' => $data['phone'] ?? 'missing',
                'work_authorization' => $data['work_authorization'] ?? 'missing',
                'address_line_1' => $data['address_line_1'] ?? 'missing',
                'city' => $data['city'] ?? 'missing',
                'province' => $data['province'] ?? 'missing',
                'postal_code' => $data['postal_code'] ?? 'missing',
                'profile_photo_type' => isset($data['profile_photo']) ? gettype($data['profile_photo']) : 'missing',
                'profile_photo_is_file' => isset($data['profile_photo']) && $data['profile_photo'] instanceof \Illuminate\Http\UploadedFile ? 'yes' : 'no',
            ]);
        }

        try {
            DB::beginTransaction();

            // Do not attempt to insert an incomplete record. Create in-memory and
            // let the step save method persist once required fields are validated.
            $employeeProfile = EmployeeProfile::firstOrNew(['user_id' => $user->id]);
            if (! $employeeProfile->exists) {
                $employeeProfile->onboarding_step = 1;
            }

            switch ($step) {
                case 1:
                    $this->savePersonalInfo($employeeProfile, $data);
                    break;
                case 2:
                    $this->saveSkillsExperience($employeeProfile, $data);
                    break;
                case 3:
                    $this->saveWorkHistory($employeeProfile, $data);
                    break;
                case 4:
                    $this->saveLanguagesAvailability($employeeProfile, $data);
                    break;
                case 5:
                    $this->saveAvailability($employeeProfile, $data);
                    break;
            }

            // Update onboarding step (do not exceed final step - now 5)
            if ($step >= $employeeProfile->onboarding_step) {
                $employeeProfile->onboarding_step = min($step + 1, 5);
                $employeeProfile->save();
            }

            DB::commit();

            // Inertia forms should redirect or return 204, not JSON
            return back();
        } catch (ValidationException $e) {
            DB::rollBack();
            // Log the validation errors for debugging
            Log::error('Onboarding validation error', [
                'step' => $step,
                'errors' => $e->errors(),
                'data' => $data,
            ]);
            // Re-throw so Inertia/Laravel can convert to proper validation errors
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();
            
            // Log the full exception for debugging
            Log::error('Onboarding save error', [
                'step' => $step,
                'user_id' => auth()->id(),
                'data' => $data,
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);

            // In development, show detailed error information
            if (config('app.debug')) {
                return back()->withErrors([
                    'form' => 'Development Error: ' . $e->getMessage(),
                    'debug_file' => $e->getFile(),
                    'debug_line' => 'Line: ' . $e->getLine(),
                    'debug_step' => 'Step: ' . $step,
                    'debug_data' => 'Data keys: ' . implode(', ', array_keys($data)),
                ]);
            }

            return back()->withErrors(['form' => 'An unexpected error occurred. Please try again.']);
        }
    }

    public function complete(Request $request)
    {
        $user = $request->user();
        $data = $request->input('data', []);

        // Debug logging for completion attempt
        Log::info('Onboarding completion attempt', [
            'user_id' => $user->id,
            'data' => $data,
        ]);

        try {
            DB::beginTransaction();

            $employeeProfile = EmployeeProfile::where('user_id', $user->id)->firstOrFail();
            
            // Ensure final step data is saved before validation
            if (!empty($data)) {
                // If there's availability data, make sure it's saved first
                if (!empty($data['availability_by_month'])) {
                    Log::info('Pre-completion availability save', [
                        'user_id' => $user->id,
                        'current_availability_count' => $employeeProfile->availability()->count(),
                    ]);
                    $this->saveAvailability($employeeProfile, $data);
                }
                
                // Refresh the profile to get updated relationships
                $employeeProfile->refresh();
            }

            // Debug profile completeness
            $completionPercentage = $employeeProfile->calculateProfileCompletion();
            Log::info('Profile completion check', [
                'user_id' => $user->id,
                'completion_percentage' => $completionPercentage,
                'can_complete' => $employeeProfile->canCompleteOnboarding(),
                'profile_data' => [
                    'first_name' => $employeeProfile->first_name,
                    'last_name' => $employeeProfile->last_name,
                    'phone' => $employeeProfile->phone,
                    'date_of_birth' => $employeeProfile->date_of_birth,
                    'emergency_contact_name' => $employeeProfile->emergency_contact_name,
                    'skills_count' => $employeeProfile->skills()->count(),
                    'languages_count' => $employeeProfile->languages()->count(),
                    'work_experiences_count' => $employeeProfile->workExperiences()->count(),
                    'availability_count' => $employeeProfile->availability()->where('is_available', true)->count(),
                ]
            ]);

            // Final validation - check if profile can be completed
            $canComplete = $employeeProfile->canCompleteOnboarding();
            if (! $canComplete) {
                // Get detailed validation info
                $missingFields = [];
                
                $essentialFields = ['first_name', 'last_name', 'phone', 'address_line_1', 'city', 'province', 'postal_code', 'work_authorization', 'hourly_rate_min', 'travel_distance_max'];
                foreach ($essentialFields as $field) {
                    if (empty($employeeProfile->$field)) {
                        $missingFields[] = $field;
                    }
                }
                
                if ($employeeProfile->skills()->count() === 0) {
                    $missingFields[] = 'skills (need at least 1)';
                }
                
                if ($employeeProfile->availability()->where('is_available', true)->count() === 0) {
                    $missingFields[] = 'availability (need at least 1 available slot)';
                }
                
                Log::warning('Profile completion blocked - detailed', [
                    'user_id' => $user->id,
                    'completion_percentage' => $completionPercentage,
                    'missing_fields' => $missingFields,
                    'skills_count' => $employeeProfile->skills()->count(),
                    'availability_count' => $employeeProfile->availability()->where('is_available', true)->count(),
                ]);
                
                return back()->withErrors([
                    'message' => "Profile incomplete. Missing: " . implode(', ', $missingFields),
                    'missing_fields' => $missingFields,
                    'completion_percentage' => $completionPercentage,
                ]);
            }

            // Save final portfolio data if provided (availability already saved above)
            if (! empty($data)) {
                $this->savePortfolio($employeeProfile, $data);
            }

            // Mark profile as complete
            $employeeProfile->is_profile_complete = true;
            $employeeProfile->profile_completed_at = now();
            $employeeProfile->save();

            DB::commit();

            return back()->with([
                'success' => true,
                'message' => 'Congratulations! Your profile is now complete.',
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            return back()->withErrors([
                'message' => 'An error occurred while completing your profile.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ]);
        }
    }

    private function savePersonalInfo(EmployeeProfile $profile, array $data)
    {
        // Pre-validation debugging
        Log::info('savePersonalInfo called', [
            'profile_exists' => $profile->exists,
            'profile_id' => $profile->id,
            'data_count' => count($data),
            'required_fields_present' => [
                'first_name' => isset($data['first_name']),
                'last_name' => isset($data['last_name']),
                'phone' => isset($data['phone']),
                'address_line_1' => isset($data['address_line_1']),
                'city' => isset($data['city']),
                'province' => isset($data['province']),
                'postal_code' => isset($data['postal_code']),
                'work_authorization' => isset($data['work_authorization']),
            ],
        ]);
        
        // Check for common data issues that might cause unexpected errors
        $issues = [];
        
        if (empty($data)) {
            $issues[] = 'Data array is empty';
        }
        
        if (isset($data['postal_code']) && !is_string($data['postal_code'])) {
            $issues[] = 'Postal code is not a string: ' . gettype($data['postal_code']);
        }
        
        if (isset($data['province']) && strlen($data['province']) !== 2) {
            $issues[] = 'Province is not 2 characters: ' . strlen($data['province']) . ' chars';
        }
        
        if (!empty($issues)) {
            Log::warning('Pre-validation issues detected', [
                'issues' => $issues,
                'data' => $data
            ]);
        }

        $validated = validator($data, [
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'bio' => 'nullable|string|max:500',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'province' => 'required|string|size:2',
            'postal_code' => 'required|string|regex:/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/',
            'work_authorization' => 'required|in:canadian_citizen,permanent_resident,work_permit,student_permit',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'emergency_contact_relationship' => 'nullable|string|max:100',
        ])->validate();

        // Handle file upload for profile photo
        if (isset($data['profile_photo']) && $data['profile_photo'] instanceof \Illuminate\Http\UploadedFile) {
            $path = $data['profile_photo']->store('profile_photos', 'public');
            $validated['profile_photo'] = $path;
        }

        // Provide safe defaults for non-nullable fields that are captured in later steps
        // so that a new profile row can be created at step 1 without violating constraints.
        if (! $profile->exists) {
            $validated = array_merge([
                'hourly_rate_min' => 15, // temporary until step 4 updates
                'travel_distance_max' => 1, // km, temporary
            ], $validated);
        }

        $profile->fill($validated);
        $profile->save();
    }

    private function saveSkillsExperience(EmployeeProfile $profile, array $data)
    {
        // First, handle custom skills by creating them in global_skills
        if (isset($data['selected_skills']) && is_array($data['selected_skills'])) {
            foreach ($data['selected_skills'] as $index => $skill) {
                // Check if this is a custom skill (has is_custom flag or ID doesn't exist in DB)
                if (isset($skill['is_custom']) && $skill['is_custom']) {
                    // Create the custom skill in global_skills table
                    $globalSkill = \App\Models\GlobalSkill::firstOrCreate(
                        ['name' => $skill['name'], 'category' => $skill['category'] ?? 'Other'],
                        [
                            'description' => null,
                            'requires_certification' => false,
                            'is_active' => true,
                            'sort_order' => 9999, // Put custom skills at the end
                        ]
                    );
                    
                    // Replace the temporary ID with the real database ID
                    $data['selected_skills'][$index]['id'] = $globalSkill->id;
                    // Remove the is_custom flag for validation
                    unset($data['selected_skills'][$index]['is_custom']);
                }
            }
        }

        $validated = validator($data, [
            'overall_experience' => 'required|in:beginner,intermediate,advanced,expert',
            'selected_skills' => 'required|array|min:1',
            'selected_skills.*.id' => 'required|exists:global_skills,id',
            'selected_skills.*.proficiency_level' => 'required|in:beginner,intermediate,advanced,expert',
            'selected_skills.*.is_primary' => 'boolean',
        ])->validate();

        $profile->update(['overall_experience' => $validated['overall_experience']]);

        // Sync skills
        $skillsData = [];
        foreach ($validated['selected_skills'] as $skill) {
            $skillsData[$skill['id']] = [
                'proficiency_level' => $skill['proficiency_level'],
                'is_primary_skill' => $skill['is_primary'] ?? false,
            ];
        }
        $profile->skills()->sync($skillsData);
    }

    private function saveWorkHistory(EmployeeProfile $profile, array $data)
    {
        // First, handle custom skills and industries in work experiences
        if (isset($data['work_experiences']) && is_array($data['work_experiences'])) {
            foreach ($data['work_experiences'] as $index => $experience) {
                // Handle custom skill
                if (!empty($experience['custom_skill_name']) && empty($experience['global_skill_id'])) {
                    $globalSkill = \App\Models\GlobalSkill::firstOrCreate(
                        ['name' => $experience['custom_skill_name'], 'category' => 'Other'],
                        [
                            'description' => null,
                            'requires_certification' => false,
                            'is_active' => true,
                            'sort_order' => 9999,
                        ]
                    );
                    $data['work_experiences'][$index]['global_skill_id'] = $globalSkill->id;
                    unset($data['work_experiences'][$index]['custom_skill_name']);
                }
                
                // Handle custom industry
                if (!empty($experience['custom_industry_name']) && empty($experience['global_industry_id'])) {
                    $globalIndustry = \App\Models\GlobalIndustry::firstOrCreate(
                        ['name' => $experience['custom_industry_name'], 'category' => 'Other'],
                        [
                            'description' => null,
                            'is_active' => true,
                            'sort_order' => 9999,
                        ]
                    );
                    $data['work_experiences'][$index]['global_industry_id'] = $globalIndustry->id;
                    unset($data['work_experiences'][$index]['custom_industry_name']);
                }
            }
        }

        $validated = validator($data, [
            'employment_status' => 'required|in:employed,unemployed,self_employed',
            'work_experiences' => 'required|array|min:1',
            'work_experiences.*.company_name' => 'required|string|max:255',
            'work_experiences.*.job_title' => 'required|string|max:255',
            'work_experiences.*.start_date' => 'required|date',
            'work_experiences.*.end_date' => 'nullable|date|after_or_equal:start_date',
            'work_experiences.*.is_current' => 'nullable|boolean',
            'work_experiences.*.description' => 'nullable|string|max:1000',
            'work_experiences.*.global_skill_id' => 'nullable|exists:global_skills,id',
            'work_experiences.*.global_industry_id' => 'nullable|exists:global_industries,id',
            'work_experiences.*.supervisor_name' => 'nullable|string|max:255',
            'work_experiences.*.supervisor_contact' => 'nullable|string|max:255',
            'references' => 'nullable|array|max:3',
            'references.*.reference_name' => 'required_with:references|string|max:255',
            'references.*.reference_phone' => 'required_with:references|string|max:20',
            'references.*.reference_email' => 'nullable|email|max:255',
            'references.*.relationship' => 'required_with:references|in:previous_employer,previous_supervisor,satisfied_client,colleague,business_partner,mentor,trainer,team_lead,volunteer_coordinator,community_leader',
            'references.*.company_name' => 'nullable|string|max:255',
            'references.*.notes' => 'nullable|string|max:500',
        ])->validate();

        // Update employment status
        $profile->employment_status = $validated['employment_status'];

        // Ensure the profile is saved before creating related records
        if (! $profile->exists) {
            $profile->save();
        } else {
            $profile->save();
        }

        // Save work experiences
        if (! empty($validated['work_experiences'])) {
            $profile->workExperiences()->delete();
            foreach ($validated['work_experiences'] as $experience) {
                $profile->workExperiences()->create($experience);
            }
        }

        // Save references
        if (! empty($validated['references'])) {
            $profile->references()->delete();
            foreach ($validated['references'] as $reference) {
                $profile->references()->create($reference);
            }
        }
    }

    private function saveLocationPreferences(EmployeeProfile $profile, array $data)
    {
        $validated = validator($data, [
            'has_vehicle' => 'required|boolean',
            'has_tools_equipment' => 'required|boolean',
            'travel_distance_max' => 'nullable|integer|min:1|max:999',
            'hourly_rate_min' => 'required|numeric|min:15|max:200',
            'hourly_rate_max' => 'nullable|numeric|min:15|max:500|gte:hourly_rate_min',
            'is_insured' => 'nullable|boolean',
            'has_wcb_coverage' => 'nullable|boolean',
            'has_criminal_background_check' => 'nullable|boolean',
            'background_check_date' => 'nullable|date',
            'service_areas' => 'nullable|array',
        ])->validate();

        $profile->fill($validated);
        $profile->save();

        // Save service areas
        if (! empty($validated['service_areas'])) {
            $profile->serviceAreas()->delete();
            foreach ($validated['service_areas'] as $area) {
                $areaValidated = validator($area, [
                    'postal_code' => 'required|string|max:7',
                    'city' => 'required|string|max:255',
                    'province' => 'required|string|size:2',
                    'travel_time_minutes' => 'integer|min:0|max:300',
                    'additional_charge' => 'numeric|min:0|max:100',
                    'is_primary_area' => 'boolean',
                ])->validate();

                $profile->serviceAreas()->create($areaValidated);
            }
        }
    }

    private function saveLanguagesAvailability(EmployeeProfile $profile, array $data)
    {
        // Save languages if provided
        if (!empty($data['selected_languages'])) {
            $languageData = [];
            foreach ($data['selected_languages'] as $language) {
                if (isset($language['id'])) {
                    $languageData[$language['id']] = [
                        'proficiency_level' => $language['proficiency_level'] ?? 'conversational',
                        'is_primary_language' => ($language['is_primary_language'] ?? false) || ($language['is_primary'] ?? false),
                    ];
                }
            }
            
            Log::info('Saving languages', [
                'user_id' => $profile->user_id,
                'language_data' => $languageData,
                'languages_count' => count($languageData),
            ]);
            
            $profile->languages()->sync($languageData);
        }

        // Also save any location preferences and rates if provided
        $locationFields = array_intersect_key($data, array_flip([
            'has_vehicle', 'has_tools_equipment', 'travel_distance_max', 'hourly_rate_min', 
            'hourly_rate_max', 'is_insured', 'has_wcb_coverage', 'has_criminal_background_check'
        ]));
        
        if (!empty($locationFields)) {
            $validated = validator($locationFields, [
                'has_vehicle' => 'nullable|boolean',
                'has_tools_equipment' => 'nullable|boolean', 
                'travel_distance_max' => 'nullable|integer|min:1|max:999',
                'hourly_rate_min' => 'nullable|numeric|min:15|max:200',
                'hourly_rate_max' => 'nullable|numeric|min:15|max:500',
                'is_insured' => 'nullable|boolean',
                'has_wcb_coverage' => 'nullable|boolean',
                'has_criminal_background_check' => 'nullable|boolean',
            ])->validate();

            $profile->fill($validated);
            $profile->save();
        }
    }

    private function saveAvailability(EmployeeProfile $profile, array $data)
    {
        if (empty($data['availability_by_month'])) {
            Log::warning('No availability data provided for step 5', [
                'user_id' => $profile->user_id,
                'data_keys' => array_keys($data),
            ]);
            return;
        }

        $validated = validator($data, [
            'availability_by_month' => 'required|array|min:1|max:2',
            'availability_by_month.*.month' => 'required|date_format:Y-m',
            'availability_by_month.*.availability' => 'required|array',
            'availability_by_month.*.availability.*.day_of_week' => 'required|integer|between:0,6',
            'availability_by_month.*.availability.*.start_time' => 'required|date_format:H:i',
            'availability_by_month.*.availability.*.end_time' => 'required|date_format:H:i',
            'availability_by_month.*.availability.*.is_available' => 'boolean',
            'availability_by_month.*.availability.*.rate_multiplier' => 'numeric|min:1|max:3',
        ])->validate();

        // Delete existing availability for the months being updated
        $monthsToUpdate = array_column($validated['availability_by_month'], 'month');
        $profile->availability()->whereIn('effective_month', $monthsToUpdate)->delete();

        Log::info('Saving availability', [
            'user_id' => $profile->user_id,
            'months_to_update' => $monthsToUpdate,
            'availability_slots' => array_sum(array_map(fn($month) => count($month['availability']), $validated['availability_by_month'])),
        ]);

        // Save new availability for each month
        foreach ($validated['availability_by_month'] as $monthData) {
            foreach ($monthData['availability'] as $slot) {
                // Validate end_time is after start_time
                if (strtotime($slot['end_time']) <= strtotime($slot['start_time'])) {
                    throw ValidationException::withMessages([
                        'availability_by_month' => 'End time must be after start time for all days.',
                    ]);
                }
                
                $profile->availability()->create([
                    'effective_month' => $monthData['month'],
                    'day_of_week' => $slot['day_of_week'],
                    'start_time' => $slot['start_time'],
                    'end_time' => $slot['end_time'],
                    'is_available' => $slot['is_available'] ?? true,
                    'rate_multiplier' => $slot['rate_multiplier'] ?? 1.0,
                ]);
            }
        }
    }

    private function savePortfolio(EmployeeProfile $profile, array $data)
    {
        $validated = validator($data, [
            'portfolio_photos' => 'nullable|array|max:6',
            'social_media_links' => 'nullable|array|max:3',
            'social_media_links.*.platform' => 'required|string|in:instagram,facebook,website',
            'social_media_links.*.url' => 'required|url',
        ])->validate();

        // Handle portfolio photos upload
        $portfolioPhotos = [];
        if (! empty($validated['portfolio_photos'])) {
            foreach ($validated['portfolio_photos'] as $photo) {
                if (isset($photo['file']) && $photo['file'] instanceof \Illuminate\Http\UploadedFile) {
                    $path = $photo['file']->store('portfolio_photos', 'public');
                    $portfolioPhotos[] = [
                        'path' => $path,
                        'description' => $photo['description'] ?? '',
                    ];
                }
            }
        }

        $profile->update([
            'portfolio_photos' => $portfolioPhotos,
            'social_media_links' => $validated['social_media_links'] ?? [],
        ]);
    }
}

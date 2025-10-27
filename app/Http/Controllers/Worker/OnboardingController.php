<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\GlobalCertification;
use App\Models\GlobalIndustry;
use App\Models\GlobalLanguage;
use App\Models\GlobalProvince;
use App\Models\GlobalSkill;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Check if user already has a profile
        $workerProfile = WorkerProfile::where('user_id', $user->id)->first();

        // If profile is complete, redirect to dashboard
        if ($workerProfile && $workerProfile->is_profile_complete) {
            return redirect()->route('worker.dashboard');
        }

        $currentStep = $workerProfile ? $workerProfile->onboarding_step : 1;

        // Load global reference data
        $globalData = [
            'globalSkills' => GlobalSkill::active()->ordered()->get(),
            'globalIndustries' => GlobalIndustry::active()->ordered()->get(),
            'globalLanguages' => GlobalLanguage::active()->ordered()->get(),
            'globalCertifications' => GlobalCertification::where('is_active', true)->get(),
            'globalProvinces' => GlobalProvince::with('cities')->orderBy('name')->get(),
        ];

        // Load existing profile data
        $profileData = [];
        if ($workerProfile) {
            $profileData = $workerProfile->toArray();

            // Load relationships
            $profileData['selected_skills'] = $workerProfile->skills()
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

            $profileData['selected_languages'] = $workerProfile->languages()
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

            $profileData['work_experiences'] = $workerProfile->workExperiences()
                ->with(['skill', 'industry'])
                ->ordered()
                ->get()
                ->map(function ($experience) {
                    $exp = $experience->toArray();
                    $exp['id'] = (string) $experience->id; // For frontend

                    return $exp;
                });

            $profileData['references'] = $workerProfile->references()
                ->get()
                ->map(function ($reference) {
                    $ref = $reference->toArray();
                    $ref['id'] = (string) $reference->id; // For frontend

                    return $ref;
                });

            $profileData['service_areas'] = $workerProfile->serviceAreas()->get();
            $profileData['availability'] = $workerProfile->availability()->get();
        }

        return Inertia::render('worker/onboarding', array_merge([
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

        try {
            DB::beginTransaction();

            // Do not attempt to insert an incomplete record. Create in-memory and
            // let the step save method persist once required fields are validated.
            $workerProfile = WorkerProfile::firstOrNew(['user_id' => $user->id]);
            if (! $workerProfile->exists) {
                $workerProfile->onboarding_step = 1;
            }

            switch ($step) {
                case 1:
                    $this->savePersonalInfo($workerProfile, $data);
                    break;
                case 2:
                    $this->saveSkillsExperience($workerProfile, $data);
                    break;
                case 3:
                    $this->saveWorkHistory($workerProfile, $data);
                    break;
                case 4:
                    $this->saveLocationPreferences($workerProfile, $data);
                    break;
                case 5:
                    $this->saveLanguagesAvailability($workerProfile, $data);
                    break;
                case 6:
                    $this->savePortfolio($workerProfile, $data);
                    break;
            }

            // Update onboarding step (do not exceed final step)
            if ($step >= $workerProfile->onboarding_step) {
                $workerProfile->onboarding_step = min($step + 1, 6);
                $workerProfile->save();
            }

            DB::commit();

            // Inertia forms should redirect or return 204, not JSON
            return back();
        } catch (ValidationException $e) {
            DB::rollBack();
            // Log the validation errors for debugging
            \Log::error('Onboarding validation error', [
                'step' => $step,
                'errors' => $e->errors(),
                'data' => $data,
            ]);
            // Re-throw so Inertia/Laravel can convert to proper validation errors
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();
            // Log the full exception for debugging
            \Log::error('Onboarding save error', [
                'step' => $step,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return back()->withErrors(['form' => 'An unexpected error occurred. Please try again.']);
        }
    }

    public function complete(Request $request)
    {
        $user = $request->user();
        $data = $request->input('data', []);

        try {
            DB::beginTransaction();

            $workerProfile = WorkerProfile::where('user_id', $user->id)->firstOrFail();

            // Final validation
            if (! $workerProfile->canCompleteOnboarding()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please complete all required sections before finishing setup.',
                ], 422);
            }

            // Save final portfolio data if provided
            if (! empty($data)) {
                $this->savePortfolio($workerProfile, $data);
            }

            // Mark profile as complete
            $workerProfile->is_profile_complete = true;
            $workerProfile->profile_completed_at = now();
            $workerProfile->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Congratulations! Your profile is now complete.',
            ]);

        } catch (\Exception $e) {
            DB::rollback();

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while completing your profile.',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 422);
        }
    }

    private function savePersonalInfo(WorkerProfile $profile, array $data)
    {
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
            'emergency_contact_name' => 'required|string|max:255',
            'emergency_contact_phone' => 'required|string|max:20',
            'emergency_contact_relationship' => 'required|string|max:100',
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

    private function saveSkillsExperience(WorkerProfile $profile, array $data)
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

    private function saveWorkHistory(WorkerProfile $profile, array $data)
    {
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
            'references.*.relationship' => 'required_with:references|in:previous_employer,previous_supervisor,satisfied_client,colleague,business_partner',
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

    private function saveLocationPreferences(WorkerProfile $profile, array $data)
    {
        $validated = validator($data, [
            'has_vehicle' => 'required|boolean',
            'has_tools_equipment' => 'required|boolean',
            'travel_distance_max' => 'required|integer|min:1|max:999',
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

    private function saveLanguagesAvailability(WorkerProfile $profile, array $data)
    {
        $validated = validator($data, [
            'selected_languages' => 'required|array|min:1',
            'selected_languages.*.id' => 'required|exists:global_languages,id',
            'selected_languages.*.proficiency_level' => 'required|in:basic,conversational,fluent,native',
            'selected_languages.*.is_primary_language' => 'boolean',
            'availability' => 'required|array',
            'availability.*.day_of_week' => 'required|integer|between:0,6',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.end_time' => 'required|date_format:H:i|after:start_time',
            'availability.*.is_available' => 'boolean',
            'availability.*.rate_multiplier' => 'numeric|min:1|max:3',
        ])->validate();

        // Sync languages
        $languagesData = [];
        foreach ($validated['selected_languages'] as $language) {
            $languagesData[$language['id']] = [
                'proficiency_level' => $language['proficiency_level'],
                'is_primary_language' => $language['is_primary_language'] ?? false,
            ];
        }
        $profile->languages()->sync($languagesData);

        // Save availability
        $profile->availability()->delete();
        foreach ($validated['availability'] as $slot) {
            $profile->availability()->create($slot);
        }
    }

    private function savePortfolio(WorkerProfile $profile, array $data)
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

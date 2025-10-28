<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\GlobalCertification;
use App\Models\GlobalIndustry;
use App\Models\GlobalLanguage;
use App\Models\GlobalSkill;
use App\Models\WorkerProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class WorkerProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();
        $profile = WorkerProfile::with([
            'skills',
            'languages',
            'workExperiences.skill',
            'workExperiences.industry',
            'serviceAreas',
            'references',
            'availability',
            'certifications',
        ])->where('user_id', $user->id)->first();

        $globalData = [
            'globalSkills' => GlobalSkill::active()->ordered()->get(),
            'globalIndustries' => GlobalIndustry::active()->ordered()->get(),
            'globalLanguages' => GlobalLanguage::active()->ordered()->get(),
            'globalCertifications' => GlobalCertification::where('is_active', true)->get(),
        ];

        return Inertia::render('worker/profile', array_merge([
            'mode' => 'view',
            'profile' => $profile,
            'profileCompletion' => $profile ? $profile->calculateProfileCompletion() : 0,
        ], $globalData));
    }

    public function edit(Request $request)
    {
        $user = $request->user();
        $profile = WorkerProfile::with([
            'skills',
            'languages',
            'workExperiences.skill',
            'workExperiences.industry',
            'serviceAreas',
            'references',
            'availability',
            'certifications',
        ])->where('user_id', $user->id)->first();

        $globalData = [
            'globalSkills' => GlobalSkill::active()->ordered()->get(),
            'globalIndustries' => GlobalIndustry::active()->ordered()->get(),
            'globalLanguages' => GlobalLanguage::active()->ordered()->get(),
            'globalCertifications' => GlobalCertification::where('is_active', true)->get(),
        ];

        return Inertia::render('worker/profile', array_merge([
            'mode' => 'edit',
            'profile' => $profile,
            'profileCompletion' => $profile ? $profile->calculateProfileCompletion() : 0,
        ], $globalData));
    }

    public function update(Request $request)
    {
        $user = $request->user();
        
        // DEBUG: Log everything about this request
        Log::info('Profile update request received', [
            'user_id' => $user->id,
            'request_method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'has_files' => $request->hasFile('profile_photo'),
            'all_files' => array_keys($request->allFiles()),
            'input_keys' => array_keys($request->all()),
            'request_size' => $request->header('Content-Length'),
        ]);
        
        // Get data directly from request instead of nested in 'data' key
        $data = $request->all();
        
        // Remove Laravel's internal fields
        unset($data['_token'], $data['_method']);

        try {
            DB::beginTransaction();

            $profile = WorkerProfile::firstOrCreate(['user_id' => $user->id]);

            // Handle different types of updates based on what data is provided
            if (isset($data['skills'])) {
                $this->updateSkills($profile, $data['skills']);
            }

            if (isset($data['work_experiences'])) {
                $this->updateWorkExperiences($profile, $data['work_experiences']);
            }

            if (isset($data['references'])) {
                $this->updateReferences($profile, $data['references']);
            }

            if (isset($data['languages'])) {
                $this->updateLanguages($profile, $data['languages']);
            }

            if (isset($data['portfolio_photos']) || isset($data['certifications'])) {
                $this->updatePortfolioAndCertifications($profile, $data, $request);
            }

            // Handle profile photo upload first (if present)
            if ($request->hasFile('profile_photo') && $request->file('profile_photo') instanceof \Illuminate\Http\UploadedFile) {
                $file = $request->file('profile_photo');
                Log::info('Profile photo upload attempt', [
                    'user_id' => $user->id,
                    'file_name' => $file->getClientOriginalName(),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
                
                $path = $file->store('profile_photos', 'public');
                $profile->profile_photo = $path;
                $profile->save();
                
                Log::info('Profile photo uploaded successfully', [
                    'user_id' => $user->id,
                    'stored_path' => $path,
                ]);
            }

            // Handle regular profile field updates
            $personalFields = [
                'first_name', 'last_name', 'phone', 'date_of_birth', 'bio',
                'address_line_1', 'address_line_2', 'city', 'province', 'postal_code',
                'work_authorization', 'emergency_contact_name', 'emergency_contact_phone',
                'emergency_contact_relationship', 'overall_experience', 'employment_status'
            ];

            $profileData = array_intersect_key($data, array_flip($personalFields));
            
            if (!empty($profileData)) {
                // Validate based on what fields are being updated
                $rules = [];
                if (isset($profileData['first_name'])) $rules['first_name'] = 'required|string|max:255';
                if (isset($profileData['last_name'])) $rules['last_name'] = 'required|string|max:255';
                if (isset($profileData['phone'])) $rules['phone'] = 'required|string|max:20';
                if (isset($profileData['date_of_birth'])) $rules['date_of_birth'] = 'required|date|before:today';
                if (isset($profileData['bio'])) $rules['bio'] = 'nullable|string|max:500';
                if (isset($profileData['address_line_1'])) $rules['address_line_1'] = 'required|string|max:255';
                if (isset($profileData['address_line_2'])) $rules['address_line_2'] = 'nullable|string|max:255';
                if (isset($profileData['city'])) $rules['city'] = 'required|string|max:255';
                if (isset($profileData['province'])) $rules['province'] = 'required|string|size:2';
                if (isset($profileData['postal_code'])) $rules['postal_code'] = 'required|string|regex:/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/';
                if (isset($profileData['work_authorization'])) $rules['work_authorization'] = 'required|in:canadian_citizen,permanent_resident,work_permit,student_permit';
                if (isset($profileData['emergency_contact_name'])) $rules['emergency_contact_name'] = 'required|string|max:255';
                if (isset($profileData['emergency_contact_phone'])) $rules['emergency_contact_phone'] = 'required|string|max:20';
                if (isset($profileData['emergency_contact_relationship'])) $rules['emergency_contact_relationship'] = 'required|string|max:100';
                if (isset($profileData['overall_experience'])) $rules['overall_experience'] = 'required|in:beginner,intermediate,advanced,expert';
                if (isset($profileData['employment_status'])) $rules['employment_status'] = 'required|in:employed,unemployed,self_employed';

                if (!empty($rules)) {
                    $validated = validator($profileData, $rules)->validate();
                    $profile->fill($validated)->save();
                }
            }

            DB::commit();

            // Redirect to refresh the profile data with updated information
            return redirect()->route('worker.profile.show')->with('success', 'Profile updated successfully');
        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->withErrors(['form' => 'An unexpected error occurred. Please try again.']);
        }
    }

    private function updateSkills(WorkerProfile $profile, array $skills)
    {
        // Sync skills with pivot data
        $skillData = [];
        foreach ($skills as $skill) {
            $skillData[$skill['id']] = [
                'proficiency_level' => $skill['pivot']['proficiency_level'] ?? 'intermediate',
                'is_primary_skill' => $skill['pivot']['is_primary'] ?? false,
            ];
        }
        $profile->skills()->sync($skillData);
    }

    private function updateWorkExperiences(WorkerProfile $profile, array $experiences)
    {
        // Delete existing experiences and create new ones
        $profile->workExperiences()->delete();
        
        foreach ($experiences as $exp) {
            if (!empty($exp['company_name']) && !empty($exp['job_title'])) {
                $profile->workExperiences()->create([
                    'company_name' => $exp['company_name'],
                    'job_title' => $exp['job_title'],
                    'start_date' => $exp['start_date'] ?? null,
                    'end_date' => $exp['is_current'] ? null : ($exp['end_date'] ?? null),
                    'is_current' => $exp['is_current'] ?? false,
                    'description' => $exp['description'] ?? null,
                    'supervisor_name' => $exp['supervisor_name'] ?? null,
                    'supervisor_contact' => $exp['supervisor_contact'] ?? null,
                ]);
            }
        }
    }

    private function updateReferences(WorkerProfile $profile, array $references)
    {
        // Delete existing references and create new ones
        $profile->references()->delete();
        
        foreach ($references as $ref) {
            if (!empty($ref['reference_name'])) {
                $profile->references()->create([
                    'reference_name' => $ref['reference_name'],
                    'reference_phone' => $ref['reference_phone'] ?? null,
                    'reference_email' => $ref['reference_email'] ?? null,
                    'relationship' => $ref['relationship'] ?? null,
                    'company_name' => $ref['company_name'] ?? null,
                    'notes' => $ref['notes'] ?? null,
                    'permission_to_contact' => true, // Default to true
                ]);
            }
        }
    }

    private function updateLanguages(WorkerProfile $profile, array $languages)
    {
        // Sync languages with pivot data
        $languageData = [];
        foreach ($languages as $language) {
            $languageData[$language['id']] = [
                'proficiency_level' => $language['pivot']['proficiency_level'] ?? 'conversational',
                'is_primary_language' => $language['pivot']['is_primary'] ?? false,
            ];
        }
        $profile->languages()->sync($languageData);
    }

    private function updatePortfolioAndCertifications(WorkerProfile $profile, array $data, Request $request)
    {
        // Handle portfolio photo uploads
        $portfolioPhotos = [];
        $portfolioIndex = 0;
        
        // Look for portfolio_photos[n][file] pattern in request
        // Laravel converts portfolio_photos[0][file] to portfolio_photos.0.file internally
        while ($request->hasFile("portfolio_photos.{$portfolioIndex}.file")) {
            $file = $request->file("portfolio_photos.{$portfolioIndex}.file");
            $caption = $request->input("portfolio_photos.{$portfolioIndex}.caption", '');
            
            Log::info('Found portfolio file', [
                'index' => $portfolioIndex,
                'file_key' => "portfolio_photos.{$portfolioIndex}.file",
                'caption_key' => "portfolio_photos.{$portfolioIndex}.caption",
                'file_name' => $file ? $file->getClientOriginalName() : 'null',
                'caption' => $caption,
            ]);
            
            if ($file && $file->isValid()) {
                $path = $file->store('portfolio_photos', 'public');
                
                $portfolioPhotos[] = [
                    'path' => $path,
                    'caption' => $caption,
                ];
                
                Log::info('Portfolio photo uploaded', [
                    'user_id' => $profile->user_id,
                    'file_name' => $file->getClientOriginalName(),
                    'stored_path' => $path,
                    'caption' => $caption,
                ]);
            }
            
            $portfolioIndex++;
        }
        
        // Update portfolio photos if any were uploaded
        if (!empty($portfolioPhotos)) {
            // Merge with existing photos instead of replacing
            $existingPhotos = $profile->portfolio_photos ?? [];
            $profile->portfolio_photos = array_merge($existingPhotos, $portfolioPhotos);
        }

        if (isset($data['certifications'])) {
            // Delete existing certifications and create new ones
            $profile->certifications()->delete();
            
            foreach ($data['certifications'] as $cert) {
                if (!empty($cert['name'])) {
                    $profile->certifications()->create([
                        'name' => $cert['name'],
                        'issuing_organization' => $cert['issuing_organization'] ?? null,
                        'issue_date' => $cert['issue_date'] ?? null,
                        'expiry_date' => $cert['expiry_date'] ?? null,
                        'credential_id' => $cert['credential_id'] ?? null,
                        'verification_url' => $cert['verification_url'] ?? null,
                        'is_verified' => false, // Default to false until verified
                    ]);
                }
            }
        }

        $profile->save();
    }
}

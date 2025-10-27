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

        return Inertia::render('worker/profile', [
            'mode' => 'view',
            'profile' => $profile,
            'profileCompletion' => $profile ? $profile->calculateProfileCompletion() : 0,
        ]);
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
        $data = $request->input('data', []);

        try {
            DB::beginTransaction();

            $profile = WorkerProfile::firstOrCreate(['user_id' => $user->id]);

            // Validate core fields similar to onboarding step 1 and 4
            $validated = validator($data, [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'phone' => 'required|string|max:20',
                'date_of_birth' => 'required|date|before:today',
                'bio' => 'nullable|string|max:500',
                'address_line_1' => 'required|string|max:255',
                'address_line_2' => 'nullable|string|max:255',
                'city' => 'required|string|max:255',
                'province' => 'required|string|size:2',
                'postal_code' => 'required|string|regex:/^[A-Z]\d[A-Z] ?\d[A-Z]\d$/',
                'work_authorization' => 'required|in:canadian_citizen,permanent_resident,work_permit,student_permit',
                'hourly_rate_min' => 'required|numeric|min:15|max:200',
                'hourly_rate_max' => 'nullable|numeric|min:15|max:500|gte:hourly_rate_min',
                'has_vehicle' => 'boolean',
                'has_tools_equipment' => 'boolean',
                'is_insured' => 'boolean',
                'has_wcb_coverage' => 'boolean',
                'emergency_contact_name' => 'required|string|max:255',
                'emergency_contact_phone' => 'required|string|max:20',
                'emergency_contact_relationship' => 'required|string|max:100',
            ])->validate();

            $profile->fill($validated)->save();

            DB::commit();

            return back();
        } catch (ValidationException $e) {
            DB::rollBack();
            throw $e;
        } catch (\Throwable $e) {
            DB::rollBack();

            return back()->withErrors(['form' => 'An unexpected error occurred. Please try again.']);
        }
    }
}

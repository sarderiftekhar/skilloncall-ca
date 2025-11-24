<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Models\GlobalCertification;
use App\Models\GlobalIndustry;
use App\Models\GlobalLanguage;
use App\Models\GlobalSkill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReferenceDataController extends Controller
{
    /**
     * Get skills with automatic translation based on user's locale
     */
    public function getSkills(Request $request): JsonResponse
    {
        $skills = GlobalSkill::active()
            ->ordered()
            ->select('id', 'name', 'category')
            ->get()
            ->map(function ($skill) {
                return [
                    'id' => $skill->id,
                    'name' => $skill->name, // Automatically translated by HasTranslations
                    'category' => $skill->category,
                ];
            });

        return response()->json($skills);
    }

    /**
     * Get industries with automatic translation based on user's locale
     */
    public function getIndustries(Request $request): JsonResponse
    {
        $industries = GlobalIndustry::active()
            ->ordered()
            ->select('id', 'name')
            ->get()
            ->map(function ($industry) {
                return [
                    'id' => $industry->id,
                    'name' => $industry->name, // Automatically translated by HasTranslations
                ];
            });

        return response()->json($industries);
    }

    /**
     * Get languages with automatic translation based on user's locale
     */
    public function getLanguages(Request $request): JsonResponse
    {
        $languages = GlobalLanguage::active()
            ->ordered()
            ->select('id', 'name', 'code', 'is_official_canada')
            ->get()
            ->map(function ($language) {
                return [
                    'id' => $language->id,
                    'name' => $language->name, // Automatically translated by HasTranslations
                    'code' => $language->code,
                    'is_official_canada' => $language->is_official_canada,
                ];
            });

        return response()->json($languages);
    }

    /**
     * Get certifications with automatic translation based on user's locale
     */
    public function getCertifications(Request $request): JsonResponse
    {
        $certifications = GlobalCertification::where('is_active', true)
            ->select('id', 'name')
            ->get()
            ->map(function ($cert) {
                return [
                    'id' => $cert->id,
                    'name' => $cert->name, // Automatically translated by HasTranslations
                ];
            });

        return response()->json($certifications);
    }
}


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
    public function getSkills(Request $request): JsonResponse
    {
        $skills = GlobalSkill::active()
            ->ordered()
            ->select('id', 'name', 'category')
            ->toBase()
            ->get();

        return response()->json($skills);
    }

    public function getIndustries(Request $request): JsonResponse
    {
        $industries = GlobalIndustry::active()
            ->ordered()
            ->select('id', 'name')
            ->toBase()
            ->get();

        return response()->json($industries);
    }

    public function getLanguages(Request $request): JsonResponse
    {
        $languages = GlobalLanguage::active()
            ->ordered()
            ->select('id', 'name', 'code', 'is_official_canada')
            ->get(); // Keep eloquent for casts

        return response()->json($languages);
    }

    public function getCertifications(Request $request): JsonResponse
    {
        $certifications = GlobalCertification::where('is_active', true)
            ->select('id', 'name')
            ->toBase()
            ->get();

        return response()->json($certifications);
    }
}


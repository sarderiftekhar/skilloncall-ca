<?php

namespace App\Http\Controllers;

use App\Models\GlobalCity;
use App\Models\GlobalProvince;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    /**
     * Get all provinces
     */
    public function getProvinces(): JsonResponse
    {
        $provinces = GlobalProvince::orderBy('name')->get();

        return response()->json($provinces);
    }

    /**
     * Get cities by province ID
     */
    public function getCitiesByProvince(Request $request, int $provinceId): JsonResponse
    {
        $query = GlobalCity::where('global_province_id', $provinceId);

        // Add search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $cities = $query->orderBy('name')
            ->limit(20) // Limit results for performance
            ->get();

        return response()->json($cities);
    }

    /**
     * Get cities by province code (e.g., "ON", "QC")
     */
    public function getCitiesByProvinceCode(Request $request, string $provinceCode): JsonResponse
    {
        $province = GlobalProvince::where('code', $provinceCode)->first();

        if (!$province) {
            return response()->json([], 404);
        }

        $query = GlobalCity::where('global_province_id', $province->id);

        // Add search filter if provided
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('name', 'like', "%{$search}%");
        }

        $cities = $query->orderBy('name')
            ->limit(20) // Limit results for performance
            ->get();

        return response()->json($cities);
    }
}

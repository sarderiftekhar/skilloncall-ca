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
        $cities = GlobalCity::where('global_province_id', $provinceId)
            ->orderBy('name')
            ->get();

        return response()->json($cities);
    }
}

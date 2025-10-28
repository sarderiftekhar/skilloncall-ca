<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Models\WorkerProfile;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class WorkerAvailabilityController extends Controller
{
    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();

        // Get the worker profile
        $workerProfile = WorkerProfile::where('user_id', $user->id)->first();

        if (!$workerProfile || !$workerProfile->is_profile_complete) {
            return redirect()->route('worker.onboarding.index');
        }

        // Load existing availability data
        $availabilityRecords = $workerProfile->availability()->get();
        $availabilityByMonth = $availabilityRecords
            ->groupBy('effective_month')
            ->map(function ($monthAvailability, $month) {
                return [
                    'month' => $month,
                    'availability' => $monthAvailability->toArray(),
                ];
            })
            ->values()
            ->toArray();

        return Inertia::render('worker/availability', [
            'profileData' => [
                'availability_by_month' => $availabilityByMonth,
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();
        $data = $request->input('data', []);

        Log::info('Availability update attempt', [
            'user_id' => $user->id,
            'data_keys' => array_keys($data),
            'timestamp' => now()->toISOString(),
        ]);

        try {
            $workerProfile = WorkerProfile::where('user_id', $user->id)->first();

            if (!$workerProfile) {
                return response()->json(['success' => false, 'message' => 'Profile not found'], 404);
            }

            DB::beginTransaction();

            // Update availability if provided
            if (isset($data['availability_by_month']) && is_array($data['availability_by_month'])) {
                // Clear existing availability
                $workerProfile->availability()->delete();

                // Create new availability records
                foreach ($data['availability_by_month'] as $monthData) {
                    if (!isset($monthData['month']) || !isset($monthData['availability'])) {
                        continue;
                    }

                    foreach ($monthData['availability'] as $availability) {
                        if (!$availability['is_available']) {
                            continue;
                        }

                        $workerProfile->availability()->create([
                            'effective_month' => $monthData['month'],
                            'day_of_week' => $availability['day_of_week'],
                            'start_time' => $availability['start_time'],
                            'end_time' => $availability['end_time'],
                            'is_available' => $availability['is_available'],
                            'rate_multiplier' => $availability['rate_multiplier'] ?? 1.0,
                        ]);
                    }
                }

                Log::info('Availability updated successfully', [
                    'user_id' => $user->id,
                    'months' => count($data['availability_by_month']),
                ]);
            }

            DB::commit();

            return redirect()->back()->with([
                'success' => true,
                'message' => 'Availability updated successfully!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Availability update failed', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            return redirect()->back()->with([
                'success' => false,
                'message' => 'Failed to update availability. Please try again.'
            ]);
        }
    }
}

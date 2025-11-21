<?php

namespace App\Http\Controllers;

use App\Models\TestResult;
use App\Models\TesterSession;
use App\Models\TestTimeLog;
use App\Models\CustomTest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class UatTestingController extends Controller
{
    /**
     * Display the UAT portal page
     */
    public function index(Request $request): Response
    {
        // Fetch all tests grouped by category
        $tests = TestResult::orderBy('category')
            ->orderBy('feature')
            ->orderBy('sequence_index')
            ->get();

        // Group by category and feature
        $testsByCategory = $tests->groupBy('category');
        $testsByFeature = $tests->groupBy('feature');

        // Calculate progress
        $progress = TestResult::getProgress();

        // Get active session if tester name is provided
        $activeSession = null;
        if ($request->has('tester_name') && $request->tester_name) {
            $activeSession = TesterSession::getActiveSession($request->tester_name);
        }

        // Check admin authentication
        $isAdminAuthenticated = session('uat_admin_authenticated', false);

        return Inertia::render('uat-testing/index', [
            'tests' => $tests,
            'testsByCategory' => $testsByCategory,
            'testsByFeature' => $testsByFeature,
            'progress' => $progress,
            'activeSession' => $activeSession,
            'isAdminAuthenticated' => $isAdminAuthenticated,
        ]);
    }

    /**
     * Update test result
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'test_id' => 'required|string',
            'test_status' => 'required|in:not_tested,pass,fail,blocked',
            'notes' => 'nullable|string',
            'tested_by' => 'nullable|string|max:255',
            'issue_resolved' => 'nullable|boolean',
            'actual_result' => 'nullable|string',
        ]);

        $test = TestResult::where('test_id', $validated['test_id'])->firstOrFail();

        $oldStatus = $test->test_status;
        $newStatus = $validated['test_status'];

        $test->update([
            'test_status' => $newStatus,
            'notes' => $validated['notes'] ?? null,
            'tested_by' => $validated['tested_by'] ?? 'Anonymous Tester',
            'tested_at' => now(),
            'issue_resolved' => $validated['issue_resolved'] ?? false,
            'actual_result' => $validated['actual_result'] ?? null,
        ]);

        // Log action if status changed and tester session exists
        if ($oldStatus !== $newStatus && $validated['tested_by']) {
            $session = TesterSession::getActiveSession($validated['tested_by']);
            if ($session) {
                TestTimeLog::create([
                    'tester_session_id' => $session->id,
                    'test_id' => $validated['test_id'],
                    'action' => 'status_changed',
                    'timestamp' => now(),
                ]);

                // Update session counters
                if ($oldStatus === 'not_tested') {
                    $session->incrementTestCounters($newStatus);
                } elseif ($oldStatus !== 'not_tested' && $newStatus === 'not_tested') {
                    // Reverting to not_tested, decrement counters
                    $session->decrement('tests_completed');
                    if ($oldStatus === 'pass') {
                        $session->decrement('tests_passed');
                    } elseif ($oldStatus === 'fail') {
                        $session->decrement('tests_failed');
                    }
                } else {
                    // Status changed between tested states, update counters
                    if ($oldStatus === 'pass') {
                        $session->decrement('tests_passed');
                    } elseif ($oldStatus === 'fail') {
                        $session->decrement('tests_failed');
                    }
                    if ($newStatus === 'pass') {
                        $session->increment('tests_passed');
                    } elseif ($newStatus === 'fail') {
                        $session->increment('tests_failed');
                    }
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Test updated successfully',
            'test' => $test->fresh(),
        ]);
    }

    /**
     * Start a new testing session
     */
    public function startSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tester_name' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
        ]);

        $session = TesterSession::startSession(
            $validated['tester_name'],
            $validated['user_id'] ?? null
        );

        return response()->json([
            'success' => true,
            'message' => 'Session started successfully',
            'session' => $session,
        ]);
    }

    /**
     * End current session
     */
    public function endSession(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tester_name' => 'required|string|max:255',
        ]);

        $session = TesterSession::getActiveSession($validated['tester_name']);

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'No active session found',
            ], 404);
        }

        $session->endSession();

        return response()->json([
            'success' => true,
            'message' => 'Session ended successfully',
            'session' => $session->fresh(),
        ]);
    }

    /**
     * Get current session status
     */
    public function getSessionStatus(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tester_name' => 'required|string|max:255',
        ]);

        $session = TesterSession::getActiveSession($validated['tester_name']);

        if (!$session) {
            return response()->json([
                'success' => false,
                'session' => null,
            ]);
        }

        return response()->json([
            'success' => true,
            'session' => [
                'id' => $session->id,
                'tester_name' => $session->tester_name,
                'session_start' => $session->session_start,
                'elapsed_time' => $session->getElapsedTime(),
                'formatted_elapsed_time' => $session->getFormattedElapsedTime(),
                'tests_completed' => $session->tests_completed,
                'tests_passed' => $session->tests_passed,
                'tests_failed' => $session->tests_failed,
            ],
        ]);
    }

    /**
     * Log test action
     */
    public function logTestAction(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tester_name' => 'required|string|max:255',
            'test_id' => 'required|string',
            'action' => 'required|in:started,completed,status_changed',
        ]);

        $session = TesterSession::getActiveSession($validated['tester_name']);

        if (!$session) {
            return response()->json([
                'success' => false,
                'message' => 'No active session found',
            ], 404);
        }

        TestTimeLog::create([
            'tester_session_id' => $session->id,
            'test_id' => $validated['test_id'],
            'action' => $validated['action'],
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Action logged successfully',
        ]);
    }

    /**
     * Store custom test entry
     */
    public function storeCustomTest(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tester_name' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
            'section_name' => 'required|string|max:255',
            'what_is_tested' => 'required|string',
            'result_or_feedback' => 'nullable|string',
            'page_url' => 'nullable|url|max:500',
            'screenshots' => 'nullable|array|max:10',
            'screenshots.*' => 'file|image|max:5120|mimes:jpeg,jpg,png,gif',
        ]);

        // Get active session if exists
        $session = TesterSession::getActiveSession($validated['tester_name']);
        $sessionId = $session ? $session->id : null;

        // Handle screenshot uploads
        $screenshotPaths = [];
        if ($request->hasFile('screenshots')) {
            foreach ($request->file('screenshots') as $file) {
                if ($file->isValid()) {
                    $path = $file->store('uat-testing/screenshots', 'public');
                    $screenshotPaths[] = [
                        'path' => $path,
                        'url' => Storage::disk('public')->url($path),
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                    ];
                }
            }
        }

        $customTest = CustomTest::create([
            'tester_name' => $validated['tester_name'],
            'user_id' => $validated['user_id'] ?? null,
            'tester_session_id' => $sessionId,
            'section_name' => $validated['section_name'],
            'what_is_tested' => $validated['what_is_tested'],
            'result_or_feedback' => $validated['result_or_feedback'] ?? null,
            'page_url' => $validated['page_url'] ?? null,
            'screenshots' => !empty($screenshotPaths) ? $screenshotPaths : null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Custom test created successfully',
            'custom_test' => $customTest,
        ]);
    }

    /**
     * Get custom tests for tester
     */
    public function getCustomTests(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'tester_name' => 'required|string|max:255',
        ]);

        $customTests = CustomTest::where('tester_name', $validated['tester_name'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'custom_tests' => $customTests,
        ]);
    }

    /**
     * Update custom test
     */
    public function updateCustomTest(Request $request, int $id): JsonResponse
    {
        $customTest = CustomTest::findOrFail($id);

        $validated = $request->validate([
            'section_name' => 'sometimes|required|string|max:255',
            'what_is_tested' => 'sometimes|required|string',
            'result_or_feedback' => 'nullable|string',
            'page_url' => 'nullable|url|max:500',
        ]);

        $customTest->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Custom test updated successfully',
            'custom_test' => $customTest->fresh(),
        ]);
    }

    /**
     * Delete custom test and screenshots
     */
    public function deleteCustomTest(int $id): JsonResponse
    {
        $customTest = CustomTest::findOrFail($id);

        // Delete screenshots
        if ($customTest->screenshots) {
            foreach ($customTest->screenshots as $screenshot) {
                if (isset($screenshot['path'])) {
                    Storage::disk('public')->delete($screenshot['path']);
                }
            }
        }

        $customTest->delete();

        return response()->json([
            'success' => true,
            'message' => 'Custom test deleted successfully',
        ]);
    }

    /**
     * Admin login
     */
    public function adminLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        // Simple admin authentication (you can enhance this with proper auth)
        $adminEmail = env('UAT_ADMIN_EMAIL', 'admin@skilloncall.ca');
        $adminPassword = env('UAT_ADMIN_PASSWORD', 'admin123');

        if ($validated['email'] === $adminEmail && $validated['password'] === $adminPassword) {
            // Store admin session
            session(['uat_admin_authenticated' => true]);
            session(['uat_admin_email' => $validated['email']]);

            return response()->json([
                'success' => true,
                'message' => 'Admin login successful',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
        ], 401);
    }

    /**
     * Get all sessions and test records for admin
     */
    public function getAdminRecords(Request $request): JsonResponse
    {
        // Check if admin is authenticated
        if (!session('uat_admin_authenticated')) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 401);
        }

        // Get all sessions
        $sessions = TesterSession::with('timeLogs')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($session) {
                return [
                    'id' => $session->id,
                    'tester_name' => $session->tester_name,
                    'session_start' => $session->session_start,
                    'session_end' => $session->session_end,
                    'is_active' => $session->is_active,
                    'total_time_seconds' => $session->total_time_seconds,
                    'formatted_time' => $session->getFormattedElapsedTime(),
                    'tests_completed' => $session->tests_completed,
                    'tests_passed' => $session->tests_passed,
                    'tests_failed' => $session->tests_failed,
                    'date' => $session->date,
                ];
            });

        // Get all test results with tester info
        $testResults = TestResult::whereNotNull('tested_by')
            ->whereNotNull('tested_at')
            ->orderBy('tested_at', 'desc')
            ->get()
            ->map(function ($test) {
                return [
                    'id' => $test->id,
                    'test_id' => $test->test_id,
                    'category' => $test->category,
                    'feature' => $test->feature,
                    'scenario' => $test->scenario,
                    'test_status' => $test->test_status,
                    'tested_by' => $test->tested_by,
                    'tested_at' => $test->tested_at,
                    'issue_resolved' => $test->issue_resolved,
                ];
            });

        return response()->json([
            'success' => true,
            'sessions' => $sessions,
            'test_results' => $testResults,
            'total_sessions' => $sessions->count(),
            'total_tests_completed' => $testResults->count(),
        ]);
    }

    /**
     * Check admin authentication status
     */
    public function checkAdminAuth(Request $request): JsonResponse
    {
        return response()->json([
            'authenticated' => session('uat_admin_authenticated', false),
        ]);
    }

    /**
     * Admin logout
     */
    public function adminLogout(Request $request): JsonResponse
    {
        session()->forget('uat_admin_authenticated');
        session()->forget('uat_admin_email');

        return response()->json([
            'success' => true,
            'message' => 'Admin logged out successfully',
        ]);
    }
}

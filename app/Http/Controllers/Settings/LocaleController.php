<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class LocaleController extends Controller
{
    /**
     * Update the user's language preference
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'locale' => ['required', Rule::in(['en', 'fr'])],
        ]);

        try {
            // Update user's locale in database
            $request->user()->update([
                'locale' => $validated['locale'],
            ]);

            // Also update session for immediate effect
            session(['locale' => $validated['locale']]);

            return response()->json([
                'success' => true,
                'message' => 'Language preference updated successfully',
                'locale' => $validated['locale'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update language preference',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}


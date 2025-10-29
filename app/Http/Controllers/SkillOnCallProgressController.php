<?php

namespace App\Http\Controllers;

use App\Models\ProgressEntry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SkillOnCallProgressController extends Controller
{
    protected string $project = 'skilloncall';

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = ProgressEntry::forProject($this->project);

        // Apply filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('main_section', 'like', "%{$search}%")
                  ->orWhere('feature_section', 'like', "%{$search}%")
                  ->orWhere('conditions_applied', 'like', "%{$search}%")
                  ->orWhere('notes_comments', 'like', "%{$search}%");
            });
        }

        if ($request->has('status_filter') && $request->status_filter) {
            $statusFilter = explode(':', $request->status_filter);
            if (count($statusFilter) === 2) {
                $query->byStatus($statusFilter[0], $statusFilter[1]);
            }
        }

        // Order by latest first
        $query->orderBy('created_at', 'desc');

        $entries = $query->paginate(25)->withQueryString();

        if ($request->expectsJson()) {
            return response()->json($entries);
        }

        return Inertia::render('Progress/Dashboard', [
            'entries' => $entries,
            'filters' => $request->only(['search', 'status_filter']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Progress/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'main_section' => ['required', 'string', 'max:255'],
            'feature_section' => ['nullable', 'string', 'max:255'],
            'conditions_applied' => ['nullable', 'string'],
            'designed' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'testing' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'debug' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'confirm' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'uat' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'notes_comments' => ['nullable', 'string'],
            'page_url_link' => ['nullable', 'url'],
            'screenshots' => ['nullable', 'array'],
            'screenshots.*' => ['file', 'image', 'max:10240'], // 10MB max per image
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $data['project'] = $this->project;

        // Handle screenshot uploads
        if ($request->hasFile('screenshots')) {
            $screenshots = [];
            foreach ($request->file('screenshots') as $file) {
                $path = $file->store('progress-screenshots', 'public');
                $screenshots[] = $path;
            }
            $data['screenshots_pictures'] = $screenshots;
        }

        $entry = ProgressEntry::create($data);

        return response()->json([
            'message' => 'Progress entry created successfully',
            'entry' => $entry
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(ProgressEntry $progressEntry): JsonResponse
    {
        // Ensure the entry belongs to the skilloncall project
        if ($progressEntry->project !== $this->project) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        return response()->json($progressEntry);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ProgressEntry $progressEntry): Response
    {
        // Ensure the entry belongs to the skilloncall project
        if ($progressEntry->project !== $this->project) {
            abort(404);
        }

        return Inertia::render('Progress/Edit', [
            'entry' => $progressEntry
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ProgressEntry $progressEntry): JsonResponse
    {
        // Ensure the entry belongs to the skilloncall project
        if ($progressEntry->project !== $this->project) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'main_section' => ['required', 'string', 'max:255'],
            'feature_section' => ['nullable', 'string', 'max:255'],
            'conditions_applied' => ['nullable', 'string'],
            'designed' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'testing' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'debug' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'confirm' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'uat' => ['nullable', Rule::in(['YES', 'NO', 'PENDING'])],
            'notes_comments' => ['nullable', 'string'],
            'page_url_link' => ['nullable', 'url'],
            'screenshots' => ['nullable', 'array'],
            'screenshots.*' => ['file', 'image', 'max:10240'], // 10MB max per image
            'remove_screenshots' => ['nullable', 'array'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle screenshot removal
        if ($request->has('remove_screenshots') && is_array($request->remove_screenshots)) {
            $currentScreenshots = $progressEntry->screenshots_pictures ?: [];
            foreach ($request->remove_screenshots as $screenshot) {
                if (in_array($screenshot, $currentScreenshots)) {
                    Storage::disk('public')->delete($screenshot);
                    $currentScreenshots = array_filter($currentScreenshots, fn($s) => $s !== $screenshot);
                }
            }
            $data['screenshots_pictures'] = array_values($currentScreenshots);
        }

        // Handle new screenshot uploads
        if ($request->hasFile('screenshots')) {
            $existingScreenshots = $data['screenshots_pictures'] ?? $progressEntry->screenshots_pictures ?? [];
            foreach ($request->file('screenshots') as $file) {
                $path = $file->store('progress-screenshots', 'public');
                $existingScreenshots[] = $path;
            }
            $data['screenshots_pictures'] = $existingScreenshots;
        }

        // Remove screenshots key from data as it's not a database field
        unset($data['screenshots'], $data['remove_screenshots']);

        $progressEntry->update($data);

        return response()->json([
            'message' => 'Progress entry updated successfully',
            'entry' => $progressEntry
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ProgressEntry $progressEntry): JsonResponse
    {
        // Ensure the entry belongs to the skilloncall project
        if ($progressEntry->project !== $this->project) {
            return response()->json(['message' => 'Entry not found'], 404);
        }

        // Delete associated screenshots
        if ($progressEntry->screenshots_pictures) {
            foreach ($progressEntry->screenshots_pictures as $screenshot) {
                Storage::disk('public')->delete($screenshot);
            }
        }

        $progressEntry->delete();

        return response()->json([
            'message' => 'Progress entry deleted successfully'
        ]);
    }

    /**
     * Handle pasted screenshots (base64 images).
     */
    public function uploadPastedScreenshot(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'image' => ['required', 'string'], // base64 image
            'filename' => ['nullable', 'string'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $imageData = $request->image;
        
        // Remove data:image/png;base64, or similar prefix
        if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
            $imageData = substr($imageData, strpos($imageData, ',') + 1);
            $type = strtolower($type[1]); // jpg, png, gif
            
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                return response()->json(['message' => 'Invalid image type'], 422);
            }
        } else {
            return response()->json(['message' => 'Invalid image format'], 422);
        }

        $imageData = base64_decode($imageData);
        
        if ($imageData === false) {
            return response()->json(['message' => 'Failed to decode image'], 422);
        }

        $filename = ($request->filename ?: 'pasted-screenshot-' . time()) . '.' . $type;
        $path = 'progress-screenshots/' . $filename;
        
        Storage::disk('public')->put($path, $imageData);

        return response()->json([
            'message' => 'Screenshot uploaded successfully',
            'path' => $path,
            'url' => Storage::disk('public')->url($path)
        ]);
    }
}

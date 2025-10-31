<?php

namespace App\Http\Controllers;

use App\Models\ProgressEntry;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\ImageCompressionService;

class SkillOnCallProgressController extends Controller
{
    protected string $project = 'skilloncall';
    protected ImageCompressionService $imageService;

    public function __construct(ImageCompressionService $imageService)
    {
        $this->imageService = $imageService;
    }

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
    public function store(Request $request): JsonResponse|RedirectResponse
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
            'screenshots' => ['nullable', 'array', 'max:5'], // Limit to 5 screenshots
            'screenshots.*' => ['file', 'image', 'max:5120', 'mimes:jpeg,jpg,png,gif'], // 5MB max per image, specific formats
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            return back()->withErrors($validator)->withInput();
        }

        $data = $validator->validated();
        $data['project'] = $this->project;

        // Handle screenshot uploads with timeout protection
        if ($request->hasFile('screenshots')) {
            try {
                // Extend execution time for file uploads
                set_time_limit(300); // 5 minutes
                
                $screenshots = [];
                $totalSize = 0;
                $maxTotalSize = 25 * 1024 * 1024; // 25MB total limit
                
                foreach ($request->file('screenshots') as $index => $file) {
                    // Check individual file size
                    if ($file->getSize() > 5 * 1024 * 1024) { // 5MB limit
                        return $this->handleValidationError($request, "Screenshot " . ($index + 1) . " is too large. Maximum size is 5MB.");
                    }
                    
                    $totalSize += $file->getSize();
                    if ($totalSize > $maxTotalSize) {
                        return $this->handleValidationError($request, "Total screenshots size exceeds 25MB limit.");
                    }
                    
                    // Use image compression if available, fallback to direct storage
                    if ($this->imageService->isAvailable()) {
                        $path = $this->imageService->compressScreenshot($file, 'progress-screenshots');
                    } else {
                        $path = $file->store('progress-screenshots', 'public');
                    }
                    $screenshots[] = $path;
                }
                $data['screenshots_pictures'] = $screenshots;
            } catch (\Exception $e) {
                \Log::error('Screenshot upload failed', [
                    'error' => $e->getMessage(),
                    'user_agent' => $request->userAgent()
                ]);
                
                return $this->handleValidationError($request, 'Screenshot upload failed. Please try again or use smaller images.');
            }
        }

        $entry = ProgressEntry::create($data);

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Progress entry created successfully',
                'entry' => $entry
            ], 201);
        }

        return redirect()->route('progress.index')->with('success', 'Progress entry created successfully!');
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
    public function update(Request $request, ProgressEntry $progressEntry): JsonResponse|RedirectResponse
    {
        // Ensure the entry belongs to the skilloncall project
        if ($progressEntry->project !== $this->project) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Entry not found'], 404);
            }
            
            return redirect()->route('progress.index')->withErrors(['error' => 'Entry not found']);
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
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }
            
            return back()->withErrors($validator)->withInput();
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

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Progress entry updated successfully',
                'entry' => $progressEntry
            ]);
        }

        return redirect()->route('progress.index')->with('success', 'Progress entry updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, ProgressEntry $progressEntry): JsonResponse|RedirectResponse
    {
        // Ensure the entry belongs to the skilloncall project
        if ($progressEntry->project !== $this->project) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Entry not found'], 404);
            }
            
            return redirect()->route('progress.index')->withErrors(['error' => 'Entry not found']);
        }

        // Delete associated screenshots
        if ($progressEntry->screenshots_pictures) {
            foreach ($progressEntry->screenshots_pictures as $screenshot) {
                Storage::disk('public')->delete($screenshot);
            }
        }

        $progressEntry->delete();

        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Progress entry deleted successfully'
            ]);
        }

        return redirect()->route('progress.index')->with('success', 'Progress entry deleted successfully!');
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

        try {
            // Extend execution time for image processing
            set_time_limit(120); // 2 minutes
            
            $imageData = $request->image;
            
            // Validate base64 string size before processing (prevent memory issues)
            $base64Size = strlen($imageData);
            $maxBase64Size = 7 * 1024 * 1024; // ~5MB when decoded (base64 is ~33% larger)
            
            if ($base64Size > $maxBase64Size) {
                return response()->json([
                    'message' => 'Image is too large. Maximum size is 5MB.'
                ], 422);
            }
            
            // Remove data:image/png;base64, or similar prefix
            if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                $imageData = substr($imageData, strpos($imageData, ',') + 1);
                $type = strtolower($type[1]); // jpg, png, gif
                
                if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                    return response()->json(['message' => 'Invalid image type. Supported: JPG, PNG, GIF'], 422);
                }
            } else {
                return response()->json(['message' => 'Invalid image format'], 422);
            }

            // Check memory availability before decoding
            $memoryUsage = memory_get_usage(true);
            $memoryLimit = $this->getMemoryLimitInBytes();
            
            if ($memoryLimit > 0 && ($memoryUsage + $base64Size) > ($memoryLimit * 0.8)) {
                return response()->json([
                    'message' => 'Insufficient memory to process image. Please use a smaller image.'
                ], 422);
            }

            $decodedImage = base64_decode($imageData);
            
            if ($decodedImage === false) {
                return response()->json(['message' => 'Failed to decode image'], 422);
            }
            
            // Validate decoded image size
            $decodedSize = strlen($decodedImage);
            $maxSize = 5 * 1024 * 1024; // 5MB
            
            if ($decodedSize > $maxSize) {
                return response()->json([
                    'message' => 'Decoded image is too large. Maximum size is 5MB.'
                ], 422);
            }

            // Use image compression for base64 images if available
            if ($this->imageService->isAvailable()) {
                $path = $this->imageService->compressBase64Image($request->image, 'progress-screenshots');
            } else {
                $filename = ($request->filename ?: 'pasted-screenshot-' . time()) . '.' . $type;
                $path = 'progress-screenshots/' . $filename;
                Storage::disk('public')->put($path, $decodedImage);
            }

            return response()->json([
                'message' => 'Screenshot uploaded successfully',
                'path' => $path,
                'url' => Storage::disk('public')->url($path)
            ]);
            
        } catch (\Exception $e) {
            \Log::error('Base64 screenshot upload failed', [
                'error' => $e->getMessage(),
                'memory_usage' => memory_get_usage(true),
                'user_agent' => $request->userAgent()
            ]);
            
            return response()->json([
                'message' => 'Screenshot upload failed. Please try again with a smaller image.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }
    
    /**
     * Get PHP memory limit in bytes
     */
    private function getMemoryLimitInBytes(): int
    {
        $memoryLimit = ini_get('memory_limit');
        
        if ($memoryLimit === '-1') {
            return -1; // No limit
        }
        
        $value = (int) $memoryLimit;
        $unit = strtolower(substr($memoryLimit, -1));
        
        switch ($unit) {
            case 'g': $value *= 1024;
            case 'm': $value *= 1024;
            case 'k': $value *= 1024;
        }
        
        return $value;
    }
    
    /**
     * Handle validation error response
     */
    private function handleValidationError(Request $request, string $message)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => ['screenshots' => [$message]]
            ], 422);
        }
        
        return back()->withErrors(['screenshots' => $message])->withInput();
    }
}

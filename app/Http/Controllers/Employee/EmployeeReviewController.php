<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\CreateReviewRequest;
use App\Http\Requests\Review\UpdateReviewRequest;
use App\Models\Application;
use App\Models\Review;
use App\Services\Review\ReviewService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeReviewController extends Controller
{
    public function __construct(
        protected ReviewService $reviewService
    ) {}

    /**
     * Display a listing of reviews for the authenticated employee.
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();
        $reviews = $this->reviewService->getReviewsForUser($user, $request->all());
        $stats = $this->reviewService->getReviewStats($user);

        return Inertia::render('employee/reviews/index', [
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $request->only(['type', 'rating', 'from_date', 'to_date']),
        ]);
    }

    /**
     * Show the form for creating a new review.
     */
    public function create(Application $application): Response
    {
        $this->authorize('view', $application);
        
        $reviewInfo = $this->reviewService->canReviewApplication(auth()->user(), $application);

        if (!$reviewInfo['can_review'] && !$reviewInfo['existing_review']) {
            abort(403, 'You are not eligible to review this application.');
        }

        return Inertia::render('employee/reviews/create', [
            'application' => $application->load(['job', 'job.employer', 'employee']),
            'reviewee' => $reviewInfo['reviewee'],
            'existingReview' => $reviewInfo['existing_review'],
        ]);
    }

    /**
     * Store a newly created review.
     */
    public function store(CreateReviewRequest $request): RedirectResponse
    {
        $application = Application::findOrFail($request->application_id);
        
        $this->authorize('view', $application);

        try {
            $review = $this->reviewService->createReview($request->validated(), $application);

            return redirect()->route('employee.applications.show', $application)
                ->with('success', __('reviews.created_successfully'));
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Show the form for editing the specified review.
     */
    public function edit(Review $review): Response
    {
        $this->authorize('update', $review);

        return Inertia::render('employee/reviews/edit', [
            'review' => $review->load(['application', 'application.job', 'reviewee']),
        ]);
    }

    /**
     * Update the specified review.
     */
    public function update(UpdateReviewRequest $request, Review $review): RedirectResponse
    {
        $this->authorize('update', $review);

        try {
            $this->reviewService->updateReview($review, $request->validated());

            return redirect()->route('employee.reviews.index')
                ->with('success', __('reviews.updated_successfully'));
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Remove the specified review.
     */
    public function destroy(Review $review): RedirectResponse
    {
        $this->authorize('delete', $review);

        try {
            $this->reviewService->deleteReview($review);

            return redirect()->route('employee.reviews.index')
                ->with('success', __('reviews.deleted_successfully'));
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Check if user can review a specific application.
     */
    public function canReview(Application $application): \Illuminate\Http\JsonResponse
    {
        $this->authorize('view', $application);
        
        $reviewInfo = $this->reviewService->canReviewApplication(auth()->user(), $application);

        return response()->json($reviewInfo);
    }
}

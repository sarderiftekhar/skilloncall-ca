<?php

namespace App\Http\Controllers\Review;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\User;
use App\Services\Review\ReviewService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReviewController extends Controller
{
    public function __construct(
        protected ReviewService $reviewService
    ) {}

    /**
     * Display a listing of reviews for a user.
     */
    public function index(Request $request, User $user): Response
    {
        $reviews = $this->reviewService->getReviewsForUser($user, $request->all());
        $stats = $this->reviewService->getReviewStats($user);

        return Inertia::render('reviews/index', [
            'user' => $user->load(['employeeProfile', 'employerProfile']),
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $request->only(['type', 'rating', 'from_date', 'to_date']),
        ]);
    }
}

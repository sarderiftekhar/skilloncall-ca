<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\HireWorkerRequest;
use App\Http\Requests\Employer\RateWorkerRequest;
use App\Models\User;
use App\Services\Employer\EmployerWorkerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Inertia\Inertia;
use Inertia\Response;

class EmployerWorkerController extends Controller
{
    public function __construct(
        protected EmployerWorkerService $workerService
    ) {}

    /**
     * Display a listing of workers.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $activeSubscription = $user?->activeSubscription();
        $plan = $activeSubscription?->plan;
        $isFreeTier = ! $activeSubscription || ($plan && $plan->isFree());

        $workers = $this->workerService->getWorkers($request->all(), $isFreeTier);

        $collection = collect($workers->items());

        $analytics = [
            'total_matches' => $workers->total(),
            'available_now' => $collection->filter(fn ($worker) => ! empty($worker['availability_summary']))->count(),
            'top_skills' => $collection
                ->flatMap(fn ($worker) => $worker['skills'] ?? [])
                ->countBy()
                ->sortDesc()
                ->take(6)
                ->keys()
                ->values()
                ->all(),
            'average_rate' => $this->formatAverageRate($collection),
            'senior_talent' => $collection
                ->filter(fn ($worker) => in_array($worker['experience_level'] ?? null, ['senior', 'expert'], true))
                ->count(),
        ];

        $filterOptions = $this->normalizeFilterOptions(
            $this->workerService->getFilterMetadata()
        );

        return Inertia::render('employer/employees/index', [
            'workers' => $workers,
            'filters' => $request->only([
                'search',
                'skills',
                'rating',
                'availability',
                'province',
                'city',
                'experience_level',
                'languages',
                'certifications',
                'rate_min',
                'rate_max',
            ]),
            'filterOptions' => $filterOptions,
            'analytics' => $analytics,
            'isFreeTier' => $isFreeTier,
        ]);
    }

    protected function formatAverageRate(Collection $collection): ?float
    {
        $rates = $collection
            ->flatMap(function ($worker) {
                $values = [];

                if (isset($worker['hourly_rate_min']) && is_numeric($worker['hourly_rate_min'])) {
                    $values[] = (float) $worker['hourly_rate_min'];
                }

                if (isset($worker['hourly_rate_max']) && is_numeric($worker['hourly_rate_max'])) {
                    $values[] = (float) $worker['hourly_rate_max'];
                }

                return $values;
            })
            ->filter();

        if ($rates->isEmpty()) {
            return null;
        }

        return round($rates->avg(), 2);
    }

    protected function normalizeFilterOptions(array $options): array
    {
        return collect($options)->map(function ($value) {
            if ($value instanceof Collection) {
                return $value->map(function ($item) {
                    if ($item instanceof Collection) {
                        return $item->toArray();
                    }

                    return $item;
                })->values()->toArray();
            }

            if (is_array($value)) {
                return array_values(array_map(function ($item) {
                    if ($item instanceof Collection) {
                        return $item->toArray();
                    }

                    return $item;
                }, $value));
            }

            return $value;
        })->toArray();
    }

    /**
     * Display the specified worker.
     */
    public function show(User $worker): Response
    {
        $workerDetails = $this->workerService->getWorkerDetails($worker);

        return Inertia::render('employer/workers/show', [
            'worker' => $workerDetails,
        ]);
    }

    /**
     * Hire the specified worker.
     */
    public function hire(HireWorkerRequest $request, User $worker): RedirectResponse
    {
        $this->workerService->hireWorker(auth()->user(), $worker, $request->validated());

        return redirect()->back()
            ->with('success', 'Worker hired successfully.');
    }

    /**
     * Rate the specified worker.
     */
    public function rate(RateWorkerRequest $request, User $worker): RedirectResponse
    {
        $this->workerService->rateWorker(auth()->user(), $worker, $request->validated());

        return redirect()->back()
            ->with('success', 'Worker rated successfully.');
    }
}


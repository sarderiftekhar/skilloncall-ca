<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employer\HireWorkerRequest;
use App\Http\Requests\Employer\RateWorkerRequest;
use App\Models\User;
use App\Services\Employer\EmployerWorkerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
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
        $workers = $this->workerService->getWorkers($request->all());

        return Inertia::render('employer/workers/index', [
            'workers' => $workers,
            'filters' => $request->only(['search', 'skills', 'rating', 'availability']),
        ]);
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

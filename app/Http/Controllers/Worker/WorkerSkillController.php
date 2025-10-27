<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use App\Http\Requests\Worker\StoreSkillRequest;
use App\Models\Skill;
use App\Services\Worker\WorkerSkillService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkerSkillController extends Controller
{
    public function __construct(
        protected WorkerSkillService $skillService
    ) {}

    /**
     * Display a listing of worker's skills.
     */
    public function index(Request $request): Response
    {
        $skills = $this->skillService->getWorkerSkills(auth()->user());

        return Inertia::render('worker/skills/index', [
            'skills' => $skills,
            'availableSkills' => $this->skillService->getAvailableSkills(),
        ]);
    }

    /**
     * Store a newly created skill in storage.
     */
    public function store(StoreSkillRequest $request): RedirectResponse
    {
        $this->skillService->addSkill(auth()->user(), $request->validated());

        return redirect()->back()
            ->with('success', 'Skill added successfully.');
    }

    /**
     * Remove the specified skill from storage.
     */
    public function destroy(Skill $skill): RedirectResponse
    {
        $this->authorize('delete', $skill);
        
        $this->skillService->removeSkill($skill);

        return redirect()->back()
            ->with('success', 'Skill removed successfully.');
    }
}

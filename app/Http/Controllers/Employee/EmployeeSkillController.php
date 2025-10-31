<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use App\Http\Requests\Employee\StoreSkillRequest;
use App\Models\Skill;
use App\Services\Employee\EmployeeSkillService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeSkillController extends Controller
{
    public function __construct(
        protected EmployeeSkillService $skillService
    ) {}

    /**
     * Display a listing of employee's skills.
     */
    public function index(Request $request): Response
    {
        $skills = $this->skillService->getEmployeeSkills(auth()->user());

        return Inertia::render('employee/skills/index', [
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


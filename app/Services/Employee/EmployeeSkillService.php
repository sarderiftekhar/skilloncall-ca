<?php

namespace App\Services\Employee;

use App\Models\User;
use App\Models\Skill;
use App\Models\GlobalSkill;
use Illuminate\Support\Collection;

class EmployeeSkillService
{
    /**
     * Get employee's skills.
     */
    public function getEmployeeSkills(User $employee): Collection
    {
        return $employee->skills()->get();
    }

    /**
     * Get available skills for selection.
     */
    public function getAvailableSkills(): Collection
    {
        return GlobalSkill::orderBy('name')->get();
    }

    /**
     * Add a skill to employee's profile.
     */
    public function addSkill(User $employee, array $data): Skill
    {
        return $employee->skills()->create($data);
    }

    /**
     * Remove a skill from employee's profile.
     */
    public function removeSkill(Skill $skill): bool
    {
        return $skill->delete();
    }
}


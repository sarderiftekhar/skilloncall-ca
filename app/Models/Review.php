<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'job_id',
        'application_id',
        'reviewer_id',
        'reviewee_id',
        'rating',
        'comment',
        'type',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'rating' => 'integer',
    ];

    /**
     * Get the job that the review is for.
     */
    public function job(): BelongsTo
    {
        return $this->belongsTo(Job::class);
    }

    /**
     * Get the user who wrote the review.
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Get the user being reviewed.
     */
    public function reviewee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewee_id');
    }

    /**
     * Get the application that the review is for.
     */
    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /**
     * Scope a query to only include reviews for employees.
     */
    public function scopeForEmployee($query)
    {
        return $query->where('type', 'employer_to_employee');
    }

    /**
     * Scope a query to only include reviews for employers.
     */
    public function scopeForEmployer($query)
    {
        return $query->where('type', 'employee_to_employer');
    }

    /**
     * Check if the review can be edited.
     */
    public function canBeEdited(): bool
    {
        // Reviews can be edited within 7 days of creation
        return $this->created_at->addDays(7)->isFuture();
    }

    /**
     * Check if the review is editable.
     */
    public function isEditable(): bool
    {
        return $this->canBeEdited();
    }
}

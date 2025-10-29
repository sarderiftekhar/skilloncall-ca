<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgressEntry extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'project',
        'main_section',
        'feature_section',
        'conditions_applied',
        'designed',
        'testing',
        'debug',
        'confirm',
        'uat',
        'notes_comments',
        'page_url_link',
        'screenshots_pictures',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'screenshots_pictures' => 'array',
    ];

    /**
     * Scope a query to only include entries for a specific project.
     */
    public function scopeForProject($query, string $project)
    {
        return $query->where('project', $project);
    }

    /**
     * Scope a query to filter by status columns.
     */
    public function scopeByStatus($query, string $column, string $status)
    {
        return $query->where($column, $status);
    }

    /**
     * Get all status columns and their current values.
     */
    public function getStatusesAttribute(): array
    {
        return [
            'designed' => $this->designed,
            'testing' => $this->testing,
            'debug' => $this->debug,
            'confirm' => $this->confirm,
            'uat' => $this->uat,
        ];
    }
}

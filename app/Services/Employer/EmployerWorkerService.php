<?php

namespace App\Services\Employer;

use App\Models\User;
use App\Models\EmployeeProfile;
use App\Models\GlobalSkill;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class EmployerWorkerService
{
    /**
     * Get workers based on filters.
     */
    public function getWorkers(array $filters): LengthAwarePaginator
    {
        $query = User::query()
            ->where('role', 'employee')
            ->whereHas('employeeProfile', function (Builder $q) {
                $q->where('is_profile_complete', true);
            })
            ->with(['employeeProfile', 'employeeProfile.skills', 'employeeProfile.reviews']);

        // Search by keyword (name, bio, job title/skills)
        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhereHas('employeeProfile', function (Builder $q) use ($search) {
                      $q->where('bio', 'like', "%{$search}%")
                        ->orWhere('first_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('employeeProfile.skills', function (Builder $q) use ($search) {
                      $q->where('global_skills.name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by Skills
        if (!empty($filters['skills'])) {
            $skillIds = is_array($filters['skills']) ? $filters['skills'] : explode(',', $filters['skills']);
            $query->whereHas('employeeProfile.skills', function (Builder $q) use ($skillIds) {
                $q->whereIn('global_skills.id', $skillIds);
            });
        }

        // Filter by Location (City or Province)
        if (!empty($filters['location'])) {
            $location = $filters['location'];
            $query->whereHas('employeeProfile', function (Builder $q) use ($location) {
                $q->where('city', 'like', "%{$location}%")
                  ->orWhere('province', 'like', "%{$location}%");
            });
        }

        // Filter by Hourly Rate
        if (!empty($filters['min_rate'])) {
            $query->whereHas('employeeProfile', function (Builder $q) use ($filters) {
                $q->where('hourly_rate_min', '>=', $filters['min_rate']);
            });
        }

        if (!empty($filters['max_rate'])) {
            $query->whereHas('employeeProfile', function (Builder $q) use ($filters) {
                $q->where('hourly_rate_min', '<=', $filters['max_rate']);
            });
        }

        // Filter by Availability
        if (!empty($filters['availability'])) {
            // This assumes we check if they have ANY availability slots
            // Or specific days/times if the filter is more complex.
            // For now, just check if they have set availability.
            if ($filters['availability'] === 'available') {
                 $query->whereHas('employeeProfile.availability', function (Builder $q) {
                     $q->where('is_available', true);
                 });
            }
        }

        // Sorting
        $sort = $filters['sort'] ?? 'newest';
        switch ($sort) {
            case 'rate_high':
                $query->join('employee_profiles', 'users.id', '=', 'employee_profiles.user_id')
                      ->orderBy('employee_profiles.hourly_rate_min', 'desc')
                      ->select('users.*'); // Avoid column collisions
                break;
            case 'rate_low':
                $query->join('employee_profiles', 'users.id', '=', 'employee_profiles.user_id')
                      ->orderBy('employee_profiles.hourly_rate_min', 'asc')
                      ->select('users.*');
                break;
            case 'rating':
                // Assuming we have a way to calculate average rating, or sort by review count
                // For now, let's just sort by newest as a fallback or implement if review stats are on profile
                $query->latest('users.created_at');
                break;
            default:
                $query->latest('users.created_at');
                break;
        }

        $results = $query->paginate(12)->withQueryString();
        
        // Normalize profile photos - filter out broken/missing images
        $results->getCollection()->transform(function ($worker) {
            $this->normalizeProfilePhoto($worker);
            return $worker;
        });
        
        return $results;
    }

    /**
     * Normalize employee profile photos after loading.
     */
    protected function normalizeProfilePhoto($worker)
    {
        if ($worker->employeeProfile && $worker->employeeProfile->profile_photo) {
            $photo = $worker->employeeProfile->profile_photo;
            
            // If it's a full URL (likely a broken CDN link), set to null
            if (str_starts_with($photo, 'http://') || str_starts_with($photo, 'https://')) {
                $worker->employeeProfile->profile_photo = null;
                return;
            }
            
            // Remove any existing storage/ or /storage/ prefix
            $photo = preg_replace('#^/?storage/#', '', $photo);
            $photo = ltrim($photo, '/');
            
            // Check if file exists
            if (\Storage::disk('public')->exists($photo)) {
                $worker->employeeProfile->profile_photo = $photo;
            } else {
                // File doesn't exist - set to null so frontend shows initials
                $worker->employeeProfile->profile_photo = null;
            }
        }
    }

    /**
     * Get detailed information for a specific worker.
     */
    public function getWorkerDetails(User $worker): User
    {
        $worker = $worker->load([
            'employeeProfile',
            'employeeProfile.skills',
            'employeeProfile.languages',
            'employeeProfile.workExperiences.skill',
            'employeeProfile.workExperiences.industry',
            'employeeProfile.certifications.certification',
            'employeeProfile.references',
            'employeeProfile.portfolios',
            'employeeProfile.reviews.reviewer',
            'employeeProfile.availability',
            'employeeProfile.serviceAreas'
        ]);

        // Normalize image URLs to prevent double /storage/ prefix
        if ($worker->employeeProfile && $worker->employeeProfile->profile_photo) {
            $photo = $worker->employeeProfile->profile_photo;
            
            // Check if file exists before trying to serve it
            $fileExists = false;
            
            // If it's a CDN URL that might not be accessible, try to convert to local path
            if (str_starts_with($photo, 'http://') || str_starts_with($photo, 'https://')) {
                // Check if it's a CDN URL (like cdn.skilloncall.ca)
                if (str_contains($photo, 'cdn.skilloncall') || str_contains($photo, 'cdn.')) {
                    // Try to extract the filename and convert to local storage path
                    $urlParts = parse_url($photo);
                    if (isset($urlParts['path'])) {
                        $pathParts = explode('/', trim($urlParts['path'], '/'));
                        $filename = end($pathParts);
                        
                        // Determine the storage directory based on URL path
                        if (str_contains($photo, '/profiles/') || str_contains($photo, '/profile_photos/')) {
                            $localPath = 'profile_photos/' . $filename;
                        } elseif (str_contains($photo, '/portfolio/') || str_contains($photo, '/portfolio_photos/')) {
                            $localPath = 'portfolio_photos/' . $filename;
                        } else {
                            // Default to profile_photos
                            $localPath = 'profile_photos/' . $filename;
                        }
                        
                        // Check if file exists in local storage
                        if (\Storage::disk('public')->exists($localPath)) {
                            $worker->employeeProfile->profile_photo = $localPath;
                            $fileExists = true;
                        }
                    }
                }
                // For other full URLs, assume they're accessible
                $fileExists = true;
            } else {
                // Remove any existing storage/ or /storage/ prefix to avoid duplication
                $photo = preg_replace('#^/?storage/#', '', $photo);
                // Ensure path doesn't start with a slash
                $photo = ltrim($photo, '/');
                
                // Check if file exists
                if (\Storage::disk('public')->exists($photo)) {
                    $worker->employeeProfile->profile_photo = $photo;
                    $fileExists = true;
                }
            }
            
            // If file doesn't exist, set profile_photo to null so frontend shows initials
            if (!$fileExists) {
                $worker->employeeProfile->profile_photo = null;
            }
        }

        // Normalize portfolio_photos paths
        if ($worker->employeeProfile && $worker->employeeProfile->portfolio_photos && is_array($worker->employeeProfile->portfolio_photos)) {
            $portfolioPhotos = [];
            foreach ($worker->employeeProfile->portfolio_photos as $photo) {
                if (is_array($photo) && isset($photo['path'])) {
                    $path = $photo['path'];
                    // If it's already a full URL, use it as is
                    if (!str_starts_with($path, 'http://') && !str_starts_with($path, 'https://')) {
                        // Remove any existing storage/ or /storage/ prefix to avoid duplication
                        $path = preg_replace('#^/?storage/#', '', $path);
                        // Ensure path doesn't start with a slash
                        $path = ltrim($path, '/');
                        // Store just the relative path (e.g., "portfolio_photos/filename.jpg")
                        // Frontend will add /storage/ prefix
                    }
                    $portfolioPhotos[] = [
                        'path' => $path,
                        'caption' => $photo['caption'] ?? $photo['description'] ?? '',
                        'description' => $photo['description'] ?? $photo['caption'] ?? '',
                    ];
                }
            }
            $worker->employeeProfile->portfolio_photos = $portfolioPhotos;
        }

        return $worker;
    }

    /**
     * Hire a worker.
     */
    public function hireWorker(User $employer, User $worker, array $data): void
    {
        // Logic to create a job contract or application acceptance
        // For now, this is a placeholder
        
        // Example: Create a 'Hire' record or notify the worker
    }

    /**
     * Rate a worker.
     */
    public function rateWorker(User $employer, User $worker, array $data): void
    {
        // Logic to create a review
        // For now, this is a placeholder
    }
}

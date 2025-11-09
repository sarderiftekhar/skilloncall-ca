<?php

namespace App\Services\Employer;

use App\Models\EmployeeProfile;
use App\Models\GlobalCertification;
use App\Models\GlobalLanguage;
use App\Models\GlobalProvince;
use App\Models\GlobalSkill;
use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class EmployerWorkerService
{
    /**
     * Retrieve paginated employees with optional filters applied.
     */
    public function getWorkers(array $filters = [], bool $maskSensitive = false): LengthAwarePaginator
    {
        $query = EmployeeProfile::query()
            ->with([
                'user' => static function ($builder) {
                    $builder
                        ->select(['id', 'name', 'email', 'role', 'created_at'])
                        ->with(['receivedReviews:id,reviewee_id,rating,created_at']);
                },
                'skills:id,name',
                'languages:id,name',
                'availability:id,employee_profile_id,day_of_week,start_time,end_time,is_available',
                'certifications.certification:id,name',
            ])
            ->where('is_profile_complete', true)
            ->whereHas('user', static function (Builder $builder) {
                $builder->where('role', 'employee');
            });

        $search = trim((string) ($filters['search'] ?? ''));
        if ($search !== '') {
            $query->where(static function (Builder $builder) use ($search) {
                $builder
                    ->where('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%")
                    ->orWhere('city', 'like', "%{$search}%")
                    ->orWhere('province', 'like', "%{$search}%")
                    ->orWhere('bio', 'like', "%{$search}%")
                    ->orWhereHas('skills', static function (Builder $skillQuery) use ($search) {
                        $skillQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        $province = Arr::get($filters, 'province');
        if ($province) {
            $query->where('province', $province);
        }

        $city = trim((string) Arr::get($filters, 'city', ''));
        if ($city !== '') {
            $query->where('city', 'like', "%{$city}%");
        }

        $skills = $this->normalizeArrayFilter($filters, 'skills');
        if (! empty($skills)) {
            $query->whereHas('skills', static function (Builder $skillQuery) use ($skills) {
                $skillQuery->whereIn('name', $skills);
            });
        }

        $languages = $this->normalizeArrayFilter($filters, 'languages');
        if (! empty($languages)) {
            $query->whereHas('languages', static function (Builder $languageQuery) use ($languages) {
                $languageQuery->whereIn('name', $languages);
            });
        }

        $certifications = $this->normalizeArrayFilter($filters, 'certifications');
        if (! empty($certifications)) {
            $query->whereHas('certifications.certification', static function (Builder $certQuery) use ($certifications) {
                $certQuery->whereIn('name', $certifications);
            });
        }

        $experience = Arr::get($filters, 'experience_level');
        if ($experience) {
            $query->where(static function (Builder $builder) use ($experience) {
                $ranges = [
                    'entry' => [0, 2],
                    'mid' => [3, 5],
                    'senior' => [6, 9],
                    'expert' => [10, null],
                ];

                if (isset($ranges[$experience])) {
                    [$min, $max] = $ranges[$experience];

                    if ($min !== null) {
                        $builder->where('overall_experience', '>=', $min);
                    }

                    if ($max !== null) {
                        $builder->where('overall_experience', '<=', $max);
                    }
                }
            });
        }

        $availability = Arr::get($filters, 'availability');
        if ($availability) {
            $query->whereHas('availability', static function (Builder $availabilityQuery) {
                $availabilityQuery->where('is_available', true);
            });
        }

        $rateMin = Arr::get($filters, 'rate_min');
        if (is_numeric($rateMin)) {
            $query->where('hourly_rate_min', '>=', $rateMin);
        }

        $rateMax = Arr::get($filters, 'rate_max');
        if (is_numeric($rateMax)) {
            $query->where(function (Builder $builder) use ($rateMax) {
                $builder->whereNull('hourly_rate_max')->orWhere('hourly_rate_max', '<=', $rateMax);
            });
        }

        $perPage = max(1, (int) ($filters['per_page'] ?? 12));

        $paginated = $query->paginate($perPage)->appends($filters);

        $paginated->getCollection()->transform(
            fn (EmployeeProfile $profile) => $this->transformProfile($profile, $maskSensitive)
        );

        return $paginated;
    }

    /**
     * Retrieve available filter metadata for the search UI.
     */
    public function getFilterMetadata(): array
    {
        return [
            'skills' => GlobalSkill::query()->active()->ordered()->pluck('name')->filter()->values(),
            'languages' => GlobalLanguage::query()->orderBy('name')->pluck('name')->filter()->values(),
            'provinces' => GlobalProvince::query()
                ->orderBy('name')
                ->get(['code', 'name'])
                ->map(fn (GlobalProvince $province) => [
                    'code' => $province->code,
                    'name' => $province->name,
                ]),
            'certifications' => GlobalCertification::query()->orderBy('name')->pluck('name')->filter()->values(),
            'experience_levels' => collect([
                ['value' => 'entry', 'label' => __('0 – 2 years')],
                ['value' => 'mid', 'label' => __('3 – 5 years')],
                ['value' => 'senior', 'label' => __('6 – 9 years')],
                ['value' => 'expert', 'label' => __('10+ years')],
            ]),
            'availability_options' => collect([
                ['value' => 'immediate', 'label' => __('Available now')],
            ]),
        ];
    }

    /**
     * Retrieve detailed worker information.
     */
    public function getWorkerDetails(User $worker, bool $maskSensitive = false): array
    {
        $profile = $worker->employeeProfile()
            ->with([
                'user.receivedReviews:id,reviewee_id,rating,created_at',
                'skills:id,name',
                'languages:id,name',
                'availability',
                'certifications.certification',
            ])
            ->firstOrFail();

        return $this->transformProfile($profile, $maskSensitive);
    }

    /**
     * Placeholder for hiring workflow (to be wired with business logic).
     */
    public function hireWorker(User $employer, User $worker, array $payload): void
    {
        Log::info('Hire worker requested', [
            'employer_id' => $employer->id,
            'worker_id' => $worker->id,
            'payload' => $payload,
        ]);
    }

    /**
     * Placeholder for rating workflow (to be wired with business logic).
     */
    public function rateWorker(User $employer, User $worker, array $payload): void
    {
        Log::info('Rate worker requested', [
            'employer_id' => $employer->id,
            'worker_id' => $worker->id,
            'payload' => $payload,
        ]);
    }

    /**
     * Normalize request filter to array.
     */
    protected function normalizeArrayFilter(array $filters, string $key): array
    {
        $value = Arr::get($filters, $key, []);

        if (is_string($value)) {
            $decoded = json_decode($value, true);
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                $value = $decoded;
            } else {
                $value = array_filter(array_map('trim', explode(',', $value)));
            }
        }

        if (! is_array($value)) {
            return [];
        }

        return array_values(array_filter(array_map(static function ($item) {
            return is_string($item) ? trim($item) : null;
        }, $value)));
    }

    protected function transformProfile(EmployeeProfile $profile, bool $maskSensitive = false): array
    {
        $fullName = trim($profile->full_name ?? $profile->user->name ?? '');
        $maskedName = $maskSensitive ? $this->maskName($fullName) : $fullName;

        $email = $profile->user?->email;
        $phone = $profile->phone;

        $averageRating = null;
        $reviewCount = 0;

        if ($profile->relationLoaded('user') && $profile->user) {
            $reviews = $profile->user->receivedReviews;
            $averageRating = $reviews->isNotEmpty()
                ? round($reviews->avg('rating'), 1)
                : null;
            $reviewCount = $reviews->count();
        }

        $skills = $profile->skills?->pluck('name')->unique()->values()->all() ?? [];
        $languages = $profile->languages?->pluck('name')->unique()->values()->all() ?? [];
        $certifications = $profile->certifications?->map(function ($cert) {
            return $cert->certification?->name;
        })->filter()->unique()->values()->all() ?? [];

        return [
            'id' => $profile->user?->id,
            'full_name' => $fullName,
            'display_name' => $maskedName ?: __('Employee'),
            'title' => Arr::get($profile->work_preferences ?? [], 'headline') ?: ($skills[0] ?? null),
            'summary' => Str::limit((string) $profile->bio, 160),
            'location' => $this->formatLocation($profile->city, $profile->province),
            'city' => $profile->city,
            'province' => $profile->province,
            'experience_years' => $profile->overall_experience,
            'experience_level' => $this->resolveExperienceLevel($profile->overall_experience),
            'hourly_rate_min' => $profile->hourly_rate_min,
            'hourly_rate_max' => $profile->hourly_rate_max,
            'skills' => $skills,
            'languages' => $languages,
            'certifications' => $certifications,
            'availability_summary' => $this->formatAvailabilitySummary($profile),
            'rating' => [
                'average' => $averageRating,
                'count' => $reviewCount,
            ],
            'badges' => $this->resolveBadges($profile, $averageRating, $reviewCount),
            'contact' => [
                'email' => $maskSensitive ? $this->maskEmail($email) : $email,
                'phone' => $maskSensitive ? $this->maskPhone($phone) : $phone,
                'is_masked' => $maskSensitive,
            ],
            'profile_photo' => $profile->profile_photo,
            'last_active_at' => optional($profile->updated_at)->toIso8601String(),
            'profile_completion' => $profile->is_profile_complete ? 100 : $profile->calculateProfileCompletion(),
        ];
    }

    protected function maskName(?string $name): string
    {
        if (blank($name)) {
            return __('Employee');
        }

        return collect(explode(' ', $name))
            ->filter()
            ->map(function ($segment) {
                $first = mb_substr($segment, 0, 1);
                return mb_strtoupper($first).str_repeat('*', max(mb_strlen($segment) - 1, 2));
            })
            ->join(' ');
    }

    protected function maskEmail(?string $email): ?string
    {
        if (blank($email)) {
            return null;
        }

        [$local, $domain] = array_pad(explode('@', $email, 2), 2, '');
        $localMasked = mb_substr($local, 0, 1).str_repeat('*', max(mb_strlen($local) - 1, 3));

        return "{$localMasked}@{$domain}";
    }

    protected function maskPhone(?string $phone): ?string
    {
        if (blank($phone)) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $phone);
        if (strlen($digits) <= 4) {
            return str_repeat('*', strlen($digits));
        }

        $visible = substr($digits, 0, 3);
        $masked = str_repeat('*', max(strlen($digits) - 3, 4));

        return "{$visible}{$masked}";
    }

    protected function formatLocation(?string $city, ?string $province): ?string
    {
        $parts = array_filter([$city, $province]);

        return empty($parts) ? null : implode(', ', $parts);
    }

    protected function resolveExperienceLevel($years): ?string
    {
        if ($years === null || $years === '') {
            return null;
        }

        if (is_string($years)) {
            $numeric = (int) filter_var($years, FILTER_SANITIZE_NUMBER_INT);
            $years = $numeric > 0 ? $numeric : null;
        }

        if (! is_numeric($years)) {
            return null;
        }

        $years = (int) $years;

        return match (true) {
            $years <= 2 => 'entry',
            $years <= 5 => 'mid',
            $years <= 9 => 'senior',
            default => 'expert',
        };
    }

    protected function formatAvailabilitySummary(EmployeeProfile $profile): ?string
    {
        if (! $profile->relationLoaded('availability')) {
            return null;
        }

        $days = $profile->availability
            ->where('is_available', true)
            ->pluck('day_of_week')
            ->unique()
            ->sort()
            ->values();

        if ($days->isEmpty()) {
            return null;
        }

        $dayMap = [
            'monday' => __('Monday'),
            'tuesday' => __('Tuesday'),
            'wednesday' => __('Wednesday'),
            'thursday' => __('Thursday'),
            'friday' => __('Friday'),
            'saturday' => __('Saturday'),
            'sunday' => __('Sunday'),
        ];

        $translated = $days->map(static fn ($day) => $dayMap[strtolower($day)] ?? ucfirst($day));

        return $translated->count() >= 5
            ? __('Weekdays')
            : $translated->implode(', ');
    }

    protected function resolveBadges(EmployeeProfile $profile, ?float $averageRating, int $reviewCount): array
    {
        $badges = [];

        if ($averageRating !== null && $averageRating >= 4.5 && $reviewCount >= 5) {
            $badges[] = __('Top Rated');
        }

        if ($profile->certifications?->isNotEmpty()) {
            $badges[] = __('Certified');
        }

        if ($profile->has_vehicle) {
            $badges[] = __('Mobile');
        }

        if ($profile->has_tools_equipment) {
            $badges[] = __('Equipped');
        }

        return $badges;
    }
}



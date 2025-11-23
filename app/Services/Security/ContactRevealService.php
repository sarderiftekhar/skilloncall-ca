<?php

namespace App\Services\Security;

use App\Models\ContactCredit;
use App\Models\ContactReveal;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Request;

class ContactRevealService
{
    /**
     * Check if employer can reveal contact.
     */
    public static function canReveal(User $employer, User $employee): array
    {
        // Check if already revealed
        if (ContactReveal::hasRevealed($employer->id, $employee->id)) {
            return [
                'can_reveal' => true,
                'reason' => 'already_revealed',
                'message' => 'Contact already revealed',
            ];
        }

        // Get or create credits record
        $credits = self::getOrCreateCredits($employer);

        // Check daily limit
        if ($credits->dailyLimitReached()) {
            return [
                'can_reveal' => false,
                'reason' => 'daily_limit',
                'message' => "Daily limit of {$credits->daily_limit} contact reveals reached",
            ];
        }

        // Check monthly limit
        if ($credits->monthlyLimitReached()) {
            return [
                'can_reveal' => false,
                'reason' => 'monthly_limit',
                'message' => "Monthly limit of {$credits->monthly_limit} contact reveals reached",
            ];
        }

        // Check available credits
        if (!$credits->hasCredits(1)) {
            return [
                'can_reveal' => false,
                'reason' => 'insufficient_credits',
                'message' => 'Insufficient credits. Please upgrade your plan.',
                'credits_available' => $credits->credits_available,
            ];
        }

        return [
            'can_reveal' => true,
            'reason' => 'allowed',
            'message' => 'Contact reveal allowed',
            'credits_available' => $credits->credits_available,
        ];
    }

    /**
     * Reveal contact and deduct credits.
     */
    public static function revealContact(User $employer, User $employee): array
    {
        // Check if can reveal
        $check = self::canReveal($employer, $employee);
        
        if (!$check['can_reveal'] && $check['reason'] !== 'already_revealed') {
            return $check;
        }

        // If already revealed, just return success
        if ($check['reason'] === 'already_revealed') {
            return [
                'success' => true,
                'already_revealed' => true,
                'contact' => self::getContact($employee),
            ];
        }

        DB::beginTransaction();
        try {
            // Get credits
            $credits = self::getOrCreateCredits($employer);

            // Deduct credit
            if (!$credits->deductCredits(1)) {
                DB::rollBack();
                return [
                    'success' => false,
                    'message' => 'Failed to deduct credits',
                ];
            }

            // Create reveal record
            ContactReveal::create([
                'employer_id' => $employer->id,
                'employee_id' => $employee->id,
                'ip_address' => Request::ip(),
                'user_agent' => Request::userAgent(),
                'credits_used' => 1,
            ]);

            // Log the reveal
            SecurityLogService::logContactReveal($employer, $employee);

            DB::commit();

            return [
                'success' => true,
                'contact' => self::getContact($employee),
                'credits_remaining' => $credits->credits_available,
            ];
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Contact reveal failed', [
                'employer_id' => $employer->id,
                'employee_id' => $employee->id,
                'error' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'message' => 'An error occurred. Please try again.',
            ];
        }
    }

    /**
     * Get employee contact information.
     */
    private static function getContact(User $employee): array
    {
        $profile = $employee->employeeProfile;
        
        return [
            'email' => $employee->email,
            'phone' => $profile->phone ?? null,
            'address' => [
                'line_1' => $profile->address_line_1 ?? null,
                'line_2' => $profile->address_line_2 ?? null,
                'city' => $profile->city ?? null,
                'province' => $profile->province ?? null,
                'postal_code' => $profile->postal_code ?? null,
            ],
        ];
    }

    /**
     * Mask contact information.
     */
    public static function maskContact(array $contact): array
    {
        return [
            'email' => self::maskEmail($contact['email'] ?? ''),
            'phone' => self::maskPhone($contact['phone'] ?? ''),
            'address' => [
                'line_1' => '***',
                'line_2' => null,
                'city' => $contact['address']['city'] ?? null, // Keep city visible
                'province' => $contact['address']['province'] ?? null, // Keep province visible
                'postal_code' => self::maskPostalCode($contact['address']['postal_code'] ?? ''),
            ],
        ];
    }

    /**
     * Mask email address.
     */
    private static function maskEmail(string $email): string
    {
        if (empty($email)) return '';
        
        $parts = explode('@', $email);
        if (count($parts) !== 2) return '***@***.***';
        
        $username = $parts[0];
        $domain = $parts[1];
        
        $maskedUsername = substr($username, 0, 3) . '***';
        $maskedDomain = substr($domain, 0, 1) . '***' . substr($domain, -4);
        
        return $maskedUsername . '@' . $maskedDomain;
    }

    /**
     * Mask phone number.
     */
    private static function maskPhone(string $phone): string
    {
        if (empty($phone)) return '';
        
        $digitsOnly = preg_replace('/\D/', '', $phone);
        if (strlen($digitsOnly) < 6) return '***-***-****';
        
        return substr($digitsOnly, 0, 2) . '**' . substr($digitsOnly, -3);
    }

    /**
     * Mask postal code.
     */
    private static function maskPostalCode(string $postalCode): string
    {
        if (empty($postalCode)) return '';
        
        return substr($postalCode, 0, 3) . ' ***';
    }

    /**
     * Get or create contact credits for employer.
     */
    private static function getOrCreateCredits(User $employer): ContactCredit
    {
        $credits = ContactCredit::where('employer_id', $employer->id)->first();

        if (!$credits) {
            // Create with default values based on subscription
            $credits = ContactCredit::create([
                'employer_id' => $employer->id,
                'credits_available' => self::getDefaultCredits($employer),
                'credits_used' => 0,
                'daily_limit' => 10,
                'monthly_limit' => 100,
                'last_reset_at' => now(),
                'expires_at' => now()->addMonth(),
            ]);
        }

        return $credits;
    }

    /**
     * Get default credits based on subscription plan.
     */
    private static function getDefaultCredits(User $employer): int
    {
        // Free tier: 5 credits
        // Basic: 50 credits
        // Pro: 200 credits
        // Enterprise: 500 credits
        
        if (!$employer->hasActivePlan()) {
            return 5; // Free tier
        }

        $plan = $employer->getCurrentPlan();
        
        return match($plan?->name) {
            'Basic' => 50,
            'Pro' => 200,
            'Enterprise' => 500,
            default => 5,
        };
    }

    /**
     * Get credits summary for employer.
     */
    public static function getCreditsSummary(User $employer): array
    {
        $credits = self::getOrCreateCredits($employer);
        $todayReveals = ContactReveal::getTodayCount($employer->id);
        $monthReveals = ContactReveal::getMonthCount($employer->id);

        return [
            'credits_available' => $credits->credits_available,
            'credits_used' => $credits->credits_used,
            'daily_limit' => $credits->daily_limit,
            'daily_used' => $todayReveals,
            'daily_remaining' => max(0, $credits->daily_limit - $todayReveals),
            'monthly_limit' => $credits->monthly_limit,
            'monthly_used' => $monthReveals,
            'monthly_remaining' => max(0, $credits->monthly_limit - $monthReveals),
            'expires_at' => $credits->expires_at,
        ];
    }
}


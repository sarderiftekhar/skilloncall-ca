<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isAdmin();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'general' => ['sometimes', 'array'],
            'general.site_name' => ['sometimes', 'string', 'max:255'],
            'general.site_description' => ['sometimes', 'string', 'max:500'],
            'general.contact_email' => ['sometimes', 'email', 'max:255'],
            'general.timezone' => ['sometimes', 'string', 'max:50'],
            'general.maintenance_mode' => ['sometimes', 'boolean'],
            'general.registration_enabled' => ['sometimes', 'boolean'],
            'general.job_approval_required' => ['sometimes', 'boolean'],
            
            'email' => ['sometimes', 'array'],
            'email.smtp_host' => ['sometimes', 'string', 'max:255'],
            'email.smtp_port' => ['sometimes', 'integer', 'min:1', 'max:65535'],
            'email.smtp_username' => ['sometimes', 'string', 'max:255'],
            'email.smtp_encryption' => ['sometimes', 'string', 'in:tls,ssl'],
            'email.from_address' => ['sometimes', 'email', 'max:255'],
            'email.from_name' => ['sometimes', 'string', 'max:255'],
            
            'payment' => ['sometimes', 'array'],
            'payment.commission_rate' => ['sometimes', 'numeric', 'min:0', 'max:100'],
            'payment.minimum_payout' => ['sometimes', 'numeric', 'min:0'],
            'payment.auto_payout_enabled' => ['sometimes', 'boolean'],
            'payment.payout_schedule' => ['sometimes', 'string', 'in:daily,weekly,monthly'],
            'payment.currency' => ['sometimes', 'string', 'size:3'],
            
            'security' => ['sometimes', 'array'],
            'security.two_factor_enabled' => ['sometimes', 'boolean'],
            'security.password_min_length' => ['sometimes', 'integer', 'min:6', 'max:50'],
            'security.password_require_special' => ['sometimes', 'boolean'],
            'security.session_timeout' => ['sometimes', 'integer', 'min:15', 'max:1440'],
            'security.max_login_attempts' => ['sometimes', 'integer', 'min:3', 'max:20'],
            'security.lockout_duration' => ['sometimes', 'integer', 'min:1', 'max:60'],
        ];
    }
}

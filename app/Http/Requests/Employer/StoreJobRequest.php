<?php

namespace App\Http\Requests\Employer;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->isEmployer();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category' => ['required', 'string', Rule::in([
                'automotive',
                'cleaning_maintenance',
                'construction',
                'customer_service',
                'data_entry',
                'design',
                'event_services',
                'food_service',
                'handyman_services',
                'landscaping_outdoors',
                'marketing',
                'mobile_development',
                'personal_care',
                'personal_services',
                'retail',
                'seasonal_work',
                'technology',
                'trades_maintenance',
                'transportation_delivery',
                'web_development',
                'writing',
                'other'
            ])],
            'budget' => ['required', 'numeric', 'min:0'],
            'deadline' => ['nullable', 'date', 'after:today'],
            'required_skills' => ['nullable', 'array'],
            'required_skills.*' => ['string', 'max:50'],
            'location' => ['nullable', 'string', 'max:255'],
            'job_type' => ['required', 'string', Rule::in(['full_time', 'part_time', 'contract', 'freelance'])],
            'experience_level' => ['required', 'string', Rule::in(['entry', 'intermediate', 'expert'])],
        ];
    }
}

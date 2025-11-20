<?php

namespace App\Http\Requests\Review;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateReviewRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'application_id' => ['required', 'exists:applications,id'],
            'reviewee_id' => ['required', 'exists:users,id', 'different:reviewer_id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'comment' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'application_id.required' => 'The application is required.',
            'application_id.exists' => 'The selected application does not exist.',
            'reviewee_id.required' => 'The person being reviewed is required.',
            'reviewee_id.exists' => 'The selected user does not exist.',
            'reviewee_id.different' => 'You cannot review yourself.',
            'rating.required' => 'A rating is required.',
            'rating.integer' => 'The rating must be a number.',
            'rating.min' => 'The rating must be at least 1 star.',
            'rating.max' => 'The rating must be at most 5 stars.',
            'comment.max' => 'The comment must not exceed 1000 characters.',
        ];
    }
}

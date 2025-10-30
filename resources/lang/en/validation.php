<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Validation Language Lines - English
    |--------------------------------------------------------------------------
    |
    | The following language lines contain the default error messages used by
    | the validator class. Some of these rules have multiple versions such
    | as the size rules. Feel free to tweak each of these messages here.
    |
    */

    // Step 1: Personal Information
    'personal_info' => [
        'first_name_required' => 'First name is required.',
        'last_name_required' => 'Last name is required.',
        'phone_required' => 'Phone number is required.',
        'date_of_birth_before' => 'Date of birth must be in the past.',
        'address_line_1_required' => 'Street address is required.',
        'city_required' => 'City is required.',
        'province_required' => 'Province is required.',
        'province_size' => 'Please select a valid province.',
        'postal_code_required' => 'Postal code is required.',
        'postal_code_regex' => 'Please enter a valid Canadian postal code (e.g., A1A 1A1).',
        'work_authorization_required' => 'Please select your work authorization status.',
    ],

    // Step 2: Skills & Experience
    'skills_experience' => [
        'overall_experience_required' => 'Please select your overall experience level.',
        'selected_skills_required' => 'Please select at least one skill.',
        'selected_skills_min' => 'Please select at least one skill.',
        'skill_id_required' => 'Each skill must have a valid ID.',
        'skill_id_exists' => 'One or more selected skills are invalid.',
        'proficiency_level_required' => 'Please select a proficiency level for each skill.',
    ],

    // Step 3: Work History
    'work_history' => [
        'employment_status_required' => 'Please select your current employment status.',
        'work_experiences_required' => 'Please add at least one work experience.',
        'work_experiences_min' => 'Please add at least one work experience.',
        'company_name_required' => 'Company name is required for each work experience.',
        'job_title_required' => 'Job title is required for each work experience.',
        'start_date_required' => 'Start date is required for each work experience.',
        'end_date_after_or_equal' => 'End date must be after the start date.',
        'reference_name_required' => 'Reference name is required.',
        'reference_phone_required' => 'Reference phone number is required.',
        'reference_email_email' => 'Please provide a valid email address for the reference.',
        'relationship_required' => 'Please specify your relationship with this reference.',
    ],

    // Step 4: Location & Rates
    'location_rates' => [
        'has_vehicle_required' => 'Please indicate if you have a vehicle.',
        'has_tools_equipment_required' => 'Please indicate if you have tools/equipment.',
        'travel_distance_max_min' => 'Maximum travel distance must be at least 1 km.',
        'travel_distance_max_max' => 'Maximum travel distance cannot exceed 999 km.',
        'hourly_rate_min_required' => 'Minimum hourly rate is required.',
        'hourly_rate_min_min' => 'Minimum hourly rate must be at least $5.',
        'hourly_rate_min_max' => 'Minimum hourly rate cannot exceed $999.',
        'hourly_rate_max_min' => 'Maximum hourly rate must be at least $5.',
        'hourly_rate_max_max' => 'Maximum hourly rate cannot exceed $9999.',
        'hourly_rate_max_gte' => 'Maximum hourly rate must be equal to or greater than the minimum hourly rate.',
    ],

    // Step 5: Availability
    'availability' => [
        'availability_by_month_required' => 'Please select at least one availability slot.',
        'availability_by_month_min' => 'Please select at least one availability slot.',
        'month_required' => 'Month is required for availability.',
        'day_of_week_required' => 'Day of week is required for each availability slot.',
        'start_time_required' => 'Start time is required for each availability slot.',
        'end_time_required' => 'End time is required for each availability slot.',
        'end_time_after_start' => 'End time must be after start time for all availability slots.',
        'rate_multiplier_min' => 'Rate multiplier must be at least 1.',
        'rate_multiplier_max' => 'Rate multiplier cannot exceed 3.',
    ],
];


<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Employee Profile - {{ $worker->name ?? 'Unknown' }}</title>
    <style>
        @page {
            margin: 0;
            padding: 0;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 11px;
            line-height: 1.6;
            color: #192341;
            background: #F6FBFD;
        }
        
        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            background: white;
            position: relative;
        }
        
        /* Header */
        .header {
            border-bottom: 3px solid #10B3D6;
            padding-bottom: 15px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo-section {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo-box {
            width: 40px;
            height: 40px;
            background: #10B3D6;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 18px;
        }
        
        .logo-text {
            font-size: 18px;
            font-weight: bold;
            color: #192341;
        }
        
        .header-right {
            text-align: right;
            font-size: 9px;
            color: #6B7280;
        }
        
        /* Profile Header Section */
        .profile-header {
            background: linear-gradient(135deg, #F6FBFD 0%, #FCF2F0 100%);
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 25px;
            border-left: 5px solid #10B3D6;
        }
        
        .profile-top {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .profile-photo {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            border: 4px solid #10B3D6;
        }
        
        .profile-info {
            flex: 1;
        }
        
        .profile-name {
            font-size: 24px;
            font-weight: bold;
            color: #192341;
            margin-bottom: 8px;
        }
        
        .profile-title {
            font-size: 14px;
            color: #10B3D6;
            font-weight: 600;
            margin-bottom: 12px;
        }
        
        .profile-contact {
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            font-size: 10px;
            color: #6B7280;
        }
        
        .profile-stats {
            display: flex;
            gap: 30px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #E5E7EB;
        }
        
        .stat-item {
            text-align: center;
        }
        
        .stat-value {
            font-size: 18px;
            font-weight: bold;
            color: #192341;
        }
        
        .stat-label {
            font-size: 9px;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        /* Section Styles */
        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 16px;
            font-weight: bold;
            color: #192341;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid #10B3D6;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .section-icon {
            width: 20px;
            height: 20px;
            background: #10B3D6;
            border-radius: 4px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
        }
        
        .section-content {
            padding: 15px;
            background: #FCF2F0;
            border-radius: 8px;
            border-left: 3px solid #10B3D6;
        }
        
        /* Badge/Tag Styles */
        .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 9px;
            font-weight: 500;
            margin: 3px;
            background: #E5E7EB;
            color: #192341;
        }
        
        .badge-primary {
            background: #10B3D6;
            color: white;
        }
        
        .badge-success {
            background: #10B981;
            color: white;
        }
        
        .badge-warning {
            background: #F59E0B;
            color: white;
        }
        
        /* Experience/Work History */
        .experience-item {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .experience-item:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        
        .experience-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
        }
        
        .experience-title {
            font-size: 13px;
            font-weight: bold;
            color: #192341;
        }
        
        .experience-date {
            font-size: 10px;
            color: #6B7280;
        }
        
        .experience-company {
            font-size: 11px;
            color: #10B3D6;
            font-weight: 600;
            margin-bottom: 5px;
        }
        
        .experience-description {
            font-size: 10px;
            color: #4B5563;
            line-height: 1.5;
        }
        
        /* Skills Grid */
        .skills-grid {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        /* Two Column Layout */
        .two-column {
            display: flex;
            gap: 20px;
        }
        
        .column {
            flex: 1;
        }
        
        /* Table Styles */
        .info-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10px;
        }
        
        .info-table td {
            padding: 8px;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .info-table td:first-child {
            font-weight: 600;
            color: #192341;
            width: 35%;
        }
        
        .info-table td:last-child {
            color: #4B5563;
        }
        
        /* Footer */
        .footer {
            position: absolute;
            bottom: 15mm;
            left: 20mm;
            right: 20mm;
            text-align: center;
            font-size: 9px;
            color: #6B7280;
            border-top: 1px solid #E5E7EB;
            padding-top: 10px;
        }
        
        /* Utilities */
        .text-center {
            text-align: center;
        }
        
        .mt-10 {
            margin-top: 10px;
        }
        
        .mb-10 {
            margin-bottom: 10px;
        }
        
        .text-muted {
            color: #6B7280;
        }
        
        .font-bold {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="page">
        <!-- Header -->
        <div class="header">
            <div class="logo-section">
                <div class="logo-box">S</div>
                <div class="logo-text">SkillOnCall.ca</div>
            </div>
            <div class="header-right">
                Employee Profile<br>
                Generated: {{ $generatedAt }}
            </div>
        </div>

        @php
            $profile = $worker->employee_profile ?? null;
            $name = $worker->name ?? 'Unknown Employee';
            $email = $worker->email ?? '';
            $bio = $profile->bio ?? '';
            $phone = $profile->phone ?? '';
            $city = $profile->city ?? '';
            $province = $profile->province ?? '';
            $postalCode = $profile->postal_code ?? '';
            $hourlyRateMin = $profile->hourly_rate_min ?? 0;
            $hourlyRateMax = $profile->hourly_rate_max ?? null;
            $overallExperience = $profile->overall_experience ?? '0';
            $skills = $profile->skills ?? [];
            $languages = $profile->languages ?? [];
            $workExperiences = $profile->work_experiences ?? [];
            $certifications = $profile->certifications ?? [];
            $references = $profile->references ?? [];
            $reviews = $profile->reviews ?? [];
            $availability = $profile->availability ?? [];
            $serviceAreas = $profile->service_areas ?? [];
            
            // Calculate average rating
            $avgRating = 0;
            if (!empty($reviews)) {
                $avgRating = round(array_sum(array_column($reviews, 'rating')) / count($reviews), 1);
            }
        @endphp

        <!-- Profile Header -->
        <div class="profile-header">
            <div class="profile-top">
                @if(!empty($profile->profile_photo))
                    @php
                        $photoPath = $profile->profile_photo;
                        // Remove any existing /storage/ or storage/ prefix
                        if (str_starts_with($photoPath, '/storage/')) {
                            $photoPath = substr($photoPath, 9);
                        } elseif (str_starts_with($photoPath, 'storage/')) {
                            $photoPath = substr($photoPath, 8);
                        }
                        $fullPath = public_path('storage/' . $photoPath);
                    @endphp
                    @if(file_exists($fullPath))
                        <img src="{{ $fullPath }}" alt="{{ $name }}" class="profile-photo">
                    @endif
                @endif
                <div class="profile-info">
                    <div class="profile-name">{{ $name }}</div>
                    @if(!empty($bio))
                        <div class="profile-title">{{ Str::limit($bio, 100) }}</div>
                    @endif
                    <div class="profile-contact">
                        @if(!empty($email))
                            <span>📧 {{ $email }}</span>
                        @endif
                        @if(!empty($phone))
                            <span>📞 {{ $phone }}</span>
                        @endif
                        @if(!empty($city) || !empty($province))
                            <span>📍 {{ trim($city . ', ' . $province) }}</span>
                        @endif
                    </div>
                </div>
            </div>
            <div class="profile-stats">
                <div class="stat-item">
                    <div class="stat-value">${{ number_format($hourlyRateMin, 2) }}{{ $hourlyRateMax && $hourlyRateMax != $hourlyRateMin ? ' - $' . number_format($hourlyRateMax, 2) : '' }}</div>
                    <div class="stat-label">Hourly Rate</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ $avgRating > 0 ? $avgRating : 'N/A' }}</div>
                    <div class="stat-label">Rating ({{ count($reviews) }} reviews)</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ $overallExperience }}</div>
                    <div class="stat-label">Years Experience</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">{{ count($skills) }}</div>
                    <div class="stat-label">Skills</div>
                </div>
            </div>
        </div>

        <!-- Bio Section -->
        @if(!empty($bio))
        <div class="section">
            <div class="section-title">
                <span class="section-icon">ℹ</span>
                About
            </div>
            <div class="section-content">
                <p style="line-height: 1.8; color: #4B5563;">{{ $bio }}</p>
            </div>
        </div>
        @endif

        <!-- Two Column Layout -->
        <div class="two-column">
            <div class="column">
                <!-- Skills -->
                @if(!empty($skills))
                <div class="section">
                    <div class="section-title">
                        <span class="section-icon">💼</span>
                        Skills
                    </div>
                    <div class="section-content">
                        <div class="skills-grid">
                            @foreach($skills as $skill)
                                <span class="badge {{ $skill->pivot->is_primary_skill ? 'badge-primary' : '' }}">
                                    {{ $skill->name }}
                                    @if($skill->pivot->proficiency_level)
                                        ({{ ucfirst($skill->pivot->proficiency_level) }})
                                    @endif
                                </span>
                            @endforeach
                        </div>
                    </div>
                </div>
                @endif

                <!-- Languages -->
                @if(!empty($languages))
                <div class="section">
                    <div class="section-title">
                        <span class="section-icon">🌐</span>
                        Languages
                    </div>
                    <div class="section-content">
                        <div class="skills-grid">
                            @foreach($languages as $language)
                                <span class="badge {{ $language->pivot->is_primary_language ? 'badge-primary' : '' }}">
                                    {{ $language->name }}
                                    @if($language->pivot->proficiency_level)
                                        ({{ ucfirst($language->pivot->proficiency_level) }})
                                    @endif
                                </span>
                            @endforeach
                        </div>
                    </div>
                </div>
                @endif

                <!-- Certifications -->
                @if(!empty($certifications))
                <div class="section">
                    <div class="section-title">
                        <span class="section-icon">🏆</span>
                        Certifications
                    </div>
                    <div class="section-content">
                        @foreach($certifications as $cert)
                            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #E5E7EB;">
                                <div style="font-weight: bold; color: #192341; margin-bottom: 3px;">
                                    {{ $cert->certification->name ?? 'Unknown Certification' }}
                                </div>
                                <div style="font-size: 9px; color: #6B7280;">
                                    @if($cert->issued_date)
                                        Issued: {{ date('M Y', strtotime($cert->issued_date)) }}
                                    @endif
                                    @if($cert->expiry_date)
                                        | Expires: {{ date('M Y', strtotime($cert->expiry_date)) }}
                                    @endif
                                    @if($cert->verification_status)
                                        | <span class="badge {{ $cert->verification_status === 'verified' ? 'badge-success' : 'badge-warning' }}">
                                            {{ ucfirst($cert->verification_status) }}
                                        </span>
                                    @endif
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>

            <div class="column">
                <!-- Additional Information -->
                <div class="section">
                    <div class="section-title">
                        <span class="section-icon">📋</span>
                        Additional Information
                    </div>
                    <div class="section-content">
                        <table class="info-table">
                            @if(!empty($profile->work_authorization))
                            <tr>
                                <td>Work Authorization</td>
                                <td>{{ $profile->work_authorization }}</td>
                            </tr>
                            @endif
                            @if(!empty($profile->has_vehicle))
                            <tr>
                                <td>Has Vehicle</td>
                                <td>{{ $profile->has_vehicle ? 'Yes' : 'No' }}</td>
                            </tr>
                            @endif
                            @if(!empty($profile->has_tools_equipment))
                            <tr>
                                <td>Has Tools/Equipment</td>
                                <td>{{ $profile->has_tools_equipment ? 'Yes' : 'No' }}</td>
                            </tr>
                            @endif
                            @if(!empty($profile->is_insured))
                            <tr>
                                <td>Insured</td>
                                <td>{{ $profile->is_insured ? 'Yes' : 'No' }}</td>
                            </tr>
                            @endif
                            @if(!empty($profile->has_wcb_coverage))
                            <tr>
                                <td>WCB Coverage</td>
                                <td>{{ $profile->has_wcb_coverage ? 'Yes' : 'No' }}</td>
                            </tr>
                            @endif
                            @if(!empty($profile->travel_distance_max))
                            <tr>
                                <td>Max Travel Distance</td>
                                <td>{{ $profile->travel_distance_max }} km</td>
                            </tr>
                            @endif
                        </table>
                    </div>
                </div>

                <!-- Service Areas -->
                @if(!empty($serviceAreas))
                <div class="section">
                    <div class="section-title">
                        <span class="section-icon">📍</span>
                        Service Areas
                    </div>
                    <div class="section-content">
                        @foreach($serviceAreas as $area)
                            <div style="margin-bottom: 5px;">
                                {{ $area->postal_code }}
                                @if($area->city)
                                    - {{ $area->city }}
                                @endif
                                @if($area->province)
                                    , {{ $area->province }}
                                @endif
                                @if($area->radius_km)
                                    ({{ $area->radius_km }} km radius)
                                @endif
                            </div>
                        @endforeach
                    </div>
                </div>
                @endif
            </div>
        </div>

        <!-- Work Experience -->
        @if(!empty($workExperiences))
        <div class="section">
            <div class="section-title">
                <span class="section-icon">💼</span>
                Work Experience
            </div>
            <div class="section-content">
                @foreach($workExperiences as $exp)
                    <div class="experience-item">
                        <div class="experience-header">
                            <div class="experience-title">{{ $exp->job_title }}</div>
                            <div class="experience-date">
                                {{ date('M Y', strtotime($exp->start_date)) }} - 
                                {{ $exp->is_current ? 'Present' : ($exp->end_date ? date('M Y', strtotime($exp->end_date)) : 'N/A') }}
                            </div>
                        </div>
                        <div class="experience-company">{{ $exp->company_name }}</div>
                        @if($exp->skill)
                            <div style="font-size: 9px; color: #10B3D6; margin-bottom: 5px;">
                                Skill: {{ $exp->skill->name }}
                            </div>
                        @endif
                        @if($exp->industry)
                            <div style="font-size: 9px; color: #10B3D6; margin-bottom: 5px;">
                                Industry: {{ $exp->industry->name }}
                            </div>
                        @endif
                        @if(!empty($exp->description))
                            <div class="experience-description">{{ $exp->description }}</div>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
        @endif

        <!-- References -->
        @if(!empty($references))
        <div class="section">
            <div class="section-title">
                <span class="section-icon">👥</span>
                Professional References
            </div>
            <div class="section-content">
                @foreach($references as $ref)
                    <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #E5E7EB;">
                        <div style="font-weight: bold; color: #192341; margin-bottom: 5px;">
                            {{ $ref->reference_name }}
                        </div>
                        <div style="font-size: 9px; color: #6B7280;">
                            @if($ref->relationship)
                                {{ $ref->relationship }}
                            @endif
                            @if($ref->company_name)
                                @ {{ $ref->company_name }}
                            @endif
                        </div>
                        @if($ref->reference_phone)
                            <div style="font-size: 9px; color: #4B5563; margin-top: 3px;">
                                📞 {{ $ref->reference_phone }}
                            </div>
                        @endif
                        @if($ref->reference_email)
                            <div style="font-size: 9px; color: #4B5563;">
                                📧 {{ $ref->reference_email }}
                            </div>
                        @endif
                        @if($ref->notes)
                            <div style="font-size: 9px; color: #6B7280; margin-top: 5px; font-style: italic;">
                                {{ $ref->notes }}
                            </div>
                        @endif
                    </div>
                @endforeach
            </div>
        </div>
        @endif

        <!-- Footer -->
        <div class="footer">
            <div>This profile was generated by SkillOnCall.ca on {{ $generatedAt }}</div>
            <div style="margin-top: 5px;">For more information, visit <strong>skilloncall.ca</strong></div>
        </div>
    </div>
</body>
</html>


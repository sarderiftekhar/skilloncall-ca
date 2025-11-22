<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Employee Profile - {{ $worker->name ?? 'Unknown' }}</title>
    <style>
        @page {
            margin: 15mm;
            size: A4;
        }
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
    </style>
</head>
<body>
    @php
        $profile = $worker->employeeProfile ?? null;
        $name = $worker->name ?? 'Unknown Employee';
        $email = $worker->email ?? '';
        $phone = is_object($profile) ? ($profile->phone_number ?? '') : '';
        $address = is_object($profile) ? ($profile->address ?? '') : '';
        $city = is_object($profile) ? ($profile->city ?? '') : '';
        $province = is_object($profile) ? ($profile->province ?? '') : '';
        $postalCode = is_object($profile) ? ($profile->postal_code ?? '') : '';
        $fullAddress = trim("$address, $city, $province $postalCode");
        
        $hourlyRateMin = is_object($profile) ? (float)($profile->hourly_rate_min ?? 0) : 0;
        $hourlyRateMax = is_object($profile) ? (float)($profile->hourly_rate_max ?? 0) : 0;
        $bio = is_object($profile) ? ($profile->bio ?? '') : '';
        $photo = is_object($profile) ? ($profile->profile_photo ?? $profile->photo_path ?? null) : null;
        
        $skills = is_object($profile) ? ($profile->skills ?? []) : [];
        $languages = is_object($profile) ? ($profile->languages ?? []) : [];
        $workExperiences = is_object($profile) ? ($profile->workExperiences ?? []) : [];
        $certifications = is_object($profile) ? ($profile->certifications ?? []) : [];
        $references = is_object($profile) ? ($profile->references ?? []) : [];
        $reviews = is_object($profile) ? ($profile->reviews ?? []) : [];
        $availability = is_object($profile) ? ($profile->availability ?? []) : [];
        
        $avgRating = 0;
        $reviewCount = count($reviews);
        if ($reviewCount > 0) {
            $totalRating = 0;
            foreach ($reviews as $review) {
                $totalRating += is_object($review) ? (float)($review->rating ?? 0) : 0;
            }
            $avgRating = round($totalRating / $reviewCount, 1);
        }
        
        $overallExperience = is_object($profile) ? ($profile->years_of_experience ?? 'N/A') : 'N/A';
        
        $nameParts = explode(' ', $name);
        $initials = '';
        foreach ($nameParts as $part) {
            $initials .= strtoupper(substr($part, 0, 1));
        }
        $initials = substr($initials, 0, 2);
    @endphp

    <!-- Header -->
    <div style="border: 2px solid #10B3D6; background: #F0F8FA; padding: 12px; margin-bottom: 10px;">
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <td style="width: 60px; vertical-align: middle; padding-right: 10px;">
                    @php
                        $showPhoto = false;
                        $finalPhotoPath = null;
                        
                        if ($photo && !empty($photo)) {
                            $photoPath = $photo;
                            
                            // Handle different path formats
                            if (str_starts_with($photoPath, 'http://') || str_starts_with($photoPath, 'https://')) {
                                // It's a URL - can't use in PDF
                                $showPhoto = false;
                            } else {
                                // Clean up the path - remove storage prefix if present
                                $photoPath = str_replace('\\', '/', $photoPath);
                                if (str_starts_with($photoPath, '/storage/')) {
                                    $photoPath = substr($photoPath, 9);
                                } elseif (str_starts_with($photoPath, 'storage/')) {
                                    $photoPath = substr($photoPath, 8);
                                }
                                
                                // Build the full path
                                $fullPhotoPath = public_path('storage' . DIRECTORY_SEPARATOR . $photoPath);
                                
                                // Check if file exists
                                if (file_exists($fullPhotoPath) && is_file($fullPhotoPath)) {
                                    // Use forward slashes for consistency in PDF rendering
                                    $finalPhotoPath = str_replace('\\', '/', $fullPhotoPath);
                                    $showPhoto = true;
                                }
                            }
                        }
                    @endphp
                    @if($showPhoto && $finalPhotoPath)
                        <img src="{{ $finalPhotoPath }}" alt="Profile" style="width: 50px; height: 50px; border-radius: 50%; border: 2px solid #10B3D6; object-fit: cover; display: block;">
                    @else
                        <div style="position: relative; width: 50px; height: 50px; border-radius: 50%; background: #10B3D6; border: 2px solid #10B3D6; overflow: hidden;">
                            <span style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #FFF; font-size: 18px; font-weight: bold;">{{ $initials }}</span>
                        </div>
                    @endif
                </td>
                <td style="vertical-align: middle; width: 35%;">
                    <div style="font-size: 14px; font-weight: bold; color: #000; margin-bottom: 2px;">{{ $name }}</div>
                    @if($email)<div style="font-size: 6px; color: #000; margin-bottom: 1px;">✉ {{ $email }}</div>@endif
                    @if($phone)<div style="font-size: 6px; color: #000; margin-bottom: 1px;">📞 {{ $phone }}</div>@endif
                    @if($fullAddress != ', ,')<div style="font-size: 6px; color: #000;">📍 {{ $fullAddress }}</div>@endif
                </td>
                <td style="vertical-align: middle; text-align: right; width: 40%;">
                    <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                        <tr>
                            <td style="width: 25%; text-align: center; padding: 0 5px; border-left: 1px solid #10B3D6;">
                                <div style="font-size: 9px; font-weight: bold; color: #000;">${{ number_format($hourlyRateMin, 2) }}@if($hourlyRateMax && $hourlyRateMax != $hourlyRateMin)-${{ number_format($hourlyRateMax, 2) }}@endif</div>
                                <div style="font-size: 5px; color: #666; text-transform: uppercase;">HOURLY RATE</div>
                            </td>
                            <td style="width: 25%; text-align: center; padding: 0 5px; border-left: 1px solid #10B3D6;">
                                <div style="font-size: 9px; font-weight: bold; color: #000;">{{ $avgRating > 0 ? $avgRating . ' ⭐' : 'N/A' }}</div>
                                <div style="font-size: 5px; color: #666; text-transform: uppercase;">0 REVIEWS</div>
                            </td>
                            <td style="width: 25%; text-align: center; padding: 0 5px; border-left: 1px solid #10B3D6;">
                                <div style="font-size: 9px; font-weight: bold; color: #000;">{{ $overallExperience }}</div>
                                <div style="font-size: 5px; color: #666; text-transform: uppercase;">YEARS EXP</div>
                            </td>
                            <td style="width: 25%; text-align: center; padding: 0 5px; border-left: 1px solid #10B3D6;">
                                <div style="font-size: 9px; font-weight: bold; color: #000;">{{ count($certifications) }}</div>
                                <div style="font-size: 5px; color: #666; text-transform: uppercase;">CERTIFICATIONS</div>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>

    <!-- Two Column Layout: Skills and Additional Info -->
    <div style="width: 100%; margin-bottom: 6px;">
        <div style="width: 48%; float: left; margin-right: 2%;">
            <!-- Skills -->
            @if(!empty($skills))
            <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
                <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">💼 Skills</div>
                <div>
                    @foreach($skills as $skill)
                        @php
                            $skillName = is_object($skill) ? ($skill->name ?? '') : '';
                            $isPrimary = is_object($skill) && isset($skill->pivot) && is_object($skill->pivot) ? ($skill->pivot->is_primary_skill ?? false) : false;
                        @endphp
                        @if($skillName)
                            <span style="display: inline-block; padding: 2px 6px; margin: 2px; border: 1px solid #10B3D6; border-radius: 3px; font-size: 6px; background: {{ $isPrimary ? '#10B3D6' : '#FFF' }}; color: {{ $isPrimary ? '#FFF' : '#000' }};">{{ $skillName }}</span>
                        @endif
                    @endforeach
                </div>
            </div>
            @endif
        </div>

        <div style="width: 48%; float: left; margin-left: 2%;">
            <!-- Additional Info -->
            @if($profile)
            <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
                <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">ℹ️ Additional Info</div>
                <table style="width: 100%; border-collapse: collapse; font-size: 6px;">
                    @if(!empty($profile->work_authorization))
                    <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">Work Auth</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->work_authorization }}</td></tr>
                    @endif
                    @if(isset($profile->has_vehicle))
                    <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">Vehicle</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->has_vehicle ? '✓' : '✗' }}</td></tr>
                    @endif
                    @if(isset($profile->has_tools_equipment))
                    <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">Tools</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->has_tools_equipment ? '✓' : '✗' }}</td></tr>
                    @endif
                    @if(isset($profile->is_insured))
                    <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">Insured</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->is_insured ? '✓' : '✗' }}</td></tr>
                    @endif
                    @if(isset($profile->has_wcb_coverage))
                    <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">WCB</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->has_wcb_coverage ? '✓' : '✗' }}</td></tr>
                    @endif
                    @if(!empty($profile->travel_distance_max))
                    <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">Max Travel</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->travel_distance_max }} km</td></tr>
                    @endif
                </table>
            </div>
            @endif
        </div>
        
        <div style="clear: both;"></div>
    </div>

    <!-- Languages -->
    @if(!empty($languages))
    <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
        <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">🌐 Languages</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 6px;">
            @foreach($languages as $language)
                @php
                    $langName = is_object($language) ? ($language->name ?? '') : '';
                    $proficiency = is_object($language) && isset($language->pivot) && is_object($language->pivot) ? ($language->pivot->proficiency_level ?? '') : '';
                @endphp
                @if($langName)
                <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">{{ $langName }}</td><td style="border: 1px solid #CCC; padding: 3px;">{{ ucfirst($proficiency) }}</td></tr>
                @endif
            @endforeach
        </table>
    </div>
    @endif

    <!-- Availability -->
    @if(!empty($availability))
    <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
        <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">🕒 Availability</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 6px;">
            <thead><tr><th style="background: #F0F8FA; border: 1px solid #10B3D6; padding: 3px; text-align: left;">Day</th><th style="background: #F0F8FA; border: 1px solid #10B3D6; padding: 3px; text-align: left;">Hours</th></tr></thead>
            <tbody>
                @php
                    $daysMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                    $schedule = [];
                    foreach ($availability as $avail) {
                        if (is_object($avail)) {
                            $dayNum = is_numeric($avail->day_of_week) ? $avail->day_of_week : array_search($avail->day_of_week, $daysMap);
                            $schedule[$dayNum] = [
                                'is_available' => $avail->is_available ?? false,
                                'start_time' => $avail->start_time ?? null,
                                'end_time' => $avail->end_time ?? null,
                            ];
                        }
                    }
                    ksort($schedule);
                @endphp
                @foreach([1, 2, 3, 4, 5, 6, 0] as $dayNum)
                    @php
                        $dayName = $daysMap[$dayNum];
                        $daySchedule = $schedule[$dayNum] ?? null;
                    @endphp
                    <tr>
                        <td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">{{ $dayName }}</td>
                        <td style="border: 1px solid #CCC; padding: 3px;">
                            @if($daySchedule && $daySchedule['is_available'])
                                {{ date('g:iA', strtotime($daySchedule['start_time'])) }} - {{ date('g:iA', strtotime($daySchedule['end_time'])) }}
                            @else
                                <span style="color: #999;">Unavailable</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <!-- About -->
    @if(!empty($bio))
    <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
        <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">📄 About</div>
        <div style="font-size: 6px; color: #000; line-height: 1.2;">{{ $bio }}</div>
    </div>
    @endif

    <!-- Work Experience -->
    @if(!empty($workExperiences))
    <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
        <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">💼 Work Experience</div>
        @foreach($workExperiences as $exp)
            @php
                $jobTitle = is_object($exp) ? ($exp->job_title ?? '') : '';
                $companyName = is_object($exp) ? ($exp->company_name ?? '') : '';
                $startDate = is_object($exp) ? ($exp->start_date ?? null) : null;
                $endDate = is_object($exp) ? ($exp->end_date ?? null) : null;
                $isCurrent = is_object($exp) ? ($exp->is_current ?? false) : false;
                $description = is_object($exp) ? ($exp->description ?? '') : '';
                $skillName = is_object($exp) && isset($exp->skill) && is_object($exp->skill) ? ($exp->skill->name ?? null) : null;
                $industryName = is_object($exp) && isset($exp->industry) && is_object($exp->industry) ? ($exp->industry->name ?? null) : null;
                $supervisorName = is_object($exp) ? ($exp->supervisor_name ?? null) : null;
                $supervisorContact = is_object($exp) ? ($exp->supervisor_contact ?? null) : null;
                
                $dateRange = '';
                if ($startDate) {
                    $dateRange = date('M Y', strtotime($startDate)) . ' - ';
                    $dateRange .= $isCurrent ? 'Present' : ($endDate ? date('M Y', strtotime($endDate)) : '');
                }
            @endphp
            <div style="border-left: 2px solid #10B3D6; background: #F9F9F9; padding: 5px 6px; margin-bottom: 4px;">
                <div style="font-size: 7px; font-weight: bold; color: #000; margin-bottom: 2px;">{{ $jobTitle }}</div>
                @if($companyName)<div style="font-size: 5px; color: #666; margin-bottom: 2px;">{{ $companyName }} • {{ $dateRange }}</div>@endif
                @if($skillName || $industryName)
                    <div style="font-size: 5px; color: #666; margin-bottom: 2px;">@if($skillName)Skill: {{ $skillName }}@endif @if($skillName && $industryName)| @endif @if($industryName)Industry: {{ $industryName }}@endif</div>
                @endif
                @if($description)<div style="font-size: 6px; color: #000; line-height: 1.2; margin-top: 2px;">{{ $description }}</div>@endif
                @if($hasPaidPlan && ($supervisorName || $supervisorContact))
                    <div style="font-size: 5px; color: #666; margin-top: 3px; padding-top: 3px; border-top: 1px solid #DDD;">
                        Supervisor: {{ $supervisorName ?? 'N/A' }}@if($supervisorContact) ({{ $supervisorContact }})@endif
                    </div>
                @endif
            </div>
        @endforeach
    </div>
    @endif

    <!-- Certifications -->
    @if(!empty($certifications))
    <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
        <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">🏆 Certifications</div>
        @foreach($certifications as $cert)
            @php
                $certName = is_object($cert) && isset($cert->certification) && is_object($cert->certification) ? ($cert->certification->name ?? 'N/A') : 'N/A';
                $certNumber = is_object($cert) ? ($cert->certificate_number ?? null) : null;
                $issuedDate = is_object($cert) ? ($cert->issued_date ?? null) : null;
                $expiryDate = is_object($cert) ? ($cert->expiry_date ?? null) : null;
                $verificationStatus = is_object($cert) ? ($cert->verification_status ?? 'pending') : 'pending';
            @endphp
            <div style="border-left: 2px solid #10B3D6; background: #F9F9F9; padding: 5px 6px; margin-bottom: 4px;">
                <div style="font-size: 7px; font-weight: bold; color: #000;">{{ $certName }} <span style="display: inline-block; padding: 2px 6px; border: 1px solid #10B3D6; border-radius: 3px; font-size: 5px; background: #FFF;">{{ ucfirst($verificationStatus) }}</span></div>
                @if($certNumber)<div style="font-size: 5px; color: #666; margin-bottom: 2px;">Certificate #: {{ $certNumber }}</div>@endif
                @if($issuedDate || $expiryDate)
                    <div style="font-size: 5px; color: #666;">
                        @if($issuedDate)Issued: {{ date('M Y', strtotime($issuedDate)) }}@endif
                        @if($issuedDate && $expiryDate) | @endif
                        @if($expiryDate)Expires: {{ date('M Y', strtotime($expiryDate)) }}@endif
                    </div>
                @endif
            </div>
        @endforeach
    </div>
    @endif

    <!-- References -->
    @if(!empty($references))
    <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
        <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">👥 References</div>
        @foreach($references as $ref)
            @php
                $refName = is_object($ref) ? ($ref->reference_name ?? '') : '';
                $refPhone = is_object($ref) ? ($ref->reference_phone ?? '') : '';
                $refEmail = is_object($ref) ? ($ref->reference_email ?? null) : null;
                $refRelation = is_object($ref) ? ($ref->relationship ?? '') : '';
                $refCompany = is_object($ref) ? ($ref->company_name ?? null) : null;
                $refNotes = is_object($ref) ? ($ref->notes ?? null) : null;
                $canContact = is_object($ref) ? ($ref->permission_to_contact ?? false) : false;
            @endphp
            <div style="border-left: 2px solid #10B3D6; background: #F9F9F9; padding: 5px 6px; margin-bottom: 4px;">
                <div style="font-size: 7px; font-weight: bold; color: #000; margin-bottom: 2px;">{{ $refName }}</div>
                @if($refRelation)<div style="font-size: 5px; color: #666; margin-bottom: 2px;">{{ $refRelation }}@if($refCompany) @ {{ $refCompany }}@endif</div>@endif
                <div style="font-size: 5px; color: #666;">📞 {{ $refPhone }}@if($refEmail) | ✉ {{ $refEmail }}@endif</div>
                @if($refNotes)<div style="font-size: 6px; color: #000; line-height: 1.2; margin-top: 2px;">{{ $refNotes }}</div>@endif
                @if($canContact)<div style="font-size: 5px; color: #000; font-weight: bold; margin-top: 2px;">✓ Permission to Contact</div>@endif
            </div>
        @endforeach
    </div>
    @endif

    <!-- Emergency Contact -->
    @if($hasPaidPlan && $profile && !empty($profile->emergency_contact_name))
    <div style="border: 1px solid #10B3D6; padding: 8px; margin-bottom: 6px;">
        <div style="font-size: 8px; font-weight: bold; background: #F0F8FA; padding: 4px; margin: -8px -8px 6px -8px; border-bottom: 1px solid #10B3D6;">🚨 Emergency Contact</div>
        <table style="width: 100%; border-collapse: collapse; font-size: 6px;">
            <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">Name</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->emergency_contact_name }}</td></tr>
            <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">Phone</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->emergency_contact_phone ?? 'N/A' }}</td></tr>
            <tr><td style="border: 1px solid #CCC; padding: 3px; font-weight: bold;">Relationship</td><td style="border: 1px solid #CCC; padding: 3px;">{{ $profile->emergency_contact_relationship ?? 'N/A' }}</td></tr>
        </table>
    </div>
    @endif

    <!-- Footer -->
    <div style="margin-top: 8px; padding: 8px; border-top: 2px solid #10B3D6; background: #F0F8FA; text-align: center;">
        <table style="width: 100%; border-collapse: collapse; border-spacing: 0;">
            <tr>
                <td style="text-align: center; vertical-align: middle; padding: 0;">
                    <div style="display: inline-block; vertical-align: middle; margin-right: 5px;">
                        @php
                            $logoPath = public_path('logo.png');
                        @endphp
                        @if(file_exists($logoPath))
                            <img src="{{ $logoPath }}" style="max-width: 50px; max-height: 40px; object-fit: contain; display: inline-block; vertical-align: middle;">
                        @else
                            <span style="font-size: 10px; font-weight: bold; color: #10B3D6; display: inline-block; vertical-align: middle;">SkillOnCall</span>
                        @endif
                    </div>
                    <div style="display: inline-block; vertical-align: middle; text-align: left;">
                        <span style="font-weight: bold; color: #10B3D6; font-size: 8px;">SkillOnCall.ca</span>
                        <span style="font-size: 6px; color: #666;"> - Generated: {{ $generatedAt }} - Visit skilloncall.ca for more information</span>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>

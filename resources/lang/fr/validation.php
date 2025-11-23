<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Lignes de langue de validation - Français
    |--------------------------------------------------------------------------
    |
    | Les lignes de langue suivantes contiennent les messages d'erreur par défaut
    | utilisés par la classe de validateur. Certaines de ces règles ont plusieurs
    | versions comme les règles de taille. N'hésitez pas à modifier chacun de
    | ces messages ici.
    |
    */

    // Étape 1 : Informations personnelles
    'personal_info' => [
        'first_name_required' => 'Le prénom est requis.',
        'last_name_required' => 'Le nom de famille est requis.',
        'phone_required' => 'Le numéro de téléphone est requis.',
        'date_of_birth_before' => 'La date de naissance doit être dans le passé.',
        'address_line_1_required' => 'L\'adresse est requise.',
        'city_required' => 'La ville est requise.',
        'province_required' => 'La province est requise.',
        'province_size' => 'Veuillez sélectionner une province valide.',
        'postal_code_required' => 'Le code postal est requis.',
        'postal_code_regex' => 'Veuillez entrer un code postal canadien valide (ex: A1A 1A1).',
        'work_authorization_required' => 'Veuillez sélectionner votre statut d\'autorisation de travail.',
    ],

    // Configuration de l'employeur
    'employer' => [
        'business_name_required' => 'Le nom de l\'entreprise est requis.',
        'company_number_required' => 'Le numéro d\'entreprise est requis.',
        'company_number_max' => 'Le numéro d\'entreprise ne doit pas dépasser 30 caractères.',
        'phone_required' => 'Le numéro de téléphone est requis.',
        'industry_exists' => 'Veuillez sélectionner une industrie valide.',
        'address_line_1_required' => 'L\'adresse est requise.',
        'city_required' => 'La ville est requise.',
        'province_required' => 'La province est requise.',
        'province_size' => 'Veuillez sélectionner une province valide.',
        'postal_code_required' => 'Le code postal est requis.',
        'postal_code_regex' => 'Veuillez entrer un code postal canadien valide (ex: A1A 1A1).',
    ],

    // Étape 2 : Compétences et expérience
    'skills_experience' => [
        'overall_experience_required' => 'Veuillez sélectionner votre niveau d\'expérience global.',
        'selected_skills_required' => 'Veuillez sélectionner au moins une compétence.',
        'selected_skills_min' => 'Veuillez sélectionner au moins une compétence.',
        'skill_id_required' => 'Chaque compétence doit avoir un identifiant valide.',
        'skill_id_exists' => 'Une ou plusieurs compétences sélectionnées ne sont pas valides.',
        'proficiency_level_required' => 'Veuillez sélectionner un niveau de compétence pour chaque compétence.',
    ],

    // Étape 3 : Historique de travail
    'work_history' => [
        'employment_status_required' => 'Veuillez sélectionner votre statut d\'emploi actuel.',
        'work_experiences_required' => 'Veuillez ajouter au moins une expérience de travail.',
        'work_experiences_min' => 'Veuillez ajouter au moins une expérience de travail.',
        'company_name_required' => 'Le nom de l\'entreprise est requis pour chaque expérience de travail.',
        'job_title_required' => 'Le titre du poste est requis pour chaque expérience de travail.',
        'start_date_required' => 'La date de début est requise pour chaque expérience de travail.',
        'end_date_after_or_equal' => 'La date de fin doit être après la date de début.',
        'reference_name_required' => 'Le nom de la référence est requis.',
        'reference_phone_required' => 'Le numéro de téléphone de la référence est requis.',
        'reference_email_email' => 'Veuillez fournir une adresse e-mail valide pour la référence.',
        'relationship_required' => 'Veuillez spécifier votre relation avec cette référence.',
    ],

    // Étape 4 : Emplacement et tarifs
    'location_rates' => [
        'has_vehicle_required' => 'Veuillez indiquer si vous avez un véhicule.',
        'has_tools_equipment_required' => 'Veuillez indiquer si vous avez des outils/équipements.',
        'travel_distance_max_min' => 'La distance de déplacement maximale doit être d\'au moins 1 km.',
        'travel_distance_max_max' => 'La distance de déplacement maximale ne peut pas dépasser 999 km.',
        'hourly_rate_min_required' => 'Le taux horaire minimum est requis.',
        'hourly_rate_min_min' => 'Le taux horaire minimum doit être d\'au moins 5 $.',
        'hourly_rate_min_max' => 'Le taux horaire minimum ne peut pas dépasser 999 $.',
        'hourly_rate_max_min' => 'Le taux horaire maximum doit être d\'au moins 5 $.',
        'hourly_rate_max_max' => 'Le taux horaire maximum ne peut pas dépasser 9999 $.',
        'hourly_rate_max_gte' => 'Le taux horaire maximum doit être égal ou supérieur au taux horaire minimum.',
    ],

    // Étape 5 : Disponibilité
    'availability' => [
        'availability_by_month_required' => 'Veuillez sélectionner au moins une plage de disponibilité.',
        'availability_by_month_min' => 'Veuillez sélectionner au moins une plage de disponibilité.',
        'month_required' => 'Le mois est requis pour la disponibilité.',
        'day_of_week_required' => 'Le jour de la semaine est requis pour chaque plage de disponibilité.',
        'start_time_required' => 'L\'heure de début est requise pour chaque plage de disponibilité.',
        'end_time_required' => 'L\'heure de fin est requise pour chaque plage de disponibilité.',
        'end_time_after_start' => 'L\'heure de fin doit être après l\'heure de début pour toutes les plages de disponibilité.',
        'rate_multiplier_min' => 'Le multiplicateur de taux doit être d\'au moins 1.',
        'rate_multiplier_max' => 'Le multiplicateur de taux ne peut pas dépasser 3.',
    ],
];


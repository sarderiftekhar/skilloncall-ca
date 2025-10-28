<?php

return [
    'title' => 'Configuration du travailleur',
    'step_of' => 'Étape :step de :total',
    'progress_percent' => ':percent%',
    
    // Step titles
    'steps.personal_info.title' => 'Informations personnelles',
    'steps.personal_info.mobile' => 'À propos de vous',
    'steps.personal_info.description' => 'Informations de base et photo',
    
    'steps.skills.title' => 'Compétences et expérience',
    'steps.skills.mobile' => 'Vos compétences',
    'steps.skills.description' => 'Vos compétences et niveau d\'expérience',
    
    'steps.work_history.title' => 'Historique de travail',
    'steps.work_history.mobile' => 'Historique',
    'steps.work_history.description' => 'Emplois actuels et antérieurs',
    
    'steps.location.title' => 'Emplacement et tarifs',
    'steps.location.mobile' => 'Lieu et tarifs',
    'steps.location.description' => 'Où vous travaillez et vos tarifs',
    
    'steps.schedule.title' => 'Votre horaire',
    'steps.schedule.mobile' => 'Horaire',
    'steps.schedule.description' => 'Quand vous êtes disponible pour travailler',
    
    'steps.languages.title' => 'Langues et horaire',
    'steps.languages.mobile' => 'Langues et horaire',
    'steps.languages.description' => 'Langues et disponibilité',
    
    'steps.portfolio.title' => 'Portfolio et finalisation',
    'steps.portfolio.mobile' => 'Portfolio',
    'steps.portfolio.description' => 'Échantillons de travail et finalisation',
    
    // Navigation buttons
    'nav.previous' => 'Précédent',
    'nav.back' => 'Retour',
    'nav.continue' => 'Continuer',
    'nav.next' => 'Suivant',
    'nav.saving' => 'Enregistrement...',
    'nav.complete' => 'Terminer la configuration',
    'nav.finishing' => 'Finalisation...',
    'nav.cancel' => 'Annuler',
    
    // Month selector
    'month_selector.current_month' => 'Mois actuel',
    'month_selector.next_month' => 'Mois prochain',
    
    // Actions
    'actions.copy_to_next_month' => 'Copier au mois prochain',
    
    // Messages
    'messages.copied_to_next_month' => 'Disponibilité copiée au mois prochain avec succès!',
    'validation.at_least_current_month' => 'Veuillez définir votre disponibilité pour au moins le mois en cours.',
    
    // Messages
    'help_text' => 'Besoin d\'aide? Vous pouvez toujours revenir pour compléter cela plus tard.',
    'validation_required' => 'Veuillez sélectionner le statut d\'emploi et ajouter au moins une expérience de travail',
    
    // Modal messages
    'modal.error.title' => 'Veuillez corriger les champs surlignés',
    'modal.error.message' => 'Il y a eu des problèmes avec vos données.',
    'modal.save_failed.title' => 'Échec de l\'enregistrement',
    'modal.save_failed.message' => 'Une erreur inattendue s\'est produite lors de l\'enregistrement de cette étape. Veuillez réessayer.',
    'modal.complete.title' => 'Profil complété',
    'modal.complete.message' => 'Votre profil est maintenant complet.',
    'modal.complete_error.title' => 'Impossible de terminer la configuration',
    'modal.complete_error.message' => 'Une erreur s\'est produite lors de la finalisation de votre profil.',
    'modal.unexpected.title' => 'Erreur inattendue',
    'modal.unexpected.message' => 'Quelque chose s\'est mal passé lors de la finalisation de votre profil. Veuillez réessayer.',
    'modal.action.dashboard' => 'Aller au tableau de bord',

    // Step 1: Personal Information
    'step1.welcome_title' => 'Bienvenue sur SkillOnCall!',
    'step1.welcome_subtitle' => 'Commençons par mieux vous connaître. Ces informations aident les employeurs à vous trouver et à vous faire confiance.',
    
    // Profile Photo
    'step1.profile_photo.title' => 'Photo de profil',
    'step1.profile_photo.upload' => 'Télécharger une photo',
    'step1.profile_photo.change' => 'Changer la photo',
    'step1.profile_photo.helper' => 'Des photos claires augmentent vos chances d\'emploi',
    
    // Basic Information
    'step1.basic_info.title' => 'Informations de base',
    'step1.basic_info.first_name' => 'Prénom',
    'step1.basic_info.first_name_placeholder' => 'Entrez votre prénom',
    'step1.basic_info.last_name' => 'Nom de famille',
    'step1.basic_info.last_name_placeholder' => 'Entrez votre nom de famille',
    'step1.basic_info.phone' => 'Numéro de téléphone',
    'step1.basic_info.phone_helper' => 'Les employeurs utiliseront ce numéro pour vous contacter',
    'step1.basic_info.dob' => 'Date de naissance (Optionnel)',
    'step1.basic_info.age' => 'Âge',
    'step1.basic_info.years' => 'ans',
    'step1.basic_info.bio' => 'Parlez-nous de vous (Optionnel)',
    'step1.basic_info.bio_helper' => 'Cela aide les employeurs à comprendre votre parcours',
    'step1.basic_info.bio_placeholder' => 'Décrivez brièvement votre expérience et ce qui vous rend excellent dans votre travail...',
    
    // Work Authorization
    'step1.work_auth.title' => 'Autorisation de travail (Requis par la loi canadienne)',
    'step1.work_auth.info' => 'Les employeurs canadiens sont tenus par la loi de vérifier l\'autorisation de travail',
    'step1.work_auth.privacy' => 'Ces informations sont sécurisées et partagées uniquement avec les employeurs si nécessaire',
    'step1.work_auth.status' => 'Statut d\'autorisation de travail',
    'step1.work_auth.placeholder' => 'Sélectionnez votre statut de travail',
    'step1.work_auth.canadian_citizen' => 'Citoyen canadien',
    'step1.work_auth.permanent_resident' => 'Résident permanent',
    'step1.work_auth.work_permit' => 'Permis de travail',
    'step1.work_auth.student_permit' => 'Permis d\'étudiant',
    
    // Address Information
    'step1.address.title' => 'Informations d\'adresse',
    'step1.address.subtitle' => 'Cela aide les employeurs à trouver des travailleurs dans leur région',
    'step1.address.street' => 'Adresse',
    'step1.address.street_placeholder' => '123 Rue Principale',
    'step1.address.unit' => 'Appartement/Unité (Optionnel)',
    'step1.address.unit_placeholder' => 'App 4B, Unité 101, etc.',
    'step1.address.province' => 'Province',
    'step1.address.province_placeholder' => 'Sélectionner',
    'step1.address.city' => 'Ville',
    'step1.address.city_placeholder' => 'Tapez pour rechercher des villes...',
    'step1.address.loading_cities' => 'Chargement des villes...',
    'step1.address.no_cities' => 'Aucune ville trouvée correspondant à',
    'step1.address.postal_code' => 'Code postal',
    
    // Emergency Contact
    'step1.emergency.title' => 'Contact d\'urgence',
    'step1.emergency.subtitle' => 'Une personne que nous pouvons contacter en cas d\'urgence pendant que vous travaillez',
    'step1.emergency.name' => 'Nom du contact',
    'step1.emergency.name_placeholder' => 'Nom complet',
    'step1.emergency.relationship' => 'Relation',
    'step1.emergency.relationship_placeholder' => 'Parent, Conjoint, Frère/Sœur, Ami',
    'step1.emergency.phone' => 'Numéro de téléphone',
    
    // Privacy Notice
    'step1.privacy.title' => 'Votre vie privée est protégée',
    'step1.privacy.message' => 'Nous gardons vos informations personnelles en sécurité et ne partageons que les détails nécessaires avec les employeurs lorsque vous postulez à des emplois. Vous contrôlez quelles informations sont visibles dans votre profil.',
    
    // Canadian Provinces
    'provinces.AB' => 'Alberta',
    'provinces.BC' => 'Colombie-Britannique',
    'provinces.MB' => 'Manitoba',
    'provinces.NB' => 'Nouveau-Brunswick',
    'provinces.NL' => 'Terre-Neuve-et-Labrador',
    'provinces.NS' => 'Nouvelle-Écosse',
    'provinces.NT' => 'Territoires du Nord-Ouest',
    'provinces.NU' => 'Nunavut',
    'provinces.ON' => 'Ontario',
    'provinces.PE' => 'Île-du-Prince-Édouard',
    'provinces.QC' => 'Québec',
    'provinces.SK' => 'Saskatchewan',
    'provinces.YT' => 'Yukon',
];


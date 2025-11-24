<?php

return [
    'title' => 'Plans tarifaires',
    'subtitle' => 'Choisissez le plan parfait pour vos besoins',
    'description' => 'Tarification transparente pour les employés et les employeurs. Commencez gratuitement et passez à un niveau supérieur au fur et à mesure.',
    
    'for_employees' => 'Pour les employés',
    'for_employers' => 'Pour les employeurs',
    
    'employee_subtitle' => 'Trouvez votre prochaine opportunité',
    'employer_subtitle' => 'Trouvez les bons talents',
    
    'monthly' => 'Mensuel',
    'yearly' => 'Annuel',
    'save' => 'Économisez',
    'per_month' => '/mois',
    'per_year' => '/an',
    'free' => 'Gratuit',
    
    'most_popular' => 'Le Plus Populaire',
    'get_started' => 'Commencer',
    'sign_up' => 'S\'inscrire',
    'contact_sales' => 'Contacter les ventes',
    
    'features' => [
        'cancel_anytime' => 'Annulez à tout moment',
        'no_hidden_fees' => 'Aucuns frais cachés',
        'secure_payment' => 'Traitement de paiement sécurisé',
        'money_back' => 'Garantie de remboursement de 30 jours',
    ],
    
    'employee_plans' => [
        'free' => [
            'name' => 'Gratuit',
            'description' => 'Parfait pour commencer',
            'price_monthly' => 0,
            'price_yearly' => 0,
            'features' => [
                'Création de profil de base',
                'Parcourir les offres d\'emploi',
                'Postuler à 5 emplois par mois',
                'Messagerie de base',
                'Support client standard',
            ],
        ],
        'pro' => [
            'name' => 'Pro',
            'description' => 'Idéal pour les chercheurs d\'emploi actifs',
            'price_monthly' => 19.99,
            'price_yearly' => 199.99,
            'is_popular' => true,
            'features' => [
                'Tout dans Gratuit',
                'Postuler à des emplois illimités',
                'Priorité dans les résultats de recherche',
                'Fonctionnalités de messagerie avancées',
                'Analytiques de profil',
                'Constructeur de CV',
                'Support client prioritaire',
                'Badge de profil vedette',
            ],
        ],
        'premium' => [
            'name' => 'Premium',
            'description' => 'Pour les professionnels qui veulent tout',
            'price_monthly' => 39.99,
            'price_yearly' => 399.99,
            'features' => [
                'Tout dans Pro',
                'Contact direct avec l\'employeur',
                'Badge professionnel vérifié',
                'Galerie de portfolio personnalisée',
                'Vérification des compétences',
                'Présentation vidéo du profil',
                'Opportunités d\'emploi exclusives',
                'Support dédié 24/7',
                'Intégration LinkedIn',
            ],
        ],
    ],
    
    'employer_plans' => [
        'starter' => [
            'name' => 'Démarrage',
            'description' => 'Parfait pour les petites entreprises',
            'price_monthly' => 0,
            'price_yearly' => 0,
            'features' => [
                'Publication d\'emploi de base',
                'Accès aux profils des travailleurs',
                'Messagerie de base',
                'Support standard',
            ],
        ],
        'professional' => [
            'name' => 'Professionnel',
            'description' => 'Idéal pour les entreprises en croissance',
            'price_monthly' => 19.99,
            'price_yearly' => 191.99,
            'is_popular' => true,
            'features' => [
                'Publication d\'emploi améliorée',
                'Offres d\'emploi en vedette',
                'Recherche avancée de travailleurs',
                'Messagerie prioritaire',
                'Tableau de bord analytique',
                'Support prioritaire',
                'Outils de collaboration d\'équipe',
            ],
        ],
        'enterprise' => [
            'name' => 'Entreprise',
            'description' => 'Pour les grandes organisations',
            'price_monthly' => 49.99,
            'price_yearly' => 479.99,
            'features' => [
                'Publications d\'emploi illimitées',
                'Offres d\'emploi en vedette',
                'Recherche avancée de travailleurs',
                'Messagerie prioritaire',
                'Analytiques avancées',
                'Image de marque personnalisée',
                'Accès API',
                'Gestionnaire de compte dédié',
                'Intégrations personnalisées',
                'Solutions en marque blanche',
            ],
        ],
    ],
];


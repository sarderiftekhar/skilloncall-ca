<?php

return [
    'title' => 'Forfaits tarifaires',
    'subtitle' => 'Choisissez le forfait parfait pour vos besoins',
    'description' => 'Options tarifaires flexibles pour les employeurs et les employés. Commencez gratuitement, mettez à niveau à tout moment.',
    
    'employers' => [
        'title' => 'Pour les employeurs',
        'subtitle' => 'Trouvez des travailleurs qualifiés rapidement et efficacement',
    ],
    
    'employees' => [
        'title' => 'Pour les employés',
        'subtitle' => 'Débloquez plus d\'opportunités avec des fonctionnalités premium',
    ],
    
    'plans' => [
        'employer' => [
            'free' => [
                'name' => 'Gratuit',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'description' => 'Parfait pour commencer',
                'features' => [
                    'Inscription gratuite',
                    'Recherche illimitée de candidats (filtres de base)',
                    '1 publication d\'emploi gratuite par mois',
                    'Voir les employés disponibles par type',
                    'Voir les profils de base des employés (contact masqué)',
                    'Voir uniquement les candidats (pour les emplois publiés)',
                    'Abonnement à l\'infolettre gratuit',
                ],
                'limitations' => [
                    'Pas de messagerie/contact avec les candidats',
                    'Impossible de voir les coordonnées complètes des candidats',
                    'Limité aux filtres de recherche de base',
                    'Pas d\'analyses avancées',
                ],
            ],
            'basic' => [
                'name' => 'De base',
                'price_monthly' => 10,
                'price_yearly' => 96,
                'description' => 'Idéal pour les besoins d\'embauche réguliers',
                'is_popular' => true,
                'features' => [
                    'Tout dans Gratuit',
                    'Publications d\'emploi illimitées',
                    'Voir les profils complets des candidats (contact visible)',
                    'Messagerie/contact avec les candidats',
                    'Filtres de recherche avancés',
                    'Voir tous les candidats (pas seulement les candidats)',
                    'Outils de gestion des candidatures',
                    'Tableau de bord d\'analyses de base',
                ],
            ],
            'professional' => [
                'name' => 'Professionnel',
                'price_monthly' => 25,
                'price_yearly' => 240,
                'description' => 'Pour les entreprises avec un volume d\'embauche élevé',
                'features' => [
                    'Tout dans De base',
                    'Publications d\'emploi en vedette (placement prioritaire)',
                    'Analyses et informations avancées',
                    'Support client prioritaire',
                    'Export en masse des candidats',
                    'Modèles de publication d\'emploi personnalisés',
                    'Algorithmes de correspondance avancés',
                ],
            ],
            'on_demand' => [
                'name' => 'Sur demande 7 jours',
                'price' => 15,
                'description' => 'Parfait pour les besoins d\'embauche urgents',
                'features' => [
                    'Toutes les fonctionnalités du forfait De base',
                    'Valide pour 7 jours seulement',
                    'Parfait pour les besoins d\'embauche urgents',
                ],
            ],
            'per_job' => [
                'name' => 'Par publication d\'emploi',
                'price' => 10,
                'description' => 'Aucun engagement mensuel',
                'features' => [
                    'Publier 1 emploi',
                    'Voir uniquement les candidats (contact visible)',
                    'Contacter les candidats via la messagerie',
                    'Aucun engagement mensuel',
                ],
                'limitations' => [
                    'Impossible de voir d\'autres candidats (non-candidats)',
                    'Détails des autres candidats masqués (comme le niveau gratuit)',
                ],
            ],
        ],
        'employee' => [
            'free' => [
                'name' => 'Gratuit',
                'price_monthly' => 0,
                'price_yearly' => 0,
                'description' => 'Parfait pour commencer',
                'features' => [
                    'Inscription gratuite',
                    'Parcourir les offres d\'emploi',
                    'Voir les détails des emplois',
                    'Création de profil de base',
                    '5 candidatures d\'emploi par mois',
                    'Enregistrer les emplois',
                ],
                'limitations' => [
                    'Pas de messagerie/contact avec les employeurs',
                    'Impossible d\'initier le contact',
                    'Visibilité de profil limitée',
                    'Pas de téléchargements de portfolio',
                    'Recherche de base uniquement',
                ],
            ],
            'basic' => [
                'name' => 'De base',
                'price_monthly' => 7.99,
                'price_yearly' => 76.70,
                'description' => 'Idéal pour les chercheurs d\'emploi actifs',
                'is_popular' => true,
                'features' => [
                    'Tout dans Gratuit',
                    'Candidatures d\'emploi illimitées',
                    'Messagerie/contact avec les employeurs',
                    'Téléchargements de portfolio',
                    'Visibilité de profil améliorée',
                    'Filtres de recherche d\'emploi avancés',
                    'Tableau de bord de suivi des candidatures',
                ],
            ],
            'professional' => [
                'name' => 'Professionnel',
                'price_monthly' => 15,
                'price_yearly' => 144,
                'description' => 'Pour les professionnels qui veulent tout',
                'features' => [
                    'Tout dans De base',
                    'Priorité dans les résultats de recherche',
                    'Badge de profil en vedette',
                    'Analyses de profil',
                    'Fonctionnalités de portfolio avancées',
                    'Contact direct avec l\'employeur (initier des conversations)',
                    'Badge professionnel vérifié',
                    'Support client prioritaire',
                ],
            ],
            'on_demand' => [
                'name' => 'Sur demande 7 jours',
                'price' => 5,
                'description' => 'Parfait pour les périodes de recherche d\'emploi actives',
                'features' => [
                    'Toutes les fonctionnalités du forfait De base',
                    'Valide pour 7 jours seulement',
                    'Parfait pour les périodes de recherche d\'emploi actives',
                ],
            ],
        ],
    ],
    
    'billing' => [
        'monthly' => 'Mensuel',
        'yearly' => 'Annuel',
        'save' => 'Économisez 20%',
        'per_month' => '/mois',
        'per_year' => '/an',
        'one_time' => 'Unique',
    ],
    
    'cta' => [
        'get_started' => 'Commencer',
        'upgrade_now' => 'Mettre à niveau maintenant',
        'select_plan' => 'Sélectionner le forfait',
        'current_plan' => 'Forfait actuel',
    ],
    
    'faq' => [
        'title' => 'Questions fréquemment posées',
        'items' => [
            [
                'question' => 'Puis-je changer mon forfait plus tard?',
                'answer' => 'Oui, vous pouvez mettre à niveau ou rétrograder votre forfait à tout moment. Les changements seront calculés au prorata.',
            ],
            [
                'question' => 'Que se passe-t-il si j\'annule?',
                'answer' => 'Vous pouvez annuler à tout moment. Votre abonnement restera actif jusqu\'à la fin de la période de facturation.',
            ],
            [
                'question' => 'Offrez-vous des remboursements?',
                'answer' => 'Nous offrons une garantie de remboursement de 7 jours pour tous les forfaits payants.',
            ],
            [
                'question' => 'Puis-je utiliser plusieurs forfaits?',
                'answer' => 'Non, vous ne pouvez avoir qu\'un seul forfait d\'abonnement actif à la fois.',
            ],
        ],
    ],
    
    'features' => [
        'unlimited' => 'Illimité',
        'limited' => 'Limité',
        'included' => 'Inclus',
        'not_included' => 'Non inclus',
    ],
];


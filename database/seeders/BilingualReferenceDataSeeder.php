<?php

namespace Database\Seeders;

use App\Models\GlobalSkill;
use App\Models\GlobalIndustry;
use App\Models\GlobalCertification;
use App\Models\GlobalLanguage;
use Illuminate\Database\Seeder;

class BilingualReferenceDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeder adds French translations to existing English data
     * or creates new bilingual entries for reference data.
     */
    public function run(): void
    {
        $this->seedSkills();
        $this->seedIndustries();
        $this->seedCertifications();
        $this->seedLanguages();
    }

    /**
     * Seed skills with bilingual names and descriptions
     */
    private function seedSkills(): void
    {
        $skills = [
            [
                'name' => ['en' => 'Carpentry', 'fr' => 'Menuiserie'],
                'description' => [
                    'en' => 'Skilled in wood construction and finishing',
                    'fr' => 'Compétent en construction et finition du bois'
                ],
                'category' => 'Construction',
                'requires_certification' => false,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => ['en' => 'Plumbing', 'fr' => 'Plomberie'],
                'description' => [
                    'en' => 'Installation and repair of water systems',
                    'fr' => 'Installation et réparation de systèmes d\'eau'
                ],
                'category' => 'Construction',
                'requires_certification' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => ['en' => 'Electrical Work', 'fr' => 'Travaux électriques'],
                'description' => [
                    'en' => 'Installation and maintenance of electrical systems',
                    'fr' => 'Installation et maintenance de systèmes électriques'
                ],
                'category' => 'Construction',
                'requires_certification' => true,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => ['en' => 'Welding', 'fr' => 'Soudage'],
                'description' => [
                    'en' => 'Metal joining and fabrication',
                    'fr' => 'Assemblage et fabrication de métaux'
                ],
                'category' => 'Manufacturing',
                'requires_certification' => true,
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => ['en' => 'Customer Service', 'fr' => 'Service à la clientèle'],
                'description' => [
                    'en' => 'Assisting and supporting customers',
                    'fr' => 'Assister et soutenir les clients'
                ],
                'category' => 'Service',
                'requires_certification' => false,
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($skills as $skillData) {
            GlobalSkill::updateOrCreate(
                ['category' => $skillData['category'], 'sort_order' => $skillData['sort_order']],
                $skillData
            );
        }

        $this->command->info('✓ Bilingual skills seeded');
    }

    /**
     * Seed industries with bilingual names and descriptions
     */
    private function seedIndustries(): void
    {
        $industries = [
            [
                'name' => ['en' => 'Construction', 'fr' => 'Construction'],
                'description' => [
                    'en' => 'Building and infrastructure development',
                    'fr' => 'Développement de bâtiments et d\'infrastructures'
                ],
                'category' => 'Trades',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => ['en' => 'Hospitality', 'fr' => 'Hôtellerie'],
                'description' => [
                    'en' => 'Hotels, restaurants, and tourism services',
                    'fr' => 'Hôtels, restaurants et services touristiques'
                ],
                'category' => 'Service',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => ['en' => 'Healthcare', 'fr' => 'Soins de santé'],
                'description' => [
                    'en' => 'Medical and healthcare services',
                    'fr' => 'Services médicaux et de santé'
                ],
                'category' => 'Healthcare',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => ['en' => 'Manufacturing', 'fr' => 'Fabrication'],
                'description' => [
                    'en' => 'Production and assembly of goods',
                    'fr' => 'Production et assemblage de biens'
                ],
                'category' => 'Industrial',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'name' => ['en' => 'Retail', 'fr' => 'Commerce de détail'],
                'description' => [
                    'en' => 'Sales and customer service in stores',
                    'fr' => 'Ventes et service à la clientèle en magasin'
                ],
                'category' => 'Sales',
                'is_active' => true,
                'sort_order' => 5,
            ],
        ];

        foreach ($industries as $industryData) {
            GlobalIndustry::updateOrCreate(
                ['category' => $industryData['category'], 'sort_order' => $industryData['sort_order']],
                $industryData
            );
        }

        $this->command->info('✓ Bilingual industries seeded');
    }

    /**
     * Seed certifications with bilingual names
     */
    private function seedCertifications(): void
    {
        $certifications = [
            [
                'name' => ['en' => 'Red Seal Carpenter', 'fr' => 'Sceau rouge - Charpentier'],
                'issuing_authority' => ['en' => 'Government of Canada', 'fr' => 'Gouvernement du Canada'],
                'skill_category' => 'Construction',
                'province' => null, // Canada-wide
                'is_required' => false,
                'has_expiry' => false,
                'is_active' => true,
            ],
            [
                'name' => ['en' => 'Certified Electrician', 'fr' => 'Électricien certifié'],
                'issuing_authority' => ['en' => 'Provincial Authority', 'fr' => 'Autorité provinciale'],
                'skill_category' => 'Construction',
                'province' => 'ON',
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 5,
                'is_active' => true,
            ],
            [
                'name' => ['en' => 'Food Handler Certificate', 'fr' => 'Certificat de manipulateur d\'aliments'],
                'issuing_authority' => ['en' => 'Local Health Authority', 'fr' => 'Autorité sanitaire locale'],
                'skill_category' => 'Hospitality',
                'province' => null,
                'is_required' => true,
                'has_expiry' => true,
                'validity_years' => 3,
                'is_active' => true,
            ],
        ];

        foreach ($certifications as $certData) {
            GlobalCertification::updateOrCreate(
                ['skill_category' => $certData['skill_category'], 'province' => $certData['province']],
                $certData
            );
        }

        $this->command->info('✓ Bilingual certifications seeded');
    }

    /**
     * Seed languages with bilingual names
     */
    private function seedLanguages(): void
    {
        $languages = [
            [
                'name' => ['en' => 'English', 'fr' => 'Anglais'],
                'code' => 'en',
                'is_official_canada' => true,
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'name' => ['en' => 'French', 'fr' => 'Français'],
                'code' => 'fr',
                'is_official_canada' => true,
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'name' => ['en' => 'Spanish', 'fr' => 'Espagnol'],
                'code' => 'es',
                'is_official_canada' => false,
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'name' => ['en' => 'Mandarin', 'fr' => 'Mandarin'],
                'code' => 'zh',
                'is_official_canada' => false,
                'is_active' => true,
                'sort_order' => 4,
            ],
        ];

        foreach ($languages as $langData) {
            GlobalLanguage::updateOrCreate(
                ['code' => $langData['code']],
                $langData
            );
        }

        $this->command->info('✓ Bilingual languages seeded');
    }
}


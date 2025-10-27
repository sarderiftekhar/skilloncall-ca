<?php

namespace Database\Seeders;

use App\Models\Job;
use App\Models\User;
use Illuminate\Database\Seeder;

class JobSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get an employer user
        $employer = User::where('role', 'employer')->first();
        
        if (!$employer) {
            $this->command->warn('No employer user found. Please run the DatabaseSeeder first.');
            return;
        }

        $jobs = [
            [
                'title' => 'Web Developer Needed',
                'description' => 'Looking for an experienced web developer to build a modern e-commerce website using Laravel and React.',
                'category' => 'Web Development',
                'budget' => 2500.00,
                'deadline' => now()->addDays(30),
                'required_skills' => ['PHP', 'Laravel', 'React', 'JavaScript', 'MySQL'],
                'location' => 'Toronto, ON',
                'job_type' => 'contract',
                'experience_level' => 'intermediate',
                'status' => 'active',
                'published_at' => now(),
            ],
            [
                'title' => 'Mobile App Developer',
                'description' => 'Need a skilled mobile app developer to create a cross-platform mobile application for our startup.',
                'category' => 'Mobile Development',
                'budget' => 3500.00,
                'deadline' => now()->addDays(45),
                'required_skills' => ['React Native', 'JavaScript', 'Mobile Development', 'API Integration'],
                'location' => 'Vancouver, BC',
                'job_type' => 'contract',
                'experience_level' => 'expert',
                'status' => 'active',
                'published_at' => now(),
            ],
            [
                'title' => 'Graphic Designer for Brand Identity',
                'description' => 'Seeking a creative graphic designer to develop a complete brand identity package including logo, business cards, and marketing materials.',
                'category' => 'Design',
                'budget' => 1200.00,
                'deadline' => now()->addDays(20),
                'required_skills' => ['Adobe Illustrator', 'Adobe Photoshop', 'Brand Design', 'Logo Design'],
                'location' => 'Montreal, QC',
                'job_type' => 'contract',
                'experience_level' => 'intermediate',
                'status' => 'active',
                'published_at' => now(),
            ],
            [
                'title' => 'Content Writer for Tech Blog',
                'description' => 'Looking for a skilled content writer to create engaging blog posts about technology trends and software development.',
                'category' => 'Writing',
                'budget' => 800.00,
                'deadline' => now()->addDays(15),
                'required_skills' => ['Content Writing', 'Technical Writing', 'SEO', 'Research'],
                'location' => 'Remote',
                'job_type' => 'contract',
                'experience_level' => 'entry',
                'status' => 'active',
                'published_at' => now(),
            ],
            [
                'title' => 'Digital Marketing Specialist',
                'description' => 'Need an experienced digital marketing specialist to help grow our online presence and increase sales.',
                'category' => 'Marketing',
                'budget' => 1800.00,
                'deadline' => now()->addDays(35),
                'required_skills' => ['Digital Marketing', 'Google Ads', 'Facebook Ads', 'Analytics', 'SEO'],
                'location' => 'Calgary, AB',
                'job_type' => 'contract',
                'experience_level' => 'intermediate',
                'status' => 'active',
                'published_at' => now(),
            ],
        ];

        foreach ($jobs as $jobData) {
            Job::create(array_merge($jobData, [
                'employer_id' => $employer->id,
                'views_count' => rand(5, 50),
                'applications_count' => rand(0, 8),
                'payment_status' => 'pending',
            ]));
        }

        $this->command->info('Sample jobs created successfully!');
    }
}
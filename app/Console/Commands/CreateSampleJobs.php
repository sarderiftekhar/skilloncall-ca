<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Job;
use App\Models\User;

class CreateSampleJobs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'jobs:create-samples';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create sample job postings for testing';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Creating sample jobs...');
        
        // Get an employer user
        $employer = User::where('role', 'employer')->first();
        
        if (!$employer) {
            $this->error('No employer user found. Please run the DatabaseSeeder first.');
            return Command::FAILURE;
        }

        $jobs = [
            [
                'employer_id' => $employer->id,
                'title' => 'Web Developer Needed',
                'description' => 'Looking for an experienced web developer to build a modern e-commerce website using Laravel and React.',
                'category' => 'Web Development',
                'budget' => 2500.00,
                'deadline' => now()->addDays(30),
                'required_skills' => json_encode(['PHP', 'Laravel', 'React', 'JavaScript', 'MySQL']),
                'location' => 'Toronto, ON',
                'job_type' => 'contract',
                'experience_level' => 'intermediate',
                'status' => 'active',
                'published_at' => now(),
                'views_count' => 15,
                'applications_count' => 3,
                'payment_status' => 'pending',
            ],
            [
                'employer_id' => $employer->id,
                'title' => 'Mobile App Developer',
                'description' => 'Need a skilled mobile app developer to create a cross-platform mobile application for our startup.',
                'category' => 'Mobile Development',
                'budget' => 3500.00,
                'deadline' => now()->addDays(45),
                'required_skills' => json_encode(['React Native', 'JavaScript', 'Mobile Development', 'API Integration']),
                'location' => 'Vancouver, BC',
                'job_type' => 'contract',
                'experience_level' => 'expert',
                'status' => 'active',
                'published_at' => now(),
                'views_count' => 22,
                'applications_count' => 5,
                'payment_status' => 'pending',
            ],
            [
                'employer_id' => $employer->id,
                'title' => 'Graphic Designer for Brand Identity',
                'description' => 'Seeking a creative graphic designer to develop a complete brand identity package including logo, business cards, and marketing materials.',
                'category' => 'Design',
                'budget' => 1200.00,
                'deadline' => now()->addDays(20),
                'required_skills' => json_encode(['Adobe Illustrator', 'Adobe Photoshop', 'Brand Design', 'Logo Design']),
                'location' => 'Montreal, QC',
                'job_type' => 'contract',
                'experience_level' => 'intermediate',
                'status' => 'active',
                'published_at' => now(),
                'views_count' => 8,
                'applications_count' => 2,
                'payment_status' => 'pending',
            ],
        ];

        foreach ($jobs as $jobData) {
            // Check if job already exists
            if (!Job::where('title', $jobData['title'])->exists()) {
                Job::create($jobData);
                $this->info('Created job: ' . $jobData['title']);
            } else {
                $this->warn('Job already exists: ' . $jobData['title']);
            }
        }

        $this->info('Sample jobs created successfully!');
        return Command::SUCCESS;
    }
}
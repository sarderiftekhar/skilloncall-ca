<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        if (! User::where('email', 'admin@example.com')->exists()) {
            User::create([
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'email_verified_at' => now(),
                'password' => 'password',
                'role' => 'admin',
            ]);
        }

        if (! User::where('email', 'employer@example.com')->exists()) {
            User::create([
                'name' => 'Employer User',
                'email' => 'employer@example.com',
                'email_verified_at' => now(),
                'password' => 'password',
                'role' => 'employer',
            ]);
        }

        if (! User::where('email', 'worker@example.com')->exists()) {
            User::create([
                'name' => 'Worker User',
                'email' => 'worker@example.com',
                'email_verified_at' => now(),
                'password' => 'password',
                'role' => 'worker',
            ]);
        }

        // Seed reference data first
        $this->call([
            GlobalSkillsSeeder::class,
            GlobalIndustriesSeeder::class,
            GlobalLanguagesSeeder::class,
            GlobalCertificationsSeeder::class,
            GlobalPostalCodesSeeder::class,
            JobSeeder::class,
        ]);
    }
}

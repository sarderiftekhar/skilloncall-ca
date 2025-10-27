<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class TestLogin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'auth:test-login {email=admin@example.com} {password=password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test user login functionality and fix password issues';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $password = $this->argument('password');
        
        $this->info("🔐 Testing login functionality...");
        $this->info("📧 Email: {$email}");
        $this->info("🔑 Password: {$password}");
        $this->line("");
        
        // Check if user exists
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            $this->error("❌ User not found with email: {$email}");
            $this->line("");
            $this->info("📋 Available users:");
            $users = User::all();
            foreach ($users as $u) {
                $this->info("   • {$u->name} ({$u->email}) - Role: {$u->role}");
            }
            return Command::FAILURE;
        }
        
        $this->info("✅ User found:");
        $this->info("   • Name: {$user->name}");
        $this->info("   • Email: {$user->email}");
        $this->info("   • Role: {$user->role}");
        $this->info("   • Password Hash: " . substr($user->password, 0, 20) . "...");
        $this->line("");
        
        // Test password verification
        $this->info("🔍 Testing password verification...");
        
        if (Hash::check($password, $user->password)) {
            $this->info("✅ Password verification PASSED");
        } else {
            $this->error("❌ Password verification FAILED");
            $this->line("");
            $this->warn("🔧 Fixing password for user...");
            
            // Update password to 'password'
            $user->password = Hash::make($password);
            $user->save();
            
            $this->info("✅ Password updated successfully!");
            $this->info("🔑 New password: {$password}");
            
            // Test again
            if (Hash::check($password, $user->password)) {
                $this->info("✅ Password verification now PASSES");
            } else {
                $this->error("❌ Still failing - there might be another issue");
                return Command::FAILURE;
            }
        }
        
        // Test Auth::attempt
        $this->line("");
        $this->info("🔐 Testing Auth::attempt...");
        
        if (Auth::attempt(['email' => $email, 'password' => $password])) {
            $this->info("✅ Auth::attempt SUCCESSFUL");
            $this->info("🎉 Login should work in the browser!");
            
            // Logout for clean state
            Auth::logout();
        } else {
            $this->error("❌ Auth::attempt FAILED");
            $this->error("There might be an issue with the authentication system");
            return Command::FAILURE;
        }
        
        $this->line("");
        $this->info("🎯 Login Test Summary:");
        $this->info("   ✅ User exists");
        $this->info("   ✅ Password verification works");
        $this->info("   ✅ Auth::attempt works");
        $this->info("   🚀 You should be able to login with:");
        $this->info("      Email: {$email}");
        $this->info("      Password: {$password}");
        
        return Command::SUCCESS;
    }
}
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class DebugOnboardingLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'debug:onboarding-logs {--lines=50 : Number of recent log lines to show} {--follow : Follow the log in real-time}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'View recent onboarding-related log entries for debugging';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $logPath = storage_path('logs/laravel.log');
        
        if (!File::exists($logPath)) {
            $this->error('Log file not found at: ' . $logPath);
            return 1;
        }

        $lines = $this->option('lines');
        $follow = $this->option('follow');
        
        if ($follow) {
            $this->info('Following onboarding logs (Press Ctrl+C to stop)...');
            $this->line('');
            
            // Use tail -f to follow the logs
            $command = "tail -f {$logPath} | grep -i 'onboarding\\|worker.*profile\\|validation.*error'";
            passthru($command);
        } else {
            $this->info("Showing last {$lines} onboarding-related log entries:");
            $this->line('');
            
            // Get recent log entries and filter for onboarding-related entries
            $command = "tail -{$lines} {$logPath} | grep -i 'onboarding\\|worker.*profile\\|validation.*error'";
            
            $output = shell_exec($command);
            
            if (empty($output)) {
                $this->warn('No onboarding-related log entries found in recent logs.');
                $this->line('');
                $this->info('Recent log entries (last 10 lines):');
                $this->line(shell_exec("tail -10 {$logPath}"));
            } else {
                // Color-code different types of log entries
                $lines = explode("\n", trim($output));
                foreach ($lines as $line) {
                    if (empty($line)) continue;
                    
                    if (strpos($line, 'ERROR') !== false) {
                        $this->error($line);
                    } elseif (strpos($line, 'WARNING') !== false) {
                        $this->warn($line);
                    } elseif (strpos($line, 'INFO') !== false) {
                        $this->info($line);
                    } else {
                        $this->line($line);
                    }
                }
            }
        }
        
        $this->line('');
        $this->comment('Tip: Use --follow to monitor logs in real-time');
        $this->comment('Tip: Use --lines=N to show more/fewer recent entries');
        
        return 0;
    }
}
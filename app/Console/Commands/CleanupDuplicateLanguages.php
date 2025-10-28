<?php

namespace App\Console\Commands;

use App\Models\GlobalLanguage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CleanupDuplicateLanguages extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cleanup:duplicate-languages {--dry-run : Show what would be deleted without actually deleting}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove duplicate language records from global_languages table';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $isDryRun = $this->option('dry-run');
        
        if ($isDryRun) {
            $this->info('🔍 DRY RUN MODE - No changes will be made');
            $this->newLine();
        }

        $this->info('Starting duplicate language cleanup...');
        $this->newLine();

        DB::beginTransaction();

        try {
            // Find all duplicate language names
            $duplicates = DB::table('global_languages')
                ->select('name', 'is_official_canada', DB::raw('COUNT(*) as count'), DB::raw('GROUP_CONCAT(id) as ids'))
                ->groupBy('name', 'is_official_canada')
                ->having('count', '>', 1)
                ->get();

            if ($duplicates->isEmpty()) {
                $this->info('✅ No duplicate languages found!');
                DB::rollBack();
                return Command::SUCCESS;
            }

            $this->warn("Found {$duplicates->count()} groups of duplicate languages:");
            $this->newLine();

            $totalDuplicates = 0;

            foreach ($duplicates as $duplicate) {
                $ids = explode(',', $duplicate->ids);
                $keepId = min($ids); // Keep the language with the lowest ID
                $deleteIds = array_diff($ids, [$keepId]);
                
                $totalDuplicates += count($deleteIds);

                $this->line("📝 Language: <fg=cyan>{$duplicate->name}</> (Official: " . ($duplicate->is_official_canada ? 'Yes' : 'No') . ")");
                $this->line("   Found {$duplicate->count} copies with IDs: " . implode(', ', $ids));
                $this->line("   ✓ Keeping ID: <fg=green>{$keepId}</>");
                $this->line("   ✗ Deleting IDs: <fg=red>" . implode(', ', $deleteIds) . "</>");

                if (!$isDryRun) {
                    // Update foreign key references in worker_languages pivot table
                    foreach ($deleteIds as $deleteId) {
                        DB::table('worker_languages')
                            ->where('global_language_id', $deleteId)
                            ->update(['global_language_id' => $keepId]);
                    }

                    // Delete duplicate records
                    GlobalLanguage::whereIn('id', $deleteIds)->delete();
                }

                $this->newLine();
            }

            if (!$isDryRun) {
                DB::commit();
                $this->newLine();
                $this->info("✅ Successfully removed {$totalDuplicates} duplicate language records!");
                $this->info("✅ Updated foreign key references in worker_languages table");
            } else {
                DB::rollBack();
                $this->newLine();
                $this->info("📊 Would remove {$totalDuplicates} duplicate language records");
                $this->info("💡 Run without --dry-run to actually perform the cleanup");
            }

            // Show final statistics
            $this->newLine();
            $totalLanguages = GlobalLanguage::count();
            $this->info("📊 Total languages remaining: {$totalLanguages}");

            return Command::SUCCESS;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('❌ Error during cleanup: ' . $e->getMessage());
            $this->error($e->getTraceAsString());
            return Command::FAILURE;
        }
    }
}


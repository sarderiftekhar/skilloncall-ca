<?php

namespace App\Console\Commands;

use App\Models\GlobalSkill;
use App\Models\GlobalIndustry;
use App\Models\GlobalCertification;
use App\Models\GlobalLanguage;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TranslateGlobalData extends Command
{
    protected $signature = 'translate:global-data 
                            {--model=all : Models to translate (skill, industry, certification, language, all)}
                            {--limit= : Limit number of records to translate (for testing)}
                            {--dry-run : Preview translations without saving}
                            {--report : Generate CSV report of translations}';
    
    protected $description = 'Translate global reference data from English to French using Google Translate API';

    private string $apiKey;
    private array $translations = [];
    private int $successCount = 0;
    private int $errorCount = 0;
    private int $skippedCount = 0;

    public function handle()
    {
        $this->info('🌐 SkillOnCall Global Data Translation');
        $this->info('=====================================');
        $this->newLine();

        // Initialize Google Translate
        try {
            $this->apiKey = env('GOOGLE_TRANSLATE_API_KEY');
            if (!$this->apiKey) {
                throw new \Exception('GOOGLE_TRANSLATE_API_KEY not set in .env');
            }
            $this->info('✓ Google Translate API key loaded');
        } catch (\Exception $e) {
            $this->error('✗ Failed to load Google Translate API key');
            $this->error('Error: ' . $e->getMessage());
            $this->newLine();
            $this->warn('Please check:');
            $this->warn('1. GOOGLE_TRANSLATE_API_KEY is set in .env');
            $this->warn('2. API key is valid and has Cloud Translation API enabled');
            $this->warn('3. Billing is enabled on your Google Cloud project');
            return Command::FAILURE;
        }

        $model = $this->option('model');
        $dryRun = $this->option('dry-run');
        $limit = $this->option('limit');
        $report = $this->option('report');

        if ($dryRun) {
            $this->warn('⚠ DRY RUN MODE - No changes will be saved');
        }

        $this->newLine();

        // Translate each model type
        if ($model === 'all' || $model === 'skill') {
            $this->translateSkills($dryRun, $limit);
        }

        if ($model === 'all' || $model === 'industry') {
            $this->translateIndustries($dryRun, $limit);
        }

        if ($model === 'all' || $model === 'certification') {
            $this->translateCertifications($dryRun, $limit);
        }

        if ($model === 'all' || $model === 'language') {
            $this->translateLanguages($dryRun, $limit);
        }

        // Summary
        $this->newLine();
        $this->info('=================================');
        $this->info('📊 Translation Summary');
        $this->info('=================================');
        $this->info("✓ Successful: {$this->successCount}");
        $this->info("⊘ Skipped (already translated): {$this->skippedCount}");
        $this->info("✗ Errors: {$this->errorCount}");
        $this->newLine();

        // Generate report if requested
        if ($report && !empty($this->translations)) {
            $this->generateReport();
        }

        return Command::SUCCESS;
    }

    private function translateSkills(bool $dryRun, ?int $limit): void
    {
        $this->info('📝 Translating Skills...');
        
        $query = GlobalSkill::query();
        if ($limit) {
            $query->limit($limit);
        }
        
        $skills = $query->get();
        $bar = $this->output->createProgressBar($skills->count());
        $bar->start();

        foreach ($skills as $skill) {
            try {
                // Get English name (from JSON)
                $englishName = is_array($skill->name) ? $skill->name['en'] : json_decode($skill->name, true)['en'] ?? $skill->name;
                
                // Skip if French already exists
                $nameData = is_array($skill->name) ? $skill->name : json_decode($skill->name, true);
                if (isset($nameData['fr']) && !empty($nameData['fr'])) {
                    $this->skippedCount++;
                    $bar->advance();
                    continue;
                }

                // Translate to French
                $frenchName = $this->translateText($englishName);

                // Translate description if exists
                $frenchDesc = null;
                if ($skill->description) {
                    $englishDesc = is_array($skill->description) ? $skill->description['en'] : json_decode($skill->description, true)['en'] ?? null;
                    if ($englishDesc) {
                        $frenchDesc = $this->translateText($englishDesc);
                    }
                }

                // Save if not dry run
                if (!$dryRun) {
                    $skill->setTranslation('name', 'fr', $frenchName);
                    if ($frenchDesc) {
                        $skill->setTranslation('description', 'fr', $frenchDesc);
                    }
                    $skill->save();
                }

                // Store for report
                $this->translations[] = [
                    'type' => 'Skill',
                    'id' => $skill->id,
                    'category' => $skill->category,
                    'english' => $englishName,
                    'french' => $frenchName,
                    'status' => '✓'
                ];

                $this->successCount++;
            } catch (\Exception $e) {
                $this->errorCount++;
                Log::error('Translation error for skill ' . $skill->id . ': ' . $e->getMessage());
                
                $this->translations[] = [
                    'type' => 'Skill',
                    'id' => $skill->id,
                    'category' => $skill->category,
                    'english' => $englishName ?? 'N/A',
                    'french' => 'ERROR',
                    'status' => '✗ ' . $e->getMessage()
                ];
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function translateIndustries(bool $dryRun, ?int $limit): void
    {
        $this->info('🏭 Translating Industries...');
        
        $query = GlobalIndustry::query();
        if ($limit) {
            $query->limit($limit);
        }
        
        $industries = $query->get();
        $bar = $this->output->createProgressBar($industries->count());
        $bar->start();

        foreach ($industries as $industry) {
            try {
                $englishName = is_array($industry->name) ? $industry->name['en'] : json_decode($industry->name, true)['en'] ?? $industry->name;
                
                // Skip if already translated
                $nameData = is_array($industry->name) ? $industry->name : json_decode($industry->name, true);
                if (isset($nameData['fr']) && !empty($nameData['fr'])) {
                    $this->skippedCount++;
                    $bar->advance();
                    continue;
                }

                $frenchName = $this->translateText($englishName);

                if (!$dryRun) {
                    $industry->setTranslation('name', 'fr', $frenchName);
                    $industry->save();
                }

                $this->translations[] = [
                    'type' => 'Industry',
                    'id' => $industry->id,
                    'category' => $industry->category,
                    'english' => $englishName,
                    'french' => $frenchName,
                    'status' => '✓'
                ];

                $this->successCount++;
            } catch (\Exception $e) {
                $this->errorCount++;
                Log::error('Translation error for industry ' . $industry->id . ': ' . $e->getMessage());
                
                $this->translations[] = [
                    'type' => 'Industry',
                    'id' => $industry->id,
                    'category' => $industry->category,
                    'english' => $englishName ?? 'N/A',
                    'french' => 'ERROR',
                    'status' => '✗ ' . $e->getMessage()
                ];
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function translateCertifications(bool $dryRun, ?int $limit): void
    {
        $this->info('🏅 Translating Certifications...');
        
        $query = GlobalCertification::query();
        if ($limit) {
            $query->limit($limit);
        }
        
        $certifications = $query->get();
        $bar = $this->output->createProgressBar($certifications->count());
        $bar->start();

        foreach ($certifications as $cert) {
            try {
                $englishName = is_array($cert->name) ? $cert->name['en'] : json_decode($cert->name, true)['en'] ?? $cert->name;
                
                // Skip if already translated
                $nameData = is_array($cert->name) ? $cert->name : json_decode($cert->name, true);
                if (isset($nameData['fr']) && !empty($nameData['fr'])) {
                    $this->skippedCount++;
                    $bar->advance();
                    continue;
                }

                $frenchName = $this->translateText($englishName);

                if (!$dryRun) {
                    $cert->setTranslation('name', 'fr', $frenchName);
                    
                    // Translate issuing authority if exists
                    if ($cert->issuing_authority) {
                        $englishAuth = is_array($cert->issuing_authority) ? $cert->issuing_authority['en'] : json_decode($cert->issuing_authority, true)['en'] ?? null;
                        if ($englishAuth) {
                            $frenchAuth = $this->translateText($englishAuth);
                            $cert->setTranslation('issuing_authority', 'fr', $frenchAuth);
                        }
                    }
                    
                    $cert->save();
                }

                $this->translations[] = [
                    'type' => 'Certification',
                    'id' => $cert->id,
                    'category' => $cert->skill_category ?? 'N/A',
                    'english' => $englishName,
                    'french' => $frenchName,
                    'status' => '✓'
                ];

                $this->successCount++;
            } catch (\Exception $e) {
                $this->errorCount++;
                Log::error('Translation error for certification ' . $cert->id . ': ' . $e->getMessage());
                
                $this->translations[] = [
                    'type' => 'Certification',
                    'id' => $cert->id,
                    'category' => $cert->skill_category ?? 'N/A',
                    'english' => $englishName ?? 'N/A',
                    'french' => 'ERROR',
                    'status' => '✗ ' . $e->getMessage()
                ];
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    private function translateLanguages(bool $dryRun, ?int $limit): void
    {
        $this->info('🗣️ Translating Languages...');
        
        $query = GlobalLanguage::query();
        if ($limit) {
            $query->limit($limit);
        }
        
        $languages = $query->get();
        $bar = $this->output->createProgressBar($languages->count());
        $bar->start();

        foreach ($languages as $lang) {
            try {
                $englishName = is_array($lang->name) ? $lang->name['en'] : json_decode($lang->name, true)['en'] ?? $lang->name;
                
                // Skip if already translated
                $nameData = is_array($lang->name) ? $lang->name : json_decode($lang->name, true);
                if (isset($nameData['fr']) && !empty($nameData['fr'])) {
                    $this->skippedCount++;
                    $bar->advance();
                    continue;
                }

                $frenchName = $this->translateText($englishName);

                if (!$dryRun) {
                    $lang->setTranslation('name', 'fr', $frenchName);
                    $lang->save();
                }

                $this->translations[] = [
                    'type' => 'Language',
                    'id' => $lang->id,
                    'category' => $lang->code,
                    'english' => $englishName,
                    'french' => $frenchName,
                    'status' => '✓'
                ];

                $this->successCount++;
            } catch (\Exception $e) {
                $this->errorCount++;
                Log::error('Translation error for language ' . $lang->id . ': ' . $e->getMessage());
                
                $this->translations[] = [
                    'type' => 'Language',
                    'id' => $lang->id,
                    'category' => $lang->code,
                    'english' => $englishName ?? 'N/A',
                    'french' => 'ERROR',
                    'status' => '✗ ' . $e->getMessage()
                ];
            }

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
    }

    /**
     * Translate text from English to French using Google Translate REST API
     */
    private function translateText(string $text): string
    {
        $url = 'https://translation.googleapis.com/language/translate/v2';
        
        $params = http_build_query([
            'key' => $this->apiKey,
            'q' => $text,
            'source' => 'en',
            'target' => 'fr',
            'format' => 'text'
        ]);
        
        $response = file_get_contents("{$url}?{$params}");
        $result = json_decode($response, true);
        
        if (isset($result['data']['translations'][0]['translatedText'])) {
            return $result['data']['translations'][0]['translatedText'];
        }
        
        throw new \Exception('Translation API returned unexpected response');
    }

    private function generateReport(): void
    {
        $filename = storage_path('app/translations_' . date('Y-m-d_His') . '.csv');
        
        $fp = fopen($filename, 'w');
        
        // CSV Header
        fputcsv($fp, ['Type', 'ID', 'Category', 'English', 'French', 'Status']);
        
        // CSV Data
        foreach ($this->translations as $translation) {
            fputcsv($fp, $translation);
        }
        
        fclose($fp);
        
        $this->info("📄 Translation report saved: {$filename}");
    }
}


<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tables that may contain the relationship enum column.
     *
     * @var array<int, string>
     */
    private array $tables = [
        'employee_references',
        'worker_references',
    ];

    /**
     * Expanded list of relationship values.
     *
     * @var array<int, string>
     */
    private array $expandedValues = [
        'previous_employer',
        'previous_supervisor',
        'satisfied_client',
        'colleague',
        'business_partner',
        'mentor',
        'trainer',
        'team_lead',
        'volunteer_coordinator',
        'community_leader',
    ];

    /**
     * Original relationship values.
     *
     * @var array<int, string>
     */
    private array $originalValues = [
        'previous_employer',
        'previous_supervisor',
        'satisfied_client',
        'colleague',
        'business_partner',
    ];

    public function up(): void
    {
        $this->updateRelationshipEnum($this->expandedValues);
    }

    public function down(): void
    {
        $this->updateRelationshipEnum($this->originalValues);
    }

    /**
     * Update the enum definition for the relationship column if the table exists.
     */
    private function updateRelationshipEnum(array $values): void
    {
        $enumList = "'" . implode("','", $values) . "'";

        foreach ($this->tables as $table) {
            if (Schema::hasTable($table) && Schema::hasColumn($table, 'relationship')) {
                DB::statement("ALTER TABLE {$table} MODIFY COLUMN relationship ENUM({$enumList}) NOT NULL");
            }
        }
    }
};





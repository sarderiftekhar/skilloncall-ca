<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CheckPrices extends Command
{
    protected $signature = 'paddle:check-prices';
    protected $description = 'Check subscription plan prices';

    public function handle()
    {
        $plans = DB::table('subscription_plans')->get();
        
        $this->table(
            ['ID', 'Name', 'Type', 'Price', 'Yearly Price'],
            $plans->map(fn($p) => [
                $p->id,
                $p->name,
                $p->type,
                $p->price,
                $p->yearly_price ?? 'NULL'
            ])
        );
        
        return 0;
    }
}


<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GlobalCertification extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'issuing_authority',
        'skill_category',
        'province',
        'is_required',
        'has_expiry',
        'validity_years',
        'is_active',
    ];

    protected $casts = [
        'is_required' => 'boolean',
        'has_expiry' => 'boolean',
        'is_active' => 'boolean',
    ];

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeRequired($query)
    {
        return $query->where('is_required', true);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('skill_category', $category);
    }

    public function scopeByProvince($query, $province)
    {
        return $query->where(function ($q) use ($province) {
            $q->where('province', $province)->orWhereNull('province');
        });
    }
}



<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PricingController extends Controller
{
    /**
     * Display the pricing page.
     */
    public function index(Request $request): Response
    {
        // Translations are loaded by HandleInertiaRequests middleware
        return Inertia::render('pricing');
    }
}


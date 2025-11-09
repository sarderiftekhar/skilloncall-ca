<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class HowItWorksController extends Controller
{
    /**
     * Show the How It Works page.
     */
    public function index(): Response
    {
        // Translations are loaded by HandleInertiaRequests middleware
        return Inertia::render('how-it-works');
    }
}


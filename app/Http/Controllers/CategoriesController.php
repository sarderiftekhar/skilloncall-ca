<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoriesController extends Controller
{
    /**
     * Display the categories page.
     */
    public function index(Request $request): Response
    {
        // Translations are loaded by HandleInertiaRequests middleware
        return Inertia::render('categories', [
            'translations' => trans('welcome'),
        ]);
    }
}


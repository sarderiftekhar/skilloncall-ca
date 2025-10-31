<?php

namespace App\Http\Controllers\Worker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkerMessageController extends Controller
{
    /**
     * Display a listing of worker's messages.
     * Temporarily showing coming soon page.
     */
    public function index(Request $request): Response
    {
        // Temporarily return coming soon page
        return Inertia::render('worker/messages/coming-soon');
    }

    /**
     * Display the specified message.
     * Temporarily showing coming soon page.
     */
    public function show($messageId): Response
    {
        // Temporarily return coming soon page
        return Inertia::render('worker/messages/coming-soon');
    }

    /**
     * Send a new message.
     * Temporarily disabled.
     */
    public function store(Request $request)
    {
        return redirect()->back()
            ->with('info', 'This feature is coming soon.');
    }

    /**
     * Mark message as read.
     * Temporarily disabled.
     */
    public function markAsRead($messageId)
    {
        return redirect()->back()
            ->with('info', 'This feature is coming soon.');
    }
}

<?php

namespace App\Http\Controllers\Employee;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeMessageController extends Controller
{
    /**
     * Display a listing of employee's messages.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('employee/messages/index');
    }

    /**
     * Display the specified message.
     */
    public function show($id): Response
    {
        return Inertia::render('employee/messages/show', [
            'messageId' => $id,
        ]);
    }

    /**
     * Store a newly created message.
     */
    public function store(Request $request): RedirectResponse
    {
        return redirect()->back()
            ->with('success', 'Message sent successfully.');
    }

    /**
     * Mark the specified message as read.
     */
    public function markAsRead($id): RedirectResponse
    {
        return redirect()->back()
            ->with('success', 'Message marked as read.');
    }
}


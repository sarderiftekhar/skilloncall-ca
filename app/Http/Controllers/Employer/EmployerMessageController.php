<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Services\Employer\EmployerMessageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployerMessageController extends Controller
{
    public function __construct(
        protected EmployerMessageService $messageService
    ) {}

    /**
     * Display a listing of messages/conversations.
     */
    public function index(Request $request): Response
    {
        $conversations = $this->messageService->getConversations(auth()->user(), $request->all());

        return Inertia::render('employer/messages/index', [
            'conversations' => $conversations,
            'filters' => $request->only(['search', 'employee']),
            'selectedEmployee' => $request->input('employee'),
        ]);
    }

    /**
     * Display the specified conversation.
     */
    public function show(Request $request, $employeeId): Response
    {
        $employee = \App\Models\User::where('id', $employeeId)
            ->where('role', 'employee')
            ->firstOrFail();

        $conversation = $this->messageService->getConversation(auth()->user(), $employee);

        return Inertia::render('employer/messages/show', [
            'employee' => $employee->load('employeeProfile'),
            'messages' => $conversation['messages'],
            'conversationId' => $conversation['id'],
        ]);
    }

    /**
     * Store a newly created message.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'employee_id' => 'required|exists:users,id',
            'message' => 'required|string|max:5000',
        ]);

        $employee = \App\Models\User::findOrFail($request->employee_id);
        
        $this->messageService->sendMessage(
            auth()->user(),
            $employee,
            $request->input('message')
        );

        return redirect()->back()
            ->with('success', 'Message sent successfully.');
    }

    /**
     * Mark conversation as read.
     */
    public function markAsRead($employeeId): RedirectResponse
    {
        $employee = \App\Models\User::findOrFail($employeeId);
        
        $this->messageService->markAsRead(auth()->user(), $employee);

        return redirect()->back()
            ->with('success', 'Messages marked as read.');
    }
}


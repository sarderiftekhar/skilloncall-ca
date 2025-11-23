<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ExceptionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExceptionLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->toString();

        $logs = ExceptionLog::with('user')
            ->when($search, function ($query, $search) {
                $query->where(function ($innerQuery) use ($search) {
                    $innerQuery
                        ->where('message', 'like', "%{$search}%")
                        ->orWhere('exception_class', 'like', "%{$search}%")
                        ->orWhere('request_url', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(25)
            ->withQueryString();

        $transformedLogs = $logs->through(function (ExceptionLog $log) {
            return [
                'id' => $log->id,
                'exception_class' => $log->exception_class,
                'message' => $log->message,
                'file' => $log->file,
                'line' => $log->line,
                'trace' => $log->trace,
                'request_url' => $log->request_url,
                'request_method' => $log->request_method,
                'request_payload' => $log->request_payload,
                'headers' => $log->headers,
                'ip_address' => $log->ip_address,
                'created_at' => optional($log->created_at)->toIso8601String(),
                'user' => $log->user ? [
                    'id' => $log->user->id,
                    'name' => $log->user->name,
                    'email' => $log->user->email,
                ] : null,
            ];
        });

        $stats = [
            'total' => ExceptionLog::count(),
            'today' => ExceptionLog::whereDate('created_at', now()->toDateString())->count(),
            'unique_messages' => ExceptionLog::distinct('message')->count(),
            'last_log_at' => optional(ExceptionLog::latest('created_at')->first()?->created_at)->toIso8601String(),
        ];

        return Inertia::render('admin/logs/exceptions', [
            'logs' => [
                'data' => $transformedLogs->items(),
                'current_page' => $transformedLogs->currentPage(),
                'last_page' => $transformedLogs->lastPage(),
                'per_page' => $transformedLogs->perPage(),
                'total' => $transformedLogs->total(),
                'from' => $transformedLogs->firstItem(),
                'to' => $transformedLogs->lastItem(),
                'links' => $transformedLogs->linkCollection()->toArray(),
            ],
            'filters' => [
                'search' => $search,
            ],
            'stats' => $stats,
        ]);
    }
}


<?php

namespace App\Services\Employer;

use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class EmployerMessageService
{
    /**
     * Get all conversations for an employer.
     */
    public function getConversations(User $employer, array $filters = []): Collection
    {
        // Get unique employees the employer has messaged or received messages from
        $query = DB::table('messages')
            ->where(function ($q) use ($employer) {
                $q->where('sender_id', $employer->id)
                  ->orWhere('receiver_id', $employer->id);
            })
            ->where(function ($q) {
                $q->where('sender_role', '=', 'employer')
                  ->orWhere('receiver_role', '=', 'employer');
            })
            ->select('sender_id', 'receiver_id')
            ->distinct();

        $messagePairs = $query->get();

        $employeeIds = collect();
        foreach ($messagePairs as $pair) {
            if ($pair->sender_id == $employer->id) {
                $employeeIds->push($pair->receiver_id);
            } else {
                $employeeIds->push($pair->sender_id);
            }
        }

        $employeeIds = $employeeIds->unique();

        // Get employee details with last message info
        $conversations = collect();
        
        foreach ($employeeIds as $employeeId) {
            $employee = User::with('employeeProfile')
                ->where('id', $employeeId)
                ->where('role', 'employee')
                ->first();

            if (!$employee) continue;

            // Get last message
            $lastMessage = DB::table('messages')
                ->where(function ($q) use ($employer, $employeeId) {
                    $q->where(function ($q2) use ($employer, $employeeId) {
                        $q2->where('sender_id', $employer->id)
                           ->where('receiver_id', $employeeId);
                    })
                    ->orWhere(function ($q2) use ($employer, $employeeId) {
                        $q2->where('sender_id', $employeeId)
                           ->where('receiver_id', $employer->id);
                    });
                })
                ->orderBy('created_at', 'desc')
                ->first();

            // Count unread messages
            $unreadCount = DB::table('messages')
                ->where('sender_id', $employeeId)
                ->where('receiver_id', $employer->id)
                ->where('is_read', false)
                ->count();

            // Apply search filter
            if (!empty($filters['search'])) {
                $search = strtolower($filters['search']);
                if (
                    !str_contains(strtolower($employee->name), $search) &&
                    !str_contains(strtolower($employee->email), $search) &&
                    (!$lastMessage || !str_contains(strtolower($lastMessage->message ?? ''), $search))
                ) {
                    continue;
                }
            }

            // Apply employee filter
            if (!empty($filters['employee']) && $employeeId != $filters['employee']) {
                continue;
            }

            $conversations->push([
                'employee' => [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'email' => $employee->email,
                    'profile' => $employee->employeeProfile ? [
                        'id' => $employee->employeeProfile->id,
                        'profile_picture' => $employee->employeeProfile->profile_picture,
                    ] : null,
                ],
                'last_message' => $lastMessage ? [
                    'message' => $lastMessage->message,
                    'created_at' => $lastMessage->created_at,
                    'sender_id' => $lastMessage->sender_id,
                ] : null,
                'unread_count' => $unreadCount,
                'updated_at' => $lastMessage ? $lastMessage->created_at : $employee->created_at,
            ]);
        }

        // Sort by last message time
        return $conversations->sortByDesc('updated_at')->values();
    }

    /**
     * Get conversation between employer and employee.
     */
    public function getConversation(User $employer, User $employee): array
    {
        $messages = DB::table('messages')
            ->where(function ($q) use ($employer, $employee) {
                $q->where(function ($q2) use ($employer, $employee) {
                    $q2->where('sender_id', $employer->id)
                       ->where('receiver_id', $employee->id);
                })
                ->orWhere(function ($q2) use ($employer, $employee) {
                    $q2->where('sender_id', $employee->id)
                       ->where('receiver_id', $employer->id);
                });
            })
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function ($message) use ($employer) {
                return [
                    'id' => $message->id,
                    'message' => $message->message,
                    'sender_id' => $message->sender_id,
                    'receiver_id' => $message->receiver_id,
                    'is_from_employer' => $message->sender_id == $employer->id,
                    'is_read' => $message->is_read,
                    'created_at' => $message->created_at,
                ];
            });

        // Mark messages as read
        DB::table('messages')
            ->where('sender_id', $employee->id)
            ->where('receiver_id', $employer->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return [
            'id' => "employer_{$employer->id}_employee_{$employee->id}",
            'messages' => $messages,
        ];
    }

    /**
     * Send a message from employer to employee.
     */
    public function sendMessage(User $employer, User $employee, string $message): void
    {
        DB::table('messages')->insert([
            'sender_id' => $employer->id,
            'receiver_id' => $employee->id,
            'sender_role' => 'employer',
            'receiver_role' => 'employee',
            'message' => $message,
            'is_read' => false,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Mark messages as read.
     */
    public function markAsRead(User $employer, User $employee): void
    {
        DB::table('messages')
            ->where('sender_id', $employee->id)
            ->where('receiver_id', $employer->id)
            ->where('is_read', false)
            ->update(['is_read' => true]);
    }
}


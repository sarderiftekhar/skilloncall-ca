<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminJobController;
use App\Http\Controllers\Admin\AdminPaymentController;
use App\Http\Controllers\Admin\AdminReportController;
use App\Http\Controllers\Admin\AdminSettingsController;
use App\Http\Controllers\Admin\ExceptionLogController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "admin" middleware group.
|
*/

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    
    // User Management
    Route::get('users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('users/{user}', [AdminUserController::class, 'show'])->name('users.show');
    Route::get('users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::put('users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');
    
    // Job Management
    Route::get('jobs', [AdminJobController::class, 'index'])->name('jobs.index');
    Route::get('jobs/{job}', [AdminJobController::class, 'show'])->name('jobs.show');
    Route::put('jobs/{job}/approve', [AdminJobController::class, 'approve'])->name('jobs.approve');
    Route::put('jobs/{job}/reject', [AdminJobController::class, 'reject'])->name('jobs.reject');
    Route::delete('jobs/{job}', [AdminJobController::class, 'destroy'])->name('jobs.destroy');
    
    // Payment Management
    Route::get('payments', [AdminPaymentController::class, 'index'])->name('payments.index');
    Route::get('payments/{payment}', [AdminPaymentController::class, 'show'])->name('payments.show');
    Route::put('payments/{payment}/process', [AdminPaymentController::class, 'process'])->name('payments.process');
    
    // Reports
    Route::get('reports', [AdminReportController::class, 'index'])->name('reports.index');
    Route::get('reports/users', [AdminReportController::class, 'users'])->name('reports.users');
    Route::get('reports/jobs', [AdminReportController::class, 'jobs'])->name('reports.jobs');
    Route::get('reports/payments', [AdminReportController::class, 'payments'])->name('reports.payments');
    Route::get('reports/export/{type}', [AdminReportController::class, 'export'])->name('reports.export');
    
    // Exception Logs
    Route::get('logs/exceptions', [ExceptionLogController::class, 'index'])->name('logs.exceptions.index');
    
    // Settings
    Route::get('settings', [AdminSettingsController::class, 'index'])->name('settings.index');
    Route::put('settings', [AdminSettingsController::class, 'update'])->name('settings.update');
});

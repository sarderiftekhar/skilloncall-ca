<?php

use App\Http\Controllers\Employer\EmployerDashboardController;
use App\Http\Controllers\Employer\EmployerJobController;
use App\Http\Controllers\Employer\EmployerWorkerController;
use App\Http\Controllers\Employer\EmployerApplicationController;
use App\Http\Controllers\Employer\EmployerPaymentController;
use App\Http\Controllers\Employer\EmployerProfileController;
use App\Http\Controllers\Employer\OnboardingController;
use App\Http\Controllers\LocationController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Employer Routes
|--------------------------------------------------------------------------
|
| Here is where you can register employer routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "employer" middleware group.
|
*/

// Employer Onboarding Routes (no profile completion or email verification required)
Route::middleware(['auth', 'employer'])->prefix('employer')->name('employer.')->group(function () {
    Route::prefix('onboarding')->name('onboarding.')->group(function () {
        Route::get('/', [OnboardingController::class, 'index'])->name('index');
        Route::post('/save', [OnboardingController::class, 'save'])->name('save');
        Route::post('/complete', [OnboardingController::class, 'complete'])->name('complete');
    });

    // Location API routes
    Route::prefix('api')->name('api.')->group(function () {
        Route::get('/provinces', [LocationController::class, 'getProvinces'])->name('provinces');
        Route::get('/provinces/{provinceId}/cities', [LocationController::class, 'getCitiesByProvince'])->name('cities');
        Route::get('/provinces/code/{provinceCode}/cities', [LocationController::class, 'getCitiesByProvinceCode'])->name('cities.by.code');
    });
});

// Employer Routes (require profile completion and email verification)
Route::middleware(['auth', 'verified', 'employer'])->prefix('employer')->name('employer.')->group(function () {
    // Dashboard
    Route::get('dashboard', [EmployerDashboardController::class, 'index'])->name('dashboard');
    
    // Job Management
    Route::get('jobs', [EmployerJobController::class, 'index'])->name('jobs.index');
    Route::get('jobs/create', [EmployerJobController::class, 'create'])->name('jobs.create');
    Route::post('jobs', [EmployerJobController::class, 'store'])->name('jobs.store');
    Route::get('jobs/{job}', [EmployerJobController::class, 'show'])->name('jobs.show');
    Route::get('jobs/{job}/edit', [EmployerJobController::class, 'edit'])->name('jobs.edit');
    Route::put('jobs/{job}', [EmployerJobController::class, 'update'])->name('jobs.update');
    Route::delete('jobs/{job}', [EmployerJobController::class, 'destroy'])->name('jobs.destroy');
    Route::put('jobs/{job}/publish', [EmployerJobController::class, 'publish'])->name('jobs.publish');
    Route::put('jobs/{job}/unpublish', [EmployerJobController::class, 'unpublish'])->name('jobs.unpublish');
    
    // Worker Management
    Route::get('workers', [EmployerWorkerController::class, 'index'])->name('workers.index');
    Route::get('workers/{worker}', [EmployerWorkerController::class, 'show'])->name('workers.show');
    Route::post('workers/{worker}/hire', [EmployerWorkerController::class, 'hire'])->name('workers.hire');
    Route::put('workers/{worker}/rate', [EmployerWorkerController::class, 'rate'])->name('workers.rate');
    
    // Application Management
    Route::get('applications', [EmployerApplicationController::class, 'index'])->name('applications.index');
    Route::get('applications/{application}', [EmployerApplicationController::class, 'show'])->name('applications.show');
    Route::put('applications/{application}/accept', [EmployerApplicationController::class, 'accept'])->name('applications.accept');
    Route::put('applications/{application}/reject', [EmployerApplicationController::class, 'reject'])->name('applications.reject');
    
    // Payment Management
    Route::get('payments', [EmployerPaymentController::class, 'index'])->name('payments.index');
    Route::get('payments/{payment}', [EmployerPaymentController::class, 'show'])->name('payments.show');
    Route::post('payments', [EmployerPaymentController::class, 'store'])->name('payments.store');
    
    // Profile Management
    Route::get('profile', [EmployerProfileController::class, 'show'])->name('profile.show');
    Route::get('profile/edit', [EmployerProfileController::class, 'edit'])->name('profile.edit');
    Route::put('profile', [EmployerProfileController::class, 'update'])->name('profile.update');
});

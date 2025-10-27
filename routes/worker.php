<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\Worker\OnboardingController;
use App\Http\Controllers\Worker\WorkerApplicationController;
use App\Http\Controllers\Worker\WorkerDashboardController;
use App\Http\Controllers\Worker\WorkerJobController;
use App\Http\Controllers\Worker\WorkerPaymentController;
use App\Http\Controllers\Worker\WorkerProfileController;
use App\Http\Controllers\Worker\WorkerProfileController as WorkerProfileCrudController;
use App\Http\Controllers\Worker\WorkerSkillController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Worker Routes
|--------------------------------------------------------------------------
|
| Here is where you can register worker routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "worker" middleware group.
|
*/

// Worker Onboarding Routes (no profile completion required)
Route::middleware(['auth', 'verified', 'worker'])->prefix('worker')->name('worker.')->group(function () {
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

// Worker Routes (require profile completion)
Route::middleware(['auth', 'verified', 'worker', 'ensure.worker.profile.complete'])->prefix('worker')->name('worker.')->group(function () {
    // Dashboard
    Route::get('dashboard', [WorkerDashboardController::class, 'index'])->name('dashboard');

    // Job Browsing
    Route::get('jobs', [WorkerJobController::class, 'index'])->name('jobs.index');
    Route::get('jobs/{job}', [WorkerJobController::class, 'show'])->name('jobs.show');
    Route::post('jobs/{job}/apply', [WorkerJobController::class, 'apply'])->name('jobs.apply');
    Route::get('jobs/search', [WorkerJobController::class, 'search'])->name('jobs.search');

    // Application Management
    Route::get('applications', [WorkerApplicationController::class, 'index'])->name('applications.index');
    Route::get('applications/{application}', [WorkerApplicationController::class, 'show'])->name('applications.show');
    Route::put('applications/{application}/withdraw', [WorkerApplicationController::class, 'withdraw'])->name('applications.withdraw');
    Route::put('applications/{application}/complete', [WorkerApplicationController::class, 'complete'])->name('applications.complete');

    // Profile Management (CRUD for profile view/edit)
    Route::get('profile', [WorkerProfileCrudController::class, 'show'])->name('profile.show');
    Route::get('profile/edit', [WorkerProfileCrudController::class, 'edit'])->name('profile.edit');
    Route::put('profile', [WorkerProfileCrudController::class, 'update'])->name('profile.update');
    Route::post('profile/portfolio', [WorkerProfileController::class, 'addPortfolio'])->name('profile.portfolio.add');
    Route::delete('profile/portfolio/{portfolio}', [WorkerProfileController::class, 'removePortfolio'])->name('profile.portfolio.remove');

    // Skills Management
    Route::get('skills', [WorkerSkillController::class, 'index'])->name('skills.index');
    Route::post('skills', [WorkerSkillController::class, 'store'])->name('skills.store');
    Route::delete('skills/{skill}', [WorkerSkillController::class, 'destroy'])->name('skills.destroy');

    // Payment Management
    Route::get('payments', [WorkerPaymentController::class, 'index'])->name('payments.index');
    Route::get('payments/{payment}', [WorkerPaymentController::class, 'show'])->name('payments.show');
    Route::post('payments/request', [WorkerPaymentController::class, 'request'])->name('payments.request');
});

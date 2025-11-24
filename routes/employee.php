<?php

use App\Http\Controllers\LocationController;
use App\Http\Controllers\Employee\OnboardingController;
use App\Http\Controllers\Employee\EmployeeApplicationController;
use App\Http\Controllers\Employee\EmployeeDashboardController;
use App\Http\Controllers\Employee\EmployeeJobController;
use App\Http\Controllers\Employee\EmployeePaymentController;
use App\Http\Controllers\Employee\EmployeeProfileController;
use App\Http\Controllers\Employee\EmployeeProfileController as EmployeeProfileCrudController;
use App\Http\Controllers\Employee\EmployeeSkillController;
use App\Http\Controllers\Employee\EmployeeAvailabilityController;
use App\Http\Controllers\Employee\EmployeeReviewController;
use App\Http\Controllers\Employee\ReferenceDataController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Employee Routes
|--------------------------------------------------------------------------
|
| Here is where you can register worker routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "worker" middleware group.
|
*/

// Employee Onboarding Routes (no profile completion required)
Route::middleware(['auth', 'employee'])->prefix('employee')->name('employee.')->group(function () {
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
        
        // Reference Data API routes
        Route::get('/skills', [ReferenceDataController::class, 'getSkills'])->name('skills');
        Route::get('/industries', [ReferenceDataController::class, 'getIndustries'])->name('industries');
        Route::get('/languages', [ReferenceDataController::class, 'getLanguages'])->name('languages');
        Route::get('/certifications', [ReferenceDataController::class, 'getCertifications'])->name('certifications');
    });
});

// Employee Routes (require profile completion)
Route::middleware(['auth', 'verified', 'employee', 'ensure.employee.profile.complete'])->prefix('employee')->name('employee.')->group(function () {
    // Dashboard
    Route::get('dashboard', [EmployeeDashboardController::class, 'index'])->name('dashboard');

    // Job Browsing
    Route::get('jobs', [EmployeeJobController::class, 'index'])->name('jobs.index');
    Route::get('jobs/{job}', [EmployeeJobController::class, 'show'])->name('jobs.show');
    Route::post('jobs/{job}/apply', [EmployeeJobController::class, 'apply'])->name('jobs.apply');
    Route::get('jobs/search', [EmployeeJobController::class, 'search'])->name('jobs.search');
    
    // Saved Jobs
    Route::get('saved-jobs', [EmployeeJobController::class, 'savedJobs'])->name('saved-jobs');
    Route::post('jobs/{job}/save', [EmployeeJobController::class, 'saveJob'])->name('jobs.save');
    Route::delete('jobs/{job}/unsave', [EmployeeJobController::class, 'unsaveJob'])->name('jobs.unsave');

    // Application Management
    Route::get('applications', [EmployeeApplicationController::class, 'index'])->name('applications.index');
    Route::get('applications/{application}', [EmployeeApplicationController::class, 'show'])->name('applications.show');
    Route::put('applications/{application}/withdraw', [EmployeeApplicationController::class, 'withdraw'])->name('applications.withdraw');
    Route::put('applications/{application}/complete', [EmployeeApplicationController::class, 'complete'])->name('applications.complete');

    // Profile Management (CRUD for profile view/edit)
    Route::get('profile', [EmployeeProfileCrudController::class, 'show'])->name('profile.show');
    Route::get('profile/edit', [EmployeeProfileCrudController::class, 'edit'])->name('profile.edit');
    Route::put('profile', [EmployeeProfileCrudController::class, 'update'])->name('profile.update');
    Route::post('profile/portfolio', [EmployeeProfileController::class, 'addPortfolio'])->name('profile.portfolio.add');
    Route::delete('profile/portfolio/{portfolio}', [EmployeeProfileController::class, 'removePortfolio'])->name('profile.portfolio.remove');

    // Skills Management
    Route::get('skills', [EmployeeSkillController::class, 'index'])->name('skills.index');
    Route::post('skills', [EmployeeSkillController::class, 'store'])->name('skills.store');
    Route::delete('skills/{skill}', [EmployeeSkillController::class, 'destroy'])->name('skills.destroy');

    // Availability Management
    Route::get('availability', [EmployeeAvailabilityController::class, 'index'])->name('availability.index');
    Route::put('availability', [EmployeeAvailabilityController::class, 'update'])->name('availability.update');

    // Payment Management
    Route::get('payments', [EmployeePaymentController::class, 'index'])->name('payments.index');
    Route::get('payments/{payment}', [EmployeePaymentController::class, 'show'])->name('payments.show');
    Route::post('payments/request', [EmployeePaymentController::class, 'request'])->name('payments.request');

    // Review Management
    Route::get('reviews', [EmployeeReviewController::class, 'index'])->name('reviews.index');
    Route::get('applications/{application}/reviews/create', [EmployeeReviewController::class, 'create'])->name('reviews.create');
    Route::post('reviews', [EmployeeReviewController::class, 'store'])->name('reviews.store');
    Route::get('reviews/{review}/edit', [EmployeeReviewController::class, 'edit'])->name('reviews.edit');
    Route::put('reviews/{review}', [EmployeeReviewController::class, 'update'])->name('reviews.update');
    Route::delete('reviews/{review}', [EmployeeReviewController::class, 'destroy'])->name('reviews.destroy');
    Route::get('applications/{application}/can-review', [EmployeeReviewController::class, 'canReview'])->name('reviews.can-review');
});

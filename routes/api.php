<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// SkillOnCall Progress Tracker API routes (Public access)
Route::apiResource('progress', App\Http\Controllers\SkillOnCallProgressController::class);
Route::post('/progress/upload-screenshot', [App\Http\Controllers\SkillOnCallProgressController::class, 'uploadPastedScreenshot']);

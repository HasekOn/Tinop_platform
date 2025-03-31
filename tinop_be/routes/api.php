<?php

use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\IdeaController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserAvailabilityController;
use Illuminate\Support\Facades\Route;

/*
API ROUTING
*/

/*
 * Comment routes
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('tasks/{task}')->group(function () {
        Route::get('comments', [CommentController::class, 'indexForTask']);
        Route::post('comments', [CommentController::class, 'storeForTask']);
    });

    Route::prefix('ideas/{idea}')->group(function () {
        Route::get('comments', [CommentController::class, 'indexForIdea']);
        Route::post('comments', [CommentController::class, 'storeForIdea']);
    });

    Route::apiResource('comments', CommentController::class)->only([
        'update', 'destroy' //'show'
    ]);
});

/*
 * Main Routes
 */
Route::apiResource('tasks', TaskController::class)->middleware('auth:sanctum');
Route::apiResource('ideas', IdeaController::class)->middleware('auth:sanctum');
Route::apiResource('user_availabilities', UserAvailabilityController::class)
    ->middleware('auth:sanctum');

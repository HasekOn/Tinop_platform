<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\IdeaController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\TaskController;
use App\Http\Controllers\Api\UserAvailabilityController;
use Illuminate\Support\Facades\Route;

/*
API ROUTING
*/

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

/*
 * Comment routes
 */
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

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
Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('tasks', TaskController::class);
    Route::apiResource('ideas', IdeaController::class);
    Route::apiResource('user_availabilities', UserAvailabilityController::class);

    // Handling Projects and project - task
    Route::apiResource('projects', ProjectController::class);
    Route::post('/projects/{project}/tasks', [ProjectController::class, 'attachTask']);
    Route::delete('/projects/{project}/tasks/{task}', [ProjectController::class, 'detachTask']);

    //Handling project - user
    Route::post('/projects/{project}/invite', [ProjectController::class, 'inviteUser']);
    Route::delete('/projects/{project}/users/{user}', [ProjectController::class, 'removeUser']);
    Route::get('/projects/{project}/allUsers', [ProjectController::class, 'allUsers']);
    Route::get('/projects/{project}/noUsersInProject', [ProjectController::class, 'noUsersInProject']);

    //get all user availabilities
    Route::get('/allAvailability', [UserAvailabilityController::class, 'allUsersAvailability']);
});

//Routes without sanctum
Route::post('/invitations/accept', [ProjectController::class, 'acceptInvitation']);

<?php

use App\Http\Controllers\Api\TaskController;
use Illuminate\Support\Facades\Route;
/*
Api routes
*/

Route::apiResource('tasks', TaskController::class, ['middleware' => 'auth:sanctum']);

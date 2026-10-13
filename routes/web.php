<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\GoogleAuthController;
use Illuminate\Support\Facades\Route;

// root -> admin
Route::redirect('/', '/admin');

// API (unchanged)
Route::prefix('api')->group(function () {
    Route::post('/register', [AuthController::class, 'register'])->middleware('throttle:6,1');
    Route::post('/login', [AuthController::class, 'login'])->middleware('throttle:6,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword'])->middleware('throttle:6,1');
    Route::post('/reset-password', [AuthController::class, 'resetPassword'])->middleware('throttle:6,1');

    Route::get('/auth/google/redirect', [GoogleAuthController::class, 'redirect'])->name('google.redirect');
    Route::get('/auth/google/callback', [GoogleAuthController::class, 'callback'])->name('google.callback');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user', [UserController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::apiResource('/users', UserController::class);
    });
});

// SPA under /admin
Route::prefix('admin')->group(function () {
    Route::get('/', fn () => view('app'))->name('login');
    Route::get('/register', fn () => view('app'))->name('register');
    Route::get('/forgot-password', fn () => view('app'))->name('password.request');
    Route::get('/reset-password/{token}', fn () => view('app'))->name('password.reset');

    // catch-all for React Router (keep LAST)
    Route::get('/{path}', fn () => view('app'))->where('path', '.*');
});
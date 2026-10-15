<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GoogleAuthController;
use App\Http\Controllers\PageController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\MenuItemsController;

// 1. Root directory serves the public frontend view (with header and footer)
Route::get('/', function () {
    return view('frontend'); // Change 'frontend' to whatever blade file holds your public layout
});

// Optional: If you have public pages like dynamic frontend pages, you can add them here:
// Route::get('/{slug}', [FrontendController::class, 'show']);

// API routes (unchanged)
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

        // pages
        Route::apiResource('/pages', PageController::class);

        // New Menu Routes
        Route::apiResource('menus', MenuController::class);
        Route::post('menus/reorder', [MenuController::class, 'reorder']);
        Route::get('menus/{menu}/design', [MenuController::class, 'design']);
        Route::put('menus/{menu}/design', [MenuController::class, 'updateDesign']);
        Route::post('menus/{menu}/logo', [MenuController::class, 'uploadLogo']);

        // menu items
        Route::post('menu-items/reorder', [MenuItemsController::class, 'reorder']);
        Route::apiResource('menu-items', MenuItemsController::class);
    });
});

// SPA under /admin
Route::prefix('admin')->group(function () {
    Route::get('/', fn () => view('app'))->name('login');
    Route::get('/register', fn () => view('app'))->name('register');
    Route::get('/forgot-password', fn () => view('app'))->name('password.request');
    Route::get('/reset-password/{token}', fn () => view('app'))->name('password.reset');

    // catch-all for React Router inside admin (keep LAST)
    Route::get('/{path}', fn () => view('app'))->where('path', '.*');
});
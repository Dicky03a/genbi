<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::middleware('role:Superadmin|admin')->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::resource('dashboard/categories', CategoryController::class)->names('categories');
        Route::resource('dashboard/news', NewsController::class)->names('news');
    });

    Route::get('user/dashboard', function () {
        return Inertia::render('user/dashboard');
    })->middleware('role:user')->name('user.dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

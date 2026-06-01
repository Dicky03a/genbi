<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->middleware('role:Superadmin|admin')->name('dashboard');

    Route::get('user/dashboard', function () {
        return Inertia::render('user/dashboard');
    })->middleware('role:user')->name('user.dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

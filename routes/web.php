<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NewsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('app');
})->name('home');

Route::get('beasiswa', [\App\Http\Controllers\BeasiswaController::class, 'publicIndex'])->name('beasiswa.index');

Route::middleware(['auth'])->group(function () {
    Route::middleware('role:Superadmin|admin')->group(function () {
        Route::get('dashboard', function () {
            return Inertia::render('dashboard');
        })->name('dashboard');

        Route::resource('dashboard/categories', CategoryController::class)->names('categories');
        Route::resource('dashboard/news', NewsController::class)->names('news');
        Route::resource('dashboard/abouts', AboutController::class)->names('abouts');

        Route::resource('dashboard/divisions', \App\Http\Controllers\DivisionController::class)->names('divisions');
        Route::post('dashboard/divisions/{division}/assign-user', [\App\Http\Controllers\DivisionController::class, 'assignUser'])->name('divisions.assign-user');
        Route::post('dashboard/divisions/{division}/remove-user', [\App\Http\Controllers\DivisionController::class, 'removeUser'])->name('divisions.remove-user');

        Route::resource('dashboard/beasiswas', \App\Http\Controllers\BeasiswaController::class)->names('beasiswas');
    });

    Route::get('user/dashboard', function () {
        return Inertia::render('user/dashboard');
    })->middleware('role:user')->name('user.dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

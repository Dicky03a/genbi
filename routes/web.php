<?php

use App\Http\Controllers\AboutController;
use App\Http\Controllers\Admin\AttendanceVerificationController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\KomisariatController;
use App\Http\Controllers\Admin\PeriodController;
use App\Http\Controllers\Admin\PointCategoryController;
use App\Http\Controllers\Admin\PointRateController;
use App\Http\Controllers\Admin\RecapController;
use App\Http\Controllers\Admin\SubmissionVerificationController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\BeasiswaController;
use App\Http\Controllers\BeasiswaFaqController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DivisionController;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\PointController;
use App\Http\Controllers\PointSubmissionController;
use App\Http\Controllers\PrestasiController;
use App\Http\Controllers\UserController;
use App\Models\About;
use App\Models\News;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    $about = About::first();
    $latestNews = News::with('category')->latest()->take(3)->get();
    $prestasis = \App\Models\Prestasi::with('user')->latest()->take(6)->get();
    $faqs = \App\Models\BeasiswaFaq::where('is_active', true)->get();
    $members = \App\Models\User::whereNotNull('avatar')->inRandomOrder()->take(24)->get();

    return Inertia::render('app', [
        'about' => $about ? [
            'tagline' => $about->tagline,
            'vision' => $about->vision,
            'mission' => $about->mission,
            'profile' => $about->profile,
        ] : [
            'tagline' => 'Membangun masa depan pemimpin bangsa yang berintegritas dan inovatif.',
            'vision' => 'Menjadi komunitas penerima beasiswa yang unggul dan berkontribusi nyata bagi Indonesia.',
            'mission' => ['Mengembangkan potensi kepemimpinan.', 'Meningkatkan kepedulian sosial.', 'Menjadi agen perubahan.'],
            'profile' => 'GenBI adalah komunitas penerima beasiswa Bank Indonesia yang tersebar di seluruh perguruan tinggi di Indonesia.',
        ],
        'latestNews' => $latestNews,
        'prestasis' => $prestasis,
        'faqs' => $faqs,
        'members' => $members,
    ]);
})->name('home');

Route::get('profile', [AboutController::class, 'publicProfile'])->name('profile');
Route::get('berita', [NewsController::class, 'publicIndex'])->name('berita.index');
Route::get('berita/{news:slug}', [NewsController::class, 'publicShow'])->name('berita.show');

Route::get('prestasi', [PrestasiController::class, 'publicIndex'])->name('prestasi.index');

Route::get('beasiswa', [BeasiswaController::class, 'publicIndex'])->name('beasiswa.index');
Route::post('beasiswa/{beasiswa}/subscribe', [\App\Http\Controllers\BeasiswaSubscriberController::class, 'store'])->name('beasiswa.subscribe');

Route::get('divisi', [DivisionController::class, 'publicIndex'])->name('divisi.index');
Route::get('divisi/{division}', [DivisionController::class, 'publicShow'])->name('divisi.show');

Route::get('privacy-policy', fn() => Inertia::render('front/privacy-policy'))->name('privacy-policy');
Route::get('terms-of-use', fn() => Inertia::render('front/terms-of-use'))->name('terms-of-use');
Route::get('sitemap', fn() => Inertia::render('front/sitemap'))->name('sitemap');

Route::get('template-file', [\App\Http\Controllers\TemplateFileController::class, 'publicIndex'])->name('template-file.index');
Route::get('template-file/{templateFile}/download', [\App\Http\Controllers\TemplateFileController::class, 'download'])->name('template-file.download');


Route::middleware(['auth'])->group(function () {
    Route::middleware('role:admin_komisariat|admin_korkom|superadmin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('periode', [PeriodController::class, 'index'])->name('periods.index');
        Route::post('periode', [PeriodController::class, 'store'])->name('periods.store');
        Route::put('periode/{period}', [PeriodController::class, 'update'])->name('periods.update');
        Route::post('periode/{period}/activate', [PeriodController::class, 'activate'])->name('periods.activate');
        Route::delete('periode/{period}', [PeriodController::class, 'destroy'])->name('periods.destroy');

        Route::get('komisariat', [KomisariatController::class, 'index'])->name('komisariats.index');
        Route::post('komisariat', [KomisariatController::class, 'store'])->name('komisariats.store');
        Route::put('komisariat/{komisariat}', [KomisariatController::class, 'update'])->name('komisariats.update');
        Route::delete('komisariat/{komisariat}', [KomisariatController::class, 'destroy'])->name('komisariats.destroy');

        Route::get('kategori-poin', [PointCategoryController::class, 'index'])->name('point-categories.index');
        Route::post('kategori-poin', [PointCategoryController::class, 'store'])->name('point-categories.store');
        Route::put('kategori-poin/{pointCategory}', [PointCategoryController::class, 'update'])->name('point-categories.update');
        Route::delete('kategori-poin/{pointCategory}', [PointCategoryController::class, 'destroy'])->name('point-categories.destroy');

        Route::get('tarif-poin', [PointRateController::class, 'index'])->name('point-rates.index');
        Route::post('tarif-poin', [PointRateController::class, 'store'])->name('point-rates.store');
        Route::put('tarif-poin/{pointRate}', [PointRateController::class, 'update'])->name('point-rates.update');
        Route::delete('tarif-poin/{pointRate}', [PointRateController::class, 'destroy'])->name('point-rates.destroy');

        Route::get('acara', [EventController::class, 'index'])->name('events.index');
        Route::get('acara/buat', [EventController::class, 'create'])->name('events.create');
        Route::post('acara', [EventController::class, 'store'])->name('events.store');
        Route::get('acara/{event}/edit', [EventController::class, 'edit'])->name('events.edit');
        Route::put('acara/{event}', [EventController::class, 'update'])->name('events.update');
        Route::post('acara/{event}/status', [EventController::class, 'status'])->name('events.status');
        Route::get('absensi', [AttendanceVerificationController::class, 'index'])->name('attendances.index');
        Route::get('absensi/{attendance}/foto', [AttendanceVerificationController::class, 'photo'])->name('attendances.photo');
        Route::patch('absensi/{attendance}/verifikasi', [AttendanceVerificationController::class, 'verify'])->name('attendances.verify');
        Route::patch('absensi/{attendance}/tolak', [AttendanceVerificationController::class, 'reject'])->name('attendances.reject');
        Route::patch('absensi/{attendance}/minta-revisi', [AttendanceVerificationController::class, 'requestRevision'])->name('attendances.request_revision');
        Route::get('pengajuan', [SubmissionVerificationController::class, 'index'])->name('submissions.index');
        Route::patch('pengajuan/{submission}/verifikasi', [SubmissionVerificationController::class, 'verify'])->name('submissions.verify');
        Route::patch('pengajuan/{submission}/tolak', [SubmissionVerificationController::class, 'reject'])->name('submissions.reject');
        Route::patch('pengajuan/{submission}/minta-revisi', [SubmissionVerificationController::class, 'requestRevision'])->name('submissions.request_revision');
        Route::get('rekap', [RecapController::class, 'index'])->name('recap.index');
        Route::get('rekap/ekspor', [RecapController::class, 'export'])->name('recap.export');
    });

    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('acara', [App\Http\Controllers\EventController::class, 'index'])->name('events.index');
    Route::get('acara/{event:slug}', [App\Http\Controllers\EventController::class, 'show'])->name('events.show');
    Route::get('acara/{event:slug}/absensi', [AttendanceController::class, 'create'])->name('events.attendance.create');
    Route::post('acara/{event}/absensi', [AttendanceController::class, 'store'])
        ->middleware('throttle:5,1')
        ->name('events.attendances.store');

    Route::get('pengajuan', [PointSubmissionController::class, 'index'])->name('submissions.index');
    Route::get('pengajuan/buat', [PointSubmissionController::class, 'create'])->name('submissions.create');
    Route::post('pengajuan', [PointSubmissionController::class, 'store'])->name('submissions.store');
    Route::get('pengajuan/{submission}/revisi', [PointSubmissionController::class, 'edit'])->name('submissions.edit');
    Route::put('pengajuan/{submission}', [PointSubmissionController::class, 'update'])->name('submissions.update');
    Route::get('poin', [PointController::class, 'index'])->name('points.index');
    Route::get('poin/rekap', [PointController::class, 'recap'])->name('points.recap');

    Route::middleware('role:admin_komisariat|admin_korkom|superadmin|Superadmin|admin')->group(function () {
        Route::resource('dashboard/categories', CategoryController::class)->names('categories');
        Route::resource('dashboard/news', NewsController::class)->names('news');
        Route::resource('dashboard/abouts', AboutController::class)->names('abouts');

        Route::resource('dashboard/divisions', DivisionController::class)->names('divisions');
        Route::post('dashboard/divisions/{division}/assign-user', [DivisionController::class, 'assignUser'])->name('divisions.assign-user');
        Route::post('dashboard/divisions/{division}/remove-user', [DivisionController::class, 'removeUser'])->name('divisions.remove-user');

        Route::resource('dashboard/beasiswas', BeasiswaController::class)->names('beasiswas');
        Route::resource('dashboard/beasiswa-faqs', BeasiswaFaqController::class)->names('beasiswa-faqs');

        Route::resource('dashboard/prestasis', PrestasiController::class)->names('prestasis');

        Route::resource('dashboard/template-files', \App\Http\Controllers\TemplateFileController::class)->names('template-files');

        Route::resource('dashboard/users', UserController::class)->names('users');
    });

    Route::get('user/dashboard', function () {
        return Inertia::render('user/dashboard');
    })->middleware('role:anggota|user')->name('user.dashboard');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

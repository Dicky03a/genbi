<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\Beasiswa;
use App\Models\Division;
use App\Models\Event;
use App\Models\News;
use App\Models\Period;
use App\Models\PointSubmission;
use App\Models\User;
use App\Services\RecapService;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(private readonly RecapService $recapService) {}

    public function __invoke(): Response
    {
        $user = request()->user();

        if (! $user->hasAnyRole(['superadmin', 'admin_korkom', 'admin_komisariat', 'Superadmin', 'admin'])) {
            $period = Period::query()->active()->latest('starts_on')->first();
            $recap = $period ? $this->recapService->forUser($user, $period) : null;

            return Inertia::render('user/dashboard', [
                'recap' => $recap,
                'openEvents' => Event::query()
                    ->openForAttendance()
                    ->where(fn($query) => $query->whereNull('komisariat_id')->orWhere('komisariat_id', $user->komisariat_id))
                    ->with('komisariat')
                    ->latest('starts_at')
                    ->get(),
            ]);
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'users' => User::count(),
                'news' => News::count(),
                'published' => News::where('status', 'published')->count(),
                'divisions' => Division::count(),
                'beasiswas' => Beasiswa::count(),
                'pending_attendances' => Attendance::query()->pending()->count(),
                'pending_submissions' => PointSubmission::query()->pending()->count(),
            ],
            'recentNews' => News::with(['category', 'author'])
                ->latest()
                ->take(5)
                ->get()
                ->map(fn($news) => [
                    'id' => $news->id,
                    'title' => $news->title,
                    'slug' => $news->slug,
                    'status' => $news->status,
                    'category' => $news->category?->name,
                    'author' => $news->author?->name,
                    'published_at' => $news->published_at?->toDateString(),
                    'created_at' => $news->created_at->toDateString(),
                ]),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Services\AttendanceService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceVerificationController extends Controller
{
    public function __construct(private readonly AttendanceService $service) {}

    public function index(): Response
    {
        $user = request()->user();

        $pendingQuery = Attendance::query()->pending()->with(['user', 'event', 'eventRole'])->latest();
        $historyQuery = Attendance::query()
            ->whereIn('status', ['disetujui', 'ditolak'])
            ->with(['user', 'event', 'eventRole', 'verifier'])
            ->latest('verified_at');

        if ($user->hasRole('admin_komisariat')) {
            $pendingQuery->whereHas('event', fn ($q) => $q->where('komisariat_id', $user->komisariat_id));
            $historyQuery->whereHas('event', fn ($q) => $q->where('komisariat_id', $user->komisariat_id));
        }

        return Inertia::render('admin/attendances/verify', [
            'attendances' => $pendingQuery->get(),
            'history'     => $historyQuery->paginate(15)->withQueryString(),
        ]);
    }

    public function verify(Attendance $attendance): RedirectResponse
    {
        Gate::authorize('verify', $attendance);

        try {
            $this->service->verify($attendance, request()->user());
        } catch (DomainException $exception) {
            return back()->withErrors(['attendance' => $exception->getMessage()]);
        }

        return back()->with('success', 'Absensi berhasil disetujui.');
    }

    public function reject(Request $request, Attendance $attendance): RedirectResponse
    {
        Gate::authorize('reject', $attendance);
        $data = $request->validate(['reason' => ['required', 'string', 'max:1000']]);

        try {
            $this->service->reject($attendance, $request->user(), $data['reason']);
        } catch (DomainException $exception) {
            return back()->withErrors(['attendance' => $exception->getMessage()]);
        }

        return back()->with('success', 'Absensi berhasil ditolak.');
    }

    public function photo(Attendance $attendance): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        \Illuminate\Support\Facades\Gate::authorize('verify', $attendance);

        $disk = config('attendance.photo_disk', 'public');

        if (\Illuminate\Support\Facades\Storage::disk($disk)->exists($attendance->photo_path)) {
            return \Illuminate\Support\Facades\Storage::disk($disk)->response($attendance->photo_path);
        }

        if (\Illuminate\Support\Facades\Storage::disk('public')->exists($attendance->photo_path)) {
            return \Illuminate\Support\Facades\Storage::disk('public')->response($attendance->photo_path);
        }

        if (\Illuminate\Support\Facades\Storage::disk('local')->exists($attendance->photo_path)) {
            return \Illuminate\Support\Facades\Storage::disk('local')->response($attendance->photo_path);
        }

        abort(404, 'Foto absensi tidak ditemukan.');
    }
}

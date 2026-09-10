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
        $query = Attendance::query()->pending()->with(['user', 'event', 'eventRole'])->latest();
        if (request()->user()->hasRole('admin_komisariat')) {
            $query->whereHas('event', fn ($eventQuery) => $eventQuery->where('komisariat_id', request()->user()->komisariat_id));
        }

        return Inertia::render('admin/attendances/verify', [
            'attendances' => $query->get(),
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
}

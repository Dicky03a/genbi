<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PointSubmission;
use App\Services\PointSubmissionService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class SubmissionVerificationController extends Controller
{
    public function __construct(private readonly PointSubmissionService $service) {}

    public function index(): Response
    {
        $user = request()->user();

        $historyQuery = PointSubmission::query()
            ->whereIn('status', ['disetujui', 'ditolak'])
            ->with(['user', 'pointCategory', 'period', 'division', 'verifier'])
            ->latest('verified_at');

        if ($user->hasRole('admin_komisariat')) {
            $historyQuery->whereHas('user', fn ($q) => $q->where('komisariat_id', $user->komisariat_id));
        }

        return Inertia::render('admin/submissions/verify', [
            'submissions' => $this->service->getPending($user),
            'history'     => $historyQuery->paginate(15)->withQueryString(),
        ]);
    }

    public function verify(PointSubmission $submission): RedirectResponse
    {
        Gate::authorize('verify', $submission);

        try {
            $this->service->verify($submission, request()->user());
        } catch (DomainException $exception) {
            return back()->withErrors(['submission' => $exception->getMessage()]);
        }

        return back()->with('success', 'Pengajuan berhasil disetujui.');
    }

    public function reject(Request $request, PointSubmission $submission): RedirectResponse
    {
        Gate::authorize('reject', $submission);
        $data = $request->validate(['reason' => ['required', 'string', 'max:1000']]);

        try {
            $this->service->reject($submission, $request->user(), $data['reason']);
        } catch (DomainException $exception) {
            return back()->withErrors(['submission' => $exception->getMessage()]);
        }

        return back()->with('success', 'Pengajuan berhasil ditolak.');
    }

    public function requestRevision(Request $request, PointSubmission $submission): RedirectResponse
    {
        Gate::authorize('reject', $submission); // Reuse reject permission
        $data = $request->validate(['reason' => ['required', 'string', 'max:1000']]);

        try {
            $this->service->requestRevision($submission, $request->user(), $data['reason']);
        } catch (DomainException $exception) {
            return back()->withErrors(['submission' => $exception->getMessage()]);
        }

        return back()->with('success', 'Pengajuan dikembalikan ke user untuk revisi.');
    }
}

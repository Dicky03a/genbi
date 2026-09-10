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
        return Inertia::render('admin/submissions/verify', [
            'submissions' => $this->service->getPending(request()->user()),
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
}

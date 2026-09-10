<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePointSubmissionRequest;
use App\Http\Requests\UpdatePointSubmissionRequest;
use App\Models\PointCategory;
use App\Models\PointSubmission;
use App\Services\PointSubmissionService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PointSubmissionController extends Controller
{
    public function __construct(private readonly PointSubmissionService $service) {}

    public function index(): Response
    {
        return Inertia::render('submissions/index', [
            'submissions' => $this->service->getForUser(request()->user()),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('submissions/create', [
            'categories' => PointCategory::query()->active()->with(['rates' => fn ($query) => $query->active()->orderBy('name')])->orderBy('name')->get(),
        ]);
    }

    public function store(StorePointSubmissionRequest $request): RedirectResponse
    {
        try {
            $this->service->submit($request->user(), $request->validated(), $request->file('evidence'));
        } catch (DomainException $exception) {
            return back()->withInput()->withErrors(['submission' => $exception->getMessage()]);
        }

        return to_route('submissions.index')->with('success', 'Pengajuan poin berhasil dikirim.');
    }

    public function edit(PointSubmission $submission): Response
    {
        Gate::authorize('revise', $submission);

        return Inertia::render('submissions/edit', [
            'submission' => $submission->load('pointCategory'),
            'categories' => PointCategory::query()->active()->with(['rates' => fn ($query) => $query->active()->orderBy('name')])->orderBy('name')->get(),
        ]);
    }

    public function update(UpdatePointSubmissionRequest $request, PointSubmission $submission): RedirectResponse
    {
        Gate::authorize('revise', $submission);

        try {
            $this->service->revise($submission, $request->user(), $request->validated(), $request->file('evidence'));
        } catch (DomainException $exception) {
            return back()->withInput()->withErrors(['submission' => $exception->getMessage()]);
        }

        return to_route('submissions.index')->with('success', 'Revisi pengajuan berhasil dikirim.');
    }
}

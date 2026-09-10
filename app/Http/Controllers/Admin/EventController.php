<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreEventRequest;
use App\Http\Requests\Admin\UpdateEventRequest;
use App\Models\Event;
use App\Models\Komisariat;
use App\Services\EventService;
use DomainException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function __construct(private readonly EventService $service) {}

    public function index(): Response
    {
        return Inertia::render('admin/events/index', [
            'events' => $this->service->getAll(),
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Event::class);

        return Inertia::render('admin/events/form', [
            'komisariats' => Komisariat::query()->active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        try {
            $this->service->create($request->user(), $request->validated(), $request->validated('roles'));
        } catch (DomainException $exception) {
            return back()->withInput()->withErrors(['event' => $exception->getMessage()]);
        }

        return to_route('admin.events.index')->with('success', 'Acara berhasil dibuat.');
    }

    public function edit(Event $event): Response
    {
        Gate::authorize('update', $event);

        return Inertia::render('admin/events/form', [
            'event' => $event->load('roles'),
            'komisariats' => Komisariat::query()->active()->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(UpdateEventRequest $request, Event $event): RedirectResponse
    {
        Gate::authorize('update', $event);

        try {
            $this->service->update($event, $request->user(), $request->validated(), $request->validated('roles'));
        } catch (DomainException $exception) {
            return back()->withInput()->withErrors(['event' => $exception->getMessage()]);
        }

        return to_route('admin.events.index')->with('success', 'Acara berhasil diperbarui.');
    }

    public function status(Request $request, Event $event): RedirectResponse
    {
        Gate::authorize('transitionStatus', $event);
        $request->validate(['status' => ['required', 'string']]);

        try {
            $this->service->transitionStatus($event, $request->string('status')->toString());
        } catch (DomainException $exception) {
            return back()->withErrors(['status' => $exception->getMessage()]);
        }

        return back()->with('success', 'Status acara berhasil diperbarui.');
    }
}

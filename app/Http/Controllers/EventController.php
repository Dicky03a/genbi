<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('events/index', [
            'events' => Event::query()
                ->with(['komisariat', 'roles'])
                ->whereIn('status', ['dibuka', 'ditutup'])
                ->latest('starts_at')
                ->get(),
        ]);
    }

    public function show(Event $event): Response
    {
        return Inertia::render('events/show', [
            'event' => $event->load(['komisariat', 'roles']),
        ]);
    }
}

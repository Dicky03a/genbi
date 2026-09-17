<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(\Illuminate\Http\Request $request): Response
    {
        $user = $request->user();
        $events = Event::query()
            ->with(['komisariat', 'roles'])
            ->whereIn('status', ['dibuka', 'ditutup'])
            ->latest('starts_at')
            ->get();

        if ($user) {
            $userAttendances = \App\Models\Attendance::where('user_id', $user->id)
                ->whereIn('event_id', $events->pluck('id'))
                ->get()
                ->keyBy('event_id');

            $events->transform(function ($event) use ($userAttendances) {
                $att = $userAttendances->get($event->id);
                $event->my_attendance_status = $att ? $att->status : null;
                return $event;
            });
        }

        return Inertia::render('events/index', [
            'events' => $events,
        ]);
    }

    public function show(\Illuminate\Http\Request $request, Event $event): Response
    {
        $myAttendance = null;
        if ($user = $request->user()) {
            $myAttendance = \App\Models\Attendance::with('eventRole')
                ->where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();
        }

        return Inertia::render('events/show', [
            'event' => $event->load(['komisariat', 'roles']),
            'myAttendance' => $myAttendance ? [
                'id' => $myAttendance->id,
                'status' => $myAttendance->status,
                'event_role' => $myAttendance->eventRole ? [
                    'name' => $myAttendance->eventRole->name,
                    'points' => $myAttendance->eventRole->points,
                ] : null,
                'created_at' => $myAttendance->created_at->format('d M Y H:i'),
                'photo_path' => $myAttendance->photo_path,
            ] : null,
        ]);
    }
}

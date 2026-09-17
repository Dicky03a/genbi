<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Event;
use App\Services\AttendanceService;
use DomainException;
use Illuminate\Http\JsonResponse;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function __construct(private readonly AttendanceService $service) {}

    public function store(StoreAttendanceRequest $request, Event $event): JsonResponse
    {
        try {
            $existing = \App\Models\Attendance::where('event_id', $event->id)
                ->where('user_id', $request->user()->id)
                ->first();

            if ($existing && in_array($existing->status, ['ditolak', 'revisi'])) {
                $attendance = $this->service->revise(
                    $existing,
                    $request->user(),
                    $request->validated(),
                    $request->file('photo')
                );
            } else {
                $attendance = $this->service->submit(
                    $request->user(),
                    $event,
                    $request->validated(),
                    $request->file('photo'),
                );
            }
        } catch (DomainException $exception) {
            return response()->json([
                'status' => false,
                'message' => $exception->getMessage(),
                'errors' => ['attendance' => [$exception->getMessage()]],
            ], 422);
        }

        return response()->json([
            'status' => true,
            'message' => 'Absensi terkirim, menunggu verifikasi.',
            'data' => [
                'id' => $attendance->id,
                'status' => $attendance->status,
            ],
        ], 201);
    }

    public function create(\Illuminate\Http\Request $request, Event $event): Response
    {
        $myAttendance = \App\Models\Attendance::with('eventRole')
            ->where('event_id', $event->id)
            ->where('user_id', $request->user()->id)
            ->first();

        $pointRates = $event->point_type === 'point_rate' 
            ? $event->pointRates()->with('pointCategory')->get()
            : null;

        return Inertia::render('attendance/submit', [
            'event' => $event->load('roles'),
            'pointRates' => $pointRates,
            'myAttendance' => $myAttendance ? [
                'id' => $myAttendance->id,
                'status' => $myAttendance->status,
                'rejection_reason' => $myAttendance->rejection_reason,
                'event_role' => $myAttendance->eventRole ? [
                    'name' => $myAttendance->eventRole->name,
                    'points' => $myAttendance->eventRole->points,
                ] : null,
                'point_rate' => $myAttendance->pointRate ? [
                    'name' => $myAttendance->pointRate->name,
                    'points' => $myAttendance->pointRate->points,
                ] : null,
                'created_at' => $myAttendance->created_at->format('d M Y H:i'),
                'photo_path' => $myAttendance->photo_path,
            ] : null,
        ]);
    }
}

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
            $attendance = $this->service->submit(
                $request->user(),
                $event,
                $request->validated(),
                $request->file('photo'),
            );
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
                'distance_m' => (float) $attendance->distance_m,
                'status' => $attendance->status,
            ],
        ], 201);
    }

    public function create(Event $event): Response
    {
        return Inertia::render('attendance/submit', [
            'event' => $event->load('roles'),
        ]);
    }
}

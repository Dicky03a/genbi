<?php

namespace App\Http\Controllers;

use App\Models\Period;
use App\Models\PointTransaction;
use App\Services\RecapService;
use Inertia\Inertia;
use Inertia\Response;

class PointController extends Controller
{
      public function index(): Response
      {
            return Inertia::render('points/index', [
                  'transactions' => PointTransaction::query()
                        ->effective()
                        ->where('user_id', request()->user()->id)
                        ->with(['pointCategory', 'period'])
                        ->latest()
                        ->get(),
            ]);
      }

      public function recap(RecapService $recapService): Response
      {
            $period = Period::query()->active()->latest('starts_on')->first();
            $leaderboard = collect();
            
            if ($period) {
                  $leaderboard = $recapService->forPeriod($period);
            }

            return Inertia::render('points/recap', [
                  'period' => $period,
                  'leaderboard' => $leaderboard,
            ]);
      }
}

<?php

namespace App\Http\Controllers;

use App\Models\PointTransaction;
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
}

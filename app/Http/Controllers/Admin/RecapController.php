<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Division;
use App\Models\Komisariat;
use App\Models\Period;
use App\Services\RecapService;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RecapController extends Controller
{
      public function __construct(private readonly RecapService $service) {}

      public function index(): Response
      {
            $period = Period::query()->find(request('period_id')) ?? Period::query()->active()->latest('starts_on')->first();
            $komisariatId = request('komisariat_id');
            if (request()->user()->hasRole('admin_komisariat')) {
                  $komisariatId = request()->user()->komisariat_id;
            }
            $ranking = $period ? $this->service->forPeriod($period, $komisariatId, request('division_id')) : collect();

            return Inertia::render('admin/recap/index', [
                  'periods' => Period::query()->latest('starts_on')->get(),
                  'komisariats' => Komisariat::query()->active()->orderBy('name')->get(['id', 'name']),
                  'divisions' => Division::query()->orderBy('name')->get(['id', 'name']),
                  'selectedPeriod' => $period,
                  'ranking' => $ranking,
            ]);
      }

      public function export(): StreamedResponse
      {
            $period = Period::query()->findOrFail(request('period_id'));
            $komisariatId = request('komisariat_id');
            if (request()->user()->hasRole('admin_komisariat')) {
                  $komisariatId = request()->user()->komisariat_id;
            }
            $ranking = $this->service->forPeriod($period, $komisariatId, request('division_id'));
            $filename = 'rekap-poin-' . str()->slug($period->name) . '.csv';

            return response()->streamDownload(function () use ($ranking): void {
                  $handle = fopen('php://output', 'w');
                  fputcsv($handle, ['Peringkat', 'Nama', 'NIM', 'Komisariat', 'Divisi', 'Total Poin']);
                  foreach ($ranking as $row) {
                        fputcsv($handle, [
                              $row['rank'],
                              $row['user']->name,
                              $row['user']->nim,
                              $row['user']->komisariat?->name,
                              $row['user']->division?->name,
                              $row['total_points'],
                        ]);
                  }
                  fclose($handle);
            }, $filename, ['Content-Type' => 'text/csv']);
      }
}

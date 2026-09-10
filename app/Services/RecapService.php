<?php

namespace App\Services;

use App\Models\Period;
use App\Models\PointTransaction;
use App\Models\User;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class RecapService
{
      public function forUser(User $user, Period $period): array
      {
            $transactions = PointTransaction::query()
                  ->effective()
                  ->where('user_id', $user->id)
                  ->where('period_id', $period->id)
                  ->with('pointCategory')
                  ->latest()
                  ->get();

            $totalPoints = (int) $transactions->sum('points');

            return [
                  'period' => $period,
                  'total_points' => $totalPoints,
                  'by_category' => $this->byCategory($user, $period),
                  'transactions' => $transactions,
                  'progress' => $this->progress($user, $period, $totalPoints),
            ];
      }

      public function forPeriod(Period $period, ?int $komisariatId = null, ?int $divisionId = null): Collection
      {
            $query = User::query()
                  ->active()
                  ->with(['division', 'komisariat'])
                  ->select('users.*')
                  ->selectSub(
                        PointTransaction::query()
                              ->effective()
                              ->whereColumn('point_transactions.user_id', 'users.id')
                              ->where('point_transactions.period_id', $period->id)
                              ->selectRaw('COALESCE(SUM(point_transactions.points), 0)'),
                        'total_points',
                  );

            if ($komisariatId !== null) {
                  $query->where('komisariat_id', $komisariatId);
            }
            if ($divisionId !== null) {
                  $query->where('division_id', $divisionId);
            }

            $members = $query->orderByDesc('total_points')->orderBy('name')->get();
            $rank = 0;
            $previousPoints = null;

            return $members->map(function (User $member, int $index) use (&$rank, &$previousPoints): array {
                  $points = (int) ($member->total_points ?? 0);
                  if ($previousPoints !== $points) {
                        $rank = $index + 1;
                        $previousPoints = $points;
                  }

                  return [
                        'rank' => $rank,
                        'user' => $member,
                        'total_points' => $points,
                  ];
            });
      }

      public function progress(User $user, Period $period, ?int $totalPoints = null): array
      {
            $totalPoints ??= (int) PointTransaction::query()
                  ->effective()
                  ->where('user_id', $user->id)
                  ->where('period_id', $period->id)
                  ->sum('points');
            $target = (int) $period->target_points;

            return [
                  'total_points' => $totalPoints,
                  'target_points' => $target,
                  'percentage' => $target > 0 ? min(100, round(($totalPoints / $target) * 100, 2)) : 0,
                  'achieved' => $target > 0 && $totalPoints >= $target,
            ];
      }

      private function byCategory(User $user, Period $period): Collection
      {
            return PointTransaction::query()
                  ->effective()
                  ->where('user_id', $user->id)
                  ->where('period_id', $period->id)
                  ->select(['point_category_id', DB::raw('SUM(points) as points')])
                  ->with('pointCategory')
                  ->groupBy('point_category_id')
                  ->get()
                  ->map(fn (PointTransaction $transaction) => [
                        'category' => $transaction->pointCategory?->name,
                        'points' => (int) $transaction->points,
                  ]);
      }
}

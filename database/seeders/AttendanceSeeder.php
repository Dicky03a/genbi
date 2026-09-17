<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\EventRole;
use App\Models\Period;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
      public function run(): void
      {
            $user = User::query()->where('email', 'user@genbi.com')->firstOrFail();
            $period = Period::query()->where('name', 'Ganjil 2026-2027')->firstOrFail();

            $event = Event::updateOrCreate(
                  ['slug' => 'seminar-genbi-2026'],
                  [
                        'period_id' => $period->id,
                        'komisariat_id' => null,
                        'created_by' => $user->id,
                        'title' => 'Seminar GenBI 2026',
                        'description' => 'Kegiatan contoh untuk verifikasi absensi.',
                        'starts_at' => '2026-09-10 09:00:00',
                        'ends_at' => '2026-09-10 12:00:00',
                        'latitude' => -7.1500000,
                        'longitude' => 111.8800000,
                        'radius_m' => 100,
                        'max_gps_accuracy_m' => 50,
                        'status' => 'selesai',
                  ],
            );

            $role = EventRole::firstOrCreate(
                  ['event_id' => $event->id, 'name' => 'Peserta'],
                  ['points' => 5],
            );

            $attendance = Attendance::firstOrCreate(
                  ['event_id' => $event->id, 'user_id' => $user->id],
                  [
                        'event_role_id' => $role->id,
                        'captured_lat' => -7.1500000,
                        'captured_lng' => 111.8800000,
                        'gps_accuracy_m' => 10,
                        'distance_m' => 0,
                        'photo_path' => 'attendance/demo-seminar-genbi-2026.jpg',
                        'status' => 'menunggu',
                  ],
            );

            $attendance->verificationLogs()->firstOrCreate(
                  ['to_status' => 'menunggu'],
                  [
                        'from_status' => null,
                        'reason' => 'Absensi contoh dikirim untuk menunggu verifikasi admin.',
                  ],
            );
      }
}

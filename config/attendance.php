<?php

return [
    'max_gps_accuracy_m' => (float) env('ATTENDANCE_MAX_GPS_ACCURACY_M', 100),
    'location_tolerance_m' => (float) env('ATTENDANCE_LOCATION_TOLERANCE_M', 10),
    'photo_disk' => env('ATTENDANCE_PHOTO_DISK', 'public'),
    'photo_max_kb' => (int) env('ATTENDANCE_PHOTO_MAX_KB', 5120),
    'submission_max_revisions' => (int) env('ATTENDANCE_SUBMISSION_MAX_REVISIONS', 3),
];

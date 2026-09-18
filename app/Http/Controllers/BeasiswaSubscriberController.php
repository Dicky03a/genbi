<?php

namespace App\Http\Controllers;

use App\Models\Beasiswa;
use App\Models\BeasiswaSubscriber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class BeasiswaSubscriberController extends Controller
{
    public function store(Request $request, Beasiswa $beasiswa)
    {
        $request->validate([
            'phone_number' => 'required|string|min:9|max:15',
        ]);

        // Prevent duplicate subscription for the same not-notified Beasiswa
        $exists = BeasiswaSubscriber::where('beasiswa_id', $beasiswa->id)
            ->where('phone_number', $request->phone_number)
            ->where('is_notified', false)
            ->exists();

        if (!$exists) {
            BeasiswaSubscriber::create([
                'beasiswa_id' => $beasiswa->id,
                'phone_number' => $request->phone_number,
                'is_notified' => false,
            ]);
        }

        return Redirect::back()->with('success', 'Berhasil! Anda akan menerima notifikasi saat pendaftaran dibuka.');
    }
}

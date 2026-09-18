<?php

namespace App\Jobs;

use App\Models\Beasiswa;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NotifyBeasiswaOpened implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $beasiswa;

    /**
     * Create a new job instance.
     */
    public function __construct(Beasiswa $beasiswa)
    {
        $this->beasiswa = $beasiswa;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $subscribers = $this->beasiswa->subscribers()->where('is_notified', false)->get();

        foreach ($subscribers as $subscriber) {
            // Mocking a WhatsApp Notification
            Log::info("MOCK WHATSAPP API: Mengirim notifikasi pendaftaran dibuka ke {$subscriber->phone_number} untuk beasiswa {$this->beasiswa->title}.");

            $subscriber->update(['is_notified' => true]);
        }
    }
}

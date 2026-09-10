<?php

namespace App\Services;

use DomainException;

class VerificationStateService
{
    /**
     * Allowed status transitions for all verification flows.
     */
    private const ALLOWED = [
        'menunggu' => ['disetujui', 'ditolak'],
        'ditolak' => ['menunggu'],
        'disetujui' => [],
    ];

    public function assertCanTransition(?string $fromStatus, string $toStatus): void
    {
        $current = $fromStatus ?? 'menunggu';

        if (! isset(self::ALLOWED[$current])) {
            throw new DomainException('Transisi status tidak valid.');
        }

        if (! in_array($toStatus, self::ALLOWED[$current], true)) {
            throw new DomainException('Transisi status tidak valid.');
        }
    }
}

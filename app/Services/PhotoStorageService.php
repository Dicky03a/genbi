<?php

namespace App\Services;

use DomainException;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class PhotoStorageService
{
    public function store(UploadedFile $photo): string
    {
        $disk = config('attendance.photo_disk');
        $contents = file_get_contents($photo->getRealPath());

        if ($contents === false || @getimagesizefromstring($contents) === false) {
            throw new DomainException('Foto tidak valid.');
        }

        $processed = $this->resize($contents);
        $path = 'attendance/'.now()->format('Y/m').'/'.
              str()->uuid().'.jpg';

        Storage::disk($disk)->put($path, $processed);

        return $path;
    }

    public function delete(string $path): void
    {
        Storage::disk(config('attendance.photo_disk'))->delete($path);
    }

    private function resize(string $contents): string
    {
        if (! function_exists('imagecreatefromstring') || ! function_exists('imagejpeg')) {
            return $contents;
        }

        $source = @imagecreatefromstring($contents);
        if (! $source) {
            throw new DomainException('Foto tidak valid.');
        }

        $width = imagesx($source);
        $height = imagesy($source);
        $longestSide = max($width, $height);
        $scale = min(1, 1600 / $longestSide);
        $targetWidth = max(1, (int) round($width * $scale));
        $targetHeight = max(1, (int) round($height * $scale));
        $target = imagecreatetruecolor($targetWidth, $targetHeight);
        imagecopyresampled($target, $source, 0, 0, 0, 0, $targetWidth, $targetHeight, $width, $height);

        ob_start();
        imagejpeg($target, null, 85);
        $result = ob_get_clean();
        imagedestroy($source);
        imagedestroy($target);

        return $result ?: $contents;
    }
}

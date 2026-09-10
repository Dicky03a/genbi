# CLAUDE.md — Sistem Poin Keaktifan & Absensi GenBI UNUGIRI

Baca file ini sebelum mengerjakan task apa pun. Aturan di sini mengikat untuk seluruh kode di repo.

---

## 1. Stack

| Bagian | Teknologi |
|---|---|
| Backend | Laravel 12, PHP 8.2+ |
| Database | MySQL 8 |
| Frontend | React 19 + Inertia 2 (monolith, **bukan** SPA terpisah) |
| Styling | Tailwind 4 + shadcn/ui (Radix) |
| Auth & Akses | Laravel Breeze + `spatie/laravel-permission` |
| Build | Vite 6 |
| Test | Pest 3 |

**Ini aplikasi Inertia, bukan REST API.** Controller mengembalikan `Inertia::render()`, bukan `JsonResource`.
Satu-satunya pengecualian: endpoint submit absensi, yang dipanggil dari flow kamera/geolocation dan
mengembalikan JSON.

---

## 2. Arsitektur Layer

```
Controller  → terima request, panggil Service, kembalikan Inertia::render / redirect. TANPA logic bisnis.
Service     → SELURUH logic bisnis. Query Eloquent, kalkulasi, validasi aturan bisnis.
Model       → relasi, scope, cast, accessor. TANPA query di luar scope.
FormRequest → validasi input. Hanya rules(), messages(), authorize().
Policy      → otorisasi per baris data (siapa boleh menyentuh record yang mana).
Migration   → skema + index.
```

Urutan pengerjaan tiap modul, tanpa kecuali:

```
Migration → Model → Service → FormRequest → Policy → Controller → Route → Test → Halaman React
```

Jangan menulis Controller sebelum Service ada. Jangan menulis halaman React sebelum route-nya lolos test.

---

## 3. Invariant Domain — JANGAN DILANGGAR

Tujuh aturan berikut adalah inti kebenaran sistem. Kalau sebuah task tampak menuntut pelanggaran
salah satunya, berhenti dan tanyakan dulu, jangan cari jalan pintas.

**I1. `point_transactions` bersifat append-only.**
Tidak ada `->delete()` dan tidak ada `->update('points')` pada tabel ini, di mana pun.
Pembatalan dilakukan dengan mengisi `reversed_at`, `reversed_by`, `reversal_reason`.
Semua perhitungan rekap menyaring `whereNull('reversed_at')`.

**I2. Hanya `PointLedgerService` yang boleh menulis ke `point_transactions`.**
`AttendanceService` dan `PointSubmissionService` memanggilnya, tidak menulis sendiri.
Kalau ada `PointTransaction::create()` di luar `PointLedgerService`, itu bug.

**I3. Poin di ledger adalah snapshot final.**
Nilai diambil dari `event_roles.points` atau `point_submissions.points_requested` **pada saat verifikasi
disetujui**, lalu dibekukan. Perubahan tarif di kemudian hari tidak boleh mengubah rekap yang sudah jadi.
Jangan pernah menghitung ulang rekap dengan JOIN ke `point_rates`.

**I4. Jarak absensi dihitung di server.**
Nilai `distance_m` selalu dihitung ulang lewat `GeoService::haversine()` dari `captured_lat`/`captured_lng`
milik request dan `latitude`/`longitude` milik event. Nilai jarak apa pun yang dikirim client diabaikan
sepenuhnya, bahkan tidak divalidasi.

**I5. Periode ditentukan dari tanggal aktivitas, bukan tanggal persetujuan.**
Absensi mewarisi `period_id` dari event. Pengajuan mengunci `period_id` saat disubmit.
Verifikasi yang telat sampai lewat pergantian semester tidak boleh memindahkan poin.

**I6. Batasan komisariat ditegakkan di Policy, bukan di UI.**
Menyembunyikan tombol bukan otorisasi. Setiap aksi admin komisariat harus melewati Policy yang
membandingkan `komisariat_id` aktor dengan `komisariat_id` record.

**I7. Setiap perubahan status verifikasi wajib menulis `verification_logs`.**
Berlaku untuk absensi maupun pengajuan, untuk semua transisi termasuk revisi.
Ini yang membuat update-in-place pada pengajuan tetap dapat diaudit.

---

## 4. Konvensi Penamaan

- **Tabel & kolom:** bahasa Inggris, snake_case, jamak untuk tabel.
  Pengecualian yang disepakati: `komisariats` (tidak ada padanan Inggris yang pas, mengikuti preseden `beasiswas`).
- **Nilai enum status:** bahasa Indonesia, sesuai dokumen desain —
  `menunggu`, `disetujui`, `ditolak` (verifikasi); `draft`, `dibuka`, `ditutup`, `selesai` (event);
  `absensi`, `pengajuan`, `manual` (sumber ledger).
- **Teks yang dilihat pengguna:** bahasa Indonesia. Nama variabel dan komentar kode: bahasa Inggris,
  kecuali istilah domain yang tidak punya padanan (komisariat, korkom).
- **Route name:** dot notation, `events.attendances.store`, `admin.submissions.verify`.
- **Halaman React:** `resources/js/pages/<domain>/<Nama>.tsx`, PascalCase.

`point_categories` berbeda dari `categories`. `categories` milik modul berita, jangan digabung.

---

## 5. Aturan Kode

- Operasi yang menyentuh lebih dari satu tabel dibungkus `DB::transaction()`.
- Aturan bisnis yang gagal → lempar `DomainException` dari Service, tangkap di Controller,
  kembalikan `back()->withErrors()`. Jangan `abort()` dari dalam Service.
- Semua kolom yang sering di-`WHERE` atau di-`JOIN` wajib punya index.
- File upload lewat Storage disk dari `config('attendance.*')`, jangan hardcode path.
- Jangan pakai `enum()` untuk kolom baru yang daftarnya mungkin bertambah; pakai `string` + index.
  Kolom enum yang sudah ada dipertahankan apa adanya.
- Jangan tambah dependency baru tanpa persetujuan eksplisit.

---

## 6. Definition of Done per Task

Sebuah task baru selesai jika semuanya terpenuhi:

1. `php artisan test` hijau.
2. `./vendor/bin/pint --dirty` sudah dijalankan.
3. `npm run lint` dan `npm run format` bersih untuk file frontend yang disentuh.
4. Ada minimal satu test untuk happy path dan satu untuk kondisi gagal yang paling mungkin terjadi.
5. Tidak ada pelanggaran invariant di Bagian 3.
6. Migration baru bisa `migrate:fresh` dari nol tanpa error.

---

## 7. Yang Tidak Boleh Dilakukan Tanpa Bertanya

- Mengubah skema tabel yang sudah ada isinya.
- Mengubah nilai enum status.
- Menghapus atau mengubah baris `point_transactions`.
- Menambah package Composer atau npm.
- Mengubah `CLAUDE.md` ini.
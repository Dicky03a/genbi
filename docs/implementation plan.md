# Rencana Implementasi — Sistem Poin Keaktifan & Absensi GenBI UNUGIRI

Dokumen ini memecah sistem menjadi 8 sprint dan 61 task yang bisa dikerjakan berurutan.
Setiap task punya ID tetap (`T3.4`) yang dipakai sebagai rujukan saat menulis prompt untuk Claude Code.

Baca `CLAUDE.md` di root repo untuk aturan arsitektur dan invariant domain.

---

## Ringkasan Sprint

| Sprint | Fokus | Task | Estimasi |
|---|---|---|---|
| 0 | Perbaikan & fondasi skema | 7 | ~8 jam |
| 1 | Master data (periode, kategori, tarif, komisariat) | 9 | ~16 jam |
| 2 | Ledger poin — inti sistem | 6 | ~12 jam |
| 3 | Acara & peran acara | 8 | ~16 jam |
| 4 | Absensi | 12 | ~28 jam |
| 5 | Pengajuan poin | 8 | ~16 jam |
| 6 | Rekap & dashboard | 7 | ~14 jam |
| 7 | Hardening & serah terima | 4 | ~10 jam |
| | **Total** | **61** | **~120 jam** |

Sprint 2 sengaja diletakkan sebelum Sprint 4 dan 5. Absensi dan pengajuan sama-sama bermuara ke ledger.
Kalau ledger dibangun belakangan, logika snapshot akan tertulis dua kali dan pasti berbeda.

---

## Sprint 0 — Perbaikan & Fondasi

Sprint ini membereskan utang teknis yang sudah ada sebelum menambah apa pun.

| ID | Label | Task | File | Est |
|---|---|---|---|---|
| T0.1 | [DB] | Perbaiki `run()` → `up()` di 3 migration lama | `2026_06_01_155219_*`, `2026_06_01_155225_*`, `2026_06_01_161355_*` | 15 mnt |
| T0.2 | [DB] | Jalankan repair migration idempotent | `2026_09_02_090000_repair_*` | 30 mnt |
| T0.3 | [DB] | Jalankan 11 migration modul poin, verifikasi `migrate:fresh` | `database/migrations/2026_09_02_1*` | 1 jam |
| T0.4 | [BE] | `config/attendance.php` + entri `.env.example` | `config/attendance.php` | 30 mnt |
| T0.5 | [BE] | Update model `User`: relasi komisariat & division, trait `HasRoles`, scope `active()` | `app/Models/User.php` | 1 jam |
| T0.6 | [DB] | `RoleSeeder` + jalankan, verifikasi 4 role dan permission terbentuk | `database/seeders/RoleSeeder.php` | 1 jam |
| T0.7 | [DB] | `MasterDataSeeder`: 1 periode aktif, 3 komisariat, 5 kategori poin, 12 tarif, 1 superadmin | `database/seeders/MasterDataSeeder.php` | 2 jam |

**Gerbang keluar:** `php artisan migrate:fresh --seed` berjalan bersih dari database kosong,
dan `User::first()->hasRole('superadmin')` bernilai true.

---

## Sprint 1 — Master Data

Empat entitas CRUD yang jadi rujukan seluruh sistem. Polanya seragam, jadi kerjakan `Period` dulu
sampai tuntas sebagai cetakan, sisanya tinggal mengikuti.

| ID | Label | Task | File | Est |
|---|---|---|---|---|
| T1.1 | [BE] | Model `Period`, `Komisariat`, `PointCategory`, `PointRate` + relasi + scope + cast | `app/Models/*.php` | 2 jam |
| T1.2 | [BE] | `PeriodService` — CRUD + aturan: periode tidak boleh tumpang tindih tanggal | `app/Services/PeriodService.php` | 2 jam |
| T1.3 | [BE] | `PeriodService::activate()` — menonaktifkan periode lain dalam satu transaksi | idem | 1 jam |
| T1.4 | [BE] | `KomisariatService`, `PointCategoryService`, `PointRateService` | `app/Services/*.php` | 3 jam |
| T1.5 | [BE] | Aturan hapus: master data yang sudah dirujuk transaksi tidak boleh dihapus, hanya dinonaktifkan | semua service di atas | 1 jam |
| T1.6 | [BE] | FormRequest untuk keempat entitas (store + update) | `app/Http/Requests/Admin/*` | 2 jam |
| T1.7 | [BE] | Controller admin keempat entitas + route resource di `routes/web.php` | `app/Http/Controllers/Admin/*` | 2 jam |
| T1.8 | [FE] | Halaman admin: index + form untuk keempat entitas | `resources/js/pages/admin/master/*` | 3 jam |
| T1.9 | [TEST] | Feature test: overlap periode ditolak, hapus master terpakai ditolak | `tests/Feature/Admin/*` | 2 jam |

**Gerbang keluar:** admin bisa membuat periode "Ganjil 2025-2026", kategori, dan tarif lewat UI,
dan sistem menolak periode kedua yang tanggalnya bertabrakan.

---

## Sprint 2 — Ledger Poin

Sprint terpenting. Kalau ini benar, dua sprint berikutnya jadi mudah.

| ID | Label | Task | File | Est |
|---|---|---|---|---|
| T2.1 | [BE] | Model `PointTransaction` + relasi polymorphic ke sumber + scope `effective()` (belum di-reverse) | `app/Models/PointTransaction.php` | 1 jam |
| T2.2 | [BE] | `PeriodResolver::forDate(Carbon $date): Period` — lempar `DomainException` bila tidak ada periode yang mencakup | `app/Services/PeriodResolver.php` | 1 jam |
| T2.3 | [BE] | `PointLedgerService::record()` — idempotent, aman dipanggil dua kali untuk sumber yang sama | `app/Services/PointLedgerService.php` | 3 jam |
| T2.4 | [BE] | `PointLedgerService::reverse()` — isi `reversed_at`, tolak reverse ganda | idem | 1 jam |
| T2.5 | [BE] | `PointLedgerService::adjust()` — koreksi manual, boleh negatif, wajib ada alasan | idem | 1 jam |
| T2.6 | [TEST] | Unit test `PointLedgerService`: idempotensi, reverse ganda ditolak, snapshot tidak berubah saat tarif diubah | `tests/Unit/PointLedgerServiceTest.php` | 3 jam |

**Detail T2.3.** Signature yang diharapkan:

```php
public function record(
    User $user,
    PointCategory $category,
    Period $period,
    string $source,          // 'absensi' | 'pengajuan' | 'manual'
    ?int $sourceId,
    int $points,
    ?User $actor = null,
    ?string $note = null,
): PointTransaction
```

Idempotensi ditegakkan lewat `unique(source, source_id)` di database plus `firstOrCreate` di dalam
`DB::transaction()`. Kalau admin menekan tombol setujui dua kali, transaksi kedua mengembalikan baris
yang sama, bukan melempar error dan bukan membuat baris baru.

**Gerbang keluar:** test T2.6 hijau semua, termasuk kasus tarif diubah setelah transaksi tercatat.

---

## Sprint 3 — Acara & Peran Acara

| ID | Label | Task | File | Est |
|---|---|---|---|---|
| T3.1 | [BE] | Model `Event`, `EventRole` + relasi + scope `openForAttendance()` | `app/Models/*.php` | 1 jam |
| T3.2 | [BE] | `EventService::create()` — buat event + peran sekaligus dalam satu transaksi | `app/Services/EventService.php` | 2 jam |
| T3.3 | [BE] | `EventService::transitionStatus()` — hanya izinkan draft→dibuka→ditutup→selesai, tolak lompatan | idem | 2 jam |
| T3.4 | [BE] | Resolusi `period_id` otomatis dari `starts_at` lewat `PeriodResolver` | idem | 1 jam |
| T3.5 | [BE] | `EventPolicy` — admin komisariat hanya boleh mengelola event komisariatnya | `app/Policies/EventPolicy.php` | 2 jam |
| T3.6 | [BE] | FormRequest + Controller admin + route | `app/Http/{Requests,Controllers}/Admin/Event*` | 2 jam |
| T3.7 | [FE] | Form acara dengan pemilih titik lokasi (peta) dan pratinjau radius | `resources/js/pages/admin/events/Form.tsx` | 4 jam |
| T3.8 | [TEST] | Feature test: transisi status ilegal ditolak, admin lintas komisariat ditolak 403 | `tests/Feature/Admin/EventTest.php` | 2 jam |

**Catatan T3.7.** Butuh library peta. Leaflet + OpenStreetMap cukup dan tidak butuh API key berbayar.
Ini penambahan dependency, jadi konfirmasi dulu sebelum `npm install`.

**Gerbang keluar:** admin bisa membuat acara lengkap dengan titik lokasi, radius, jendela absen,
dan tiga peran dengan poin berbeda.

---

## Sprint 4 — Absensi

Sprint terbesar. Pipeline validasinya berlapis dan setiap lapis harus punya pesan error sendiri.

| ID | Label | Task | File | Est |
|---|---|---|---|---|
| T4.1 | [BE] | `GeoService::haversine()` — jarak dua koordinat dalam meter | `app/Services/GeoService.php` | 1 jam |
| T4.2 | [TEST] | Unit test `GeoService` dengan koordinat referensi yang jaraknya sudah diketahui | `tests/Unit/GeoServiceTest.php` | 1 jam |
| T4.3 | [BE] | Model `Attendance` + relasi + scope `pending()` | `app/Models/Attendance.php` | 1 jam |
| T4.4 | [BE] | `PhotoStorageService` — simpan, resize sisi terpanjang ke 1600px, buang EXIF | `app/Services/PhotoStorageService.php` | 2 jam |
| T4.5 | [BE] | `AttendanceService::submit()` — pipeline 7 validasi berurutan | `app/Services/AttendanceService.php` | 4 jam |
| T4.6 | [BE] | `AttendanceService::verify()` dan `reject()` — panggil ledger, tulis `verification_logs` | idem | 2 jam |
| T4.7 | [BE] | `StoreAttendanceRequest` + `AttendancePolicy` | `app/Http/Requests/StoreAttendanceRequest.php` | 2 jam |
| T4.8 | [BE] | `AttendanceController::store()` — respons JSON, rate limit 5 percobaan per menit per user | `app/Http/Controllers/AttendanceController.php` | 2 jam |
| T4.9 | [BE] | Controller admin verifikasi + route | `app/Http/Controllers/Admin/AttendanceController.php` | 2 jam |
| T4.10 | [FE] | Halaman absensi anggota: minta izin, ambil foto kamera, tangkap GPS, kirim, tangani 7 jenis error | `resources/js/pages/attendance/Submit.tsx` | 6 jam |
| T4.11 | [FE] | Halaman verifikasi admin: grid foto + peta titik absen vs titik acara, aksi setujui/tolak | `resources/js/pages/admin/attendances/Verify.tsx` | 4 jam |
| T4.12 | [TEST] | Feature test: 7 skenario penolakan + happy path + absen ganda ditolak | `tests/Feature/AttendanceTest.php` | 3 jam |

**Detail T4.5 — urutan validasi.** Kerjakan persis urutan ini, karena setiap langkah mengandalkan
langkah sebelumnya dan pesan errornya harus spesifik:

```
1. Event berstatus 'dibuka'                     → "Absensi acara ini belum dibuka."
2. now() ada di antara opens_at dan closes_at    → "Absensi sudah ditutup." / "Absensi belum dibuka."
3. Komisariat user cocok (bila event dibatasi)   → "Acara ini khusus untuk komisariat lain."
4. Foto ada, mime & ukuran valid                 → "Foto tidak valid."
5. gps_accuracy_m <= ambang efektif              → "Sinyal GPS kurang akurat, coba di area terbuka."
6. haversine <= radius_m + toleransi             → "Anda berada di luar lokasi acara." (sertakan jarak)
7. Belum pernah absen di event ini               → "Anda sudah melakukan absensi untuk acara ini."
```

Ambang efektif pada langkah 5 adalah `$event->max_gps_accuracy_m ?? config('attendance.max_gps_accuracy_m')`.
Langkah 7 tetap dijaga `unique(event_id, user_id)` di database; tangkap `QueryException` sebagai jaring
pengaman untuk kasus dua request masuk bersamaan.

**Catatan realistis untuk T4.10.** Atribut `capture="environment"` pada input file hanya bersifat saran.
Sebagian perangkat tetap membuka galeri. Verifikasi manual admin adalah pengaman sesungguhnya, jadi
jangan menjanjikan ke pengguna bahwa foto dijamin dari kamera langsung.

**Gerbang keluar:** anggota bisa absen dari HP dan tertolak dengan pesan yang tepat untuk masing-masing
dari 7 kondisi gagal; absensi yang disetujui muncul sebagai satu baris di `point_transactions`.

---

## Sprint 5 — Pengajuan Poin

| ID | Label | Task | File | Est |
|---|---|---|---|---|
| T5.1 | [BE] | Model `PointSubmission` + relasi + scope | `app/Models/PointSubmission.php` | 1 jam |
| T5.2 | [BE] | `PointSubmissionService::submit()` — autofill poin dari tarif, kunci `period_id`, snapshot `division_id` | `app/Services/PointSubmissionService.php` | 3 jam |
| T5.3 | [BE] | `::verify()` dan `::reject()` — alasan wajib saat menolak | idem | 2 jam |
| T5.4 | [BE] | `::revise()` — update in-place, status kembali `menunggu`, naikkan `revision_count`, tolak jika sudah melewati batas config | idem | 2 jam |
| T5.5 | [BE] | FormRequest + `PointSubmissionPolicy` (hanya pemilik yang boleh revisi) | `app/Http/{Requests,Policies}/*` | 2 jam |
| T5.6 | [BE] | Controller anggota + controller admin + route | `app/Http/Controllers/*` | 2 jam |
| T5.7 | [FE] | Halaman anggota: form ajukan, daftar pengajuan dengan status, form revisi berisi alasan penolakan | `resources/js/pages/submissions/*` | 4 jam |
| T5.8 | [TEST] | Feature test: tolak tanpa alasan gagal, revisi orang lain 403, batas revisi ditegakkan | `tests/Feature/SubmissionTest.php` | 2 jam |

**Gerbang keluar:** siklus ajukan → tolak dengan alasan → revisi → setujui berjalan penuh,
dan `verification_logs` memuat empat baris untuk siklus tersebut.

---

## Sprint 6 — Rekap & Dashboard

| ID | Label | Task | File | Est |
|---|---|---|---|---|
| T6.1 | [BE] | `RecapService::forUser()` — total poin efektif per periode, rincian per kategori | `app/Services/RecapService.php` | 2 jam |
| T6.2 | [BE] | `RecapService::forPeriod()` — peringkat anggota, filter komisariat & divisi | idem | 3 jam |
| T6.3 | [BE] | `RecapService::progress()` — persentase terhadap `target_points`, status tercapai/belum | idem | 1 jam |
| T6.4 | [FE] | Dashboard anggota: progress bar, riwayat transaksi, acara yang sedang dibuka | `resources/js/pages/dashboard/Member.tsx` | 3 jam |
| T6.5 | [FE] | Dashboard admin: antrean verifikasi, statistik periode berjalan | `resources/js/pages/dashboard/Admin.tsx` | 3 jam |
| T6.6 | [BE] | Ekspor rekap ke XLSX per periode | `app/Services/RecapExportService.php` | 2 jam |
| T6.7 | [TEST] | Test: transaksi yang di-reverse tidak ikut terhitung di rekap | `tests/Feature/RecapTest.php` | 1 jam |

**Catatan T6.6.** Ekspor XLSX butuh `maatwebsite/excel` atau `openspout`. Penambahan dependency,
konfirmasi dulu. Alternatif tanpa package: ekspor CSV lewat `StreamedResponse`.

---

## Sprint 7 — Hardening & Serah Terima

| ID | Label | Task | File | Est |
|---|---|---|---|---|
| T7.1 | [BE] | Audit seluruh route: pastikan tiap aksi admin punya Policy, tidak ada yang hanya bergantung pada UI | `routes/web.php`, `app/Policies/*` | 3 jam |
| T7.2 | [BE] | Rate limiting: submit absensi, submit pengajuan, login | `bootstrap/app.php` | 1 jam |
| T7.3 | [BE] | Command `poin:audit-ledger` — deteksi absensi/pengajuan disetujui yang tidak punya transaksi, dan sebaliknya | `app/Console/Commands/AuditLedger.php` | 3 jam |
| T7.4 | [DEVOPS] | Checklist deploy: storage link, queue worker, backup DB, `.env` produksi | `docs/DEPLOYMENT.md` | 3 jam |

**Catatan T7.3.** Command ini bernilai jauh melebihi biayanya. Ketidakcocokan antara status verifikasi
dan isi ledger adalah kelas bug yang paling mahal ditemukan belakangan, karena baru terasa saat
rekap semester dipakai untuk keputusan nyata.

---

## Kontrak Route

Semua route ada di `routes/web.php`. Halaman mengembalikan Inertia; hanya `attendances.store`
yang mengembalikan JSON.

### Anggota

| Method | URI | Nama | Deskripsi |
|---|---|---|---|
| GET | `/dashboard` | `dashboard` | Progress poin periode berjalan |
| GET | `/acara` | `events.index` | Acara yang bisa diikuti |
| GET | `/acara/{event:slug}` | `events.show` | Detail + form absensi |
| POST | `/acara/{event}/absensi` | `events.attendances.store` | Submit absensi (**JSON**) |
| GET | `/pengajuan` | `submissions.index` | Daftar pengajuan sendiri |
| GET | `/pengajuan/buat` | `submissions.create` | Form pengajuan |
| POST | `/pengajuan` | `submissions.store` | Kirim pengajuan |
| GET | `/pengajuan/{submission}/revisi` | `submissions.edit` | Form revisi + alasan penolakan |
| PUT | `/pengajuan/{submission}` | `submissions.update` | Kirim revisi |
| GET | `/poin` | `points.index` | Riwayat transaksi poin |

### Admin (prefix `/admin`, middleware `role:admin_komisariat|admin_korkom|superadmin`)

| Method | URI | Nama | Deskripsi |
|---|---|---|---|
| — | `/periode`, `/kategori-poin`, `/tarif-poin`, `/komisariat` | `admin.*` | Resource master data |
| — | `/acara` | `admin.events.*` | Resource acara |
| POST | `/acara/{event}/status` | `admin.events.status` | Transisi status acara |
| GET | `/absensi` | `admin.attendances.index` | Antrean verifikasi absensi |
| PATCH | `/absensi/{attendance}/verifikasi` | `admin.attendances.verify` | Setujui |
| PATCH | `/absensi/{attendance}/tolak` | `admin.attendances.reject` | Tolak + alasan |
| GET | `/pengajuan` | `admin.submissions.index` | Antrean verifikasi pengajuan |
| PATCH | `/pengajuan/{submission}/verifikasi` | `admin.submissions.verify` | Setujui |
| PATCH | `/pengajuan/{submission}/tolak` | `admin.submissions.reject` | Tolak + alasan |
| GET | `/rekap` | `admin.recap.index` | Rekap per periode |
| GET | `/rekap/ekspor` | `admin.recap.export` | Unduh XLSX |
| POST | `/transaksi` | `admin.transactions.store` | Koreksi manual (`transaction.adjust`) |
| PATCH | `/transaksi/{transaction}/batal` | `admin.transactions.reverse` | Batalkan transaksi |

### Format respons `events.attendances.store`

Berhasil, HTTP 201:

```json
{ "status": true, "message": "Absensi terkirim, menunggu verifikasi.", "data": { "id": 12, "distance_m": 42, "status": "menunggu" } }
```

Gagal aturan bisnis, HTTP 422:

```json
{ "status": false, "message": "Anda berada di luar lokasi acara.", "errors": { "location": ["Jarak Anda 312 m, batas 150 m."] } }
```

---

## Struktur Folder Setelah Selesai

```
app/
├── Console/Commands/
│   └── AuditLedger.php
├── Http/
│   ├── Controllers/
│   │   ├── AttendanceController.php
│   │   ├── PointSubmissionController.php
│   │   ├── DashboardController.php
│   │   └── Admin/
│   │       ├── PeriodController.php
│   │       ├── KomisariatController.php
│   │       ├── PointCategoryController.php
│   │       ├── PointRateController.php
│   │       ├── EventController.php
│   │       ├── AttendanceVerificationController.php
│   │       ├── SubmissionVerificationController.php
│   │       ├── RecapController.php
│   │       └── PointTransactionController.php
│   └── Requests/
│       ├── StoreAttendanceRequest.php
│       ├── StorePointSubmissionRequest.php
│       └── Admin/…
├── Models/
│   ├── Komisariat.php  Period.php  PointCategory.php  PointRate.php
│   ├── Event.php  EventRole.php  Attendance.php
│   ├── PointSubmission.php  PointTransaction.php  VerificationLog.php
├── Policies/
│   ├── EventPolicy.php  AttendancePolicy.php  PointSubmissionPolicy.php
└── Services/
    ├── GeoService.php
    ├── PeriodResolver.php
    ├── PointLedgerService.php        ← satu-satunya penulis ledger
    ├── AttendanceService.php
    ├── PointSubmissionService.php
    ├── EventService.php
    ├── PhotoStorageService.php
    ├── RecapService.php
    └── RecapExportService.php

resources/js/pages/
├── dashboard/{Member,Admin}.tsx
├── attendance/Submit.tsx
├── submissions/{Index,Create,Edit}.tsx
└── admin/
    ├── master/…
    ├── events/…
    ├── attendances/Verify.tsx
    └── recap/Index.tsx

tests/
├── Unit/{GeoServiceTest,PointLedgerServiceTest,PeriodResolverTest}.php
└── Feature/{AttendanceTest,SubmissionTest,RecapTest}.php
```

---

## Titik Keputusan yang Masih Terbuka

Tiga hal ini belum diputuskan dan akan menghambat sprint terkait bila dibiarkan:

1. **Library peta untuk T3.7 dan T4.11.** Leaflet + OSM (gratis, tanpa kunci) atau Google Maps (berbayar,
   kualitas peta Indonesia lebih baik).
2. **Ekspor XLSX di T6.6.** Tambah package, atau cukup CSV.
3. **Notifikasi.** Belum ada di desain sama sekali. Apakah anggota perlu diberi tahu saat
   pengajuannya ditolak? Kalau ya, ini menambah satu tabel dan satu Job, kira-kira 8 jam,
   dan sebaiknya masuk sebagai Sprint 8 terpisah, bukan disisipkan.
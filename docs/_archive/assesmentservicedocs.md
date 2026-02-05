
/*
* ========================================================================
* ASSESSMENT TYPE SERVICE
* ========================================================================
* Manages assessment types (Jenis Penilaian) such as:
* - TUGAS (Tugas Harian)
* - UH (Ulangan Harian)
* - UTS (Ujian Tengah Semester)
* - UAS (Ujian Akhir Semester)
* - PRAKTIK (Penilaian Praktik)
* - PROYEK (Penilaian Proyek)
* ========================================================================
  */

/*
* ------------------------------------------------------------------------
* MOCKUP: GET ALL ASSESSMENT TYPES RESPONSE
* ------------------------------------------------------------------------
* GET /api/assessment-types
*
* Response:
* {
*   "data": [
*     {
*       "id": 1,
*       "code": "TUGAS",
*       "name": "Tugas Harian",
*       "defaultWeight": 20,
*       "isActive": true,
*       "createdAt": "2025-01-15T10:00:00.000Z",
*       "usageCount": 150  // jumlah nilai yang pakai tipe ini
*     },
*     {
*       "id": 2,
*       "code": "UH",
*       "name": "Ulangan Harian",
*       "defaultWeight": 25,
*       "isActive": true,
*       "createdAt": "2025-01-15T10:00:00.000Z",
*       "usageCount": 200
*     },
*     {
*       "id": 3,
*       "code": "UTS",
*       "name": "Ujian Tengah Semester",
*       "defaultWeight": 25,
*       "isActive": true,
*       "createdAt": "2025-01-15T10:00:00.000Z",
*       "usageCount": 100
*     },
*     {
*       "id": 4,
*       "code": "UAS",
*       "name": "Ujian Akhir Semester",
*       "defaultWeight": 30,
*       "isActive": true,
*       "createdAt": "2025-01-15T10:00:00.000Z",
*       "usageCount": 100
*     }
*   ],
*   "pagination": {
*     "total": 4,
*     "page": 1,
*     "limit": 10,
*     "totalPages": 1
*   }
* }
*
* LAYOUT SUGGESTION:
* ┌─────────────────────────────────────────────────────────────────────┐
* │  Jenis Penilaian                              [+ Tambah Jenis]      │
* │  Kelola jenis penilaian untuk input nilai siswa                     │
* ├─────────────────────────────────────────────────────────────────────┤
* │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐                 │
* │  │ Total   │  │ Aktif   │  │ Nonaktif│  │ Digunakan│  (Stat Cards)  │
* │  │   6     │  │   4     │  │   2     │  │   550    │                │
* │  └─────────┘  └─────────┘  └─────────┘  └─────────┘                 │
* ├─────────────────────────────────────────────────────────────────────┤
* │  Kode   │ Nama Penilaian         │ Bobot │ Status │ Digunakan│ Aksi │
* │  ──────┼────────────────────────┼───────┼────────┼──────────┼───── │
* │  TUGAS │ Tugas Harian           │  20%  │ ✓ Aktif│   150    │ [⋮]  │
* │  UH    │ Ulangan Harian         │  25%  │ ✓ Aktif│   200    │ [⋮]  │
* │  UTS   │ Ujian Tengah Semester  │  25%  │ ✓ Aktif│   100    │ [⋮]  │
* │  UAS   │ Ujian Akhir Semester   │  30%  │ ✓ Aktif│   100    │ [⋮]  │
* └─────────────────────────────────────────────────────────────────────┘
* ------------------------------------------------------------------------
*/

/*
* ------------------------------------------------------------------------
* MOCKUP: GET ASSESSMENT TYPE BY ID RESPONSE
* ------------------------------------------------------------------------
* GET /api/assessment-types/:id
*
* Response:
* {
*   "id": 1,
*   "code": "TUGAS",
*   "name": "Tugas Harian",
*   "defaultWeight": 20,
*   "isActive": true,
*   "createdAt": "2025-01-15T10:00:00.000Z",
*   "usageCount": 150
* }
* ------------------------------------------------------------------------
*/


/*
* ------------------------------------------------------------------------
* MOCKUP: CREATE ASSESSMENT TYPE
* ------------------------------------------------------------------------
* POST /api/assessment-types
*
* Request Body:
* {
*   "code": "PRAKTIK",
*   "name": "Penilaian Praktik",
*   "defaultWeight": 15
* }
*
* Response:
* {
*   "message": "Assessment type created successfully",
*   "data": {
*     "id": 5,
*     "code": "PRAKTIK",
*     "name": "Penilaian Praktik",
*     "defaultWeight": 15,
*     "isActive": true,
*     "createdAt": "2025-01-29T10:00:00.000Z"
*   }
* }
*
* MODAL FORM LAYOUT:
* ┌─────────────────────────────────────────────┐
* │  Tambah Jenis Penilaian              [✕]   │
* ├─────────────────────────────────────────────┤
* │                                             │
* │  Kode Penilaian *                           │
* │  ┌─────────────────────────────────────┐   │
* │  │ PRAKTIK                             │   │
* │  └─────────────────────────────────────┘   │
* │  Contoh: TUGAS, UH, UTS, UAS               │
* │                                             │
* │  Nama Penilaian *                           │
* │  ┌─────────────────────────────────────┐   │
* │  │ Penilaian Praktik                   │   │
* │  └─────────────────────────────────────┘   │
* │                                             │
* │  Bobot Default (%)                          │
* │  ┌─────────────────────────────────────┐   │
* │  │ 15                                  │   │
* │  └─────────────────────────────────────┘   │
* │  Opsional. Bisa diatur per kelas/mapel.    │
* │                                             │
* ├─────────────────────────────────────────────┤
* │                    [Batal]  [Simpan]        │
* └─────────────────────────────────────────────┘
* ------------------------------------------------------------------------
*/

/*
* ------------------------------------------------------------------------
* MOCKUP: UPDATE ASSESSMENT TYPE
* ------------------------------------------------------------------------
* PUT /api/assessment-types/:id
*
* Request Body:
* {
*   "code": "PRAKTIK",
*   "name": "Penilaian Praktikum",
*   "defaultWeight": 20
* }
*
* Response:
* {
*   "message": "Assessment type updated successfully",
*   "data": {
*     "id": 5,
*     "code": "PRAKTIK",
*     "name": "Penilaian Praktikum",
*     "defaultWeight": 20,
*     "isActive": true,
*     "createdAt": "2025-01-29T10:00:00.000Z"
*   }
* }
* ------------------------------------------------------------------------
*/


/*
* ------------------------------------------------------------------------
* MOCKUP: TOGGLE ASSESSMENT TYPE STATUS
* ------------------------------------------------------------------------
* PATCH /api/assessment-types/:id/toggle
*
* Response:
* {
*   "message": "Status berhasil diubah",
*   "data": {
*     "id": 5,
*     "code": "PRAKTIK",
*     "name": "Penilaian Praktikum",
*     "isActive": false,
*     ...
*   }
* }
*
* NOTE: Nonaktifkan jenis penilaian yang sudah tidak dipakai,
*       tapi masih perlu ditampilkan di riwayat nilai lama.
* ------------------------------------------------------------------------
*/



/*
* ------------------------------------------------------------------------
* MOCKUP: DELETE ASSESSMENT TYPE
* ------------------------------------------------------------------------
* DELETE /api/assessment-types/:id
*
* Response (Success):
* {
*   "message": "Jenis penilaian berhasil dihapus"
* }
*
* Response (Error - Has scores):
* {
*   "message": "Tidak dapat menghapus. Jenis penilaian ini digunakan oleh 150 nilai siswa. Nonaktifkan saja jika tidak ingin dipakai lagi."
* }
*
* NOTE: Hanya bisa dihapus jika belum ada nilai yang menggunakan.
*       Jika sudah digunakan, sarankan untuk menonaktifkan saja.
* ------------------------------------------------------------------------
*/


/*
* ------------------------------------------------------------------------
* MOCKUP: GET ASSESSMENT TYPES FOR DROPDOWN (LITE)
* ------------------------------------------------------------------------
* GET /api/assessment-types/lite
*
* Response:
* [
*   { "id": 1, "code": "TUGAS", "name": "Tugas Harian" },
*   { "id": 2, "code": "UH", "name": "Ulangan Harian" },
*   { "id": 3, "code": "UTS", "name": "Ujian Tengah Semester" },
*   { "id": 4, "code": "UAS", "name": "Ujian Akhir Semester" }
* ]
*
* USE CASE: Dropdown di form input nilai siswa
* ┌─────────────────────────────────────┐
* │ Jenis Penilaian *              [▼] │
* ├─────────────────────────────────────┤
* │ ○ Tugas Harian (TUGAS)             │
* │ ○ Ulangan Harian (UH)              │
* │ ○ Ujian Tengah Semester (UTS)      │
* │ ○ Ujian Akhir Semester (UAS)       │
* └─────────────────────────────────────┘
* ------------------------------------------------------------------------
*/


/*
* ------------------------------------------------------------------------
* SUMMARY STATS FOR DASHBOARD
* ------------------------------------------------------------------------
* GET /api/assessment-types/stats
*
* Response:
* {
*   "total": 6,
*   "active": 4,
*   "inactive": 2,
*   "totalScoresRecorded": 550
* }
* ------------------------------------------------------------------------
*/

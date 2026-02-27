RESEARCH REPORT

this file is provide the research report from users recently and the updated managed by iterations of methods

---

metode yang di gunakan merupakan metode agile, dalam pengembangan ini memberikan kemampuan untuk melakukan iterasi terhadap pengembangan aplikasi secara rotatif, hasil dari pengembangan agile sendiri bersifat tidak bergantung kepada mekanisme tersendiri.

metode pengembangan aplikasi adalah menggunakan agile namun secara spesifik tergolong pada jenis personal extreme programming, metode ini di pilih atas dasar sebagai kebutuhan dalam adaptifitas dan bertujuan memberikan hasil yang maksimal dengan memberikan test dan structured layout agar mudah di maintain dan di rawat dengan baik tanpa merusak banyak fungsi yang telah berjalan.

hasil agile development dengan version control atau git sebagai bukti adanya perubahan sebagai berikut :

**Ringkasan Proyek:**

- Total commit: **439**
- Periode pengembangan: **15 November 2025 - 25 Februari 2026** (± 3.5 bulan)
- Kontributor: **syauqi** (developer tunggal — Personal Extreme Programming)
- First commit SHA: `61714e4` | Latest commit SHA: `9ce922c`

| No  | Iterasi    | Periode             | Jumlah Commit | SHA Awal  | SHA Akhir | Fokus Pengembangan                                                                                                                                |
| --- | ---------- | ------------------- | :-----------: | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Iterasi 1  | 15 — 16 Nov 2025    |      51       | `61714e4` | `4bc80eb` | Inisialisasi proyek SvelteKit, pembuatan komponen navbar & sidebar, layout halaman utama, setup Express server, routing frontend, rombel sprint 1 |
| 2   | Iterasi 2  | 17 — 21 Nov 2025    |      64       | `97dd77d` | `0e16540` | Halaman data siswa, skeleton loader, fitur audit logs awal, perbaikan layout & styling, konfigurasi adapter Node.js                               |
| 3   | Iterasi 3  | 28 Nov — 8 Des 2025 |      19       | `442c441` | `2add81a` | Fitur dropdown sidebar, koneksi data siswa ke backend, penambahan ikon & route, setup concurrently.js                                             |
| 4   | Iterasi 4  | 10 — 17 Des 2025    |      89       | `ca677d4` | `a33b61a` | Sistem autentikasi (login), integrasi database Drizzle ORM + SQLite, environment variable, fitur audit logs lengkap, layout dashboard             |
| 5   | Iterasi 5  | 20 — 21 Des 2025    |       8       | `fe59d6e` | `e8b9530` | Fitur kalender dashboard, pengaturan username, perbaikan UI                                                                                       |
| 6   | Iterasi 6  | 1 — 12 Jan 2026     |      72       | `d89fdeb` | `030b905` | Restrukturisasi data JSON, layout detail siswa, form input siswa, upload Excel (multer + exceljs), migrasi pnpm, schema relasional                |
| 7   | Iterasi 7  | 13 — 18 Jan 2026    |      54       | `ffff8c2` | `9685b74` | Desain schema nilai & mata pelajaran, rate limiter middleware, JWT auth, fitur template Excel, formulir alamat siswa                              |
| 8   | Iterasi 8  | 19 — 27 Jan 2026    |      36       | `e02df2c` | `fc65667` | Manajemen rombel (CRUD), manajemen nilai, bulk upload siswa, services rombel & kelas, komponen modal                                              |
| 9   | Iterasi 9  | 28 — 31 Jan 2026    |      40       | `386e53d` | `730df0e` | Fitur guru & penugasan, manajemen ujian, fitur kelulusan siswa, profil sekolah dengan upload logo, halaman error                                  |
| 10  | Iterasi 10 | 1 — 5 Feb 2026      |      27       | `ee1c24f` | `19478b2` | Refactoring kode & layout, bundling Electron.js untuk desktop app, build executable Windows, dokumentasi                                          |
| 11  | Iterasi 11 | 7 — 14 Feb 2026     |      19       | `da9942d` | `397d1cd` | Perbaikan bug, redesain halaman rombel & mutasi, class diagram UML, integrasi API tahun ajaran & kurikulum, seed data                             |
| 12  | Iterasi 12 | 22 — 25 Feb 2026    |      12       | `5e6ffdd` | `9ce922c` | Manajemen aset sekolah, migrasi database, seedfile auth, refactoring struktur folder, perbaikan file handler                                      |

dalam tabel tersebut dapat di simpulkan bahwa pengembangan aplikasi SIAKAD Madrasah dilakukan melalui **12 iterasi** selama kurang lebih 3.5 bulan dengan total **439 commit**. Setiap iterasi memiliki fokus pengembangan yang berbeda, dimulai dari inisialisasi proyek dan frontend (Iterasi 1-2), pengembangan backend dan database (Iterasi 3-5), fitur manajemen data siswa dan nilai (Iterasi 6-8), fitur lanjutan seperti guru dan kelulusan (Iterasi 9), hingga bundling desktop dan maintenance (Iterasi 10-12). Pola ini menunjukkan penerapan metode Personal Extreme Programming (PXP) secara konsisten, dimana setiap iterasi menghasilkan increment yang dapat diuji dan digunakan.

kemudian penggunaan teknologi dan framework yang digunakan dalam pengembangan aplikasi ini antara lain: SvelteKit sebagai framework frontend, Express.js sebagai server backend, Drizzle ORM untuk database, SQLite sebagai database utama, dan Electron.js untuk pembuatan aplikasi desktop.

test 
pada tahap pengujian menggunakan whitebox testing yaitu melakukan pengujian terhadap fungsi spesifik yang tidak terlihat oleh pengguna akhir, seperti logika internal, struktur kode, dan alur eksekusi. Whitebox testing dilakukan untuk memastikan bahwa setiap bagian dari kode berfungsi sesuai dengan harapan dan tidak mengandung bug atau kesalahan logika dan memberikan pencegahan terhadap error yang mungkin terjadi dalam aplikasi sebelum productionizing phase pada agile extreme programming.

pengujian hanya dilakukan dan terealisasi untuk beberapa fungsi tertentu yang bersifat memory hit dan membuat penuh memory, dalam pengujian pada penelitian ini spesfik test di lakukan pada fungsi upload Excel dan proses pembuatan file template Excel, hal ini di lakukan karena memiliki bug yang terjadi saat pengguna mengunggah file Excel yang tidak sesuai format.

maka dalam pengujian ini dilakukan secara preventif agar tidak menjadi bug di productionizing namun dapat di maintain.
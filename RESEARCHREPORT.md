BAB 3 METODE PENELITIAN

this file is provide the research report from users recently and the updated managed by iterations of methods

---

## 3.1 Metode Pengembangan Perangkat Lunak

Metode pengembangan perangkat lunak yang digunakan dalam penelitian ini adalah metode Agile. Menurut pendekatan Agile, proses pengembangan sistem informasi dilakukan secara iteratif dan inkremental, yang memberikan fleksibilitas tinggi bagi pengembang untuk melakukan perbaikan, penambahan fitur, serta penyesuaian kebutuhan secara berkelanjutan pada setiap siklus pengembangan. Pendekatan ini memungkinkan proses rekayasa perangkat lunak (_software engineering_) bersifat adaptif, responsif terhadap perubahan kebutuhan pengguna, dan tidak terikat pada satu mekanisme pengembangan yang bersifat linier maupun kaku sebagaimana metode konvensional seperti _Waterfall_.

![Gambar 3.1 Diagram Alur Metode Agile](/imageresearch/XP.png)
_Gambar 3.1 Diagram Alur Metode Agile_

### 3.1.1 Personal Extreme Programming (PXP)

Secara spesifik, metode pengembangan yang diterapkan dalam penelitian ini tergolong dalam varian Personal Extreme Programming (PXP), yang merupakan adaptasi dari metodologi Extreme Programming (XP) untuk konteks pengembangan individu (_solo developer_). Metode PXP dipilih berdasarkan pertimbangan terhadap beberapa faktor utama. Pertama, pengembangan sistem dilaksanakan secara mandiri oleh satu orang pengembang (_solo developer_), sehingga metodologi berbasis tim seperti Scrum maupun Kanban yang mensyaratkan adanya peran _Product Owner_, _Scrum Master_, serta pelaksanaan _ceremony_ kolaboratif seperti _daily standup_, _sprint review_, dan _retrospective_ dinilai tidak sesuai dengan konteks pengembangan individu. Kedua, selama proses pengembangan berlangsung, pengembang seringkali menerima umpan balik secara langsung dan informal dari pengguna melalui media komunikasi seperti WhatsApp, yang memerlukan respons cepat berupa _hotfix_ maupun perbaikan minor tanpa harus menunggu siklus sprint formal. Ketiga, metode PXP memberikan fleksibilitas yang lebih tinggi dalam hal perencanaan dan eksekusi iterasi, di mana pengembang dapat menyesuaikan ruang lingkup dan durasi setiap iterasi secara dinamis sesuai dengan kebutuhan dan prioritas yang berkembang di lapangan. Karakteristik-karakteristik tersebut menjadikan PXP sebagai metode yang paling adaptif dan relevan untuk konteks pengembangan pada penelitian ini. Penerapan metode ini bertujuan untuk menghasilkan produk perangkat lunak yang optimal melalui serangkaian praktik inti, antara lain: penerapan pengujian secara berkelanjutan (_continuous testing_), perancangan struktur kode yang terorganisasi (_structured layout_), refaktorisasi kode secara berkala (_code refactoring_), serta perencanaan rilis yang terukur (_release planning_). Praktik-praktik tersebut diterapkan agar sistem yang dikembangkan memiliki tingkat pemeliharaan yang tinggi (_high maintainability_), mudah untuk diperbaiki dan dikembangkan lebih lanjut (_scalable_), serta tidak menimbulkan kerusakan atau regresi terhadap fungsionalitas yang telah berjalan dan teruji sebelumnya.

![Gambar 3.2 Alur Siklus Personal Extreme Programming (PXP)](/imageresearch/XP.png)
_Gambar 3.2 Alur Siklus Personal Extreme Programming (PXP)_

### 3.1.2 Tahapan Iterasi PXP

Dalam konteks Personal Extreme Programming, setiap siklus iterasi menghasilkan sebuah _working increment_ yang dapat langsung diuji dan dievaluasi. Pendekatan ini sejalan dengan prinsip dasar Agile Manifesto, yakni mengutamakan perangkat lunak yang berfungsi (_working software_) di atas dokumentasi yang komprehensif, serta merespons perubahan di atas mengikuti rencana yang telah ditetapkan. Setiap iterasi pada metode PXP meliputi tahapan perencanaan (_planning_), perancangan (_design_), pengkodean (_coding_), pengujian (_testing_), dan evaluasi (_review_), yang dilaksanakan secara berulang hingga seluruh kebutuhan fungsional dan non-fungsional sistem terpenuhi.

![Gambar 3.3 Tahapan Iterasi PXP (Planning, Design, Coding, Testing, Review)](/imageresearch/XP.png)
_Gambar 3.3 Tahapan Iterasi PXP (Planning, Design, Coding, Testing, Review)_

## 3.2 Dokumentasi Pengembangan dengan Version Control

Seluruh hasil dari penerapan Agile Development pada penelitian ini didokumentasikan secara sistematis melalui sistem _version control_ menggunakan Git. Penggunaan Git sebagai alat bantu manajemen versi memungkinkan penelusuran terhadap setiap perubahan kode sumber (_source code_) yang terjadi selama proses pengembangan, sekaligus berfungsi sebagai bukti empiris adanya perkembangan dan evolusi sistem pada setiap iterasi. Riwayat perubahan tersebut terekam dalam bentuk _commit history_ yang mencakup identifikasi unik (_SHA hash_), pesan perubahan (_commit message_), serta stempel waktu (_timestamp_) dari setiap modifikasi yang dilakukan, sebagaimana ditunjukkan pada tabel berikut:

**Ringkasan Proyek:**

- Total commit: **491**
- Periode pengembangan: **15 November 2025 - 25 Februari 2026** (± 3.5 bulan)
- Kontributor: **syauqi** (developer tunggal — Personal Extreme Programming)
- First commit SHA: `61714e4` | Latest commit SHA: `9ce922c`

### 3.2.1 Riwayat Iterasi Pengembangan

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

### 3.2.2 Analisis Distribusi Commit

Berdasarkan data yang disajikan pada tabel di atas, dapat disimpulkan bahwa proses pengembangan aplikasi SIAKAD Madrasah dilaksanakan melalui **12 iterasi** pengembangan dalam kurun waktu kurang lebih 3,5 bulan dengan akumulasi total sebanyak **491 commit** yang tercatat pada repositori Git. Setiap iterasi memiliki ruang lingkup (_scope_) dan fokus pengembangan yang berbeda secara bertahap dan progresif, dimulai dari tahap inisialisasi proyek serta pengembangan antarmuka pengguna (_user interface_) pada sisi _frontend_ (Iterasi 1–2), dilanjutkan dengan pembangunan arsitektur _backend_ dan integrasi sistem basis data (Iterasi 3–5), kemudian implementasi fitur-fitur inti manajemen data siswa dan penilaian akademik (Iterasi 6–8), pengembangan fitur-fitur lanjutan seperti penugasan guru dan proses kelulusan (Iterasi 9), hingga tahap akhir yang meliputi proses _bundling_ aplikasi ke dalam format _desktop application_ serta pemeliharaan dan stabilisasi sistem secara menyeluruh (Iterasi 10–12).

![Gambar 3.4 Grafik Distribusi Commit per Iterasi](/imageresearch/chart-grafik-iterasi.png)
_Gambar 3.4 Grafik Distribusi Commit per Iterasi_

```
Grafik Distribusi Commit per Iterasi
(setiap █ ≈ 2 commit)

Iterasi  1  |██████████████████████████                          | 51
Iterasi  2  |████████████████████████████████████                | 64
Iterasi  3  |██████████                                          | 19
Iterasi  4  |█████████████████████████████████████████████████   | 89
Iterasi  5  |████                                                |  8
Iterasi  6  |████████████████████████████████████████            | 72
Iterasi  7  |███████████████████████████████                     | 54
Iterasi  8  |██████████████████████                              | 36
Iterasi  9  |████████████████████████                            | 40
Iterasi 10  |██████████████████                                  | 27
Iterasi 11  |██████████                                          | 19
Iterasi 12  |██████                                              | 12
            +---+---+---+---+---+---+---+---+---+---+
            0  10  20  30  40  50  60  70  80  90 100
                         Jumlah Commit
```

Pola pengembangan yang bersifat iteratif dan inkremental tersebut menunjukkan penerapan metode Personal Extreme Programming (PXP) secara konsisten sepanjang siklus hidup pengembangan perangkat lunak (_Software Development Life Cycle / SDLC_). Pada setiap iterasi, pengembang menghasilkan _working increment_ yang bersifat fungsional, dapat diuji secara langsung, serta siap untuk dievaluasi dan divalidasi terhadap kebutuhan pengguna. Pendekatan ini memastikan bahwa setiap penambahan fitur maupun perbaikan dilakukan secara terukur, terdokumentasi, dan tidak menimbulkan dampak regresi (_regression_) terhadap modul-modul yang telah berfungsi dengan baik pada iterasi sebelumnya.

### 3.2.3 Alur Version Control

![Gambar 3.5 Diagram Alur Version Control dengan Git](https://i.redd.it/nm1w0gnf2zh11.png)
_Gambar 3.5 Diagram Alur Version Control dengan Git_

menambah git revert dan release bar di akhir diagram sequential, perlu di ingat

## 3.3 Metode Pengujian Sistem

Selanjutnya, pada tahap pengujian sistem, penelitian ini menerapkan metode _White-Box Testing_ sebagai pendekatan verifikasi terhadap kualitas internal perangkat lunak. _White-Box Testing_, yang juga dikenal sebagai _structural testing_ atau _glass-box testing_, merupakan metode pengujian yang dilakukan terhadap fungsi-fungsi spesifik pada level kode sumber (_source code level_) yang tidak terlihat secara langsung oleh pengguna akhir (_end-user_). Pengujian ini mencakup evaluasi terhadap logika internal program (_internal logic_), struktur percabangan kode (_branching structure_), alur eksekusi program (_execution flow_), serta penanganan kondisi batas (_boundary condition handling_). Penerapan metode _White-Box Testing_ bertujuan untuk memastikan bahwa setiap komponen dan modul kode berfungsi sesuai dengan spesifikasi kebutuhan fungsional yang telah ditetapkan, terbebas dari _bug_ maupun kesalahan logika (_logic error_), serta memberikan mekanisme pencegahan secara dini (_early defect detection_) terhadap potensi _error_ yang mungkin muncul sebelum sistem memasuki fase _productionizing_ dalam siklus Agile Extreme Programming.

![Gambar 3.6 Ilustrasi Metode White-Box Testing](<!-- TODO: ganti path gambar ilustrasi white-box testing -->)
_Gambar 3.6 Ilustrasi Metode White-Box Testing_

### 3.3.1 Cakupan Pengujian

Pengujian dilaksanakan secara terfokus dan terstruktur pada beberapa fungsi kritis tertentu yang bersifat _memory-intensive_ dan memiliki kompleksitas pemrosesan data yang tinggi, sehingga berpotensi menyebabkan terjadinya kebocoran memori (_memory leak_) maupun penurunan kinerja sistem (_performance degradation_). Secara spesifik, cakupan pengujian pada penelitian ini difokuskan pada dua fungsi utama, yaitu: (1) fungsi _upload_ dan _parsing_ data dari _file_ Excel, serta (2) proses pembuatan dan _rendering file template_ Excel secara dinamis. Pemilihan kedua fungsi tersebut sebagai objek pengujian didasarkan pada temuan empiris berupa _bug_ dan _unexpected behavior_ yang terjadi ketika pengguna mengunggah _file_ Excel dengan format, struktur kolom, atau tipe data yang tidak sesuai dengan ketentuan dan validasi yang telah ditetapkan oleh sistem.

![Gambar 3.7 Alur Pengujian Fungsi Upload dan Template Excel](<!-- TODO: ganti path gambar alur pengujian excel -->)
_Gambar 3.7 Alur Pengujian Fungsi Upload dan Template Excel_

### 3.3.2 Skenario dan Hasil Pengujian

Pengujian dilaksanakan menggunakan _framework_ Jest sebagai _test runner_ dan _assertion library_. Pendekatan _white-box testing_ diterapkan melalui teknik _mocking_ terhadap dependensi internal seperti koneksi _database_ (Drizzle ORM) dan _library_ ExcelJS, sehingga setiap _unit function_ dapat diuji secara terisolasi tanpa bergantung pada _state_ eksternal. Teknik ini memungkinkan pengujian terhadap logika internal fungsi, pemetaan _field_ (_field mapping_), serta alur percabangan kode (_branching logic_) secara langsung pada level _source code_.

Berikut adalah skenario pengujian _white-box_ yang dilaksanakan beserta hasil yang diperoleh:

**Tabel 3.2 Unit Test — Fungsi `createBulkStudentsFromExcel()`**

| No | Test Case | Fungsi yang Diuji | Aspek White-Box yang Diverifikasi | Status |
|---|---|---|---|---|
| 1 | Parsing Excel dan insert seluruh field data siswa | `createBulkStudentsFromExcel()` | Verifikasi bahwa seluruh 18 field siswa (termasuk `previousSchool`, `phoneNumber`, `childOrder`, `siblingsCount`, `nationality`, `livingWith`, `transportation`, `bpjs`, `idCardNumber`, `birthCertificateNumber`) ter-_mapping_ dengan benar dari kolom Excel ke parameter `insert()` database — bukan hanya 7 field dasar | Pass |
| 2 | Pemetaan field Ayah: `job` → `occupation`, `phone` → `phoneNumber` | `createBulkStudentsFromExcel()` | Verifikasi bahwa logika _field mapping_ internal mengonversi nama field Excel (`Ayah - Pekerjaan`, `Ayah - No. HP`) ke nama kolom database (`occupation`, `phoneNumber`) secara benar, termasuk `nik`, `birthPlace`, `birthYear`, `education`, `monthlyIncome`, `isAlive` | Pass |
| 3 | Pemetaan field Ibu: `job` → `occupation`, `phone` → `phoneNumber` | `createBulkStudentsFromExcel()` | Verifikasi logika _field mapping_ yang sama untuk data Ibu, memastikan tidak terjadi _regression_ pada _mapping_ yang identik dengan data Ayah | Pass |
| 4 | Insert data alamat dari kolom Excel | `createBulkStudentsFromExcel()` | Verifikasi bahwa field alamat (`street`, `houseNumber`, `rt`, `rw`, `village`, `subDistrict`, `postalCode`) ter-_insert_ ke tabel alamat dengan `studentId` yang benar dari hasil _returning_ insert siswa | Pass |

**Tabel 3.3 Unit Test — Fungsi `createStudentData()` dan `createStudentdataInputExcelBulkGenerator()`**

| No | Test Case | Fungsi yang Diuji | Aspek White-Box yang Diverifikasi | Status |
|---|---|---|---|---|
| 1 | Create student beserta data orang tua dalam satu transaksi | `createStudentData()` | Verifikasi bahwa fungsi mengeksekusi tepat 3 kali `insert()` dalam satu `transaction()` (siswa, ayah, ibu), dan `studentId` dari hasil insert pertama diteruskan ke insert kedua dan ketiga melalui _mock chain_ `returning().get()` | Pass |
| 2 | Generate template Excel dengan header dan styling yang benar | `createStudentdataInputExcelBulkGenerator()` | Verifikasi struktur internal _workbook_: keberadaan worksheet `Data Siswa Bulk Upload`, header kolom (`Nama Siswa`, `NISN`, `Alamat - Jalan`, `Ayah - Nama`, `Ibu - Nama`), serta properti styling (`font.bold`, `fill.type`) pada baris header | Pass |

**Tabel 3.4 Unit Test — Fungsi `registerRombel()`**

| No | Test Case | Fungsi yang Diuji | Aspek White-Box yang Diverifikasi | Status |
|---|---|---|---|---|
| 1 | Register rombel dengan data siswa lengkap | `registerRombel()` | Verifikasi bahwa fungsi memanggil `insert()` tepat 2 kali dalam `transaction()` (insert rombel + insert batch siswa), `rombelId` dari hasil `returning().all()` diteruskan ke setiap record siswa, dan `update()` dipanggil 1 kali untuk sinkronisasi `studentTable` | Pass |
| 2 | Register rombel tanpa data siswa (array kosong) | `registerRombel()` | Verifikasi alur percabangan: ketika `payload.siswa` berupa array kosong, fungsi hanya memanggil `insert()` tepat 1 kali (hanya insert rombel, tanpa insert siswa) | Pass |

**Tabel 3.5 Unit Test — Fungsi `generateBulkScoreTemplate()`**

| No | Test Case | Fungsi yang Diuji | Aspek White-Box yang Diverifikasi | Status |
|---|---|---|---|---|
| 1 | Generate template nilai dengan header mata pelajaran dari database | `generateBulkScoreTemplate()` | Verifikasi bahwa fungsi mengambil data mata pelajaran melalui `select().from()` (di-_mock_ dengan data `Matematika`, `IPA`), kemudian menyusun header worksheet `Bulk Scores` berupa `['NISN', 'Nama Siswa', 'Matematika', 'IPA']` secara dinamis berdasarkan data tersebut | Pass |

Seluruh pengujian dieksekusi melalui Jest pada _Command Line Interface_ (CLI) dengan perintah `npx jest` pada lingkungan pengembangan lokal. Dependensi eksternal (database dan _library_ ExcelJS) di-_mock_ menggunakan `jest.unstable_mockModule()` agar pengujian bersifat deterministik dan tidak bergantung pada koneksi database aktif.

### 3.3.3 Tujuan Pengujian

Dengan demikian, pengujian dalam penelitian ini dilaksanakan secara preventif (_preventive testing_) sebagai bagian integral dari praktik _quality assurance_ dalam metodologi Personal Extreme Programming, guna mencegah terjadinya _defect_ dan _bug_ pada fase _productionizing_, meminimalkan risiko kegagalan sistem pada lingkungan produksi (_production environment_), sekaligus memastikan bahwa keseluruhan basis kode (_codebase_) yang dihasilkan tetap memenuhi standar kualitas, dapat dipelihara dengan baik (_maintainable_), serta mudah dikembangkan lebih lanjut (_extensible_) dalam jangka panjang.

## 3.4 Perubahan dan Umpan Balik Pengguna

Dalam penerapan metode Agile, proses pengembangan perangkat lunak tidak bersifat statis melainkan selalu terbuka terhadap adanya revisi, perubahan, maupun umpan balik (_feedback_) dari pengguna. Hal ini merupakan bagian yang wajar dan bahkan diharapkan dalam siklus Agile, karena salah satu nilai inti dari Agile Manifesto adalah kolaborasi dengan pengguna serta kemampuan untuk merespons perubahan secara cepat. Pada penelitian ini, umpan balik yang diterima dari pengguna memiliki dampak yang cukup signifikan terhadap arah pengembangan perangkat lunak, karena setiap masukan dan keluhan yang ditemukan perlu segera ditindaklanjuti dan diintegrasikan ke dalam sistem pada iterasi berikutnya, agar aplikasi tetap sesuai dengan kebutuhan nyata pengguna di lapangan serta tetap memenuhi spesifikasi teknis yang telah ditetapkan sebelumnya.

Pengumpulan umpan balik pada penelitian ini dilakukan melalui metode wawancara tidak terstruktur (_unstructured interview_) dan observasi langsung (_direct observation_). Wawancara tidak terstruktur dilaksanakan secara informal melalui media komunikasi WhatsApp dengan pengguna aplikasi, yaitu tenaga administrasi sekolah yang menggunakan aplikasi SIAKAD Madrasah dalam kegiatan operasional sehari-hari. Metode ini dipilih karena memungkinkan pengguna untuk menyampaikan keluhan, kendala, maupun saran secara spontan dan natural tanpa terikat pada format kuesioner yang kaku, sehingga informasi yang diperoleh bersifat autentik dan mencerminkan pengalaman nyata pengguna di lapangan. Selain itu, observasi langsung dilakukan oleh pengembang dengan mengamati secara langsung bagaimana pengguna berinteraksi dengan aplikasi pada saat proses instalasi maupun penggunaan fitur-fitur tertentu, guna mengidentifikasi kendala-kendala yang mungkin tidak tersampaikan secara verbal oleh pengguna.

Selama proses pengembangan berlangsung, terdapat dua kategori utama umpan balik yang diterima dari pengguna, yaitu: (1) kesulitan dalam memahami dan menggunakan fitur tertentu pada aplikasi, serta (2) kendala pada proses instalasi dan penggunaan awal aplikasi. Kedua kategori umpan balik tersebut menjadi bahan evaluasi yang penting bagi pengembang untuk melakukan perbaikan pada iterasi selanjutnya.

### 3.4.1 Umpan Balik Fitur Upload Excel

Umpan balik pertama berkaitan dengan fitur _upload_ Excel pada halaman Data Siswa yang pada versi awal tidak dilengkapi dengan keterangan atau petunjuk penggunaan yang memadai. Tombol-tombol yang tersedia pada antarmuka tidak memiliki _tooltip_ maupun penjelasan tambahan mengenai fungsinya, sehingga pengguna awam, khususnya tenaga administrasi sekolah yang menjadi pengguna utama aplikasi ini, merasa kesulitan dalam memahami alur penggunaan fitur tersebut. Pengguna tidak mengetahui tombol mana yang harus ditekan terlebih dahulu, apa yang perlu diunduh, dan bagaimana cara mengunggah data siswa melalui _file_ Excel. Berdasarkan umpan balik tersebut, pengembang kemudian melakukan perbaikan pada sisi _frontend_ di halaman Data Siswa (`siswa/+page.svelte`) dengan menambahkan _tooltip_ pada tombol "Unduh Template" yang berisi keterangan tambahan berupa penjelasan singkat mengenai fungsi tombol, yaitu mengunduh _file_ template `.xlsx` kosong yang telah diformat sesuai struktur data sistem, untuk kemudian diisi dan diunggah kembali melalui tombol "Upload Excel". Dengan penambahan _tooltip_ tersebut, pengguna dapat memahami alur penggunaan fitur secara mandiri tanpa memerlukan panduan eksternal. Perubahan ini dilakukan sebagai bentuk penerapan prinsip _user-centered design_, di mana antarmuka aplikasi harus dirancang berdasarkan sudut pandang dan tingkat pemahaman pengguna akhir.

![Gambar 3.8 Perubahan Label Fitur Upload Excel (Sebelum dan Sesudah)](<!-- TODO: ganti path gambar perbandingan label sebelum sesudah -->)
_Gambar 3.8 Perubahan Label Fitur Upload Excel (Sebelum dan Sesudah)_

### 3.4.2 Umpan Balik Mekanisme Instalasi Aplikasi

Umpan balik kedua berkaitan dengan proses instalasi aplikasi pada versi rilis awal (versi 1.0). Pada versi tersebut, aplikasi dijalankan melalui sebuah _batch file_ (.bat) yang harus ditemukan dan dieksekusi secara manual oleh pengguna. Mekanisme ini menimbulkan kesulitan bagi pengguna awam di pihak sekolah, karena mereka tidak terbiasa mencari dan menjalankan _file_ dengan ekstensi .bat di dalam struktur folder komputer. Selain itu, tampilan _command prompt_ yang muncul saat menjalankan _batch file_ juga memberikan kesan yang kurang ramah dan membingungkan bagi pengguna non-teknis. Berdasarkan temuan tersebut, pengembang kemudian melakukan perubahan pada mekanisme distribusi aplikasi dengan beralih menggunakan Electron.js sebagai _runtime environment_ untuk membungkus (_bundling_) aplikasi web ke dalam format aplikasi desktop. Proses distribusi selanjutnya menggunakan NSIS (_Nullsoft Scriptable Install System_) sebagai _installer builder_, yang menghasilkan sebuah _file_ Setup .exe yang dapat diinstal oleh pengguna melalui proses instalasi standar layaknya aplikasi desktop pada umumnya. Dengan pendekatan ini, pengguna tidak lagi perlu mencari dan menjalankan _batch file_ secara manual, melainkan cukup melakukan instalasi sekali melalui _installer_ yang telah disediakan, kemudian menjalankan aplikasi melalui _shortcut_ yang secara otomatis tersedia pada desktop maupun menu Start Windows. Perubahan ini secara signifikan meningkatkan kemudahan penggunaan (_usability_) dan pengalaman pengguna (_user experience_) dalam mengakses aplikasi, khususnya bagi pengguna non-teknis di lingkungan sekolah.

![Gambar 3.9 Perubahan Mekanisme Distribusi Aplikasi (Batch File ke Electron Installer)](<!-- TODO: ganti path gambar perbandingan bat vs installer -->)
_Gambar 3.9 Perubahan Mekanisme Distribusi Aplikasi (Batch File ke Electron Installer)_

### 3.4.3 Kesimpulan Umpan Balik

Kedua umpan balik tersebut menunjukkan bahwa penerapan metode Agile, khususnya Personal Extreme Programming, memungkinkan pengembang untuk merespons kebutuhan dan keluhan pengguna secara cepat dan tepat sasaran. Setiap perubahan yang dilakukan berdasarkan umpan balik pengguna langsung diimplementasikan pada iterasi berikutnya, sehingga aplikasi terus mengalami peningkatan kualitas secara bertahap sesuai dengan prinsip _continuous improvement_ dalam metodologi Agile.

---

## Referensi Bab 3

<!-- Referensi buku (format sesuaikan dengan panduan skripsi kampus) -->

1. Beck, K., et al. (2001). _Manifesto for Agile Software Development_. https://agilemanifesto.org/
2. Beck, K. (1999). _Extreme Programming Explained: Embrace Change_. Addison-Wesley.
3. Dzhurov, Y., Krasteva, I., & Huber, S. (2009). _Personal Extreme Programming – An Agile Process for Autonomous Developers_. Proceedings of the International Conference on Software, Services & Semantic Technologies.
4. Pressman, R. S. (2014). _Software Engineering: A Practitioner's Approach_ (8th ed.). McGraw-Hill Education.
5. Sommerville, I. (2016). _Software Engineering_ (10th ed.). Pearson Education.
6. Norman, D. A. (2013). _The Design of Everyday Things_ (Revised ed.). Basic Books.

<!-- Referensi online white-box testing -->

7. Wikipedia. _White-box testing_. https://en.wikipedia.org/wiki/White-box_testing
8. GeeksforGeeks. _White Box Testing - Software Engineering_. https://www.geeksforgeeks.org/software-testing/software-engineering-white-box-testing/
9. INFLIBNET. _White Box Testing – Software Engineering_. https://ebooks.inflibnet.ac.in/csp8/chapter/white-box-testing/
10. BYU CS340. _White-Box Testing_. https://students.cs.byu.edu/~cs340ta/spring2019/readings/WhiteBox.pdf

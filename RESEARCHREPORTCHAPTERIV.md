BAB 4 HASIL PENELITIAN

---

## Daftar Isi (Table of Contents)

```
BAB 4 HASIL PENELITIAN
├── 4.1 Implementasi Antarmuka Pengguna
│   ├── 4.1.1 Halaman Landing Page
│   │         [img] Gambar 4.1  Halaman Landing Page Aplikasi SIAKAD Madrasah
│   ├── 4.1.2 Halaman Login
│   │         [img] Gambar 4.2  Halaman Login Aplikasi SIAKAD Madrasah
│   ├── 4.1.3 Halaman Dashboard
│   │         [img] Gambar 4.3  Halaman Dashboard Utama
│   ├── 4.1.4 Halaman Manajemen Data Siswa
│   │         [img] Gambar 4.4  Halaman Daftar Siswa
│   │         [img] Gambar 4.5  Halaman Tambah Siswa
│   │         [img] Gambar 4.6  Halaman Detail Siswa
│   │         [img] Gambar 4.7  Modal Upload Excel Siswa
│   ├── 4.1.5 Halaman Manajemen Rombongan Belajar
│   │         [img] Gambar 4.8  Halaman Daftar Rombel
│   │         [img] Gambar 4.9  Halaman Tambah Rombel
│   ├── 4.1.6 Halaman Manajemen Nilai
│   │         [img] Gambar 4.10 Halaman Utama Nilai
│   │         [img] Gambar 4.11 Halaman Nilai Ujian
│   ├── 4.1.7 Halaman Manajemen Guru dan Tenaga Kependidikan
│   │         [img] Gambar 4.12 Halaman Daftar Guru
│   ├── 4.1.8 Halaman Data Lembaga
│   │         [img] Gambar 4.13 Halaman Data Sekolah
│   ├── 4.1.9 Halaman Tahun Ajaran dan Kurikulum
│   │         [img] Gambar 4.14 Halaman Tahun Ajaran
│   │         [img] Gambar 4.15 Halaman Kurikulum
│   └── 4.1.10 Halaman Audit Log
│             [img] Gambar 4.16 Halaman Audit Log
├── 4.2 Implementasi Arsitektur Backend
│   ├── 4.2.1 Struktur Layering Aplikasi
│   ├── 4.2.2 Middleware dan Keamanan Sistem
│   └── 4.2.3 Integrasi File Excel
├── 4.3 Implementasi Basis Data
│   │         [img] Gambar 4.17 Skema Relasi Tabel Basis Data
│   └── 4.3.1 Daftar Tabel dan Fungsinya
└── 4.4 Implementasi Distribusi Aplikasi Desktop
```

---

## 4.1 Implementasi Antarmuka Pengguna

Bab ini menyajikan hasil implementasi aplikasi SIAKAD Madrasah yang telah dikembangkan berdasarkan analisis kebutuhan dan perancangan sistem pada BAB 3. Seluruh antarmuka pengguna dibangun menggunakan _framework_ SvelteKit [1][2] pada sisi _frontend_ dan Express.js [3] pada sisi _backend_, dengan SQLite [5] sebagai basis data melalui Drizzle ORM [7]. Penyajian hasil implementasi dikelompokkan berdasarkan halaman-halaman utama yang tersedia di dalam aplikasi.

### 4.1.1 Halaman Landing Page

<!-- ![Gambar 4.1 Halaman Landing Page Aplikasi SIAKAD Madrasah](/imageresearch/TODO.png) -->
_Gambar 4.1 Halaman Landing Page Aplikasi SIAKAD Madrasah_

Halaman _landing page_ merupakan halaman pertama yang ditampilkan ketika pengguna mengakses aplikasi. Halaman ini bersifat publik dan dapat diakses tanpa autentikasi. Bagian atas halaman menampilkan _hero section_ dengan judul "Platform Akademik Madrasah" beserta deskripsi singkat sistem, tombol "Masuk ke Dashboard" yang mengarahkan ke halaman _login_, dan tautan menuju repositori GitHub proyek.

Di bawah _hero section_ terdapat _bento grid_ yang menampilkan kartu-kartu ringkasan fitur utama aplikasi, yaitu Data Siswa, Penilaian, Kelas & Mapel, Dokumentasi, Laporan, dan Open Source. Kartu-kartu ini bersifat informatif dan tidak memerlukan autentikasi untuk dilihat.

Pada bagian bawah halaman terdapat fitur **Preview Data Nilai** yang menampilkan tabel nilai siswa secara langsung. Fitur ini merupakan implementasi dari _use case_ **lihat nilai siswa** pada _Use Case Diagram_ (Gambar 3.3) yang diperuntukkan bagi aktor Client/Wali Murid/Guru. Pengguna dapat memilih kelas dan mata pelajaran melalui _dropdown_, kemudian sistem menampilkan tabel nilai yang memuat nama siswa, NISN, dan kolom nilai berdasarkan jenis penilaian yang tersedia. Data nilai diambil dari API `/routes/api/score/scorebyclass` tanpa memerlukan _token_ autentikasi, sehingga guru, wali murid, atau pihak sekolah lainnya dapat melihat data nilai untuk keperluan presentasi atau pengecekan cepat tanpa harus _login_ ke dalam sistem.

### 4.1.2 Halaman Login

<!-- ![Gambar 4.2 Halaman Login Aplikasi SIAKAD Madrasah](/imageresearch/TODO.png) -->
_Gambar 4.2 Halaman Login Aplikasi SIAKAD Madrasah_

Halaman _login_ diakses melalui tombol "Masuk ke Dashboard" pada halaman _landing page_. Halaman ini menampilkan formulir autentikasi yang terdiri dari _field_ _username_ dan _password_ dengan opsi _checkbox_ untuk menampilkan _password_. Proses autentikasi dilakukan melalui API `POST /login` yang memvalidasi _credentials_ menggunakan bcryptjs [10] dan menghasilkan _token_ JWT [9] dengan masa berlaku 24 jam. Apabila autentikasi berhasil, _token_ dan data pengguna disimpan pada `localStorage` _browser_ dan pengguna diarahkan ke halaman _dashboard_. Apabila gagal, sistem menampilkan notifikasi _toast error_ yang otomatis hilang setelah 5 detik.

### 4.1.3 Halaman Dashboard

<!-- ![Gambar 4.3 Halaman Dashboard Utama](/imageresearch/TODO.png) -->
_Gambar 4.3 Halaman Dashboard Utama_

Setelah berhasil _login_, pengguna diarahkan ke halaman _dashboard_ utama yang menampilkan pesan sambutan dengan nama pengguna dan peran yang sedang aktif. Halaman ini berfungsi sebagai pusat navigasi dengan menyajikan beberapa elemen utama:

a. **Kartu informasi sekolah**, menampilkan nama dan identitas institusi.
b. **Statistik ringkasan**, menampilkan jumlah siswa, guru, dan data operasional lainnya.
c. **Widget kalender**, menampilkan kalender akademik.
d. **Kartu navigasi cepat**, menyediakan akses langsung ke modul-modul yang sering digunakan.

Tata letak _dashboard_ menggunakan sistem _grid_ yang responsif [23] dan menyesuaikan jumlah kolom berdasarkan ukuran layar perangkat. Pada bagian kiri terdapat _sidebar_ navigasi yang berisi menu-menu utama aplikasi dengan dukungan _dropdown_ untuk sub-menu. Bagian atas terdapat _navbar_ dengan informasi profil pengguna dan tombol _logout_.

### 4.1.4 Halaman Manajemen Data Siswa

#### Daftar Siswa

<!-- ![Gambar 4.4 Halaman Daftar Siswa](/imageresearch/TODO.png) -->
_Gambar 4.4 Halaman Daftar Siswa_

Halaman daftar siswa menampilkan seluruh data siswa dalam bentuk kartu yang memuat informasi nama, NISN, kelas, jenis kelamin, asal sekolah, dan _badge_ status. Status siswa ditampilkan dengan kode warna: hijau untuk AKTIF, kuning untuk MUTASI, dan biru untuk LULUS. Halaman ini dilengkapi dengan beberapa fitur pengelolaan data:

a. **Pencarian**, _search bar_ dengan mekanisme _debounce_ (600ms) untuk mencari siswa berdasarkan nama, NISN, atau NIS lokal [24].
b. **Filter status**, _dropdown_ untuk memfilter siswa berdasarkan status (Aktif, Lulus, Mutasi).
c. **Pengaturan jumlah data**, _selector_ untuk menentukan jumlah data per halaman (5, 10, 20, 50, atau 100).
d. **Paginasi**, navigasi halaman dengan tombol _previous/next_ dan nomor halaman.
e. **Tombol aksi**, tombol untuk menambah siswa baru, mengunduh template Excel, dan mengunggah data siswa dari _file_ Excel.

Apabila belum terdapat data siswa, halaman menampilkan _empty state_ dengan panduan langkah-langkah untuk mulai menambahkan data.

#### Tambah Siswa

<!-- ![Gambar 4.5 Halaman Tambah Siswa](/imageresearch/TODO.png) -->
_Gambar 4.5 Halaman Tambah Siswa_

Halaman tambah siswa menggunakan formulir bertab yang terbagi menjadi tiga bagian: data siswa, data orang tua (ayah dan ibu), dan data wali. Pada tab pertama, pengguna mengisi identitas siswa yang mencakup nama lengkap, NISN, NIS lokal, jenis kelamin, agama, tempat dan tanggal lahir, sekolah asal, nomor telepon, data kewarganegaraan, serta data alamat yang terstruktur (jalan, RT/RW, kelurahan, kecamatan, kode pos). Formulir juga menyediakan fitur unggah foto siswa dengan validasi format (JPG, PNG, WebP) dan pratinjau gambar sebelum disimpan.

Tab kedua dan ketiga menggunakan komponen `ParentBiodata` yang menampilkan _field_ biodata orang tua dan wali, meliputi nama, pekerjaan, nomor telepon, NIK, tempat dan tahun lahir, pendidikan terakhir, penghasilan bulanan, serta status hidup.

#### Detail Siswa

<!-- ![Gambar 4.6 Halaman Detail Siswa](/imageresearch/TODO.png) -->
_Gambar 4.6 Halaman Detail Siswa_

Halaman detail siswa menampilkan seluruh informasi yang tersimpan untuk satu siswa, mencakup data pribadi, data orang tua, data wali, dan data alamat. Halaman ini menyediakan empat tombol aksi:

a. **Edit**, mengarahkan ke formulir pengeditan data siswa.
b. **Hapus**, menampilkan modal konfirmasi sebelum menghapus data.
c. **Mutasi**, menampilkan modal formulir untuk memindahkan siswa ke status MUTASI.
d. **Kelulusan**, menampilkan modal formulir untuk mengubah status siswa menjadi LULUS.

#### Upload Excel Siswa

<!-- ![Gambar 4.7 Modal Upload Excel Siswa](/imageresearch/TODO.png) -->
_Gambar 4.7 Modal Upload Excel Siswa_

Fitur _bulk upload_ memungkinkan pengguna mengunggah data banyak siswa sekaligus melalui _file_ Excel [21][22]. Proses ini terdiri dari dua langkah: pertama, pengguna mengunduh _template_ Excel yang telah diformat oleh sistem melalui tombol "Unduh Template"; kedua, pengguna mengisi data pada _template_ tersebut dan mengunggahnya kembali melalui tombol "Upload Excel".

Template Excel yang dihasilkan oleh sistem memiliki beberapa fitur pemformatan:

a. **Pewarnaan bagian**, kolom dikelompokkan berdasarkan warna: hijau untuk data siswa, biru untuk alamat, ungu untuk data ayah, dan merah untuk data ibu.
b. **Validasi dropdown**, kolom tertentu seperti jenis kelamin, agama, dan status orang tua dilengkapi dengan _dropdown_ pilihan.
c. **Format teks**, kolom nomor dokumen (NISN, NIK, BPJS) diformat sebagai teks untuk mencegah konversi ke notasi ilmiah oleh Excel.
d. **Header beku**, baris header dikunci agar tetap terlihat saat menggulir data.

Apabila terdapat kesalahan pada data yang diunggah, sistem menampilkan tabel _error_ yang menunjukkan nomor baris, NISN, dan pesan kesalahan untuk setiap baris yang gagal diproses.

### 4.1.5 Halaman Manajemen Rombongan Belajar

#### Daftar Rombongan belajar

<!-- ![Gambar 4.8 Halaman Daftar Rombel](/imageresearch/TODO.png) -->
_Gambar 4.8 Halaman Daftar Rombel_

Halaman rombongan belajar (rombel) menampilkan daftar kelas dalam bentuk _grid_ kartu. Setiap kartu menampilkan nama rombel, tingkat kelas, nama wali kelas, ruangan, dan kurikulum yang digunakan. Pada setiap kartu terdapat _progress bar_ yang menunjukkan persentase kapasitas siswa dengan kode warna: hijau untuk 0-70%, biru untuk 70-90%, dan kuning untuk di atas 90%.

Setiap kartu rombel menyediakan tombol untuk mengunduh _template_ nilai dan tombol hapus. Saat tombol _template_ nilai ditekan, sistem menampilkan modal pemilihan mata pelajaran agar pengguna dapat mengunduh _template_ yang spesifik untuk mata pelajaran tertentu.

#### Tambah Rombel

<!-- ![Gambar 4.9 Halaman Tambah Rombel](/imageresearch/TODO.png) -->
_Gambar 4.9 Halaman Tambah Rombel_

Halaman tambah rombel menampilkan formulir dengan _field_ tahun ajaran, tingkat kelas, nama rombel, wali kelas, ruangan, kurikulum, dan kapasitas siswa (default 30). Pada bagian bawah formulir terdapat daftar siswa yang dapat dipilih untuk ditugaskan ke rombel tersebut. Data tahun ajaran, kurikulum, dan daftar guru dimuat dari API sehingga selalu menampilkan data terbaru.

### 4.1.6 Halaman Manajemen Nilai

#### Halaman Utama Nilai

<!-- ![Gambar 4.10 Halaman Utama Nilai](/imageresearch/TODO.png) -->
_Gambar 4.10 Halaman Utama Nilai_

Halaman utama nilai menggunakan tata letak _bento grid_ yang menampilkan tiga kartu navigasi cepat: Nilai Tugas, Nilai Ujian, dan Nilai Per Mata Pelajaran. Di bawah kartu navigasi terdapat dua bagian utama:

a. **Unduh Template**, pengguna memilih rombel dan opsional mata pelajaran, kemudian mengunduh _template_ Excel yang sudah berisi daftar siswa dari rombel tersebut beserta kolom jenis penilaian.
b. **Upload Nilai**, pengguna memilih rombel, mata pelajaran, dan jenis penilaian, kemudian mengunggah _file_ Excel yang telah diisi [21]. Sistem mendukung dua format unggah: format per jenis penilaian dan format _pivot_ (matriks siswa x mata pelajaran).

Apabila terdapat kesalahan saat pemrosesan _file_, sistem menampilkan tabel _error_ dengan informasi nomor baris, NISN, dan pesan kesalahan untuk setiap baris yang bermasalah.

#### Nilai Ujian

<!-- ![Gambar 4.11 Halaman Nilai Ujian](/imageresearch/TODO.png) -->
_Gambar 4.11 Halaman Nilai Ujian_

Halaman nilai ujian menampilkan tabel nilai siswa dengan kolom nama siswa, NISN, dan kolom nilai berdasarkan jenis penilaian (UH, UTS, UAS, dan sebagainya). Header kolom penilaian dihasilkan secara dinamis dari data jenis penilaian yang terdaftar di sistem. Pengguna memilih kelas dan mata pelajaran melalui _dropdown_ untuk menampilkan data nilai yang sesuai.

### 4.1.7 Halaman Manajemen Guru dan Tenaga Kependidikan

<!-- ![Gambar 4.12 Halaman Daftar Guru](/imageresearch/TODO.png) -->
_Gambar 4.12 Halaman Daftar Guru_

Halaman manajemen guru menggunakan antarmuka dua tab: tab "Daftar Guru" menampilkan tabel berisi NIP, nama lengkap, jenis kelamin, nomor telepon, email, dan tombol aksi (edit dan hapus); tab "Tambah Guru Baru" menampilkan formulir pendaftaran guru dengan _field_ NIP, nama lengkap, jenis kelamin, agama, tempat dan tanggal lahir, nomor telepon, dan email.

Pengeditan data dilakukan secara _inline_ pada tab yang sama, di mana formulir tambah guru berubah menjadi formulir edit saat tombol edit pada tabel ditekan. Penghapusan data dilakukan melalui modal konfirmasi untuk mencegah penghapusan yang tidak disengaja [23][24].

### 4.1.8 Halaman Data Lembaga

<!-- ![Gambar 4.13 Halaman Data Sekolah](/imageresearch/TODO.png) -->
_Gambar 4.13 Halaman Data Sekolah_

Halaman data lembaga menampilkan informasi profil sekolah yang terdiri dari logo, nama sekolah, NPSN, NSM, akreditasi, kota, alamat, dan negara. Secara _default_, halaman ini menampilkan data dalam mode baca saja. Pengguna dapat mengaktifkan mode edit melalui tombol "Edit" untuk mengubah data, atau membatalkan perubahan melalui tombol "Batal".

Fitur unggah logo mendukung format JPG, PNG, GIF, SVG, dan WebP dengan batas ukuran 5MB. Saat pengguna memilih _file_ logo baru, sistem menampilkan pratinjau gambar dengan label "Preview" sebelum data disimpan. Apabila belum terdapat data sekolah, halaman otomatis masuk ke mode edit agar pengguna dapat langsung mengisi data.

### 4.1.9 Halaman Tahun Ajaran dan Kurikulum

#### Tahun Ajaran

<!-- ![Gambar 4.14 Halaman Tahun Ajaran](/imageresearch/TODO.png) -->
_Gambar 4.14 Halaman Tahun Ajaran_

Halaman tahun ajaran menampilkan daftar tahun ajaran yang terdaftar, masing-masing dengan nama, rentang tahun, status aktif, dan jumlah rombel yang menggunakan tahun ajaran tersebut. Pengguna dapat menambah tahun ajaran baru melalui formulir yang secara otomatis menghasilkan nama dari rentang tahun yang dimasukkan. Sistem memastikan hanya satu tahun ajaran yang aktif pada satu waktu; saat satu tahun ajaran diaktifkan, tahun ajaran lainnya otomatis dinonaktifkan.

#### Kurikulum

<!-- ![Gambar 4.15 Halaman Kurikulum](/imageresearch/TODO.png) -->
_Gambar 4.15 Halaman Kurikulum_

Halaman kurikulum menampilkan daftar kurikulum dengan nama, kode, tahun, dan status aktif. Sama seperti tahun ajaran, hanya satu kurikulum yang dapat aktif pada satu waktu. Setiap kurikulum menampilkan jumlah rombel yang menggunakannya sebagai indikator penggunaan.

### 4.1.10 Halaman Audit Log

<!-- ![Gambar 4.16 Halaman Audit Log](/imageresearch/TODO.png) -->
_Gambar 4.16 Halaman Audit Log_

Halaman _audit log_ menampilkan riwayat seluruh aktivitas yang terjadi di dalam sistem. Setiap catatan _log_ memuat informasi aksi yang dilakukan (Created, Updated, Deleted, Viewed), jenis data yang terpengaruh (siswa, guru, nilai, dan sebagainya), pengguna yang melakukan aksi, status keberhasilan, alamat IP, _user-agent_, serta _timestamp_. Halaman ini menyediakan fitur filter berdasarkan jenis aksi, pengguna, status, rentang waktu, dan pencarian teks.

Sistem _audit log_ bekerja secara otomatis melalui _middleware_ [25] yang mencatat setiap permintaan API tanpa memerlukan intervensi manual dari pengguna. Untuk mengurangi volume data, sistem menerapkan mekanisme _cache_ yang menghindari pencatatan berulang untuk permintaan GET yang sama dalam satu sesi, dengan _cache_ yang direset setiap 30 menit.

---

## 4.2 Implementasi Arsitektur Backend

Arsitektur _backend_ aplikasi SIAKAD Madrasah dibangun menggunakan Express.js versi 5 [3][4] dengan pola _layered architecture_ [13][14] yang memisahkan tanggung jawab ke dalam tiga lapisan utama: _routes_, _controllers_, dan _services_. Pendekatan ini diterapkan agar kode lebih mudah dipelihara, diuji, dan dikembangkan oleh pengembang lain di kemudian hari [26][27].

### 4.2.1 Struktur Layering Aplikasi

Setiap permintaan API yang masuk diproses melalui tiga lapisan secara berurutan:

a. **Routes**, mendefinisikan _endpoint_ URL dan metode HTTP [15][16], kemudian meneruskan permintaan ke _controller_ yang sesuai. Seluruh _route_ API dimuat pada _file_ `app.js` dan dipasang pada _base path_ `/routes/api/`.
b. **Controllers**, menerima objek _request_, melakukan validasi _input_, memanggil fungsi _service_ yang relevan, dan mengembalikan respons dalam format JSON [13]. _Controller_ tidak mengandung logika bisnis.
c. **Services**, mengandung seluruh logika bisnis dan interaksi dengan basis data melalui Drizzle ORM [7]. Operasi yang melibatkan beberapa tabel dilaksanakan dalam satu transaksi untuk menjaga konsistensi data.

Berikut adalah daftar _endpoint_ API utama yang tersedia dalam sistem:

**Tabel 4.1 Daftar Endpoint API Utama**

| No | Modul | Endpoint | Metode | Deskripsi |
| --- | --- | --- | --- | --- |
| 1 | Autentikasi | `/login` | POST | Login pengguna |
| 2 | Autentikasi | `/logout` | POST | Logout pengguna |
| 3 | Autentikasi | `/change-password` | POST | Ubah password |
| 4 | Siswa | `/studentDataSet` | GET | Daftar siswa dengan paginasi |
| 5 | Siswa | `/studentDataSet/search` | GET | Pencarian siswa |
| 6 | Siswa | `/students` | POST | Tambah siswa |
| 7 | Siswa | `/students/:id` | PUT | Edit siswa |
| 8 | Siswa | `/students/:id` | DELETE | Hapus siswa |
| 9 | Siswa | `/students/upload-bulk` | POST | Upload Excel siswa |
| 10 | Siswa | `/students/download-template` | GET | Unduh template Excel |
| 11 | Rombel | `/rombel` | GET, POST | Daftar dan tambah rombel |
| 12 | Rombel | `/rombel/:id` | GET, DELETE | Detail dan hapus rombel |
| 13 | Nilai | `/scores` | POST | Simpan nilai |
| 14 | Nilai | `/upload` | POST | Upload nilai dari Excel |
| 15 | Nilai | `/upload-bulk` | POST | Upload nilai format pivot |
| 16 | Nilai | `/template/:rombelId` | GET | Unduh template nilai |
| 17 | Guru | `/teachers` | GET, POST | Daftar dan tambah guru |
| 18 | Guru | `/teachers/:id` | GET, PUT, DELETE | Detail, edit, dan hapus guru |
| 19 | Sekolah | `/schoolData` | GET, POST, PUT | Data sekolah |
| 20 | Mata Pelajaran | `/subjects` | GET, POST | Daftar dan tambah mapel |
| 21 | Tahun Ajaran | `/academic-years` | GET, POST | Daftar dan tambah tahun ajaran |
| 22 | Kurikulum | `/curriculum` | GET, POST | Daftar dan tambah kurikulum |
| 23 | Audit Log | `/audit-logs` | GET | Riwayat aktivitas sistem |
| 24 | Alumni | `/graduates` | GET, POST | Daftar dan proses kelulusan |
| 25 | Kenaikan Kelas | `/promotion/promote` | POST | Proses kenaikan kelas |

### 4.2.2 Middleware dan Keamanan Sistem

Aplikasi menerapkan tiga lapisan _middleware_ untuk menjaga keamanan dan ketelusuran sistem:

a. **Verifikasi Token (verifyToken)**, setiap permintaan ke _endpoint_ yang memerlukan autentikasi harus menyertakan _token_ JWT [9] pada _header_ `Authorization: Bearer <token>`. _Middleware_ ini memvalidasi _token_, mendekode informasi pengguna, dan melampirkannya pada objek _request_ untuk digunakan oleh _controller_ dan _service_.
b. **Audit Logging (middlewareAudit)**, _middleware_ ini mencatat seluruh permintaan API ke dalam tabel `auditLog` secara otomatis [25]. Setiap catatan memuat informasi aksi, jenis data, pengguna, status, metadata, alamat IP, _user-agent_, dan _timestamp_. _Middleware_ ini menerapkan klasifikasi otomatis terhadap jenis aksi (Created, Updated, Deleted, Viewed) dan jenis data (siswa, guru, nilai, dan sebagainya) berdasarkan URL dan metode HTTP.
c. **Rate Limiter (rateLimiter)**, membatasi jumlah permintaan dari satu _client_ menjadi maksimal 300 permintaan per 15 menit [11][12]. Apabila batas terlampaui, server mengembalikan respons dengan status 429 (Too Many Requests) [16].

### 4.2.3 Integrasi File Excel

Salah satu fitur utama aplikasi adalah kemampuan untuk memproses _file_ Excel baik untuk _input_ maupun _output_ data. Integrasi ini diimplementasikan menggunakan _library_ ExcelJS [21] sesuai dengan standar format Office Open XML [22] dan mencakup dua arah pemrosesan:

**Pembuatan Template Excel (Output)**

Sistem menghasilkan _template_ Excel yang terformat untuk dua kebutuhan: _template_ data siswa dan _template_ nilai. Template data siswa mengelompokkan kolom berdasarkan warna (siswa, alamat, ayah, ibu), menerapkan validasi _dropdown_ pada kolom tertentu, dan memformat kolom nomor dokumen sebagai teks. Template nilai memuat daftar siswa dari rombel yang dipilih dengan kolom jenis penilaian yang tersedia.

**Pemrosesan File Excel (Input)**

Saat pengguna mengunggah _file_ Excel, sistem membaca _buffer file_ menggunakan ExcelJS, mengekstrak data dari setiap baris, memetakan kolom Excel ke _field_ basis data, dan menyimpan data melalui operasi transaksi. Pemetaan _field_ dilakukan berdasarkan posisi kolom pada _header_ baris pertama. Apabila terjadi kesalahan pada baris tertentu, sistem mencatat kesalahan tersebut dan melanjutkan pemrosesan baris berikutnya, kemudian mengembalikan laporan kesalahan ke pengguna.

---

## 4.3 Implementasi Basis Data

Basis data aplikasi SIAKAD Madrasah diimplementasikan menggunakan SQLite [5][6] yang diakses melalui Drizzle ORM [7]. Pemilihan SQLite didasarkan pada kebutuhan aplikasi yang berjalan secara lokal sebagai aplikasi _desktop_ tanpa memerlukan server basis data terpisah [8]. Drizzle ORM digunakan untuk mendefinisikan skema tabel dalam bentuk kode JavaScript, sehingga struktur basis data terdokumentasi dan dapat dilacak perubahannya melalui _version control_.

<!-- ![Gambar 4.17 Skema Relasi Tabel Basis Data](/imageresearch/TODO.png) -->
_Gambar 4.17 Skema Relasi Tabel Basis Data_

### 4.3.1 Daftar Tabel dan Fungsinya

**Tabel 4.2 Daftar Tabel Basis Data**

| No | Nama Tabel | Fungsi |
| --- | --- | --- |
| 1 | `users` | Data akun pengguna (username, password hash, role) |
| 2 | `studentTable` | Data identitas siswa (nama, NISN, NIS, status) |
| 3 | `studentFather` | Data ayah siswa |
| 4 | `studentMother` | Data ibu siswa |
| 5 | `studentWali` | Data wali siswa |
| 6 | `studentAddress` | Data alamat siswa |
| 7 | `studentScore` | Data nilai siswa per mata pelajaran dan jenis penilaian |
| 8 | `studentHistory` | Riwayat perubahan status siswa (mutasi, kelulusan) |
| 9 | `studentAttendance` | Data kehadiran siswa |
| 10 | `rombel` | Data rombongan belajar (nama, tingkat, wali kelas, kapasitas) |
| 11 | `rombelStudents` | Tabel relasi siswa-rombel (junction table) |
| 12 | `classes` | Data tingkat kelas (VII, VIII, IX, X, XI, XII) |
| 13 | `teachers` | Data guru (NIP, nama, kontak) |
| 14 | `subjects` | Data mata pelajaran (nama, kode, KKM) |
| 15 | `classSubject` | Penugasan mata pelajaran ke kelas dan guru |
| 16 | `assessmentType` | Jenis penilaian (UH, UTS, UAS) dengan bobot |
| 17 | `academicYear` | Data tahun ajaran |
| 18 | `curriculum` | Data kurikulum |
| 19 | `schoolDataTable` | Data profil sekolah |
| 20 | `schoolFacilities` | Data fasilitas sekolah |
| 21 | `buildingsSchool` | Data gedung dan aset tetap |
| 22 | `auditLog` | Catatan aktivitas sistem |

Relasi antar tabel diimplementasikan melalui _foreign key_ [6] yang menghubungkan entitas-entitas yang saling berkaitan. Sebagai contoh, tabel `studentFather`, `studentMother`, `studentWali`, dan `studentAddress` terhubung ke tabel `studentTable` melalui kolom `studentId`. Tabel `rombelStudents` berfungsi sebagai _junction table_ yang menghubungkan tabel `studentTable` dengan tabel `rombel` dalam relasi _many-to-many_. Tabel `studentScore` terhubung ke tabel `studentTable`, `classSubject`, dan `assessmentType` untuk mencatat nilai siswa berdasarkan mata pelajaran dan jenis penilaian.

Untuk menjaga integritas data, beberapa kolom menerapkan _constraint unique_ pada _field_ yang bersifat unik seperti NISN, NIS lokal, nomor BPJS, nomor KTP, dan nomor akta kelahiran. Sistem juga menerapkan logika bisnis di mana hanya satu tahun ajaran dan satu kurikulum yang dapat berstatus aktif pada satu waktu.

---

## 4.4 Implementasi Distribusi Aplikasi Desktop

Sebagaimana telah diuraikan pada subbab 3.5.2, aplikasi SIAKAD Madrasah didistribusikan dalam bentuk aplikasi _desktop_ Windows menggunakan Electron.js [17][18]. Proses _bundling_ dilakukan melalui _electron-builder_ [19] yang menghasilkan _installer_ NSIS [20] (Setup.exe). Electron membungkus server Express.js dan antarmuka SvelteKit dalam satu proses, sehingga pengguna dapat menjalankan aplikasi melalui _shortcut_ desktop tanpa memerlukan _browser_ atau _terminal_ terpisah.

Basis data SQLite [8] disimpan pada direktori `%APPDATA%/SIAKAD Madrasah/` yang terpisah dari direktori instalasi aplikasi. Pemisahan ini memastikan data pengguna tetap aman saat aplikasi diperbarui atau diinstal ulang [26]. Saat proses _uninstall_, _installer_ menampilkan dialog konfirmasi dalam bahasa Indonesia yang menanyakan apakah pengguna ingin menghapus data aplikasi (basis data dan pengaturan) atau mempertahankannya.

---

## Referensi Bab 4

### Framework dan Library

[1] Harris, R. (2020). "Rethinking Reactivity." _Svelte Blog_. Tersedia: https://svelte.dev/blog/svelte-3-rethinking-reactivity [Diakses 20 April 2026].

[2] Svelte Contributors. (2024). _SvelteKit Documentation_. Tersedia: https://kit.svelte.dev/docs [Diakses 20 April 2026].

[3] OpenJS Foundation. (2024). _Express.js 5.x - Fast, Unopinionated, Minimalist Web Framework for Node.js_. Tersedia: https://expressjs.com/ [Diakses 20 April 2026].

[4] Node.js Contributors. (2024). _Node.js Documentation_. Tersedia: https://nodejs.org/docs/latest/api/ [Diakses 20 April 2026].

### Basis Data dan ORM

[5] SQLite Consortium. (2024). _SQLite Documentation_. Tersedia: https://www.sqlite.org/docs.html [Diakses 20 April 2026].

[6] Owens, M. dan Allen, G. (2010). _The Definitive Guide to SQLite_. Edisi ke-2. New York: Apress. ISBN: 978-1430232254.

[7] Drizzle Team. (2024). _Drizzle ORM Documentation_. Tersedia: https://orm.drizzle.team/docs/overview [Diakses 20 April 2026].

[8] Kreibich, J.A. (2010). _Using SQLite: Small, Fast, Reliable — Choose Any Three_. Sebastopol: O'Reilly Media. ISBN: 978-0596521189.

### Keamanan dan Autentikasi

[9] Jones, M., Bradley, J., dan Sakimura, N. (2015). "JSON Web Token (JWT)." _RFC 7519, Internet Engineering Task Force (IETF)_. Tersedia: https://datatracker.ietf.org/doc/html/rfc7519 [Diakses 20 April 2026].

[10] Provos, N. dan Mazières, D. (1999). "A Future-Adaptable Password Scheme." _Proceedings of the USENIX Annual Technical Conference_, hal. 81–91. Monterey, California.

[11] OWASP Foundation. (2021). _OWASP Top Ten Web Application Security Risks_. Tersedia: https://owasp.org/www-project-top-ten/ [Diakses 20 April 2026].

[12] OWASP Foundation. (2023). _OWASP REST Security Cheat Sheet_. Tersedia: https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html [Diakses 20 April 2026].

### Arsitektur dan Pola Desain

[13] Fowler, M. (2002). _Patterns of Enterprise Application Architecture_. Boston: Addison-Wesley Professional. ISBN: 978-0321127426.

[14] Richards, M. (2015). _Software Architecture Patterns_. Sebastopol: O'Reilly Media.

[15] Fielding, R.T. (2000). "Architectural Styles and the Design of Network-based Software Architectures." _Disertasi Doktoral_, University of California, Irvine.

[16] Fielding, R.T. dan Reschke, J. (2014). "Hypertext Transfer Protocol (HTTP/1.1): Semantics and Content." _RFC 7231, Internet Engineering Task Force (IETF)_. Tersedia: https://datatracker.ietf.org/doc/html/rfc7231 [Diakses 20 April 2026].

### Distribusi Aplikasi Desktop

[17] GitHub Inc. (2024). _Electron Documentation_. Tersedia: https://www.electronjs.org/docs/latest [Diakses 20 April 2026].

[18] Jensen, P.B. (2017). _Cross-platform Desktop Applications: Using Node, Electron, and NW.js_. Shelter Island: Manning Publications. ISBN: 978-1617292842.

[19] electron-builder Contributors. (2024). _electron-builder Documentation_. Tersedia: https://www.electron.build/ [Diakses 20 April 2026].

[20] NSIS Contributors. (2024). _NSIS (Nullsoft Scriptable Install System) Documentation_. Tersedia: https://nsis.sourceforge.io/Docs/ [Diakses 20 April 2026].

### Pengolahan File Excel

[21] ExcelJS Contributors. (2024). _ExcelJS - Excel Workbook Manager_. Tersedia: https://github.com/exceljs/exceljs [Diakses 20 April 2026].

[22] ECMA International. (2021). "Office Open XML File Formats." _ECMA-376_, Edisi ke-5. Tersedia: https://ecma-international.org/publications-and-standards/standards/ecma-376/ [Diakses 20 April 2026].

### Antarmuka Pengguna dan Desain

[23] Nielsen, J. (1994). "10 Usability Heuristics for User Interface Design." _Nielsen Norman Group_. Tersedia: https://www.nngroup.com/articles/ten-usability-heuristics/ [Diakses 20 April 2026].

[24] Shneiderman, B., Plaisant, C., Cohen, M., Jacobs, S., dan Elmqvist, N. (2016). _Designing the User Interface: Strategies for Effective Human-Computer Interaction_. Edisi ke-6. Boston: Pearson. ISBN: 978-0134380384.

### Sistem Informasi Akademik

[25] Laudon, K.C. dan Laudon, J.P. (2020). _Management Information Systems: Managing the Digital Firm_. Edisi ke-16. London: Pearson. ISBN: 978-0135191798.

[26] Pressman, R.S. dan Maxim, B.R. (2020). _Software Engineering: A Practitioner's Approach_. Edisi ke-9. New York: McGraw-Hill Education. ISBN: 978-1259872976.

[27] Sommerville, I. (2015). _Software Engineering_. Edisi ke-10. London: Pearson. ISBN: 978-0133943030.

BAB 3 METODE PENELITIAN

this file is provide the research report from users recently and the updated managed by iterations of methods

---

## Daftar Isi (Table of Contents)

```
BAB 3 METODE PENELITIAN
├── 3.1 Penerapan Metode Personal Extreme Programming (PXP)
│   ├── 3.1.1 Dasar Pemilihan Metode PXP
│   │         [img] Gambar 3.2  Alur Siklus Personal Extreme Programming (PXP)
│   └── 3.1.2 Fase Pengembangan dan Pemetaan Iterasi
├── 3.2 Analisis dan Perancangan Kebutuhan Sistem   [fase: exploration]
│   ├── 3.2.1 Identifikasi Aktor Sistem
│   ├── 3.2.2 Pemodelan Use Case Diagram
│   │         [img] Gambar 3.3  Use Case Diagram Sistem Informasi Akademik Madrasah
│   └── 3.2.3 Deskripsi Fungsionalitas Sistem
├── 3.3 Dokumentasi Iterasi Pengembangan            [fase: iterations to release]
│   ├── 3.3.1 Riwayat Iterasi Pengembangan
│   │         [tbl] Tabel  3.1  Riwayat Iterasi Pengembangan
│   ├── 3.3.2 Analisis Distribusi Commit
│   │         [img] Gambar 3.4  Grafik Distribusi Commit per Iterasi
│   └── 3.3.3 Alur Version Control
│             [img] Gambar 3.5  Diagram Alur Version Control dengan Git
├── 3.4 Pengujian Sistem                            [fase: productionizing]
│   │         [img] Gambar 3.6  Ilustrasi Metode White-Box Testing
│   ├── 3.4.1 Cakupan Pengujian
│   │         [img] Gambar 3.7  Alur Pengujian Fungsi Upload dan Template Excel
│   ├── 3.4.2 Skenario dan Hasil Pengujian
│   │         [tbl] Tabel  3.2  Unit Test: createBulkStudentsFromExcel()
│   │         [tbl] Tabel  3.3  Unit Test: createStudentData() & BulkGenerator()
│   │         [tbl] Tabel  3.4  Unit Test: registerRombel()
│   │         [tbl] Tabel  3.5  Unit Test: generateBulkScoreTemplate()
│   └── 3.4.3 Tujuan Pengujian
├── 3.5 Pemeliharaan dan Umpan Balik Pengguna       [fase: maintenance]
│   ├── 3.5.1 Umpan Balik Fitur Upload Excel
│   │         [img] Gambar 3.8  Perubahan Label Fitur Upload Excel (Sebelum & Sesudah)
│   ├── 3.5.2 Umpan Balik Mekanisme Instalasi Aplikasi
│   │         [img] Gambar 3.9  Perubahan Mekanisme Distribusi (Batch File → Electron)
│   └── 3.5.3 Kesimpulan Umpan Balik
└── Referensi Bab 3
```

<!-- CATATAN: hapus sebelum submit ke dosen

  BAB 3 & XP — Quick Reference
  3.1 Metodologi    → small releases, simple design, refactoring, coding standards
  3.2 Analisis      → exploration phase, customer stories, simple design
  3.3 Bukti Iterasi → small releases (12 iterasi), CI (491 commit), sustainable pace
  3.4 Pengujian     → test-first (Jest), mock isolation, refactoring safely
  3.5 Umpan Balik   → customer collaboration (WhatsApp→hotfix), continuous improvement

  Pemetaan 6 Fase XP → Iterasi:
  1. Exploration     → Iter 1-3 (Nov 2025)     → 3.2 + 3.3.1
  2. Planning        → embedded tiap iterasi   → 3.1.2 (Tabel 3.1)
  3. Iter to Release → Iter 4-9 (Des-Jan)      → 3.3.1
  4. Productionizing → Iter 10 (Feb 1-5)       → 3.4
  5. Maintenance     → Iter 11-12 (Feb 7-25)   → 3.5
  6. Death           → belum (proyek masih aktif)
  Note: Planning embedded di awal tiap iterasi (PXP), bukan fase terpisah. -->

---

Penelitian ini dilaksanakan di MTs. Al-Hasyimiy yang berlokasi di Kampung Baru, RT.004/RW.002, Raci, Kecamatan Bangil, Kabupaten Pasuruan, Jawa Timur 67153. Proses pengembangan platform akademik madrasah dilakukan di kantor sekolah dengan periode penelitian selama 6 bulan atau 1 semester, menyesuaikan dengan target penelitian serta jadwal Penerimaan Peserta Didik Baru (PPDB) madrasah.

Spesifikasi perangkat yang digunakan selama proses pengembangan platform akademik madrasah adalah sebagai berikut:

**Perangkat Keras Komputasi (PC Rakitan):**

a. Penyimpanan: 1TB SSD
b. Prosesor: Intel Core i5-12400F
c. RAM: 16GB

**Perangkat Laptop (Acer Nitro AN715-51):**

a. Penyimpanan: 512GB SSD
b. Prosesor: Intel Core i7-9750H

**Perangkat Lunak Pengembangan:**

a. Sistem Operasi: Windows 11
b. Manajemen Basis Data: DataGrip
c. Basis Data: SQLite
d. Lingkungan Pengembangan: JetBrains WebStorm (untuk SvelteKit dan Node.js)
e. _Version Control_: Git

---

## 3.1 Penerapan Metode Personal Extreme Programming (PXP)

Metode pengembangan perangkat lunak yang digunakan dalam penelitian ini adalah metode Agile [[1]](#ref-1). Menurut pendekatan Agile, proses pengembangan sistem informasi dilakukan secara iteratif dan inkremental, yang memberikan fleksibilitas tinggi bagi pengembang untuk melakukan perbaikan, penambahan fitur, serta penyesuaian kebutuhan secara berkelanjutan pada setiap siklus pengembangan. Pendekatan ini memungkinkan proses rekayasa perangkat lunak (_software engineering_) bersifat adaptif, responsif terhadap perubahan kebutuhan pengguna, dan tidak terikat pada satu mekanisme pengembangan yang bersifat linier maupun kaku sebagaimana metode konvensional seperti _Waterfall_.

### 3.1.1 Dasar Pemilihan Metode PXP

Secara spesifik, metode pengembangan yang diterapkan dalam penelitian ini tergolong dalam varian Personal Extreme Programming (PXP) [[3]](#ref-3), yang merupakan adaptasi dari metodologi Extreme Programming (XP) [[2]](#ref-2) untuk konteks pengembangan individu (_solo developer_). Metode PXP dipilih berdasarkan pertimbangan terhadap beberapa faktor utama. Pertama, pengembangan sistem dilaksanakan secara mandiri oleh satu orang pengembang (_solo developer_) [[22]](#ref-22), sehingga metodologi berbasis tim seperti Scrum maupun Kanban yang mensyaratkan adanya peran _Product Owner_, _Scrum Master_, serta pelaksanaan _ceremony_ kolaboratif seperti _daily standup_, _sprint review_, dan _retrospective_ [[10]](#ref-10) dinilai tidak sesuai dengan konteks pengembangan individu. Kedua, selama proses pengembangan berlangsung, pengembang seringkali menerima umpan balik secara langsung dan informal dari pengguna melalui media komunikasi seperti WhatsApp, yang memerlukan respons cepat berupa _hotfix_ maupun perbaikan minor tanpa harus menunggu siklus sprint formal [[23]](#ref-23). Ketiga, metode PXP memberikan fleksibilitas yang lebih tinggi dalam hal perencanaan dan eksekusi iterasi, di mana pengembang dapat menyesuaikan ruang lingkup dan durasi setiap iterasi secara dinamis sesuai dengan kebutuhan dan prioritas yang berkembang di lapangan [[9]](#ref-9). Karakteristik-karakteristik tersebut menjadikan PXP sebagai metode yang paling adaptif dan relevan untuk konteks pengembangan pada penelitian ini. Penerapan metode ini bertujuan untuk menghasilkan produk perangkat lunak yang optimal melalui serangkaian praktik inti, antara lain: penerapan pengujian secara berkelanjutan (_continuous testing_) [[17]](#ref-17), perancangan struktur kode yang terorganisasi (_structured layout_) [[7]](#ref-7), refaktorisasi kode secara berkala (_code refactoring_) [[11]](#ref-11), desain sistem yang sederhana dan tidak _over-engineered_ (_simple design_) [[27]](#ref-27), penerapan standar penulisan kode yang konsisten (_coding standards_) [[27]](#ref-27), serta perencanaan rilis yang terukur (_release planning_) [[18]](#ref-18). Praktik-praktik tersebut diterapkan agar sistem yang dikembangkan memiliki tingkat pemeliharaan yang tinggi (_high maintainability_) [[4]](#ref-4), mudah untuk diperbaiki dan dikembangkan lebih lanjut (_scalable_), serta tidak menimbulkan kerusakan atau regresi terhadap fungsionalitas yang telah berjalan dan teruji sebelumnya.

![Gambar 3.2 Alur Siklus Personal Extreme Programming (PXP)](/imageresearch/XP.png)
_Gambar 3.2 Alur Siklus Personal Extreme Programming (PXP)_

### 3.1.2 Fase Pengembangan dan Pemetaan Iterasi

Dalam konteks Personal Extreme Programming, setiap siklus iterasi menghasilkan sebuah _working increment_ yang dapat langsung diuji dan dievaluasi. Pendekatan ini sejalan dengan prinsip dasar Agile Manifesto [[1]](#ref-1), yakni mengutamakan perangkat lunak yang berfungsi (_working software_) di atas dokumentasi yang komprehensif, serta merespons perubahan di atas mengikuti rencana yang telah ditetapkan. Setiap iterasi pada metode PXP meliputi tahapan perencanaan (_planning_), perancangan (_design_), pengkodean (_coding_), pengujian (_testing_), dan evaluasi (_review_), yang dilaksanakan secara berulang hingga seluruh kebutuhan fungsional dan non-fungsional sistem terpenuhi.

## 3.2 Analisis dan Perancangan Kebutuhan Sistem

Sebelum memasuki tahap implementasi iteratif secara penuh, dilaksanakan proses analisis kebutuhan sistem serta perancangan awal arsitektur perangkat lunak sebagai bagian dari fase _exploration_ dalam siklus Personal Extreme Programming [[3]](#ref-3). Tahapan ini bertujuan untuk memperoleh pemahaman terhadap kebutuhan fungsional (_functional requirements_) maupun kebutuhan non-fungsional (_non-functional requirements_) [[4]](#ref-4), sekaligus menetapkan batasan ruang lingkup sistem yang akan dikembangkan. Proses analisis ini dilaksanakan melalui metode wawancara tidak terstruktur (_unstructured interview_) serta observasi langsung (_direct observation_) [[24]](#ref-24) terhadap alur kerja operasional tenaga administrasi di lingkungan madrasah, guna mengidentifikasi _pain points_, kebutuhan aktual, serta _user stories_ yang merepresentasikan nilai fungsional bagi pengguna akhir. Hasil dari proses analisis tersebut kemudian direpresentasikan melalui sebuah _Use Case Diagram_ yang disusun mengikuti notasi standar _Unified Modeling Language_ (UML) versi 2.x [[21]](#ref-21), sebagai acuan utama selama siklus pengembangan berlangsung.

### 3.2.1 Identifikasi Aktor Sistem

Berdasarkan hasil analisis terhadap karakteristik pengguna serta pemetaan alur kerja administratif pada lingkungan institusi pendidikan madrasah, sistem SIAKAD Madrasah mengidentifikasi dua jenis aktor, yaitu **Admin Sekolah** sebagai aktor utama dan **Client/Wali Murid/Guru** sebagai aktor sekunder dengan akses terbatas. Admin Sekolah bertindak sebagai _super user_ dengan kewenangan akses penuh terhadap seluruh modul dan fungsionalitas yang disediakan oleh sistem, termasuk pengelolaan data, konfigurasi sistem, serta seluruh operasi yang memerlukan autentikasi. Sementara itu, aktor Client/Wali Murid/Guru memiliki akses terbatas hanya pada fitur lihat nilai siswa yang dapat diakses tanpa melalui proses _login_, sebagaimana kebutuhan yang teridentifikasi di lapangan agar guru, wali murid, atau pihak sekolah lainnya dapat melihat data nilai secara langsung, misalnya untuk keperluan presentasi atau pengecekan cepat, tanpa harus masuk ke dalam sistem secara penuh.

Meskipun terdapat dua aktor, arsitektur sistem tetap dirancang secara sederhana tanpa menerapkan _Role-Based Access Control_ (RBAC) berlapis yang memerlukan struktur organisasi yang lebih kompleks [[4]](#ref-4). Pemisahan akses cukup dilakukan melalui satu fitur kondisional (`«extend»`) pada _Use Case Diagram_, bukan melalui sistem manajemen peran yang terpisah. Pendekatan ini sejalan dengan prinsip _simple design_ dalam Extreme Programming [[27]](#ref-27) yang menekankan untuk menghindari _over-engineering_ terhadap kebutuhan yang belum tervalidasi pada fase awal pengembangan, serta prinsip _You Ain't Gonna Need It_ (YAGNI) [[2]](#ref-2) dalam metodologi Extreme Programming.

### 3.2.2 Pemodelan Use Case Diagram

Pemodelan kebutuhan fungsional sistem direpresentasikan dalam bentuk _Use Case Diagram_ yang menggambarkan interaksi antara aktor Admin Sekolah dengan seluruh fungsionalitas inti yang disediakan oleh sistem SIAKAD Madrasah. Diagram ini disusun menggunakan notasi standar UML 2.x [[21]](#ref-21) yang meliputi elemen aktor, _use case_, batas sistem, asosiasi antar aktor dan _use case_, serta relasi `«include»` dan `«extend»`. Relasi `«include»` digunakan untuk menggambarkan fungsionalitas yang bersifat wajib, sedangkan relasi `«extend»` digunakan untuk menggambarkan fungsionalitas yang bersifat opsional atau kondisional. Pemetaan lengkap kebutuhan fungsional yang berhasil diidentifikasi dari tahap analisis kebutuhan ditunjukkan pada Gambar 3.3 berikut.

![Gambar 3.3 Use Case Diagram Sistem Informasi Akademik Madrasah](/imageresearch/use-case-diagram-siakad-sekolahv3.png)
_Gambar 3.3 Use Case Diagram Platform Akademik Madrasah_

### 3.2.3 Deskripsi Fungsionalitas Sistem

Berdasarkan _Use Case Diagram_ yang telah dirancang, fungsionalitas inti sistem SIAKAD Madrasah dapat dikelompokkan ke dalam tiga domain fungsional utama, yaitu: (1) modul autentikasi dan otorisasi sebagai lapisan keamanan sistem, (2) modul _dashboard_ sebagai pusat navigasi utama, serta (3) modul pengelolaan data akademik yang mencakup seluruh operasi CRUD (_Create, Read, Update, Delete_) terhadap entitas akademik yang ada dalam sistem. Penjabaran masing-masing domain fungsional tersebut dijelaskan sebagai berikut.

**1) Modul Autentikasi dan Otorisasi.**
Sebelum memperoleh akses penuh ke dalam sistem, setiap Admin Sekolah diwajibkan untuk melalui proses autentikasi (_login_) sebagai mekanisme verifikasi identitas terhadap _credentials_ yang telah terdaftar pada basis data sistem. Proses autentikasi tersebut bersifat mandatori melalui relasi `«include»` terhadap _use case_ login, yang berarti bahwa seluruh akses terhadap modul pengelolaan data selalu melalui alur autentikasi. Pengecualian dari mekanisme ini adalah fitur lihat nilai siswa yang dapat diakses oleh aktor Client/Wali Murid/Guru tanpa autentikasi, sebagaimana dijelaskan pada deskripsi aktor di subbab 3.2.1. Pembuatan akun Admin dilakukan melalui mekanisme _seed data_ pada saat aplikasi pertama kali diinisialisasi, sehingga tidak terdapat halaman pendaftaran akun yang dapat diakses dari antarmuka pengguna.

**2) Modul Dashboard Utama.**
Setelah berhasil melalui proses autentikasi, admin akan diarahkan ke halaman _dashboard_ utama yang berfungsi sebagai pusat navigasi sistem untuk seluruh aktivitas administratif. Halaman _dashboard_ menyajikan ringkasan informasi seputar data operasional sekolah, serta berperan sebagai titik masuk menuju seluruh modul pengelolaan data yang tersedia di dalam sistem. Desain tata letak _dashboard_ mengikuti prinsip _information hierarchy_ serta _progressive disclosure_ [[6]](#ref-6), di mana elemen-elemen informasi yang paling sering diakses oleh pengguna ditempatkan pada posisi yang paling mudah dijangkau [[24]](#ref-24). Pendekatan ini bertujuan untuk meminimalkan beban kognitif pengguna serta memaksimalkan efisiensi alur kerja administratif harian.

**3) Modul Pengelolaan Data Akademik.**
Dari halaman _dashboard_ utama, admin dapat mengakses seluruh modul pengelolaan data yang mencakup operasi CRUD terhadap entitas-entitas akademik berikut:

a. **Kelola data sekolah**, profil institusi, logo, alamat, dan informasi kontak.
b. **Kelola data siswa**, data demografis siswa, data orang tua, data alamat, serta fitur _bulk upload_ melalui _file_ Excel.
c. **Kelola data guru**, profil guru, penugasan mengajar, serta pemetaan mata pelajaran yang diampu.
d. **Kelola mata pelajaran**, _master data_ kurikulum akademik.
e. **Kelola nilai siswa**, _input_ nilai per mata pelajaran serta _bulk upload_ nilai melalui template Excel.
f. **Kelola tahun ajaran**, periode akademik aktif dan pengaturan kalender akademik.
g. **Kelola kelas dan rombongan belajar**, pengelompokan kelas dan penempatan siswa.
h. **Cetak laporan**, ekspor data ke format PDF maupun Excel untuk kebutuhan pelaporan.
i. **Audit log**, pencatatan jejak aktivitas sistem untuk keperluan penelusuran dan akuntabilitas.
j. **Manajemen akun**, perubahan _username_ dan _password_.
k. **Logout**, terminasi sesi pengguna.

Selain fungsionalitas yang hanya dapat diakses oleh Admin Sekolah melalui autentikasi, terdapat satu _use case_ tambahan yang bersifat kondisional, yaitu **lihat nilai siswa**. Fitur ini memiliki relasi `«extend»` terhadap _use case_ _kelola nilai siswa_ dan dapat diakses oleh aktor Client/Wali Murid/Guru tanpa melalui proses _login_. Fitur ini disediakan berdasarkan kebutuhan di lapangan agar guru, wali murid, atau pihak sekolah lainnya dapat melihat data nilai siswa secara langsung untuk keperluan seperti presentasi atau pengecekan cepat tanpa harus masuk ke dalam sistem pengelolaan data secara penuh.

Seluruh domain fungsional tersebut saling terhubung melalui alur navigasi yang konsisten, sehingga admin dapat menjalankan seluruh aktivitas administratif dalam satu lingkungan aplikasi yang terintegrasi tanpa perlu berpindah antar aplikasi eksternal, sementara aktor Client/Wali Murid/Guru tetap dapat mengakses informasi nilai yang dibutuhkan secara langsung. Pemodelan _Use Case Diagram_ ini selanjutnya menjadi acuan utama bagi pengembang dalam menetapkan ruang lingkup pengembangan pada setiap iterasi Personal Extreme Programming.

## 3.3 Dokumentasi Iterasi Pengembangan

Seluruh hasil dari penerapan Agile Development pada penelitian ini didokumentasikan secara sistematis melalui sistem _version control_ menggunakan Git [[13]](#ref-13). Penggunaan Git sebagai alat bantu manajemen versi memungkinkan penelusuran terhadap setiap perubahan kode sumber (_source code_) yang terjadi selama proses pengembangan, sekaligus berfungsi sebagai bukti empiris adanya perkembangan dan evolusi sistem pada setiap iterasi. Riwayat perubahan tersebut terekam dalam bentuk _commit history_ yang mencakup identifikasi unik (_SHA hash_), pesan perubahan (_commit message_), serta stempel waktu (_timestamp_) dari setiap modifikasi yang dilakukan, sebagaimana ditunjukkan pada tabel berikut:

**Ringkasan Proyek:**

- Total commit: **491**
- Periode pengembangan: **15 November 2025 - 25 Februari 2026** (sekitar 3.5 bulan)
- Kontributor: **syauqi** (developer tunggal - Personal Extreme Programming)
- First commit SHA: `61714e4`, Latest commit SHA: `9ce922c`

### 3.3.1 Riwayat Iterasi Pengembangan

Riwayat iterasi pengembangan aplikasi SIAKAD Madrasah disusun berdasarkan hasil penelusuran retrospektif (_retrospective trace analysis_) terhadap seluruh _commit history_ yang tercatat pada repositori Git sepanjang siklus hidup pengembangan perangkat lunak. Pengelompokan _commit_ ke dalam iterasi dilakukan berdasarkan dua kriteria utama, yaitu: (1) kedekatan temporal (_temporal proximity_) antar _commit_ yang direpresentasikan melalui kontinuitas tanggal aktivitas _push_, serta (2) kesamaan tematik (_thematic cohesion_) terhadap fokus pengembangan fitur yang sedang dikerjakan pada periode tersebut. Pendekatan segmentasi ini sejalan dengan karakteristik _iteration boundary_ dalam Personal Extreme Programming [[3]](#ref-3), di mana batas antar iterasi ditentukan secara dinamis berdasarkan _working increment_ yang dihasilkan, bukan berdasarkan durasi sprint tetap layaknya Scrum [[10]](#ref-10). Setiap iterasi yang teridentifikasi kemudian didokumentasikan melalui enam atribut utama, yaitu: **nomor iterasi**, **periode waktu pelaksanaan**, **jumlah commit** yang dihasilkan, **SHA awal** (_initial commit hash_) yang menandai titik mulai iterasi, **SHA akhir** (_terminal commit hash_) yang menandai titik akhir iterasi, serta **fokus pengembangan** (_development focus_) yang merangkum tema fungsional yang dikerjakan pada iterasi tersebut. Atribut SHA hash ini berperan penting sebagai _immutable identifier_ yang memungkinkan dilakukannya _audit trail_ serta reproduksi _state_ repositori pada titik waktu tertentu (_point-in-time reproducibility_) [[13]](#ref-13), sehingga keseluruhan riwayat pengembangan dapat diverifikasi kembali secara independen oleh pihak ketiga (_third-party verifiability_). Hasil pengelompokan tersebut disajikan pada Tabel 3.1 berikut.

**Tabel 3.1 Riwayat Iterasi Pengembangan Aplikasi SIAKAD Madrasah**

| No  | Iterasi    | Periode             | Jumlah Commit | SHA Awal  | SHA Akhir | Fokus Pengembangan                                                                                                                                |
| --- | ---------- | ------------------- | :-----------: | --------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Iterasi 1  | 15  16 Nov 2025    |      51       | `61714e4` | `4bc80eb` | Inisialisasi proyek SvelteKit, pembuatan komponen navbar & sidebar, layout halaman utama, setup Express server, routing frontend, rombel sprint 1 |
| 2   | Iterasi 2  | 17  21 Nov 2025    |      64       | `97dd77d` | `0e16540` | Halaman data siswa, skeleton loader, fitur audit logs awal, perbaikan layout & styling, konfigurasi adapter Node.js                               |
| 3   | Iterasi 3  | 28 Nov  8 Des 2025 |      19       | `442c441` | `2add81a` | Fitur dropdown sidebar, koneksi data siswa ke backend, penambahan ikon & route, setup concurrently.js                                             |
| 4   | Iterasi 4  | 10  17 Des 2025    |      89       | `ca677d4` | `a33b61a` | Sistem autentikasi (login), integrasi database Drizzle ORM + SQLite, environment variable, fitur audit logs lengkap, layout dashboard             |
| 5   | Iterasi 5  | 20  21 Des 2025    |       8       | `fe59d6e` | `e8b9530` | Fitur kalender dashboard, pengaturan username, perbaikan UI                                                                                       |
| 6   | Iterasi 6  | 1  12 Jan 2026     |      72       | `d89fdeb` | `030b905` | Restrukturisasi data JSON, layout detail siswa, form input siswa, upload Excel (multer + exceljs), migrasi pnpm, schema relasional                |
| 7   | Iterasi 7  | 13  18 Jan 2026    |      54       | `ffff8c2` | `9685b74` | Desain schema nilai & mata pelajaran, rate limiter middleware, JWT auth, fitur template Excel, formulir alamat siswa                              |
| 8   | Iterasi 8  | 19  27 Jan 2026    |      36       | `e02df2c` | `fc65667` | Manajemen rombel (CRUD), manajemen nilai, bulk upload siswa, services rombel & kelas, komponen modal                                              |
| 9   | Iterasi 9  | 28  31 Jan 2026    |      40       | `386e53d` | `730df0e` | Fitur guru & penugasan, manajemen ujian, fitur kelulusan siswa, profil sekolah dengan upload logo, halaman error                                  |
| 10  | Iterasi 10 | 1  5 Feb 2026      |      27       | `ee1c24f` | `19478b2` | Refactoring kode & layout, bundling Electron.js untuk desktop app, build executable Windows, dokumentasi                                          |
| 11  | Iterasi 11 | 7  14 Feb 2026     |      19       | `da9942d` | `397d1cd` | Perbaikan bug, redesain halaman rombel & mutasi, class diagram UML, integrasi API tahun ajaran & kurikulum, seed data                             |
| 12  | Iterasi 12 | 22  25 Feb 2026    |      12       | `5e6ffdd` | `9ce922c` | Manajemen aset sekolah, migrasi database, seedfile auth, refactoring struktur folder, perbaikan file handler                                      |

### 3.3.2 Analisis Distribusi Commit

Berdasarkan data yang disajikan pada tabel di atas, dapat disimpulkan bahwa proses pengembangan aplikasi SIAKAD Madrasah dilaksanakan melalui **12 iterasi** pengembangan dalam kurun waktu kurang lebih 3,5 bulan dengan akumulasi total sebanyak **491 commit** yang tercatat pada repositori Git. Setiap iterasi memiliki ruang lingkup (_scope_) dan fokus pengembangan yang berbeda secara bertahap dan progresif, dimulai dari tahap inisialisasi proyek serta pengembangan antarmuka pengguna (_user interface_) pada sisi _frontend_ (Iterasi 1–2), dilanjutkan dengan pembangunan arsitektur _backend_ dan integrasi sistem basis data (Iterasi 3–5), kemudian implementasi fitur-fitur inti manajemen data siswa dan penilaian akademik (Iterasi 6–8), pengembangan fitur-fitur lanjutan seperti penugasan guru dan proses kelulusan (Iterasi 9), hingga tahap akhir yang meliputi proses _bundling_ aplikasi ke dalam format _desktop application_ serta pemeliharaan dan stabilisasi sistem secara menyeluruh (Iterasi 10–12).

![Gambar 3.4 Grafik Distribusi Commit per Iterasi](/imageresearch/chart-grafik-iterasi.png)
_Gambar 3.4 Grafik Distribusi Commit per Iterasi_
<!-- 
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
``` -->

Pola pengembangan yang bersifat iteratif dan inkremental tersebut menunjukkan penerapan metode Personal Extreme Programming (PXP) [[2]](#ref-2) secara konsisten sepanjang siklus hidup pengembangan perangkat lunak (_Software Development Life Cycle / SDLC_) [[5]](#ref-5), dengan mempertimbangkan kompleksitas dalam sistem penyimpanan data [[26]](#ref-26). Pada setiap iterasi, pengembang menghasilkan _working increment_ yang bersifat fungsional, dapat diuji secara langsung, serta siap untuk dievaluasi dan divalidasi terhadap kebutuhan pengguna. Variasi jumlah commit antar iterasi  termasuk iterasi pendek seperti Iterasi 3 (19 commit) dan Iterasi 5 (8 commit)  merupakan hal yang wajar dalam metode PXP [[27]](#ref-27), di mana durasi dan ruang lingkup setiap iterasi disesuaikan secara dinamis dengan kompleksitas fitur yang sedang dikembangkan, bukan ditentukan oleh panjang siklus sprint yang bersifat tetap. Pendekatan ini memastikan bahwa setiap penambahan fitur maupun perbaikan dilakukan secara terukur, terdokumentasi, dan tidak menimbulkan dampak regresi (_regression_) terhadap modul-modul yang telah berfungsi dengan baik pada iterasi sebelumnya.

### 3.3.3 Alur Version Control

![Gambar 3.5 Diagram Alur Version Control dengan Git](https://i.redd.it/nm1w0gnf2zh11.png)
_Gambar 3.5 Diagram Alur Version Control dengan Git_

## 3.4 Pengujian Sistem

Selanjutnya, pada tahap pengujian sistem, penelitian ini menerapkan metode _White-Box Testing_ [[7]](#ref-7) sebagai pendekatan verifikasi terhadap kualitas internal perangkat lunak. _White-Box Testing_, yang juga dikenal sebagai _structural testing_ atau _glass-box testing_ [[7]](#ref-7), merupakan metode pengujian yang dilakukan terhadap fungsi-fungsi spesifik pada level kode sumber (_source code level_) yang tidak terlihat secara langsung oleh pengguna akhir (_end-user_). Pengujian ini mencakup evaluasi terhadap logika internal program (_internal logic_), struktur percabangan kode (_branching structure_) [[14]](#ref-14), alur eksekusi program (_execution flow_), serta penanganan kondisi batas (_boundary condition handling_) [[15]](#ref-15). Penerapan metode _White-Box Testing_ [[8]](#ref-8) bertujuan untuk memastikan bahwa setiap komponen dan modul kode berfungsi sesuai dengan spesifikasi kebutuhan fungsional yang telah ditetapkan, terbebas dari _bug_ maupun kesalahan logika (_logic error_), serta memberikan mekanisme pencegahan secara dini (_early defect detection_) terhadap potensi _error_ yang mungkin muncul sebelum sistem memasuki fase _productionizing_ dalam siklus Agile Extreme Programming.

![Gambar 3.6 Ilustrasi Metode White-Box Testing](/imageresearch/testingdiffcomparison.png)
_Gambar 3.6 Ilustrasi Metode White-Box Testing_

### 3.4.1 Cakupan Pengujian

Pengujian dilaksanakan secara terfokus dan terstruktur pada beberapa fungsi kritis tertentu yang bersifat _memory-intensive_ dan memiliki kompleksitas pemrosesan data yang tinggi [[26]](#ref-26), sehingga berpotensi menyebabkan terjadinya kebocoran memori (_memory leak_) maupun penurunan kinerja sistem (_performance degradation_) [[16]](#ref-16). Secara spesifik, cakupan pengujian pada penelitian ini difokuskan pada dua fungsi utama, yaitu: (1) fungsi _upload_ dan _parsing_ data dari _file_ Excel, serta (2) proses pembuatan dan _rendering file template_ Excel secara dinamis. Pemilihan kedua fungsi tersebut sebagai objek pengujian didasarkan pada temuan empiris berupa _bug_ dan _unexpected behavior_ yang terjadi ketika pengguna mengunggah _file_ Excel dengan format, struktur kolom, atau tipe data yang tidak sesuai dengan ketentuan dan validasi yang telah ditetapkan oleh sistem.

Alur pengujian untuk fungsi _upload_ Excel diilustrasikan pada Gambar 3.7. Proses dimulai dengan menyiapkan _mock_ terhadap dependensi yang dibutuhkan, yaitu koneksi _database_ melalui Drizzle ORM beserta definisi skema tabelnya, serta _library_ ExcelJS yang digunakan untuk membaca _file_ Excel. Tujuan dari _mocking_ ini adalah agar pengujian berjalan secara terisolasi tanpa bergantung pada _database_ atau _file_ yang sebenarnya. Setelah dependensi disiapkan, data uji berupa _buffer file_ Excel dimuat dan fungsi `createBulkStudentsFromExcel()` dieksekusi.

Pada tahap pemrosesan, fungsi tersebut menjalankan tiga operasi secara berurutan di dalam satu transaksi: membaca isi _sheet_ Excel, mengekstrak 18 _field_ data siswa dari setiap baris, dan memetakan nama kolom Excel ke nama _field_ yang sesuai di _database_ misalnya kolom "Pekerjaan Ayah" dipetakan menjadi _field_ `occupation`, bukan `job`. Setelah pemrosesan selesai, hasil keluaran diverifikasi melalui beberapa pengecekan: apakah fungsi `insert()` dipanggil dengan jumlah yang benar untuk setiap tabel (data siswa, data orang tua, dan data alamat), apakah pemetaan _field_ sudah tepat, dan apakah `studentId` yang dihasilkan terhubung dengan benar antar tabel. Jika seluruh pengecekan terpenuhi, pengujian dinyatakan _pass_; jika tidak, pengujian dinyatakan _fail_ dan proses dihentikan.

![Gambar 3.7 Alur Pengujian Fungsi Upload dan Template Excel](/imageresearch/flowchart-unittestflow.drawio.png)
_Gambar 3.7 Alur Pengujian Fungsi Upload dan Template Excel_

### 3.4.2 Skenario dan Hasil Pengujian

Seluruh skenario pengujian dieksekusi menggunakan _framework_ Jest sebagai _test runner_ dan _assertion library_. Dengan teknik _mocking_ yang telah diuraikan pada subbab 3.4.1, setiap fungsi diuji terhadap tiga aspek utama _white-box testing_ [[8]](#ref-8): logika internal fungsi, ketepatan pemetaan _field_ dari kolom Excel ke kolom _database_, serta alur percabangan kode (_branching logic_) ketika menerima variasi input yang berbeda.

Berikut adalah skenario pengujian _white-box_ yang dilaksanakan beserta hasil yang diperoleh:

**Tabel 3.2 Unit Test  Fungsi `createBulkStudentsFromExcel()`**

| No  | Test Case                                                          | Fungsi yang Diuji               | Aspek White-Box yang Diverifikasi                                                                                                                                                                                                                                                                                           | Status |
| --- | ------------------------------------------------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Parsing Excel dan insert seluruh field data siswa                  | `createBulkStudentsFromExcel()` | Verifikasi bahwa seluruh 18 field siswa (termasuk `previousSchool`, `phoneNumber`, `childOrder`, `siblingsCount`, `nationality`, `livingWith`, `transportation`, `bpjs`, `idCardNumber`, `birthCertificateNumber`) ter-_mapping_ dengan benar dari kolom Excel ke parameter `insert()` database  bukan hanya 7 field dasar | Pass   |
| 2   | Pemetaan field Ayah: `job` → `occupation`, `phone` → `phoneNumber` | `createBulkStudentsFromExcel()` | Verifikasi bahwa logika _field mapping_ internal mengonversi nama field Excel (`Ayah - Pekerjaan`, `Ayah - No. HP`) ke nama kolom database (`occupation`, `phoneNumber`) secara benar, termasuk `nik`, `birthPlace`, `birthYear`, `education`, `monthlyIncome`, `isAlive`                                                   | Pass   |
| 3   | Pemetaan field Ibu: `job` → `occupation`, `phone` → `phoneNumber`  | `createBulkStudentsFromExcel()` | Verifikasi logika _field mapping_ yang sama untuk data Ibu, memastikan tidak terjadi _regression_ pada _mapping_ yang identik dengan data Ayah                                                                                                                                                                              | Pass   |
| 4   | Insert data alamat dari kolom Excel                                | `createBulkStudentsFromExcel()` | Verifikasi bahwa field alamat (`street`, `houseNumber`, `rt`, `rw`, `village`, `subDistrict`, `postalCode`) ter-_insert_ ke tabel alamat dengan `studentId` yang benar dari hasil _returning_ insert siswa                                                                                                                  | Pass   |


**Tabel 3.3 Unit Test  Fungsi `createStudentData()` dan `createStudentdataInputExcelBulkGenerator()`**

| No  | Test Case                                                    | Fungsi yang Diuji                            | Aspek White-Box yang Diverifikasi                                                                                                                                                                                                               | Status |
| --- | ------------------------------------------------------------ | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Create student beserta data orang tua dalam satu transaksi   | `createStudentData()`                        | Verifikasi bahwa fungsi mengeksekusi tepat 3 kali `insert()` dalam satu `transaction()` (siswa, ayah, ibu), dan `studentId` dari hasil insert pertama diteruskan ke insert kedua dan ketiga melalui _mock chain_ `returning().get()`            | Pass   |
| 2   | Generate template Excel dengan header dan styling yang benar | `createStudentdataInputExcelBulkGenerator()` | Verifikasi struktur internal _workbook_: keberadaan worksheet `Data Siswa Bulk Upload`, header kolom (`Nama Siswa`, `NISN`, `Alamat - Jalan`, `Ayah - Nama`, `Ibu - Nama`), serta properti styling (`font.bold`, `fill.type`) pada baris header | Pass   |


**Tabel 3.4 Unit Test  Fungsi `registerRombel()`**

| No  | Test Case                                       | Fungsi yang Diuji  | Aspek White-Box yang Diverifikasi                                                                                                                                                                                                                                    | Status |
| --- | ----------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Register rombel dengan data siswa lengkap       | `registerRombel()` | Verifikasi bahwa fungsi memanggil `insert()` tepat 2 kali dalam `transaction()` (insert rombel + insert batch siswa), `rombelId` dari hasil `returning().all()` diteruskan ke setiap record siswa, dan `update()` dipanggil 1 kali untuk sinkronisasi `studentTable` | Pass   |
| 2   | Register rombel tanpa data siswa (array kosong) | `registerRombel()` | Verifikasi alur percabangan: ketika `payload.siswa` berupa array kosong, fungsi hanya memanggil `insert()` tepat 1 kali (hanya insert rombel, tanpa insert siswa)                                                                                                    | Pass   |


**Tabel 3.5 Unit Test  Fungsi `generateBulkScoreTemplate()`**

| No  | Test Case                                                          | Fungsi yang Diuji             | Aspek White-Box yang Diverifikasi                                                                                                                                                                                                                                           | Status |
| --- | ------------------------------------------------------------------ | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 1   | Generate template nilai dengan header mata pelajaran dari database | `generateBulkScoreTemplate()` | Verifikasi bahwa fungsi mengambil data mata pelajaran melalui `select().from()` (di-_mock_ dengan data `Matematika`, `IPA`), kemudian menyusun header worksheet `Bulk Scores` berupa `['NISN', 'Nama Siswa', 'Matematika', 'IPA']` secara dinamis berdasarkan data tersebut | Pass   |


Seluruh pengujian dieksekusi melalui Jest pada _Command Line Interface_ (CLI) dengan perintah `npx jest` pada lingkungan pengembangan lokal. Dependensi eksternal (database dan _library_ ExcelJS) di-_mock_ menggunakan `jest.unstable_mockModule()` agar pengujian bersifat deterministik dan tidak bergantung pada koneksi database aktif [[15]](#ref-15).

### 3.4.3 Tujuan Pengujian

Dengan demikian, pengujian dalam penelitian ini dilaksanakan secara preventif (_preventive testing_) [[17]](#ref-17) sebagai bagian integral dari praktik _quality assurance_ [[4]](#ref-4) dalam metodologi Personal Extreme Programming, guna mencegah terjadinya _defect_ dan _bug_ pada fase _productionizing_, meminimalkan risiko kegagalan sistem pada lingkungan produksi (_production environment_), sekaligus memastikan bahwa keseluruhan basis kode (_codebase_) yang dihasilkan tetap memenuhi standar kualitas, dapat dipelihara dengan baik (_maintainable_) [[8]](#ref-8), serta mudah dikembangkan lebih lanjut (_extensible_) dalam jangka panjang [[21]](#ref-21).

## 3.5 Pemeliharaan dan Umpan Balik Pengguna

Dalam penerapan metode Agile, proses pengembangan perangkat lunak tidak bersifat statis melainkan selalu terbuka terhadap adanya revisi, perubahan, maupun umpan balik (_feedback_) dari pengguna. Hal ini merupakan bagian yang wajar dan bahkan diharapkan dalam siklus Agile, karena salah satu nilai inti dari Agile Manifesto adalah kolaborasi dengan pengguna serta kemampuan untuk merespons perubahan secara cepat. Pada penelitian ini, umpan balik yang diterima dari pengguna memiliki dampak yang cukup signifikan terhadap arah pengembangan perangkat lunak, karena setiap masukan dan keluhan yang ditemukan perlu segera ditindaklanjuti dan diintegrasikan ke dalam sistem pada iterasi berikutnya, agar aplikasi tetap sesuai dengan kebutuhan nyata pengguna di lapangan serta tetap memenuhi spesifikasi teknis yang telah ditetapkan sebelumnya.

Pengumpulan umpan balik dilakukan menggunakan metode yang sama dengan tahap analisis kebutuhan pada subbab 3.2, yaitu wawancara tidak terstruktur dan observasi langsung. Pada konteks pemeliharaan ini, wawancara dilaksanakan melalui komunikasi informal melalui WhatsApp dengan tenaga administrasi sekolah yang menggunakan aplikasi SIAKAD Madrasah dalam kegiatan operasional sehari-hari. Media ini memungkinkan pengguna menyampaikan keluhan dan saran secara langsung tanpa terikat pada format kuesioner, sehingga informasi yang diperoleh mencerminkan pengalaman nyata di lapangan. Selain itu, pengembang juga mengamati langsung bagaimana pengguna berinteraksi dengan aplikasi pada saat proses instalasi maupun penggunaan fitur tertentu, guna mengidentifikasi kendala yang mungkin tidak tersampaikan secara verbal.

Selama proses pengembangan berlangsung, terdapat dua kategori utama umpan balik yang diterima dari pengguna, yaitu: (1) kesulitan dalam memahami dan menggunakan fitur tertentu pada aplikasi, serta (2) kendala pada proses instalasi dan penggunaan awal aplikasi. Kedua kategori umpan balik tersebut menjadi bahan evaluasi yang penting bagi pengembang untuk melakukan perbaikan pada iterasi selanjutnya.

### 3.5.1 Umpan Balik Fitur Upload Excel

Umpan balik pertama berkaitan dengan fitur _upload_ Excel pada halaman Data Siswa yang pada versi awal tidak dilengkapi dengan keterangan atau petunjuk penggunaan yang memadai [[25]](#ref-25). Tombol-tombol yang tersedia pada antarmuka tidak memiliki _tooltip_ maupun penjelasan tambahan mengenai fungsinya, sehingga pengguna awam, khususnya tenaga administrasi sekolah yang menjadi pengguna utama aplikasi ini, merasa kesulitan dalam memahami alur penggunaan fitur tersebut [[24]](#ref-24). Pengguna tidak mengetahui tombol mana yang harus ditekan terlebih dahulu, apa yang perlu diunduh, dan bagaimana cara mengunggah data siswa melalui _file_ Excel. Berdasarkan umpan balik tersebut, pengembang kemudian melakukan perbaikan pada sisi _frontend_ di halaman Data Siswa (`siswa/+page.svelte`) dengan menambahkan _tooltip_ pada tombol "Unduh Template" yang berisi keterangan tambahan berupa penjelasan singkat mengenai fungsi tombol, yaitu mengunduh _file_ template `.xlsx` kosong yang telah diformat sesuai struktur data sistem, untuk kemudian diisi dan diunggah kembali melalui tombol "Upload Excel". Dengan penambahan _tooltip_ tersebut, pengguna dapat memahami alur penggunaan fitur secara mandiri tanpa memerlukan panduan eksternal. Perubahan ini dilakukan sebagai bentuk penerapan prinsip _user-centered design_ [[6]](#ref-6), di mana antarmuka aplikasi harus dirancang berdasarkan sudut pandang dan tingkat pemahaman pengguna akhir.

![Gambar 3.8 Perubahan Label Fitur Upload Excel (Sebelum dan Sesudah)](/imageresearch/imagea11y.png)
_Gambar 3.8 Perubahan Label Fitur Upload Excel (Sebelum dan Sesudah)_

### 3.5.2 Umpan Balik Mekanisme Instalasi Aplikasi

Umpan balik kedua berkaitan dengan proses instalasi aplikasi pada versi rilis awal (versi 1.0). Pada versi tersebut, aplikasi dijalankan melalui sebuah _batch file_ (.bat) yang harus ditemukan dan dieksekusi secara manual oleh pengguna. Mekanisme ini menimbulkan kesulitan bagi pengguna awam di pihak sekolah, karena tidak terbiasa mencari dan menjalankan _file_ dengan ekstensi .bat di dalam struktur folder komputer. Selain itu, tampilan _command prompt_ yang muncul saat menjalankan _batch file_ juga memberikan kesan yang kurang ramah dan membingungkan bagi pengguna non-teknis. Berdasarkan temuan tersebut, kemudian diberlakukan perubahan terhadap mekanisme distribusi aplikasi dengan beralih menggunakan Electron.js sebagai _runtime environment_ untuk membungkus (_bundling_) aplikasi web ke dalam format aplikasi desktop [[18]](#ref-18). Proses distribusi selanjutnya menggunakan NSIS (_Nullsoft Scriptable Install System_) sebagai _installer builder_, yang menghasilkan sebuah _file_ Setup .exe yang dapat diinstal oleh pengguna melalui proses instalasi standar layaknya aplikasi desktop pada umumnya. Dengan pendekatan ini, pengguna tidak lagi perlu mencari dan menjalankan _batch file_ secara manual, melainkan cukup melakukan instalasi sekali melalui _installer_ yang telah disediakan, kemudian menjalankan aplikasi melalui _shortcut_ yang secara otomatis tersedia pada desktop maupun menu Start Windows. Perubahan ini secara signifikan meningkatkan kemudahan penggunaan (_usability_) dan pengalaman pengguna (_user experience_) dalam mengakses aplikasi, khususnya bagi pengguna non-teknis di lingkungan sekolah.

![Gambar 3.9 Perubahan Mekanisme Distribusi Aplikasi (Batch File ke Electron Installer)](/imageresearch/deploymentdiagram.png)
_Gambar 3.9 Perubahan Mekanisme Distribusi Aplikasi (Batch File ke Electron Installer)_

**Tabel Perbandingan Mekanisme Deployment v1.0 vs v2.0+**

| Aspek | v1.0 (Batch File) | v2.0+ (Electron) |
| --- | --- | --- |
| Distribution | run.bat | Setup.exe (NSIS) |
| Execution env | Node.js (exposed) | Electron (bundled) |
| UI | Terminal + Browser | Native desktop window |
| DB location | Project folder | %APPDATA% (isolated) |
| Uninstall | Manual delete | Add/Remove Programs |
| Setup Time | 5-10 minutes | ~2 minutes |
| Success Rate | ~30% | ~95% |

### 3.5.3 Kesimpulan Umpan Balik

Kedua umpan balik tersebut menunjukkan bahwa penerapan metode Agile [[1]](#ref-1), khususnya Personal Extreme Programming [[3]](#ref-3), memungkinkan pengembang untuk merespons kebutuhan dan keluhan pengguna secara cepat dan tepat sasaran. Setiap perubahan yang dilakukan berdasarkan umpan balik pengguna langsung diimplementasikan pada iterasi berikutnya, sehingga aplikasi terus mengalami peningkatan kualitas secara bertahap sesuai dengan prinsip _continuous improvement_ dalam metodologi Agile [[1]](#ref-1).

---

## Referensi Bab 3

<!-- Referensi buku (format sesuaikan dengan panduan skripsi kampus) -->

<a id="ref-1"></a>**[1]** Beck, K., et al. (2001). _Manifesto for Agile Software Development_. Agile Alliance. [ref](https://agilemanifesto.org/)

<a id="ref-2"></a>**[2]** Beck, K. (1999). _Extreme Programming Explained: Embrace Change_. Addison-Wesley. [ref](https://ptgmedia.pearsoncmg.com/images/9780321278654/samplepages/9780321278654.pdf)

<a id="ref-3"></a>**[3]** Dzhurov, Y., Krasteva, I., & Huber, S. (2009). _Personal Extreme Programming – An Agile Process for Autonomous Developers_. Proceedings of the International Conference on Software, Services & Semantic Technologies.

<a id="ref-4"></a>**[4]** Pressman, R. S. (2014). _Software Engineering: A Practitioner's Approach_ (8th ed.). McGraw-Hill Education. [ref](https://whyphi.staff.telkomuniversity.ac.id/files/2016/01/ebook-pressman-sw-engineering.pdf)

<a id="ref-5"></a>**[5]** Sommerville, I. (2016). _Software Engineering_ (10th ed.). Pearson Education. [ref](https://repo.darmajaya.ac.id/4705/1/Software%20Engineering%2C%2010th%20Edition%20%28%20PDFDrive%20%29.pdf)

<a id="ref-6"></a>**[6]** Norman, D. A. (2013). _The Design of Everyday Things_ (Revised ed.). Basic Books. [ref](https://dl.icdst.org/pdfs/files4/4bb8d08a9b309df7d86e62ec4056ceef.pdf)

<a id="ref-7"></a>**[7]** McConnell, S. (2004). _Code Complete: A Practical Handbook of Software Construction_ (2nd ed.). Microsoft Press. [ref](http://aroma.vn/web/wp-content/uploads/2016/11/code-complete-2nd-edition-v413hav.pdf)

<a id="ref-8"></a>**[8]** Martin, R. C. (2008). _Clean Code: A Handbook of Agile Software Craftsmanship_. Prentice Hall. [ref](https://github.com/jnguyen095/clean-code/blob/master/Clean.Code.A.Handbook.of.Agile.Software.Craftsmanship.pdf)

<a id="ref-9"></a>**[9]** Larman, C. (2004). _Agile and Iterative Development: A Manager's Guide_. Addison-Wesley Professional. ISBN: 978-0131111554.

<a id="ref-10"></a>**[10]** Schwaber, K., & Sutherland, J. (2020). _The Scrum Guide: The Definitive Guide to Scrum_. Scrum.org. [ref](https://scrumguides.org/docs/scrumguide/v2020/2020-Scrum-Guide-US.pdf)

<a id="ref-11"></a>**[11]** Fowler, M. (1999). _Refactoring: Improving the Design of Existing Code_. Addison-Wesley. [ref](https://silab.fon.bg.ac.rs/wp-content/uploads/2016/10/Refactoring-Improving-the-Design-of-Existing-Code-Addison-Wesley-Professional-1999.pdf)

<a id="ref-12"></a>**[12]** Evans, E. (2003). _Domain-Driven Design: Tackling Complexity in the Heart of Software_. Addison-Wesley. [ref](https://fabiofumarola.github.io/nosql/readingMaterial/Evans03.pdf)

<a id="ref-13"></a>**[13]** Chacon, S., & Straub, B. (2014). _Pro Git_ (2nd ed.). Apress. [ref](https://git-scm.com/book/en/v2)

<a id="ref-14"></a>**[14]** ISO/IEC/IEEE 29119-1:2022. _Software and Systems Engineering - Software Testing - Part 1: Concepts and Definitions_. International Organization for Standardization. [ref](https://www.iso.org/standard/81291.html)

<a id="ref-15"></a>**[15]** Ammann, P., & Offutt, J. (2016). _Introduction to Software Testing_ (2nd ed.). Cambridge University Press. [ref](https://ebooks.allfree-stuff.com/eBooks_down/Software%20Testing/Introduction%20to%20Software%20Testing.pdf)

<a id="ref-16"></a>**[16]** Whittaker, J. A. (2002). _How to Break Software: A Practical Guide to Testing_. Addison-Wesley. [ref](http://www.math.uaa.alaska.edu/~afkjm/cs470/handouts/breaking.pdf)

<a id="ref-17"></a>**[17]** Pezze, M., & Young, M. (2008). _Software Testing and Analysis: Process, Principles and Techniques_. Wiley. [ref](https://ix.cs.uoregon.edu/~michal/book/Samples/book.pdf)

<a id="ref-18"></a>**[18]** Humble, J., & Farley, D. (2010). _Continuous Delivery: Reliable Software Releases Through Build, Test, and Deployment Automation_. Addison-Wesley. [ref](<https://soclibrary.futa.edu.ng/books/Continuous%20Delivery%20Reliable%20Software%20Releases%20through%20Build,%20Test,%20and%20Deployment%20Automation%20by%20Jez%20Humble,%20David%20Farley%20(z-lib.org).pdf>)

<a id="ref-19"></a>**[19]** Sommerville, I. (2010). _Software Engineering_ (9th ed.). Addison-Wesley. [ref](https://www.mlsu.ac.in/econtents/16_EBOOK-7th_ed_software_engineering_a_practitioners_approach_by_roger_s._pressman_.pdf)

<a id="ref-20"></a>**[20]** Boehm, B. W. (1988). _A Spiral Model of Software Development and Enhancement_. IEEE Computer, 21(5), 61–72. [ref](https://cse.msu.edu/~cse435/Homework/HW3/boehm.pdf)

<a id="ref-21"></a>**[21]** Gamma, E., Helm, R., Johnson, R., & Vlissides, J. (1994). _Design Patterns: Elements of Reusable Object-Oriented Software_. Addison-Wesley. [ref](https://www.javier8a.com/itc/bd1/articulo.pdf)

<a id="ref-22"></a>**[22]** Cockburn, A. (2004). _Crystal Clear: A Human-Powered Methodology for Small Teams_. Addison-Wesley Professional. ISBN: 978-0201699470.

<a id="ref-23"></a>**[23]** Highsmith, J. (2000). _Adaptive Software Development: A Collaborative Approach to Managing Complex Systems_. Dorset House. [ref](https://ptgmedia.pearsoncmg.com/images/9780133489460/samplepages/0133489469.pdf)

<a id="ref-24"></a>**[24]** Nielsen, J. (1994). _Usability Engineering_. Morgan Kaufmann Publishers. ISBN: 978-0125184069.

<a id="ref-25"></a>**[25]** Krug, S. (2014). _Don't Make Me Think: A Common Sense Approach to Web Usability_ (3rd ed.). New Riders. [ref](https://dn790002.ca.archive.org/0/items/SteveKrugDontMakeMeThink/Steve_Krug_Don%E2%80%99t_Make_Me_Think%2C.pdf)

<a id="ref-26"></a>**[26]** Kleppmann, M. (2017). _Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems_. O'Reilly Media. [ref](https://repo.darmajaya.ac.id/4191/1/Designing%20Data-Intensive%20Applications_%20The%20Big%20Ideas%20Behind%20Reliable%2C%20Scalable%2C%20and%20Maintainable%20Systems%20%28%20PDFDrive%20%29.pdf)

<a id="ref-27"></a>**[27]** Abrahamsson, P., Salo, O., Ronkainen, J., & Warsta, J. (2002). _Agile Software Development Methods: Review and Analysis_. VTT Publications 478. VTT Technical Research Centre of Finland. <!-- TODO: verify details & add ref link -->

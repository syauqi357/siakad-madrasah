BAB 2 LANDASAN TEORI

```
BAB 2 LANDASAN TEORI
├── 2.1 Penelitian Sebelumnya
├── 2.2 Pengertian Sistem Informasi
├── 2.3 Definisi Sistem Manajemen Akademik
├── 2.4 Definisi Agile Extreme Programming
├── 2.5 Javascript
│   ├── 2.5.1 Node.js
│   ├── 2.5.2 Express.js
│   ├── 2.5.3 Svelte.js
│   └── 2.5.4 ES Modules (ECMAScript Modules)
├── 2.6 SQLite
├── 2.7 Unified Modeling Language (UML)
│   ├── 2.7.1 Use Case Diagram
│   └── 2.7.2 Flowchart (Diagram Alur)
└── Referensi Bab 2


```

---

## 2.1 Penelitian Sebelumnya

Dalam penelitian sebelumnya oleh Nita Ayunandita, Sampurna Dadi Riskiono pada Juli tahun 2021 yang di rilis oleh Jurnal Informatika dan Rekayasa Perangkat Lunak (JATIKA), Vol: 2, No: 2 dengan penelitian serta implementasi terhadap Permodelan Sistem Informasi Akademik Menggunakan Extreme Programming Pada Madrasah Aliyah (MA) Mambaul Ulum Tanggamus yang mampu menghasilkan pengujian teknologi Sistem Informasi Akademik pada Madrasah Aliyah Mambaul Ulum Tanggamus menggunakan Technology Acceptance Model (TAM) didapatkan hasil bahwa 85% pengguna setuju bahwa Sistem Informasi Akademik pada Madrasah Aliyah Mambaul Ulum Tanggamus memiliki kegunaan atau bermanfaat, kemudian 85% pengguna setuju bahwa aplikasi tersebut mudah untuk digunakan dalam penelitiannya, penelitian yang di lakukan oleh Nita Ayunandita dan Sampurna Dadi Riskiono ini dapat menjadi referensi untuk penelitian terkait sistem akademik, namun terdapat kekurangan pada bagian system Bahasa dan mekanisme serta pengalaman pengguna (user experience) yang minim dalam kekurangan ini menjadi pertimbangan pada pengembangan platform akademik madrasah pada MTs. Al-Hasyimiy Raci (Ayunandita & Dadi Riskiono, 2021).

Selanjutnya pada penelitian yang di lakukan pada tahun 2023 oleh jurnal Testing dan Implementasi Sistem Informasi Vol 1 (1) 2023 : 53-66, yang di lakukan oleh Tata Ayunita Pertiwi, Nanda Try Luchia, Preti Sinta, Rachell Aprinastya, Annisa Dahlia, Irgie Rachmat Fachrezi dengan penelitian Perancangan Dan Implementasi Sistem Informasi Absensi Berbasis Web Menggunakan Metode Agile Software Development Web-Based yang telah berhasil mencapai analisis sistem yang sedang berjalan pada DISPERDAGKOPUMK Kab. Kampar memiliki beberapa permasalahan dan hambatan, dengan adanya analisa usulan baru diharapkan memberikan solusi serta gambaran sistem yang lebih baik. dengan dibangunnya sistem informasi absensi pegawai dimaksudkan untuk mempermudah jalannya absensi kepegawaian di DISPERDAGKOPUMK Kab. Kampar tanpa adanya kecurangan dan kesalahan saat melakukan absen bagi para pegawai, hasil penelitian ini mampu menjadi salah satu referensi yang relevan untuk pengembangan agile yang memiliki hubungan sebagai iterasi dalam maintenance dan pengembangan yang lebih dinamis serta efisien pada sejumlah fitur dan kasus (Pertiwi et al., 2023).

Pada penelitian yang di lakukan oleh jurnal BIIKMA : Buletin Ilmiah Ilmu Komputer dan Multimedia Volume 2, No. 1 oleh Salsa Khoirunnisa, Muhammad Adlan El Fatih, Bagus Sadjiwo, dan Saprudin dengan penelitian Perancangan Sistem Informasi Dan Pendaftaran Online Di SMK IQRO Berbasis Web Dengan Metode Agile pada Juni Tahun 2024 yang telah berhasil merancang dan mengimplementasikan sistem informasi dan pendaftaran online berbasis web di SMK Iqro menggunakan metode Agile. Metode Agile dipilih dalam jurnal ini karena kemampuan fleksibilitas dalam mengakomodasi perubahan dan feedback atau timbal balik secara cepat serta berfokus pada kebutuhan pengguna. Sistem ini dirancang untuk mempermudah proses pendaftaran siswa baru, mengelola data siswa, dan menyediakan informasi secara real-time kepada pihak sekolah dan calon siswa. Pengembangan sistem melibatkan beberapa tahap, termasuk perencanaan, desain, pengkodean, pengujian, dan implementasi. Hasil dari penelitian ini menunjukkan bahwa penerapan sistem informasi dan pendaftaran online dapat meningkatkan efisiensi operasional sekolah, meminimalisir kesalahan data, serta memberikan kemudahan akses informasi bagi semua pihak terkait. hasil penelitian ini mampu menjadi salah satu referensi yang relevan dan cocok untuk permasalahan agile dalam pengembangan platform akademik madrasah yang sering berubah dan membutuhkan maintenance dan adaptif secara iterative. (Khoirunnisa et al., 2024).

Pada pengembangan sebuah aplikasi tentu membutuhkan metode untuk memberikan solusi, masalah yang dimiliki oleh MTs. Al-Hasyimiy adalah manajemen siswa yang sering tidak beraturan dan hilang secara tiba-tiba, maka platform akademik madrasah ini di buat untuk menjadi solusi dari masalah kehilangan data yang dapat dikerjakan secara iteratif dan fleksible, melihat masalah yang muncul serta permintaan dari MTs. Al-Hasyimiy menggunakan metode pendekatan agile dapat menjadi pertimbangan.

---

## 2.2 Pengertian Sistem Informasi

Sistem informasi menurut Ananda et al. merupakan suatu kesatuan yang terorganisir dan terdiri dari beberapa komponen seperti manusia, perangkat keras, perangkat lunak, jaringan komunikasi, dan basis data yang saling berinteraksi untuk melakukan sejumlah aktivitas seperti mengumpulkan, mengolah, menyimpan, serta mendistribusikan informasi dengan tujuan mendukung pengambilan keputusan yang baik, koordinasi, pengendalian, analisis, dan visualisasi dalam suatu organisasi (Ananda et al., 2024).

---

## 2.3 Definisi Sistem Manajemen Akademik

Menurut Dr. Anshu Malhotra (2023) sistem manajemen akademik merupakan solusi perangkat lunak komprehensif yang dirancang untuk menyederhanakan dan mengoptimalkan proses administratif serta akademik di dalam institusi pendidikan. Seiring dengan meningkatnya kompleksitas pengelolaan akademik, sistem ini telah muncul sebagai instrumen yang berharga untuk meningkatkan efisiensi, memperbaiki komunikasi, dan mengotomatisasi berbagai tugas. Melalui digitalisasi dan sentralisasi informasi, sistem manajemen akademik menyediakan platform terintegrasi bagi administrator, guru, dan staf untuk mengelola dan mengakses data serta sumber daya yang krusial (Sethi & Malhotra, 2023).

Sejalan dengan definisi tersebut, Sistem Informasi Manajemen (SIM) kelembagaan pendidikan dapat didefinisikan sebagai suatu sistem terintegrasi yang mengumpulkan, memproses, menyimpan, menganalisis, dan menyebarkan data serta informasi yang dibutuhkan untuk mendukung pengelolaan lembaga pendidikan ([Penulis], [Tahun]).

---

## 2.4 Definisi Agile Extreme Programming

Menurut pekka Abrahamson pada tahun 2002 agile memiliki 8 jenis konsep seperti scrum, crystal, Kanban dan berbagai macam konsep agile, untuk kasus ini konsep agile yang di adopsi dari awal pengembangan adalah extreme programming, konsep ini memiliki pendekatan dan teknis yang lebih mudah di fahami serta lebih fleksibel dan dapat di gunakan untuk single developer yang langsung B to B atau Business To Business dengan client, konsep Agile Extreme Programming sesuai dengan kondisi dari sekolah yang meminta untuk pengembangan platform akademik madrasah secara lokal.

![gambar agile extreme programming](/imageresearch/XP.png)
Gambar 1 : Agile Extreme Programming berdasarkan penelitian P. Abrahamson

Agile memiliki arti sebagai lincah, gesit, dan siap bergerak cepat merupakan sebuah metode pengembangan perangkat lunak yang iteratif serta menginginkan proses pengembangan yang lebih ringan, lebih cepat, dan lebih fleksibel. Kebutuhan ini sangat terasa di industri perangkat lunak untuk Internet yang berkembang sangat cepat dan sering berubah, serta platform web yang sedang tumbuh pesat. Metode Agile ini telah membuka dan memicu banyak diskusi dan perdebatan dalam berbagai literatur. (P. Abrahamson et al., 2002).

Extreme programming atau XP memiliki beberapa fase dalam pengerjaan aplikasi serta bagaimana perubahan dapat di realisasikan secara dinamis sehingga menghasilkan aplikasi atau software maupun produk yang bagus serta dapat beradaptasi, berikut merupakan fase-fase yang disebutkan oleh pekka Abrahamson :

a. Pada fase Exploration, customer menuliskan story card yang mereka inginkan untuk dimasukkan ke dalam release pertama. Setiap story card menjelaskan fitur yang akan ditambahkan ke dalam program. Pada saat yang sama, tim proyek maupun programmer membiasakan diri dengan tools, teknologi, dan praktik yang akan mereka gunakan dalam proyek tersebut. Teknologi yang akan digunakan diuji coba, dan kemungkinan arsitektur untuk sistem dieksplorasi dengan membangun prototype sistem. Fase exploration memakan waktu antara beberapa minggu hingga beberapa bulan, tergantung pada seberapa familiar programmer dengan teknologi yang digunakan.

b. Fase Planning menentukan urutan prioritas untuk story-story tersebut, dan kesepakatan tentang isi dari rilis kecil pertama dibuat. Programmer pertama-tama memperkirakan berapa banyak usaha yang diperlukan untuk setiap story, kemudian jadwal disepakati bersama. Rentang waktu jadwal untuk release pertama biasanya tidak melebihi dua bulan. Fase planning atau perencanaan itu sendiri hanya memakan waktu beberapa hari.

c. Fase Iterations to Release atau dengan mudah disebut sebagai fase coding dan pengembangan mencakup beberapa iterasi sistem sebelum release pertama. Jadwal yang dibuat di fase planning akan dipecah menjadi beberapa iterasi yang masing-masing memakan waktu satu hingga empat minggu untuk diimplementasikan. Iterasi pertama menciptakan sistem dengan arsitektur keseluruhan sistem. Ini dicapai dengan memilih story-story yang akan memaksa pembangunan struktur untuk keseluruhan sistem. Customer yang memutuskan story mana yang dipilih untuk setiap iterasi. Functional test yang dibuat oleh customer dijalankan di akhir setiap iterasi. Di akhir iterasi terakhir, sistem siap untuk production.

d. Fase Productionizing atau final produksi memerlukan testing ekstra dan pengecekan performa sistem sebelum sistem dapat di rilis ke customer. Pada fase ini, perubahan baru mungkin masih ditemukan dan keputusan harus dibuat apakah perubahan tersebut dimasukkan ke dalam release saat ini atau tidak. Selama fase ini, iterasi mungkin perlu dipercepat dari tiga minggu menjadi satu minggu. Ide dan saran yang ditunda akan didokumentasikan untuk dilakukan implementasi fitur pada tahap backlog selanjutnya, sebagai contoh selama fase maintenance.

Proses ini ditandai dengan model yang dikenal dengan interaktif dan inkremental. Proses yang meyakini bahwa suatu perangkat lunak dapat dikembangkan dengan desain minimalis, pengujian bertahap, dan dokumentasi yang tidak berlebihan. Agile Software Development adalah sebuah metode dalam pengembangan atau pembuatan sistem dengan cara cepat, artinya kebutuhan sistem sudah terpenuhi dengan melibatkan client dalam pembuatan softwarenya, sehingga kemungkinan sistem gagal itu sangat sedikit

---

## 2.5 Javascript

Javascript merupakan sebuah Bahasa pemrograman yang berbasis object scripting yang lahir pada tahun 1995 oleh seorang programmer Netscape yaitu Brendan eich, pada awalnya javascript di buat untuk membuat tampilan halaman web lebih dinamis. Javascript pada awal kelahiran di mulai dengan javascript 1.0 dan 1.1 di bawah naungan Netscape dan sun microsystem di tahun 1995 dalam jurnal yang di terbitkan oleh JavaScript: the first 20 years, Proceedings of the ACM on Programming Languages, Volume 4, Issue HOPL (June 2020), javascript terus berkembang hingga detik ini menjadi salah satu Bahasa permograman yang mampu berjalan secara client-side dan server-side menggunakan nodejs. (Wirfs-Brock & Eich, 2020)

Javascript memiliki banyak kerangka kerja atau framework untuk memudahkan pengembang dalam menulis dan mengimplementasikan kode supaya jauh lebih efisien dalam kurun waktu dan biaya yang keluar. Javascript memiliki berbagai macam kerangka kerja atau framework untuk memudahkan pengembangan web secara dinamis, Adapun framework atau kerangka kerja yang di gunakan dalam pengembangan platform akademik madrasah sebagai berikut :

### 2.5.1 Node.js

Node.js merupakan sebuah kerangka kerja Javascript untuk backend yang beroperasi lintas platform dan ditenagai oleh mesin Javascript Chrome V8. Pada tahun 2009, Ryan Dahl mengembangkan sebuah lingkungan runtime untuk membangun aplikasi sisi server. Pembuatan node dapat dilakukan dengan cepat dan mudah apabila mengetahui cara mengombinasikan komponen-komponen yang tepat. V8 dan Node sebagian besar ditulis dalam bahasa C dan C++ dengan penekanan pada penggunaan memori yang rendah serta performa yang optimal. Javascript juga dapat digunakan pada sisi server, khususnya dalam skenario yang ringan. (Jadhav & Gonsalves, 2020)

Efisiensi waktu komunikasi jaringan merupakan faktor penting yang perlu untuk dipertimbangkan. optimalisasi waktu komunikasi lintas jaringan diperlukan untuk meningkatkan efisiensi. Hal ini dapat melibatkan pengurangan latensi, peningkatan bandwidth dan kapasitas jaringan, atau minimalisasi kemacetan jaringan, di antara aspek-aspek lainnya. Secara umum, waktu komunikasi jaringan sangat berperan penting dalam menentukan seberapa efisien keseluruhan sistem dapat berfungsi.

Dalam penelitian yang dilakukan oleh Kovvuri (2025) memberikan bukti bahwa Node.js memiliki kecepatan dalam memberikan data dan konkurensi yang signifikan dengan membawa I/O yang lebih efisien sehingga mampu memberikan output tanpa menunggu data lain selesai diproses. Temuan ini diperkuat oleh penelitian lain yang secara spesifik menguji skalabilitas dan konkurensi Node.js dalam skenario beban tinggi.

Dalam uji beban konkuren, server Node.js mampu menangani hingga 8.000 koneksi WebSocket secara bersamaan dengan penurunan kinerja yang minimal, sementara Flask mencapai ambang batas kritis pada sekitar 3.500 koneksi, dan LAMP stack gagal mempertahankan stabilitas di atas 2.000 pengguna bersamaan. Selisih yang signifikan ini disebabkan oleh loop peristiwa non-blok tunggal-benang Node.js yang secara efektif memisahkan penanganan koneksi dari pemrosesan permintaan. Penggunaan CPU dan memori Node.js menunjukkan efisiensi yang baik, dengan rata-rata konsumsi 42% CPU dan 380 MB RAM di bawah beban, dibandingkan dengan Flask yang menggunakan 67% CPU dan 520 MB RAM, serta LAMP yang menggunakan 75% CPU dan 690 MB RAM. Mesin V8 Node dan rutinitas pengumpulan sampah internalnya berkontribusi pada overhead dan jejak memori yang lebih rendah, sehingga memungkinkan kinerja yang lebih tahan lama dalam kondisi throughput tinggi ((Kovvuri, 2025)).
<!-- 
Kovvuri, V. (2025). Optimizing 
Real-Time Web Applications in 2025: A Performance 
and Scalability Study of Node.js Backend with Angular 
Frontend Architectures. Journal of Data Analysis and Critical 
 -->


### 2.5.2 Express.js

Express.js, yang umumnya disebut sebagai Express, merupakan salah satu kerangka kerja aplikasi web yang paling banyak digunakan untuk Node.js. Kerangka kerja ini dirancang untuk menyederhanakan proses pengembangan dengan mengabstraksi sebagian besar kompleksitas yang terlibat dalam penanganan permintaan dan respons HTTP, sehingga memungkinkan pengembang untuk lebih fokus pada pembangunan fungsionalitas inti dan logika bisnis dari aplikasi mereka. Sebagai kerangka kerja yang minimal dan unopinionated.

Express menyediakan struktur yang fleksibel dan dapat disesuaikan serta diperluas berdasarkan kebutuhan spesifik dari suatu proyek, baik dalam membangun API sederhana, aplikasi web berskala penuh, maupun layanan mikro (microservices). Express dibangun di atas Node.js yang memanfaatkan sepenuhnya model event-driven dari Node yang mampu memberikan kinerja tinggi dan efisien untuk menangani operasi asinkron atau async serta skenario konkurensi tinggi, yang ideal untuk aplikasi web modern. Express seringkali menjadi pilihan utama untuk membangun API RESTful karena kesederhanaan dan kemudahan dalam mendefinisikan rute yang merespons metode-metode HTTP. Kemampuannya dalam memproses data JSON yang masuk, data formulir, dan string kueri menjadikannya ideal untuk menangani permintaan API. (Vesanto, 2024)

### 2.5.3 Svelte.js

Svelte merupakan kerangka kerja pengembangan untuk frontend berbasis javascript yang diperkenalkan oleh Rich Harris pada tahun 2016 dengan menghadirkan paradigma inovatif dalam pengembangan aplikasi web melalui pendekatan kompilasi kode menjadi JavaScript murni yang efisien pada tahap pengembangan. Kerangka kerja ini mengeliminasi kebutuhan runtime yang berat dengan melakukan kompilasi di waktu pengembangan, sehingga menghasilkan kinerja teknis yang superior, cepat dan reaktif. Pendekatan kompilasi ini menghasilkan waktu rendering yang lebih cepat, ukuran bundel yang lebih kecil, penggunaan memori yang lebih efisien, serta operasi DOM yang lebih optimal. Keunggulan teknis tersebut menjadikan Svelte merupakan pilihan yang tepat untuk aplikasi dengan kecepatan tinggi dan kinerja maksimal, karena berdampak langsung terhadap pengalaman pengguna melalui waktu pemuatan yang lebih cepat dan latensi yang lebih rendah. (Putra et al., 2025)

selanjutnya, pendekatan kompiler ini memberikan keuntungan signifikan dalam hal ukuran berkas dan kinerja pemuatan awal. Di antara kerangka kerja frontend sejenis, Svelte memiliki ukuran berkas terkecil, yaitu sekitar 2 KB, yang secara langsung mempercepat pemuatan halaman, terutama pada koneksi internet yang lambat. Implementasi TodoMVC dengan Svelte berukuran 3,6 KB (terkompresi gzip), dibandingkan dengan React plus ReactDOM yang berukuran sekitar 45 KB (terkompresi gzip) tanpa kode aplikasi apa pun. Sintaks Svelte sering dipuji karena lebih intuitif, membutuhkan lebih sedikit kode boilerplate, serta dilengkapi animasi dan transisi bawaan sebagai primitif tingkat pertama (Dorato, 2026).

<!-- REFERENSI UNTUK BIBLIOGRAFI BAB 2:
Dorato, N. (2026). Comparative Analysis of React, Svelte, and Solid.js in Data-Intensive Applications [Bachelor's Thesis, Metropolia University of Applied Sciences]. Information and Communications Technology, Software Engineering. Supervisor: Ilkka Kylmäniemi. -->


### 2.5.4 ES Modules (ECMAScript Modules)

ES Modules atau ESM merupakan sistem modul standar yang diperkenalkan secara resmi dalam spesifikasi ECMAScript 2015 (ES6) sebagai mekanisme native untuk mengorganisasi dan membagi kode JavaScript ke dalam unit-unit yang dapat digunakan kembali (reusable). Sebelum ESM distandarisasi, ekosistem JavaScript bergantung pada sistem modul pihak ketiga seperti CommonJS yang menggunakan sintaks `require()` dan `module.exports`, serta AMD (Asynchronous Module Definition). CommonJS menjadi standar de facto pada lingkungan Node.js sejak awal kemunculannya, namun memiliki keterbatasan karena bersifat sinkron dan tidak dirancang untuk analisis statis pada tahap kompilasi (Wirfs-Brock & Eich, 2020).

ESM menggunakan sintaks deklaratif melalui kata kunci `import` dan `export` yang memungkinkan JavaScript engine melakukan analisis statis terhadap dependensi modul sebelum kode dieksekusi. Keunggulan ini memungkinkan optimasi seperti tree-shaking, yaitu penghapusan kode yang tidak digunakan dari bundel akhir, sehingga menghasilkan ukuran aplikasi yang lebih kecil dan performa yang lebih baik. Node.js secara resmi mendukung ESM mulai versi 12 dengan penanda `"type": "module"` pada file `package.json`, dan dukungan stabil tersedia sejak versi 14 ke atas (Wirfs-Brock & Eich, 2020).

Dalam konteks pengembangan platform akademik madrasah, penggunaan ES Modules diterapkan pada seluruh kode backend Express.js dan frontend SvelteKit. Pendekatan ini memberikan konsistensi sintaks antara sisi server dan sisi client, mempermudah pengelolaan dependensi antar modul seperti controllers, services, dan routes, serta memungkinkan pemanfaatan fitur-fitur modern JavaScript secara penuh.

---

## 2.6 SQLite

SQLite merupakan sistem manajemen basis data (database) bersumber terbuka atau open source yang bersifat ringan. Sistem ini dikembangkan menggunakan bahasa pemrograman C. Berbeda dengan sistem basis data tradisional seperti Oracle dan SQL Server, SQLite tidak memerlukan komponen tambahan karena telah mencakup mesin basis data tertanam (embedded) yang lengkap di dalamnya. SQLite sangat sesuai untuk pengembangan aplikasi tertanam dan memiliki berbagai keunggulan, sehingga menjadi pilihan yang lebih disukai dibandingkan sistem basis data tertanam lainnya dalam ranah penelitian dan pengembangan (Bharadwaj et al., 2019). Berikut merupakan fitur-fitur utama yang dimiliki oleh SQLite :

a. Pustaka terbuka dari basis data tertanam ini diimplementasikan dengan tidak lebih dari 30.000 baris kode C. Selain itu, basis data ini kompatibel dengan format biner dan dapat diskalakan hingga ukuran 2 terabyte. Karena bersifat sumber terbuka (open-source), SQLite dapat meminimalkan biaya produksi.

b. Konfigurasi otomatis dan eksekusi merupakan fitur unggulan dari SQLite, karena tidak memerlukan thread khusus untuk memulai dan menghentikan proses. SQLite juga tidak memerlukan pembuatan basis data maupun pendistribusian otoritas akses oleh administrator. Pada saat terjadi kegagalan sistem, proses pemulihan pada SQLite berjalan secara otomatis. Selain itu, SQLite menyediakan API yang mudah digunakan dan mengakses basis data secara langsung melalui fungsi-fungsi API. SQLite juga mendukung berbagai bahasa pemrograman tingkat tinggi.

c. SQLite dapat mengakses file basis data secara langsung pada hard disk tanpa memanggil layanan tambahan. Interoperabilitas memungkinkan penggunaan file basis data yang sama pada mesin-mesin yang berbeda.

d. SQLite tidak membedakan tipe data, yaitu dapat menetapkan data apa pun ke kolom mana pun pada tabel apa pun, terlepas dari bagaimana data tersebut dideklarasikan pada hard disk.

e. SQLite menerapkan properti ACID (Atomicity, Consistency, Isolation, Durability) dan tidak membiarkan sistem rentan selama terjadi kegagalan yang tidak terencana.

f. SQLite bersifat cepat, dapat diskalakan, dan memiliki throughput yang tinggi. Karena bersifat platform-independent, SQLite dapat digunakan pada berbagai sistem operasi tertanam, seperti uC Linux, Windows CE, dan lain sebagainya.

g. SQLite mendukung berbagai bahasa pemrograman utama, termasuk C/C++, PHP, Perl, dan lainnya. Bahasa-bahasa tersebut berinteraksi dengan basis data menggunakan pemanggilan API.

h. SQLite menerapkan cakupan pengujian (test coverage) lebih dari 90%, yang berarti kasus-kasus pengujian mencakup seluruh kode aplikasi secara komprehensif. (Bharadwaj et al., 2019)

---

## 2.7 Unified Modeling Language (UML)

Unified Modeling Language atau UML merupakan bahasa pemodelan visual standar yang digunakan untuk menspesifikasi, memvisualisasi, membangun, dan mendokumentasikan artefak dari sistem perangkat lunak. UML dikembangkan oleh Grady Booch, James Rumbaugh, dan Ivar Jacobson pada pertengahan tahun 1990-an dan diadopsi sebagai standar oleh Object Management Group (OMG) pada tahun 1997. UML menyediakan sekumpulan notasi grafis yang memungkinkan pengembang dan pemangku kepentingan untuk berkomunikasi mengenai desain sistem secara terstruktur dan tidak ambigu (Booch et al., 2005).

UML menangkap keputusan dan pemahaman mengenai sistem yang harus dibangun. Bahasa pemodelan ini digunakan untuk memahami, merancang, menelusuri, mengkonfigurasi, memelihara, dan mengendalikan informasi tentang sistem-sistem tersebut. UML didesain untuk dapat digunakan dengan semua metode pengembangan, tahapan siklus hidup, domain aplikasi, dan berbagai media. Bahasa pemodelan ini dimaksudkan untuk menyatukan teknik pemodelan dan menggabungkan praktik terbaik perangkat lunak terkini ke dalam sebuah pendekatan standar. UML mencakup konsep semantik, notasi, dan pedoman. UML memiliki komponen yang bersifat statis, dinamis, lingkungan, dan organisasional. Bahasa pemodelan ini dirancang untuk didukung oleh alat pemodelan visual interaktif yang memiliki pembangkit kode (_code generators_) dan penulis laporan (_report writers_). Spesifikasi UML tidak mendefinisikan proses standar tertentu, namun dimaksudkan untuk berguna dalam proses pengembangan yang bersifat iteratif. UML ditujukan untuk mendukung sebagian besar proses pengembangan berorientasi objek yang telah ada (Rumbaugh et al., 2008).

UML terdiri dari beberapa jenis diagram yang dikelompokkan ke dalam dua kategori utama: diagram struktur (_structural diagrams_) yang menggambarkan elemen statis dari sistem, dan diagram perilaku (_behavioral diagrams_) yang menggambarkan aspek dinamis dari sistem. Dalam pengembangan platform akademik madrasah ini, diagram yang digunakan adalah _Use Case Diagram_ yang termasuk dalam kategori diagram perilaku, serta _Flowchart_ (diagram alur) sebagai alat bantu visualisasi proses.

### 2.7.1 Use Case Diagram

Use Case Diagram merupakan salah satu diagram UML yang menggambarkan interaksi antara pengguna (aktor) dengan sistem melalui serangkaian skenario penggunaan (use case). Diagram ini berfungsi untuk mendefinisikan kebutuhan fungsional sistem dari perspektif pengguna, mengidentifikasi siapa saja yang berinteraksi dengan sistem, dan menentukan apa saja yang dapat dilakukan oleh setiap aktor terhadap sistem. Use Case Diagram terdiri dari beberapa komponen utama (Booch et al., 2005):

a. **Aktor (Actor)**, merepresentasikan entitas eksternal yang berinteraksi dengan sistem. Aktor dapat berupa pengguna manusia, sistem lain, atau perangkat keras. Dalam notasi UML, aktor digambarkan dengan simbol figur manusia (stick figure) yang disertai nama aktor di bawahnya.

b. **Use Case**, merepresentasikan fungsi atau layanan yang disediakan oleh sistem kepada aktor. Setiap use case menggambarkan satu unit fungsionalitas yang bermakna bagi aktor. Dalam notasi UML, use case digambarkan dengan simbol elips yang berisi nama use case.

c. **Relasi Asosiasi (Association)**, menghubungkan aktor dengan use case yang menunjukkan bahwa aktor tersebut terlibat dalam use case terkait. Relasi ini digambarkan dengan garis lurus antara aktor dan use case.

d. **Relasi Include**, menunjukkan bahwa suatu use case secara wajib menyertakan fungsionalitas dari use case lain. Relasi ini digambarkan dengan garis putus-putus berarah dan label «include».

e. **Relasi Extend**, menunjukkan bahwa suatu use case secara opsional dapat diperluas dengan fungsionalitas tambahan dari use case lain. Relasi ini digambarkan dengan garis putus-putus berarah dan label «extend».

f. **System Boundary**, merepresentasikan batas sistem yang digambarkan dengan persegi panjang yang mencakup seluruh use case di dalamnya, dengan aktor berada di luar batas sistem.

Use Case Diagram memiliki peran penting dalam fase awal pengembangan perangkat lunak karena menjadi dasar untuk analisis kebutuhan, perancangan antarmuka pengguna, serta perencanaan pengujian fungsional. Dalam konteks Agile Extreme Programming, Use Case Diagram berkaitan erat dengan konsep customer stories pada fase Exploration, di mana kebutuhan fungsional diidentifikasi dan didokumentasikan secara visual sebelum memasuki fase pengembangan iteratif (Booch et al., 2005).

### 2.7.2 Flowchart (Diagram Alur)

Flowchart atau diagram alur merupakan representasi grafis yang menggambarkan urutan langkah-langkah, proses, atau alur kerja dalam suatu sistem secara visual. Flowchart telah digunakan secara luas dalam bidang rekayasa perangkat lunak sebagai alat bantu untuk mendokumentasikan dan mengkomunikasikan proses bisnis, algoritma, serta alur kerja operasional suatu sistem. Simbol-simbol standar yang digunakan dalam flowchart telah ditetapkan oleh _International Organization for Standardization_ melalui ISO 5807:1985 (ISO, 1985). Flowchart terdiri dari beberapa komponen utama:

a. **Terminator**, simbol berbentuk oval atau persegi panjang dengan sudut membulat yang menandakan titik awal (_start_) dan titik akhir (_end_) dari suatu proses atau alur.

b. **Process**, simbol berbentuk persegi panjang yang merepresentasikan suatu aktivitas, operasi, atau langkah pemrosesan yang dilakukan dalam sistem.

c. **Decision**, simbol berbentuk belah ketupat (_diamond_) yang menandakan titik percabangan atau pengambilan keputusan berdasarkan kondisi tertentu (ya/tidak atau benar/salah).

d. **Flow Line**, garis berarah (_arrow_) yang menunjukkan arah dan urutan aliran proses dari satu langkah ke langkah berikutnya.

e. **Document**, simbol berbentuk persegi panjang dengan sisi bawah bergelombang yang merepresentasikan dokumen atau laporan yang dihasilkan dari suatu proses.

f. **Data (Input/Output)**, simbol berbentuk jajaran genjang (_parallelogram_) yang menandakan operasi masukan (_input_) atau keluaran (_output_) data dalam suatu proses.

Dalam konteks pengembangan platform akademik madrasah, flowchart digunakan untuk menggambarkan diagram alur proses _version control_ dengan Git yang menunjukkan bagaimana alur kerja pengelolaan kode sumber dilakukan selama siklus pengembangan iteratif. Visualisasi alur ini membantu dalam memahami mekanisme manajemen versi yang diterapkan dalam proyek secara sistematis (ISO, 1985).

---

## Referensi Bab 2

<!-- Daftar referensi disusun berdasarkan urutan kemunculan sitasi pada Bab 2.
     Tanda [LENGKAPI] menandai entri yang masih perlu dilengkapi info bibliografi (nama jurnal lengkap, volume, halaman, DOI, dsb). -->

**2.1 Penelitian Sebelumnya**

[1] Ayunandita, N., & Dadi Riskiono, S. (2021). Permodelan Sistem Informasi Akademik Menggunakan Extreme Programming Pada Madrasah Aliyah (MA) Mambaul Ulum Tanggamus. *Jurnal Informatika dan Rekayasa Perangkat Lunak (JATIKA)*, 2(2). [LENGKAPI: halaman, DOI/URL]

[2] Pertiwi, T. A., Luchia, N. T., Sinta, P., Aprinastya, R., Dahlia, A., & Fachrezi, I. R. (2023). Perancangan Dan Implementasi Sistem Informasi Absensi Berbasis Web Menggunakan Metode Agile Software Development Web-Based. *Jurnal Testing dan Implementasi Sistem Informasi*, 1(1), 53–66. [LENGKAPI: penerbit, DOI/URL]

[3] Khoirunnisa, S., El Fatih, M. A., Sadjiwo, B., & Saprudin. (2024). Perancangan Sistem Informasi Dan Pendaftaran Online Di SMK IQRO Berbasis Web Dengan Metode Agile. *BIIKMA: Buletin Ilmiah Ilmu Komputer dan Multimedia*, 2(1). [LENGKAPI: halaman, DOI/URL]

**2.2 Pengertian Sistem Informasi**

[4] Ananda, [LENGKAPI: inisial], dkk. (2024). [LENGKAPI: judul artikel]. [LENGKAPI: nama jurnal, volume(nomor), halaman]. — *cari di Google Scholar / SINTA dengan kata kunci: "sistem informasi" + "Ananda" + 2024*

**2.3 Definisi Sistem Manajemen Akademik**

[5] Sethi, [LENGKAPI: inisial], & Malhotra, A. (2023). [LENGKAPI: judul tentang Academic Management System]. [LENGKAPI: jurnal/penerbit]. — *cari: "Anshu Malhotra" academic management system 2023*

[6] [LENGKAPI: Penulis SIM Lembaga Pendidikan]. ([LENGKAPI: tahun]). [LENGKAPI: judul tentang Sistem Informasi Manajemen kelembagaan pendidikan]. [LENGKAPI: sumber]. — *paragraf di [RESEARCHREPORTCHAPT2.md:47](RESEARCHREPORTCHAPT2.md#L47) masih placeholder*

**2.4 Definisi Agile Extreme Programming**

[7] Abrahamsson, P., Salo, O., Ronkainen, J., & Warsta, J. (2002). *Agile Software Development Methods: Review and Analysis*. VTT Publications 478, VTT Technical Research Centre of Finland.

**2.5 Javascript**

[8] Wirfs-Brock, A., & Eich, B. (2020). JavaScript: the first 20 years. *Proceedings of the ACM on Programming Languages*, 4(HOPL), 1–189. https://doi.org/10.1145/3386327

**2.5.1 Node.js**

[9] Jadhav, [LENGKAPI: inisial], & Gonsalves, [LENGKAPI: inisial]. (2020). [LENGKAPI: judul artikel tentang Node.js]. [LENGKAPI: jurnal, vol, hal]. — *cari: "Jadhav Gonsalves Node.js 2020"*

[10] Kovvuri, V. (2025). Optimizing Real-Time Web Applications in 2025: A Performance and Scalability Study of Node.js Backend with Angular Frontend Architectures. *Journal of Data Analysis and Critical [LENGKAPI: nama jurnal lengkap]*, [LENGKAPI: vol(no), halaman, DOI/URL].

**2.5.2 Express.js**

[11]Vesanto, [LENGKAPI: inisial]. (2024). [LENGKAPI: judul artikel tentang Express.js]. [LENGKAPI: jurnal/thesis/penerbit]. — *cari: "Vesanto Express.js 2024" — kemungkinan thesis Finlandia*

**2.5.3 Svelte.js**

[12] Putra, [LENGKAPI: inisial], dkk. (2025). [LENGKAPI: judul artikel tentang Svelte]. [LENGKAPI: jurnal, vol, hal]. — *cari: "Putra Svelte 2025" di Garuda/SINTA*

[13] Dorato, N. (2026). *Comparative Analysis of React, Svelte, and Solid.js in Data-Intensive Applications* [Bachelor's Thesis, Metropolia University of Applied Sciences]. Information and Communications Technology, Software Engineering. Supervisor: Ilkka Kylmäniemi. [LENGKAPI: URL Theseus.fi]

**2.6 SQLite**

[14] Bharadwaj, [LENGKAPI: inisial], dkk. (2019). [LENGKAPI: judul artikel tentang SQLite embedded database]. [LENGKAPI: jurnal, vol, hal]. — *cari: "Bharadwaj SQLite embedded 2019"*

**2.7 Unified Modeling Language (UML)**

[15] Booch, G., Rumbaugh, J., & Jacobson, I. (2005). *The Unified Modeling Language User Guide* (2nd ed.). Addison-Wesley Professional.

[16] Rumbaugh, J., Jacobson, I., & Booch, G. (2008). *The Unified Modeling Language Reference Manual* (2nd ed.). Addison-Wesley.

**2.7.2 Flowchart**

[17] International Organization for Standardization. (1985). *ISO 5807:1985 — Information processing — Documentation symbols and conventions for data, program and system flowcharts, program network charts and system resources charts*. ISO. https://www.iso.org/standard/11955.html

<script lang="ts">
	import { goto } from '$app/navigation';

	const categories = [
		{
			id: 1,
			name: 'Tanah dan Bangunan',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 7V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2h-8zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm9 12h-7v-2h2v-2h-2v-2h2v-2h-2V9h7c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1zm-1-8h-2v2h2v-2zm0 4h-2v2h2v-2z"/></svg>`,
			items: ['Tanah', 'Gedung Ruang Kelas', 'Gedung Kantor', 'Fasilitas Umum']
		},
		{
			id: 2,
			name: 'Peralatan Elektronik & Teknologi (TIK)',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H1c-.55 0-1 .45-1 1s.45 1 1 1h22c.55 0 1-.45 1-1s-.45-1-1-1h-3zM5 6h14c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1H5c-.55 0-1-.45-1-1V7c0-.55.45-1 1-1z"/></svg>`,
			items: [
				'Komputer & Laptop',
				'Proyektor (LCD)',
				'Server & Jaringan',
				'Printer & Fotokopi',
				'Sistem Suara'
			]
		},
		{
			id: 3,
			name: 'Mebel (Furniture)',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><path d="M17,10c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2H7C5.9,3,5,3.9,5,5v3c0,1.1,0.9,2,2,2h1v2H7c-1.1,0-2,0.9-2,2v6 c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-2h10v2c0,0.55,0.45,1,1,1h0c0.55,0,1-0.45,1-1v-6c0-1.1-0.9-2-2-2h-1v-2H17z M7,8V5h10v3 H7z M17,16H7v-2h10V16z M14,12h-4v-2h4V12z"/></g></svg>`,
			items: ['Meja & Kursi Siswa', 'Meja & Kursi Kerja', 'Lemari & Rak', 'Papan Tulis']
		},
		{
			id: 4,
			name: 'Peralatan Laboratorium & Praktik',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g><path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M13,5.3l1.35-0.95 c1.82,0.56,3.37,1.76,4.38,3.34l-0.39,1.34l-1.35,0.46L13,6.7V5.3z M9.65,4.35L11,5.3v1.4L7.01,9.49L5.66,9.03L5.27,7.69 C6.28,6.12,7.83,4.92,9.65,4.35z M7.08,17.11l-1.14,0.1C4.73,15.81,4,13.99,4,12c0-0.12,0.01-0.23,0.02-0.35l1-0.73L6.4,11.4 l1.46,4.34L7.08,17.11z M14.5,19.59C13.71,19.85,12.87,20,12,20s-1.71-0.15-2.5-0.41l-0.69-1.49L9.45,17h5.11l0.64,1.11 L14.5,19.59z M14.27,15H9.73l-1.35-4.02L12,8.44l3.63,2.54L14.27,15z M18.06,17.21l-1.14-0.1l-0.79-1.37l1.46-4.34l1.39-0.47 l1,0.73C19.99,11.77,20,11.88,20,12C20,13.99,19.27,15.81,18.06,17.21z"/></g></g></svg>`,
			items: ['Alat Peraga Pendidikan', 'Alat Olahraga', 'Alat Kesenian']
		},
		{
			id: 5,
			name: 'Kendaraan Operasional',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><g><rect fill="none" height="24" width="24"/><rect fill="none" height="24" width="24"/></g><g><g/><g><path d="M21.99,14.77l-1.43-4.11c-0.14-0.4-0.52-0.66-0.97-0.66H12.4c-0.46,0-0.83,0.26-0.98,0.66L10,14.77v5.24 c0,0.55,0.45,0.99,1,0.99s1-0.45,1-1v-1h8v1c0,0.55,0.45,1,1,1s0.99-0.44,1-0.99L21.99,14.77z M11.61,13.34l0.69-2 c0.05-0.2,0.24-0.34,0.46-0.34h6.48c0.21,0,0.4,0.14,0.47,0.34l0.69,2c0.11,0.32-0.13,0.66-0.47,0.66h-7.85 C11.74,14,11.5,13.66,11.61,13.34z M11.99,17c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S12.54,17,11.99,17z M19.99,17 c-0.55,0-1-0.45-1-1s0.45-1,1-1s1,0.45,1,1S20.54,17,19.99,17z"/><path d="M14,4.5V9h1V4c0-0.55-0.45-1-1-1H8C7.45,3,7,3.45,7,4v4H3C2.45,8,2,8.45,2,9v12h1V9.5C3,9.22,3.22,9,3.5,9h4 C7.78,9,8,8.78,8,8.5v-4C8,4.22,8.22,4,8.5,4h5C13.78,4,14,4.22,14,4.5z"/><rect height="2" width="2" x="5" y="11"/><rect height="2" width="2" x="10" y="5"/><rect height="2" width="2" x="5" y="15"/><rect height="2" width="2" x="5" y="19"/></g></g></svg>`,
			items: ['Bus/Mobil Sekolah', 'Sepeda Motor']
		},
		{
			id: 6,
			name: 'Aset Tetap Lainnya',
			icon: `<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M15.5,15h4v2h-4v-2Zm8.5-1v10H0V14c0-1.654,1.346-3,3-3h2V3c0-1.654,1.346-3,3-3h8c1.654,0,3,1.346,3,3V11h2c1.654,0,3,1.346,3,3ZM7,11h10V3c0-.552-.448-1-1-1H8c-.552,0-1,.448-1,1V11ZM2,22H11V13H3c-.552,0-1,.448-1,1v8ZM22,14c0-.552-.448-1-1-1H13v9h9V14Zm-17.5,1v2h4v-2H4.5ZM10,6h4v-2h-4v2Z"/></svg>`,
			items: ['Koleksi Perpustakaan', 'Alat Kebersihan & Perawatan']
		}
	];
</script>

<!--

1. Tanah dan Bangunan
Tanah: Lahan gedung utama, lahan parkir, lapangan upacara, dan area hijau/taman.
Gedung Ruang Kelas: Seluruh bangunan tempat proses belajar mengajar.
Gedung Kantor: Ruang Kepala Sekolah, Ruang Guru, dan Ruang Tata Usaha (TU).
Fasilitas Umum: Gedung Perpustakaan, Laboratorium (IPA/Bahasa/Komputer), Aula/Auditorium, Musholla/Masjid, dan Kantin.
2. Peralatan Elektronik & Teknologi (TIK)
Komputer & Laptop: Perangkat di lab komputer dan laptop operasional guru.
Proyektor (LCD): Alat presentasi yang terpasang di setiap kelas atau aula.
Server & Jaringan: Router WiFi, switch hub, dan perangkat server sekolah.
Printer & Fotokopi: Inventaris ruang tata usaha untuk keperluan administrasi.
Sistem Suara (Sound System): Speaker kelas, amplifier, dan mikrofon untuk upacara.
3. Mebel (Furniture)
Meja & Kursi Siswa: Set kursi dan meja di dalam kelas.
Meja & Kursi Kerja: Inventaris untuk guru, staf TU, dan pimpinan.
Lemari & Rak: Lemari arsip, rak buku perpustakaan, dan loker siswa.
Papan Tulis: Whiteboard atau smart board (papan tulis digital).
4. Peralatan Laboratorium & Praktik
Alat Peraga Pendidikan: Torso manusia, mikroskop, alat uji kimia, atau kit matematika.
Alat Olahraga: Tiang gawang, ring basket, meja pingpong, dan matras senam.
Alat Kesenian: Gamelan, alat musik band, atau perlengkapan tari.
5. Kendaraan Operasional
Bus/Mobil Sekolah: Kendaraan jemputan atau operasional kedinasan.
Sepeda Motor: Kendaraan untuk keperluan kurir atau tugas luar staf sekolah.
6. Aset Tetap Lainnya
Koleksi Perpustakaan: Buku pelajaran, buku referensi, dan ensiklopedia yang sudah diregistrasi.
Alat Kebersihan & Perawatan: Mesin pemotong rumput dan penyedot debu (vacuum cleaner).

-->
<div class="min-h-screen p-4">
	<!-- card	-->
	<div class="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
		{#each categories as category(category.id)}
			<div class="rounded-xl border border-gray-200 p-4">
				<h2 class="mb-3 text-xl font-semibold">{category.name}</h2>
				<div class="grid grid-cols-2 gap-2 md:grid-cols-3">
					{#each category.items as item, index (index)}
						<button
							aria-label="Page navigation"
							on:click={() => goto(`/sarpras/assettetap/${category.id}-${index}`)}
							class="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border border-gray-300 bg-slate-100 p-2 text-center text-xs transition-all duration-75 ease-in-out hover:border hover:bg-blue-500 hover:text-blue-50 md:items-start md:gap-2 md:p-4 md:text-left md:text-sm"
						>
							{@html category.icon}
							<span class="line-clamp-2">{item}</span>
						</button>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

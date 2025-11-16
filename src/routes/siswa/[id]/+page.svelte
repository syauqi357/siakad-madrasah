<script lang="ts">
	// This file goes in: src/routes/student/[id]/+page.svelte
	import { page } from '$app/stores';

	type Student = {
		id: number;
		nama: string;
		kelas: string;
		jenisKelamin: string;
		asal: string;
		ayah: string;
		ibu: string;
		alamat: string;
		status: 'aktif' | 'warning' | 'nonaktif';
	};

	// TODO: Move this to a separate file like src/lib/data/students.ts
	// so you can import it in both list and detail pages
	const studentData: Student[] = [
		{
			id: 25020001,
			nama: 'Ahmad Rizki',
			kelas: 'XII RPL 1',
			jenisKelamin: 'L',
			asal: 'Jakarta',
			status: 'aktif',
			ayah: 'Farid',
			ibu: 'Faridah',
			alamat: 'Jalan Merdeka No. 123'
		},
		{
			id: 25020002,
			nama: 'Siti Nurhaliza',
			kelas: 'XII RPL 1',
			jenisKelamin: 'P',
			asal: 'Bandung',
			status: 'aktif',
			ayah: 'Budi Santoso',
			ibu: 'Dewi Lestari',
			alamat: 'Jalan Asia Afrika No. 45'
		},
		{
			id: 25020003,
			nama: 'Kevin Pratama',
			kelas: 'XII RPL 1',
			jenisKelamin: 'L',
			asal: 'Surabaya',
			status: 'aktif',
			ayah: 'Joko Widodo',
			ibu: 'Sari Indah',
			alamat: 'Jalan Tunjungan No. 78'
		},
		{
			id: 25020004,
			nama: 'Maya Sari',
			kelas: 'XII RPL 2',
			jenisKelamin: 'P',
			asal: 'Yogyakarta',
			status: 'aktif',
			ayah: 'Rudi Hermawan',
			ibu: 'Linda Wati',
			alamat: 'Jalan Malioboro No. 56'
		},
		{
			id: 25020005,
			nama: 'Rizky Fadilah',
			kelas: 'XII RPL 2',
			jenisKelamin: 'L',
			asal: 'Medan',
			status: 'nonaktif',
			ayah: 'Ahmad Yani',
			ibu: 'Siti Aminah',
			alamat: 'Jalan Sudirman No. 89'
		},
		{
			id: 25020006,
			nama: 'Dewi Anggraini',
			kelas: 'XII RPL 2',
			jenisKelamin: 'P',
			asal: 'Semarang',
			status: 'aktif',
			ayah: 'Hendra Gunawan',
			ibu: 'Ratna Sari',
			alamat: 'Jalan Pemuda No. 34'
		},
		{
			id: 25020007,
			nama: 'Fajar Hidayat',
			kelas: 'XII RPL 3',
			jenisKelamin: 'L',
			asal: 'Makassar',
			status: 'aktif',
			ayah: 'Syamsul Arifin',
			ibu: 'Murni Wati',
			alamat: 'Jalan Pattimura No. 67'
		},
		{
			id: 25020008,
			nama: 'Nina Permata',
			kelas: 'XII RPL 3',
			jenisKelamin: 'P',
			asal: 'Denpasar',
			status: 'aktif',
			ayah: 'Wayan Sutarna',
			ibu: 'Ketut Sari',
			alamat: 'Jalan Raya Kuta No. 12'
		},
		{
			id: 25020009,
			nama: 'Budi Setiawan',
			kelas: 'XII RPL 3',
			jenisKelamin: 'L',
			asal: 'Malang',
			status: 'nonaktif',
			ayah: 'Slamet Riyadi',
			ibu: 'Susi Susanti',
			alamat: 'Jalan Ijen No. 23'
		},
		{
			id: 25020010,
			nama: 'Cindy Putri',
			kelas: 'XII RPL 4',
			jenisKelamin: 'P',
			asal: 'Bogor',
			status: 'aktif',
			ayah: 'Eko Prasetyo',
			ibu: 'Maria Ulfa',
			alamat: 'Jalan Pajajaran No. 90'
		},
		{
			id: 25020011,
			nama: 'Rendi Saputra',
			kelas: 'XII RPL 4',
			jenisKelamin: 'L',
			asal: 'Palembang',
			status: 'aktif',
			ayah: 'Ari Wibowo',
			ibu: 'Rina Marlina',
			alamat: 'Jalan Jenderal Sudirman No. 45'
		},
		{
			id: 25020012,
			nama: 'Lina Marlina',
			kelas: 'XII RPL 4',
			jenisKelamin: 'P',
			asal: 'Bekasi',
			status: 'aktif',
			ayah: 'Tono Sugianto',
			ibu: 'Sari Dewi',
			alamat: 'Jalan Kemang No. 78'
		}
	];

	// Get the id from URL params - $page.params.id comes from the [id] folder name
	const studentId = Number($page.params.id);

	// Find student by id
	const student = studentData.find((s) => s.id === studentId);

	function getStatusStyle(status: Student['status']): string {
		switch (status) {
			case 'aktif':
				return 'border-green-400 bg-green-300 text-emerald-700';
			case 'warning':
				return 'border-amber-400 bg-amber-300 text-amber-700';
			case 'nonaktif':
				return 'border-red-400 bg-red-300 text-red-700';
			default:
				return '';
		}
	}

	// WHEN YOU SWITCH TO EXPRESS BACKEND API:
	// Instead of static data, you'll fetch from your Express server like this:
	/*
	import { onMount } from 'svelte';
	
	let student: Student | null = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			// Make request to your Express API endpoint
			const response = await fetch(`http://localhost:3000/api/students/${$page.params.id}`);
			
			if (!response.ok) {
				throw new Error('Student not found');
			}
			
			student = await response.json();
		} catch (err) {
			error = err.message;
		} finally {
			loading = false;
		}
	});

	// Then your Express backend would have a route like:
	// app.get('/api/students/:id', (req, res) => {
	//   const student = students.find(s => s.id === parseInt(req.params.id));
	//   if (!student) return res.status(404).json({ error: 'Not found' });
	//   res.json(student);
	// });
	*/
</script>

<!-- student data main -->
{#if student}
	<div class="min-h-screen bg-slate-50 p-4 md:p-8">
		<div class="mx-auto max-w-4xl">
			<!-- Back button -->
			<a href="/siswa" class="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800">
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="#000000"
						aria-hidden="true"
						id="Arrow-Left-Circle--Streamline-Heroicons"
						height="24"
						width="24"
					>
						<desc> Arrow Left Circle Streamline Icon: https://streamlinehq.com </desc>
						<path
							fill-rule="evenodd"
							d="M12 2.25c-5.385 0 -9.75 4.365 -9.75 9.75s4.365 9.75 9.75 9.75 9.75 -4.365 9.75 -9.75S17.385 2.25 12 2.25Zm-4.28 9.22a0.75 0.75 0 0 0 0 1.06l3 3a0.75 0.75 0 1 0 1.06 -1.06l-1.72 -1.72h5.69a0.75 0.75 0 0 0 0 -1.5h-5.69l1.72 -1.72a0.75 0.75 0 0 0 -1.06 -1.06l-3 3Z"
							clip-rule="evenodd"
							stroke-width="1"
						></path>
					</svg>
				</span>
				<span> Kembali ke daftar </span>
			</a>

			<!-- Student card -->
			<div class="rounded-lg bg-white p-6 shadow-lg md:p-8">
				<!-- student header -->
				<div class="mb-5 flex items-center justify-between">
					<div class="flex items-center gap-4">
						<!-- student image -->
						<div class="h-22 w-18 bg-slate-500"></div>

						<!-- student name and id -->
						<div>
							<h1 class="text-3xl font-bold text-slate-800">{student.nama}</h1>
							<p class="mt-2 text-slate-600">ID: {student.id}</p>
						</div>
					</div>
					<div class="mb-6 flex items-start justify-between">
						<!-- status siswa -->
						<span
							class={`rounded-lg border px-4 py-2 text-sm font-medium ${getStatusStyle(student.status)}`}
						>
							{student.status.toUpperCase()}
						</span>
					</div>
				</div>

				<!-- data student -->

				<!-- 
				
				- content will be :
				pokok di sini lah

				-->

				<div class="grid gap-4 md:grid-cols-2">
					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Kelas</p>
						<p class="mt-1 text-xl font-semibold text-slate-800">{student.kelas}</p>
					</div>

					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Jenis Kelamin</p>
						<p class="mt-1 text-xl font-semibold text-slate-800">
							{student.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
						</p>
					</div>

					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Asal</p>
						<p class="mt-1 text-xl font-semibold text-slate-800">{student.asal}</p>
					</div>

					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Status Siswa</p>
						<p class="mt-1 text-xl font-semibold text-slate-800 capitalize">{student.status}</p>
					</div>
					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Ayah Siswa</p>
						<p class="mt-1 text-xl font-semibold text-slate-800 capitalize">{student.ayah}</p>
					</div>
				</div>

				<!-- You can add more sections here like: -->
				<!-- - Nilai/grades -->
				<!-- - Absensi/attendance -->
				<!-- - Contact info -->
				<!-- - etc -->
			</div>
		</div>
	</div>
{:else}
	<div class="flex min-h-screen items-center justify-center bg-slate-50">
		<div class="text-center">
			<h1 class="text-4xl font-bold text-slate-800">404</h1>
			<p class="mt-2 text-slate-600">Siswa tidak ditemukan</p>
			<a
				href="/siswa"
				class="mt-4 inline-block rounded-md bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
			>
				Kembali ke daftar
			</a>
		</div>
	</div>
{/if}

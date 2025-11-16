<script lang="ts">
	// import { get } from 'http';
	import { onMount } from 'svelte';

	type Student = {
		id: number;
		nama: string;
		kelas: string;
		jenisKelamin: string;
		asal: string;
		status: 'aktif' | 'warning' | 'nonaktif';
	};

	const studentData: Student[] = [
		{
			id: 25020001,
			nama: 'Ahmad Rizki',
			kelas: 'XII RPL 1',
			jenisKelamin: 'L',
			asal: 'Jakarta',
			status: 'aktif'
		},
		{
			id: 25020002,
			nama: 'Siti Nurhaliza',
			kelas: 'XII RPL 1',
			jenisKelamin: 'P',
			asal: 'Bandung',
			status: 'aktif'
		},
		{
			id: 25020003,
			nama: 'Kevin Pratama',
			kelas: 'XII RPL 1',
			jenisKelamin: 'L',
			asal: 'Surabaya',
			status: 'aktif'
		},
		{
			id: 25020004,
			nama: 'Maya Sari',
			kelas: 'XII RPL 2',
			jenisKelamin: 'P',
			asal: 'Yogyakarta',
			status: 'aktif'
		},
		{
			id: 25020005,
			nama: 'Rizky Fadilah',
			kelas: 'XII RPL 2',
			jenisKelamin: 'L',
			asal: 'Medan',
			status: 'nonaktif'
		},
		{
			id: 25020006,
			nama: 'Dewi Anggraini',
			kelas: 'XII RPL 2',
			jenisKelamin: 'P',
			asal: 'Semarang',
			status: 'aktif'
		},
		{
			id: 25020007,
			nama: 'Fajar Hidayat',
			kelas: 'XII RPL 3',
			jenisKelamin: 'L',
			asal: 'Makassar',
			status: 'aktif'
		},
		{
			id: 25020008,
			nama: 'Nina Permata',
			kelas: 'XII RPL 3',
			jenisKelamin: 'P',
			asal: 'Denpasar',
			status: 'aktif'
		},
		{
			id: 25020009,
			nama: 'Budi Setiawan',
			kelas: 'XII RPL 3',
			jenisKelamin: 'L',
			asal: 'Malang',
			status: 'nonaktif'
		},
		{
			id: 25020010,
			nama: 'Cindy Putri',
			kelas: 'XII RPL 4',
			jenisKelamin: 'P',
			asal: 'Bogor',
			status: 'aktif'
		},
		{
			id: 25020011,
			nama: 'Rendi Saputra',
			kelas: 'XII RPL 4',
			jenisKelamin: 'L',
			asal: 'Palembang',
			status: 'aktif'
		},
		{
			id: 25020012,
			nama: 'Lina Marlina',
			kelas: 'XII RPL 4',
			jenisKelamin: 'P',
			asal: 'Bekasi',
			status: 'aktif'
		}
	];

	// Shuffle array on load
	let students = [...studentData].sort();

	function getStatusStyle(status: Student['status']): string {
		switch (status) {
			case 'aktif':
				return 'flex items-center gap-3 rounded-lg border border-green-400 bg-green-300 p-0.5 text-xs text-emerald-700 md:p-1 md:pr-2 md:pl-2 capitalize font-bold';
			case 'warning':
				return 'rounded-lg border border-amber-400 bg-amber-300 p-0.5 text-xs text-amber-700 md:p-1 md:pr-2 md:pl-2 capitalize';
			case 'nonaktif':
				return 'rounded-lg border border-red-400 bg-red-300 p-0.5 text-xs text-red-700 md:p-1 md:pr-2 md:pl-2 capitalize';
			default:
				return '';
		}
	}

	function getStatusText(status: Student['status']): string {
		switch (status) {
			case 'aktif':
				return 'aktif';
			case 'warning':
				return 'peringatan';
			case 'nonaktif':
				return 'nonaktif';
			default:
				return '';
		}
	}

	// function gender color
	function getGenderStyle(jenisKelamin: string): string {
		return jenisKelamin === 'P'
			? // using ternary operator
				'flex h-5 w-5 items-center justify-center rounded-sm border border-pink-500 bg-pink-300 p-3 text-pink-700 text-sm'
			: 'flex h-5 w-5 items-center justify-center rounded-sm border border-blue-500 bg-blue-300 p-3 text-blue-700 text-sm';
	}
</script>

<div class="flex w-full flex-col items-center justify-center md:p-3">
	<!-- header -->
	<div class="mb-6 w-full bg-slate-500 p-3 md:w-7xl">
		<span class="text-md font-bold tracking-wide capitalize md:text-4xl"> siswa </span>

		<!-- function search dll -->
		<div class="h-6 w-full bg-slate-300">
			<input type="text" />
		</div>
	</div>
	<div class="h-auto w-full rounded-md bg-slate-100 p-3 md:w-7xl md:p-6">
		<!-- line student -->
		{#each students as student}
			<div
				class="mb-3 flex h-auto w-full items-center justify-between gap-6 rounded-lg bg-slate-200 p-3 transition-all duration-150 ease-in-out hover:bg-slate-300 md:w-full"
			>
				<div class="flex items-center gap-8 p-2 text-xs md:text-base">
					<div class="border-r border-slate-400 p-0 pr-3 text-slate-700 md:p-0 md:pr-6">
						{student.nama}
					</div>
					<div class="hidden md:flex">{student.kelas}</div>
					<div class={getGenderStyle(student.jenisKelamin)}>
						{student.jenisKelamin}
					</div>
					<div class="hidden md:flex">{student.asal}</div>
				</div>

				<span class={getStatusStyle(student.status)}>
					{getStatusText(student.status)}
					{#if student.status === 'aktif'}
						<div class="h-2 w-2 rounded-full bg-green-500"></div>
					{/if}
				</span>

				<!-- default style status -->
				<!-- <span
					class="flex items-center gap-3 rounded-lg border border-green-400 bg-green-300 p-0.5 text-xs text-emerald-700 md:p-1 md:pr-2 md:pl-2"
				>
					status siswa aktif

					<div class="h-2 w-2 rounded-full bg-green-500">
						<div class="h-2 w-2 animate-ping rounded-full bg-green-700"></div>
					</div>
				</span>
				<span
					class="rounded-lg border border-amber-400 bg-amber-300 p-0.5 text-xs text-amber-700 md:p-1 md:pr-2 md:pl-2"
					>status siswa warning</span
				>
				<span
					class="rounded-lg border border-red-400 bg-red-300 p-0.5 text-xs text-red-700 md:p-1 md:pr-2 md:pl-2"
					>status siswa nonaktif</span
				> -->
				<a href="/siswa/{student.id}">
					<button
						aria-label="More details"
						title="More details"
						class=" flex flex-row-reverse items-center justify-center gap-3 rounded-md bg-blue-500 p-2 text-white hover:bg-blue-600 md:pr-5 md:pl-5"
					>
						<!-- icon more details -->
						<span>
							<svg
								class="fill-white-100"
								fill="none"
								viewBox="0 0 24 24"
								id="Call-Made-Fill--Streamline-Rounded-Fill-Material"
								height="24"
								width="24"
							>
								<path
									fill="currentColor"
									d="m17.4998 7.55 -11.925 11.925c-0.15 0.15 -0.325 0.225 -0.525 0.225 -0.199995 0 -0.374995 -0.075 -0.524995 -0.225 -0.15 -0.15 -0.225 -0.325 -0.225 -0.525s0.075 -0.375 0.225 -0.525L16.4498 6.5h-6.6c-0.2125 0 -0.3906 -0.07235 -0.53425 -0.217 -0.14385 -0.1445 -0.21575 -0.32365 -0.21575 -0.5375 0 -0.21365 0.0719 -0.39135 0.21575 -0.533 0.14365 -0.14165 0.32175 -0.2125 0.53425 -0.2125h8.4c0.2125 0 0.39065 0.07185 0.5345 0.2155 0.14365 0.14385 0.2155 0.322 0.2155 0.5345v8.4c0 0.2125 -0.07235 0.3906 -0.217 0.53425 -0.1445 0.14385 -0.32365 0.21575 -0.5375 0.21575 -0.21365 0 -0.39135 -0.0719 -0.533 -0.21575 -0.14165 -0.14365 -0.2125 -0.32175 -0.2125 -0.53425V7.55Z"
									stroke-width="0.5"
								></path>
							</svg>
						</span>
						<!-- more -->
						<span class="hidden text-xs md:flex md:text-sm"> selengkapnya </span>
					</button>
				</a>
			</div>
		{/each}
	</div>
</div>

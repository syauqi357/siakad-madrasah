<script lang="ts">
	// This file goes in: src/routes/student/[id]/+page.svelte
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	type Student = {
		id: number;
		name: string;
		class: string;
		gender: string;
		cityOfOrigin: string;
		father: string;
		mother: string;
		address: string;
		status: 'active' | 'warning' | 'inactive';
	};

	// TODO: Move this to a separate file like src/lib/data/students.ts
	// so you can import it in both list and detail pages

	let student: Student | null = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			// Make request to your Express API endpoint
			const response = await fetch(`http://localhost:3000/routes/api/studentData/${$page.params.id}`);

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

	// Get the id from URL params - $page.params.id comes from the [id] folder name
	// const studentId = Number($page.params.id);

	// Find student by id
	//const student = studentData.find((s) => s.id === studentId);

	function getStatusStyle(status: Student['status']): string {
		switch (status) {
			case 'active':
				return 'border-green-400 bg-green-300 text-emerald-700';
			case 'warning':
				return 'border-amber-400 bg-amber-300 text-amber-700';
			case 'inactive':
				return 'border-red-400 bg-red-300 text-red-700';
			default:
				return '';
		}
	}
</script>

<!-- student data main -->
{#if student}
	<div class="min-h-screen bg-slate-50 p-4 md:p-8">
		<div class="mx-auto max-w-4xl">
			<!-- Back button -->
			<a
				href="/siswa"
				class="mb-6 flex w-fit items-center gap-2 rounded-full bg-blue-100 p-2 text-blue-600 hover:text-blue-800"
			>
				<span>
					<svg
						class="fill-blue-600"
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

			<!-- Student card parent -->
			<div class=" bg-white p-2 md:rounded-lg md:p-8 md:shadow-lg">
				<!-- student header -->
				<!-- 
					all information in the head goes here
				 -->
				<div class="mb-5 flex items-center justify-between">
					<div class="flex items-center gap-4">
						<!-- student image -->
						<div class="h-22 w-18 bg-slate-500"></div>
						<!-- student name and id -->
						<div>
							<h1 class="text-xl font-bold text-slate-800 md:text-3xl">{student.name}</h1>
							<p class="mt-2 text-slate-600">ID: {student.id}</p>
						</div>
					</div>
					<div class="mb-6 flex items-center p-2">
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
					<!-- kelas siswa (harus nya terpisah) -->
					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Kelas</p>
						<p class="mt-1 text-xl font-semibold text-slate-800">{student.class}</p>
					</div>

					<!-- jenis kelamin siswa -->
					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Jenis Kelamin</p>
						<p class="mt-1 text-xl font-semibold text-slate-800">
							<!-- logic loop dan cek jenis kelamin dengan ternary operator-->
							{student.gender === 'Laki-laki' ? 'Laki-laki' : 'Perempuan'}
						</p>
					</div>

					<!-- asal siswa (harus nya terpisah dan gabungan dari beberapa data yang di combine secara bersamaan) -->
					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Asal</p>
						<p class="mt-1 text-xl font-semibold text-slate-800">
							{student.cityOfOrigin}
							<!-- disini harus nya ada data tambahan atau gabungan dari data resmi dukcapil -->
						</p>
					</div>

					<!-- status (siswa aktif dst) -->
					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Status Siswa</p>
						<p class="mt-1 text-xl font-semibold text-slate-800 capitalize">{student.status}</p>
					</div>

					<!-- ayah siswa -->
					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Ayah Siswa</p>
						<p class="mt-1 flex items-center gap-2 text-xl font-semibold text-slate-800 capitalize">
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									id="Boy-Fill--Streamline-Outlined-Fill-Material"
									height="24"
									width="24"
								>
									<desc> Boy Fill Streamline Icon: https://streamlinehq.com </desc>
									<path
										fill="#000000"
										d="M11.9975 7c-0.415 0 -0.76835 -0.14665 -1.06 -0.44 -0.29165 -0.29335 -0.4375 -0.6475 -0.4375 -1.0625 0 -0.415 0.14665 -0.768335 0.44 -1.06 0.29335 -0.291665 0.6475 -0.4375 1.0625 -0.4375 0.415 0 0.76835 0.146665 1.06 0.44 0.29165 0.293335 0.4375 0.6475 0.4375 1.0625 0 0.415 -0.14665 0.76835 -0.44 1.06 -0.29335 0.29165 -0.6475 0.4375 -1.0625 0.4375ZM10.5 20V15h-1V10c0 -0.4125 0.1469 -0.76565 0.44075 -1.0595C10.2344 8.64685 10.5875 8.5 11 8.5h2c0.4125 0 0.76565 0.14685 1.0595 0.4405 0.29365 0.29385 0.4405 0.647 0.4405 1.0595v5h-1v5h-3Z"
										stroke-width="0.5"
									></path>
								</svg>
							</span>
							{student.father}
						</p>
					</div>

					<!-- ibu siswa -->
					<div class="rounded-lg bg-slate-50 p-4">
						<p class="text-sm text-slate-600">Ibu Siswa</p>
						<p class="mt-1 flex items-center gap-2 text-xl font-semibold text-slate-800 capitalize">
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									id="Woman-2-Fill--Streamline-Outlined-Fill-Material"
									height="24"
									width="24"
								>
									<desc> Woman 2 Fill Streamline Icon: https://streamlinehq.com </desc>
									<path
										fill="#000000"
										d="M10.7 22V16.5H7.5l2.55 -8.2c0.13335 -0.41665 0.38335 -0.7375 0.75 -0.9625 0.36665 -0.225 0.76665 -0.3375 1.2 -0.3375 0.43335 0 0.83335 0.1125 1.2 0.3375 0.36665 0.225 0.61665 0.54585 0.75 0.9625L16.5 16.5h-3.2v5.5h-2.6Zm1.302 -16.35c-0.50135 0 -0.93115 -0.1785 -1.2895 -0.5355 -0.35835 -0.357 -0.5375 -0.786165 -0.5375 -1.2875 0 -0.501335 0.1785 -0.931165 0.5355 -1.2895C11.0675 2.179165 11.49665 2 11.998 2c0.50135 0 0.93115 0.1785 1.2895 0.5355 0.35835 0.357 0.5375 0.786165 0.5375 1.2875 0 0.501335 -0.1785 0.931165 -0.5355 1.2895 -0.357 0.35835 -0.78615 0.5375 -1.2875 0.5375Z"
										stroke-width="0.5"
									></path>
								</svg>
							</span>
							{student.mother}
						</p>
					</div>
				</div>

				<!-- more sections here like: -->
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

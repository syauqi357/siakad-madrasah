<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';

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

	let student: Student | null = null;
	let loading = true;
	let error = '';

	onMount(async () => {
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				goto('/login');
				return;
			}

			const response = await API_FETCH(`/routes/api/studentDataSet/${$page.params.id}`);

			if (!response.ok) {
				if (response.status === 401) {
					goto('/login');
					return;
				}
				throw new Error('Student not found');
			}

			const data = await response.json();
			// Map API response to Student type if needed, or assume it matches
			// Adjust this mapping based on your actual API response structure
			student = {
				id: data.id,
				name: data.studentName || data.name, // Handle potential naming differences
				class: data.class || 'Unknown',
				gender: data.gender,
				cityOfOrigin: data.originRegion || data.cityOfOrigin || '-',
				father: data.fatherName || '-', // Assuming API might return this
				mother: data.motherName || '-',
				address: data.address || '-',
				status: (data.status === 'aktif' ? 'active' : data.status) || 'inactive'
			} as Student;
		} catch (err: unknown) {
			error = err instanceof Error ? err.message : String(err);
		} finally {
			loading = false;
		}
	});

	function getStatusStyle(status: string): string {
		switch (status) {
			case 'active':
			case 'aktif':
				return 'border-green-400 bg-green-300 text-emerald-700';
			case 'warning':
				return 'border-amber-400 bg-amber-300 text-amber-700';
			case 'inactive':
			case 'nonaktif':
				return 'border-red-400 bg-red-300 text-red-700';
			default:
				return 'border-slate-400 bg-slate-300 text-slate-700';
		}
	}
</script>

<div class="min-h-screen bg-slate-50 p-4 md:p-8">
	<div class="mx-auto max-w-4xl">
		<!-- Back button (Always visible) -->
		<a
			href="/siswa"
			class="mb-6 flex w-fit items-center gap-2 rounded-full bg-blue-100 p-2 text-blue-600 transition-colors hover:text-blue-800"
		>
			<span>
				<svg
					class="fill-blue-600"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					height="24"
					width="24"
				>
					<path
						fill-rule="evenodd"
						d="M12 2.25c-5.385 0 -9.75 4.365 -9.75 9.75s4.365 9.75 9.75 9.75 9.75 -4.365 9.75 -9.75S17.385 2.25 12 2.25Zm-4.28 9.22a0.75 0.75 0 0 0 0 1.06l3 3a0.75 0.75 0 1 0 1.06 -1.06l-1.72 -1.72h5.69a0.75 0.75 0 0 0 0 -1.5h-5.69l1.72 -1.72a0.75 0.75 0 0 0 -1.06 -1.06l-3 3Z"
						clip-rule="evenodd"
					></path>
				</svg>
			</span>
			<span> Kembali ke daftar </span>
		</a>

		{#if loading}
			<div class="flex h-64 items-center justify-center rounded-lg bg-white shadow-lg">
				<span class="loading loading-spinner loading-lg text-blue-500"></span>
			</div>
		{:else if error}
			<div
				class="flex h-64 flex-col items-center justify-center rounded-lg bg-white p-8 text-center shadow-lg"
			>
				<h1 class="text-2xl font-bold text-red-500">Error</h1>
				<p class="mt-2 text-slate-600">{error}</p>
			</div>
		{:else if student}
			<!-- Student card parent -->
			<div class="bg-white p-4 md:rounded-lg md:p-8 md:shadow-lg">
				<!-- student header -->
				<div class="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
					<div class="flex items-center gap-4">
						<!-- student image -->
						<div
							class="flex h-26 w-20 items-center justify-center overflow-hidden rounded-md bg-slate-200"
						>
							{#if student.gender === 'female'}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-12 w-12 text-slate-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clip-rule="evenodd"
									/>
								</svg>
							{:else}
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-12 w-12 text-slate-400"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fill-rule="evenodd"
										d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
										clip-rule="evenodd"
									/>
								</svg>
							{/if}
						</div>
						<!-- student name and id -->
						<div>
							<h1 class="text-xl font-bold text-slate-800 md:text-3xl">{student.name}</h1>
							<p class="mt-1 text-slate-500">NISN/ID: {student.id}</p>
						</div>
					</div>
					<div class="flex items-center">
						<span
							class={`rounded-md border px-4 py-2 text-sm font-bold tracking-wide uppercase ${getStatusStyle(student.status)}`}
						>
							{student.status}
						</span>
					</div>
				</div>

				<div class="grid gap-4 md:grid-cols-2">
					<div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
						<p class="text-xs font-medium text-slate-500 uppercase">Kelas</p>
						<p class="mt-1 text-lg font-semibold text-slate-800">{student.class}</p>
					</div>

					<div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
						<p class="text-xs font-medium text-slate-500 uppercase">Jenis Kelamin</p>
						<p class="mt-1 text-lg font-semibold text-slate-800 capitalize">
							{student.gender === 'male' ? 'Laki-laki' : 'Perempuan'}
						</p>
					</div>

					<div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
						<p class="text-xs font-medium text-slate-500 uppercase">Asal Daerah</p>
						<p class="mt-1 text-lg font-semibold text-slate-800">
							{student.cityOfOrigin}
						</p>
					</div>

					<div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
						<p class="text-xs font-medium text-slate-500 uppercase">Status</p>
						<p class="mt-1 text-lg font-semibold text-slate-800 capitalize  ">{student.status}</p>
					</div>

					<div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
						<p class="text-xs font-medium text-slate-500 uppercase">Nama Ayah</p>
						<p class="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-800 capitalize">
							{student.father}
						</p>
					</div>

					<div class="rounded-lg border border-slate-100 bg-slate-50 p-4">
						<p class="text-xs font-medium text-slate-500 uppercase">Nama Ibu</p>
						<p class="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-800 capitalize">
							{student.mother}
						</p>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

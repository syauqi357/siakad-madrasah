<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { API_FETCH } from '$lib/api';
	// import { DOWNLOAD_EXCEL_TEMPLATE } from '$env/dynamic/public';
	import Sort from '$lib/components/icons/sort.svelte';
	import AddIcon from '$lib/components/icons/addIcon.svelte';
	import UploadIcon from '$lib/components/icons/uploadIcon.svelte';
	import DownloadIcon from '$lib/components/icons/downloadIcon.svelte';
	// import More from '$lib/components/icons/more.svelte';
	import Arrow_up from '$lib/components/icons/arrow_up.svelte';
	import UploadExcel from '$lib/components/layout/upload/uploadExcel.svelte';

	type Student = {
		id: number;
		nisn: number;
		nama: string;
		kelas: string;
		jenisKelamin: string;
		asal: string;
		status: 'aktif' | 'warning' | 'nonaktif';
	};

	const DOWNLOAD_EXCEL_TEMPLATE = import.meta.env.VITE_API_URL;

	const DOWNLOAD_TEMPLATE_EXCEL = `${DOWNLOAD_EXCEL_TEMPLATE}/routes/api/students/download-template`;

	// This will be populated from the API
	let students: Student[] = [];
	let currentPage = 1;
	let totalPages = 1;
	let limit = 10;
	let loading = false;
	let isUploadModalOpen = false;

	// Options for items per page
	const limitOptions = [5, 10, 20, 50];

	async function fetchStudents(page: number) {
		loading = true;
		try {
			const token = localStorage.getItem('token');
			if (!token) {
				goto('/login');
				return;
			}

			const response = await API_FETCH(`/routes/api/studentDataSet?page=${page}&limit=${limit}`);

			if (!response.ok) {
				if (response.status === 401) {
					goto('/login');
					return;
				}
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();

			// Handle the new response structure { data: [], pagination: {} }
			const dataFromApi = result.data || [];
			const pagination = result.pagination;

			if (pagination) {
				currentPage = pagination.page;
				totalPages = pagination.totalPages;
			}

			// Transform the data from the API to match the component's expected structure
			students = dataFromApi.map((item: any) => ({
				id: item.id,
				nisn: item.nisn,
				nama: item.name,
				kelas: item.class,
				jenisKelamin: item.gender === 'male' ? 'M' : 'F',
				asal: item.cityOfOrigin || 'Unknown', // Default value if missing
				// Ensure status matches the component's type, defaulting if needed
				status: item.status === 'active' ? 'aktif' : 'nonaktif'
			}));
		} catch (error) {
			console.error('Failed to fetch student data:', error);
			// Optionally, handle the error in the UI
		} finally {
			loading = false;
		}
	}

	function handlePageChange(newPage: number) {
		if (newPage >= 1 && newPage <= totalPages) {
			fetchStudents(newPage);
		}
	}

	function handleLimitChange(event: Event) {
		const select = event.target as HTMLSelectElement;
		limit = parseInt(select.value);
		currentPage = 1; // Reset to first page when limit changes
		fetchStudents(currentPage);
	}

	// Helper to generate page numbers array [1, 2, 3, ..., 10]
	function getPageNumbers(current: number, total: number) {
		const delta = 2;
		const range = [];
		for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
			range.push(i);
		}

		if (current - delta > 2) {
			range.unshift('...');
		}
		if (current + delta < total - 1) {
			range.push('...');
		}

		range.unshift(1);
		if (total !== 1) {
			range.push(total);
		}

		return range;
	}

	async function handleUpload(event: CustomEvent<FormData>) {
		const formData = event.detail;
		// TODO: Replace with your actual upload endpoint
		console.log('Uploading file...', formData.get('file'));

		try {
			// Example upload logic:
			// const response = await API_FETCH('/routes/api/uploadStudents', {
			// 	method: 'POST',
			// 	body: formData
			// });

			// if (response.ok) {
			// 	fetchStudents(currentPage);
			// 	alert('Upload successful!');
			// } else {
			// 	alert('Upload failed.');
			// }
			alert('Fitur upload belum diimplementasikan sepenuhnya. Cek console untuk data.');
		} catch (error) {
			console.error('Upload error:', error);
		}
	}

	onMount(() => {
		fetchStudents(currentPage);
	});

	function getStatusStyle(status: Student['status']): string {
		switch (status) {
			case 'aktif':
				return 'flex w-fit items-center gap-3 rounded-lg border border-green-400 bg-green-300 p-0.5 text-xs text-emerald-700 px-2 py-1 md:py-1 md:px-2 capitalize font-bold';
			case 'warning':
				return 'rounded-lg w-fit border border-amber-400 bg-amber-300 p-0.5 text-xs text-amber-700 px-2 py-1 md:py-1 md:px-2 capitalize';
			case 'nonaktif':
				return 'rounded-lg w-fit border border-red-400 bg-red-300 p-0.5 text-xs text-red-700 px-2 py-1 md:py-1 md:px-2 capitalize';
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
		return jenisKelamin === 'F'
			? // using ternary operator
				'hidden md:flex h-5 w-5 items-center justify-center rounded-sm border border-pink-500 bg-pink-300 p-3 text-pink-700 text-sm'
			: 'hidden md:flex h-5 w-5 items-center justify-center rounded-sm border border-blue-500 bg-blue-300 p-3 text-blue-700 text-sm';
	}
</script>

<UploadExcel
	isOpen={isUploadModalOpen}
	on:close={() => (isUploadModalOpen = false)}
	on:upload={handleUpload}
/>

<div class="flex w-fit flex-col items-center justify-center md:p-3">
	<!-- header -->
	<div
		class="mb-6 flex w-full flex-col items-start justify-between gap-2 rounded-lg bg-slate-200 p-3 md:w-full md:flex-row"
	>
		<div class="flex flex-col gap-2">
			<span class="text-md font-bold tracking-wide capitalize md:text-4xl"> siswa </span>

			<!-- function search dll -->
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<!-- search input -->
				<div class="w-full max-w-sm min-w-25">
					<div class="relative">
						<input
							id="search"
							class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:shadow focus:outline-none"
						/>
						<label
							for="search"
							class="absolute top-2.5 left-2.5 origin-left transform cursor-text bg-slate-200 px-1 text-sm text-slate-400 capitalize transition-all peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90 peer-focus:text-xs peer-focus:text-slate-400"
						>
							<!-- original text : Type Here... -->
							cari siswa...
						</label>
					</div>
				</div>
			</div>
		</div>

		<!--	interactive button	-->
		<div
			class="flex w-full flex-col items-end md:items-center justify-center gap-2  text-sm md:w-fit md:flex-row"
		>
			<button>
				<a
					class="flex w-full items-center justify-center gap-2 rounded-md bg-blue-500 px-4 py-2 text-slate-50 capitalize md:w-fit"
					href="/siswa/addStudent"
				>
					<AddIcon /> tambah siswa
				</a>
			</button>
			<a href={DOWNLOAD_TEMPLATE_EXCEL}>
				<button
					class="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-700 px-4 py-2 text-emerald-100 capitalize hover:bg-emerald-800"
				>
					<DownloadIcon /> Download Template
				</button>
			</a>
			<button
				type="button"
				class="flex w-fit items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white capitalize"
				on:click={() => (isUploadModalOpen = true)}
			>
				<UploadIcon /> upload excel
			</button>
		</div>
	</div>

	<div
		class="flex h-auto w-full flex-col items-center justify-center rounded-xl bg-slate-100 p-3 md:w-full md:p-4"
	>
		<!--	head of student	-->

		<div
			class="mb-4 grid h-auto w-full gap-3 rounded-md border-2 border-blue-700 bg-blue-500 text-slate-50 transition-all duration-150 ease-in-out hover:bg-blue-600"
		>
			<div
				class="col-span-2 grid grid-cols-5 gap-8 text-xs font-semibold uppercase transition-all ease-in-out md:grid-cols-7 md:text-base"
			>
				<div class="flex cursor-pointer items-center justify-center py-3 hover:scale-109">
					nisn <Sort />
				</div>
				<div
					class="flex cursor-pointer items-center justify-center py-3 transition-all ease-in-out hover:scale-109"
				>
					nama<Sort />
				</div>
				<div
					class="flex cursor-pointer items-center justify-center py-3 transition-all ease-in-out hover:scale-109"
				>
					kelas<Sort />
				</div>
				<div
					class="hidden cursor-pointer items-center justify-center py-3 transition-all ease-in-out hover:scale-109 md:flex"
				>
					gender <Sort />
				</div>
				<div
					class="hidden cursor-pointer items-center justify-center py-3 transition-all ease-in-out hover:scale-109 md:flex"
				>
					asal <Sort />
				</div>
				<div
					class="flex cursor-pointer items-center justify-center py-3 transition-all ease-in-out hover:scale-109"
				>
					status <Sort />
				</div>
				<div
					class="flex cursor-pointer items-center justify-center py-3 transition-all ease-in-out hover:scale-109"
				>
					aksi<Sort />
				</div>
			</div>
		</div>
		<!-- line student -->
		{#if loading}
			<div class="flex justify-center p-8">
				<span class="loading loading-spinner loading-lg">Loading...</span>
			</div>
		{:else}
			{#each students as student (student.id)}
				<div
					class="mb-3 grid h-auto w-full grid-cols-1 items-center justify-between gap-6 rounded-lg bg-slate-200 p-2 transition-all duration-150 ease-in-out hover:bg-slate-300"
				>
					<div
						class=" grid grid-cols-5 items-center gap-8 px-2 text-xs md:grid-cols-7 md:text-base"
					>
						<div class="flex items-center justify-center">
							{student.nisn}
						</div>
						<div class="flex items-center justify-center text-slate-700">
							{student.nama}
						</div>
						<div class="flex items-center justify-center">{student.kelas}</div>
						<div class="flex items-center justify-center py-3">
							<div class={getGenderStyle(student.jenisKelamin)}>
								{student.jenisKelamin}
							</div>
						</div>
						<div class="hidden items-center justify-center md:flex">{student.asal}</div>
						<div class="flex items-center justify-center">
							<span class={getStatusStyle(student.status)}>
								{getStatusText(student.status)}
								{#if student.status === 'aktif'}
									<div
										class="flex h-2 w-2 items-center justify-center rounded-full bg-green-500"
									></div>
								{/if}
							</span>
						</div>
						<a href="/siswa/{student.id}">
							<button
								aria-label="More details"
								title="selengkapnya"
								class=" inline-flex flex-row-reverse items-center justify-center gap-1 rounded-md bg-blue-500 px-4 text-white capitalize hover:bg-blue-600 md:py-2"
							>
								<!-- icon more details -->
								<Arrow_up />
								<!-- more -->
								<span class="hidden text-xs md:flex md:text-sm"> selengkapnya </span>
							</button>
						</a>
					</div>
				</div>
			{/each}
		{/if}

		<!-- pagination -->
		<div class="mt-4 flex h-12 w-full flex-row items-center justify-center gap-2 md:w-4xl">
			<!-- previous -->
			<button
				aria-label="button pagination"
				class="flex flex-row-reverse items-center justify-center gap-1 rounded-md bg-blue-500 px-3 py-1 text-slate-100 capitalize disabled:cursor-not-allowed disabled:opacity-50"
				on:click={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1 || loading}
			>
				previous
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="#e3e3e3"
						><path
							d="m314-440 114 114q12 12 11.5 28T428-270q-12 12-28.5 12.5T371-269L188-452q-12-12-12-28t12-28l183-183q12-12 28.5-11.5T428-690q11 12 11.5 28T428-634L314-520h446q17 0 28.5 11.5T800-480q0 17-11.5 28.5T760-440H314Z"
						/></svg
					>
				</span>
			</button>

			<!-- Dynamic Page Numbers -->
			<div class="flex gap-1">
				{#each getPageNumbers(currentPage, totalPages) as page}
					{#if page === '...'}
						<span class="px-3 py-2">...</span>
					{:else}
						<button
							class="flex items-center justify-center rounded-md px-3 py-1 {currentPage === page
								? 'bg-cyan-600 font-bold text-white'
								: 'bg-cyan-800 text-slate-100 hover:bg-cyan-700'}"
							on:click={() => handlePageChange(Number(page))}
							disabled={loading}
						>
							{page}
						</button>
					{/if}
				{/each}
			</div>

			<!-- next -->
			<button
				aria-label="button pagination"
				class="flex items-center justify-center gap-1 rounded-md bg-blue-500 px-3 py-1 text-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
				on:click={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages || loading}
			>
				Next
				<span>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						height="24px"
						viewBox="0 -960 960 960"
						width="24px"
						fill="currentColor"
						><path
							d="M646-440H200q-17 0-28.5-11.5T160-480q0-17 11.5-28.5T200-520h446L532-634q-12-12-11.5-28t11.5-28q12-12 28.5-12.5T589-691l183 183q6 6 8.5 13t2.5 15q0 8-2.5 15t-8.5 13L589-269q-12 12-28.5 11.5T532-270q-11-12-11.5-28t11.5-28l114-114Z"
						/></svg
					></span
				>
			</button>

			<div class="flex items-center gap-2">
				<span class="text-sm text-slate-600">Tampilkan:</span>
				<select
					class="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm focus:border-blue-500 focus:outline-none"
					value={limit}
					on:change={handleLimitChange}
				>
					{#each limitOptions as option}
						<option value={option}>{option}</option>
					{/each}
				</select>
			</div>
		</div>
	</div>
</div>

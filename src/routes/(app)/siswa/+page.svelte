<script lang="ts">
	import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { apiFetch } from '$lib/api';
	import Sort from '$lib/components/icons/sort.svelte';
	import More from '$lib/components/icons/more.svelte';
	import Arrow_up from '$lib/components/icons/arrow_up.svelte';


	type Student = {
		id: number;
		nisn: number;
		nama: string;
		kelas: string;
		jenisKelamin: string;
		asal: string;
		status: 'aktif' | 'warning' | 'nonaktif';
	};

	// This will be populated from the API
	let students: Student[] = [];

	onMount(async () => {
		try {
            const token = localStorage.getItem('token');
            if (!token) {
                goto('/login');
                return;
            }

			const response = await apiFetch('/routes/api/studentData');

            if (!response.ok) {
                if (response.status === 401) {
                    goto('/login');
                    return;
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

			const dataFromApi = await response.json();

			// Transform the data from the API to match the component's expected structure
			students = dataFromApi.map((item: any) => ({
				id: item.id,
				nisn: item.nisn,
				nama: item.name,
				kelas: item.class,
				jenisKelamin: item.gender === 'male' ? 'M' : 'F',
				asal: item.cityOfOrigin,
				// Ensure status matches the component's type, defaulting if needed
				status: item.status === 'active' ? 'aktif' : 'nonaktif'
			}));
		} catch (error) {
			console.error('Failed to fetch student data:', error);
			// Optionally, handle the error in the UI
		}
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

<div class="flex w-fit flex-col items-center justify-center md:p-3">
	<!-- header -->
	<div class="mb-6 flex w-full flex-col gap-5 rounded-lg bg-slate-200 p-3 md:w-full">
		<span class="text-md font-bold tracking-wide capitalize md:text-4xl"> siswa </span>

		<!-- function search dll -->
		<div class="">
			<!-- search input -->

			<!-- di ambil dari
			https://www.material-tailwind.com/docs/html/input
			-->
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
			<!-- sort -->
			<!-- classifier funct -->
			<div class="flex gap-3 bg-slate-200 p-2 md:flex"></div>
		</div>
		<button class="flex w-fit rounded-md bg-blue-500 px-5 py-3 text-slate-50">tambah siswa</button>
	</div>
	<div
		class="flex h-auto w-full flex-col items-center justify-center rounded-xl bg-slate-100 p-3 md:w-full md:p-4"
	>
		<!--	head of student	-->

		<div
			class="mb-4 grid h-auto w-full gap-3 rounded-md border-2 border-blue-700 bg-blue-500 text-slate-50 transition-all duration-150 ease-in-out hover:bg-blue-600"
		>
			<div
				class="col-span-2 grid grid-cols-5 gap-8 text-xs font-semibold uppercase md:grid-cols-7 md:text-base"
			>
				<div class="flex cursor-pointer hover:scale-109 transition-all ease-in-out items-center justify-center py-3">
					nisn <Sort />
				</div>
				<div class="flex items-center cursor-pointer hover:scale-109 transition-all ease-in-out justify-center py-3">nama<Sort /></div>
				<div class="flex items-center justify-center py-3 cursor-pointer hover:scale-109 transition-all ease-in-out">kelas<Sort /></div>
				<div class="hidden items-center justify-center py-3 md:flex cursor-pointer hover:scale-109 transition-all ease-in-out">gender <Sort /></div>
				<div class="hidden items-center justify-center py-3 md:flex cursor-pointer hover:scale-109 transition-all ease-in-out">asal <Sort /></div>
				<div class="flex items-center justify-center py-3 cursor-pointer hover:scale-109 transition-all ease-in-out">status <Sort /></div>
				<div class="flex items-center justify-center py-3 cursor-pointer hover:scale-109 transition-all ease-in-out">aksi<Sort /></div>
			</div>
		</div>
		<!-- line student -->
		{#each students as student (student.id)}
			<div
				class="mb-3 grid h-auto w-full grid-cols-1 items-center justify-between gap-6 rounded-lg bg-slate-200 p-3 transition-all duration-150 ease-in-out hover:bg-slate-300"
			>
				<div class=" grid grid-cols-5 items-center gap-8 p-2 text-xs md:grid-cols-7 md:text-base">
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
					<div class="hidden md:flex items-center justify-center">{student.asal}</div>
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
							class=" inline-flex flex-row-reverse items-center capitalize justify-center gap-1 rounded-md bg-blue-500  text-white hover:bg-blue-600 md:py-2 px-4"
						>
							<!-- icon more details -->
							<Arrow_up/>
							<!-- more -->
							<span class="hidden text-xs md:flex md:text-sm"> selengkapnya </span>
						</button>
					</a>
				</div>
			</div>
		{/each}

		<!-- pagination -->
		<div class="flex h-12 w-full flex-row items-center justify-center gap-2 md:w-4xl">
			<!-- previous -->
			<button
				aria-label="button pagination"
				class="flex flex-row-reverse items-center justify-center gap-2 rounded-md bg-cyan-800 p-4 pt-2 pb-2 text-slate-100"
			>
				previous
				<span>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						id="Arrow-Left--Streamline-Solar-Ar"
						height="24"
						width="24"
					>
						<desc> Arrow Left Streamline Icon: https://streamlinehq.com </desc>
						<path
							d="M20 12H4m0 0 6 -6m-6 6 6 6"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
						></path>
					</svg>
				</span>
			</button>

			<!-- number pagination -->
			<button
				aria-label="button pagination"
				class="flex items-center justify-center rounded-md bg-cyan-800 p-4 pt-2 pb-2 text-slate-100"
			>
				1
			</button>
			<!-- next -->
			<button
				aria-label="button pagination"
				class="flex items-center justify-center gap-2 rounded-md bg-cyan-800 p-4 pt-2 pb-2 text-slate-100"
			>
				Next
				<span>
					<svg
						viewBox="0 0 24 24"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
						id="Arrow-Right--Streamline-Solar-Ar"
						height="24"
						width="24"
					>
						<desc> Arrow Right Streamline Icon: https://streamlinehq.com </desc>
						<path
							d="M4 12h16m0 0 -6 -6m6 6 -6 6"
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1.5"
						></path>
					</svg></span
				>
			</button>
		</div>
	</div>
</div>

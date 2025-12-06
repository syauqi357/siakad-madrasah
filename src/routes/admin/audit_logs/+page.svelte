<script lang="ts">
	let searchQuery: string = '';
	let selectedFilter: string = 'all';
	let selectedTimeRange: string = 'all';

	// Types
	interface Filter {
		id: string;
		label: string;
	}

	interface TimeRange {
		id: string;
		label: string;
	}

	interface AuditLog {
		id: number;
		type: string;
		user: string;
		action: string;
		category: string;
		status: string;
		timestamp: string;
	}

	// Filter options
	const filters: Filter[] = [
		{ id: 'all', label: 'Semua' },
		{ id: 'auth', label: 'Autentikasi' },
		{ id: 'grades', label: 'Nilai' },
		{ id: 'student', label: 'Siswa' },
		{ id: 'attendance', label: 'Absensi' },
		{ id: 'permissions', label: 'Izin' },
		{ id: 'export', label: 'Ekspor' }
	];

	const timeRanges: TimeRange[] = [
		{ id: 'all', label: 'Semua Waktu' },
		{ id: 'today', label: 'Hari Ini' },
		{ id: 'week', label: 'Minggu Ini' },
		{ id: 'month', label: 'Bulan Ini' },
		{ id: 'semester', label: 'Semester Ini' }
	];

	// Sample audit log data
	const auditLogs: AuditLog[] = [
		{
			id: 1,
			type: 'grades',
			user: 'admin',
			action: 'Mengubah nilai Matematika',
			category: 'Ahmad Rizki (10-A)',
			status: 'changed',
			timestamp: '6 Dec 2024 2:23 PM'
		},
		{
			id: 2,
			type: 'auth',
			user: 'admin',
			action: 'Login gagal',
			category: 'Sistem Admin',
			status: 'deleted',
			timestamp: '6 Dec 2024 1:45 PM'
		},
		{
			id: 3,
			type: 'student',
			user: 'admin',
			action: 'Tambah siswa baru',
			category: 'Siti Nurhaliza',
			status: 'success',
			timestamp: '6 Dec 2024 10:15 AM'
		},
		{
			id: 4,
			type: 'attendance',
			user: 'admin',
			action: 'Ubah kehadiran',
			category: 'Fahmi Hidayat (11-C)',
			status: 'changed',
			timestamp: '6 Dec 2024 9:30 AM'
		},
		{
			id: 5,
			type: 'permissions',
			user: 'admin',
			action: 'Ubah role',
			category: 'Pak Joko Widodo',
			status: 'changed',
			timestamp: '5 Dec 2024 4:20 PM'
		},
		{
			id: 6,
			type: 'export',
			user: 'admin',
			action: 'Ekspor data siswa',
			category: 'Kelas 12 (120 siswa)',
			status: 'success',
			timestamp: '5 Dec 2024 3:10 PM'
		},
		{
			id: 7,
			type: 'grades',
			user: 'admin',
			action: 'Input nilai UTS',
			category: 'Kelas 12-A Fisika',
			status: 'success',
			timestamp: '5 Dec 2024 2:05 PM'
		},
		{
			id: 8,
			type: 'auth',
			user: 'admin',
			action: 'Login berhasil',
			category: 'Portal Siswa',
			status: 'success',
			timestamp: '5 Dec 2024 8:15 AM'
		}
	];
	// Filter logs based on search and filters
	$: filteredLogs = auditLogs.filter((log: AuditLog) => {
		const matchesSearch =
			searchQuery === '' ||
			log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
			log.category.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesFilter = selectedFilter === 'all' || log.type === selectedFilter;

		return matchesSearch && matchesFilter;
	});

	function getStatusColor(status: string): string {
		const colors: Record<string, string> = {
			success: 'border-green-400 bg-green-300',
			changed: 'border-blue-400 bg-blue-300',
			deleted: 'border-red-400 bg-red-300',
			pending: 'border-yellow-400 bg-yellow-300'
		};
		return colors[status] || 'border-slate-400 bg-slate-300';
	}
</script>

<!-- Header Section -->
<div
	class="w-full flex-col items-start gap-3 rounded-2xl p-4 transition-all ease-in-out sm:flex"
>
	<h1 class="text-xl font-semibold tracking-wide capitalize sm:text-3xl">audit log</h1>

	<!-- Filters and Search -->
	<div class="flex flex-col flex-wrap items-center gap-3 p-3 sm:flex-row">
		<!-- Category Filter Buttons -->
		{#each filters as filter}
			<button
				on:click={() => (selectedFilter = filter.id)}
				class="rounded-md p-2 pr-3 pl-3 text-xs transition-all duration-150 ease-in-out sm:text-sm {selectedFilter ===
				filter.id
					? 'bg-slate-700 text-slate-100 outline-2 outline-offset-2 outline-slate-600'
					: 'bg-slate-500 text-slate-100 hover:bg-slate-600'}"
			>
				{filter.label}
			</button>
		{/each}

		<!-- Time Range Select -->
		<select
			bind:value={selectedTimeRange}
			class="rounded-md bg-slate-500 p-2 pr-3 pl-3 text-xs text-slate-100 transition-all duration-150 ease-in-out hover:bg-slate-600 sm:text-sm"
		>
			{#each timeRanges as range}
				<option value={range.id}>{range.label}</option>
			{/each}
		</select>

		<!-- Search Input -->
		<div class="w-full max-w-sm min-w-[200px]">
			<div class="relative">
				<input
					id="searchLogs"
					bind:value={searchQuery}
					class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 shadow-xs transition duration-300 placeholder:text-slate-600 hover:border-slate-300 focus:border-slate-600 focus:shadow focus:outline-none"
					placeholder=" "
				/>
				<label
					for="searchLogs"
					class="absolute top-2.5 left-2.5 origin-left transform cursor-text bg-white px-1 text-sm text-slate-400 capitalize transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:scale-100 peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90 peer-focus:text-xs peer-focus:text-slate-400 peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:scale-90"
				>
					cari log aktifitas
				</label>
			</div>
		</div>
	</div>
</div>

<!-- Results Count -->
<div class="px-4 pb-2 text-sm text-slate-600">
	Menampilkan <span class="font-semibold">{filteredLogs.length}</span> dari
	<span class="font-semibold">{auditLogs.length}</span> log
</div>

<!-- Your Existing Table -->
<div class="relative mt-2 overflow-x-auto rounded-lg border-slate-500 shadow-xs">
	<table class="text-body w-full text-left text-sm rtl:text-right table-fixed">
		<thead
			class="border-default bg-slate-600 text-sm text-slate-50 duration-150 ease-in-out hover:bg-slate-500"
		>
			<tr class="text-xs capitalize">
				<th scope="col" class="px-6 py-3 font-medium w-[12%]"> users </th>
				<th scope="col" class="px-6 py-3 font-medium w-[25%]"> action </th>
				<th scope="col" class="px-6 py-3 font-medium w-[25%]"> Category </th>
				<th scope="col" class="px-6 py-3 font-medium w-[15%]"> status </th>
				<th scope="col" class="px-6 py-3 font-medium w-[23%]"> timestamp </th>
			</tr>
		</thead>
		<tbody class="text-xs">
			<!-- Loop through filtered logs -->
			{#each filteredLogs as log (log.id)}
				<tr
					class="border-default bg-slate-100 transition-all duration-150 ease-in-out hover:bg-slate-200"
				>
					<th scope="row" class="text-heading px-6 py-4 font-medium w-[12%] truncate">
						{log.user}
					</th>
					<td class="px-6 py-4 w-[25%] truncate">
						{log.action}
					</td>
					<td class="px-6 py-4 w-[25%] truncate">
						{log.category}
					</td>
					<td class="px-6 py-4 w-[15%]">
						<span class="rounded-md border-2 p-1 pr-2 pl-2 {getStatusColor(log.status)} inline-block">
							{log.status}
						</span>
					</td>
					<td class="px-6 py-4 uppercase w-[23%] truncate">
						{log.timestamp}
					</td>
				</tr>
			{/each}

			<!-- Empty State -->
			{#if filteredLogs.length === 0}
				<tr>
					<td colspan="5" class="px-6 py-12 text-center text-slate-500">
						Tidak ada log yang ditemukan
					</td>
				</tr>
			{/if}
		</tbody>
	</table>
</div>

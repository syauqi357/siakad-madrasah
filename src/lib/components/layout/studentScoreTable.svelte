<script lang="ts">
	export let headers: string[] = [];
	export let data: any[] = [];
	export let className: string = '';
	export let subjectName: string = '';
	export let loading: boolean = false;
</script>

<div
	class="w-full overflow-hidden rounded-xl border border-slate-500 bg-white/80 shadow-xl backdrop-blur-md"
>
	<div
		class="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center"
	>
		<div>
			<h3 class="flex items-center gap-2 text-xl font-bold text-slate-800">
				<span class="rounded-lg bg-blue-100 p-1.5 text-blue-600">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
						/>
					</svg>
				</span>
				Rekap Nilai Siswa
			</h3>
			<p class="mt-1 text-sm text-slate-500">
				Kelas: <span class="font-semibold text-slate-700">{className}</span> • Mapel:
				<span class="font-semibold text-blue-600">{subjectName}</span>
			</p>
		</div>

		<!-- Slot for extra controls (like the dropdown) -->
		<div class="flex items-center gap-3">
			<slot name="controls" />
		</div>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead class="bg-slate-50 font-semibold tracking-wider text-slate-600 uppercase">
				<tr>
					{#each headers as header}
						<th class="border-b border-slate-100 px-6 py-4 whitespace-nowrap">{header}</th>
					{/each}
				</tr>
			</thead>
			<tbody class="divide-y divide-slate-100">
				{#if loading}
					<tr>
						<td colspan={headers.length} class="px-6 py-12 text-center text-slate-500">
							<span class="loading loading-spinner loading-lg text-blue-500"></span>
							<p class="mt-2">Memuat data...</p>
						</td>
					</tr>
				{:else if data.length === 0}
					<tr>
						<td colspan={headers.length} class="px-6 py-12 text-center text-slate-500">
							<p>Tidak ada data nilai untuk kelas ini.</p>
						</td>
					</tr>
				{:else}
					{#each data as row}
						<tr class="transition-colors hover:bg-blue-50/50">
							<td class="px-6 py-4 font-medium whitespace-nowrap text-slate-800"
								>{row.studentName}</td
							>
							<td class="px-6 py-4 font-mono text-xs text-slate-500">{row.nisn}</td>

							<!-- Dynamic Score Columns -->
							{#each headers.slice(2) as header}
								<td class="px-6 py-4 text-slate-600">
									{#if row.scores && row.scores[header] !== undefined}
										<span
											class="inline-flex h-8 w-8 items-center justify-center rounded-full {row
												.scores[header] >= 90
												? 'bg-green-100 text-green-700'
												: row.scores[header] >= 80
													? 'bg-blue-100 text-blue-700'
													: 'bg-amber-100 text-amber-700'} text-xs font-medium"
										>
											{row.scores[header]}
										</span>
									{:else}
										<span class="text-slate-300">-</span>
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>

	<div
		class="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-6 py-3 text-xs text-slate-500"
	>
		<span>Menampilkan {data.length} siswa</span>
		<span class="flex gap-1">
			<div class="h-2 w-2 rounded-full bg-slate-300"></div>
			<div class="h-2 w-2 rounded-full bg-slate-300"></div>
			<div class="h-2 w-2 rounded-full bg-blue-500"></div>
		</span>
	</div>
</div>

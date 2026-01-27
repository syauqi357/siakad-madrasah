<script lang="ts">
	export let headers: string[] = [];
	export let data: any[] = [];
	export let className: string = '';
	export let subjectName: string = '';
	export let loading: boolean = false;
</script>

<div class="w-full overflow-hidden border border-slate-200 bg-white">
	<div
		class="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center"
	>
		<div>
			<h3 class="flex items-center gap-2 text-xl font-bold text-slate-800">Rekap Nilai Siswa</h3>
			<p class="mt-1 text-sm text-slate-500">
				Kelas: <span class="font-semibold text-slate-700">{className}</span> • Mapel:
				<span class="font-semibold text-slate-700">{subjectName}</span>
			</p>
		</div>

		<!-- Slot for extra controls (like the dropdown) -->
		<div class="flex items-center gap-3">
			<slot name="controls" />
		</div>
	</div>

	<div class="overflow-x-auto">
		<table class="w-full text-left text-sm">
			<thead class="bg-white font-semibold tracking-wider text-slate-800 uppercase">
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
							<span class="loading loading-spinner loading-lg text-slate-400"></span>
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
						<tr class="hover:bg-slate-50">
							<td class="px-6 py-4 font-medium whitespace-nowrap text-slate-800"
								>{row.studentName}</td
							>
							<td class="px-6 py-4 font-mono text-xs text-slate-500">{row.nisn}</td>

							<!-- Dynamic Score Columns -->
							{#each headers.slice(2) as header}
								<td class="px-6 py-4 text-slate-600">
									{#if row.scores && row.scores[header] !== undefined}
										<span
											class="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 text-xs font-medium text-slate-700"
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
		class="flex items-center justify-between border-t border-slate-100 bg-white px-6 py-3 text-xs text-slate-500"
	>
		<span>Menampilkan {data.length} siswa</span>
		<div class="flex gap-1">
			<!-- Simple dots or pagination placeholders if needed -->
		</div>
	</div>
</div>

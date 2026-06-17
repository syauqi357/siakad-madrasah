<script lang="ts">
	export let headers: string[] = [];
	export let data: any[] = [];
	export let className: string = '';
	export let subjectName: string = '';
	export let loading: boolean = false;

	let tableEl: HTMLTableElement;
	let scrollContainer: HTMLDivElement;

	function handleWheel(e: WheelEvent) {
		if (!e.ctrlKey) return;
		e.preventDefault();
		scrollContainer.scrollLeft += e.deltaY;
	}

	function focusCell(row: number, col: number) {
		const target = tableEl?.querySelector<HTMLElement>(`[data-row="${row}"][data-col="${col}"]`);
		target?.focus();
		target?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
	}

	function handleKeydown(e: KeyboardEvent) {
		const active = document.activeElement as HTMLElement;
		if (!active?.dataset || active.dataset.row === undefined) return;

		const row = parseInt(active.dataset.row);
		const col = parseInt(active.dataset.col ?? '0');
		const maxRow = data.length - 1;
		const maxCol = headers.length - 1;

		switch (e.key) {
			case 'ArrowUp':
				e.preventDefault();
				focusCell(Math.max(0, row - 1), col);
				break;
			case 'ArrowDown':
				e.preventDefault();
				focusCell(Math.min(maxRow, row + 1), col);
				break;
			case 'ArrowLeft':
				e.preventDefault();
				focusCell(row, Math.max(0, col - 1));
				break;
			case 'ArrowRight':
				e.preventDefault();
				focusCell(row, Math.min(maxCol, col + 1));
				break;
			case 'Home':
				e.preventDefault();
				focusCell(row, 0);
				break;
			case 'End':
				e.preventDefault();
				focusCell(row, maxCol);
				break;
		}
	}
</script>

<div class="w-full overflow-hidden rounded-lg border border-slate-300 bg-white">
	<div
		class="flex flex-col items-start justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center"
	>
		<div>
			<h3 class="flex items-center gap-2 text-2xl font-bold text-blue-700">Rekap Nilai Siswa</h3>
			<p class="text-md mt-1 text-slate-500">
				Kelas: <span class="font-semibold text-slate-700">{className}</span>
			</p>
			<p class="text-md mt-1 text-slate-500">
				Mapel: <span class="font-semibold text-slate-700">{subjectName}</span>
			</p>
		</div>

		<!-- Slot for extra controls (like the dropdown) -->
		<div class="flex items-center gap-3">
			<slot name="controls" />
		</div>
	</div>

	<div bind:this={scrollContainer} on:wheel={handleWheel} class="overflow-x-auto scroll-smooth">
		<table
			bind:this={tableEl}
			on:keydown={handleKeydown}
			role="grid"
			tabindex="-1"
			class="w-full text-left text-sm"
		>
			<thead class="bg-white font-semibold tracking-wider text-slate-800 uppercase">
				<tr>
					{#each headers as header, headerIndex (header)}
						<th
							class="border-b border-slate-100 px-6 py-4 whitespace-nowrap {headerIndex === 0
								? 'sticky left-0 z-20 bg-white shadow-[2px_0_0_0_rgba(0,0,0,0.04)]'
								: ''}"
						>
							{header}
						</th>
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
					{#each data as row, rowIndex (row.nisn)}
						<tr class="hover:bg-slate-50">
							<td
								data-row={rowIndex}
								data-col={0}
								tabindex="0"
								class="sticky left-0 z-10 rounded-sm bg-white px-6 py-4 font-medium whitespace-nowrap text-slate-800 shadow-[2px_0_0_0_rgba(0,0,0,0.04)] focus:bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:ring-inset"
								>{row.studentName}</td
							>
							<td
								data-row={rowIndex}
								data-col={1}
								tabindex="0"
								class="text-md rounded-sm px-6 py-4 font-semibold tracking-wide text-slate-700 focus:bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:ring-inset"
								>{row.nisn}</td
							>

							<!-- Dynamic Score Columns -->
							{#each headers.slice(2) as header, colIndex (header)}
								<td
									data-row={rowIndex}
									data-col={colIndex + 2}
									tabindex="0"
									class="rounded-md px-6 py-4 text-slate-600 focus:bg-blue-50 focus:ring-2 focus:ring-blue-400 focus:outline-none focus:ring-inset"
								>
									{#if row.scores && row.scores[header] !== undefined}
										<span
											class="text-md inline-flex items-center justify-center rounded border border-slate-200 px-2 py-2 font-bold text-slate-700"
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

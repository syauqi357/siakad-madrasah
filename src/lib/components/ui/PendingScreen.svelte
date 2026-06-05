<script lang="ts">
	export let title: string = 'Fitur Sedang Dikembangkan';
	export let message: string =
		'Mohon maaf, fitur ini masih dalam tahap pengembangan dan akan segera tersedia.';
</script>

<div class="flex min-h-[60vh] w-full items-center justify-center p-6">
	<div class="flex max-w-md flex-col items-center text-center">
		<!-- Icon -->
		<div class="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
			<svg
				class="h-10 w-10 text-amber-500"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				stroke-width="1.5"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.049.58.025 1.193-.14 1.743"
				/>
			</svg>
		</div>

		<!-- Title -->
		<h2 class="mb-2 text-xl font-bold text-slate-800">{title}</h2>

		<!-- Message -->
		<p class="mb-6 text-sm leading-relaxed text-slate-500">{message}</p>

		<!-- Decorative progress bar -->
		<div class="mb-6 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100">
			<div class="h-full w-2/5 animate-pulse rounded-full bg-amber-400"></div>
		</div>

		<!-- Back button -->
		<button
			on:click={() => history.back()}
			class="rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-600 transition-all duration-200 hover:border-slate-300 hover:bg-slate-50"
		>
			Kembali
		</button>
	</div>
</div>

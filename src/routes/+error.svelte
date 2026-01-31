<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	function gotomain() {
		goto('/');

		// 	return function
		return gotomain();
	}
</script>

<div class="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
	<div class="text-center">
		<!-- Error Code -->
		<h1 class="text-9xl font-bold text-gray-200">
			{page.status}
		</h1>

		<!-- Error Title -->
		<h2 class="mt-4 text-2xl font-semibold text-gray-800">
			{#if page.status === 404}
				Halaman Tidak Ditemukan
			{:else if page.status === 500}
				Kesalahan Server
			{:else if page.status === 403}
				Akses Ditolak
			{:else}
				Terjadi Kesalahan
			{/if}
		</h2>

		<!-- Error Message -->
		<p class="mt-2 text-gray-600">
			{#if page.status === 404}
				Maaf, halaman yang Anda cari tidak ada atau telah dipindahkan.
			{:else}
				{page.error?.message || 'Terjadi kesalahan yang tidak terduga.'}
			{/if}
		</p>

		<!-- Action Buttons -->
		<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
			<button
				on:click={gotomain()}
				class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-700"
			>
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
					/>
				</svg>
				Kembali ke Beranda
			</button>
			<button
				on:click={() => history.back()}
				class="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
			>
				<svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
				</svg>
				Kembali
			</button>
		</div>
	</div>

	<!-- Decorative Element -->
	<div class="mt-16 text-center text-sm text-gray-400">SIAKAD Madrasah</div>
</div>

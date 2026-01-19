<script lang="ts">
	const BACKEND_URL_SET = import.meta.env.VITE_API_URL;
	function DOWNLOAD_TEMPLATE_EXCEL() {
		window.location.href = `${BACKEND_URL_SET}/routes/api/score/download-template`;
	}
</script>

<div class="p-4">
	<h1 class="mb-4 text-2xl font-bold">Manajemen Nilai</h1>

	<p class="mb-4">
		Gunakan tombol di bawah ini untuk mengunduh template Excel untuk mengunggah nilai secara massal.
	</p>

	<button
		on:click={DOWNLOAD_TEMPLATE_EXCEL}
		class="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
	>
		Download Template Nilai
	</button>
</div>

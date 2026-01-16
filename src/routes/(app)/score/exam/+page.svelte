<script lang="ts">
	// This is the URL of your backend.
	// In a real app, you'd put this in your .env file.
	const backendUrl = 'http://localhost:3000';

	function downloadTemplate() {
		// We can just navigate to the download link. The browser will handle the download.
		window.location.href = `${backendUrl}/routes/api/score/download-template`;
	}
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold mb-4">Manajemen Nilai</h1>

	<p class="mb-4">Gunakan tombol di bawah ini untuk mengunduh template Excel untuk mengunggah nilai secara massal.</p>

	<button
		on:click={downloadTemplate}
		class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
	>
		Download Template Nilai
	</button>
</div>

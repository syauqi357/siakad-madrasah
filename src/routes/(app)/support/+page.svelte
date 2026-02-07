<script lang="ts">
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

	let openFaq: number | null = null;

	function toggleFaq(index: number) {
		openFaq = openFaq === index ? null : index;
	}

	const techStack = ['SvelteKit', 'Express.js', 'SQLite', 'Tailwind'];

	const faqs = [
		{
			q: 'Bagaimana cara menambahkan siswa baru?',
			a: 'Buka menu Data Siswa > Daftar Siswa, lalu klik tombol "Tambah Siswa" di pojok kanan atas. Isi formulir dengan data lengkap siswa kemudian simpan.'
		},
		{
			q: 'Bagaimana cara upload nilai menggunakan template Excel?',
			a: 'Buka menu Penilaian > Input Nilai. Download template terlebih dahulu dengan memilih rombel, lalu isi nilai pada file Excel. Setelah selesai, upload kembali file tersebut melalui form upload.'
		},
		{
			q: 'Bagaimana cara memindahkan siswa ke rombel lain?',
			a: 'Buka menu Rombongan Belajar > Daftar Rombel. Pilih rombel tujuan, lalu gunakan fitur "Tambah Anggota" untuk memindahkan siswa dari rombel sebelumnya.'
		},
		{
			q: 'Apa yang dimaksud dengan Kenaikan Kelas?',
			a: 'Kenaikan Kelas adalah fitur untuk mempromosikan siswa ke tingkat berikutnya secara massal. Buka menu Penilaian > Kenaikan Kelas, pilih rombel asal dan rombel tujuan, lalu proses kenaikan.'
		},
		{
			q: 'Bagaimana cara melihat riwayat aktivitas sistem?',
			a: 'Buka menu Administrasi > Audit Logs. Di sana Anda dapat melihat seluruh riwayat aktivitas pengguna seperti login, perubahan data, dan operasi lainnya.'
		},
		{
			q: 'Apakah data siswa bisa diekspor?',
			a: 'Ya, pada halaman Daftar Siswa terdapat tombol export yang memungkinkan Anda mengunduh data dalam format Excel (.xlsx).'
		}
	];

	const shortcuts = [
		{ keys: ['Ctrl', 'K'], desc: 'Navigasi cepat' },
		{ keys: ['Esc'], desc: 'Tutup modal / sidebar' },
		{ keys: ['Tab'], desc: 'Pindah antar field' }
	];
</script>

<div class="min-h-screen px-4 py-8 md:px-8">
	<div class="mx-auto max-w-5xl">
		<!-- Header -->
		<div class="mb-8">
			<h1 class="text-2xl font-bold text-slate-900">Pusat Bantuan</h1>
			<p class="mt-1 text-sm text-slate-500">
				Temukan jawaban dan informasi untuk menggunakan SIAKAD Madrasah
			</p>
		</div>

		<!-- Top Cards — Bento Grid -->
		<div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
			<!-- Documentation -->
			<a
				href="/Documentations"
				class="group flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/50"
			>
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-800 group-hover:text-blue-700">Dokumentasi</p>
					<p class="mt-0.5 text-xs text-slate-400">Panduan lengkap penggunaan sistem dan API</p>
				</div>
			</a>

			<!-- Version Info -->
			<div class="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-5">
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-800">Versi Sistem</p>
					<p class="mt-0.5 text-xs text-slate-400">SIAKAD Madrasah v1.0</p>
					<p
						class="mt-1 inline-block rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600"
					>
						Stable
					</p>
				</div>
			</div>

			<!-- Tech Stack -->
			<div
				class="flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 sm:col-span-2 lg:col-span-1"
			>
				<div
					class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
						/>
					</svg>
				</div>
				<div>
					<p class="text-sm font-medium text-slate-800">Tech Stack</p>
					<div class="mt-1.5 flex flex-wrap gap-1.5">
						{#each techStack as tech}
							<span
								class="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-500"
								>{tech}</span
							>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Main content — 2 col bento -->
		<div class="grid gap-4 lg:grid-cols-3">
			<!-- FAQ — takes 2 cols -->
			<div class="rounded-lg border border-slate-200 bg-white lg:col-span-2">
				<div class="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
					<svg class="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
					<h2 class="text-sm font-semibold text-slate-900">Pertanyaan Umum</h2>
				</div>

				<div class="divide-y divide-slate-100">
					{#each faqs as faq, i}
						<div>
							<button
								on:click={() => toggleFaq(i)}
								class="flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-slate-50"
							>
								<span class="pr-4 text-sm font-medium text-slate-700">{faq.q}</span>
								<svg
									class="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 {openFaq ===
									i
										? 'rotate-180'
										: ''}"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							{#if openFaq === i}
								<div transition:slide={{ duration: 200, easing: quintOut }}>
									<p class="px-5 py-5 text-sm leading-relaxed text-slate-500 bg-slate-200">{faq.a}</p>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<!-- Right column -->
			<div class="space-y-4">
				<!-- Keyboard Shortcuts -->
				<div class="rounded-lg border border-slate-200 bg-white">
					<div class="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
						<svg
							class="h-4 w-4 text-slate-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
							/>
						</svg>
						<h2 class="text-sm font-semibold text-slate-900">Keyboard Shortcuts</h2>
					</div>
					<div class="divide-y divide-slate-100">
						{#each shortcuts as shortcut}
							<div class="flex items-center justify-between px-5 py-2.5">
								<span class="text-sm text-slate-500">{shortcut.desc}</span>
								<div class="flex gap-1">
									{#each shortcut.keys as key}
										<kbd
											class="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500"
											>{key}</kbd
										>
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Contact / Feedback -->
				<div class="rounded-lg border border-slate-200 bg-white">
					<div class="flex items-center gap-2 border-b border-slate-200 px-5 py-3">
						<svg
							class="h-4 w-4 text-slate-400"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
						<h2 class="text-sm font-semibold text-slate-900">Kontak & Feedback</h2>
					</div>
					<div class="space-y-3 p-5">
						<p class="text-sm text-slate-500">Punya pertanyaan atau saran? Hubungi developer.</p>
						<div class="space-y-2">
							<div class="flex items-center gap-2.5 text-sm text-slate-600">
								<svg
									class="h-4 w-4 shrink-0 text-slate-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
									/>
								</svg>
								<span class="truncate">support@siakad-madrasah.local</span>
							</div>
							<div class="flex items-center gap-2.5 text-sm text-slate-600">
								<svg
									class="h-4 w-4 shrink-0 text-slate-400"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
								<span class="truncate">GitHub Repository</span>
							</div>
						</div>
					</div>
				</div>

				<!-- About -->
				<div
					class="group relative overflow-hidden rounded-lg border border-slate-700 bg-gradient-to-br from-slate-800 to-blue-900 p-5 transition-all duration-75 hover:border-blue-500"
				>
					<div
						class="pointer-events-none absolute inset-0 bg-blue-500/0 transition-all duration-500 group-hover:bg-blue-500/20"
					></div>
					<div
						class="pointer-events-none absolute -right-12 -bottom-12 h-32 w-32 rounded-full bg-blue-500/0 blur-2xl transition-all duration-500 group-hover:bg-blue-500/40"
					></div>
					<div class="relative">
						<p class="text-sm font-medium text-white">SIAKAD Madrasah</p>
						<p
							class="mt-1 text-xs leading-relaxed text-slate-400 transition-colors duration-300 group-hover:text-slate-300"
						>
							Sistem Informasi Akademik untuk membantu pengelolaan data sekolah secara efisien.
							Dibangun dengan semangat open-source.
						</p>
						<div class="mt-3 flex items-center gap-1.5">
							<span class="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
							<span class="text-[10px] text-slate-400">Sistem berjalan normal</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

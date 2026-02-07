<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import { fade, scale } from 'svelte/transition';

	export let show = false;

	const dispatch = createEventDispatcher();

	function handleClose() {
		dispatch('close');
	}

	function navigateTo(href: string) {
		goto(href);
		handleClose();
	}

	// Navigation categories with items
	const navigationCategoriesFastNav = [
		{
			name: 'Utama',
			color: 'blue',
			items: [
				{
					name: 'Dashboard',
					href: '/dashboard',
					description: 'Ringkasan data sekolah',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 -960 960 960" fill="currentColor"><path d="M520-640v-160q0-17 11.5-28.5T560-840h240q17 0 28.5 11.5T840-800v160q0 17-11.5 28.5T800-600H560q-17 0-28.5-11.5T520-640ZM120-480v-320q0-17 11.5-28.5T160-840h240q17 0 28.5 11.5T440-800v320q0 17-11.5 28.5T400-440H160q-17 0-28.5-11.5T120-480Zm400 320v-320q0-17 11.5-28.5T560-520h240q17 0 28.5 11.5T840-480v320q0 17-11.5 28.5T800-120H560q-17 0-28.5-11.5T520-160Zm-400 0v-160q0-17 11.5-28.5T160-360h240q17 0 28.5 11.5T440-320v160q0 17-11.5 28.5T400-120H160q-17 0-28.5-11.5T120-160Z"/></svg>`
				}
			]
		},
		{
			name: 'Data Siswa',
			color: 'green',
			items: [
				{
					name: 'Daftar Siswa',
					href: '/siswa',
					description: 'Kelola data semua siswa',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M5 13.18v2.81c0 .73.4 1.41 1.04 1.76l5 2.73c.6.33 1.32.33 1.92 0l5-2.73c.64-.35 1.04-1.03 1.04-1.76v-2.81l-6.04 3.3c-.6.33-1.32.33-1.92 0L5 13.18zm6.04-9.66-8.43 4.6c-.69.38-.69 1.38 0 1.76l8.43 4.6c.6.33 1.32.33 1.92 0L21 10.09V16c0 .55.45 1 1 1s1-.45 1-1V9.59c0-.37-.2-.7-.52-.88l-9.52-5.19c-.6-.32-1.32-.32-1.92 0z"/></svg>`
				},
				{
					name: 'Kelulusan Massal',
					href: '/siswa/graduate-bulk',
					description: 'Luluskan siswa secara massal',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
				},
				{
					name: 'Alumni',
					href: '/siswa/alumni',
					description: 'Data siswa yang telah lulus',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`
				},
				{
					name: 'Mutasi',
					href: '/siswa/mutasi',
					description: 'Data siswa yang mutasi/pindah',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"/></svg>`
				},
				{
					name: 'Manajemen Kelas',
					href: '/siswa/Kelas',
					description: 'Kelola tingkat kelas',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>`
				}
			]
		},
		{
			name: 'Rombongan Belajar',
			color: 'purple',
			items: [
				{
					name: 'Daftar Rombel',
					href: '/rombel',
					description: 'Kelola rombongan belajar',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h440q19 0 36 8.5t28 23.5l180 240q16 21 16 48t-16 48L664-192q-11 15-28 23.5t-36 8.5H160Z"/></svg>`
				}
			]
		},
		{
			name: 'Penilaian',
			color: 'orange',
			items: [
				{
					name: 'Input Nilai',
					href: '/score',
					description: 'Input dan kelola nilai siswa',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240Z"/></svg>`
				},
				{
					name: 'Kenaikan Kelas',
					href: '/score/upgrade',
					description: 'Promosi siswa ke kelas berikutnya',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`
				},
				{
					name: 'Mata Pelajaran',
					href: '/score/subject',
					description: 'Kelola mata pelajaran',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
				},
				{
					name: 'Ujian',
					href: '/score/exam',
					description: 'Kelola data ujian',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
				}
			]
		},
		{
			name: 'Guru & Tendik',
			color: 'teal',
			items: [
				{
					name: 'Daftar GTK',
					href: '/gurutendik/daftar-gtk',
					description: 'Data guru dan tenaga kependidikan',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
				},
				{
					name: 'Akun GTK',
					href: '/gurutendik/akun',
					description: 'Kelola akun guru',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
				}
			]
		},
		{
			name: 'Sarana Prasarana',
			color: 'indigo',
			items: [
				{
					name: 'Aset Tetap',
					href: '/sarpras/assettetap',
					description: 'Kelola aset tetap sekolah',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 -960 960 960" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-400q0-33 23.5-56.5T200-680h80v-80q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760v240h80q33 0 56.5 23.5T840-440v240q0 33-23.5 56.5T760-120H520v-160h-80v160H200Z"/></svg>`
				},
				{
					name: 'Perpustakaan',
					href: '/sarpras/perpustakaan',
					description: 'Kelola data perpustakaan',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`
				}
			]
		},
		{
			name: 'Administrasi',
			color: 'red',
			items: [
				{
					name: 'Konfirmasi Siswa',
					href: '/confirm/studentdata',
					description: 'Konfirmasi data siswa',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
				},
				{
					name: 'Audit Logs',
					href: '/admin/audit_logs',
					description: 'Riwayat aktivitas sistem',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 7.77L18.39 18H5.61L12 7.77m-.85-2.41l-8.2 13.11c-.41.67.07 1.53.85 1.53h16.4c.79 0 1.26-.86.85-1.53l-8.2-13.11c-.39-.63-1.31-.63-1.7 0z"/></svg>`
				}
			]
		}
	];

	// Color mapping — icon accent + hover tint only
	const colorClasses: Record<string, { icon: string; dot: string; hover: string }> = {
		blue: { icon: 'text-blue-600', dot: 'bg-blue-500', hover: 'hover:bg-blue-50' },
		green: { icon: 'text-green-600', dot: 'bg-green-500', hover: 'hover:bg-green-50' },
		purple: { icon: 'text-purple-600', dot: 'bg-purple-500', hover: 'hover:bg-purple-50' },
		orange: { icon: 'text-orange-600', dot: 'bg-orange-500', hover: 'hover:bg-orange-50' },
		teal: { icon: 'text-teal-600', dot: 'bg-teal-500', hover: 'hover:bg-teal-50' },
		indigo: { icon: 'text-indigo-600', dot: 'bg-indigo-500', hover: 'hover:bg-indigo-50' },
		red: { icon: 'text-red-600', dot: 'bg-red-500', hover: 'hover:bg-red-50' }
	};
</script>

{#if show}
	<!-- Backdrop -->
	<div
		class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 backdrop-blur-sm md:items-center md:p-8"
		transition:fade={{ duration: 150 }}
		on:click={handleClose}
		on:keydown={(e) => e.key === 'Escape' && handleClose()}
		tabindex="-1"
		role="presentation"
	>
		<!-- Modal -->
		<div
			class="w-full max-w-5xl rounded-lg border border-slate-200 bg-white shadow-lg"
			transition:scale={{ duration: 200, start: 0.95 }}
			on:click|stopPropagation
			on:keydown|stopPropagation
			role="dialog"
			tabindex="-1"
			aria-modal="true"
			aria-labelledby="nav-title"
		>
			<!-- Header -->
			<div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
				<div>
					<h2 id="nav-title" class="text-lg font-bold text-slate-900">Navigasi Cepat</h2>
					<p class="text-sm text-slate-500">Akses semua fitur dalam satu layar</p>
				</div>
				<button
					on:click={handleClose}
					class="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
					aria-label="Tutup"
				>
					<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>

			<!-- Content -->
			<div class="max-h-[70vh] overflow-y-auto p-6">
				<div class="space-y-6">
					{#each navigationCategoriesFastNav as category}
						{@const colors = colorClasses[category.color] || colorClasses.blue}
						<div>
							<!-- Category Header -->
							<div class="mb-3 flex items-center gap-2">
								<span class="h-2 w-2 rounded-full {colors.dot}"></span>
								<h3 class="text-xs font-semibold tracking-wider text-slate-500 uppercase">
									{category.name}
								</h3>
							</div>

							<!-- Items Grid -->
							<div class="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
								{#each category.items as item}
									<button
										on:click={() => navigateTo(item.href)}
										class="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3.5 text-left transition-colors {colors.hover}"
									>
										<div class="{colors.icon} shrink-0">
											{@html item.icon}
										</div>
										<div class="min-w-0 flex-1">
											<p class="text-sm font-medium text-slate-800">{item.name}</p>
											<p class="text-xs text-slate-400">{item.description}</p>
										</div>
									</button>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>

			<!-- Footer -->
			<div class="border-t border-slate-200 px-6 py-3">
				<p class="text-center text-xs text-slate-400">
					Tekan <kbd class="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">Esc</kbd> atau klik
					di luar untuk menutup
				</p>
			</div>
		</div>
	</div>
{/if}

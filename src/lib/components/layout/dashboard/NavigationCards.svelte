<script lang="ts">
	import { goto } from '$app/navigation';

	function navigateTo(href: string) {
		goto(href);
	}

	// Navigation categories with items
	const navigationCategories = [
		{
			name: 'Data Siswa',
			color: 'green',
			items: [
				{
					name: 'Daftar Siswa',
					href: '/siswa',
					description: 'Kelola data semua siswa',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 -960 960 960" fill="currentColor"><path d="M242-249q-20-11-31-29.5T200-320v-192l-96-53q-11-6-16-15t-5-20q0-11 5-20t16-15l338-184q9-5 18.5-7.5T480-829q10 0 19.5 2.5T518-819l381 208q10 5 15.5 14.5T920-576v256q0 17-11.5 28.5T880-280q-17 0-28.5-11.5T840-320v-236l-80 44v192q0 23-11 41.5T718-249L518-141q-9 5-18.5 7.5T480-131q-10 0-19.5-2.5T442-141L242-249Z"/></svg>`
				},
				{
					name: 'Kelulusan',
					href: '/siswa/graduate-bulk',
					description: 'Luluskan siswa',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`
				},
				{
					name: 'Alumni',
					href: '/siswa/alumni',
					description: 'Data siswa lulus',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>`
				},
				{
					name: 'Mutasi',
					href: '/siswa/mutasi',
					description: 'Siswa pindah',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1"/></svg>`
				}
			]
		},
		{
			name: 'Akademik',
			color: 'purple',
			items: [
				{
					name: 'Rombel',
					href: '/rombel',
					description: 'Rombongan belajar',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h440q19 0 36 8.5t28 23.5l180 240q16 21 16 48t-16 48L664-192q-11 15-28 23.5t-36 8.5H160Z"/></svg>`
				},
				{
					name: 'Input Nilai',
					href: '/score',
					description: 'Kelola nilai siswa',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 -960 960 960" fill="currentColor"><path d="M160-200h160v-320H160v320Zm240 0h160v-560H400v560Zm240 0h160v-240H640v240Z"/></svg>`
				},
				{
					name: 'Kenaikan Kelas',
					href: '/score/upgrade',
					description: 'Promosi siswa',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`
				},
				{
					name: 'Mata Pelajaran',
					href: '/score/subject',
					description: 'Kelola mapel',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>`
				}
			]
		},
		{
			name: 'Lainnya',
			color: 'blue',
			items: [
				{
					name: 'Guru & Tendik',
					href: '/gurutendik/daftar-gtk',
					description: 'Data GTK',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`
				},
				{
					name: 'Sarana Prasarana',
					href: '/sarpras/assettetap',
					description: 'Aset sekolah',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 -960 960 960" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-400q0-33 23.5-56.5T200-680h80v-80q0-33 23.5-56.5T360-840h240q33 0 56.5 23.5T680-760v240h80q33 0 56.5 23.5T840-440v240q0 33-23.5 56.5T760-120H520v-160h-80v160H200Z"/></svg>`
				},
				{
					name: 'Audit Log',
					href: '/admin/audit_logs',
					description: 'Riwayat sistem',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 -960 960 960" fill="currentColor"><path d="m520-496 120 120q11 11 11 28t-11 28q-11 11-28 11t-28-11L452-452q-6-6-9-13.5t-3-15.5v-159q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640v144Z"/></svg>`
				},
				{
					name: 'Konfirmasi',
					href: '/confirm/studentdata',
					description: 'Konfirmasi data',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
				}
			]
		}
	];

	// Color mapping
	const colorClasses: Record<string, { bg: string; border: string; text: string; hover: string; iconBg: string }> = {
		green: {
			bg: 'bg-green-50',
			border: 'border-green-200',
			text: 'text-green-700',
			hover: 'hover:bg-green-100 hover:border-green-400 hover:shadow-md',
			iconBg: 'bg-green-100'
		},
		purple: {
			bg: 'bg-purple-50',
			border: 'border-purple-200',
			text: 'text-purple-700',
			hover: 'hover:bg-purple-100 hover:border-purple-400 hover:shadow-md',
			iconBg: 'bg-purple-100'
		},
		blue: {
			bg: 'bg-blue-50',
			border: 'border-blue-200',
			text: 'text-blue-700',
			hover: 'hover:bg-blue-100 hover:border-blue-400 hover:shadow-md',
			iconBg: 'bg-blue-100'
		}
	};
</script>

<div class="space-y-6">
	<div class="flex items-center justify-between">
		<h2 class="text-lg font-bold text-slate-800">Akses Cepat</h2>
	</div>

	{#each navigationCategories as category}
		{@const colors = colorClasses[category.color] || colorClasses.blue}
		<div>
			<!-- Category Label -->
			<p class="mb-3 text-xs font-semibold uppercase tracking-wider {colors.text}">
				{category.name}
			</p>

			<!-- Cards Grid -->
			<div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{#each category.items as item}
					<button
						on:click={() => navigateTo(item.href)}
						class="group flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-center transition-all duration-200 {colors.bg} {colors.border} {colors.hover}"
					>
						<!-- Icon -->
						<div class="rounded-xl p-3 {colors.iconBg} {colors.text} transition-transform group-hover:scale-110">
							{@html item.icon}
						</div>

						<!-- Text -->
						<div>
							<p class="text-sm font-semibold text-slate-800">{item.name}</p>
							<p class="mt-0.5 text-xs text-slate-500">{item.description}</p>
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>

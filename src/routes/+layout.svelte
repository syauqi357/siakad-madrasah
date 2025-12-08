<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/layout/Navbar.svelte';
	import Sidebar from '$lib/components/layout/Sidebar.svelte';
	

	

	let sidebarOpen = false;
	let openDropdowns: Record<string, boolean> = {};

	const navItems = [
		{
			name: 'Dashboard',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16" id="Google-Home-Logo--Streamline-Logos" height="16" width="16">  <path fill="#000000" fill-rule="evenodd" d="M8.942666666666666 1.3906666666666665a1.3333333333333333 1.3333333333333333 0 0 0 -1.885333333333333 0l-5.666666666666666 5.666666666666666A1.3333333333333333 1.3333333333333333 0 0 0 1 8v3.2133333333333334L9.882666666666665 2.3306666666666667l-0.94 -0.94Zm1.6473333333333333 1.6466666666666667 -1.885333333333333 1.8860000000000001 3.6286666666666663 3.6286666666666663V12.666666666666666l0 2.6666666666666665h1.3333333333333333a1.3333333333333333 1.3333333333333333 0 0 0 1.3333333333333333 -1.3333333333333333v-6a1.3333333333333333 1.3333333333333333 0 0 0 -0.3906666666666666 -0.9426666666666665l-4.019333333333333 -4.02ZM11.333333333333332 15.333333333333332v-2.6666666666666665H4.666666666666666v2.6666666666666665h6.666666666666666ZM3.6666666666666665 15.333333333333332v-3l0 -2.3726666666666665 -2.6666666666666665 2.6666666666666665V14a1.3333333333333333 1.3333333333333333 0 0 0 1.3333333333333333 1.3333333333333333h1.3333333333333333Z" clip-rule="evenodd" stroke-width="0.6667"></path></svg>',
			href: '/'
		},

		{
			name: 'sarana prasarana',
			href: '/sarpras',
			hasDropdown: true,
			children: [
				{
					name: 'aset tetap',
					icon: '',
					href: '/sarpras/assettetap'
				},
				{
					name: 'aset lancar',
					icon: '',
					href: '/sarpras/asetlancar'
				},
				{
					name: 'perpustakaan',
					icon: '',
					href: '/sarpras/perpustakaan'
				}
			]
		},

		{
			name: 'Student',
			href: '/siswa',
			hasDropdown: true,
			children: [
				{
					name: 'Student List',
					icon: '',
					href: '/siswa'
				},
				{ name: 'Alumni', href: '/siswa/alumni' },
				{ name: 'Mutasi Out', href: '/siswa/mutasi-keluar' },
				{ name: 'Mutasi In', href: '/siswa/mutasi-masuk' },
				{ name: 'Kenaikan Kelas', href: '/siswa/kenaikan-kelas' },
				{ name: 'Siswa Ganda', href: '/siswa/siswa-ganda' },
				{ name: 'PIP/KIP-K/Beasiswa', href: '/siswa/beasiswa' }
			]
		},

		{
			name: 'Rombel',
			href: '/rombel'
		},

		{
			name: 'guru & tendik',
			href: '/gurutendik',
			hasDropdown: true,
			children: [
				{
					name: 'daftar GTK',
					href: '/gurutendik/daftar-gtk'
				},
				{
					name: 'pengajuan GTK',
					href: '/gurutendik/ajuan-gtk'
				},
				{
					name: 'mutasi',
					href: '/gurutendik/mutasi'
				},
				{
					name: 'akun',
					href: '/gurutendik/akun'
				}
			]
		},

		{
			name: 'nilai siswa',
			href: '/score',
			hasDropdown: true,
			children: [
				{
					name: 'ujian',
					href: '/score/exam'
				},
				{
					name: 'tugas',
					href: '/score/task'
				},
				{
					name: 'mata pelajaran',
					href: '/score/subject'
				},
				{
					name: 'kenaikan kelas',
					href: '/score/upgrade'
				}
			]
		},

		{
			name: 'konfirmasi',
			href: '/confirm',
			hasDropdown: true,
			children: [
				{
					name: 'kelembagaan',
					href: '/confirm/lembaga'
				},
				{
					name: 'sarana prasarana',
					href: '/confirm/sarpras'
				},
				{
					name: 'siswa',
					href: '/confirm/studentdata'
				},
				{
					name: 'guru tendik',
					href: '/confirm/teacher'
				}
			]
		},

		{
			name: 'info lainnya',
			href: '/info',
			hasDropdown: true,
			children: [
				{
					name: 'daftar kurikulum',
					href: '/info/cirriculum'
				},
				{
					name: 'hari sekolah',
					href: '/info/daysch'
				}
			]
		},

		{
			name: 'Audit Logs',
			href: '/admin/audit_logs'
		}
	];

	function toggleDropdown(itemName: string) {
		openDropdowns[itemName] = !openDropdowns[itemName];
	}
</script>

<svelte:head>
	<title>sistem Akademik </title>
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Navbar -->
	<!-- component navbar
 
Layout Component Structure Explanation
Looking at your +layout.svelte file, here's how the navbar integrates and relates to your project structure:

How the Navbar Works
The navbar is a reusable component that:

Receives state: bind:sidebarOpen creates a two-way binding, so the navbar can toggle the sidebar state
Controls UI: When users interact with the navbar (e.g., click a menu button), it updates sidebarOpen in the parent layout
Triggers sidebar: The sidebar listens to the same sidebarOpen variable and shows/hides accordingly
Component Relationships Across Folders
Your typical SvelteKit project structure likely looks like this:

Key relationships:

+layout.svelte = Root layout wrapping all pages with persistent navbar/sidebar
Navbar.svelte = Imported component that manages top navigation UI
Sidebar.svelte = Imported component that displays navigation items
<slot /> = Placeholder where page-specific content renders from +page.svelte files in nested routes
 
 -->
	<Navbar bind:sidebarOpen />
	<!-- Sidebar -->

	<!-- 
	
		The Sidebar component is included here in the layout.
		It also uses the sidebarOpen variable to determine visibility.
		It receives navItems as props to render navigation links.

		documentation : 
		https://svelte.dev/tutorial/component-props

		generate in claudeAi 

	-->
	<Sidebar bind:sidebarOpen {navItems} />

	<div class="ml-0 flex items-center justify-center p-3 md:ml-64">
		<div class="mt-21 flex w-full flex-col items-center p-4 sm:w-5xl md:w-3xl xl:w-5xl">
			<!-- position of pages -->
			<slot />
		</div>
	</div>
</div>

{#if sidebarOpen}
	<!-- fix some issues : nambah div close tag -->
<!-- add blur backdrop small with bg black opacity	-->
	<div
		class="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm sm:hidden transition-all ease-in-out"
		on:click={() => (sidebarOpen = false)}
		on:keydown={(e) => e.key === 'Escape' && (sidebarOpen = false)}
		role="button"
		tabindex="-1"
	></div>
{/if}

<style>
	:global(body) {
		margin: 0;
		background-color: #0a0a0a;
	}
</style>

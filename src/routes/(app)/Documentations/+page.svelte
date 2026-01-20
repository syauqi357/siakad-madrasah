<script lang="ts">
	import { slide } from 'svelte/transition';
	export let data;

	let selectedDoc = data.docs[0] || null;
	let isMobileMenuOpen = false;

	function selectDoc(doc: any) {
		selectedDoc = doc;
		isMobileMenuOpen = false; // Close mobile menu on selection
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<div class="flex min-h-screen bg-white">
	<!-- Desktop Sidebar -->
	<aside class="hidden w-72 flex-none flex-col border-r border-slate-200 bg-slate-50/50 md:flex">
		<div class="sticky top-0 h-screen overflow-y-auto p-6">
			<div class="mb-8 flex items-center gap-3 px-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				</div>
				<h2 class="text-lg font-bold tracking-tight text-slate-800">Documentation</h2>
			</div>

			<nav class="space-y-1">
				{#each data.docs as doc}
					<button
						on:click={() => selectDoc(doc)}
						class="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 outline-none
                        {selectedDoc?.filename === doc.filename
							? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200'
							: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
					>
						<svg
							class="h-4 w-4 shrink-0 transition-colors {selectedDoc?.filename === doc.filename
								? 'text-blue-500'
								: 'text-slate-400 group-hover:text-slate-500'}"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
							/>
						</svg>
						<span class="truncate">{doc.title}</span>
					</button>
				{/each}
			</nav>

			<!-- Metadata / Footer in Sidebar -->
			<div class="mt-auto pt-8">
				<div class="rounded-lg bg-blue-50 p-4">
					<p class="text-xs font-medium text-blue-800">Need help?</p>
					<p class="mt-1 text-xs text-blue-600">Check the source code or ask the admin.</p>
				</div>
			</div>
		</div>
	</aside>

	<!-- Mobile Header & Menu -->
	<div class="sticky top-0 z-30 flex flex-col bg-white shadow-sm md:hidden">
		<div class="flex items-center justify-between border-b border-slate-100 p-4">
			<div class="flex items-center gap-2">
				<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				</div>
				<span class="font-bold text-slate-800">Docs</span>
			</div>
			<button
				on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="rounded-md p-2 text-slate-500 hover:bg-slate-100 focus:outline-none"
			>
				{#if isMobileMenuOpen}
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				{:else}
					<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M4 6h16M4 12h16M4 18h16"
						/>
					</svg>
				{/if}
			</button>
		</div>

		{#if isMobileMenuOpen}
			<nav
				transition:slide={{ duration: 200 }}
				class="max-h-[60vh] overflow-y-auto border-b border-slate-100 bg-slate-50 p-4 shadow-lg"
			>
				<p class="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
					Available Documents
				</p>
				<div class="space-y-1">
					{#each data.docs as doc}
						<button
							on:click={() => selectDoc(doc)}
							class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium
                            {selectedDoc?.filename === doc.filename
								? 'bg-white text-blue-700 shadow-sm ring-1 ring-blue-200'
								: 'text-slate-600 hover:bg-white hover:text-slate-900'}"
						>
							{doc.title}
						</button>
					{/each}
				</div>
			</nav>
		{/if}
	</div>

	<!-- Main Content -->
	<main class="w-full min-w-0 flex-1 bg-white pt-0 md:pt-0">
		{#if selectedDoc}
			<div class="mx-auto max-w-3xl px-4 py-8 md:px-8 md:py-12">
				<!-- Breadcrumb / Meta -->
				<div class="mb-6 flex items-center gap-2 text-sm text-slate-400">
					<span>Docs</span>
					<svg class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 5l7 7-7 7"
						/></svg
					>
					<span class="font-medium text-slate-600">{selectedDoc.filename}</span>
				</div>

				<!-- Title -->
				<div class="mb-8 border-b border-slate-100 pb-8">
					<h1 class="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
						{selectedDoc.title}
					</h1>
				</div>

				<!-- Content -->
				<article
					class="prose prose-lg max-w-none prose-slate
                    prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-slate-800
                    prose-a:font-medium prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-500
                    prose-code:rounded-md prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-code:text-slate-800 prose-code:before:content-none prose-code:after:content-none
                    prose-pre:rounded-xl prose-pre:bg-slate-900 prose-pre:shadow-lg
                    prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm
                    "
				>
					{@html selectedDoc.content}
				</article>
			</div>
		{:else}
			<div class="flex h-full flex-col items-center justify-center p-8 text-center text-slate-400">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-50"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-slate-300"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
				</div>
				<h3 class="text-lg font-medium text-slate-900">No document selected</h3>
				<p class="mt-1">Select a document from the menu to start reading.</p>
			</div>
		{/if}
	</main>
</div>

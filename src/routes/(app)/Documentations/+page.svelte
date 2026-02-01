<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	export let data;

	let selectedDoc = data.docs[0] || null;
	let isMobileMenuOpen = false;
	let tableOfContents: { id: string; text: string; level: number }[] = [];
	let activeHeading = '';

	function selectDoc(doc: any) {
		selectedDoc = doc;
		isMobileMenuOpen = false;
		extractTOC();
		setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
	}

	// Extract table of contents from HTML content
	function extractTOC() {
		if (!selectedDoc?.content) {
			tableOfContents = [];
			return;
		}

		const parser = new DOMParser();
		const doc = parser.parseFromString(selectedDoc.content, 'text/html');
		const headings = doc.querySelectorAll('h1, h2, h3');

		tableOfContents = Array.from(headings).map((h, i) => {
			const id = `heading-${i}`;
			const level = parseInt(h.tagName[1]);
			return {
				id,
				text: h.textContent || '',
				level
			};
		});
	}

	// Add IDs to headings in rendered content
	function processContent(html: string): string {
		const parser = new DOMParser();
		const doc = parser.parseFromString(html, 'text/html');
		const headings = doc.querySelectorAll('h1, h2, h3');

		headings.forEach((h, i) => {
			h.id = `heading-${i}`;
		});

		return doc.body.innerHTML;
	}

	function scrollToHeading(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			activeHeading = id;
		}
	}

	onMount(() => {
		extractTOC();
	});

	$: processedContent = selectedDoc ? processContent(selectedDoc.content) : '';
</script>

<div class="min-h-screen bg-slate-50">
	<!-- Top Bar -->
	<div class="sticky top-20 z-40 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
			<div class="flex items-center gap-3">
				<div
					class="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-blue-500 to-blue-600 text-white shadow-sm"
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
					<h1 class="text-lg font-bold text-slate-800">Dokumentasi</h1>
					<p class="text-xs text-slate-500">SIAKAD Madrasah</p>
				</div>
			</div>

			<!-- Mobile Menu Toggle -->
			<button
				on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition-all hover:bg-slate-50 md:hidden"
			>
				<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h7"
					/>
				</svg>
				Menu
			</button>

			<!-- Doc count badge -->
			<div class="hidden items-center gap-2 md:flex">
				<span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
					{data.docs.length} Dokumen
				</span>
			</div>
		</div>
	</div>

	<!-- Mobile Menu Dropdown -->
	{#if isMobileMenuOpen}
		<div
			class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
			transition:fade={{ duration: 150 }}
			on:click={() => (isMobileMenuOpen = false)}
			on:keydown={(e) => e.key === 'Escape' && (isMobileMenuOpen = false)}
			role="button"
			tabindex="-1"
		>
			<div
				class="absolute top-24 right-4 left-4 max-h-[70vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 shadow-2xl"
				transition:slide={{ duration: 200 }}
				on:click|stopPropagation
				on:keydown|stopPropagation
				role="dialog"
				tabindex="-1"
			>
				<div class="mb-3 flex items-center justify-between">
					<p class="text-sm font-semibold text-slate-800">Pilih Dokumen</p>
					<button
						aria-label="dropdown"
						on:click={() => (isMobileMenuOpen = false)}
						class="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
				<div class="space-y-1">
					{#each data.docs as doc}
						<button
							on:click={() => selectDoc(doc)}
							class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all
							{selectedDoc?.filename === doc.filename
								? 'bg-blue-50 text-blue-700'
								: 'text-slate-600 hover:bg-slate-50'}"
						>
							<svg
								class="h-4 w-4 shrink-0 {selectedDoc?.filename === doc.filename
									? 'text-blue-500'
									: 'text-slate-400'}"
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
							<span class="text-sm font-medium">{doc.title}</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}

	<!-- Main Layout -->
	<div class="mx-auto max-w-7xl px-4 py-6">
		<div class="flex gap-8">
			<!-- Sidebar - Desktop -->
			<aside class="hidden w-64 shrink-0 md:block">
				<div class="sticky top-36">
					<!-- Document List -->
					<div class="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
						<p class="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
							Dokumen
						</p>
						<nav class="space-y-1">
							{#each data.docs as doc}
								<button
									on:click={() => selectDoc(doc)}
									class="group flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-all
									{selectedDoc?.filename === doc.filename
										? 'bg-blue-500 text-white shadow-sm'
										: 'text-slate-600 hover:bg-slate-100'}"
								>
									<svg
										class="h-4 w-4 shrink-0 {selectedDoc?.filename === doc.filename
											? 'text-blue-200'
											: 'text-slate-400'}"
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
									<span class="truncate font-medium">{doc.title}</span>
								</button>
							{/each}
						</nav>
					</div>

					<!-- Table of Contents -->
					{#if tableOfContents.length > 0}
						<div class="mt-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
							<p class="mb-3 text-xs font-semibold tracking-wider text-slate-400 uppercase">
								Daftar Isi
							</p>
							<nav class="space-y-1">
								{#each tableOfContents as item}
									<button
										on:click={() => scrollToHeading(item.id)}
										class="block w-full truncate rounded px-2 py-1 text-left text-sm transition-all hover:bg-slate-100
										{item.level === 1 ? 'font-medium text-slate-700' : ''}
										{item.level === 2 ? 'pl-4 text-slate-600' : ''}
										{item.level === 3 ? 'pl-6 text-xs text-slate-500' : ''}
										{activeHeading === item.id ? 'bg-blue-50 text-blue-600' : ''}"
									>
										{item.text}
									</button>
								{/each}
							</nav>
						</div>
					{/if}
				</div>
			</aside>

			<!-- Main Content -->
			<main class="min-w-0 flex-1">
				{#if selectedDoc}
					<article class="rounded-xl border border-slate-200 bg-white shadow-sm">
						<!-- Document Header -->
						<div class="border-b border-slate-100 px-6 py-5 md:px-8">
							<div class="flex items-center gap-2 text-sm text-slate-400">
								<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
									/>
								</svg>
								<span>{selectedDoc.filename}</span>
							</div>
							<h1 class="mt-2 text-2xl font-bold text-slate-800 md:text-3xl">
								{selectedDoc.title}
							</h1>
						</div>

						<!-- Document Content -->
						<div class="px-6 py-6 md:px-8 md:py-8">
							<div
								class="prose max-w-none prose-slate
								prose-headings:scroll-mt-24
								prose-headings:font-bold
								prose-headings:text-slate-800
								prose-h1:mb-4
								prose-h1:border-b
								prose-h1:border-slate-200
								prose-h1:pb-3
								prose-h1:text-2xl
								prose-h2:mt-8
								prose-h2:mb-4
								prose-h2:text-xl
								prose-h3:mt-6
								prose-h3:text-lg
								prose-p:leading-relaxed
								prose-p:text-slate-600
								prose-a:font-medium
								prose-a:text-blue-600
								prose-a:no-underline
								hover:prose-a:underline
								prose-blockquote:rounded-r-lg
								prose-blockquote:border-l-blue-500

								prose-blockquote:py-1
								prose-blockquote:text-slate-600
								prose-strong:text-slate-700
								prose-code:rounded

								prose-code:px-1.5
								prose-code:py-0.5
								prose-code:text-sm
								prose-code:font-medium
								prose-code:text-slate-900
								prose-code:before:content-none
								prose-code:after:content-none
								prose-pre:rounded-xl
								prose-pre:border
								prose-pre:border-slate-700
								prose-pre:bg-slate-100
								prose-pre:shadow-lg
								prose-ol:text-slate-600
								prose-ul:text-slate-600
								prose-li:marker:text-slate-400
								prose-table:overflow-hidden
								prose-table:rounded-lg
								prose-table:border
								prose-table:border-slate-200
								prose-th:border-b
								prose-th:border-slate-200
								prose-th:bg-slate-50
								prose-th:px-4
								prose-th:py-3
								prose-th:text-left
								prose-th:font-semibold
								prose-th:text-slate-700
								prose-td:border-b
								prose-td:border-slate-100
								prose-td:px-4
								prose-td:py-3
								prose-hr:border-slate-200
							"
							>
								{@html processedContent}
							</div>
						</div>

						<!-- Document Footer -->
						<div class="border-t border-slate-100 px-6 py-4 md:px-8">
							<div class="flex items-center justify-between text-sm text-slate-400">
								<span>SIAKAD Madrasah Documentation</span>
								<button
									on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
									class="flex items-center gap-1 rounded-lg px-3 py-1 transition-all hover:bg-slate-100 hover:text-slate-600"
								>
									<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M5 10l7-7m0 0l7 7m-7-7v18"
										/>
									</svg>
									Kembali ke atas
								</button>
							</div>
						</div>
					</article>
				{:else}
					<!-- Empty State -->
					<div
						class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white py-20 text-center"
					>
						<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
							<svg
								class="h-8 w-8 text-slate-400"
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
						<h3 class="text-lg font-semibold text-slate-700">Tidak ada dokumen</h3>
						<p class="mt-1 text-sm text-slate-500">Pilih dokumen dari menu untuk mulai membaca</p>
					</div>
				{/if}
			</main>
		</div>
	</div>
</div>

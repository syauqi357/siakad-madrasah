<script lang="ts">
	import { slide, fade } from 'svelte/transition';
	import { browser } from '$app/environment';

	// Define types for better safety
	interface Doc {
		title: string;
		filename: string;
		content: string;
		[key: string]: string;
	}

	interface TOCItem {
		id: string;
		text: string;
		level: number;
	}

	export let data: { docs: Doc[] };

	let selectedDoc: Doc | null = data.docs[0] || null;
	let isMobileMenuOpen = false;
	let tableOfContents: TOCItem[] = [];
	let activeHeading = '';
	let processedContent = '';

	function selectDoc(doc: Doc) {
		selectedDoc = doc;
		isMobileMenuOpen = false;
		if (browser) {
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}

	// Unified function to process content and extract TOC in one pass
	function processDocument(content: string) {
		if (!content) return { html: '', toc: [] };

		// Guard against SSR (Server Side Rendering) where DOMParser is missing
		if (!browser) return { html: content, toc: [] };

		const parser = new DOMParser();
		const doc = parser.parseFromString(content, 'text/html');
		const headings = doc.querySelectorAll('h1, h2, h3');
		const toc: TOCItem[] = [];

		headings.forEach((h, i) => {
			const id = `heading-${i}`;
			h.id = id; // Add ID to the actual HTML element
			toc.push({
				id,
				text: h.textContent || '',
				level: parseInt(h.tagName[1])
			});
		});

		return {
			html: doc.body.innerHTML,
			toc
		};
	}

	function scrollToHeading(id: string) {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: 'smooth', block: 'start' });
			activeHeading = id;
		}
	}

	// Reactive statement handles initialization and updates automatically
	$: {
		if (selectedDoc) {
			const result = processDocument(selectedDoc.content);
			processedContent = result.html;
			tableOfContents = result.toc;
		} else {
			processedContent = '';
			tableOfContents = [];
		}
	}
</script>

<div class="min-h-screen bg-slate-50 font-inter">
	<!-- Top Bar -->
	<div class="sticky top-20 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
			<div class="flex items-center gap-3">
				<div class="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 text-white">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
						/>
					</svg>
				</div>
				<div>
					<h1 class="text-base font-semibold text-slate-900">Dokumentasi</h1>
					<p class="text-xs text-slate-500">SIAKAD Madrasah</p>
				</div>
			</div>

			<!-- Mobile Menu Toggle -->
			<button
				on:click={() => (isMobileMenuOpen = !isMobileMenuOpen)}
				class="flex items-center gap-2 rounded-md border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 md:hidden"
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
				<span class="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
					{data.docs.length} Dokumen
				</span>
			</div>
		</div>
	</div>

	<!-- Mobile Menu Dropdown -->
	{#if isMobileMenuOpen}
		<div
			class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
			transition:fade={{ duration: 150 }}
			on:click={() => (isMobileMenuOpen = false)}
			on:keydown={(e) => e.key === 'Escape' && (isMobileMenuOpen = false)}
			role="button"
			tabindex="-1"
		>
			<div
				class="absolute top-24 right-4 left-4 max-h-[70vh] overflow-y-auto rounded-lg border border-slate-200 bg-white p-4 shadow-xl"
				transition:slide={{ duration: 200 }}
				on:click|stopPropagation
				on:keydown|stopPropagation
				role="dialog"
				tabindex="-1"
			>
				<div class="mb-3 flex items-center justify-between">
					<p class="text-sm font-semibold text-slate-800">Pilih Dokumen</p>
					<button
						aria-label="Close menu"
						on:click={() => (isMobileMenuOpen = false)}
						class="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
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
				<div class="space-y-0.5">
					{#each data.docs as doc}
						<button
							on:click={() => selectDoc(doc)}
							class="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left transition-colors
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
	<div class="mx-auto max-w-7xl px-4 py-6 sm:px-6">
		<div class="flex gap-6 lg:gap-8">
			<!-- Sidebar - Desktop -->
			<aside class="hidden w-56 shrink-0 md:block lg:w-64">
				<div class="sticky top-36 space-y-6">
					<!-- Document List -->
					<div>
						<p class="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
							Dokumen
						</p>
						<nav class="space-y-0.5">
							{#each data.docs as doc}
								<button
									on:click={() => selectDoc(doc)}
									class="group flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors
									{selectedDoc?.filename === doc.filename
										? 'bg-blue-50 font-semibold text-blue-700'
										: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}"
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
									<span class="truncate">{doc.title}</span>
								</button>
							{/each}
						</nav>
					</div>

					<!-- Table of Contents -->
					{#if tableOfContents.length > 0}
						<div class="border-t border-slate-200 pt-4">
							<p class="mb-2 px-2 text-xs font-semibold tracking-wider text-slate-400 uppercase">
								Daftar Isi
							</p>
							<nav class="space-y-0.5">
								{#each tableOfContents as item}
									<button
										on:click={() => scrollToHeading(item.id)}
										class="block w-full truncate rounded-md px-2.5 py-1.5 text-left text-sm transition-colors hover:bg-slate-100
										{item.level === 1 ? 'font-medium text-slate-700' : ''}
										{item.level === 2 ? 'pl-5 text-slate-500' : ''}
										{item.level === 3 ? 'pl-8 text-xs text-slate-400' : ''}
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
					<article class="rounded-lg border border-slate-200 bg-white">
						<!-- Document Header -->
						<div class="border-b border-slate-100 px-6 py-5 sm:px-8">
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
							<h1 class="mt-2 text-xl font-bold text-slate-900 sm:text-2xl">
								{selectedDoc.title}
							</h1>
						</div>

						<!-- Document Content -->
						<div class="px-6 py-6 sm:px-8 sm:py-8">
							<div
								class="prose max-w-none prose-slate
								prose-headings:scroll-mt-24
								prose-headings:font-bold
								prose-headings:text-slate-800
								prose-h1:mb-4
								prose-h1:border-b
								prose-h1:border-slate-200
								prose-h1:pb-3
								prose-h1:text-xl
								prose-h2:mt-8
								prose-h2:mb-3
								prose-h2:text-lg
								prose-h3:mt-6
								prose-h3:text-base
								prose-p:leading-relaxed
								prose-p:text-slate-600
								prose-a:font-medium
								prose-a:text-blue-600
								prose-a:no-underline
								hover:prose-a:underline
								prose-blockquote:rounded-r-md
								prose-blockquote:border-l-blue-500
								prose-blockquote:py-1
								prose-blockquote:text-slate-600
								prose-strong:text-slate-700
								prose-code:rounded
								prose-code:px-1.5
								prose-code:py-0.5
								prose-code:text-sm
								prose-code:font-medium
								prose-code:text-slate-800
								prose-code:before:content-none
								prose-code:after:content-none
								prose-pre:rounded-lg
								prose-pre:border
								prose-pre:border-slate-200
								prose-pre:bg-slate-50
								prose-pre:shadow-none
								prose-ol:text-slate-600
								prose-ul:text-slate-600
								prose-li:marker:text-slate-400
								prose-table:overflow-hidden
								prose-table:rounded-md
								prose-table:border
								prose-table:border-slate-200
								prose-th:border-b
								prose-th:border-slate-200
								prose-th:bg-slate-50
								prose-th:px-4
								prose-th:py-2.5
								prose-th:text-left
								prose-th:text-sm
								prose-th:font-semibold
								prose-th:text-slate-700
								prose-td:border-b
								prose-td:border-slate-100
								prose-td:px-4
								prose-td:py-2.5
								prose-td:text-sm
								prose-hr:border-slate-200"
							>
								{@html processedContent}
							</div>
						</div>

						<!-- Document Footer -->
						<div class="border-t border-slate-100 px-6 py-3 sm:px-8">
							<div class="flex items-center justify-between text-sm text-slate-400">
								<span>SIAKAD Madrasah Documentation</span>
								<button
									on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
									class="flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
						class="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 py-20 text-center"
					>
						<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
							<svg
								class="h-7 w-7 text-slate-400"
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
						<h3 class="text-base font-semibold text-slate-700">Tidak ada dokumen</h3>
						<p class="mt-1 text-sm text-slate-500">Pilih dokumen dari menu untuk mulai membaca</p>
					</div>
				{/if}
			</main>
		</div>
	</div>
</div>

<script lang="ts">
	export let data;

	let selectedDoc = data.docs[0] || null;

	function selectDoc(doc: any) {
		selectedDoc = doc;
	}

	function handleMobileSelect(event: Event) {
		const filename = (event.target as HTMLSelectElement).value;
		const doc = data.docs.find((d: any) => d.filename === filename);
		if (doc) selectDoc(doc);
	}
</script>

<div class="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50 md:flex-row">
	<!-- Mobile Navigation (Dropdown) - Visible only on small screens -->
	<div class="sticky top-0 z-20 w-full border-b border-slate-200 bg-white p-4 md:hidden">
		<label for="doc-select" class="mb-2 block text-sm font-medium text-slate-700"
			>Select Documentation</label
		>
		<div class="relative">
			<select
				id="doc-select"
				on:change={handleMobileSelect}
				class="block w-full appearance-none rounded-lg border border-slate-300 bg-slate-50 py-3 pr-10 pl-4 text-slate-900 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
			>
				{#each data.docs as doc}
					<option value={doc.filename} selected={selectedDoc?.filename === doc.filename}>
						{doc.title}
					</option>
				{/each}
			</select>
			<!-- Custom Arrow Icon -->
			<div
				class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7"
					/>
				</svg>
			</div>
		</div>
	</div>

	<!-- Desktop Sidebar (List) - Hidden on mobile, visible on medium+ screens -->
	<aside
		class="fixed m-3 hidden h-fit w-72 flex-none overflow-y-auto rounded-xl border border-slate-200 bg-white md:block"
	>
		<div class="p-6">
			<h2 class="mb-6 flex items-center gap-2 px-2 text-xl font-bold text-slate-800">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 text-blue-600"
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
				Docs
			</h2>

			<nav class="space-y-1">
				{#each data.docs as doc}
					<button
						on:click={() => selectDoc(doc)}
						class="group flex w-full items-center justify-between rounded-lg px-4 py-2 text-left text-sm font-medium transition-all duration-200 outline-none
                        {selectedDoc?.filename === doc.filename
							? 'border border-blue-100 bg-blue-50 text-blue-700'
							: 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
					>
						<span>{doc.title}</span>
						{#if selectedDoc?.filename === doc.filename}
							<div class="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
						{/if}
					</button>
				{/each}
			</nav>
		</div>
	</aside>

	<!-- Main Content Area -->
	<main class="w-full min-w-0 flex-1 overflow-x-hidden p-4 md:p-10">
		{#if selectedDoc}
			<div class="mx-auto max-w-4xl overflow-hidden rounded-xl bg-white p-4 md:p-8">
				<!-- Document Title Header -->
				<div class="mb-8 border-b border-slate-100 pb-6">
					<h1
						class="text-2xl leading-tight font-bold tracking-tight wrap-break-word text-slate-900 md:text-4xl"
					>
						{selectedDoc.title}
					</h1>
					<div class="mt-3 flex items-center gap-2 text-sm text-slate-500">
						<span class="rounded bg-slate-100 px-2 py-1 font-mono text-xs break-all"
							>{selectedDoc.filename}</span
						>
					</div>
				</div>

				<!-- Markdown Content Wrapper -->
				<div class="w-full wrap-break-word">
					<article
						class="prose-sm:prose-base prose-md:prose-lg prose-lg:prose-xl prose-xl:prose-2xl prose-blockquote:0
      prose prose-sm
      max-w-none prose-slate md:prose-lg
      prose-headings:font-bold prose-headings:text-slate-800 prose-h1:text-3xl
      prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:prose-sm
      prose-blockquote:mb-4
      prose-blockquote:max-w-full
      prose-blockquote:rounded-r-lg
      prose-blockquote:border-l-2
      prose-blockquote:border-blue-500
      prose-blockquote:bg-blue-50
      prose-blockquote:px-4
      prose-blockquote:py-2
      prose-blockquote:not-italic
      prose-code:prose-sm
      prose-code:max-w-full
      prose-code:font-mono
      prose-code:text-sm
      prose-code:break-all
      prose-pre:prose-sm
      prose-pre:mb-4
      prose-pre:max-w-full
      prose-pre:rounded-xl
      prose-pre:bg-slate-900
      prose-pre:font-mono
      prose-pre:text-sm
      prose-pre:break-all
      prose-pre:whitespace-pre-wrap
      prose-pre:shadow-lg
      prose-img:prose-sm
      prose-img:max-w-full
      prose-img:rounded-xl
      prose-img:shadow-md
  "
					>
						{@html selectedDoc.content}
					</article>
				</div>
			</div>
		{:else}
			<div class="flex h-[60vh] flex-col items-center justify-center text-slate-400">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="mb-4 h-16 w-16 opacity-50"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<p class="text-lg font-medium">Select a document to view</p>
			</div>
		{/if}
	</main>
</div>

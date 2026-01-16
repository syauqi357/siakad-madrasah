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

<div class="flex flex-col md:flex-row min-h-screen bg-slate-50 relative w-full overflow-x-hidden">

    <!-- Mobile Navigation (Dropdown) - Visible only on small screens -->
    <div class="md:hidden p-4 bg-white border-b border-slate-200 sticky top-0 z-20 w-full">
        <label for="doc-select" class="block text-sm font-medium text-slate-700 mb-2">Select Documentation</label>
        <div class="relative">
            <select
                id="doc-select"
                on:change={handleMobileSelect}
                class="block w-full rounded-lg border-slate-300 bg-slate-50 py-3 pl-4 pr-10 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm shadow-sm appearance-none border"
            >
                {#each data.docs as doc}
                    <option value={doc.filename} selected={selectedDoc?.filename === doc.filename}>
                        {doc.title}
                    </option>
                {/each}
            </select>
            <!-- Custom Arrow Icon -->
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>

    <!-- Desktop Sidebar (List) - Hidden on mobile, visible on medium+ screens -->
    <aside class="hidden md:block w-72 bg-white border-r border-slate-200 flex-none h-screen sticky top-0 overflow-y-auto">
        <div class="p-6">
            <h2 class="text-xl font-bold text-slate-800 mb-6 px-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Docs
            </h2>

            <nav class="space-y-1">
                {#each data.docs as doc}
                    <button
                        on:click={() => selectDoc(doc)}
                        class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between group
                        {selectedDoc?.filename === doc.filename
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
                    >
                        <span>{doc.title}</span>
                        {#if selectedDoc?.filename === doc.filename}
                            <div class="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        {/if}
                    </button>
                {/each}
            </nav>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-4 md:p-10 w-full min-w-0 overflow-x-hidden">
        {#if selectedDoc}
            <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-100 p-4 md:p-12 overflow-hidden">
                <!-- Document Title Header -->
                <div class="border-b border-slate-100 pb-6 mb-8">
                    <h1 class="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight break-words">{selectedDoc.title}</h1>
                    <div class="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <span class="bg-slate-100 px-2 py-1 rounded text-xs font-mono break-all">{selectedDoc.filename}</span>
                    </div>
                </div>

                <!-- Markdown Content Wrapper -->
                <div class="w-full break-words">
                    <article class="prose prose-slate prose-sm md:prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-slate-800
                        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-pre:bg-slate-900 prose-pre:shadow-lg prose-pre:rounded-xl
                        prose-pre:whitespace-pre-wrap prose-pre:break-all
                        prose-code:break-all
                        prose-img:rounded-xl prose-img:shadow-md prose-img:max-w-full
                        prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic">
                        {@html selectedDoc.content}
                    </article>
                </div>
            </div>
        {:else}
            <div class="flex flex-col items-center justify-center h-[60vh] text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p class="text-lg font-medium">Select a document to view</p>
            </div>
        {/if}
    </main>
</div>

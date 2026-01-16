<script lang="ts">
    export let data;

    let selectedDoc = data.docs[0] || null;

    function selectDoc(doc: any) {
        selectedDoc = doc;
    }
</script>

<style>
    .prose code {
        @apply bg-slate-100 text-pink-600 px-1 py-0.5 rounded text-sm font-mono;
    }
</style>

<div class="flex flex-col md:flex-row min-h-screen bg-slate-50">

    <!-- Sidebar (Navigation) -->
    <aside class="w-full md:w-72 bg-white border-r border-slate-200 flex-none">
        <div class="p-6 sticky top-0">
            <h2 class="text-xl font-bold text-slate-800 mb-6 px-2">Documentation</h2>

            <nav class="space-y-1">
                {#each data.docs as doc}
                    <button
                        on:click={() => selectDoc(doc)}
                        class="w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                        {selectedDoc?.filename === doc.filename
                            ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}"
                    >
                        {doc.title}
                    </button>
                {/each}
            </nav>
        </div>
    </aside>

    <!-- Main Content Area -->
    <main class="flex-1 p-4 md:p-10 overflow-y-auto">
        {#if selectedDoc}
            <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12">
                <!-- Document Title Header -->
                <div class="border-b border-slate-100 pb-6 mb-8">
                    <h1 class="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">{selectedDoc.title}</h1>
                    <p class="text-slate-500 mt-2 text-sm">File: {selectedDoc.filename}</p>
                </div>

                <!-- Markdown Content -->
                <article class="prose prose-slate prose-lg max-w-none
                    prose-headings:font-bold prose-headings:text-slate-800
                    prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                    prose-pre:bg-slate-900 prose-pre:shadow-lg prose-pre:rounded-xl
                    prose-img:rounded-xl prose-img:shadow-md">
                    {@html selectedDoc.content}
                </article>
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

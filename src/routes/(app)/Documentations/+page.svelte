<script lang="ts">
    export let data;

    let selectedDoc = data.docs[0] || null;
    let isMobileMenuOpen = false;

    function selectDoc(doc: any) {
        selectedDoc = doc;
        isMobileMenuOpen = false; // Close menu on selection
    }

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
    }
</script>

<div class="flex flex-col md:flex-row min-h-screen bg-slate-50 relative overflow-x-hidden w-full">

    <!-- Mobile Header Bar -->
    <div class="md:hidden bg-white border-b border-slate-200 p-4 flex items-center justify-between sticky top-0 z-20 w-full">
        <h2 class="font-bold text-slate-800">Documentation</h2>
        <button
            on:click={toggleMobileMenu}
            class="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 focus:outline-none"
        >
            {#if isMobileMenuOpen}
                <!-- Close Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            {:else}
                <!-- Menu Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            {/if}
        </button>
    </div>

    <!-- Sidebar Navigation -->
    <aside class="
        fixed inset-0 z-10 bg-white md:static md:z-0
        transform transition-transform duration-300 ease-in-out
        {isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        w-64 md:w-72 border-r border-slate-200 flex-none h-screen overflow-y-auto
    ">
        <div class="p-6 pt-20 md:pt-6">
            <h2 class="hidden md:flex text-xl font-bold text-slate-800 mb-6 px-2 items-center gap-2">
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

    <!-- Overlay for mobile when menu is open -->
    {#if isMobileMenuOpen}
        <div
            class="fixed inset-0 bg-black/50 z-0 md:hidden"
            on:click={toggleMobileMenu}
        ></div>
    {/if}

    <!-- Main Content Area -->
    <main class="flex-1 p-4 md:p-10 w-full min-w-0 overflow-x-hidden">
        {#if selectedDoc}
            <div class="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-12 overflow-hidden">
                <!-- Document Title Header -->
                <div class="border-b border-slate-100 pb-6 mb-8">
                    <h1 class="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight break-words">{selectedDoc.title}</h1>
                    <div class="mt-3 flex items-center gap-2 text-sm text-slate-500">
                        <span class="bg-slate-100 px-2 py-1 rounded text-xs font-mono break-all">{selectedDoc.filename}</span>
                    </div>
                </div>

                <!-- Markdown Content Wrapper -->
                <div class="w-full">
                    <article class="prose prose-slate prose-sm md:prose-lg max-w-none
                        prose-headings:font-bold prose-headings:text-slate-800
                        prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                        prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                        prose-pre:bg-slate-900 prose-pre:shadow-lg prose-pre:rounded-xl
                        prose-pre:whitespace-pre-wrap prose-pre:break-words
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

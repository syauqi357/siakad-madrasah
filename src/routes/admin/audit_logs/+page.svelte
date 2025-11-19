<script>
</script>

<div class="w-full sm:w-3xl md:w-5xl">
	<!-- header -->
	<div
		class="w-full flex-col items-center gap-3 rounded-2xl p-4 transition-all ease-in-out sm:flex sm:flex-row"
	>
		<h1 class="text-xl font-semibold tracking-wide capitalize sm:text-3xl">audit log</h1>
		<!-- feature sorter -->
		<div class=" flex items-center gap-3 p-3">
			<!-- put logic right here -->
			<button
				class="rounded-md bg-purple-500 p-2 pr-3 pl-3 text-xs text-purple-100 outline-2 outline-offset-0 outline-purple-700 transition-all duration-150 ease-in-out outline-solid hover:bg-purple-800 hover:outline-offset-2 sm:text-sm"
			>
				this will be a button
			</button>
			<p>this is a paragraph</p>
			<div class="w-full max-w-sm min-w-[200px]">
				<div class="relative">
					<input
						id="searchLogs"
						class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm text-slate-700 shadow-xs transition duration-300 placeholder:text-slate-600 hover:border-slate-300 focus:border-slate-600 focus:shadow focus:outline-none"
					/>
					<label
						for="searchLogs"
						class="absolute top-2.5 left-2.5 origin-left transform cursor-text bg-white px-1 text-sm text-slate-400 capitalize transition-all peer-focus:-top-2 peer-focus:left-2.5 peer-focus:scale-90 peer-focus:text-xs peer-focus:text-slate-400"
					>
						cari log aktifitas
					</label>
				</div>
			</div>
		</div>
	</div>

	<!-- body of the table -->
	<div class="relative mt-2 overflow-x-auto rounded-lg border-slate-500 shadow-xs">
		<table class="text-body w-full text-left text-sm rtl:text-right">
			<thead
				class="border-default bg-slate-600 text-sm text-slate-50 duration-150 ease-in-out hover:bg-slate-500"
			>
				<tr class="text-xs capitalize">
					<th scope="col" class="px-6 py-3 font-medium"> users </th>
					<th scope="col" class="px-6 py-3 font-medium"> action </th>
					<th scope="col" class="px-6 py-3 font-medium"> Category </th>
					<th scope="col" class="px-6 py-3 font-medium"> status </th>
					<th scope="col" class="px-6 py-3 font-medium"> timestamp </th>
				</tr>
			</thead>
			<tbody class="text-xs">
				<!-- put logic right here -->
				<!-- loop through here -->
				<tr
					class="border-default bg-slate-100 transition-all duration-150 ease-in-out hover:bg-slate-200"
				>
					<th scope="row" class="text-heading px-6 py-4 font-medium whitespace-nowrap">
						admin
						<!-- this will be {auditLogs.user.name} -->
					</th>
					<td class="px-6 py-4">
						change siswa
						<!-- this will be {auditLogs.action} -->
					</td>
					<td class="px-6 py-4">
						amir elamiri
						<!-- this will be {auditLogs.category} -->
					</td>
					<td class="px-6 py-4">
						<span class="rounded-md border-2 border-blue-400 bg-blue-300 p-1 pr-2 pl-2">
							<!-- this will be {auditLogs.status} -->
							changed
						</span>
					</td>
					<td class="px-6 py-4 uppercase">
						2 may 2026 12:00 AM
						<!-- this will be {auditLogs.timestamp} -->
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>

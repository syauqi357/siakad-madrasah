<script lang="ts">
	/**
	 *
	 *
	 *
	 * */
</script>

<div class="w-full max-w-md space-y-8 rounded-xl border border-gray-300 bg-white p-5">
	<header class="text-left">
		<h2 class="text-3xl font-extrabold text-gray-900 capitalize">Mata Pelajaran</h2>
		<p class="mt-2 text-sm text-gray-600">Isi formulir mata pelajaran di bawah ini</p>
	</header>

	<form class="mt-8 space-y-6">
		<div class="space-y-5">
			<!-- Subject Name -->
			<div class="relative w-full">
				<input
					type="text"
					id="subjectName"
					name="subjectName"
					placeholder=" "
					class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
					required
				/>
				<label
					for="subjectName"
					class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
				>
					Nama Mata Pelajaran
				</label>
			</div>

			<!-- Subject Code -->
			<div class="relative w-full">
				<input
					type="text"
					id="subjectCode"
					name="subjectCode"
					placeholder=" "
					class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
					required
				/>
				<label
					for="subjectCode"
					class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
				>
					Kode Mata Pelajaran
				</label>
			</div>

			<!-- Description / Syllabus -->
			<!--			<div class="relative w-full">-->
			<!--				<textarea-->
			<!--					id="description"-->
			<!--					name="description"-->
			<!--					rows="3"-->
			<!--					placeholder=" "-->
			<!--					class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"-->
			<!--				></textarea>-->
			<!--				<label-->
			<!--					for="description"-->
			<!--					class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100-->
			<!--                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm-->
			<!--                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500-->
			<!--                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"-->
			<!--				>-->
			<!--					Deskripsi / Silabus-->
			<!--				</label>-->
			<!--			</div>-->

			<!-- Assigned Teacher -->
			<div class="relative w-full">
				<select
					id="teacher"
					name="teacher"
					class="peer ease w-full appearance-none rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
					required
				>
					<option value="" disabled selected></option>
					<option value="john_doe">John Doe</option>
					<option value="jane_smith">Jane Smith</option>
					<option value="mike_jones">Mike Jones</option>
				</select>
				<label
					for="teacher"
					class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
				>
					Guru Pengampu
				</label>
				<!-- Custom Arrow for Select -->
				<div
					class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500"
				>
					<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"
						/></svg
					>
				</div>
			</div>

			<!-- Credit (SKS) -->
			<div class="relative w-full">
				<input
					type="number"
					id="KKMCredits"
					name="KKMCredits"
					min="0"
					max="10"
					placeholder=" "
					class="peer ease w-full rounded-md border border-slate-200 bg-transparent px-3 py-3 text-sm text-slate-700 transition-all duration-100 hover:border-slate-300 focus:border-blue-500 focus:shadow focus:outline-none"
					required
				/>
				<label
					for="KKMCredits"
					class="absolute top-2.5 left-2.5 z-10 cursor-text bg-white px-1 text-sm text-slate-400 transition-all duration-100
                        peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm
                        peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-500
                        peer-[:not(:placeholder-shown)]:-top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:text-slate-400"
				>
					KKM
				</label>
			</div>
		</div>

		<div class="flex items-center justify-end gap-4 pt-4">
			<button
				type="button"
				class="rounded-md px-4 py-2 text-sm font-medium text-blue-600 transition-all ease-in-out hover:bg-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Batal
			</button>
			<button
				type="submit"
				class="rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all ease-in-out hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
			>
				Simpan
			</button>
		</div>
	</form>
</div>

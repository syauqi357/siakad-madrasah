<script lang="ts">
</script>

<!--

		- "Nama Mata Pelajaran" (Jawaban singkat)
		- "Kode Mata Pelajaran" (Jawaban singkat)
		- "Deskripsi/Silabus" (Paragraf)
		- "Guru Pengampu" (Pilihan ganda atau dropdown)
		- "SKS (Sistem Kredit Semester)" (Angka)

	-->

<div class="flex bg-gray-50 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<header class="text-left">
			<h2 class="mt-6 text-3xl font-extrabold text-gray-900 capitalize">mata pelajaran</h2>
			<p class="mt-2 text-sm text-gray-600">isi formulir mata pelajaran di bawah ini</p>
		</header>

		<form class="mt-8 space-y-6">
			<div class="space-y-4">
				<div>
					<label for="subjectName" class="block text-sm font-medium text-gray-700">
						Subject Name
					</label>
					<input
						id="subjectName"
						name="subjectName"
						type="text"
						required
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<div>
					<label for="subjectCode" class="block text-sm font-medium text-gray-700">
						Subject Code
					</label>
					<input
						id="subjectCode"
						name="subjectCode"
						type="text"
						required
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>

				<!--				<div>-->
				<!--					<label for="description" class="block text-sm font-medium text-gray-700">-->
				<!--						Description / Syllabus-->
				<!--					</label>-->
				<!--					<textarea-->
				<!--						id="description"-->
				<!--						name="description"-->
				<!--						rows="4"-->
				<!--						required-->
				<!--						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2  focus:border-blue-500 focus:ring-blue-500"-->
				<!--					></textarea>-->
				<!--				</div>-->

				<div>
					<label for="teacher" class="block text-sm font-medium text-gray-700">
						Assigned Teacher
					</label>
					<select
						id="teacher"
						name="teacher"
						required
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
					>
						<option value="">Select Teacher</option>
						<option value="john_doe">John Doe</option>
						<option value="jane_smith">Jane Smith</option>
						<option value="mike_jones">Mike Jones</option>
					</select>
				</div>

				<div>
					<label for="credit" class="block text-sm font-medium text-gray-700"> Credit (SKS) </label>
					<input
						id="credit"
						name="credit"
						type="number"
						min="0"
						max="10"
						required
						class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
					/>
				</div>
			</div>

			<div class="flex items-center justify-between gap-3">
				<button
					type="submit"
					class="text-md flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					Submit
				</button>
				<button
					type="submit"
					class="text-md flex w-full justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 font-bold text-blue-600 hover:bg-blue-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
				>
					cancel
				</button>
			</div>
		</form>
	</div>
</div>

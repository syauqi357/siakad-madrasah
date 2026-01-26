<script>
</script>

<div
	class="w-85 rounded-2xl border border-slate-500 bg-slate-800 p-4 text-white shadow-lg shadow-slate-500 transition-all ease-in-out"
>
	<!--main information-->
	<main class="flex w-full items-center justify-center gap-3">
		<div
			id="iconAlert"
			class="flex aspect-square w-1/2 items-center justify-center rounded-full bg-emerald-700 text-emerald-300"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				height="24px"
				viewBox="0 0 24 24"
				width="24px"
				fill="currentColor"
				><path d="M0 0h24v24H0V0z" fill="none" /><path
					d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.29 16.29 5.7 12.7c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0z"
				/></svg
			>
		</div>
		<div id="contentAlert">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laborum.</div>
		<!--		close button-->
		<button
			id="closeAlert"
			class="flex aspect-square w-20 items-center justify-center rounded-full transition-all ease-in-out hover:bg-gray-700"
		>
			&#10006;
		</button>
	</main>
	<!-- action	-->
	<div
		id="buttonActionalertParent"
		class="mt-4 flex w-full flex-row-reverse items-center justify-center gap-2"
	>
		<button
			id="cancelButton"
			class=" w-full rounded-md py-2 capitalize transition-all ease-in-out hover:bg-gray-700 hover:text-red-400"
			>cancel</button
		>
		<button
			id="agreeButton"
			class="w-full rounded-md bg-emerald-900 py-2 text-emerald-400 capitalize transition-all ease-in-out hover:shadow-lg hover:shadow-emerald-600"
			>agree</button
		>
	</div>
</div>

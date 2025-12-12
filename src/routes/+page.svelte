<script lang="ts">
	// logic for turn out
</script>

<div class="min-h-screen">
	<!-- login board -->
	<div class="flex h-screen flex-col items-center justify-center gap-24 bg-[url(/src/lib/image/pattern-randomized.svg)] bg-cover bg-center">
		<div class="flex h-fit w-full flex-col items-center justify-center">
			<div class=" mb-21 flex sm:w-4xl flex-col items-center gap-3 w-full">
				<h1 class="text-transparent text-center text-4xl sm:text-6xl/21 font-bold tracking-wide capitalize bg-radial-[at_60%_85%] from-cyan-500 to-blue-800 bg-clip-text">
					selamat datang di platform akademik madrasah!
				</h1>
				<h3 class="text-lg sm:text-2xl capitalize bg-radial-[at_60%_85%] from-emerald-600 to-cyan-700 bg-clip-text text-transparent">jaga data dan banyak hal!</h3>
			</div>
			<div class="flex items-center justify-center gap-3">
				<a href="/login">
					<button
						class="flex flex-row-reverse items-center justify-center gap-2 sm:rounded-xl rounded-lg bg-blue-500 sm:p-3 sm:pr-6 sm:pl-6 p-2 pl-4 pr-4 text-md sm:text-lg text-white capitalize transition-all duration-200 ease-in-out hover:bg-blue-700"
					>
						<span class="h-6 w-6">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								id="Arrow-Right-Up-Line--Streamline-Mingcute"
								height="24"
								width="24"
							>
								<desc> Arrow Right Up Line Streamline Icon: https://streamlinehq.com </desc>
								<g fill="none" fill-rule="nonzero">
									<path
										d="M24 0v24H0V0h24ZM12.594 23.258l-0.012 0.002 -0.071 0.035 -0.02 0.004 -0.014 -0.004 -0.071 -0.035c-0.01 -0.004 -0.019 -0.001 -0.024 0.005l-0.004 0.01 -0.017 0.428 0.005 0.02 0.01 0.013 0.105 0.074 0.014 0.004 0.012 -0.004 0.104 -0.074 0.012 -0.016 0.004 -0.017 -0.017 -0.427c-0.002 -0.01 -0.009 -0.017 -0.016 -0.018Zm0.264 -0.113 -0.013 0.002 -0.185 0.093 -0.01 0.01 -0.003 0.011 0.018 0.43 0.005 0.012 0.008 0.008 0.201 0.092c0.012 0.004 0.023 0 0.029 -0.008l0.004 -0.014 -0.034 -0.614c-0.003 -0.012 -0.01 -0.02 -0.02 -0.022Zm-0.715 0.002a0.023 0.023 0 0 0 -0.027 0.006l-0.006 0.014 -0.034 0.614c0 0.012 0.007 0.02 0.017 0.024l0.015 -0.002 0.201 -0.092 0.01 -0.009 0.004 -0.011 0.017 -0.43 -0.003 -0.012 -0.01 -0.01 -0.184 -0.092Z"
										stroke-width="1"
									></path>
									<path
										fill="currentColor"
										d="M18 5a1 1 0 0 1 1 1v8a1 1 0 1 1 -2 0V8.414l-9.95 9.95a1 1 0 0 1 -1.414 -1.414L15.586 7H10a1 1 0 1 1 0 -2h8Z"
										stroke-width="1"
									></path>
								</g>
							</svg>
						</span>
						<!-- login -->
						masuk
					</button>
				</a>

				<!-- contribute in another version -->
				<a href="https://github.com/syauqi357" aria-labelledby="contribute">
					<button
						class="text-sm sm:text-md text-bold flex items-center justify-center gap-2 sm:rounded-xl rounded-lg border ring-2 ring-blue-700 bg-slate-200 sm:p-3 sm:pr-6 sm:pl-6 p-2 pr-4 pl-4 text-slate-600 transition-all ease-in-out duration-300 hover:drop-shadow-lg drop-shadow-blue-500 "
					>
						<span class="h-6 w-6">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								id="Github--Streamline-Unicons"
								height="24"
								width="24"
							>
								<path
									d="M11.9999 0.5302c-2.7924 0.0001 -5.4937 0.9939 -7.6204 2.8034C2.2527 5.1431 0.8392 7.6504 0.3919 10.4068c-0.4473 2.7563 0.1008 5.5819 1.5462 7.9712 1.4453 2.3891 3.6937 4.1861 6.3428 5.0693 0.588 0.1029 0.8085 -0.2499 0.8085 -0.5586 0 -0.2793 -0.0147 -1.2054 -0.0147 -2.1903 -2.9547 0.5439 -3.7191 -0.7202 -3.9543 -1.3817 -0.261 -0.6433 -0.6747 -1.2134 -1.2054 -1.6611 -0.4116 -0.2205 -0.9996 -0.7644 -0.0147 -0.7791 0.3761 0.0408 0.7367 0.1717 1.0515 0.3815 0.3147 0.2098 0.5743 0.4925 0.7566 0.8239 0.1608 0.2889 0.3771 0.5433 0.6364 0.7485 0.2593 0.2052 0.5566 0.3573 0.8748 0.4473 0.3182 0.0901 0.651 0.1166 0.9794 0.0779s0.646 -0.1418 0.9344 -0.3035c0.0509 -0.5979 0.3174 -1.1569 0.7498 -1.5729 -2.6166 -0.294 -5.3508 -1.3083 -5.3508 -5.8065 -0.0165 -1.1687 0.4147 -2.2995 1.2054 -3.1604 -0.3595 -1.0158 -0.3175 -2.1306 0.1176 -3.1164 0 0 0.9848 -0.3087 3.234 1.2054 1.9242 -0.5292 3.9556 -0.5292 5.8799 0 2.2491 -1.5288 3.234 -1.2054 3.234 -1.2054 0.4351 0.9858 0.4772 2.1006 0.1176 3.1164 0.7929 0.8594 1.2247 1.9913 1.2054 3.1604 0 4.5129 -2.7489 5.5125 -5.3655 5.8065 0.2806 0.2844 0.4967 0.626 0.6337 1.0013 0.137 0.3755 0.1916 0.776 0.1601 1.1743 0 1.573 -0.0147 2.837 -0.0147 3.2339 0 0.3087 0.2205 0.6762 0.8085 0.5586 2.6444 -0.8903 4.8863 -2.6915 6.3255 -5.0819 1.4393 -2.3905 1.9821 -5.2147 1.5317 -7.9684 -0.4504 -2.7536 -1.8647 -5.2576 -3.9906 -7.0649C17.4892 1.5247 14.7902 0.5317 11.9999 0.5302Z"
									fill="currentColor"
									stroke-width="1"
								></path>
							</svg>
						</span> let's contribute!
					</button>
				</a>
			</div>
		</div>

		<div>
			<table>
				<thead>
					<tr>
						<td>1</td>
						<td>2</td>
						<td>3</td>
						<td>4</td>
					</tr>
				</thead>
			</table>
		</div>
	</div>
</div>

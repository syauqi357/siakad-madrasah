<script lang="ts">
	import { onMount } from 'svelte';

	// time set src : https://stackoverflow.com/questions/72873435/i-have-code-to-get-date-and-time-then-display-it-but-how-do-i-make-it-refresh-it
	// d as date : debt refactor
	const dtpFormat = new Date();

	// date/ month/ year
	let date = dtpFormat.getDate();
	// generative Ai code by claude haiku 4.5
	// found source modify : https://svelte.dev/playground/836cad327fa04658b9f3afbf992aae0c?version=5.46.0#H4sIAAAAAAAACo1WbY7bNhC9yixrIDKgWt1-AIVW3jZoggZBiqJJgPxYLbC0NLYYU6RAjtZWBR0mZ-gBCiQXK0hKXm-8TfaHbWk08_jm443cM8VrZCl7c4uSEP5qRbGFt6JJ4WlZCrWBFbeiAKEIjeIktOJS_O0vIBLnP6s5kIZOt8CbhsVsLSRall71jLrGATsDi6djnjbNwvqjWMxW3OJD9kIrQkWWpSyzhRENXeYKQNSNNgQ9UAxSF1zi9GthgLXRNeRskThSObvIVU7ukyTwm0FOCHz0BttgIdaiABI1WuJ14-Bnqb-HJSjcwTNOGM0XpF_5GHf7hoxQm2g2nd27KIAd4rbkXQo5k1ptchYHe4fcOKNqazSiONhrrag68R4R7jsP84tcZcmhBrnKai6Ur0bWXIbIzKLEgmAlVJnectnish85DqMLQP8N8qI6lItbkMP0DCDTjW_oGC2Hy14OWRKsdxiJwxjDsiQcG7gkjWcHkFXnl_2MopxVusaGb3BBgiTmbD6cZUl1PnHvf62olnDfdYey0DXmLIYe3GS4krzkCuGZxpzB4EGaL2K4HgYA3827kCwZa5erzFIn0cM429TJmu-_3YnSdef7Hw3WF5PZbIRK4QeDNfCW9GhvuFdICt_B-eKnyX_wHRvxWcwI98RSMi0O8f-Iwk3s4r29r4g745EcDhIo0YhbLGPYGUF8JfFOAUFGiSVt0OtgDCLDlZVeufZOLcfWoBqFe-9faGVpkszycFCUM1Q5c5P5gKOFJfy5eo8FLbbY2egYfu7R160q_LBNjzCaBLXFLoZbbuw8dCRJ4BXSEwtUGb0Dq2sENEYbC2INO3xiEMh0bkuRhtaiQ7DJxIQqTlBq9YQA98LSYsR8h1DoVpZuoRh9i0CVsLDqoLUO6m3XYFAccFUm2sCaS7nixTbow3ocsYbobIvdfCTndsZzxy3KmdKOCDhwUWLpyM0omoeijaGB5Gn0jdLHnYK1Nh4sZ7N-i92Qs5tQR5_K74avgCq8H-J6-5nRgg5dcYESCdxYwvKey1XgdH21xe56PMNzdb6PYdqq0vOd9eP6WQTOx4xfYyN5gcBVBw23FksQbvEY4YbLupvP87F-73rmx6PlB2VR8yaKtnNYXk4qDuNocIP7cZe_xs3zfRPd9P2s3w7DcBNDzjZTO-BQC9zTwgR-kY8P03i1vQ6ew5SHQWqN8gEXuRpOROPQRoUehnt6b3iq0WHUYQn94GwO904Ss1NN5Mod_7iNctzWk81y-vBow4x5lLjmraRQU1TpVNzTve5W9AuUUsfwThtZnh1eaQ8tdu8tILNktNpc9r3jNAxuY3pDDJXeATfo_lL88hBU2O8O522FULTGoKKw64VNoe_d5TBMb1D_jfYrCXz88EJLDn-0qtSPSEBLHn8ph4__Fp_-qTWgpU8f7FfSeMWh0oYDL6jlMnA9TWI46f11zIgLuROqZOmaS4vDfws4A-fOCQAA
	let month = dtpFormat.toLocaleString('id-ID', { month: 'long' });
	let year = dtpFormat.getFullYear();

	// api variable
	const apiUrl = import.meta.env.VITE_API_URL;

	// Define a type for our school data for better type-safety.
	type SchoolData = {
		name: string;
		npsn: string;
		nsm: string;
		kota: string;
      alamat:string;
		logoUrl: string;
	};

	// Declare reactive variables
	let schoolData: SchoolData | null = null;
	let loading = true;
	let error = false;

	onMount(async () => {
		try {
			// endpoint app.js
			// docs : pending

			const response = await fetch(`${apiUrl}/routes/api/schoolData`);
			//get API from backend using express from localhost:3000/api/schoolAdministrativeData and this is taking a variable const on the file

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			// fetch data dari appjs endpoint server
			const fetchedData = await response.json();

			// sukses ambil data dari appjs endpoint server
			schoolData = {
				name: fetchedData.name,
				kota: fetchedData.kota,
				npsn: fetchedData.npsn,
            alamat: fetchedData.alamat,
				nsm: fetchedData.nsm,
				logoUrl: fetchedData.logoUrl ? `${apiUrl}/${fetchedData.logoUrl}` : ''
			};

			loading = false;
		} catch (err) {
			console.error('Failed to fetch school data:', err);
			error = true;
			loading = false;

			// Fallback data
			// schoolAdministrativeData = {
			// 	name: 'MTs. Persis 2 Bangil',
			// 	npsn: '231698134',
			// 	logoUrl: logo
			// };
		}
	});
</script>

<div>
	<!-- navigation bar -->
	<div class="mb-8 flex bg-slate-200 p-4">
		<button
			class="bg-blue-600 p-3 pr-6 pl-6 text-slate-50 print:hidden"
			on:click={() => window.print()}
		>
			Print Me
		</button>
	</div>
	<div class="flex flex-col gap-3" id="printLembaga">
		<h2 class="text-2xl font-semibold tracking-wide capitalize">kelembagaan</h2>
		<!-- divider -->
		{#if loading}
			<p>Loading...</p>
		{:else if error}
			<p class="text-red-500">Error loading data</p>
		{:else if schoolData}
			<hr class="h-0.5 w-full bg-slate-900" />
			<div class="mb-3 flex justify-end capitalize">
				<h3>{schoolData.kota}, {date}, {month} {year}</h3>
			</div>
			<div class="flex flex-col gap-4 p-3">
				<!-- image -->
				<div class="h-20 w-20 bg-blue-700">
					<img src={schoolData.logoUrl} alt="school logo" srcset="" />
				</div>
				<!-- nama sekolah -->
				<div class="flex justify-between">
					<div class="flex flex-col gap-2">
						<h3>nama sekolah :</h3>
						<p class="font-semibold">{schoolData.name}</p>
					</div>
					<!-- npsn -->
					<div class="flex flex-col gap-2">
						<div>
							<h3>NPSN :</h3>
							<p class="font-semibold">{schoolData.npsn}</p>
						</div>
						<div>
							<h3>NSM :</h3>
							<p class="font-semibold">{schoolData.nsm}</p>
						</div>
					</div>
				</div>
            
            <!-- alamat -->
         
               <div class="flex justify-between">
                  <div class="flex flex-col gap-2">
                     <h3 class="capitalize">alamat sekolah :</h3>
                     <p class="font-semibold">{schoolData.alamat}</p>
                  </div>
                  <!-- npsn -->
                  <!-- <div class="flex flex-col gap-2">
                     <div>
                        <h3>NPSN :</h3>
                        <p class="font-semibold">{schoolAdministrativeData.npsn}</p>
                     </div>
                     <div>
                        <h3>NSM :</h3>
                        <p class="font-semibold">{schoolAdministrativeData.nsm}</p>
                     </div>
                  </div> -->
               </div>

         
			</div>
		{/if}
	</div>
</div>

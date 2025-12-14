<script lang="ts">
	const apiUrl = import.meta.env.VITE_API_URL;

	async function fetchFacilities() {
		try {
			const response = await fetch(`${apiUrl}/routes/api/schoolData`);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const fetchedData = await response.json();

			// Return merged data with defaults
			return {
				aset: fetchedData.aset || [],
				asrama: fetchedData.asrama || [],
				canteen: fetchedData.canteen || [],
				// ... etc
				lab: {
					lab_Ipa: fetchedData.lab?.lab_Ipa || [],
					lab_komputer: fetchedData.lab?.lab_komputer || [],
					lab_multimedia: fetchedData.lab?.lab_multimedia || []
				},
				// Add other facility types here with defaults
				certification: fetchedData.certification || [],
				gedung: fetchedData.gedung || [],
				kamar_mandi: fetchedData.kamar_mandi || [],
				kantor: fetchedData.kantor || [],
				kelas: fetchedData.kelas || [],
				lapangan: fetchedData.lapangan || [],
				masjid: fetchedData.masjid || [],
				parking_lot: fetchedData.parking_lot || []
			};
		} catch (error) {
			console.error('Failed to fetch facilities:', error);
			throw error; // Re-throw to be caught by the await block
		}
	}

	const facilitiesPromise = fetchFacilities();
</script>

{#await facilitiesPromise}
	<p>Loading facilities...</p>
{:then facilities}
	<!-- Display all facility images -->

	<div class="space-x-6 flex">
		<!-- Example: Display canteen images -->
		{#if facilities.canteen.length > 0}
			<div class="image-grid">
				<label for="canteen-image">foto kantin:</label>
				{#each facilities.canteen as image, index}
					<img
						src="{apiUrl}{image}"
						alt="Canteen {index + 1}"
						class="h-34 w-64 rounded-lg object-cover"
					id="canteen-image" />
				{/each}
			</div>
		{:else}
			<p>No canteen images available</p>
		{/if}

		<!-- Or access specific indices safely -->
		<!-- {#if facilities.lab.lab_komputer[0]}
		<img src="{apiUrl}{facilities.lab.lab_komputer[0]}" alt="Lab Komputer" />
	{/if} -->
		<!-- Or access specific indices safely -->
		{#if facilities.lab.lab_komputer[0]}
			<img
				src="{apiUrl}{facilities.lab.lab_komputer[0]}"
				alt="Lab Komputer"
				class="h-34 w-64 rounded-lg object-cover"
			/>
		{/if}
	</div>
{:catch error}
	<p style="color: red">Error loading facilities: {error.message}</p>
{/await}

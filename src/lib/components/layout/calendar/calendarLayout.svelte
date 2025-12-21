<script lang="ts">
	import { onMount } from 'svelte';

	let currentDate = new Date();
	let currentMonth = currentDate.getMonth();
	let currentYear = currentDate.getFullYear();
	let today = new Date();

	const months = [
		'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
		'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
	];

	const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

	interface CalendarDay {
		day: number;
		isCurrentMonth: boolean;
		isToday: boolean;
		date: Date;
	}

	let calendarDays: CalendarDay[] = [];

	function generateCalendar(month: number, year: number) {
		calendarDays = [];

		// First day of the month
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);

		// Get day of week (0 = Sunday, 1 = Monday, etc.)
		const firstDayOfWeek = firstDay.getDay();
		const totalDays = lastDay.getDate();

		// Previous month's days
		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = firstDayOfWeek - 1; i >= 0; i--) {
			const day = prevMonthLastDay - i;
			calendarDays.push({
				day,
				isCurrentMonth: false,
				isToday: false,
				date: new Date(year, month - 1, day)
			});
		}

		// Current month's days
		for (let day = 1; day <= totalDays; day++) {
			const date = new Date(year, month, day);
			const isToday =
				day === today.getDate() &&
				month === today.getMonth() &&
				year === today.getFullYear();

			calendarDays.push({
				day,
				isCurrentMonth: true,
				isToday,
				date
			});
		}

		// Next month's days to fill the grid
		const remainingDays = 42 - calendarDays.length; // 6 rows * 7 days
		for (let day = 1; day <= remainingDays; day++) {
			calendarDays.push({
				day,
				isCurrentMonth: false,
				isToday: false,
				date: new Date(year, month + 1, day)
			});
		}
	}

	function previousMonth() {
		currentMonth--;
		if (currentMonth < 0) {
			currentMonth = 11;
			currentYear--;
		}
		generateCalendar(currentMonth, currentYear);
	}

	function nextMonth() {
		currentMonth++;
		if (currentMonth > 11) {
			currentMonth = 0;
			currentYear++;
		}
		generateCalendar(currentMonth, currentYear);
	}

	function goToToday() {
		currentMonth = today.getMonth();
		currentYear = today.getFullYear();
		generateCalendar(currentMonth, currentYear);
	}

	onMount(() => {
		generateCalendar(currentMonth, currentYear);
	});
</script>

<div class="w-full max-w-md mx-auto p-4 border border-gray-300 rounded-lg bg-white">
	<!-- Header -->
	<div class="flex items-center justify-between mb-4">
		<h2 class="text-lg font-semibold">
			{months[currentMonth]} {currentYear}
		</h2>
		<div class="flex gap-2">
			<button
				on:click={previousMonth}
				class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
			>
				←
			</button>
			<button
				on:click={goToToday}
				class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors text-sm"
			>
				Hari Ini
			</button>
			<button
				on:click={nextMonth}
				class="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
			>
				→
			</button>
		</div>
	</div>

	<!-- Days of week -->
	<div class="grid grid-cols-7 gap-1 mb-2">
		{#each daysOfWeek as day}
			<div class="text-center text-sm font-medium text-gray-600 py-2">
				{day}
			</div>
		{/each}
	</div>

	<!-- Calendar grid -->
	<div class="grid grid-cols-7 gap-1">
		{#each calendarDays as { day, isCurrentMonth, isToday }}
			<div
				class="aspect-square flex items-center justify-center text-sm rounded transition-colors
					{isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
					{isToday ? 'bg-slate-700 text-white font-bold' : 'hover:bg-gray-100'}
					cursor-pointer"
			>
				{day}
			</div>
		{/each}
	</div>
</div>
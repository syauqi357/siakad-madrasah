<script lang="ts">
	import { onMount } from 'svelte';

	let currentDate = new Date();
	let currentMonth = currentDate.getMonth();
	let currentYear = currentDate.getFullYear();
	let today = new Date();

	const months = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];

	const daysOfWeek = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

	interface CalendarDay {
		day: number;
		isCurrentMonth: boolean;
		isToday: boolean;
		isWeekend: boolean;
		date: Date;
	}

	let calendarDays: CalendarDay[] = [];

	function generateCalendar(month: number, year: number) {
		calendarDays = [];

		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const firstDayOfWeek = firstDay.getDay();
		const totalDays = lastDay.getDate();

		// Previous month's days
		const prevMonthLastDay = new Date(year, month, 0).getDate();
		for (let i = firstDayOfWeek - 1; i >= 0; i--) {
			const day = prevMonthLastDay - i;
			const date = new Date(year, month - 1, day);
			calendarDays.push({
				day,
				isCurrentMonth: false,
				isToday: false,
				isWeekend: date.getDay() === 0 || date.getDay() === 6,
				date
			});
		}

		// Current month's days
		for (let day = 1; day <= totalDays; day++) {
			const date = new Date(year, month, day);
			const isToday =
				day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

			calendarDays.push({
				day,
				isCurrentMonth: true,
				isToday,
				isWeekend: date.getDay() === 0 || date.getDay() === 6,
				date
			});
		}

		// Next month's days
		const remainingDays = 42 - calendarDays.length;
		for (let day = 1; day <= remainingDays; day++) {
			const date = new Date(year, month + 1, day);
			calendarDays.push({
				day,
				isCurrentMonth: false,
				isToday: false,
				isWeekend: date.getDay() === 0 || date.getDay() === 6,
				date
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

<div class="w-full rounded-lg border border-slate-200 bg-white">
	<!-- Header -->
	<div class="flex items-center justify-between border-b border-slate-100 px-4 py-3">
		<div>
			<h2 class="text-base font-semibold text-slate-800">
				{months[currentMonth]}
			</h2>
			<p class="text-xs text-slate-400">{currentYear}</p>
		</div>
		<div class="flex items-center gap-1">
			<button
				on:click={previousMonth}
				class="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
				aria-label="Previous month"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15 19l-7-7 7-7"
					/>
				</svg>
			</button>
			<button
				on:click={goToToday}
				class="rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
			>
				Hari Ini
			</button>
			<button
				on:click={nextMonth}
				class="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
				aria-label="Next month"
			>
				<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		</div>
	</div>

	<div class="p-3">
		<!-- Days of week -->
		<div class="mb-1 grid grid-cols-7">
			{#each daysOfWeek as day, i}
				<div
					class="py-2 text-center text-xs font-medium"
					class:text-red-400={i === 0}
					class:text-slate-400={i !== 0}
				>
					{day}
				</div>
			{/each}
		</div>

		<!-- Calendar grid -->
		<div class="grid grid-cols-7 gap-0.5">
			{#each calendarDays as { day, isCurrentMonth, isToday, isWeekend }}
				<button
					class="relative flex aspect-square items-center justify-center rounded-md text-sm transition-colors
						{isToday
						? 'bg-slate-800 font-semibold text-white'
						: isCurrentMonth
							? isWeekend
								? 'text-red-400 hover:bg-slate-50'
								: 'text-slate-700 hover:bg-slate-50'
							: 'text-slate-300'}"
				>
					{day}
					{#if isToday}
						<span class="absolute bottom-1 h-1 w-1 rounded-full bg-white"></span>
					{/if}
				</button>
			{/each}
		</div>
	</div>
</div>

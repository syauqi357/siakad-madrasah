<script>
	import { activeMenu } from '$lib/stores.js';

	$activeMenu = 'dashboard';
</script>

<div class="mx-auto max-w-7xl bg-slate-300">
	<div class="mb-6">
		<h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
		<p class="mt-2 text-gray-600">Welcome to SchoolSys Education Platform</p>
	</div>

	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
		<!-- Card 1 -->
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
					<span class="text-2xl">👨‍🎓</span>
				</div>
				<span class="text-sm font-medium text-green-600">+12%</span>
			</div>
			<h3 class="text-sm text-gray-600">Total Students</h3>
			<p class="mt-2 text-3xl font-bold text-gray-900">1,234</p>
		</div>

		<!-- Card 2 -->
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
					<span class="text-2xl">👩‍🏫</span>
				</div>
				<span class="text-sm font-medium text-green-600">+5%</span>
			</div>
			<h3 class="text-sm text-gray-600">Total Teachers</h3>
			<p class="mt-2 text-3xl font-bold text-gray-900">89</p>
		</div>

		<!-- Card 3 -->
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
					<span class="text-2xl">🏫</span>
				</div>
				<span class="text-sm font-medium text-gray-600">24 Active</span>
			</div>
			<h3 class="text-sm text-gray-600">Total Classes</h3>
			<p class="mt-2 text-3xl font-bold text-gray-900">32</p>
		</div>

		<!-- Card 4 -->
		<div class="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
			<div class="mb-4 flex items-center justify-between">
				<div class="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
					<span class="text-2xl">📈</span>
				</div>
				<span class="text-sm font-medium text-green-600">92%</span>
			</div>
			<h3 class="text-sm text-gray-600">Attendance Rate</h3>
			<p class="mt-2 text-3xl font-bold text-gray-900">92.5%</p>
		</div>
	</div>
</div>

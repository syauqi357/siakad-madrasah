<script>
  import { activeMenu } from '$lib/stores.js';
  
  $activeMenu = 'dashboard';
</script>

<div class="max-w-7xl mx-auto">
  <div class="mb-6">
    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
    <p class="text-gray-600 mt-2">Welcome to SchoolSys Education Platform</p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    <!-- Card 1 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">👨‍🎓</span>
        </div>
        <span class="text-green-600 text-sm font-medium">+12%</span>
      </div>
      <h3 class="text-gray-600 text-sm">Total Students</h3>
      <p class="text-3xl font-bold text-gray-900 mt-2">1,234</p>
    </div>

    <!-- Card 2 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">👩‍🏫</span>
        </div>
        <span class="text-green-600 text-sm font-medium">+5%</span>
      </div>
      <h3 class="text-gray-600 text-sm">Total Teachers</h3>
      <p class="text-3xl font-bold text-gray-900 mt-2">89</p>
    </div>

    <!-- Card 3 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">🏫</span>
        </div>
        <span class="text-gray-600 text-sm font-medium">24 Active</span>
      </div>
      <h3 class="text-gray-600 text-sm">Total Classes</h3>
      <p class="text-3xl font-bold text-gray-900 mt-2">32</p>
    </div>

    <!-- Card 4 -->
    <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
          <span class="text-2xl">📈</span>
        </div>
        <span class="text-green-600 text-sm font-medium">92%</span>
      </div>
      <h3 class="text-gray-600 text-sm">Attendance Rate</h3>
      <p class="text-3xl font-bold text-gray-900 mt-2">92.5%</p>
    </div>
  </div>
</div>
<template>
<div id="app">
  <header class="bg-gray-800">
    <div class="px-2">
      <div class="relative flex items-center justify-between h-16">
            <div class="flex space-x-4">
              <span class="bg-gray-500 text-white px-3 py-2 rounded-md text-sm font-medium">Spatial Game simulator</span>
            </div>
      </div>
    </div>
  </header>
  <router-view>
  </router-view>
</div>
</template>
<script>

export default {
  name: 'App',
  components: {}
}
</script>

<style>
</style>

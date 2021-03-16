<template>
  <nav class="bg-gray-800">
    <div class="px-2">
      <div class="relative flex items-center justify-between h-16">
            <div class="flex space-x-4">
              <router-link class="bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-medium" :to="{name : 'Home' }">Home</router-link>
              <router-link class="bg-blue-400 text-white px-3 py-2 rounded-md text-sm font-medium" :to="{name : 'About' }">About</router-link>
              <router-link class="bg-green-500 text-white px-3 py-2 rounded-md text-sm font-medium" :to="{name : 'Game' }">Game</router-link>
            </div>
      </div>
    </div>
  </nav>
  <router-view>
  </router-view>
</template>

<script>

export default {
  name: 'App',
  components: {
  }
}
</script>

<style>
</style>
